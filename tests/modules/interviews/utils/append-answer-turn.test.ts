import { describe, expect, it } from "vitest";

import { appendAnswerTurn } from "@/modules/interviews/utils/append-answer-turn";
import { answerResponse, Q1, Q2, Q3, REACTION, transcriptItem } from "@tests/helpers/interviews";

const request = { question_id: Q1, answer: "We talked it through." };

describe("appendAnswerTurn", () => {
  it("adds the answer, the reaction and the next question after the answered question", () => {
    const response = answerResponse({ id: Q2, position: 2 });

    const result = appendAnswerTurn({ items: [transcriptItem("question", Q1, 1)] }, request, response);

    expect(result?.items).toEqual([
      transcriptItem("question", Q1, 1),
      expect.objectContaining({ question_id: Q1, position: 1, role: "candidate", kind: "answer", text: request.answer }),
      expect.objectContaining({
        id: REACTION.id,
        question_id: Q1,
        position: 1,
        role: "interviewer",
        kind: "reaction",
        text: REACTION.text,
      }),
      expect.objectContaining({ id: Q2, question_id: Q2, position: 2, role: "interviewer", kind: "question", text: "question 2" }),
    ]);
  });

  it("adds no reaction line on a follow-up turn: the answer, then the follow-up", () => {
    const response = answerResponse({ id: Q2, position: 2, question_kind: "follow_up", main_number: 1 }, null);

    const result = appendAnswerTurn({ items: [transcriptItem("question", Q1, 1)] }, request, response);

    expect(result?.items.map(({ question_id, kind }) => [question_id, kind])).toEqual([
      [Q1, "question"],
      [Q1, "answer"],
      [Q2, "question"],
    ]);
  });

  it("gives the added lines the question kind and main number the transcript would return for them", () => {
    const followUp = transcriptItem("question", Q2, 2, { question_kind: "follow_up", main_number: 1 });
    const thread = { items: [transcriptItem("question", Q1, 1), transcriptItem("answer", Q1, 1), followUp] };
    const response = answerResponse({ id: Q3, position: 3, main_number: 2 });

    const result = appendAnswerTurn(thread, { question_id: Q2, answer: "Token bucket." }, response);

    expect(result?.items.slice(3)).toEqual([
      expect.objectContaining({ question_id: Q2, kind: "answer", position: 2, question_kind: "follow_up", main_number: 1 }),
      expect.objectContaining({ question_id: Q2, kind: "reaction", position: 2, question_kind: "follow_up", main_number: 1 }),
      expect.objectContaining({ question_id: Q3, kind: "question", position: 3, question_kind: "main", main_number: 2 }),
    ]);
  });

  it("adds only the answer and the closing reaction after the final answer", () => {
    const result = appendAnswerTurn({ items: [transcriptItem("question", Q1, 1)] }, request, answerResponse());

    expect(result?.items.map(({ kind }) => kind)).toEqual(["question", "answer", "reaction"]);
  });

  it("leaves the thread alone when that question already has an answer (a refetch landed first)", () => {
    const thread = {
      items: [transcriptItem("question", Q1, 1), transcriptItem("answer", Q1, 1), transcriptItem("reaction", Q1, 1)],
    };

    expect(appendAnswerTurn(thread, request, answerResponse({ id: Q2, position: 2 }))).toBe(thread);
  });

  it("passes an uncached thread through", () => {
    expect(appendAnswerTurn(undefined, request, answerResponse())).toBeUndefined();
  });

  it("leaves the thread alone when the answered question isn't in it (nowhere to place the turn)", () => {
    const thread = { items: [transcriptItem("question", Q2, 2)] };

    expect(appendAnswerTurn(thread, request, answerResponse())).toBe(thread);
  });
});
