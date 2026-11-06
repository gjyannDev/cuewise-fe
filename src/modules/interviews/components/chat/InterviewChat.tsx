import type { ReactNode } from "react";

import type { InterviewSession, ThreadItem } from "@/modules/interviews/types/interviews.types";
import { ChatThread } from "./ChatThread";
import { InterviewTitleBar } from "./InterviewTitleBar";

type InterviewChatProps = {
  session: InterviewSession;
  items: ThreadItem[];
  /** The last visible question's main number (follow-ups keep their main question's). */
  mainNumber: number;
  thinkingLabel?: string;
  /** A turn is streaming lines that aren't saved yet. */
  isStreaming?: boolean;
  /** What sits under the conversation: the composer, a closing card, or an error with Retry. */
  footer: ReactNode;
  /** Omit once the interview is over (completed, ended or abandoned). */
  onEnd?: () => void;
  onJump: () => void;
};

/**
 * The interview screen: one centered column, exactly as tall as the viewport below the app header, with the
 * conversation's title on top, the conversation (the only scroller) in the middle and the footer at the bottom.
 */
export function InterviewChat({
  session,
  items,
  mainNumber,
  thinkingLabel,
  isStreaming,
  footer,
  onEnd,
  onJump,
}: InterviewChatProps) {
  return (
    // Sized from AppShell's variables so the window never scrolls; dvh follows the mobile browser UI.
    <div className="mx-auto flex h-[calc(100dvh-var(--app-header-height)-2*var(--app-content-py))] min-h-0 w-full max-w-3xl flex-col">
      <InterviewTitleBar session={session} mainNumber={mainNumber} onEnd={onEnd} />
      <ChatThread
        items={items}
        total={session.question_count}
        thinkingLabel={thinkingLabel}
        isStreaming={isStreaming}
        onJump={onJump}
      />
      {footer}
    </div>
  );
}
