# Implementation Plan: Interview Feedback Screen (frontend)

Implements `spec.md` in this folder (AC1-AC15, EC1-EC30). Frontend only: cuewise-be's `POST` / `GET /api/v1/interviews/{id}/feedback` already exist, so the plan builds against that contract and mocks `apiClient` in service tests.

## Overview
Add a feedback page at `/interviews/[id]/feedback` that reads or generates the backend's scored feedback, a **Get feedback** link on the "Interview complete" card, a History **View** link for completed rows, and the feedback-specific timeouts and recovery that a 3-60 s synchronous request needs.

## Architecture & Design
- **Layers as in the rest of the module**: `interviews.services.ts` (two methods, zod-parsed) -> `interviews.queries.ts` (one query, one mutation) -> a page hook -> dumb components. The route file stays thin; its container in `_components/` is the only place that calls hooks, like `InterviewsContainer`.
- **One pure selector decides the screen.** `getFeedbackView` takes the stored feedback (or "loading" / "none"), the classified error and the poll-expired flag, and returns one of the page's states. Every spec state (EC3-EC20) is a case of it, so the logic is testable in the node Vitest env and the container only switches on `view.kind`.
- **Stored status drives recovery.** The query's `refetchInterval` polls only while the stored status is `generating` (stops by itself on unmount). A no-response POST, a 409 `FEEDBACK_IN_PROGRESS` and a reload during generation all end in the same place: read the stored row and poll. The mutation's recover step mirrors `useAnswerInterviewMutation.recover`.
- **"None yet" is data, not an error.** The GET query turns the backend's `FEEDBACK_NOT_FOUND` into a `null` result (any other 404 stays an error = "Interview not found"), so the page never treats the first visit as a failure and the 404 codes stay separate (spec assumption).
- **Generate-on-arrival flag** (user-confirmed): the card links to the page with a one-shot `start` flag. The page starts generation only if no feedback is stored and the flag is valid, then replaces the URL with the clean one so a refresh or shared link never sends a request. A guard ref keeps React Strict Mode's double effect from sending two POSTs.
- **Timeouts**: constants beside the transcription ones; the forwarder gets one more `SLOW_POSTS` entry (about 70 s) and the service call passes the browser value (about 75 s). Other routes untouched.
- **Layout** (from the ui-ux-pro-max priorities: accessibility, 44 px targets, reserved space, mobile-first, progressive disclosure; shadcn composition rules): one column, `max-w-3xl`, 16 px gutter, `gap-*` stacks only.
  1. **Score hero card**: page `h1`, the overall as a large `font-display` number with a muted "/ 5", the summary (`max-w-prose`), the disclaimer line in muted text of at least 12 px.
  2. **Insight cards**: strengths and improvements side by side from `md`, next steps full width; each a titled `Card` with a plain list and an icon (`data-icon`, no size classes).
  3. **Your answers** (`h2`): one `Accordion` (multiple open allowed, first item open). Trigger: "Question N", category `Badge`, the question text wrapped (never truncated). Open body: criterion rows in a two-column grid from `sm` (label, `n / 5` in tabular numerals, linear `Progress` with an accessible text value), the note, then each evidence as a `figure`: a left-ruled `blockquote` plus a caption with the criterion `Badge` (outline) and the reason.
  4. **Actions**: **Start a new interview** (primary) and **Back to history** (outline), full width on mobile.
  The generating state is a `Skeleton` of the same four blocks (no layout jump), a `Shimmer` status line (static text under reduced motion, as `TypingIndicator` does), the leave hint, and a polite live region. Other states reuse `InterviewMessageCard` (icon, title, text, one action); failures keep `role="alert"`. No verdict colours: only theme tokens, the number is always printed.

## Spec Requirements -> Implementation
- Closing card **Get feedback**, ended card unchanged (AC1, EC29) -> Step 7
- Page route, arrival flag, no second POST on reload (AC2, AC3, EC4-EC7) -> Steps 2, 4, 6
- Result layout, plain-text rendering, accordion, criteria per category (AC4, AC5, EC21-EC25, EC30) -> Steps 1, 5
- Timeouts per request, forwarder test (AC6, EC9) -> Step 3
- Recovery by GET, polling, 90 s stall (AC7, AC8, EC10-EC13) -> Steps 2, 4
- Error and status states, redirects, rate limit (AC9, AC10, AC11, EC1-EC3, EC14-EC20) -> Steps 1, 2, 5, 6
- History View link, abandoned unchanged (AC12, EC28) -> Step 7
- Disabled buttons, id reset, a11y and responsive checks (AC13, AC14, EC8, EC27) -> Steps 4-6, 8
- Tests, checks, docs, graph (AC15) -> Steps 1-3, 8

