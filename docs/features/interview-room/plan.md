# Implementation Plan: Interview Room (frontend)

Spec: `docs/features/interview-room/spec.md` (Phase 2, cuewise-fe). The backend half is done (`cuewise-be/docs/features/interview-room/`): `GET /interviews/{id}/questions/{qid}/speech` and `GET /interviews/{id}/messages/{mid}/speech` return one whole clip. **Read the `Content-Type` header; never assume MP3.** The default voice is Aura 1 `aura-asteria-en`, about 0.3–0.5 s per clip warm.

## Overview
Replace the chat screen with a voice-only, call-style interview room: a lobby, then a stage (interviewer tile, self camera, control bar) and a **transcript** panel. The candidate drives every turn: record → the transcribed answer appears in the transcript as **Not sent** → Send or Re-record. Then the interviewer's reaction and question are spoken. Everything chat-based (the answer text box, mic button, chat layout, typing fallback) is retired, and the remaining code is renamed from "chat" to transcript/room. Speech code is centralized in a generic media kit plus one interview voice adapter, and the turn flow is one pure function that says both *what state comes next* and *what should happen*.

## Architecture & Design
Three layers, mirroring the backend:
- **Media kit** (generic, never imports `@/modules`, enforced by ESLint):
  - `src/hooks/media/`: `use-audio-recorder` (moved), `use-camera`, `use-audio-player`;
  - `src/lib/media.ts`: recording format, device error kinds, permission copy.
- **Interview voice adapter** (the only interview code that touches speech):
  - `services/voice.services.ts`: `transcribe` (moved) and `speak`;
  - `queries/voice.queries.ts`: the transcribe mutation and a speech fetcher;
  - `utils/voice.utils.ts`: what to speak, error mapping;
  - `hooks/use-interview-voice.ts`: the facade.
- **Room + transcript UI**:
  - `components/room/`: the stage, controls, lobby, camera tile, title bar, end dialog, closing card;
  - `components/transcript/`: the transcript panel and its entries;
  - `components/common/`: the interviewer avatar, shared by the transcript and the stage;
  - driven by `hooks/use-interview-turn.ts`.

**The turn flow is reducer + effects** (an Elm/redux-loop style "commands" pattern, no library):
- `reduceRoomTurn(state, event)` in `utils/room.utils.ts` returns `{ state, effects }`. Effects are plain data: stop the audio, start, stop or cancel recording, transcribe, speak these lines, replay, send this answer, release the devices, show a notice, move focus.
- `use-interview-turn` only runs them.

**One real port, two thin inputs.** `use-interview-turn` receives:
- `voice: VoicePort` (`speakLines`, `replay`, `stop`, `transcribe`), the one real swap point (a phase-2 live-STT voice is another `VoicePort`), exported from `types/interviews.types.ts`;
- the recorder and the answer sender as small structural types declared inside `use-interview-turn.ts` (no exported port types: each has one implementation, so a named port would be speculative).

`ActiveInterview` builds the real ones (`useInterviewVoice`, `useAudioRecorder`, `useInterviewAnswer`); DOM tests pass fakes. The turn hook never imports the media kit or a service.

**Review lives in the transcript.** `buildTranscriptView` gains an `unsent` line: the transcribed answer, rendered by `TranscriptEntry` as the newest entry, marked **Not sent**, with **Send** and **Re-record**, plus a field error under it after a 422. No text box: answers are voice-only and can't be edited.

Clips are fetched through `queryClient.fetchQuery` (`interviewKeys.speech`): cached for the visit, with in-flight fetches deduped. The player owns the object URLs and revokes them on unmount. One `HTMLAudioElement` is unlocked inside the Join click and reused for every clip.

## Rename map (done in Step 1, no behaviour change)

| Today | After |
|---|---|
| `components/chat/ChatThread.tsx` (`ChatThread`) | `components/transcript/TranscriptPanel.tsx` (`TranscriptPanel`) |
| `components/chat/ChatMessage.tsx` (`ChatMessage`) | `components/transcript/TranscriptEntry.tsx` (`TranscriptEntry`) |
| `components/chat/InterviewerAvatar.tsx` | `components/common/InterviewerAvatar.tsx` |
| `components/chat/{InterviewTitleBar,EndInterviewDialog,InterviewClosingCard}.tsx` | `components/room/` (same names) |
| `hooks/use-interview-chat.ts` (`useInterviewChat`) | `hooks/use-interview-answer.ts` (`useInterviewAnswer`) |
| `utils/chat.utils.ts` (`buildThreadView`, `ThreadViewOptions`) | `utils/transcript.utils.ts` (`buildTranscriptView`, `TranscriptViewOptions`) |
| types `ThreadItem`, `ThreadView` | `TranscriptLine`, `TranscriptView` (`Transcript` stays the API type) |
| `THREAD_ERROR_MESSAGE`, `STALE_THREAD_MESSAGE` | `TRANSCRIPT_ERROR_MESSAGE`, `STALE_TRANSCRIPT_MESSAGE` |
| `tests/modules/interviews/utils/chat.utils.test.ts` | `tests/modules/interviews/utils/transcript.utils.test.ts` |

