"use client";

import { MessageSquareWarningIcon, RotateCcwIcon } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { type RecordingEnd, useAudioRecorder } from "@/hooks/media/use-audio-recorder";
import { useCamera } from "@/hooks/media/use-camera";
import { InterviewMessageCard } from "@/modules/interviews/components/common/InterviewMessageCard";
import { InterviewClosingCard } from "@/modules/interviews/components/room/InterviewClosingCard";
import { InterviewLobby } from "@/modules/interviews/components/room/InterviewLobby";
import { InterviewRoom } from "@/modules/interviews/components/room/InterviewRoom";
import { RoomControls } from "@/modules/interviews/components/room/RoomControls";
import {
  feedbackStartRoute,
  MIC_CHECK_MESSAGES,
  MIC_REQUIRED_MESSAGE,
  MIC_TEST_SECONDS,
  RECORDING_MAX_SECONDS,
  STALE_TRANSCRIPT_MESSAGE,
  TRANSCRIPT_ERROR_MESSAGE,
} from "@/modules/interviews/constants";
import { useInterviewAnswer } from "@/modules/interviews/hooks/use-interview-answer";
import { useInterviewTurn } from "@/modules/interviews/hooks/use-interview-turn";
import { useInterviewVoice } from "@/modules/interviews/hooks/use-interview-voice";
import { useRoomClock } from "@/modules/interviews/hooks/use-room-clock";
import { useRoomSidebar } from "@/modules/interviews/hooks/use-room-sidebar";
import type { Interview, InterviewerLine, MicCheck, TranscriptItem } from "@/modules/interviews/types/interviews.types";
import { formatLobbySummary } from "@/modules/interviews/utils/format.utils";
import { getInterviewStep } from "@/modules/interviews/utils/interview.utils";
import { buildTranscriptView } from "@/modules/interviews/utils/transcript.utils";

type ActiveInterviewProps = {
  interview: Interview;
  /** The transcript; undefined when it failed to load and nothing is cached. */
  transcript: TranscriptItem[] | undefined;
  onRetryThread: () => void;
  /** Ended on this screen (client-only: cuewise-be has no end endpoint yet). */
  isEnded: boolean;
  onEnd: () => void;
  onStartNew: () => void;
  /** The candidate's initials, for the camera-off tile. */
  initials: string;
};

/**
 * A loaded interview. One that is already over when it opens is a read-only room (the transcript with replay, and the
 * closing card; no lobby, no camera, EC13). One in progress is the live room: the lobby, then Join. Decided once, when
 * the screen opens, so finishing or ending the interview here keeps the live room (and its final line) on screen.
 * Render with `key={sessionId}`.
 */
export function ActiveInterview(props: ActiveInterviewProps) {
  const [finishedWhenOpened] = useState(
    () => props.isEnded || getInterviewStep(props.interview).kind !== "question",
  );
  return finishedWhenOpened ? <FinishedInterview {...props} /> : <LiveInterview {...props} />;
}

/**
 * The live room's container: builds the voice, the recorder, the answer sender and the camera, hands them to the turn
 * hook, and renders the lobby or the room from the turn's state. The only place that wires devices to the turn.
 */
