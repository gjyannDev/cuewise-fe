# Implementation Plan: Interview Follow-up Questions (client support)

## Overview
Make the interview chat accept cuewise-be's follow-up turns: a nullable reaction, `question_kind` / `main_number` on questions and transcript items, captions and progress by main question, follow-ups inside their main question's group, and "Wrapping up…" for the whole last main thread.

## Architecture & Design
Nothing new in the data flow: `interviewsService.answer` already parses with zod, `appendAnswerTurn` applies the turn to the cached transcript, and `buildThreadView` derives what the chat shows. The change goes through those same functions. Every display rule (caption, progress, wrap-up) lives in a pure util that Vitest can test. Components only read the result, plus one className condition for grouping.

## Spec Requirements -> Implementation
- Contract: `question_kind`, `main_number` required; `reaction` nullable -> Step 1
- Apply a turn without a refetch (reaction only when present; new fields on added items) -> Step 2
- Title bar progress by `main_number` -> Step 3
- Caption "Question N of M" / "Follow-up" -> Step 4
- Follow-up stays in its group -> Step 5
- Wrap-up on the whole last main thread -> Step 6
- Timing unchanged -> no step (the hook's timers are not touched)
- Test fixtures carry the new fields; full checks green -> Step 7
ll
## Implementation Steps
1. **Contract.** In `constants.ts`, add `QUESTION_KINDS = ["main", "follow_up"]` (mirrors `QuestionKind` in cuewise-be `interviews_constants.py`). In `schemas/interviews.schema.ts`, add a required `question_kind` (enum) and `main_number` (int) to `questionSchema` and `transcriptItemSchema`, and make `answerResponseSchema.reaction` nullable but not optional. Types stay inferred, so `Reaction` becomes nullable automatically. Update `tests/helpers/interviews.ts`:
   - `transcriptItem` defaults to `question_kind: "main"` and `main_number` = position, overridable;
   - `answerResponse` takes an optional reaction override (null allowed), and its next question carries the new fields.
   - Test: first. Seams (user-confirmed): `interviewSchema`, `answerResponseSchema` and `transcriptItemSchema` `safeParse`, and `interviewsService.answer`. Slices:
     - (a) accepts `reaction: null`;
     - (b) rejects a missing `reaction` key;
     - (c) rejects a missing `question_kind` / `main_number`;
     - (d) rejects an unknown kind;
     - (e) `interviewsService.answer` resolves with a null reaction and a follow-up `current_question`.
2. **Apply the turn.** `utils/append-answer-turn.ts`:
   - add the reaction item only when `reaction` is not null;
   - the answer and reaction copy the answered question's `position`, `question_kind` and `main_number`;
   - the next question takes its own values from `current_question`.
   - Test: first. Seam (user-confirmed): `appendAnswerTurn`. Slices:
     - (a) null reaction plus follow-up gives answer and follow-up, with no reaction item;
     - (b) reaction plus main question as before, with the fields on every added item;
     - (c) reaction plus `null` question gives answer and reaction only.
3. **Progress.** `utils/build-thread-view.ts`:
   - `ThreadView.position` becomes `mainNumber`: the `main_number` of the last visible question.
   - The pending answer copies the question's `question_kind` / `main_number`.
   - Rename the prop through `InterviewChat`, `InterviewTitleBar` and `ActiveInterview`, and update the doc comments in `types/interviews.types.ts`.
   - Test: first. Seam (user-confirmed): `buildThreadView`. Slices:
     - (a) a follow-up as the last visible question gives its parent's main number;
     - (b) 5 mains with 2 follow-ups each never yields more than 5;
     - (c) a hidden follow-up during the reveal leaves the progress on the current main number.
4. **Caption.** Add `formatQuestionCaption(item, total)` to `utils/format-question-count.ts`: a main question gets `formatQuestionPosition(main_number, total)`, a follow-up gets `FOLLOW_UP_CAPTION` ("Follow-up", in `constants.ts`). `ChatMessage` renders it instead of `formatQuestionPosition(item.position, total)`.
   - Test: first. Seam (user-confirmed): `formatQuestionCaption`. New `tests/modules/interviews/utils/format-question-count.test.ts`. Slices:
     - (a) main gives "Question 2 of 5" from `main_number`, not `position`;
     - (b) follow-up gives "Follow-up".
5. **Grouping.** In `ChatMessage`, the large top gap (`mt-6 first:mt-0`) applies only to questions whose `question_kind` is `main`. A follow-up gets the thread's normal `gap-4`, like a reaction.
   - Test: skip (one className condition). Check by eye in the dev server.
6. **Wrap-up.** Change the signature to `pickThinkingLabel(previous, question, questionCount, random?)`: "last" means `question.main_number === questionCount`, whatever the kind. `use-interview-chat.ts` passes the question and the count instead of the `position` comparison.
   - Test: first. Seam (user-confirmed): `pickThinkingLabel`; update the existing test file. Slices:
     - (a) the last main question gives the wrap-up label;
     - (b) a follow-up of the last main question gives the wrap-up label;
     - (c) a follow-up of an earlier main question gives a random label, even when its `position` equals the count;
     - (d) the existing random and no-repeat cases stay.
7. **Fixtures and finish.**
   - Update existing tests whose fixtures lack the new fields (schema, services, append, thread view). This is a spec-driven change, not a loosened test.
   - Run typecheck, lint, the full Vitest suite and `npm run build`, then `graphify update .`.
   - Do one manual dev-server pass against cuewise-be with the migration applied.
   - Test: after (full checks).

## Affected Files & Patterns
- `src/modules/interviews/constants.ts`: add `QUESTION_KINDS` and `FOLLOW_UP_CAPTION`.
- `src/modules/interviews/schemas/interviews.schema.ts`: new fields, nullable reaction.
- `src/modules/interviews/types/interviews.types.ts`: `ThreadView.mainNumber` and comments. Everything else is inferred.
- `src/modules/interviews/utils/append-answer-turn.ts`, `build-thread-view.ts`, `format-question-count.ts`, `pick-thinking-label.ts`: the logic.
- `src/modules/interviews/hooks/use-interview-chat.ts`: the `pickThinkingLabel` call.
- `src/modules/interviews/components/ChatMessage.tsx`: caption and grouping.
- `InterviewChat.tsx`, `InterviewTitleBar.tsx`, `src/app/(app)/interviews/_components/ActiveInterview.tsx`: rename the prop to `mainNumber`.
- `tests/helpers/interviews.ts` plus the tests listed in Steps 1–4 and 6.
- Patterns to follow: zod-first schemas with inferred types; pure `utils/` functions with a mirrored test file; enum values mirrored from the backend with the existing "keep both in step" comment; injectable `random` in `pickThinkingLabel`.
- Risks:
  - Required fields break against an unmigrated backend (accepted in the spec).
  - Renaming `position` to `mainNumber` on the view touches 4 files. That's a small mechanical change, but it keeps "position" from meaning two things.

## Testing Strategy
- Framework and command: Vitest (`npm test`, or `npx vitest run tests/modules/interviews` while iterating). Also `npx tsc --noEmit`, `npm run lint` and `npm run build` at the end.
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 1 | first | null accepted, missing key rejected |
| AC2 | 1 | first | missing / unknown kind, missing main_number |
| AC3 | 2 | first | three response shapes |
| AC4 | 3 | first | progress from main_number |
| AC5 | 4 | first | caption util |
| AC6 | 5 | skip | className only; manual check |
| AC7 | 6 | first | via pickThinkingLabel |
| AC8 | 1 | first | service resolves with a null reaction, so no error path is entered |
| AC9 | 7 | after | full suite, typecheck, lint, build |
| EC1 | 1, 2 | first | |
| EC2 | 2 | first | |
| EC3 | 2 | first | |
| EC4 | 3, 4 | first | |
| EC5 | 3 | first | |
| EC6 | 6 | first | |
| EC7 | 6 | first | accepted behaviour |
| EC8 | 3 | first | the view is derived from the transcript only; covered by buildThreadView on a reloaded transcript |
| EC9 | 3 | first | the recovered path refetches the transcript; same derivation as EC8 |
| EC10 | 1 | first | |
| EC11 | 3 | first | a transcript without a reaction renders nothing in its place |

- Must verify, not assume: one real interview in the dev server with cuewise-be (migration applied and the LLM on) that reaches a follow-up, checking the caption, grouping, title bar and the absence of a toast. Whether the model asks a follow-up depends on the model, so a vague answer like "I'd use Redis" should help.
- Open questions: none.
- Known baseline failures: not yet seen; `/implement` runs the suite first and records any.

## Blockers & Resolutions
- Components can't be unit-tested (node environment, no Testing Library) -> captions and the wrap-up rule move into pure utils (user-confirmed seams); grouping is a single className, checked by eye.
- The transcript order assumption -> verified in cuewise-be `build_transcript` (recorded in the spec).

## Trade-offs & Rationale
- **Required fields, no defaults:** a contract mismatch fails loudly in the existing error path instead of showing wrong numbers (user's choice).
- **`pickThinkingLabel` takes the question:** the main-number rule sits in tested code, and the untested hook gets simpler.
- **Rename the view's `position` to `mainNumber`:** after this feature, `position` is ordering only; reusing the name for progress would be the same bug waiting to happen again.
- **No Testing Library:** adding it for one className isn't worth a new dependency (CLAUDE.md: no dependency without a reason).

## Project Rules Applied
- `CLAUDE.md`, data flow: the service parses with zod and components stay dumb, so the logic lives in `utils/` and the hook.
- `CLAUDE.md`, testing: tests go in `tests/` mirroring `src/`, builders in `tests/helpers/`.
- `CLAUDE.md`, Don'ts: no new dependency, copy in constants, no commit; work on the current branch `feat/interviews-ui`.
- `constants.ts` convention: enum values mirror the backend.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | interview chat graph: `ChatMessage`, `ChatThread`, `buildThreadView`, `appendAnswerTurn`, `InterviewTitleBar`, `use-interview-chat` |
| lean-ctx / native reads | lean-ctx is limited to cuewise-be; frontend files were read natively; backend `build_transcript` checked with ctx tools |
| grill-me (via AskUserQuestion) | test seams for captions, wrap-up and the remaining public functions confirmed |
| ponytail | no Testing Library, no new component, one className for grouping, reuse `formatQuestionPosition` |
| ui-ux-pro-max | not used: no new UI, only a caption and spacing within the existing style |

## Ready to Implement
- All spec requirements mapped to steps
- Every step has a Test tag; every AC#/EC# is in the coverage map
- Affected files identified
- Blockers resolved, edge cases handled
- Trade-offs documented
- One addition beyond the spec: renaming `ThreadView.position` to `mainNumber` (internal, no behaviour change)
