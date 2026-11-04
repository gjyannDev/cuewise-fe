# Feature: Voice Answers (speak an answer, review the transcript, send)

## Problem
The interview chat accepts answers only by typing (`AnswerComposer`: a textarea and a send button). An interview coach is practice for speaking, and many candidates think and answer better out loud than at a keyboard. They have no way to speak an answer, and long answers (up to 2000 characters) are slow and tiring to type.

Nothing in the stack can turn speech into text today:
- cuewise-be only takes text answers (`POST /interviews/{id}/messages[/stream]`) and has no audio endpoint or speech-to-text vendor.
- The Next.js `/api` forwarder reads request bodies with `request.text()`, which corrupts binary uploads.
- Browsers record audio in different containers (WebM/Opus on Chrome, Edge and Firefox; MP4/AAC on Safari).

## Goal
A candidate can press a mic button, speak an answer, and see it appear as editable text in the answer box within a few seconds of stopping, then review it and send it with the existing Send flow. Nothing about how answers are sent, saved, streamed or evaluated changes: cuewise-be still only ever receives a text answer, and the interviewer LLM never sees audio.

Measurable: with a running cuewise-be, a spoken answer of up to 120 s is transcribed into the box within 10 s of pressing stop (typical 30 s of speech: under 5 s), the transcript needs only light edits for ordinary English technical speech, and every failure (permission denied, no speech, too long, service down, rate limited) ends with a clear message and the composer usable.

## Decisions
- **Speech-to-text vendor: Deepgram** (pre-recorded transcription, Nova-3 family), not an LLM. Chosen for: verbatim output (no paraphrasing, no prompt-injection surface), native support for the containers browsers record (no client-side conversion), keyterm prompting for jargon, a $200 starter credit (about 40,000 audio minutes at roughly $0.004-0.005/min), and keeping the Gemini quota for the interviewer. It sits behind a swappable `Transcriber` contract.
- **Request/response, not streaming.** One upload, one JSON reply. Pre-recorded transcription returns the whole transcript at once, so SSE would add nothing; live captions would need audio streaming upstream (WebSocket), which is out of scope for v1.
- **Review before send:** the transcript is appended to the textarea; it is never sent automatically.
- English only; 120 s per clip; 3 MB per upload; 10 transcriptions per user per minute (in memory); composer locked while recording/transcribing; mic always shown when the browser supports recording, `503` -> toast when transcription is unavailable; metadata-only logs, no Langfuse; a single spec in this repo.

