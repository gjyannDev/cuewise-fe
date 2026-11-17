import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_COPY, INTERVIEW_TYPE_LABELS, INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import type { SectionStatus } from "@/modules/interviews/hooks/use-dashboard-overview";
import type { InterviewListItem } from "@/modules/interviews/types/interviews.types";
import {
  formatInterviewTitle,
  formatProgress,
  formatQuestionCount,
} from "@/modules/interviews/utils/format.utils";

import { DASHBOARD_LABEL_CLASS, DASHBOARD_TITLE_CLASS } from "./dashboard.styles";
import { DashboardSectionError } from "./DashboardSectionError";

type ContinueInterviewCardProps = {
  status: SectionStatus;
  /** The interview to pick back up; none means the card offers a new one. */
  interview?: InterviewListItem;
  onRetry: () => void;
};

const COPY = DASHBOARD_COPY.hero;

/** The dashboard's first card and its one primary action: resume the interview in progress, or start a new one. */
export function ContinueInterviewCard({ status, interview, onRetry }: ContinueInterviewCardProps) {
  let body;
  if (status === "pending") {
    body = (
      <div aria-busy="true" className="flex flex-col gap-3">
        <span className="sr-only">Loading your interviews…</span>
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-3 h-2 w-full" />
      </div>
    );
  } else if (status === "error") {
    body = <DashboardSectionError onRetry={onRetry} />;
  } else if (interview) {
    body = (
      <>
        <div className="flex flex-col gap-1">
          <p className="font-display text-lg font-semibold">{formatInterviewTitle(interview)}</p>
          <p className="text-sm text-muted-foreground">
            {INTERVIEW_TYPE_LABELS[interview.interview_type]} · {formatQuestionCount(interview.question_count)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className={DASHBOARD_LABEL_CLASS}>Progress</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatProgress(interview.answered_count, interview.question_count)} answered
            </span>
          </div>
          <Progress
            value={(interview.answered_count / interview.question_count) * 100}
            aria-label="Questions answered"
            className="h-2 bg-border"
          />
        </div>
        <div>
          <Button asChild size="lg" className="h-11">
            <Link href={`${INTERVIEWS_ROUTE}?session=${interview.id}`}>{COPY.resume}</Link>
          </Button>
        </div>
      </>
    );
  } else {
    body = (
      <>
        <div className="flex flex-col gap-1">
          <p className="font-display text-lg font-semibold">{COPY.startHeadline}</p>
          <p className="max-w-md text-sm text-muted-foreground">{COPY.startDescription}</p>
        </div>
        <div>
          <Button asChild size="lg" className="h-11">
            <Link href={INTERVIEWS_ROUTE}>{COPY.start}</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <h2 className={DASHBOARD_TITLE_CLASS}>{interview ? COPY.resumeTitle : COPY.startTitle}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 justify-between gap-6">{body}</CardContent>
    </Card>
  );
}
