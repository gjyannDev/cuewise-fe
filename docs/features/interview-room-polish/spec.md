# Feature: Interview Room Polish (make the room feel like a video call)

## Problem

The interview room works (see `docs/features/interview-room/`), but it does not feel like a video call, and it leaves the candidate guessing:

- The control bar is icon-only with no labels (the replay icon looks like "refresh").
- Recording is easy to miss: the only sign is a tiny timer above the bar.
- The lobby's "Microphone ready" only proves permission, not that the candidate is audible.
- The transcript panel takes about a quarter of the screen even when it is empty, and the app sidebar stays around the stage.
- Review needs the transcript open (Send lives there), so closing the transcript to get space would hide the answer to confirm.

## Goal

A candidate can tell at a glance what every control does, can see and be told whether they are being heard, gets a focused, full-width stage by default, and can review and send an answer without opening the transcript. Every existing behaviour (the turn table, keyboard shortcuts, error handling) and accessibility guarantee of the interview room stays as it is.

## Decisions (from the spec grilling)

- **Lobby mic meter:** on demand. A "Test microphone" button opens the mic for up to 10 s, then closes it. The mic is still never open unless the candidate asks (a recording, or this test).
- **Sidebar:** collapses as soon as the lobby shows, and returns to what it was when the interview closes or the candidate leaves the page. Live interviews only.
- **Review:** a Send / Re-record pair next to the control bar, with no automatic opening of the transcript (panel or drawer).
- **Stage:** always a dark call surface (the dark theme tokens, scoped to the stage), in both light and dark app themes.
- **Silence hint:** after 3 s of silence while recording, a hint appears once per recording.
- **Transcript:** closed every time the room opens (not remembered).
- **Phone bar:** the interview clock and the shortcuts help are hidden on a phone.
- **Single place to send (inferred, confirm):** with the transcript closed the candidate must still read the transcribed answer before sending, so the review card on the stage shows the answer text with Send and Re-record. The transcript's "Not sent" entry then shows the text only, with no second set of buttons.

## Project Conventions

