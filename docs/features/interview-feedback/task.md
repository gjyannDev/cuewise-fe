# Implementation: Interview Feedback Screen (frontend)

## Status
Built and unit-tested; manual run against a real cuewise-be pending (Step 8 manual part). Not ready for PR until that run is done.

## Completed Steps
- [x] 0. Preflight (code checks; two manual checks pending)
- [x] 1. Constants, schema, types
- [x] 2. Pure utils
- [x] 3. Service, key and forwarder
- [x] 4. Queries and page hook
- [x] 5. Presentational components
- [x] 6. Route and container
- [x] 7. Entry points
- [ ] 8. Verify and close (automated checks, docs and graph done; manual EC run pending)

## Current Step
### 8. Verify and close: manual run of EC1-EC30 with cuewise-be running

## Step 0 results (2026-11-06)
- (a) Backend keeps generating after a client disconnect: **likely, from code**. `generate_feedback` is a sync `def` route (FastAPI runs it in a threadpool and never cancels it), and the `/api` forwarder's non-streaming fetch only listens to its own timeout, not to the browser's abort. Still **pending a manual check** before the leave hint ships (`FEEDBACK_LEAVE_HINT` in `constants.ts`; set it to null if it fails).
- (b) The two 404s differ: an unknown or other user's interview is `NOT_FOUND`, no feedback yet is `FEEDBACK_NOT_FOUND` (`cuewise-be/app/core/errors.py`). Confirmed.
- (c) The `user` role holds `interviews:feedback` (`cuewise-be/app/modules/auth/auth_constants.py`). Confirmed.
- (d) Hosting function-duration limit: **pending** (no deployment target in this repo).
- GET on an in-progress interview returns `FEEDBACK_NOT_FOUND` (the backend checks completion only on POST), so EC3 surfaces on the POST, as the spec says.
- `design-taste-frontend` installed globally from `leonxlnx/taste-skill` (737K installs). The registry flags it "Critical Risk" (Gen) and "Med Risk" (Snyk). Its `SKILL.md` was read: no harmful instructions, but it targets marketing and company websites and its checks run its own Node scripts. Only its written rules that fit an in-app screen were used; none of its scripts or assets were run or copied.
- Baseline before Step 1: 448 tests in 33 files, `tsc` and `lint` clean.

## Changes Made
Not committed (the user commits). Suggested message:

```
feat(interviews): show end-of-interview feedback with scores, quotes and recovery for slow generation

- Feedback page at /interviews/[id]/feedback: overall score, highlights, per-question
  criterion scores with verified quotes, and every state (none yet, generating,
  stalled, not enough answers, failed, unavailable, not finished, not found)
- Get feedback on the completed card (generates on arrival via a one-shot ?start=1)
  and View feedback on completed History rows
- 70 s forwarder / 75 s browser timeout for the feedback POST; a lost reply or a
  409 in progress reads the stored row and polls it
- shadcn accordion added via the CLI
```

## Test Results
- `npm test`: 522 passed in 37 files (74 new).
- `npx tsc --noEmit`, `npm run lint`: clean.
- `npm run build`: green with `NODE_ENV=production`, 0 React key warnings; new route `/interviews/[id]/feedback` (partial prerender).

## Tests Pending
- Manual EC1-EC30 run against a real cuewise-be (forced 502, 503, 429, 409, slow and dropped responses), at 360 px, keyboard only, dark mode, with a screen reader.
- Step 0(a) disconnect check; Step 0(d) hosting duration limit.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | generated feedback parses | spec | AC4, AC5 | pass |
| T2 | 1 | not-enough-answers result parses | spec | EC19 | pass |
| T3 | 1 | generating / failed rows parse | spec | AC9 | pass |
| T4 | 1 | four-criterion question accepted (partial record) | inferred | zod 4 exhaustive enum records | pass |
| T5 | 1 | no note, no evidence accepted | spec | EC21, EC22 | pass |
| T6 | 1 | unknown criterion, score 0/6/3.5, unknown status/category rejected | spec | EC20 | pass |
| T7 | 2 | start flag only for a single "1" | spec | AC2, AC3 | pass |
| T8 | 2 | no reply, forwarder 503, 409 in progress -> poll | spec | AC7, EC10, EC12 | pass |
| T9 | 2 | 409 not completed, 404, 502, 503, 429 classified; others unknown | spec | EC2, EC3, EC14-EC18 | pass |
| T10 | 2 | lost generation -> failed | spec | EC11 | pass |
| T11 | 2 | view for every stored status, POST error and read error | spec | AC2-AC4, AC9, AC10, EC4-EC7, EC13, EC16, EC19 | pass |
| T12 | 2 | poll error reaching the view -> unknown (recovery read failed) | code-derived | AC7 | pass |
| T13 | 2 | start on arrival only when flagged and nothing stored | spec | AC2, AC3, EC6, EC7 | pass |
| T14 | 2 | score bar percent, overall format, criteria order and labels | spec | AC4, AC5, EC23 | pass |
| T15 | 3 | getFeedback parses / null on FEEDBACK_NOT_FOUND / throws other 404 | spec | AC2, AC3, EC2, EC4 | pass |
| T16 | 3 | generateFeedback uses the 75 s timeout | spec | AC6 | pass |
| T17 | 3 | both methods reject a bad body | spec | AC11, EC20 | pass |
| T18 | 3 | forwarder: feedback POST 70 s, feedback GET 15 s, others unchanged | spec | AC6, EC9 | pass |

