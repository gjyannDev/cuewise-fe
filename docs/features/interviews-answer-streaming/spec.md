# Feature: Interview Answer Streaming (client support for the backend's SSE turn)

## Problem
cuewise-be now streams an answer turn as Server-Sent Events (`POST /api/v1/interviews/{id}/messages/stream`; contract in `../cuewise-be/docs/features/sse-streaming/spec.md`). The interview chat still sends answers through the old JSON call and cannot use it:
- The candidate stares at a thinking indicator for the whole turn (decide call + write call, up to the backend's 30 s deadline), then the whole next question appears at once. The chat fakes a reveal with two timers (a 500 ms minimum for the indicator, a 600 ms pause before the question), which add waiting that the backend no longer needs.
- The Next.js `/api` forwarder reads the whole upstream body (`await upstream.text()`) before answering, forces `Accept: application/json`, and gives only `interviews/<id>/messages` the long timeout. Pointed at the stream route it would deliver every event at once at the end, with a 15 s cut-off.
- The browser's HTTP client (axios) cannot read a response incrementally, and the session-expired redirect to sign-in lives in its interceptor, so a plain `fetch` would silently lose it.

## Goal
A candidate sees the interview respond as it happens: progress as soon as they send, the interviewer's acknowledgement when it is decided, and the next question typing in. The result on screen and in the cache is exactly what the old call produced once the turn ends, and nothing about a half-finished turn is ever kept.

Measurable: with a running cuewise-be, the first sign of progress (the sent answer bubble and the thinking indicator) appears within 1 s of pressing send; the question text appears in more than one step for a multi-chunk reply; and every failure the old flow handled (resync, field error, toast, unknown outcome, expired session) still ends the same way.

## Project Conventions
- Rule files consulted: `CLAUDE.md` + `AGENTS.md` (project root; there is no `.claude/` directory), the user's global `~/.claude/CLAUDE.md`, the specs of `interviews-answer-flow`, `interviews-chat-layout` and `interviews-follow-up-questions`, the Next.js 16 docs in `node_modules/next/dist/docs/` (Route Handlers, streaming, `compress`), and the backend spec above.
- Constraints those rules impose on this feature:
  - Data flow service -> query -> component. The service is the only place that talks HTTP; components never import services; the hook/query layer owns cache updates and toasts.
  - Every external payload is parsed with zod; types come from `z.infer`. Event names and enum values mirror cuewise-be in `modules/interviews/constants.ts` ("keep in step" comments).
  - The browser only calls `/api/*` on Next.js; the JWT stays in the httpOnly cookie; the forwarder builds upstream headers from scratch (browser headers, including Authorization, are never forwarded). Server-only code stays in `.server.ts` / `server-only`.
  - AI text is untrusted: rendered as plain text, never as HTML. Show clear pending/streaming states and allow retry.
  - Components stay presentational; derived values and event handling are pure functions in `utils/`; stateful logic lives in a hook.
  - Vitest is node-only (`tests/**/*.test.ts`, no DOM, no React testing library), so the new logic must be pure units; tests mirror `src/` and builders go in `tests/helpers/`.
  - No new dependency (fetch, ReadableStream, TextDecoder, AbortController, zod and TanStack Query are already available). Nothing is committed or pushed, and no new branch is created (work stays on the current branch).
  - After code changes: typecheck (`npx tsc --noEmit`), `npm run lint`, `npm test`, `npm run build` (routing/config changed), then `graphify update .`.

## User Flow
1. The candidate presses send. Their answer appears at once as a pending bubble and the thinking indicator shows with a neutral label (as today; "Wrapping up…" on the last main question's thread).
2. The backend decides. If the interview is moving on, the interviewer's acknowledgement line appears under the answer as soon as it arrives.
3. The next question starts to arrive. The thinking indicator gives way to a question bubble that grows as text comes in, captioned "Question N of M" (moving on) or "Follow-up".
4. If the backend takes a draft back, the bubble empties and the replacement types in (or the whole question appears at once).
5. The turn ends: the finished, saved turn replaces the temporary lines in place. The composer takes the new open question. On the last question the closing card appears instead.
6. If the candidate leaves mid-turn, nothing was saved and the same question is still waiting when they return.

## Requirements

### Functional
**Forwarder (`/api/[...path]`)**
- For `POST interviews/<id>/messages/stream` the response body is passed through to the browser as it arrives, not read to the end first. Status and `Content-Type` pass through.
- The upstream request asks for `text/event-stream`; all other routes keep `Accept: application/json` and today's behaviour byte for byte.
- The stream route gets the answer budget (`ANSWER_TIMEOUT_MS`), not the 15 s default. The browser side and the forwarder share that one constant.
- The stream response is marked uncached and not transformable, and not buffered by proxies, so nothing between the app and the browser holds events back.
- Errors before the stream opens (any non-200) are returned like every other route (buffered JSON, same status and body); a session-ending 401 still clears the token cookie.
- An upstream that cannot be reached still yields the existing 503 `SERVICE_UNAVAILABLE`.

**Event contract (mirrors cuewise-be; defined once in the module, parsed with zod)**
- `status` with `phase` `received` | `deciding` | `writing`; `reaction` (`{id, text}`); `question.delta` (`{text}`); `reset` (`{}`); `done` (the existing answer response: session, nullable reaction, nullable current question); `error` (`{code, message, request_id}`).
- `done` and `error` are terminal. Unknown extra fields are ignored; unknown event names are skipped.

**Reading the stream (service)**
- A single service call sends the answer (same body rules as today: exactly `question_id` + trimmed `answer`) and yields typed events in order until the stream ends. It supports cancellation.
- Failures before the stream opens surface exactly as the old call's failures did, so the existing outcome mapping (resync, field message, toast, unknown) applies unchanged, including the session-expired redirect to sign-in with the same `next` and `expired=1` and the unload-warning bypass.
- The text parser is correct for: events split across any chunk boundary, several events in one chunk, `\r\n`, `\n` and `\r` line endings (the backend sends CRLF), comment lines (heartbeats), and multi-byte characters split between chunks.

**Chat behaviour**
- Sending still shows the pending answer bubble and keeps the composer busy (read-only) until the turn ends, so no second send is possible.
- Thinking indicator: shown from send until the first question text arrives, or until the turn ends if no text streams (a question delivered whole in `done`, or a completing answer). Label rules unchanged (random neutral label; "Wrapping up…" by `main_number`; "Still thinking…" after 5 s without text).
- Reaction: shown when its event arrives, as a temporary line under the answer.
- Question: a temporary bubble grows as `question.delta` text arrives. Its caption is inferred while streaming: a `reaction` event seen means "Question {answered main_number + 1} of {question_count}"; none seen means "Follow-up". The caption and spacing are corrected from the saved question when the turn ends.
- `reset` empties the temporary bubble; later text starts it again.
- When `done` arrives, the existing cache update runs once (the answer, the reaction if any, the next question if any are added after the answered question) and the temporary lines are replaced by the saved ones without remounting, duplicating, or re-announcing anything. `done` is authoritative over anything shown earlier.
- Temporary lines are never written to the cache.
- Remove the fake pacing: the 500 ms minimum thinking time, the 600 ms reveal pause, and the logic that hides the next question or the reaction behind them.

**Failures and cleanup**
- An `error` event ends the turn without saving: the temporary lines are discarded; `QUESTION_NOT_CURRENT` (and `SESSION_NOT_IN_PROGRESS`) resync like today; any other code shows the existing "Couldn't send your answer" toast and returns the text to the composer.
- A stream that ends without `done` or `error`, a connection drop, the browser-side time budget running out, or a known event with data that does not match the contract ends the turn as unconfirmed: discard the temporary lines, then run the existing recovery (re-fetch the interview; if it moved past the question, reload the conversation silently, otherwise show the existing "couldn't confirm" message and return the text).
- Leaving the screen (unmount) or the page cancels the request so the backend stops the model call; the cache is not touched.
- The old JSON answer call (`interviewsService.answer` and its tests) is deleted; the hook uses the stream only. Starting an interview stays on the JSON call (the backend does not stream it).

### Non-Functional
- **Latency feel:** progress is visible within 1 s of send; question text is not held back by any client-side timer.
- **No buffering:** events reach the browser as the backend sends them, through `next dev` and `next start` (including Next's default gzip).
- **Accessibility:** the growing question is not announced word by word. The thread's live region announces the finished question once (like any other message) and the status label as today; the temporary bubble is marked busy while it grows. Keyboard behaviour and focus handling are unchanged.
- **Scroll:** streaming text keeps the thread pinned to the bottom for a reader who is at the bottom, and leaves a reader who scrolled up alone; sending still jumps to the bottom.
- **Security and privacy:** the token never reaches JS; no answer, question or token text is logged; AI text renders as plain text.
- **Maintainability:** one code path for answers; event handling is pure and unit-tested.

## UX Requirements
- A fast reply looks as fast as it is: no artificial minimum for the indicator and no pause before the question.
- The typed-in question reads the same as a saved one (same bubble style, plain text, `whitespace-pre-wrap`).
- Reduced-motion users get the same text without animation (text simply appears; the shimmer rules are unchanged).
- Errors use the existing wording and surfaces (toasts, the field message under the composer); no new inline error UI.

## Constraints
- Depends on the cuewise-be stream endpoint (built on its `feat/sse-streaming` branch; not yet committed or deployed). The client is not required to work against a backend without it.
- Next.js 16 App Router with `cacheComponents` on; the forwarder is a Route Handler and must stay dynamic. TypeScript strict, no `any`.
- Browser `EventSource` cannot POST, so the stream is read with `fetch` and a body reader.
- Local end-to-end checks need cuewise-be running with its `.env` migrated to `LLM_PROVIDERS` / `LLM_GOOGLE_*`.

## Blockers
- None. All decisions settled in the spec interview (2026-11-02): replace and delete the JSON answer call; drop both fake delays; show the reaction on arrival; announce the finished question once; infer the caption from the events and correct it at `done`; discard text and recover on a dropped stream; reuse the existing error outcomes; skip unknown event names but recover on bad known data; unit tests plus a manual end-to-end check.
- Assumptions to verify:
  - `next start` (gzip) and the dev server pass chunks through the forwarder without holding them back *(assumption — verify by hand; if gzip buffers, mark the stream response non-transformable or disable compression for it)*.
  - The backend's `done` body keeps the shape of the old answer response, and its `reaction` event carries the same `{id, text}` as the one in `done` *(assumption — verify against the backend)*.
  - Aborting the browser request reaches the backend as a client disconnect through the forwarder *(assumption — verify by hand against the backend log: `cancelled=true`)*.

## Edge Cases
- **EC1:** 401 with a session-ending code before the stream opens -> the cookie is cleared and the browser goes to sign-in with `next` and `expired=1`, with the unload warning bypassed, exactly as the old call did.
- **EC2:** 404, or 409 `QUESTION_NOT_CURRENT` / `SESSION_NOT_IN_PROGRESS`, before the stream opens -> resync: the existing "already answered" toast and a refetch of the interview.
- **EC3:** 422 with an answer field message before the stream opens -> the message shows under the composer and the text comes back.
- **EC4:** The request gets no response (network drop, forwarder 503, upstream unreachable) -> unconfirmed: the existing recovery runs.
- **EC5:** An `error` event with `QUESTION_NOT_CURRENT` -> temporary lines discarded, resync as in EC2. Any other `error` code -> temporary lines discarded, the "Couldn't send your answer" toast, the text back in the composer.
- **EC6:** The stream ends with neither `done` nor `error` (connection dropped mid-turn) -> temporary lines discarded, then recovery.
- **EC7:** Recovery finds the interview moved past the answered question (the backend saved just before the drop) -> the conversation reloads silently; no toast; the turn appears.
- **EC8:** Recovery finds the same question still current -> the "couldn't confirm" toast and the text back in the composer.
- **EC9:** An event name the client doesn't know -> skipped; the turn continues.
- **EC10:** A known event whose data doesn't match the contract, or a `done` that doesn't match the answer response -> treated as EC6 (discard, recovery).
- **EC11:** `reset` arrives (once, several times, or before any text) -> the temporary bubble is emptied; later text starts it again; a `reset` with nothing shown is harmless.
- **EC12:** A follow-up turn (no `reaction` event) -> the bubble is captioned "Follow-up" while it types, no reaction line appears, and `done` carries `reaction: null`.
- **EC13:** A follow-up that falls back to the next main question (no `reaction` event, but `done` carries a reaction and a main question) -> the bubble starts as "Follow-up", and at `done` the caption becomes "Question N of M" and the reaction line appears; any partial text was taken back by a `reset` or replaced by the saved question.
- **EC14:** The answer completes the interview (`reaction` event, no writing, `done` with no next question) -> the "Wrapping up…" label shows, the final reaction appears on arrival, no question bubble streams, and the completed card appears when the turn ends.
- **EC15:** Events split across chunks, several events in one chunk, CRLF / LF / CR endings, and a multi-byte character split between two chunks -> parsed into the same events as a single clean chunk.
- **EC16:** Heartbeat comment lines (`: ping`) -> ignored; nothing changes on screen.
- **EC17:** The candidate leaves the page or the screen unmounts mid-turn -> the request is cancelled, the cache is unchanged, and returning shows the same question open.
- **EC18:** The candidate tries to send again while a turn is running -> blocked as today (the composer is read-only and busy).
- **EC19:** The reader scrolled up while text streams -> not pulled down; a reader at the bottom stays pinned; sending still scrolls to the bottom.
- **EC20:** No terminal event within the answer budget -> the request is cancelled and treated as EC6.
- **EC21:** No question text for 5 s -> the label changes to "Still thinking…" as today; it stays until text arrives or the turn ends.
- **EC22:** `done` arrives after temporary lines were shown -> they are replaced by the saved lines in place: no duplicate, no remount, no second announcement. If the saved reaction's id differs from the temporary one, the saved one wins.
- **EC23:** The question arrives whole in `done` with no `question.delta` events (the backend's bank fallback) -> the indicator stays until the turn ends, then the question appears; no typing effect.
- **EC24:** The stream ends with `done` but the user already left (unmounted) -> nothing is written to the cache and nothing is shown.

## Acceptance Criteria
**Forwarder**
- [ ] **AC1:** A chunk written by the upstream is readable from the forwarder's response before the upstream body has ended (it streams; it does not buffer).
- [ ] **AC2:** For `interviews/<id>/messages/stream` the upstream request carries `Accept: text/event-stream` and the answer-budget timeout; response status and `Content-Type` pass through and the response is marked uncached, not transformable, and not proxy-buffered.
- [ ] **AC3:** For the stream route, a non-200 upstream (401, 404, 409, 422, 5xx) is returned as buffered JSON with the same status and body; a 401 with a session-ending code clears the token cookie; an unreachable upstream returns the existing 503 body (EC1-EC4).
- [ ] **AC4:** Every other forwarded route behaves as before: the existing forwarder tests pass unchanged.

**Contract and reading**
- [ ] **AC5:** The six event schemas accept valid payloads and reject malformed ones; `done` is the existing answer response schema; unknown fields are ignored (EC9, EC10).
- [ ] **AC6:** The SSE parser yields identical events for the same stream cut at every possible chunk boundary, with LF, CRLF and CR endings, with comment lines present, and with a multi-byte character split between chunks (EC15, EC16).
- [ ] **AC7:** The service yields events in order until `done` / `error` / end of stream, sends exactly `question_id` and the trimmed `answer` (extra keys stripped), and stops when cancelled (EC17).
- [ ] **AC8:** Pre-stream failures from the service map to the same result kinds as the old call: 404 and 409 resync codes -> resync, 422 answer field -> field message, other -> toast, no response -> unknown (EC2-EC4).
- [ ] **AC9:** A pre-stream 401 with a session-ending code redirects to sign-in with `next` and `expired=1` and bypasses the unload warning, the same as the axios interceptor (EC1).

**Turn state**
- [ ] **AC10:** A pure reducer turns the event sequence into view state: phase, reaction, question text, inferred caption (main number or follow-up), reset handling, and terminal outcome. The sequences for a move-on turn, a follow-up turn, a fallback turn, a completing turn, a reset, a whole-question `done`, and an error each produce the expected state (EC5, EC11-EC14, EC23).
- [ ] **AC11:** `done` is authoritative: the final state equals the saved turn regardless of earlier temporary state (EC13, EC22).
- [ ] **AC12:** The thread view shows the temporary reaction line and question bubble after the pending answer, without them being part of the cached transcript, and replaces them by the saved lines with unchanged keys (EC22).

**Chat**
- [ ] **AC13:** Sending shows the pending answer and the thinking indicator immediately; the indicator stays until the first question text or the end of the turn; labels follow the existing rules, including "Wrapping up…" and "Still thinking…" (EC14, EC21).
- [ ] **AC14:** The reaction appears when its event arrives and the question types in after it; no client-side timer delays either.
- [ ] **AC15:** The streaming bubble's caption follows the inferred rule and is corrected at `done` (EC12, EC13).
- [ ] **AC16:** On `done` the cache gets the same update the old call produced (the existing append logic) exactly once; temporary state is cleared; the composer takes the next open question or the closing card appears (EC14, EC22).
- [ ] **AC17:** An `error` event, a dropped or timed-out stream, or malformed known data discards the temporary lines and ends as specified: resync, toast, or recovery with silent reload or the "couldn't confirm" message; the text returns to the composer except after a silent recovery (EC5-EC8, EC10, EC20).
- [ ] **AC18:** Unmounting cancels the request and leaves the cache untouched (EC17, EC24).
- [ ] **AC19:** `MIN_THINKING_MS`, `REVEAL_DELAY_MS`, the hidden-question and hidden-reaction logic, and `interviewsService.answer` (with its tests and fixtures) no longer exist; no references remain.

**Accessibility and scroll**
- [ ] **AC20:** The growing question is outside the polite live region or marked busy so it is not announced in fragments; the finished question is announced once; the status label is still announced (checked by hand).
- [ ] **AC21:** A reader at the bottom stays pinned while text streams; a reader scrolled up is not moved; sending scrolls to the bottom (checked by hand, EC19).

**Quality gates**
- [ ] **AC22:** `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build` pass.
- [ ] **AC23:** A manual end-to-end run against a running cuewise-be is recorded in `task.md`: a move-on turn, a follow-up turn, the last question, a mid-turn page leave (backend log shows the call cancelled), and the same flow through `next start` confirming events are not buffered by gzip.

## Out of Scope
- Streaming the **start** of an interview (`POST /interviews`): the backend does not stream it.
- Resuming or replaying a dropped stream (`Last-Event-ID`): a dropped turn is recovered by re-checking the interview, as the backend intends.
- A fallback to the JSON endpoint, or support for a backend without the stream route.
- Showing which phase the backend is in beyond the existing neutral labels (no "deciding"/"writing" words on screen), the follow-up gap, or any evaluation of the answer.
- A new inline error surface, a retry button for the stream, or any change to the end-of-interview or setup screens.
- Component or hook unit tests (the repo has no DOM test setup); they are covered by the manual check.
- Changing the backend; the backend work is done in cuewise-be.