Deleted later (Step 15), once the room replaces them:
- `components/chat/{InterviewChat,AnswerComposer,AnswerMicButton}.tsx` and the folder;
- `appendTranscript` and its tests;
- `ANSWER_COUNTER_FROM`;
- `answerFormSchema` / `AnswerFormValues`, whose trim and 1–2000 rules move into `answerRequestSchema`, with the schema tests retargeted;
- any chat- or typing-only copy.

`TextAreaField` stays: the setup form uses it.

## Approaches Considered

| Approach | Trade-offs | Chosen? |
|----------|-----------|---------|
| A. Media kit + voice adapter + transcript/room UI over a pure reducer returning effects; one `VoicePort`; chat code renamed or retired; thin vertical slices | More files and a rename pass up front; in return one readable, testable flow, no leftover chat concepts, and early proof of the risky browser paths | **Yes**: spec Decisions, AC17; the user's choices on 2026-11-15 |
| B. Keep chat names and the `AnswerComposer` box for review | Less churn, but it contradicts the transcript-only, voice-only decision | No: rejected by the user |
| C. XState statechart | A visualizer; a new dependency and concepts for a flow a reducer covers | No for now: revisit in phase 2 |

Sub-decisions:
- **Order:** rename first; then a **walking-skeleton check** (Step 4) that plays one real clip in Chrome before any hook or component is built on top of the audio path; the UI is split into three small browser-checked steps; wiring and deletion are separate steps (decided 2026-11-15 after a plan review).
- **Clip cache:** TanStack `fetchQuery`.
- **Screen:** replace in place; `ActiveInterview` stays the container.
- **DOM tests:** `happy-dom` + `@testing-library/react` (devDependencies), opted into per file. *Why:* otherwise the hooks could only be checked by hand.
- **shadcn via the CLI:** `drawer` (vaul), `toggle`, `kbd`. No voice, audio or video-call library.
- **CLAUDE.md edits ride with the step that makes them true** (0, 1, 5, 9), so the project rules are never ahead of or behind the code.
- Not adopted now: `react-hotkeys-hook`, a zustand preferences store.

## Spec Requirements -> Implementation
- DOM test runtime → Step 0
- Chat code renamed to transcript/room → Step 1
- The forwarder passes binary through, plus speech timeouts → Step 2
- Error Blobs decoded → Step 3
- The browser audio path proven early (autoplay unlock, Blob type, error codes, camera and mic prompts) → Step 4
- Media kit and its boundary → Steps 5, 6, 10
- Voice adapter → Step 7
- Turn flow (state + effects), the unsent transcript line → Step 8
- Voice facade, effect runner, keyboard → Step 9
- Transcript UI, lobby, camera tile, room, controls, drawer → Steps 11–13
- Container wiring; retire the chat code → Steps 14–15
- Edge-case, a11y and device audit → Step 16
- Final gates and graph → Step 17

## Implementation Steps
Checkpoint interval: pauses after Steps 5, 8 and 14. A large plan.

Gate commands (after every step): `npx tsc --noEmit`, `npm run lint`, `npm test`. Also `npm run build` after Steps 1, 2, 14, 15 and 17. Browser checks: `npm run dev` with cuewise-be running (Deepgram key set), driven in Chrome through the Claude-in-Chrome extension; the user handles the permission prompts and iOS Safari.

0. **DOM test runtime.**
   - Add the devDependencies `happy-dom` and `@testing-library/react` (state why).
   - `vitest.config.ts`: node stays the default; `include` also matches `tests/**/*.test.tsx`; a file opts in with `// @vitest-environment happy-dom`.
   - `tests/helpers/media.ts`: fakes for `MediaStream` / `getUserMedia`, `HTMLMediaElement.play` (resolving or rejecting with `NotAllowedError`), and object-URL counters, plus a smoke test.
   - `CLAUDE.md` Testing section: one line on the per-file `happy-dom` opt-in.
   - Files: `package.json`, `package-lock.json`, `vitest.config.ts`, `tests/helpers/media.ts`, `tests/helpers/media.test.ts`, `CLAUDE.md`.
   - Verify: `npm test` + gates.
   - Test: skip (tooling; the smoke test and the existing suite prove it).

