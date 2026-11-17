import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_COPY,
  DASHBOARD_RECENT_COUNT,
  feedbackRoute,
  HISTORY_ROUTE,
  INTERVIEW_TYPE_LABELS,
  INTERVIEWS_ROUTE,
  SESSION_STATUS_BADGE_VARIANTS,
  SESSION_STATUS_LABELS,
} from "@/modules/interviews/constants";
import type { SectionStatus } from "@/modules/interviews/hooks/use-dashboard-overview";
import type { InterviewListItem } from "@/modules/interviews/types/interviews.types";
import { formatInterviewDate, formatInterviewTitle } from "@/modules/interviews/utils/format.utils";

import { DASHBOARD_LINK_CLASS, DASHBOARD_TITLE_CLASS } from "./dashboard.styles";
import { DashboardSectionError } from "./DashboardSectionError";

type RecentInterviewsCardProps = {
  status: SectionStatus;
  interviews: InterviewListItem[];
  onRetry: () => void;
};

const COPY = DASHBOARD_COPY.recent;
const ROWS = Array.from({ length: DASHBOARD_RECENT_COUNT }, (_, index) => index);
// Every row's action column has one width, so the actions line up whether a row has one or not.
const ACTION_WIDTH = "w-24";

/** The newest interviews: what each was, its status and date, and what to do next. The full list is /history. */
export function RecentInterviewsCard({ status, interviews, onRetry }: RecentInterviewsCardProps) {
  let body;
  if (status === "pending") {
    body = (
      <div aria-busy="true" className="flex flex-col gap-3">
        <span className="sr-only">Loading your interviews…</span>
        {ROWS.map((row) => (
          <Skeleton key={row} className="h-10 w-full" />
        ))}
      </div>
    );
  } else if (status === "error") {
    body = <DashboardSectionError onRetry={onRetry} />;
  } else {
    body = (
      <ul className="flex flex-col divide-y">
        {interviews.map((interview) => (
          <li key={interview.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm font-medium">{formatInterviewTitle(interview)}</p>
              <div className="flex min-w-0 items-center gap-2">
                <Badge variant={SESSION_STATUS_BADGE_VARIANTS[interview.status]}>
                  {SESSION_STATUS_LABELS[interview.status]}
                </Badge>
                <span className="truncate text-xs text-muted-foreground">
                  {INTERVIEW_TYPE_LABELS[interview.interview_type]} · {formatInterviewDate(interview.created_at)}
                </span>
              </div>
            </div>
            <div className={`flex shrink-0 justify-end ${ACTION_WIDTH}`}>
              <RowAction interview={interview} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <h2 className={DASHBOARD_TITLE_CLASS}>{COPY.title}</h2>
        </CardTitle>
        <CardAction>
          <Link href={HISTORY_ROUTE} className={DASHBOARD_LINK_CLASS}>
            {COPY.seeAll}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}

/** Resume an interview in progress, open a completed one's feedback; an abandoned one has nothing to do. */
function RowAction({ interview }: { interview: InterviewListItem }) {
  const which = `${formatInterviewTitle(interview)} started ${formatInterviewDate(interview.created_at)}`;

  if (interview.status === "in_progress") {
    return (
      <Button asChild size="sm" variant="outline" className={ACTION_WIDTH}>
        <Link href={`${INTERVIEWS_ROUTE}?session=${interview.id}`} aria-label={`Resume ${which}`}>
          Resume
        </Link>
      </Button>
    );
  }
  if (interview.status === "completed") {
    return (
      <Button asChild size="sm" variant="outline" className={ACTION_WIDTH}>
        <Link href={feedbackRoute(interview.id)} aria-label={`View feedback for ${which}`}>
          Feedback
        </Link>
      </Button>
    );
  }
  return null;
}
