# Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn)

## Overview
The chat sends answers through cuewise-be's `POST /interviews/{id}/messages/stream`. The candidate sees the turn as it happens:
- the reaction line as soon as it is decided;
- the next question typing in;
- the saved turn swapped in at `done`.

The fake reveal timers and the JSON answer call go away. Every failure ends the way it does today.

## Architecture & Design
The data flow keeps the project's **service → query → component** shape. Each layer gets one streaming job:

| Layer | File | Job |
|---|---|---|
| Transport (generic) | `src/lib/api/sse.ts` | bytes → raw SSE frames |
| Errors (shared) | `src/lib/config/api.helper.ts` | fetch error types that `parseApiError` / `isNoResponseError` already understand |
| Session (shared) | `src/lib/config/session-redirect.ts` | the expired-session redirect, used by axios and the stream |
| Forwarder | `src/app/api/[...path]/route.ts` | a streaming branch: pass the body through unbuffered, pass the disconnect on |
| Service | `modules/interviews/services/interviews.services.ts` | `answerStream()`: POST, read frames, yield typed events |
| Contract | `modules/interviews/{constants,schemas,types}` | event names, payload schemas, `parseAnswerStreamEvent` |
| State | `modules/interviews/utils/reduce-answer-stream.ts` | a pure reducer: events → live turn state |
| Query | `modules/interviews/queries/interviews.queries.ts` | the mutation consumes the stream, owns cancel and timeout, writes the cache once at `done` |
| Hook | `modules/interviews/hooks/use-interview-chat.ts` | `useReducer` over the reducer; labels; no fake timers |
| View | `modules/interviews/utils/build-thread-view.ts` | transient reaction and question lines after the pending answer; keys by position |
| Components | `ChatThread`, `ChatMessage`, `ActiveInterview` | `aria-busy` while streaming; no visual redesign |

**Key ideas:**
- **The saved turn arrives only in `done`.** Everything before it is transient view state, never cache, so a failure has nothing to roll back.
- **Keys move from `question_id:kind` to `position:kind`.** The streaming question's position (the answered question's position + 1) is known before its id, so the bubble keeps its key and its place when `done` lands.
- **Cancellation is a subscription.** The query hook creates an AbortController per send and aborts it on unmount, combined with the 45 s browser budget. A send aborted by unmount returns `cancelled` and writes nothing. A send aborted by the budget is treated as unconfirmed and recovered.

## Spec Requirements -> Implementation
- Forwarder streams, `Accept`, timeout, headers, pre-stream errors, 503, other routes unchanged (AC1–AC4) → Step 5
- Event contract and parsing (AC5) → Step 1
- SSE parser (AC6) → Step 2
- Service: body rules, ordered events, cancellation (AC7) → Step 6
- Pre-stream failures map to the same outcomes (AC8) → Steps 3, 6, 7
- Expired session redirect on the stream path (AC9) → Step 4
- Pure reducer, `done` authoritative (AC10, AC11) → Step 8
- Transient lines in the view, stable keys (AC12) → Step 9
- Indicator, labels, reaction on arrival, typing, caption inference, single cache update, failures (AC13–AC17) → Steps 8, 9, 10, 11
- Cancel on unmount, nothing written (AC18) → Step 10
- Removals: fake timers, hidden-line logic, `interviewsService.answer` (AC19) → Steps 6, 11, 13
- `aria-busy` and scroll (AC20, AC21) → Step 12
- Quality gates and manual end-to-end run (AC22, AC23) → Step 14

## Implementation Steps

### Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`)
- **Constants:** `ANSWER_STREAM_EVENTS` (`status`, `reaction`, `question.delta`, `reset`, `done`, `error`), `TURN_PHASES` (`received`, `deciding`, `writing`) and `TERMINAL_STREAM_EVENTS`, each with the "mirrors cuewise-be `interviews_constants.py` `StreamEvent` / `TurnPhase`; keep in step" comment.
- **Schemas:** one zod schema per event payload, with unknown keys stripped (zod's default):
  - `status` → `{phase}`;
  - `reaction` → the existing reaction object (`{id, text}`);
  - `question.delta` → `{text}`;
  - `reset` → `{}`;
  - `done` → the existing `answerResponseSchema`;
  - `error` → `{code, message, request_id}` (request id nullable).
- **Types:** inferred. `AnswerStreamEvent` is a discriminated union by `event`.
- **`parseAnswerStreamEvent(frame)`:** takes a raw `{event, data}` frame and returns one of:
  - `{kind: "event", event}`;
  - `{kind: "unknown"}` for a name the client doesn't know;
  - `{kind: "invalid"}` for bad JSON or a payload that doesn't match its schema.
- **Test: first.** Seam (user-confirmed): `parseAnswerStreamEvent` plus the event schemas. Slices:
  1. Each of the six events parses to its typed form.
  2. Extra fields are ignored (EC9's sibling: forward-compatible data).
  3. An unknown event name → `unknown` (EC9).
  4. Bad JSON, a missing field, a wrong `phase` → `invalid` (EC10).
  5. A `done` that doesn't match the answer response (no `reaction` key; a follow-up with `reaction: null` is valid) → `invalid` (EC10).

### Step 2: The SSE parser (`src/lib/api/sse.ts`)
- **`readSseStream(body)`:** an async generator over a `ReadableStream<Uint8Array>` that yields `{event, data}` frames.
  - It decodes with a streaming `TextDecoder`, so multi-byte characters split across chunks stay whole.
  - It splits lines on CRLF, LF or CR, including a CR at the end of one chunk followed by an LF at the start of the next.
  - It joins multi-line `data:` fields, ignores comment lines (`:`), and defaults the name to `message`.
  - It dispatches a frame on the blank line and drops an unterminated frame at end of stream.
  - It releases the reader when closed early.
- It knows nothing about interviews, which is why it lives in `lib/api`.
- **Test: first.** Seam (user-confirmed): `readSseStream`, in `tests/lib/api/sse.test.ts`. Slices:
  1. One frame, LF.
  2. Several frames in one chunk.
  3. CRLF and CR endings.
  4. The same body cut at every byte boundary yields identical frames (AC6).
  5. A multi-byte character split between chunks (EC15).
  6. A comment line and a ping-only frame produce no frame (EC16).
  7. A multi-line `data:`.
  8. An unterminated last frame is dropped.
  9. Closing the generator early cancels the reader.

### Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`)
- **`ApiResponseError`:** an error response that wasn't 2xx, with `status` and the parsed body (or `null` when the body isn't JSON).
- **`NoResponseError`:** no response at all (fetch rejected, or the stream's time budget ran out before a response).
- `parseApiError` reads status, code, message and field errors from `ApiResponseError` the way it reads them from an `AxiosError`. `isNoResponseError` returns true for `NoResponseError`, and for an `ApiResponseError` 503 with code `SERVICE_UNAVAILABLE`, exactly as for axios.
- The axios behaviour is unchanged.
- **Test: first.** Seam (user-confirmed): `parseApiError` and `isNoResponseError` in `tests/lib/config/api.helper.test.ts` (new). Slices:
  1. A 409 `ApiResponseError` → status and code.
  2. A 422 → field errors with the `body.` prefix stripped.
  3. A non-JSON body → generic message.
  4. `NoResponseError` → no-response.
  5. A 503 `SERVICE_UNAVAILABLE` → no-response.
  6. The existing axios cases are unchanged (run the current callers' tests).

### Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`)
- **`redirectIfSessionEnded(status, body)`:** the interceptor's logic moved as is. It runs only in the browser, on a 401 with a session-ending code, outside public auth routes. It then:
  - clears the query cache;
  - bypasses the unload warning;
  - does a hard navigation to sign-in with `next` (path + search) and `expired=1`.
- The axios interceptor calls it, and so will the stream service (Step 6).
- **Test: first.** Seam (user-confirmed): `redirectIfSessionEnded` with a stubbed `window` and a mocked query client, in `tests/lib/config/session-redirect.test.ts`. Slices:
  1. A 401 `TOKEN_EXPIRED` on `/interviews?session=x` → clears the cache, bypasses the warning, and assigns `/signin?next=%2Finterviews%3Fsession%3Dx&expired=1` (EC1, AC9).
  2. A 401 with `INVALID_CREDENTIALS` → nothing.
  3. On a public auth route → nothing.
  4. A non-401 → nothing.
  5. No `window` (server) → nothing.

### Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`)
- **A `STREAMING_POSTS` table** (`/^interviews\/[^/]+\/messages\/stream$/`, with the `ANSWER_TIMEOUT_MS` budget) sits next to `SLOW_POSTS`. For a matching POST:
  - The upstream request uses `Accept: text/event-stream`; others keep `application/json`.
  - The upstream fetch's signal combines the budget with the incoming `request.signal`, so a browser that leaves disconnects cuewise-be (EC17).
  - A 200 response returns `upstream.body` as the response body unread, with `Content-Type` passed through and `Cache-Control: no-cache, no-transform` plus `X-Accel-Buffering: no`. `no-transform` is what Next's gzip respects.
  - A non-200 response follows the existing buffered path: same status and body, and a session-ending 401 clears the cookie.
- Every other route is untouched.
- **Test: first.** Seam (user-confirmed): the route's exported `POST`, with `fetch` mocked to return a chunked `ReadableStream`. Slices:
  1. The first chunk is readable from the response while the upstream is still open (AC1).
  2. `Accept: text/event-stream`, the answer budget passed to `AbortSignal.timeout`, and the response headers (AC2).
  3. Aborting the incoming request aborts the upstream signal (EC17).
  4. An upstream 409, 422 or 404 is returned buffered, with the same status and body (AC3, EC2, EC3).
  5. An upstream 401 `TOKEN_EXPIRED` clears the cookie (EC1).
  6. Fetch rejects → the existing 503 body (EC4).
  7. `POST interviews/<id>/messages` still gets `Accept: application/json` and is buffered (AC4). The existing tests stay green.

### Step 6: The service (`modules/interviews/services/interviews.services.ts`)
- **`answerStream(id, params, signal)`:** an async generator.
  - It parses the body with `answerRequestSchema` as today.
  - It sends `fetch("/api/interviews/<id>/messages/stream", POST, JSON, Accept: text/event-stream, signal)`.
  - **Before the stream opens:**
    - fetch rejects with an AbortError → rethrow it (the query decides what it means);
    - any other rejection → `NoResponseError`;
    - not 2xx → read the JSON body, call `redirectIfSessionEnded`, throw `ApiResponseError`.
  - **After it opens:** it yields the typed events from `readSseStream` + `parseAnswerStreamEvent`, skipping `unknown`. It throws `AnswerStreamError` (`interrupted`) on `invalid`, and stops after a terminal event.
- **`AnswerStreamError`** (`modules/interviews/utils/answer-stream-error.ts`) has two kinds:
  - `event`, with the error event's code and message;
  - `interrupted`, for a stream that ended without a terminal event, bad known data, or a budget that ran out mid-stream.
- **Delete `answer()`.** Its tests move here; `start`, `get` and `messages` are untouched.
- **Test: first.** Seam (user-confirmed): `interviewsService.answerStream` with `fetch` stubbed globally. Slices, the ported cases first:
  1. The body is exactly `question_id` and the trimmed `answer`, with extra keys stripped, to `/api/interviews/<id>/messages/stream`.
  2. A follow-up `done` (`reaction: null`) is yielded.
  3. A `done` missing `reaction` → `AnswerStreamError` `interrupted` (EC10).
  4. Events are yielded in order and it stops after `done` (AC7).
  5. An unknown event is skipped (EC9).
  6. A 409 `QUESTION_NOT_CURRENT` → `ApiResponseError` (EC2).
  7. A 422 → `ApiResponseError` with field errors (EC3).
  8. A 401 `TOKEN_EXPIRED` → `redirectIfSessionEnded` called, then it throws (EC1).
  9. Fetch rejects → `NoResponseError` (EC4).
  10. An abort before or during the stream → rethrown, and the body reader is released (EC17).

### Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`)
- `AnswerStreamError`:
  - `event` with a code in `RESYNC_ERROR_CODES` → `resync`;
  - any other `event` → `toast`;
  - `interrupted` → `unknown`.
- Pre-stream errors already flow through the Step 3 helpers unchanged: 404 or a resync 409 → resync, a 422 answer → field, no response → unknown, otherwise toast.
- **Test: first.** Seam (user-confirmed): `getAnswerErrorResult`. Extend the existing test file with:
  1. A stream error event `QUESTION_NOT_CURRENT` → resync, and `INTERNAL_ERROR` → toast (EC5).
  2. `interrupted` → unknown (EC6, EC10, EC20).
  3. `ApiResponseError` 404 / 409 / 422 → resync / resync / field (EC2, EC3).
  4. `NoResponseError` → unknown (EC4).
  5. The existing axios cases are unchanged.

### Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`)
- **`reduceAnswerStream(state, event)`** is pure. The state holds:
  - `phase`;
  - `reaction` (or none);
  - `questionText` and `hasText`;
  - `sawReaction`;
  - `done` (the saved turn) or `error`.
- **Its rules:**
  - `status` sets `phase`.
  - `reaction` stores it and sets `sawReaction`.
  - `question.delta` appends.
  - `reset` empties the text (harmless when empty).
  - `done` and `error` are terminal; later events are ignored.
- An initial state for a new send.
- **`inferStreamingQuestion(answered, sawReaction)`** returns the streaming bubble's `position` (answered + 1), `question_kind` and `main_number`:
  - with a reaction → `main`, answered `main_number` + 1;
  - without → `follow_up`, the same `main_number`.
- **Test: first.** Seam (user-confirmed): `reduceAnswerStream` folded over event sequences, plus `inferStreamingQuestion`. Slices:
  1. A move-on turn: status, reaction, status, deltas, done (EC14's sibling).
  2. A follow-up turn: no reaction; inferred follow-up (EC12).
  3. A fallback turn: no reaction while streaming; `done` with a reaction and a main question wins (EC13, AC11).
  4. A completing turn: reaction, no deltas, `done` with no question (EC14).
  5. A reset: once, twice, or before any text (EC11).
  6. A whole question in `done` with no deltas (EC23).
  7. An error event is terminal and nothing follows (EC5).
  8. Events after a terminal are ignored.

### Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`)
- **Keys become `<position>:<kind>`.** This is stable across refetch, since positions are unique per interview and the answer and reaction share their question's position. The comments on `ThreadItem` are updated.
- **Remove** `hiddenQuestionId` and `hiddenReactionQuestionId`.
- **A new `streaming` option** (the answered question, a reaction or none, the question text or none) adds transient items after the pending answer:
  - the reaction line, keyed like the saved reaction;
  - a question line with `inferStreamingQuestion`'s fields, keyed by its position.

  Both are marked `streaming: true`. They are added only while the transcript doesn't already hold the answered question's answer, so no duplicates appear once `done` is applied (EC22).
- `mainNumber` and `openQuestion` are unchanged. `openQuestion` ignores transient lines, so the composer never answers a question that isn't saved.
- **Test: first.** Seam (user-confirmed): `buildThreadView`. Update the existing file. Slices:
  1. Keys are `<position>:<kind>` and identical before and after a refetch.
  2. Streaming adds the reaction then the question after the pending answer, with the inferred caption fields (EC12, EC14).
  3. Only a reaction (completing turn): no question line (EC14).
  4. Once the transcript has the turn, the saved lines appear with the same keys and no transient duplicates (AC12, EC22).
  5. The saved reaction's text wins over the transient one (EC22).
  6. The existing pending-answer, progress and `openQuestion` cases are ported to the new options.

### Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`)
- **`useAnswerInterviewMutation(id, { onEvent })`.** `mutationFn` creates an AbortController (kept in a ref), combines it with `AbortSignal.timeout(ANSWER_TIMEOUT_MS)`, and iterates `answerStream`, passing each event to `onEvent`. Then:
  - `done` → `{kind: "answered", response}`;
  - `error` → throw `AnswerStreamError` `event`;
  - the stream ended without a terminal → throw `interrupted`;
  - an AbortError from the unmount controller → `{kind: "cancelled"}`;
  - an AbortError from the budget → `interrupted` (EC20).
- **`AnswerOutcome`** gains `cancelled`.
- **On `unknown`**, the existing `recover()` runs unchanged (EC6–EC8).
- **`onSuccess`** writes nothing for `recovered` or `cancelled`. For `answered` it writes exactly today's `setQueryData` pair (`detail` and `messages` via `appendAnswerTurn`), once (AC16).
- **`onError`** resyncs as today.
- **An effect cleanup** aborts the in-flight controller on unmount. A `done` that lands after unmount is dropped because the outcome is `cancelled` (EC17, EC24).
- **Test: after** (no hook test setup). The logic it composes is covered by Steps 6–8. Checked by hand in Step 14.

### Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`)
- `useReducer(reduceAnswerStream)`. `submit` resets it, sets the label (`pickThinkingLabel`, unchanged) and starts the 5 s slow timer, then awaits the mutation. The mutation's `onEvent` is the reducer's `dispatch`.
- **The thinking label** is shown while the send is pending and no question text has arrived (EC21: "Still thinking…" after 5 s).
- `view` passes `pendingAnswer` (as today) and `streaming` (from the reducer while pending) to `buildThreadView`.
- **The returned values:**
  - `isBusy` = the send is pending;
  - `isStreaming` = pending with any transient line (for `aria-busy`);
  - `isSending` and `hasSent` as today;
  - `isRevealing` is removed.
- **The outcomes:**
  - `cancelled` → return silently;
  - `recovered` → as today (no toast);
  - errors → the same toast and field mapping as today, with the text returned (EC5, EC8).
- **Delete** `delay`, the `MIN_THINKING_MS` wait, the `REVEAL_DELAY_MS` pause and the hidden-id state.
- `ActiveInterview` drops `isRevealing` from the completed-card condition: the cache only changes at `done`, so the card appears when the turn is saved.
- **Test: after.** Checked by hand.

### Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`)
- `ChatThread` takes `isStreaming` and sets `aria-busy` on the `role="log"` container while true, so screen readers announce the finished lines once (AC20). The status region still announces the label.
- `ChatMessage` renders a `streaming` question exactly like a saved one (same caption util, same spacing rule), plus `aria-busy` on that bubble.
- Scroll is left to `use-stick-to-bottom` (already `resize="smooth"`, pinned only at the bottom). The pending-answer ref still scrolls to the bottom on send (AC21, EC19).
- No new UI, no copy change.
- **Test: skip** (presentational wiring). Checked by hand in Step 14.

### Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`)
- **Remove** `MIN_THINKING_MS` and `REVEAL_DELAY_MS`. **Keep** `ANSWER_TIMEOUT_MS` (shared by the browser budget and the forwarder) and update its comment to the stream route.
- **Helpers:** add a `streamOf(...frames)` builder (an SSE body as a `ReadableStream`, optionally split into given chunks) and `frame(event, data)`. `answerResponse` stays (it builds `done`).
- A search confirms no reference remains to `interviewsService.answer`, `MIN_THINKING_MS`, `REVEAL_DELAY_MS`, `hiddenQuestionId` or `isRevealing` (AC19).
- **Test: skip** (config and cleanup); covered by typecheck.

### Step 14: Gates and the manual end-to-end run
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, then `graphify update .`.
- **By hand**, against cuewise-be (`.env` migrated) with `npm run dev`, then again with `npm run build && npm run start`:
  1. A move-on turn: the reaction appears first, then the question types in.
  2. A follow-up turn: captioned "Follow-up".
  3. The last question: "Wrapping up…", then the completed card.
  4. A page reload mid-turn: the backend's `stream_turn_summary` logs `cancelled=true`, and the same question is open on return.
  5. Through `next start`: the events arrive spread out, not all at once. If gzip buffers them, record it and fix it with `no-transform` / compression settings.
  6. A screen reader (NVDA or Narrator) doesn't read fragments.
  7. Scrolled up mid-turn: not pulled down.
- Record the results in `task.md` (AC22, AC23).
- **Test: after.**

## Affected Files & Patterns
- **New:**
  - `src/lib/api/sse.ts`
  - `src/lib/config/session-redirect.ts`
  - `src/modules/interviews/utils/parse-answer-stream-event.ts`
  - `src/modules/interviews/utils/reduce-answer-stream.ts`
  - `src/modules/interviews/utils/answer-stream-error.ts`
  - tests: `tests/lib/api/sse.test.ts`, `tests/lib/config/api.helper.test.ts`, `tests/lib/config/session-redirect.test.ts`, `tests/modules/interviews/utils/parse-answer-stream-event.test.ts`, `tests/modules/interviews/utils/reduce-answer-stream.test.ts`
- **Changed:**
  - `src/app/api/[...path]/route.ts`
  - `src/lib/config/api.helper.ts`
  - `src/lib/config/axios.client.ts`
  - `src/modules/interviews/{constants.ts, schemas/interviews.schema.ts, types/interviews.types.ts, services/interviews.services.ts, queries/interviews.queries.ts, hooks/use-interview-chat.ts, utils/build-thread-view.ts, utils/get-answer-error-result.ts}`
  - `src/modules/interviews/components/{ChatThread.tsx, ChatMessage.tsx, InterviewChat.tsx}`
  - `src/app/(app)/interviews/_components/ActiveInterview.tsx`
  - tests: `tests/app/api/[...path]/route.test.ts`, `tests/modules/interviews/services/interviews.services.test.ts`, `tests/modules/interviews/utils/{build-thread-view,get-answer-error-result}.test.ts`, `tests/helpers/interviews.ts`
- **Patterns to follow:**
  - zod-parsed responses in the service (`interviewSchema.parse`);
  - the forwarder's table-driven `SLOW_POSTS`;
  - `fetchMock` + `cookieJar` in `route.test.ts`;
  - builders in `tests/helpers/interviews.ts`;
  - pure utils with injectable inputs (`pickThinkingLabel`'s `random`);
  - TanStack optimistic-UI-via-variables for the pending answer;
  - `useMutationCallbacks` for toasts.
- **Risks:**
  - The key change touches every thread line. It is safe because positions are unique, but `build-thread-view.test.ts` fixtures must be updated.
  - `aria-busy` support varies by screen reader, so it gets the manual check.
  - Next's gzip may buffer the stream; `no-transform` is the documented escape, verified by hand.
  - `AbortSignal.any` needs a modern browser. The app already targets evergreen browsers (Next 16), but it is noted.

## Testing Strategy
- **Framework and command:** Vitest in node (`npm test`; one file with `npx vitest run <path>`). Typecheck with `npx tsc --noEmit`, lint with `npm run lint`, build with `npm run build`.
- **Coverage map:**

| Spec ID | Step | Test mode | Notes |
|---|---|---|---|
| AC1 | 5 | first | first chunk readable while upstream open |
| AC2 | 5 | first | Accept, budget, headers |
| AC3 | 5 | first | buffered non-200, cookie clear, 503 |
| AC4 | 5 | first | existing forwarder tests unchanged |
| AC5 | 1 | first | event schemas |
| AC6 | 2 | first | every chunk boundary, endings, comments, UTF-8 |
| AC7 | 6 | first | body, order, stop, abort |
| AC8 | 3, 6, 7 | first | same result kinds |
| AC9 | 4, 6 | first | shared redirect |
| AC10 | 8 | first | sequences |
| AC11 | 8, 9 | first | `done` wins |
| AC12 | 9 | first | position keys, no duplicates |
| AC13 | 11, 14 | after | label rules; manual |
| AC14 | 11, 14 | after | no timers; manual |
| AC15 | 8, 9 | first | inferred caption, corrected at `done` |
| AC16 | 10, 14 | after | the same `setQueryData` pair; manual |
| AC17 | 7, 10 | first / after | mapping first; flow manual |
| AC18 | 10, 14 | after | unmount cancel; manual + backend log |
| AC19 | 13 | skip | search + typecheck |
| AC20 | 12, 14 | after | screen reader by hand |
| AC21 | 12, 14 | after | scroll by hand |
| AC22 | 14 | after | gates |
| AC23 | 14 | after | manual end-to-end in `task.md` |
| EC1 | 4, 5, 6 | first | |
| EC2 | 5, 6, 7 | first | |
| EC3 | 5, 6, 7 | first | |
| EC4 | 3, 5, 6, 7 | first | |
| EC5 | 7, 8 | first | |
| EC6 | 6, 7, 10 | first / after | |
| EC7, EC8 | 10 | after | existing `recover()`, unchanged; manual |
| EC9 | 1, 6 | first | |
| EC10 | 1, 6, 7 | first | |
| EC11 | 8 | first | |
| EC12, EC13, EC14 | 8, 9 | first | |
| EC15, EC16 | 2 | first | |
| EC17 | 5, 6, 10 | first / after | |
| EC18 | 11 | after | composer busy while pending (unchanged) |
| EC19 | 12, 14 | after | |
| EC20 | 7, 10 | first / after | |
| EC21 | 11, 14 | after | |
| EC22 | 9 | first | |
| EC23 | 8 | first | |
| EC24 | 10, 14 | after | |

- **Must verify, not assume:**
  - Next's gzip with `next start` and the dev server don't hold chunks back (Step 14).
  - An abort in the browser reaches cuewise-be through the forwarder (`cancelled=true` in its log).
  - `done`'s body and the `reaction` event's `{id, text}` match the old response (checked against `../cuewise-be/docs/features/sse-streaming/spec.md`; the backend's tests assert it).
  - Screen-reader behaviour with `aria-busy`.
- **Open questions:** none. Every EC has an expected outcome in the spec.
- **Known baseline failures:** run `npm test`, `npx tsc --noEmit` and `npm run lint` once before Step 1, and record the result in `task.md`.

## Blockers & Resolutions
- The stream can't use axios → `fetch` plus a body reader. Shared fetch error types keep every existing outcome helper working (user choice).
- The expired-session redirect is axios-only → extract one shared function (user choice). Both paths call it.
- The forwarder buffers → a streaming branch in the catch-all that passes the body and the disconnect through (user choice).
- Transient lines vs the cache rule → they live in reducer state and the view, never in the cache (user choice: `useReducer`).
- No remount at `done` vs a question with no id → position keys (user choice).
- Announcing fragments → `aria-busy` on the log while streaming (user choice).
- A cancel vs a late `done` → the query hook owns the controller, and an unmount abort becomes `cancelled`, which writes nothing (user choice).
- The browser's budget vs an unmount → two abort sources, told apart by which one fired.

## Trade-offs & Rationale
- **Shared error types over faking `AxiosError`:** explicit, and the helpers stay honest about what they read. The cost is a small change to `api.helper.ts`.
- **A catch-all branch over a dedicated route:** one place for the token, cookie, 401 and 503 rules. The cost is a slightly longer `forward()`.
- **`useReducer` over zustand or the cache:** the state is transient and per screen, the reducer is pure and testable, and nothing needs rolling back.
- **Position keys:** they make the no-remount rule possible without inventing ids. They are already unique and stable server-side.
- **Generic SSE parser in `lib/api`:** the next streaming feature (end-of-interview feedback) reuses it.
- **Porting the old `answer()` tests instead of only deleting them:** the body rules and the follow-up contract stay protected.
- **Dropping the fake timers:** real events replace them. A fast turn is shown as fast as it is (spec decision).

## Project Rules Applied
- `CLAUDE.md`:
  - service → query → component; only services talk HTTP;
  - zod on every payload, with `z.infer` types;
  - presentational components, with logic in `utils/` and hooks;
  - constants mirror cuewise-be;
  - BFF: the browser calls `/api/*` only, the token stays in the cookie, and upstream headers are built from scratch;
  - AI text as plain text;
  - no new dependency;
  - tests mirror `src/` under `tests/`, with helpers in `tests/helpers/`;
  - typecheck, lint, test, build and `graphify update .`;
  - nothing committed, no new branch.
- `AGENTS.md`: Next.js 16 docs read for Route Handler streaming (`ReadableStream` responses) and `compress` (gzip, `no-transform`).

## Skills Consulted
| Skill | Contribution |
|---|---|
| lean-ctx | Read the forwarder, service, queries, chat hook, thread view, error helpers, axios client, components, constants and tests |
| graphify | Answer-flow map: `submit` → `useAnswerInterviewMutation` → `interviewsService.answer`, and `buildThreadView` → `ChatThread` / `ChatMessage` |
| grill-me (via `AskUserQuestion`) | Error types, shared redirect, forwarder branch, state location, position keys, `aria-busy`, cancel ownership, parser location, the eight test seams, porting the old tests |
| Next.js 16 docs | Route Handler streaming with `ReadableStream`; `compress` (gzip) and `no-transform` |
| ponytail | No new dependency, no zustand store, no dedicated route, no hook test setup |
| security-review (checklist) | Token only in the cookie; browser headers not forwarded; the disconnect passed on; no text logged |

## Ready to Implement
- Every spec requirement is mapped to a step; every AC and EC is in the coverage map.
- Every step has a Test tag; the `first` steps name user-confirmed seams with ordered slices.
- The affected files are identified; the risks and verifications are listed.
- Blockers resolved, trade-offs documented.
- No deviation from the spec. The new position-based keys are a design choice the spec allows ("replaced without remounting").
