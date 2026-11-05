import { HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE } from "../constants";
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
