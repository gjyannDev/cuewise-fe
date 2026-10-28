# Feature: Interviews Setup UI (foundation)

## Problem
A signed-in user opening `/interviews` sees only the placeholder text "AI Mock Interview". They cannot configure or start a mock interview, even though `cuewise-be` can already create a session and return its first question.

## Goal
On `/interviews`, a user can configure an interview, start it, and see a summary of their picks plus the first question with an answer box, all on one page and driven by the two backend endpoints that exist today. Answering, advancing, and feedback are not part of this feature.

## Project Conventions
- Rules consulted: root `CLAUDE.md`, `cuewise-fe/CLAUDE.md`, `AGENTS.md` (no `.claude/rules/` exists).
- Service -> query -> component layering; services are the only HTTP layer, components never import services or build query keys.
- Components are dumb; a container/page calls query hooks. Default to Server Components, `"use client"` only where needed.
- Forms use react-hook-form + `zodResolver` with a schema in `modules/interviews/schemas/`, and the shared fields in `src/shared/forms/` (add a new shared field rather than inlining inputs). Fieldset and submit are disabled while the mutation is pending. Backend 422/409 field errors go to `setError`, everything else is a toast through `useMutationCallbacks`.
- The browser only calls `/api/*` on Next.js (existing catch-all BFF forwarder); no token handling in the browser.
- Server data lives in the TanStack Query cache; zustand is not used for it. Every query key comes from a key factory.
- Loading, empty and error states are required for data-driven UI. Errors are normalized via `src/lib/config/api.helper.ts`; no raw error text shown.
- Tests live under `tests/` mirroring `src/`.
- shadcn primitives are added with the CLI, not hand-written.

## User Flow
1. The user opens `/interviews` (no `?session=`). They see the config form with defaults: type `mixed`, 5 questions; role and level unselected.
2. They choose role, level, type, question count, and optionally paste a job description.
3. They press **Start AI Interview**. The form is disabled and shows a pending state while the request runs.
4. On success the URL becomes `/interviews?session=<id>` and the page shows the session view: a summary bar (role, level, type, question count), a position indicator, the current question, an answer textarea, and a disabled **Next** button with a "coming soon" hint.
5. The user can type in the textarea. Nothing is sent.
6. The user can press **End interview** in the summary bar. A confirmation dialog says the interview will be abandoned (Cancel / End interview). On confirm the page shows an *ended* screen: status badge "Abandoned", a placeholder early-feedback panel ("AI feedback isn't available yet") and a **Start a new interview** button that returns to the setup card (`/interviews`).
7. Reloading or sharing `/interviews?session=<id>` shows the same session view (fetched via `GET /interviews/{id}`).

## Requirements

### Functional
- The page shows the config form when there is no valid `session` param, and the session view when there is one.
- Config form fields mirror `InterviewCreateIn`: `role` (`frontend|backend|fullstack|mobile|data`), `level` (`intern|junior|mid|senior`), `interview_type` (`behavioral|technical|mixed`), `question_count` (integer 1-10), `job_description` (optional, max 2000 chars).
- Submitting calls `POST /interviews` through the Next.js BFF with exactly those five fields (the backend rejects unknown fields). A blank job description is sent as omitted/`null`.
- On success, the response is seeded into the query cache under the new session's key (no second fetch) and the URL param is set.
- The session view reads `{ session, current_question }` from the cache/`GET /interviews/{id}`.
- Summary bar shows role, level, type and question count from `session`.
- The question card shows the question text, its category, and "Question {position} of {question_count}".
- The answer textarea is typeable with client-side validation (1-2000 chars, trimmed). **Next** is disabled with a "coming soon" hint. No request is made on typing or submit.
- **End interview** opens a confirmation dialog. Confirming switches the container to an *ended* view held in client state only: the picks summary, an "Abandoned" status badge, a placeholder early-feedback panel and a **Start a new interview** button that clears the `session` param. No request is sent in this foundation; the backend status is unchanged.

### Non-Functional
- Auth: the page remains behind `requireUser`; no tokens or PII are logged or stored client-side.
- `?session=` is validated as a UUID before any request is made.
- AI/user-supplied text (question text, job description) is rendered as plain text, never as HTML.
- Only the five config fields are sent; no extra personal data.

