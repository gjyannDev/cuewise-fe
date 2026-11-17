# Implementation Plan: Dashboard Overview (Tier 1)

## Overview
Replace the "Hello World" dashboard with five sections built on the endpoints that already exist: a continue/start hero, a metrics row, recent interviews, a résumé nudge and the latest feedback snapshot. Also hide sidebar links to pages that don't exist yet. Spec: `docs/features/dashboard-overview/spec.md`.

## Architecture & Design
- A client `DashboardContainer` (route-private, in `app/(app)/_components/`) reads all dashboard data through one feature hook, `useDashboardOverview`, plus `useProfileQuery` and `useFeedbackQuery`. It decides which sections show and passes data and retry callbacks down to presentational section components in `modules/interviews/components/dashboard/`.
- Every derived number (this-week count, completion rate, feedback snapshot state) is a pure function in `modules/interviews/utils/dashboard.utils.ts`, written test-first.
- The page stays thin: it keeps `requireUser("/")` inside `Suspense`.
- **Data, two list requests total:**
  - `recent`: `GET /interviews?limit=50&offset=0`, newest first. It serves the hero, Total, This week, the 5 recent rows and the new-user check.
  - `completed`: `GET /interviews?status=completed&limit=1`. It serves the Completed count and the id of the newest completed interview.
  - The hero needs no third request. The backend allows only one in-progress interview, and starting a new one abandons the previous one, so an in-progress interview is always `recent.items[0]` (spec Constraints).
  - Then `GET /interviews/{latestCompletedId}/feedback`, which is skipped until that id is known, and `GET /profile`.

## Approaches Considered

| Approach | Trade-offs | Chosen? |
|----------|-----------|---------|
| A. Two list queries (`recent` 50 plus `completed` 1), hero taken from `recent.items[0]`, all through the existing `useInterviewHistoryQuery` | Fewest requests. Reuses the existing service, keys and zod parsing. Relies on the backend's one-in-progress rule. | **Yes**. It's the leanest option that meets every AC (ponytail), and it follows "Queries are the only place components get server data". |
| B. Four list queries (total, completed, in-progress, recent), as the spec sketched | Each number has its own request, so it's simpler to reason about. But it spends 2 extra requests on data the `recent` page already holds. | No. The spec's Non-Functional section sets an *upper bound* ("at most"), and A stays under it. |
| C. A backend `GET /interviews/stats` aggregate | Exact numbers and Tier 2 ready, but it needs backend work. | No. The spec rules out backend changes (Tier 2 out of scope). |

## Spec Requirements -> Implementation
- Sidebar: hide Progress and Settings (user) and Settings (admin), keep Sign out -> Step 1
- This-week count, completion rate, feedback snapshot state and takeaway -> Step 2
- Optional-id feedback query, overview hook, shared status-badge variants, dashboard copy and constants -> Step 3
- Hero, metrics, recent list and feedback snapshot as presentational sections -> Step 4
- Container (section visibility, new-user view, résumé nudge, per-section error and retry), page wiring, layout -> Step 5
- Container behavior tests, gates, build, manual check, graph update -> Step 6

## Implementation Steps
Checkpoint interval: every 3 steps

1. **Hide the sidebar items.**
   - Remove the `progress` item and the user `settings` item. Remove the admin `settings` item.
   - The "Account" section stays, with an empty `items` list, so `AppSidebar` still adds Sign out to it as the last section.
   - Drop the now-unused `BarChart3` and `Settings` icon imports.
   - Update the expectations in the nav test: the user list ends at Résumé, and "Account" has `[]` for both roles. Section labels stay `["Menu", "Account"]`.
   - Files: `src/modules/navigation/navigation.constants.ts`, `tests/modules/navigation/navigation.constants.test.ts`
   - Verify: `npm test -- tests/modules/navigation` + gate commands
   - Test: after (an existing test is updated to the new list; covers AC10)

