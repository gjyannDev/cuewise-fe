# Implementation: Résumé profile and résumé-aware interviews

## Status
Built: all 13 steps complete, full suite and build green. Ready for /review-feature; the signed-in browser walk is still pending (see Tests Pending), so not ready for PR until it passes.
Health Check: missing: caveman -> fallback: normal chat; missing: verification-before-completion -> fallback: gate-command rule

## Completed Steps
- [x] 1. Profile schemas, types and constants (test first; 18 tests)
- [x] 2. Upload error mapping (test first; 10 tests)
- [x] 3. Profile service and keys (test first; 7 tests)
- [x] 4. Forwarder timeout (test first; 2 table rows)
- [x] 5. Profile queries (test after: signed-in browser walk pending, see Tests Pending)
- [x] 6. Shared file field and upload card (test after: signed-in browser walk pending)
- [x] 7. Profile view with delete (test after: signed-in browser walk pending)
- [x] 8. Page, container and sidebar entry (test after: EC20 verified; signed-in states pending; build green)
- [x] 9. Interview schemas (test first; 6 new cases, fixtures updated)
- [x] 10. Start error mapping (test first; 2 new cases)
- [x] 11. Setup form toggle (test after: signed-in browser walk pending)
- [x] 12. Title-bar badge (test after: signed-in browser walk pending)
- [x] 13. Final pass

## Current Step
### Done
- Step 13: full suite, typecheck, lint, production build; privacy grep (no `console.`, browser storage, `dangerouslySetInnerHTML` or zustand in the new code; the only URLs carry a session id); layer grep (only services use `apiClient`, only queries import `profileService`); `graphify update .` (1837 nodes, 4876 edges); `learnings.md` written.

## Changes Made
- (none committed; the user commits by hand)
- Suggested commit for Steps 1-3: `git add src/modules/profile tests/modules/profile tests/helpers/profile.ts` then
  `git commit -m "feat(profile): add profile schemas, upload error mapping and profile service"`
- Suggested commit for Steps 4-6: `git add "src/app/api/[...path]/route.ts" "tests/app/api/[...path]/route.test.ts" src/modules/profile src/shared/forms/FileField.tsx` then
  `git commit -m "feat(profile): add resume upload queries, file field and upload card"`
- Suggested commit for Steps 7-8: `git add src/modules/profile "src/app/(app)/resume" src/modules/navigation/navigation.constants.ts tests/modules/navigation/navigation.constants.test.ts` then
  `git commit -m "feat(profile): add the resume page with profile view, delete and sidebar entry"`
- Suggested commit for Step 9: `git add src/modules/interviews/schemas src/modules/interviews/constants.ts tests/modules/interviews tests/helpers/interviews.ts` then
  `git commit -m "feat(interviews): send and read use_profile on interview start and session"`
- Suggested commit for Steps 10-12: `git add src/modules/interviews "src/app/(app)/interviews/_components/InterviewsContainer.tsx" tests/modules/interviews/utils/interview.utils.test.ts` then
  `git commit -m "feat(interviews): add the use-my-resume toggle, PROFILE_REQUIRED handling and resume-aware badge"`

## Test Results
Baseline before Step 1 (2026-11-15): `npm test` 26 files, 563 tests pass; `npx tsc --noEmit` clean; `npm run lint` clean.
After Step 3: `npm test` 29 files, 598 tests pass; `npx tsc --noEmit` clean; `npm run lint` clean.
After Step 6: `npm test` 29 files, 600 tests pass; `npx tsc --noEmit` clean; `npm run lint` clean.
After Step 8: `npm test` 29 files, 600 tests pass; `npm run build` green with `NODE_ENV=production` (`/resume` listed).
After Step 9: `npm test` 29 files, 606 tests pass; `npx tsc --noEmit` clean; `npm run lint` clean.
After Step 12: `npm test` 29 files, 608 tests pass; `npx tsc --noEmit` clean; `npm run lint` clean.
Final (Step 13): `npm test` 29 files, 608 tests pass; `npx tsc --noEmit` clean; `npm run lint` clean;
`NODE_ENV=production npm run build` green (`/resume` and `/interviews` listed).

