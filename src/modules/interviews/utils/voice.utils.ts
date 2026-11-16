import { parseApiError } from "@/lib/config/api.helper";

import {
  RESYNC_ERROR_CODES,
  SPEECH_RATE_LIMITED_MESSAGE,
  SPEECH_UNAVAILABLE_MESSAGE,
  TRANSCRIPTION_ERROR_MESSAGES,
  TRANSCRIPTION_UNAVAILABLE_MESSAGE,
} from "../constants";
import type {
  AnswerResponse,
  InterviewerLine,
  SpeechErrorResult,
  TranscribeErrorResult,
} from "../types/interviews.types";

const resyncCodes = new Set<string>(RESYNC_ERROR_CODES);

/**
 * How the room should react to a failed transcription. A 404 (interview gone) or a resync 409 (no longer in
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

/**
 * What the interviewer says after a saved turn, in order: the reaction (if the turn has one), then the next question or
 * follow-up (if the interview goes on). A follow-up comes with no reaction; the last answer gets only a reaction.
 */
export function planSpokenLines({ reaction, current_question }: AnswerResponse): InterviewerLine[] {
  const lines: InterviewerLine[] = [];
  if (reaction) lines.push({ kind: "reaction", id: reaction.id });
  if (current_question) lines.push({ kind: "question", id: current_question.id });
  return lines;
}

/**
 * How the room reacts to a failed speech fetch. The line is always in the transcript, so nothing here is fatal: a 404
 * means the interview changed under us (refetch it), 429 is the replay limit, and everything else (503, no response,
 * a body that isn't audio) is the one "couldn't play" message. Backend text is never shown.
 */
export function getSpeechErrorResult(error: unknown): SpeechErrorResult {
  const { status } = parseApiError(error);
  if (status === 404) return { kind: "resync" };
  if (status === 429) return { kind: "message", message: SPEECH_RATE_LIMITED_MESSAGE };
  return { kind: "message", message: SPEECH_UNAVAILABLE_MESSAGE };
}
