import { FOLLOW_UP_CAPTION, LEVEL_LABELS, MINUTES_PER_QUESTION, ROLE_LABELS } from "../constants";
import type { InterviewSession, TranscriptItem } from "../types/interviews.types";

/** The interview named the way you'd say it out loud ("Junior Backend interview"); the style and length live elsewhere. */
export const formatInterviewTitle = ({ level, role }: Pick<InterviewSession, "level" | "role">) =>
  `${LEVEL_LABELS[level]} ${ROLE_LABELS[role]} interview`;

/** A recording's length as a clock ("1:05"). */
export const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

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

/** A rough length for the lobby: a few minutes a question, rounded up to the next 5 (a guide, not a promise). */
export const estimateMinutes = (questionCount: number) => Math.ceil((questionCount * MINUTES_PER_QUESTION) / 5) * 5;

/** The lobby's one-line summary: "Junior Backend · 3 questions · about 10 min". */
export const formatLobbySummary = ({
  level,
  role,
  question_count,
}: Pick<InterviewSession, "level" | "role" | "question_count">) =>
  `${LEVEL_LABELS[level]} ${ROLE_LABELS[role]} · ${formatQuestionCount(question_count)} · about ${estimateMinutes(question_count)} min`;
