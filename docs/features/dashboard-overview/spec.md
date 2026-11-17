# Feature: Dashboard Overview (Tier 1)

## Problem
A signed-in candidate who opens the dashboard (`/`) only sees "Hello World". It doesn't show where they left off, how much they've practiced, or what to do next. The sidebar also lists **Progress** and **Settings** (user) and **Settings** (admin), and all three lead to pages that don't exist (404).

## Goal
When a candidate opens `/`, they immediately see:
- an interview to resume, or a clear way to start one;
- a few numbers about their practice;
- their recent interviews;
- a résumé nudge, if they have no résumé;
- the main takeaway from their latest feedback.

All of this uses endpoints that already exist. The sidebar only lists pages that exist.

## Project Conventions
- Rule files consulted: `CLAUDE.md`, `AGENTS.md` (there's no `.claude/` folder in this repo). Earlier specs in `docs/features/` (`interview-history`, `interview-feedback`, `resume-profile`, `app-sidebar`) give context.
- Constraints these rules put on this feature:
  - Data flows service → query hook → component. Components never call services or build query keys. Every key comes from `interviewKeys` / `profileKeys`.
  - Responses from existing endpoints are already parsed with zod by their services. New list calls reuse `interviewsService.list` and `interviewListSchema`.
  - Components stay presentational. A container calls the queries. Derived values (this-week count, completion rate, takeaway line) are pure functions in the area's `utils/<area>.utils.ts`, with one test file per utils file, mirrored under `tests/`.
  - A new component must "earn its file" (reused, a real boundary, or big with its own state). Use shadcn primitives (`Card`, `Badge`, `Progress`, `Skeleton`, `Button`) and theme tokens.
  - `page.tsx` stays thin and keeps `requireUser("/")` behind `Suspense` (cacheComponents is on).
  - AI-written text (summary, improvements, next steps) is rendered as plain text, never as HTML.
  - Every data-driven section handles loading, empty and error states.
- Graphify findings: the relevant pieces already exist.
  - `useInterviewHistoryQuery(params)` → `GET /interviews` (`limit`, `offset`, `status`, `sort_by`, `sort_dir`; returns `total`).
  - `useFeedbackQuery` / `interviewsService.getFeedback(id)` returns `null` when no feedback has been requested.
  - `useProfileQuery()` returns `null` when no résumé has been uploaded.
  - Starting an interview already invalidates `interviewKeys.lists()`.
  - The `/interviews/[id]/feedback` page generates feedback when it's opened.
  - The sidebar always adds **Sign out** to the last nav section.

## User Flow
1. The candidate signs in or opens `/`.
2. Each section shows a skeleton while its data loads. Sections load independently.
3. **Hero:**
   - If an interview is in progress, they see its role, level and type, an `answered / total` progress bar, and **Resume**, which opens `/interviews?session=<id>`.
   - Otherwise they see **Start a mock interview**, which opens `/interviews`.
4. **Metrics row:**
   - Total interviews
   - Completed
   - Completion rate
   - This week
5. **Recent interviews:** the newest 5, each with a status badge and a per-status action. **See all** opens `/history`.
6. **Résumé nudge** (only if they have no résumé): **Upload résumé** opens `/resume`.
7. **Latest feedback snapshot** (only if they have a completed interview): the overall score and one takeaway line, or a call to get feedback. Its button opens `/interviews/<id>/feedback`.
8. **New user with 0 interviews:** only the Start hero and the résumé nudge (if they have no résumé) appear.

## Requirements

### Functional
- **Hero:** shows the newest `in_progress` interview, if there is one.
  - Displays role, level, interview type, and `answered_count / question_count` as a progress bar and as text.
  - **Resume** opens `/interviews?session=<id>`.
  - With no in-progress interview, it shows a Start call to action that opens `/interviews`.
- **Metrics:**
  - **Total:** the `total` of `GET /interviews` with no status filter.
  - **Completed:** the `total` with `status=completed`.
  - **Completion rate:** `completed / total` as a whole-number percent. It shows "—" when `total` is 0.
  - **This week:** the number of interviews among the newest 50 whose `created_at` falls in the current local week (Monday 00:00 to Sunday 23:59). It shows "50+" when all 50 rows are in this week and more exist.
- **Recent interviews:** the newest 5 interviews of any status, newest first.
  - Each row shows role, level, type, date and a status badge.
  - Actions by status:
    - completed → **View feedback** (`/interviews/<id>/feedback`)
    - in progress → **Resume** (`/interviews?session=<id>`)
    - abandoned → no action
  - The in-progress interview appears here too.
  - **See all** opens `/history`.
- **Résumé nudge:** shown only when the profile query returns `null`. It links to `/resume`. It's hidden when a profile exists, while the profile is loading, and when the profile request fails.
- **Feedback snapshot** is for the newest `completed` interview:
  - **Generated, `enough_evidence` true:**
    - shows `overall` as "x.x / 5";
    - shows a takeaway line: the first `improvements` item, or else the first `next_steps` item, or else no line;
    - links to **View full feedback**.
  - **Generated, `enough_evidence` false:** no score. It shows `summary` and links to the feedback page.
  - **No feedback (`null`), `generating` or `failed`:** shows a "feedback not ready" message and a **Get feedback** button that opens the feedback page.
  - **No completed interviews:** the card is hidden.
- **Sidebar:**
  - Remove **Progress** and **Settings** from the user sidebar.
  - Remove **Settings** from the admin sidebar.
  - Each role's "Account" section keeps only **Sign out**.

### Non-Functional
- No backend changes. Only existing endpoints are used: `GET /interviews`, `GET /interviews/{id}/feedback`, `GET /profile`.
- The dashboard makes at most these requests:
  - interview lists: total, completed, in-progress (`limit=1` each), and recent (`limit=50`); the 5 recent rows and the this-week count both come from the 50-row page;
  - one profile request (shared with `/resume` through the query cache);
  - feedback for at most one interview.
- No feedback is generated from the dashboard. Generation only happens on the feedback page.
- Only the data each section needs is fetched. The dashboard never asks for job descriptions or transcripts.

## UX Requirements
- Semantic headings: one `h1` for the page and a heading for each section. Progress bars have labels with `aria-valuenow`/max (Radix `Progress`). Every action is a keyboard-usable link with visible focus.
- Responsive:
  - Metrics: 1 column on mobile, 2 on small screens, 4 on large.
  - Hero, recent list, nudge and snapshot stack on mobile and may use 2 columns on large screens.
- Each section has a skeleton while loading. Sections render independently, so a slow feedback call never blocks the hero or the metrics.
- A failed section shows a short, friendly message (normalized via `api.helper`, never raw error text) and a **Retry** button that refetches only that section.
- Status badges, role/level/type labels and date formatting reuse the copy and helpers already used by `/history`.

## Constraints
- **This week** is approximate past 50 interviews, because the API has no date filter. "50+" makes that clear.
- The backend allows only one in-progress interview at a time (starting a new one abandons the previous one). The hero relies on this and shows the newest one.
- Next.js 16 with cacheComponents: the page reads cookies through `requireUser`, so that check stays inside a `Suspense` boundary.

## Blockers
- None. All open decisions were settled during grilling.

## Edge Cases
- **EC1:** User has 0 interviews → only the Start hero and the résumé nudge (if no profile) render. Metrics, recent list and feedback snapshot are hidden.
- **EC2:** Total is 0, but the dashboard still renders metrics (for example, during a refetch) → the completion rate shows "—", never `NaN` or a division error.
- **EC3:** No interview is in progress → the hero shows the Start call to action that opens `/interviews`.
- **EC4:** The in-progress interview has 0 answers → the hero shows "0 / N" with an empty bar, and Resume still works.
- **EC5:** All 50 newest interviews are in this week and `total > 50` → "This week" shows "50+".
- **EC6:** An interview was created on Sunday 23:59 local time and it's now Monday → it isn't counted in "This week" (the week starts Monday 00:00 local time).
- **EC7:** The user has interviews, but none are completed → the feedback snapshot is hidden.
- **EC8:** The latest completed interview has no feedback (`null`), or its feedback is `generating` or `failed` → the snapshot shows "not ready" and a **Get feedback** button that opens `/interviews/<id>/feedback`.
- **EC9:** Feedback is generated with `enough_evidence` false → no score; the snapshot shows `summary` and links to the feedback page.
- **EC10:** Feedback is generated with empty `improvements` → the takeaway is the first `next_steps` item. If both are empty, only the score and the link show.
- **EC11:** One section's request fails, for example feedback → only that section shows an error with **Retry**, and the other sections render normally.
- **EC12:** The profile request fails (any error other than not-found) → the résumé nudge is hidden. A missing nudge is better than a wrong one.
- **EC13:** The profile is still loading → the nudge isn't shown (no flash).
- **EC14:** A recent row is abandoned → it shows the badge with no action.
- **EC15:** The session expires while the dashboard loads → the existing `apiClient` interceptor redirects to sign-in, and the dashboard shows no error for that.
- **EC16:** The user returns to `/` after finishing an interview → the dashboard shows the updated lists after its normal refetch (the existing invalidation plus stale-time defaults). This is an assumption: verify that completing an interview leaves `interviewKeys.lists()` stale.

## Acceptance Criteria
- [ ] **AC1:** With an in-progress interview, the hero shows its role, level, type and `answered_count / question_count`, and **Resume** links to `/interviews?session=<id>`.
- [ ] **AC2:** With no in-progress interview, the hero shows a Start call to action linking to `/interviews`.
- [ ] **AC3:** The metrics row shows Total, Completed, Completion rate (`round(completed / total × 100)%`, or "—" when the total is 0) and This week (counted in the current local Mon–Sun week from the newest 50; "50+" when they're all this week and `total > 50`).
- [ ] **AC4:** The recent list shows the newest 5 interviews with status badges. Completed rows link to `/interviews/<id>/feedback`, in-progress rows link to `/interviews?session=<id>`, and abandoned rows have no action. **See all** links to `/history`.
- [ ] **AC5:** The résumé nudge appears only when the profile query returns `null`, and it links to `/resume`.
- [ ] **AC6:** For the newest completed interview with generated feedback and `enough_evidence` true, the snapshot shows the overall score as "x.x / 5" and the takeaway: the first improvement, else the first next step, else nothing.
- [ ] **AC7:** When feedback is `null`, `generating` or `failed`, the snapshot shows a "not ready" message and **Get feedback** linking to the feedback page. When `enough_evidence` is false, it shows `summary` without a score.
- [ ] **AC8:** A user with 0 interviews sees only the Start hero and, if they have no profile, the résumé nudge.
- [ ] **AC9:** Each section shows a skeleton while loading. A failed section shows a friendly error and a **Retry** that refetches only that section, while the other sections still render.
- [ ] **AC10:** The user sidebar no longer shows Progress or Settings, and the admin sidebar no longer shows Settings. **Sign out** still appears under "Account" for both roles.
- [ ] **AC11:** The dashboard makes no request to generate feedback (`POST .../feedback`) and loads feedback for at most one interview.
- [ ] **AC12:** Pure helpers (this-week count, completion rate, takeaway selection) have unit tests covering EC2, EC5, EC6 and EC10.

## Out of Scope
- **Tier 2 stats:** average score, score trend, strongest and weakest criteria, practice streak. These need a backend aggregate endpoint (`GET /interviews/stats`) to avoid N+1 feedback requests, and they belong with the Progress page.
- **Progress and Settings pages:** they're only hidden here, not built.
- **Exact "This week" past 50 interviews:** that needs a date filter on the backend.
- **Generating feedback from the dashboard:** the feedback page already does this, with its own pending and retry handling.
- **Admin dashboard content:** `/admin` is unchanged apart from the sidebar.
