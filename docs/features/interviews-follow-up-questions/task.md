# Implementation: Interview Follow-up Questions (client support)

## Status
Steps 1-7 done; all automated checks green. One manual check is left for the user (a real follow-up in the dev server, see Open Questions), so not yet marked ready for PR.

## Completed Steps
- [x] 1. Contract: `QUESTION_KINDS`, required `question_kind` / `main_number` on questions and transcript items, nullable `reaction`; test helpers build both
- [x] 2. Apply the turn: `appendAnswerTurn` adds the reaction only when there is one; added lines carry kind and main number
- [x] 3. Progress: `ThreadView.mainNumber` (renamed from `position`) through `InterviewChat`, `InterviewTitleBar`, `ActiveInterview`
- [x] 4. Caption: `formatQuestionCaption` ("Question N of M" by main number, "Follow-up"); used by `ChatMessage`
- [x] 5. Grouping: only main questions get the large top gap
- [x] 6. Wrap-up: `pickThinkingLabel(previous, question, questionCount, random?)` by main number
- [x] 7. Fixtures updated; full suite, typecheck, lint, build green; `graphify update .` run

## Current Step
Done, apart from the manual check.

## Changes Made
- Nothing committed (the user commits by hand). Suggested message:
  `feat(interviews): show follow-up questions in the chat, with progress counted by main question`

## Test Results
- Vitest: 23 files, 264 passed (baseline 22 files, 245 passed; +19 tests, 1 new file).
- `npx tsc --noEmit`: clean. `npm run lint`: clean (0 warnings). `npm run build`: succeeds.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | answer response accepts `reaction: null` | spec | AC1, EC1 | pass |
| T2 | 1 | answer response without a `reaction` key rejected (existing test) | spec | AC1 | pass |
| T3 | 1 | follow-up turn parses (null reaction, follow-up question) | spec | AC1, EC1 | pass |
| T4 | 1 | follow-up as `current_question` parses | spec | AC2, EC8 | pass |
| T5 | 1 | question / transcript item without `question_kind` or `main_number` rejected | spec | AC2, EC10 | pass |
| T6 | 1 | unknown `question_kind` rejected (question and transcript item) | spec | AC2, EC10 | pass |
| T7 | 1 | follow-up thread transcript parses (main, answer, no reaction, follow-up) | spec | AC2, EC11 | pass |
| T8 | 1 | `interviewsService.answer` resolves a follow-up turn | spec | AC8, EC1 | pass |
| T9 | 2 | null reaction: answer then follow-up, no reaction line | spec | AC3, EC1 | pass |
| T10 | 2 | added lines carry the answered question's kind/main number; next question its own | spec | AC3, EC2 | pass |
| T11 | 2 | final answer: answer and reaction only (existing test) | spec | AC3, EC3 | pass |
| T12 | 3 | follow-up latest: progress stays on its main number | spec | AC4, EC4 | pass |
| T13 | 3 | 5 mains x 2 follow-ups: progress never above 5 | spec | AC4, EC5 | pass |
| T14 | 3 | follow-up hidden for the reveal: progress on current main, follow-up still open | spec | AC4, EC8 | pass |
| T15 | 3 | main answered without a reaction: nothing rendered in its place | spec | EC11 | pass |
| T16 | 3 | pending answer to a follow-up carries its kind and main number | code-derived | AC3 | pass |
| T17 | 4 | main caption by `main_number`, not `position` | spec | AC5, EC4 | pass |
| T18 | 4 | follow-up caption "Follow-up" | spec | AC5 | pass |
| T19 | 6 | wrap-up on the last main question | spec | AC7 | pass |
| T20 | 6 | wrap-up on a follow-up of the last main question | spec | AC7, EC6, EC7 | pass |
| T21 | 6 | no wrap-up on a follow-up of an earlier main question whose position equals the count | spec | AC7 | pass |

AC6 (grouping) is a single className condition (`question_kind === "main"`), Test: skip per the plan; to check by eye in the manual pass. AC9 is covered by the full checks above. EC9 (recovered send) needs no new code: it refetches the transcript, which T12-T15 derive from.

## Open Questions
- Manual check (plan, "must verify"): one real interview in `npm run dev` against cuewise-be with migration `e3b8f41a6c27` applied and the LLM on, until a follow-up appears (a vague answer such as "I'd use Redis" helps). Check: no "Couldn't send your answer" toast, a "Follow-up" caption, no large gap above the follow-up, the title bar unchanged, the reaction after the answer that moves on. -> needs: the user (real backend and model).

## Baseline Failures
- None (baseline 245 passed, typecheck clean).

## Deviations from Plan
- None. The `ThreadView.position` -> `mainNumber` rename was already in the plan.
- Tests changed because the spec changed them (not loosened): fixtures in the schema, services, append-turn, thread-view and interview-step tests gained the new required fields; the thread-view progress assertions moved from `position` to `mainNumber`; the `pickThinkingLabel` tests use the new signature.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | lean-ctx | limited to cuewise-be by its root setting; frontend files read and edited with native tools |
| all | graphify | findings reused from plan.md; `graphify update .` at the end |
| setup | find-skills | not needed: the installed `vitest` and `tdd` skills cover the work, no new library |
| 1-6 | tdd | red -> green per slice at the confirmed seams |

## Links
- Spec: docs/features/interviews-follow-up-questions/spec.md
- Plan: docs/features/interviews-follow-up-questions/plan.md
- Backend: ../cuewise-be/docs/features/follow-up-questions/spec.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite green, typecheck, lint and build green
- [ ] Every spec.md acceptance criterion met and covered (AC6 checked by eye in the pending manual pass)
- [x] Open Questions surfaced to the user
- [x] No skipped, deleted, or loosened tests
- [x] task.md fully updated
- [ ] Commits documented (the user commits)
- [x] No open blockers in code
- [x] Code follows project rules (CLAUDE.md)
- [x] No unresolved plan deviations
