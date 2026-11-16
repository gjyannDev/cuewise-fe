# Learn: The interview room, frontend (voice-first, transcript-style)

**Concepts:** walking-skeleton checks before building on browser assumptions; binary bodies through a BFF; error bodies on blob requests; a feature-agnostic media kit with an enforced import boundary; opt-in DOM tests; a reducer that returns effects, run against injected ports; a clip cache in the Query cache; stable callbacks for effect-driven checks; focus after render; pages hidden in `<Activity>` instead of unmounted. **Status:** all 17 steps built and tested 2026-11-16; iOS, a real webcam and a real permission block are **pending** (the user).

## 1. Why it exists
The interview was a typed chat. Real interviews are spoken: you hear the question and answer out loud. The backend can now speak interviewer lines (Deepgram Aura) and transcribe answers. The frontend has to play audio, record, show a transcript instead of a chat, and keep working when a device is missing.

## 2. What it is (so far)
```
Browser ──/api/*──▶ Next.js forwarder ──▶ cuewise-be speech / transcription routes
             │            (bytes pass through untouched since Step 2)
             └─ axios interceptor (decodes JSON error Blobs since Step 3)

src/lib/media.ts + src/hooks/media/   ← the media kit: devices, recording format, device errors
                                         (ESLint: may not import @/modules/*)

ActiveInterview (container) ── builds ──▶ useInterviewVoice (VoicePort), useAudioRecorder, useInterviewAnswer, useCamera
        │                                   └─ hands them to useInterviewTurn ── reduceRoomTurn(state, event) → { state, effects }
        └─ renders ──▶ InterviewLobby → InterviewRoom (stage + RoomControls + TranscriptPanel / mobile Drawer)
```

## 3. When to use it
| Do this | When | Why / limit |
|---|---|---|
| Put device or audio code in `src/hooks/media/` / `src/lib/media.ts` | Any feature that records, plays or uses the camera | Lint enforces it stays feature-agnostic |
| Request mic and camera in **separate** `getUserMedia` calls | Always | A combined call fails entirely when either device is missing |
| Use `apiClient.downloadBlob(url, { timeout, signal })` | Fetching audio or files | Error codes still arrive decoded |
| Add a `// @vitest-environment happy-dom` line | A hook or component test | Node stays the default; media APIs come from `tests/helpers/media.ts` |

**I'd revisit this when** a second feature needs the media kit with different copy (then `DEVICE_ERROR_MESSAGES` may move to the feature).

