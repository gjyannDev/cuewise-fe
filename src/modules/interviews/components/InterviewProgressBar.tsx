import { cn } from "@/lib/utils";

import { ROLE_LABELS } from "../constants";
import type { InterviewSession } from "../types/interviews.types";
import { EndInterviewDialog } from "./EndInterviewDialog";

type InterviewProgressBarProps = {
  session: InterviewSession;
  /** e.g. "Question 2 of 5". */
  progress: string;
  /** Hidden once the interview is over. */
  onEnd?: () => void;
  className?: string;
};

/** The compact stand-in for the details card on narrow screens: where you are, and a way out. */
export function InterviewProgressBar({ session, progress, onEnd, className }: InterviewProgressBarProps) {
  return (
    <div className={cn("flex shrink-0 items-center justify-between gap-3 border-b pb-3", className)}>
      <p className="min-w-0 truncate text-sm">
        <span className="font-medium">{progress}</span>
        <span className="text-muted-foreground"> · {ROLE_LABELS[session.role]}</span>
      </p>
      {onEnd && <EndInterviewDialog onConfirm={onEnd} triggerClassName="w-auto shrink-0" />}
    </div>
  );
}
