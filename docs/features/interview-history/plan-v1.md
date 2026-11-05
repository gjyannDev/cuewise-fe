# Implementation Plan: Interview History Page (frontend)

## Overview
Add `/history`: a paginated, filterable TanStack table of the candidate's interviews from `GET /api/v1/interviews`. Continue links the in-progress interview back to `/interviews?session=<id>`; View is a no-op placeholder. Code lives in `src/modules/interviews/`, with a thin page and container in `src/app/(app)/history/`.

## Architecture & Design
The data flow stays service -> query -> component. The server page reads `searchParams` behind `Suspense`, runs `requireUser("/history")`, and parses `?page=` / `?status=` into plain values with a pure util. This follows `/interviews`, where the page parses `?session=` and passes it to `InterviewsContainer`. A client `HistoryContainer` turns those values into list params, calls `useInterviewHistoryQuery` (keeping the previous page as placeholder data), picks loading/empty/error states, and navigates with `router.push(buildHistoryHref(...))` on filter or page change.
The table is a dumb client component. It runs TanStack Table v9's `useTable` with core-only features (`tableFeatures({})`) over a static column array kept in its own file (built with `createColumnHelper<typeof features, InterviewListItem>()`, module scope so it stays stable). It renders shadcn `Table` primitives through `table.FlexRender`. v9 replaced v8's `useReactTable` / `getCoreRowModel`, which now live in a deprecated legacy entry. Pagination and filtering are server-side, and the URL is their single source of truth, so TanStack's own pagination and filter state is not used (ponytail: one source of truth, nothing to keep in sync). The pager and status filter are separate small components driven by props.

## Spec Requirements -> Implementation
- Route, auth, Suspense (AC1) -> Step 7
- Response contract and validation (AC2, EC10) -> Steps 2, 5
- URL state, defaults, fallback, filter resets page (AC6, AC7, EC3, EC4, EC7) -> Steps 3, 6, 7
- Columns, labels, formats (AC3, AC4) -> Steps 2, 4, 6
- Row action Continue / no-op View, accessible names (AC5, EC13, EC15) -> Step 6
- Pager from `total` (AC8, EC6) -> Steps 3, 6
- Loading, placeholder rows, empty and error states (AC9, AC10, AC11, EC1, EC2, EC5, EC8) -> Steps 5, 6, 7
- Freshness after start and answer (AC12, EC11, EC12) -> Step 5
- Semantic, keyboard-usable, horizontal scroll (AC13, EC14) -> Step 6
- Session expiry (EC9) -> existing axios interceptor, verified in Step 8
- Tests, typecheck, lint, build (AC14) -> Steps 2-5, 8