## 4. How it works
- **Binary passthrough.** The forwarder used to read every response with `text()`, which corrupts MP3 bytes (they aren't valid UTF-8). Now a response whose type isn't JSON or text is passed through as `arrayBuffer()` with its `Content-Type` and `Cache-Control`. See `src/app/api/[...path]/route.ts` (`isTextual`, `SLOW_ROUTES`).
- **Error Blobs.** With `responseType: "blob"`, axios delivers the *error* body as a Blob too, so `parseApiError` and the session-expired redirect couldn't see the code. `rejectApiError` in `src/lib/config/axios.client.ts` parses a JSON Blob back into the object before the redirect check.
- **The boundary.** `eslint.config.mjs` has a `no-restricted-imports` block for the media kit. A probe import of `@/modules/interviews/constants` failed lint with the custom message.
- **The audio player** (`src/hooks/media/use-audio-player.ts:14`): one element for every clip, so one gesture unlocks them all. `unlock` (`:37`) calls `play()` without awaiting it (Step 4 finding). `play(url)` (`:49`) resolves `ended | stopped | failed | blocked`, and a new play stops the old one.
- **Speaking a line** (the voice adapter): `voiceService.speak` (`src/modules/interviews/services/voice.services.ts:42`) picks the questions or messages route by the line's `kind` and refuses a body that isn't audio. `useSpeechClip` (`src/modules/interviews/queries/voice.queries.ts:38`) fetches it with `fetchQuery`, `staleTime: Infinity`: one fetch per clip per visit, and a replay pressed mid-fetch joins the same request. The key (`interviews.keys.ts:22`) is deliberately outside `detail(id)`, because a resync invalidates `detail(id)`, and a stored clip never changes.
- **What to say after a turn**: `planSpokenLines` (`src/modules/interviews/utils/voice.utils.ts:51`) reads the saved turn: the reaction id (or null), then the next question id (or null). A follow-up comes with no reaction; the last answer gets only a reaction.
- **The turn reducer** (`src/modules/interviews/utils/room.utils.ts:92`): `reduceRoomTurn(state, event)` returns the next state **and** a list of effects, plain data like `{ type: "stopAudio" }`. Example, Answer while the interviewer talks (`case "answer"`, `:108`): `speaking` → `recording`, effects `[stopAudio, startRecording]`. A saved turn (`case "turnSaved"`, `:169`) → `speaking` with `[speak([reaction, question])]`, or straight to `your-turn` when muted. The permission helpers `canAnswer` / `canReplay` / `canSend` (`:33-45`) are the spec's turn table.
- **Running the effects** (`src/modules/interviews/hooks/use-interview-turn.ts`): `dispatch` (`:197`) feeds the reducer, stores the state, then hands each effect to the module-level `runRoomEffect` (`:97`), the only place a turn touches the outside world. It talks to the voice, the recorder and the answer sender through what the container passed in, so it imports no device code or service, and the DOM tests pass fakes. Effects that finish later (a line ends, a send returns) dispatch the next event themselves.
- **The voice** (`src/modules/interviews/hooks/use-interview-voice.ts:18`) implements the `VoicePort`: `speakLines` plays lines one after another; a generation counter (`:46`) makes a clip that arrives after a stop never play.
- **The container** (`src/app/(app)/interviews/_components/ActiveInterview.tsx`): `ActiveInterview` (`:50`) decides once, when the screen opens, between a read-only room (already over: replay and the closing card, no lobby or camera) and the live one, so finishing an interview on screen doesn't swap the room out from under its final line. `LiveInterview` (`:61`) wires the devices. Two details worth copying:
  - the recorder reports into the turn, but the turn needs the recorder first, so the recorder's `onRecorded` goes through a ref (`:76`);
  - the turn asks for focus inside `dispatch`, *before* React has rendered the Send button it means, so the container stores the target (`:84`) and an effect focuses it after the render. That works for the mobile drawer too.
- **Checking the mic before the first answer**: `useAudioRecorder.check()` (`src/hooks/media/use-audio-recorder.ts:140`) asks for audio only and releases it at once. It reads the status through a ref (`:49`) so it stays the same function: the container calls it from an effect, and a function that changed with every status change would re-run that effect in a loop.
- **The room's one live region** (`src/modules/interviews/components/room/InterviewRoom.tsx:118`) says `roomStatusLabel(phase, thinkingLabel)` (`room.utils.ts:48`). The transcript panel's own thinking announcement was removed in Step 14, so nothing is announced twice. The mobile drawer opens itself when review starts by adjusting state during render (`:76`), not in an effect.
- **Leaving and coming back.** This app runs Next 16 with `cacheComponents`, so navigating away doesn't unmount the room: Next hides it in React `<Activity>`. Effect cleanups run (the audio and devices stop) but every `useState` is kept. A `useLayoutEffect` cleanup in `use-interview-turn.ts` dispatches `leave` (`room.utils.ts`, `case "leave"`), which puts the turn back in the lobby (a closed room stays closed) and runs the same stop / cancel / release effects as before. The camera and the player also clear their state in their cleanups, so a return never shows a black preview or a stuck "playing" flag.

## 5. What can go wrong
| Failure | What the user sees | What the code does | Proof (test name) |
|---|---|---|---|
| Audio corrupted by the BFF | Silence or noise | Bytes pass through | `passes an audio clip through byte for byte with its type` |
| Speech error code hidden in a Blob | Wrong or no message; no sign-in redirect | Decoded before the redirect check | `turns a JSON error body that arrived as a Blob back into the parsed object`, `lets a session-ending 401 inside a Blob reach the redirect check as JSON` |
| A camera is missing | (Combined request) no mic either | Separate requests; `deviceErrorKind` → `no-device` | `a machine with no camera ends as no-device, leaving the microphone alone (EC2)`, `asks for video only, never the microphone in the same request` |
| The camera light stays on after End | A camera still "in use" | Every track stopped on toggle-off, release, unmount | `release stops every track (End, completion) (AC10)`, `unmounting stops every track (AC15, EC23)` |
| The mic is blocked | Can't answer | Join still works; Answer explains why | `a blocked microphone reports denied, and Join can still go ahead (EC1)`, `a blocked microphone backs out of the recording and stops offering Answer (EC1)` |
| The lobby's mic check loops | Endless permission requests | `check` and `setMicAvailable` are stable functions | `check is the same function across status changes, so an effect can call it without looping`, `setMicAvailable is the same function across renders, so the lobby's check can run it from an effect` |
| Space on a focused button also records | A double action | Space ignored on controls | `Space on a focused button presses the button and doesn't record (EC21)` |
| Leaving mid-turn keeps devices busy | Mic or audio keeps running | Unmount stops the voice, the recorder and the camera | `leaving the room stops the voice and the recorder and releases the devices (EC23)` |
| Coming back after a navigation | A room stuck on "Interviewer speaking", silent | `leave` resets to the lobby when Next hides the page | `hidden by a navigation (Next keeps the page in <Activity>), it lets go of everything and comes back to the lobby (EC12, EC23)`, the `leave` reducer tests |
| The speech service fails (503) or rate-limits (429) | A message; the question is still in the transcript | `your-turn`, Replay retries (a failure isn't cached) | `getSpeechErrorResult` tests; Chrome Step 16 |
| Feature code leaks into the media kit | — (lint fails) | `no-restricted-imports` | the Step 5 probe (task.md) |
| The Join click hangs | Nothing happens | The unlock isn't awaited | `unlock calls play inside the gesture without waiting for it` |
| Two lines play over each other | Overlapping voices | A new play stops the old one | `plays one clip at a time: a new play stops the previous one (EC7)` |
| A replay costs a new Deepgram call | (Your bill) | One object URL and one cached query per clip | `makes one object URL per clip and reuses it for replays (EC8)` |
| Speaking while the mic is open | Your answer records the interviewer | Answer stops the audio first | `Answer while the interviewer speaks cuts the audio and records (EC5)` (and the Step 8 mutation check) |
| A muted user hears the next question anyway | Unwanted audio | A muted turn skips `speak` | `muted: a new line isn't played, the turn goes straight to the candidate (EC9)` |
| A failed send loses the answer | The answer vanishes | Back to review with the text and field error | `a field error keeps the answer in review with the message under it (EC18)` |

## 6. Try it yourself
1. Predict what `fetch('/api/interviews/<id>/questions/<qid>/speech')` returns in the browser console: the type and whether `await r.text()` looks like text. (Answer: `audio/mpeg`, binary garbage. That's correct; the bytes are intact.)
2. Add `import { ANSWER_MAX_LENGTH } from "@/modules/interviews/constants"` to `src/lib/media.ts` and run `npm run lint`. Predict the message, then remove the line.

## 7. What surprised me
- **`play()` on an empty `<audio>` never settles** (Chrome, 2026-11-16, Step 4 scratch page). Awaiting the autoplay unlock hung the whole click handler. The unlock must be called inside the click and never awaited; once a source is set later, that same promise resolves.
- **Autoplay after Join works in Chrome**: a clip fetched over the network (57,365 bytes in 1,143 ms; 83,696 bytes in 1,155 ms) played after `await`s. iOS: **pending** (Step 16).
- **The user's machine has 3 microphones and no camera.** `getUserMedia({ audio, video })` → `NotFoundError`, which would have cost the mic too. This changed the plan: separate requests, with a test.
- **One transient 503** on the first speech call of a session; the retry was 200. Cause **pending** (the backend's `app.tts` log, Step 16).
- `history.back()` restores a page with its *old* JavaScript (back-forward cache). After a code change, reload.
- `next build` fails prerendering `/_global-error` when the shell has `NODE_ENV=development`; run it as `NODE_ENV=production`.
- **The reducer passed all 92 tests at its first run**, which made me distrust it. A mutation check (deleting the `stopAudio` effect from "Answer while speaking") failed exactly the EC5 test, so the tests do pin the behaviour. A quick mutation check is cheap insurance whenever tests pass on the first try.
- **Twice a test passed for the wrong reason**, and only the mutation check showed it. The camera's late-grant test built a fresh fake track on every `getTracks()` call, so it could never see a stopped track. The recorder's "stable `check`" test let the fake permission resolve at once, so React batched `requesting → idle` into one render and the status never visibly changed. Both were rewritten (shared fakes; a permission prompt held open) and now fail under the mutation.
- **After edits, `next dev` kept server-rendering the old modules** (Step 11), so every load logged a hydration mismatch while the browser ran the new code. Touching the files didn't help; restarting `npm run dev` did.
- **The shadcn `Avatar` ignored `size-20`**: its `data-[size=sm]:size-6` selector outranks a plain utility. Passing `size="default"` (no data-size rule) let the class win.
- **Real loop, 2026-11-16 (Chrome, no camera):** Join → one speech GET (200) → "Interviewer speaking" → "Your turn" with focus on Answer; a replay started in ~150 ms with **no** new request (cached); Space → "Recording" with the timer; Esc → back, no transcription request; a reload → the lobby again (EC12); an abandoned interview opens read-only with working replay (EC13); End → dialog → "Interview ended" (EC17). The spoken-answer half of the loop (speak → Not sent → Send → reaction and next question → completion) was then run by the user: all as expected.
- **The audit's biggest find was a Next.js behaviour, not our logic** (Step 16, 2026-11-16). History → Continue brought back a room frozen on "Interviewer speaking": the page had been *hidden* (`cacheComponents` + `<Activity>`), not unmounted. Every unit test passed because none rendered under `<Activity>`. Now four tests do (`tests/helpers/activity.tsx`), and the bundled guide (`node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md`) is linked from CLAUDE.md.
- **Faking error responses in the page** (Step 16): a 503, a 429 and a 422 can't be produced on demand by the real backend. A small script that wraps `XMLHttpRequest` (axios) and `fetch` for just those URLs let the real UI path run without a voice or a config change. My first version matched `/messages` while the stream posts to `/messages/stream`, so one real answer went through: check the actual URL before stubbing it.
- **Running `npm test` under `NODE_ENV=production`** (to share the build's env) fails every DOM test: React's production build has no `act()`. Only the build needs that env.

## 8. Check your understanding
1. Why can't the forwarder just call `text()` on every response?
2. When does an axios error carry a Blob instead of JSON?
3. Why request mic and camera separately?
4. What happens if someone imports `@/modules/...` inside `src/hooks/media/`?
5. Why does the room reset itself in a `useLayoutEffect` cleanup instead of when it mounts?

<details>
<summary>Reference answers (write yours first)</summary>

1. Audio bytes aren't valid UTF-8; decoding them as text replaces invalid sequences, so the clip is corrupted.
2. When the request used `responseType: "blob"`: axios applies it to error responses too.
3. A combined `getUserMedia` call fails entirely if either device is missing, so a missing camera would also lose the mic.
4. `npm run lint` fails with "The media kit is feature-agnostic…", so the kit stays reusable.
5. With `cacheComponents`, leaving doesn't unmount the room, so nothing mounts again on return: the cleanup is the only moment the room hears about it. A layout effect resets before the page is hidden, so the old state never flashes on return.
</details>

## 9. Go deeper / Still open
- Spec `docs/features/interview-room/spec.md`; plan `plan.md`; progress `task.md`; backend `../cuewise-be/docs/features/interview-room/`.
- **Pending (the user, on devices this machine doesn't have):** iOS Safari playback and autoplay after Join (EC24), a real webcam preview, a real site-permission mic block. Also open for `/review-feature`: the live region says both "Reading your answer…" and "Interviewer is thinking…" during one send.
