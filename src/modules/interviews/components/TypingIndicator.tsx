"use client";

import { useReducedMotion } from "motion/react";

import { Shimmer } from "@/components/ai-elements/shimmer";

import { InterviewerAvatar } from "./InterviewerAvatar";

type TypingIndicatorProps = {
  label: string;
};

/**
 * The interviewer "thinking" while the reply is on its way. Visual only: the thread announces the label through its
 * own status region. Shimmer animates through motion and ignores reduced motion, so those users get static text.
 */
export function TypingIndicator({ label }: TypingIndicatorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="flex items-start gap-3">
      <InterviewerAvatar />
      <div className="pt-1 text-sm">
        {reduceMotion ? <span className="text-muted-foreground">{label}</span> : <Shimmer as="span">{label}</Shimmer>}
      </div>
    </div>
  );
}
