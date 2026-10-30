# Implementation: Interviews Chat Layout

## Status
Ready for PR (manual browser walkthrough pending: see Tests Pending). Part A committed (c23b36f), Part B committed (815c10d); the layout follow-up below is green, not committed.

## Follow-up: conversation title with a menu (after review)
- The user found End interview next to the details in the bar still out of place. The bar is now the conversation's title, like a chat app's:
  - the ghost title button "Junior Backend interview ⌄" (level + role + "interview", chosen with the user over "Interview details", which names the menu rather than the conversation) opens a dropdown with a "Details" heading, style · N questions and, while answering, a destructive "End interview" item that opens the confirmation;
  - quiet "N of M" sits on the right;
  - the progress line and the standalone End button are gone.
- Added shadcn `dropdown-menu` via the CLI (`src/components/ui/dropdown-menu.tsx`, no new npm dependency). New `InterviewTitleBar`; deleted `InterviewProgressBar`.
- `EndInterviewDialog` is now controlled, with no own trigger:
  - "Keep going", Esc and the close button return focus to the title button (the menu item that opened the dialog no longer exists);
  - "End interview" closes the dialog first and ends in `onCloseAutoFocus`, so the closing card's heading focus isn't overridden by the dialog's focus return;
  - the menu is `modal={false}` to avoid the known Radix issue where a modal menu closing under a dialog leaves the page inert.
- The skeleton header matches (title and "N of M" placeholders).
- Docs: spec.md (User Flow, progress, UX layout, AC11) and plan.md (Layout & UX Design) updated.
- Verified: `npx tsc --noEmit` clean, `npm run lint` clean, `npm test` 245/245, production build green. Pending in the browser: keyboard flow (Enter/Space opens the menu, arrows, End item -> dialog, Keep going -> focus on the title, confirm -> focus on the "Interview ended" heading), 360px truncation of the title, dark theme.
- Suggested commit (can be squashed with the two follow-ups below):

      refactor(interviews): conversation title with a details menu; End interview moves into it

## Follow-up: chat-assistant styling (after review)
- The user asked to remove the line above the composer, style it like Claude's chat, and make the screen feel less out of place.
- Composer (`AnswerComposer`):
  - one rounded card with a borderless textarea, owning the focus ring and error border (`focus-within:`, `has-aria-invalid:`);
  - a footer row inside: the hint (from `sm`), or the counter once the answer reaches `ANSWER_COUNTER_FROM` (1600), and a round 44px arrow send button labelled "Send answer";
  - a gradient fade above it instead of the border line.
- Messages (`ChatMessage`, `TypingIndicator`):
  - interviewer lines are plain text beside the avatar, with no bubble; your answers are a soft `bg-muted` bubble on the right instead of `bg-primary`;
  - the thinking label is plain shimmer text beside the avatar.
- The interview bar and the skeleton lose their bottom border; the skeleton's composer is rounded to match.
- Docs: spec.md (UX: messages and composer) and plan.md (Layout & UX Design) updated.
- Verified: `npx tsc --noEmit` clean, `npm run lint` clean, `npm test` 245/245, production build green. The compiled CSS contains the `focus-within`, `has-aria-invalid`, `before:` fade and `bg-linear-to-t` utilities. Visual check pending.
- Suggested commit (can be squashed with the interview-bar follow-up):

      style(interviews): chat-assistant look for the interview conversation and composer

## Follow-up: interview bar instead of the details panel (after review)
- The user found the right-hand "Interview details" panel didn't fit a chat. It is replaced by one interview bar above the conversation on every screen size: "Question N of M" + progress line, role · level · style (muted, from `sm`), End interview while answering. The chat is one centered column (`max-w-3xl`).
- Changed: `InterviewProgressBar` (now takes `position`, adds the progress line and setup details), `InterviewChat` (centered column, no `InterviewColumns`), `InterviewSessionSkeleton` (same frame), `InterviewColumns` (unused `asideClassName` removed; header-aware sticky offset kept for the setup form). Deleted: `InterviewDetailsCard` (no other users; `InterviewDetailList` stays for the setup form).
- Docs: spec.md (User Flow, progress requirement, UX layout, AC11, conventions) and plan.md (Layout & UX Design) updated.
- Verified: `npx tsc --noEmit` clean, `npm run lint` clean, `npm test` 245/245, `NODE_ENV=production npm run build` green. Visual check pending (360px, `sm`, desktop, dark theme).
- Suggested commit:

      refactor(interviews): interview bar above the chat instead of a details side panel

      - One centered chat column on every screen size; the bar shows progress (text + line),
        role, level and style, and End interview while answering
      - Remove InterviewDetailsCard and the unused aside option on InterviewColumns

