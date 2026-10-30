import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { interviewsService } from "../services/interviews.services";
import type { AnswerRequest, Interview, StartInterviewRequest, Transcript } from "../types/interviews.types";
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

  return useMutation({
    mutationKey: interviewKeys.answer(id),
    mutationFn: (params: AnswerRequest) => interviewsService.answer(id, params),
    // A refetch already in flight (e.g. on window focus) would land after the write below and erase the new turn.
    onMutate: cancelFetches,
    // The backend has moved on, so the cache does too, without a GET; the screen holds the next question back briefly.
    onSuccess: async (response, request) => {
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
