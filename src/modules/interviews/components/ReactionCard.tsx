"use client";

import { ArrowRightIcon, MessageCircleIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ReactionCardProps = {
  text: string;
  /** The answer completed the interview: the button finishes instead of moving on. */
  isFinal: boolean;
  onContinue: () => void;
};

/** The interviewer's reaction to the answer just sent. A neutral acknowledgement, never feedback or a score. */
export function ReactionCard({ text, isFinal, onContinue }: ReactionCardProps) {
  const textId = useId();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent">
            <MessageCircleIcon aria-hidden className="size-5 text-primary-text" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">Interviewer</p>
            {/* Plain text on purpose, and a live region so the reaction is read out when it appears. */}
            <p id={textId} role="status" className="max-w-prose text-base">
              {text}
            </p>
          </div>
        </div>
        <div className="flex sm:justify-end">
          {/* Takes focus from the Next button it replaced, so keyboard users aren't dropped to the page start. */}
          <Button autoFocus size="lg" className="h-11 w-full sm:w-auto" aria-describedby={textId} onClick={onContinue}>
            {isFinal ? "Finish" : "Next question"}
            <ArrowRightIcon aria-hidden data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
