# Feature: Interview Room (a voice interview, styled like a video call)

## Problem
Candidates practise in a typed chat, but a real interview is spoken and face to face. In a real interview you hear the question, answer out loud, and are on camera. Today's interview screen (`InterviewChat`: title bar, `ChatThread`, `AnswerComposer`; all retired by this feature) is a text chat:
- The interviewer is silent text. Nothing in the stack can turn a question into speech.
- Voice is an optional mic button inside a text box (the `voice-answers` feature). Speaking is the exception, not the default.
- Nothing about the screen feels like a call, so the practice doesn't build the habits a spoken interview needs: listening to the whole question, answering without reading, being on camera.

## Goal
The candidate joins a call-style room. They hear every interviewer line spoken aloud: questions, follow-ups and reactions. They answer by voice: record, review the transcript, send. Meanwhile they watch the conversation build up as a transcript next to the call. Every turn is started and ended by the candidate; nothing advances on its own.

How answers are sent, saved, streamed and evaluated **does not change**. cuewise-be still receives only text answers through the existing answer stream, and transcription stays the existing Deepgram pre-recorded `/transcriptions` endpoint. The only new backend capability is speaking a stored interviewer message.

Measurable:
- An interviewer line starts playing within **2 s** of its turn being saved (typical under 1 s).
- Replaying a line that has already played starts within **200 ms** and makes no network request.
- Every failure (TTS down, mic or camera denied, transcription failure) leaves the interview usable, with a clear message.

## Decisions
- **The room replaces the chat screen** for every interview. Everything chat-based goes: no text chat mode, no answer text box, no typing fallback. The right-hand panel is a **transcript** of the call, and the code is renamed to match (chat → transcript/room, decided 2026-11-15).
- **Manual turn-taking only.** The candidate presses Answer and Stop. There is no voice-activity detection or automatic end of turn in this phase.
- **Text-to-speech: Deepgram Aura** (the same vendor and account as transcription). One fixed voice, set in BE config, with no voice picker.
- **TTS is keyed by stored id, not by text.** The transcript comes from two tables:
  - questions and follow-ups are `interview_questions` rows, whose transcript `id` is the question id;
  - reactions are `interview_messages` rows, whose transcript `id` is the message id.
  So there are **two explicit routes**, one per table. The FE picks the route from the item's `kind`. The BE reads the text from the database, so the endpoints can't be used to synthesize arbitrary text.
- **Speech is centralized, not spread through `interviews`** (decided 2026-11-15). In each repo, speech code sits in two layers:
  1. **A generic speech/media kit that knows nothing about interviews.** It holds the vendor adapters, audio validation, availability, error mapping, logging and limits (BE), and the device hooks and media helpers (FE).
  2. **One interview voice adapter**, the only interview code that touches speech. It handles ownership, session status, "question already shown", role keyterms and choosing the stored text.
  The existing voice-answer (STT) code moves into this structure as part of this feature, **with no behaviour change**, so STT and TTS share one design.

## API Contract (shared by both repos; the single source of truth)
cuewise-be implements this contract and cuewise-fe consumes it. Any change is made here first, then in both repos. The browser reaches these routes only through the Next.js `/api/*` forwarder; paths below are cuewise-be's.

