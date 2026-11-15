# Implementation Plan: Résumé profile and résumé-aware interviews

## Overview
Add a `profile` feature module and a `/resume` page (Slice 8c), then wire a "Use my résumé" toggle, the `PROFILE_REQUIRED` handling and a title-bar badge into the interview screens (Slice 8d). Spec: `docs/features/resume-profile/spec.md`.

## Architecture & Design
New module `src/modules/profile/` follows service → query → component. One shared profile query (`GET /profile`, 404 mapped to `null`) feeds both the `/resume` container and the interview setup container, so the toggle and the page always agree. The interviews module never imports the profile service: its container calls the profile query hook and passes a plain status down to the presentational form. The BFF catch-all already forwards multipart bytes and any `/api/*` path (voice answers proved it), so the only server change is a longer timeout for `profile/resume`.

## Approaches Considered
The module, route, consent copy and replace/delete rules were settled in the spec. Open design choices:

| Approach | Trade-offs | Chosen? |
|----------|-----------|---------|
| **Upload control** A. react-hook-form + `zodResolver` + a new shared `FileField`, submitted on file choice | Follows the Forms rule; one schema checks name and size; the field is reusable | **Yes**: CLAUDE.md says never hand-roll form state |
| B. Raw `<input type=file>` with `safeParse` in the handler | Fewer lines, but error state ends up in `useState` | No: breaks the Forms rule |
| **Toggle gating** A. Container reads the profile query and passes a `resumeStatus` prop (`checking`, `available`, `missing`, `error`) | Form stays presentational; interviews never touch profile internals | **Yes**: Components and Layer rules |
| B. The form calls the profile hook itself | Fewer props, but a "dumb" component fetches data | No: Components rule |
| **Toggle goes off when the profile vanishes** A. Small effect in the form that sets the field to false when status leaves `available` | Covers focus refetch, another tab and the 409 in one place; RHF owns the value, so it can't be derived | **Yes**: the one justified sync of server state into form state |
| B. Clamp only at submit | No effect, but a checked, disabled box can show meanwhile | No |
| **Upload errors** A. Pure util `getResumeUploadErrorResult` returns `alert`, `toast` or `unconfirmed` | Testable without React; same shape as `getFeedbackErrorResult` | **Yes** |

## Spec Requirements -> Implementation
- Résumé page, states, nav entry, protection (AC1, AC2) -> Steps 3, 5, 8
- Upload, pre-check, errors, busy, replace (AC3-AC6) -> Steps 1, 2, 3, 4, 5, 6
- Delete with confirm, profile view (AC7, AC8) -> Steps 5, 7
- Consent notice (AC9) -> Steps 1, 6, 11
- Toggle, `use_profile` in start body, 409, badge (AC10-AC13) -> Steps 9-12
- Timeouts (AC14) -> Steps 1, 4
- No leaks, validation (AC15), gates (AC16) -> Steps 3, 13

## Implementation Steps
Checkpoint interval: every 3 steps (large plan), plus a pause after Step 8, where Part A (the page) can ship alone.

