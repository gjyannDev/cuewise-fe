# Implementation Plan: Interviews Answer Flow

## Overview
Wire `POST /interviews/{id}/messages` into the interview screen so a user can answer each question, see the interviewer's reaction in an inline card, and finish on a simple completed panel.

## Architecture & Design
Follows service -> query -> component. A new `answer` service method calls the existing BFF forwarder (no new Route Handler) and parses the response with zod. A mutation hook writes `{ session, current_question }` into the existing `interviewKeys.detail(id)` cache entry on success, and invalidates it on a "resync" error (409 either code, or 404) so the screen shows whatever the backend says is current.

The reaction is not server state the app re-reads, so it is **client-only UI state** held by one small hook (`use-answer-turn`): `{ sessionId, reaction, answeredQuestion, dismissed }`. While a reaction is held and not dismissed, the container renders the answered question plus a `ReactionCard` (even though the cache already holds the next question). Pressing **Next question** / **Finish** sets `dismissed`; the next question (or the completed panel) then renders from the cache. The held reaction is kept after dismissal so the completed panel can show the closing line; a reload loses it and the panel falls back to a generic line. Which screen to show is derived, not stored (pure `getInterviewStep`). No zustand: the data is one value that dies with the page.

Presentational components only receive props. `AnswerForm` follows the `InterviewConfigForm` pattern: `onSubmit` resolves to an optional field error message that the form applies with `setError`.

## Spec Requirements -> Implementation
- `completed` status, nullable `current_question`, answer request/response schemas, reaction type (AC7, EC16) -> Step 1
- Answer error classification: 409 -> resync, 404 -> resync, 422 -> `answer` field, rest -> toast (AC9, AC10, EC5-EC8) -> Step 2
- Derive question vs completed screen (AC5, AC6, EC4) -> Step 2
- `answer` service, `answer` key, mutation with cache write and resync invalidation (AC2, AC3, AC9, EC1, EC2) -> Step 3
- Turn state, submit/advance, toasts (AC3, AC4, AC8-AC10, EC1-EC3, EC11, EC17) -> Step 4
- `AnswerForm` enabled and pending state, `ReactionCard`, completed panel, focus and live region, dialog and ended-screen copy (AC1, AC4, AC5, AC8, AC11-AC13, EC13-EC15) -> Step 5
- Container precedence and `Start a new interview` (AC4-AC6, AC11, EC9, EC15) -> Step 6
- Typecheck, lint, tests, build, manual walkthrough (AC14) -> Step 7

