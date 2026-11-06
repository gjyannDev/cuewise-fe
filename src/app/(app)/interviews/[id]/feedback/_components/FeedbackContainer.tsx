"use client";

import { FeedbackGenerating } from "@/modules/interviews/components/feedback/FeedbackGenerating";
import { FeedbackResult } from "@/modules/interviews/components/feedback/FeedbackResult";
import { FeedbackSkeleton } from "@/modules/interviews/components/feedback/FeedbackSkeleton";
import { FeedbackStateMessage } from "@/modules/interviews/components/feedback/FeedbackStateMessage";
import { InterviewNotFoundCard } from "@/modules/interviews/components/common/InterviewNotFoundCard";
import { FEEDBACK_READY_ANNOUNCEMENT } from "@/modules/interviews/constants";
import { useInterviewFeedback } from "@/modules/interviews/hooks/use-interview-feedback";

type FeedbackContainerProps = {
  interviewId: string;
  /** The closing card's `?start=1`: generate on arrival if nothing is stored. Render with `key={interviewId}`. */
  startFlag: boolean;
};

/** Reads (or generates) the interview's feedback and picks the screen; every screen itself is presentational. */
export function FeedbackContainer({ interviewId, startFlag }: FeedbackContainerProps) {
  const { view, justGenerated, generate, retry } = useInterviewFeedback(interviewId, startFlag);

  let screen;
  switch (view.kind) {
    case "loading":
      screen = <FeedbackSkeleton />;
      break;
    case "generating":
      screen = <FeedbackGenerating />;
      break;
    case "generated":
      screen = <FeedbackResult feedback={view.feedback} autoFocus={justGenerated} />;
      break;
    case "notFound":
      screen = <InterviewNotFoundCard />;
      break;
    default:
      screen = (
        <FeedbackStateMessage
          kind={view.kind}
          interviewId={interviewId}
          message={view.kind === "insufficient" ? view.message : undefined}
          onGenerate={generate}
          onRetry={retry}
        />
      );
  }

  return (
    <>
      {/* Always mounted, so the change is announced when the result replaces the generating screen. */}
      <p role="status" className="sr-only">
        {justGenerated ? FEEDBACK_READY_ANNOUNCEMENT : ""}
      </p>
      {screen}
    </>
  );
}