2. **Dashboard utils (test-first, seam confirmed by the user):** `src/modules/interviews/utils/dashboard.utils.ts`.
   - **`countThisWeek(items, total, now)`** returns `{ count, capped }`. The week is local Monday 00:00 to the next Monday 00:00, computed from `now`. `capped` is true when every one of the sample's 50 rows is this week and `total` is larger than the sample.
     - Slices, one at a time: none this week → 0 · some this week · Sunday 23:59 of the previous week isn't counted, Monday 00:00 is (EC6) · `now` on a Sunday still counts back to that week's Monday · a full sample with `total > 50` → capped (EC5) · a full sample with `total === 50` → not capped.
   - **`completionRate(completed, total)`** returns a whole-number percent, or `null` when `total` is 0.
     - Slices: 0/0 → null (EC2) · 3/4 → 75 · 1/3 → 33 (rounded) · 5/5 → 100.
   - **`getFeedbackSnapshot(feedback)`** returns `{ kind: "score", overall, takeaway }`, `{ kind: "summary", summary }` or `{ kind: "pending", reason: "none" | "generating" | "failed" }`.
     - Slices: `null` → pending/none · `generating` → pending/generating · `failed` → pending/failed (EC8) · generated with `enough_evidence` false → summary (EC9) · generated → score with the first improvement · empty improvements → the first next step · both empty → takeaway `null` (EC10).
   - Files: `src/modules/interviews/utils/dashboard.utils.ts`, `tests/modules/interviews/utils/dashboard.utils.test.ts` (one `describe` per function; builders `feedback()` and `interviewListItem()` from `tests/helpers/interviews.ts`)
   - Verify: `npm test -- tests/modules/interviews/utils/dashboard.utils.test.ts` + gate commands
   - Test: first

3. **Queries, hook and constants.**
   - **`useFeedbackQuery(id: string | undefined)`:** use `skipToken` when there's no id, matching `useInterviewQuery`. Existing callers pass a string, so nothing else changes.
   - **New `use-dashboard-overview.ts`:**
     - Calls `useInterviewHistoryQuery` twice, with the `recent` and `completed` params from constants.
     - Returns:
       - `inProgress`: `items[0]` when its status is `in_progress`
       - `recent`: the first 5
       - `total`
       - `thisWeek`: via `countThisWeek` with `new Date()`
       - `completedCount`
       - `rate`
       - `latestCompletedId`
       - `isNewUser`: `total === 0`
       - each query's pending and error state, and its `refetch`
   - **Badge variants:** move `STATUS_VARIANTS` out of `interview-history-columns.tsx` into constants as `SESSION_STATUS_BADGE_VARIANTS`, so history and the dashboard share them.
   - **Constants:** add `DASHBOARD_SAMPLE_SIZE = 50` (the largest of `HISTORY_PAGE_SIZES`), `DASHBOARD_RECENT_COUNT = 5`, and all dashboard copy (section titles, the empty/start hero, metric labels, nudge text, snapshot "not ready" messages per reason, the per-section error text).
   - Files: `src/modules/interviews/queries/interviews.queries.ts`, `src/modules/interviews/hooks/use-dashboard-overview.ts`, `src/modules/interviews/constants.ts`, `src/modules/interviews/components/history/interview-history-columns.tsx`
   - Verify: existing `npm test -- tests/modules/interviews` (history and feedback tests still pass) + gate commands
   - Test: skip (wiring only; its behavior is tested through the container in Step 6)

