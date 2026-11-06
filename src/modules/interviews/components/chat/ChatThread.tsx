"use client";

import { ArrowDownIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { type StickToBottomContext, useStickToBottomContext } from "use-stick-to-bottom";

import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

import type { ThreadItem } from "@/modules/interviews/types/interviews.types";
import { ChatMessage } from "./ChatMessage";
import { InterviewerAvatar } from "./InterviewerAvatar";

type ChatThreadProps = {
  items: ThreadItem[];
  total: number;
  /** Set while the interviewer is replying. */
  thinkingLabel?: string;
  /** Lines of the turn in progress are on screen but not saved yet: the log holds its announcements until they are. */
  isStreaming?: boolean;
  /** After "jump to latest": the screen moves focus to the composer. */
  onJump: () => void;
};

/**
 * The scrolling conversation (AI Elements Conversation on use-stick-to-bottom): it stays pinned to the latest
 * message while the user is at the bottom and leaves them alone when they scroll up to reread.
 */
export function ChatThread({ items, total, thinkingLabel, isStreaming = false, onJump }: ChatThreadProps) {
  const reduceMotion = useReducedMotion();
  const stickToBottom = useRef<StickToBottomContext>(null);
  // Sending always brings the new answer into view, even if the user had scrolled up.
  const scrollToBottomOnMount = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      void stickToBottom.current?.scrollToBottom();
    }
  }, []);

  return (
    <Conversation
      contextRef={stickToBottom}
      initial="instant"
      resize={reduceMotion ? "instant" : "smooth"}
      // The scroll area is a region; only the message list below is the log, so nothing is announced twice.
      role="region"
      aria-label="Conversation"
      className="min-h-0"
    >
      <ConversationContent className="gap-4 px-0 pt-4 pb-8 sm:px-2">
        {/* aria-busy while a question streams: screen readers read the finished line once, not word by word. */}
        <div
          role="log"
          aria-live="polite"
          aria-busy={isStreaming}
          aria-label="Interview conversation"
          className="flex flex-col gap-4"
        >
          {items.map((item) => (
            <ChatMessage
              key={item.key}
              ref={item.pending ? scrollToBottomOnMount : undefined}
              item={item}
              total={total}
            />
          ))}
        </div>
        {/* Visual only: the status region below announces the label. Shimmer ignores reduced motion, so those users get static text. */}
        {thinkingLabel && (
          <div aria-hidden className="flex items-start gap-3">
            <InterviewerAvatar />
            <div className="pt-1 text-sm">
              {reduceMotion ? (
                <span className="text-muted-foreground">{thinkingLabel}</span>
              ) : (
                <Shimmer as="span">{thinkingLabel}</Shimmer>
              )}
            </div>
          </div>
        )}
      </ConversationContent>
      <JumpToLatestButton onJump={onJump} />
      {/* Always mounted so the label is announced when it appears (and once more if it turns into the slow label). */}
      <p role="status" className="sr-only">
        {thinkingLabel ?? ""}
      </p>
    </Conversation>
  );
}

/**
 * Its own function because `useStickToBottomContext` must run inside the Conversation rendered above. Replaces AI
 * Elements' ConversationScrollButton, which can't take an extra click handler (its props override its own onClick)
 * and leaves focus nowhere when it unmounts; `onJump` moves focus to the composer.
 */
function JumpToLatestButton({ onJump }: { onJump: () => void }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) {
    return null;
  }
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Jump to latest message"
      className="absolute bottom-4 left-1/2 size-11 -translate-x-1/2 rounded-full shadow-sm"
      onClick={() => {
        void scrollToBottom();
        onJump();
      }}
    >
      <ArrowDownIcon aria-hidden />
    </Button>
  );
}
