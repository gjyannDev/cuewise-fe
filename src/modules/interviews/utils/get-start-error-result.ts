import { parseApiError } from "@/lib/config/api.helper";

import type { StartInterviewFieldErrors, StartInterviewFormValues } from "../types/interviews.types";

const FORM_FIELDS = new Set<string>([
  "role",
  "level",
  "interview_type",
  "question_count",
  "job_description",
] satisfies (keyof StartInterviewFormValues)[]);

/**
 * Field errors to show on the setup form after a failed start, or null when the error belongs in a toast.
 * cuewise-be's only 409 here is NOT_ENOUGH_QUESTIONS (the bank can't fill this role/level/type/count);
 * its details name no field, so it goes under the question count, the field the user is most likely to change.
 */
export function getStartErrorResult(error: unknown): StartInterviewFieldErrors | null {
  const apiError = parseApiError(error);

  if (apiError.status === 409) {
    return { question_count: apiError.message };
  }

  const fieldErrors = Object.fromEntries(
    Object.entries(apiError.fieldErrors).filter(([field]) => FORM_FIELDS.has(field)),
  );
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}
