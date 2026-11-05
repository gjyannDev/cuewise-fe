import { describe, expect, it } from "vitest";

import { HISTORY_DEFAULT_PARAMS } from "@/modules/interviews/constants";
import type { HistoryParams } from "@/modules/interviews/types/interviews.types";
import {
  applyPaginationChange,
  applySortingChange,
  toPaginationState,
  toSortingState,
} from "@/modules/interviews/utils/history-table-state";

const params = (overrides: Partial<HistoryParams> = {}): HistoryParams => ({ ...HISTORY_DEFAULT_PARAMS, ...overrides });

describe("toPaginationState", () => {
  it("turns the 1-based page and size into TanStack's 0-based page index (R1)", () => {
    expect(toPaginationState(params())).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(toPaginationState(params({ page: 3, size: 20 }))).toEqual({ pageIndex: 2, pageSize: 20 });
  });
});

describe("toSortingState", () => {
  it("is one column with its direction (R4)", () => {
    expect(toSortingState(params())).toEqual([{ id: "created_at", desc: true }]);
    expect(toSortingState(params({ sort: "role", order: "asc" }))).toEqual([{ id: "role", desc: false }]);
  });
});

describe("applyPaginationChange", () => {
  const current = params({ page: 3, size: 20, sort: "level", order: "asc", status: "completed" });

  it("moves to the new page and keeps the size, sort and filter (R1)", () => {
    expect(applyPaginationChange(current, { pageIndex: 3, pageSize: 20 }, 9)).toEqual({ ...current, page: 4 });
    expect(applyPaginationChange(current, { pageIndex: 0, pageSize: 20 }, 9)).toEqual({ ...current, page: 1 });
  });

  it("goes back to page 1 when the size changes, whatever page TanStack picked (R2, E3)", () => {
    expect(applyPaginationChange(current, { pageIndex: 1, pageSize: 50 }, 9)).toEqual({ ...current, page: 1, size: 50 });
  });

  it("ignores a size that isn't offered (R2)", () => {
    expect(applyPaginationChange(current, { pageIndex: 2, pageSize: 7 }, 9)).toEqual(current);
  });

  it("steps back from a page past the end to the last real page (history EC5, E2)", () => {
    const pastEnd = params({ page: 9 });

    expect(applyPaginationChange(pastEnd, { pageIndex: 7, pageSize: 10 }, 2)).toEqual({ ...pastEnd, page: 2 });
  });

  it("never goes below page 1, even for an empty history (pageCount 0)", () => {
    expect(applyPaginationChange(params(), { pageIndex: -1, pageSize: 10 }, 0)).toEqual(params());
  });
});

describe("applySortingChange", () => {
  const current = params({ page: 3, size: 20, status: "abandoned" });

  it("keeps the new column and direction and goes back to page 1 (R4, E4)", () => {
    expect(applySortingChange(current, [{ id: "role", desc: false }])).toEqual({
      ...current,
      page: 1,
      sort: "role",
      order: "asc",
    });
    expect(applySortingChange(current, [{ id: "created_at", desc: false }])).toEqual({
      ...current,
      page: 1,
      order: "asc",
    });
  });

  it("falls back to newest first for an empty sort or a column the backend can't sort (R4)", () => {
    const sorted = params({ sort: "role", order: "asc" });

    expect(applySortingChange(sorted, [])).toEqual(params());
    expect(applySortingChange(sorted, [{ id: "progress", desc: true }])).toEqual(params());
  });
});
