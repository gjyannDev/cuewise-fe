# Implementation: Voice Answers

## Status
Phase 0 spike passed (Chrome WebM). Phase 1 (cuewise-be) and Phase 2 code (Steps 9-14) complete. Remaining: Step 15, the manual end-to-end run (user, in a real browser with a microphone).

## Completed Steps
- [x] 0. Deepgram spike (passed for Chrome WebM; Safari/Firefox in Step 15)
- [x] 1. Extract shared retry rules (BE)
- [x] 2. Transcriber contract + fake (BE)
- [x] 3. DeepgramTranscriber (BE)
- [x] 4. Config, factory, lifespan (BE)
- [x] 5. Rate limiter (BE)
- [x] 6. Audio checks (BE)
- [x] 7. Endpoint (BE)
- [x] 8. BE suite + graphify (BE)
- [x] 9. Forwarder (FE)
- [x] 10. Constants, schema, types (FE)
- [x] 11. Service + query (FE)
- [x] 12. Pure helpers (FE)
- [x] 13. Recorder (FE)
- [x] 14. Composer UI (FE)
- [ ] 15. Quality gates (done) + manual E2E (user)

## Current Step
### 15. Manual end-to-end run (user)
Run cuewise-be with `DEEPGRAM_API_KEY` set, and cuewise-fe with `npm run dev`, then check and record here:
- [ ] Chrome: record -> "Transcribing…" -> text appended to the box -> edit -> Send works as before.
- [ ] Safari (macOS or iOS, if available) and Firefox: the same; note the 120 s clip size for each.
- [ ] 120 s: recording stops by itself, is transcribed, "Recordings are limited to 2 minutes." shows.
- [ ] Permission denied (block the mic in site settings): "Microphone access is blocked…"; typing still works.
- [ ] Cancel while recording: nothing uploaded, mic indicator off, box unlocked.
- [ ] Silent clip: "Didn't catch that. Try again."; nothing added.
- [ ] Stop immediately (empty clip): same message, nothing uploaded.
- [ ] Typed text first, then record: transcript added after one space; nothing replaced.
- [ ] Question changes / leave the page while transcribing: no text added later; mic indicator off.
- [ ] Expired session during upload: redirected to sign-in.
- [ ] No `DEEPGRAM_API_KEY` (restart BE without it): "Voice answers aren't available right now…".
- [ ] 11 quick recordings in a minute: the 11th shows "Too many recordings…".
- [ ] Keyboard only: Tab to the mic, Enter/Space starts, Tab to Stop; focus ring visible; screen reader hears "Recording", "Transcribing", the result.
- [ ] Phone width: mic + Send fit on one line, tap targets 44 px; reduced motion: no pulsing/spinning.

## Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`)
- New: `app/core/ai/retry.py` (shared backoff / retry decision / status mapping), `app/core/ai/transcriber.py` (`Transcriber`, `TranscriptionResult`), `app/core/ai/deepgram.py` (`DeepgramTranscriber`, httpx, no SDK), `app/core/rate_limit.py` (`RateLimiter`).
- Changed: `openai_compatible.py` (uses `retry.py`, no behavior change), `fake.py` (+`FakeTranscriber`), `factory.py` (+`build_transcriber`), `config.py` (+`DEEPGRAM_*`, `TRANSCRIPTION_*`, `transcription_configured`), `errors.py` (+6 errors), `main.py` (lifespan builds/closes the transcriber), `.env.example` (+transcription block), interviews `constants` (+`AudioContainer`, types, limits), `utils` (+`audio_container`), `schema` (+`TranscriptionOut`), `dependencies` (+`get_transcriber`, limiter, `limit_transcriptions`), `controller` (+`prepare_transcription`, `transcribe`, metadata log on `app.stt`), `route` (+`POST /interviews/{id}/transcriptions`, multipart part `audio`).
- Tests: new `tests/core/ai/test_deepgram.py`, `tests/core/test_rate_limit.py`, `tests/modules/interviews/test_audio_container.py`, `tests/modules/interviews/test_transcribe.py`; extended `test_factory.py`, `test_config.py`, interviews `conftest.py` (`stt`, `transcribe` fixtures), root `conftest.py` (blanks `DEEPGRAM_API_KEY`).
- Suggested commit (cuewise-be): `feat(interviews): transcribe recorded answers with Deepgram for review before sending`
- Suggested commit (cuewise-fe): `feat(interviews): record an answer by voice and add its transcript to the box for review`

