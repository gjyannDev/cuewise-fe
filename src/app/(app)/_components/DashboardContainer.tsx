"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ContinueInterviewCard } from "@/modules/interviews/components/dashboard/ContinueInterviewCard";
import { DASHBOARD_TITLE_CLASS } from "@/modules/interviews/components/dashboard/dashboard.styles";
import { DashboardMetrics } from "@/modules/interviews/components/dashboard/DashboardMetrics";
import { FeedbackSnapshotCard } from "@/modules/interviews/components/dashboard/FeedbackSnapshotCard";
import { RecentInterviewsCard } from "@/modules/interviews/components/dashboard/RecentInterviewsCard";
import { DASHBOARD_COPY } from "@/modules/interviews/constants";
import { type SectionStatus, useDashboardOverview } from "@/modules/interviews/hooks/use-dashboard-overview";
import { useFeedbackQuery } from "@/modules/interviews/queries/interviews.queries";
import { getFeedbackSnapshot } from "@/modules/interviews/utils/dashboard.utils";
import { RESUME_ROUTE } from "@/modules/profile/constants";
import { useProfileQuery } from "@/modules/profile/queries/profile.queries";

const NUDGE = DASHBOARD_COPY.resume;

/**
 * The dashboard: reads the user's interviews, newest feedback and profile, and picks which sections show. Each section
 * loads and fails on its own, so a slow or failed one never hides the rest.
 */
export function DashboardContainer() {
  const overview = useDashboardOverview();
  const profile = useProfileQuery();
  const latest = overview.latestCompleted;
  const feedback = useFeedbackQuery(latest?.id);

  // Only a confirmed "no résumé": while loading or after an error, a missing nudge beats a wrong one.
  const nudge = profile.data === null && (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <h2 className={DASHBOARD_TITLE_CLASS}>{NUDGE.title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 justify-between gap-4">
        <p className="text-sm text-muted-foreground">{NUDGE.description}</p>
        <div>
          <Button asChild variant="outline">
            <Link href={RESUME_ROUTE}>{NUDGE.action}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (overview.isNewUser) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={cn(nudge ? "lg:col-span-2" : "lg:col-span-3")}>
          <ContinueInterviewCard status="success" onRetry={overview.retryRecent} />
        </div>
        {nudge}
      </div>
    );
  }

  // Hidden once it's known there is no completed interview; shown (loading or failed) until then.
  const showFeedback = overview.completedStatus !== "success" || overview.completedCount > 0;
  let feedbackStatus: SectionStatus = overview.completedStatus;
  if (feedbackStatus === "success") {
    feedbackStatus = feedback.isPending ? "pending" : feedback.data === undefined ? "error" : "success";
  }
  const retryFeedback = overview.completedStatus === "error" ? overview.retryCompleted : () => void feedback.refetch();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={cn(showFeedback ? "lg:col-span-2" : "lg:col-span-3")}>
          <ContinueInterviewCard
            status={overview.recentStatus}
            interview={overview.inProgress}
            onRetry={overview.retryRecent}
          />
        </div>
        {showFeedback && (
          <FeedbackSnapshotCard
            status={feedbackStatus}
            interview={latest}
            snapshot={feedback.data === undefined ? undefined : getFeedbackSnapshot(feedback.data)}
            onRetry={retryFeedback}
          />
        )}
      </div>

      <DashboardMetrics
        status={overview.metricsStatus}
        total={overview.total}
        completedCount={overview.completedCount}
        rate={overview.rate}
        thisWeek={overview.thisWeek}
        onRetry={overview.retryMetrics}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={cn(nudge ? "lg:col-span-2" : "lg:col-span-3")}>
          <RecentInterviewsCard
            status={overview.recentStatus}
            interviews={overview.recent}
            onRetry={overview.retryRecent}
          />
        </div>
        {nudge}
      </div>
    </div>
  );
}
