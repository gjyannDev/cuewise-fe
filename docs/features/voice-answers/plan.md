# Implementation Plan: Voice Answers

## Overview
Let a candidate speak an answer: the browser records, cuewise-be transcribes the clip with Deepgram, and the transcript is appended to the answer box for review before the existing Send flow. The interviewer and the answer flow are unchanged.

## Architecture & Design
Request/response end to end: the composer records with `MediaRecorder` and uploads the blob as is (multipart, through the `/api` forwarder, which is fixed to forward bytes). A new `POST /interviews/{id}/transcriptions` route checks the rate limit, ownership, size and container signature, then calls a `Transcriber` (Deepgram over plain `httpx`, built once at startup, sharing the LLM provider's retry rules through an extracted helper) and returns `{ text }`. On the FE the data flow stays service -> query -> component: the chat hook exposes a `transcribe` action, and the composer owns only browser recording state and appends the returned text into the form.

## Spec Requirements -> Implementation
- Phase 0 spike (containers, accuracy, keyterms, latency, MIP terms, credit) -> Step 0 (runs before Phase 2; Phase 1 does not wait for it)
- Shared retry rules, no duplication -> Step 1
- `Transcriber` contract separate from `LLMProvider`, fake for tests -> Step 2
- Deepgram over `httpx`: options, parsing, retries, error mapping -> Step 3
- `DEEPGRAM_*` settings, built at startup, blank key = off, `.env.example` -> Step 4
- Per-user 10/min limit, `429 RATE_LIMITED` + `Retry-After` -> Step 5
- Allowlist + container signature, 3 MB cap -> Step 6
- Endpoint, ownership/status, `NO_SPEECH`, `AUDIO_TOO_LONG`, 2000-char cap, `503`, metadata log, nothing stored -> Step 7
- BE suite green -> Step 8
- Forwarder forwards bytes + transcription timeout -> Step 9
- Mirrored codes/limits, response schema -> Step 10
- Upload service + query hook, session redirect -> Step 11
- Error-code -> message mapping, append rules -> Step 12
- Container picker, recorder hook (auto-stop, release mic, empty clip) -> Step 13
- Mic button, composer locking, `isBusy`, cancel on question change, a11y -> Step 14
- Quality gates, manual E2E, graphify -> Step 15

## Implementation Steps

### Phase 0: Spike (no product code)
0. **Deepgram spike.** With a Deepgram key and `curl` (or a throwaway script in the scratchpad, never in either repo), send real Chrome WebM, Safari MP4 and Firefox OGG recordings (30 s and 120 s, English technical speech) to the pre-recorded endpoint with their declared content types. Record in `docs/features/voice-answers/task.md`: accepted per container, the model, accuracy with/without keyterms (and whether v1 needs a per-role keyterm list), latency, whether `metadata.duration` is reported, Deepgram's retention and Model Improvement Program terms, credit expiry; set a usage alert. **Gate (moved, 2026-11-04):** Phase 1 is built first against fakes; the spike must pass before Phase 2. If a target container is rejected or accuracy is unusable, stop and re-plan (only the transcriber and FE format handling would change). — Test: skip (manual; AC1, EC18)

### Phase 1: Backend (cuewise-be)
1. **Extract shared retry rules.** Move the backoff (exponential + jitter), retry-delay decision (retryable, attempts, budget) and status-to-error mapping out of `core/ai/openai_compatible.py` into a small `core/ai/retry.py`; `OpenAICompatibleProvider` calls it. No behavior change. — Test: after (the existing `tests/core/ai/test_openai_compatible*.py` must pass unchanged; they are the safety net)
2. **Transcriber contract + fake.** `core/ai/transcriber.py`: a `Transcriber` protocol (`transcribe(audio bytes, content_type)` -> result with text, reported duration, model, latency, attempts; `aclose`; the time budget is fixed per instance from settings, since no caller has its own deadline). Failures reuse the existing `LLMError` subclasses (they are vendor-agnostic: timeout, rate limit, server, request, bad response) so the shared retry helper applies as is. `core/ai/fake.py`: a `FakeTranscriber` with scripted results/errors that records calls, like `FakeProvider`. — Test: skip (types and test double; exercised by Steps 3 and 7)
3. **DeepgramTranscriber.** `core/ai/deepgram.py`, an `httpx.AsyncClient` with an injectable transport, sleep and clock (same pattern as `OpenAICompatibleProvider`). Sends the bytes unchanged with their content type and `Authorization: Token <key>` to the pre-recorded listen path with the options from the spec (English, model, smart format, no filler words, no `mip_opt_out`; default model `nova-3`); keyterms are passed **per call** (`transcribe(..., keyterms=...)`) because the spike showed they are needed and they depend on the interview's role (Step 7); parses the first alternative's transcript and `metadata.duration`; retries through Step 1's helper. — Test: first
   - Seam (user-confirmed): `DeepgramTranscriber.transcribe(...)` driven by a scripted `httpx` transport.
   - Slices: request shape (path, query options, headers, raw body) -> parses transcript + duration -> blank transcript returned as empty text (the controller decides `NO_SPEECH`) -> retries a 503 then succeeds -> gives up at max retries / budget -> 401/402/400 not retried, raised as request error -> malformed JSON raised as bad response -> timeout raised as timeout.
4. **Config, factory, lifespan.** `core/config.py`: `deepgram_api_key` (secret, blank = unset), `deepgram_model`, `deepgram_base_url`, `transcription_timeout_seconds`, `transcription_total_budget_seconds` (under 20 s), `transcription_max_retries`. A `build_transcriber(settings)` (next to `build_provider` in `core/ai/factory.py`) returns `None` without a key and logs that voice is off. `main.py` lifespan stores it on `app.state.transcriber` and closes it on shutdown; it is never wrapped in `TracingProvider`. `.env.example` documents the block. — Test: first
   - Seam (user-confirmed): `Settings` + `build_transcriber`, in the existing `tests/core/ai/test_factory.py` (factory) and `tests/core/test_config.py` (settings).
   - Slices: blank key -> `None` (EC22) -> key set -> a `DeepgramTranscriber` with the configured model and base URL -> the key never appears in settings validation errors (existing `hide_input_in_errors`).
5. **Rate limiter.** `core/rate_limit.py`: an in-memory fixed-window limiter keyed by string with an injectable clock and a lock; `hit(key)` returns allowed or the seconds until the window resets. `core/errors.py`: `RateLimitedError` (429, `RATE_LIMITED`) with `Retry-After`. A module-level instance for transcriptions (10/min) exposed through a dependency so tests override it. — Test: first
   - Seam (user-confirmed): `RateLimiter.hit(key)`.
   - Slices: 10 hits allowed, 11th refused with retry-after (EC21) -> another key unaffected -> a new window allows again.
6. **Audio checks.** `interviews_constants.py`: allowed content types (WebM, OGG, MP4/M4A, WAV, with and without codec parameters), `TRANSCRIPTION_MAX_BYTES` (3 MB), `TRANSCRIPTION_MAX_SECONDS` (125). `interviews_utils.py`: a pure `audio_container(declared_type, head_bytes)` that returns the container or `None` when the type is not allowed or the signature does not match (WebM EBML header, `OggS`, MP4 `ftyp` at offset 4, `RIFF....WAVE`). `core/errors.py`: `UnsupportedAudioError` (415), `AudioTooLargeError` (413), `AudioTooLongError` (422), `NoSpeechError` (422), `TranscriptionUnavailableError` (503), matching the existing error-class pattern. — Test: first
   - Seam (user-confirmed): `audio_container(declared_type, head_bytes)`.
   - Slices: each allowed type with its signature -> codec parameters accepted -> disallowed type -> mismatched signature (e.g. `audio/webm` with a WAV header) -> too-short head.
7. **Endpoint** (router -> controller; no repository changes, since nothing is stored).
   - `interviews_schema.py`: `TranscriptionOut { text }` with `extra="forbid"`.
   - `interviews_dependencies.py`: `get_transcriber` (from `app.state`, overridable, like `get_llm_provider`) and the limiter dependency; `get_controller` passes the transcriber into `InterviewsController`'s constructor, next to `llm`.
   - `interviews_controller.py` (all business rules; no HTTP objects): a sync `prepare_transcription(user, session_id)` that returns the interview's `JobRole` (reuses `_owned_session`, raises `SessionNotInProgressError`) and an async `transcribe(user, session_id, role, audio bytes, declared content type)` that sends `ROLE_KEYTERMS[role]` (shared terms + the role's own, in `interviews_constants.py`; spike decision 2026-11-04) and, in order: rejects over 3 MB (`AudioTooLargeError`), empty (`NoSpeechError`, 422 `NO_SPEECH`), and a bad type/signature via `audio_container` (`UnsupportedAudioError`); raises `TranscriptionUnavailableError` when no transcriber is configured; calls it and maps `LLMError` to `TranscriptionUnavailableError`; raises `NoSpeechError` for blank text and `AudioTooLongError` above 125 s; trims and caps at `ANSWER_MAX_LENGTH`; logs one metadata line (user id, session id, bytes, content type, duration, model, latency, outcome; never text or audio).
   - `interviews_route.py` (HTTP only): an `async def` route with `UploadFile`, the `interviews:answer` permission and the limiter dependency; it runs `prepare_transcription` in the threadpool (same pattern as the stream route), reads at most cap + 1 bytes from the upload, and hands the bytes and declared content type to `ctrl.transcribe`. Explicit `status_code=200`, `response_model`, and `responses=` for 404, 409, 413, 415, 429, 503.
   - Test: first
   - Seam (user-confirmed): the HTTP route via `TestClient` with `FakeTranscriber` overriding `get_transcriber` (fixtures in `tests/modules/interviews/conftest.py`; new file `tests/modules/interviews/test_transcribe.py`).
   - Slices, in order: owner + valid WebM -> 200 with the fake's text (AC2) -> no token 401, other user / unknown 404, completed 409 (AC3, EC17) -> no transcriber configured 503 (EC22) -> missing file part 422 (request validation), empty file 422 `NO_SPEECH`, transcriber not called -> disallowed type / mismatched signature 415, over 3 MB 413, transcriber not called (AC4, EC15) -> blank text 422 `NO_SPEECH` (EC6) -> duration 126 s 422 `AUDIO_TOO_LONG` (EC16) -> 2500-char text capped to 2000 (EC20) -> each vendor error 503 with a generic message (AC6, EC13) -> 11th request 429 with `Retry-After`, transcriber not called (AC7, EC21) -> captured logs hold the metadata line but no transcript text, no audio, no key (AC9).