## Changes Made (cuewise-fe, uncommitted)
- Changed: `src/app/api/[...path]/route.ts` (forwards request bodies as bytes; `transcriptions` gets a 25 s budget), `src/lib/utils.ts` (+`pickRecordingFormat`), interviews `constants.ts` (+timeouts, `RECORDING_MAX_SECONDS`, error codes and messages), `schemas` (+`transcriptionResponseSchema`), `types` (+`Transcription`, `TranscribeErrorResult`), `services` (+`transcribe` via `apiClient`, multipart part `audio`), `queries` (+`useTranscribeAnswerMutation`, key `transcribe`), `hooks/use-interview-chat.ts` (+`transcribe` action returning `TranscribeResult`), `components/AnswerComposer.tsx` (mic, locking, status line, append), `ActiveInterview.tsx` (passes `chat.transcribe`).
- New: `src/hooks/use-audio-recorder.ts`, `components/AnswerMicButton.tsx`, `utils/get-transcribe-error-result.ts`, `utils/append-transcript.ts`; tests `tests/lib/utils.test.ts`, `tests/modules/interviews/utils/{get-transcribe-error-result,append-transcript}.test.ts`; extended forwarder, schema and service tests.

## Test Results
- BE full suite (after per-role keyterms): 985 passed, 1 skipped, 1 failed (baseline, below). 101 new tests, all passing. Pyright: 0 errors on the changed app files.
- Per step: Step 1 `tests/core/ai` 96 passed unchanged; Step 3 20 passed; Step 4 `tests/core` 179 passed (+ baseline); Step 5 5 passed; Step 6 21 passed; Step 7 28 passed (first attempt).
- `ruff` not run: not installed in the project, and `uvx ruff` is blocked by the shell allowlist. Line length checked by hand (<=120 on all new/changed lines).
- FE: `npx tsc --noEmit` clean; `npm run lint` clean; `npm test` 361 passed (30 files; 36 new); `npm run build` passes with `NODE_ENV=production` (see Known Issues: this shell has `NODE_ENV=development`, which makes `next build` fail on `/_global-error`).
- Per step (FE): Step 9 forwarder 33 passed; Step 10 schema 44 passed; Step 11 service 20 passed; Step 12 utils 20 passed; Step 13 picker 4 passed.

