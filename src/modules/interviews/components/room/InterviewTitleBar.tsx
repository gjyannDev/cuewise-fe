"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import { INTERVIEW_TYPE_LABELS } from "@/modules/interviews/constants";
import type { InterviewSession } from "@/modules/interviews/types/interviews.types";
import {
  formatInterviewTitle,
  formatQuestionCount,
  formatQuestionPosition,
} from "@/modules/interviews/utils/format.utils";
import { EndInterviewDialog } from "./EndInterviewDialog";

type InterviewTitleBarProps = {
  session: InterviewSession;
  /** The last visible question's main number (follow-ups keep their main question's). */
  mainNumber: number;
  /** Omit once the interview is over: the menu then only shows the details. */
  onEnd?: () => void;
};

/**
 * The interview's title bar: the interview it is, a menu with its details and End interview
 * (a rare, leaving action, one deliberate step away), and a thin progress bar on the right.
 */
export function InterviewTitleBar({ session, mainNumber, onEnd }: InterviewTitleBarProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const titleButton = useRef<HTMLButtonElement>(null);
  const title = formatInterviewTitle(session);

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 pb-2">
      {/* Not modal: the menu hands off to the dialog, and a modal menu closing under it can leave the page inert. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button ref={titleButton} variant="ghost" className="-ml-2 h-11 min-w-0 gap-1.5 px-2 text-sm font-medium">
            <span className="truncate">{title}</span>
            <ChevronDownIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
            <span className="text-xs text-muted-foreground">Details</span>
            <span>
              {INTERVIEW_TYPE_LABELS[session.interview_type]} · {formatQuestionCount(session.question_count)}
            </span>
          </DropdownMenuLabel>
          {onEnd && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setIsConfirmOpen(true)}>
                <LogOutIcon aria-hidden />
                End interview
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex shrink-0 items-center gap-3">
        {/* The session says so, not the current profile: a deleted résumé doesn't change what this interview was. */}
        {session.use_profile && <Badge variant="outline">Résumé-aware</Badge>}
        {/* A thin bar, like a call app's: assistive technology reads "Question N of M" (AC11). shadcn's Progress keeps
            `value` for its indicator and doesn't pass it to Radix, so the ARIA values are set here. */}
        <Progress
          value={(Math.min(mainNumber, session.question_count) / session.question_count) * 100}
          aria-label="Interview progress"
          aria-valuemin={0}
          aria-valuemax={session.question_count}
          aria-valuenow={mainNumber}
          aria-valuetext={formatQuestionPosition(mainNumber, session.question_count)}
          className="w-20 sm:w-32"
        />
      </div>

      {onEnd && (
        <EndInterviewDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={onEnd}
          returnFocusTo={titleButton}
        />
      )}
    </div>
  );
}
