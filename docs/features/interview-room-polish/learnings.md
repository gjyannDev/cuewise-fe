# Learn: Interview room polish (a call-like room, a mic you can trust)

## 1. Why it exists
The interview room worked but did not feel like a video call, and it left the candidate guessing. The icon-only controls had no names. Recording was easy to miss. "Microphone ready" only proved permission, not that the candidate could be heard. The transcript took a quarter of the screen even when empty, and Send lived inside the transcript, so it could not be closed. This pass makes the room read like Google Meet and tells the candidate, at every moment, whether they are being heard.

## 2. What it is
- **A mic level in the media kit.** The recorder now exposes a live 0-to-1 `level`, a `silent` flag (3 s of quiet while recording) and a level-only mic test (`listen` / `stopListening` / `heard`). All three are feature-agnostic, in `src/hooks/media/use-audio-recorder.ts`, with pure rules in `src/lib/media.ts`.
- **A lobby that summarises and tests.** "Junior Backend · 3 questions · about 10 min", a tip, and "Test microphone", which listens for 10 s and says whether it heard a voice.
- **A dark call stage.** A larger interviewer tile with a speaking ring, captions of the last line, name chips ("Interviewer", "You"), a red recording chip with a meter, and the silence hint in the room's one status region.
- **A Meet-style control bar.** Every icon has a shadcn tooltip. There is a clock on the left, the transcript toggle and the shortcuts help on the right, a prominent Answer on the candidate's turn, and a review card with the answer, Send and Re-record.
- **An immersive page.** The sidebar collapses while a live interview is on screen and comes back on close, unmount or leaving the page. The transcript starts closed (open for a finished interview).

## 3. When to use it
- Reuse `LevelSource` and `LevelMeter` whenever something needs a live, fast-changing number on screen (a level, a progress tick): the screen owning the data does not re-render.
- Reuse `trackSilence` for any "nothing has happened for N seconds" rule fed by noisy readings.
- Reuse the `useRoomSidebar` pattern (refs plus a `useLayoutEffect` cleanup) for any page that temporarily changes app chrome and must put it back, even when Next 16 hides the page instead of unmounting it.

## 4. How it works
**Decisions.**
- *The level is a source, not state* (plan, approach B). `useAudioRecorder` keeps the level in a tiny store (`createLevelStore`); `LevelMeter` reads it with `useSyncExternalStore`, so only the meter re-renders about 15 times a second. Only `silent` and `heard`, which change rarely, are React state.
- *A voice is sound that lasts.* `trackSilence` (`src/lib/media.ts:77`) counts sound only after `SOUND_MS` (250 ms, `src/lib/media.ts:69`) above the threshold. The mic test uses the same rule (`use-audio-recorder.ts:286`).
- *The turn reducer did not change.* Transcript open, clock, sidebar and level are UI state in `ActiveInterview`, because no turn rule depends on them (AC22: the `room.utils` tests are untouched).
- *Send has one home.* The review card in `RoomControls` holds Send and Re-record. The transcript's "Not sent" entry is text only, so closing the transcript never hides the next step.

**One mic test, through the code.**
1. The candidate presses "Test microphone". The lobby calls `micTest.onTest`, which `ActiveInterview` wires to `recorder.listen(MIC_TEST_SECONDS)`.
2. `listen` (`use-audio-recorder.ts:263`) creates the `AudioContext` *before* awaiting permission, inside the click, because iOS Safari only runs audio contexts started from a gesture. It then opens the mic with `{ audio: true }` and never creates a `MediaRecorder` (test: "opens the microphone for a level only").
3. `startMeter` (`use-audio-recorder.ts:111`) connects an `AnalyserNode` and reads it every 66 ms. `rmsLevel` (`src/lib/media.ts:50`) turns the samples into 0 to 1 and the store notifies the meter.
4. After 10 s the timer releases the stream and the context, sets the level to 0 and sets `heard`. The lobby's status region then says the result.
5. Join calls `recorder.stopListening()` first (`ActiveInterview.tsx:177`), so the mic is free before the room opens (EC3).

**The sidebar.** `useRoomSidebar(phase !== "closed")` (`ActiveInterview.tsx:150`) records the open state on entry and collapses it. The cleanup (`use-room-sidebar.ts:24`) restores that entry state. Refs hold `open` and `setOpen` because shadcn's `setOpen` changes identity on every toggle, which would otherwise re-run the collapse and fight a sidebar the candidate reopened by hand (EC7).

