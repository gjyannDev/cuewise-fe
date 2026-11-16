import {
  EMPTY_RECORDING_MESSAGE,
  INTERVIEWER_SLOW_LABEL,
  MIC_REQUIRED_MESSAGE,
  RECORDING_LIMIT_MESSAGE,
  ROOM_STATUS_LABELS,
} from "../constants";
import type { RoomEffect, RoomEvent, RoomPhase, RoomState } from "../types/interviews.types";

/**
 * The interview room's whole turn flow, as one pure function: given what happened, the next state and the effects to
 * run (stop the audio, record, transcribe, speak, send, release the devices, show a notice, move focus). It never
 * touches a device or the network; `use-interview-turn` runs the effects. Every rule of the spec's turn table lives here,
 * so the room's behaviour reads top to bottom in one place and every edge case is a plain unit test.
 */

type Result = { state: RoomState; effects: RoomEffect[] };

export function initialRoomState({ micAvailable }: { micAvailable: boolean }): RoomState {
  return {
    phase: "lobby",
    muted: false,
    micAvailable,
    unsent: null,
    fieldError: null,
    hint: null,
    replaying: false,
    closing: false,
    returnTo: "your-turn",
  };
}

/** Answer is allowed whenever a recording can start: on the candidate's turn, in review (re-record), or to cut a line. */
export function canAnswer(state: RoomState): boolean {
  if (!state.micAvailable) return false;
  return state.phase === "your-turn" || state.phase === "review" || (state.phase === "speaking" && !state.closing);
}

/** Replay is allowed unless the mic is open or a send is in flight (the spec's turn table, EC6). */
export function canReplay(state: RoomState): boolean {
  return state.phase === "speaking" || state.phase === "your-turn" || state.phase === "review" || state.phase === "closed";
}

export function canSend(state: RoomState): boolean {
  return state.phase === "review" && state.unsent !== null;
}

/**
 * What the room's live region says now: the phase's label. While thinking, only the slow label replaces the fixed one
 * (a wait getting long is news); the rotating labels ("Reading your answer…") stay visual, so a send is announced once.
 */
export function roomStatusLabel(phase: RoomPhase, thinkingLabel?: string): string {
  return phase === "thinking" && thinkingLabel === INTERVIEWER_SLOW_LABEL ? thinkingLabel : ROOM_STATUS_LABELS[phase];
}

const unchanged = (state: RoomState): Result => ({ state, effects: [] });

/** Where a cancelled or failed recording goes back to: the unsent answer if there is one (a re-record), else the turn. */
const backFromRecording = (state: RoomState): RoomState => ({
  ...state,
  phase: state.unsent === null ? "your-turn" : "review",
});

/** The interview is over: everything stops and the devices are released. */
function close(state: RoomState, leading: RoomEffect[] = []): Result {
  return {
    state: { ...state, phase: "closed", unsent: null, fieldError: null, replaying: false, closing: false },
    effects: [...leading, { type: "releaseDevices" }],
  };
}

/** The interviewer says `lines` on its own (not a replay); muted or nothing to say goes straight to what comes next. */
function speakAutomatically(state: RoomState, lines: RoomEffect & { type: "speak" }, completed: boolean): Result {
  const next: RoomState = { ...state, hint: null, replaying: false, closing: completed };
  if (state.muted || lines.lines.length === 0) {
    return completed
      ? close(next)
      : { state: { ...next, phase: "your-turn" }, effects: [{ type: "focus", target: "answer" }] };
  }
  return {
    state: { ...next, phase: "speaking", returnTo: completed ? "closed" : "your-turn" },
    effects: [lines],
  };
}

/** The line that was playing is over (it ended, failed, was blocked, or muting cut it). */
function afterSpeech(state: RoomState, leading: RoomEffect[], hint: RoomState["hint"] = null): Result {
  if (state.returnTo === "closed") return close({ ...state, hint }, leading);
  const effects = [...leading];
  if (!state.replaying && state.returnTo === "your-turn" && hint === null) {
    effects.push({ type: "focus", target: "answer" });
  }
  return { state: { ...state, phase: state.returnTo, replaying: false, hint }, effects };
}

