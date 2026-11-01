# Feature: Interview Follow-up Questions (client support)

## Problem
cuewise-be now asks up to 2 follow-up questions per main question (`../cuewise-be/docs/features/follow-up-questions/spec.md`). The interview chat was built for "answer -> reaction -> next main question" and breaks on the new contract:
- When the next question is a follow-up, `POST /interviews/{id}/messages` returns `reaction: null`. The answer response schema requires a reaction, so parsing throws: the candidate sees "Couldn't send your answer" and gets their text back although the backend saved it. Only a resend (409 -> resync) shows the follow-up. This happens on every follow-up turn.
- Progress uses `position`, which now counts follow-ups too, while `question_count` counts main questions only: a follow-up reads "Question 2 of 5" and the last main question can read "Question 7 of 5", in the thread and in the title bar.
- "Wrapping up…" is chosen by `position === question_count`, so it shows on the wrong question.

## Goal
A candidate can go through an interview with follow-ups without an error, and the chat shows where they are: main questions as "Question N of M" counted by main question, follow-ups marked "Follow-up", progress that never exceeds M.

## Project Conventions
- Rule files consulted: `CLAUDE.md` + `AGENTS.md` (project root; there is no `.claude/` directory), the user's global `~/.claude/CLAUDE.md`, the specs of `interviews-answer-flow` and `interviews-chat-layout`, and the backend spec above.
- Constraints those rules impose on this feature:
  - Data flow service -> query -> component; responses parsed with zod in the service; types inferred with `z.infer`.
  - Components stay presentational; derived values (labels, progress) live in pure functions in `modules/interviews/utils/`.
  - Enum values mirror `cuewise-be/app/modules/interviews/interviews_constants.py` in `modules/interviews/constants.ts`; copy lives in constants.
  - AI text rendered as plain text (unchanged).
  - Vitest tests in `tests/`, mirroring `src/`; builders in `tests/helpers/`.
  - No new dependency. Nothing is committed or pushed. Work on the current branch `feat/interviews-ui`.

## User Flow
1. The candidate answers main question 2 ("Question 2 of 5"; title bar "2 of 5").
2. The thinking indicator shows as today. The reply is a follow-up: no reaction line appears; after the usual short pause the follow-up appears, captioned "Follow-up", directly under the answer without the large gap that separates main questions. The title bar still says "2 of 5".
3. The candidate answers the follow-up. If the backend moves on, the predefined reaction appears under that answer, then "Question 3 of 5" in a new group.
4. On the last main question and its follow-ups the indicator says "Wrapping up…". The interview completes when the backend returns no next question (completed card, as today).

## Requirements

### Functional
**Contract (schemas and types)**
- Question objects (`current_question` in the interview and answer responses) and transcript items carry `question_kind` (`main` | `follow_up`) and `main_number` (integer). Both are required; the allowed `question_kind` values mirror the backend in `constants.ts`.
- The answer response's `reaction` is nullable: `null` when the next question is a follow-up, an object when the interview moves to the next main question or completes.
- Existing fields keep their meaning; `position` stays the ordering counter and is no longer used for anything shown to the candidate.