## Tests Pending
- Step 15 (manual, user): the recorder hook and composer UI (AC13, AC15-AC17, AC19, AC21; EC2-EC5, EC7-EC11, EC19, EC23). No DOM test setup in this repo.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | existing OpenAI-compatible provider tests unchanged after the extraction | spec | AC8 (Step 1 safety net) | pass |
| T2 | 3 | request: raw body, content type, `Token` auth, model/language/smart_format/filler_words params | spec | AC8 | pass |
| T3 | 3 | keyterms sent as repeated `keyterm` params | spec | AC8 | pass |
| T4 | 3 | `mip_opt_out` not sent | spec | deviation 2026-11-04 | pass |
| T5 | 3 | parses trimmed transcript, duration, model, attempts | spec | AC8 | pass |
| T6 | 3 | blank transcript returned as "" (controller decides) | spec | EC6 | pass |
| T7 | 3 | missing duration is None | inferred | assumption: duration may be absent | pass |
| T8 | 3 | 503 and 429 retried with backoff | spec | AC8, EC13 | pass |
| T9 | 3 | gives up after max retries / before the budget | spec | AC8 | pass |
| T10 | 3 | 400/401/402/403 not retried | spec | AC8 | pass |
| T11 | 3 | unusable 200 (bad JSON, missing fields, null transcript) is a bad response | code-derived | `_parse` branches | pass |
| T12 | 3 | timeout and dropped connection mapped | spec | AC8 | pass |
| T13 | 4 | no key -> no transcriber + one warning | spec | AC6, EC22 | pass |
| T14 | 4 | key -> DeepgramTranscriber with configured model; key never logged | spec | AC8, AC9 | pass |
| T15 | 4 | defaults, blank key = unset, key not in repr/errors, limits positive, `.env.example` complete | spec | AC6, AC8, EC22 | pass |
| T16 | 5 | 10 allowed, 11th refused with seconds left | spec | AC7, EC21 | pass |
| T17 | 5 | keys independent; new window allows; refused hits don't extend; retry-after >= 1 | spec / inferred | EC21; risk: lockout | pass |
| T18 | 6 | each allowed type + signature accepted; codec params/case ignored | spec | AC4 | pass |
| T19 | 6 | disallowed type, mismatched signature, short head refused | spec | AC4, EC15 | pass |
| T20 | 7 | owner gets transcript; vendor gets exact bytes and type | spec | AC2 | pass |
| T21 | 7 | nothing stored in the transcript | spec | AC9 | pass |
| T22 | 7 | 401 / same 404 for foreign and missing / 409 for abandoned and completed | spec | AC3, EC17 | pass |
| T23 | 7 | no transcriber -> 503 | spec | AC6, EC22 | pass |
| T24 | 7 | no file part 422; empty file 422 NO_SPEECH; 415 cases; over 3 MB 413; exactly 3 MB ok | spec / inferred | AC4, EC15 | pass |
| T25 | 7 | blank -> NO_SPEECH; >125 s -> AUDIO_TOO_LONG; 125 s / no duration ok; >2000 chars capped | spec / inferred | AC5, EC6, EC16, EC20 | pass |
| T26 | 7 | every vendor failure -> generic 503 | spec | AC6, EC13 | pass |
| T27 | 7 | 11th in a minute -> 429 + Retry-After, vendor not called; other user unaffected | spec | AC7, EC21 | pass |
| T28 | 7 | one metadata log line, no transcript text; failure logs its code | spec | AC9 | pass |
| T29 | 3, 7 | keyterms sent per call; the interview's role picks its list | spec | spike decision | pass |
| T30 | 7 | every role has a de-duplicated list with the shared terms, plain text, under the token limit | spec / inferred | Deepgram limits | pass |
| T31 | 9 | binary multipart body forwarded byte for byte with its boundary | spec | AC11 | pass |
| T32 | 9 | `transcriptions` POST gets the 25 s budget; other budgets unchanged | spec | AC11 | pass |
| T33 | 10 | transcription response schema accepts `{text}`, rejects missing/non-string, strips extras | spec | AC14 | pass |
| T34 | 11 | service posts part `audio` with the browser type, file name by container, 30 s timeout and signal | spec | AC14 | pass |
| T35 | 11 | service rejects a bad body; lets backend errors through | spec | AC14 | pass |
| T36 | 12 | each BE code -> its message; 404/409 -> resync; no response / unknown / non-JSON -> unavailable, never backend text | spec | AC14, EC6, EC12-EC17 | pass |
| T37 | 12 | append: empty box, whitespace-only box, one space, trailing newline, trailing spaces, trimmed transcript, over 2000 kept | spec / inferred | AC16, EC7, EC8 | pass |
| T38 | 13 | format picker: WebM/Opus, then MP4, then OGG, else null | spec | AC12, EC1 | pass |

## Open Questions
- None blocking. Inferred cases to confirm: T7 (missing duration accepted), T24 "exactly 3 MB accepted", T25 "exactly 125 s accepted" (limits treated as inclusive).

