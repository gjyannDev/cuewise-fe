# Implementation: Interview Room Polish

## Status
Ready for PR (all 12 steps done). Next: `/review-feature`.
Health Check: missing: caveman -> fallback: normal chat; missing: verification-before-completion -> fallback: every gate command and its result shown before a step is called done

## Completed Steps
- [x] 1. Popover primitive (shadcn CLI)
- [x] 2. Pure media helpers (`rmsLevel`, `heardSpeech`, `trackSilence`, `SOUND_MS`, blocked-camera copy, `LevelSource`)
- [x] 3. Recorder level and listen mode
- [x] 4. Pure copy helpers and constants (`formatLobbySummary`, `estimateMinutes`, `latestInterviewerText`, room copy)
- [x] 5. Sidebar and clock hooks (`use-room-sidebar`, `use-room-clock`)
- [x] 6. Shared look pieces (`LevelMeter`, `CameraTile` gradient and name chip)
- [x] 7. Lobby (summary, tip, mic test, blocked-camera message, 4:3 tile on phones)
- [x] 8. Stage and progress (dark stage, ring, captions, recording chip, silence hint, progress bar)
- [x] 9. Transcript toggle and text-only unsent entry
- [x] 10. Control bar (tooltips, clock, transcript toggle, shortcuts popover, review card, prominent Answer)
- [x] 11. Wiring and fade (`ActiveInterview`)
- [x] 12. Browser audit and docs

## Changes Made
Nothing committed (the user commits manually). Suggested messages:
- Steps 1 to 3: `feat(media): add a live mic level, a silence flag and a level-only mic test to the audio recorder`
- Steps 4 to 5: `feat(interviews): add the lobby summary, room copy, and the room sidebar and clock hooks`
- Steps 6 to 11: `feat(interviews): restyle the interview room like a video call with tooltips, captions, a review card and a mic test`
- Step 12: `docs(interviews): add the interview-room-polish spec, plan, tasks and learnings`

