"use client";

import { MicIcon, PhoneOffIcon, RotateCcwIcon, SquareIcon, VideoIcon, VideoOffIcon, Volume2Icon, VolumeOffIcon, XIcon } from "lucide-react";
import { type Ref, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

import type { RoomPhase } from "@/modules/interviews/types/interviews.types";
import { formatClock } from "@/modules/interviews/utils/format.utils";
import { EndInterviewDialog } from "./EndInterviewDialog";

type RoomControlsProps = {
  phase: RoomPhase;
  /** From the turn hook's `canAnswer` / `canReplay` (the spec's turn table). */
  canAnswer: boolean;
  canReplay: boolean;
  /** Set when there's no usable microphone: Answer stays reachable but explains why it can't record (EC1). */
  micMessage?: string;
  /** Seconds recorded so far, and the limit the recording stops at. */
  elapsed: number;
  maxSeconds: number;
  muted: boolean;
  cameraOn: boolean;
  cameraStarting: boolean;
  /** Off while an answer is sending (EC17). */
  canEnd: boolean;
  /** Focus lands on Answer when it's the candidate's turn after a send. */
  answerRef?: Ref<HTMLButtonElement>;
  onAnswer: () => void;
  onStop: () => void;
  onCancel: () => void;
  onToggleCamera: () => void;
  onToggleMute: () => void;
  onReplay: () => void;
  /** Called once the End dialog is confirmed. */
  onEnd: () => void;
};

/** Round 44 px controls; the bar stays on one row at 360 px because only Answer and End carry text, and only from `sm`. */
const ROUND = "size-11 shrink-0 rounded-full";

/**
 * The room's control bar: Answer (Stop while recording) and Cancel, camera and mute toggles, replay of the current
 * question, and End behind a confirmation. Everything it may do comes from props; the turn hook decides.
 */
export function RoomControls({
  phase,
  canAnswer,
  canReplay,
  micMessage,
  elapsed,
  maxSeconds,
  muted,
  cameraOn,
  cameraStarting,
  canEnd,
  answerRef,
  onAnswer,
  onStop,
  onCancel,
  onToggleCamera,
  onToggleMute,
  onReplay,
  onEnd,
}: RoomControlsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const endButton = useRef<HTMLButtonElement>(null);
  const micMessageId = useId();
  const recording = phase === "recording";

  let mainButton;
  if (recording) {
    mainButton = (
      <Button
        type="button"
        variant="destructive"
        className={cn(ROUND, "sm:w-auto sm:px-5")}
        aria-label="Stop recording"
        aria-keyshortcuts="Space"
        onClick={onStop}
      >
        <SquareIcon aria-hidden className="fill-current" />
        <span className="hidden sm:inline">Stop</span>
        <Kbd className="hidden sm:inline-flex">Space</Kbd>
      </Button>
    );
  } else if (phase === "transcribing") {
    mainButton = (
      <Button type="button" className={cn(ROUND, "sm:w-auto sm:px-5")} aria-label="Transcribing" disabled>
        <Spinner aria-hidden />
        <span className="hidden sm:inline">Transcribing…</span>
      </Button>
    );
  } else {
    mainButton = (
      // aria-disabled, not disabled: without a mic it stays focusable, so its explanation can be read (EC1).
      <Button
        ref={answerRef}
        type="button"
        className={cn(ROUND, "sm:w-auto sm:px-5 aria-disabled:cursor-not-allowed aria-disabled:opacity-50")}
        aria-label={phase === "review" ? "Re-record" : "Answer"}
        aria-disabled={!canAnswer}
        aria-describedby={micMessage ? micMessageId : undefined}
        aria-keyshortcuts="Space"
        onClick={onAnswer}
      >
        <MicIcon aria-hidden />
        <span className="hidden sm:inline">{phase === "review" ? "Re-record" : "Answer"}</span>
        <Kbd className="hidden bg-primary-foreground/15 text-primary-foreground sm:inline-flex">Space</Kbd>
      </Button>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-2 pt-3">
      <div className="min-h-5 text-center text-xs">
        {recording ? (
          <span className="flex items-center gap-1.5 text-muted-foreground tabular-nums">
            <span aria-hidden className="size-2 rounded-full bg-destructive motion-safe:animate-pulse" />
            {/* Not announced every second: the room's status region already said "Recording". */}
            <span role="timer" aria-live="off">
              {formatClock(elapsed)} / {formatClock(maxSeconds)}
            </span>
          </span>
        ) : (
          micMessage && (
            <p id={micMessageId} className="max-w-md text-destructive">
              {micMessage}
            </p>
          )
        )}
      </div>

      <div role="group" aria-label="Interview controls" className="flex items-center justify-center gap-2">
        {mainButton}
        {recording && (
          <Button
            type="button"
            variant="outline"
            className={ROUND}
            aria-label="Cancel recording"
            aria-keyshortcuts="Escape"
            onClick={onCancel}
          >
            <XIcon aria-hidden />
          </Button>
        )}
        <Toggle
          variant="outline"
          className={ROUND}
          pressed={cameraOn}
          onPressedChange={onToggleCamera}
          disabled={cameraStarting}
          aria-label="Camera"
        >
          {cameraOn ? <VideoIcon aria-hidden /> : <VideoOffIcon aria-hidden />}
        </Toggle>
        <Toggle
          variant="outline"
          className={ROUND}
          pressed={muted}
          onPressedChange={onToggleMute}
          aria-label="Mute interviewer"
        >
          {muted ? <VolumeOffIcon aria-hidden /> : <Volume2Icon aria-hidden />}
        </Toggle>
        <Button
          type="button"
          variant="outline"
          className={ROUND}
          aria-label="Replay question"
          disabled={!canReplay}
          onClick={onReplay}
        >
          <RotateCcwIcon aria-hidden />
        </Button>
        <Button
          ref={endButton}
          type="button"
          variant="destructive"
          className={cn(ROUND, "sm:w-auto sm:px-4")}
          aria-label="End interview"
          disabled={!canEnd}
          onClick={() => setIsConfirmOpen(true)}
        >
          <PhoneOffIcon aria-hidden />
          <span className="hidden sm:inline">End</span>
        </Button>
      </div>

      <EndInterviewDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={onEnd}
        returnFocusTo={endButton}
      />
    </div>
  );
}
