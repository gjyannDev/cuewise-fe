import { describe, expect, it } from "vitest";

import { INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL } from "@/modules/interviews/constants";
import { pickThinkingLabel } from "@/modules/interviews/utils/pick-thinking-label";
import { Q1, Q2, transcriptItem } from "@tests/helpers/interviews";

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
