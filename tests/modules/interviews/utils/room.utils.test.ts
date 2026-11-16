import { describe, expect, it } from "vitest";

import { INTERVIEWER_SLOW_LABEL, MIC_REQUIRED_MESSAGE } from "@/modules/interviews/constants";
import type { InterviewerLine, RoomEvent, RoomState } from "@/modules/interviews/types/interviews.types";
import {
  canAnswer,
  canReplay,
  canSend,
  initialRoomState,
  reduceRoomTurn,
  roomStatusLabel,
} from "@/modules/interviews/utils/room.utils";

describe("roomStatusLabel", () => {
  it.each([
    ["speaking", "Interviewer speaking"],
    ["your-turn", "Your turn"],
    ["recording", "Recording"],
    ["transcribing", "Transcribing…"],
    ["review", "Review your answer"],
    ["thinking", "Interviewer is thinking…"],
    ["lobby", ""],
    ["closed", ""],
  ] as const)("%s → %j (the spec's announcements)", (phase, label) => {
    expect(roomStatusLabel(phase)).toBe(label);
  });

  it("while thinking, only the slow label replaces the fixed one (it's news); the rotating label stays visual", () => {
    expect(roomStatusLabel("thinking", INTERVIEWER_SLOW_LABEL)).toBe(INTERVIEWER_SLOW_LABEL);
    expect(roomStatusLabel("thinking", "Reading your answer…")).toBe("Interviewer is thinking…");
  });

  it("a thinking label left over after the turn is ignored", () => {
    expect(roomStatusLabel("your-turn", INTERVIEWER_SLOW_LABEL)).toBe("Your turn");
  });
});

const Q1: InterviewerLine = { kind: "question", id: "q-1" };
const R1: InterviewerLine = { kind: "reaction", id: "r-1" };
const Q2: InterviewerLine = { kind: "question", id: "q-2" };
const CLIP = new Blob(["webm"], { type: "audio/webm" });

/** Runs events from a state and returns the last result. */
function run(state: RoomState, ...events: RoomEvent[]) {
  let result = { state, effects: [] as ReturnType<typeof reduceRoomTurn>["effects"] };
  for (const event of events) {
    result = reduceRoomTurn(result.state, event);
  }
  return result;
}

const lobby = (micAvailable = true) => initialRoomState({ micAvailable });
const speaking = () => run(lobby(), { type: "join", current: Q1 }).state;
const yourTurn = () => run(speaking(), { type: "speechFinished", end: "ended" }).state;
const recording = () => run(yourTurn(), { type: "answer" }).state;
const review = (text = "I led the migration.") =>
  run(recording(), { type: "stop" }, { type: "recorded", recording: CLIP, end: "stopped" }, { type: "transcribed", text })
    .state;