function LiveInterview({
  interview,
  transcript,
  onRetryThread,
  isEnded,
  onEnd,
  onStartNew,
  initials,
}: ActiveInterviewProps) {
  const { session } = interview;
  const step = getInterviewStep(interview);
  const answer = useInterviewAnswer(session.id, transcript ?? [], session.question_count);
  const voice = useInterviewVoice(session.id);
  const camera = useCamera();
  // The recorder reports into the turn, which needs the recorder first: its callback goes through this ref.
  const onRecorded = useRef<(recording: Blob | null, end: RecordingEnd) => void>(() => {});
  const recorder = useAudioRecorder({
    maxSeconds: RECORDING_MAX_SECONDS,
    onRecorded: (recording, end) => onRecorded.current(recording, end),
  });
  const sendRef = useRef<HTMLButtonElement>(null);
  const answerRef = useRef<HTMLButtonElement>(null);
  // The turn asks for focus before React has rendered the control it means; the effect below moves it after the render.
  const focusTarget = useRef<"send" | "answer" | null>(null);
  const [micChecked, setMicChecked] = useState(false);
  // Closed every time the room opens (the stage gets the full width); hiding the page closes it again (EC14).
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  useLayoutEffect(() => () => setTranscriptOpen(false), []);

  const turn = useInterviewTurn({
    transcript: transcript ?? [],
    voice,
    recorder: {
      start: () => void recorder.start(),
      stop: recorder.stop,
      cancel: recorder.cancel,
      error: recorder.error,
    },
    answer,
    micSupported: recorder.isSupported,
    onRelease: camera.release,
    onFocus: (target) => {
      focusTarget.current = target;
    },
  });

  useEffect(() => {
    onRecorded.current = turn.onRecorded;
  });

  useEffect(() => {
    const target = focusTarget.current;
    const element = target === "send" ? sendRef.current : target === "answer" ? answerRef.current : null;
    if (element) {
      element.focus();
      focusTarget.current = null;
    }
  });

  // The lobby shows the camera preview and checks the microphone as soon as the room opens (each asked separately).
  const { start: startCamera } = camera;
  useEffect(() => {
    void startCamera();
  }, [startCamera]);

  const { isSupported, check } = recorder;
  const { setMicAvailable } = turn;
  const checkMic = useCallback(
    () =>
      check().then((usable) => {
        setMicAvailable(usable);
        setMicChecked(true);
      }),
    [check, setMicAvailable],
  );
  useEffect(() => {
    if (isSupported) void checkMic();
  }, [isSupported, checkMic]);

  const mic: MicCheck = !isSupported
    ? "unsupported"
    : !micChecked || recorder.status === "requesting"
      ? "checking"
      : (recorder.error ?? "ready");
  const { phase } = turn.state;
  // A live interview gets the whole page: the sidebar collapses from the lobby until it closes (AC16).
  useRoomSidebar(phase !== "closed");
  const clock = useRoomClock(phase !== "lobby" && phase !== "closed");

  if (phase === "lobby") {
    return (
      <div className="flex min-h-[calc(100dvh-var(--app-header-height)-2*var(--app-content-py))] items-center">
        <InterviewLobby
          summary={formatLobbySummary(session)}
          initials={initials}
          cameraStream={camera.stream}
          cameraStarting={camera.status === "requesting"}
          cameraError={camera.error}
          onToggleCamera={camera.toggle}
          mic={mic}
          onCheckMic={() => void checkMic()}
          micTest={
            recorder.levelSupported
              ? {
                  listening: recorder.status === "listening",
                  heard: recorder.heard,
                  level: recorder.level,
                  onTest: () => void recorder.listen(MIC_TEST_SECONDS),
                }
              : undefined
          }
          onJoin={() => {
            // A running mic test lets go of the microphone before the room opens (EC3).
            recorder.stopListening();
            turn.join();
          }}
        />
      </div>
    );
  }

  let footer: ReactNode = null;
  let closing: ReactNode = null;
  if (!transcript) {
    footer = retryNotice(TRANSCRIPT_ERROR_MESSAGE, onRetryThread);
  } else if (phase === "closed") {
    const ended = isEnded || step.kind === "ended";
    closing = (
      <InterviewClosingCard
        variant={ended ? "ended" : "completed"}
        autoFocus
        feedbackHref={ended ? undefined : feedbackStartRoute(session.id)}
        onStartNew={onStartNew}
      />
    );
  } else if (step.kind === "question" && !turn.view.openQuestion && !answer.isBusy && phase === "your-turn") {
    // In progress, but the cached transcript has nothing left to answer: stale, so offer a refetch.
    footer = retryNotice(STALE_TRANSCRIPT_MESSAGE, onRetryThread);
  } else {
    footer = (
      <RoomControls
        phase={phase}
        canAnswer={turn.canAnswer}
        canReplay={turn.canReplay}
        micMessage={
          turn.state.micAvailable
            ? undefined
            : mic === "checking" || mic === "ready"
              ? MIC_REQUIRED_MESSAGE
              : MIC_CHECK_MESSAGES[mic]
        }
        clock={clock}
        muted={turn.state.muted}
        cameraOn={camera.stream !== null}
        cameraStarting={camera.status === "requesting"}
        canEnd={phase !== "thinking"}
        transcriptOpen={transcriptOpen}
        onToggleTranscript={() => setTranscriptOpen((open) => !open)}
        review={
          turn.state.unsent === null
            ? undefined
            : {
                text: turn.state.unsent,
                fieldError: turn.state.fieldError,
                canSend: turn.canSend,
                onSend: turn.send,
                onRerecord: turn.answer,
              }
        }
        answerRef={answerRef}
        sendRef={sendRef}
        onAnswer={turn.answer}
        onStop={turn.stop}
        onCancel={turn.cancel}
        onToggleCamera={camera.toggle}
        onToggleMute={turn.toggleMute}
        onReplay={turn.replayCurrent}
        onEnd={() => {
          turn.end();
          onEnd();
        }}
      />
    );
  }

  return (
    <InterviewRoom
      session={session}
      view={turn.view}
      phase={phase}
      thinkingLabel={answer.thinkingLabel}
      isStreaming={answer.isStreaming}
      blocked={turn.state.hint === "blocked"}
      silent={recorder.silent}
      recording={{ elapsed: recorder.elapsed, maxSeconds: RECORDING_MAX_SECONDS, level: recorder.level }}
      cameraStream={camera.stream}
      initials={initials}
      onReplay={turn.replay}
      canReplay={turn.canReplay}
      transcriptOpen={transcriptOpen}
      onTranscriptOpenChange={setTranscriptOpen}
      footer={footer}
      closing={closing}
      onJump={() => answerRef.current?.focus()}
    />
  );
}

