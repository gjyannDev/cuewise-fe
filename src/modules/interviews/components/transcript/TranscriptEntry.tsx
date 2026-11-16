import { Volume2Icon } from "lucide-react";
import type { Ref } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { InterviewerAvatar } from "@/modules/interviews/components/common/InterviewerAvatar";
import type { InterviewerLine, TranscriptLine } from "@/modules/interviews/types/interviews.types";
import { formatQuestionCaption } from "@/modules/interviews/utils/format.utils";

type TranscriptEntryProps = {
  item: TranscriptLine;
  /** The interview's question count, for the "Question N of M" label. */
  total: number;
  ref?: Ref<HTMLDivElement>;
  /** Replays an interviewer line; omitted (no button) where replay makes no sense. */
  onReplay?: (line: InterviewerLine) => void;
  /** False while the mic is open or a send is in flight (the spec's turn table). */
  canReplay?: boolean;
};

/**
 * One line of the interview transcript, as plain text (never HTML): the interviewer's lines are plain text beside its
 * avatar (with a replay button once saved), the candidate's answers sit in a soft bubble on the right. The transcribed
 * answer under review is that bubble marked "Not sent"; its Send and Re-record live on the room's review card, so the
 * transcript can stay closed.
 */
export function TranscriptEntry({
  item,
  total,
  ref,
  onReplay,
  canReplay = true,
}: TranscriptEntryProps) {
  if (item.role === "candidate") {
    return (
      <div ref={ref} className="flex flex-col items-end gap-2">
        <p
          className={cn(
            "max-w-[85%] min-w-0 rounded-2xl bg-muted px-4 py-2.5 whitespace-pre-wrap wrap-anywhere transition-opacity",
            item.pending && "opacity-60",
            item.unsent && "border border-dashed border-border bg-background",
          )}
        >
          <span className="sr-only">{item.unsent ? "Your answer, not sent yet: " : "You: "}</span>
          {item.text}
          {item.pending && <span className="sr-only"> (sending)</span>}
        </p>
        {item.unsent && (
          <span aria-hidden className="text-xs text-muted-foreground">
            Not sent
          </span>
        )}
      </div>
    );
  }

  const isQuestion = item.kind === "question";
  const startsGroup = isQuestion && item.question_kind === "main";
  // Streamed lines aren't saved yet (no stable id), so they can't be replayed until they are.
  const replayable = onReplay !== undefined && !item.streaming;
  const lineLabel = isQuestion ? (item.question_kind === "follow_up" ? "follow-up" : "question") : "reaction";
  return (
    <div
      ref={ref}
      aria-busy={item.streaming || undefined}
      className={cn("flex items-start gap-3", startsGroup && "mt-6 first:mt-0")}
    >
      <InterviewerAvatar />
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
        {isQuestion && <p className="text-xs font-medium text-muted-foreground">{formatQuestionCaption(item, total)}</p>}
        <p
          className={cn(
            "whitespace-pre-wrap wrap-anywhere",
            isQuestion ? "text-base leading-relaxed" : "text-sm text-muted-foreground",
          )}
        >
          <span className="sr-only">Interviewer: </span>
          {item.text}
        </p>
      </div>
      {replayable && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 text-muted-foreground"
          aria-label={`Replay this ${lineLabel}`}
          disabled={!canReplay}
          onClick={() => onReplay({ kind: isQuestion ? "question" : "reaction", id: item.id })}
        >
          <Volume2Icon aria-hidden />
        </Button>
      )}
    </div>
  );
}
