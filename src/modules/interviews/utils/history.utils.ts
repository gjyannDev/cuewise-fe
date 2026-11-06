import type { PaginationState, SortingState } from "@tanstack/react-table";

import { HISTORY_DEFAULT_PARAMS, HISTORY_PAGE_SIZES, HISTORY_ROUTE } from "../constants";
import {
  historyOrderParamSchema,
  historyPageParamSchema,
  historySizeParamSchema,
  historySortParamSchema,
  historyStatusParamSchema,
} from "../schemas/interviews.schema";
import type { HistoryParams, InterviewListParams } from "../types/interviews.types";

type RawParam = string | string[] | undefined;
type RawHistoryParams = Partial<Record<"page" | "size" | "sort" | "order" | "status", RawParam>>;

/**
 * `/history`'s query string as plain values. Each invalid (or repeated) value falls back to its own default, so an
 * old or hand-edited link still shows the history instead of an error.
 */
export function parseHistoryParams(raw: RawHistoryParams): HistoryParams {
  const status = historyStatusParamSchema.safeParse(raw.status);
  return {
    page: historyPageParamSchema.safeParse(raw.page).data ?? HISTORY_DEFAULT_PARAMS.page,
    size: historySizeParamSchema.safeParse(raw.size).data ?? HISTORY_DEFAULT_PARAMS.size,
    sort: historySortParamSchema.safeParse(raw.sort).data ?? HISTORY_DEFAULT_PARAMS.sort,
    order: historyOrderParamSchema.safeParse(raw.order).data ?? HISTORY_DEFAULT_PARAMS.order,
    ...(status.success && { status: status.data }),
  };
}

/** The `/history` URL for these params; defaults are left out so the plain link stays `/history`. */
export function buildHistoryHref({ page, size, sort, order, status }: HistoryParams): string {
  const query = new URLSearchParams();
  if (page !== HISTORY_DEFAULT_PARAMS.page) {
    query.set("page", String(page));
  }
  if (size !== HISTORY_DEFAULT_PARAMS.size) {
    query.set("size", String(size));
  }
  if (sort !== HISTORY_DEFAULT_PARAMS.sort) {
    query.set("sort", sort);
  }
  if (order !== HISTORY_DEFAULT_PARAMS.order) {
    query.set("order", order);
  }
  if (status) {
    query.set("status", status);
  }
  const search = query.toString();
  return search ? `${HISTORY_ROUTE}?${search}` : HISTORY_ROUTE;
}

/** The GET /interviews query for one history page. The backend's default order is ours, so it is only sent when changed. */
export function toHistoryListParams({ page, size, sort, order, status }: HistoryParams): InterviewListParams {
  const isDefaultSort = sort === HISTORY_DEFAULT_PARAMS.sort && order === HISTORY_DEFAULT_PARAMS.order;
  return {
    limit: size,
    offset: (page - 1) * size,
    ...(status && { status }),
    ...(!isDefaultSort && { sort_by: sort, sort_dir: order }),
  };
}

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
