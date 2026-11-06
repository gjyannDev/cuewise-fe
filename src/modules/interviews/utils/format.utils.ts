import { FOLLOW_UP_CAPTION } from "../constants";
import type { TranscriptItem } from "../types/interviews.types";

/**
 * When an interview started, as a date and time in the reader's locale and time zone (both overridable, so tests are
 * deterministic). Only called in the browser, so the server never renders a time zone the reader isn't in.
 */
export function formatInterviewDate(iso: string, locale?: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(iso));
}

export const formatQuestionCount = (count: number) => `${count} ${count === 1 ? "question" : "questions"}`;

export const formatInterviewCount = (count: number) => `${count} ${count === 1 ? "interview" : "interviews"}`;

export const formatQuestionPosition = (position: number, total: number) => `Question ${position} of ${total}`;

/** The history table's progress: main questions finished out of the interview's count (follow-ups aren't counted). */
export const formatProgress = (answered: number, total: number) => `${answered} of ${total}`;

/** The caption above a question: main questions are counted by main number, follow-ups aren't counted. */
export const formatQuestionCaption = (
  { question_kind, main_number }: Pick<TranscriptItem, "question_kind" | "main_number">,
  total: number,
) => (question_kind === "follow_up" ? FOLLOW_UP_CAPTION : formatQuestionPosition(main_number, total));
