# Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)

## Problem
The interview session is step-by-step: one question card, an answer box, then a reaction card with a **Next question** button. Earlier questions, answers and reactions disappear from the screen, and a reload loses the reaction that was showing (the answer-flow spec deliberately skipped the transcript). `cuewise-be` already exposes the full conversation through `GET /interviews/{id}/messages`, so the session can be shown as a chat thread that survives reloads and reads like a real interview.

## Goal
On `/interviews?session=<id>` the user sees the interview as one conversation: interviewer questions and reactions on the left, their own answers on the right, and a composer at the bottom. Sending an answer shows it immediately, a neutral "thinking" indicator while the backend replies, then the reaction and the next question without a button press. The last answer ends with an inline completed card. Reloading or revisiting rebuilds the whole thread from the backend. Answering semantics (one answer per question, answers only, no free chat) do not change.

## Project Conventions
- Rules consulted: root `CLAUDE.md`, `cuewise-fe/CLAUDE.md`, `AGENTS.md` (no `.claude/` rules directory). Docs follow `docs/features/interviews-answer-flow/` (spec -> plan -> task).
- Service -> query -> component: the transcript call lives in `modules/interviews/services/interviews.services.ts`, its query hook in `queries/interviews.queries.ts` with a key from `interviews.keys.ts`. Components never import services or build query keys.
- Components stay dumb; a route-private container (today `ActiveInterview` under `app/(app)/interviews/_components/`) calls the hooks and passes data and callbacks down. One component per file, `PascalCase.tsx`, named export, `type <Name>Props`.
- Forms: the composer uses react-hook-form + `zodResolver` with the existing `answerFormSchema` (trimmed 1-2000 characters). The shared `TextAreaField` is used, or extended in `shared/forms/` if the composer needs something it lacks; no inline hand-rolled inputs. 422 maps to the `answer` field with `setError`; everything else is a toast through `useMutationCallbacks`.
- Zod validates the transcript response; types are inferred with `z.infer`. Server data (interview, transcript) lives in the TanStack Query cache; the optimistic answer, the picked thinking label and scroll state are client-only UI state (no zustand copy of server data, no browser storage).
- Copy (thinking labels, slow label, wrap-up label, empty/error lines) lives in `modules/interviews/constants.ts`.
- All backend text (questions, answers, reactions) is rendered as plain text, never HTML.
- Reuse before creating: `EndInterviewDialog`, `getAnswerErrorResult`, `getInterviewStep`, `useMutationCallbacks`, shadcn primitives.
- The app header is sticky (`AppShell`). The chat screen does not scroll the window: it fills the viewport below the header and only the thread scrolls inside it (decided after the plan review; see plan.md).
- Chat UI building blocks come from Vercel **AI Elements** (shadcn-style registry, recorded in `components.json`, code copied into `src/components/ai-elements/` via the CLI, treated like `components/ui`: wrapped, not edited): `Conversation` / `ConversationContent` for the scrolling thread and `Shimmer` for the thinking label (user decision). This brings two dependencies: `use-stick-to-bottom` (stick-to-bottom scrolling) and `motion` (the shimmer animation). AI Elements `Message` is not used: it pulls in the `ai` SDK and a markdown renderer, which conflicts with plain-text rendering. `ConversationScrollButton` is not used either (its click cannot be extended and it drops focus); an own jump-to-latest button on the same scroll context replaces it. The only change to generated code is a documented one-line fix in `Shimmer` (it creates a component during render, which restarts the animation and fails the React Hooks lint rules).
- Tests live under `tests/` mirroring `src/`. No commits or pushes.
- Delivery: built in two parts, each green and committed separately by the user. **Part A, chat core:** the thread, composer, indicator, layout and core error handling (AC1-AC14, plus AC16's lint, refetch, abandoned, open-question and stuck-state items). **Part B, robustness:** the route timeouts and answer recovery, the leave warning and the start timeout (AC7's unknown-outcome part, AC9's leave warning, AC15, plus AC16's leave-warning items). Part B only adds to Part A.