describe("reduceRoomTurn", () => {
  describe("leaving the room (a navigation hides it, Next keeps its state)", () => {
    it.each([
      ["speaking", speaking],
      ["recording", recording],
      ["review", () => review()],
    ] as const)("from %s: back to the lobby, keeping mute and the mic check, with everything stopped (EC12, EC23)", (_, from) => {
      const before: RoomState = { ...from(), muted: true, micAvailable: false, hint: "blocked" };

      const { state, effects } = run(before, { type: "leave" });

      expect(state).toEqual({ ...lobby(false), muted: true });
      expect(effects).toEqual([{ type: "stopAudio" }, { type: "cancelRecording" }, { type: "releaseDevices" }]);
    });

    it("a closed room stays closed (a return shows the closing card, never the lobby); only a replay is stopped", () => {
      const closed = run(speaking(), { type: "end" }).state;

      const { state, effects } = run(closed, { type: "leave" });

      expect(state).toEqual(closed);
      expect(effects).toEqual([{ type: "stopAudio" }]);
    });

    it("a line or a send that finishes after leaving changes nothing", () => {
      const left = run(speaking(), { type: "leave" }).state;

      expect(run(left, { type: "speechFinished", end: "ended" }).state).toEqual(left);
      expect(run(left, { type: "turnSaved", lines: [], completed: false }).state).toEqual(left);
    });
  });
  describe("joining and hearing a line", () => {
    it("join speaks the current question (AC2)", () => {
      const { state, effects } = run(lobby(), { type: "join", current: Q1 });

      expect(state.phase).toBe("speaking");
      expect(effects).toEqual([{ type: "speak", lines: [Q1] }]);
    });

    it("join with nothing to say goes straight to the candidate's turn", () => {
      expect(run(lobby(), { type: "join", current: null }).state.phase).toBe("your-turn");
    });

    it("a line that plays through hands the turn to the candidate and focuses Answer", () => {
      const { state, effects } = run(speaking(), { type: "speechFinished", end: "ended" });

      expect(state.phase).toBe("your-turn");
      expect(effects).toEqual([{ type: "focus", target: "answer" }]);
    });

    it("a line that fails shows the message and hands the turn over (EC3, EC4)", () => {
      const { state, effects } = run(speaking(), { type: "speechFinished", end: "failed", message: "Couldn't play" });

      expect(state.phase).toBe("your-turn");
      expect(effects).toContainEqual({ type: "notice", message: "Couldn't play" });
    });

    it("a blocked autoplay shows the replay hint, never a toast (EC24)", () => {
      const { state, effects } = run(speaking(), { type: "speechFinished", end: "blocked" });

      expect(state.phase).toBe("your-turn");
      expect(state.hint).toBe("blocked");
      expect(effects.some((effect) => effect.type === "notice")).toBe(false);
    });

    it("ignores a finished line that no longer matters (the candidate already moved on)", () => {
      const before = recording();

      expect(run(before, { type: "speechFinished", end: "ended" }).state).toBe(before);
    });
  });

  describe("recording an answer", () => {
    it("Answer while the interviewer speaks cuts the audio and records (EC5)", () => {
      const { state, effects } = run(speaking(), { type: "answer" });

      expect(state.phase).toBe("recording");
      expect(effects).toEqual([{ type: "stopAudio" }, { type: "startRecording" }]);
    });

    it("Answer on the candidate's turn records", () => {
      const { state, effects } = run(yourTurn(), { type: "answer" });

      expect(state.phase).toBe("recording");
      expect(effects).toEqual([{ type: "startRecording" }]);
    });

    it("refuses Answer without a microphone and says how to allow it (EC1)", () => {
      const noMic = run(lobby(false), { type: "join", current: Q1 }, { type: "speechFinished", end: "ended" }).state;
      const { state, effects } = run(noMic, { type: "answer" });

      expect(state.phase).toBe("your-turn");
      expect(effects).toEqual([{ type: "notice", message: MIC_REQUIRED_MESSAGE }]);
    });

    it("Stop stops the recorder and waits for the clip", () => {
      const { state, effects } = run(recording(), { type: "stop" });

      expect(state.phase).toBe("transcribing");
      expect(effects).toEqual([{ type: "stopRecording" }]);
    });

    it("the finished clip is sent for transcription", () => {
      const transcribing = run(recording(), { type: "stop" }).state;

      expect(run(transcribing, { type: "recorded", recording: CLIP, end: "stopped" }).effects).toEqual([
        { type: "transcribe", recording: CLIP },
      ]);
    });

    it("a recording stopped by the 2-minute limit is still transcribed, with a notice (EC16)", () => {
      const { state, effects } = run(recording(), { type: "recorded", recording: CLIP, end: "limit" });

      expect(state.phase).toBe("transcribing");
      expect(effects).toEqual([{ type: "notice", message: expect.any(String) }, { type: "transcribe", recording: CLIP }]);
    });

    it("the transcript becomes the unsent answer under review, with focus on Send (AC3)", () => {
      const { state, effects } = run(
        recording(),
        { type: "stop" },
        { type: "recorded", recording: CLIP, end: "stopped" },
        { type: "transcribed", text: "I led the migration." },
      );

      expect(state.phase).toBe("review");
      expect(state.unsent).toBe("I led the migration.");
      expect(effects).toEqual([{ type: "focus", target: "send" }]);
    });

    it("an empty recording or a failed transcription goes back to the candidate's turn (EC15)", () => {
      const empty = run(recording(), { type: "stop" }, { type: "recorded", recording: null, end: "stopped" });
      const failed = run(recording(), { type: "stop" }, { type: "recorded", recording: CLIP, end: "stopped" }, {
        type: "transcribeFailed",
        message: "Didn't catch that. Try again.",
      });

      expect(empty.state.phase).toBe("your-turn");
      expect(empty.effects).toContainEqual({ type: "notice", message: expect.any(String) });
      expect(failed.state.phase).toBe("your-turn");
      expect(failed.effects).toEqual([{ type: "notice", message: "Didn't catch that. Try again." }]);
    });

    it("Esc cancels a recording", () => {
      const { state, effects } = run(recording(), { type: "cancel" });

      expect(state.phase).toBe("your-turn");
      expect(effects).toEqual([{ type: "cancelRecording" }]);
    });
  });

  describe("reviewing and re-recording", () => {
    it("Re-record replaces the unsent answer (EC14)", () => {
      const rerecorded = run(
        review("first take"),
        { type: "answer" },
        { type: "stop" },
        { type: "recorded", recording: CLIP, end: "stopped" },
        { type: "transcribed", text: "second take" },
      ).state;

      expect(rerecorded.unsent).toBe("second take");
    });

    it("cancelling a re-record keeps the previous unsent answer (EC14)", () => {
      const { state } = run(review("first take"), { type: "answer" }, { type: "cancel" });

      expect(state.phase).toBe("review");
      expect(state.unsent).toBe("first take");
    });

    it("a failed re-record keeps the previous unsent answer (EC15)", () => {
      const { state } = run(
        review("first take"),
        { type: "answer" },
        { type: "stop" },
        { type: "recorded", recording: CLIP, end: "stopped" },
        { type: "transcribeFailed", message: null },
      );

      expect(state.phase).toBe("review");
      expect(state.unsent).toBe("first take");
    });
  });

  describe("sending", () => {
    it("Send sends the unsent answer and waits for the interviewer", () => {
      const { state, effects } = run(review("I led the migration."), { type: "send" });

      expect(state.phase).toBe("thinking");
      expect(effects).toEqual([{ type: "send", text: "I led the migration." }]);
    });

    it("Send does nothing outside review", () => {
      expect(run(yourTurn(), { type: "send" }).effects).toEqual([]);
    });

    it("a field error keeps the answer in review with the message under it (EC18)", () => {
      const { state } = run(review("too long"), { type: "send" }, { type: "sendFailed", fieldError: "Too long" });

      expect(state.phase).toBe("review");
      expect(state.unsent).toBe("too long");
      expect(state.fieldError).toBe("Too long");
    });

    it("any other failed send keeps the unsent answer (the answer hook shows the toast)", () => {
      const { state } = run(review("I led it."), { type: "send" }, { type: "sendFailed" });

      expect(state.phase).toBe("review");
      expect(state.unsent).toBe("I led it.");
      expect(state.fieldError).toBeNull();
    });

    it("a saved turn speaks the reaction then the next question (AC4, EC10)", () => {
      const { state, effects } = run(review(), { type: "send" }, { type: "turnSaved", lines: [R1, Q2], completed: false });

      expect(state.phase).toBe("speaking");
      expect(state.unsent).toBeNull();
      expect(effects).toEqual([{ type: "speak", lines: [R1, Q2] }]);
    });
  });

  describe("mute and replay", () => {
    it("muted: a new line isn't played, the turn goes straight to the candidate (EC9)", () => {
      const muted = run(review(), { type: "toggleMute" }).state;
      const { state, effects } = run(muted, { type: "send" }, { type: "turnSaved", lines: [R1, Q2], completed: false });

      expect(state.phase).toBe("your-turn");
      expect(effects.some((effect) => effect.type === "speak")).toBe(false);
      expect(effects).toContainEqual({ type: "focus", target: "answer" });
    });

    it("muted: replay still plays, because the candidate asked for it (AC7, EC9)", () => {
      const muted = run(yourTurn(), { type: "toggleMute" }).state;

      expect(run(muted, { type: "replay", line: Q1 }).effects).toEqual([{ type: "replay", line: Q1 }]);
    });

    it("muting while the interviewer speaks stops the line", () => {
      const { state, effects } = run(speaking(), { type: "toggleMute" });

      expect(state.muted).toBe(true);
      expect(state.phase).toBe("your-turn");
      expect(effects).toContainEqual({ type: "stopAudio" });
    });

    it("replay on the candidate's turn plays the line and comes back to the turn", () => {
      const replaying = run(yourTurn(), { type: "replay", line: Q1 });
      const after = run(replaying.state, { type: "speechFinished", end: "ended" });

      expect(replaying.state.phase).toBe("speaking");
      expect(after.state.phase).toBe("your-turn");
    });

    it("replay during review keeps the unsent answer and returns to review", () => {
      const replaying = run(review("keep me"), { type: "replay", line: Q1 });
      const after = run(replaying.state, { type: "speechFinished", end: "ended" });

      expect(after.state.phase).toBe("review");
      expect(after.state.unsent).toBe("keep me");
    });

    it("replay while a line plays restarts with the requested line (EC7)", () => {
      expect(run(speaking(), { type: "replay", line: Q1 }).effects).toEqual([
        { type: "stopAudio" },
        { type: "replay", line: Q1 },
      ]);
    });

    it.each([
      ["recording", recording],
      ["transcribing", () => run(recording(), { type: "stop" }).state],
      ["thinking", () => run(review(), { type: "send" }).state],
    ])("replay is refused while %s (EC6)", (_, state) => {
      const before = state();

      expect(run(before, { type: "replay", line: Q1 })).toEqual({ state: before, effects: [] });
    });
  });

  describe("the end of the interview", () => {
    it("completion speaks the final reaction, then closes and releases the devices (EC11)", () => {
      const saved = run(review(), { type: "send" }, { type: "turnSaved", lines: [R1], completed: true });
      const done = run(saved.state, { type: "speechFinished", end: "ended" });

      expect(saved.effects).toEqual([{ type: "speak", lines: [R1] }]);
      expect(done.state.phase).toBe("closed");
      expect(done.effects).toEqual([{ type: "releaseDevices" }]);
    });

    it("muted completion closes at once", () => {
      const muted = run(review(), { type: "toggleMute" }, { type: "send" }).state;
      const { state, effects } = run(muted, { type: "turnSaved", lines: [R1], completed: true });

      expect(state.phase).toBe("closed");
      expect(effects).toEqual([{ type: "releaseDevices" }]);
    });

    it("End stops everything, discards the unsent answer and releases the devices (EC17)", () => {
      const { state, effects } = run(review("not sent"), { type: "end" });

      expect(state.phase).toBe("closed");
      expect(state.unsent).toBeNull();
      expect(effects).toEqual([{ type: "stopAudio" }, { type: "cancelRecording" }, { type: "releaseDevices" }]);
    });

    it("a closed interview can still replay transcript lines (EC13)", () => {
      const closed = run(review(), { type: "end" }).state;
      const { state, effects } = run(closed, { type: "replay", line: Q1 });

      expect(state.phase).toBe("closed");
      expect(effects).toEqual([{ type: "replay", line: Q1 }]);
    });

    it("a resync speaks the interview's new current question (EC19)", () => {
      const { state, effects } = run(review("lost"), { type: "send" }, { type: "resynced", current: Q2 });

      expect(state.phase).toBe("speaking");
      expect(state.unsent).toBeNull();
      expect(effects).toEqual([{ type: "speak", lines: [Q2] }]);
    });
  });
});

describe("room permissions (the spec's turn table)", () => {
  it.each([
    ["speaking", speaking, { answer: true, replay: true, send: false }],
    ["your-turn", yourTurn, { answer: true, replay: true, send: false }],
    ["recording", recording, { answer: false, replay: false, send: false }],
    ["transcribing", () => run(recording(), { type: "stop" }).state, { answer: false, replay: false, send: false }],
    ["review", review, { answer: true, replay: true, send: true }],
    ["thinking", () => run(review(), { type: "send" }).state, { answer: false, replay: false, send: false }],
    ["closed", () => run(review(), { type: "end" }).state, { answer: false, replay: true, send: false }],
  ])("%s", (_, make, allowed) => {
    const state = make();

    expect({ answer: canAnswer(state), replay: canReplay(state), send: canSend(state) }).toEqual(allowed);
  });

  it("Answer is never allowed without a microphone (EC1)", () => {
    const noMic = run(lobby(false), { type: "join", current: Q1 }, { type: "speechFinished", end: "ended" }).state;

    expect(canAnswer(noMic)).toBe(false);
  });
});
