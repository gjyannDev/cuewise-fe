# Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable)

Supersedes the table and pager parts of the first plan (kept as `plan-v1.md`). Everything else in v1 (route, service, query, freshness, states, row actions) stays as built. No spec.md for this change; the requirements are R1-R10 and the edge cases E1-E8 below.

## Overview
Make the history table use TanStack Table v9 for real: server-side pagination (`rowPaginationFeature`), page-size selection and column sorting (`rowSortingFeature`), all rendered by a shared shadcn-style `DataTable`. The hand-rolled pager and page-count maths go away. Sorting needs the API to sort, so this plan changes both repos: cuewise-be (`GET /interviews` gets `sort_by` / `sort_dir`) first, then cuewise-fe.

## Architecture & Design
- **URL stays the single source of truth**: `?page=`, `?size=`, `?sort=`, `?order=`, `?status=`. The server page parses them (as now), the container derives TanStack's `PaginationState` and `SortingState` from them, and TanStack's change callbacks translate back into a new URL (`router.push`). Nothing is copied into component state; the Query cache still owns the rows.
- **Server-side everything** (`manualPagination`, `manualSorting`, `rowCount = total`): the table trusts `data` to be the requested page. No client row models are registered. Changing page, size, sort or filter changes the list params, hence the query key, hence a new request (previous rows kept as placeholder data).
- **Shared, render-only components** in `src/shared/ui/`: `DataTable` (header/body from a table instance, caption, dimmed while updating), `DataTablePagination` (total slot, rows-per-page select, "Page X of Y", first/previous/next/last), `DataTableColumnHeader` (a sort button with direction icon). They read everything from the table instance (`getCanNextPage`, `firstPage`, `getPageCount`, `column.getIsSorted`, ...), so they hold no logic of their own.
- **Feature wiring** stays in the interviews module: columns file (marks sortable columns), a `use-interview-history-table` hook (owns `useTable`, maps URL params <-> table state), pure converters in `utils/`.
- **Backend sort contract** (cuewise-be, changed in this plan): `GET /interviews` gains `sort_by` (`created_at | role | level | interview_type | status`, default `created_at`) and `sort_dir` (`asc | desc`, default `desc`). Both are enums validated by FastAPI (an unknown value is a 422, like `status`); with neither param the response is exactly today's. `created_at` orders by the UUIDv7 `id` (time-ordered), which keeps the existing `ix_interview_sessions_user_id_id` index; every other column orders by its stored value, with `id desc` as the tie-breaker so pages never overlap or repeat a row. Layers follow the backend rules: enums in `interviews_constants.py`, the query params in the route, the ordering in the repository, the controller only passes them through. No schema change, no migration, same response shape. The frontend is built against this contract and its service tests mock `apiClient`.

## Requirements -> Implementation
- R1 TanStack pagination drives the pager (no hand-rolled page maths) -> Steps 3, 5, 6
- R2 Page-size selector 10 / 20 / 50, default 10, in the URL, resets to page 1 -> Steps 1, 2, 3, 6
- R3 Sortable columns Role, Level, Type, Status, Started; Progress and Actions not sortable -> Steps 1, 5, 6
- R4 Sort is server-side across all pages, in the URL, default newest first, resets to page 1 -> Steps 1-4
- R5 Shared `DataTable`, `DataTablePagination`, `DataTableColumnHeader` in `src/shared/ui/` -> Step 5
- R6 Total on the left, controls on the right, accessible labels, as in the shadcn data-table -> Step 5
- R7 Invalid `size` / `sort` / `order` fall back to defaults; defaults not written to the URL -> Steps 1, 2
- R8 Existing behavior kept: status filter, states, Continue/View, freshness, phone-width scroll -> Step 6
- R9 Delete `InterviewHistoryPagination.tsx`, `InterviewHistoryTable.tsx` and `historyPageCount` -> Step 6
- R10 Docs updated to match -> Steps B4, 8
- R11 `GET /interviews` sorts server-side by `sort_by` / `sort_dir`, default unchanged (newest first), stable across pages -> Steps B1-B3
- R12 Backend rejects unknown `sort_by` / `sort_dir` with 422 and stays user-scoped, paginated and one query per page -> Steps B2, B3

## Implementation Steps
Build order: B1-B4 (cuewise-be) first, then 1-8 (cuewise-fe). Backend commands run in `../cuewise-be`; `cuewise-be/CLAUDE.md` applies there (UUIDv7 ids, thin layers, `uv run pytest`, `uv run ruff`, no commit).

