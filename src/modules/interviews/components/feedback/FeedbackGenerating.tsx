"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Shimmer } from "@/components/ai-elements/shimmer";

import {
  FEEDBACK_GENERATING_LABEL,
  FEEDBACK_LEAVE_HINT,
  FEEDBACK_SLOW_AFTER_MS,
  FEEDBACK_SLOW_LABEL,
} from "@/modules/interviews/constants";
import { FeedbackSkeleton } from "./FeedbackSkeleton";

/**
 * While the feedback is being written: a calm status line (announced), the note that leaving is safe, and the
 * result's shape. Mounted only for this state, so its "still working" timer starts over each time.
 */
export function FeedbackGenerating() {
  const reduceMotion = useReducedMotion();
  const [isSlow, setIsSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), FEEDBACK_SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);
  const label = isSlow ? FEEDBACK_SLOW_LABEL : FEEDBACK_GENERATING_LABEL;

  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p role="status" className="text-sm font-medium">
          {reduceMotion ? label : <Shimmer as="span">{label}</Shimmer>}
        </p>
        {FEEDBACK_LEAVE_HINT && <p className="text-sm text-muted-foreground">{FEEDBACK_LEAVE_HINT}</p>}
      </div>
      <FeedbackSkeleton />
    </div>
  );
}
