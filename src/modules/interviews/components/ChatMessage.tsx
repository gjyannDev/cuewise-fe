import type { Ref } from "react";

import { cn } from "@/lib/utils";

import type { ThreadItem } from "../types/interviews.types";
import { formatQuestionPosition } from "../utils/format-question-count";
import { InterviewerAvatar } from "./InterviewerAvatar";

type ChatMessageProps = {
  item: ThreadItem;
  /** The interview's question count, for the "Question N of M" label. */
  total: number;
  ref?: Ref<HTMLDivElement>;
};

/**
 * One line of the conversation, as plain text (never HTML). Like a chat assistant: the interviewer's lines are plain
 * text beside its avatar, the candidate's answers sit in a soft bubble on the right. Each question starts a new
 * group, so it gets extra space above.
 */
export function ChatMessage({ item, total, ref }: ChatMessageProps) {
  if (item.role === "candidate") {
    return (
      <div ref={ref} className="flex justify-end">
        <p
          className={cn(
            "max-w-[85%] min-w-0 rounded-2xl bg-muted px-4 py-2.5 whitespace-pre-wrap [overflow-wrap:anywhere] transition-opacity",
            item.pending && "opacity-60",
          )}
        >
          <span className="sr-only">You: </span>
          {item.text}
          {item.pending && <span className="sr-only"> (sending)</span>}
        </p>
      </div>
    );
  }

  const isQuestion = item.kind === "question";
  return (
    <div ref={ref} className={cn("flex items-start gap-3", isQuestion && "mt-6 first:mt-0")}>
      <InterviewerAvatar />
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
        {isQuestion && <p className="text-xs font-medium text-muted-foreground">{formatQuestionPosition(item.position, total)}</p>}
        <p
          className={cn(
            "whitespace-pre-wrap [overflow-wrap:anywhere]",
            isQuestion ? "text-base leading-relaxed" : "text-sm text-muted-foreground",
          )}
        >
          <span className="sr-only">Interviewer: </span>
          {item.text}
        </p>
      </div>
    </div>
  );
}
