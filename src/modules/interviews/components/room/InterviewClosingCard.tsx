import { CircleCheckIcon, FlagIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { focusOnMount } from "@/lib/utils";

const VARIANTS = {
  completed: {
    icon: CircleCheckIcon,
    title: "Interview complete",
    description: "You've answered every question. Thanks for practicing with Cuewise.",
  },
  // Ended on screen (End interview) or abandoned on the backend: no feedback yet, nothing to continue.
  ended: { icon: FlagIcon, title: "Interview ended", description: "Your answers so far are saved." },
} as const;

type InterviewClosingCardProps = {
  variant: keyof typeof VARIANTS;
  /** Move focus here when it replaces the room after a user action (not on page load). */
  autoFocus?: boolean;
  /** Completed interviews only: the feedback page, shown as the main action. */
  feedbackHref?: string;
  onStartNew: () => void;
};

/**
 * The end of the interview, shown in the middle of the dark stage like a call app's "you left the call" screen: a large
 * icon in an accent circle, the title and what happens next, and pill buttons. The transcript stays one toggle away.
 */
export function InterviewClosingCard({ variant, autoFocus = false, feedbackHref, onStartNew }: InterviewClosingCardProps) {
  const { icon: Icon, title, description } = VARIANTS[variant];
  // Ended early has no feedback (cuewise-be only scores completed interviews).
  const showFeedback = variant === "completed" && feedbackHref !== undefined;

  return (
    <div className="flex max-w-md flex-col items-center gap-5 px-2 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300">
      <span className="flex size-20 items-center justify-center rounded-full bg-accent ring-8 ring-accent/30 sm:size-24">
        <Icon aria-hidden className="size-9 text-primary-text sm:size-11" />
      </span>
      <div className="flex flex-col gap-2">
        <h2
          ref={autoFocus ? focusOnMount : undefined}
          tabIndex={-1}
          className="font-display text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
        >
          {title}
        </h2>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
        {showFeedback && (
          <Button asChild className="h-11 w-full rounded-full px-6 sm:w-auto">
            <Link href={feedbackHref}>Get feedback</Link>
          </Button>
        )}
        <Button
          variant={showFeedback ? "outline" : "default"}
          className="h-11 w-full rounded-full px-6 sm:w-auto"
          onClick={onStartNew}
        >
          Start a new interview
        </Button>
      </div>
    </div>
  );
}
