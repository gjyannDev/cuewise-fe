import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useWarnBeforeUnload } from "@/hooks/use-warn-before-unload";

import { MIC_REQUIRED_MESSAGE, RECORDING_FAILED_MESSAGE } from "../constants";
import type {
  InterviewerLine,
  RoomEffect,
  RoomEvent,
  SendResult,
  SpeechOutcome,
  TranscriptItem,
  TranscriptView,
  VoicePort,
} from "../types/interviews.types";
import { canAnswer, canReplay, canSend, initialRoomState, reduceRoomTurn } from "../utils/room.utils";
import { buildTranscriptView } from "../utils/transcript.utils";
import { planSpokenLines } from "../utils/voice.utils";

/** The microphone, as the turn needs it (implemented by `useAudioRecorder`; only one implementation, so no named port). */
type RoomRecorder = {
  start: () => void;
  stop: () => void;
  cancel: () => void;
  /** Why the last start failed, if it did. */
  error: "denied" | "no-device" | "failed" | null;
};

/** Sending an answer, as the turn needs it (implemented by `useInterviewAnswer`). */
type RoomAnswer = {
  send: (question: TranscriptItem, text: string) => Promise<SendResult>;
  /** The pending and streaming lines it adds to the transcript. */
  viewOptions: Omit<Parameters<typeof buildTranscriptView>[1], "unsent">;
};

type UseInterviewTurnOptions = {
  transcript: TranscriptItem[];
  voice: VoicePort;
  recorder: RoomRecorder;
  answer: RoomAnswer;
  /** Whether a recording can start at all (a recorder exists in this browser). */
  micSupported: boolean;
  /** Releases devices the turn doesn't own (the camera). */
  onRelease?: () => void;
  /** Moves focus after a turn change (never on page load). */
  onFocus?: (target: "send" | "answer") => void;
};

/** Everything an effect may need, read at the moment it runs (effects run after awaits, long after their render). */
type EffectContext = {
  voice: VoicePort;
  recorder: RoomRecorder;
  answer: RoomAnswer;
  openQuestion: TranscriptItem | undefined;
  onRelease?: () => void;
  onFocus?: (target: "send" | "answer") => void;
  dispatch: (event: RoomEvent) => void;
  /** The transcription in flight, so a cancel or a newer one can abort it. */
  transcribing: { current: AbortController | null };
  /** A send came back resynced or recovered: speak the current question once the refetch shows it. */
  awaitingResync: { current: boolean };
};

const questionLine = (item: TranscriptItem | undefined): InterviewerLine | null =>
  item ? { kind: "question", id: item.id } : null;

function finishSpeech(outcome: SpeechOutcome, dispatch: EffectContext["dispatch"]) {
  // `stopped` was on purpose (Answer, a replay, End): whatever stopped it already moved the turn on.
  if (outcome.end !== "stopped") {
    dispatch({ type: "speechFinished", end: outcome.end, message: outcome.message });
  }
}

function handleSent(result: SendResult, { dispatch, awaitingResync }: EffectContext) {
  switch (result.kind) {
    case "saved":
      dispatch({
        type: "turnSaved",
        lines: planSpokenLines(result.response),
        completed: result.response.current_question === null,
      });
      return;
    case "failed":
      dispatch({ type: "sendFailed", fieldError: result.fieldError });
      return;
    case "resync":
    case "recovered":
      awaitingResync.current = true;
      return;
    case "cancelled":
      return;
  }
}

/** Runs one effect from the reducer against the room's collaborators. The only place a turn touches the outside world. */
function runRoomEffect(effect: RoomEffect, context: EffectContext) {
  const { voice, recorder, answer, dispatch, transcribing } = context;
  switch (effect.type) {
    case "stopAudio":
      voice.stop();
      return;
    case "speak":
      void voice.speakLines(effect.lines).then((outcome) => finishSpeech(outcome, dispatch));
      return;
    case "replay":
      void voice.replay(effect.line).then((outcome) => finishSpeech(outcome, dispatch));
      return;
    case "startRecording":
      recorder.start();
      return;
    case "stopRecording":
      recorder.stop();
      return;
    case "cancelRecording":
      transcribing.current?.abort();
      recorder.cancel();
      return;
    case "transcribe": {
      transcribing.current?.abort();
      const controller = new AbortController();
      transcribing.current = controller;
      void voice.transcribe(effect.recording, controller.signal).then((result) => {
        if (controller.signal.aborted) return;
        dispatch(
          result.kind === "text"
            ? { type: "transcribed", text: result.text }
            : { type: "transcribeFailed", message: result.kind === "message" ? result.message : null },
        );
      });
      return;
    }
    case "send": {
      const question = context.openQuestion;
      if (!question) {
        dispatch({ type: "sendFailed" });
        return;
      }
      void answer.send(question, effect.text).then((result) => handleSent(result, context));
      return;
    }
    case "releaseDevices":
      recorder.cancel();
      context.onRelease?.();
      return;
    case "notice":
      toast.error(effect.message);
      return;
    case "focus":
      context.onFocus?.(effect.target);
      return;
  }
}