## Completed Steps
### Part A: Chat core (committed: c23b36f)
- [x] A0. AI Elements components (registry in components.json, conversation + shimmer via shadcn CLI, Shimmer static-components fix)
- [x] A1. Contract (transcript roles/kinds, thinking labels, timings, copy; transcript schema; ThreadItem/ThreadView; InterviewStep `ended`)
- [x] A2. Service `messages`, key `messages(id)` under `detail(id)`, `useInterviewMessagesQuery`, answer mutation with fetch cancel + `appendAnswerTurn` merge
- [x] A3. Pure utils: `getInterviewStep` (abandoned -> ended), `pickThinkingLabel`, `appendAnswerTurn`, `buildThreadView`
- [x] A4. Hook `use-interview-chat` (optimistic bubble via mutation variables, label + slow label, min thinking time, reveal pause, 422/409/404/other handling)
- [x] A5. Components and layout: ChatThread, ChatMessage, InterviewerAvatar, TypingIndicator, JumpToLatestButton, AnswerComposer, InterviewClosingCard, InterviewProgressBar, InterviewChat; shared TextAreaField/AppShell/InterviewColumns/InterviewDetailsCard/EndInterviewDialog/skeleton changes; root `viewport.interactiveWidget`
- [x] A6. Containers: InterviewsContainer (messages query, errors only without data, 404 from either), ActiveInterview (footer: thread error / ended / completed / stale notice / composer)
- [x] A7. Deleted the step-by-step components and `COMPLETED_FALLBACK_TEXT`; typecheck, lint, tests, build, E2E contract check, graphify update

