import { parseApiError } from "@/lib/config/api.helper";

import { START_ERROR_CODES } from "../constants";
import { sessionParamSchema } from "../schemas/interviews.schema";
import type {
  Interview,
  InterviewStep,
  SessionParam,
  StartInterviewFieldErrors,
  StartInterviewFormValues,
} from "../types/interviews.types";

/** Classifies `?session=`: absent or empty means the setup form; anything but a single UUID is invalid. */
export function parseSessionParam(raw: string | string[] | undefined): SessionParam {
  if (raw === undefined || raw === "") {
    return { kind: "none" };
  }
  const parsed = sessionParamSchema.safeParse(raw);
  return parsed.success ? { kind: "valid", id: parsed.data } : { kind: "invalid" };
}

const FORM_FIELDS = new Set<string>([
  "role",
  "level",
  "interview_type",
  "question_count",
  "job_description",
  "use_profile",
] satisfies (keyof StartInterviewFormValues)[]);

/**
 * Field errors to show on the setup form after a failed start, or null when the error belongs in a toast.
 * cuewise-be has two 409s here. PROFILE_REQUIRED (use_profile with no stored résumé) goes under the résumé toggle.
 * NOT_ENOUGH_QUESTIONS (the bank can't fill this role/level/type/count) names no field in its details, so it goes
 * under the question count, the field the user is most likely to change.
 */
export function getStartErrorResult(error: unknown): StartInterviewFieldErrors | null {
  const apiError = parseApiError(error);

  if (apiError.status === 409) {
    return apiError.code === START_ERROR_CODES.profileRequired
      ? { use_profile: apiError.message }
      : { question_count: apiError.message };
  }

  const fieldErrors = Object.fromEntries(
    Object.entries(apiError.fieldErrors).filter(([field]) => FORM_FIELDS.has(field)),
  );
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

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
