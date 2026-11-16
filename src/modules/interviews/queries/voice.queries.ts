import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { voiceService } from "../services/voice.services";
import type { InterviewerLine } from "../types/interviews.types";
import { getTranscribeErrorResult } from "../utils/voice.utils";
import { interviewKeys } from "./interviews.keys";

type TranscribeVariables = {
  recording: Blob;
  /** Aborted when the recording is no longer wanted (another question, or the screen left), so the reply is dropped. */
  signal: AbortSignal;
};

/**
 * Turns a recorded answer into text for the candidate to review. Nothing is cached: only Send makes it an answer. An
 * interview that moved on or is gone refetches, like a failed answer.
 */
export function useTranscribeAnswerMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: interviewKeys.transcribe(id),
    mutationFn: ({ recording, signal }: TranscribeVariables) => voiceService.transcribe(id, recording, signal),
    onError: (error, { signal }) => {
      if (!signal.aborted && getTranscribeErrorResult(error).kind === "resync") {
        return queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) });
      }
    },
  });
}

/**
 * Fetches a spoken interviewer line, at most once per visit: the clip lives in the Query cache forever (a stored line
 * never changes), and asking again while a fetch is in flight joins it instead of paying for a second one. Failures
 * aren't retried here: the room shows a message and the candidate can press replay.
 */
export function useSpeechClip(id: string) {
  const queryClient = useQueryClient();

  return useCallback(
    (line: InterviewerLine) =>
      queryClient.fetchQuery({
        queryKey: interviewKeys.speech(id, line.kind, line.id),
        queryFn: ({ signal }) => voiceService.speak(id, line, signal),
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
      }),
    [queryClient, id],
  );
}