## Implementation Steps
0. **Preflight (manual, before any copy ships).** Run cuewise-be and confirm: (a) closing the client mid-POST still stores the result, then GET returns it; (b) the "interview not found" 404 and `FEEDBACK_NOT_FOUND` have different `error.code`s; (c) a normal user can POST (no 403); (d) the hosting limit allows about 75 s. If (a) fails, the leave hint in constants is removed (one line). **Install the `design-taste-frontend` skill** (anti-AI-slop UI/UX guidance, user request) before Step 5: look up its source with `npx skills find design-taste-frontend` (the `find-skills` skill), read its `SKILL.md` before trusting it, install it with the user's approval, and confirm it appears in the skills list. Record the results in the Blockers section; run `npm test`, `tsc` and `lint` once for the baseline. Test: skip
1. **Constants, schema, types** (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`). Add `npx shadcn@latest add accordion` first (CLI only, `ui/` not edited). Constants: criterion ids and their labels (mirrors cuewise-be `CRITERION_LABELS`), score bounds 1-5, feedback statuses, the five error codes, the feedback route helper and the `start` flag name, timeouts (forwarder about 70 s, browser about 75 s), poll interval (about 3 s), poll cap (about 90 s), slow message after about 15 s, all state copy and the disclaimer. Schema: strict enums for status, category and criterion; scores are a partial record over the criteria enum (zod 4's enum-keyed record is exhaustive, which would reject a four-criterion question); integers 1-5; `note` nullable; `created_at` as an offset datetime. Types inferred with `z.infer`; add the `FeedbackView` and `FeedbackErrorResult` unions. Test: first (seam: the exported schema)
2. **Pure utils** (`utils/`): `parse-feedback-start-param` (only a single "1" is true); `get-feedback-error-result` (classifies a thrown value into poll / not-finished / not-found / failed / unavailable / rate-limited / unknown, using `parseApiError` and `isNoResponseError`; no-response and 409 in-progress both mean "poll"); `feedback-lost-error` (thrown when a no-response POST is followed by a read that finds nothing stored; classified as failed); `get-feedback-view` (the selector plus the "start on arrival" decision; a `poll` error that still reaches it means the recovery read failed too, so it shows the generic error); `feedback-score` (score to bar percent, overall formatting, a question's criteria in rubric order with labels). Test: first (seams: these exports)
3. **Service, key and forwarder** (`interviews.services.ts`, `interviews.keys.ts`, `app/api/[...path]/route.ts`). `getFeedback` (GET, zod-parse, `FEEDBACK_NOT_FOUND` becomes null) and `generateFeedback` (POST with `timeout: FEEDBACK_TIMEOUT_MS`, zod-parse). Key `feedback(id)` under `detail(id)` as the spec says, plus `generateFeedback(id)` for the mutation. One `SLOW_POSTS` entry for `interviews/<id>/feedback`. Test: first (seams: both service methods with `apiClient` mocked; the forwarder timeout table)
4. **Queries and page hook** (`interviews.queries.ts`, `hooks/use-interview-feedback.ts`). `useFeedbackQuery(id)` with the conditional `refetchInterval`; `useGenerateFeedbackMutation(id)` (success writes the cache; no-response and 409 in-progress run the recover step and refetch instead of throwing; 429 toasts through `useMutationCallbacks`). The hook ties them together: start-on-arrival effect with its guard ref and URL clean-up, the slow timer, the poll-expiry timer, and the derived `view`; it returns plain values and callbacks. Test: after (typecheck, lint, manual run; logic already covered in Step 2)
5. **Presentational components** (`components/`, flat like the existing ones, one per file). **First load `design-taste-frontend` and review the layout in Architecture & Design against it** (hierarchy, spacing, copy, generic-looking patterns to avoid); apply what it changes, keeping the spec's rules (theme tokens, plain numbers with no verdict colours, 44 px targets, 360 px first), and record any change in Skills Consulted. Components (as built, after the design-taste review): `FeedbackScoreHero`, `FeedbackHighlights` (one card: strengths and improvements side by side, next steps under a separator; replaces the planned `FeedbackInsightCard`), `FeedbackList`, `FeedbackQuestionAccordion`, `FeedbackCriterionRow`, `FeedbackEvidenceQuote`, `FeedbackSkeleton` (shared by loading, generating and the `Suspense` fallback), `FeedbackGenerating`, `FeedbackStateMessage` (copy and action per non-result state), `FeedbackResult` (composition plus the two actions). Extract the inline "Interview not found" card from `InterviewsContainer` into `InterviewNotFoundCard` and use it in both places. Test: after (typecheck, lint, build, manual run at 360 px, keyboard, dark mode, screen reader pass)
6. **Route and container** (`app/(app)/interviews/[id]/feedback/page.tsx`, `_components/FeedbackContainer.tsx`). The page awaits `params` and `searchParams` behind `Suspense`, calls `requireUser(...)`, validates the id (malformed -> not-found card, no request), and passes the id and the parsed flag to the client container, which calls the hook and switches on `view.kind`. Moves focus to the heading only after an in-session generating -> generated change and announces it. Test: after (manual: EC1-EC8, EC26, EC27)
7. **Entry points.** `InterviewClosingCard` gains an optional feedback link prop for the `completed` variant only (Get feedback primary, Start a new interview secondary); `ActiveInterview` passes the flagged link. `InterviewHistoryRowActions`: completed rows link to the clean feedback route with the accessible name "View feedback for ..."; in progress and abandoned unchanged. Test: after (manual) and skip for copy
8. **Verify and close.** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` (new dynamic route), a manual run of EC1-EC30 (forcing 502, 503, 429, 409, a slow response and a dropped response with temporarily lowered timeouts or a stubbed backend), update `interview-history/spec.md` where View was a placeholder, `graphify update .`. No commit. Test: skip

## Affected Files & Patterns
- New: `app/(app)/interviews/[id]/feedback/page.tsx` and `_components/FeedbackContainer.tsx`; `src/components/ui/accordion.tsx` (CLI); `modules/interviews/hooks/use-interview-feedback.ts`; the utils and components named in Steps 2 and 5; tests under `tests/modules/interviews/...` mirroring them.
- Changed: `constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `services/interviews.services.ts`, `queries/interviews.{keys,queries}.ts`, `src/app/api/[...path]/route.ts`, `components/InterviewClosingCard.tsx`, `InterviewHistoryRowActions.tsx`, `InterviewsContainer.tsx` (not-found card extraction), `ActiveInterview.tsx`, `tests/helpers/interviews.ts` (a feedback builder), `tests/app/api/[...path]/route.test.ts`, the interview-history docs.
- Patterns to follow: `useAnswerInterviewMutation.recover` and `getAnswerErrorResult` (no-response handling); `getTranscribeErrorResult` (fixed messages, never backend text); `parseSessionParam` (id and flag parsing); `InterviewMessageCard` (state cards); `TypingIndicator` (Shimmer with reduced motion); `focusOnMount`; `InterviewsContainer` / `/history` pages (`Suspense` + `requireUser`); the transcription timeout constants (forwarder shorter than browser).
- Risks:
  - The 70 s request: if the host cuts functions earlier, generation looks like a 503 while the backend finishes; the GET recovery covers it, but check Step 0(d).
  - Strict Mode double effects must not send two POSTs (guard ref, plus the backend's one-row guarantee as the backstop).
  - Keeping the feedback key under `detail(id)` means an interview invalidation also refetches it; harmless (final data, one GET).
  - A new rubric criterion on the backend fails validation by design; the constants must be updated together (comment points at the backend file).
  - `refetchInterval` must stop on `generated`/`failed`/null, or an idle tab polls forever.

## Testing Strategy
- Framework & command: Vitest (`node` env, no DOM), `npm test` or `npx vitest run tests/modules/interviews`; then `npx tsc --noEmit`, `npm run lint`, `npm run build`. Tests live in root `tests/` mirroring `src/`; imports via `@/` and `@tests/`.
- Seams for `Test: first` steps (user-confirmed): the feedback schema; `getFeedbackView` (+ start-on-arrival decision); `getFeedbackErrorResult`; `parseFeedbackStartParam`; the score helpers; `interviewsService.getFeedback` / `generateFeedback` with `apiClient` mocked; the forwarder's timeout table. Components and hooks have no test seam (no DOM environment, no new dependency); they are verified by typecheck, lint, build and the manual run.
- Slices, one behavior each:
  - Schema (Step 1): (1) generated with scores parses; (2) `enough_evidence` false with no questions parses; (3) `generating` and `failed` rows with null overall and empty lists parse; (4) unknown criterion rejected; (5) score 0, 6, 3.5 rejected; (6) unknown category or status rejected; (7) a four-criterion question is accepted (partial record).
  - Utils (Step 2): flag "1" true, absent / "0" / "true" / repeated false; error kinds: 409 in-progress and no-response -> poll, 409 not completed, 404 interview -> not-found, 502, 503, 429, 403 -> unknown; view: loading, none + not asked -> none-yet, none + asked -> generating, stored `generating` -> generating, poll expired -> stalled, generated + evidence -> generated, generated + not enough -> insufficient, `failed` -> failed, each error kind passes through; start-on-arrival only when none stored and flag set; score to percent for 1-5.
  - Service and forwarder (Step 3): GET parses and returns null on `FEEDBACK_NOT_FOUND` but throws on another 404; POST passes the 75 s timeout and parses; an invalid body throws; the feedback POST gets the 70 s timeout, the answer POST keeps its value, and a feedback GET keeps 15 s.

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1, EC29 | 7 | after | manual: card variants |
| AC2, EC4-EC7 | 2, 4, 6 | first / after | view + arrival slices; manual: reload after arrival sends no POST |
| AC3 | 2, 6 | first / after | flag parsing slices; manual |
| AC4, EC25 | 1, 5 | first / after | schema slices; manual: markup text stays literal |
| AC5, EC21-EC24 | 1, 5 | first / after | partial-record slice; manual: mixed and 10-question interview |
| AC6, EC9 | 3 | first | forwarder table slices; manual: 30 s response (stub) |
| AC7, EC10-EC12 | 2, 4 | first / after | error and view slices; manual: dropped POST, in-progress 409 |
| AC8, EC13 | 2, 4, 5 | first / after | stalled-view slice; manual: slow and stalled copy |
| AC9, EC1-EC3, EC14-EC18 | 2, 5, 6 | first / after | error-kind slices; manual: each status forced |
| AC10, EC19 | 1, 2, 5 | first / after | insufficient slice |
| AC11, EC20 | 1, 6 | first / after | schema rejection slices; manual: nothing logged |
| AC12, EC28 | 7 | after | manual: three row types |
| AC13, EC8, EC27 | 4, 6 | after | manual: double click; switching interviews |
| AC14, EC30 | 5, 6, 8 | after | manual: 360 px, keyboard, announcements |
| AC15 | 1-3, 8 | first / skip | commands above |
| EC26 | 0, 4 | after | depends on Step 0(a) |

- Must verify, not assume: backend keeps going after a disconnect; the two 404 codes differ; the user role holds the permission; hosting allows about 75 s; zod 4 partial record accepts four-key score objects; the `refetchInterval` function form stops when data is generated; `searchParams` access stays behind `Suspense` under `cacheComponents`; the nav item "AI Mock Interview" stays active on the nested route.
- Open questions: none (every EC has a stated outcome).
- Known baseline failures: none seen on 2026-11-06 (448 tests in 33 files pass; `tsc` and `lint` clean); Step 0 re-records it.

## Blockers & Resolutions
- `design-taste-frontend` is not installed and its source is unknown -> Step 0 finds it with `find-skills` (`npx skills find design-taste-frontend`), reads its `SKILL.md` first (third-party instructions are treated as data until reviewed), and installs only with the user's approval; if no match is found, Step 5 falls back to `ui-ux-pro-max` and `shadcn` and says so.
- Backend disconnect behavior unverified -> Step 0(a); the leave hint is one constant and is dropped if the check fails (user decision: verify first, gate the line).
- Distinguishing "no feedback yet" from "interview not found" -> by `error.code`, checked in Step 0(b); if the codes match, fall back to reading the interview first (the only deviation path, flagged then).
- Hosting limit -> Step 0(d), before release.
- Strict Mode double effect -> guard ref plus the backend's one-row-per-interview rule.
- Closing-card flag could re-trigger on reload -> removed from the URL on arrival; a malformed or repeated flag is ignored (user decision: one-shot flag).
- Early-ended interviews -> not offered feedback (user decision, EC29).
- `Retry-After` not forwarded -> accepted; generic toast.

## Trade-offs & Rationale
- Pure selector instead of state in the container -> the six-plus states and every error case are testable without a DOM; the container stays a switch.
- Poll the stored row with `refetchInterval` instead of a hand-written timer loop -> built into TanStack Query and stops on unmount.
- Flat `components/` files, not a feedback subfolder -> matches the 22 existing files; names carry the `Feedback` prefix.
- Reuse `InterviewMessageCard` for non-result states and skip the shadcn `Empty` and `Spinner` -> the buttons are replaced by the generating state when clicked, so no pending-button spinner is needed (YAGNI). Only the accordion is added.
- Accordion in multiple mode with the first item open -> users compare criteria across questions; a single-open accordion would force closing one to read another.
- No test of components (no new dependency) -> logic lives in tested pure functions; visual behavior is checked by hand and by build.
- Feedback key under `detail(id)` -> follows the spec and the messages key; sibling key rejected only because it deviates from the spec for no real gain.

## Project Rules Applied
- `CLAUDE.md` layers -> service (only HTTP, `apiClient`, zod), query hooks (keys, cache, toasts via `useMutationCallbacks`), dumb components, no inline keys, logic in utils and one hook.
- `CLAUDE.md` Next 16 -> async `params` / `searchParams` behind `Suspense`, `requireUser`, thin route file, docs in `node_modules/next/dist/docs/` read before Step 6.
- `CLAUDE.md` shadcn -> accordion through the CLI, `components/ui` not edited, wrappers and `className` for layout only.
- `CLAUDE.md` security -> AI text rendered as plain text, id and flag validated with zod, no feedback text in logs, same-origin `/api` only.
- `CLAUDE.md` testing -> tests in root `tests/` mirroring `src/`, helpers in `tests/helpers/`, `@/` and `@tests/` imports.
- `CLAUDE.md` workflow -> typecheck, lint, tests, build, `graphify update .`, no commit, push or staging.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | interview completion, history row action, answer recovery and BFF forwarder nodes (spec phase); reused here |
| lean-ctx / file reads | closing card, `ActiveInterview`, `InterviewsContainer`, row actions, service, queries, keys, constants, schema, forwarder, `api.helper`, `proxy.ts`, `Shimmer`, `parseSessionParam`, test layout |
| ui-ux-pro-max | priority rules applied to the layout (accessibility, 44 px targets, reserved space, mobile-first, progressive disclosure); its targeted searches returned only generic guidance, so nothing page-specific was taken from them |
| shadcn | installed vs missing primitives (accordion, empty, spinner missing; alert, badge, card, progress, separator, skeleton installed), dry run of the add, composition rules (full Card, Badge, Skeleton, no `space-y`) |
| ponytail | applied inline: only the accordion added, no component tests or new dependency, no custom poll loop |
| grill-me | decisions confirmed with the user: five test seams, one-shot arrival flag, verify-then-gate the leave hint |
| design-taste-frontend | requested by the user (anti-AI-slop UI/UX); not installed yet, so the plan installs it in Step 0 and applies it to the layout in Step 5. Its source is not yet known, so it is looked up with `find-skills` and its `SKILL.md` is read before use |
| security-review | not run: no new auth surface; the untrusted-text and validated-input rules are in Project Rules Applied |

## Ready to Implement
- All spec requirements (AC1-AC15, EC1-EC30) mapped to steps in Spec Requirements and Testing Strategy
- Every step has a Test tag; test seams user-confirmed
- Affected files identified; blockers have resolutions or an early manual check (Step 0)
- No deviations from the spec
