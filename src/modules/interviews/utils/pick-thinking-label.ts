import { INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL } from "../constants";
import type { TranscriptItem } from "../types/interviews.types";

/**
 * Picked once per answer, in the submit handler (never during render). Wraps up for the whole last main question's
 * thread (its follow-ups too), by main number: `position` counts follow-ups, so it can't tell. A follow-up may still
 * come after "Wrapping up…", which reads fine. `random` is injectable for tests.
 */
export function pickThinkingLabel(
  previous: string | undefined,
  question: Pick<TranscriptItem, "main_number">,
  questionCount: number,
  random = Math.random,
): string {
  if (question.main_number === questionCount) {
    return INTERVIEWER_WRAP_UP_LABEL;
  }
  const candidates = INTERVIEWER_THINKING_LABELS.filter((label) => label !== previous);
  return candidates[Math.floor(random() * candidates.length)];
}
