# Feature: Interviews Answer Flow (submit answer, reaction, completion)

## Problem
On `/interviews?session=<id>` the answer box accepts typing, but **Next** is disabled ("Submitting answers is coming soon") because `cuewise-be` had no answer endpoint. It now has one, `POST /interviews/{id}/messages`, which stores the answer and returns a predefined reaction plus the next question (or no question when the interview is complete). The frontend cannot yet use it, so a user cannot get past question 1.

## Goal
A user can answer every question of an interview in turn, see a short reaction to each answer, and reach a simple completed screen after the last one, all driven by the new endpoint. Real AI feedback, scoring and transcript replay are not part of this feature.

## Project Conventions
- Rules consulted: root `CLAUDE.md`, `cuewise-fe/CLAUDE.md`, `AGENTS.md` (no `.claude/` rules directory exists). Existing structure followed: `docs/features/interviews-setup-ui/` (spec -> plan -> task).
- Service -> query -> component layering; the new HTTP call lives in `modules/interviews/services/interviews.services.ts`, the mutation in `queries/interviews.queries.ts` (keys from `interviews.keys.ts`), and components never import services or build query keys.
- Components stay dumb; `InterviewsContainer` calls the query hooks and passes data and callbacks down. New UI pieces are presentational, one component per file, `PascalCase.tsx`, named export, props typed as `type <Name>Props`.
- Forms: `AnswerForm` keeps react-hook-form + `zodResolver` with `answerFormSchema` and the shared `TextAreaField`; the fieldset and submit are disabled while the mutation is pending; a 422 is mapped to the `answer` field with `setError`, anything else is a toast through `useMutationCallbacks`.
- Zod validates every API response (`answerResponseSchema`); types are inferred with `z.infer`. Server data stays in the TanStack Query cache; the one-off reaction shown between questions is client-only UI state (no zustand, no cache copy).
- The browser only calls `/api/*` (existing catch-all BFF forwarder); no tokens in the browser.
- Reaction text, like all backend text, is rendered as plain text, never as HTML.
- Loading, empty and error states are required for data-driven UI; errors are normalized via `src/lib/config/api.helper.ts`, no raw error text shown.
- Tests live under `tests/` mirroring `src/`. No commits or pushes.

## User Flow
1. The user opens an in-progress interview at `/interviews?session=<id>` and sees "Question N of M" with the answer box.
2. They type an answer (1-2000 characters after trimming) and press **Next**. The answer box and button are disabled and show a pending state while the request runs.
3. On success the **answer box is replaced by a reaction card**: the interviewer's reaction line (for example "Thanks for sharing that.") and a button. The answered question stays visible above it.
4. The button reads **Next question** and shows the following question when pressed. On the last question it reads **Finish** and opens the completed screen when pressed.
5. The **completed screen** shows an "Interview complete" panel with the closing reaction line from the final answer, the interview details beside it, and a **Start a new interview** button back to `/interviews`. No feedback is shown yet.
6. If the user reloads while a reaction card is showing, they land on the next question (the backend already advanced) and that reaction is not shown again.
7. If the user reloads or revisits a completed interview, they see the completed screen with a generic completion line, because the reaction is not refetched.
8. **End interview** still works while answering (client-only); its dialog now says answers are kept.

## Requirements

### Functional
- `AnswerForm` submits `{ question_id, answer }` to `POST /interviews/{id}/messages` through the Next.js BFF. `question_id` is the current question's id; the body has exactly those two keys (the backend forbids extra keys).
- The response `{ session, reaction: { id, text }, current_question }` is validated with zod. On success the interview cache entry `interviewKeys.detail(id)` is updated to `{ session, current_question }` from the response without a second `GET`, and the reaction is held in container state for the reaction card.
- The interview schema accepts `session.status` of `completed` and a `null` `current_question` (what `GET /interviews/{id}` returns once the session is completed).
- The reaction card appears after every successful answer, including the last. Its button is **Next question** unless the response completed the session, then **Finish**. Pressing it clears the held reaction and reveals the cache's current question, or the completed screen.
- The completed screen is shown when `session.status === "completed"` (or `current_question === null`). It shows the closing reaction when it is still held in state (live finish) and a generic completion line when not (reload, revisit).
- On 409 `QUESTION_NOT_CURRENT` or `SESSION_NOT_IN_PROGRESS`: show a toast, refetch `GET /interviews/{id}` and render whatever the backend reports as current (next question, or completed screen). The typed answer is discarded because the question changed.
- On 422: the `answer` field error is shown under the textarea; the form stays editable with its text.
- On other failures (network, 5xx, 404): toast with a normalized generic message; the typed text is kept and the form re-enables so the user can retry.
- **End interview** stays client-only (no request; the backend session stays `in_progress`). It is available while answering and not on the reaction card or completed screen. The dialog copy is corrected (see UX).
- The `AnswerForm` no longer says "coming soon" and **Next** is enabled when the form is valid.
- `SESSION_STATUSES` and the schemas mirror the backend: `in_progress`, `abandoned`, `completed`.