| Route | Speaks | Success | Errors |
|---|---|---|---|
| `GET /api/v1/interviews/{session_id}/questions/{question_id}/speech` | A question or follow-up that has already been shown (`position <= session.position`) | `200`, `audio/mpeg` body (one whole clip) | `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `429 RATE_LIMITED` (+ `Retry-After`), `503 SPEECH_UNAVAILABLE` |
| `GET /api/v1/interviews/{session_id}/messages/{message_id}/speech` | An interviewer reaction | same | same |
| `POST /api/v1/interviews/{session_id}/transcriptions` | (existing, **unchanged**) | `200 { "text": string }` | unchanged (see `voice-answers` spec) |

- **Permission:** `interviews:answer` (existing). There is no session-status check on the speech routes, so completed interviews can be replayed.
- **`404 NOT_FOUND` covers every "not yours, not shown, not speakable" case**, so the response never reveals which one applied:
  - the session isn't the caller's;
  - an unknown id;
  - an id from another session;
  - a question not shown yet;
  - a candidate answer;
  - an id sent to the other route.
- **Rate limit:** 30 speech requests per user per minute, shared by both speech routes and kept separate from the transcription limit.
- **Error body:** the project's standard `ErrorResponse` (code, generic message, request id). Clients map **codes**, never message text.
- **Requests carry no body and no text**; the spoken text is always read from the database.
- **Format:** `audio/mpeg` unless Phase 0 picks otherwise. If it changes, this table is updated first. The `Content-Type` sent is always the synthesizer's reported type, so clients must read the header rather than assume MP3.
- **Timeouts:** the BE starts the response within 10 s. The FE forwarder's budget for these routes sits above the BE's, and the browser's sits above the forwarder's, the same layering as transcription.
- **Text first, voice follows.** The question keeps streaming into the transcript as it does today. Its audio plays once the turn is saved, because a stored message id is needed. The text may lead the voice by about a second.
- **Review before send, in the transcript** (decided 2026-11-15): a transcribed answer is never sent automatically. It appears as the newest transcript entry, marked **Not sent**, with two actions: **Send** and **Re-record**. It can't be edited; Re-record **replaces** it.
- **Voice only.** There is no typing. Without a microphone the candidate can still join and hear the questions, but can't answer until the mic is allowed; the room says how to allow it.
- **Camera is a local preview only.** It is never recorded, uploaded or sent anywhere.
- **A lobby before the room**, styled like a video-call pre-join screen. Pressing Join is the user gesture that lets audio play automatically.
- **Live streaming STT** (words appearing while you speak) is phase 2 and out of scope here.
- Two repos. **Phase 0 = spike**, **Phase 1 = cuewise-be** (TTS endpoint), **Phase 2 = cuewise-fe** (the room). This is the single spec; cuewise-be's plan and task files reference it.

## Project Conventions
- Rule files consulted: `CLAUDE.md` + `AGENTS.md` (FE root; there is no `.claude/` directory), `../cuewise-be/CLAUDE.md`, the user's global `~/.claude/CLAUDE.md`, and the specs of `voice-answers`, `interviews-chat-layout`, `interviews-answer-streaming` and `interviews-follow-up-questions`.
- Existing code this builds on (from graphify and lean-ctx):
  - `useInterviewChat` (to be renamed `useInterviewAnswer`) handles sending, the streamed turn, transcription and error mapping.
  - `useAudioRecorder` (shared) handles the mic, the 120 s limit and permission errors.
  - `ChatThread` / `ChatMessage` render the conversation (to be renamed `TranscriptPanel` / `TranscriptEntry`).
  - The screen also uses `InterviewTitleBar`, `EndInterviewDialog`, `InterviewClosingCard` and `InterviewerAvatar`.
  - Every transcript item carries a stored message `id`, including questions, follow-ups and reactions; the stream's `reaction` event carries one too.
  - BE reactions are predefined app copy, not LLM output.
- Constraints those rules impose on this feature:
  - **FE:** data flows service → query → component. Components are presentational; the turn logic lives in hooks and pure logic lives in `utils/<area>.utils.ts`. New components go in a `components/<area>/` folder and must "earn their file". The browser calls only `/api/*`; the JWT stays in the httpOnly cookie; the Deepgram key never reaches the browser. External payloads are parsed with zod. AI and transcript text is rendered as plain text, never as HTML. Shared browser-device hooks go in `src/hooks/`. No new dependency without a stated reason; `getUserMedia`, `HTMLAudioElement` and object URLs are native. shadcn primitives are added through the CLI. Tests mirror `src/` under `tests/`; pure logic is written as node-testable units, and hooks opt into `happy-dom` per test file.
  - **BE:** router → controller → repository. Vendors sit behind a protocol in `core/ai` and are called over plain `httpx` (no SDK), next to the existing `Transcriber`. All errors are `AppError` subclasses with generic client messages. Ownership is checked in the controller. Secrets come from env via `core/config.py`, with `.env.example` updated. Sensitive endpoints are rate limited. No PII, text or audio in logs.
  - **Both:** nothing is committed, staged, pushed or opened as a PR. After code changes, run FE `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and BE `uv run pytest`; then `graphify update .` in each repo.

## User Flow
1. The candidate starts an interview (setup is unchanged) or opens an in-progress one. They land in the **lobby**: a camera preview, mic and camera status (with a way to toggle each), the interview title, and a **Join** button.
2. They press **Join**. The room opens:
   - On the left is the **stage**: the interviewer's main tile, the candidate's camera as a picture-in-picture tile, and a control bar at the bottom.
   - On the right is the **transcript**.
3. The interviewer's tile shows a speaking state, and the current question plays aloud. The question is already in the transcript.
4. When the audio ends (or the candidate presses **Answer** to cut it short), it is the candidate's turn. They press **Answer** (or Space), and recording starts: a timer shows, with Stop and Cancel (Esc).
5. They press **Stop** (or Space, or it stops itself at 120 s). The status shows "Transcribing…", then the answer appears as the newest transcript entry, marked **Not sent**.
6. In review they can **Re-record** (replaces the unsent answer), replay the question, or **Send** (or Ctrl/Cmd+Enter). The text can't be edited.
7. After Send, the answer joins the transcript and the interviewer tile shows "Thinking…". The reaction and the next question (or follow-up) stream into the transcript as they do today. Once saved, the reaction is spoken, then the question. Back to step 4.
8. At any point they can **replay** the current question from the control bar, or any earlier interviewer line from its transcript entry.
9. The last answer completes the interview. The final reaction is spoken, then the closing card replaces the control bar. The camera and mic are released.
10. **End** opens the existing confirmation dialog. Confirming stops the audio, discards any recording or unsent answer, and releases the camera and mic.

## Requirements

### Phase 0: Spike (before Phase 1 is built against the real vendor)
- With the existing Deepgram key, call Aura's text-to-speech endpoint on representative lines: a short reaction, a typical question, and the longest question the prompts produce. Confirm the following and record each in this feature's `task.md`:
  - the voice and model chosen;
  - the output format and how the browser plays it (default: MP3, played with `<audio>` on Chrome, Edge, Firefox and Safari, including iOS);
  - latency to first byte and to completion, for short and long lines;
  - the price per character and how the starter credit covers TTS next to transcription; a usage alert is set;
  - Deepgram's data-use terms for TTS input (assumption to verify: it's the same as for transcription).
- If latency is well over 2 s or the voice is unusable, **stop and re-plan**, for example with a different vendor behind the same contract. No fallback is decided in advance.

### Phase 1: Backend (cuewise-be)

**Endpoints** (two routes, one per table; both return the spoken audio as `audio/mpeg`, or the format Phase 0 picks, as one whole clip. Buffered, not streamed (decided 2026-11-15): the FE needs the whole Blob for its replay cache anyway, and buffering keeps every vendor failure a clean `503` with retries.)
- `GET /api/v1/interviews/{session_id}/questions/{question_id}/speech` speaks a question or follow-up. The question must belong to the session and must already have been shown (`position <= session.position`, the same rule the transcript uses); otherwise it returns `404`. Upcoming questions are never revealed.
- `GET /api/v1/interviews/{session_id}/messages/{message_id}/speech` speaks a reaction. The message must belong to the session and be an **interviewer reaction**; otherwise it returns `404`. A candidate answer is never spoken (`404`).
- Both require an authenticated user with the existing `interviews:answer` permission, and the session must belong to the caller (otherwise `404`).
- The session's status is **not** checked, so lines of a completed interview can still be replayed.
- The text comes only from the database; requests carry no text.
- Nothing is stored: the audio is returned and not cached on the server in this phase.

**Speech synthesis**
- A `SpeechSynthesizer` contract in `core/ai` (alongside `Transcriber`), with a Deepgram Aura implementation over plain `httpx` in the same Deepgram adapter file. It shares the key, base URL and retry rules. It is built at startup and closed on shutdown.

**Centralized speech layer (BE)**
- **Generic layer.** Vendor adapters stay only in `core/ai`. A new interview-agnostic speech layer in `core/speech` holds:
  - audio validation: container signature sniffing, accepted content types, size limits (moved out of the interviews module);
  - the speech limits and their rate-limiter instances (one for transcription, one shared by both speech routes);
  - one speech gateway of plain functions, `transcribe` and `synthesize`. They wrap both vendors with the availability check, the vendor error → `503` mapping and per-request metadata logging (`app.stt` / `app.tts`). The gateway holds no state of its own (vendors are passed in), so it isn't a class (decided 2026-11-15).
  This layer knows nothing about interviews, and the layer tests enforce that `core` never imports `modules`.
- **Interview adapter.** One interview voice adapter (controller, service, dependencies) replaces the transcription-specific files. It handles only interview rules: ownership, session status, "question already shown", role keyterms, the answer-length cap, and choosing the stored text. It then calls the generic speech layer.
- **Rate-limit dependencies stay in the adapter.** The FastAPI dependencies that apply the limits (`limit_transcriptions`, `limit_speech`) live in the interview voice dependencies, not in `core/speech`. They need the authenticated user from auth's `require_permissions`, and `core` must not import `modules` (decided 2026-11-15). They use the limiter instances from `core/speech`.
- **Decoupling rules** (decided 2026-11-15):
  - **One retry loop.** Both Deepgram adapters (STT and TTS) run their attempts through one shared retry helper in `core/ai`; each adapter only builds its request and parses its response. The LLM provider keeps its own loops (sync calls, and streams that must not retry after the first chunk).
  - **Fakes can't drift.** Each speech protocol (`Transcriber`, `SpeechSynthesizer`) has one contract test that runs the same checks against its fake and its real adapter (on a scripted transport).
  - **No interview words in `core/speech`.** The gateway logs generic, caller-given fields; the interview adapter supplies `user`, `session`, `id` and `kind`.
  - **The output format belongs to the synthesizer.** The response's media type is the synthesis result's content type, never a hardcoded `audio/mpeg`, so a format change is a settings change.
  - **Grouped speech settings.** The speech factories read one grouped, read-only settings view (key, base URL, an STT part, a TTS part). Env var names are unchanged.
- Routes stay under `/interviews/{id}/…`, because access is decided per interview.
- The existing `/transcriptions` behaviour, error codes, limits and logs are **unchanged** by the move. The existing transcription tests pass without edits to their assertions; only import paths may change.
- Settings:
  - `DEEPGRAM_TTS_MODEL` (the voice/model from Phase 0) and `DEEPGRAM_TTS_ENCODING` (default `mp3`), reusing `DEEPGRAM_API_KEY` and `DEEPGRAM_BASE_URL`;
  - a timeout and total budget (the response starts within 10 s).
  - `.env.example` documents them.
  - A blank key disables TTS.
- Retries follow the existing LLM/transcription rules: only on a timeout, a 429 or a 5xx, and within the total budget.
- With no key configured, or on any vendor failure after retries, the endpoint returns `503 SPEECH_UNAVAILABLE` with a generic message, and the cause is logged. Interviews are unaffected.

**Abuse control and observability**
- At most **30 speech requests per user per minute**, kept in memory like the transcription limit, returning `429 RATE_LIMITED` with `Retry-After`. The limit is checked before calling Deepgram.
- One metadata log line per request: user id, session id, message id, message kind, character count, model, latency, outcome code. **Never** the text or the audio.
- No Langfuse tracing for TTS.

**Testing**
- A fake synthesizer for route and controller tests (both routes) covering:
  - success (audio bytes and content type);
  - TTS error mapping and the transcription move are covered by the gateway tests;
  - wrong owner, an unknown id, an id from another session, or a question id sent to the message route (and the reverse) (`404`);
  - a candidate answer (`404`);
  - a not-yet-shown question (`404`);
  - not configured or vendor failure (`503`);
  - rate limited (`429`);
  - "no text or audio in logs".
- The Aura implementation is tested with a scripted `httpx` transport: request shape, reading the audio body and its content type, retries and error mapping.
- The shared retry helper has its own unit tests. Each speech protocol has a contract test run against its fake and its real adapter.
- A route test proves the response's media type comes from the synthesis result, not a hardcoded value.

### Phase 2: Frontend (cuewise-fe)

**Centralized speech layer (FE)**
- **Generic media kit, interview-agnostic.** It holds the device hooks:
  - the microphone recorder (the existing `useAudioRecorder`, moved here);
  - the camera;
  - an audio player that plays one line at a time and owns the object-URL cache.
  It also holds the media helpers: recording-format choice (moved out of the generic `lib/utils.ts`), the device error kinds shared by mic and camera, and generic permission copy. It never imports from `modules/`.
- **Interview voice adapter.** It is the only interview code that touches speech, and holds:
  - the voice service calls (transcribe, speak question, speak reaction) with their zod parsing;
  - their query hooks;
  - the voice error mapping and copy;
  - one facade hook that offers transcribe, speak, replay, stop and the speaking state.
  The room components and the turn hook use **only** this facade; nothing else in `interviews` imports the media kit or the voice service.
- **Transcription moves out of the chat hook.** The answer-sending hook (renamed `useInterviewAnswer`) no longer owns transcription; it only sends answers.
- **Chat code is retired and renamed** (decided 2026-11-15): the transcript list and entry components, the view builder and its types, and the answer hook take transcript/room names; the answer text box, mic button and chat layout are deleted, along with the typing-only helpers and copy.
- The existing voice-answer behaviour, messages and tests are unchanged by the move; only import paths may change.

**Forwarder and service**
- The `/api/[...path]` forwarder passes the binary audio response through intact, with its content type, and gives both speech routes a timeout budget above the BE's (shared constants kept with the voice adapter).
- The voice service fetches one line's speech as a `Blob` from the route matching the item's `kind`. Error codes map to fixed messages (see UX); a session-ending 401 uses the existing redirect.

**Lobby**
- It is shown when opening an `in_progress` interview, including after a reload or on return. It isn't shown for completed or ended interviews: those open the room read-only, with the transcript plus the closing or ended card, and no camera.
- It shows a live camera preview, the mic and camera permission state, toggles for both, and **Join**.
- Join is always available:
  - If the **mic** is denied or missing, the lobby explains how to allow it. Join still works and questions are still spoken; in the room the Answer control is disabled, with the same explanation, until the mic is allowed.
  - If the **camera** is denied or missing, the self tile shows the candidate's initials and a camera-off icon.
- Pressing Join starts the current question's audio. This also happens after a reload, so the current question is spoken again.

**Room layout**
- **Stage (left):**
  - The interviewer's main tile reuses the interviewer avatar and has three states: idle, **speaking** (a visible ring plus a text label) and **thinking** (the existing thinking label, including the slow label).
  - The self tile is picture-in-picture: a mirrored camera preview, or initials when the camera is off.
  - The control bar holds Answer/Stop, Cancel (while recording), camera on/off, mute interviewer, replay current question, and **End** (destructive style).
- **Transcript (right):**
  - It is the existing conversation list, renamed to a transcript panel, with the same behaviour (streaming lines, the pending answer, jump-to-latest).
  - Every interviewer entry gets a replay control.
  - In review, the unsent answer is the newest entry, marked **Not sent**, with **Send** and **Re-record**.
- The title bar (role, level, question N of M) is kept.
- The room fits the viewport with no window scroll, like today's screen.

**Turn states** (one state machine in a hook; components only render it)

| State | Entered when | Mic (Answer) | Replay | Send |
|---|---|---|---|---|
| `speaking` | an interviewer line plays (auto or replay) | ✅ stops the audio and starts recording | ✅ restarts | — |
| `your-turn` | audio ends or fails, or a line is skipped | ✅ (disabled with an explanation when there is no mic) | ✅ | — |
| `recording` | Answer pressed | Stop / Cancel | ❌ | — |
| `transcribing` | Stop, or the 120 s limit | ❌ | ❌ | — |
| `review` | the transcript arrives | Re-record (replaces the unsent answer) | ✅ | ✅ |
| `thinking` | Send pressed, until the turn is saved | ❌ | ❌ | ❌ |
| `closed` | completed or ended | ❌ | ✅ (transcript entries only) | ❌ |

- After a saved turn, the reaction plays first, then the question or follow-up, as one queue. A turn with no reaction (before a follow-up) plays only the question.
- **Mute** stops lines from playing automatically; the flow goes straight to `your-turn`. **Replay always plays**, because it's an explicit request, even when muted.
- **Audio cache:** each message's audio is fetched at most once per visit and kept as an object URL keyed by message id. Every URL is revoked when the room unmounts.
- Sending reuses the existing answer mutation and stream. A field error (`422`) shows under the unsent answer, which stays in review so the candidate can re-record; resync, unknown and other failures keep today's messages and behaviour. A failed send keeps the unsent answer.
- **Keyboard:**
  - **Space** starts or stops recording when focus isn't on a button or other control.
  - **Esc** cancels a recording.
  - **Ctrl/Cmd+Enter** sends the unsent answer.
  - All controls are reachable with Tab.

**Camera**
- A shared hook owns the camera: permission, start, stop, toggle, error kinds (denied, no-device, failed), and releasing the tracks on toggle-off, End, completion and unmount. Video only; the mic stays with `useAudioRecorder`.
- The video is never recorded, uploaded or read by anything except the `<video>` element.

**Mobile (phone width)**
- The stage fills the screen with the control bar at the bottom. A **Transcript** button opens the transcript as a bottom drawer. The drawer opens automatically when an unsent answer is ready for review.

### Non-Functional
- **Latency:** an interviewer line starts within 2 s of its turn being saved (typical under 1 s). A cached replay starts within 200 ms. The camera preview shows within 1 s of permission being granted.
- **Cost and abuse bounds:**
  - Each interviewer line is synthesized at most once per visit (replays are cached).
  - Speech requests are rate limited per user.
  - TTS input is only stored, short interviewer text.
  - Gemini calls are unchanged.
- **Security and privacy:**
  - Camera video never leaves the browser.
  - Audio and transcripts are never stored or logged by Cuewise (as in `voice-answers`).
  - The Deepgram key and the JWT never reach JavaScript.
  - The speech endpoint is default-deny, checks ownership, and never speaks candidate text or unrevealed questions.
- **Compatibility:**
  - Latest Chrome, Edge, Firefox and Safari (macOS and iOS).
  - Camera and mic need HTTPS (`localhost` is exempt); any `Permissions-Policy` must allow `camera=(self)` and `microphone=(self)`.
  - Audio playback is started from the Join gesture so browser autoplay rules allow it (an assumption to verify on iOS Safari).
- **Maintainability (centralization):**
  - Vendors live only in BE `core/ai`; generic audio rules only in BE `core/speech`; device access only in the FE media kit.
  - Only the interview voice adapter (one per repo) knows about both interviews and speech.
  - A new speech feature (for example live STT in phase 2), or a vendor swap, changes the speech layer or the adapter, not chat, setup, feedback or room components.
  - The TTS vendor sits behind the `SpeechSynthesizer` contract.
  - The FE turn flow is one pure reducer that returns the next state **and** the effects to run (stop audio, record, speak, send, release devices). The turn hook only runs those effects against an injected voice port (plus the recorder and the answer sender as minimal inputs), so it never imports the media kit or a service, and a phase-2 live-STT voice is just another voice port (decided 2026-11-15).
  - The mobile transcript uses the shadcn `drawer` (a touch-native bottom sheet), added through the CLI.

## UX Requirements
- **Accessibility:**
  - Every control has an `aria-label` that reflects its state ("Answer", "Stop recording", "Cancel recording", "Turn camera off", "Mute interviewer", "Replay question", "End interview").
  - Toggle buttons use `aria-pressed`.
  - Turn changes ("Interviewer speaking", "Your turn", "Recording", "Transcribing…", "Review your answer", "Interviewer is thinking…") are announced through one polite live region.
  - Speaking, recording and thinking are never shown by colour or animation alone; there is always a text label or timer.
  - With reduced motion, the speaking ring and recording pulse don't animate.
  - The transcript stays readable by screen readers as it is today. TTS is in addition to the text, never a replacement for it.
  - Focus moves to **Send** on the unsent answer when review starts, and to Answer when it's the candidate's turn after a send (never on page load).
- **Responsive:** see Mobile above. Control-bar buttons are at least 44 px and stay on one row at 360 px width.
- **Messages** (toasts or a field message; never raw errors):
  - Speech `503`, network failure or a playback error: "Couldn't play the interviewer's voice. The question is in the transcript." The turn moves to `your-turn`, and Replay can retry.
  - Speech `429`: "Too many replays. Wait a moment and try again."
  - Camera denied: "Camera access is blocked. You can continue without video."
  - Camera missing or busy: "Couldn't start the camera. You can continue without video."
  - Mic denied or missing (lobby and the disabled Answer control): "Microphone access is blocked. Allow it in your browser settings to answer. You can still join and hear the questions."
  - Recording and transcription errors: the existing `voice-answers` messages.
- **Review:** a transcript is never sent automatically; the candidate always sees it as an unsent transcript entry first, and can send it or re-record it (not edit it).

## Constraints
- Phase 1 depends on Deepgram Aura access on the existing key (Phase 0). There is no new BE or FE dependency and no vendor SDK.
- Vitest runs in node by default. Hook tests opt into a DOM per file (`happy-dom` + `@testing-library/react`, devDependencies added for this feature, decided 2026-11-15) with faked media APIs. Real camera, mic and playback are verified in the browser. The turn reducer (state + effects), cache bookkeeping, error mapping and the BE endpoint are unit-tested.
- Browser autoplay rules: audio can only start after a user gesture on the page (hence the lobby).

## Blockers
- Phase 0 results: the Aura voice and model, the format, latency, pricing and data-use terms.
- iOS Safari: whether queued audio (reaction, then question) and later automatic plays keep working after one Join gesture. This is an assumption to verify in Phase 0 or early in Phase 2. If not, each automatic line may need a "Tap to hear the question" fallback.

## Edge Cases
- **EC1:** Mic denied or missing in the lobby → Join still works and questions are still spoken; the Answer control is disabled with the mic message until the mic is allowed.
- **EC2:** Camera denied, missing or toggled off → the self tile shows initials and a camera-off icon; the interview is unaffected.
- **EC3:** TTS fails (`503`, timeout, network or playback error) → one toast ("Couldn't play the interviewer's voice…"), the line stays in the transcript, the state moves to `your-turn`, and Replay retries the fetch.
- **EC4:** TTS rate limited (`429`) → a "Too many replays…" toast and the state moves to `your-turn`.
- **EC5:** The user presses Answer while the interviewer is speaking → the audio stops at once and recording starts.
- **EC6:** Replay pressed while recording, transcribing or thinking → it is disabled and nothing plays.
- **EC7:** Replay pressed while a line is already playing → the line restarts from the beginning; only one line ever plays at a time.
- **EC8:** Replay of a line that has already played → it plays from the cache with no network request.
- **EC9:** The interviewer is muted and a new question arrives → nothing plays, and the state goes straight to `your-turn`. Replay still plays.
- **EC10:** A turn with a reaction and a question → the reaction plays, then the question. A follow-up turn with no reaction → only the follow-up plays.
- **EC11:** The last answer completes the interview → the final reaction is spoken, then the closing card replaces the control bar, and the camera and mic are released.
- **EC12:** Reload or return during an in-progress interview → lobby, Join, then the current question is spoken again. An unsent answer is lost (the existing unload warning warns before leaving).
- **EC13:** A completed or ended interview is opened → no lobby and no camera: a read-only transcript (with replay on interviewer entries) plus the closing or ended card.
- **EC14:** Re-record in review → the new transcript **replaces** the unsent answer. Cancelling the re-recording keeps the old unsent answer.
- **EC15:** Transcription returns no speech or fails → the existing message shows; the state returns to `your-turn` (or to `review` with the previous unsent answer, if one existed).
- **EC16:** Recording reaches 120 s → it stops by itself and is transcribed, and the "limited to 2 minutes" message shows (existing behaviour).
- **EC17:** End during speaking, recording or review → the confirm dialog. On confirm: the audio stops, the recording or unsent answer is discarded, and the camera and mic are released. End is disabled while an answer is sending (today's rule).
- **EC18:** A send fails with a field error (`422`) → the message shows under the unsent answer, which stays in review; the candidate can re-record.
- **EC19:** A send resyncs (`404` / resync `409`) → today's behaviour (toast and refetch). The room then shows the refreshed state; if the current question changed, it is spoken.
- **EC20:** A transcript longer than the answer limit → it can't happen in the room: cuewise-be caps a transcription at 2000 characters, and the answer can't be edited. No counter is shown.
- **EC21:** Space is pressed while focus is on a button (e.g. Send or Replay) → that button activates as usual; Space doesn't also start or stop recording.
- **EC22:** A speech route is asked for a candidate answer, another user's line, an unrevealed question, or an id of the other route's kind → `404`; nothing is synthesized.
- **EC23:** The room unmounts mid-playback or mid-fetch → the audio stops, the fetch is aborted, every object URL is revoked, and the camera and mic are released.
- **EC24:** The browser blocks automatic playback despite Join (an assumption to verify on iOS) → the line is treated as not played: the state moves to `your-turn` with a visible "Tap replay to hear the question" hint, and no error toast.
- **EC25:** The tab is hidden while a line plays → the audio keeps playing (browser default). No special handling.

## Acceptance Criteria
- [ ] **AC1:** Opening an `in_progress` interview shows the lobby with a camera preview, mic and camera status and toggles, and Join. Completed or ended interviews skip the lobby (EC13).
- [ ] **AC2:** After Join, the room shows the stage (interviewer tile, self tile, control bar) and the transcript, and the current question plays aloud while the interviewer tile shows its speaking state and label.
- [ ] **AC3:** The candidate can record (Answer/Space), stop (Stop/Space), or cancel (Esc). The transcript appears as the newest transcript entry, marked Not sent, with Send and Re-record (no editing), and is never sent until Send or Ctrl/Cmd+Enter is pressed.
- [ ] **AC4:** Send goes through the existing answer stream. The answer, reaction and next question appear in the transcript as today, and once saved the reaction and then the question are spoken (EC10).
- [ ] **AC5:** Replay in the control bar replays the current question, and each interviewer entry's replay control plays that line. A line already played replays from the cache with no network request (EC7, EC8).
- [ ] **AC6:** The turn-state table holds: Replay and Answer are enabled and disabled exactly as listed, and pressing Answer while speaking stops the audio (EC5, EC6).
- [ ] **AC7:** Mute stops automatic playback; Replay still plays (EC9).
- [ ] **AC8:** Mic denied or missing → the room still opens and speaks the questions, with Answer disabled and the mic message shown; camera denied, missing or off → initials tile. Neither blocks joining (EC1, EC2).
- [ ] **AC9:** A TTS failure or 429 shows the specified toast and moves to `your-turn`, and Replay retries (EC3, EC4).
- [ ] **AC10:** Completing the interview speaks the final reaction, then shows the closing card and releases the camera and mic (EC11). End with confirmation discards the in-flight state and releases the devices (EC17).
- [ ] **AC11:** The BE speech routes (question and reaction) return audio for the caller's revealed interviewer lines only. Otherwise it returns `404` (EC22), `503 SPEECH_UNAVAILABLE` on a vendor failure or no key, and `429` past 30 requests per user per minute. Its logs contain no text or audio.
- [ ] **AC12:** Camera video is never sent over the network: no request made by the room carries video data.
- [ ] **AC13:** At 360 px width the stage and control bar fit on one row with no horizontal scroll; the transcript opens as a bottom drawer and opens automatically when an unsent answer is ready for review.
- [ ] **AC14:** Every control is keyboard-operable with a visible focus ring and a state-reflecting `aria-label`. Turn changes are announced in a polite live region, and reduced motion disables the speaking and recording animations.
- [ ] **AC15:** All object URLs are revoked, and the camera and mic tracks stopped, when the room unmounts (EC23).
- [ ] **AC17:** Speech is centralized:
  - In the BE, no audio validation, vendor error mapping or speech logging remains in the interviews module; the generic speech layer imports nothing from `modules/`. Both Deepgram adapters use the one shared retry helper, and each speech protocol's fake passes the same contract test as its real adapter.
  - In the FE, the media kit imports nothing from `modules/`, and inside `interviews` only the voice adapter imports the media kit or calls a speech route.
  - The existing `/transcriptions` tests and the FE transcription service tests pass with unchanged assertions. (Tests of the retired chat composer and typing helpers are removed with that code.)
- [ ] **AC16:** FE typecheck, lint, tests and build pass; BE tests pass; the new reducer, cache and error-mapping utils have unit tests, and the BE endpoint has route, controller and vendor tests.

## Out of Scope
- **Live streaming STT** (interim captions while speaking) needs a browser-to-Deepgram WebSocket with short-lived tokens, a deliberate exception to the BFF rule. It is phase 2.
- **Automatic turn-taking** (VAD or end-of-speech detection that triggers the next question) is a manual MVP by decision.
- **Recording or uploading video**, or any analysis of the candidate's video (eye contact, posture), needs storage, consent and a privacy policy.
- **A voice picker or multiple interviewer voices**: one fixed voice in v1.
- **Server-side TTS caching** (for example pre-synthesizing the predefined reactions): an optimization for later, if cost or latency needs it.
- **Keeping the old text-chat screen, or any typing**: replaced by decision (2026-11-15). The room is voice-only and the right panel is a transcript; a typed fallback can come back later if users without a mic need it.
- **Lip-synced or animated interviewer avatars**: the speaking state is a ring plus a label.