AC coverage: AC3 (pre-check, multipart), AC4 (mapping), AC11, AC12 (mapping), AC13 (schema), AC14, AC15 are covered
by passing unit tests. AC1 is partly covered (sidebar test, EC20 curl). AC2, AC5-AC10, AC12 (UI), AC13 (badge) are
UI behavior with no component-test tooling (user decision): built, verification is the pending browser walk. AC16 met.

Contract check: the backend was not running (no `/openapi.json`), so shapes and codes were read from cuewise-be
source instead: `app/core/errors.py` (codes and statuses), `profile_constants.py` (limits, messages, 20 s budget),
`profile_route.py` (GET/DELETE `/profile`, POST `/profile/resume`, `response_model=ProfileOut`) and
`interviews_schema.py` (`SessionOut.use_profile: bool`, strict boolean on the start request).

## Tests Pending
- Signed-in browser walk (needs cuewise-be running and an account): `/resume` loading, empty (EC1), error with retry
  (EC2), upload success, refusals EC5-EC10 with real files, unconfirmed upload (EC11), replace without flicker (EC12),
  delete with confirm (EC13, EC14), only-skills profile (EC21), HTML-like text shown literally (EC22), no second
  upload while pending (EC23), and the real extraction time against the 30 s forwarder budget.
- Dropzone look and behavior (phone and desktop width, light and dark): click to browse, drag a file in (highlight), drop, Tab + Enter/Space opens the picker, focus ring visible, disabled during upload and delete, file name shown while uploading; upload card above the profile in one column, both at the content area's full width.
- Résumé-style profile (user request, 2026-11-15): a document "page" inside the card with Experience, Projects and Skills sections (small-caps headings over a rule), role title with the period right-aligned from `sm`, organization under it, skills and technologies as dot-separated lines; check light and dark, phone width (period wraps under the title), long titles and long skill lists, and that the dot separators render.
- Steps 11-12 UI walk: toggle disabled with "Go to Résumé" link when missing (AC10), "couldn't check" when the
  profile GET fails (EC2), enabled with a profile, start sends `use_profile: true` and the title bar shows
  "Résumé-aware" (EC15); left off, nothing shows (EC16); delete in another tab then start -> message under the
  toggle, toggle turns off and disabled, other fields kept (EC17); delete mid-interview -> interview carries on and
  the badge stays (EC18).

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | `.pdf`/`.docx` names accepted in any case, size up to exactly 2 MB | spec | AC3 | pass |
| T2 | 1 | `.doc`, `.docm`, `.txt`, `.pdf.exe`, no extension refused by name | spec | EC3, EC4 | pass |
| T3 | 1 | over 2 MB refused | spec | EC3 | pass |
| T4 | 1 | empty file and no file refused | inferred | risk: empty input | pass |
| T5 | 1 | profile parses; only-skills profile parses; missing `updated_at` or role title rejected | spec | EC21, AC15 | pass |
| T6 | 2 | 413/415/422/502/503 -> alert with backend message | spec | EC5-EC9 | pass |
| T7 | 2 | 429 -> toast | spec | EC10 | pass |
| T8 | 2 | network error and forwarder 503 `SERVICE_UNAVAILABLE` -> unconfirmed | spec | EC11 | pass |
| T9 | 2 | non-JSON body -> generic alert, never raw text | inferred | risk: raw error leak | pass |
| T10 | 2 | 422 `VALIDATION_ERROR` -> alert | code-derived | parseApiError path | pass |
| T11 | 3 | `get()` hits `/profile`, no id | spec | EC24 | pass |
| T12 | 3 | `get()` returns null on `PROFILE_NOT_FOUND`, rethrows others | spec | AC2, EC1, EC2 | pass |
| T13 | 3 | `get()` rejects a non-profile reply | spec | AC15 | pass |
| T14 | 3 | `upload()` sends exactly one `file` part with the 35 s budget | spec | AC3, AC14 | pass |
| T15 | 3 | `remove()` deletes `/profile` | spec | AC7, EC14 | pass |
| T16 | 4 | forwarder gives POST `profile/resume` 30 s, GET `profile` the default 15 s | spec | AC14 | pass |
| T17 | 8 | sidebar lists Résumé between History and Progress (existing test updated) | spec | AC1 | pass |
| T18 | 8 | signed-out GET `/resume` -> 307 to `/signin?next=%2Fresume` (curl against `next dev`) | spec | EC20 | pass |
| T19 | 9 | start body carries `use_profile`, false by default, true when on | spec | AC11, EC15, EC16 | pass |
| T20 | 9 | `use_profile` of `"true"`, `1`, `null` rejected | spec | AC11 | pass |
| T21 | 9 | session reads `use_profile`; a session without it is rejected | spec | AC13 | pass |
| T22 | 10 | 409 `PROFILE_REQUIRED` -> error under `use_profile`; other 409s still under `question_count` | spec | AC12, EC17 | pass |
| T23 | 10 | 422 on `body.use_profile` -> error under `use_profile` | code-derived | FORM_FIELDS filter | pass |

