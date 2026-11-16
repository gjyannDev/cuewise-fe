# Implementation Plan: Interview Room Polish

## Overview
Make the interview room and lobby feel like a video call (spec: `docs/features/interview-room-polish/spec.md`): tooltips, a clear recording state, a lobby mic test, a closed-by-default transcript with captions, a review card, an immersive dark stage, and a Meet-style control bar. Frontend only; the turn reducer is unchanged.

## Architecture & Design
The turn flow (`reduceRoomTurn`) stays as is. New UI-only state lives in the container (`ActiveInterview.tsx`): transcript open, the mic test, and two small hooks (`use-room-sidebar`, `use-room-clock`). The media kit gains a live input level and a level-only listen mode, delivered through a small external store so only the level bar re-renders. The stage is the existing room with a scoped `dark` class. The review card and the shortcuts help live inside `RoomControls.tsx` as non-exported helpers; `LevelMeter` is a new file because the lobby and the stage both use it. Existing shadcn Tooltip (global `TooltipProvider` is in `layout.tsx`) and Progress are reused; only Popover is added through the CLI.

## Approaches Considered
The spec settled what to build and the user's grilling answers settled the behaviour. The one open design choice is how a live mic level reaches the UI without re-rendering the room 15 times a second (spec NFR):

| Approach | Trade-offs | Chosen? |
|----------|-----------|---------|
| A. `level` as React state in `useAudioRecorder` | Simplest; re-renders `LiveInterview` and everything under it on every update | No: breaks the NFR |
| B. A level source (subscribe + get) read by `LevelMeter` with `useSyncExternalStore`; only a `silent` boolean is state | One small component re-renders; the hook still returns plain values; testable by reading the source | **Yes**: meets the NFR with no dependency |
| C. The hook writes the level straight into a DOM node's style | Cheapest renders | No: imperative DOM in a feature-agnostic hook; hard to test |

Other decisions, all by project rule or ponytail: the stage uses the existing `.dark` token set by adding the `dark` class to the stage wrapper (the `dark` variant is `&:is(.dark *)`), not new tokens; the sidebar is collapsed with `useSidebar().setOpen` from a hook (no change to `AppShell`); the transcript's open state is lifted to the container because the bar (the `footer` slot) and the stage are siblings.

## Spec Requirements -> Implementation
- Tooltips, transcript toggle, clock slot, help, bar centring, Answer prominence, review card -> Steps 1, 9, 10, 11
- Recording chip, level bar, silence hint, stage look, captions, progress, chips -> Steps 2, 3, 4, 6, 8
- Lobby summary, tip, mic test, camera tile, camera message -> Steps 2, 3, 4, 6, 7
- Sidebar collapse and restore, clock -> Steps 5, 11
- Fade, reduced motion, dark stage, 360 px -> Steps 8, 10, 11, 12

## Implementation Steps
Checkpoint interval: every 3 steps

