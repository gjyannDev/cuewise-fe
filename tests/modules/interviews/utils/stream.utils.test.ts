import { describe, expect, it } from "vitest";

import type { AnswerStreamEvent } from "@/modules/interviews/types/interviews.types";
import {
  ANSWER_STREAM_START,
  inferStreamingQuestion,
  parseAnswerStreamEvent,
  reduceAnswerStream,
} from "@/modules/interviews/utils/stream.utils";
import { answerResponse, Q1, Q2, REACTION, transcriptItem } from "@tests/helpers/interviews";

const frame = (event: string, data: unknown) => ({ event, data: typeof data === "string" ? data : JSON.stringify(data) });

describe("parseAnswerStreamEvent", () => {
  it.each([
    ["status", { phase: "deciding" }],
    ["reaction", REACTION],
    ["question.delta", { text: "Tell me " }],
    ["reset", {}],
    ["done", answerResponse({ id: Q2, position: 2 })],
    ["error", { code: "INTERNAL_ERROR", message: "An unexpected error occurred", request_id: "r1" }],
  ])("parses a %s event (AC5)", (event, data) => {
    expect(parseAnswerStreamEvent(frame(event, data))).toEqual({ kind: "event", event: { event, data } });
  });

  it("ignores extra fields", () => {
    expect(parseAnswerStreamEvent(frame("question.delta", { text: "Hi", extra: 1 }))).toEqual({
      kind: "event",
      event: { event: "question.delta", data: { text: "Hi" } },
    });
  });

  it("reports an unknown event name as unknown (EC9)", () => {
    expect(parseAnswerStreamEvent(frame("progress", { pct: 3 }))).toEqual({ kind: "unknown" });
  });

  it.each([
    ["status", "{not json"],
    ["status", { phase: "thinking" }],
    ["question.delta", {}],
    ["error", { code: "X" }],
  ])("reports bad %s data as invalid (EC10)", (event, data) => {
    expect(parseAnswerStreamEvent(frame(event, data))).toEqual({ kind: "invalid" });
  });

  it("accepts a follow-up done (reaction null) but not a done without a reaction key (EC10)", () => {
    const followUp = answerResponse({ id: Q2, position: 2, question_kind: "follow_up", main_number: 1 }, null);
    expect(parseAnswerStreamEvent(frame("done", followUp)).kind).toBe("event");

    const noReaction: Record<string, unknown> = { ...followUp };
    delete noReaction.reaction;
    expect(parseAnswerStreamEvent(frame("done", noReaction))).toEqual({ kind: "invalid" });
  });
});

const run = (...events: AnswerStreamEvent[]) => events.reduce(reduceAnswerStream, ANSWER_STREAM_START);

const status = (phase: "received" | "deciding" | "writing"): AnswerStreamEvent => ({ event: "status", data: { phase } });
const delta = (text: string): AnswerStreamEvent => ({ event: "question.delta", data: { text } });
const reaction: AnswerStreamEvent = { event: "reaction", data: REACTION };
const reset: AnswerStreamEvent = { event: "reset", data: {} };
const done = (data = answerResponse({ id: Q2, position: 2 })): AnswerStreamEvent => ({ event: "done", data });

describe("reduceAnswerStream", () => {
  it("builds a move-on turn: phase, reaction, growing text, then the saved turn", () => {
    const writing = run(status("received"), status("deciding"), reaction, status("writing"), delta("Tell "), delta("me?"));

    expect(writing).toMatchObject({ phase: "writing", reaction: REACTION, questionText: "Tell me?", sawReaction: true });
    expect(reduceAnswerStream(writing, done()).done).toEqual(answerResponse({ id: Q2, position: 2 }));
  });

  it("builds a follow-up turn with no reaction (EC12)", () => {
    const state = run(status("deciding"), status("writing"), delta("Why?"));

    expect(state.reaction).toBeUndefined();
    expect(state).toMatchObject({ sawReaction: false, questionText: "Why?" });
  });

  it("lets done win over a follow-up that fell back to a main question (EC13, AC11)", () => {
    const saved = answerResponse({ id: Q2, position: 2 });
    const state = run(status("writing"), delta("What was"), reset, done(saved));

    expect(state.done).toEqual(saved);
    expect(state.sawReaction).toBe(false);
  });

  it("builds a completing turn: a reaction, no text, done without a question (EC14)", () => {
    const state = run(status("deciding"), reaction, done(answerResponse()));

    expect(state).toMatchObject({ reaction: REACTION, questionText: "" });
    expect(state.done?.current_question).toBeNull();
  });

  it("empties the text on reset, once or twice or with nothing shown (EC11)", () => {
    expect(run(delta("Bad"), reset).questionText).toBe("");
    expect(run(delta("Bad"), reset, delta("Good?")).questionText).toBe("Good?");
    expect(run(reset, reset).questionText).toBe("");
  });

  it("takes a whole question from done with no deltas (EC23)", () => {
    const state = run(status("writing"), done());

    expect(state.questionText).toBe("");
    expect(state.done?.current_question?.text).toBe("question 2");
  });

  it("ends on an error event and ignores anything after a terminal event (EC5)", () => {
    const error: AnswerStreamEvent = {
      event: "error",
      data: { code: "QUESTION_NOT_CURRENT", message: "x", request_id: null },
    };

    const state = run(delta("Tell"), error, delta(" more"), done());

    expect(state.error?.code).toBe("QUESTION_NOT_CURRENT");
    expect(state.done).toBeUndefined();
    expect(state.questionText).toBe("Tell");
  });
});

describe("inferStreamingQuestion", () => {
  const answered = transcriptItem("question", Q1, 3, { main_number: 2 });

  it("is the next main question after a reaction", () => {
    expect(inferStreamingQuestion(answered, true)).toEqual({ position: 4, question_kind: "main", main_number: 3 });
  });

  it("is a follow-up of the same main question without one (EC12)", () => {
    expect(inferStreamingQuestion(answered, false)).toEqual({ position: 4, question_kind: "follow_up", main_number: 2 });
  });
});