/** Space only toggles recording when it can't mean anything else: not in a field, not on a button or other control. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, button, a, [role='button'], [role='switch'], [role='checkbox']") !== null
  );
}

/**
 * Runs the room. Holds the turn state, feeds events into `reduceRoomTurn` and runs the effects it returns against the
 * voice, the recorder and the answer sender. It imports no device code and no service: the container passes those in,
 * so tests use fakes and a different voice (phase 2) changes nothing here.
 */
export function useInterviewTurn({
  transcript,
  voice,
  recorder,
  answer,
  micSupported,
  onRelease,
  onFocus,
}: UseInterviewTurnOptions) {
  const [state, setState] = useState(() => initialRoomState({ micAvailable: micSupported }));
  const stateRef = useRef(state);
  const transcribing = useRef<AbortController | null>(null);
  const awaitingResync = useRef(false);

  const openQuestion = buildTranscriptView(transcript, answer.viewOptions).openQuestion;
  const view: TranscriptView = buildTranscriptView(transcript, {
    ...answer.viewOptions,
    unsent:
      state.unsent !== null && openQuestion
        ? { questionId: openQuestion.question_id, text: state.unsent, fieldError: state.fieldError ?? undefined }
        : undefined,
  });

  const ports = useRef({ voice, recorder, answer, openQuestion, onRelease, onFocus });
  useEffect(() => {
    ports.current = { voice, recorder, answer, openQuestion, onRelease, onFocus };
  });

  const dispatch = useCallback(function dispatch(event: RoomEvent) {
    const { state: next, effects } = reduceRoomTurn(stateRef.current, event);
    stateRef.current = next;
    setState(next);
    const context: EffectContext = { ...ports.current, dispatch, transcribing, awaitingResync };
    effects.forEach((effect) => runRoomEffect(effect, context));
  }, []);

  // Stable, so a container can call it from an effect (the lobby's microphone check) without re-running it.
  const setMicAvailable = useCallback(
    (available: boolean) => dispatch({ type: "setMicAvailable", available }),
    [dispatch],
  );

  // A resynced or recovered send: once the refetched transcript shows the current question, say it (EC19).
  const openId = openQuestion?.id;
  useEffect(() => {
    if (!awaitingResync.current || stateRef.current.phase !== "thinking") return;
    awaitingResync.current = false;
    dispatch({ type: "resynced", current: questionLine(ports.current.openQuestion) });
  }, [openId, dispatch]);

  // A recording that couldn't start (blocked, no mic, busy): back out, and stop offering Answer without a mic.
  const recorderError = recorder.error;
  useEffect(() => {
    if (!recorderError || stateRef.current.phase !== "recording") return;
    if (recorderError !== "failed") {
      dispatch({ type: "setMicAvailable", available: false });
    }
    dispatch({ type: "cancel" });
    toast.error(recorderError === "failed" ? RECORDING_FAILED_MESSAGE : MIC_REQUIRED_MESSAGE);
  }, [recorderError, dispatch]);

  // Keyboard: Space records or stops, Esc cancels, Ctrl/Cmd+Enter sends (spec, Keyboard).
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const current = stateRef.current;
      if (event.key === " " && !event.repeat && !event.ctrlKey && !event.metaKey && !isTypingTarget(event.target)) {
        if (current.phase === "recording") {
          event.preventDefault();
          dispatch({ type: "stop" });
        } else if (canAnswer(current)) {
          event.preventDefault();
          dispatch({ type: "answer" });
        }
      } else if (event.key === "Escape" && current.phase === "recording") {
        dispatch({ type: "cancel" });
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && canSend(current)) {
        event.preventDefault();
        dispatch({ type: "send" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  // Leaving the room stops the voice, any recording or transcription, and releases the devices (EC23). Next.js
  // (`cacheComponents`) hides a page on navigation instead of unmounting it, keeping its state, so this also puts the
  // turn back in the lobby: a return then shows Join and speaks the current question again (EC12). A layout effect,
  // so the reset happens before the page is hidden (Next's "Preserving UI state" guide).
  useLayoutEffect(
    () => () => {
      awaitingResync.current = false;
      dispatch({ type: "leave" });
    },
    [dispatch],
  );

  // An unsent or in-flight answer would be lost by a reload.
  useWarnBeforeUnload(state.phase === "review" || state.phase === "thinking");

  return {
    state,
    view,
    canAnswer: canAnswer(state),
    canReplay: canReplay(state),
    canSend: canSend(state),
    /** Call from the Join click: unlocks playback inside the gesture, then speaks the current question. */
    join: () => {
      voice.join();
      dispatch({ type: "join", current: questionLine(openQuestion) });
    },
    answer: () => dispatch({ type: "answer" }),
    stop: () => dispatch({ type: "stop" }),
    cancel: () => dispatch({ type: "cancel" }),
    send: () => dispatch({ type: "send" }),
    replay: (line: InterviewerLine) => dispatch({ type: "replay", line }),
    /** Replays the question the candidate is answering now. */
    replayCurrent: () => {
      const line = questionLine(openQuestion);
      if (line) dispatch({ type: "replay", line });
    },
    toggleMute: () => dispatch({ type: "toggleMute" }),
    setMicAvailable,
    end: () => dispatch({ type: "end" }),
    /** The recorder's `onRecorded`: a finished (or empty) recording comes back into the turn. */
    onRecorded: (recording: Blob | null, end: "stopped" | "limit") => dispatch({ type: "recorded", recording, end }),
  };
}