### Non-Functional
- Auth: the page remains behind `requireUser`; no tokens or answer text are logged or stored client-side (no localStorage/sessionStorage/zustand).
- The answer is sent only to the one endpoint; no additional personal data.
- A single in-flight submit at a time: the form is disabled while pending, so a double-click sends one request (the backend would also reject a duplicate with 409).
- Answer text and reaction text are rendered as plain text.

## UX Requirements
Layout:
- The reaction card sits where the answer card is (left column, below the question card); the details card stays on the right. No layout jump between the answer box and the reaction card.
- The reaction card shows a short label ("Interviewer"), the reaction text, and one primary button. The answered question remains in the question card above so the user keeps the context.
- The completed screen reuses the existing two-column frame (`InterviewColumns` + `InterviewDetailsCard`), with a "Completed" badge and **Start a new interview**; the End interview button is not shown there.

Interaction and content:
- Pending: the answer fieldset and **Next** are disabled and **Next** shows a spinner and "Sending…". Nothing blocks the rest of the page.
- Keep the 0 / 2000 counter and trimmed 1-2000 validation (existing `answerFormSchema`).
- After pressing **Next question** / **Finish**, focus moves to the new content (the question heading, or the completed panel heading) so keyboard and screen-reader users are not left on a removed button.
- The reaction text is announced to assistive technology when it appears (polite live region on the reaction card).
- **End interview** dialog copy: "End this interview? Your answers so far are saved. You'll leave this interview and can start a new one any time." Buttons: **Keep going** / **End interview** (unchanged).
- The client-only ended screen drops its "Abandoned" badge, because the backend status stays `in_progress`. Title "Interview ended", line "Your answers so far are saved." (decided in plan.md)
- 409 toast: "This question was already answered. Showing where you are now."

Accessibility and theming:
- Visible focus states, targets at least 44x44px, 4.5:1 contrast in light and dark themes, theme tokens only, existing `ui/` primitives and `shared/forms` fields.
- Motion limited to short color transitions; nothing animates layout; `prefers-reduced-motion` respected.

## Constraints
- Backend contract (verified in `cuewise-be`): `POST /interviews/{id}/messages` -> 201 `{ session, reaction: { id, text }, current_question | null }`; errors 404 (not found or not yours), 409 `QUESTION_NOT_CURRENT`, 409 `SESSION_NOT_IN_PROGRESS`, 422 (empty/over 2000 chars/extra keys). Answer max 2000 characters.
- The reaction is a predefined neutral acknowledgement (no LLM, no score, no verdict). It is shown as a conversational beat, never as evaluation.
- Generating the next question may call an LLM, so the submit can take several seconds; the pending state must be tolerated.
- `GET /interviews/{id}` returns `current_question: null` for a completed session and does **not** return the last reaction.
- There is no backend endpoint to end or abandon a session.
- Next.js 16: `searchParams` is async; no routing changes are expected here.
- The `session` in the answer response reports `status: "completed"` after the last answer (confirmed in the database by the user; re-check in the browser during verification).

## Blockers
- None for this feature. Follow-ups needing backend work (out of scope): an end/abandon endpoint, real AI feedback, and an active-session lookup.

