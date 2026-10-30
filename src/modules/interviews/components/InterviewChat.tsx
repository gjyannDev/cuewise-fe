import type { ReactNode } from "react";

import type { InterviewSession, ThreadItem } from "../types/interviews.types";
import { formatQuestionPosition } from "../utils/format-question-count";
import { ChatThread } from "./ChatThread";
import { EndInterviewDialog } from "./EndInterviewDialog";
import { InterviewColumns } from "./InterviewColumns";
import { InterviewDetailsCard } from "./InterviewDetailsCard";
import { InterviewProgressBar } from "./InterviewProgressBar";

type InterviewChatProps = {
  session: InterviewSession;
  items: ThreadItem[];
  /** The last visible question's position. */
  position: number;
  thinkingLabel?: string;
  /** What sits under the conversation: the composer, a closing card, or an error with Retry. */
  footer: ReactNode;
  /** Omit once the interview is over (completed, ended or abandoned). */
  onEnd?: () => void;
  onJump: () => void;
};

/**
 * The interview screen: a column exactly as tall as the viewport below the app header, where only the conversation
 * scrolls and the footer stays at the bottom. Details and End interview sit in the side panel from `xl`, and in a
 * compact bar above the conversation below that.
 */
export function InterviewChat({ session, items, position, thinkingLabel, footer, onEnd, onJump }: InterviewChatProps) {
  const progress = formatQuestionPosition(position, session.question_count);

  return (
    <InterviewColumns
      asideLabel="Interview details"
      asideClassName="hidden xl:flex"
      aside={
        <InterviewDetailsCard
          session={session}
          progress={progress}
          footer={onEnd && <EndInterviewDialog onConfirm={onEnd} />}
        />
      }
    >
      {/* Sized from AppShell's variables so the window never scrolls; dvh follows the mobile browser UI. */}
      <div className="flex h-[calc(100dvh_-_var(--app-header-height)_-_2*var(--app-content-py))] min-h-0 flex-col">
        <InterviewProgressBar session={session} progress={progress} onEnd={onEnd} className="xl:hidden" />
        <ChatThread items={items} total={session.question_count} thinkingLabel={thinkingLabel} onJump={onJump} />
        {footer}
      </div>
    </InterviewColumns>
  );
}
