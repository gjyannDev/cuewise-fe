import { FOLLOW_UP_CAPTION } from "../constants";
import type { TranscriptItem } from "../types/interviews.types";

export const formatQuestionCount = (count: number) => `${count} ${count === 1 ? "question" : "questions"}`;

export const formatQuestionPosition = (position: number, total: number) => `Question ${position} of ${total}`;

/** The caption above a question: main questions are counted by main number, follow-ups aren't counted. */
export const formatQuestionCaption = (
  { question_kind, main_number }: Pick<TranscriptItem, "question_kind" | "main_number">,
  total: number,
) => (question_kind === "follow_up" ? FOLLOW_UP_CAPTION : formatQuestionPosition(main_number, total));
