import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DASHBOARD_COPY } from "@/modules/interviews/constants";

type DashboardSectionErrorProps = {
  onRetry: () => void;
};

/**
 * A dashboard section's body when it failed to load: one line and a Retry for that section only. It sits inside the
 * section's own card, so the page keeps its layout.
 */
export function DashboardSectionError({ onRetry }: DashboardSectionErrorProps) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.error}</p>
      <Button type="button" size="sm" variant="outline" onClick={onRetry}>
        <RotateCcwIcon aria-hidden data-icon="inline-start" />
        {DASHBOARD_COPY.retry}
      </Button>
    </div>
  );
}