4. **Presentational sections.** These take props only: no queries, no services, no keys. Each one shows its own skeleton, error (with a Retry callback) and data branches. Style notes are under "Visual design" below.
   - **`ContinueInterviewCard`:** in-progress mode (title via `formatInterviewTitle`, type label, labeled `Progress` bar, "x of y" text via `formatProgress`, Resume button) or start mode (Start a mock interview) (AC1, AC2, EC3, EC4).
   - **`DashboardMetrics`:** four tiles: Total, Completed, Completion rate ("—" when `null`), This week (with a "+" suffix when capped) (AC3).
   - **`RecentInterviewsCard`:** up to 5 rows, each with title, type, date, status badge and the action for its status (Continue / View feedback / none), plus See all (AC4, EC14).
   - **`FeedbackSnapshotCard`:** takes a snapshot from `getFeedbackSnapshot` plus the interview title and id. It shows the score with the takeaway, or the summary, or the pending reason. The "Get feedback" link goes to `feedbackStartRoute(id)` when there's no feedback yet, and to `feedbackRoute(id)` when feedback is generating or failed (AC6, AC7).
   - Files: `src/modules/interviews/components/dashboard/ContinueInterviewCard.tsx`, `DashboardMetrics.tsx`, `RecentInterviewsCard.tsx`, `FeedbackSnapshotCard.tsx`
   - Verify: gate commands (rendering behavior is covered in Step 6)
   - Test: after (covered by the Step 6 container tests)

5. **Container and page.**
   - **`DashboardContainer`** (`"use client"`):
     - Calls `useDashboardOverview`, `useProfileQuery` and `useFeedbackQuery(latestCompletedId)`.
     - Layout and section rules:
       - **New user:** only the hero (start mode) and the nudge show (AC8, EC1).
       - **Feedback snapshot:** hidden when `completedCount === 0` (EC7).
       - **Résumé nudge:** shown only when `profile.data === null`. It's hidden while loading or on error (AC5, EC12, EC13).
       - **Errors:** each section gets the error state of its own query, and Retry refetches only that query (AC9, EC11).
     - The nudge is inline here: a small card with no logic, so it doesn't earn its own file.
   - **`page.tsx`:** keeps `requireUser("/")` in `Suspense`. The fallback is a few inline `Skeleton` blocks matching the layout.
   - Files: `src/app/(app)/_components/DashboardContainer.tsx`, `src/app/(app)/page.tsx`
   - Verify: gate commands + `npm run build`
   - Test: after

6. **Container behavior tests and final checks.**
   - happy-dom test, `vi.mock` of `useDashboardOverview`, `useProfileQuery` and `useFeedbackQuery`. One test per case:
     - in-progress hero shows Resume with the right href (AC1)
     - start hero (AC2)
     - metric values, including "—" and "50+" (AC3)
     - 5 recent rows with the action for each status (AC4)
     - the nudge only when the profile is `null`; hidden while loading or on error (AC5)
     - a score snapshot with its takeaway (AC6)
     - snapshot links when not ready: the `?start=1` href when there's no feedback, the plain href when generating or failed (AC7)
     - the new-user view (AC8)
     - one section errors → only that section shows an Alert, and its Retry calls only that refetch (AC9)
     - no generate mutation is used (AC11)
   - Then run every gate, `npm run build`, a manual browser pass (`npm run dev`: dashboard with data, a new account, the sidebar for both roles), and `graphify update .`.
   - Files: `tests/app/(app)/_components/DashboardContainer.test.tsx`
   - Verify: `npm test -- "tests/app/(app)/_components"` + gate commands + `npm run build`
   - Test: after

## Visual design (aligned with the current app)
- **Tokens only:** `bg-card`, `bg-accent`, `text-muted-foreground`, `text-primary-text`, `border`. No raw colors, so the page will work in dark mode once it's enabled. Fonts: `font-display` for headings and big numbers, the body font for everything else.
- **Layout:** `flex flex-col gap-6`. The page `h1` already lives in the shell header ("Dashboard", from the nav config), so each section uses an `h2`.
  - Row 1: hero `lg:col-span-2` plus the feedback snapshot. The hero takes the full width when there's no snapshot.
  - Row 2: metrics, `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`.
  - Row 3: recent `lg:col-span-2` plus the nudge, full width when there's no nudge.
  - On mobile everything stacks in that order.