## Open Questions
- AGENTS.md agent-feedback block: run `next internal agent-feedback-instructions` or not -> needs decision from: the user
- Provider data terms for résumé text (Google AI Studio) and whether the notice copy matches them -> needs decision from: the user (backend risk, before real users)

## Baseline Failures
- (none)

## Known Issues
- `npm run build` fails on `/_global-error` prerender (`Cannot read properties of null (reading 'useContext')`) when
  the shell has `NODE_ENV=development` set, as this machine's shell does. With `NODE_ENV=production` the build is
  green. Environment, not code: run builds with `NODE_ENV=production`.
- Running `next dev` (for T18) rewrote `AGENTS.md` with a "Report Next.js feedback" block that asks the agent to
  run `next internal agent-feedback-instructions` (an outside service). Left in the tree, not reverted, and the
  command was not run: that needs the user's decision.

## Deviations from Plan
- Finding: the spec says Replace "reuses the same control" as upload, so Replace lives in `ResumeUploadCard` (relabelled when a profile exists), not in `ResumeProfileView` as plan Step 7 said -> plan.md Step 7 updated -> Approved by: the user ("continue" at the Step 6 checkpoint)
- Finding: Step 8 needed the existing sidebar test (`tests/modules/navigation/navigation.constants.test.ts`) updated to list the new item -> no plan change (an intended contract change, not a loosened test)
- Finding: Step 9 also updated `tests/modules/interviews/services/interviews.services.test.ts` (start body now has `use_profile`) and three session fixtures besides `tests/helpers/interviews.ts` -> as the plan's Risks predicted
- User request after review (2026-11-15): `/resume` is one column, the upload/replace card above "Your profile" (was a two-column grid from `xl`), and `FileField` became a dropzone (dashed area, icon, click or drag-and-drop, drag highlight, spinner and file name while uploading; the native input stays inside the label, visually hidden, named by the visible label). The upload status moved from the card into the field. Same parent in both states, so the card no longer remounts after the first upload. Gates after the change: tsc clean, lint clean, 608 tests pass, `NODE_ENV=production npm run build` exit 0. Not seen in a browser yet (the page needs a signed-in session); added to Tests Pending.

## Debug Log
- (no /debug invocations)

## Review
Written by `/review-feature` (2026-11-15). Health Check: `code-review`, `security-review`, `llm-security`, `simplify` present; missing: verification-before-completion -> fallback: each gate command shown with its real result.
Scope: the uncommitted working tree (this feature). The branch's five committed 8b job-import commits (`37de2f6`..`7229eed`) were reviewed in `docs/features/interviews-job-import/` and are not re-reviewed here.
Sources: `code-review` ran as a background agent; its 10 findings were checked against the code: 1 rejected, 3 merged as duplicates, 6 added (R8-R13). `security-review`, `llm-security` and `simplify` (report-only) were applied directly as checklists against the diff, not invoked as separate runs.

