"use client";

import { functionalUpdate, useTable } from "@tanstack/react-table";
import { useMemo } from "react";

import { dataTableFeatures } from "@/shared/ui/data-table-features";

import { interviewHistoryColumns } from "@/modules/interviews/components/history/interview-history-columns";
import type { HistoryParams, InterviewListItem } from "../types/interviews.types";
import { applyPaginationChange, applySortingChange, toPaginationState, toSortingState } from "../utils/history.utils";

type InterviewHistoryTableOptions = {
  /** The page's rows straight from the query (never copied into state). */
  interviews: InterviewListItem[];
  /** Every interview matching the filter, from the backend: what the pager counts pages from. */
  total: number;
  /** The URL state; the table reads its pagination and sorting from here. */
  params: HistoryParams;
  /** Called with the new URL state when the pager or a header asks for another page, size or sort. */
  onParamsChange: (params: HistoryParams) => void;
};

/**
 * The history's TanStack table. Pagination and sorting are server-side (`manual*`, `rowCount`): the table never
 * slices or reorders `interviews`, it only works out the pager and header state and turns clicks into new params.
 */
export function useInterviewHistoryTable({ interviews, total, params, onParamsChange }: InterviewHistoryTableOptions) {
  // Same values, same objects: the table re-publishes controlled state only when it changes, so stable references keep
  // that check trivial on every render.
  const { page, size, sort, order } = params;
  const pagination = useMemo(() => toPaginationState({ page, size, sort, order }), [page, size, sort, order]);
  const sorting = useMemo(() => toSortingState({ page, size, sort, order }), [page, size, sort, order]);

  const table = useTable({
    features: dataTableFeatures,
    columns: interviewHistoryColumns,
    data: interviews,
    getRowId: (interview) => interview.id,
    manualPagination: true,
    manualSorting: true,
    rowCount: total,
    enableMultiSort: false,
    enableSortingRemoval: false,
    state: { pagination, sorting },
    onPaginationChange: (updater) =>
      onParamsChange(applyPaginationChange(params, functionalUpdate(updater, pagination), table.getPageCount())),
    onSortingChange: (updater) => onParamsChange(applySortingChange(params, functionalUpdate(updater, sorting))),
  });

  return table;
}
