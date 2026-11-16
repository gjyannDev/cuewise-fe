"use client";

import { MessageSquareTextIcon } from "lucide-react";
import { type ReactNode, type Ref, useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { InterviewerAvatar } from "@/modules/interviews/components/common/InterviewerAvatar";
import { TranscriptPanel } from "@/modules/interviews/components/transcript/TranscriptPanel";
import { SPEECH_BLOCKED_HINT } from "@/modules/interviews/constants";
import type {
  InterviewerLine,
  InterviewSession,
  RoomPhase,
  TranscriptView,
} from "@/modules/interviews/types/interviews.types";
import { roomStatusLabel } from "@/modules/interviews/utils/room.utils";
import { CameraTile } from "./CameraTile";
import { InterviewTitleBar } from "./InterviewTitleBar";

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
  /** The candidate's own tile; null shows their initials. Omit both on a finished interview (no camera). */
  cameraStream?: MediaStream | null;
  initials?: string;
  /** Transcript actions (see `TranscriptPanel`). */
  onReplay?: (line: InterviewerLine) => void;
  canReplay?: boolean;
  onSend?: () => void;
  onRerecord?: () => void;
  canSend?: boolean;
  sendRef?: Ref<HTMLButtonElement>;
  /** Under the stage: the control bar while the interview runs, then the closing card or a retry notice. */
  footer: ReactNode;
  onJump: () => void;
};

/**
 * The interview room, like a video call: the title bar on top; the stage (the interviewer's tile with its status, the
 * candidate's picture-in-picture tile, then the footer) on the left; the transcript on the right. At phone width the
 * transcript moves into a bottom drawer, which opens by itself when an answer is ready for review. The whole room is
 * exactly as tall as the viewport below the app header, so the window never scrolls.
 */
export function InterviewRoom({
  session,
  view,
  phase,
  thinkingLabel,
  isStreaming,
  blocked = false,
  cameraStream = null,
  initials,
  onReplay,
  canReplay,
  onSend,
  onRerecord,
  canSend,
  sendRef,
  footer,
  onJump,
}: InterviewRoomProps) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Opens the drawer when review starts (adjusting state during render, not in an effect); closing it stays closed.
  const [seenPhase, setSeenPhase] = useState(phase);
  if (phase !== seenPhase) {
    setSeenPhase(phase);
    if (phase === "review") setDrawerOpen(true);
  }

  const status = roomStatusLabel(phase, thinkingLabel);
  const speaking = phase === "speaking";
  const transcript = (
    <TranscriptPanel
      items={view.items}
      total={session.question_count}
      thinkingLabel={thinkingLabel}
      isStreaming={isStreaming}
      onJump={onJump}
      onReplay={onReplay}
      canReplay={canReplay}
      onSend={onSend}
      onRerecord={onRerecord}
      canSend={canSend}
      sendRef={sendRef}
    />
  );

  return (
    // Sized from AppShell's variables so the window never scrolls; dvh follows the mobile browser UI.
    <div className="mx-auto flex h-[calc(100dvh-var(--app-header-height)-2*var(--app-content-py))] min-h-0 w-full max-w-6xl flex-col">
      <InterviewTitleBar session={session} mainNumber={view.mainNumber} />

      <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <section aria-label="Stage" className="flex min-h-0 flex-col">
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border bg-card p-4">
            <div
              className={cn(
                "rounded-full p-1.5 ring-primary/40 transition-shadow motion-reduce:transition-none",
                speaking && "ring-4 motion-safe:animate-pulse",
              )}
            >
              <InterviewerAvatar size="default" className="size-20 sm:size-24 [&_svg]:size-9 sm:[&_svg]:size-10" />
            </div>
            <p className="text-sm font-medium">Interviewer</p>
            {/* The room's one live region: every turn change is announced here, once (spec, Accessibility). */}
            <div role="status" aria-live="polite" aria-atomic="true" className="flex min-h-10 flex-col items-center text-center">
              <p className="text-sm text-muted-foreground">{status}</p>
              {blocked && <p className="text-xs text-muted-foreground">{SPEECH_BLOCKED_HINT}</p>}
            </div>

            {isMobile && (
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button type="button" variant="outline" className="absolute top-3 left-3 h-11">
                    <MessageSquareTextIcon aria-hidden data-icon="inline-start" />
                    Transcript
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85dvh] data-[vaul-drawer-direction=bottom]:max-h-[85dvh]">
                  <DrawerHeader className="pb-0">
                    <DrawerTitle>Transcript</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex min-h-0 flex-1 flex-col px-4">{transcript}</div>
                </DrawerContent>
              </Drawer>
            )}

            {initials !== undefined && (
              <CameraTile
                stream={cameraStream}
                initials={initials}
                className="absolute right-3 bottom-3 aspect-video w-28 shadow-md ring-1 ring-border sm:w-40"
              />
            )}
          </div>
          {footer}
        </section>

        {!isMobile && (
          // Not a landmark of its own: the panel inside is already the "Transcript" region.
          <div className="hidden min-h-0 flex-col rounded-xl border px-2 md:flex">{transcript}</div>
        )}
      </div>
    </div>
  );
}
