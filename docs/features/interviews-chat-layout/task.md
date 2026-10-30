# Implementation: Interviews Chat Layout

## Status
Part A complete (green, waiting for the user's Part A commit). Part B (B1-B5) not started.

## Completed Steps
### Part A: Chat core
- [x] A0. AI Elements components (registry in components.json, conversation + shimmer via shadcn CLI, Shimmer static-components fix)
- [x] A1. Contract (transcript roles/kinds, thinking labels, timings, copy; transcript schema; ThreadItem/ThreadView; InterviewStep `ended`)
- [x] A2. Service `messages`, key `messages(id)` under `detail(id)`, `useInterviewMessagesQuery`, answer mutation with fetch cancel + `appendAnswerTurn` merge
- [x] A3. Pure utils: `getInterviewStep` (abandoned -> ended), `pickThinkingLabel`, `appendAnswerTurn`, `buildThreadView`
- [x] A4. Hook `use-interview-chat` (optimistic bubble via mutation variables, label + slow label, min thinking time, reveal pause, 422/409/404/other handling)
- [x] A5. Components and layout: ChatThread, ChatMessage, InterviewerAvatar, TypingIndicator, JumpToLatestButton, AnswerComposer, InterviewClosingCard, InterviewProgressBar, InterviewChat; shared TextAreaField/AppShell/InterviewColumns/InterviewDetailsCard/EndInterviewDialog/skeleton changes; root `viewport.interactiveWidget`
- [x] A6. Containers: InterviewsContainer (messages query, errors only without data, 404 from either), ActiveInterview (footer: thread error / ended / completed / stale notice / composer)
- [x] A7. Deleted QuestionCard, ReactionCard, InterviewSession, InterviewCompletedPanel, InterviewEndedPanel, AnswerForm, use-answer-turn, COMPLETED_FALLBACK_TEXT; typecheck, lint, tests, build, E2E contract check, graphify update

### Part B: Robustness
- [ ] B1. isNoResponseError + unload guard
- [ ] B2. Route timeouts (service + BFF)
- [ ] B3. Answer recovery
- [ ] B4. Hook outcomes, leave warning, start timeout toast
- [ ] B5. Verify Part B

## Current Step
Paused after A7 so Part A can be committed on its own (plan: one commit per part).

## Changes Made
Not committed (user commits manually).

Suggested Part A commit (stage everything except graphify-out if you keep it separate):

    feat(interviews): chat-style interview session with AI Elements

    - Conversation thread from GET /interviews/{id}/messages (zod schema, service, query under the
      interview key); the answer mutation cancels in-flight fetches and merges answer, reaction and
      next question into the cached thread (no extra GET)
    - AI Elements Conversation (use-stick-to-bottom) and Shimmer (motion); Shimmer fixed so it no
      longer creates a component during render (react-hooks/static-components)
    - Optimistic answer bubble, randomly labelled shimmering thinking indicator with a slow label,
      600ms reveal of the next question, stable message keys, progress from what is visible
    - Composer: Ctrl/Cmd+Enter to send, IME-safe, read-only while busy, text restored on failure
    - Fixed-height chat column (AppShell CSS variables), jump-to-latest button that focuses the
      composer, interviewer avatar, closing card for completed/ended/abandoned, stale-thread Retry
    - viewport interactive-widget=resizes-content for the Android keyboard
    - Remove the step-by-step question/reaction/completed/ended components

## Test Results
- `npm test`: 22 files, 232 tests passing (baseline 209; 23 new).
- `npx tsc --noEmit`: clean. `npm run lint`: clean (AI Elements files included).
- `NODE_ENV=production npm run build`: green.
- Build checks (scratch script): `motion` appears in exactly one client chunk, referenced only by the `/interviews` route manifest; compiled CSS contains the AppShell variables, the `100dvh - var(--app-header-height) - ...` column height, the sticky offset and `env(safe-area-inset-bottom)`; built HTML has `<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">`.
- E2E through the BFF against local cuewise-be (scratch script, 2-question interview): 13/13 pass. Fresh transcript is only question 1 with null `created_at`; after an answer the order is question, answer, reaction, next question (exactly `appendAnswerTurn`'s shape) with matching reaction and next-question ids; the stored answer is the trimmed text; the completed transcript ends with the closing reaction; unknown interview transcript returns 404.

## Tests Pending
- Manual browser walkthrough (plan A7 checklist), not possible from here: 3-question chat pinned and scrolled up (jump button focuses the composer); reload mid-reply and on a completed interview; tab switch during a send; 422 via long paste; 2-tab 409; End while pending; long URL; forced stale thread (stuck notice); 360px, dark theme, keyboard only (incl. Safari thread scrolling), reduced motion; composer growth; Android Chrome keyboard (window still) and iOS Safari keyboard (composer and latest message visible); setup and sign-in pages with the Android keyboard (global viewport change).

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
| T11 | A3 | appendAnswerTurn: mid-interview turn (answer, reaction, next question) | spec | AC3, EC3 | pass |
| T12 | A3 | appendAnswerTurn: final turn (answer, reaction) | spec | AC4, EC4 | pass (type-forced branch) |
| T13 | A3 | appendAnswerTurn: duplicate turn is a no-op | spec | EC28 | pass |
| T14 | A3 | appendAnswerTurn: undefined thread passes through | spec | plan | pass (type-forced branch) |
| T15 | A3 | appendAnswerTurn: answered question missing -> unchanged (no throw in cache updater) | code-derived | items[-1] crash | pass |
| T16 | A3 | buildThreadView: keys question_id:kind | spec | AC13 | pass |
| T17 | A3 | buildThreadView: pending answer appended, same key as stored | spec | AC3 | pass |
| T18 | A3 | buildThreadView: pending dropped once stored | spec | plan (dedupe) | pass |
| T19 | A3 | buildThreadView: hidden next question, position stays | spec | AC3, AC11 | pass |
| T20 | A3 | buildThreadView: reaction held back during min thinking time | inferred | fast reply shows reaction under indicator | pass |
| T21 | A3 | buildThreadView: openQuestion even while hidden | spec | EC30 | pass |
| T22 | A3 | buildThreadView: no openQuestion when all answered | spec | EC36 | pass |
| T23 | A3 | buildThreadView: no options -> transcript as is, position of last question | spec | AC2 | pass |

## Open Questions
- None.

## Baseline Failures
- None (209/209 before the change).

## Known Issues
- iOS Safari pans the page while the keyboard is open (header can scroll out of view): accepted per spec EC24.
- End interview is still client-only; Part B does not change that.
- Part B items (longer timeouts, unknown-outcome recovery, leave warning, start timeout toast) are not in yet: until then a reply slower than 15s shows "Couldn't send your answer" even if it was saved.

## Deviations from Plan
- A0 Shimmer fix: `as` narrowed from any ElementType to `p | span | div` (module-level `motion.p/span/div` map), because an open-ended `as` needs `motion.create` at render -> plan.md A0 updated -> recorded.
- A3/A4: added `hiddenReactionQuestionId` to `buildThreadView`. The success write lands immediately, so on a fast reply the reaction would otherwise show under the still-visible thinking indicator (MIN_THINKING_MS) -> plan.md A3 updated, test T20 -> recorded.
- A5: the screen-reader status for the thinking label is an always-mounted `role="status"` in ChatThread; the visual TypingIndicator is `aria-hidden`. Text inserted together with a new live region is often not announced -> within plan intent (AC13), recorded.
- A5: the composer's "has unsent text" callback is deferred to B4, where it is first used (no unused prop in Part A) -> recorded.
- A5: new small components `InterviewerAvatar` (shared by ChatMessage and TypingIndicator, one component per file) and `formatQuestionPosition` next to `formatQuestionCount` -> recorded.
- Tooling: one `graphify update .` ran from `src/modules/interviews` (shell cwd) and created a stray `graphify-out/` there; it was deleted and the update rerun from the repo root.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| - | find-skills | searched skills.sh for AI Elements; only unvetted community skills (~200 installs), none installed |
| A0 | shadcn (CLI) | added `@ai-elements/conversation` and `@ai-elements/shimmer` through the registry; existing `button` skipped (identical) |
| A1-A3 | tdd / test | red -> green per slice at the confirmed seams; code-derived T15, inferred T20 |
| A5 | AGENTS.md / Next docs | read `generate-viewport.md` before adding the root `viewport` export (Server Component only) |
| all | lean-ctx, graphify | lookups, searches and shell; `graphify update .` at the end of Part A |

## Links
- Spec: docs/features/interviews-chat-layout/spec.md
- Plan: docs/features/interviews-chat-layout/plan.md

---

## Validation Checklist (before PR)
- [ ] All plan.md steps complete (Part A done; Part B pending)
- [x] Full test suite + build green (Part A)
- [ ] Every spec.md acceptance criterion met by actual code (Part A ACs met; AC15 and the Part B halves of AC7/AC9/AC16 pending)
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately
- [x] task.md fully updated
- [ ] Commits documented (user commits manually; Part A message suggested above)
- [x] No open blockers
- [x] Code follows project rules (cuewise-fe/CLAUDE.md)
- [x] No unresolved plan deviations
