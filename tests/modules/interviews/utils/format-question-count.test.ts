import { describe, expect, it } from "vitest";

import { FOLLOW_UP_CAPTION } from "@/modules/interviews/constants";
import { formatInterviewCount, formatProgress, formatQuestionCaption } from "@/modules/interviews/utils/format-question-count";
import { Q2, transcriptItem } from "@tests/helpers/interviews";

describe("formatInterviewCount", () => {
  it.each([
    [0, "0 interviews"],
    [1, "1 interview"],
    [12, "12 interviews"],
  ])("shows %i as %j (history AC8)", (total, text) => {
    expect(formatInterviewCount(total)).toBe(text);
  });
});

describe("formatProgress", () => {
  it.each([
    [0, 5, "0 of 5"],
    [2, 5, "2 of 5"],
    [5, 5, "5 of 5"],
  ])("shows %i answered of %i as %j (history AC3, EC13)", (answered, total, text) => {
    expect(formatProgress(answered, total)).toBe(text);
  });
});

describe("formatQuestionCaption", () => {
  it("numbers a main question by its main number, not its position (which counts follow-ups too)", () => {
    const question = transcriptItem("question", Q2, 4, { main_number: 2 });

    expect(formatQuestionCaption(question, 5)).toBe("Question 2 of 5");
  });

  it("captions a follow-up as a follow-up, with no number", () => {
    const followUp = transcriptItem("question", Q2, 2, { question_kind: "follow_up", main_number: 1 });

    expect(formatQuestionCaption(followUp, 5)).toBe(FOLLOW_UP_CAPTION);
    expect(FOLLOW_UP_CAPTION).toBe("Follow-up");
  });
});