| ID | Severity | Source | File:line | Finding | Status |
|----|----------|--------|-----------|---------|--------|
| R1 | should-fix | traceability | docs/features/resume-profile/task.md (Tests Pending) | The UI acceptance criteria (AC2 empty state, AC5-AC10, AC12 UI half, AC13 badge) and edge cases EC1, EC2, EC5-EC14, EC17, EC18, EC21-EC23 have no passing test and no recorded verification yet: the repo has no component-test tooling (user decision) and the signed-in browser walk has not happened because cuewise-be wasn't running. Until the walk is done these are built but unverified. | open |
| R2 | should-fix | simplify, project rules (Accessibility) | src/app/(app)/resume/_components/ResumeContainer.tsx:41 | A successful upload gives no feedback beyond the layout changing: the "Reading your résumé…" status empties and nothing says it worked, so a screen-reader user hears the wait start and then silence. The first upload also remounts the card (the empty-state wrapper and the grid are different parents), so focus drops to the page body. A success toast through `useMutationCallbacks` (which the project's Data Fetching rule asks for anyway) would announce it. | fixed: a success toast via `useMutationCallbacks` ("Your profile is ready" / "Your profile was updated"); sonner announces it |
| R3 | nit | code-review (inline + agent) | src/modules/profile/components/resume/ResumeProfileView.tsx:147 | Technologies are keyed by their text (`key={technology}`). cuewise-be merges duplicate skills ignoring case, but its spec says nothing about de-duplicating a project's technologies, so a model reply with the same technology twice would give React a duplicate key (a console warning, and a possible wrong row reuse). Keying by text plus index, as roles and projects already do, removes the risk. | fixed: skills and technologies keyed by text plus index |
| R4 | nit | project rules (Data Fetching: toasts through `useMutationCallbacks`) | src/app/(app)/resume/_components/ResumeContainer.tsx:45 | The 429 toast calls `toast.error` directly instead of going through `useMutationCallbacks`. There is precedent (`use-job-description-import.ts:96` does the same) and the message is the backend's own, so the effect is identical; it is only a consistency gap with the rule. | fixed (not selected; a side effect of the R2 fix): the 429 now goes through `buildCallbacks(...).onError`, title "Couldn't upload your résumé" with the backend's message as the description |
| R5 | nit | simplify, code-review (agent) | src/modules/profile/constants.ts:21, src/modules/interviews/constants.ts:98 | Two constants are unused: `PROFILE_ERROR_CODES.required` (the interviews side uses its own `START_ERROR_CODES.profileRequired`) and `START_ERROR_CODES.notEnoughQuestions` (the code only checks for `profileRequired`). Dead constants invite drift (YAGNI). | fixed: both removed |
| R6 | nit | simplify | src/modules/profile/components/resume/ResumeUploadCard.tsx:77 | A browser-side refusal (wrong name or size) shows its field error while an earlier server alert from the previous upload can still be on screen, so two messages describe two different files. Clearing `uploadError` when a new file is chosen (before the schema check) would keep one message at a time. | fixed: the card calls `onFileChosen` before its schema check, and the container clears the notice |
| R7 | nit | code-review (inline + agent) | src/app/(app)/interviews/_components/InterviewsContainer.tsx:57 | `useProfileQuery()` runs for every `/interviews` view, including an active interview and the not-found card, where the toggle isn't shown: one extra `GET /profile` per stale period. Harmless (cached, small), but it is a request the screen doesn't need. | open |
| R8 | should-fix | code-review (agent) | src/modules/profile/components/resume/ResumeUploadCard.tsx:77 | An unconfirmed upload (no reply) is shown in the same destructive alert as a refusal, so the title "Your résumé wasn't updated" sits over "We couldn't confirm your upload. We've reloaded your profile…". The profile may in fact have been replaced, so the two lines contradict each other. The unconfirmed case needs its own neutral title (or a non-destructive alert). | fixed: the card takes a `notice` with its kind; unconfirmed shows a default (non-destructive) alert titled "We couldn't confirm your upload" with "The upload may still have worked…" |
| R9 | should-fix | code-review (agent) | src/shared/forms/CheckBoxFieldWithDescription.tsx:55 | The shared checkbox field never passes `field.ref` to the Checkbox and never links its `FieldError` with `aria-describedby`. So when a start returns 409 `PROFILE_REQUIRED`, `setError("use_profile", …, { shouldFocus: true })` can't move focus to the toggle, and a screen reader doesn't hear why Start failed. Fixing it in the shared field (ref, error id, `aria-invalid`, `aria-describedby`) also helps its other users. | fixed: `ref`, `onBlur`, `aria-invalid` and `aria-describedby` on the Checkbox; `FieldError` gets the matching id (it already has `role="alert"`, so the message is read even if the toggle is disabled before focus lands) |
| R10 | should-fix | code-review (agent) | src/app/(app)/interviews/_components/InterviewsContainer.tsx:94 | After a 409 `PROFILE_REQUIRED` the toggle only turns off if `profile.refetch()` succeeds. If that refetch fails (a transient network error), the cached profile stays, `resumeStatus` stays `available`, the box stays checked, and every retry gets the same 409. cuewise-be's 409 is itself proof that no profile exists, so the profile cache can be set to "none" directly (through a small exported helper in the profile queries, so interviews never builds profile keys). | fixed: new `useMarkProfileMissing` in `profile.queries.ts`; the container calls it instead of `refetch()` |
| R11 | should-fix | code-review (agent) | src/app/(app)/resume/_components/ResumeContainer.tsx:100 | Delete stays enabled while an upload is running (and the upload card stays enabled while a delete runs). If the candidate confirms Delete during the up-to-20 s extraction, the delete finishes first ("Profile deleted"), then the upload stores the new profile and writes it back to the cache. The cache matches the backend, but the candidate sees a profile reappear right after deleting it. Disabling each action while the other is pending removes the race. | fixed: Delete is disabled while an upload runs, the upload card while a delete runs, and both handlers return early if either is pending |
| R12 | nit | code-review (agent) | src/modules/interviews/components/setup/InterviewConfigForm.tsx:279 | When the profile check fails, the toggle says "We couldn't check for your résumé right now" with no way to retry short of a reload or a window-focus refetch. The spec (EC2) only asks that the form keep working, which it does; a small "Try again" button would make the résumé option recoverable. | open |
| R13 | nit | code-review (agent) | src/modules/interviews/components/setup/InterviewConfigForm.tsx:99 | The effect that turns the toggle off copies server state into form state, which the project's Performance rule discourages ("derive state instead of syncing it with `useEffect`"); for one render the summary can say "Résumé: Used" over a disabled box. The plan chose the effect deliberately (Approaches Considered: react-hook-form owns the value, so it can't be derived, and clamping only at submit would leave a checked, disabled box on screen). Recommend keeping it. | open |

