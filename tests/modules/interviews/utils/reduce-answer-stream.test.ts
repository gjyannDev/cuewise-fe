import { describe, expect, it } from "vitest";

import type { AnswerStreamEvent } from "@/modules/interviews/types/interviews.types";
import {
  ANSWER_STREAM_START,
  inferStreamingQuestion,
  reduceAnswerStream,
} from "@/modules/interviews/utils/reduce-answer-stream";
import { answerResponse, Q2, REACTION, transcriptItem, Q1 } from "@tests/helpers/interviews";

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