## User Flow
1. The user opens an in-progress interview at `/interviews?session=<id>`. While the conversation loads they see a skeleton thread; then the thread shows every question shown so far, each followed by their answer and the interviewer's reaction when those exist. The current question is the last bubble, and the thread opens scrolled to it. The chat area fills the screen below the header; only the thread scrolls, and the composer sits at the bottom of the chat area. An interview bar above the thread shows "Question N of M" with a progress line, the role · level · style (from `sm`), and End interview, on every screen size (revised after review: the right-hand details panel was removed). Revised again: the bar is now the conversation's title ("Level Role interview", e.g. "Junior Backend interview", with a menu holding the details and End interview) plus quiet "N of M" text.
2. They type an answer and press **Send** or Ctrl/⌘+Enter (Enter adds a new line). Their answer appears at once as a right-aligned bubble, the composer clears and disables, and a left-aligned thinking indicator shows a neutral label picked at random (for example "Reading your answer…"). On the last question the label is "Wrapping up…".
3. If the reply takes more than about 5 seconds, the label changes to "Still thinking…".
4. When the reply arrives, the indicator is replaced by the reaction bubble. About 600ms later the next question bubble appears and the composer re-enables with focus kept in it.
5. After the last answer, the reaction is the closing line; about 600ms later an inline **Interview complete** card replaces the composer with **Start a new interview**.
6. Reloading at any point rebuilds the thread from the backend, including reactions and the closing line.
7. Revisiting a completed interview shows the full thread and the completed card; no composer, no End interview.
8. **End interview** (still client-only) keeps the thread visible and replaces the composer with an inline **Interview ended** card ("Your answers so far are saved.") and **Start a new interview**.

## Requirements

