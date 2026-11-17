import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_COPY } from "@/modules/interviews/constants";
import type { SectionStatus } from "@/modules/interviews/hooks/use-dashboard-overview";

import { DASHBOARD_LABEL_CLASS, DASHBOARD_NUMBER_CLASS, DASHBOARD_TITLE_CLASS } from "./dashboard.styles";
import { DashboardSectionError } from "./DashboardSectionError";

type DashboardMetricsProps = {
  status: SectionStatus;
  total: number;
  completedCount: number;
  /** Whole percent, or null when there is nothing to divide by. */
  rate: number | null;
  /** `capped`: the count only saw the newest interviews and the real number may be higher. */
  thisWeek: { count: number; capped: boolean };
  onRetry: () => void;
};

const COPY = DASHBOARD_COPY.metrics;
const TITLE_ID = "dashboard-metrics-title";
// Two columns on phones and tablets; one row split by rules on wide screens.
const GRID = "grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:divide-x";
const CELL = "flex flex-col gap-2 pr-6 lg:px-6 lg:first:pl-0 lg:last:pr-0";

/** The practice numbers in one card: label above value, nothing else. */
export function DashboardMetrics({ status, total, completedCount, rate, thisWeek, onRetry }: DashboardMetricsProps) {
  let body;
  if (status === "pending") {
    body = (
      <div aria-busy="true" className={GRID}>
        <span className="sr-only">Loading your numbers…</span>
        {[0, 1, 2, 3].map((cell) => (
          <div key={cell} className={CELL}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
    );
  } else if (status === "error") {
    body = <DashboardSectionError onRetry={onRetry} />;
  } else {
    const metrics = [
      { label: COPY.total, value: String(total) },
      { label: COPY.completed, value: String(completedCount) },
      { label: COPY.rate, value: rate === null ? "—" : `${rate}%` },
      { label: COPY.thisWeek, value: `${thisWeek.count}${thisWeek.capped ? "+" : ""}` },
    ];
    body = (
      <dl className={GRID}>
        {metrics.map(({ label, value }) => (
          <div key={label} className={CELL}>
            <dt className={DASHBOARD_LABEL_CLASS}>{label}</dt>
            <dd className={DASHBOARD_NUMBER_CLASS}>{value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <Card role="region" aria-labelledby={TITLE_ID}>
      <CardHeader>
        <CardTitle>
          <h2 id={TITLE_ID} className={DASHBOARD_TITLE_CLASS}>
            {COPY.title}
          </h2>
        </CardTitle>
        <CardDescription>{COPY.description}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
