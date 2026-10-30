import { describe, expect, it } from "vitest";

import { INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL } from "@/modules/interviews/constants";
import { pickThinkingLabel } from "@/modules/interviews/utils/pick-thinking-label";

describe("pickThinkingLabel", () => {
  it("uses the wrap-up label when answering the last question", () => {
    expect(pickThinkingLabel(undefined, true)).toBe(INTERVIEWER_WRAP_UP_LABEL);
  });

  it("otherwise picks one of the thinking labels, driven by the random source", () => {
    expect(pickThinkingLabel(undefined, false, () => 0)).toBe(INTERVIEWER_THINKING_LABELS[0]);
    expect(pickThinkingLabel(undefined, false, () => 0.99)).toBe(INTERVIEWER_THINKING_LABELS.at(-1));
  });

  it("never repeats the previous label, even when the random source lands on it", () => {
    const previous = INTERVIEWER_THINKING_LABELS[0];

    const picked = pickThinkingLabel(previous, false, () => 0);

    expect(picked).not.toBe(previous);
    expect(INTERVIEWER_THINKING_LABELS).toContain(picked);
  });
});
