import { useState } from "react";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";

import { RESYNC_MESSAGE } from "../constants";
import { useAnswerInterviewMutation } from "../queries/interviews.queries";
import type { InterviewQuestion, Reaction } from "../types/interviews.types";
import { getAnswerErrorResult } from "../utils/get-answer-error-result";

/** The last answered question and its reaction. Client-only: a reload drops it and shows the cache's question. */
export type AnswerTurn = {
  question: InterviewQuestion;
  reaction: Reaction;
  /** The answer completed the interview, so the reaction is the closing line. */
  isFinal: boolean;
  /** The user pressed Next question / Finish; the reaction is no longer on screen. */
  isDismissed: boolean;
};

/**
 * Submitting answers for one interview. The cache moves to the next question as soon as the backend replies;
 * this hook keeps the reaction on screen until the user continues. Remount it per session (React `key`).
 */
export function useAnswerTurn(sessionId: string) {
  const answer = useAnswerInterviewMutation(sessionId);
  const [turn, setTurn] = useState<AnswerTurn>();

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Answer" });
  const resyncCallbacks = buildCallbacks("send", "answer", { errorMessage: RESYNC_MESSAGE });
  const failureCallbacks = buildCallbacks("send", "answer", { errorMessage: "Couldn't send your answer" });

  /** Resolves to a message for the answer field when the backend rejected the text itself. */
  async function submit(question: InterviewQuestion, text: string): Promise<string | void> {
    try {
      const response = await answer.mutateAsync({ question_id: question.id, answer: text });
      setTurn({ question, reaction: response.reaction, isFinal: response.current_question === null, isDismissed: false });
    } catch (error) {
      const result = getAnswerErrorResult(error);
      if (result.kind === "field") {
        return result.message;
      }
      (result.kind === "resync" ? resyncCallbacks : failureCallbacks).onError(error);
    }
  }

  const advance = () => setTurn((current) => current && { ...current, isDismissed: true });

  return { turn, isPending: answer.isPending, submit, advance };
}
