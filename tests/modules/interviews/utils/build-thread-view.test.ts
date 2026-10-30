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
    expect(view.position).toBe(1);
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
    expect(view.position).toBe(2);
  });
});
