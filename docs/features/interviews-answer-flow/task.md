# Implementation: Interviews Answer Flow

## Status
Ready for PR (manual UI walkthrough pending: see Tests Pending)

## Completed Steps
- [x] 1. Contract: `completed` status, nullable `current_question`, answer request/response schemas, types, copy constants (tests first)
- [x] 2. Pure utils: `getAnswerErrorResult`, `getInterviewStep` (tests first)
- [x] 3. Service `answer`, key `answer(id)`, `useAnswerInterviewMutation` with cache write and resync invalidation (service tests first)
- [x] 4. `hooks/use-answer-turn.ts`: held reaction, submit, advance, toasts
- [x] 5. Components: `AnswerForm` enabled with pending state, new `ReactionCard`, new `InterviewCompletedPanel`, `QuestionCard` focus, `InterviewSession` reaction slot, End dialog and ended-panel copy
- [x] 6. Wiring: new route-private `ActiveInterview` (keyed by session id) rendered by `InterviewsContainer`
- [x] 7. Typecheck, lint, tests, build, end-to-end API check through the BFF, `graphify update .`

## Changes Made
Not committed (user commits manually). Suggested message:

    feat(interviews): submit answers, show the interviewer's reaction, and finish on a completed screen

    - POST /interviews/{id}/messages via the BFF: service, zod request/response schemas, mutation that
      writes the next question into the cache and refetches on 409/404
    - reaction card between questions (Next question / Finish), completed panel with the closing line
    - schemas accept a completed session with no current question
    - 422 shown under the answer, other failures as toasts; typed text kept on failure
    - End interview dialog and ended screen no longer claim progress is lost or abandoned

## Test Results
- `npm test`: 19 files, 209 tests passing (baseline 185; 24 new).
- `npx tsc --noEmit`: clean. `npm run lint`: clean.
- `NODE_ENV=production npm run build`: green.
- End to end through the BFF (localhost:3000 -> local cuewise-be, scratch script, 1-question interview): 13/13 pass. Register 201, start 201, blank answer 422 on `body.answer`, extra key 422, wrong question 409 `QUESTION_NOT_CURRENT`, final answer 201 with `status: completed`, `current_question: null` and a closing reaction, answer after completion 409 `SESSION_NOT_IN_PROGRESS`, GET completed returns `completed` + null question, unknown interview 404.

## Tests Pending
- Manual UI walkthrough in the browser (no component-test tooling, by decision): AC1, AC4, AC5, AC8, AC11, AC12, AC13; EC1-EC3, EC11-EC15, EC17. Include: a 2+ question interview (Next question flow and focus), reload on the reaction card, a 2-tab 409, light and dark theme at 360px, screen reader announcement of the reaction.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | completed interview with null question parses | spec | AC7, AC6 | pass |
| T2 | 1 | answer request: exact body, trimmed, extra keys stripped | spec | AC2 | pass |
| T3 | 1 | answer request rejects empty, whitespace, 2001 chars | spec | EC10 | pass |
| T4 | 1 | answer request accepts 2000 chars, rejects non-UUID question id | spec | EC10 | pass |
| T5 | 1 | answer response: mid-interview payload parses | spec | AC3, EC1 | pass |
| T6 | 1 | answer response: final payload (completed, null question) parses | spec | EC2 | pass |
| T7 | 1 | answer response without a reaction rejected | spec | EC16 | pass |
| T8 | 2 | 409 QUESTION_NOT_CURRENT / SESSION_NOT_IN_PROGRESS -> resync | spec | AC9, EC5, EC12 | pass |
| T9 | 2 | 404 -> resync | spec | EC8 | pass |
| T10 | 2 | 422 on answer -> field message | spec | AC10, EC6 | pass |
| T11 | 2 | 422 elsewhere, other 409, 500, network, zod error -> toast | spec | AC10, EC7, EC16 | pass |
| T12 | 2 | step: question while in progress; completed with null question | spec | AC6, EC4 | pass |
| T13 | 2 | step: null question with stale in_progress status -> completed | inferred | risk: status/question disagree | pass |
| T14 | 3 | service posts exact body to /interviews/{id}/messages, returns parsed turn | spec | AC2 | pass |
| T15 | 3 | service rejects a turn without a reaction | spec | EC16 | pass |
| T16 | 3 | service trims answer and strips extra keys before sending | code-derived | answerRequestSchema.parse in service | pass |

## Open Questions
- None.

## Baseline Failures
- None (185/185 passing before the change).

## Known Issues
- End interview remains client-only (no backend endpoint); a reload shows the interview again (EC13, by design).
- The reaction card is shorter than the answer card, so the left column shrinks when it appears (user-triggered; no unexpected shift).

## Deviations from Plan
- Finding: resetting the held reaction per session is simpler with a React `key` -> plan.md updated: route-private `ActiveInterview` container keyed by session id (Implementation Notes) -> Approved by: within plan intent, recorded.
- Finding: `current_question === null` alone marks completion (verified end to end) -> plan.md updated -> recorded.
- Finding: the service can guarantee the wire body with `answerRequestSchema` -> plan.md updated -> recorded.
- Finding: focus on mount needs a stable ref callback -> `utils/focus-on-mount.ts` added -> recorded.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| - | find-skills | searched skills.sh for TanStack Query / React skills; installing `vercel-labs/agent-skills@vercel-react-best-practices` was blocked by the permission classifier; community TanStack skills not installed (unvetted authors) |
| 1-3 | tdd / test | red -> green per slice at the confirmed seams; code-derived case T16 |
| all | lean-ctx, graphify | file reads and searches; `graphify update .` at the end |
| 5 | ui-ux-pro-max (plan findings reused) | reaction/completed layout, focus and live-region choices |

## Links
- Spec: docs/features/interviews-answer-flow/spec.md
- Plan: docs/features/interviews-answer-flow/plan.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite + build green (not just per-step tests)
- [x] Every spec.md acceptance criterion met by actual code; logic ACs covered by passing tests, UI ACs listed for the manual walkthrough
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately
- [x] task.md fully updated
- [ ] Commits documented (user commits manually; message suggested above)
- [x] No open blockers
- [x] Code follows project rules (cuewise-fe/CLAUDE.md)
- [x] No unresolved plan deviations
