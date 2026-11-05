# Feature: Interview History Page (frontend)

## Problem
The sidebar's **History** link points at `/history`, but no page exists there. A candidate has no way to see their previous interviews or get back to the one they left in progress: the only way into an interview is the `?session=` link they had at the time. cuewise-be now has `GET /api/v1/interviews` (spec: `cuewise-be/docs/features/interview-history/spec.md`), so the data is available.

## Goal
A signed-in candidate opens `/history` and sees a paginated table of their own interviews, newest first, with role, level, type, status, progress and start time. They can filter by status, move between pages, and pick up the interview in progress from its row with **Continue**. Completed and abandoned rows show a **View** button that does nothing yet (placeholder for a later feature). Measured by: the in-progress row's Continue opens `/interviews?session=<id>`, View triggers no navigation or request, and the table's rows, page and filter match what the API returns for the URL's `?page=` and `?status=`.

## Project Conventions
- Rule files consulted: `cuewise-fe/CLAUDE.md` (+ `AGENTS.md`); no `.claude/` directory. Orientation with graphify and file reads in `src/modules/interviews/`, `src/app/(app)/interviews/`, `src/app/api/[...path]/route.ts`, `src/lib/api/api.client.ts`, `src/proxy.ts`, `components.json`.
- Constraints those rules impose on this feature:
  - Data flow **service -> query (hook) -> component**. The list call goes in `interviews.services.ts` through `apiClient` and is parsed with zod; the hook in `interviews.queries.ts`; keys from `interviews.keys.ts`. Components never call services or build keys.
  - Feature code lives in `src/modules/interviews/` (user's request). Next.js requires the route file, so `src/app/(app)/history/page.tsx` stays thin, and the container that calls the query sits in `src/app/(app)/history/_components/`, following `InterviewsContainer`.
  - Components are dumb and receive data and callbacks by props. One component per file, `PascalCase.tsx`, named export. Non-component files `kebab-case`. Tailwind with theme tokens, `cn()`.
  - **Table columns in their own file and the row action in its own component** (user's request). The existing `components/InterviewColumns.tsx` is a page layout (main + side panel), not table columns, so the new names must not be confusable with it.
  - shadcn/ui for the UI. Missing primitives (`table`) are added with `npx shadcn@latest add`, never hand-written; `src/components/ui/*` is not edited.
  - New dependency `@tanstack/react-table` (user's choice for the table; nothing installed covers it).
  - Server Components by default, `"use client"` pushed down. `cacheComponents` is on, so request-time data (cookies, `searchParams`) sits behind `Suspense`, and the page calls `requireUser()`, like `/interviews`.
  - All external data validated with zod: the API response and `searchParams`.
  - Loading, empty and error states for the data-driven UI. Errors normalized with `api.helper.ts`; no raw error text.
  - Tests in root `tests/`, mirroring `src/` (Vitest, `node` environment): schemas, pure utils, the service.
  - Do not commit or push. Run typecheck, lint, tests and build (new route), then `graphify update .`.
- Decided with the user:
  - Row action is a single button: Continue (in progress) links to the interview; View (completed, abandoned) is a placeholder that does nothing for now.
  - Page and status filter live in the URL (`?page=`, `?status=`).
  - The table component is interviews-specific (no shared `DataTable` yet). Superseded by the table rework (plan.md): a shared `DataTable`, `DataTablePagination` and `DataTableColumnHeader` in `src/shared/ui/`, with page-size selection and server-side column sorting.
  - A status filter (All, In progress, Completed, Abandoned) is included.
  - Invalid params fall back to defaults; a page past the end shows an empty-page message with a way back; the empty states are two distinct messages; "Started" shows date and time.

## User Flow
1. The candidate clicks **History** in the sidebar and lands on `/history` (page 1, all statuses).
2. A loading skeleton shows, then the table: newest interview first. The in-progress interview, if any, is the first row.
3. They pick a status in the filter; the URL becomes `/history?status=completed`, the table shows matching interviews from page 1.
4. They move to the next page; the URL becomes `?page=2` (filter kept). The previous rows stay visible until the new page arrives.
5. On the in-progress row they click **Continue** and land on `/interviews?session=<id>` at their current question. On a completed or abandoned row, **View** is shown but clicking it does nothing yet.
6. Pressing Back returns to the same history page and filter.

## Requirements

### Functional
- **Route** `/history`, signed-in users only (existing proxy rules plus `requireUser`). The shell header shows the sidebar item's existing title and description.
- **Data source** `GET /api/v1/interviews` via the existing `/api` forwarder, with `limit`, `offset` and optional `status`. The response is validated against the backend contract: `items` (`id`, `role`, `level`, `interview_type`, `status`, `question_count`, `answered_count`, `created_at`), `total`, `limit`, `offset`. A response that fails validation is treated as an error.
- **Page size**: 10, 20 or 50 rows per page, default 10, chosen in the pager and kept in `?size=`. `?page=N` (1-based) maps to `offset = (N - 1) * size`. Changing the size goes back to page 1.
- **URL state**: `?page=` is a positive integer, default 1; `?size=` is 10, 20 or 50, default 10; `?sort=` is one of `created_at`, `role`, `level`, `interview_type`, `status`, default `created_at`; `?order=` is `asc` or `desc`, default `desc`; `?status=` is one of `in_progress`, `completed`, `abandoned`, default all. Each invalid value falls back to its own default. Defaults are not written to the URL. Changing the filter, size or sort resets to page 1. Every change pushes a history entry, so Back works.
- **Sorting**: Role, Level, Type, Status and Started sort on a header click (ascending, then descending; one column at a time; always sorted, default Started newest first). The backend sorts the whole filtered history (`sort_by`, `sort_dir`) by the stored value, ties newest first. Progress and Actions don't sort. The sorted header cell has `aria-sort`.
- **Columns** (in this order):
  - Role: label from the existing role labels (e.g. "Full-stack").
  - Level: existing level label.
  - Type: existing interview-type label.
  - Status: a badge with the label "In progress", "Completed" or "Abandoned", each visually distinct.
  - Progress: "`answered_count` of `question_count`" (e.g. "2 of 5").
  - Started: `created_at` as a localized date and time in the browser's locale and time zone.
  - Actions: a visible "Actions" header; the row action buttons (Continue, View) share one fixed width so the column lines up.
- **Row action**: in progress -> "Continue", a link to `/interviews?session=<id>`. Completed or abandoned -> "View", a placeholder button that does nothing when clicked (no navigation, no request, no error) until a later feature gives it a destination. Both have an accessible name that says which interview they belong to (e.g. includes role and start time), not just "View".
- **Pagination controls**: shadcn data-table style pager driven by TanStack Table's pagination API (`manualPagination`, `rowCount = total`): the total count on the left; a "Rows per page" select, "Page X of Y" and first / previous / next / last icon buttons (each with an accessible label) on the right; first and previous disabled on page 1, next and last on the last page. Hidden while everything fits in the smallest page (10).
- **Status filter**: a shadcn Select above the table with All, In progress, Completed, Abandoned, reflecting the URL value.
- **Freshness**: the history reflects changes made in the app without a manual reload. After starting an interview (which abandons the previous one) or answering a question (which changes progress or completes it), the next visit to `/history` shows the new state.
- **States**:
  - Loading (first load): a table-shaped skeleton.
  - Changing page or filter: the previous rows stay visible while the next page loads.
  - Error with nothing cached: an error card with "Try again" that refetches.
  - No interviews at all: "No interviews yet" with a "Start an interview" button to `/interviews`.
  - A filter with no matches: "No <status> interviews" with a "Show all" button that clears the filter.
  - Page beyond the last: an empty-page message with "Go to first page", and the real total still shown.

### Non-Functional
- One API request per page/filter combination; revisiting a combination within the cache's fresh window shows it without a new request.
- No interview content (job description, answers) is requested or shown; the list endpoint does not return it.
- Works at phone width: the table scrolls horizontally inside its container, never the whole page.
- Accessibility: a real `<table>` with header cells, a caption or label for the table, keyboard-usable filter, pager and row actions with visible focus, and pager buttons that announce their purpose.

## UX Requirements
- Copy for statuses and empty states lives in module constants.
- The in-progress row's Continue is the most prominent action on the page (primary button style); View is secondary.
- Errors use generic messages from the shared error helpers; never raw error objects.

## Constraints
- Next.js 16 App Router with `cacheComponents`: `searchParams` is async and must be read behind `Suspense`.
- Vitest runs in the `node` environment with no DOM: components and the TanStack table are checked by typecheck, lint, build and a manual run, not by component tests.
- Backend pagination is offset-based with a 100-row maximum page size; 10 is well inside it.
- The frontend repo is on branch `feat/voice-answer-stt` (shared with the backend work); no new branch.

## Blockers
- None. The backend endpoint is implemented on the backend branch (assumption to verify: it is running locally when this is tested end to end).

## Edge Cases
- **EC1:** User has no interviews -> "No interviews yet" with "Start an interview" (to `/interviews`); no table, no pager.
- **EC2:** `?status=abandoned` matches nothing -> "No abandoned interviews" with "Show all", which removes `?status=` and shows page 1.
- **EC3:** `?page=abc`, `?page=0`, `?page=-2`, `?page=1.5` -> treated as page 1; no error, and no request is sent with an invalid offset.
- **EC4:** `?status=done` or any unknown value -> treated as all statuses.
- **EC5:** `?page=9` when there are 2 pages -> empty-page message with "Go to first page" (removes `?page=`); the real total is still shown and Next is disabled.
- **EC6:** Exactly 10 interviews -> one page; pager controls disabled or hidden; no empty page 2 reachable from the pager.
- **EC7:** Changing the filter while on page 3 -> goes to page 1 of the new filter.
- **EC8:** The list request fails (network or 5xx) on first load -> error card with "Try again"; on a later page change with data cached, the previous rows stay and an error is shown without wiping them.
- **EC9:** The session expires while on the page -> the existing session-expired redirect to sign-in happens (shared axios interceptor), with `next=/history...` preserved.
- **EC10:** The API response does not match the contract (e.g. unknown status value) -> treated as a load error (error card), never rendered partially.
- **EC11:** User starts a new interview, then comes back to History -> the previous in-progress interview now shows "Abandoned" and the new one is the first row with "Continue".
- **EC12:** User completes an interview, then comes back -> that row shows "Completed", "N of N" and "View".
- **EC13:** Abandoned interview with 0 answers -> listed with "0 of N" and "View".
- **EC14:** Very narrow screen -> table scrolls horizontally inside its card; header and pager stay usable.
- **EC15:** Clicking View on a completed or abandoned interview -> nothing happens: the URL, the table and the page stay as they are, and no request is sent.

## Acceptance Criteria
- [ ] **AC1:** `/history` renders for a signed-in user and redirects a signed-out one to sign-in (existing proxy and `requireUser`).
- [ ] **AC2:** The service calls `GET /interviews` through `apiClient` with `limit=10`, `offset=(page-1)*10` and `status` only when a filter is set, and returns the zod-parsed result; an invalid response throws (EC10).
- [ ] **AC3:** The table shows columns Role, Level, Type, Status, Progress, Started, Actions with the labels and formats in Requirements, one row per item, in API order.
- [ ] **AC4:** Column definitions live in their own file and the row action in its own component file, neither named like the existing `InterviewColumns` layout.
- [ ] **AC5:** In-progress rows show "Continue", which links to `/interviews?session=<id>`; completed and abandoned rows show "View", which does nothing when clicked; both have descriptive accessible names (EC13, EC15).
- [ ] **AC6:** `?page=` and `?status=` drive the request; invalid values fall back to page 1 / all (EC3, EC4); defaults are not written to the URL.
- [ ] **AC7:** The status Select shows All, In progress, Completed, Abandoned; choosing one updates `?status=` and resets to page 1 (EC7).
- [ ] **AC15:** The rows-per-page select offers 10, 20 and 50, writes `?size=` (default omitted) and resets to page 1; sortable headers write `?sort=` / `?order=`, reset to page 1, and the backend returns the whole history in that order; invalid `size` / `sort` / `order` fall back to defaults.
- [ ] **AC8:** First / previous / next / last and "Page X of Y" with the total work from the API `total`; buttons disable at the ends; one page means no pager (EC6).
- [ ] **AC9:** Loading shows a skeleton; a page or filter change keeps the previous rows until the new ones arrive.
- [ ] **AC10:** Empty states: no interviews (EC1), filter without matches (EC2), page past the end (EC5) show their specific message and button.
- [ ] **AC11:** A failed first load shows an error card with "Try again" that refetches; a failed later load keeps the shown rows (EC8).
- [ ] **AC12:** After starting an interview or answering a question, the history no longer shows the old state on the next visit (EC11, EC12).
- [ ] **AC13:** The table is a semantic table, keyboard-usable, and scrolls horizontally inside its container at phone width (EC14).
- [ ] **AC14:** Schema, URL-param parsing, offset, progress and date formatting, and the service are covered by Vitest tests mirroring `src/`; typecheck, lint, tests and build pass.

## Out of Scope
- What View opens (a read-only transcript, a report, or the interview screen): deferred by the user; the button is a no-op placeholder for now.
- Text search, date-range filters and multi-column sort (YAGNI). Single-column sorting was added with the table rework (AC15).
- Row actions beyond open (delete, rename, restart, report): no backend support.
- Resuming completed or abandoned interviews: the backend only accepts answers for the in-progress one.
- Scores or feedback columns: no data yet.
- Component or end-to-end tests: no DOM test environment in this repo.
- Changes to the admin area or the dashboard.