## Edge Cases
- **EC1:** Submit succeeds for a non-last question -> reaction card with the reaction text and **Next question**; the cache already holds the next question; pressing the button shows it with an empty answer box.
- **EC2:** Submit succeeds for the last question (`current_question: null`, `status: completed`) -> reaction card with the closing line and **Finish**; pressing it shows the completed screen showing that closing line.
- **EC3:** User reloads while the reaction card is showing -> the next question is shown from `GET` (the answered one is already stored); the reaction is not shown again.
- **EC4:** User reloads or opens a completed interview's URL -> completed screen with a generic completion line, no reaction, no End interview button.
- **EC5:** Submit returns 409 `QUESTION_NOT_CURRENT` or `SESSION_NOT_IN_PROGRESS` -> toast, refetch, render the backend's current state (question or completed screen); the typed text is discarded when the question changed and kept when the same question is still current.
- **EC6:** Submit returns 422 -> error shown under the answer field; text kept; form re-enabled.
- **EC7:** Submit fails with a network error or 5xx -> toast with a generic message; text kept; form re-enabled for retry. No raw error text.
- **EC8:** Submit returns 404 -> the existing "Interview not found" state after the refetch fails with 404. (assumption — verify)
- **EC9:** Session expires (401 with a session code) during submit -> existing BFF/session-expired handling applies; this feature adds nothing.
- **EC10:** Empty/whitespace answer or over 2000 characters -> client validation message, no request sent.
- **EC11:** User double-clicks **Next** -> one request is sent (fieldset disabled while pending).
- **EC12:** The user opens the interview in two tabs and answers in both -> the second submit gets 409 (EC5) and resyncs.
- **EC13:** User confirms End interview mid-way -> ended screen as today (client-only); reloading shows the interview again at the stored position because the backend status is still `in_progress`. (assumption — verify against the backend once an end endpoint exists)
- **EC14:** User dismisses the End interview dialog (Cancel, Esc, click outside) -> dialog closes, the interview continues and the typed answer is kept.
- **EC15:** User presses **Start a new interview** on the completed screen -> navigates to `/interviews` with no `session` param and the config form.
- **EC16:** Response fails zod parsing (unexpected shape) -> treated as a failure (EC7); nothing is written to the cache.
- **EC17:** Submit is slow (LLM generating the next question) -> pending state stays until the response; the form cannot be submitted again; the rest of the page stays usable (End interview still opens).

## Acceptance Criteria
- [ ] **AC1:** With an in-progress session, **Next** is enabled when the answer is valid, and the "coming soon" hint is gone.
- [ ] **AC2:** Submitting sends one `POST /interviews/{id}/messages` through the BFF with exactly `question_id` (the current question's id) and the trimmed `answer`.
- [ ] **AC3:** On success the cache for that session is updated from the response with no extra `GET`, and the answer card is replaced by a reaction card showing the reaction text (plain text) while the answered question stays visible.
- [ ] **AC4:** The reaction card's button reads **Next question** for non-final answers and **Finish** when the response completed the session; pressing **Next question** shows the next question with an empty answer box and moves focus to it.
- [ ] **AC5:** Pressing **Finish** shows the completed screen with a "Completed" badge, the closing reaction text, the interview details and **Start a new interview**, and no End interview button.
- [ ] **AC6:** Opening `/interviews?session=<id>` for a completed session (reload) renders the completed screen with the generic completion line, without error and without a reaction.
- [ ] **AC7:** The interview schema parses `status: "completed"` and `current_question: null`; the answer request and response schemas are validated with zod and covered by unit tests.
- [ ] **AC8:** While the request is pending the textarea and **Next** are disabled and **Next** shows a spinner and "Sending…"; a second click sends no second request (EC11).
- [ ] **AC9:** A 409 (either code) shows the resync toast, refetches the interview, and renders the backend's current question or the completed screen (EC5).
- [ ] **AC10:** A 422 shows the field error under the answer textarea and keeps the typed text (EC6); network/5xx failures show a generic toast and keep the typed text (EC7); no raw error text appears.
- [ ] **AC11:** The End interview dialog says answers are kept (no "progress won't be saved" claim); Cancel/Esc closes it and keeps the typed answer (EC14); confirming still shows the ended screen without making a request.
- [ ] **AC12:** The reaction text is announced via a polite live region, focus moves to the new content after **Next question** / **Finish**, and all new controls are keyboard operable, at least 44x44px, with visible focus.
- [ ] **AC13:** The reaction card and completed screen have no horizontal scroll at 360px and are legible in the dark theme.
- [ ] **AC14:** The service, schemas and any new pure helpers (for example mapping an answer error to a result) have unit tests under `tests/` mirroring `src/`; typecheck, lint and tests pass.

## Out of Scope
- Fetching the transcript (`GET /interviews/{id}/messages`) or restoring past reactions after a reload: the user chose a simple flow, and the generic completion line covers the revisit case.
- AI feedback, scoring, evaluation, or any results screen: the backend does not produce it yet.
- Ending or abandoning a session on the backend and real early feedback on End interview: no endpoint exists; End stays a UI shell.
- Resuming from a list of past/in-progress interviews: no backend endpoint.
- Auto-advancing past the reaction card, animated transitions, or a chat-style history.
- Any backend changes.
