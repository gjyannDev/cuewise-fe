import { INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL } from "../constants";

/** Picked once per answer, in the submit handler (never during render). `random` is injectable for tests. */
export function pickThinkingLabel(previous: string | undefined, isLast: boolean, random = Math.random): string {
  if (isLast) {
    return INTERVIEWER_WRAP_UP_LABEL;
  }
  const candidates = INTERVIEWER_THINKING_LABELS.filter((label) => label !== previous);
  return candidates[Math.floor(random() * candidates.length)];
}
