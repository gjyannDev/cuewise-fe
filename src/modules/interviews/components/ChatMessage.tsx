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

const BUBBLE_CLASS = "rounded-2xl px-4 py-2.5 whitespace-pre-wrap [overflow-wrap:anywhere]";

/**
 * One line of the conversation, as plain text (never HTML). Interviewer lines sit left with the avatar, the
 * candidate's own answers right. Each question starts a new group, so it gets extra space above.
 */
export function ChatMessage({ item, total, ref }: ChatMessageProps) {
  if (item.role === "candidate") {
    return (
      <div ref={ref} className="flex justify-end">
        <p className={cn(BUBBLE_CLASS, "max-w-[80%] min-w-0 rounded-br-md bg-primary text-primary-foreground", item.pending && "opacity-70")}>
          <span className="sr-only">You: </span>
          {item.text}
          {item.pending && <span className="sr-only"> (sending)</span>}
        </p>
      </div>
    );
  }

  const isQuestion = item.kind === "question";
  return (
    <div ref={ref} className={cn("flex items-end gap-2", isQuestion && "mt-6 first:mt-0")}>
      <InterviewerAvatar />
      <div className="flex max-w-[80%] min-w-0 flex-col gap-1">
        {isQuestion && <p className="text-xs text-muted-foreground">{formatQuestionPosition(item.position, total)}</p>}
        <p className={cn(BUBBLE_CLASS, "rounded-bl-md bg-muted", isQuestion ? "text-base" : "text-sm text-muted-foreground")}>
          <span className="sr-only">Interviewer: </span>
          {item.text}
        </p>
      </div>
    </div>
  );
}