1. Popover primitive — Files: `src/components/ui/popover.tsx` (via `npx shadcn@latest add popover`; Radix comes from the already-installed `radix-ui`, so no new dependency) — Verify: `npx tsc --noEmit` + `npm run lint` — Test: skip (generated primitive; the gates must still pass)
2. Pure media helpers — Files: `src/lib/media.ts`, `tests/lib/media.test.ts` — adds `rmsLevel` (audio samples to 0-1), `trackSilence` (level and time to "silent for 3 s", once), `heardSpeech`, the camera-blocked message with its fix — Verify: `npm test -- tests/lib/media.test.ts` + gates — Test: first. Seam: those exports (user-confirmed). Slices: flat samples read 0, loud samples read near 1; 3 s of quiet flips silent once; sound clears it; a new recording resets it
3. Recorder level and listen mode — Files: `src/hooks/media/use-audio-recorder.ts`, `tests/helpers/media.ts` (fake audio context and analyser), `tests/hooks/media/use-audio-recorder.test.tsx` — adds the level source, `silent`, and `listen(seconds)` / `stopListening()` that open the mic for a level only, auto-stop and release, and never create a `MediaRecorder` — Verify: `npm test -- tests/hooks/media` + gates — Test: first. Seam: the hook's returned `level`, `silent`, `listen`, `stopListening` (user-confirmed). Slices: level follows the stream; silence while recording sets `silent` once; `listen` ends by itself and releases the mic; no recorder created (AC6); no Web Audio means `levelSupported` is false and `listen` returns false (EC1); blocked mic sets `error` (EC2); unmount releases (EC4)
4. Pure copy helpers and constants — Files: `src/modules/interviews/utils/format.utils.ts`, `src/modules/interviews/utils/transcript.utils.ts`, `src/modules/interviews/constants.ts`, `tests/modules/interviews/utils/format.utils.test.ts`, `tests/modules/interviews/utils/transcript.utils.test.ts` — adds `formatLobbySummary`, `estimateMinutes` (3 min a question, next 5), `latestInterviewerText`, and all new copy and numbers (tip, silence hint, tooltip names, shortcut list, listen texts, limits) — Verify: `npm test -- tests/modules/interviews/utils` + gates — Test: first. Seam: those exports (user-confirmed)
5. Sidebar and clock hooks — Files: `src/modules/interviews/hooks/use-room-sidebar.ts`, `src/modules/interviews/hooks/use-room-clock.ts`, `tests/modules/interviews/hooks/use-room-sidebar.test.tsx`, `tests/modules/interviews/hooks/use-room-clock.test.tsx` — Verify: `npm test -- tests/modules/interviews/hooks` + gates — Test: first. Seam: each hook's return and its effect on `useSidebar` (user-confirmed). Slices: collapses when active and restores to the entry state when it ends or on unmount (EC19); a hand-reopened sidebar is restored to the entry state (EC7); nothing happens on mobile (EC9); hidden by `<Activity>` it restores (EC14, use `tests/helpers/activity.tsx`); the clock counts from start, stops when closed, restarts at 0 on the next start
6. Shared look pieces — Files: `src/modules/interviews/components/room/LevelMeter.tsx`, `src/modules/interviews/components/room/CameraTile.tsx`, `src/modules/interviews/components/common/InterviewerAvatar.tsx`, `tests/modules/interviews/components/room/LevelMeter.test.tsx` — LevelMeter reads a level source; the camera-off tile and the interviewer avatar share the gradient look — Verify: `npm test -- tests/modules/interviews/components/room` + gates — Test: after
7. Lobby — Files: `src/modules/interviews/components/room/InterviewLobby.tsx`, `tests/modules/interviews/components/room/InterviewLobby.test.tsx` — summary line, tip, "Test microphone" with meter and result, blocked-camera message — Verify: `npm test -- tests/modules/interviews/components/room/InterviewLobby.test.tsx` + gates — Test: after. Cases: summary text; Test button hidden when levels are unsupported (EC1); mic error and retry (EC2); camera blocked shows the fix (EC15)
8. Stage and progress — Files: `src/modules/interviews/components/room/InterviewRoom.tsx`, `src/modules/interviews/components/room/InterviewTitleBar.tsx`, `tests/modules/interviews/components/room/InterviewRoom.test.tsx` — scoped dark stage, larger avatar, gradient, name chips, speaking ring, captions (3-line clamp, plain text), recording chip with meter, silence hint inside the one status region, thin progress with "Question N of M" — Verify: `npm test -- tests/modules/interviews/components/room/InterviewRoom.test.tsx` + gates — Test: after. Cases: exactly one `role="status"` (AC20); captions are not live (AC10); progress has an accessible value (AC11); muted still shows captions (EC18); motion classes are `motion-safe:` only (EC16)
9. Transcript toggle and text-only unsent entry — Files: `src/modules/interviews/components/room/InterviewRoom.tsx`, `src/modules/interviews/components/transcript/TranscriptEntry.tsx`, `src/modules/interviews/components/transcript/TranscriptPanel.tsx`, `tests/modules/interviews/components/transcript/TranscriptEntry.test.tsx` — controlled `transcriptOpen`; full-width stage when closed; phone drawer on the same state with no auto-open and no separate button; unsent entry shows text only — Verify: `npm test -- tests/modules/interviews/components` + gates — Test: after (EC6)
10. Control bar — Files: `src/modules/interviews/components/room/RoomControls.tsx`, `tests/modules/interviews/components/room/RoomControls.test.tsx` — a tooltip on each icon button, clock, transcript toggle and shortcuts help (desktop only), the review card (text, Send, Re-record, error), a more prominent Answer on the candidate's turn, the bar centred — Verify: `npm test -- tests/modules/interviews/components/room/RoomControls.test.tsx` + gates — Test: after. Cases: tooltip text equals the accessible name (AC1); `aria-pressed` on toggles; card Send and Re-record call back and show a field error (EC11, EC12); help lists Space, Esc, Ctrl+Enter (AC13)
11. Wiring and fade — Files: `src/app/(app)/interviews/_components/ActiveInterview.tsx` — owns `transcriptOpen` (closed live, open for a finished interview), runs the sidebar and clock hooks, passes the recorder level and `silent`, runs the lobby test and stops it on Join (EC3), fades the lobby into the room — Verify: `npm test -- tests/modules/interviews` + gates (all existing `room.utils` and turn tests untouched, AC22) — Test: after (the browser audit in step 12 covers the wiring)
12. Browser audit and docs — Files: `docs/features/interview-room-polish/learnings.md`, `CLAUDE.md` (one line about the recorder's level source) — Verify in Chrome at desktop and 360 px: no horizontal scroll, controls at least 44 px, tooltips, sidebar collapse and restore, hide and return, lobby test, silence hint, End dialog focus return, dark contrast; then `NODE_ENV=production npm run build` and `graphify update .` — Test: after (browser)

## Affected Files & Patterns
- `src/hooks/media/use-audio-recorder.ts` — level source, `silent`, `listen`; stays free of `@/modules/*` (ESLint enforces it)
- `src/modules/interviews/components/room/*`, `components/transcript/*`, `components/common/InterviewerAvatar.tsx` — the UI changes
- `src/app/(app)/interviews/_components/ActiveInterview.tsx` — the only place that wires devices, the sidebar and UI state
- `src/components/ui/tooltip.tsx`, `progress.tsx`, `sidebar.tsx` — reused as they are
- Patterns to follow: reducer plus ports in `use-interview-turn`; `useLayoutEffect`-cleanup resets for `<Activity>` (see `use-interview-turn`, `use-camera`); `installMediaFakes` for device tests; one non-exported helper per file instead of a new component
- Risks: Web Audio on iOS needs a user gesture and a resume; the shadcn sidebar writes its cookie on every `setOpen`, and the layout never reads it, so a restore leaves the same value (verify); a Radix tooltip may reopen when the End dialog returns focus to End (EC13)

## Testing Strategy
- Framework and command: Vitest, `npm test -- <path>` (run without `NODE_ENV=production`); DOM tests start with `// @vitest-environment happy-dom`.
- Gate commands (after every step): `npx tsc --noEmit`, `npm run lint`, `npm test`. At the end: `NODE_ENV=production npm run build`.
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 10 | after | |
| AC2 | 9, 11 | after | desktop and phone checked in the browser |
| AC3 | 3, 8 | first, after | |
| AC4 | 2, 3, 8 | first, after | |
| AC5 | 3, 7 | first, after | |
| AC6 | 3 | first | no `MediaRecorder` created |
| AC7 | 3 | first | |
| AC8 | 9, 10 | after | |
| AC9 | 8 | after | |
| AC10 | 4, 8 | first, after | |
| AC11 | 8 | after | |
| AC12 | 5, 10 | first, after | |
| AC13 | 10 | after | |
| AC14 | 10 | after | |
| AC15 | 10, 11 | after | |
| AC16 | 5, 11 | first, after | cookie value checked in the browser |
| AC17 | 4, 7 | first, after | |
| AC18 | 8, 12 | after | contrast checked in the browser |
| AC19 | 11, 12 | after | |
| AC20 | 8, 10 | after | |
| AC21 | 12 | after | browser at 360 px |
| AC22 | all | gates | `room.utils` tests unchanged |
| EC1 | 3, 7 | first, after | |
| EC2 | 3, 7 | first, after | |
| EC3 | 11 | after | |
| EC4 | 3, 5 | first | |
| EC5 | 2, 3 | first | |
| EC6 | 9 | after | |
| EC7 | 5 | first | |
| EC8 | 11 | after | finished room: no sidebar change, no lobby |
| EC9 | 5 | first | |
| EC10 | 8 | after | |
| EC11 | 10 | after | |
| EC12 | 10 | after | |
| EC13 | 10, 12 | after | browser |
| EC14 | 5, 11 | first, after | |
| EC15 | 2, 7 | first, after | |
| EC16 | 8, 10, 11 | after | class checks; no emulation tool, so confirmed in code |
| EC17 | 10, 12 | after | |
| EC18 | 8 | after | |
| EC19 | 5, 11 | first, after | |

- Must verify, not assume: Web Audio level reading on iOS Safari (device check by the user); the sidebar cookie after restore; the End tooltip after the dialog closes; WCAG contrast on the dark stage in both app themes.
- Open questions: none.
- Known baseline failures: none seen; the last full run was 37 files, 737 tests, all passing.

## Blockers & Resolutions
- Send must stay reachable with the transcript closed -> the review card in the bar area (step 10); the transcript's unsent entry shows text only (spec "single place to send", still to be confirmed by the user).
- A finished interview has no stage content -> its read-only room opens with the transcript panel open (user-confirmed); everything else follows the live room.
- The bar is a sibling of the stage -> transcript state is lifted to the container.
- Level updates must not re-render the room -> approach B.

## Trade-offs & Rationale
- No new dependency and no new theme tokens: reuse Tooltip, Progress, Popover (CLI), `.dark`.
- No new reducer states: the reducer's rules do not depend on the transcript, clock, sidebar or level, so none of them is turn state.
- Few new files: only `LevelMeter` (used twice), two hooks (each has its own effects) and the new tests; the review card and the help are helpers inside `RoomControls.tsx`.

## Project Rules Applied
- `CLAUDE.md` -> shadcn via CLI only; presentational components in area folders that must earn their file; reducer plus effects for turn flow; media kit has no `@/modules/*` import; tests mirror `src/` with helpers in `tests/helpers/`; AI text rendered as plain text; theme tokens only; `<Activity>` resets in a `useLayoutEffect` cleanup.
- `AGENTS.md` -> Next 16 differences: read `node_modules/next/dist/docs/` before any routing or caching change (none planned).

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | mapped the room, recorder, sidebar and transcript code |
| lean-ctx | direct reads of the recorder, sidebar, transcript, title bar and shell |
| grilling | asked directly: finished-room default and test seams |
| ponytail | the lean choices above (no tokens, no dependency, helpers in place) |

## Ready to Implement
- All spec requirements mapped to steps; every step names files and a verification command and has a Test tag
- Every AC and EC is in the coverage map; gate commands listed; seams user-confirmed
- Approaches Considered filled and checkpoint interval set
- No deviation from the spec, except one interpretation to confirm: the finished room opens with the transcript open (confirmed by the user)

## Deviations During Implementation
- Step 12's browser audit measured real microphone spikes (quiet median 0.022, spikes to 0.32): `trackSilence` and the mic test now require 250 ms of sustained sound (`SOUND_MS`). Covered by new tests in steps 2 and 3.
- `LevelSource` lives in `src/lib/media.ts` (room components may not import `@/hooks/media`).
- A closed room (no control bar) shows a labelled Transcript toggle on the stage.
- The lobby camera tile is 4:3 below `sm` so the camera button never covers its label at 360 px.
