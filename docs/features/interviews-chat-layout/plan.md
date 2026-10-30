# Implementation Plan: Interviews Chat Layout

## Overview
Replace the step-by-step session screen with a chat thread built from `GET /interviews/{id}/messages`. The new screen has:
- a fixed-height chat column where only the thread scrolls;
- an answer composer at the bottom of that column;
- an optimistic answer bubble and a shimmering, randomly labelled thinking indicator;
- a 600ms reveal of the next question;
- one inline closing card for completed, ended and abandoned interviews.

The plan also fixes request timeouts that are shorter than the backend's LLM budget, for both answering and starting an interview.

Work is split into two parts. Each ends green (typecheck, lint, tests, build) and is a separate commit:
- **Part A, Chat core (Steps A0-A7):** the working chat in the browser.
- **Part B, Robustness (Steps B1-B5):** timeouts and answer recovery, the leave warning, and the start timeout. Part B only adds to Part A and never reworks it.

## Architecture & Design
Service -> query -> component, as in the answer flow.
- **Loading the thread:** a new `messages` service call and `useInterviewMessagesQuery` cache it under `interviewKeys.messages(id)`, a child of `detail(id)`. Because it's a child, the existing resync invalidation of `detail(id)` already refetches the thread (EC8).
- **After a successful answer:** the mutation writes the interview (as today) and merges the answer, reaction and next question into the cached thread with a pure `appendAnswerTurn`. No extra GET (user decision).
- **Fetch races:** before writing, the mutation cancels in-flight fetches of both keys. This covers a stale window-focus refetch landing after the merge and erasing the new turn.

**The thread is the source of truth for the conversation.** A pure `buildThreadView` turns the cached items plus client state into:
- **The items:** each gets a stable key, `question_id` plus `kind`.
- **The visible progress position.**
- **The open question:** the last question with no answer, taken from the unfiltered thread. The composer answers it, so the composer and the thread can never disagree.
- **The interview detail** still owns the session meta and status (completed or abandoned), through `getInterviewStep`.

Stable keys matter in a chat for three reasons:
- the optimistic bubble turns into the confirmed one without remounting;
- a refetch that swaps client ids for real ids doesn't remount bubbles;
- `role="log"` doesn't re-announce the conversation.

Client UI state lives in one hook, `use-interview-chat`:
- **The optimistic answer:** TanStack v5 "optimistic via `variables`", gone automatically on error.
- **The thinking label and the slow flag:** the timer starts in the submit handler.
- **A minimum thinking time:** `MIN_THINKING_MS`, so a fast reply doesn't make the indicator flash.
- **The reveal pause:** the next question (or the completion) is hidden for `REVEAL_DELAY_MS`.

`ActiveInterview` (route-private container, keyed by session id) wires the hook and passes props to dumb components. `InterviewsContainer` owns both queries and the not-found and error branches. Error screens only replace content when there is no cached data: a failed background refetch keeps what is on screen.

**Scrolling and layout (Part A):**
- **AI Elements (user decision):** `Conversation` and `ConversationContent`, built on `use-stick-to-bottom`, provide the scrolling thread. `Shimmer` renders the thinking label.
- **How they're added:** with the shadcn CLI, using the AI Elements registry recorded in `components.json`. The code lands in `src/components/ai-elements/` and is treated like `components/ui`: wrapped and configured through props. The one exception is a documented one-line bug fix in `shimmer.tsx` (Step A0).
- **Not used:**
  - `ConversationScrollButton`: its props spread after its own `onClick`, and it drops focus when it disappears. Our own `JumpToLatestButton` on `useStickToBottomContext` replaces it.
  - `Message`: it pulls in the `ai` SDK and the `streamdown` markdown renderer, which conflicts with plain-text rendering.
- **Reduced motion:** decided once with `useReducedMotion()` from `motion/react`.
- **The column:** `InterviewChat` is a fixed-height column below the sticky app header, sized from CSS variables that `AppShell` defines. Only the conversation scrolls.
- **Mobile keyboard (review round):** the root layout's `viewport` export sets `interactiveWidget: "resizes-content"` (supported by Next 16's `Viewport` type and documented in `generate-viewport.md`).
  - On Chrome for Android, the layout viewport then shrinks when the keyboard opens, so the column (`100dvh`) shrinks and the composer stays above the keyboard with the window still.
  - iOS Safari ignores this setting, and `dvh` doesn't include the keyboard there. Safari pans the page to keep the focused composer visible, so the header can move out of view while typing. That's accepted, and matches other chat web apps on iOS. The composer and the latest message stay visible.

**Timeouts and recovery (Part B, review round).** cuewise-be spends up to 30s on the LLM per question, and `start` can add a job-description summary of up to 10s. The frontend gives up after 15s everywhere.
- Two routes get their own budget, in both the axios call and the BFF forwarder:
  - `POST /interviews/{id}/messages` gets `ANSWER_TIMEOUT_MS` (45s);
  - `POST /interviews` gets `START_TIMEOUT_MS` (60s);
  - every other route keeps 15s.
