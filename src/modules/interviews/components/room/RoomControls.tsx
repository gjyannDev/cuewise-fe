"use client";

import {
  KeyboardIcon,
  MessageSquareTextIcon,
  MicIcon,
  PhoneOffIcon,
  RotateCcwIcon,
  SendIcon,
  SquareIcon,
  VideoIcon,
  VideoOffIcon,
  Volume2Icon,
  VolumeOffIcon,
  XIcon,
} from "lucide-react";
import { type ReactNode, type Ref, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { CONTROL_LABELS, ROOM_SHORTCUTS } from "@/modules/interviews/constants";
import type { RoomPhase } from "@/modules/interviews/types/interviews.types";
import { formatClock } from "@/modules/interviews/utils/format.utils";
import { EndInterviewDialog } from "./EndInterviewDialog";

/** The answer waiting to be sent: its text and actions sit on the review card, so the transcript can stay closed. */
export type ReviewAnswer = {
  text: string;
  /** A failed send's message (EC12); the answer and Send stay. */
  fieldError?: string | null;
  canSend: boolean;
  onSend: () => void;
  onRerecord: () => void;
};

type RoomControlsProps = {
  phase: RoomPhase;
  /** From the turn hook's `canAnswer` / `canReplay` (the spec's turn table). */
  canAnswer: boolean;
  canReplay: boolean;
  /** Set when there's no usable microphone: Answer stays reachable but explains why it can't record (EC1). */
  micMessage?: string;
  /** Seconds since Join: the interview clock at the bar's left (desktop only). */
  clock: number;
  muted: boolean;
  cameraOn: boolean;
  cameraStarting: boolean;
  /** Off while an answer is sending (EC17). */
  canEnd: boolean;
  transcriptOpen: boolean;
  onToggleTranscript: () => void;
  /** Set while an answer is under review. */
  review?: ReviewAnswer;
  /** Focus lands on Answer when it's the candidate's turn after a send, and on Send when review starts. */
  answerRef?: Ref<HTMLButtonElement>;
  sendRef?: Ref<HTMLButtonElement>;
  onAnswer: () => void;
  onStop: () => void;
  onCancel: () => void;
  onToggleCamera: () => void;
  onToggleMute: () => void;
  onReplay: () => void;
  /** Called once the End dialog is confirmed. */
  onEnd: () => void;
};

/** Meet-style round controls: 44 px on a phone (the minimum touch size), 48 px from `sm`. */
const ROUND = "size-11 shrink-0 rounded-full sm:size-12";
/** A quiet filled circle (no outline), like Meet's. */
const QUIET = "border-transparent bg-muted shadow-none hover:bg-muted/70 aria-pressed:bg-muted";
/** Answer, Stop and Transcribing: a circle on a phone, a pill from `sm`. */
const PILL = "h-11 w-11 shrink-0 rounded-full sm:h-12 sm:w-auto sm:px-6";

type TooltipControl = { open?: boolean; onOpenChange?: (open: boolean) => void };

/** An icon-only control's name, shown on hover and keyboard focus (AC1); the button keeps its own `aria-label`. */
function withTooltip(label: string, control: ReactNode, tooltip?: TooltipControl) {
  return (
    <Tooltip open={tooltip?.open} onOpenChange={tooltip?.onOpenChange}>
      <TooltipTrigger asChild>{control}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * The room's control bar, like a call app's: the interview clock on the left (desktop); a floating pill with Answer (Stop
 * while recording) and Cancel, the camera and mute toggles, replay of the current question and End behind a
 * confirmation; then the transcript toggle and the shortcuts help. While an answer is under review a card above it holds
 * the answer with Send and Re-record. Everything it may do comes from props; the turn hook decides.
 */
export function RoomControls({
  phase,
  canAnswer,
  canReplay,
  micMessage,
  clock,
  muted,
  cameraOn,
  cameraStarting,
  canEnd,
  transcriptOpen,
  onToggleTranscript,
  review,
  answerRef,
  sendRef,
  onAnswer,
  onStop,
  onCancel,
  onToggleCamera,
  onToggleMute,
  onReplay,
  onEnd,
}: RoomControlsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [endTooltip, setEndTooltip] = useState(false);
  // The dialog gives focus back to End when it closes; that focus must not pop End's tooltip open (EC13).
  const [skipEndTooltip, setSkipEndTooltip] = useState(false);
  const endButton = useRef<HTMLButtonElement>(null);
  const micMessageId = useId();
  const recording = phase === "recording";
  const inReview = phase === "review" && review !== undefined;
  const yourTurn = phase === "your-turn" && canAnswer;

  let mainButton: ReactNode = null;
  if (recording) {
    mainButton = (
      <Button
        type="button"
        variant="destructive"
        className={cn(PILL, "bg-destructive text-destructive-foreground hover:bg-destructive/80")}
        aria-label="Stop recording"
        aria-keyshortcuts="Space"
        onClick={onStop}
      >
        <SquareIcon aria-hidden className="fill-current" />
        <span className="hidden sm:inline">Stop</span>
        <Kbd className="hidden bg-background/20 text-current sm:inline-flex">Space</Kbd>
      </Button>
    );
  } else if (phase === "transcribing") {
    mainButton = (
      <Button type="button" className={PILL} aria-label="Transcribing" disabled>
        <Spinner aria-hidden />
        <span className="hidden sm:inline">Transcribing…</span>
      </Button>
    );
  } else if (!inReview) {
    mainButton = (
      <span className="relative inline-flex shrink-0">
        {/* On the candidate's turn Answer is the obvious next step: larger, with a soft ring (static under reduced motion). */}
        {yourTurn && (
          <span aria-hidden className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" />
        )}
        <Button
          ref={answerRef}
          type="button"
          className={cn(
            PILL,
            "relative aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
            yourTurn && "ring-4 ring-primary/25 sm:h-14 sm:px-8 sm:text-base",
          )}
          aria-label="Answer"
          aria-disabled={!canAnswer}
          aria-describedby={micMessage ? micMessageId : undefined}
          aria-keyshortcuts="Space"
          onClick={onAnswer}
        >
          <MicIcon aria-hidden />
          <span className="hidden sm:inline">Answer</span>
          <Kbd className="hidden bg-primary-foreground/15 text-primary-foreground sm:inline-flex">Space</Kbd>
        </Button>
      </span>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-3 pt-3">
      {inReview && (
        <div className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Your answer, not sent yet</p>
          {/* Plain text, never HTML; a long answer scrolls inside the card so its actions stay visible (EC11). */}
          <p className="max-h-32 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere">
            {review.text}
          </p>
          {review.fieldError && (
            <p role="alert" className="text-sm text-destructive">
              {review.fieldError}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={review.onRerecord}>
              <RotateCcwIcon aria-hidden data-icon="inline-start" />
              Re-record
            </Button>
            <Button
              ref={sendRef}
              type="button"
              className="h-11 rounded-full px-6"
              onClick={review.onSend}
              disabled={!review.canSend}
              aria-keyshortcuts="Control+Enter Meta+Enter"
            >
              <SendIcon aria-hidden data-icon="inline-start" />
              Send
              <Kbd className="ml-1 hidden bg-primary-foreground/15 text-primary-foreground sm:inline-flex">Ctrl ↵</Kbd>
            </Button>
          </div>
        </div>
      )}

      {micMessage && !recording && (
        <p id={micMessageId} className="max-w-md text-center text-xs text-destructive">
          {micMessage}
        </p>
      )}

      <div className="relative flex w-full items-center justify-center">
        <span className="absolute left-0 hidden text-sm text-muted-foreground tabular-nums md:block">
          <span className="sr-only">Interview time </span>
          {formatClock(clock)}
        </span>

        <div
          role="group"
          aria-label="Interview controls"
          className="flex max-w-full items-center justify-center gap-1 rounded-full border bg-card p-1 shadow-md sm:gap-2 sm:p-2"
        >
          {mainButton}
          {recording &&
            withTooltip(
              CONTROL_LABELS.cancel,
              <Button
                type="button"
                variant="ghost"
                className={cn(ROUND, QUIET)}
                aria-label={CONTROL_LABELS.cancel}
                aria-keyshortcuts="Escape"
                onClick={onCancel}
              >
                <XIcon aria-hidden />
              </Button>,
            )}
          {withTooltip(
            CONTROL_LABELS.camera,
            <Toggle
              className={cn(ROUND, QUIET, "aria-[pressed=false]:bg-destructive/15 aria-[pressed=false]:text-destructive")}
              pressed={cameraOn}
              onPressedChange={onToggleCamera}
              disabled={cameraStarting}
              aria-label={CONTROL_LABELS.camera}
            >
              {cameraOn ? <VideoIcon aria-hidden /> : <VideoOffIcon aria-hidden />}
            </Toggle>,
          )}
          {withTooltip(
            CONTROL_LABELS.mute,
            <Toggle
              className={cn(ROUND, QUIET, "aria-pressed:bg-destructive/15 aria-pressed:text-destructive")}
              pressed={muted}
              onPressedChange={onToggleMute}
              aria-label={CONTROL_LABELS.mute}
            >
              {muted ? <VolumeOffIcon aria-hidden /> : <Volume2Icon aria-hidden />}
            </Toggle>,
          )}
          {/* Replay can't run while recording, so it makes room for Cancel and the bar keeps one row at 360 px. */}
          {!recording &&
            withTooltip(
              CONTROL_LABELS.replay,
              <Button
                type="button"
                variant="ghost"
                className={cn(ROUND, QUIET)}
                aria-label={CONTROL_LABELS.replay}
                disabled={!canReplay}
                onClick={onReplay}
              >
                <RotateCcwIcon aria-hidden />
              </Button>,
            )}
          {withTooltip(
            CONTROL_LABELS.end,
            <Button
              ref={endButton}
              type="button"
              variant="destructive"
              className="h-11 w-11 shrink-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 sm:h-12 sm:w-16"
              aria-label={CONTROL_LABELS.end}
              disabled={!canEnd}
              onClick={() => setIsConfirmOpen(true)}
            >
              <PhoneOffIcon aria-hidden />
            </Button>,
            {
              open: endTooltip && !isConfirmOpen,
              onOpenChange: (open) => {
                if (open && skipEndTooltip) {
                  setSkipEndTooltip(false);
                  return;
                }
                setEndTooltip(open);
              },
            },
          )}

          <span aria-hidden className="mx-0.5 hidden h-6 w-px bg-border sm:block" />

          {withTooltip(
            CONTROL_LABELS.transcript,
            <Toggle
              className={cn(ROUND, QUIET, "aria-pressed:bg-primary/15 aria-pressed:text-primary-text")}
              pressed={transcriptOpen}
              onPressedChange={onToggleTranscript}
              aria-label={CONTROL_LABELS.transcript}
            >
              <MessageSquareTextIcon aria-hidden />
            </Toggle>,
          )}
          <Popover>
            {withTooltip(
              CONTROL_LABELS.shortcuts,
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(ROUND, QUIET, "hidden md:inline-flex")}
                  aria-label={CONTROL_LABELS.shortcuts}
                >
                  <KeyboardIcon aria-hidden />
                </Button>
              </PopoverTrigger>,
            )}
            <PopoverContent side="top" className="w-72">
              <PopoverTitle>{CONTROL_LABELS.shortcuts}</PopoverTitle>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                {ROOM_SHORTCUTS.map(({ keys, action }) => (
                  <div key={action} className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">{action}</dt>
                    <dd>
                      <KbdGroup>
                        {keys.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </KbdGroup>
                    </dd>
                  </div>
                ))}
              </dl>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <EndInterviewDialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!open) setSkipEndTooltip(true);
          setIsConfirmOpen(open);
        }}
        onConfirm={onEnd}
        returnFocusTo={endButton}
      />
    </div>
  );
}