## Test Results
- Step 1: tsc pass, lint pass (generated primitive; no package change).
- Step 2: media tests red (11) then green (21). Gates: tsc, lint, `npm test` 37 files / 748 pass.
- Step 3: recorder tests red (13) then green (19). Gates: 37 files / 761 pass.
- Step 4: utils tests red (6) then green. Gates: 37 files / 767 pass.
- Step 5: hook tests red (missing modules), attempt 1 one failure (clock kept its old time after a hide), fixed with a `useLayoutEffect` cleanup reset, attempt 2 green (23). Gates: 39 files / 780 pass.
- Step 6: LevelMeter 3 pass. Gates: 40 files / 783 pass.
- Step 7: lobby 9 + meter 3 pass. Gates: 41 files / 792 pass.
- Steps 8 to 11: RoomControls 18, InterviewRoom 11, TranscriptEntry 1 pass (two test fixes: wrap in `TooltipProvider` as the root layout does; Send's accessible name includes its "Ctrl ↵" hint). One code fix: shadcn `Progress` doesn't pass `value` to Radix, so the ARIA values are set in the title bar. Lint fix: `react-hooks/refs` (sendRef as its own prop; End tooltip skip as state). Gates: 44 files / 822 pass.
- Step 12 (browser, Chrome, dev server): see Browser Audit. Two fixes found there (sustained-sound rule; chip and lobby tile at 360 px), each red then green.
- Final: `npx tsc --noEmit` pass; `npm run lint` pass; `npm test` 44 files / 824 tests pass; `NODE_ENV=production npm run build` compiled and generated 14/14 pages; `graphify update .` done.

## Browser Audit (2026-11-16, Chrome, desktop 1736 px and a 360 px iframe)
- Lobby: summary, tip, mic test with meter and result; sidebar collapsed on entry (AC5, AC16, AC17).
- Room: full-width dark stage, speaking ring, captions, progress `aria-valuetext` "Question 2 of 3", one status region, controls 48 px (Answer 56 px), tooltip "Replay question" on hover (AC1, AC9, AC10, AC11, AC18, AC20).
- Contrast: status text lightness about 66 on a stage background of about 5 to 10 (lab), well above AA (AC18).
- Transcript toggle opens the side panel; the bar re-centres under the stage (AC2, AC15).
- Recording: chip "0:05 / 2:00" with meter; Cancel replaces Replay; Escape cancels (AC3).
- Silence hint: first run never showed. Measured the mic: quiet median 0.022, spikes to 0.317 (30 readings, 2 s). Fixed with `SOUND_MS`; the hint then showed after 5 s of quiet (AC4, EC5).
- Leave via the sidebar link: sidebar expanded, cookie `sidebar_state=true` (entry state). Back: lobby again, sidebar collapsed (AC16, EC14).
- 360 px: no horizontal scroll in lobby or room; while recording the bar spans 32 to 326 px of 358, six controls at 44 px; clock and help hidden; the drawer opens from the toggle (AC2, AC21). Fixed: the recording chip wrapped onto three lines (now one 32 px line), and the lobby's camera button covered "Camera off" (tile now 4:3 below `sm`).
- Console: no errors.

## Tests Pending
- Mic level and mic test on iOS Safari (device check by the user).
- A real webcam in the lobby and the "You" tile (the dev machine has no camera).
- `prefers-reduced-motion` with a real OS setting (checked in code and render tests only).

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 2 | rmsLevel: silence 0, full scale 1, quiet speech small, empty 0 | spec | AC3, AC7 | pass |
| T2 | 2 | heardSpeech for silence and speech | spec | AC5 | pass |
| T3 | 2 | trackSilence: 3 s, clears on lasting sound, once, restarts | spec | AC4, EC5 | pass |
| T4 | 2 | a single loud spike is not sound | code-derived | browser measurement | pass |
| T5 | 2 | blocked camera message names site settings | spec | EC15 | pass |
| T6 | 3 | level follows the mic, 0 after stop; subscribers told | spec | AC3, AC7 | pass |
| T7 | 3 | silent after 3 s while recording, once; fresh per recording | spec | AC4, EC5 | pass |
| T8 | 3 | listen opens the mic for a level only, no MediaRecorder | spec | AC5, AC6 | pass |
| T9 | 3 | listen ends by itself, releases, sets heard; spike not heard | spec | AC5 | pass |
| T10 | 3 | stopListening releases with no result | spec | EC3 | pass |
| T11 | 3 | blocked mic during listen | spec | EC2 | pass |
| T12 | 3 | unmount during listen releases | spec | EC4 | pass |
| T13 | 3 | no Web Audio: unsupported, no mic opened | spec | EC1 | pass |
| T14 | 4 | estimateMinutes, formatLobbySummary | spec | AC17 | pass |
| T15 | 4 | latestInterviewerText | spec | AC10 | pass |
| T16 | 5 | sidebar collapses, restores on close, unmount, hide; reopen by hand; phone untouched | spec | AC16, EC7, EC8, EC9, EC14, EC19 | pass |
| T17 | 5 | clock counts, stops, restarts at 0, resets after hide | spec | AC12, EC14, EC19 | pass |
| T18 | 6 | LevelMeter hidden from AT, follows the level | spec | AC3, AC5 | pass |
| T19 | 7 | lobby summary, tip, test, listening, results, mic problem, camera blocked, join | spec | AC5, AC17, EC1, EC2, EC15 | pass |
| T20 | 8 | one status region in every phase; captions not live, clamped, kept when muted | spec | AC10, AC20, EC10, EC18 | pass |
| T21 | 8 | recording chip and meter; silence hint only while recording | spec | AC3, AC4 | pass |
| T22 | 8 | name chips, rings (motion-safe), dark stage, progress value text | spec | AC9, AC11, AC18, EC16 | pass |
| T23 | 9 | transcript hidden when closed, beside the stage when open; closed-room toggle | spec | AC2 | pass |
| T24 | 9 | unsent entry is text only | spec | AC8, EC6 | pass |
| T25 | 10 | tooltip names on focus for every icon control; Cancel while recording | spec | AC1 | pass |
| T26 | 10 | transcript, camera, mute aria-pressed; clock; shortcuts popover | spec | AC2, AC12, AC13 | pass |
| T27 | 10 | Answer prominent on the candidate's turn only | spec | AC14 | pass |
| T28 | 10 | review card: Send, Re-record, field error, long text scrolls, hidden outside review | spec | AC8, EC11, EC12 | pass |
| T29 | 10 | End tooltip not reopened by the dialog's focus return | spec | EC13 | pass |

## Open Questions
- Spec "single place to send" (Send only on the review card; the transcript's unsent entry is text only) was inferred and is built that way; the user has not confirmed it.
- Captions show the interviewer's last transcript line, so during a reaction they already show the next question (inferred reading of AC10).

## Baseline Failures
- None (37 files / 737 tests passing before this feature).

## Known Issues
- `check()` reports the mic usable while a mic test runs (before, any non-recording busy state returned false).
- The silence threshold and `SOUND_MS` were checked on one microphone only.

## Deviations from Plan
- Step 12 found that single-reading spikes defeat the silence rule. Added `SOUND_MS` (250 ms of sustained sound) to `trackSilence` and the mic test, with tests; two existing tests that fed one loud reading now feed sustained sound. Plan intent unchanged (no new step); recorded here and in learnings.
- `LevelSource` lives in `src/lib/media.ts` instead of the recorder, so room components can take the type without importing `@/hooks/media` (project rule).
- A finished or just-closed room has no control bar, so the stage shows a labelled Transcript toggle in the closed phase (needed for AC2 on a phone, where the drawer could not otherwise be reopened).
- The lobby camera tile is 4:3 below `sm` (found at 360 px).
- After the build, at the user's request: the closing message ("Interview ended" / "Interview complete") moved onto the dark stage, like Meet's "you left the call" screen (`InterviewRoom` `closing` prop): it replaces the tiles, captions and name chips; the status region and the Transcript toggle stay; the bar area is empty. Copy, links and focus unchanged. New `InterviewClosingCard.test.tsx` (3 tests) and one `InterviewRoom` test. Gates: tsc, lint, `npm test` 45 files / 828 pass. Not yet checked in the browser.

## Debug Log
- None (`/debug` not needed; the one second attempt in step 5 passed).

## Review
(Written by `/review-feature`.)

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| 1 | shadcn (CLI) | add Popover the project way |
| 2-5 | tdd (rules from /implement) | red then green per slice at the confirmed seams |
| 12 | claude-in-chrome | browser audit, real-mic measurement, 360 px check |

## Links
- Spec: docs/features/interview-room-polish/spec.md
- Plan: docs/features/interview-room-polish/plan.md
- Learnings: docs/features/interview-room-polish/learnings.md
