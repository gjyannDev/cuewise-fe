import { describe, expect, it } from "vitest";

import { appendAnswerTurn } from "@/modules/interviews/utils/append-answer-turn";
import { answerResponse, Q1, Q2, transcriptItem } from "@tests/helpers/interviews";

const request = { question_id: Q1, answer: "We talked it through." };

describe("appendAnswerTurn", () => {
  it("adds the answer, the reaction and the next question after the answered question", () => {
    const response = answerResponse({ id: Q2, position: 2 });

    const result = appendAnswerTurn({ items: [transcriptItem("question", Q1, 1)] }, request, response);

    expect(result?.items).toEqual([
      transcriptItem("question", Q1, 1),
      expect.objectContaining({ question_id: Q1, position: 1, role: "candidate", kind: "answer", text: request.answer }),
      expect.objectContaining({
        id: response.reaction.id,
        question_id: Q1,
        position: 1,
        role: "interviewer",
        kind: "reaction",
        text: response.reaction.text,
      }),
      expect.objectContaining({ id: Q2, question_id: Q2, position: 2, role: "interviewer", kind: "question", text: "question 2" }),
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