- **Hero:** a `Card` tinted `bg-accent` with a `border-primary/20` border. A round icon chip (`size-12 rounded-full bg-background`, icon `text-primary-text`, like `InterviewMessageCard`). Title `font-display text-xl`, a one-line meta row of muted text, and a full-width `Progress` with an `aria-label`. The primary `Button size="lg" className="h-11"`, which is the pattern used across history and feedback.
- **Metric tiles:** a `Card` per metric, with an icon chip (`size-9 rounded-full bg-accent`), a `text-sm text-muted-foreground` label, a `font-display text-3xl font-semibold tabular-nums` value and an optional `text-xs` caption (e.g. "of 12 started"). Icons from lucide: `MessagesSquare`, `CircleCheck`, `Target`, `CalendarDays`.
- **Recent list:** a `Card` whose header holds the `h2` and a ghost "See all" link, then `ul` with `divide-y`. Each row has the title (`text-sm font-medium`), a meta line (type · date, muted `text-xs`), a status `Badge` using the shared variants, and an action `Button size="sm"` with fixed width `w-24` and the same `aria-label` wording as `RowAction`.
- **Feedback snapshot:** a `Card` showing the overall score exactly like `ScoreCard` (`text-5xl` number, "/ 5" with an `sr-only` "out of 5", via `formatOverall`). The takeaway is under a small label ("Focus next"), `line-clamp-3`, plain text. Pending states use a muted message plus an outline button.
- **Résumé nudge:** a `Card` with a `border-dashed` border, a `FileUser` icon chip, a title, one line of text and an outline "Upload résumé" button.
- **Section errors:** `Alert variant="destructive"`, as in `HistoryContainer`, with an outline "Try again" button. Skeletons are `Skeleton` blocks shaped like each card, inside `aria-busy` wrappers with an `sr-only` loading label.

## Affected Files & Patterns
- **Change:**
  - `navigation.constants.ts` and its test
  - `interviews.queries.ts` (optional id for `useFeedbackQuery`)
  - `interviews/constants.ts` (copy, sizes, badge variants)
  - `interview-history-columns.tsx` (uses the shared variants)
  - `app/(app)/page.tsx`
- **New:**
  - `utils/dashboard.utils.ts`
  - `hooks/use-dashboard-overview.ts`
  - 4 section components in `components/dashboard/`
  - `app/(app)/_components/DashboardContainer.tsx`
  - 2 test files
- **Patterns to follow:**
  - the `HistoryContainer` pattern: pending → skeleton, no data → error card with retry, background error → Alert
  - the `InterviewMessageCard` icon chip
  - the `ScoreCard` score display
  - `RowAction` hrefs and `aria-label`s
  - `useInterviewQuery`'s `skipToken` idiom
- **Risks:**
  - The backend must accept `limit=1` and `limit=50` (history already sends 50). Verify `limit=1` in Step 6.
  - `formatInterviewDate` must only run in the browser. It's safe here because the dates come from client queries.

## Testing Strategy
- Framework & command: Vitest, `npm test` (node by default; container tests opt into `// @vitest-environment happy-dom`, `.test.tsx`, `@testing-library/react`). Imports use `@/` and `@tests/`.
- Gate commands: `npx tsc --noEmit`, `npm run lint`, `npm test`. Also `npm run build` in Steps 5 and 6 (page change).

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 4, 6 | after | in-progress hero, Resume href |
| AC2 | 4, 6 | after | start hero |
| AC3 | 2, 6 | first + after | utils for rate and week; container for rendering "—" and "50+" |
| AC4 | 4, 6 | after | row actions by status, See all |
| AC5 | 5, 6 | after | nudge only on `null` profile |
| AC6 | 2, 6 | first + after | takeaway selection |
| AC7 | 2, 6 | first + after | pending reasons, summary branch, hrefs |
| AC8 | 5, 6 | after | new-user view |
| AC9 | 5, 6 | after | per-section error and retry |
| AC10 | 1 | after | nav constants test |
| AC11 | 6 | after | no generate mutation imported or called; one feedback query |
| AC12 | 2 | first | utils tests cover EC2, EC5, EC6, EC10 |
| EC1 | 5, 6 | after | |
| EC2 | 2 | first | |
| EC3 | 4, 6 | after | |
| EC4 | 4, 6 | after | 0 of N, empty bar |
| EC5 | 2 | first | capped "+" |
| EC6 | 2 | first | Monday boundary, injected `now` |
| EC7 | 5, 6 | after | |
| EC8 | 2, 6 | first + after | |
| EC9 | 2, 6 | first + after | |
| EC10 | 2 | first | |
| EC11 | 5, 6 | after | |
| EC12 | 5, 6 | after | |
| EC13 | 5, 6 | after | |
| EC14 | 4, 6 | after | |
| EC15 | — | covered | handled by the existing `apiClient` interceptor; nothing new to test |
| EC16 | — | resolved | `useAnswerInterviewMutation` already invalidates `interviewKeys.lists()` on every answer, the last one included |

