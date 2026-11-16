import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";

import { INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, RESYNC_ERROR_CODES } from "../constants";
import type {
  AnswerErrorResult,
  AnswerRequest,
  AnswerResponse,
  Reaction,
  TranscriptLine,
  TranscriptView,
  Transcript,
  TranscriptItem,
} from "../types/interviews.types";
import { AnswerStreamError, inferStreamingQuestion } from "./stream.utils";

/**
 * The transcript after a successful answer, built from the request and response so no GET is needed: the answer (and the
 * reaction, when the interviewer moved on) go right after the answered question, then the next question (if any).
 * A follow-up turn has no reaction. Each line carries its question's position, kind and main number, as the
 * transcript returns them. The answer item gets a client id (the response doesn't return the stored one); a later
 * refetch replaces it with the real one.
 */
export function appendAnswerTurn(
  transcript: Transcript | undefined,
  { question_id, answer }: AnswerRequest,
  { reaction, current_question }: AnswerResponse,
): Transcript | undefined {
  if (!transcript || transcript.items.some((item) => item.kind === "answer" && item.question_id === question_id)) {
    return transcript;
  }
  const index = transcript.items.findIndex((item) => item.kind === "question" && item.question_id === question_id);
  if (index === -1) {
    return transcript;
  }
  const { position, question_kind, main_number } = transcript.items[index];
  const ofQuestion = { question_id, position, question_kind, main_number, created_at: null };

  const turn: TranscriptItem[] = [
    { ...ofQuestion, id: `${question_id}-answer`, role: "candidate", kind: "answer", text: answer },
  ];
  if (reaction) {
    turn.push({ ...ofQuestion, id: reaction.id, role: "interviewer", kind: "reaction", text: reaction.text });
  }
  if (current_question) {
    turn.push({
      id: current_question.id,
      question_id: current_question.id,
      position: current_question.position,
      question_kind: current_question.question_kind,
      main_number: current_question.main_number,
      role: "interviewer",
      kind: "question",
      text: current_question.text,
      created_at: null,
    });
  }

  return { items: [...transcript.items.slice(0, index + 1), ...turn, ...transcript.items.slice(index + 1)] };
}

type TranscriptViewOptions = {
  /** The answer being sent, shown before the backend confirms it. */
  pendingAnswer?: { questionId: string; text: string };
  /** The transcribed answer under review (Send / Re-record), with a failed send's field error. */
  unsent?: { questionId: string; text: string; fieldError?: string };
  /** What the turn in progress has streamed so far: never saved, replaced by the saved lines once `done` lands. */
  streaming?: { answered: TranscriptItem; reaction?: NonNullable<Reaction>; questionText: string };
};

/**
 * Position and kind: unique in an interview (the answer and reaction share their question's position), stable across
 * refetches, and known for the question being streamed before it has an id. So a streamed line keeps its key, and its
 * bubble, when the saved line replaces it.
 */
const keyOf = (item: Pick<TranscriptItem, "position" | "kind">) => `${item.position}:${item.kind}`;

/** What the transcript renders, derived from the cached transcript plus the send in progress. */
export function buildTranscriptView(
  transcript: TranscriptItem[],
  { pendingAnswer, unsent, streaming }: TranscriptViewOptions,
): TranscriptView {
  const items: TranscriptLine[] = transcript.map((item) => ({ ...item, key: keyOf(item) }));

  const isStored = (questionId: string) =>
    transcript.some((item) => item.kind === "answer" && item.question_id === questionId);
  // The candidate's own answer line, before it is stored: under review (unsent) or on its way (pending). Same key either
  // way, so the bubble stays put (and isn't re-announced) as Send turns it from one into the other.
  const ownAnswer = (questionId: string, text: string): TranscriptLine => {
    const question = transcript.find((item) => item.kind === "question" && item.question_id === questionId);
    const line: TranscriptItem = {
      id: `${questionId}-answer`,
      question_id: questionId,
      position: question?.position ?? 0,
      question_kind: question?.question_kind ?? "main",
      main_number: question?.main_number ?? 0,
      role: "candidate",
      kind: "answer",
      text,
      created_at: null,
    };
    return { ...line, key: keyOf(line) };
  };
  if (pendingAnswer && !isStored(pendingAnswer.questionId)) {
    items.push({ ...ownAnswer(pendingAnswer.questionId, pendingAnswer.text), pending: true });
  } else if (unsent && !isStored(unsent.questionId)) {
    const line: TranscriptLine = { ...ownAnswer(unsent.questionId, unsent.text), unsent: true };
    items.push(unsent.fieldError ? { ...line, fieldError: unsent.fieldError } : line);
  }

  // Once the saved turn is in the transcript (`done`), it replaces the streamed lines under the same keys.
  if (streaming && !isStored(streaming.answered.question_id)) {
    const { answered, reaction, questionText } = streaming;
    if (reaction) {
      const line: TranscriptItem = {
        ...answered,
        id: reaction.id,
        role: "interviewer",
        kind: "reaction",
        text: reaction.text,
        created_at: null,
      };
      items.push({ ...line, key: keyOf(line), streaming: true });
    }
    if (questionText) {
      const placement = inferStreamingQuestion(answered, reaction !== undefined);
      const id = `${answered.question_id}-next`;
      const line: TranscriptItem = {
        ...placement,
        id,
        question_id: id,
        role: "interviewer",
        kind: "question",
        text: questionText,
        created_at: null,
      };
      items.push({ ...line, key: keyOf(line), streaming: true });
    }
  }

  const lastQuestion = transcript.findLast((item) => item.kind === "question");
  const openQuestion = lastQuestion && !isStored(lastQuestion.question_id) ? lastQuestion : undefined;
  return { items, mainNumber: lastQuestion?.main_number ?? 0, openQuestion };
}

/**
 * Picked once per answer, in the submit handler (never during render). Wraps up for the whole last main question's
 * transcript (its follow-ups too), by main number: `position` counts follow-ups, so it can't tell. A follow-up may still
 * come after "Wrapping up…", which reads fine. `random` is injectable for tests.
 */
export function pickThinkingLabel(
  previous: string | undefined,
  question: Pick<TranscriptItem, "main_number">,
  questionCount: number,
  random = Math.random,
): string {
  if (question.main_number === questionCount) {
    return INTERVIEWER_WRAP_UP_LABEL;
  }
  const candidates = INTERVIEWER_THINKING_LABELS.filter((label) => label !== previous);
  return candidates[Math.floor(random() * candidates.length)];
}

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

/** What the interviewer said last (the stage's captions): plain text, empty before anything was said. */
export function latestInterviewerText(items: TranscriptLine[]): string {
  return items.findLast((item) => item.role === "interviewer")?.text ?? "";
}