## Phase 0: Spike results
Run 2026-11-04, model `nova-3`, `language=en`, `smart_format=true`, sent as recorded with `Content-Type: audio/webm`.

| Clip | Size | Duration reported | Latency (no keyterms / keyterms) | Accepted |
|------|------|-------------------|-----------------------------------|----------|
| Chrome WebM/Opus, 30 s | 480 KB (~16 KB/s, ~1.9 MB per 120 s) | 30.48 s | 2499 ms / 2019 ms | yes |
| Chrome WebM/Opus, 120 s | 1,896 KB (62% of the 3 MB cap) | 120.54 s | 4027 ms / 5157 ms | yes |
| Firefox OGG | optional, not run | | | |
| Safari MP4 | not run (no Mac); covered by the Phase 2 manual pass | | | |

Accuracy on the technical passage:

| Said | Without keyterms | With keyterms |
|------|------------------|---------------|
| useEffect | "use event" | useEffect |
| TanStack Query | "constant query" | TanStack query |
| PostgreSQL | "Postgres SQL" | PostgreSQL |
| Redis | "Redix" | Redis |
| nginx | NGINX | nginx |
| FastAPI | "past API" | "past API" (not fixed) |
| REST | "rest" | "rest" (not fixed) |

Findings:
- WebM is accepted as recorded (no conversion); `metadata.duration` is reported, so `AUDIO_TOO_LONG` works; latency ~2-2.5 s per 30 s, far under the 10 s target; size fits the 3 MB cap.
- **Keyterms are needed for v1**: they fix most framework/tool names. Per the plan, v1 sends a fixed, short per-role keyterm list kept in BE constants. Some terms stay wrong even with keyterms ("FastAPI"), which the review-before-send step covers.
- 120 s clip (natural interview answer, no terms from the keyterm list): 1,896 KB, 120.54 s reported (under the 125 s check), 4-5 s latency (under the 10 s target and the 20 s BE budget). Transcript 296 words / 1,751 characters: a 2-minute answer at a relaxed pace sits just under the 2,000-character answer limit, so a fast speaker can exceed it (the BE then caps the text, EC20).
- General speech is accurate; misheard domain phrases outside the keyterm list: "row-level security" -> "low level security", "QR code" -> "your code", "push notification" -> "post notification", "front desk" -> "front task", "retrofit" -> "retribute". Keyterms only help terms that are listed, so the per-role lists should include common domain phrases, not only tool names.
- Credit: no expiration. Usage alert: already set in the console.
- **Verdict: spike passes for Chrome WebM** (accepted as recorded, duration reported, latency and size within limits, keyterms needed). Safari MP4 and Firefox OGG are verified in the Phase 2 manual pass (Step 15).
- Security: the Deepgram key used for the first run was exposed in the chat transcript; user advised to revoke it (a new key was used for the 120 s run).

## Baseline Failures
- BE `tests/core/test_config.py::test_llm_settings_default_to_off_with_documented_limits`: expects `llm_max_tokens == 800`, code default is `4000` (`app/core/config.py`). Pre-existing, unrelated to this feature; not fixed here.

## Known Issues
- lean-ctx in this session is rooted at cuewise-fe, so cuewise-be files were read via `ctx_shell` and edited with native Read/Edit/Write (user-approved, 2026-11-04).
- Starlette spools a multipart upload to a temp file before the route runs, so an oversized upload uses disk (not memory) until it is rejected with 413. Bounded in production by the host's request-size limit; the route itself never reads more than 3 MB + 1 byte.
- `RateLimiter` keeps one small entry per user id that has transcribed (never pruned). Fine at this scale; replace with a shared store when scaling out.
- Pre-existing lines over 120 characters remain in `interviews_utils.py`, `interviews_controller.py:437` and interviews `conftest.py:106` (not touched).
- This shell has `NODE_ENV=development` set globally. `next build` then fails prerendering `/_global-error` ("Cannot read properties of null (reading 'useContext')") and prints "unique key" warnings; with `NODE_ENV=production` the build passes cleanly. Not caused by this feature; unset `NODE_ENV` (or set it to production) before building.
- The recorder hook (`use-audio-recorder.ts`) and the composer UI are not unit-tested (no DOM test setup); they are covered by the Step 15 manual checklist.