### Part B: Robustness
- [x] B1. `isNoResponseError` in `api.helper` (no response, or the BFF's 503 `SERVICE_UNAVAILABLE`); `src/lib/unload-guard.ts`; the session-expired redirect bypasses the leave warning
- [x] B2. `ANSWER_TIMEOUT_MS` (45s) / `START_TIMEOUT_MS` (60s) in the service calls and the `/api/[...path]` forwarder (POST `interviews/{id}/messages` and POST `interviews` only)
- [x] B3. `getAnswerErrorResult` -> `unknown`; `AnswerOutcome`; the answer mutation recovers a lost reply (fresh interview fetch, no retry; moved past the question -> refetch thread, `recovered`; otherwise rethrow)
- [x] B4. Hook: `recovered` ends quietly, `unknown` toasts `UNCONFIRMED_SEND_MESSAGE`, exposes `isSending`; `useWarnBeforeUnload` (composer: unsent text; ActiveInterview: in-flight send); start timeout toast
- [x] B5. Typecheck, lint, full suite, production build, E2E contract re-run, graphify update

## Current Step
Done. Waiting for the user's Part B commit and the manual browser walkthrough.

## Changes Made
Not committed by Claude (user commits manually). Part A: c23b36f.

Suggested Part B commit:

    feat(interviews): survive slow interviewer replies and protect unsent answers

    - Answer and start requests get budgets above cuewise-be's LLM time (45s / 60s) in the browser
      call and the /api forwarder; every other route keeps 15s
    - A send with no response is checked against the backend: if the interview moved on, the saved
      turn is reloaded and shown with no error; otherwise "couldn't confirm" and the text comes back
    - isNoResponseError helper (timeout, network drop, forwarder 503)
    - Browser leave warning while an answer is typed or sending; the session-expired redirect skips it
    - Specific toast when starting an interview times out

## Test Results
- `npm test`: 22 files, 245 tests passing (baseline 209 before Part A; Part A 232; Part B +13).
- `npx tsc --noEmit`: clean. `npm run lint`: clean.
- `NODE_ENV=production npm run build`: green.
- Part A build checks: `motion` only in the `/interviews` route's client chunk; AppShell variables, column height, sticky offset and safe-area padding present in the compiled CSS; built HTML has `interactive-widget=resizes-content`.
- E2E through the BFF against local cuewise-be (scratch script, 2-question interview): 13/13 pass, re-run after Part B (per-route forwarder timeouts) with the same result.

## Tests Pending
- Manual browser walkthrough (Part A checklist): 3-question chat pinned and scrolled up (jump button focuses the composer); reload mid-reply and on a completed interview; tab switch during a send; 422 via long paste; 2-tab 409; End while pending; long URL; forced stale thread (stuck notice); 360px, dark theme, keyboard only (incl. Safari thread scrolling), reduced motion; composer growth; Android Chrome keyboard (window still) and iOS Safari keyboard (composer and latest message visible); setup and sign-in pages with the Android keyboard (global viewport change).
- Manual (Part B), needs temporarily lowered timeouts or a slowed backend: a lost reply that was saved (no toast, turn appears); a lost reply that wasn't saved ("couldn't confirm" toast, text restored, resend works or 409-resyncs); start timeout toast; leave warning with typed text and while sending; no warning on the session-expired redirect.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | A1 | transcript: question, answer, reaction payload parses | spec | AC1 | pass |
| T2 | A1 | transcript: question with null created_at parses | spec | AC1, constraint | pass |
| T3 | A1 | transcript: unknown kind / role rejected | spec | EC12 | pass (guard; passed on first run) |
| T4 | A1 | transcript: missing items rejected | spec | EC12 | pass (guard; passed on first run) |
| T5 | A2 | service messages: GET path, parsed items | spec | AC1 | pass |
| T6 | A2 | service messages: malformed payload rejects | spec | EC12 | pass |
| T7 | A3 | getInterviewStep: abandoned -> ended | spec | EC29 | pass |
| T8 | A3 | pickThinkingLabel: wrap-up label on last question | spec | AC6 | pass |
| T9 | A3 | pickThinkingLabel: label from the list via random source | spec | AC6 | pass |
| T10 | A3 | pickThinkingLabel: never repeats previous | spec | EC14 | pass |
| T11 | A3 | appendAnswerTurn: mid-interview turn | spec | AC3, EC3 | pass |
| T12 | A3 | appendAnswerTurn: final turn | spec | AC4, EC4 | pass (type-forced branch) |
| T13 | A3 | appendAnswerTurn: duplicate turn is a no-op | spec | EC28 | pass |
| T14 | A3 | appendAnswerTurn: undefined thread passes through | spec | plan | pass (type-forced branch) |
| T15 | A3 | appendAnswerTurn: answered question missing -> unchanged | code-derived | items[-1] crash | pass |
| T16 | A3 | buildThreadView: keys question_id:kind | spec | AC13 | pass |
| T17 | A3 | buildThreadView: pending answer appended, same key as stored | spec | AC3 | pass |
| T18 | A3 | buildThreadView: pending dropped once stored | spec | plan (dedupe) | pass |
| T19 | A3 | buildThreadView: hidden next question, position stays | spec | AC3, AC11 | pass |
| T20 | A3 | buildThreadView: reaction held back during min thinking time | inferred | fast reply shows reaction under indicator | pass |
| T21 | A3 | buildThreadView: openQuestion even while hidden | spec | EC30 | pass |
| T22 | A3 | buildThreadView: no openQuestion when all answered | spec | EC36 | pass |
| T23 | A3 | buildThreadView: no options -> transcript as is | spec | AC2 | pass |
| T24 | B1 | isNoResponseError: timeout | spec | EC25, EC26 | pass |
| T25 | B1 | isNoResponseError: network drop | spec | EC26 | pass (same branch; passed on first run) |
| T26 | B1 | isNoResponseError: forwarder 503 SERVICE_UNAVAILABLE | spec | EC26 | pass |
| T27 | B1 | isNoResponseError: false for 500, 409, plain Error | spec | AC7 | pass |
| T28 | B2 | service start passes START_TIMEOUT_MS (exact call) | spec | AC15 | pass |
| T29 | B2 | service answer passes ANSWER_TIMEOUT_MS (exact call, both answer tests) | spec | AC15 | pass |
| T30 | B2 | forwarder: POST messages 45s, POST interviews 60s, GET messages / GET interviews / POST users 15s | spec | AC15 | pass (after) |
| T31 | B3 | getAnswerErrorResult: network error, timeout, forwarder 503 -> unknown (network moved from toast) | spec | AC7, EC26 | pass |

## Open Questions
- None.

## Baseline Failures
- None (209/209 before the change).

## Known Issues
- iOS Safari pans the page while the keyboard is open (header can scroll out of view): accepted per spec EC24.
- End interview is still client-only.
- The "couldn't confirm" toast keeps `useMutationCallbacks`' standard description ("Something went wrong, please try again") under its title, because the shared helper always derives the description from the error. The title carries the real guidance, and a resend is safe (409 resync), so the shared helper was left unchanged.
- A start that times out after the backend created the session leaves an orphan `in_progress` session (no endpoint to find it): backend follow-up, per spec.
- The answer recovery path and the leave warning are only verifiable manually (no component-test tooling); their decisions are covered by `isNoResponseError` / `getAnswerErrorResult` tests.

## Deviations from Plan
- A0 Shimmer fix: `as` narrowed to `p | span | div` -> plan.md A0 updated -> recorded.
- A3/A4: `hiddenReactionQuestionId` added to `buildThreadView` (fast reply would show the reaction under the indicator) -> plan.md A3 updated, test T20 -> recorded.
- A5: the thinking label's screen-reader status is an always-mounted `role="status"` in ChatThread; TypingIndicator is `aria-hidden` -> within AC13, recorded.
- A5: new `InterviewerAvatar` and `formatQuestionPosition` -> recorded.
- B4: the composer registers `useWarnBeforeUnload(answerLength > 0)` itself and ActiveInterview registers it for `isSending`, instead of a `hasUnsentText` callback -> plan.md B4 updated -> recorded.
- B2: the forwarder imports `ANSWER_TIMEOUT_MS` / `START_TIMEOUT_MS` from the interviews constants so browser and BFF budgets can't drift -> within plan intent, recorded.
- Tooling (Part A): a stray `src/modules/interviews/graphify-out/` from one misplaced `graphify update` was deleted and the update rerun from the root.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| - | find-skills | searched skills.sh for AI Elements; only unvetted community skills (~200 installs), none installed |
| A0 | shadcn (CLI) | added `@ai-elements/conversation` and `@ai-elements/shimmer` through the registry |
| A1-A3, B1-B3 | tdd / test | red -> green per slice at the confirmed seams; code-derived T15, inferred T20; existing exact-call tests tightened for the timeout (T28, T29) |
| A5, B2 | AGENTS.md / Next docs | read `generate-viewport.md` before the root `viewport` export; the forwarder change is a timeout value inside the existing Route Handler |
| all | lean-ctx, graphify | lookups, searches and shell; `graphify update .` after each part |

## Links
- Spec: docs/features/interviews-chat-layout/spec.md
- Plan: docs/features/interviews-chat-layout/plan.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete (A0-A7, B1-B5)
- [x] Full test suite + build green (not just per-step tests)
- [x] Every spec.md acceptance criterion met by actual code; logic covered by passing tests, UI/timing/browser behavior listed under Tests Pending for the manual walkthrough
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately (the network case moved from `toast` to `unknown` per spec, T31)
- [x] task.md fully updated
- [x] Commits documented (Part A c23b36f by the user; Part B message suggested above)
- [x] No open blockers
- [x] Code follows project rules (cuewise-fe/CLAUDE.md)
- [x] No unresolved plan deviations
