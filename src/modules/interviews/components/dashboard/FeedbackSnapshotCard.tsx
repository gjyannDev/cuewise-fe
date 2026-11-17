import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_COPY,
  feedbackRoute,
  feedbackStartRoute,
  FEEDBACK_SECTIONS,
  SCORE_MAX,
} from "@/modules/interviews/constants";
import type { SectionStatus } from "@/modules/interviews/hooks/use-dashboard-overview";
import type { InterviewListItem } from "@/modules/interviews/types/interviews.types";
import type { FeedbackSnapshot } from "@/modules/interviews/utils/dashboard.utils";
import { formatOverall } from "@/modules/interviews/utils/feedback.utils";
import { formatInterviewTitle } from "@/modules/interviews/utils/format.utils";

import {
  DASHBOARD_LABEL_CLASS,
  DASHBOARD_LINK_CLASS,
  DASHBOARD_NUMBER_CLASS,
  DASHBOARD_TITLE_CLASS,
} from "./dashboard.styles";
import { DashboardSectionError } from "./DashboardSectionError";

type FeedbackSnapshotCardProps = {
  status: SectionStatus;
  /** The newest completed interview and what its feedback shows; both set once `status` is success. */
  interview?: InterviewListItem;
  snapshot?: FeedbackSnapshot;
  onRetry: () => void;
};

const COPY = DASHBOARD_COPY.feedback;

/**
 * The newest completed interview's result: its score and one thing to work on, the summary when it couldn't be scored,
 * or a way to the feedback page when there is nothing yet. AI text is shown as plain text.
 */
export function FeedbackSnapshotCard({ status, interview, snapshot, onRetry }: FeedbackSnapshotCardProps) {
  const ready = status === "success" && interview && snapshot;
  const hasResult = ready && snapshot.kind !== "pending";

  let body;
  if (status === "error") {
    body = <DashboardSectionError onRetry={onRetry} />;
  } else if (!ready) {
    body = (
      <div aria-busy="true" className="flex flex-col gap-3">
        <span className="sr-only">Loading your feedback…</span>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="mt-3 h-4 w-full" />
      </div>
    );
  } else if (snapshot.kind === "pending") {
    const pending = COPY.pending[snapshot.reason];
    body = (
      <>
        <p className="text-sm text-muted-foreground">{pending.description}</p>
        <div>
          {/* Only "none" asks the page to generate on arrival; otherwise the page shows the row's state. */}
          <Button asChild variant="outline">
            <Link href={snapshot.reason === "none" ? feedbackStartRoute(interview.id) : feedbackRoute(interview.id)}>
              {pending.action}
            </Link>
          </Button>
        </div>
      </>
    );
  } else if (snapshot.kind === "summary") {
    body = <p className="line-clamp-4 text-sm leading-relaxed">{snapshot.summary ?? COPY.lowEvidence}</p>;
  } else {
    body = (
      <>
        <div className="flex flex-col gap-2">
          <p className={DASHBOARD_LABEL_CLASS}>{FEEDBACK_SECTIONS.overall}</p>
          <p className="flex items-baseline gap-1">
            <span className={DASHBOARD_NUMBER_CLASS}>{formatOverall(snapshot.overall)}</span>
            <span className="text-sm text-muted-foreground">
              <span aria-hidden>/ {SCORE_MAX}</span>
              <span className="sr-only">out of {SCORE_MAX}</span>
            </span>
          </p>
        </div>
        {snapshot.takeaway && (
          <div className="flex flex-col gap-2 border-t pt-4">
            <p className={DASHBOARD_LABEL_CLASS}>{COPY.takeaway}</p>
            <p className="line-clamp-3 text-sm leading-relaxed">{snapshot.takeaway}</p>
          </div>
        )}
      </>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <h2 className={DASHBOARD_TITLE_CLASS}>{COPY.title}</h2>
        </CardTitle>
        {interview && <CardDescription>{formatInterviewTitle(interview)}</CardDescription>}
        {hasResult && (
          <CardAction>
            <Link href={feedbackRoute(interview.id)} className={DASHBOARD_LINK_CLASS}>
              {COPY.view}
            </Link>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-1 gap-4">{body}</CardContent>
    </Card>
  );
}
