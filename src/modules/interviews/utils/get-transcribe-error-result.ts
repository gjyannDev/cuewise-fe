import { parseApiError } from "@/lib/config/api.helper";

import { RESYNC_ERROR_CODES, TRANSCRIPTION_ERROR_MESSAGES, TRANSCRIPTION_UNAVAILABLE_MESSAGE } from "../constants";
import type { TranscribeErrorResult } from "../types/interviews.types";

const resyncCodes = new Set<string>(RESYNC_ERROR_CODES);

/**
 * How the composer should react to a failed transcription. A 404 (interview gone) or a resync 409 (no longer in
 * progress) refetches the interview, like a failed answer. Everything else is one of a few fixed messages: the
 * backend's own text is never shown, and anything unexpected (no response included) reads as "not available".
 */
export function getTranscribeErrorResult(error: unknown): TranscribeErrorResult {
  const { status, code } = parseApiError(error);
  if (status === 404 || (status === 409 && code !== undefined && resyncCodes.has(code))) {
    return { kind: "resync" };
  }
  const message = code === undefined ? undefined : TRANSCRIPTION_ERROR_MESSAGES[code];
  return { kind: "message", message: message ?? TRANSCRIPTION_UNAVAILABLE_MESSAGE };
}