## Deviations from Plan
- Spike gate moved: Phase 1 is built against fakes before the spike; the spike must pass before Phase 2 -> spec.md (Process, Phase 0, AC1) and plan.md (Step 0, Blockers) updated -> Approved by: user (2026-11-04).
- `mip_opt_out` not sent (Deepgram documents a price impact for opting out) -> spec.md (Transcription options, Non-Functional privacy, AC8) and plan.md (Step 3, Skills Consulted) updated -> Approved by: user (2026-11-04).
- `Transcriber.transcribe` takes no per-call budget (no caller has its own deadline; the budget comes from settings) -> plan.md Step 2 updated -> minor, no spec impact.
- Keyterms per role (after the spike): `transcribe(..., keyterms=...)` per call instead of a fixed list on the instance; `ROLE_KEYTERMS` (= `SHARED_KEYTERMS` + a role's own terms) in `interviews_constants.py`; `prepare_transcription` returns the role and the controller sends that role's list -> plan.md Steps 3 and 7 updated -> Approved by: user (2026-11-04). Lists drafted for review (below).
- Step 3 TDD: slice 1 ran strictly red -> green; the class was then written in one pass (fully specified by the plan) and slices 2-8 were added against it. All slices pass; none was loosened.
- Step 9: the existing "forwards a POST JSON body" test compared `init.body` to a string; with bytes forwarded it now decodes the `ArrayBuffer` first (same content, same strictness). The plan said existing forwarder tests pass unchanged -> one assertion adapted, not loosened. The two timeout constants were added in Step 9 (needed there) rather than Step 10.
- Step 14: voice messages (browser errors, transcription errors, the 2-minute notice) are shown in the composer's status line, announced through one polite live region, instead of toasts. The spec allows "toasts or the field message"; one place keeps the composer presentational and avoids toast spam. The resync case (interview moved on) still uses the existing resync toast, as in the answer flow.
- Step 14: `ui-ux-pro-max` was not consulted (plan suggested it); the mic follows the existing composer's button sizes, tokens and focus styles.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| setup | find-skills | Searched for Deepgram / STT / MediaRecorder / FastAPI upload skills |
| setup, 3 | `deepgram/skills@docs`, `deepgram/skills@api` (installed globally, reviewed: reference only) | Confirmed `/v1/listen` params (`model`, `language`, `smart_format`, `filler_words`, `keyterm`, `mip_opt_out`), `Token` auth, omit `encoding` for containers, 429 = concurrency limit; found the MIP opt-out price impact |
| 1-8 | lean-ctx (`ctx_shell`) | BE exploration and test runs |
| 8 | graphify | `graphify update .` in cuewise-be |
| 9-14 | lean-ctx, graphify | FE exploration (`ctx_read`, `ctx_shell`), `graphify update .` in cuewise-fe |

## Links
- Spec: docs/features/voice-answers/spec.md
- Plan: docs/features/voice-answers/plan.md

---

## Validation Checklist (before PR)
- [ ] All plan.md steps complete (Step 15 manual run pending)
- [x] Full test suite + build green (BE green except the recorded baseline failure; FE tests, lint, typecheck green; build green with `NODE_ENV=production`)
- [ ] Every spec.md acceptance criterion met by actual code and covered by a passing spec test (AC1-AC12, AC14, AC16 append rule, AC20 covered; AC13, AC15, AC17-AC19, AC21 by the manual run)
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately
- [x] task.md fully updated
- [ ] Commits documented (user commits)
- [ ] No open blockers (manual run)
- [x] Code follows project rules (CLAUDE.md in both repos)
- [x] No unresolved plan deviations