## 5. What can go wrong
| Risk | What happens | Proof |
|------|--------------|-------|
| A click or bump spikes the mic | Counted as a voice, the silence hint never shows | `trackSilence` "ignores a single loud spike"; recorder "does not count a single loud spike as a voice" |
| The browser has no Web Audio | No meter, no test, no hint; recording works as before | "useAudioRecorder without Web Audio (EC1)", lobby "shows no mic test… (EC1)" |
| The page is hidden mid-test | The mic and the audio context stay open | "unmounting while listening lets go of the microphone (EC4)" |
| The sidebar is left collapsed | The rest of the app loses its navigation | `use-room-sidebar.test.tsx` (close, unmount, hidden by `<Activity>`) |
| The End dialog returns focus to End | Its tooltip pops open over the bar | RoomControls "does not reopen End's tooltip… (EC13)" |
| shadcn `Progress` drops `value` for Radix | No "Question N of M" for screen readers | InterviewRoom "shows the progress as a bar read as Question N of M (AC11)" |
| More than one live region | Screen readers announce twice | InterviewRoom "has exactly one status region in every phase (AC20)" |

## 6. Try it yourself
1. In the lobby, press "Test microphone" and stay silent. *Predict:* "We couldn't hear you". Then press it and speak a sentence. *Predict:* "We heard you".
2. Join, press Answer and stay silent for 4 s. *Predict:* the red chip counts, and "We can't hear you. Check your microphone." appears once under "Recording".
3. Reopen the sidebar during the interview, then go to History. *Predict:* the sidebar is how it was before you opened the interview.
4. Change `SOUND_MS` to 0 and run `npm test -- tests/lib/media.test.ts`. *Predict:* the spike test fails.

## 7. What surprised me
- **Real microphones spike.** A level of 0.04 looked safe in tests. On the dev machine's mic (Chrome, 2026-11-16, 30 readings over 2 s of silence, same formula as `rmsLevel`) the quiet room read min 0.0132, median 0.0220, max 0.3171. A single 0.32 reading made the mic test say "heard" and reset the silence count, so the hint never appeared. Requiring 250 ms of sustained sound fixed both; after the fix the hint showed on the same mic.
- **shadcn's `Progress` swallows `value`.** It uses it for the indicator's transform and never passes it to Radix, so Radix sets no `aria-valuenow`/`aria-valuetext`. The title bar sets them itself rather than editing `components/ui`.
- **The React Compiler lint rejects refs inside render-time objects.** Passing `sendRef` inside the `review` object and reading a ref in an `onOpenChange` built during render both failed `react-hooks/refs`. `sendRef` is its own prop now, and the End tooltip skip is state.
- **A short 16:9 tile on a phone** let the round camera button cover "Camera off"; the lobby tile is 4:3 below `sm`.

## 8. Check your understanding
1. Why is the level a `LevelSource` and not `useState` in the recorder?
2. Why does `listen` create the `AudioContext` before awaiting `getUserMedia`?
3. Why does `useRoomSidebar` read `setOpen` through a ref?
4. Why does the transcript's unsent entry have no buttons any more?

<details>
<summary>Answers</summary>

1. State would re-render `LiveInterview`, the whole room, about 15 times a second. A source lets only `LevelMeter` subscribe.
2. iOS Safari only lets an audio context run when it is created from a user gesture; after an `await` the click's activation may be gone.
3. shadcn's `setOpen` is recreated whenever `open` changes. As an effect dependency it would re-run the collapse each time the candidate toggles the sidebar, closing it again (EC7).
4. Send and Re-record live on the review card next to the bar, so the transcript can stay closed; one set of buttons avoids two places to send (spec decision, AC8).
</details>

## 9. Go deeper / Still open
- **Device checks by the user:** the mic level and the mic test on iOS Safari (AudioContext from a tap); a real webcam in the lobby and the "You" tile.
- **Threshold tuning:** `SILENCE_LEVEL` (0.04) and `SOUND_MS` (250 ms) were checked on one microphone only.
- **Captions** show the interviewer's last line in the transcript, so while a reaction is playing they already show the next question (both are on screen at once). Following the line actually playing would need the voice port to report it.
- **Reduced motion** is handled with `motion-safe:` classes and confirmed in code and render tests, not with an emulated media query.