Rejected after verification:
- code-review (agent) said the forwarder's 503 `SERVICE_UNAVAILABLE` is shown as a plain alert and never reloads the profile (`resume.utils.ts:12`). It isn't: `isNoResponseError` treats a 503 with that code as no response (`src/lib/config/api.helper.ts`), the util checks it first, and the test `the forwarder's own 503 is unconfirmed, not PROFILE_UNAVAILABLE (EC11)` passes.
- Its duplicates of R3 (keys), R5 (unused constant) and R7 (extra request) are merged into those rows. On R3: skills are already de-duplicated by cuewise-be ignoring case, so only technologies can collide.

Checked and not a finding:
- Privacy: no `console.`, `localStorage`, `sessionStorage`, IndexedDB, zustand or `dangerouslySetInnerHTML` in the new code; the profile lives only in the Query cache, which sign-in, sign-out (`auth.queries.ts:11`, `:42`) and an expired session (`session-redirect.ts:19`) all clear, so one user's profile can't leak into the next session in the same tab. No URL carries profile data.
- Untrusted model output (llm-security): every profile field is rendered as a React text child (badges, paragraphs); nothing is parsed as HTML or markdown.
- Multipart upload: the shared axios instance sets no JSON `Content-Type` default (`axios.client.ts:14`), so `FormData` keeps its boundary; the forwarder passes bytes and `Content-Type` through (existing voice test).
- `z.instanceof(File)` at module load: Next 16.4.3 requires Node >= 20.9 (this machine: v24.21.0), where `File` is a global.
- Layers: only services import `apiClient`; only `profile.queries.ts` imports `profileService`; the interviews feature uses the profile module's exported query hook and constants only.
- Upload and delete racing: the cache ends in the same state as the backend in either order.

