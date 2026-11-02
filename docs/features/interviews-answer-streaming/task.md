# Implementation: Interview Answer Streaming (client support for the backend's SSE turn)

## Status
Code complete; every automated gate is green. The manual end-to-end run (Step 14, AC23) is still open: it needs cuewise-be running with its `.env` migrated.

## Completed Steps
- [x] 1. Event contract: `TURN_PHASES`, `answerStreamEventSchemas`, the `AnswerStreamEvent` type, `parseAnswerStreamEvent`
- [x] 2. SSE parser (`src/lib/api/sse.ts`)
- [x] 3. Shared fetch error types (`ApiResponseError`, `NoResponseError` in `api.helper.ts`)
- [x] 4. Shared session redirect (`src/lib/config/session-redirect.ts`); the axios interceptor uses it
- [x] 5. Forwarder streaming branch (`STREAMING_POSTS`, stream headers, the browser disconnect passed upstream)
- [x] 6. `interviewsService.answerStream`; `answer()` deleted and its tests ported
- [x] 7. Outcome mapping for `AnswerStreamError`
- [x] 8. Live-turn reducer and `inferStreamingQuestion`
- [x] 9. Thread view: position keys and transient streamed lines
- [x] 10. Mutation: stream consumption, cancel on unmount, 45 s budget, `cancelled` outcome
- [x] 11. Chat hook: `useReducer`, fake timers removed
- [x] 12. Components: `aria-busy`; `isRevealing` removed
- [x] 13. Removals (`MIN_THINKING_MS`, `REVEAL_DELAY_MS`, the hidden-line options, `answer()`); a search found no references left
- [ ] 14. Gates done (typecheck, lint, tests, build, `graphify update .`); the manual end-to-end run is pending

## Changes Made
- Not committed (the user commits manually). Suggested commits:
  1. `feat(api): stream SSE answer turns through the /api forwarder and share fetch errors and the session redirect`
  2. `feat(interviews): show the interviewer's turn as it streams (reaction, typing question) and drop the fake reveal timers`

## Test Results
- Baseline: 264 passed; typecheck and lint clean.
- Final: **325 passed**; `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` succeeded.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | six events parse; extra fields ignored; unknown name; bad data; `done` without `reaction` | spec | AC5, EC9, EC10 | pass |
| T2 | 2 | LF/CRLF/CR; every byte cut incl. UTF-8; comments; multi-line data; unterminated frame; early cancel | spec | AC6, EC15, EC16 | pass |
| T3 | 3 | `ApiResponseError` / `NoResponseError` read by `parseApiError` / `isNoResponseError` | spec | AC8 | pass |
| T4 | 4 | session-ending 401 redirects with `next` + `expired=1`; other cases do nothing | spec | AC9, EC1 | pass |
| T5 | 5 | first chunk readable while upstream open; Accept/budget/headers; abort upstream; buffered errors; cookie clear; 503; JSON route unchanged | spec | AC1-AC4, EC1-EC4, EC17 | pass |
| T6 | 6 | body rules; order and stop at `done`; follow-up `done`; unknown skipped; bad `done`; 409/422/401/no response/abort | spec | AC7, AC8, EC1-EC4, EC9, EC10, EC17 | pass |
| T7 | 7 | error event resync/toast; interrupted → unknown; fetch errors map like axios | spec | EC2-EC6, EC10, EC20 | pass |
| T8 | 8 | move-on, follow-up, fallback, completing, reset, whole `done`, error, terminal | spec | AC10, AC11, EC5, EC11-EC14, EC23 | pass |
| T9 | 9 | position keys stable on refetch; transient reaction and question; follow-up caption; progress and open question ignore transients; saved turn replaces under same keys | spec | AC12, AC15, EC12, EC14, EC22 | pass |

## Open Questions
- None in the code. AC13, AC14, AC16-AC18, AC20, AC21 and AC23 (hook and component wiring, gzip under `next start`, screen reader, scroll, backend `cancelled=true` log) are verified by hand only, and that run is pending.

## Baseline Failures
- None.

## Known Issues
- Manual end-to-end (AC23) is not run yet. To run it:
  - migrate cuewise-be's `.env` (`LLM_PROVIDERS=google` plus `LLM_GOOGLE_*`) and start the backend;
  - run `npm run dev`, then `npm run build && npm run start`;
  - check: a move-on turn, a follow-up turn, the last question, a mid-turn reload (backend log `cancelled=true`), events spread out under `next start`, a screen reader, and scrolling up mid-turn.
- `AbortSignal.any` needs an evergreen browser.

## Deviations from Plan
- **Step 3:** `tests/lib/config/api.helper.test.ts` already existed, so the new cases were added to it rather than in a new file.
- **Step 9:** the transient question uses a placeholder id `<answered question id>-next` (keys come from position, so it never shows).
- **Step 10:** besides the unmount abort being caught as an error, a `done` that races the unmount is also returned as `cancelled` (EC24).
- None change the plan's design.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | lean-ctx | reads and test, lint and build runs (its edit tools are rooted at cuewise-be, so FE edits used the native tools) |
| 14 | graphify | `graphify update .` |
| — | find-skills | not run: the plan needs no new capability or dependency |

## Links
- Spec: docs/features/interviews-answer-streaming/spec.md
- Plan: docs/features/interviews-answer-streaming/plan.md

---

## Validation Checklist (before PR)
- [ ] All plan.md steps complete (the Step 14 manual run is pending)
- [x] Full test suite and build green
- [x] Every spec AC met by code; unit-testable ones covered, the rest listed for the manual run
- [x] Open questions surfaced
- [x] No skipped, deleted or loosened tests (the old `answer()` tests were ported to `answerStream`)
- [x] task.md updated
- [x] Commits documented (suggested only)
- [ ] No open blockers (the manual run needs the backend `.env` migration)
- [x] Code follows CLAUDE.md
- [x] No unresolved plan deviations
