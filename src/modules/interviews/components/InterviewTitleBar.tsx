"use client";

import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { INTERVIEW_TYPE_LABELS, LEVEL_LABELS, ROLE_LABELS } from "../constants";
import type { InterviewSession } from "../types/interviews.types";
import { formatQuestionCount } from "../utils/format-question-count";
import { EndInterviewDialog } from "./EndInterviewDialog";

type InterviewTitleBarProps = {
  session: InterviewSession;
  /** The last visible question's position. */
  position: number;
  /** Omit once the interview is over: the menu then only shows the details. */
  onEnd?: () => void;
};

/**
 * The conversation's title, like a chat app's: the interview it is, a menu with its details and End interview
 * (a rare, leaving action, one deliberate step away), and quiet progress on the right.
 */
export function InterviewTitleBar({ session, position, onEnd }: InterviewTitleBarProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const titleButton = useRef<HTMLButtonElement>(null);
  // Named the way you'd say it out loud ("Junior Backend interview"); the style and length are in the menu.
  const title = `${LEVEL_LABELS[session.level]} ${ROLE_LABELS[session.role]} interview`;

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

      <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
        <span className="sr-only">Question </span>
        {position} of {session.question_count}
      </p>

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
