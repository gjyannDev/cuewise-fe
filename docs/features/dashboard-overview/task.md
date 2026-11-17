# Implementation: Dashboard Overview (Tier 1)

## Status
In Progress (Step 6 of 6) — design pass done; ready for /review-feature once the phone-width check is done by eye
Health Check: missing: caveman -> fallback: normal chat; missing: verification-before-completion -> fallback: gate-command rule

## Completed Steps
- [x] 1. Hide sidebar items
- [x] 2. Dashboard utils (test-first)
- [x] 3. Queries, hook and constants
- [x] 4. Presentational sections
- [x] 5. Container and page
- [ ] 6. Container tests and final checks (tests, gates, build done; manual browser check pending)

## Current Step
### 6. Container tests and final checks
- Done: 18 container tests, full suite, tsc, lint, build compile; browser check at 1440 with a real account (data, sidebar, `limit=1` accepted).
- Design pass (user request after the first look): one card system, four type steps, one primary button, no icon chips, errors inside their cards.
- Pending: phone/tablet width by eye (the browser window would not resize).

## Changes Made
- (user commits manually) Suggested messages:
  - Step 1: `feat(navigation): hide the Progress and Settings links until their pages exist`
  - Step 2: `feat(interviews): add dashboard utils for this-week count, completion rate and feedback snapshot`
  - Step 3: `feat(interviews): add the dashboard overview hook, constants and shared status badge variants`
  - Steps 4-6: `feat(dashboard): show the continue card, metrics, recent interviews, résumé nudge and latest feedback`

## Test Results
- Step 1: `npx vitest run tests/modules/navigation tests/shared/sidebar` -> 24 passed; tsc 0; eslint clean
- Step 2: `npx vitest run tests/modules/interviews/utils/dashboard.utils.test.ts` -> 18 passed (red seen per function first); tsc 0; eslint clean
- Step 3: `npx vitest run tests/modules/interviews` -> 546 passed (22 files); tsc 0; eslint clean
- Step 4: tsc 0; eslint clean (rendering covered by Step 6)
- Step 5: tsc 0; `npm run lint` clean; `npm run build` -> pass with `NODE_ENV=production` (see Known Issues)
- Step 6: `npx vitest run "tests/app/(app)/_components"` -> 18 passed; full `npm test` -> 864 passed (47 files); tsc 0; lint clean
- Design pass: full `npm test` -> 864 passed (47 files); tsc 0; `npm run lint` clean; `npm run build` compiled and generated 14/14 pages, then exited 1 on a Next.js security-advisory notice (see Known Issues)
- Browser (1440, real account): every section renders with data; Completed count and the latest-feedback card come from the `limit=1` request, so the backend accepts it; sidebar has no Progress/Settings

## Tests Pending
- Phone (390) and tablet (768) widths by eye
- New-account view by eye (covered by T27 only)

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | user nav ends at Résumé; Account section empty | spec | AC10 | pass |
| T2 | 1 | admin nav has no Settings; Account section empty | spec | AC10 | pass |
| T3 | 2 | countThisWeek: none this week -> 0 | spec | AC3 | pass |
| T4 | 2 | countThisWeek: counts only this week's rows | spec | AC3 | pass |
| T5 | 2 | countThisWeek: Monday 00:00 in, Sunday 23:59 out | spec | EC6 | pass |
| T6 | 2 | countThisWeek: Sunday counts back to Monday | inferred | risk: getDay() Sunday = 0 | pass |
| T7 | 2 | countThisWeek: full sample + more -> capped | spec | EC5 | pass |
| T8 | 2 | countThisWeek: full sample, nothing more -> not capped | spec | EC5 | pass |
| T9 | 2 | countThisWeek: empty list | inferred | risk: empty input | pass |
| T10 | 2 | completionRate: 0/0 -> null | spec | EC2 | pass |
| T11 | 2 | completionRate: whole percent | spec | AC3 | pass |
| T12 | 2 | completionRate: rounds | inferred | risk: thirds | pass |
| T13 | 2 | getFeedbackSnapshot: null/generating/failed -> pending reason | spec | EC8 | pass |
| T14 | 2 | getFeedbackSnapshot: low evidence -> summary | spec | EC9 | pass |
| T15 | 2 | getFeedbackSnapshot: generated with overall null -> summary | code-derived | nullable overall | pass |
| T16 | 2 | getFeedbackSnapshot: score + first improvement | spec | AC6 | pass |
| T17 | 2 | getFeedbackSnapshot: next step fallback / no takeaway | spec | EC10 | pass |
| T18 | 6 | hero resumes the in-progress interview with progress | spec | AC1, EC4 | pass |
| T19 | 6 | hero offers a new interview | spec | AC2, EC3 | pass |
| T20 | 6 | metrics values, "—" and "50+" | spec | AC3, EC2, EC5 | pass |
| T21 | 6 | recent rows: action per status, See all | spec | AC4, EC14 | pass |
| T22 | 6 | nudge only on a null profile; hidden when uploaded/loading/failed | spec | AC5, EC12, EC13 | pass |
| T23 | 6 | snapshot: score + takeaway | spec | AC6 | pass |
| T24 | 6 | snapshot: Get feedback -> ?start=1; generating -> plain link; low evidence -> summary | spec | AC7, EC8, EC9 | pass |
| T25 | 6 | snapshot hidden with no completed interview | spec | EC7 | pass |
| T26 | 6 | feedback read for the newest completed only; never generated | spec | AC11 | pass |
| T27 | 6 | new user: start card + nudge only | spec | AC8, EC1 | pass |
| T28 | 6 | skeletons while loading | spec | AC9 | pass |
| T29 | 6 | feedback error: one alert, retry only feedback | spec | AC9, EC11 | pass |
| T30 | 6 | metrics error: retry only metrics | spec | AC9 | pass |