## Implementation Steps
1. **Dependencies.** `npm install @tanstack/react-table` (the user's choice; nothing installed covers it) and `npx shadcn@latest add table`. Check the generated `src/components/ui/table.tsx` and leave it unedited. — Test: skip (config)
2. **Constants, schemas, types.**
   - `constants.ts`: `HISTORY_ROUTE`, `HISTORY_PAGE_SIZE` (10), `SESSION_STATUS_LABELS`, the status filter options (All plus the three statuses), and empty/error copy.
   - `interviews.schema.ts`: `interviewListItemSchema` (reusing the existing role/level/type/status enums), `interviewListSchema` (`items`, `total`, `limit`, `offset`), and the `?page=` / `?status=` param schemas.
   - `interviews.types.ts`: `InterviewListItem`, `InterviewList`, `HistoryParams` (`page`, `status?`) and `InterviewListParams` (`limit`, `offset`, `status?`), all inferred where possible.
   - Test: first (seam: the exported schemas)
3. **URL <-> request utils** (`utils/history-params.ts`), pure functions:
   - `parseHistoryParams(page, status)` from raw `searchParams` values: invalid, missing or repeated values fall back to page 1 / all.
   - `buildHistoryHref(params)`: `/history` plus only non-default params.
   - `toHistoryListParams(params)`: `limit` = page size, `offset` = (page - 1) * size, `status` only when set.
   - `historyPageCount(total)`: at least 1.
   - Test: first (seam: these four exports)
4. **Formatters.**
   - `formatProgress(answered, total)` ("2 of 5") added to `format-question-count.ts`.
   - `formatInterviewDate(iso, locale?, timeZone?)` in `utils/format-interview-date.ts`, using `Intl.DateTimeFormat` with date and time. Locale and time zone are optional so tests are deterministic and the browser default applies in the app.
   - Test: first (seam: both exports)
5. **Service, keys, query, freshness.**
   - `interviewsService.list(params)`: `apiClient.get("/interviews", { params })`, parsed with `interviewListSchema`.
   - `interviewKeys.lists()` and `list(params)`, siblings of `detail`, so invalidating one never touches the other.
   - `useInterviewHistoryQuery(params)` with `placeholderData: keepPreviousData`.
   - Freshness: `useStartInterviewMutation` and `useAnswerInterviewMutation` invalidate `interviewKeys.lists()` on success (the answer mutation for `answered` and `recovered`).
   - Test: first for the service (seam: `interviewsService.list` with `apiClient` mocked, like the existing services test); after for the hook and invalidation (no DOM; checked in the manual run)
6. **Components** (`src/modules/interviews/components/`, one per file, dumb):
   - `InterviewStatusBadge.tsx`: badge per status (distinct variants).
   - `interview-history-columns.tsx`: the `ColumnDef<InterviewListItem>[]` array. Cells use the label constants and formatters; the actions cell renders the row actions component.
   - `InterviewHistoryRowActions.tsx`:
     - in progress: primary `Button` `asChild` with a `next/link` to `/interviews?session=<id>`;
     - otherwise: secondary `type="button"` "View" with no handler;
     - both have an `aria-label` naming the role and start time.
   - `InterviewHistoryTable.tsx` (`"use client"`): the table with a caption or label, horizontal scroll inside its card, and a dimmed state while placeholder data shows.
   - `InterviewHistoryStatusFilter.tsx`: a shadcn `Select` with a visible label, value and onChange from props.
   - `InterviewHistoryPagination.tsx`: Previous/Next, "Page X of Y" and the total. Buttons are disabled at the ends; nothing to page when there is one page.
   - `InterviewHistorySkeleton.tsx`: a table-shaped skeleton.
   - Test: after (typecheck, lint, build, manual run)
7. **Route.**
   - `src/app/(app)/history/page.tsx`: thin; `Suspense` + `requireUser(HISTORY_ROUTE)`, await `searchParams`, `parseHistoryParams`, render the container.
   - `_components/HistoryContainer.tsx` (`"use client"`): query, navigation, states. It handles first-load skeleton, error card with Try again when nothing is cached, error notice above kept rows on a failed later load, "No interviews yet", "No <status> interviews" with Show all, and page past the end with Go to first page. Reuses `InterviewMessageCard` and `parseApiError`.
   - Test: after (manual run)
8. **Verify and close.**
   - `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`.
   - Manual run against the local backend: pages, filter, Back, Continue, View no-op, phone width, session expiry redirect.
   - `graphify update .`, tick the spec ACs. No commit.
   - Test: skip

## Affected Files & Patterns
- New: `src/app/(app)/history/page.tsx`, `src/app/(app)/history/_components/HistoryContainer.tsx`, `src/components/ui/table.tsx` (CLI), `src/modules/interviews/utils/history-params.ts`, `src/modules/interviews/utils/format-interview-date.ts`, the seven components in Step 6.
- Changed: `src/modules/interviews/constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `services/interviews.services.ts`, `queries/interviews.keys.ts`, `queries/interviews.queries.ts` (new hook plus two invalidations), `utils/format-question-count.ts`, `package.json` / `package-lock.json`.
- Tests (mirroring `src/`): `tests/modules/interviews/schemas/interviews.schema.test.ts` (extend), `utils/history-params.test.ts`, `utils/format-interview-date.test.ts`, `utils/format-question-count.test.ts` (extend), `services/interviews.services.test.ts` (extend).
- Patterns to follow:
  - `parseSessionParam` and its test for the param parsing;
  - `InterviewsPage` / `InterviewsContainer` for page, Suspense, container and navigation;
  - `interviewsService.get` for the service;
  - `useInterviewQuery` for the hook;
  - `InterviewMessageCard` for empty and error cards;
  - `InterviewSessionSkeleton` for the skeleton;
  - the shadcn data-table guide (columns in their own file, `flexRender`).
- Risks:
  - Changing filter/page re-renders the server page with new `searchParams`. `router.push` runs as a transition, so the old UI should stay instead of the Suspense fallback; verify in the manual run.
  - The two invalidations touch the live answer flow; keep them additive (no change to existing cache writes).
  - `InterviewColumns.tsx` naming clash, avoided by `interview-history-columns.tsx`.

## Testing Strategy
- Framework & command: Vitest, `npm test` (or `npx vitest run tests/modules/interviews`), environment `node`. Then `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Seams for `Test: first` steps (user-confirmed): exported schemas; `parseHistoryParams`, `buildHistoryHref`, `toHistoryListParams`, `historyPageCount`; `formatProgress`, `formatInterviewDate`; `interviewsService.list` with `apiClient` mocked. Slices, one behavior each:
  1. list schema accepts a valid page and rejects an unknown status or a missing field (AC2, EC10)
  2. parse: missing -> page 1, all; valid page and status kept (AC6)
  3. parse: `abc`, `0`, `-2`, `1.5`, repeated -> page 1 (EC3); unknown status -> all (EC4)
  4. href: defaults omitted, status kept, page omitted when 1 (AC6, AC7, EC7)
  5. list params: offset per page, status only when set (AC2)
  6. page count: 0 -> 1, 10 -> 1, 11 -> 2 (AC8, EC6, EC5)
  7. formatProgress "0 of 5", "5 of 5" (AC3, EC13)
  8. formatInterviewDate in a fixed locale and time zone shows date and time (AC3)
  9. service: calls `/interviews` with the params and returns the parsed page; throws on an invalid body (AC2, EC10)

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 7 | after | manual: signed out -> sign-in |
| AC2, EC10 | 2, 5 | first | slices 1, 5, 9 |
| AC3 | 4, 6 | first / after | slices 7, 8; column rendering manual |
| AC4 | 6 | after | file layout, reviewed |
| AC5, EC13, EC15 | 6 | after | manual: Continue navigates, View no-op; formatter slice 7 |
| AC6, EC3, EC4 | 3, 7 | first | slices 2-4 |
| AC7, EC7 | 3, 6 | first / after | slice 4; manual filter on page 3 |
| AC8, EC6 | 3, 6 | first / after | slice 6; manual pager |
| AC9 | 5, 7 | after | manual: skeleton, kept rows |
| AC10, EC1, EC2, EC5 | 3, 7 | after | slice 6 for the past-end math; manual states |
| AC11, EC8 | 7 | after | manual with backend stopped |
| AC12, EC11, EC12 | 5 | after | manual: start / finish then revisit |
| AC13, EC14 | 6 | after | manual: keyboard and phone width |
| AC14 | 2-5, 8 | first | full commands green |
| EC9 | 8 | after | existing interceptor, manual |

- Must verify, not assume: no Suspense fallback flash on page or filter change; the backend list endpoint answers through the `/api` forwarder with the query string; invalidation refreshes History after start and answer.
- Open questions: none.
- Known baseline failures: run `npm test` once before Step 1 and record any here.

## Blockers & Resolutions
- EC8 narrowed during /implement: TanStack Query shows placeholder data only while the new query is pending (`queryObserver`), so a page that fails to load has no rows to keep. A failed background refetch of a loaded page keeps its rows with an alert; a failed new page shows the error card with Try again (same rule as `InterviewsContainer`). Keeping the previous page anyway would mean copying query data into state, which CLAUDE.md forbids.
- shadcn `alert` added with `table` (CLI) for that inline notice.
- Backend endpoint must be running for the manual run -> it is implemented on `feat/voice-answer-stt` in cuewise-be; start it locally.
- `npm install` and the shadcn CLI need network access -> run in Step 1, report if blocked.

## Trade-offs & Rationale
- URL as the only pagination and filter state (not TanStack state) -> survives reload and Back, nothing to sync.
- Server page parses params and passes plain values -> same as `?session=`, no `useSearchParams` boundary in the client.
- Interviews-only table, no shared `DataTable` -> spec decision; extract on the second table.
- Single-button action, View with no handler -> spec decision; a real destination comes later.
- `keepPreviousData` -> no blank table between pages (AC9).
- Invalidate `lists()` on start and answer instead of writing the list cache -> the new row order and statuses come from the backend, no client copy of the rules.

## Project Rules Applied
- `CLAUDE.md` data flow and layer rules -> the service via `apiClient` + zod, keys factory, hooks only in queries, dumb components, container in route `_components/`.
- `CLAUDE.md` shadcn rule -> `table` via CLI, `components/ui` untouched.
- `CLAUDE.md` security -> response and `searchParams` validated with zod, BFF only, no tokens touched.
- `CLAUDE.md` testing -> tests in root `tests/` mirroring `src/`, `@/` and `@tests/` imports.
- `CLAUDE.md` Next.js 16 -> async `searchParams` behind `Suspense` (`cacheComponents`).
- `CLAUDE.md` workflow -> typecheck, lint, tests, build, `graphify update .`, no commit.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | interviews module map, services test and param-parsing patterns |
| lean-ctx / file reads | forwarder passes the query string, `apiClient.get` params, `InterviewMessageCard`, `parseSessionParam`, query defaults, `cacheComponents` |
| ponytail | applied inline: no TanStack pagination state, no shared DataTable, no DOM test stack |
| grill-me | test seams confirmed with the user; product decisions settled in /feature |
| shadcn | `table` via CLI, Select, Badge, Button `asChild` with Link, data-table column pattern (to load during /implement) |
| security-review | not run: read-only list through the existing BFF, no new auth surface |

## Ready to Implement
- All spec requirements (AC1-AC14, EC1-EC15) mapped to steps
- Every step has a Test tag; the test seams are user-confirmed
- Affected files identified; blockers have resolutions
- No deviations from spec
