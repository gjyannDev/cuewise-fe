import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { ANSWER_TIMEOUT_MS } from "../constants";
import { interviewsService } from "../services/interviews.services";
import type {
  AnswerOutcome,
  AnswerRequest,
  AnswerStreamEvent,
  Interview,
  StartInterviewRequest,
  Transcript,
} from "../types/interviews.types";
import { AnswerStreamError } from "../utils/answer-stream-error";
import { appendAnswerTurn } from "../utils/append-answer-turn";
import { getAnswerErrorResult } from "../utils/get-answer-error-result";
import { getTranscribeErrorResult } from "../utils/get-transcribe-error-result";
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

type AnswerStreamOptions = {
  /** Every event of the turn as it arrives (the screen shows them before the turn is saved). */
  onEvent: (event: AnswerStreamEvent) => void;
};

/**
 * Sends an answer as a streamed turn. Events go to `onEvent` as they arrive; the cache changes once, at `done`, with
 * the same update a full reply used to make. Leaving the screen cancels the request (cuewise-be then stops its LLM
 * call) and nothing is written; the browser's own time budget runs out like a dropped connection.
 */
export function useAnswerInterviewMutation(id: string, { onEvent }: AnswerStreamOptions) {
  const queryClient = useQueryClient();
  // detail(id) is a prefix of messages(id), so this covers the interview and its conversation.
  const cancelFetches = () => queryClient.cancelQueries({ queryKey: interviewKeys.detail(id) });
  const leave = useRef<AbortController | null>(null);
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  });
  // Unmounting is a subscription ending: abort the turn in flight.
  useEffect(() => () => leave.current?.abort(), []);

  /**
   * No reply came back, but cuewise-be saves the turn at its end, so it may have succeeded. If the interview has
   * moved past the question, it did: reload the conversation and report `recovered`. Otherwise rethrow; the screen
   * says the send couldn't be confirmed, and a resend either succeeds or gets a 409 that resyncs.
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

  async function streamTurn(params: AnswerRequest, signal: AbortSignal): Promise<AnswerOutcome> {
    try {
      for await (const event of interviewsService.answerStream(id, params, signal)) {
        onEventRef.current(event);
        if (event.event === "done") {
          return { kind: "answered", response: event.data };
        }
        if (event.event === "error") {
          throw new AnswerStreamError("event", event.data.code);
        }
      }
    } catch (error) {
      // Our own abort (unmount) or the time budget: both end up here as an AbortError / TimeoutError.
      if (signal.aborted && !(error instanceof AnswerStreamError)) {
        throw new AnswerStreamError("interrupted");
      }
      throw error;
    }
    throw new AnswerStreamError("interrupted");
  }

  return useMutation({
    mutationKey: interviewKeys.answer(id),
    mutationFn: async (params: AnswerRequest): Promise<AnswerOutcome> => {
      const controller = new AbortController();
      leave.current = controller;
      const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(ANSWER_TIMEOUT_MS)]);
      try {
        const outcome = await streamTurn(params, signal);
        // A `done` that raced the unmount: the screen is gone, so nothing is written.
        return controller.signal.aborted ? { kind: "cancelled" } : outcome;
      } catch (error) {
        if (controller.signal.aborted) {
          return { kind: "cancelled" };
        }
        if (getAnswerErrorResult(error).kind !== "unknown") {
          throw error;
        }
        return recover(error, params);
      } finally {
        if (leave.current === controller) {
          leave.current = null;
        }
      }
    },
    // A refetch already in flight (e.g. on window focus) would land after the write below and erase the new turn.
    onMutate: cancelFetches,
    // The backend has moved on, so the cache does too, without a GET.
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

type TranscribeVariables = {
  recording: Blob;
  /** Aborted by the composer when it goes away (another question, or the screen left), so the reply is dropped. */
  signal: AbortSignal;
};

/**
 * Turns a recorded answer into text for the candidate to review. Nothing is cached: the text goes into the answer
 * box, and only Send makes it an answer. An interview that moved on or is gone refetches, like a failed answer.
 */
export function useTranscribeAnswerMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: interviewKeys.transcribe(id),
    mutationFn: ({ recording, signal }: TranscribeVariables) => interviewsService.transcribe(id, recording, signal),
    onError: (error, { signal }) => {
      if (!signal.aborted && getTranscribeErrorResult(error).kind === "resync") {
        return queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) });
      }
    },
  });
}