## Project Conventions
- Rule files consulted: `CLAUDE.md` + `AGENTS.md` (FE project root; there is no `.claude/` directory), `../cuewise-be/CLAUDE.md`, the user's global `~/.claude/CLAUDE.md`, the specs of `interviews-answer-flow` and `interviews-answer-streaming` (this repo), `../cuewise-be/docs/features/sse-streaming/spec.md`, and the Next.js 16 docs in `node_modules/next/dist/docs/` (Route Handlers; `proxyClientMaxBodySize` defaults to 10 MB and only applies to paths `src/proxy.ts` matches, which excludes `/api`).
- Constraints those rules impose on this feature:
  - **FE:** data flow service -> query -> component. The service is the only place that talks HTTP; components never import services; the query layer owns toasts via `useMutationCallbacks`. Components stay presentational; browser-recording state lives in a hook, pure logic in `utils/`. Every external payload is parsed with zod; types come from `z.infer`. Error codes and limits mirror cuewise-be in `modules/interviews/constants.ts` ("keep in step" comments).
  - **FE:** the browser only calls `/api/*` on Next.js; the JWT stays in the httpOnly cookie; the forwarder builds upstream headers from scratch. The Deepgram key never reaches the browser. Never log tokens or PII. The transcript is untrusted text, placed in the textarea as plain text, never as HTML.
  - **FE:** no new dependency (MediaRecorder and FormData are native). Vitest is node-only (no DOM), so new logic is pure units; tests mirror `src/` under `tests/`, helpers in `tests/helpers/`. Accessibility: labelled controls, keyboard-usable, visible focus, status announced.
  - **BE:** router -> controller -> repository; files prefixed with the module name; routes thin, logic in the controller; vendors sit behind a protocol in `core/ai`, called over plain `httpx` like `OpenAICompatibleProvider` (no vendor SDK); all input validated; errors raised as `AppError` subclasses with generic client messages and details in logs; ownership enforced in the controller; secrets only from env via `core/config.py`, with `.env.example` updated; rate limiting on sensitive endpoints; no PII or secrets logged.
  - **Both:** nothing is committed, staged, pushed, or opened as a PR, and no new branch is created. After code changes: FE `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, then `graphify update .`; BE `uv run pytest`, then `graphify update .`.
- Process: a two-repo feature. **Phase 0 = spike**, **Phase 1 = cuewise-be**, **Phase 2 = cuewise-fe**. cuewise-be's plan/task may reference this spec. Phase 1 is built against a fake transcriber and a scripted `httpx` transport, so it does not wait for the spike (decided 2026-11-04); the spike must pass before Phase 2 starts.

## User Flow
1. The candidate, on an open question, presses the mic button in the answer box. The browser asks for microphone permission the first time.
2. Recording starts: a recording indicator and an elapsed-time counter show; the textarea and Send are locked; Cancel discards the clip.
3. The candidate presses stop (or the recording stops itself at 120 s). The button shows a "Transcribing…" state; the composer stays locked.
4. The transcript is appended to the textarea (after a space, or after the line break if the text already ends one), the composer unlocks, focus returns to the textarea, and the character counter and unload warning reflect the new text.
5. The candidate edits the text if needed and presses Send (or Ctrl/Cmd+Enter). From here the flow is exactly today's answer flow.
6. If anything fails, a message says what happened, the typed text is untouched, and the candidate can record again or type.

## Requirements

### Phase 0: Spike (before Phase 2 starts)
- With a Deepgram key, send real recordings to the pre-recorded endpoint: a WebM/Opus clip from Chrome and an MP4/AAC clip from Safari (and an OGG clip from Firefox if it records OGG), each 30 s and 120 s, of English technical speech.
- Confirm and record in this feature's `task.md`:
  - each container is accepted as sent by `MediaRecorder` (with its declared content type), with no conversion;
  - the model chosen (default: the current Nova-3 general model) and the transcript quality on terms such as "useEffect", "Kubernetes", "REST", "SQL", with and without keyterms;
  - whether keyterms are needed for v1 (if yes, v1 uses a fixed, short per-role list kept in BE constants);
  - latency for 30 s and 120 s clips;
  - Deepgram's retention terms and Model Improvement Program terms (v1 stays in the program; see Decisions);
  - the starter credit's expiry and what happens when it runs out; a usage alert is set in the Deepgram console.
- If a browser's container is not accepted, or accuracy is unusable: **stop and re-plan** (e.g. a FE conversion step, or self-hosted Whisper behind the same contract). No fallback is pre-decided.

### Phase 1: Backend (cuewise-be)

**Endpoint**
- `POST /api/v1/interviews/{session_id}/transcriptions`, multipart form with one audio file part. It creates nothing, so it returns `200` with `{ "text": "<transcript>" }` (extra keys forbidden in the response model).
- Requires an authenticated user with the existing `interviews:answer` permission (no new permission). The session must belong to the caller (otherwise `404` like the other interview routes) and be `in_progress` (otherwise `409 SESSION_NOT_IN_PROGRESS`). The current question is not needed.
- The audio is **not stored** anywhere and **not linked** to the session; only the text goes back to the client. The text is saved only if and when the candidate sends it as an answer through the existing route.

**Input validation**
- Accepted audio: WebM, OGG, MP4/M4A and WAV. The declared content type must be one of these **and** the file content must start with the matching container signature; anything else is `415 UNSUPPORTED_AUDIO`.
- Larger than 3 MB: `413 AUDIO_TOO_LARGE`; the BE never reads more than the cap into memory. (120 s of Opus or AAC at browser defaults is about 1-2 MB.)
- A missing file part is `422` (request validation) with the project's standard error body. An empty file (0 bytes) is `422 NO_SPEECH`, the same code as a silent clip, so the client needs no extra message; the transcriber is not called.
- Duration is bounded by the size cap and the FE's 120 s auto-stop (the BE cannot measure compressed audio without decoding it). If Deepgram reports a duration over 125 s, the endpoint returns `422 AUDIO_TOO_LONG` and discards the text.

**Transcription**
- A `Transcriber` contract in `core/ai` (separate from the text-only `LLMProvider`), with a Deepgram implementation over plain `httpx`: the audio bytes are sent as they were uploaded, with their content type, to Deepgram's pre-recorded endpoint. It is built once at startup next to the LLM provider and closed on shutdown.
- Request options: English, the configured model, smart formatting/punctuation on, filler words off, and keyterms only if Phase 0 decided they are needed. `mip_opt_out` is **not** sent: Deepgram documents a price impact for opting out of its Model Improvement Program, and v1 stays in the program (decided 2026-11-04).
- Settings: `DEEPGRAM_API_KEY` (optional; blank = transcription off), `DEEPGRAM_MODEL` (default the model chosen in Phase 0), `DEEPGRAM_BASE_URL` (default Deepgram's public API), a timeout and total budget (the request finishes in under 20 s). `.env.example` documents them. The key is held as a secret and never logged or returned.
- Retries follow the same rules as the LLM calls (only on timeout, 429, 5xx; within the total budget).
- A blank transcript returns `422 NO_SPEECH`. The text is trimmed and capped at the answer limit (2000 characters).
- With no Deepgram key configured, or on any vendor failure after retries (timeout, 429, 5xx, a 4xx such as a bad key or exhausted credit, an unparseable response), the endpoint returns `503 TRANSCRIPTION_UNAVAILABLE` with a generic message; the cause is logged. Interviews are unaffected.

**Abuse control and observability**
- Per-user rate limit: at most 10 transcription requests per user per minute, in memory (single instance is acceptable for now), returning `429 RATE_LIMITED` with `Retry-After`. The limit is checked before the upload is sent to Deepgram.
- One metadata log line per request: user id, session id, byte size, content type, the duration Deepgram reports, model, latency, outcome code. **Never** the audio or the transcript.
- No Langfuse tracing for transcription: audio and transcripts go to no third party other than Deepgram.

**Testing**
- A fake transcriber (like the fake LLM provider) so route/controller tests run without a network: success, ownership/404, not-in-progress/409, unsupported type or mismatched signature, too large, missing/empty file, no speech, too long, vendor failure/503, not configured/503, rate limit, and "no audio or text appears in logs". The Deepgram implementation is tested with a scripted `httpx` transport (request shape, response parsing, retries, error mapping), like `OpenAICompatibleProvider`.

### Phase 2: Frontend (cuewise-fe)

**Forwarder (`/api/[...path]`)**
- Request bodies are forwarded as bytes, so binary and multipart uploads arrive intact; JSON routes behave exactly as before. The incoming `Content-Type` (including the multipart boundary) is passed on.
- `POST interviews/<id>/transcriptions` gets its own timeout budget instead of the 15 s default: **25 s** in the forwarder (above the BE's 20 s budget). The browser's own timeout for the upload is longer, **30 s**, so a slow request always ends with the forwarder's clean `503` rather than whichever side gives up first. Both values are shared constants in `modules/interviews/constants.ts`.

**Recording (hook + utils)**
- A hook owns the microphone: request permission, record, stop, cancel, elapsed time, and error states. It releases the microphone on stop, cancel, error and unmount, and stops by itself at 120 s.
- The container is picked once from what the browser supports, in order of preference: WebM/Opus, MP4, OGG (a pure, unit-tested util). The recorded blob is uploaded as is, with its content type; there is no client-side conversion.
- Support is detected once (`navigator.mediaDevices.getUserMedia`, `MediaRecorder`, and at least one supported container); when missing, the mic button is not rendered and the composer works exactly as today.

**Service, query, schema**
- A service call uploads the recording as multipart and parses `{ text }` with zod. A query hook wraps it and reports failures through `useMutationCallbacks` with messages mapped from the BE error codes (listed in UX Requirements). The upload can be cancelled. A session-ending 401 triggers the existing redirect to sign-in.
- Limits and error codes are constants mirrored from cuewise-be.

**Composer**
- A mic button next to Send with four states: idle, recording, transcribing, and error (error returns to idle with a message). Presentational: the container passes state and callbacks.
- While recording or transcribing the textarea is read-only, Send and starting another recording are blocked, and the only actions are Stop/Cancel (recording) or waiting (transcribing).
- On success the transcript is **appended** to the current text (a single space, or nothing after a trailing newline, between old and new), marking the field dirty so the unload warning and counter work. If the combined text exceeds 2000 characters, all of it is kept and the existing counter and "Keep it under 2000 characters" validation apply; nothing is truncated on the client.
- The mic is disabled while an answer turn is running (`isBusy`), and any recording or transcription is cancelled if the question changes or the screen unmounts.
- The existing Send/answer-stream flow is unchanged and is the only way the text reaches the interviewer.

### Non-Functional
- **Latency:** stop -> text in box within 10 s for a 120 s clip (typical under 5 s for 30 s of speech); recording starts within 1 s of permission being granted.
- **Cost/abuse bounds:** one clip is capped by size, duration and the per-user rate limit; each clip is one Deepgram request; the interviewer's Gemini calls are unchanged.
- **Security and privacy:** audio is held only in browser memory and in flight; never stored, logged or traced; sent to Deepgram, which may use it in its Model Improvement Program (v1 does not opt out; a cost decision); the Deepgram key and JWT never reach JS; the transcript is untrusted plain text; the endpoint is default-deny with ownership checks.
- **Compatibility:** latest Chrome, Edge, Firefox, Safari (macOS and iOS). Microphone access needs HTTPS (`localhost` is exempt); any `Permissions-Policy` header must allow `microphone=(self)`.
- **Maintainability:** the vendor sits behind a `Transcriber` contract (swapping it is a new class plus config); validation and container picking are pure and unit-tested.

## UX Requirements
- **Accessibility:** the mic button has an `aria-label` that reflects its state ("Record answer", "Stop recording", "Transcribing…"); recording and transcribing start/finish are announced through a polite live region; the mic is reachable and operable by keyboard with a visible focus ring; recording state is never conveyed by color or animation alone (text/timer too). Reduced-motion users get a non-animated recording indicator.
- **Responsive:** the mic button and its states fit the existing composer at phone width without wrapping the Send button; tap targets are at least 44 px like Send.
- **Messages** (toasts or the field message, never raw errors):
  - permission denied: "Microphone access is blocked. Allow it in your browser settings to answer by voice."
  - no microphone found / in use: "Couldn't start the microphone."
  - `NO_SPEECH`: "Didn't catch that. Try again."
  - `AUDIO_TOO_LONG` / reaching 120 s: "Recordings are limited to 2 minutes." (at 120 s the recording stops itself and is still transcribed)
  - `TRANSCRIPTION_UNAVAILABLE`, network failure, other: "Voice answers aren't available right now. You can type your answer."
  - `RATE_LIMITED`: "Too many recordings. Wait a moment and try again."
  - `AUDIO_TOO_LARGE` / `UNSUPPORTED_AUDIO` / a recording error: "Couldn't process that recording. Try again."
- **Review step:** the transcript is never sent automatically; the candidate always sees and can edit it first.

## Constraints
- Depends on a Deepgram account and key (starter credit); Phase 0 confirms containers, accuracy, latency and data-use terms before any build.
- cuewise-be is Python 3.14, FastAPI; `python-multipart` (via `fastapi[standard]`) and `httpx` are already installed. No new BE or FE dependency, and no vendor SDK.
- Next.js 16 App Router; the forwarder is a Route Handler and must stay dynamic. TypeScript strict, no `any`.
- English-language transcription only. The in-memory rate limiter is per process (not shared across instances).
- Browsers without `MediaRecorder` keep typing only.

## Blockers
- **Phase 0 spike must pass** (containers accepted as recorded, usable accuracy). If it does not, stop and re-plan.
- Assumptions to verify (Phase 0 unless noted):
  - Deepgram's pre-recorded endpoint accepts raw WebM/Opus, MP4/AAC and OGG bodies from `MediaRecorder` with their declared content types *(assumption — verify)*.
  - Nova-3 keyterm prompting (`keyterm`, repeated), `smart_format`, `filler_words`, `language` and `mip_opt_out` exist on `POST /v1/listen` *(confirmed in Deepgram's API reference, 2026-11-04; behavior still verified in the spike)*.
  - Deepgram's response reports the audio duration, so `AUDIO_TOO_LONG` can be enforced *(assumption — verify)*.
  - The $200 starter credit's expiry and post-credit billing *(assumption — verify in the console)*.
  - A 120 s clip at browser defaults stays under 3 MB on every browser *(assumption — verify by hand in Phase 2)*.
  - Next.js 16 Route Handlers pass a 3 MB multipart body through the forwarder intact *(assumption — verify by hand in Phase 2)*.

## Edge Cases
- **EC1:** The browser lacks `getUserMedia`, `MediaRecorder`, or any supported container -> the mic button is not rendered; typing works exactly as before.
- **EC2:** The candidate denies (or has blocked) microphone permission -> the "Microphone access is blocked…" message shows, the composer stays unlocked and the text untouched; pressing the mic again retries the permission request.
- **EC3:** No microphone is available or it is in use by another app -> "Couldn't start the microphone."; composer usable.
- **EC4:** The candidate presses Cancel while recording -> the clip is discarded, nothing is uploaded, the microphone is released, and the composer unlocks.
- **EC5:** The recording reaches 120 s -> it stops itself, is transcribed normally, and the "limited to 2 minutes" message is shown once.
- **EC6:** The clip is silent or unintelligible (including one too short to contain speech) -> BE returns `NO_SPEECH`; "Didn't catch that"; nothing is added to the textarea.
- **EC7:** The textarea already has text -> the transcript is appended after a space (or directly after a trailing line break); existing text is never replaced or reordered.
- **EC8:** The combined text exceeds 2000 characters -> everything is kept; the counter turns red and the existing validation blocks Send until the candidate trims.
- **EC9:** The candidate navigates away, the question changes, or the screen unmounts while recording or transcribing -> the recording stops and the microphone is released; an in-flight upload is cancelled; no text is added later.
- **EC10:** An answer turn starts or is running (`isBusy`) -> the mic button is disabled; no recording can start.
- **EC11:** The candidate tries to start a second recording, type, or press Send while recording or transcribing -> blocked (the composer is locked); only Stop/Cancel is available while recording.
- **EC12:** The upload fails because of a network error or the forwarder returns 503 -> "Voice answers aren't available right now…"; the clip is discarded; typed text untouched; the candidate may record again.
- **EC13:** BE returns `503 TRANSCRIPTION_UNAVAILABLE` (no key, Deepgram down, bad key, credit exhausted) -> same message as EC12.
- **EC14:** BE returns `429 RATE_LIMITED` -> "Too many recordings…"; the clip is discarded.
- **EC15:** An upload with a disallowed content type, a content type that does not match the file's signature, or over 3 MB reaches the BE (a client bug or a hand-made request) -> `415 UNSUPPORTED_AUDIO` or `413 AUDIO_TOO_LARGE`; nothing is sent to Deepgram; FE shows "Couldn't process that recording".
- **EC16:** Deepgram reports a duration over 125 s (the FE cap was bypassed) -> `422 AUDIO_TOO_LONG`; the text is discarded; FE shows "Recordings are limited to 2 minutes."
- **EC17:** The session belongs to another user, does not exist, or is no longer in progress -> `404` / `409 SESSION_NOT_IN_PROGRESS`; FE treats it like the answer flow's resync (existing "already answered" handling) and adds no text.
- **EC18:** The audio contains spoken instructions ("ignore previous instructions and ...") -> the endpoint returns a verbatim transcript of what was said; nothing else changes (Deepgram does not follow instructions).
- **EC19:** The session expires (401 with a session-ending code) during the upload -> the existing session-expired redirect to sign-in runs, with the same `next` and `expired=1` behavior as the answer flow.
- **EC20:** Deepgram returns a transcript over 2000 characters -> it is capped at the answer limit.
- **EC21:** The same user requests more than 10 transcriptions in a minute -> the extra ones get `429` without calling Deepgram; earlier ones and other users are unaffected.
- **EC22:** `DEEPGRAM_API_KEY` is blank at startup -> the API starts normally; only the transcription endpoint answers `503`; interviews are unaffected.
- **EC23:** The browser produces an empty recording (stopped immediately) -> nothing is uploaded; "Didn't catch that. Try again."; composer unlocked.

## Acceptance Criteria
**Phase 0 (spike)**
- [ ] **AC1:** `task.md` records, for Chrome WebM, Safari MP4 and (if available) Firefox OGG: accepted as sent or not; the model chosen; transcript quality on technical terms with and without keyterms and whether v1 uses keyterms; latency at 30 s and 120 s; Deepgram's retention and Model Improvement Program terms; the credit expiry; and that a usage alert is set. Phase 2 starts only if every target browser's container is accepted with usable accuracy.

**Phase 1: Backend**
- [ ] **AC2:** `POST /api/v1/interviews/{id}/transcriptions` with an allowed recording from the owner of an in-progress session returns `200 {"text": "..."}` containing only the fake transcriber's text.
- [ ] **AC3:** An anonymous request is rejected (`401`); another user's or an unknown session returns `404`; a completed/abandoned session returns `409 SESSION_NOT_IN_PROGRESS` (EC17).
- [ ] **AC4:** A disallowed content type or a content/signature mismatch returns `415 UNSUPPORTED_AUDIO`; over 3 MB returns `413 AUDIO_TOO_LARGE` without reading past the cap; a missing file part returns `422` and an empty file returns `422 NO_SPEECH`; in all cases the transcriber is never called (EC15).
- [ ] **AC5:** A blank transcript returns `422 NO_SPEECH`; a reported duration over 125 s returns `422 AUDIO_TOO_LONG`; a transcript over 2000 characters is capped to 2000 (EC6, EC16, EC20).
- [ ] **AC6:** A vendor failure after retries (timeout, 429, 5xx, other 4xx, bad response), or no key configured, returns `503 TRANSCRIPTION_UNAVAILABLE` with a generic message and no internals; the app starts and interviews work without a key (EC13, EC22).
- [ ] **AC7:** The 11th request from the same user within a minute returns `429 RATE_LIMITED` with `Retry-After` and does not call the transcriber; another user is unaffected (EC14, EC21).
- [ ] **AC8:** The Deepgram transcriber sends the uploaded bytes unchanged with their content type, the key in the auth header, and the specified options (English, model, smart format, no filler words, no `mip_opt_out`, keyterms only if decided); parses the transcript and duration; retries only on timeout/429/5xx within the budget; and maps every other failure to the transcriber's error (scripted `httpx` transport tests). The contract is separate from `LLMProvider`; settings are documented in `.env.example`.
- [ ] **AC9:** No audio bytes, transcript text or API key appear in application logs or Langfuse; each request logs one metadata line (user id, session id, bytes, content type, duration, model, latency, outcome); audio is not persisted (verified in tests via captured logs).
- [ ] **AC10:** BE tests pass for every case above, and the existing test suite still passes.

**Phase 2: Frontend**
- [ ] **AC11:** The forwarder delivers a binary multipart body to the upstream byte for byte (including the boundary header) and uses the 25 s transcription timeout for `interviews/<id>/transcriptions`; the browser's upload timeout is 30 s; the existing forwarder tests for JSON and streaming routes pass unchanged.
- [ ] **AC12:** The container picker returns WebM/Opus, then MP4, then OGG by browser support, and reports "unsupported" when none is available (unit tests; EC1).
- [ ] **AC13:** The recorder hook starts and stops recording, reports elapsed time, auto-stops at 120 s (EC5), releases the microphone on stop, cancel, error and unmount (EC4, EC9), skips the upload for an empty recording (EC23), and reports permission-denied and no-device as distinct states (EC2, EC3).
- [ ] **AC14:** The service uploads the recording as multipart with its content type and returns the parsed `{ text }`; the response and error shapes are validated with zod, and each BE error code maps to the message in UX Requirements (EC6, EC12-EC17).
- [ ] **AC15:** The composer shows the mic button only when the browser supports recording (EC1); it moves through idle -> recording -> transcribing -> idle, locks the textarea and Send during recording and transcribing, and unlocks on success, error and cancel (EC4, EC11).
- [ ] **AC16:** On success the transcript is appended to the existing text with the specified separator, the field is marked dirty, focus returns to the textarea, and the counter reflects the new length; text beyond 2000 characters is kept and triggers the existing validation (EC7, EC8).
- [ ] **AC17:** The mic is disabled while `isBusy`; changing the question or unmounting cancels any recording and in-flight upload and adds no text later (EC9, EC10).
- [ ] **AC18:** A session-ending 401 during upload redirects to sign-in as in the answer flow (EC19).
- [ ] **AC19:** Accessibility checked by hand: state-reflecting `aria-label`s, polite announcement of recording/transcribing start and finish, keyboard operation, visible focus, no animation under reduced motion, tap target >= 44 px at phone width.
- [ ] **AC20:** `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build` pass in cuewise-fe; `uv run pytest` passes in cuewise-be.
- [ ] **AC21:** A manual end-to-end run against a running cuewise-be with a Deepgram key is recorded in `task.md`: record -> transcript in box -> edit -> send, on Chrome and Safari at least (Firefox if available), with the 120 s clip size noted per browser, plus permission-denied, cancel, silent clip, and no-key (503) cases.

## Out of Scope
- **Streaming transcription / live captions** (words appearing while speaking). It needs audio streamed upstream to Deepgram's live API over WebSocket, which the `/api` forwarder and SSE cannot carry; a possible v2.
- SSE for the transcription response: there is a single result, so request/response is enough.
- Auto-sending the transcript, or any change to how answers are sent, saved, streamed or evaluated.
- The interviewer speaking (text-to-speech), voice commands, or hands-free flows.
- Storing, replaying or analysing the audio (filler words, pace, tone); filler words are not requested in v1.
- Languages other than English, language detection, and speaker identification.
- A capability flag to hide the mic when transcription is off (toast on `503` instead).
- A shared (multi-instance) rate limiter, per-day quotas, or Langfuse tracing of transcription.
- Client-side audio conversion, BE-side conversion (`ffmpeg`), browser `SpeechRecognition`, and LLM-based transcription; if the spike fails the feature is re-planned.
- Component and hook unit tests with a DOM (the repo has no DOM test setup); those are covered by the manual check.
