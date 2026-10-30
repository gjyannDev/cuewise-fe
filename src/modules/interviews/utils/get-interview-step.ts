import type { Interview, InterviewStep } from "../types/interviews.types";

/**
 * cuewise-be drops the current question once the last answer completes the session, so its absence decides.
 * An abandoned session can't be answered (409), so it ends whatever question it still points at.
 */
export function getInterviewStep({ session, current_question }: Interview): InterviewStep {
  if (session.status === "abandoned") {
    return { kind: "ended" };
  }
  return current_question ? { kind: "question", question: current_question } : { kind: "completed" };
}
