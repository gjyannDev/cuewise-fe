import type { Interview, InterviewStep } from "../types/interviews.types";

/** cuewise-be drops the current question once the last answer completes the session, so its absence decides. */
export function getInterviewStep({ current_question }: Interview): InterviewStep {
  return current_question ? { kind: "question", question: current_question } : { kind: "completed" };
}
