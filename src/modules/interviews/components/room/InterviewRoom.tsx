"use client";

import { MessageSquareTextIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Toggle } from "@/components/ui/toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LevelSource } from "@/lib/media";
import { cn } from "@/lib/utils";

import { InterviewerAvatar } from "@/modules/interviews/components/common/InterviewerAvatar";
import { TranscriptPanel } from "@/modules/interviews/components/transcript/TranscriptPanel";
import { CONTROL_LABELS, SILENCE_HINT, SPEECH_BLOCKED_HINT } from "@/modules/interviews/constants";
import type {
  InterviewerLine,
  InterviewSession,
  RoomPhase,
  TranscriptView,
} from "@/modules/interviews/types/interviews.types";
import { formatClock } from "@/modules/interviews/utils/format.utils";
import { roomStatusLabel } from "@/modules/interviews/utils/room.utils";
import { latestInterviewerText } from "@/modules/interviews/utils/transcript.utils";
import { CameraTile } from "./CameraTile";
import { InterviewTitleBar } from "./InterviewTitleBar";
import { LevelMeter } from "./LevelMeter";

type InterviewRoomProps = {
  session: InterviewSession;
  view: TranscriptView;
  phase: RoomPhase;
  /** The answer hook's rotating or slow label while the interviewer replies. */
  thinkingLabel?: string;
  /** Lines of the turn in progress are streaming and not saved yet. */
  isStreaming?: boolean;
  /** The browser refused automatic playback: a quiet "tap replay" hint (EC24). */
  blocked?: boolean;
  /** 3 s of silence while recording: said once in the status region (AC4). */
  silent?: boolean;
  /** The recording's clock and the microphone's level, for the stage's recording chip (AC3). */
  recording?: { elapsed: number; maxSeconds: number; level?: LevelSource };
  /** The candidate's own tile; null shows their initials. Omit both on a finished interview (no camera). */
  cameraStream?: MediaStream | null;
  initials?: string;
  /** Transcript actions (see `TranscriptPanel`). */
  onReplay?: (line: InterviewerLine) => void;
  canReplay?: boolean;
  /** The transcript beside the stage (desktop) or in a bottom drawer (phone); the control bar's toggle drives it. */
  transcriptOpen: boolean;
  onTranscriptOpenChange: (open: boolean) => void;
  /** Under the stage: the control bar while the interview runs, or a retry notice. */
  footer?: ReactNode;
  /**
   * Once the interview is over: shown in the middle of the stage in place of the tiles and captions, like a call app's
   * "you left the call" screen.
   */
  closing?: ReactNode;
  onJump: () => void;
};

/**
 * The interview room, like a video call: the title bar with the progress on top; the stage (a dark call surface with
 * the interviewer's tile, its captions and status, and the candidate's picture-in-picture tile) with the footer under
 * it; the transcript beside it when open. The room is exactly as tall as the viewport below the app header, so the
 * window never scrolls, and it fades in from the lobby.
 */
