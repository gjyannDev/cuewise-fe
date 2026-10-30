import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { interviewsService } from "../services/interviews.services";
import type { AnswerRequest, Interview, StartInterviewRequest } from "../types/interviews.types";
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

export function useAnswerInterviewMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: interviewKeys.answer(id),
    mutationFn: (params: AnswerRequest) => interviewsService.answer(id, params),
    // The backend has already moved on, so the cache does too; the reaction is shown separately until dismissed.
    onSuccess: ({ session, current_question }) =>
      queryClient.setQueryData<Interview>(interviewKeys.detail(id), { session, current_question }),
    // Answered elsewhere, completed, or gone: refetch so the screen shows what the backend says is current.
    onError: (error) => {
      if (getAnswerErrorResult(error).kind === "resync") {
        return queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) });
      }
    },
  });
}
