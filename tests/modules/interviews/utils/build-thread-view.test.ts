import { describe, expect, it } from "vitest";

import { buildThreadView } from "@/modules/interviews/utils/build-thread-view";
import { Q1, Q2, REACTION, transcriptItem } from "@tests/helpers/interviews";

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
