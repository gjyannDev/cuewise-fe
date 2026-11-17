# Learn: a dashboard built from list endpoints

**Concepts:** deriving a dashboard from existing endpoints, sections that load and fail on their own, a dependent query that waits for an id, pure helpers for anything that counts, a small design system for one page. **Status:** built and checked live at 1440 on 2026-11-17; phone and tablet widths **pending**.

## 1. Why it exists
The dashboard (`/`) only showed "Hello World". A candidate opening the app could not see where they left off, how much they had practised, or what to work on. The sidebar also linked to two pages that 404 (Progress, Settings).

## 2. What it is
Five sections on `/`: a continue/start card, a row of four numbers, the five newest interviews, a résumé nudge, and the newest feedback's score with one thing to work on. No new backend endpoint: everything comes from `GET /interviews` (twice), `GET /interviews/{id}/feedback` and `GET /profile`.

```
GET /interviews?limit=50 ──► hero, Total, This week, recent 5, new-user check
GET /interviews?status=completed&limit=1 ──► Completed, newest completed id ──► GET .../feedback
GET /profile ──► résumé nudge (only on a confirmed "none")
```

## 3. When to use it
| Do this | When | Why / limit |
|---|---|---|
| Derive numbers from a list's `total` | the list endpoint returns a total and can filter | one cheap `limit=1` request per number |
| Count from a sample ("This week") | no date filter exists | approximate past the sample; say so ("50+") |
| A backend stats endpoint | you need averages, trends or exact date counts | N feedback requests from the browser would be N+1 |

**I'd revisit this when** the Progress page needs score trends: that's the point to add `GET /interviews/stats`.

## 4. How it works
| Option | Requests | Chosen? |
|---|---|---|
| Four list queries (total, completed, in-progress, recent) | 4 | no: the recent page already holds total and the in-progress row |
| Two list queries, hero from the newest row | 2 | **yes** |
| Backend stats endpoint | 1 | no: out of scope (no backend change) |

One visit, walked through the code:
1. `useDashboardOverview` (`src/modules/interviews/hooks/use-dashboard-overview.ts:24`) runs the two list queries. The in-progress interview is `items[0]` when its status is `in_progress` (`:46`): cuewise-be abandons the old one when a new one starts, so it is always the newest.
2. `sectionStatus` (`:12`) turns one or more queries into `pending | error | success`. Data on hand wins, so a failed background refetch keeps the old numbers.
3. `countThisWeek` (`src/modules/interviews/utils/dashboard.utils.ts:17`) counts from local Monday 00:00 (`startOfWeek`, `:4`); `completionRate` (`:29`) returns `null` for 0/0 so the UI shows "—".
4. `DashboardContainer` (`src/app/(app)/_components/DashboardContainer.tsx:30`) calls `useFeedbackQuery(latest?.id)`. With no id the query is idle (`skipToken`, `src/modules/interviews/queries/interviews.queries.ts:203`), so it waits for the completed list without a `useEffect`.
5. `getFeedbackSnapshot` (`dashboard.utils.ts:41`) picks score + takeaway, summary only, or pending with its reason. Only "no feedback yet" links with `?start=1`, the page's own one-shot "generate on arrival".
6. Visibility rules live in the container: the nudge only on `profile.data === null` (`:33`); the feedback card hidden once it is known there is no completed interview (`:63`).

The look is one system, defined once in `src/modules/interviews/components/dashboard/dashboard.styles.ts`: a card title, a field label, a big number and the header link. Every section is the same card (title, optional description, optional link on the right), one primary button on the page (Resume / Start), and a failed section shows its error inside its own card.

## 5. What can go wrong
| Failure | What the user sees | What the code does | Proof (test name) |
|---|---|---|---|
| Feedback request fails | only the feedback card shows "Couldn't load this section." + Try again | `feedbackStatus` becomes `error`; Retry refetches only that query | "keeps the other sections when the feedback fails, and retries only the feedback (EC11)" |
| No interviews yet | the start card (and the nudge without a résumé) | `isNewUser` short-circuits the layout | "shows only the start card and the nudge to a new user (AC8, EC1)" |
| 0 interviews but metrics render | "—" not `NaN%` | `completionRate` returns `null` | "is null when there is nothing to divide by (EC2)" |
| All 50 sampled rows are this week | "50+" | `capped` | "is capped when every row is from this week and more interviews exist (EC5)" |
| Interview at Sunday 23:59, now Monday | not counted | week starts Monday 00:00 local | "starts the week on Monday 00:00 local time, not on Sunday 23:59 (EC6)" |
| Profile request fails | no nudge | only `null` shows it | "stays hidden when the profile is loading or failed (EC12, EC13)" |

## 6. Try it yourself
1. Predict what "This week" shows if you start a new interview now, then go back to `/`. Run it and compare. (Hint: starting invalidates `interviewKeys.lists()`.)
2. In `countThisWeek`, change `(start.getDay() + 6) % 7` to `start.getDay()`. Predict which test fails, then run `npx vitest run tests/modules/interviews/utils/dashboard.utils.test.ts`.
3. Stop the backend and reload `/`. Predict how many "Try again" buttons appear, then check.

## 7. What surprised me
- `npm run build` failed with "Cannot read properties of null (reading 'useContext')" on `/_global-error`. Cause: the shell had `NODE_ENV=development`; with `NODE_ENV=production` it compiled (2026-11-17, Next 16.4.3).
- After the fix, `npm run build` compiled and generated 14/14 pages, then exited 1 with a Next.js security-advisory notice about this Next version. Not caused by the feature.
- In a test helper, passing `stored: undefined` to a destructured parameter with a default silently used the default, so the "feedback fails" test first passed data. Fixed with an explicit `feedbackFailed` flag.
- The first design, seen live, read as several designs at once (tinted hero, icon chips, three primary buttons, five label styles). One shared styles file and one card pattern fixed it.
- **pending:** phone (390) and tablet (768) widths by eye; the new-account view by eye.

## 8. Check your understanding
1. Why does the hero need no request of its own?
2. When would "This week" be wrong, and how does the UI admit it?
3. How does the feedback query wait for the completed list without an effect?
4. What if the profile request fails: should the nudge show?

<details>
<summary>Reference answers (write yours first)</summary>

1. Only one interview can be in progress and starting another abandons it, so it is always the newest row of the recent page.
2. When more than 50 interviews exist and all 50 newest are this week; it shows "50+".
3. `useFeedbackQuery(undefined)` uses `skipToken`, so the query stays idle until `latest?.id` exists.
4. No: only a confirmed `null` profile shows it. A missing nudge beats telling someone with a résumé to upload one.

</details>

## 9. Go deeper / Still open
- Spec: `docs/features/dashboard-overview/spec.md`; plan: `plan.md`; progress: `task.md`.
- Next: the Progress page and a `GET /interviews/stats` endpoint (average score, trend, strongest/weakest criteria, streak).
- Still open: phone and tablet widths by eye; dark mode (tokens are ready, nothing switches it on).
