"use client";

import { FilterXIcon, HistoryIcon, RotateCcwIcon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InterviewHistorySkeleton } from "@/modules/interviews/components/InterviewHistorySkeleton";
import { InterviewHistoryStatusFilter } from "@/modules/interviews/components/InterviewHistoryStatusFilter";
import { InterviewMessageCard } from "@/modules/interviews/components/InterviewMessageCard";
import {
  HISTORY_EMPTY_DESCRIPTION,
  HISTORY_EMPTY_TITLE,
  HISTORY_ERROR_DESCRIPTION,
  HISTORY_ERROR_TITLE,
  HISTORY_FILTER_EMPTY_DESCRIPTION,
  HISTORY_PAGE_SIZES,
  HISTORY_PAST_END_DESCRIPTION,
  HISTORY_PAST_END_TITLE,
  HISTORY_REFRESH_ERROR,
  HISTORY_TABLE_LABEL,
  INTERVIEWS_ROUTE,
  SESSION_STATUS_LABELS,
} from "@/modules/interviews/constants";
import { useInterviewHistoryTable } from "@/modules/interviews/hooks/use-interview-history-table";
import { useInterviewHistoryQuery } from "@/modules/interviews/queries/interviews.queries";
import type { HistoryParams, InterviewListItem } from "@/modules/interviews/types/interviews.types";
import { formatInterviewCount } from "@/modules/interviews/utils/format-question-count";
import { buildHistoryHref, toHistoryListParams } from "@/modules/interviews/utils/history-params";
import { DataTable } from "@/shared/ui/DataTable";
import { DataTablePagination } from "@/shared/ui/DataTablePagination";

// Stable while nothing is loaded, so the table doesn't rebuild its rows on every render.
const NO_ROWS: InterviewListItem[] = [];

type HistoryContainerProps = {
  /** `?page=`, `?size=`, `?sort=`, `?order=` and `?status=`, already validated by the page. */
  params: HistoryParams;
};

/**
 * Owns the history query and the URL: paging, page size, sorting and filtering push a new URL (so Back works), and the
 * page passes the new params down. Picks the screen for the result and hands data and callbacks to presentational
 * components.
 */
export function HistoryContainer({ params }: HistoryContainerProps) {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const history = useInterviewHistoryQuery(toHistoryListParams(params));

  const goTo = (next: HistoryParams) => startNavigation(() => router.push(buildHistoryHref(next)));
  const table = useInterviewHistoryTable({
    interviews: history.data?.items ?? NO_ROWS,
    total: history.data?.total ?? 0,
    params,
    onParamsChange: goTo,
  });
  const filter = (
    // A new filter starts from its first page.
    <InterviewHistoryStatusFilter value={params.status} onChange={(status) => goTo({ ...params, page: 1, status })} />
  );

  if (history.isPending) {
    return <InterviewHistorySkeleton />;
  }
  // Only when nothing is cached for this page: a failed background refetch keeps the rows (alert below).
  if (!history.data) {
    return (
      <div className="flex flex-col gap-4">
        {filter}
        <InterviewMessageCard
          role="alert"
          icon={TriangleAlertIcon}
          title={HISTORY_ERROR_TITLE}
          description={HISTORY_ERROR_DESCRIPTION}
          action={
            <Button
              variant="outline"
              size="lg"
              className="h-11"
              disabled={history.isFetching}
              onClick={() => history.refetch()}
            >
              <RotateCcwIcon aria-hidden data-icon="inline-start" />
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const { items, total } = history.data;
  if (total === 0 && !params.status) {
    return (
      <InterviewMessageCard
        icon={HistoryIcon}
        title={HISTORY_EMPTY_TITLE}
        description={HISTORY_EMPTY_DESCRIPTION}
        action={
          <Button asChild size="lg" className="h-11">
            <Link href={INTERVIEWS_ROUTE}>Start an interview</Link>
          </Button>
        }
      />
    );
  }

  let content;
  if (total === 0 && params.status) {
    content = (
      <InterviewMessageCard
        icon={FilterXIcon}
        title={`No ${SESSION_STATUS_LABELS[params.status].toLowerCase()} interviews`}
        description={HISTORY_FILTER_EMPTY_DESCRIPTION}
        action={
          <Button
            variant="outline"
            size="lg"
            className="h-11"
            onClick={() => goTo({ ...params, page: 1, status: undefined })}
          >
            Show all
          </Button>
        }
      />
    );
  } else if (items.length === 0) {
    content = (
      <InterviewMessageCard
        icon={SearchXIcon}
        title={HISTORY_PAST_END_TITLE}
        description={HISTORY_PAST_END_DESCRIPTION}
        action={
          <Button variant="outline" size="lg" className="h-11" onClick={() => goTo({ ...params, page: 1 })}>
            Go to first page
          </Button>
        }
      />
    );
  } else {
    content = (
      <DataTable table={table} caption={HISTORY_TABLE_LABEL} isUpdating={history.isPlaceholderData || isNavigating} />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {filter}
      {history.isError && (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>{HISTORY_REFRESH_ERROR}</AlertTitle>
        </Alert>
      )}
      {content}
      {/* Nothing to page or resize while everything fits in the smallest page. */}
      {total > 0 && (total > HISTORY_PAGE_SIZES[0] || params.page > 1) && (
        <DataTablePagination table={table} pageSizes={HISTORY_PAGE_SIZES} summary={formatInterviewCount(total)} />
      )}
    </div>
  );
}