B1. **Constants and route** (`interviews_constants.py`, `interviews_route.py`). Add two `StrEnum`s next to `SessionStatus`: the sortable columns (`created_at`, `role`, `level`, `interview_type`, `status`) and the direction (`asc`, `desc`). `list_interviews` takes them as `Query` params with defaults `created_at` / `desc` and passes them to the controller; update the route docstring (the in-progress interview is first only under the default order). Test: first (seam: `GET /api/v1/interviews`)
B2. **Controller and repository** (`interviews_controller.py`, `interviews_repository.py`). `list_interviews` forwards the sort to `list_for_user(user_id, status, sort_by, sort_dir, limit, offset)`. The repository maps each enum value to its column (`created_at` -> `InterviewSession.id`), applies the direction, then appends `InterviewSession.id.desc()` as tie-breaker (skipped when the column is already `id`). `count_for_user` is unchanged. Update the controller docstring. Test: first (same seam)
B3. **Backend tests** (`tests/modules/interviews/test_list_interviews.py`, extended; helpers in its conftest if needed). Slices under Testing Strategy. Keep every existing test green (default order is unchanged). Run `uv run pytest tests/modules/interviews`, then the full `uv run pytest`, and `uv run ruff check . && uv run ruff format .`. Test: first
B4. **Backend docs and graph.** Update `cuewise-be/docs/features/interview-history/spec.md` (and `plan.md` / `task.md` if they list the params or "no sorting"), add the sort params to any API doc that lists the query string, run `graphify update .` there. Test: skip

1. **Constants, schemas, types.**
   - `constants.ts`: `HISTORY_PAGE_SIZES` (10, 20, 50), `HISTORY_PAGE_SIZE` stays the default, `HISTORY_SORT_COLUMNS`, default sort (`created_at`, `desc`).
   - `interviews.schema.ts`: `?size=`, `?sort=`, `?order=` param schemas (size must be one of the listed sizes).
   - `interviews.types.ts`: `HistoryParams` becomes `{ page, size, status?, sort, order }`; `InterviewListParams` gains optional `sort_by`, `sort_dir`.
   - Test: first (seam: the exported schemas)
