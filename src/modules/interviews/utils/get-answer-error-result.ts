import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";

import { RESYNC_ERROR_CODES } from "../constants";
import { AnswerStreamError } from "./answer-stream-error";
import type { AnswerErrorResult } from "../types/interviews.types";

const resyncCodes = new Set<string>(RESYNC_ERROR_CODES);

/**
 * How the interview screen should react to a failed answer. A 409 means the backend has moved on (answered in
 * another tab, or completed) and a 404 means the interview is gone: both refetch so the screen shows the truth.
 * No response at all is "unknown": cuewise-be saves the turn after the LLM call, so it may have succeeded.
 */
export function getAnswerErrorResult(error: unknown): AnswerErrorResult {
  // After the stream opened: an `error` event (nothing saved) or a stream that broke off (maybe saved).
  if (error instanceof AnswerStreamError) {
    if (error.kind === "interrupted") {
      return { kind: "unknown" };
    }
    return error.code !== undefined && resyncCodes.has(error.code) ? { kind: "resync" } : { kind: "toast" };
  }
  if (isNoResponseError(error)) {
    return { kind: "unknown" };
  }
  const { status, code, fieldErrors } = parseApiError(error);

  if (status === 404 || (status === 409 && code !== undefined && resyncCodes.has(code))) {
    return { kind: "resync" };
  }
  if (status === 422 && fieldErrors.answer) {
    return { kind: "field", message: fieldErrors.answer };
  }
  return { kind: "toast" };
}
