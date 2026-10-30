"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import type { StickToBottomContext } from "use-stick-to-bottom";

import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";

import type { ThreadItem } from "../types/interviews.types";
import { ChatMessage } from "./ChatMessage";
import { JumpToLatestButton } from "./JumpToLatestButton";
import { TypingIndicator } from "./TypingIndicator";

type ChatThreadProps = {
  items: ThreadItem[];
  total: number;
  /** Set while the interviewer is replying. */
  thinkingLabel?: string;
  /** After "jump to latest": the screen moves focus to the composer. */
  onJump: () => void;
};

/**
 * The scrolling conversation (AI Elements Conversation on use-stick-to-bottom): it stays pinned to the latest
 * message while the user is at the bottom and leaves them alone when they scroll up to reread.
 */
export function ChatThread({ items, total, thinkingLabel, onJump }: ChatThreadProps) {
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
        <div role="log" aria-live="polite" aria-label="Interview conversation" className="flex flex-col gap-4">
          {items.map((item) => (
            <ChatMessage
              key={item.key}
              ref={item.pending ? scrollToBottomOnMount : undefined}
              item={item}
              total={total}
            />
          ))}
        </div>
        {thinkingLabel && <TypingIndicator label={thinkingLabel} />}
      </ConversationContent>
      <JumpToLatestButton onJump={onJump} />
      {/* Always mounted so the label is announced when it appears (and once more if it turns into the slow label). */}
      <p role="status" className="sr-only">
        {thinkingLabel ?? ""}
      </p>
    </Conversation>
  );
}