**Applying an answer turn without a refetch**
- The answer and the next question (if any) are added after the answered question as today; the reaction line is added only when the response has one.
- The added answer, reaction and next-question items carry `question_kind` and `main_number` consistent with what the transcript endpoint would return for them (answer and reaction take the answered question's values; the next question takes its own).

**Display**
- Main question caption: "Question {main_number} of {question_count}".
- Follow-up caption: "Follow-up".
- A follow-up does not start a new visual group: it gets the same spacing as other lines in a thread; only main questions get the large gap above them.
- Title bar progress: "{main_number of the last visible question} of {question_count}"; unchanged while follow-ups of that main question are shown.
- Thinking label: "Wrapping up…" when the answered question's `main_number` equals `question_count` (main or follow-up); otherwise a random neutral label, as today.
- Timing is unchanged: the minimum thinking time and the reveal pause apply whether the reply brings a reaction or a follow-up.

### Non-Functional
- **Performance:** no extra request per turn; the turn is still applied from the answer response.
- **Security:** follow-up text is AI output and is rendered as plain text like every question.
- **Reliability:** a follow-up turn never shows a send error when the backend saved the answer.

## UX Requirements
- The "Follow-up" caption uses the same muted caption style as "Question N of M" and is read by screen readers with the question (it is part of the message, like the existing caption).
- No new controls; keyboard and focus behaviour of the composer is unchanged (the composer answers the follow-up like any open question).
- Copy ("Follow-up") lives in `constants.ts`.

## Constraints
- Depends on cuewise-be with migration `e3b8f41a6c27` applied; the fields are required, so the client does not support an older backend.
- The answer timeout (45 s) and the `/api` forwarder budget already exceed the backend's 30 s turn deadline; no change.
- One reaction per thread at most, always after the answer that moved on. Verified in cuewise-be `build_transcript` (`interviews_utils.py`): items are ordered by `position`, each question is followed by its answer and its reaction when they exist, and every item carries its question's `question_kind` and `main_number`.

## Blockers
- None. Decisions taken with the user: "Follow-up" caption; follow-ups stay in their main question's group; title bar by main number only; wrap-up on the whole last main thread; required fields; unchanged timing.

## Edge Cases
Format: condition -> expected outcome.

- **EC1:** The answer response has `reaction: null` and a follow-up as `current_question` -> the turn is applied without error: the answer, then the follow-up (no reaction line); no toast; the composer answers the follow-up.
- **EC2:** The answer response has a reaction and a main `current_question` -> unchanged behaviour: answer, reaction, then the next main question in a new group.
- **EC3:** The answer response has a reaction and `current_question: null` (last thread ends) -> answer and reaction, then the completed card, as today.
- **EC4:** A follow-up of main question 2 is the latest question -> its caption is "Follow-up" and the title bar says "2 of {question_count}".
- **EC5:** An interview of 5 main questions with 2 follow-ups each -> no caption or title bar ever shows a number above 5.
- **EC6:** Answering a follow-up of the last main question -> the label is "Wrapping up…"; if the reply is another follow-up it is shown normally; if it ends the interview, the completed card follows.
- **EC7:** Answering the last main question with a follow-up reply -> the label was "Wrapping up…" and a follow-up appears (accepted).
- **EC8:** A session is reloaded (or resynced after a 409) while a follow-up is the open question -> the thread rebuilds from the transcript with the same captions, grouping and title bar as before the reload, and the composer answers the follow-up.
- **EC9:** A lost reply that was saved after all (`recovered`) on a follow-up turn -> the refetched thread shows the follow-up; no toast (as today).
- **EC10:** A response is missing `question_kind` or `main_number`, or has an unknown `question_kind` -> parsing fails and the existing error handling applies (no silent defaults).
- **EC11:** The transcript has a main question with no reaction after its answer (moved into a follow-up) -> nothing is rendered in place of the missing reaction.

## Acceptance Criteria
- [ ] **AC1:** The answer response schema accepts `reaction: null` and an object reaction, and rejects a missing `reaction` key (EC1, EC2).
- [ ] **AC2:** Question and transcript-item schemas require `question_kind` from the mirrored list and an integer `main_number`, and reject an unknown kind or a missing field (EC10).
- [ ] **AC3:** Applying an answer turn with `reaction: null` adds the answer and the follow-up and no reaction item; with a reaction it adds answer, reaction and the next question as before; added items carry the right `question_kind` and `main_number` (EC1, EC2, EC3, EC11).
- [ ] **AC4:** The thread view's progress is the `main_number` of the last visible question, never its `position` (EC4, EC5, EC8).
- [ ] **AC5:** A main question's caption reads "Question {main_number} of {question_count}"; a follow-up's caption reads "Follow-up" (EC4, EC5).
- [ ] **AC6:** A follow-up does not get the large top gap that starts a group; a main question does.
- [ ] **AC7:** The thinking label is "Wrapping up…" exactly when the answered question's `main_number` equals `question_count`, whatever its kind (EC6, EC7).
- [ ] **AC8:** A follow-up turn shows no send-error toast and does not put the answer back in the composer (EC1, EC9).
- [ ] **AC9:** Typecheck, lint and the full Vitest suite pass; test helpers build questions and transcript items with the new fields.

## Out of Scope
- Backend changes (done in cuewise-be).
- Showing the follow-up gap reason or any evaluation of the answer: the backend does not expose it, and the chat never judges answers.
- Numbering follow-ups ("Follow-up 1 of 2"), a follow-up hint in the title bar, or different timing for follow-ups (decided against with the user).
- Supporting an older backend without the new fields.
- Streaming the follow-up text (the backend's SSE slice).