## UX Requirements
Layout (detail and rationale in plan.md > Layout & UX Design):
- **Two screens, one route:** screen 1 is the setup card; **Start AI Interview** replaces it entirely with screen 2, a dedicated interview screen (question, answer box, **Next**). The setup card is not shown while an interview is on screen.
- **Page frame:** left-aligned with the app shell's header and sidebar (no extra page container), page title "AI Mock Interview" with one line of context, content fills the available width (the section-card grid keeps rows short).
- **Setup screen:** the form split into section cards in a grid (*Role & level* and *Length* side by side, *Interview style* and *Job description* full width; one column when the form area is narrow) on the left and a sticky *Summary* card on the right with the live choices and **Start AI Interview**. Below `xl` the summary stacks under the form.
- **Interview screen:** question card and answer card on the left; a sticky *Interview details* card on the right (role, level, style, length, **End interview**). Below `xl` the details stack under the answer.
- **Responsive:** single column below `xl` (the sidebar takes about 16rem, so two columns start at `xl`); option grids respond to their own width (container queries): level options 2x2 when narrow, 4 in a row when wide; style cards stacked when narrow, 3 in a row when wide. Start is full-width. No horizontal scroll from 360px up.
- **Hierarchy:** one primary action per view (Start AI Interview; End interview is secondary/outline; the disabled Next is visually subordinate to the textarea).

Interaction and content:
- Interview type options explain themselves: icon, name and a one-line description each. A selected option is shown by border, tint **and** a check mark (never color alone).
- Question count shows its value live ("5 questions") with the 1 and 10 limits at the ends of the slider.
- Job description shows a character counter ("0 / 2000") and an "optional" hint that says what it is used for.
- Validation runs on blur and on submit; each error appears under its field; on a failed submit focus moves to the first invalid field.
- Loading: a skeleton shaped like the final session view (no layout jump). Pending: form disabled, button shows a spinner and "Preparing your questions…". Error: an alert with a retry button. Not found: a centered message with a single action (EC3).
- Motion is limited to short color/border transitions (about 150ms) and the spinner; nothing animates layout, and `prefers-reduced-motion` is respected.

Accessibility:
- Every input has a visible label linked with `htmlFor`/`id` (no placeholder-only labels); radio groups and the slider are fully keyboard-operable (arrow keys, Home/End for the slider) with visible focus states.
- Errors are tied to their field with `aria-describedby`; page-level errors and failed loads use `role="alert"`; busy regions use `aria-busy`.
- Interactive targets are at least 44x44px; text and controls meet 4.5:1 contrast in both light and dark themes.
- The progress indicator exposes its value to assistive technology.

Theming:
- Uses theme tokens only (no hardcoded colors), existing `ui/` primitives and `shared/forms` fields; works in the existing light and dark themes.

## Constraints
- Backend currently exposes only `POST /interviews` (201 -> `{session, current_question}`) and `GET /interviews/{id}` (always returns position 1 for now).
- Questions come from a static bank, not AI; question count availability depends on the bank.
- Starting an interview **abandons** the user's current in-progress one (backend behavior; no resume/active-session endpoint exists).
- Next.js 16: `searchParams` is async; consult `node_modules/next/dist/docs/` before writing routing code.

## Blockers
- None for the foundation. Follow-ups needing backend work (out of scope here): answer endpoint, current-position on the session, active-session lookup, completion/evaluation. Also: ending an interview on the backend (setting its status to `abandoned`) and real early feedback need a new endpoint; the End interview flow here is a UI shell only.

