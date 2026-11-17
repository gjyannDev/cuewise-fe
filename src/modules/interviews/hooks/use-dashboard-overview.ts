import type { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

import { DASHBOARD_COMPLETED_PARAMS, DASHBOARD_RECENT_COUNT, DASHBOARD_RECENT_PARAMS } from "../constants";
import { useInterviewHistoryQuery } from "../queries/interviews.queries";
import { completionRate, countThisWeek } from "../utils/dashboard.utils";

/** A dashboard section's screen: a skeleton, an error with Retry, or its data. */
export type SectionStatus = "pending" | "error" | "success";

/** Data on hand wins: a failed background refetch keeps showing what was loaded. */
function sectionStatus(...queries: UseQueryResult[]): SectionStatus {
  if (queries.some((query) => query.isPending)) {
    return "pending";
  }
  return queries.every((query) => query.data !== undefined) ? "success" : "error";
}

/**
 * Everything the dashboard shows about the user's interviews, from two reads of GET /interviews: the newest page
 * (hero, Total, This week, recent list) and the newest completed interview (Completed, the feedback card).
 * The in-progress interview is always the newest one: cuewise-be abandons it when another one starts.
 */
export function useDashboardOverview() {
  const recent = useInterviewHistoryQuery(DASHBOARD_RECENT_PARAMS);
  const completed = useInterviewHistoryQuery(DASHBOARD_COMPLETED_PARAMS);
  // Read once per visit: "this week" doesn't need to tick while the page is open.
  const [now] = useState(() => new Date());

  const items = recent.data?.items ?? [];
  const total = recent.data?.total ?? 0;
  const completedCount = completed.data?.total ?? 0;
  const newest = items[0];

  return {
    recentStatus: sectionStatus(recent),
    metricsStatus: sectionStatus(recent, completed),
    completedStatus: sectionStatus(completed),
    retryRecent: () => void recent.refetch(),
    retryCompleted: () => void completed.refetch(),
    retryMetrics: () => {
      if (!recent.data) void recent.refetch();
      if (!completed.data) void completed.refetch();
    },
    isNewUser: recent.data !== undefined && total === 0,
    inProgress: newest?.status === "in_progress" ? newest : undefined,
    recent: items.slice(0, DASHBOARD_RECENT_COUNT),
    total,
    completedCount,
    rate: completionRate(completedCount, total),
    thisWeek: countThisWeek(items, total, now),
    latestCompleted: completed.data?.items[0],
  };
}