export function InterviewRoom({
  session,
  view,
  phase,
  thinkingLabel,
  isStreaming,
  blocked = false,
  silent = false,
  recording,
  cameraStream = null,
  initials,
  onReplay,
  canReplay,
  transcriptOpen,
  onTranscriptOpenChange,
  footer,
  closing,
  onJump,
}: InterviewRoomProps) {
  const isMobile = useIsMobile();
  const status = roomStatusLabel(phase, thinkingLabel);
  const speaking = phase === "speaking";
  const captions = latestInterviewerText(view.items);
  const transcript = (
    <TranscriptPanel
      items={view.items}
      total={session.question_count}
      thinkingLabel={thinkingLabel}
      isStreaming={isStreaming}
      onJump={onJump}
      onReplay={onReplay}
      canReplay={canReplay}
    />
  );
  const sidePanel = transcriptOpen && !isMobile;

  return (
    // Sized from AppShell's variables so the window never scrolls; dvh follows the mobile browser UI.
    <div className="flex h-[calc(100dvh-var(--app-header-height)-2*var(--app-content-py))] min-h-0 w-full flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
      <InterviewTitleBar session={session} mainNumber={view.mainNumber} />

      <div className={cn("grid min-h-0 flex-1 gap-4", sidePanel && "md:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]")}>
        <section aria-label="Stage" className="flex min-h-0 flex-col">
          {/* Always the dark call surface: the `dark` class scopes the dark theme tokens to the stage (AC18). */}
          <div className="dark relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-linear-to-b from-card to-background p-4 text-foreground">
            {phase === "recording" && recording && (
              <div className="absolute top-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full whitespace-nowrap bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground shadow-md">
                <span aria-hidden className="size-2 rounded-full bg-current motion-safe:animate-pulse" />
                <span>Recording</span>
                {/* Not announced every second: the status region already said "Recording". */}
                <span role="timer" aria-live="off" className="tabular-nums">
                  {formatClock(recording.elapsed)} / {formatClock(recording.maxSeconds)}
                </span>
                {recording.level && <LevelMeter source={recording.level} />}
              </div>
            )}

            {/* Once the interview is over the control bar is gone, so the transcript gets its own toggle here. */}
            {phase === "closed" && (
              <Toggle
                pressed={transcriptOpen}
                onPressedChange={onTranscriptOpenChange}
                className="absolute top-3 left-3 h-11 rounded-full bg-background/70 px-4 backdrop-blur-sm aria-pressed:bg-primary/20"
              >
                <MessageSquareTextIcon aria-hidden />
                {CONTROL_LABELS.transcript}
              </Toggle>
            )}

            {closing ?? (
              <>
            <div className="relative rounded-full p-2">
              {speaking && (
                <>
                  {/* The static ring stays for reduced motion; the second one pulses outward otherwise (EC16). */}
                  <span aria-hidden className="absolute inset-0 rounded-full ring-4 ring-primary/60" />
                  <span aria-hidden className="absolute inset-0 rounded-full ring-2 ring-primary/40 motion-safe:animate-ping" />
                </>
              )}
              <InterviewerAvatar
                size="default"
                className="relative size-24 sm:size-32 [&_svg]:size-10 sm:[&_svg]:size-14"
              />
            </div>

            {/* Captions: what the interviewer said last, also when it is muted (EC18). Not a live region (AC10). */}
            {captions && (
              <p className="line-clamp-3 max-w-2xl text-center text-base leading-relaxed text-pretty wrap-anywhere sm:text-lg">
                {captions}
              </p>
            )}
              </>
            )}

            {/* The room's one live region: every turn change is announced here, once (spec, Accessibility; AC20). */}
            <div role="status" aria-live="polite" aria-atomic="true" className="flex min-h-10 flex-col items-center text-center">
              <p className="text-sm text-muted-foreground">{status}</p>
              {blocked && <p className="text-xs text-muted-foreground">{SPEECH_BLOCKED_HINT}</p>}
              {silent && phase === "recording" && <p className="text-sm font-medium text-destructive">{SILENCE_HINT}</p>}
            </div>

            {!closing && (
              <span className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                Interviewer
              </span>
            )}

            {initials !== undefined && !closing && (
              <CameraTile
                stream={cameraStream}
                initials={initials}
                label="You"
                className="absolute right-3 bottom-3 aspect-video w-28 shadow-lg ring-1 ring-border sm:w-44"
              />
            )}
          </div>
          {footer}
        </section>

        {sidePanel && (
          // Not a landmark of its own: the panel inside is already the "Transcript" region.
          <div className="hidden min-h-0 flex-col rounded-2xl border px-2 md:flex">{transcript}</div>
        )}
      </div>

      {isMobile && (
        <Drawer open={transcriptOpen} onOpenChange={onTranscriptOpenChange}>
          <DrawerContent className="h-[85dvh] data-[vaul-drawer-direction=bottom]:max-h-[85dvh]">
            <DrawerHeader className="pb-0">
              <DrawerTitle>Transcript</DrawerTitle>
            </DrawerHeader>
            <div className="flex min-h-0 flex-1 flex-col px-4">{transcript}</div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