export function reduceRoomTurn(state: RoomState, event: RoomEvent): Result {
  switch (event.type) {
    case "join": {
      if (state.phase !== "lobby") return unchanged(state);
      return speakAutomatically(state, { type: "speak", lines: event.current ? [event.current] : [] }, false);
    }

    case "speechFinished": {
      // A line can finish after the candidate moved on (Answer cut it, End closed the room): nothing to do then.
      if (state.phase !== "speaking") return unchanged(state);
      if (event.end === "failed") {
        return afterSpeech(state, event.message ? [{ type: "notice", message: event.message }] : []);
      }
      return afterSpeech(state, [], event.end === "blocked" ? "blocked" : null);
    }

    case "answer": {
      if (!state.micAvailable) {
        return { state, effects: [{ type: "notice", message: MIC_REQUIRED_MESSAGE }] };
      }
      if (!canAnswer(state)) return unchanged(state);
      const effects: RoomEffect[] = state.phase === "speaking" ? [{ type: "stopAudio" }] : [];
      effects.push({ type: "startRecording" });
      return {
        state: { ...state, phase: "recording", hint: null, fieldError: null, replaying: false },
        effects,
      };
    }

    case "stop": {
      if (state.phase !== "recording") return unchanged(state);
      return { state: { ...state, phase: "transcribing" }, effects: [{ type: "stopRecording" }] };
    }

    case "cancel": {
      if (state.phase !== "recording") return unchanged(state);
      return { state: backFromRecording(state), effects: [{ type: "cancelRecording" }] };
    }

    case "recorded": {
      // `limit`: the recorder stopped itself at 2 minutes, so this can arrive while still `recording`.
      if (state.phase !== "recording" && state.phase !== "transcribing") return unchanged(state);
      if (event.recording === null) {
        return { state: backFromRecording(state), effects: [{ type: "notice", message: EMPTY_RECORDING_MESSAGE }] };
      }
      const effects: RoomEffect[] =
        event.end === "limit" ? [{ type: "notice", message: RECORDING_LIMIT_MESSAGE }] : [];
      effects.push({ type: "transcribe", recording: event.recording });
      return { state: { ...state, phase: "transcribing" }, effects };
    }

    case "transcribed": {
      if (state.phase !== "transcribing") return unchanged(state);
      return {
        state: { ...state, phase: "review", unsent: event.text, fieldError: null },
        effects: [{ type: "focus", target: "send" }],
      };
    }

    case "transcribeFailed": {
      if (state.phase !== "transcribing") return unchanged(state);
      return {
        state: backFromRecording(state),
        effects: event.message ? [{ type: "notice", message: event.message }] : [],
      };
    }

    case "send": {
      if (!canSend(state) || state.unsent === null) return unchanged(state);
      return { state: { ...state, phase: "thinking", fieldError: null }, effects: [{ type: "send", text: state.unsent }] };
    }

    case "sendFailed": {
      if (state.phase !== "thinking") return unchanged(state);
      return { state: { ...state, phase: "review", fieldError: event.fieldError ?? null }, effects: [] };
    }

    case "turnSaved": {
      if (state.phase !== "thinking") return unchanged(state);
      return speakAutomatically(
        { ...state, unsent: null, fieldError: null },
        { type: "speak", lines: event.lines },
        event.completed,
      );
    }

    case "resynced": {
      // The interview changed under us (a lost reply, another tab): drop the unsent answer and say where it is now.
      if (state.phase === "closed" || state.phase === "lobby") return unchanged(state);
      const leading: RoomEffect[] =
        state.phase === "recording" || state.phase === "transcribing"
          ? [{ type: "cancelRecording" }]
          : state.phase === "speaking"
            ? [{ type: "stopAudio" }]
            : [];
      const result = speakAutomatically(
        { ...state, unsent: null, fieldError: null },
        { type: "speak", lines: event.current ? [event.current] : [] },
        false,
      );
      return { state: result.state, effects: [...leading, ...result.effects] };
    }

    case "replay": {
      if (!canReplay(state)) return unchanged(state);
      if (state.phase === "closed") return { state, effects: [{ type: "replay", line: event.line }] };
      if (state.phase === "speaking") {
        return {
          state: { ...state, hint: null, replaying: true },
          effects: [{ type: "stopAudio" }, { type: "replay", line: event.line }],
        };
      }
      return {
        state: { ...state, phase: "speaking", returnTo: state.phase as "your-turn" | "review", hint: null, replaying: true },
        effects: [{ type: "replay", line: event.line }],
      };
    }

    case "toggleMute": {
      const next = { ...state, muted: !state.muted };
      // Muting stops an automatic line now; a replay keeps playing (the candidate asked for it).
      if (next.muted && state.phase === "speaking" && !state.replaying) {
        return afterSpeech(next, [{ type: "stopAudio" }]);
      }
      return { state: next, effects: [] };
    }

    case "setMicAvailable":
      return { state: { ...state, micAvailable: event.available }, effects: [] };

    case "end": {
      if (state.phase === "closed") return unchanged(state);
      return close(state, [{ type: "stopAudio" }, { type: "cancelRecording" }]);
    }

    case "leave":
      // A finished room stays finished (a return shows the closing card); its devices are already released.
      if (state.phase === "closed") return { state, effects: [{ type: "stopAudio" }] };
      // Whatever was playing, recording or unsent is gone; a return shows the lobby and speaks the question again (EC12).
      return {
        state: { ...initialRoomState({ micAvailable: state.micAvailable }), muted: state.muted },
        effects: [{ type: "stopAudio" }, { type: "cancelRecording" }, { type: "releaseDevices" }],
      };

    default: {
      const unhandled: never = event;
      return unhandled;
    }
  }
}