Check results:
- `npm test` -> pass (29 files, 608 tests)
- `npx tsc --noEmit` -> pass (exit 0)
- `npm run lint` -> pass (exit 0)
- `NODE_ENV=production npm run build` -> pass (exit 0); plain `npm run build` fails in this shell because of `NODE_ENV=development` (Known Issues)
- static security scan -> not run: none configured in the project
- dependency audit -> not run: no dependency was added or changed (`package.json` untouched)
- migration round-trip -> not run: frontend only, no database

After fixes (R2, R3, R4, R5, R6, R8, R9, R10, R11), re-run:
- `npm test` -> pass (29 files, 608 tests)
- `npx tsc --noEmit` -> pass (exit 0)
- `npm run lint` -> pass (exit 0)
- `NODE_ENV=production npm run build` -> pass (exit 0)
- `graphify update .` -> done (1851 nodes, 4908 edges)
Still open: R1 (signed-in browser walk), R7, R12, R13 (not selected). The fixed UI behavior (toasts, notice titles, disabled states, focus) joins R1's browser walk; it has no unit test.
## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| 1-3 | lean-ctx | reading existing services, tests and helpers for patterns; running gates |
| 1-3 | tdd (rules applied from /implement) | red -> green per seam; each test file failed on the missing module first |
| 1-3 | ponytail (applied directly) | profile schema mirrors the shape only, the caps stay on the backend |
| 4 | tdd (rules applied) | timeout table row failed with 15000 vs 30000 before the forwarder change |
| 6 | ponytail (applied directly) | the shadcn `Input` already styles `type="file"`, so `FileField` wraps it: no new primitive, no hidden-input button trick |
| 8 | Next 16 docs (`node_modules/next/dist/docs/.../page.md`) | page props; followed the existing `HistoryPage` pattern (`requireUser` behind Suspense) |
| 9 | tdd (rules applied) | 11 cases red (unknown key stripped) before the schema change |
| 10 | tdd (rules applied) | 2 cases red before the PROFILE_REQUIRED branch |
| 11 | ponytail (applied directly) | reused `CheckBoxFieldWithDescription` and the setup form's `SectionCard`; no new component file |

## Links
- Spec: docs/features/resume-profile/spec.md
- Plan: docs/features/resume-profile/plan.md
- Learnings: docs/features/resume-profile/learnings.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite + build green (not just per-step tests)
- [x] Gate commands green on every step
- [x] Every `/debug` invocation logged in Debug Log; no step left `blocked` (none needed)
- [ ] Every spec.md acceptance criterion met by actual code and covered by a passing spec test (or verification noted): UI ACs await the browser walk
- [x] Open Questions surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately (none)
- [x] task.md fully updated
- [x] learnings.md written; pending measurements marked and matching Tests Pending
- [ ] Commits documented (suggestions above; the user commits)
- [x] No open blockers
- [x] Code follows project rules (CLAUDE.md; no `.claude/rules`)
- [x] No unresolved plan deviations