/** An interview that was already over when opened: the transcript, replay on interviewer lines, the closing card. */
function FinishedInterview({ interview, transcript, onRetryThread, isEnded, onStartNew }: ActiveInterviewProps) {
  const { session } = interview;
  const ended = isEnded || getInterviewStep(interview).kind === "ended";
  const voice = useInterviewVoice(session.id);
  // Nothing happens on the stage of a finished interview: its transcript starts open.
  const [transcriptOpen, setTranscriptOpen] = useState(true);

  const replay = (line: InterviewerLine) => {
    void voice.replay(line).then((outcome) => {
      if (outcome.message) toast.error(outcome.message);
    });
  };

  return (
    <InterviewRoom
      session={session}
      view={buildTranscriptView(transcript ?? [], {})}
      phase="closed"
      onReplay={replay}
      canReplay
      transcriptOpen={transcriptOpen}
      onTranscriptOpenChange={setTranscriptOpen}
      closing={
        <InterviewClosingCard
          variant={ended ? "ended" : "completed"}
          feedbackHref={ended ? undefined : feedbackStartRoute(session.id)}
          onStartNew={onStartNew}
        />
      }
      footer={transcript ? null : retryNotice(TRANSCRIPT_ERROR_MESSAGE, onRetryThread)}
      onJump={() => {}}
    />
  );
}

function retryNotice(title: string, onRetry: () => void) {
  return (
    <div className="mt-3 shrink-0">
      <InterviewMessageCard
        role="alert"
        icon={MessageSquareWarningIcon}
        title={title}
        description="Check your connection and try again."
        action={
          <Button variant="outline" size="lg" className="h-11" onClick={onRetry}>
            <RotateCcwIcon aria-hidden data-icon="inline-start" />
            Try again
          </Button>
        }
      />
    </div>
  );
}