1. **Rename chat → transcript/room (no behaviour change).**
   - Apply the rename map with plain file moves (never `git mv`, which stages) and update every import. `InterviewChat`, `AnswerComposer` and `AnswerMicButton` stay in `components/chat/` for now (the live screen still uses them) and point at the renamed pieces. The moved test keeps its assertions.
   - `CLAUDE.md`: the example component folders become `{room,transcript,setup,history,feedback,common}`.
   - Files: everything in the rename map, `src/app/(app)/interviews/_components/{ActiveInterview,InterviewsContainer}.tsx`, `src/modules/interviews/{constants,types/interviews.types,queries/interviews.queries}.ts`, `tests/modules/interviews/utils/transcript.utils.test.ts`, `tests/modules/interviews/utils/chat.utils.test.ts` (deleted), `CLAUDE.md`.
   - Verify: gates + `npm run build`; `git grep -n -E "ChatThread|ChatMessage|useInterviewChat|buildThreadView|ThreadItem|ThreadView|THREAD_" -- src tests` prints only the three to-be-retired chat files; a quick Chrome check that the current screen still sends an answer.
   - Test: skip (a rename; the unchanged assertions are the proof).

2. **Forwarder: binary GET passthrough and speech timeouts.**
   - `src/app/api/[...path]/route.ts`: a non-streaming response whose `Content-Type` isn't JSON or text is passed through as bytes (`arrayBuffer`), with its `Content-Type` and `Cache-Control`. The speech `GET` routes get their own budget.
   - Constants: `SPEECH_FORWARD_TIMEOUT_MS = 12_000` (above the backend's 10 s) and `SPEECH_TIMEOUT_MS = 15_000` (browser), with "keep in step" comments.
   - Read the Route Handler docs in `node_modules/next/dist/docs/` first (AGENTS.md).
   - Files: `src/app/api/[...path]/route.ts`, `src/modules/interviews/constants.ts`, `tests/app/api/[...path]/route.test.ts`.
   - Verify: `npm test -- tests/app/api` + gates + `npm run build`.
   - Test: first. Seam: the forwarder's `GET` handler (user-confirmed). Slices: (a) `audio/mpeg` bytes identical, with the type; (b) `Cache-Control` passed on; (c) speech routes get the speech budget, other GETs keep 15 s; (d) JSON error bodies unchanged.

3. **Error Blobs keep their code.**
   - The `API` interceptor (`src/lib/config/axios.client.ts`) turns a JSON-typed `Blob` error body back into the parsed object before `redirectIfSessionEnded`. `apiClient.downloadBlob(url, config?)` takes a timeout and a signal.
   - Files: `src/lib/config/axios.client.ts`, `src/lib/api/api.client.ts`, `tests/lib/config/axios.client.test.ts`.
   - Verify: `npm test -- tests/lib` + gates.
   - Test: first. Seam: the interceptor's error handler (user-confirmed). Slices: (a) a JSON Blob becomes `{ error: { code } }`; (b) a session-ending 401 inside a Blob redirects; (c) a non-JSON Blob is untouched; (d) non-blob errors are unchanged.

4. **Walking-skeleton check: one real clip, in Chrome.**
   - Purpose: prove the riskiest browser assumptions before building on them. Start an interview normally first, so a question exists.
   - A scratch page `src/app/(app)/interviews/spike/page.tsx` (+ one client component), **never committed and deleted at the end of this step**. With `?session=<id>` it has two buttons:
     - **Join:** creates one `<audio>`, unlocks it inside the click, fetches the first question's speech through `apiClient.downloadBlob`, logs `blob.type` and size, and plays it; then fetches a bogus id to show the decoded error code.
     - **Mic + camera:** requests `getUserMedia`, shows each track's state, then stops the tracks.
   - Record the results in task.md: the Blob type is `audio/mpeg`; `play()` resolves after the Join click; the bogus id shows `NOT_FOUND`; the camera and mic prompts behave; the browser's "in use" indicator turns off after stop.
   - If anything fails, **stop and re-plan** Steps 6–10 before writing them.
   - Files: `src/app/(app)/interviews/spike/*` (created, then deleted), `docs/features/interview-room/task.md`.
   - Verify: the Chrome checks above; `git status` shows no `spike` files afterwards; gates.
   - Test: after (real browser, real backend). EC24 (iOS) is re-checked by the user at Step 16.

5. **Media kit, part 1: move and enforce the boundary.**
   - `src/lib/media.ts`: `pickRecordingFormat` (moved from `lib/utils.ts`), `deviceErrorKind(error)`, and generic permission copy (the mic and camera messages move here from interviews constants).
   - Move `use-audio-recorder.ts` to `src/hooks/media/`.
   - `eslint.config.mjs`: `no-restricted-imports` forbids `@/modules/*` in `src/hooks/media/**` and `src/lib/media.ts`.
   - `CLAUDE.md` layout: the media kit folders and the boundary rule.
   - Files: `src/lib/media.ts`, `src/lib/utils.ts`, `src/hooks/media/use-audio-recorder.ts`, `src/hooks/use-audio-recorder.ts` (deleted), `src/modules/interviews/components/chat/AnswerComposer.tsx` (import), `src/modules/interviews/constants.ts`, `eslint.config.mjs`, `tests/lib/media.test.ts`, `tests/lib/utils.test.ts`, `CLAUDE.md`.
   - Verify: `npm test -- tests/lib` + gates. A deliberate `@/modules` import in `src/lib/media.ts` fails `npm run lint` (try it, then remove it).
   - Test: first. Seam: `deviceErrorKind`. Slices: NotAllowed/Security → `denied`; NotFound/NotReadable/Overconstrained → `no-device`; anything else → `failed`. The moved `pickRecordingFormat` tests keep their assertions.
   - **Checkpoint after Step 5.**

6. **Media kit, part 2: the audio player.**
   - `use-audio-player.ts`: one element, with `unlock()` for the gesture; `play(url)` / `stop()`, with an ended, failed or blocked callback (`NotAllowedError` counts as blocked); one clip at a time; it owns the object URLs (`urlFor(key, blob)`) and revokes them all on unmount. Built from what Step 4 proved.
   - Files: `src/hooks/media/use-audio-player.ts`, `tests/hooks/media/use-audio-player.test.tsx`.
   - Verify: `npm test -- tests/hooks` + gates.
   - Test: after (DOM tests): a new `play` stops the previous clip; a blocked play reports `blocked`; unmount revokes every URL (AC15, EC23).

7. **Interview voice adapter: service, queries, utils.**
   - `voice.services.ts`: `transcribe` (moved from `interviews.services.ts`); `speak(sessionId, line)` (the question or message route by `kind`, via `apiClient.downloadBlob` with `SPEECH_TIMEOUT_MS`; returns the Blob, whose `type` is the Content-Type).
   - `voice.queries.ts`: `useTranscribeAnswerMutation` (moved) and `useSpeechClip(sessionId)` (`fetchClip(line)` via `queryClient.fetchQuery` with `interviewKeys.speech(...)`, `staleTime` / `gcTime: Infinity`, `retry: false`).
   - `interviews.keys.ts`: `speech(id, kind, lineId)`.
   - `voice.utils.ts`: `planSpokenLines(answerResponse)` (the saved turn's `done` payload already names the reaction id or null and the next question or null, so it can't pick the wrong line; changed from searching the transcript during Step 7) and `getSpeechErrorResult(error)` (503, network, playback → the spec's speech message; 429 → "Too many replays…"; 404 → resync); `getTranscribeErrorResult` kept.
   - Files: `src/modules/interviews/services/{voice,interviews}.services.ts`, `src/modules/interviews/queries/{voice.queries,interviews.queries,interviews.keys}.ts`, `src/modules/interviews/utils/voice.utils.ts`, `src/modules/interviews/{constants,types/interviews.types}.ts`, `src/modules/interviews/hooks/use-interview-answer.ts` (import), `tests/modules/interviews/services/{voice,interviews}.services.test.ts`, `tests/modules/interviews/utils/voice.utils.test.ts`.
   - Verify: `npm test -- tests/modules/interviews` + gates.
   - Test: first. Seams: `voiceService.speak` / `transcribe` (axios mock), `planSpokenLines`, `getSpeechErrorResult` (user-confirmed). Slices: (a) the question route; (b) the reaction route; (c) the Blob type is kept; (d) the timeout and signal are passed; (e) [reaction, question]; (f) a follow-up gives [question] only; (g) completion gives [reaction] only; (h) the error mapping per status; (i) the moved transcribe tests keep their assertions.

8. **The turn flow (reducer + effects) and the unsent transcript line.**
   - `room.utils.ts`: `reduceRoomTurn(state, event) → { state, effects }`, with discriminated unions and an exhaustive `switch` (a forgotten case fails `tsc`).
     - The states: `lobby`, `speaking`, `your-turn`, `recording`, `transcribing`, `review` (holds the unsent text and an optional field error), `thinking`, `closed`.
     - Flags: `muted` and `micAvailable`.
     - The effects: `stopAudio`, `speak(lines)`, `replay(line)`, `startRecording`, `stopRecording`, `cancelRecording`, `transcribe`, `send(text)`, `releaseDevices`, `notice(message)`, `focus("send" | "answer")`.
   - Helpers: `canAnswer` (false without a mic), `canReplay`, `canSend`.
   - `transcript.utils.ts`: `buildTranscriptView` gains an `unsent` option: the unsent answer as the newest line (`unsent: true`, its field error) under the open question.
   - Files: `src/modules/interviews/utils/{room,transcript}.utils.ts`, `src/modules/interviews/types/interviews.types.ts`, `tests/modules/interviews/utils/{room,transcript}.utils.test.ts`.
   - Verify: `npm test -- tests/modules/interviews/utils` + gates.
   - Test: first. Seams: `reduceRoomTurn` + the helpers, and `buildTranscriptView` (user-confirmed). Each reducer slice asserts **the state and the effects**:
     - join → speaking, `speak(current)`;
     - the clip ends → your-turn;
     - a clip fails → your-turn, `notice` (EC3, EC4);
     - blocked → your-turn, the hint, no toast (EC24);
     - Answer while speaking → recording, `[stopAudio, startRecording]` (EC5);
     - no mic → Answer refused, `notice(mic)` (EC1);
     - Stop → transcribing, `[stopRecording, transcribe]`; the text arrives → review, `focus("send")`;
     - no speech or a failure → your-turn, or review with the previous unsent answer (EC15);
     - Re-record replaces; a cancelled re-record keeps the old answer (EC14);
     - Send → thinking, `send(text)`; a 422 → review with the field error, the text kept (EC18);
     - the turn is saved → speaking, `speak(planned)`; the queue ends → your-turn, `focus("answer")`;
     - muted → straight to your-turn, but replay still emits `replay` (EC9);
     - replay allowed or refused per state; while speaking → `[stopAudio, replay]` (EC6, EC7);
     - completion → the final reaction → closed, `releaseDevices` (EC11);
     - End → closed, `[stopAudio, cancelRecording, releaseDevices]`, the unsent answer discarded (EC17).
   - `buildTranscriptView` slices: the unsent line is newest and marked; its field error is attached; no unsent line outside review.
   - **Checkpoint after Step 8.**

9. **Voice facade, effect runner, keyboard.**
   - `VoicePort` in `types/interviews.types.ts`.
   - `use-interview-voice.ts` implements it (the only interview hook importing the media kit, besides `CameraTile` and the recorder wiring in `ActiveInterview`): `join()` unlocks; `speakLines`; `replay` (whether or not muted, from the cache, EC8); `stop`; `transcribe`; errors via `getSpeechErrorResult`.
   - `use-interview-turn.ts` takes `{ voice, recorder, answer }` (the recorder and answer as small inline structural types), holds the reducer state and runs the effects. After the answer stream's `done` it feeds `planSpokenLines` into `turnSaved`, and it keeps the unload warning on while an answer is unsent or sending.
   - Keyboard: Space toggles recording unless focus is on a button or other control (EC21); Esc cancels; Ctrl/Cmd+Enter sends the unsent answer.
   - `useInterviewAnswer` loses transcription; it only sends.
   - `CLAUDE.md`: the reducer + effects + voice port pattern, in the architecture section.
   - Files: `src/modules/interviews/types/interviews.types.ts`, `src/modules/interviews/hooks/{use-interview-voice,use-interview-turn,use-interview-answer}.ts`, `tests/modules/interviews/hooks/use-interview-turn.test.tsx`, `CLAUDE.md`.
   - Verify: `npm test -- tests/modules/interviews/hooks` + gates.
   - Test: after (DOM tests with fakes): each effect reaches the right collaborator; Space on a focused Send button activates Send and doesn't record (EC21); Esc cancels; Ctrl/Cmd+Enter sends in review only; unmount → `stopAudio` + `releaseDevices` (EC23); a saved turn → `speakLines` with the planned lines.

10. **Media kit, part 3: the camera.**
    - `use-camera.ts`: permission, start, stop, toggle, `deviceErrorKind`; tracks stopped on toggle-off, unmount and `release()`; video only.
    - **The camera and the microphone are always requested separately** (`{ video: true }` here, `{ audio: true }` in the recorder), never in one `getUserMedia` call. One missing device fails a combined call (NotFoundError), and a missing camera must never cost the microphone (found in Step 4 on the user's machine: 3 microphones, no camera).
    - Files: `src/hooks/media/use-camera.ts`, `tests/hooks/media/use-camera.test.tsx`.
    - Verify: `npm test -- tests/hooks` + gates.
    - Test: after (DOM tests): tracks stop on toggle-off, `release()` and unmount; a denied permission maps to `denied`; **no camera (NotFoundError) → `no-device`, and `getUserMedia` was only ever asked for `{ video: true }`** (AC15, EC2).

11. **UI slice A: the transcript.**
    - `npx shadcn@latest add toggle kbd drawer` first (never hand-written), so the next two slices have them.
    - `transcript/TranscriptEntry.tsx` renders interviewer lines (with a replay button carrying an `aria-label`), candidate lines, and the **unsent** line: "Not sent", Send and Re-record buttons, the field error under it. `TranscriptPanel` passes `onReplay`, `onSend` and `onRerecord` through.
    - Files: `src/components/ui/{toggle,kbd,drawer}.tsx` (CLI), `package.json` / `package-lock.json` (vaul), `src/modules/interviews/components/transcript/{TranscriptPanel,TranscriptEntry}.tsx`.
    - Verify: gates. In Chrome on the existing screen, with the old chat still in place: the replay button and the unsent entry render correctly with sample data; screen-reader labels are present.
    - Test: after (UI; browser).

12. **UI slice B: lobby and camera tile.**
    - `room/InterviewLobby.tsx`: the preview, the camera `Toggle` (stable "Camera" label + `aria-pressed`), the mic's checked status with a "Check microphone again" button (no mic toggle: the mic only opens while recording; deviation recorded in task.md, 2026-11-16), the spec's copy, and Join, which is always enabled (EC1, EC2).
    - `useAudioRecorder.check()`: an audio-only permission check that releases the mic at once and stays one stable function, so the container can run it from an effect when the lobby mounts.
    - `room/CameraTile.tsx` (its own effect attaches the stream): a mirrored `<video muted playsInline>`, or initials with a camera-off icon.
    - Files: `src/modules/interviews/components/room/{InterviewLobby,CameraTile}.tsx`.
    - Verify: gates. In Chrome on the user's machine (**no camera, 3 microphones**): the lobby shows the camera as unavailable with the initials tile, the mic as allowed, and Join works; with mic permission blocked, Join still works and the mic message shows; no request carries video (AC12). The live-preview path (a real camera) is covered by the DOM tests; a machine with a webcam is checked by the user in Step 16.
    - Test: after (UI; browser).

13. **UI slice C: the room, controls and mobile drawer.**
    - `room/InterviewRoom.tsx`: the stage with the interviewer tile inline (avatar, speaking ring plus label, thinking label), the transcript panel on the right, one atomic `role="status"` region; at phone width (`use-mobile`) a Transcript button opens the `Drawer`, which opens automatically in review; it reuses `InterviewTitleBar` and `EndInterviewDialog`.
    - `room/RoomControls.tsx`: Answer/Stop, Cancel, camera and mute as shadcn `Toggle`s, Replay, End; a `Kbd` hint (Space, Esc) on Answer and Cancel; at least 44 px, one row at 360 px; state-reflecting `aria-label`s; a timer; a reduced-motion-safe pulse; Answer disabled with the mic message without a mic; the enabled states come from Step 8's helpers.
    - Files: `src/modules/interviews/components/room/{InterviewRoom,RoomControls}.tsx`.
    - Verify: gates. In Chrome, with sample props: the desktop layout and 360 px; the drawer drag and close; focus rings; `aria-pressed` in the accessibility tree.
    - Test: after (UI; browser).

14. **Wire it in.**
    - `ActiveInterview` builds `useInterviewVoice`, `useAudioRecorder` and `useInterviewAnswer` for `useInterviewTurn`:
      - lobby → room on Join (a reload shows the lobby again, EC12);
      - completed or ended → the read-only room with no lobby or camera, the closing or ended card, and replay on interviewer entries (EC13);
      - End → the dialog → the End event (EC17);
      - a resync refetch speaks the new current question (EC19).
    - `InterviewsContainer`'s `SessionSkeleton` takes the room's two-pane shape.
    - The old chat components stay in the tree, unused, until Step 15, so a problem here can't be a deletion.
    - `TranscriptPanel` drops its own sr-only `role="status"` (thinking label): the room's status region now announces every turn change, thinking included, so it stays one live region (found in Step 13; kept until here because the old screen still relied on it).
    - Files: `src/app/(app)/interviews/_components/{ActiveInterview,InterviewsContainer}.tsx`.
    - Verify: gates + `npm run build`. In Chrome, the full loop: Join → the question plays → Space → speak → Space → the Not sent entry → Send (Ctrl+Enter) → the reaction and next question play → replay an entry → finish → the closing card.
    - Test: after (end-to-end in the browser).
    - **Checkpoint after Step 14.**

15. **Retire the chat code.**
    - Delete `components/chat/` (`InterviewChat`, `AnswerComposer`, `AnswerMicButton`), `appendTranscript` and its tests, and `ANSWER_COUNTER_FROM`. Fold `answerFormSchema` into `answerRequestSchema`, remove `AnswerFormValues`, and retarget the schema tests (same rules, now on the request schema). Remove chat- and typing-only copy.
    - Files: `src/modules/interviews/components/chat/*` (deleted), `src/modules/interviews/utils/voice.utils.ts`, `src/modules/interviews/{constants,schemas/interviews.schema,types/interviews.types}.ts`, `tests/modules/interviews/utils/voice.utils.test.ts`, `tests/modules/interviews/schemas/interviews.schema.test.ts`.
    - Verify: gates + `npm run build`. `git grep -n -i -E "\bchat\b|Chat[A-Z]|composer|AnswerDraft|appendTranscript|answerFormSchema|type instead" -- src tests` shows no interview-room hits (only unrelated ones, listed in task.md); one more Chrome run of the full loop.
    - Test: after (the retargeted schema tests, plus the Chrome loop).

16. **Edge-case, accessibility and device audit.**
    - Found in the audit (2026-11-16): with `cacheComponents`, Next hides a left page in `<Activity>` and keeps its state, so a return showed a room stuck mid-line. Added a `leave` reducer event (back to the lobby; a closed room stays closed) dispatched from a `useLayoutEffect` cleanup in `use-interview-turn`; the camera and player hooks reset their state on cleanup too (EC12, EC23).
    - The checks that need a human or a real device, plus the edge cases not already seen in Steps 11–14:
      - TTS 503 with the key blank (EC3), and 429 (EC4);
      - the 120 s auto-stop (EC16);
      - a 422 shows under the Not sent entry and re-record works (EC18);
      - unmounting mid-clip (EC23);
      - reduced motion;
      - 360 px (AC13);
      - the screen-reader announcements (AC14);
      - **iOS Safari playback and autoplay (EC24), by the user.**
    - Files: whichever room or transcript files a check touches (record each fix in task.md).
    - Verify: gates + the checks recorded in task.md.
    - Test: after.

17. **Final gates and graph.**
    - The AC17 greps: in `interviews`, `@/hooks/media` is imported only by `use-interview-voice`, `ActiveInterview` (the recorder) and `CameraTile`; `use-interview-turn` imports neither the media kit nor any service; speech and transcription routes are called only in `voice.services.ts`. Confirm `CLAUDE.md` matches the code.
    - Run `graphify update .`.
    - Files: `docs/features/interview-room/{task,learnings}.md`.
    - Verify: `npx tsc --noEmit` + `npm run lint` + `npm test` + `npm run build` + `graphify update .`.
    - Test: skip (verification; the gates prove it).

## Affected Files & Patterns
- New: `src/lib/media.ts`, `src/hooks/media/{use-audio-player,use-camera}.ts`, `modules/interviews/{services/voice.services.ts,queries/voice.queries.ts,hooks/use-interview-voice.ts,hooks/use-interview-turn.ts,utils/room.utils.ts}`, `components/room/{InterviewRoom,RoomControls,InterviewLobby,CameraTile}.tsx`, `src/components/ui/{drawer,toggle,kbd}.tsx` (CLI), `tests/helpers/media.ts`, the `.test.tsx` DOM tests.
- Renamed: see the rename map.
- Moved: `use-audio-recorder` (to `hooks/media`), `transcribe` (to `voice.*`), `pickRecordingFormat` and the mic/camera copy (to `lib/media`).
- Deleted: `components/chat/`, `src/hooks/use-audio-recorder.ts`, `appendTranscript`, `ANSWER_COUNTER_FROM`, `answerFormSchema` / `AnswerFormValues`, `chat.utils.test.ts` (renamed).
- Changed: the forwarder, the axios interceptor, `api.client`, `ActiveInterview`, `InterviewsContainer`, `interviews.keys`, `constants`, `types`, `schema`, `eslint.config.mjs`, `vitest.config.ts`, `package.json`, `CLAUDE.md`.
- Patterns to follow: `useAudioRecorder` (lifecycle); `reduceAnswerStream` (a pure reducer, extended to effects); `answerStream` (errors and redirects); `useMutationCallbacks`; the existing `route.test.ts` / `interviews.services.test.ts` mocks; `TranscriptPanel`'s (ex-`ChatThread`) live-region discipline.
- Risks:
  - iOS autoplay (the unlocked element plus EC24);
  - Space-key conflicts with buttons (EC21, DOM-tested);
  - Blob decoding must not break JSON errors (Step 3);
  - the forwarder streaming and JSON paths (the existing tests);
  - happy-dom's partial media APIs (use the fakes);
  - the rename touching many imports (Step 1 is isolated and build-checked);
  - the scratch skeleton page must not be committed (Step 4 deletes it and checks `git status`).

## Testing Strategy
- Framework & command: Vitest (`npm test`). Node by default; DOM tests opt in with `// @vitest-environment happy-dom` + `@testing-library/react`. Tests under `tests/` mirror `src/`; helpers in `tests/helpers/`. Browser checks by Claude in Chrome (Steps 1, 4, 11–16) against `npm run dev` plus cuewise-be.
- Gate commands: `npx tsc --noEmit`, `npm run lint` (also the media-kit boundary), `npm test`; `npm run build` after Steps 1, 2, 14, 15 and 17.
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 12, 14 | after | lobby; finished interviews skip it |
| AC2 | 4, 8, 9, 14 | first / after | the skeleton proves the audio path; join → speak effect |
| AC3 | 8, 9, 11, 13, 14 | first / after | record/stop/cancel effects; the Not sent entry with Send / Re-record; never auto-sent |
| AC4 | 7, 8, 9 | first / after | `planSpokenLines`; `turnSaved` → `speak` |
| AC5 | 7, 9, 11 | first / after | `fetchQuery` cache; entry replay |
| AC6 | 8 | first | the spec's table as reducer slices |
| AC7 | 8 | first | mute vs replay effects |
| AC8 | 8, 10, 12, 13 | first / after | no mic → Answer disabled + message; initials tile |
| AC9 | 7, 8 | first | `getSpeechErrorResult` + `notice` |
| AC10 | 8, 14 | first / after | final reaction → closed + `releaseDevices` |
| AC11 | — | — | backend (done) |
| AC12 | 10, 12, 14 | after | the network panel: no video |
| AC13 | 13, 16 | after | 360 px, the drawer opening in review |
| AC14 | 13, 16 | after | labels, `aria-pressed`, one status region, reduced motion |
| AC15 | 6, 9, 10 | after | DOM tests |
| AC16 (FE half) | 17 | skip | the gates |
| AC17 (FE half) | 5, 9, 17 | first / after / skip | ESLint boundary, the voice port, greps |
| EC1 / EC2 | 8, 10, 12, 13 | first / after | |
| EC3 / EC4 | 7, 8, 16 | first / after | |
| EC5 / EC6 / EC7 | 8 | first | asserted as effects |
| EC8 | 7, 9 | first / after | |
| EC9 / EC10 | 8, 7 | first | |
| EC11 | 7, 8, 14 | first / after | |
| EC12 / EC13 | 14 | after | |
| EC14 / EC15 | 8 | first | |
| EC16 | 16 | after | the existing recorder limit |
| EC17 | 8, 14 | first / after | |
| EC18 | 8, 16 | first / after | 422 → review with the field error |
| EC19 | 14 | after | |
| EC20 | — | — | can't happen (the backend caps at 2000; no editing) |
| EC21 | 9 | after | DOM test: Space on a focused button |
| EC22 | — | — | backend |
| EC23 | 6, 9 | after | DOM tests |
| EC24 | 4, 8, 16 | after / first | Chrome in the skeleton; iOS by the user |
| EC25 | — | — | no special handling (spec) |

- Must verify, not assume (and Step 4 now checks the first four early): autoplay after Join; `Blob.type` through axios; error codes inside Blobs; camera and mic prompts and the "in use" indicator; MP3 playback on iOS; vaul drag on touch.
- Open questions: none.
- Known baseline failures: recorded by `/implement` before Step 0.

## Blockers & Resolutions
- The forwarder corrupts binary: Step 2. Blob errors hide codes: Step 3.
- Autoplay and the audio path: proven in Step 4 before anything is built on them; EC24 is the fallback.
- No DOM runtime: Step 0.
- Chat vocabulary everywhere: Step 1 renames first; Step 15 deletes the rest.

## Trade-offs & Rationale
- **A skeleton check before the hooks:** about 15 minutes buys early proof of the riskiest, browser-only assumptions, so a failure costs one step, not six.
- **UI in three small browser-checked slices, and wiring separate from deletion:** a bad render or a failed integration points at one small piece.
- **Transcript-only, voice-only review** (the user's decision): the unsent answer is a transcript entry with Send / Re-record. The cost is no fixing a misheard word except by re-recording.
- **Reducer + effects, one `VoicePort`:** one readable, testable flow; no speculative ports for single implementations.
- **`happy-dom` per file; shadcn `drawer`, `toggle`, `kbd` via the CLI;** no voice or video library.
- **`fetchQuery` cache:** one source of server data, with dedupe.
- **Deferred:** `react-hotkeys-hook`, a zustand preferences store.

## Project Rules Applied
- `CLAUDE.md`: service → query → component; only `apiClient` in services; keys from the factory; presentational components in area folders (`room/`, `transcript/`, `common/`; never flat), each earning its file; shadcn primitives through the CLI; theme tokens, `cn()`, a11y; AI text as plain text; tests under `tests/` mirroring `src/`; new dependencies justified. The forms rule no longer applies to the room: there is no form.
- `AGENTS.md`: Next.js 16; read the Route Handler docs before Step 2.
- Git: no commit, stage or push; moves use plain `mv`.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify / lean-ctx | The screen's wiring; the forwarder `text()` corruption; the Blob error-body gap; Vitest node-only; the installed deps; the inventory of chat-named code and its tests |
| ui-ux-pro-max | `aria-pressed` toggles (now shadcn `Toggle`), named icon buttons, one atomic status region, reduced motion, an explicit drawer side |
| grilling | Folders, the `fetchQuery` cache, test seams, Chrome checks, replace in place; reducer + effects, `happy-dom`, the drawer; the Not sent entry and voice-only; toggle and kbd; then (2026-11-15) the task-split review: the skeleton check, the three UI slices, wiring versus deletion, docs edits riding with their steps, and one `VoicePort` |
| ponytail | No state-machine, hotkeys, voice or video library; no named ports for single implementations; the interviewer tile inline |
| find-skills | Not needed |

## Ready to Implement
- Every FE spec requirement is mapped; AC11 and EC22 are backend; EC20 can't happen; EC25 needs no handling.
- Every step has a Test tag; the `first` seams are user-confirmed; the reducer slices assert state and effects.
- Gate commands are listed; every step names its files and a verification command.
- Approaches Considered is filled in; checkpoints are after Steps 5, 8 and 14.
- The spec is synced; the only spec-level change in this pass is the port wording (below).