**Part A: résumé page (8c)**
1. Profile schemas, types and constants. Files: `src/modules/profile/schemas/profile.schema.ts`, `src/modules/profile/types/profile.types.ts`, `src/modules/profile/constants.ts` (route `/resume`, accepted extensions, 2 MB limit, timeouts 30 s forwarder / 35 s client, error codes, notice and page copy), `tests/modules/profile/schemas/profile.schema.test.ts`. The schemas are the profile response (skills, roles, projects, `updated_at`) and `resumeFileSchema` (extension and size). Verify: `npx vitest run tests/modules/profile/schemas` + gates. Test: first (seam 1; AC3, EC3, EC4).
2. Upload error mapping. Files: `src/modules/profile/utils/resume.utils.ts`, `tests/modules/profile/utils/resume.utils.test.ts`. `getResumeUploadErrorResult(error)` returns `alert` with the backend message for 413, 415, 422, 502 and 503; `toast` for 429; `unconfirmed` when no response came (checked first, so the forwarder's 503 `SERVICE_UNAVAILABLE` is not mistaken for `PROFILE_UNAVAILABLE`); otherwise a generic alert. Verify: `npx vitest run tests/modules/profile/utils` + gates. Test: first (seam 2; AC4, EC5-EC11).
3. Profile service and keys. Files: `src/modules/profile/services/profile.services.ts`, `src/modules/profile/queries/profile.keys.ts`, `tests/modules/profile/services/profile.services.test.ts`. `get()` returns `null` on `PROFILE_NOT_FOUND`; `upload(file)` posts a `FormData` with one `file` part and the longer timeout; `remove()` deletes. All through `apiClient`, responses parsed by zod. Verify: `npx vitest run tests/modules/profile/services` + gates. Test: first (seam 5; AC2, AC3, AC15, EC1, EC14, EC24).
4. Forwarder timeout. Files: `src/app/api/[...path]/route.ts`, `tests/app/api/[...path]/route.test.ts`. Add `profile/resume` to the slow-POST list and a row to the existing timeout table. Verify: `npx vitest run "tests/app/api/[...path]"` + gates. Test: first (seam 6; AC14).
5. Profile queries. Files: `src/modules/profile/queries/profile.queries.ts`. `useProfileQuery`; `useUploadResumeMutation` (on success `setQueryData` replaces the profile in one step; on an unconfirmed result it invalidates the profile query); `useDeleteProfileMutation` (on success sets the cache to `null`). Verify: `npx tsc --noEmit` + gates, behavior checked in Steps 6-8. Test: after (cache behavior is verified in the running app; AC6, AC7, EC11-EC14).
6. Shared file field and upload card. Files: `src/shared/forms/FileField.tsx`, `src/modules/profile/components/resume/ResumeUploadCard.tsx`. The field is feature-agnostic (label, accept, error, disabled, pending); the card holds the form, the provider notice, the inline error alert, the busy state and the duplicate-upload guard. Verify: `npx tsc --noEmit`, `npm run lint` + gates; then browser walk of EC3, EC4, EC5-EC10, EC23. Test: after (AC3-AC6, AC9).
7. Profile view with delete. Files: `src/modules/profile/components/resume/ResumeProfileView.tsx`. Skills, roles and projects as plain text, empty sections omitted, and a Delete confirmation dialog (follows `EndInterviewDialog`'s focus-return pattern). Replace stays in `ResumeUploadCard` (the same control, relabelled when a profile exists; deviation logged in task.md). Verify: `npx tsc --noEmit`, `npm run lint` + gates; browser walk of EC12-EC14, EC21, EC22. Test: after (AC7, AC8).
8. Page, container and sidebar entry. Files: `src/app/(app)/resume/page.tsx`, `src/app/(app)/resume/_components/ResumeContainer.tsx`, `src/modules/navigation/navigation.constants.ts`. The page is thin (`requireUser`, Suspense); the container owns the loading, empty, content and error states. Verify: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` (routing change); browser walk of EC1, EC2, EC20. Test: after (AC1, AC2).

**Part B: interview integration (8d)**
9. Interview schemas. Files: `src/modules/interviews/schemas/interviews.schema.ts`, `src/modules/interviews/constants.ts` (default `use_profile: false`), `tests/modules/interviews/schemas/interviews.schema.test.ts`, `tests/helpers/interviews.ts` (fixtures carry the flag). The start schema takes a strict boolean; the session schema reads `use_profile`. Verify: `npx vitest run tests/modules/interviews` + gates. Test: first (seam 4; AC11, AC13, EC15, EC16).
10. Start error mapping. Files: `src/modules/interviews/utils/interview.utils.ts`, `tests/modules/interviews/utils/interview.utils.test.ts`. `getStartErrorResult` returns the backend message under `use_profile` for a 409 `PROFILE_REQUIRED`; other 409s keep going to the question count. Verify: `npx vitest run tests/modules/interviews/utils` + gates. Test: first (seam 3; AC12, EC17).
11. Setup form toggle. Files: `src/modules/interviews/components/setup/InterviewConfigForm.tsx`, `src/app/(app)/interviews/_components/InterviewsContainer.tsx`, `src/modules/interviews/types/interviews.types.ts`. A "Your résumé" section card with the shared checkbox field, the provider notice, a link to `/resume` when missing, the effect that turns the toggle off, and a profile refetch when the start fails with a `use_profile` error. Verify: `npx tsc --noEmit`, `npm run lint`, `npm test` + gates; browser walk of EC2, EC15-EC17. Test: after (AC9, AC10, AC12).
12. Title-bar badge. Files: `src/modules/interviews/components/chat/InterviewTitleBar.tsx`. A small outline badge when `session.use_profile`. Verify: `npx tsc --noEmit`, `npm run lint` + gates; browser check of EC15, EC16, EC18. Test: after (AC13).
13. Final pass. Files: none new. Run every gate, `npm run build`, walk the remaining ECs (EC19 expired session, EC24), check nothing logs or stores profile data (grep for `console.`, storage use), then `graphify update .`. Verify: gate commands. Test: skip (verification only; the related tests in Steps 1-10 must still pass).

## Affected Files & Patterns
- New: `src/modules/profile/**`, `src/shared/forms/FileField.tsx`, `src/app/(app)/resume/**`, `tests/modules/profile/**`.
- Changed: `src/app/api/[...path]/route.ts`, `navigation.constants.ts`, interviews schemas, constants, types, utils, `InterviewConfigForm.tsx`, `InterviewsContainer.tsx`, `InterviewTitleBar.tsx`, `tests/helpers/interviews.ts`.
- Patterns to follow: `getFeedback` (null on a not-found code); `transcribe` (multipart through `apiClient` with its own timeout and forwarder budget); `getFeedbackErrorResult` (error → UI result); `HistoryPage` (thin page, `requireUser`, Suspense); `EndInterviewDialog` (confirm dialog); `useMutationCallbacks` for the 429 toast; `CheckBoxFieldWithDescription` for the toggle.
- Risks: the interviews feature imports the notice constant from the profile module (constants only, never its service or store); the form effect is the one sanctioned server-to-form sync; adding `use_profile` to the strict session schema breaks fixtures that lack it, fixed in Step 9.

## Testing Strategy
- Framework and command: Vitest, `npm test`; one file: `npx vitest run <path>`. Tests live in `tests/`, mirroring `src/`, imported with `@/` and `@tests/`.
- Gate commands (run after every step): `npx tsc --noEmit`, `npm run lint`, `npm test`; plus `npm run build` after Steps 8 and 13; `graphify update .` at the end.
- No component test tooling exists, and none is added (user decision): UI steps are `Test: after`, verified in the running app against the spec's edge cases.
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 8 | after | page, nav, protection |
| AC2 | 3, 8 | first, after | null on 404; empty state shown |
| AC3 | 1, 3, 6 | first, after | schema, multipart `file` part, UI |
| AC4 | 2, 6 | first, after | mapping tested; alert and toast in the app |
| AC5 | 5, 6 | after | busy state, no second upload |
| AC6 | 5, 6, 7 | after | replace without flicker |
| AC7 | 3, 5, 7 | first, after | delete 204; dialog |
| AC8 | 7 | after | plain text, omitted empties |
| AC9 | 1, 6, 11 | after | notice on both screens |
| AC10 | 11 | after | toggle states |
| AC11 | 9 | first | strict boolean, default false |
| AC12 | 10, 11 | first, after | mapping tested; message and link in the app |
| AC13 | 9, 12 | first, after | schema reads the flag; badge |
| AC14 | 1, 4 | first | table row for `profile/resume` |
| AC15 | 3, 13 | first, skip | zod-parsed responses; storage/log check |
| AC16 | 13 | skip | all gates green, `graphify update .` |
| EC1 | 3, 8 | first, after | |
| EC2 | 8, 11 | after | page error; toggle disabled |
| EC3, EC4 | 1, 6 | first, after | name and size pre-check; fake `.pdf` goes to the server |
| EC5-EC10 | 2, 6 | first, after | by status code |
| EC11 | 2, 5 | first, after | unconfirmed result refetches the profile |
| EC12, EC13 | 5, 7 | after | |
| EC14 | 3, 7 | first, after | 204 either way |
| EC15, EC16 | 9, 11, 12 | first, after | |
| EC17 | 10, 11 | first, after | |
| EC18 | 12, 13 | after | interview carries on; badge unchanged |
| EC19 | 13 | after | existing interceptor redirect |
| EC20 | 8 | after | `requireUser` redirect |
| EC21, EC22 | 7 | after | |
| EC23 | 6 | after | guard while pending |
| EC24 | 3 | first | no id in any URL |

- Must verify, not assume: the 404 code is `PROFILE_NOT_FOUND` (read from the backend constants, not seen on the wire); the wording of the 415 message (EC4); the real extraction time against the 30 s forwarder budget; that a multipart upload from the page reaches the backend intact (the forwarder's voice test covers the bytes).
- Open questions: none. Every EC has a stated outcome.
- Known baseline failures: none seen. Run `npm test` before Step 1 to record the baseline.

## Blockers & Resolutions
- Response shapes -> resolved from the backend code: the profile is skills, roles `{title, organization, period, summary}`, projects `{name, description, technologies}` and `updated_at`; the session out-schema carries `use_profile: bool`; `PROFILE_REQUIRED` is a 409 with a message that ends with the next step. Re-check against `/openapi.json` in Step 3 if the backend is running.
- Multipart pass-through -> already covered by the forwarder's voice upload test; only the timeout is new.
- Upload timeout -> forwarder 30 s, client 35 s (the backend caps extraction at about 20 s; the client budget is longer than the forwarder's, as for transcriptions, so the forwarder's 503 arrives first).
- Provider data terms -> outside this repo; the notice copy is reviewed before real users.
- Job import timeouts (default 15 s) -> noted in the spec, not changed here.

## Trade-offs & Rationale
- A separate `/resume` page instead of managing the résumé inside the setup form: one place to upload, view and delete, and the toggle only has to link to it.
- Constants only cross the profile/interviews boundary (the notice text); services, stores and queries stay behind their module.
- Part A ships alone: it needs no interviews change, so a checkpoint after Step 8 lets you review the page first.
- No new dependencies: dialog, alert, checkbox and card already exist in `src/components/ui/`.

## Project Rules Applied
- `CLAUDE.md` layers and Components -> data flow, dumb components, "earn its file" (only `ResumeUploadCard`, `ResumeProfileView` and the shared `FileField` are new component files; the delete dialog stays inside the view, and loading skeletons stay inside the container).
- Forms -> RHF + `zodResolver` + a shared field.
- Security & Auth -> BFF only, nothing stored in the browser, profile text rendered as text.
- Testing -> mirrored `tests/`, `@/` and `@tests/` aliases, real results reported.
- `AGENTS.md` -> read the Next 16 docs for the page, `requireUser` and `proxy.ts` before Step 8.
- Git rules -> no commits, staging or branches.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| lean-ctx | read the services, queries, container, form, forwarder, title bar and tests to find reusable patterns |
| graphify | one query in the earlier orientation: where job import, the BFF and the setup form connect |
| grilling | applied directly through `AskUserQuestion` (skill not invoked): test seams and UI verification |
| ponytail | applied inline (not invoked): no new dependency, no new component beyond three files |
| security-review | applied inline (not invoked): untrusted profile text, nothing stored, generic errors |
| tdd | not read; seams confirmed by the user, red-green order left to `/implement` |

## Ready to Implement
- All spec requirements mapped to steps; every step has files, a verify command and a Test tag.
- Every AC and EC is mapped above (no uncovered IDs); gate commands listed.
- Approaches considered; checkpoint interval set; seams confirmed by the user.
- Blockers resolved or recorded; no deviation from the spec.