- A new shared helper, `isNoResponseError`, recognizes "no response" errors: a timeout, a network drop or a BFF 503.
- **Answer recovery:** after a no-response error, the mutation fetches the interview fresh. If the question moved on, the answer was saved: it refetches the thread and resolves `recovered`.
- **Why recovery can still say "not saved":** cuewise-be saves the whole turn in one commit, after the LLM call, and the commit is a compare-and-swap. So if the network drops while the backend is still working, the check can wrongly say "not saved".
- **Covering that case:** an honest "couldn't confirm" toast, and the text is restored. A resend either succeeds or gets 409 and resyncs. No duplicate is ever stored.
- **Start recovery isn't possible:** there's no endpoint to list sessions, so a timed-out start shows a clear toast.
- **Leave warning:** `useWarnBeforeUnload` shows the browser's warning while there is unsent text or a send in flight. A small `src/lib/` unload guard lets the session-expired hard redirect bypass it.

## Spec Requirements -> Implementation
**Part A**
- AI Elements, the registry entry, the Shimmer fix, lint-clean generated code (AC16) -> A0
- Transcript schema, roles/kinds, chat copy and timing constants, abandoned step (AC1, EC12, EC29) -> A1
- `messages` service, key, query; thread merge with fetch cancel (AC1, AC3, AC5, EC1, EC2, EC5, EC6, EC28) -> A2
- Label picking, thread merge, thread view with open question and visible progress, abandoned status (AC3, AC4, AC6, AC11, EC3, EC4, EC14, EC29, EC30) -> A3
- Send flow, min thinking time, slow label, reveal timing, error handling for 422, 409, 404 and others (AC3, AC4, AC6, AC7, AC9, EC3, EC4, EC7-EC9, EC13, EC15-EC17) -> A4
- Bubbles, composer, shimmer indicator, jump button, closing card, progress bar, fixed-height layout, mobile keyboard (AC2, AC4, AC9-AC13, EC15, EC16, EC18-EC20, EC22, EC24, EC34, EC37) -> A5
- Container branches: loading, errors with or without cached data, 404, ended or abandoned, stuck state (AC5, AC8, AC12, EC10-EC12, EC19, EC21, EC29, EC35, EC36) -> A6
- Delete the step-by-step pieces; verify Part A (AC14) -> A7

**Part B**
- No-response detection, unload guard (AC7, AC15, AC16, EC25, EC26, EC31, EC33) -> B1
- Route timeouts in the service and the BFF (AC15, EC25, EC31) -> B2
- Answer recovery in the mutation, `unknown` classification (AC7, EC25, EC26) -> B3
- Hook outcomes, unconfirmed toast, leave warning wiring, start timeout toast (AC7, AC9, AC15, AC16, EC26, EC27, EC31-EC33) -> B4
- Verify Part B (AC14-AC16) -> B5

## Implementation Steps

### Part A: Chat core

