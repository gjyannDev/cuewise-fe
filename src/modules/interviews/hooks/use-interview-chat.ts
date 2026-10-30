import { useState } from "react";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";

import {
  INTERVIEWER_SLOW_LABEL,
  MIN_THINKING_MS,
  RESYNC_MESSAGE,
  REVEAL_DELAY_MS,
  THINKING_SLOW_AFTER_MS,
  UNCONFIRMED_SEND_MESSAGE,
} from "../constants";
import { useAnswerInterviewMutation } from "../queries/interviews.queries";
import type { TranscriptItem } from "../types/interviews.types";
import { buildThreadView } from "../utils/build-thread-view";
import { getAnswerErrorResult } from "../utils/get-answer-error-result";
import { pickThinkingLabel } from "../utils/pick-thinking-label";

/** A failed send: the composer puts the text back, with `message` under the field when the backend rejected it. */
export type SendFailure = { message?: string };

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Sending answers in the chat: the optimistic bubble, the thinking indicator and the short reveal of the next
 * question. Timers start in `submit` (one user action), not in effects; state set after unmount is a no-op, and the
 * container is keyed per session.
 */
export function useInterviewChat(sessionId: string, transcript: TranscriptItem[], questionCount: number) {
  const answer = useAnswerInterviewMutation(sessionId);
  const [label, setLabel] = useState<string>();
  const [isSlow, setIsSlow] = useState(false);
  /** The question whose reply is awaited (the indicator is up until its minimum time has passed). */
  const [thinkingFor, setThinkingFor] = useState<string>();
  const [hiddenQuestionId, setHiddenQuestionId] = useState<string>();
  const [isRevealing, setIsRevealing] = useState(false);

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Answer" });
  const resyncCallbacks = buildCallbacks("send", "answer", { errorMessage: RESYNC_MESSAGE });
  const failureCallbacks = buildCallbacks("send", "answer", { errorMessage: "Couldn't send your answer" });
  const unconfirmedCallbacks = buildCallbacks("send", "answer", { errorMessage: UNCONFIRMED_SEND_MESSAGE });

  // TanStack's optimistic-UI-via-variables: the bubble exists only while the request runs, so a failure needs no rollback.
  const pendingAnswer =
    answer.isPending && answer.variables
      ? { questionId: answer.variables.question_id, text: answer.variables.answer }
      : undefined;
  const view = buildThreadView(transcript, { pendingAnswer, hiddenQuestionId, hiddenReactionQuestionId: thinkingFor });

  async function submit(question: TranscriptItem, text: string): Promise<SendFailure | void> {
    setLabel(pickThinkingLabel(label, question.position === questionCount));
    setIsSlow(false);
    setThinkingFor(question.question_id);
    const slowTimer = setTimeout(() => setIsSlow(true), THINKING_SLOW_AFTER_MS);
    const minimumThinking = delay(MIN_THINKING_MS);

    try {
      const outcome = await answer.mutateAsync({ question_id: question.question_id, answer: text });
      if (outcome.kind === "recovered") {
        // A lost reply that was saved after all: the refetched thread already shows the turn, so no pause and no toast.
        setThinkingFor(undefined);
        return;
      }
      setHiddenQuestionId(outcome.response.current_question?.id);
      setIsRevealing(true);
      await minimumThinking;
      setThinkingFor(undefined);
      await delay(REVEAL_DELAY_MS);
      setHiddenQuestionId(undefined);
      setIsRevealing(false);
    } catch (error) {
      setThinkingFor(undefined);
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
    }
  }

  const isThinking = thinkingFor !== undefined;
  return {
    view,
    thinkingLabel: isThinking ? (isSlow ? INTERVIEWER_SLOW_LABEL : label) : undefined,
    /** No new send while the reply is awaited or the next question is being revealed. */
    isBusy: isThinking || isRevealing,
    isRevealing,
    /** The answer request is in flight (leaving now would drop it). */
    isSending: answer.isPending,
    /** Something was sent on this screen: new content may take focus (never on page load). */
    hasSent: label !== undefined,
    submit,
  };
}