8. **BE suite.** `uv run pytest` (all), `ruff check` and `ruff format --check` if configured, then `graphify update .` in cuewise-be. — Test: skip (AC10)

### Phase 2: Frontend (cuewise-fe)
9. **Forwarder.** `src/app/api/[...path]/route.ts`: forward `await request.arrayBuffer()` instead of `request.text()` (JSON unchanged on the wire); add `interviews/<id>/transcriptions` to `SLOW_POSTS` with `TRANSCRIBE_FORWARD_TIMEOUT_MS` (25 s, above the BE's 20 s budget) from `modules/interviews/constants.ts`. — Test: first
   - Seam (user-confirmed): the Route Handler's `POST` (existing `tests/app/api/[...path]/route.test.ts`, mocked `fetch` and cookies).
   - Slices: a binary multipart body arrives upstream byte for byte with its boundary `Content-Type` -> transcription path uses `TRANSCRIBE_FORWARD_TIMEOUT_MS` -> existing JSON and stream tests pass unchanged (AC11).
10. **Constants, schema, types.** `constants.ts`: `RECORDING_MAX_SECONDS` (120), `TRANSCRIBE_FORWARD_TIMEOUT_MS` (25 s, forwarder) and `TRANSCRIBE_TIMEOUT_MS` (30 s, browser; deliberately longer so a slow request always ends with the forwarder's clean 503 instead of a race), the transcription error codes and the messages from the spec's UX section (keep-in-step comment). `interviews.schema.ts`: `transcriptionResponseSchema`. `interviews.types.ts`: inferred types. — Test: first
   - Seam (user-confirmed): `transcriptionResponseSchema` (existing `tests/modules/interviews/schemas/interviews.schema.test.ts`).
   - Slices: accepts `{ text }` -> rejects a missing/non-string text -> strips unknown keys.
11. **Service + query.** `interviewsService.transcribe(id, recording, signal)`: `apiClient.post` (per the CLAUDE.md rule: services always use `apiClient`) with `FormData` (file part named as the BE expects, filename by container) and a config carrying `TRANSCRIBE_TIMEOUT_MS` (30 s) and the `signal`, parsed with the schema; the `API` interceptor behind `apiClient` handles a session-ending 401 (EC19). `useTranscribeAnswerMutation(id)` in `interviews.queries.ts`, no cache writes. — Test: first
   - Seam (user-confirmed): `interviewsService.transcribe` with `apiClient` mocked (`vi.mock("@/lib/api/api.client")`, resolving the payload), as in the existing `interviews.services.test.ts`; error builders from `tests/helpers/axios.ts`.
   - Slices: posts multipart to `/interviews/<id>/transcriptions` with the timeout and signal -> returns parsed text -> rejects an invalid body -> propagates `ApiResponseError` / no-response errors unchanged.
12. **Pure helpers.** `modules/interviews/utils/get-transcribe-error-result.ts`: maps an error to `{ kind: "resync" }` (404, 409 resync codes), `{ kind: "message", message }` for each code in the spec (`NO_SPEECH`, `AUDIO_TOO_LONG`, `RATE_LIMITED`, `AUDIO_TOO_LARGE`/`UNSUPPORTED_AUDIO`, `TRANSCRIPTION_UNAVAILABLE`/network/other), following `get-answer-error-result.ts`; its `TranscribeErrorResult` type goes in `types/interviews.types.ts` next to `AnswerErrorResult`. `utils/append-transcript.ts`: appends with one space, or nothing after a trailing newline or into an empty box; never truncates. — Test: first
   - Seams (user-confirmed): `getTranscribeErrorResult(error)`, `appendTranscript(existing, text)`.
   - Slices: each code -> its message (EC6, EC12-EC16) -> 404/409 -> resync (EC17) -> no response -> unavailable (EC12) | empty box -> text only -> existing text -> one space (EC7) -> trailing newline -> no extra space -> trailing spaces not doubled -> combined over 2000 kept whole (EC8).
13. **Recorder.** `pickRecordingFormat` in `src/lib/utils.ts` (the generic-helpers file): pure, takes an `isTypeSupported` function, returns WebM/Opus, then MP4, then OGG, else `null`. `src/hooks/use-audio-recorder.ts` (feature-agnostic, so in shared `hooks/`, next to `use-warn-before-unload.ts`): status (`idle | requesting | recording | error`), elapsed seconds, `start`, `stop` (resolves with the blob + type, or nothing for an empty clip), `cancel`, error kind (`denied | no-device | unsupported | failed`); auto-stops at `RECORDING_MAX_SECONDS`; stops every track on stop, cancel, error and unmount. — Test: first for the picker, after for the hook
   - Seam (user-confirmed): `pickRecordingFormat(isTypeSupported)`, in `tests/lib/utils.test.ts` (AC12, EC1).
   - Hook checked by hand in Step 15 (AC13, EC2-EC5, EC9, EC23): no DOM test setup.
14. **Composer UI.** `use-interview-chat.ts`: a `transcribe(question, recording, signal)` action using the mutation and Step 12's mapping, triggering the existing resync callbacks for `resync` and a toast via `useMutationCallbacks` for messages; returns the text or nothing. `ActiveInterview`/`InterviewChat` pass it down. New presentational `modules/interviews/components/AnswerMicButton.tsx` (idle / recording with timer and stop / transcribing spinner; state-reflecting `aria-label`; `motion-safe` pulse; 44 px). `AnswerComposer.tsx`: renders the button only when the picker found a format; uses the recorder hook; while recording or transcribing sets the textarea read-only and blocks submit; a Cancel control while recording; on text, `setValue` via `appendTranscript` with `shouldDirty`, then focus; disabled while `isBusy`; aborts the upload on unmount (the composer is keyed per question, so a question change unmounts it); a polite live region announces start/stop/done. — Test: after (manual; AC15-AC17, AC19, EC4, EC7-EC11)
15. **Quality gates and manual E2E.** FE: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`. Manual run against cuewise-be with a Deepgram key, recorded in `task.md`: Chrome and Safari (Firefox if available) record -> transcript -> edit -> send; 120 s auto-stop and clip size per browser; permission denied; no mic; cancel; silent clip; empty clip; question change mid-transcribe; expired session; no key (503); 11 quick clips (429). Then `graphify update .`. — Test: skip (AC18-AC21)

## Affected Files & Patterns
- **cuewise-be**
  - `app/core/ai/retry.py` (new), `openai_compatible.py` (uses it) — follow the current `_retry_delay` / `_backoff` / `_raise_for_status` semantics exactly.
  - `app/core/ai/transcriber.py`, `deepgram.py` (new); `fake.py` (+`FakeTranscriber`); `factory.py` (+`build_transcriber`) — pattern: `OpenAICompatibleProvider` (injected transport/sleep/clock), `FakeProvider`.
  - `app/core/config.py`, `.env.example` — pattern: the `llm_*` block and `_blank_is_unset`.
  - `app/core/rate_limit.py` (new), `app/core/errors.py` (+6 errors).
  - `app/main.py` lifespan — store/close next to `llm_provider`.
  - `app/modules/interviews/interviews_{constants,utils,schema,dependencies,controller,route}.py` — pattern: `prepare_answer` + threadpool in the stream route; `_owned_session`; `llm` injected through `get_controller`. No new module files; no `interviews_repository.py` change.
  - Tests (BE names test files by behavior; `tests/` mirrors `app/` folders): `tests/core/ai/test_deepgram.py` (new), `tests/core/ai/test_factory.py` (+`build_transcriber`), `tests/core/test_config.py` (+settings), `tests/core/test_rate_limit.py` (new), retry helper covered by the existing `tests/core/ai/test_openai_compatible*.py`, `tests/modules/interviews/test_audio_container.py` and `test_transcribe.py` (new), `FakeTranscriber` fixture in `tests/modules/interviews/conftest.py`.
- **cuewise-fe**
  - Changed: `src/app/api/[...path]/route.ts`; `src/lib/utils.ts` (+`pickRecordingFormat`); `src/modules/interviews/{constants.ts, schemas/interviews.schema.ts, types/interviews.types.ts, services/interviews.services.ts, queries/interviews.queries.ts, hooks/use-interview-chat.ts, components/AnswerComposer.tsx, components/InterviewChat.tsx}`; `src/app/(app)/interviews/_components/ActiveInterview.tsx` if the action is passed from there.
  - New: `src/hooks/use-audio-recorder.ts`; `src/modules/interviews/utils/{get-transcribe-error-result.ts, append-transcript.ts}`; `src/modules/interviews/components/AnswerMicButton.tsx`.
  - Tests mirror `src/` exactly: `tests/app/api/[...path]/route.test.ts`, `tests/modules/interviews/schemas/interviews.schema.test.ts`, `tests/modules/interviews/services/interviews.services.test.ts` (+cases); `tests/lib/utils.test.ts`, `tests/modules/interviews/utils/{get-transcribe-error-result,append-transcript}.test.ts` (new); builders in `tests/helpers/interviews.ts`.
  - No new folders in either repo.
  - Patterns: `get-answer-error-result.ts`, `useMutationCallbacks`, the `SLOW_POSTS` table, `AnswerComposer`'s busy/read-only handling and `useImperativeHandle` focus.
- **Risks:** Step 1 touches working LLM code (mitigated: no behavior change, existing tests); the forwarder change affects every route (mitigated: existing tests); `MediaRecorder` and Safari quirks (manual matrix in Step 15); Deepgram terms/credit (Step 0).

## Testing Strategy
- Framework & command: BE pytest (`uv run pytest`, single file `uv run pytest tests/modules/interviews/test_transcribe.py`); FE Vitest node-only (`npm test`, single file `npm test -- tests/modules/interviews/utils/append-transcript.test.ts`).
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 0 | skip | spike notes in task.md |
| AC2 | 7 | first | |
| AC3 | 7 | first | |
| AC4 | 6, 7 | first | |
| AC5 | 7 | first | |
| AC6 | 4, 7 | first | |
| AC7 | 5, 7 | first | |
| AC8 | 1, 2, 3, 4 | first | Step 1 via existing tests |
| AC9 | 7 | first | captured logs |
| AC10 | 8 | skip | full suite |
| AC11 | 9 | first | |
| AC12 | 13 | first | |
| AC13 | 13 | after | manual |
| AC14 | 10, 11, 12 | first | |
| AC15 | 14 | after | manual |
| AC16 | 12, 14 | first / after | append rule unit-tested; UI manual |
| AC17 | 14 | after | manual |
| AC18 | 11, 15 | after | existing interceptor; manual |
| AC19 | 14, 15 | after | manual a11y |
| AC20 | 8, 15 | skip | gates |
| AC21 | 15 | after | manual E2E |
| EC1 | 13, 14 | first / after | |
| EC2, EC3 | 13 | after | real permission prompts |
| EC4, EC5 | 13, 14 | after | |
| EC6 | 7, 12 | first | |
| EC7, EC8 | 12, 14 | first / after | |
| EC9 | 13, 14 | after | |
| EC10, EC11 | 14 | after | |
| EC12 | 12 | first | |
| EC13 | 3, 7, 12 | first | |
| EC14 | 7, 12 | first | |
| EC15 | 6, 7, 12 | first | |
| EC16 | 7, 12 | first | |
| EC17 | 7, 12 | first | |
| EC18 | 0 | skip | verified in spike; no prompt exists to inject |
| EC19 | 11, 15 | after | |
| EC20 | 7 | first | |
| EC21 | 5, 7 | first | |
| EC22 | 4, 7 | first | |
| EC23 | 13 | after | |

- Must verify, not assume: Deepgram accepts each browser container as recorded; `metadata.duration` present; credit and MIP terms (Step 0; the parameter names `keyterm`, `smart_format`, `filler_words`, `language`, `mip_opt_out` are confirmed in Deepgram's API reference). 120 s clip size per browser under 3 MB; 3 MB multipart passes the forwarder intact; `MediaRecorder` stop/empty-clip behavior on Safari (Step 15).
- Open questions: none (every EC has an expected outcome).
- Known baseline failures: none seen; run both suites before Step 1 to confirm a green baseline.

## Blockers & Resolutions
- Spike may fail -> Step 0 is a hard gate before Phase 2 (moved from before Phase 1 by user decision; Phase 1 tests use fakes only); re-plan (FE conversion or self-hosted Whisper behind `Transcriber`) instead of building Phase 2.
- BE cannot measure compressed duration -> 3 MB cap + FE auto-stop + Deepgram's reported duration (EC16).
- Binary bodies corrupted by the forwarder -> Step 9 before any FE upload work.
- `proxyClientMaxBodySize` (10 MB default) -> not applicable: `src/proxy.ts` excludes `/api`.
- Async vendor call vs sync DB controller -> ownership check in the threadpool, then the awaited transcriber, as in the stream route.

## Trade-offs & Rationale
- Extract a shared retry helper (user choice) -> one set of retry rules; small refactor guarded by existing tests.
- Reuse `LLMError` subclasses for transcriber failures -> the retry helper works unchanged; the names say "LLM" but the classes are vendor-agnostic (noted in the docstring) rather than adding a parallel hierarchy.
- Limiter in `core/` as a dependency (user choice) -> reusable for auth later; overridable in tests; per-process only (accepted in spec).
- `apiClient` + `FormData` (user choice; the project rule) -> keeps the session-expired interceptor and error parsing; no streaming needed.
- Recorder hook in shared `hooks/`, picker in `lib/utils.ts` -> feature-agnostic browser code goes where the structure puts it, with no new folders; the interview-specific mapping and append rules stay in `modules/interviews/utils`.
- Size, type and signature checks in the controller, not the route -> routes stay HTTP-only; the route only bounds how many bytes it reads.
- No vendor SDK -> same style as the LLM provider; request shape visible and tested.
- Signature check before calling Deepgram -> rejects junk without spending credit.

## Project Rules Applied
- FE `CLAUDE.md`: service -> query -> component (Steps 11, 14); zod on external data (10, 11); `useMutationCallbacks` toasts (14); BFF, no key or token in JS (9); tests mirror `src/` in `tests/` (all FE steps); no new dependency; a11y requirements (14).
- BE `CLAUDE.md`: router -> controller, thin route (7); module-prefixed files; vendor behind a protocol, no SDK (2, 3); `AppError` subclasses (5, 6); ownership in the controller (7); settings via `pydantic-settings` + `.env.example` (4); rate limiting on sensitive endpoints (5); no PII/secrets in logs (7).
- Both: no commit/stage/push/branch; `graphify update .` after code changes (8, 15).

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| lean-ctx | Located the forwarder, composer, chat hook, service/query patterns (FE) and the provider, fake, factory, lifespan, errors, config, conftest fixtures (BE) |
| graphify | Mapped `AnswerComposer` -> `use-interview-chat` -> queries -> services and the forwarder's role |
| grill-me (via AskUserQuestion) | Retry helper extraction, limiter location, axios upload, and confirmation of all test seams |
| ponytail | Dropped client-side WAV conversion and BE decoding; reused `LLMError` and the existing interceptor instead of new plumbing |
| security-review (applied inline) | Key stays server-side; signature + size checks before the vendor call; rate limit before spend; no audio/text/key in logs; v1 stays in Deepgram's Model Improvement Program (user decision: opt-out has a price impact) |
| ui-ux-pro-max | Not invoked now; consult during Step 14 for the mic button states and recording indicator |

## Ready to Implement
- All spec requirements mapped to steps
- Every step has a Test tag; every AC#/EC# mapped in Testing Strategy
- Affected files identified in both repos
- Blockers resolved (Step 0 is the gate), edge cases handled
- Trade-offs documented with rationale
- No deviations from spec. One clarification: transcriber failures reuse the `LLMError` classes (the spec only requires a contract separate from `LLMProvider`)
