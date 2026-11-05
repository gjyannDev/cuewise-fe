import { Skeleton } from "@/components/ui/skeleton";

import { HISTORY_PAGE_SIZE } from "../constants";

const ROWS = Array.from({ length: Math.min(HISTORY_PAGE_SIZE, 5) }, (_, index) => index);

/** The history's first load: filter, table rows and pager in the same places, so nothing jumps when they arrive. */
export function InterviewHistorySkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading your interviews…</span>
      <Skeleton className="h-9 w-56" />
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
        <Skeleton className="h-5 w-full" />
        {ROWS.map((row) => (
          <Skeleton key={row} className="h-9 w-full" />
        ))}
      </div>
      <Skeleton className="h-8 w-48" />
    </div>
  );
}
