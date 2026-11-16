import { useCallback, useEffect, useRef } from "react";

import { useAudioPlayer } from "@/hooks/media/use-audio-player";
import { useMutationCallbacks } from "@/hooks/use-mutation-callback";

import { RESYNC_MESSAGE, SPEECH_UNAVAILABLE_MESSAGE } from "../constants";
import { useSpeechClip, useTranscribeAnswerMutation } from "../queries/voice.queries";
import type { InterviewerLine, SpeechOutcome, TranscribeResult, VoicePort } from "../types/interviews.types";
import { getSpeechErrorResult, getTranscribeErrorResult } from "../utils/voice.utils";

const clipKey = (line: InterviewerLine) => `${line.kind}:${line.id}`;

/**
 * The interviewer's voice for one interview (implements `VoicePort`): fetches each spoken line once (cached for the
 * visit), plays lines one at a time, and turns recordings into text. The only interview hook that touches the media kit
 * besides the camera tile; the turn hook only ever sees the port.
 */
export function useInterviewVoice(sessionId: string): VoicePort {
  const player = useAudioPlayer();
  const fetchClip = useSpeechClip(sessionId);
  const transcription = useTranscribeAnswerMutation(sessionId);
  const { buildCallbacks } = useMutationCallbacks({ entityName: "Answer" });
  const resyncCallbacks = buildCallbacks("send", "answer", { errorMessage: RESYNC_MESSAGE });
  // Bumped by every stop and every new speech, so a line whose clip arrives after the candidate moved on never plays.
  const generation = useRef(0);
  const { play, stop: stopPlayer, urlFor, unlock } = player;

  const playLine = useCallback(
    async (line: InterviewerLine, mine: number): Promise<SpeechOutcome> => {
      let url: string;
      try {
        url = urlFor(clipKey(line), await fetchClip(line));
      } catch (error) {
        const result = getSpeechErrorResult(error);
        return { end: "failed", message: result.kind === "message" ? result.message : SPEECH_UNAVAILABLE_MESSAGE };
      }
      if (mine !== generation.current) return { end: "stopped" };
      const end = await play(url);
      return end === "failed" ? { end, message: SPEECH_UNAVAILABLE_MESSAGE } : { end };
    },
    [fetchClip, play, urlFor],
  );

  const speakLines = useCallback(
    async (lines: InterviewerLine[]): Promise<SpeechOutcome> => {
      const mine = ++generation.current;
      for (const line of lines) {
        const outcome = await playLine(line, mine);
        if (outcome.end !== "ended") return outcome;
        if (mine !== generation.current) return { end: "stopped" };
      }
      return { end: "ended" };
    },
    [playLine],
  );

  const stop = useCallback(() => {
    generation.current += 1;
    stopPlayer();
  }, [stopPlayer]);

  const transcribe = useCallback(
    async (recording: Blob, signal: AbortSignal): Promise<TranscribeResult> => {
      try {
        const { text } = await transcription.mutateAsync({ recording, signal });
        return signal.aborted ? { kind: "none" } : { kind: "text", text };
      } catch (error) {
        if (signal.aborted) return { kind: "none" };
        const result = getTranscribeErrorResult(error);
        if (result.kind === "resync") {
          // The interview moved on or is gone: the same notice as a resynced answer (the query refetches it).
          resyncCallbacks.onError(error);
          return { kind: "none" };
        }
        return result;
      }
    },
    [transcription, resyncCallbacks],
  );

  // Leaving the room silences it, even if a clip was still being fetched.
  useEffect(() => () => {
    generation.current += 1;
  }, []);

  return {
    join: unlock,
    speakLines,
    replay: (line) => speakLines([line]),
    stop,
    transcribe,
  };
}
