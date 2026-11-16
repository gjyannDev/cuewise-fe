// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInterviewTurn } from "@/modules/interviews/hooks/use-interview-turn";
import type { SendResult, SpeechOutcome, TranscribeResult, VoicePort } from "@/modules/interviews/types/interviews.types";
import { activityWrapper } from "@tests/helpers/activity";
import { answerResponse, Q1, Q2, REACTION, transcriptItem } from "@tests/helpers/interviews";

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const QUESTION = transcriptItem("question", Q1, 1);
const CLIP = new Blob(["webm"], { type: "audio/webm" });

/** A promise the test resolves by hand, so it controls when a line ends or a send comes back. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function fakes() {
  const speech = deferred<SpeechOutcome>();
  const voice = {
    join: vi.fn(),
    speakLines: vi.fn<VoicePort["speakLines"]>(() => speech.promise),
    replay: vi.fn<VoicePort["replay"]>(() => Promise.resolve({ end: "ended" })),
    stop: vi.fn(),
    transcribe: vi.fn<VoicePort["transcribe"]>(() => Promise.resolve<TranscribeResult>({ kind: "text", text: "My answer." })),
  };
  const recorder = { start: vi.fn(), stop: vi.fn(), cancel: vi.fn(), error: null as "denied" | "no-device" | "failed" | null };
  const sent = deferred<SendResult>();
  const answer = { send: vi.fn(() => sent.promise), viewOptions: {} };
  const onRelease = vi.fn();
  const onFocus = vi.fn();
  return { voice, recorder, answer, onRelease, onFocus, speech, sent };
}

type Fakes = ReturnType<typeof fakes>;

function renderTurn(f: Fakes, micSupported = true) {
  return renderHook(
    ({ recorder }) =>
      useInterviewTurn({
        transcript: [QUESTION],
        voice: f.voice,
        recorder,
        answer: f.answer,
        micSupported,
        onRelease: f.onRelease,
        onFocus: f.onFocus,
      }),
    { initialProps: { recorder: f.recorder } },
  );
}

const press = (key: string, init: KeyboardEventInit = {}, target: EventTarget = document.body) =>
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  });

/** Joins and lets the first question finish, so it's the candidate's turn. */
async function toYourTurn(f: Fakes, result: ReturnType<typeof renderTurn>["result"]) {
  act(() => result.current.join());
  await act(async () => f.speech.resolve({ end: "ended" }));
}

let f: Fakes;
beforeEach(() => {
  f = fakes();
});
afterEach(() => {
  document.body.innerHTML = "";
});

