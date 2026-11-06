import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { ApiResponseError, NoResponseError } from "@/lib/config/api.helper";
import { INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL } from "@/modules/interviews/constants";
import {
  appendAnswerTurn,
  buildThreadView,
  getAnswerErrorResult,
  pickThinkingLabel,
} from "@/modules/interviews/utils/chat.utils";
import { AnswerStreamError } from "@/modules/interviews/utils/stream.utils";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";
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

const question1 = transcriptItem("question", Q1, 1);
const answered = [question1, transcriptItem("answer", Q1, 1), transcriptItem("reaction", Q1, 1)];
const keys = (items: { key: string }[]) => items.map(({ key }) => key);

describe("buildThreadView", () => {
  it("keys every item by position and kind, so a refetch that changes ids never remounts a bubble", () => {
    const refetched = answered.map((item) => ({ ...item, id: `${item.id.slice(0, -4)}ffff` }));

    expect(keys(buildThreadView(answered, {}).items)).toEqual(["1:question", "1:answer", "1:reaction"]);
    expect(keys(buildThreadView(refetched, {}).items)).toEqual(["1:question", "1:answer", "1:reaction"]);
  });

  it("appends the pending answer last, as a candidate bubble keyed like the stored answer that will replace it", () => {
    const { items } = buildThreadView([question1], { pendingAnswer: { questionId: Q1, text: "We talked it through." } });

    expect(items.at(-1)).toEqual(
      expect.objectContaining({
        key: "1:answer",
        question_id: Q1,
        position: 1,
        role: "candidate",
        kind: "answer",
        text: "We talked it through.",
        pending: true,
      }),
    );
  });

  it("drops the pending answer once the thread holds the stored one, so it never shows twice", () => {
    const { items } = buildThreadView(answered, { pendingAnswer: { questionId: Q1, text: "We talked it through." } });

    expect(items.filter(({ kind }) => kind === "answer")).toHaveLength(1);
    expect(items.some(({ pending }) => pending)).toBe(false);
  });

  it("reports the unanswered last question as open", () => {
    const next = transcriptItem("question", Q2, 2);

    expect(buildThreadView([...answered, next], {}).openQuestion).toEqual(next);
  });

  it("has no open question once every question is answered", () => {
    expect(buildThreadView(answered, {}).openQuestion).toBeUndefined();
  });

  it("without a send in progress, shows the transcript as is, with progress on the last question", () => {
    const transcript = [...answered, transcriptItem("question", Q2, 2)];

    const view = buildThreadView(transcript, {});

    expect(view.items).toEqual(transcript.map((item) => ({ ...item, key: `${item.position}:${item.kind}` })));
    expect(view.mainNumber).toBe(2);
  });

  describe("while a turn streams", () => {
    const pendingAnswer = { questionId: Q1, text: "We talked it through." };

    it("adds the reaction, then the question as it is written, after the pending answer", () => {
      const view = buildThreadView([question1], {
        pendingAnswer,
        streaming: { answered: question1, reaction: REACTION, questionText: "Tell me about " },
      });

      expect(keys(view.items)).toEqual(["1:question", "1:answer", "1:reaction", "2:question"]);
      expect(view.items[2]).toMatchObject({ kind: "reaction", text: REACTION.text, streaming: true });
      expect(view.items[3]).toMatchObject({
        kind: "question",
        role: "interviewer",
        text: "Tell me about ",
        question_kind: "main",
        main_number: 2,
        streaming: true,
      });
    });

    it("captions a question streamed without a reaction as a follow-up (EC12)", () => {
      const view = buildThreadView([question1], { pendingAnswer, streaming: { answered: question1, questionText: "Why?" } });

      expect(view.items.at(-1)).toMatchObject({ key: "2:question", question_kind: "follow_up", main_number: 1 });
    });

    it("adds only the reaction while nothing is written, e.g. a completing answer (EC14)", () => {
      const view = buildThreadView([question1], {
        pendingAnswer,
        streaming: { answered: question1, reaction: REACTION, questionText: "" },
      });

      expect(keys(view.items)).toEqual(["1:question", "1:answer", "1:reaction"]);
    });

    it("keeps transient lines out of progress and the open question", () => {
      const view = buildThreadView([question1], {
        pendingAnswer,
        streaming: { answered: question1, reaction: REACTION, questionText: "Tell me" },
      });

      expect(view.mainNumber).toBe(1);
      expect(view.openQuestion).toEqual(question1);
    });

    it("shows the saved turn under the same keys, with no transient duplicates, once it is in the transcript (AC12, EC22)", () => {
      const saved = [...answered, transcriptItem("question", Q2, 2)].map((item) =>
        item.kind === "reaction" ? { ...item, text: "Saved wording." } : item,
      );

      const view = buildThreadView(saved, {
        pendingAnswer,
        streaming: { answered: question1, reaction: REACTION, questionText: "Tell me" },
      });

      expect(keys(view.items)).toEqual(["1:question", "1:answer", "1:reaction", "2:question"]);
      expect(view.items.some(({ streaming }) => streaming)).toBe(false);
      expect(view.items[2].text).toBe("Saved wording.");
    });
  });

  describe("with follow-ups", () => {
    const followUp = (id: string, position: number, mainNumber: number) =>
      transcriptItem("question", id, position, { question_kind: "follow_up", main_number: mainNumber });
    const mainAnswered = [transcriptItem("question", Q1, 1), transcriptItem("answer", Q1, 1)];

    it("keeps progress on the main question while one of its follow-ups is the latest question", () => {
      expect(buildThreadView([...mainAnswered, followUp(Q2, 2, 1)], {}).mainNumber).toBe(1);
    });

    it("never reports more than the main question count, however many follow-ups there are", () => {
      const ids = Array.from({ length: 15 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
      // 5 main questions with 2 follow-ups each: positions 1..15, main numbers 1..5.
      const transcript = ids.map((id, i) =>
        i % 3 === 0
          ? transcriptItem("question", id, i + 1, { main_number: i / 3 + 1 })
          : followUp(id, i + 1, Math.floor(i / 3) + 1),
      );

      expect(buildThreadView(transcript, {}).mainNumber).toBe(5);
    });

    it("shows a main question answered without a reaction as is (nothing in place of the reaction)", () => {
      const transcript = [...mainAnswered, followUp(Q2, 2, 1)];

      expect(keys(buildThreadView(transcript, {}).items)).toEqual(["1:question", "1:answer", "2:question"]);
    });

    it("gives a pending answer to a follow-up that follow-up's kind and main number", () => {
      const { items } = buildThreadView([...mainAnswered, followUp(Q2, 2, 1)], {
        pendingAnswer: { questionId: Q2, text: "Token bucket." },
      });

      expect(items.at(-1)).toEqual(
        expect.objectContaining({ question_id: Q2, kind: "answer", question_kind: "follow_up", main_number: 1, pending: true }),
      );
    });
  });
});

const COUNT = 3;
const lastMain = transcriptItem("question", Q1, 3, { main_number: 3 });
const earlierMain = transcriptItem("question", Q1, 1, { main_number: 1 });
const followUpOf = (mainNumber: number, position: number) =>
  transcriptItem("question", Q2, position, { question_kind: "follow_up", main_number: mainNumber });

describe("pickThinkingLabel", () => {
  it("uses the wrap-up label when answering the last main question", () => {
    expect(pickThinkingLabel(undefined, lastMain, COUNT)).toBe(INTERVIEWER_WRAP_UP_LABEL);
  });

  it("uses the wrap-up label when answering a follow-up of the last main question", () => {
    expect(pickThinkingLabel(undefined, followUpOf(3, 5), COUNT)).toBe(INTERVIEWER_WRAP_UP_LABEL);
  });

  it("doesn't wrap up on a follow-up of an earlier main question, even when its position equals the count", () => {
    expect(INTERVIEWER_THINKING_LABELS).toContain(pickThinkingLabel(undefined, followUpOf(1, COUNT), COUNT));
  });

  it("otherwise picks one of the thinking labels, driven by the random source", () => {
    expect(pickThinkingLabel(undefined, earlierMain, COUNT, () => 0)).toBe(INTERVIEWER_THINKING_LABELS[0]);
    expect(pickThinkingLabel(undefined, earlierMain, COUNT, () => 0.99)).toBe(INTERVIEWER_THINKING_LABELS.at(-1));
  });

  it("never repeats the previous label, even when the random source lands on it", () => {
    const previous = INTERVIEWER_THINKING_LABELS[0];

    const picked = pickThinkingLabel(previous, earlierMain, COUNT, () => 0);

    expect(picked).not.toBe(previous);
    expect(INTERVIEWER_THINKING_LABELS).toContain(picked);
  });
});

describe("getAnswerErrorResult for the answer stream", () => {
  it.each([
    ["QUESTION_NOT_CURRENT", "resync"],
    ["SESSION_NOT_IN_PROGRESS", "resync"],
    ["INTERNAL_ERROR", "toast"],
  ])("maps an error event %s to %s (EC5)", (code, kind) => {
    expect(getAnswerErrorResult(new AnswerStreamError("event", code))).toEqual({ kind });
  });

  it("treats an interrupted stream as an unknown outcome (EC6, EC10, EC20)", () => {
    expect(getAnswerErrorResult(new AnswerStreamError("interrupted"))).toEqual({ kind: "unknown" });
  });

  it("maps fetch failures before the stream like axios ones (EC2-EC4)", () => {
    expect(getAnswerErrorResult(new ApiResponseError(404, errorBody("NOT_FOUND", "Gone")))).toEqual({ kind: "resync" });
    expect(getAnswerErrorResult(new ApiResponseError(409, errorBody("QUESTION_NOT_CURRENT", "x")))).toEqual({
      kind: "resync",
    });
    const tooLong = errorBody("VALIDATION_ERROR", "Invalid", [{ field: "body.answer", issue: "Too long" }]);
    expect(getAnswerErrorResult(new ApiResponseError(422, tooLong))).toEqual({ kind: "field", message: "Too long" });
    expect(getAnswerErrorResult(new NoResponseError())).toEqual({ kind: "unknown" });
  });
});

describe("getAnswerErrorResult", () => {
  // Codes verified against cuewise-be app/core/errors.py.
  it.each([
    ["QUESTION_NOT_CURRENT", "This is not the current question of the interview"],
    ["SESSION_NOT_IN_PROGRESS", "This interview is not in progress"],
  ])("resyncs on a 409 %s", (code, message) => {
    expect(getAnswerErrorResult(axiosErrorWith(409, errorBody(code, message)))).toEqual({ kind: "resync" });
  });

  it("resyncs on a 404 so the refetch shows the not-found state", () => {
    expect(getAnswerErrorResult(axiosErrorWith(404, errorBody("NOT_FOUND", "Interview not found")))).toEqual({
      kind: "resync",
    });
  });

  it("puts a 422 on the answer under the answer field", () => {
    const error = axiosErrorWith(
      422,
      errorBody("VALIDATION_ERROR", "Invalid input", [
        { field: "body.answer", issue: "String should have at most 2000 characters" },
      ]),
    );

    expect(getAnswerErrorResult(error)).toEqual({
      kind: "field",
      message: "String should have at most 2000 characters",
    });
  });

  it.each([
    [
      "a 422 that doesn't name the answer",
      axiosErrorWith(
        422,
        errorBody("VALIDATION_ERROR", "Invalid input", [{ field: "body.extra", issue: "Extra inputs are not permitted" }]),
      ),
    ],
    ["a 409 with another code", axiosErrorWith(409, errorBody("CONFLICT", "Conflict"))],
    ["a 500", axiosErrorWith(500, errorBody("INTERNAL_ERROR", "Something broke"))],
    ["a malformed response (zod error)", new Error("Invalid input: expected object")],
  ])("toasts %s", (_, error) => {
    expect(getAnswerErrorResult(error)).toEqual({ kind: "toast" });
  });

  it.each([
    ["a network error", networkError()],
    ["a timeout", new AxiosError("timeout of 45000ms exceeded", "ECONNABORTED")],
    ["the /api forwarder's 503", axiosErrorWith(503, errorBody("SERVICE_UNAVAILABLE", "Something went wrong"))],
  ])("treats %s as an unknown outcome (the answer may have been saved)", (_, error) => {
    expect(getAnswerErrorResult(error)).toEqual({ kind: "unknown" });
  });
});