## Implementation Steps
1. **Contract in `modules/interviews/`** (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`).
   - Add `completed` to `SESSION_STATUSES`; make `interviewSchema.current_question` nullable (GET returns null once completed).
   - Add `reactionSchema` (id UUID, text), `answerRequestSchema` (question_id UUID, answer trimmed 1-2000, reusing `ANSWER_MAX_LENGTH`) and `answerResponseSchema` (session, reaction, nullable current_question). The session shape is shared with `interviewSchema`, extracted once rather than duplicated.
   - Types by `z.infer`: `Reaction`, `AnswerRequest`, `AnswerResponse`; `InterviewQuestion` becomes the non-null question type.
   - Constants for the copy this feature needs: `COMPLETED_FALLBACK_TEXT` and `RESYNC_ERROR_CODES` (`QUESTION_NOT_CURRENT`, `SESSION_NOT_IN_PROGRESS`), with the usual "mirrors cuewise-be" comment.
   - Test: first. Seam: `safeParse` on the exported schemas. Slices: `completed` status parses; null `current_question` parses; answer request rejects empty/whitespace and 2001 chars, accepts 2000, rejects a non-UUID `question_id`; response parses a mid-interview payload and a final one (null question, completed); response rejects a missing reaction. (AC7, EC10, EC16)

2. **Pure utils** (`utils/get-answer-error-result.ts`, `utils/get-interview-step.ts`).
   - `getAnswerErrorResult(error)` via `parseApiError` returns one of: resync (status 409 with a code in `RESYNC_ERROR_CODES`, or status 404), field (422 with a message for `answer`), or toast (everything else, including other 409s, network errors, 5xx and a zod parse failure).
   - `getInterviewStep(interview)` returns a discriminated union: `completed` when status is `completed` or `current_question` is null, otherwise `question` carrying the question.
   - Test: first. Seams: the two exported functions (axios errors from `tests/helpers/axios.ts`). Slices: 409 `QUESTION_NOT_CURRENT` and `SESSION_NOT_IN_PROGRESS` -> resync; 404 -> resync; 422 with `answer` detail -> field message; 422 without an `answer` detail -> toast; 500, network error and plain `Error` -> toast; in-progress with a question -> `question`; completed with null question -> `completed`; null question with a stale `in_progress` status -> `completed`. (AC6, AC9, AC10, EC4-EC8, EC16)

3. **Service, key, mutation** (`services/interviews.services.ts`, `queries/interviews.keys.ts`, `queries/interviews.queries.ts`).
   - `interviewsService.answer(sessionId, request)` POSTs `/interviews/{id}/messages` (id URL-encoded like `get`) and parses with `answerResponseSchema`.
   - Key `interviewKeys.answer(id)`. `useAnswerInterviewMutation(sessionId)`: on success `setQueryData(detail(id), { session, current_question })`; on error, when `getAnswerErrorResult` says resync, `invalidateQueries(detail(id))`. Cache work stays in the queries layer; toasts and field errors do not.
   - Test: first for the service only. Seam: `interviewsService.answer` with `API` mocked as in the existing service test. Slices: posts exactly `{ question_id, answer }` to the right path and returns parsed data; a malformed response rejects. Keys and hook: skip (wiring). (AC2, AC3, EC16)

4. **`hooks/use-answer-turn.ts`** (stateful logic out of the container).
   - Owns the turn state described above, resets when the session id changes (compared like the existing ended-session flag). `submit(question, answer)` calls the mutation and returns the `answer` field message (or nothing). It stores the turn on success, shows the resync toast or a generic toast through `useMutationCallbacks` using `getAnswerErrorResult`, and never clears the typed text. `advance()` sets `dismissed`. Exposes `turn`, `isPending`, `submit`, `advance`.
   - Test: after (manual: AC3, AC4, AC8-AC10, EC1-EC3, EC11, EC17). The decisions inside are already covered by Step 2 tests.

5. **Presentational components** (`modules/interviews/components/`).
   - `AnswerForm`: props `onSubmit(answer)` resolving to an optional field message, and `isPending`. Next enabled; fieldset disabled while pending; button shows `Loader2Icon` (same `motion-reduce` handling as `InterviewConfigForm`) and "Sending…". The "coming soon" hint is removed.
   - `ReactionCard` (new): label "Interviewer", the reaction as plain text in a polite live region, and one primary button (**Next question** or **Finish** from an `isFinal` prop), auto-focused when it mounts so focus is not lost when the submit button is replaced.
   - `QuestionCard`: optional prop to focus its heading on mount (ref callback, no effect), set only after advancing so page load does not steal focus.
   - `InterviewSession`: takes the question, an optional reaction, `isPending`, `onSubmit`, `onContinue`, `onEnd`. Shows `AnswerForm` or `ReactionCard` in the same slot; End interview only while answering.
   - `InterviewCompletedPanel` (new, built like `InterviewEndedPanel`): "Interview complete" with a Completed badge, the closing reaction or `COMPLETED_FALLBACK_TEXT`, the details card without End interview, and **Start a new interview**; heading focused on mount.
   - `EndInterviewDialog`: copy per spec (answers kept; no "won't be saved"). `InterviewEndedPanel`: drop the "Abandoned" badge and the "ended before the last question" claim; title "Interview ended", line "Your answers so far are saved." Early-feedback placeholder unchanged.
   - Test: after for the interactive components (manual: AC1, AC4, AC5, AC8, AC12, AC13); skip for the two copy edits (AC11 checked manually).

6. **Container** (`src/app/(app)/interviews/_components/InterviewsContainer.tsx`). Keep all existing branches (setup, invalid, skeleton, error, not found, client-only ended). Then, for a loaded interview: a held, not-dismissed turn -> session view with the reaction; otherwise `getInterviewStep` -> completed panel or session view. Wire `use-answer-turn`, pass `onSubmit`, `onContinue`, `onEnd`; **Start a new interview** pushes the setup route. The client-only ended flag keeps its precedence and still sends nothing. — Test: after (manual: AC4-AC6, AC11, EC9, EC15).

7. **Verify and finish.** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`. Manually walk the checklist against the local backend (including a 2-tab 409, a reload on the reaction card and on a completed interview), in light and dark themes at 360px. Update the stale comments in `AnswerForm`, `InterviewEndedPanel` and the container. Then `graphify update .`. Do not commit. — Test: n/a.

## Layout & UX Design
- Left column, top to bottom: `QuestionCard` (answered question stays visible during the reaction), then either the answer card or the `ReactionCard`. Same slot and similar height to avoid a layout jump; right column: sticky details card, End interview only while answering.
- Reaction card: muted "Interviewer" label with an icon, the reaction text at body size, button right-aligned on `sm+` and full width below. One primary action per view.
- Completed panel: same two-column frame as the ended panel, with a check icon and Completed badge instead of Abandoned. Theme tokens and existing primitives only; transitions limited to color; `prefers-reduced-motion` honored.

## Affected Files & Patterns
- Edit: `constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `services/interviews.services.ts`, `queries/interviews.keys.ts`, `queries/interviews.queries.ts`, `AnswerForm.tsx`, `QuestionCard.tsx`, `InterviewSession.tsx`, `EndInterviewDialog.tsx`, `InterviewEndedPanel.tsx`, `InterviewsContainer.tsx`.
- New: `utils/get-answer-error-result.ts`, `utils/get-interview-step.ts`, `hooks/use-answer-turn.ts`, `components/ReactionCard.tsx`, `components/InterviewCompletedPanel.tsx`; tests mirroring `src/` under `tests/modules/interviews/`.
- Patterns to follow: `get-start-error-result` (error mapping), `InterviewConfigForm` (`onSubmit` resolving to field errors, pending spinner), `AuthFormContainer` / `useMutationCallbacks` (toasts), `InterviewEndedPanel` (panel layout), `useStartInterviewMutation` (cache seeding).
- Risks: `InterviewQuestion` becoming non-null changes `QuestionCard`/`InterviewSession` types; fix at the type, not with assertions. A client-ended session still has backend status `in_progress` (EC13).

## Testing Strategy
- Framework & command: Vitest; `npm test` (single file: `npm test -- tests/modules/interviews/utils/get-answer-error-result.test.ts`). Typecheck `npx tsc --noEmit`, lint `npm run lint`, build `npm run build`.
- Seams (user-confirmed): zod schemas via `safeParse`; `getAnswerErrorResult`; `getInterviewStep`; `interviewsService.answer` with `API` mocked. Hooks and components are verified manually, as in the setup UI (no component test tooling installed).

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 5 | after | Next enabled, hint removed |
| AC2 | 3 | first | exact body to `/interviews/{id}/messages` |
| AC3 | 3, 4 | first / after | cache write is wiring; no extra GET checked manually |
| AC4 | 4, 5, 6 | after | Next question + focus |
| AC5 | 5, 6 | after | Finish -> completed panel |
| AC6 | 2, 6 | first / after | `getInterviewStep` + manual reload |
| AC7 | 1 | first | |
| AC8 | 4, 5 | after | pending state, single request |
| AC9 | 2, 3, 4 | first / after | classifier + manual 2-tab check |
| AC10 | 2, 4 | first / after | 422 vs generic toast, text kept |
| AC11 | 5 | skip / after | dialog copy; manual |
| AC12 | 5 | after | live region, focus, targets |
| AC13 | 5, 7 | after | 360px, dark theme |
| AC14 | 1-3, 7 | first | tests plus typecheck/lint/build |
| EC1, EC2 | 3, 4, 5 | after | mid and final answer |
| EC3 | 6 | after | manual reload on reaction card |
| EC4 | 2, 6 | first / after | |
| EC5, EC8, EC12 | 2, 3 | first | resync mapping; manual 2-tab |
| EC6, EC7 | 2, 4 | first / after | |
| EC9 | n/a | n/a | existing BFF handling, untouched |
| EC10 | 1 | first | client validation (existing schema + request schema) |
| EC11, EC17 | 4, 5 | after | disabled while pending |
| EC13, EC14 | 5, 6 | after | |
| EC15 | 6 | after | |
| EC16 | 1, 2 | first | malformed response rejected, classified as toast |

- Must verify, not assume: backend returns `status: "completed"` in the answer response after the last answer (user confirmed in the database; also confirm in the browser); that the `useMutationCallbacks` toast shows the resync message wording from the spec (title versus the backend's message as description); that a 404 on submit really lands on "Interview not found" after the invalidated GET.
- Open questions: none.
- Known baseline failures: none seen.

## Blockers & Resolutions
- Last-answer status -> confirmed `completed` by the user from the database; still re-checked in Step 7.
- Ended-screen wording (spec assumption) -> decided: "Interview ended", no Abandoned badge, since the backend status is unchanged.
- 409 text discard -> the form is keyed by question id, so the text clears when the question changes; if a 409 leaves the same question current, the text is kept (more forgiving than the spec's blanket "discarded").
- Reaction vs. already-advanced cache -> the held turn overrides the cache view until dismissed.

## Trade-offs & Rationale
- Write the cache immediately and hold the reaction separately, instead of delaying the cache write until Next: a refetch, reload or 409 resync then always agrees with the backend, and nothing has to be replayed.
- Plain `useState` inside one hook rather than zustand or the query cache: the reaction is a one-off, per-page value that is not server state worth re-reading.
- Not fetching the transcript: simpler, matches the agreed pick; cost is the generic completion line on revisit.
- No `useEffect` for focus: ref-callback focus on mount and `autoFocus` on the reaction button.

## Project Rules Applied
- `cuewise-fe/CLAUDE.md` -> service -> query -> component layering; dumb components; stateful logic in a `use-*.ts` hook; pure logic in `utils/`; zod-validated responses; toasts through `useMutationCallbacks`; no raw errors; tests under `tests/` mirroring `src/`; `graphify update .` at the end; no commits.
- `AGENTS.md` -> no routing changes planned, so no Next docs lookup is needed; if the container needs a routing change, read `node_modules/next/dist/docs/` first.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | mapped `AnswerForm`, `InterviewsContainer`, `EndInterviewDialog`, `useMutationCallbacks` and their links |
| lean-ctx | read the interviews module, backend route/schema/controller (contract, error codes) and existing tests/helpers |
| ui-ux-pro-max | reaction/completed layout, focus and live-region choices, reusing setup-UI patterns |
| grill-me | confirmed the four test seams; settled copy, 409 and reload behavior from the spec round |
| security-review | no new auth surface; answer text goes only to the existing BFF route, plain-text rendering, nothing stored client-side |

## Ready to Implement
- All spec requirements mapped to steps; every step has a Test tag; every AC and EC is in the coverage map.
- Affected files identified; blockers resolved; trade-offs documented.
- Deviation from spec: a 409 that leaves the same question current keeps the typed text (spec said it is always discarded); the ended screen wording is now decided rather than assumed.

## Implementation Notes (deviations found while building)
- Step 6: the loaded-interview branch lives in a new route-private `_components/ActiveInterview.tsx`, rendered by `InterviewsContainer` with `key={sessionId}`. The key resets the held reaction per interview, so `use-answer-turn` needs no "reset when the session id changes" logic.
- Step 2: `getInterviewStep` decides on `current_question === null` alone. cuewise-be drops the question exactly when the session completes (verified end to end), so the extra status check was redundant.
- Step 3: `interviewsService.answer` also parses the request with `answerRequestSchema`, which guarantees exactly `question_id` + trimmed `answer` on the wire.
- Step 5: a tiny `utils/focus-on-mount.ts` ref callback provides focus on mount without an effect (stable identity, so it only runs on mount).
- Toast shape (was "must verify"): the resync toast's title is the spec wording and its description is the backend's message, via `useMutationCallbacks`.
