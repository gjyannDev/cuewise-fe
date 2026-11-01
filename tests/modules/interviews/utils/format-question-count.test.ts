import { describe, expect, it } from "vitest";

import { FOLLOW_UP_CAPTION } from "@/modules/interviews/constants";
import { formatQuestionCaption } from "@/modules/interviews/utils/format-question-count";
import { Q2, transcriptItem } from "@tests/helpers/interviews";

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
