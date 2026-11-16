import { useReducer, useState } from "react";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";

import { INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE } from "../constants";
import { useAnswerInterviewMutation } from "../queries/interviews.queries";
import type { AnswerStreamEvent, SendResult, TranscriptItem } from "../types/interviews.types";
import { ANSWER_STREAM_START, type AnswerStreamState, reduceAnswerStream } from "../utils/stream.utils";
import { buildTranscriptView, getAnswerErrorResult, pickThinkingLabel } from "../utils/transcript.utils";

/** A new send starts the live turn over; every other action is a stream event. */
type TurnAction = AnswerStreamEvent | { event: "start" };
const reduceTurn = (state: AnswerStreamState, action: TurnAction) =>
  action.event === "start" ? ANSWER_STREAM_START : reduceAnswerStream(state, action);

/**
 * Sending answers in the interview: the optimistic answer bubble, the thinking indicator, and the turn as it streams in
 * (the reaction, then the question typing in) until the saved turn replaces it. Nothing is delayed on purpose: what
 * the candidate sees follows the backend's events. The slow-label timer starts in `send` (one user action), not in
 * an effect; the container is keyed per session. Transcription lives in the voice hook, not here.
 */
export function useInterviewAnswer(sessionId: string, transcript: TranscriptItem[], questionCount: number) {
  const [turn, dispatch] = useReducer(reduceTurn, ANSWER_STREAM_START);
  const answer = useAnswerInterviewMutation(sessionId, { onEvent: dispatch });
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
  /** What this hook adds to the transcript view (the room's turn hook adds the unsent answer and builds the view). */
  const viewOptions = { pendingAnswer, streaming };

  /** Sends `text` as the answer to `question`. Non-field failures are toasted here; the result says what happened. */
  async function send(question: TranscriptItem, text: string): Promise<SendResult> {
    setLabel(pickThinkingLabel(label, question, questionCount));
    setIsSlow(false);
    setAnswering(question);
    dispatch({ event: "start" });
    const slowTimer = setTimeout(() => setIsSlow(true), THINKING_SLOW_AFTER_MS);

    try {
      const outcome = await answer.mutateAsync({ question_id: question.question_id, answer: text });
      return outcome.kind === "answered" ? { kind: "saved", response: outcome.response } : { kind: outcome.kind };
    } catch (error) {
      const result = getAnswerErrorResult(error);
      if (result.kind === "field") {
        return { kind: "failed", fieldError: result.message };
      }
      const callbacks =
        result.kind === "resync" ? resyncCallbacks : result.kind === "unknown" ? unconfirmedCallbacks : failureCallbacks;
      callbacks.onError(error);
      return result.kind === "resync" ? { kind: "resync" } : { kind: "failed" };
    } finally {
      clearTimeout(slowTimer);
      setAnswering(undefined);
    }
  }

  // Thinking until the question starts to appear (or the turn ends, when no text streams).
  const isThinking = isSending && turn.questionText === "";
  return {
    viewOptions,
    thinkingLabel: isThinking ? (isSlow ? INTERVIEWER_SLOW_LABEL : label) : undefined,
    /** No new send while a turn runs. */
    isBusy: isSending,
    /** A turn is streaming lines that aren't saved yet: screen readers wait for the finished ones. */
    isStreaming: isSending && buildTranscriptView(transcript, viewOptions).items.some((item) => item.streaming),
    send,
  };
}
