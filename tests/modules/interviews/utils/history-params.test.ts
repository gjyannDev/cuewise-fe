import { describe, expect, it } from "vitest";

import { HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE } from "@/modules/interviews/constants";
import type { HistoryParams } from "@/modules/interviews/types/interviews.types";
import { buildHistoryHref, parseHistoryParams, toHistoryListParams } from "@/modules/interviews/utils/history-params";

const params = (overrides: Partial<HistoryParams> = {}): HistoryParams => ({ ...HISTORY_DEFAULT_PARAMS, ...overrides });

describe("parseHistoryParams", () => {
  it("defaults to page 1, 10 rows, newest first and every status when the URL has none (history AC6)", () => {
    expect(parseHistoryParams({})).toEqual({ page: 1, size: 10, sort: "created_at", order: "desc" });
  });

  it("keeps every valid value (history AC6, R2, R4)", () => {
    expect(parseHistoryParams({ page: "3", size: "20", sort: "role", order: "asc", status: "completed" })).toEqual({
      page: 3,
      size: 20,
      sort: "role",
      order: "asc",
      status: "completed",
    });
  });

  it.each(["abc", "0", "-2", "1.5", "", " 2", "1e3"])("treats ?page=%j as page 1 (history EC3)", (raw) => {
    expect(parseHistoryParams({ page: raw })).toEqual(params());
  });

  it("treats a repeated ?page= as page 1 (history EC3)", () => {
    expect(parseHistoryParams({ page: ["2", "3"] })).toEqual(params());
  });

  it.each(["done", "", "COMPLETED", "all"])("treats ?status=%j as every status (history EC4)", (raw) => {
    expect(parseHistoryParams({ page: "2", status: raw })).toEqual(params({ page: 2 }));
  });

  it("treats a repeated ?status= as every status (history EC4)", () => {
    expect(parseHistoryParams({ status: ["completed", "abandoned"] })).toEqual(params());
  });

  it.each(["7", "0", "100", "abc", "", "20.0", " 20"])("treats ?size=%j as 10 rows (E1)", (raw) => {
    expect(parseHistoryParams({ size: raw })).toEqual(params());
  });

  it.each([
    { sort: "progress" },
    { sort: "id" },
    { sort: "ROLE" },
    { order: "up" },
    { order: "" },
    { sort: ["role", "level"] },
  ])("falls back to the default sort for %j alone (E1)", (raw) => {
    expect(parseHistoryParams({ page: "2", ...raw })).toEqual(params({ page: 2 }));
  });

  it("keeps a valid sort column with a bad direction, each value falling back on its own (E1)", () => {
    expect(parseHistoryParams({ sort: "level", order: "sideways" })).toEqual(params({ sort: "level" }));
  });
});

describe("buildHistoryHref", () => {
  it("leaves the defaults out of the URL (history AC6, R7)", () => {
    expect(buildHistoryHref(params())).toBe(HISTORY_ROUTE);
  });

  it("keeps the filter, and the page only when it isn't the first (history AC7, EC7)", () => {
    expect(buildHistoryHref(params({ status: "abandoned" }))).toBe(`${HISTORY_ROUTE}?status=abandoned`);
    expect(buildHistoryHref(params({ page: 2, status: "abandoned" }))).toBe(`${HISTORY_ROUTE}?page=2&status=abandoned`);
    expect(buildHistoryHref(params({ page: 4 }))).toBe(`${HISTORY_ROUTE}?page=4`);
  });

  it("writes a non-default size, sort column and direction (R2, R4)", () => {
    expect(buildHistoryHref(params({ size: 50 }))).toBe(`${HISTORY_ROUTE}?size=50`);
    expect(buildHistoryHref(params({ sort: "role" }))).toBe(`${HISTORY_ROUTE}?sort=role`);
    expect(buildHistoryHref(params({ order: "asc" }))).toBe(`${HISTORY_ROUTE}?order=asc`);
  });

  it("round-trips through parseHistoryParams (E6)", () => {
    const full = params({ page: 3, size: 20, sort: "status", order: "asc", status: "in_progress" });
    const query = new URL(buildHistoryHref(full), "http://x").searchParams;

    expect(parseHistoryParams(Object.fromEntries(query))).toEqual(full);
  });
});

describe("toHistoryListParams", () => {
  it("asks for one page of rows of the chosen size from the right offset (history AC2, R2)", () => {
    expect(toHistoryListParams(params())).toEqual({ limit: 10, offset: 0 });
    expect(toHistoryListParams(params({ page: 3 }))).toEqual({ limit: 10, offset: 20 });
    expect(toHistoryListParams(params({ page: 3, size: 50 }))).toEqual({ limit: 50, offset: 100 });
  });

  it("sends the status only when a filter is set (history AC2)", () => {
    expect(toHistoryListParams(params({ status: "completed" }))).toEqual({ limit: 10, offset: 0, status: "completed" });
    expect(toHistoryListParams(params())).not.toHaveProperty("status");
  });

  it("sends the sort only when it isn't the default, then always both halves (R4)", () => {
    expect(toHistoryListParams(params())).not.toHaveProperty("sort_by");
    expect(toHistoryListParams(params({ sort: "role" }))).toEqual({
      limit: 10,
      offset: 0,
      sort_by: "role",
      sort_dir: "desc",
    });
    expect(toHistoryListParams(params({ order: "asc" }))).toEqual({
      limit: 10,
      offset: 0,
      sort_by: "created_at",
      sort_dir: "asc",
    });
  });
});