## Edge Cases
- **EC1:** `POST /interviews` returns 409 (bank has too few questions for the chosen role/level/type/count) -> the backend message appears as an inline error on the question-count field, the form keeps all entered values and re-enables for retry. (verified against cuewise-be: code `NOT_ENOUGH_QUESTIONS`, details `{requested, available}`, no field name, so the frontend picks the field.)
- **EC2:** `POST /interviews` returns 422 -> each field error from the response is shown under its field; the form stays editable.
- **EC3:** `?session=` is not a UUID, or `GET /interviews/{id}` returns 404 (wrong id, another user's session) -> a "Interview not found" state with a **Start a new interview** button that clears the param and shows the config form. No toast.
- **EC4:** `POST /interviews` or `GET` fails with a network error / 5xx -> a toast with a generic message (config form keeps values; session view shows an error state with a retry button).
- **EC5:** Session expires (401 with a session code) during any call -> existing BFF/session-expired handling applies; this feature adds nothing.
- **EC6:** `job_description` over 2000 characters -> client validation error, no request sent.
- **EC7:** `question_count` empty, non-integer, <1 or >10 -> client validation error, no request sent.
- **EC8:** Role or level not selected -> client validation error, no request sent.
- **EC9:** User double-clicks **Start AI Interview** -> only one request is sent (form disabled while pending).
- **EC10:** User opens `/interviews` with no `session` param while having an in-progress interview -> the empty config form is shown (no resume offered); starting a new one abandons the old one.
- **EC11:** Answer textarea over 2000 characters or empty/whitespace -> shows a validation hint; Next stays disabled regardless.
- **EC12:** User reloads `/interviews?session=<valid id>` -> same session view is rendered from a fresh fetch.
- **EC13:** User reloads or revisits the URL after ending an interview -> the interview screen appears again, because the end is client-only in this foundation and the backend status is still `in_progress`. (assumption — verify against the backend once an end endpoint exists)
- **EC14:** User dismisses the End interview dialog (Cancel, Esc, or click outside) -> the dialog closes, the interview continues and any typed answer is kept.

## Acceptance Criteria
- [ ] **AC1:** Opening `/interviews` with no `session` param shows the config form with role and level unselected, type `mixed` and question count 5.
- [ ] **AC2:** Submitting a valid form sends a single `POST` through the BFF containing exactly `role`, `level`, `interview_type`, `question_count` and (when non-blank) `job_description`.
- [ ] **AC3:** On a 201 response the URL changes to `/interviews?session=<id>` and the session view appears without an additional `GET`.
- [ ] **AC4:** The session view shows a summary bar with the chosen role, level, type and question count, and the question text, its category and "Question 1 of N".
- [ ] **AC5:** The session view includes an answer textarea that accepts typing, and a **Next** button that is disabled and labelled/hinted as coming soon; typing or clicking issues no network request.
- [ ] **AC6:** Reloading `/interviews?session=<id>` renders the same summary and first question via `GET /interviews/{id}`.
- [ ] **AC7:** While the start request is pending the form fields and button are disabled and "Preparing your questions…" is shown; a second click sends no second request (EC9).
- [ ] **AC8:** A 409 shows the backend's message under the question-count field and leaves all values intact (EC1).
- [ ] **AC9:** A 422 shows each returned field error under the matching field (EC2).
- [ ] **AC10:** Client validation blocks submission and shows messages for missing role/level, out-of-range or non-integer count, and a job description over 2000 chars (EC6-EC8).
- [ ] **AC11:** A non-UUID or 404 `session` shows the "Interview not found" state, and its button returns to the config form with the param cleared (EC3).
- [ ] **AC12:** **End interview** opens a confirmation dialog; Cancel/Esc closes it and keeps the typed answer (EC14); confirming shows the ended screen with an "Abandoned" badge, the placeholder early-feedback panel and a **Start a new interview** button that returns to the setup card at `/interviews`. No network request is made.
- [ ] **AC13:** Loading shows skeletons, a failed session load shows an error with retry, and no raw error text is shown anywhere (EC4).
- [ ] **AC14:** Pure helpers and the zod schemas (form, `session` param, API responses) have unit tests under `tests/`; typecheck, lint and tests pass.
- [ ] **AC15:** At 360px width both views have no horizontal scroll; level options wrap 2x2 and type cards stack; when the form column is wide enough the type cards are in one row of three.
- [ ] **AC16:** Role select, level options, type cards, slider and both textareas can all be operated with the keyboard alone, show a visible focus state, and have a visible label; the selected type card is identifiable without relying on color.
- [ ] **AC17:** The session view shows "Question 1 of N" with a progress indicator that exposes its value to assistive technology; the skeleton has the same overall layout as the loaded view; interactive targets are at least 44x44px; both views are legible in the dark theme.
- [ ] **AC18:** The confirmation dialog is labelled, traps focus while open, closes on Esc, returns focus to the **End interview** button when cancelled, and its destructive action is clearly distinguished from Cancel.

## Out of Scope
- Submitting answers, advancing to the next question, current-position tracking: backend endpoints don't exist yet.
- AI feedback / scoring / results screen: backend evaluation doesn't exist yet.
- Resuming an in-progress interview or listing past interviews: no backend endpoint.
- Per-question practice-mode feedback toggle and quick "repeat last interview": later enhancements.
- Persisting form defaults between visits (last-used role/level).
- Any backend changes.

- Persisting the end (setting status `abandoned` on the backend) and real early AI feedback: no endpoint exists. The ended screen is a placeholder.