## Open Questions
- none

## Baseline Failures
- none seen

## Known Issues
- `npm run build` fails on `/_global-error` ("Cannot read properties of null (reading 'useContext')") when the shell has `NODE_ENV=development` set, as this machine's shell does. With `NODE_ENV=production` the build passes. Environment, not this feature.
- `npm run build` (Next 16.4.3) compiles and generates every page, then exits 1 with a "SecurityFatalError" telling you to upgrade Next.js. Not caused by this feature; whether to upgrade is the user's call.

## Deviations from Plan
- Finding: all four sections need the same error-with-retry block -> added `components/dashboard/DashboardSectionError.tsx` (reused by 4 files, so it earns its file) -> plan.md updated: no (file-level detail only) -> Approved by: pending user review
- Finding: after seeing it live, the user found the first design inconsistent -> restyled the sections as one system (shared `components/dashboard/dashboard.styles.ts`: title, label, number, header link; one card pattern; one primary button; no icon chips; metrics as one card with a `dl`; section errors inside their card instead of a separate Alert) -> plan.md "Visual design" superseded by this -> Approved by: user (asked for the redesign)

## Debug Log
- 2026-11-17, out of plan (user report): "Resume always shows Interview ended". Reproduced: a fresh load resumed fine; after End interview -> Dashboard -> Resume, the closing card showed until a reload.
  - H1 (confirmed, partial): `endedSessionId` in `InterviewsContainer` survives navigation, because Next hides the page in `<Activity>` instead of unmounting it. Fix: `hooks/use-ended-session.ts` resets it in a layout-effect cleanup. Regression test: `tests/modules/interviews/hooks/use-ended-session.test.tsx` "can be resumed after leaving the screen and coming back" (failed before the reset, passes after).
  - H2 (confirmed, the visible cause): the room reducer's `leave` kept `phase: "closed"` for every closed room, so a room ended early came back as "Interview ended". Ending is client-only (the session stays in progress on cuewise-be). Fix: `RoomState.endedEarly`, set by `end`; `leave` keeps only a finished room closed. The old test "a closed room stays closed" was split into "a room ended early goes back to the lobby…" (new rule, per the user's request) and "a finished room stays closed…" (unchanged rule).
  - **fixed**: verified live (End -> Dashboard -> Resume shows "Ready to join?" for the same interview); `npm test` green.

## Review

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| 1-3 | lean-ctx | reads, anchored edits, test/gate runs |
| 2 | tdd/test (rules applied inline) | red -> green per function at the confirmed seam |
| 3 | ponytail (judgment) | dropped a redundant isError check in sectionStatus |
| design pass | ui-ux-pro-max | Swiss/minimal direction for dashboards; consistent modular type scale |
| design pass | design-taste-frontend | "one system" rules only (one card, one button pair, one heading scale); the rest targets marketing sites |
| 6 | claude-in-chrome | live check at 1440 with a real account |

## Links
- Spec: docs/features/dashboard-overview/spec.md
- Plan: docs/features/dashboard-overview/plan.md
