import {
  CircleDashedIcon,
  ClipboardListIcon,
  ClockIcon,
  CloudOffIcon,
  type LucideIcon,
  MessageSquareDashedIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { FEEDBACK_MESSAGES, HISTORY_ROUTE, INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import type { FeedbackView } from "@/modules/interviews/types/interviews.types";
import { InterviewMessageCard } from "@/modules/interviews/components/common/InterviewMessageCard";

/** Every screen of the feedback page that is a message rather than the result. */
export type FeedbackMessageKind = Extract<
  FeedbackView["kind"],
  "none" | "insufficient" | "failed" | "stalled" | "unavailable" | "notCompleted" | "unknown"
>;

type FeedbackStateMessageProps = {
  kind: FeedbackMessageKind;
  interviewId: string;
  /** The backend's own message for `insufficient`; the constant copy is used without one. */
  message?: string | null;
  /** Starts a generation (Get feedback, and Try again after a failure or a stall). */
  onGenerate: () => void;
  /** Repeats whatever failed (Try again on the generic error). */
  onRetry: () => void;
};

const ICONS: Record<FeedbackMessageKind, LucideIcon> = {
  none: ClipboardListIcon,
  insufficient: MessageSquareDashedIcon,
  failed: TriangleAlertIcon,
  stalled: ClockIcon,
  unavailable: CloudOffIcon,
  notCompleted: CircleDashedIcon,
  unknown: TriangleAlertIcon,
};
const ALERTS = new Set<FeedbackMessageKind>(["failed", "unavailable", "unknown"]);

const linkButton = (href: string, label: string, variant: "default" | "outline" = "default") => (
  <Button asChild size="lg" variant={variant} className="h-11 w-full sm:w-auto">
    <Link href={href}>{label}</Link>
  </Button>
);

/** One message card per non-result screen, each with the one or two actions that move the user on. */
export function FeedbackStateMessage({ kind, interviewId, message, onGenerate, onRetry }: FeedbackStateMessageProps) {
  const tryAgain = (onClick: () => void, variant: "default" | "outline" = "default") => (
    <Button size="lg" variant={variant} className="h-11 w-full sm:w-auto" onClick={onClick}>
      <RotateCcwIcon aria-hidden data-icon="inline-start" />
      Try again
    </Button>
  );

  const actions: Record<FeedbackMessageKind, ReactNode> = {
    none: (
      <Button size="lg" className="h-11 w-full sm:w-auto" onClick={onGenerate}>
        Get feedback
      </Button>
    ),
    insufficient: linkButton(INTERVIEWS_ROUTE, "Start a new interview"),
    failed: tryAgain(onGenerate),
    stalled: tryAgain(onGenerate),
    unavailable: (
      <>
        {tryAgain(onGenerate)}
        {linkButton(HISTORY_ROUTE, "Back to history", "outline")}
      </>
    ),
    notCompleted: linkButton(`${INTERVIEWS_ROUTE}?session=${encodeURIComponent(interviewId)}`, "Continue interview"),
    unknown: tryAgain(onRetry),
  };
  const copy = FEEDBACK_MESSAGES[kind];

  return (
    <InterviewMessageCard
      role={ALERTS.has(kind) ? "alert" : undefined}
      icon={ICONS[kind]}
      title={copy.title}
      description={(kind === "insufficient" && message) || copy.description}
      action={<div className="flex flex-col gap-2 sm:flex-row sm:justify-center">{actions[kind]}</div>}
    />
  );
}
