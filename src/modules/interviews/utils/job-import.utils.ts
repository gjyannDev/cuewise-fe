import { parseApiError } from "@/lib/config/api.helper";

import {
  JOB_DESCRIPTION_MAX_LENGTH,
  JOB_IMPORT_FAILED_MESSAGE,
  JOB_PASTE_MAX_CHARS,
  JOB_TEXT_ERROR_CODE,
  JOB_URL_ERROR_CODES,
} from "../constants";
import type { JobImportErrorResult, JobTextRequest } from "../types/interviews.types";

/**
 * Whether a paste into the job description should go to cuewise-be for cleaning instead of into the box. Only a paste
 * that can't fit on its own: that is a whole copied page, not a snippet. Smaller pastes behave as usual, even if the
 * box then overflows (its counter says so), so text the candidate typed is never replaced by surprise.
 */
export function shouldCleanPaste(plainText: string): boolean {
  return plainText.length > JOB_DESCRIPTION_MAX_LENGTH;
}

/**
 * The clipboard copy to send. HTML keeps the page's structure, which lets the server drop menus, footers and "similar
 * jobs"; plain text has lost it. An HTML copy over the server's limit is not cut (that would break it mid-tag): the
 * plain text goes instead, capped at the limit.
 */
export function buildPastePayload({ html, text }: { html: string; text: string }): JobTextRequest {
  if (html.trim() !== "" && html.length <= JOB_PASTE_MAX_CHARS) {
    return { content: html, format: "html" };
  }
  return { content: text.slice(0, JOB_PASTE_MAX_CHARS), format: "text" };
}

const urlErrorCodes = new Set<string>(JOB_URL_ERROR_CODES);

/**
 * Where a failed import is shown. The three import codes go next to the control they are about, with cuewise-be's
 * message (written for the candidate, and deliberately generic about the cause). A rate limit is a toast with its
 * message. Anything else (no response, a 5xx, a validation error) is one generic toast: never a raw message.
 */
export function getJobImportErrorResult(error: unknown): JobImportErrorResult {
  const { status, code, message } = parseApiError(error);
  if (code !== undefined && urlErrorCodes.has(code)) {
    return { kind: "field", target: "url", message };
  }
  if (code === JOB_TEXT_ERROR_CODE) {
    return { kind: "field", target: "jobDescription", message };
  }
  if (status === 429 && code !== undefined) {
    return { kind: "toast", message };
  }
  return { kind: "toast", message: JOB_IMPORT_FAILED_MESSAGE };
}
