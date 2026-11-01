import { describe, expect, it } from "vitest";

import { buildThreadView } from "@/modules/interviews/utils/build-thread-view";
import { Q1, Q2, transcriptItem } from "@tests/helpers/interviews";

const answered = [transcriptItem("question", Q1, 1), transcriptItem("answer", Q1, 1), transcriptItem("reaction", Q1, 1)];

describe("buildThreadView", () => {
  it("keys every item by question and kind, so a refetch that changes ids never remounts a bubble", () => {
    const { items } = buildThreadView(answered, {});

    expect(items.map(({ key }) => key)).toEqual([`${Q1}:question`, `${Q1}:answer`, `${Q1}:reaction`]);
  });

  it("appends the pending answer last, as a candidate bubble keyed like the stored answer that will replace it", () => {
    const { items } = buildThreadView([transcriptItem("question", Q1, 1)], {
      pendingAnswer: { questionId: Q1, text: "We talked it through." },
    });

    expect(items.at(-1)).toEqual(
      expect.objectContaining({
        key: `${Q1}:answer`,
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

  it("hides the next question during the reveal pause, and progress stays on the answered one", () => {
    const view = buildThreadView([...answered, transcriptItem("question", Q2, 2)], { hiddenQuestionId: Q2 });

    expect(view.items.map(({ key }) => key)).not.toContain(`${Q2}:question`);
    expect(view.mainNumber).toBe(1);
  });

  it("holds back a reaction that arrived while the thinking indicator is still up (a fast reply)", () => {
    const { items } = buildThreadView(answered, { hiddenReactionQuestionId: Q1 });

    expect(items.map(({ key }) => key)).toEqual([`${Q1}:question`, `${Q1}:answer`]);
  });

  it("reports the unanswered last question as open, even while it is hidden (the composer answers it next)", () => {
    const next = transcriptItem("question", Q2, 2);

    expect(buildThreadView([...answered, next], { hiddenQuestionId: Q2 }).openQuestion).toEqual(next);
  });

  it("has no open question once every question is answered", () => {
    expect(buildThreadView(answered, {}).openQuestion).toBeUndefined();
  });

  it("without a send in progress, shows the transcript as is, with progress on the last question", () => {
    const transcript = [...answered, transcriptItem("question", Q2, 2)];

    const view = buildThreadView(transcript, {});

    expect(view.items).toEqual(transcript.map((item) => ({ ...item, key: `${item.question_id}:${item.kind}` })));
    expect(view.mainNumber).toBe(2);
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

    it("keeps progress on the current main question while a follow-up is held back for the reveal", () => {
      const view = buildThreadView([...mainAnswered, followUp(Q2, 2, 1)], { hiddenQuestionId: Q2 });

      expect(view.mainNumber).toBe(1);
      expect(view.openQuestion).toEqual(followUp(Q2, 2, 1));
    });

    it("shows a main question answered without a reaction as is (nothing in place of the reaction)", () => {
      const transcript = [...mainAnswered, followUp(Q2, 2, 1)];

      expect(buildThreadView(transcript, {}).items.map(({ key }) => key)).toEqual([
        `${Q1}:question`,
        `${Q1}:answer`,
        `${Q2}:question`,
      ]);
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