2. **URL <-> request utils** (`history-params.ts`, pure).
   - `parseHistoryParams` takes the raw values of all five params; each invalid or repeated value falls back alone.
   - `buildHistoryHref` writes only non-default values.
   - `toHistoryListParams`: `limit` = size, `offset` = (page - 1) * size, `sort_by` / `sort_dir` only when not the default, `status` only when set.
   - Remove `historyPageCount` (TanStack's `getPageCount` replaces it).
   - Test: first (seam: these three exports)
3. **Table-state converters** (`utils/history-table-state.ts`, pure).
   - `toPaginationState(params)` / `toSortingState(params)`: URL params -> `{ pageIndex, pageSize }` / `[{ id, desc }]`.
   - `applyPaginationChange(params, next)`: a changed page size returns page 1 (TanStack's own `setPageSize` keeps the top row in view instead); a changed page index keeps size and filter.
   - `applySortingChange(params, next)`: an empty or unknown sort falls back to the default; any sort change resets to page 1.
   - Test: first (seam: these three exports)
4. **Service and query.** `interviewsService.list` already forwards `params`; pass `sort_by` / `sort_dir` through unchanged and zod-parse as before. Keys are unchanged (the params object is the key part). Test: first for the service (seam: `interviewsService.list`, `apiClient` mocked); skip for the hook (no change).
5. **Shared DataTable** (`src/shared/ui/`, one component per file, `"use client"`, dumb).
   - `DataTable`: props `table`, `caption`, `isUpdating`; renders header groups and rows through `FlexRender`; scrolls inside its card.
   - `DataTableColumnHeader`: props `column`, `title`; a button (with `aria-sort` on the header cell) that calls `column.toggleSorting`; plain text when the column cannot sort.
   - `DataTablePagination`: props `table`, `pageSizes`, `summary` (the "N interviews" text); hides itself via the container rule in Step 6.
   - Typed with v9 generics (`Table<TFeatures, TData>` constrained to the two features). Uses existing `Button`, `Select`, `Table` primitives; no new shadcn component.
   - Test: after (typecheck, lint, build, manual run)
6. **Wire the history.**
   - `interview-history-columns.tsx`: features become `tableFeatures({ rowPaginationFeature, rowSortingFeature })`; sortable columns use `DataTableColumnHeader`; Progress and Actions set `enableSorting: false`.
   - `hooks/use-interview-history-table.ts`: calls `useTable` with `data = items`, `rowCount = total`, `manualPagination`, `manualSorting`, `enableSortingRemoval: false`, `enableMultiSort: false`, controlled `state` from Step 3 and `onPaginationChange` / `onSortingChange` calling `onParamsChange`; `getRowId` as today.
   - `HistoryContainer.tsx`: uses the hook, renders `DataTable` + `DataTablePagination` in place of the old components; the pager shows when `total` exceeds the smallest page size or the page is past 1; past-the-end, empty and error states unchanged (past-end check uses `getPageCount`).
   - Delete `InterviewHistoryTable.tsx`, `InterviewHistoryPagination.tsx`; `format-question-count.ts` keeps the total text.
   - Test: after (typecheck, lint, build, manual run)
7. **Tests.** Update `history-params.test.ts` (new params, `historyPageCount` slices removed), `interviews.schema.test.ts`, `interviews.services.test.ts`, `tests/helpers/interviews.ts`; add `tests/modules/interviews/utils/history-table-state.test.ts`. Test: first (written with Steps 1-4)
8. **Docs and close.** Update `spec.md` (pager gains rows-per-page; sorting and shared DataTable move out of "Out of Scope"; new URL params) and `task.md`; run `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`; manual run; `graphify update .`. No commit. Test: skip

## Affected Files & Patterns
- New: `src/shared/ui/DataTable.tsx`, `DataTablePagination.tsx`, `DataTableColumnHeader.tsx`; `src/modules/interviews/hooks/use-interview-history-table.ts`; `utils/history-table-state.ts`; `tests/modules/interviews/utils/history-table-state.test.ts`.
- Changed: `constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/history-params.ts`, `components/interview-history-columns.tsx`, `src/app/(app)/history/_components/HistoryContainer.tsx`, `src/app/(app)/history/page.tsx` (passes the two new raw params), the matching tests and `tests/helpers/interviews.ts`.
- Deleted: `InterviewHistoryTable.tsx`, `InterviewHistoryPagination.tsx`.
- Backend (cuewise-be, branch `feat/voice-answer-stt`, already carries staged list-endpoint changes, so leave the index alone): changed `app/modules/interviews/interviews_constants.py`, `interviews_route.py`, `interviews_controller.py`, `interviews_repository.py`, `tests/modules/interviews/test_list_interviews.py` (+ conftest helper if needed), `docs/features/interview-history/*`. No model, schema-out or Alembic change.
- Backend patterns: `SessionStatus` / the `status` Query alias for enum params; `PageDep` (`app/core/pagination.py`) untouched; the repository's `_history_filter` and single-query `list_for_user`; `test_list_interviews.py` helpers (`history`, `started_ids`, `three_statuses`).
- Patterns: the installed TanStack skills (`node_modules/@tanstack/table-core/skills/table-features/references/{pagination,client-vs-server}.md`, `react-table/skills/getting-started/references/with-tanstack-query.md`, `table-state`); `parseSessionParam` style param parsing; the shadcn data-table layout.
- Risks:
  - v9 generics: a shared component typed over `TFeatures` is the hardest typing here; read the core `typescript.md` reference first and keep the constraint to the two registered features.
  - `data`, `columns` and `features` must stay referentially stable (module-level columns/features; `data` straight from the query, with a stable empty array while loading) or the table rebuilds models every render.
  - A controlled `state` needs its `on*Change` handler or the table desyncs; both are passed together.
  - Ship order: the frontend sends `sort_by` only for non-default sorts, so an old backend would ignore it and sorting would silently do nothing. Both repos live on the same branch name and are run together for the manual check; do not merge the frontend alone.
  - Sorting `role` / `level` / `interview_type` / `status` orders by the stored value (e.g. `full_stack`, `junior`, `in_progress`), not by the label the table shows. Those columns have no index; the sort only touches one user's rows (the `user_id` index narrows first), so no new index (YAGNI).
  - The existing 'one query per page' test must still pass with a sort applied.

## Testing Strategy
- Framework & command (frontend): Vitest, `npm test` (or `npx vitest run tests/modules/interviews`), environment `node`; then `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Framework & command (backend, in `../cuewise-be`): pytest, `uv run pytest tests/modules/interviews/test_list_interviews.py`, then `uv run pytest` and `uv run ruff check . && uv run ruff format .`.
- Backend seam (user-confirmed as the public interface of the existing list tests): `GET /api/v1/interviews` through the test `client`. Slices, one behavior each:
  B-a. no sort params -> newest first, in-progress on top, as today (R11)
  B-b. `sort_by=created_at&sort_dir=asc` -> oldest first (R11)
  B-c. `sort_by=role` (asc and desc) -> stored-value order, with ties in `id desc` (R11)
  B-d. same for `level`, `interview_type` and `status` (R11)
  B-e. sorted pages do not overlap or repeat a row: page 1 + page 2 equal the full sorted list (R11, R12)
  B-f. sort combines with `status` filter and keeps `total` (R11)
  B-g. unknown `sort_by` or `sort_dir` -> 422; only the caller's rows, still 401/403 unchanged (R12)
  B-h. a sorted page costs the same number of queries whatever its size (R12)
- Seams for `Test: first` steps (user-confirmed): the exported schemas; `parseHistoryParams`, `buildHistoryHref`, `toHistoryListParams`; `toPaginationState`, `toSortingState`, `applyPaginationChange`, `applySortingChange`; `interviewsService.list` with `apiClient` mocked. Slices, one behavior each:
  1. size schema accepts 10 / 20 / 50, rejects 7, 0, abc (R2, R7)
  2. sort / order schemas accept the listed values, reject others (R3, R7)
  3. parse: all five params valid are kept; each invalid one falls back alone (R7, E1)
  4. href: defaults omitted; non-default size, sort, order, status, page all written (R4, R7)
  5. list params: `offset` uses the chosen size; sort only when non-default; status only when set (R2, R4)
  6. pagination state: page 3, size 20 -> pageIndex 2, pageSize 20 (R1)
  7. pagination change: new page keeps size and filter; new size returns page 1 (R2, E3)
  8. sorting change: new column or direction is kept and resets to page 1; empty or unknown falls back to default (R4, E4)
  9. service: forwards `limit`, `offset`, `sort_by`, `sort_dir`, `status`; throws on an invalid body (R4)

| ID | Step | Test mode | Notes |
|----|------|-----------|-------|
| R1 | 3, 5, 6 | first / after | slice 6; manual: buttons enable and disable from `getCanNextPage` |
| R2, E3 | 1-3, 6 | first / after | slices 1, 5, 7; manual: size change returns to page 1 |
| R3 | 1, 5, 6 | first / after | slice 2; manual: only five headers sort |
| R4, E4 | 1-4 | first | slices 2, 4, 5, 8, 9; manual after the backend ships |
| R5, R6 | 5 | after | typecheck, lint, build; manual keyboard and labels |
| R7, E1 | 1, 2 | first | slices 1-4 |
| R8 | 6 | after | manual regression: filter, states, Continue/View, freshness, phone width |
| R9 | 6 | skip | files gone, no references (typecheck) |
| R10 | B4, 8 | skip | docs reviewed |
| R11 | B1-B3 | first | slices B-a to B-f |
| R12 | B2, B3 | first | slices B-e, B-g, B-h |
| E2 | 6 | after | manual: `?page=9&size=50` past the end still shows the message |
| E5 | 6 | after | manual: 10 or fewer interviews, no pager, no size select |
| E6 | 6 | after | manual: Back restores page, size, sort and filter |
| E7 | 6 | after | manual: failed sorted page shows the error card / kept rows as before |
| E8 | 5 | after | manual: `aria-sort` and keyboard toggle on sortable headers |

- Edge cases: E1 `?size=7`, `?sort=progress`, `?order=up` fall back to defaults and send no invalid request; E2 page past the end under a larger size; E3 size change from page 3 goes to page 1; E4 sort change from page 3 goes to page 1; E5 at most 10 interviews shows neither pager nor size select; E6 Back restores all five params; E7 sort or size change that fails keeps the existing failure rules; E8 sort headers are keyboard-usable with `aria-sort`.
- Must verify, not assume: TanStack v9 `manualSorting` needs no sorted row model and does not reorder `data`; `setPageSize` is not used for the size select (our converter resets to page 1); the running backend honors `sort_by` / `sort_dir` end to end through the `/api` forwarder (query string passed on); no Suspense fallback flash on any param change.
- Open questions: should `level` and `status` sort by seniority / lifecycle order (junior < mid < senior; in progress, completed, abandoned) instead of the stored string? Default in this plan: stored value, alphabetical; a `CASE` ordering in the repository is a small later change that needs no API change. The backend list docstring said the in-progress interview is first; B1/B2 reword it to "under the default order".
- Known baseline failures: run `npm test` once before Step 1 and record any here.

## Blockers & Resolutions
- No backend sort support -> add `sort_by` / `sort_dir` in cuewise-be as part of this plan (Steps B1-B4, user decision); sorting only the loaded page was rejected as misleading across pages.
- Enum values must match on both sides -> the frontend sort column ids equal the backend enum values (`created_at`, `role`, `level`, `interview_type`, `status`), which are also the response field names, so the TanStack column accessors and the API agree with no mapping table.
- Backend page size max is 100 -> 10 / 20 / 50 are well inside it.
- Two sort UX options (clear sort vs. toggle only) -> `enableSortingRemoval: false`: clicking cycles ascending / descending, and "Started, descending" is the default, so the table is always visibly sorted and the default needs no special header state.
- TanStack `setPageSize` keeps the top row in view (page may stay above 1) -> deliberate override via `applyPaginationChange` to match R2 and the filter rule (new criteria start at page 1).
- Pager hidden-when-one-page rule (v1) conflicts with a size select -> show the pager whenever `total` exceeds the smallest size or the page is above 1.

## Trade-offs & Rationale
- URL-controlled TanStack state (not Query-key-only, not zustand) -> keeps Back, reload and sharing working; TanStack stays the single API for navigation and sorting.
- Shared `DataTable` now (reverses v1 and the spec's "extract on the second table") -> user decision; components are render-only over a table instance, so the cost is small.
- Single-column sort -> the backend takes one `sort_by`; multi-sort would need a list parameter (YAGNI).
- Hook for table wiring -> keeps `useTable` and URL mapping out of JSX (CLAUDE.md); the shared components stay dumb.
- Sortable header as a plain button, not a dropdown -> fewer clicks, no extra primitive.
- Pure converters tested, components not -> no DOM test environment in this repo.

## Project Rules Applied
- `cuewise-be/CLAUDE.md` -> thin route/controller/repository layers, enum-validated query inputs (422 on bad values), tests mirror `app/modules`, `uv run pytest` and ruff, graphify update, no commit or staging.
- `CLAUDE.md` layer rules -> hook/utils in the module, shared pieces in `shared/ui`, components dumb, no query keys built inline, server data only in the Query cache.
- `CLAUDE.md` shadcn rule -> existing primitives reused; `components/ui` untouched.
- `CLAUDE.md` security -> every new URL param validated with zod and falls back; response still zod-parsed.
- `CLAUDE.md` testing -> tests in root `tests/` mirroring `src/`, `@/` and `@tests/` imports.
- `CLAUDE.md` Next.js 16 -> `searchParams` still read async behind `Suspense`.
- `CLAUDE.md` workflow -> typecheck, lint, tests, build, `graphify update .`, no commit.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | history table, pagination and params nodes and their links |
| lean-ctx / file reads | current table, pager, columns, params utils, container, queries and keys; backend list route, controller, repository, pagination (fixed `id desc` order, limit 1-100), model and index, `test_list_interviews.py` layout |
| TanStack v9 skills in `node_modules` | server-side pagination and sorting rules (`manual*`, `rowCount`, controlled `state`), Query integration, stable `data` / `columns` |
| ponytail | applied inline: no multi-sort, no dropdown header, no client row models |
| grill-me | decisions confirmed with the user: backend sort params, sizes 10 / 20 / 50 in the URL, `shared/ui` components, test seams |
| shadcn | data-table pagination layout, existing `Select` / `Button` / `Table` reused (to load during /implement) |
| security-review | not run: new inputs are validated query params on an existing authenticated read |

## Ready to Implement
- Requirements R1-R10 mapped to steps; edge cases E1-E8 mapped in Testing Strategy
- Every step has a Test tag; test seams user-confirmed
- Affected files identified; blockers have resolutions
- Deviations from the earlier specs (listed for Steps B4 and 8): rows-per-page added, sorting and shared `DataTable` brought in scope, and the backend list endpoint gains sort params (its spec said no sorting)