A0. **AI Elements components** (user decision).
   - **Install:**
     - Add the registry to `components.json`: `"registries": { "@ai-elements": "https://registry.ai-sdk.dev/{name}.json" }`.
     - Run `npx shadcn@latest add @ai-elements/conversation @ai-elements/shimmer` (or `npx ai-elements@latest add conversation shimmer`). The files land in `src/components/ai-elements/`.
   - **What the registry check showed:**
     - `conversation` depends on `use-stick-to-bottom` (MIT, no dependencies of its own, React 19 peer) and the existing `button`.
     - `shimmer` depends on `motion` (14.x, React 19 peer).
     - Record in the task log why each dependency is needed: stick-to-bottom scrolling, and the requested shimmer.
     - Don't add `message` (it brings in `ai`, `streamdown`, `button-group`, `tooltip`).
   - **Shimmer fix (deviation, documented):** the registry `Shimmer` calls `motion.create()` inside render. That creates a new component type every render, so the animation restarts when props change, and `react-hooks/static-components` flags it (eslint-config-next uses react-hooks v7's recommended compiler rules).
     - Fix: hoist a module-level `motion.create` for `span`, keep the public API, and add a comment pointing to this plan.
       - As built: a module-level map of the pre-created `motion.p`, `motion.span` and `motion.div`. `as` is narrowed from any `ElementType` to those three tags, since the registry's open-ended `as` can't be supported without creating components in render.
     - Don't disable the lint rule.
   - Run lint and typecheck right after adding, and record anything else that gets flagged.
   - Test: skip.

A1. **Contract** (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`).
   - Constants:
     - `TRANSCRIPT_ROLES` and `TRANSCRIPT_KINDS` (mirroring cuewise-be);
     - `INTERVIEWER_THINKING_LABELS`, `INTERVIEWER_SLOW_LABEL`, `INTERVIEWER_WRAP_UP_LABEL`;
     - `THINKING_SLOW_AFTER_MS` (5000), `MIN_THINKING_MS` (500), `REVEAL_DELAY_MS` (600);
     - the thread error line and the stuck-state line.
   - Schemas: `transcriptItemSchema` (id UUID, question_id UUID, position int, role, kind, text, created_at string or null) and `transcriptSchema` (`items`).
   - Types by `z.infer`: `TranscriptItem`, `Transcript`. Also:
     - `ThreadItem`: a transcript item plus a stable `key` and a `pending` flag;
     - `ThreadView`: `items`, `position` and `openQuestion`;
     - `InterviewStep` gains `ended`, for an abandoned status.
   - Test: first. Seam: `transcriptSchema.safeParse`. Slices:
     - a mixed question/answer/reaction payload parses;
     - a question with null `created_at` parses;
     - an unknown kind is rejected;
     - an unknown role is rejected;
     - a missing `items` key is rejected. (AC1, EC12)

A2. **Service, keys, queries** (`interviews.services.ts`, `interviews.keys.ts`, `interviews.queries.ts`).
   - `interviewsService.messages(id)` sends `GET /interviews/{id}/messages` and parses with `transcriptSchema`.
   - Key `interviewKeys.messages(id)` sits under `detail(id)`. `useInterviewMessagesQuery(id)` uses the `skipToken` pattern.
   - `useAnswerInterviewMutation`:
     - on mutate it cancels in-flight fetches of `detail(id)` (which includes `messages(id)`);
     - on success it cancels again, then writes `detail(id)` and merges `messages(id)` via `appendAnswerTurn`;
     - on a resync error (409 or 404) it invalidates as today.
   - Test: first for the service. Seam: `interviewsService.messages` with `API` mocked (existing file). Slices:
     - it requests the right path and returns the parsed items;
     - a malformed payload rejects.
   - Keys and hooks: skip. (AC1, EC28)

A3. **Pure utils** (edit `get-interview-step.ts`; new `pick-thinking-label.ts`, `append-answer-turn.ts`, `build-thread-view.ts`).
   - `getInterviewStep`: `abandoned` gives `ended`; `completed` or a null question gives `completed`; otherwise `question`.
   - `pickThinkingLabel(previous, isLast, random = Math.random)`: the wrap-up label when `isLast`, otherwise a random label different from `previous`.
   - `appendAnswerTurn(items, { question, answer, response })` adds three things after the answered question:
     - the answer item, with a client id derived from the question id;
     - the reaction item;
     - the next question item, when present.

     It's a no-op when that question already has an answer, and it passes `undefined` through.
   - `buildThreadView(items, { pendingAnswer, hiddenQuestionId })` returns `{ items, position, openQuestion }`:
     - items are keyed `question_id:kind`;
     - a pending answer is appended unless already present;
     - the hidden question is dropped from `items`;
     - (as built) `hiddenReactionQuestionId` holds back a reaction that arrived while the `MIN_THINKING_MS` indicator is still up. The success write lands immediately, so on a fast reply the reaction would otherwise show alongside the indicator;
     - `position` is the last visible question's position;
     - `openQuestion` is the last unanswered question, from the unfiltered items.
   - Test: first. Seams: `getInterviewStep` (existing, previously confirmed); the three new functions (user-confirmed). Slices, in order:
     - `getInterviewStep`: `abandoned` returns `ended` (existing slices kept).
     - `pickThinkingLabel`:
       - returns the wrap-up label on the last question;
       - returns a label from the list;
       - never returns `previous`, even when `random` would pick it.
     - `appendAnswerTurn`:
       - a mid-interview turn appends answer, reaction and next question;
       - a final turn appends only answer and reaction;
       - a duplicate turn is a no-op;
       - an `undefined` thread stays `undefined`.
     - `buildThreadView`:
       - keys are `question_id:kind`, and a pending answer and its confirmed version share a key;
       - a pending answer is appended last;
       - a pending answer is dropped when the thread already has it;
       - the hidden question is removed and `position` stays on the previous question;
       - `openQuestion` is the unanswered last question, even while hidden;
       - `openQuestion` is undefined when every question is answered;
       - with no options, the items equal the input. (AC3, AC4, AC6, AC11, EC3, EC4, EC14, EC29, EC30)

A4. **Hook** (`modules/interviews/hooks/use-interview-chat.ts` replaces `use-answer-turn.ts`).
   - `use-interview-chat(sessionId, items, questionCount)` returns `{ view, thinkingLabel, isBusy, isRevealing, submit }`. `submit(question, text)` sends the trimmed text (what the backend stores):
     1. picks a label and starts the slow timer;
     2. awaits the mutation together with `MIN_THINKING_MS`;
     3. on success, hides the next question for `REVEAL_DELAY_MS`;
     4. on failure, `getAnswerErrorResult` picks the field message, the resync toast or the generic toast, and `submit` resolves to a failure result so the composer restores the text.

     `isBusy` covers both pending and revealing.
   - Test: after (manual: AC3, AC4, AC6, AC7, EC3-EC9, EC13, EC17).

A5. **Presentational components and layout** (`modules/interviews/components/`, plus shared files).
   - `ChatThread` wraps AI Elements:
     - **`Conversation` props:**
       - `initial="instant"`;
       - `resize` smooth, or instant when `useReducedMotion()` is true;
       - `role="region"` with `aria-label="Conversation"`, replacing its default `role="log"`.
     - **`ConversationContent`** with `className="gap-3"`. It holds:
       - a `role="log"` list (polite, `aria-label="Interview conversation"`) of `ChatMessage`s by stable key, where question bubbles get `mt-6 first:mt-0`;
       - then the `TypingIndicator`, inside the scrolled content but outside the log.
     - **`JumpToLatestButton`** sits inside the `Conversation` context.
     - **The pending bubble** calls `scrollToBottom()` from `useStickToBottomContext` when it mounts, so sending always scrolls.
   - `JumpToLatestButton` (replaces `ConversationScrollButton`):
     - it uses `isAtBottom` and `scrollToBottom` from the context;
     - it renders only when not at the bottom: outline, round, centered above the composer, `size-11`, `ArrowDownIcon`, `aria-label="Jump to latest message"`;
     - on click it scrolls and calls `onJump`, which the container uses to focus the composer.
   - `ChatMessage` (our own, following AI Elements' `Message` layout):
     - interviewer bubbles sit left with `ui/avatar` (an icon fallback, `aria-hidden`); question bubbles carry the "Question N of M" label;
     - reaction bubbles are muted and smaller;
     - candidate bubbles sit right with a primary tint and no avatar; a pending one is faded with a visually hidden "Sending";
     - text is plain, `whitespace-pre-wrap` and `[overflow-wrap:anywhere]`, at max ~80% width with `min-w-0`.
   - `TypingIndicator`:
     - the avatar plus the label in its own `role="status"`;
     - the label is `Shimmer` (`as="span"`), or plain muted text when `useReducedMotion()` is true. Only one of the two is rendered.
   - `AnswerComposer` (replaces `AnswerForm`):
     - react-hook-form + `answerFormSchema` + `TextAreaField`, at the bottom of the column, with safe-area padding (`pb-[env(safe-area-inset-bottom)]`);
     - grows with `field-sizing-content`, capped at `max-h-[40dvh]`;
     - Ctrl/⌘+Enter goes through `onKeyDown` on the form and is ignored during IME composition or while busy; plain Enter adds a new line;
     - counter, hint and **Send**;
     - while busy, it's `readOnly` with an `aria-disabled` **Send**;
     - it clears on submit and restores the text and field error on failure;
     - it's keyed by `openQuestion.id` and autofocuses only after an advance;
     - it exposes `focus()` (React 19 `ref` prop with `useImperativeHandle` calling `setFocus("answer")`) and reports `hasUnsentText` through an optional callback, which Part B uses.
   - `InterviewClosingCard`: a `variant` of `completed` or `ended`. It has a title, a line, **Start a new interview**, and focuses its heading on mount (`focusOnMount`).
   - `InterviewProgressBar`: "Question N of M · Role" plus End interview, below `xl` only.
   - `InterviewChat`: a fixed-height column. Its height is `100dvh` minus `AppShell`'s `--app-header-height` and content padding variables, with `min-h-0` on flex children. It stacks the progress bar, the thread (the only scroller), then the composer slot. The details card goes in `InterviewColumns`' aside, from `xl` only.
   - Shared changes:
     - `AppShell` defines `--app-header-height` and the content padding as CSS variables and uses them;
     - `TextAreaField` gets optional `hideLabel`, `readOnly` and `autoFocus`;
     - `InterviewColumns` gets an optional `asideClassName`, and its sticky top uses `--app-header-height`;
     - `InterviewDetailsCard` gets an optional progress row;
     - `InterviewSessionSkeleton` is reshaped into bubbles inside the same column.
   - Mobile keyboard: add `export const viewport: Viewport = { interactiveWidget: "resizes-content" }` to `src/app/layout.tsx`, keeping any existing viewport values. Re-read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-viewport.md` first (`AGENTS.md`).
   - Test: after (manual: AC2, AC4, AC9-AC13, EC15, EC16, EC18, EC20, EC22, EC24, EC34, EC37).

A6. **Containers** (`InterviewsContainer.tsx`, `ActiveInterview.tsx`).
   - `InterviewsContainer`:
     - also calls `useInterviewMessagesQuery(sessionId)`;
     - shows the skeleton only while a query is pending with no data;
     - shows not-found on a 404 from either query;
     - shows the error card only when the interview query failed with no data (EC35);
     - passes the client-only ended flag as `isEnded`.
   - `ActiveInterview` renders `InterviewChat`. Progress comes from `view.position`, and the composer answers `view.openQuestion`. The composer slot shows one of:
     - the thread error with Retry, when the thread failed with no data;
     - the ended card, when `isEnded` or the step is `ended` (it wins over a late reply, EC19);
     - the completed card, once completed and not revealing;
     - the stuck-state notice "Couldn't load the latest question." with **Retry** (thread refetch, no effect, no loop), when the step is `question` and there is no `openQuestion` while idle (EC36);
     - otherwise the composer.

     `JumpToLatestButton`'s `onJump` focuses the composer. End interview is hidden once completed, ended or abandoned.
   - Test: after (manual: AC5, AC8, AC12, EC10-EC12, EC19, EC21, EC29, EC35, EC36).

A7. **Cleanup and verify Part A.**
   - Delete `QuestionCard`, `ReactionCard`, `InterviewSession`, `InterviewCompletedPanel`, `InterviewEndedPanel`, `AnswerForm`, `use-answer-turn` and `COMPLETED_FALLBACK_TEXT`, if nothing else uses them (user decision).
   - Run `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build`. Check that `motion` appears only in the interviews route's client chunks.
   - Browser checklist against the local backend:
     - a 3-question interview, pinned at the bottom, and scrolled up while a reply arrives (the jump button scrolls and focuses the composer);
     - reload mid-reply and on a completed interview;
     - switching tabs during a send;
     - 422 via a long paste;
     - a 2-tab 409;
     - End while pending;
     - a long URL;
     - a forced stale thread (stuck notice);
     - 360px, dark theme, keyboard only (including Safari thread scrolling), reduced motion;
     - the composer growing;
     - the mobile keyboard on Android Chrome (the window stays still) and on iOS Safari (the composer and latest message stay visible).
   - Run `graphify update .`. Suggest the Part A commit message in task.md. No commit.
   - Test: n/a.

### Part B: Robustness

B1. **Shared no-response detection and unload guard** (`lib/config/api.helper.ts`, new `lib/unload-guard.ts`, `lib/config/axios.client.ts`).
   - `isNoResponseError(error)`: true for an axios error without a response (timeout or network), or a BFF 503 `SERVICE_UNAVAILABLE`.
   - `unload-guard`: `bypassUnloadWarning()` and `isUnloadWarningBypassed()`, a module-level flag. The axios interceptor calls `bypassUnloadWarning()` right before its session-expired `window.location.assign`.
   - Test: first. Seam: `isNoResponseError` in the existing `tests/lib/config/api.helper.test.ts`. Slices:
     - a timeout returns true;
     - a network error returns true;
     - a BFF 503 `SERVICE_UNAVAILABLE` returns true;
     - a 500 returns false;
     - a 409 returns false;
     - a plain `Error` returns false.
   - The guard: skip (checked manually, EC33).

B2. **Route timeouts** (`constants.ts`, `interviews.services.ts`, `app/api/[...path]/route.ts`).
   - Constants:
     - `ANSWER_TIMEOUT_MS` (45000) and `START_TIMEOUT_MS` (60000), each commented with the backend budget it covers;
     - `UNCONFIRMED_SEND_MESSAGE`, `START_TIMEOUT_MESSAGE`, and the leave-warning text.
   - Service: `answer` passes `timeout: ANSWER_TIMEOUT_MS`; `start` passes `timeout: START_TIMEOUT_MS`.
   - BFF forwarder: a small per-request timeout matcher. `POST interviews/{id}/messages` and `POST interviews` get their budgets; everything else keeps 15s. Re-read the Next Route Handler docs before editing.
   - Tests:
     - The service: first (existing seam). Slices:
       - `answer` passes the answer timeout;
       - `start` passes the start timeout.
     - The BFF: after, in the existing `tests/app/api/[...path]/route.test.ts`. Each long route gets its budget; a GET on the same path and other routes keep 15s. (AC15, EC25)

B3. **Answer recovery** (`get-answer-error-result.ts`, `interviews.types.ts`, `interviews.queries.ts`).
   - `getAnswerErrorResult` returns `unknown` when `isNoResponseError`; other 5xx stay `toast`.
   - Type `AnswerOutcome`: `answered` with the response, or `recovered`.
   - `useAnswerInterviewMutation` resolves to an `AnswerOutcome`. On a no-response error it fetches the interview fresh (`staleTime: 0`):
     - if the current question is no longer the one answered, it invalidates the thread and resolves `recovered`;
     - otherwise it rethrows.
   - Test: first. Seam: `getAnswerErrorResult` (existing). Slices:
     - a no-response error returns `unknown`;
     - a 500 still returns `toast`.
   - Mutation: after (forced timeouts, EC25, EC26).

B4. **Hook, composer and start wiring** (`use-interview-chat.ts`, new `src/hooks/use-warn-before-unload.ts`, `ActiveInterview.tsx`, `InterviewsContainer.tsx`).
   - `use-interview-chat`:
     - `recovered` ends the send with no pause and no toast;
     - `unknown` toasts `UNCONFIRMED_SEND_MESSAGE` and restores the text.
   - `useWarnBeforeUnload(when)`: registers `beforeunload` only while `when` is true and the guard isn't bypassed. A `useEffect` is right here because it syncs with a browser API.
   - `ActiveInterview` enables the warning while `hasUnsentText` or a send is pending.
   - `InterviewsContainer`: a start with a no-response error shows `START_TIMEOUT_MESSAGE`.
   - Test: after (manual: AC7, AC9, AC15, AC16, EC26, EC27, EC31-EC33).

B5. **Verify Part B.**
   - Run typecheck, lint, tests and build.
   - Browser checks:
     - forced timeouts (temporarily lowered): recovery when the answer was saved, the unconfirmed toast plus a resend that 409-resyncs, and the start timeout toast;
     - the leave warning with unsent text and while pending;
     - no warning on the session-expired redirect.
   - Run `graphify update .`. Suggest the Part B commit message in task.md. No commit.
   - Test: n/a.

## Layout & UX Design
- **Chat column:** it fills the viewport below the sticky header; only the thread scrolls.
  - From `xl`: the thread with the composer at the bottom, and the details card (progress and End interview) in the right column.
  - Below `xl`: a compact progress bar above the thread, and no details card.
  - With the Android keyboard open, the column shrinks. On iOS the page may pan, but the composer stays visible.
- **Bubbles:**
  - interviewer bubbles use `bg-muted`; candidate bubbles use `bg-primary` with `text-primary-foreground`; all are `rounded-2xl`;
  - spacing is 12px between bubbles and 24px between question groups;
  - labels use `text-xs text-muted-foreground`;
  - a pending bubble is at reduced opacity;
  - theme tokens only.
- **Composer card:** a top border; the hint "Ctrl/⌘ + Enter to send"; a right-aligned counter; **Send** at least 44px tall; bottom safe-area padding.
- **Closing card, thread error and stuck notice:** each takes the composer's place at full width.

## Affected Files & Patterns
- **Part A, edit:**
  - module: `constants.ts`, `interviews.schema.ts`, `interviews.types.ts`, `interviews.services.ts`, `interviews.keys.ts`, `interviews.queries.ts`, `utils/get-interview-step.ts`;
  - components: `InterviewColumns.tsx`, `InterviewDetailsCard.tsx`, `InterviewSessionSkeleton.tsx`;
  - shared and app: `shared/forms/TextAreaField.tsx`, `shared/sidebar/AppShell.tsx`, `app/layout.tsx` (viewport), `InterviewsContainer.tsx`, `ActiveInterview.tsx`;
  - config: `components.json`, `package.json` / lockfile.
- **Part A, new:**
  - utils: `pick-thinking-label`, `append-answer-turn`, `build-thread-view`;
  - hook: `use-interview-chat`;
  - components: `ChatThread`, `ChatMessage`, `TypingIndicator`, `JumpToLatestButton`, `AnswerComposer`, `InterviewClosingCard`, `InterviewProgressBar`, `InterviewChat`;
  - generated: `src/components/ai-elements/conversation.tsx`, `src/components/ai-elements/shimmer.tsx` (hoist fix);
  - tests.
- **Part A, delete:** the files listed in A7.
- **Part B, edit:** `lib/config/api.helper.ts`, `lib/config/axios.client.ts`, `app/api/[...path]/route.ts`, `interviews.services.ts`, `interviews.queries.ts`, `utils/get-answer-error-result.ts`, `use-interview-chat.ts`, `ActiveInterview.tsx`, `InterviewsContainer.tsx`, `constants.ts`, `interviews.types.ts`.
- **Part B, new:** `src/lib/unload-guard.ts`, `src/hooks/use-warn-before-unload.ts`, tests.
- **Patterns to follow:**
  - `useStartInterviewMutation` and `useAnswerInterviewMutation` for cache writes;
  - `get-answer-error-result` for error mapping;
  - the old `AnswerForm` for the form flow;
  - `focusOnMount` for ref-callback focus;
  - `InterviewMessageCard` for errors;
  - existing `route.test.ts` and `api.helper.test.ts` mocks;
  - AI Elements `Message` for alignment only.
- **Risks:**
  - The fixed-height column must match `AppShell`'s variables, or the window gains a small scroll. `Conversation` needs a bounded parent (`flex-1 min-h-0`).
  - Shared files (`TextAreaField`, `AppShell`, the root layout, the axios interceptor, the BFF) must keep today's behavior by default. The BFF matcher only lengthens the two POST routes. The viewport change affects every page, so check that the setup and sign-in pages still look right with the keyboard open on Android.
  - `motion` (about 940KB unpacked) must stay in the interviews route's chunks.
  - The `Shimmer` highlight briefly lowers contrast. The label is also exposed via `role="status"`, and reduced motion gets static text.
  - Generated files import `cn` from `@/lib/utils` (per CLAUDE.md); `components/ui` imports it from the `cn` package. No change. Only the documented Shimmer fix touches generated code.
  - Safari doesn't make the library's inner scroller keyboard-focusable. The fallback is the jump button plus the composer; verify it.
  - The iOS keyboard panning is accepted behavior (see the spec's EC24), not a bug.

## Testing Strategy
- Framework & command: Vitest; run `npm test`, or `npm test -- tests/modules/interviews/utils/build-thread-view.test.ts` for a single file. Typecheck with `npx tsc --noEmit`, lint with `npm run lint`, build with `npm run build`. Run all four at the end of each part.
- Seams:
  - user-confirmed: `transcriptSchema`; `interviewsService.messages`; `pickThinkingLabel`; `appendAnswerTurn`; `buildThreadView`;
  - existing and previously confirmed: `getAnswerErrorResult`; `getInterviewStep`; `interviewsService.answer` / `start`; `api.helper` (`isNoResponseError` joins `parseApiError` there);
  - BFF timeouts: a test after the change, in the existing route handler test file.

  Hooks and components are checked manually (no component-test tooling).

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | A1, A2 | first | schema + service |
| AC2 | A5 | after | bubble roles, labels, wrapping |
| AC3 | A3, A4 | first / after | view: pending, keys, dedupe, hidden; timing manual |
| AC4 | A3, A4, A6 | first / after | final merge; closing card manual |
| AC5 | A2, A6 | first / after | reload rebuilds from GET |
| AC6 | A3, A4 | first / after | label util; slow swap and min time manual |
| AC7 | A4, B1, B3, B4 | first / after | 422/409/other in A; `unknown` and recovery in B |
| AC8 | A6 | after | Retry refetches |
| AC9 | A5, B4 | after | keys, IME, validation, one request; leave warning in B |
| AC10 | A5 | after | stick-to-bottom |
| AC11 | A3, A5 | first / after | visible position; layout, Android keyboard |
| AC12 | A6 | after | ended card |
| AC13 | A5 | after | log/status, stable keys, reduced motion, 44px, jump focus |
| AC14 | A1-A3, A7, B1-B3, B5 | first | plus typecheck/lint/build per part |
| AC15 | B2, B4 | first / after | route timeouts; start timeout toast |
| AC16 | A0, A2, A3, A6, B1, B4 | first / after | lint-clean AI Elements; EC27-EC30, EC32, EC33, EC35, EC36 |
| EC1, EC2 | A2, A6 | after | real transcript render |
| EC3, EC4 | A3, A4 | first / after | merge + reveal |
| EC5, EC6 | A2, A6 | after | reload cases |
| EC7, EC8, EC9 | A4 | after | bubble removed, text restored, refetch |
| EC10, EC12 | A1, A6 | first / after | parse failure + Retry |
| EC11 | A6 | after | verify the 404 lands on not-found |
| EC13, EC14 | A3, A4 | first / after | |
| EC15-EC17 | A5 | after | |
| EC18 | A5 | after | jump button |
| EC19, EC20 | A6 | after | End during a pending send |
| EC21 | n/a | n/a | existing BFF handling |
| EC22, EC34 | A5 | after | 2000 chars and long URL at 360px |
| EC23 | A2, A4 | after | 2-tab check |
| EC24 | A5 | after | Android: column shrinks, window still; iOS: composer and latest message visible |
| EC25, EC26 | B1-B4 | first / after | forced timeouts |
| EC27, EC32, EC33 | B1, B4 | after | leave warning; none on the session-expired redirect |
| EC28 | A2 | after | focus refetch during a send |
| EC29 | A1, A3, A6 | first / after | abandoned -> ended card |
| EC30 | A3 | first | open question from the thread |
| EC31 | B2, B4 | after | start timeout toast |
| EC35 | A6 | after | failed background refetch keeps the screen |
| EC36 | A6 | after | stuck-state notice + Retry |
| EC37 | A5, A6 | after | jump button focuses the composer |

- Must verify, not assume:
  - the transcript order and ids after a real answer, and that `appendAnswerTurn` matches a refetch;
  - that a transcript 404 lands on not-found;
  - stick-to-bottom on mobile Safari and Chrome, and `interactiveWidget` on Android Chrome (the column shrinks, the window doesn't scroll);
  - that a canceled fetch doesn't surface as an error;
  - that the `Conversation` role override works, and that `motion` stays in the interviews chunks;
  - the reduced-motion static label, and that the Shimmer doesn't restart on label change;
  - that `JumpToLatestButton` moves focus, and keyboard scrolling in Chrome, Firefox and Safari;
  - the stuck-state notice with a forced stale thread;
  - (Part B) that the axios timeout overrides apply per request, the recovery and unconfirmed paths with forced timeouts, and that the session-expired redirect isn't blocked.
- Open questions: none.
- Known baseline failures: none (209/209 passing before this change).

## Blockers & Resolutions
- **No answer id in the response:** a client id is used, and keys and dedupe use `question_id:kind`.
- **Timeout mismatch (15s frontend vs 30-40s backend):** per-route budgets plus answer recovery (Part B, user decision). Start gets a clear toast only.
- **Focus versus a disabled composer:** while busy, the composer is `readOnly` with an `aria-disabled` **Send**; the submit is guarded; the remount restores focus.
- **Platform hint:** a static "Ctrl/⌘ + Enter to send" avoids a hydration mismatch.
- **The iOS keyboard (review round):** `dvh` ignores the keyboard on iOS Safari and `interactive-widget` isn't supported there. The fix is `resizes-content` for Android Chrome plus relaxed iOS behavior (spec EC24).
- Likely bugs, and how each is handled:
  - **A stale refetch erases a new turn:** cancel fetches on mutate and before the success write (EC28).
  - **The composer and thread disagree:** the composer answers `view.openQuestion` (EC30).
  - **Progress jumps ahead during the reveal:** it's taken from the visible position.
  - **The pending and confirmed bubbles both show for a frame:** `buildThreadView` dedupes.
  - **The log re-announces after a refetch:** stable keys.
  - **The indicator flashes on fast replies:** `MIN_THINKING_MS`.
  - **A network drop reads as "not saved":** the unconfirmed toast, then a resend resolves through 409 resync; no duplicates (EC26).
  - **A failed background refetch replaces the screen:** error UI only without cached data (EC35).
  - **The leave warning blocks the session-expired redirect:** the unload guard (EC33).
  - **An abandoned session shows a dead composer:** the `ended` step (EC29).
  - **A stale thread leaves no way forward:** the stuck notice with Retry (EC36).
  - **`Shimmer` remounts and fails lint:** the hoist fix (A0).
  - **The jump button drops focus:** `JumpToLatestButton` focuses the composer (EC37).
  - **Long unbroken text overflows:** `[overflow-wrap:anywhere]` (EC34).
  - **The optimistic text differs from what's stored:** the trimmed text is shown and sent.
  - **The counter counts UTF-16 units:** slightly stricter than the backend for emoji, accepted.

## Trade-offs & Rationale
- **Two parts, two commits** (review round): Part A gives a reviewable, working chat early. Part B's shared infrastructure changes (BFF, axios, unload guard) land on their own and are easy to review or revert.
- **Merge into the cache rather than refetch** (user decision): no extra request and no late reaction flicker. The cost is one pure, tested merge plus fetch cancellation.
- **The thread as the source of the open question,** with the detail kept for status: one source of truth for what's on screen.
- **`variables`-based optimistic UI:** nothing to roll back; stable keys plus dedupe make the hand-off seamless.
- **Recovery inside the mutation:** the queries layer owns refetching (CLAUDE.md).
- **Timers in the submit handler:** the only effect is `useWarnBeforeUnload`, which syncs with a browser API.
- **AI Elements `Conversation` + `Shimmer`** (user decision): copy-in shadcn-style code on the stick-to-bottom library already chosen. `Message` is skipped (markdown, AI SDK). `ConversationScrollButton` is replaced for focus handling. The Shimmer bug is fixed rather than silenced.
- **`interactiveWidget: "resizes-content"` rather than JS keyboard tracking (`visualViewport` listeners):** a one-line platform setting for Android Chrome. iOS gets the browser's default panning, which keeps the composer visible.
- **One `InterviewClosingCard` with a variant:** DRY; the "Early feedback" placeholder is dropped (user decision).
- **A `beforeunload` warning rather than saving drafts** (user decision): nothing is stored client-side.

## Project Rules Applied
- `cuewise-fe/CLAUDE.md`:
  - service -> query -> component; keys from the factory; refetch, cancel and cache writes in the queries layer; dumb components with containers owning hooks;
  - stateful logic in `use-*.ts` (feature hook in the module, feature-agnostic hook in `src/hooks/`, generic helpers in `src/lib/`); pure logic in `utils/`;
  - zod for responses; errors normalized via `api.helper`; toasts via `useMutationCallbacks`; plain-text AI output; no `useEffect` where state can be derived;
  - tests in `tests/` mirroring `src/`; `graphify update .`; no commits; new dependencies stated with reasons.
- Deviation from the Forms rule "disable the fieldset while pending": the composer is `readOnly` with an `aria-disabled` **Send** instead, which keeps focus.
- `AGENTS.md`: two Next changes, each preceded by reading the local docs:
  - the root layout's `viewport` export (`generate-viewport.md`, which lists `interactiveWidget`);
  - the timeout value inside the existing catch-all Route Handler (Part B).

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | mapped `InterviewsContainer`, `ActiveInterview`, the queries, `TextAreaField`, `InterviewDetailsCard` and their users |
| lean-ctx | read the interviews module, `TextAreaField`, shadcn `Textarea`, `api.helper`, the axios client, the BFF forwarder (15s), `components.json`, the theme tokens, the eslint config (react-hooks v7), Next's `Viewport` type (`interactiveWidget`), and the backend transcript route, `build_transcript`, `start`/`answer`, `record_turn` and the LLM budgets |
| ui-ux-pro-max (spec round) | bubble layout, composer, live regions, reduced motion, pending-bubble state |
| grill-me | confirmed the 5 seams, cache merge, deleting the old components; review rounds: stick-to-bottom, timeouts with recovery, the leave warning, AI Elements, the iOS keyboard, the A/B split |
| find-skills / registry check | AI Elements registry: `conversation` (`use-stick-to-bottom`, `button`), `shimmer` (`motion`, no reduced-motion handling, component created in render), `message` (`ai`, `streamdown`, not used) |
| security-review | no new auth surface; timeouts are path-scoped and server-side; the unload guard holds no data; plain-text rendering; nothing stored in browser storage |

## Ready to Implement
- Every spec requirement maps to a step; every step has a Test tag; every AC and EC is in the coverage map.
- Affected files are identified per part; blockers are resolved; likely bugs are listed with their handling; trade-offs are documented.
- Deviations from the spec are flagged:
  - the static Ctrl/⌘ hint;
  - a `readOnly` composer while busy;
  - the ended card drops the early-feedback placeholder;
  - the one-line fix inside the generated `shimmer.tsx`.
- Revisions:
  - the scroll model (AI Elements `Conversation` + `Shimmer`, with the gap fixes);
  - the timeouts and answer recovery;
  - the leave warning and its bypass;
  - stable keys, dedupe, visible progress and the open question;
  - fetch cancellation, the abandoned status, and error screens only without cached data;
  - the iOS / Android keyboard handling;
  - the split into Part A and Part B.

  All are reflected in spec.md.
