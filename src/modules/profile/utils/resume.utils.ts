import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";

import { RESUME_UPLOAD_UNCONFIRMED_MESSAGE } from "../constants";
import type { ResumeUploadErrorResult } from "../types/profile.types";

/**
 * Where a failed résumé upload is shown. cuewise-be's refusals (413, 415, 422, 502, 503) carry a message written for
 * the candidate that ends with a next step, so it stays on the page as an alert; a 429 is passing, so it is a toast.
 * No reply at all is checked first: the backend may still have stored the profile, so the page reloads it.
 */
export function getResumeUploadErrorResult(error: unknown): ResumeUploadErrorResult {
  if (isNoResponseError(error)) {
    return { kind: "unconfirmed", message: RESUME_UPLOAD_UNCONFIRMED_MESSAGE };
  }
  const { status, message } = parseApiError(error);
  return status === 429 ? { kind: "toast", message } : { kind: "alert", message };
}