### Functional
- Fetch `GET /interviews/{id}/messages` through the BFF with a query hook and a key from the interviews key factory. Validate the response with zod: `items[]` of `{ id, question_id, position, role: interviewer | candidate, kind: question | answer | reaction, text, created_at | null }`.
- Render items in backend order. `kind: question` is an interviewer bubble labelled "Question N of M" (N = `position`, M = `session.question_count`); `kind: reaction` is a smaller interviewer bubble; `kind: answer` is a candidate bubble on the right.
- Sending posts `{ question_id, answer }` through the existing `POST /interviews/{id}/messages` mutation (contract unchanged). Only the current question can be answered; the composer is not shown when there is no current question.
- On send, the candidate bubble is shown immediately (optimistic) and the thinking indicator below it. On success the thread cache is updated so it contains the answer, the reaction and (when present) the next question, consistent with what `GET /messages` would return; the interview cache is updated as today.
- The next question (or the completed card) is revealed about 600ms after the reaction appears. During that pause the composer stays disabled.
- Thinking indicator label: picked at random from `INTERVIEWER_THINKING_LABELS` when the user sends, never the same as the previous pick in this session; replaced by `INTERVIEWER_SLOW_LABEL` after about 5 seconds; a fixed wrap-up label is used instead of a random one when answering the last question (`position === question_count`). Labels are neutral and never judge the answer.
- On 422: the optimistic bubble is removed, the text is restored in the composer and the field error shows under it.
- On 409 `QUESTION_NOT_CURRENT` / `SESSION_NOT_IN_PROGRESS` or 404: the optimistic bubble is removed, the resync toast shows, and both the interview and the thread are refetched; the composer keeps the text only if the same question is still current.
- On other failures (network, 5xx, zod parse): the optimistic bubble is removed, the text is restored, a generic toast shows, and the composer re-enables for retry.
- Slow replies: the answer request waits longer than other requests (above the backend's 30s LLM budget) in both the browser call and the BFF forwarder; other routes keep their timeout. When a send's outcome is unknown (timeout, network error, BFF 503), the app checks the backend: if the answer was saved, the thread shows it with its reaction and the next question and no error is shown; otherwise the bubble is removed, the text restored, and a toast says the send could not be confirmed (not that it failed), because the backend may still be saving it.
- Starting an interview also waits longer (above the backend's job-description summary plus first-question budget). If it still times out, a specific toast says starting took too long and to try again.
- The composer always answers the conversation's open question (the last question without an answer in the thread), so the thread and the composer can never disagree. Session status still comes from the interview.
- An `abandoned` session (allowed by the backend schema) shows the thread with the ended card and no composer.
- A failed background refetch never replaces content already on screen; error screens only show when there is nothing cached to display.
- If the interview is in progress but the conversation shows no unanswered question (a stale thread), the composer area shows "Couldn't load the latest question." with **Retry** instead of leaving the user without a way forward.
- A send keeps its result even if a background refetch (for example on window focus) was in flight: stale fetches are cancelled before the new turn is written.
- Progress ("N of M" in the title row and "Question N of M" on each question) follows what is visible in the thread, so it does not jump ahead during the reveal pause.
- While the composer holds unsent text or a send is in flight, leaving or reloading the page triggers the browser's native "leave site?" warning. Nothing is stored. The session-expired redirect to sign-in is never blocked by this warning.
- If the transcript fails to load (network/5xx) while the interview loaded: the thread area shows an error line with **Retry** and no composer.
- Completed sessions (`current_question === null`) show the thread and an inline completed card with the closing reaction already in the thread; End interview is not shown.
- End interview stays client-only and is available while answering (including while a send is pending). Confirming shows the inline ended card below the thread.
- The step-by-step pieces this replaces (question card, reaction card with **Next question** / **Finish**, separate completed and ended panels) are no longer used by the session screen.

### Non-Functional
- Auth: the page stays behind `requireUser`; no tokens, answers or transcript text logged or stored outside the Query cache.
- The transcript is at most 30 items (backend caps at 10 questions), so no pagination or virtualization.
- One in-flight send at a time: the composer is disabled while pending and during the reveal pause.
- Plain-text rendering with preserved line breaks and wrapping for long answers.

## UX Requirements
Layout:
- One centered column (max ~48rem) on every screen size, no side panel. On top, the conversation's title, like a chat app's (revised after review: no bar, button or progress line):
  - the title button names the interview the way you'd say it, "Level Role interview" (e.g. "Junior Backend interview"), with a chevron;
  - its menu shows a small "Details" heading with style · N questions (e.g. "Behavioral · 5 questions") and, while answering, **End interview** (destructive), which opens the confirmation dialog;
  - quiet "N of M" text sits on the right.

  Then come the thread and the composer. End interview is a rare, leaving action, so it sits one deliberate step away instead of beside the details. Focus returns to the title button on "Keep going"; on confirm, the dialog closes before the interview ends, so the closing card's heading keeps focus.
- Chat-assistant style (revised after review): interviewer lines are plain text beside a small interviewer avatar, with no bubble; questions in body text with a muted "Question N of M" label above, reactions in smaller muted text. Candidate answers sit right in a soft `bg-muted` bubble (max ~85% width). No divider lines anywhere in the chat.
- The chat area (title row, thread, composer) is a fixed-height column filling the viewport below the sticky app header, sized with dynamic viewport units. Only the thread scrolls; the window does not.
- Mobile keyboard: the app's viewport is set so that, where the browser supports it (Android Chrome), the layout shrinks when the keyboard opens and the composer sits right above it. iOS Safari does not support this and keeps its default behavior of panning the page to keep the focused composer visible; the composer and latest message must stay visible there, but the header may scroll out of view while typing.
- The composer respects the bottom safe area on phones with a home indicator.
- The composer sits at the bottom of the chat area (no sticky positioning, no divider line): one rounded card holding a borderless textarea that grows from about 2 rows up to about 40% of the viewport height, with a footer row inside it. The footer has the hint "Ctrl/⌘ + Enter to send" (from `sm`), replaced by the "N / 2000" counter once the answer reaches 1600 characters, and a round send button (arrow icon, accessible name "Send answer", 44px). The card shows the focus ring and the error border; the conversation fades softly under it. Placeholder "Type your answer…".
- Completed and ended cards sit where the composer was, full column width, with **Start a new interview**.

Interaction and content:
- Ctrl/⌘+Enter or **Send** submits; Enter inserts a new line. Ctrl/⌘+Enter is ignored while an input method (IME) is composing text.
- The optimistic answer bubble looks slightly faded until the backend confirms it.
- Messages keep their identity across refetches (no remount when the optimistic bubble is confirmed or client ids are replaced), so screen readers never hear the whole conversation again.
- Smart scroll (stick to bottom): sending always scrolls the thread to the bottom. While the user is at the bottom, the thread stays pinned there as messages arrive or change height (indicator swapped for the reaction, next question revealed). If the user scrolled up, nothing moves and a round "jump to latest" button (down arrow, accessible name "Jump to latest message", 44px) appears; pressing it scrolls down, the button disappears, and focus moves to the composer so keyboard users are never dropped. The thread opens at the bottom without animating; later scrolling is smooth, instant under `prefers-reduced-motion`.
- Thinking indicator: the interviewer avatar and the label rendered with a shimmer effect (AI Elements `Shimmer`). With `prefers-reduced-motion` the label is shown as static muted text instead (only one of the two is rendered).
- Interviewer messages carry a small interviewer avatar (existing avatar component with an icon); the candidate's own messages have no avatar. Bubbles within a question sit close together; each new question starts a visibly separated group.
- Focus stays in the composer after sending and after the next question appears; new messages do not steal focus. After completion, focus moves to the completed card heading; after End interview, to the ended card heading.
- Thinking labels (constant `INTERVIEWER_THINKING_LABELS`): "Thinking…", "Reading your answer…", "Considering your answer…", "Taking notes…", "Mulling it over…", "Preparing the next question…". Slow label `INTERVIEWER_SLOW_LABEL`: "Still thinking…". Last-question label: "Wrapping up…". (Final wording can be tuned in plan.md; it must stay neutral.)
- Loading: skeleton bubbles. Transcript error: "Couldn't load the conversation." with **Retry**.

Accessibility and theming:
- The thread is a `role="log"` region (polite); new interviewer messages are announced once. The thinking indicator is announced once per send (the slow-label swap is not re-announced, or is announced at most once).
- The shimmer animation respects `prefers-reduced-motion` (static label). The 600ms reveal pause still applies.
- Visible focus states, targets at least 44x44px, 4.5:1 contrast in light and dark themes, theme tokens only, existing `ui/` primitives.
- No horizontal scroll at 360px.

## Constraints
- Backend contract (verified in `cuewise-be`, `interviews_route.py` / `interviews_schema.py` / `build_transcript`): `GET /interviews/{id}/messages` -> 200 `{ items: [...] }`, 404 when not found or not yours. Items are ordered by question position; each question is followed by its answer then its reaction when they exist. Questions have `created_at: null`. Only questions up to the session's current position are returned.
- `POST /interviews/{id}/messages` is unchanged: 201 `{ session, reaction: { id, text }, current_question | null }`; 404, 409 `QUESTION_NOT_CURRENT`, 409 `SESSION_NOT_IN_PROGRESS`, 422. The response does not include the stored answer's message id, so the client-side answer item needs a temporary id until the thread is refetched.
- Reactions are predefined neutral acknowledgements; the backend does not stream, so the indicator is a pending state, not real model output.
- Generating the next question may call an LLM; replies can take several seconds. cuewise-be's LLM budget defaults to 30s (`llm_total_budget_seconds`), and `start` can add a job-description summary capped at 10s, while the frontend's axios client and BFF forwarder time out after 15s (verified in both repos), so the answer and start routes need longer timeouts.
- cuewise-be saves a whole turn (answer, reaction, next question, advance) in one commit after the LLM call, as a compare-and-swap on the session position: a duplicate or late submit gets 409 `QUESTION_NOT_CURRENT` and nothing is saved twice.
- There is no end/abandon endpoint; End interview remains client-only.
- Next.js 16: `searchParams` async; no routing changes expected. The root layout's `viewport` export supports `interactiveWidget` (Next's `Viewport` type and `generate-viewport.md`). iOS Safari ignores `interactive-widget` and its `dvh` does not include the on-screen keyboard (platform limitation).

## Blockers
- None. Follow-ups needing backend work (out of scope): end/abandon endpoint, AI feedback, streaming replies, active-session lookup.

## Edge Cases
- **EC1:** Open an in-progress interview with earlier answers -> thread shows each shown question, its answer and reaction in order, ending with the current question; composer enabled.
- **EC2:** Open a fresh interview (no answers yet) -> thread shows only question 1; composer enabled.
- **EC3:** Send succeeds for a non-last question -> candidate bubble immediately, thinking indicator, then the reaction, then ~600ms later the next question; composer re-enabled with focus kept.
- **EC4:** Send succeeds for the last question -> "Wrapping up…" indicator, closing reaction, then ~600ms later the inline completed card; no composer, no End interview.
- **EC5:** Reload while a reply is pending -> the thread is rebuilt from the backend; if the answer was stored it appears with its reaction and the next question, otherwise the same question is current with an empty composer.
- **EC6:** Reload or revisit a completed interview -> full thread including the closing reaction, plus the completed card; no composer.
- **EC7:** Send returns 422 -> optimistic bubble removed, text restored in the composer, field error under it, composer enabled.
- **EC8:** Send returns 409 (either code) or 404 -> optimistic bubble removed, resync toast, interview and thread refetched; the backend's current state is rendered; text kept only if the same question is still current.
- **EC9:** Send fails with network/5xx or the response fails zod parsing -> optimistic bubble removed, text restored, generic toast, composer enabled; nothing written to the cache.
- **EC10:** Transcript load fails (network/5xx) while the interview loaded -> "Couldn't load the conversation." with **Retry**; no composer; Retry refetches.
- **EC11:** Transcript returns 404 -> the existing "Interview not found" state (same as the interview 404). (assumption — verify)
- **EC12:** Transcript response fails zod parsing -> treated as EC10.
- **EC13:** Reply takes longer than ~5 seconds -> indicator label switches once to "Still thinking…"; announced at most once.
- **EC14:** Two sends in a row -> the second random label differs from the first.
- **EC15:** Ctrl/⌘+Enter with an empty or whitespace answer, or over 2000 characters -> client validation message, nothing sent, no bubble.
- **EC16:** Enter alone -> a new line is inserted, nothing is sent.
- **EC17:** Double Send / Ctrl+Enter spam -> one request (composer disabled while pending and during the reveal pause).
- **EC18:** User scrolled up rereading when the reply arrives -> no forced scroll; the "jump to latest" button is shown while they are away from the bottom and scrolls down when pressed.
- **EC24:** The composer grows (multi-line answer) or the mobile keyboard opens while the user is at the bottom -> the composer and the latest message stay visible and the thread stays pinned. On Android Chrome the chat area shrinks above the keyboard and the window does not scroll. On iOS Safari (which does not resize the layout for the keyboard) the browser may pan the page so the header moves out of view while typing; this is accepted.
- **EC25:** The reply takes longer than the normal 15s request timeout but the backend saves the answer -> no error; the thinking indicator stays until the reply, and the reaction and next question appear as usual.
- **EC26:** The answer request times out or the network drops, outcome unknown -> the app checks the backend: if the answer was saved, the thread shows the answer, reaction and next question with no toast; if not, the bubble is removed, the text restored and a "couldn't confirm your answer was sent" toast shown. A resend either succeeds or gets 409 and resyncs to the saved turn; the backend never stores a duplicate.
- **EC27:** The user reloads or closes the tab with unsent text in the composer -> the browser's native leave warning appears; with an empty composer and no send in flight, no warning.
- **EC28:** A background refetch (window focus) is in flight when a send succeeds -> the new answer, reaction and next question stay on screen; the stale result never overwrites them.
- **EC29:** The session status is `abandoned` -> thread plus the ended card; no composer, no End interview.
- **EC30:** The interview and the thread were fetched at different moments and disagree about the current question -> the composer answers the thread's open question; a wrong guess is caught by the backend (409) and resyncs (EC8).
- **EC31:** Starting an interview takes longer than its timeout -> toast "Starting the interview took too long. Please try again."; the setup form re-enables with its values. (A session may have been created on the backend; there is no endpoint to find it.)
- **EC32:** The user reloads while a send is in flight -> the browser's leave warning appears; if they leave anyway, EC5 applies on return.
- **EC33:** The session expires while the composer has unsent text -> the redirect to sign-in happens without a leave warning.
- **EC34:** An answer contains a long URL or a long word without spaces -> it wraps inside the bubble; no horizontal scroll at 360px.
- **EC35:** A background refetch of the interview or thread fails while content is shown -> the current thread stays on screen (no error card); the next successful refetch updates it.
- **EC36:** The interview is in progress but the cached thread has no unanswered question (stale thread) and no send is pending -> "Couldn't load the latest question." with **Retry** in place of the composer; Retry refetches the thread and the composer returns.
- **EC37:** A keyboard user scrolled up presses the jump-to-latest button -> the thread scrolls to the latest message and focus moves to the composer.
- **EC19:** User confirms End interview, including while a send is pending -> composer replaced by the inline ended card; the thread stays visible; no request is made. A reply arriving afterwards still updates the cache but does not bring the composer back. (assumption — verify the pending reply case in the browser)
- **EC20:** User dismisses the End interview dialog -> interview continues, composer text kept.
- **EC21:** Session expires (401) during send or transcript load -> existing BFF/session-expired handling; nothing new.
- **EC22:** Very long answer (2000 characters, many line breaks) -> bubble wraps, keeps line breaks, no horizontal scroll at 360px.
- **EC23:** Two tabs answering the same interview -> the second send gets 409 and resyncs (EC8), and its thread then shows the other tab's answer.

## Acceptance Criteria
- [ ] **AC1:** The transcript is fetched via the BFF with a key from the interviews key factory, validated with zod, and the schema is covered by unit tests (valid payload, each role/kind, null `created_at`, rejects unknown kind).
- [ ] **AC2:** The session screen renders the thread in backend order with interviewer bubbles left (question bubbles labelled "Question N of M", lighter reaction bubbles) and candidate bubbles right, as plain text with line breaks preserved (EC1, EC2, EC22).
- [ ] **AC3:** Sending shows the candidate bubble immediately and the thinking indicator; on success the reaction appears, then the next question about 600ms later, without any extra button; the composer re-enables with focus kept (EC3).
- [ ] **AC4:** After the last answer, the closing reaction appears and then the inline completed card with **Start a new interview** replaces the composer; End interview is hidden (EC4).
- [ ] **AC5:** Reloading or revisiting rebuilds the thread from the backend, including reactions and the closing line; a completed interview shows the thread and the completed card (EC5, EC6).
- [ ] **AC6:** The thinking label is picked at random from `INTERVIEWER_THINKING_LABELS` at send, never repeats the previous pick, switches to `INTERVIEWER_SLOW_LABEL` after ~5s, and uses the wrap-up label on the last question; the picking logic is a pure helper with unit tests (EC13, EC14).
- [ ] **AC7:** Error handling: 422 removes the bubble, restores the text and shows the field error (EC7); 409/404 removes the bubble, toasts and refetches both caches (EC8); other failures remove the bubble, restore the text and toast (EC9); an unknown outcome (timeout, network, BFF 503) is checked against the backend and shown as sent when it was saved (EC25, EC26). No raw error text.
- [ ] **AC8:** A transcript load failure shows the error line with **Retry** and no composer; Retry refetches (EC10, EC12).
- [ ] **AC9:** Ctrl/⌘+Enter and **Send** submit; Enter adds a new line; Ctrl/⌘+Enter during IME composition does nothing; invalid input shows the validation message and sends nothing; only one request per send; leaving with unsent text shows the browser warning (EC15, EC16, EC17, EC27).
- [ ] **AC10:** Smart scroll: sending scrolls the thread to the bottom; while at the bottom the thread stays pinned as messages arrive or resize; when scrolled up nothing moves and the "jump to latest" button is shown (EC18, EC24).
- [ ] **AC11:** The chat area fills the viewport below the header and only the thread scrolls (the window does not, except iOS Safari's own keyboard panning, EC24); with the keyboard open on Android Chrome the composer sits above it; one centered column with the conversation title on top (title menu with the details and End interview, "N of M" on the right) on every screen size and no side panel; no horizontal scroll at 360px; legible in dark theme.
- [ ] **AC12:** End interview keeps the thread and replaces the composer with the inline ended card; dismissing the dialog keeps the composer text (EC19, EC20).
- [ ] **AC13:** Accessibility: the message list is a polite `role="log"` named "Interview conversation" (the scroll container itself is a labelled region, not a second log); the indicator is announced once per send; reduced motion shows a static label instead of the shimmer and scrolls instantly; the jump-to-latest button has an accessible name and moves focus to the composer (EC37); controls are keyboard operable, at least 44x44px, with visible focus.
- [ ] **AC14:** Service, schema, the BFF timeouts and new pure helpers (label picking, thread merging, thread view, error classification, no-response detection) have unit tests under `tests/` mirroring `src/`; typecheck, lint, tests and build pass.
- [ ] **AC15:** Only `POST /interviews/{id}/messages` and `POST /interviews` get longer timeouts (browser and BFF), other routes keep 15s; a start that still times out shows the specific "took too long" toast (EC31).
- [ ] **AC16:** Robustness: a focus refetch during a send never erases the new turn (EC28); an abandoned session shows the ended card (EC29); the composer answers the thread's open question (EC30); a failed background refetch keeps the screen (EC35); a stale thread shows the Retry notice instead of a dead end (EC36); the leave warning covers unsent text and in-flight sends but never blocks the session-expired redirect (EC27, EC32, EC33); `npm run lint` passes with the AI Elements files included.

## Out of Scope
- Free-form chat with the AI (asking questions, hints): the composer only answers the current question.
- Streaming replies or showing model reasoning: the backend returns whole responses.
- AI feedback, scoring or a results screen: not produced by the backend yet.
- Backend end/abandon, editing or deleting answers, and resuming from a list of interviews: no endpoints.
- Message timestamps in the UI: questions have no `created_at`, and the interview pace does not need them.
- Saving unsent drafts (answers stay out of browser storage); the leave warning covers accidental reloads only.
- Recovering a start that timed out after the backend created the session: needs a backend endpoint to list or find sessions.
- Changes to the interview setup screen or to `cuewise-be`.