- Rule files consulted: `CLAUDE.md` (cuewise-fe), `AGENTS.md`, `docs/features/interview-room/spec.md`.
- Constraints those rules impose on this feature:
  - New shadcn primitives (Tooltip, Popover, Progress, if used) are added with `npx shadcn@latest add <component>`, never hand-written, and `src/components/ui/*` is not edited for one-off styling.
  - Components stay presentational and live in `components/room/` or `components/transcript/`; a new component file must earn its file (reused, a real boundary, or large with its own state).
  - The turn flow stays the pure reducer `reduceRoomTurn` plus effects. UI-only state (transcript open, help open, the clock, the sidebar) is not turn state and does not go into the reducer unless a turn rule depends on it.
  - The media kit (`src/hooks/media/`) stays feature-agnostic: the mic level reading is a generic recorder feature, with no `@/modules/*` import.
  - AI text (the interviewer's question, the transcribed answer) is rendered as plain text, never as HTML.
  - Tests live in `tests/` mirroring `src/`; the camera, microphone and audio use the fakes in `tests/helpers/media.ts`.
  - Next 16 `cacheComponents` hides left pages in `<Activity>`: anything that opens a device, collapses the sidebar or runs a timer must reset or release in a `useLayoutEffect` cleanup (see `docs/features/interview-room/learnings.md`).
  - Colours come from theme tokens, not hardcoded values.

## User Flow

1. The candidate opens a live interview. The app sidebar collapses (on a phone there is none to collapse). The lobby shows the camera tile, a summary line ("Junior Backend · 3 questions · about 10 min") with a one-line tip, the device status, "Test microphone" and "Join now".
2. They press "Test microphone", speak, and see a level bar move for up to 10 s, then a result ("We heard you" or "We couldn't hear you").
3. They press "Join now". The room fades in: a dark stage with the interviewer tile (larger avatar, name chip, a ring that animates while it speaks), a "You" tile, a thin progress bar, and the current question as captions under the avatar. The transcript is closed.
4. The control bar sits centred under the stage. From the left: the interview clock; the controls (Answer, camera, mute, replay, End); then the transcript toggle and the shortcuts help. Hovering or focusing an icon-only button shows a tooltip with its name.
5. On their turn the Answer button is more prominent. They press Answer (or Space). A red "Recording 0:12 / 2:00" chip and a live level bar show on the stage. If nothing is heard for 3 s, a hint says so.
6. They press Stop. After transcribing, a review card shows their answer with Send and Re-record. They press Send (or Ctrl+Enter). The room continues as before.
7. They may open the transcript with its toggle at any time (a side panel on desktop, a drawer on a phone) to scroll back or replay lines.
8. When the interview closes (completed or ended) or they leave, the sidebar returns to how it was.

## Requirements

### Functional

**Control bar**
- Every icon-only control-bar button (camera, mute, replay, cancel recording, End, transcript toggle, shortcuts help) shows a shadcn Tooltip with its name on hover and on keyboard focus. The tooltip text matches the button's accessible name.
- A transcript toggle sits at the right end of the bar: it opens and closes the transcript, shows its pressed state, and is the only way to open the transcript on desktop (the stage uses the full width when it is closed). On a phone it opens the existing drawer and replaces the stage's separate "Transcript" button.
- An interview clock at the left end of the bar counts up from Join and stops when the interview closes. Desktop only.
- A shortcuts help button (desktop only) opens a popover listing Space (record / stop), Esc (cancel recording) and Ctrl+Enter (send).
- The bar is centred on the page when the transcript is closed and centred under the stage when it is open.
- On the candidate's turn the Answer button is visibly more prominent than the other controls (larger, with a gentle pulsing ring).

**Recording state**
- While recording, the stage shows a red "Recording m:ss / m:ss" chip and a live mic level bar.
- If the level stays near zero for 3 s while recording, the stage shows "We can't hear you. Check your microphone." once per recording. Recording continues.

**Review**
- When a transcribed answer is waiting, a review card next to the bar shows the answer text with Send (primary) and Re-record. The card replaces the transcript's own Send and Re-record buttons, which stay out of the transcript.
- When a send fails with a field error, the card shows the message and keeps the answer and a working Send.

**Stage**
- The interviewer tile has a larger avatar, a soft gradient, an "Interviewer" name chip at the bottom-left, and an animated ring while the interviewer is speaking.
- The candidate's tile has a "You" chip.
- A captions line under the avatar shows the interviewer's current line as plain text; it updates when a new line starts and is not a live region.
- A thin progress bar replaces the plain "1 of 3" text, and keeps an accessible "Question 1 of 3" value.
- The stage always uses the dark call surface, scoped to the stage (the bar, the title bar and the transcript keep the app theme).

**Immersive**
- The app sidebar collapses when a live interview's lobby shows and is restored to the state it had on entry when the interview closes or the candidate leaves the page. The finished (read-only) room does not collapse it.
- The lobby to room switch is a short fade.

**Lobby**
- A summary line with role, level, question count and "about N min" (assumed 3 min per question, rounded up to the next 5), and one tip line ("Answer out loud, like a real interview.").
- A "Test microphone" button opens the mic for up to 10 s and shows a live level bar and then a result. It never records, stores or sends audio.
- The camera-off tile reuses the room's avatar style (gradient, larger initials).
- When the camera is blocked by permission, the message says what to do ("Camera is blocked. Allow it in your browser's site settings, then reload the page.").

**Media kit**
- The audio recorder exposes a live input level (0 to 1) while its mic stream is open, and a way to open the mic only to read the level (for the lobby test) and close it again.

### Non-Functional
- **Performance:** level updates are limited to about 15 a second and re-render only the level bar, never the whole room. No new network calls, no backend change.
- **Privacy and security:** the lobby test audio is read for a level only, never recorded, stored or sent. The mic is closed when the test ends, on Join, on leaving, and on release. The browser's mic indicator is therefore on only when the candidate asked.
- **Reuse:** no new dependency beyond the shadcn primitives added through the CLI (Radix packages come with the primitives; say so when installing).

## UX Requirements
- **Accessibility:**
  - Exactly one `role="status"` live region stays in the room. The silence hint is part of it. The recording chip, captions, clock, progress and level bar are not live regions.
  - Tooltips add to, and never replace, `aria-label`s. Every control stays reachable by keyboard with a visible focus ring, and a closed dialog returning focus to End must not leave its tooltip stuck open.
  - Pressed or off states (camera, mute, transcript toggle) are announced through `aria-pressed`, not colour alone.
  - Text on the dark stage meets WCAG AA contrast (4.5:1 for text) in both app themes.
  - `prefers-reduced-motion`: the speaking ring, the Answer pulse, the recording dot pulse and the fade become static, and the speaking ring stays visible as a static ring.
- **Responsive:** at 360 px the bar fits on one row with no horizontal page scroll, including while recording (Stop and Cancel showing). On a phone the clock and help are hidden; the transcript toggle opens the drawer.
- **Interaction patterns:** Meet-style: pill control bar, round icon buttons, red for the off or end states, name chips on tiles.
- **Messaging:** all new copy comes from `constants.ts`, in plain, short, non-technical wording.

## Constraints
- Frontend only (cuewise-fe), on the current branch `feat/job-url-resume-rag-related`. No new branch, no backend change.
- Chrome, Edge, Firefox, Safari (including iOS Safari). Reading a mic level needs the Web Audio API.
- The turn rules and the existing keyboard shortcuts are unchanged.

## Blockers
- None that stop the spec. Assumptions to verify while building:
  - The sidebar's saved preference (it is stored in a cookie by the shadcn sidebar) is left unchanged by the automatic collapse and restore. (assumption — verify)
  - Reading a mic level on iOS Safari works when started from the "Test microphone" tap or the Answer tap. (assumption — verify)
  - "About N min" (3 min a question) is a rough guide, not a promise.
  - The "single place to send" decision above is inferred, not confirmed.

## Edge Cases

- **EC1:** The browser cannot read a mic level (no Web Audio) -> the level bar and "Test microphone" are hidden; "Microphone ready" status, recording and sending work as today.
- **EC2:** "Test microphone" with the mic blocked or missing -> the existing mic error message shows, with its existing retry; no level bar.
- **EC3:** The candidate presses Join while the test is running -> the test stops and the mic is released before the room opens.
- **EC4:** The page is left (hidden by the router) during a test or a recording -> the level reading stops and the mic is released; returning shows the lobby.
- **EC5:** Silence for 3 s while recording -> the hint shows once in the status region, clears when sound returns, and does not repeat within the same recording.
- **EC6:** The candidate opens the transcript drawer on a phone while an answer is waiting -> the review card is still on the stage and still works; the drawer shows the text only.
- **EC7:** The candidate reopens the sidebar by hand during the interview -> it stays open; on close or leave it returns to the state it had when the lobby opened.
- **EC8:** The interview is already finished when opened (read-only room) -> the sidebar is not touched, and there is no lobby, clock, mic test or review card.
- **EC9:** On a phone, where the sidebar is a slide-over sheet -> nothing is collapsed or restored.
- **EC10:** The interviewer's line is long (several hundred characters) -> the captions show at most 3 lines; the full text is in the transcript.
- **EC11:** The transcribed answer is long (about 2 minutes of speech) -> the review card scrolls its text inside the card; Send and Re-record stay visible.
- **EC12:** A send fails with a field error -> the review card shows the message, keeps the answer and Send.
- **EC13:** The End dialog closes and focus returns to End -> the End tooltip does not stay open and the dialog's own focus rules are unchanged.
- **EC14:** The candidate leaves and returns (Next 16 hides the page) -> the room resets to the lobby, the clock restarts from 0:00 on the next Join, the transcript is closed, and the sidebar is collapsed again.
- **EC15:** The camera is blocked by permission, or missing -> the lobby camera tile and message say which, with the fix for the blocked case; the interview still works without video.
- **EC16:** `prefers-reduced-motion` is set -> no pulsing, no animated ring, no fade; the speaking state is still shown by a static ring and the status text.
- **EC17:** Tooltips on a touch screen (no hover) -> no tooltip opens; every button keeps its `aria-label`.
- **EC18:** Muted interviewer (speech off) -> the captions line still shows the current question, so it can be read.
- **EC19:** The interview closes (completed or ended) -> the sidebar is restored, the stage shows the closing card as today, and the clock stops.

## Acceptance Criteria

- [ ] **AC1:** Each of the camera, mute, replay, cancel, End, transcript-toggle and shortcuts-help buttons shows a shadcn Tooltip on hover and on keyboard focus whose text equals its accessible name (EC17).
- [ ] **AC2:** On desktop the transcript is closed when the room opens and the stage spans the full width; the toggle opens and closes the transcript panel, and its `aria-pressed` follows. On a phone the toggle opens the transcript drawer, and nothing else opens it by itself.
- [ ] **AC3:** While recording, a red chip shows the elapsed and maximum time as "m:ss / m:ss" and a level bar follows the mic input.
- [ ] **AC4:** After 3 s of silence while recording, "We can't hear you. Check your microphone." shows once in the room's status region; it clears when sound returns and does not repeat in the same recording (EC5).
- [ ] **AC5:** The lobby shows "Test microphone"; pressing it shows a live level bar for at most 10 s, then a result, and the mic is closed afterwards (EC1, EC2, EC3).
- [ ] **AC6:** The lobby test never records, stores or sends audio (verified by the unit test of the recorder's level-only mode: no `MediaRecorder` is created and no service is called).
- [ ] **AC7:** The audio recorder exposes a 0-to-1 input level while its stream is open, and opens and closes the mic for the level-only mode without importing from `@/modules/*`.
- [ ] **AC8:** When an answer is waiting, a review card shows its text with Send and Re-record; Send sends it, Re-record starts a new recording, Ctrl+Enter still sends, and the transcript's unsent entry has no buttons (EC6, EC11, EC12).
- [ ] **AC9:** The interviewer tile shows a larger avatar, a gradient, an "Interviewer" name chip and an animated ring while speaking; the candidate tile shows a "You" chip (EC16).
- [ ] **AC10:** The captions line shows the interviewer's current line as plain text, is not a live region, updates on a new line, is clamped to 3 lines and still shows when the interviewer is muted (EC10, EC18).
- [ ] **AC11:** A progress bar shows the question's position and exposes "Question N of M" to assistive technology; the plain "N of M" text is gone.
- [ ] **AC12:** The interview clock shows elapsed time from Join in m:ss on desktop, stops when the interview closes, and restarts at 0:00 on the next Join (EC14, EC19).
- [ ] **AC13:** The shortcuts help popover lists Space, Esc and Ctrl+Enter, and exists on desktop only.
- [ ] **AC14:** On the candidate's turn the Answer button is larger than the other controls and has a pulsing ring that stops under reduced motion (EC16).
- [ ] **AC15:** The bar is centred on the page with the transcript closed and under the stage with it open.
- [ ] **AC16:** The sidebar collapses when a live interview's lobby shows and returns to its entry state when the interview closes or the candidate leaves; it is not touched for a finished interview or on a phone, and its saved preference is unchanged (EC7, EC8, EC9, EC14, EC19).
- [ ] **AC17:** The lobby shows "Role · Level · N questions · about M min" and one tip line; the camera-off tile uses the room's avatar style; a camera blocked by permission shows an instruction that names the fix (EC15).
- [ ] **AC18:** The stage uses the dark surface in both app themes, and its text meets WCAG AA contrast.
- [ ] **AC19:** Switching from lobby to room fades in; the fade is off under reduced motion.
- [ ] **AC20:** The room still has exactly one `role="status"` region, and no new live region is added (verified by a render test).
- [ ] **AC21:** At 360 px the lobby and the room, including the bar while recording with Stop and Cancel showing, have no horizontal page scroll and every control is at least 44 px tall (verified in the browser).
- [ ] **AC22:** The turn rules are unchanged: the existing `room.utils` tests pass untouched, and typecheck, lint, tests and a production build pass.

## Out of Scope
- A draggable or resizable candidate tile, pinning, grid layouts: not needed for a one-to-one interview.
- An "unread" dot on the transcript toggle, and a `?` keyboard shortcut for the help: YAGNI for now.
- Remembering the transcript open or closed state: decided against.
- Microphone and camera pickers, noise suppression, screen share, blurred backgrounds: no requirement, and a bigger media change.
- Any backend, API or data change, and any change to what the interviewer says.
- Changes to the setup, history and feedback pages, and a theme switcher.