## Open Questions
- None. Two pending manual checks above.

## Baseline Failures
- None.

## Known Issues
- `npm run build` fails on this machine with the default environment because the shell and `.env` set `NODE_ENV=development` (Next's `/_global-error` prerender crashes). It is unrelated to this feature and fixed by building with `NODE_ENV=production`. `.env` was not changed.

## Deviations from Plan
- Refactor after the build (user request, 2026-11-06): utils grouped by area (`utils/<area>.utils.ts`: feedback, history, chat, stream, voice, interview, format; tests mirror them), `focusOnMount` moved to `src/lib/utils.ts`, components moved into area folders (`components/{chat,setup,history,feedback,common}/`), and single-use feedback pieces folded into their parent file (`FeedbackResult.tsx` holds the score card, highlights and lists; `FeedbackQuestionAccordion.tsx` holds the criterion score and the quote). Rules added to `CLAUDE.md`. 522 tests still pass (25 files instead of 37).
- Follow-up (user request, 2026-11-06): CLAUDE.md's component rule tightened to an "earn its file" test (reused, a real boundary, or big with its own state). Eight single-use files folded into their only parent: `InterviewStatusBadge` and `InterviewHistoryRowActions` into `interview-history-columns.tsx`; `InterviewColumns`, `InterviewDetailList` and `SetupSectionCard` into `InterviewConfigForm.tsx`; `TypingIndicator` and `JumpToLatestButton` into `ChatThread.tsx`; `InterviewSessionSkeleton` into `InterviewsContainer.tsx`. No behaviour change; tsc, lint, 522 tests and the production build green.
- Finding: the design-taste review favoured fewer boxes and no decorative icon chips -> plan.md Step 5 updated: `FeedbackHighlights` (one card) and `FeedbackList` replace `FeedbackInsightCard`; `FeedbackSkeleton` added for loading, generating and the `Suspense` fallback.
- Finding: a no-reply POST followed by an empty read needed its own outcome -> plan.md Step 2 updated: `feedback-lost-error.ts` (classified as failed).
- Finding: a `poll` error can still reach the selector when the recovery read itself fails -> plan.md Step 2 updated: shown as the generic error.
- Finding: the shell header already renders the page `h1` -> the feedback heading is an `h2`, sections are `h3` (spec's single top-level heading is the shell's).
- URL clean-up uses `window.history.replaceState` (Next 16 integrates it with the router), not `router.replace`, so no server round trip.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| 0 | find-skills | found and installed `design-taste-frontend` (`leonxlnx/taste-skill`); no TanStack Query skill installed (none bundled in `node_modules`, and the listed third-party ones add nothing the project's patterns don't already cover) |
| 0 | graphify | confirmed the touched nodes: `interviewKeys`, `interviewsService`, `InterviewClosingCard`, `ActiveInterview`, `InterviewHistoryRowActions`, `forward` |
| 1 | shadcn | added `accordion` with the CLI; reviewed the generated file |
| 1-3 | tdd / test | one seam at a time, red for the right reason before green |
| 5 | design-taste-frontend | applied its in-app-relevant rules: one system, plain copy, headings that name things, verb + object buttons, no scroll reveals, two boxes deep at most, plain score number |
| 5 | ui-ux-pro-max | priorities applied: 44 px targets, reserved space (skeleton), mobile-first stacks, visible focus, number + text for scores |
| 6 | Next.js docs (node_modules) | async `params`, `window.history.replaceState` integration |
| 8 | graphify | `graphify update .` (1660 nodes, 4340 edges) |

## Links
- Spec: docs/features/interview-feedback/spec.md
- Plan: docs/features/interview-feedback/plan.md
- Learnings: docs/features/interview-feedback/learnings.md

---

## Validation Checklist (before PR)
- [ ] All plan.md steps complete (Step 8 manual run pending)
- [x] Full test suite + build green (not just per-step tests)
- [ ] Every spec.md acceptance criterion met by actual code and covered by a passing spec test (or verification noted) — AC1, AC12-AC14 and the UI parts of AC4, AC5, AC8 need the manual run
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately
- [x] task.md fully updated
- [x] learnings.md written; pending measurements marked and matching Tests Pending
- [x] Commits documented (suggested message above; the user commits)
- [ ] No open blockers (Step 0a and 0d pending)
- [x] Code follows project rules (CLAUDE.md)
- [x] No unresolved plan deviations
