import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { interviewsService } from "../services/interviews.services";
import type {
  AnswerOutcome,
  AnswerRequest,
  Interview,
  StartInterviewRequest,
  Transcript,
} from "../types/interviews.types";
import { appendAnswerTurn } from "../utils/append-answer-turn";
import { getAnswerErrorResult } from "../utils/get-answer-error-result";
import { interviewKeys } from "./interviews.keys";

export function useStartInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: interviewKeys.start(),
    mutationFn: (params: StartInterviewRequest) => interviewsService.start(params),
    // The response is the full interview, so the session view renders from the cache without a GET.
    onSuccess: (interview) => queryClient.setQueryData(interviewKeys.detail(interview.session.id), interview),
  });
}

/** Pass no id to keep the query idle (e.g. on the setup form). */
export function useInterviewQuery(id: string | undefined) {
  return useQuery({
    queryKey: interviewKeys.detail(id ?? ""),
    queryFn: id ? () => interviewsService.get(id) : skipToken,
  });
}

/** The conversation so far: every shown question, then its answer and reaction. Idle without an id. */
export function useInterviewMessagesQuery(id: string | undefined) {
  return useQuery({
    queryKey: interviewKeys.messages(id ?? ""),
    queryFn: id ? () => interviewsService.messages(id) : skipToken,
  });
}

export function useAnswerInterviewMutation(id: string) {
  const queryClient = useQueryClient();
  // detail(id) is a prefix of messages(id), so this covers the interview and its conversation.
  const cancelFetches = () => queryClient.cancelQueries({ queryKey: interviewKeys.detail(id) });

  /**
   * No reply came back, but cuewise-be saves the turn after the LLM call, so it may have succeeded. If the interview
   * has moved past the question, it did: reload the conversation and report `recovered`. Otherwise rethrow; the
   * screen says the send couldn't be confirmed, and a resend either succeeds or gets a 409 that resyncs.
   */
  async function recover(error: unknown, { question_id }: AnswerRequest): Promise<AnswerOutcome> {
    const interview = await queryClient.fetchQuery({
      queryKey: interviewKeys.detail(id),
      queryFn: () => interviewsService.get(id),
      staleTime: 0,
      retry: false,
    });
    if (interview.current_question?.id === question_id) {
      throw error;
    }
    await queryClient.invalidateQueries({ queryKey: interviewKeys.messages(id) });
    return { kind: "recovered" };
  }

  return useMutation({
    mutationKey: interviewKeys.answer(id),
    mutationFn: async (params: AnswerRequest): Promise<AnswerOutcome> => {
      try {
        return { kind: "answered", response: await interviewsService.answer(id, params) };
      } catch (error) {
        if (getAnswerErrorResult(error).kind !== "unknown") {
          throw error;
        }
        return recover(error, params);
      }
    },
    // A refetch already in flight (e.g. on window focus) would land after the write below and erase the new turn.
    onMutate: cancelFetches,
    // The backend has moved on, so the cache does too, without a GET; the screen holds the next question back briefly.
    onSuccess: async (outcome, request) => {
      if (outcome.kind !== "answered") {
        return;
      }
      const { response } = outcome;
      await cancelFetches();
      queryClient.setQueryData<Interview>(interviewKeys.detail(id), {
        session: response.session,
        current_question: response.current_question,
      });
      queryClient.setQueryData<Transcript>(interviewKeys.messages(id), (transcript) =>
        appendAnswerTurn(transcript, request, response),
      );
    },
    // Answered elsewhere, completed, or gone: refetch so the screen shows what the backend says is current.
    onError: (error) => {
      if (getAnswerErrorResult(error).kind === "resync") {
        return queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) });
      }
    },
  });
}
