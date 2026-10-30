"use client";

import { ArrowDownIcon } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "@/components/ui/button";

type JumpToLatestButtonProps = {
  /** Called after scrolling; the screen moves focus to the composer, since this button disappears once at the bottom. */
  onJump: () => void;
};

/**
 * Replaces AI Elements' ConversationScrollButton, which can't take an extra click handler (its props override its own
 * onClick) and leaves focus nowhere when it unmounts. Must be rendered inside the Conversation.
 */
export function JumpToLatestButton({ onJump }: JumpToLatestButtonProps) {
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