describe("useInterviewTurn", () => {
  it("Join unlocks playback, speaks the current question and hands the turn over when it ends (AC2)", async () => {
    const { result } = renderTurn(f);

    act(() => result.current.join());
    expect(f.voice.join).toHaveBeenCalledTimes(1);
    expect(f.voice.speakLines).toHaveBeenCalledWith([{ kind: "question", id: Q1 }]);
    expect(result.current.state.phase).toBe("speaking");

    await act(async () => f.speech.resolve({ end: "ended" }));
    expect(result.current.state.phase).toBe("your-turn");
    expect(f.onFocus).toHaveBeenCalledWith("answer");
  });

  it("Space records and Space stops; the clip goes to transcription and lands as the unsent answer (AC3)", async () => {
    const { result } = renderTurn(f);
    await toYourTurn(f, result);

    press(" ");
    expect(f.recorder.start).toHaveBeenCalledTimes(1);
    press(" ");
    expect(f.recorder.stop).toHaveBeenCalledTimes(1);

    await act(async () => result.current.onRecorded(CLIP, "stopped"));
    expect(f.voice.transcribe).toHaveBeenCalledWith(CLIP, expect.any(AbortSignal));
    expect(result.current.state.phase).toBe("review");
    expect(result.current.view.items.at(-1)).toEqual(expect.objectContaining({ unsent: true, text: "My answer." }));
    expect(f.onFocus).toHaveBeenLastCalledWith("send");
  });

  it("Space on a focused button presses the button and doesn't record (EC21)", async () => {
    const { result } = renderTurn(f);
    await toYourTurn(f, result);
    const button = document.createElement("button");
    document.body.append(button);

    press(" ", {}, button);

    expect(f.recorder.start).not.toHaveBeenCalled();
    expect(result.current.state.phase).toBe("your-turn");
  });

  it("Esc cancels a recording", async () => {
    const { result } = renderTurn(f);
    await toYourTurn(f, result);
    act(() => result.current.answer());

    press("Escape");

    expect(f.recorder.cancel).toHaveBeenCalled();
    expect(result.current.state.phase).toBe("your-turn");
  });

  it("Ctrl+Enter sends the unsent answer, then the reaction and next question are spoken (AC4)", async () => {
    const { result } = renderTurn(f);
    await toYourTurn(f, result);
    act(() => result.current.answer());
    act(() => result.current.stop());
    await act(async () => result.current.onRecorded(CLIP, "stopped"));

    press("Enter", { ctrlKey: true });
    expect(f.answer.send).toHaveBeenCalledWith(QUESTION, "My answer.");
    expect(result.current.state.phase).toBe("thinking");

    f.voice.speakLines.mockClear();
    await act(async () => f.sent.resolve({ kind: "saved", response: answerResponse({ id: Q2, position: 2 }) }));
    expect(f.voice.speakLines).toHaveBeenCalledWith([
      { kind: "reaction", id: REACTION.id },
      { kind: "question", id: Q2 },
    ]);
  });

  it("Ctrl+Enter does nothing when there is no unsent answer", async () => {
    const { result } = renderTurn(f);
    await toYourTurn(f, result);

    press("Enter", { ctrlKey: true });

    expect(f.answer.send).not.toHaveBeenCalled();
  });

  it("a blocked microphone backs out of the recording and stops offering Answer (EC1)", async () => {
    const { result, rerender } = renderTurn(f);
    await toYourTurn(f, result);
    act(() => result.current.answer());

    rerender({ recorder: { ...f.recorder, error: "denied" } });

    expect(result.current.state.phase).toBe("your-turn");
    expect(result.current.canAnswer).toBe(false);
  });

  it("setMicAvailable is the same function across renders, so the lobby's check can run it from an effect", async () => {
    const { result } = renderTurn(f);
    const first = result.current.setMicAvailable;

    act(() => result.current.setMicAvailable(false));

    expect(result.current.canAnswer).toBe(false);
    expect(result.current.setMicAvailable).toBe(first);
  });

  it("hidden by a navigation (Next keeps the page in <Activity>), it lets go of everything and comes back to the lobby (EC12, EC23)", async () => {
    const activity = activityWrapper();
    const { result, rerender } = renderHook(
      () =>
        useInterviewTurn({
          transcript: [QUESTION],
          voice: f.voice,
          recorder: f.recorder,
          answer: f.answer,
          micSupported: true,
          onRelease: f.onRelease,
        }),
      { wrapper: activity.wrapper },
    );
    await toYourTurn(f, result);
    act(() => result.current.answer());

    act(() => {
      activity.setMode("hidden");
      rerender();
    });
    expect(f.voice.stop).toHaveBeenCalled();
    expect(f.recorder.cancel).toHaveBeenCalled();
    expect(f.onRelease).toHaveBeenCalled();

    act(() => {
      activity.setMode("visible");
      rerender();
    });
    expect(result.current.state.phase).toBe("lobby");
  });

  it("leaving the room stops the voice and the recorder and releases the devices (EC23)", () => {
    const { result, unmount } = renderTurn(f);
    act(() => result.current.join());

    unmount();

    expect(f.voice.stop).toHaveBeenCalled();
    expect(f.recorder.cancel).toHaveBeenCalled();
    expect(f.onRelease).toHaveBeenCalled();
  });
});