- Must verify, not assume: the backend accepts `limit=1`; the dashboard in a real browser for an account with data and a new account; the sidebar for both roles.
- Open questions: none.
- Known baseline failures: none seen.

## Blockers & Resolutions
- **The feedback page doesn't generate on a plain visit.** It needs `?start=1` (`feedbackStartRoute`). The spec said the page generates on visit, so the snapshot links to `feedbackStartRoute(id)` when there's no feedback, and to `feedbackRoute(id)` otherwise. The intent is unchanged and the dashboard still never POSTs (AC11).
- **Hero source:** derived from `recent.items[0]` instead of a separate query (Approach A). This relies on the one-in-progress rule recorded in the spec.
- **Spec "one `h1`" requirement:** satisfied by the shell header. Sections use `h2`.

## Trade-offs & Rationale
- **Section files instead of one container file** (user-confirmed): each section has 3–4 states and would push one file past about 350 lines. The nudge stays inline because it's tiny.
- **`useDashboardOverview` hook:** keeps the container's job to choosing layout. The derived values come from tested utils.
- **No dark mode** (user decision). Tokens only, so turning it on later needs no dashboard changes.

## Project Rules Applied
- `CLAUDE.md`:
  - Data flows service → query → component, with keys from `interviewKeys`.
  - Components stay dumb; containers live in `app/.../_components`.
  - Utils are pure, one file per area, each with a mirrored test file.
  - Components sit in area folders (`components/dashboard/`).
  - A component must earn its file (decided with the user).
  - Theme tokens and `cn()` for styling.
  - Loading, empty and error states for every data-driven section.
  - AI text is rendered as plain text.
  - Gate commands before done; `graphify update .`; no commits.
- `AGENTS.md`: Next 16 with cacheComponents; `requireUser` stays inside `Suspense` (it reads cookies).

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| lean-ctx | Found the reusable pieces: `useInterviewHistoryQuery`, `useFeedbackQuery`, `useProfileQuery`, `formatInterviewTitle`/`formatProgress`/`formatInterviewDate`, `formatOverall`, `feedbackRoute`/`feedbackStartRoute`, `RESUME_ROUTE`, `STATUS_VARIANTS`, the `InterviewMessageCard` and `ScoreCard` styles, and the nav test |
| graphify | Mapped history, feedback and profile query paths (recorded in the spec) |
| grilling | Settled dark mode (none), file split, test seams |
| ponytail | Cut 4 list queries to 2 (hero from the recent page) |
| ui-ux-pro-max | Not invoked: the visual direction is "match the existing app", taken from the current components and tokens |
| security-review | Not needed: read-only, existing endpoints, no new data surface; AI text rendered as text |

## Ready to Implement
- All spec requirements are mapped to steps.
- Every step has a Test tag. Every AC and EC is mapped (EC15 is covered by existing code, EC16 is resolved).
- Gate commands are listed, and every step names its files and its verification.
- Approaches Considered is filled in; the checkpoint interval is every 3 steps.
- Deviations from the spec:
  - 2 list queries instead of 4, within the spec's "at most" bound.
  - The snapshot links to `?start=1` when no feedback exists (the page's actual contract).
