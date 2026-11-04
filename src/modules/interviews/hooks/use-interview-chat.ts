import { useReducer, useState } from "react";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";

import { INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE } from "../constants";
import { useAnswerInterviewMutation, useTranscribeAnswerMutation } from "../queries/interviews.queries";
import type { AnswerStreamEvent, TranscriptItem } from "../types/interviews.types";
import { buildThreadView } from "../utils/build-thread-view";
import { getAnswerErrorResult } from "../utils/get-answer-error-result";
import { getTranscribeErrorResult } from "../utils/get-transcribe-error-result";
import { pickThinkingLabel } from "../utils/pick-thinking-label";
import { ANSWER_STREAM_START, type AnswerStreamState, reduceAnswerStream } from "../utils/reduce-answer-stream";

/** A failed send: the composer puts the text back, with `message` under the field when the backend rejected it. */
export type SendFailure = { message?: string };

/**
 * How a transcription ended, for the composer: the text to add, a message to show, or nothing (the composer went
 * away, or the interview moved on and the screen is refetching).
 */
export type TranscribeResult = { kind: "text"; text: string } | { kind: "message"; message: string } | { kind: "none" };

/** A new send starts the live turn over; every other action is a stream event. */
type TurnAction = AnswerStreamEvent | { event: "start" };
const reduceTurn = (state: AnswerStreamState, action: TurnAction) =>
  action.event === "start" ? ANSWER_STREAM_START : reduceAnswerStream(state, action);

/**
 * Sending answers in the chat: the optimistic answer bubble, the thinking indicator, and the turn as it streams in
 * (the reaction, then the question typing in) until the saved turn replaces it. Nothing is delayed on purpose: what
 * the candidate sees follows the backend's events. The slow-label timer starts in `submit` (one user action), not in
 * an effect; the container is keyed per session.
 */
export function useInterviewChat(sessionId: string, transcript: TranscriptItem[], questionCount: number) {
  const [turn, dispatch] = useReducer(reduceTurn, ANSWER_STREAM_START);
  const answer = useAnswerInterviewMutation(sessionId, { onEvent: dispatch });
  const transcription = useTranscribeAnswerMutation(sessionId);
  const [label, setLabel] = useState<string>();
  const [isSlow, setIsSlow] = useState(false);
  /** The question being answered while its turn runs. */
  const [answering, setAnswering] = useState<TranscriptItem>();

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Answer" });
  const resyncCallbacks = buildCallbacks("send", "answer", { errorMessage: RESYNC_MESSAGE });
  const failureCallbacks = buildCallbacks("send", "answer", { errorMessage: "Couldn't send your answer" });
  const unconfirmedCallbacks = buildCallbacks("send", "answer", { errorMessage: UNCONFIRMED_SEND_MESSAGE });

  const isSending = answer.isPending;
  // TanStack's optimistic-UI-via-variables: the bubble exists only while the request runs, so a failure needs no rollback.
  const pendingAnswer =
    isSending && answer.variables ? { questionId: answer.variables.question_id, text: answer.variables.answer } : undefined;
  const streaming =
    isSending && answering ? { answered: answering, reaction: turn.reaction, questionText: turn.questionText } : undefined;
  const view = buildThreadView(transcript, { pendingAnswer, streaming });

  async function submit(question: TranscriptItem, text: string): Promise<SendFailure | void> {
    setLabel(pickThinkingLabel(label, question, questionCount));
    setIsSlow(false);
    setAnswering(question);
    dispatch({ event: "start" });
    const slowTimer = setTimeout(() => setIsSlow(true), THINKING_SLOW_AFTER_MS);

    try {
      // `cancelled` (the screen went away) and `recovered` (a lost reply that was saved) need nothing more here.
      await answer.mutateAsync({ question_id: question.question_id, answer: text });
    } catch (error) {
      const result = getAnswerErrorResult(error);
      if (result.kind === "field") {
        return { message: result.message };
      }
      const callbacks =
        result.kind === "resync" ? resyncCallbacks : result.kind === "unknown" ? unconfirmedCallbacks : failureCallbacks;
      callbacks.onError(error);
      return {};
    } finally {
      clearTimeout(slowTimer);
      setAnswering(undefined);
    }
  }

  /** A recorded answer as text for the box. The composer aborts `signal` when it goes away; nothing is shown then. */
  async function transcribe(recording: Blob, signal: AbortSignal): Promise<TranscribeResult> {
    try {
      const { text } = await transcription.mutateAsync({ recording, signal });
      return signal.aborted ? { kind: "none" } : { kind: "text", text };
    } catch (error) {
      if (signal.aborted) {
        return { kind: "none" };
      }
      const result = getTranscribeErrorResult(error);
      if (result.kind === "resync") {
        // The interview moved on or is gone: the same notice as a resynced answer (the query refetches it).
        resyncCallbacks.onError(error);
        return { kind: "none" };
      }
      return result;
    }
  }

  // Thinking until the question starts to appear (or the turn ends, when no text streams).
  const isThinking = isSending && turn.questionText === "";
  return {
    view,
    thinkingLabel: isThinking ? (isSlow ? INTERVIEWER_SLOW_LABEL : label) : undefined,
    /** No new send while a turn runs. */
    isBusy: isSending,
    /** A turn is streaming lines that aren't saved yet: screen readers wait for the finished ones. */
    isStreaming: isSending && view.items.some((item) => item.streaming),
    /** The answer request is in flight (leaving now would drop it). */
    isSending,
    /** Something was sent on this screen: new content may take focus (never on page load). */
    hasSent: label !== undefined,
    submit,
    transcribe,
  };
}
