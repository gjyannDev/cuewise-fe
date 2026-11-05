import type { PaginationState, SortingState } from "@tanstack/react-table";

import { HISTORY_DEFAULT_PARAMS, HISTORY_PAGE_SIZES } from "../constants";
import { historySortParamSchema } from "../schemas/interviews.schema";
import type { HistoryParams } from "../types/interviews.types";

/**
 * The bridge between `/history`'s URL and TanStack Table's state. The URL is the only source of truth: the table gets
 * its pagination and sorting from it, and every change the table asks for becomes a new URL.
 */

export function toPaginationState({ page, size }: HistoryParams): PaginationState {
  return { pageIndex: page - 1, pageSize: size };
}

export function toSortingState({ sort, order }: HistoryParams): SortingState {
  return [{ id: sort, desc: order === "desc" }];
}

/**
 * The URL params after a pager action. A new page size starts again from page 1 (TanStack would keep the top row in
 * view instead), like a new filter does; a size that isn't offered changes nothing. A page past the end (an old link)
 * steps back to the last real page; `pageCount` is the table's current one.
 */
export function applyPaginationChange(
  params: HistoryParams,
  { pageIndex, pageSize }: PaginationState,
  pageCount: number,
): HistoryParams {
  if (pageSize !== params.size) {
    const offered = (HISTORY_PAGE_SIZES as readonly number[]).includes(pageSize);
    return offered ? { ...params, page: 1, size: pageSize } : params;
  }
  return { ...params, page: Math.max(1, Math.min(pageIndex + 1, pageCount)) };
}

/** The URL params after a header click: one column at a time, from page 1. Anything else falls back to newest first. */
export function applySortingChange(params: HistoryParams, sorting: SortingState): HistoryParams {
  const [first] = sorting;
  const sort = historySortParamSchema.safeParse(first?.id);
  if (!first || !sort.success) {
    return { ...params, page: 1, sort: HISTORY_DEFAULT_PARAMS.sort, order: HISTORY_DEFAULT_PARAMS.order };
  }
  return { ...params, page: 1, sort: sort.data, order: first.desc ? "desc" : "asc" };
}
