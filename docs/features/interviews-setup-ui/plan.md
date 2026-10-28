# Implementation Plan: Interviews Setup UI (foundation)

## Overview
Build the `/interviews` page as a config form that starts an interview via the BFF and then shows a summary bar, the first question and a not-yet-functional answer box, using only `POST /interviews` and `GET /interviews/{id}`.

## Architecture & Design
A new `modules/interviews` feature follows service -> query -> component. The browser service calls `/api/interviews` (the existing catch-all BFF forwarder already forwards it with the cookie token, so no new Route Handler is needed). Responses are parsed with zod. A mutation hook starts an interview and seeds the query cache under the new session's key; a query hook fetches by id for reloads.

The phase is derived, not stored: `page.tsx` (Server Component, behind `requireUser`) awaits `searchParams`, classifies the `session` param as none / valid UUID / invalid, and passes it to one client container. The container is the only place that calls query hooks and the router. It renders either the config form, the session view, a skeleton, an error-with-retry, or the "not found" state. Everything below the container is presentational. No zustand: there is no client-only state beyond react-hook-form.

Two new shared form fields (`RadioGroupField` with a `segmented`/`cards` variant, `SliderField`) are built on shadcn primitives added through the CLI. `TextAreaField` gets a small accessibility fix.

## Spec Requirements -> Implementation
- Option lists, limits, defaults (AC1, AC10 support) -> Step 2
- Form/request/response/answer/session-param schemas (AC2, AC10, AC14, EC6-EC8, EC11) -> Step 2
- Session-param classifier (AC6, AC11, EC3, EC12) -> Step 3
- Start-payload builder (AC2) and start-error mapper (AC8, AC9, EC1, EC2, EC4) -> Step 3
- Service, key factory, query hooks (AC2, AC3, AC6, AC13) -> Step 4
- Slider, segmented/card radios, label fix (AC1, AC10, accessibility) -> Step 5
- Config form and pending state (AC1, AC7, AC10, EC9) -> Step 6
- Summary bar, question card, answer form, session view, states (AC4, AC5, AC11-AC13, EC11) -> Step 7
- Container and page wiring (AC3, AC6, AC11, AC12, EC3, EC10, EC12) -> Step 8
- Typecheck, lint, tests, build, manual run (AC14) -> Step 9

## Implementation Steps
1. **Add primitives with the shadcn CLI.** Run `npx shadcn@latest add radio-group slider`. Do not edit the generated files. Confirm both land in `src/components/ui/` and that `radix-ui` (already installed) satisfies them. — Test: skip.

2. **Module foundation** (`src/modules/interviews/`: `constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`).
   - Constants: `ROLE_OPTIONS`, `LEVEL_OPTIONS`, `INTERVIEW_TYPE_OPTIONS` (with one-line descriptions), `MIN/MAX_QUESTION_COUNT` (1/10), `JOB_DESCRIPTION_MAX_LENGTH` (2000), `ANSWER_MAX_LENGTH` (2000), `DEFAULT_START_VALUES` (type `mixed`, count 5, role and level unset). Values mirror cuewise-be `interviews_constants.py`; note that in a comment.
   - Schemas: enums for role, level, type; `startInterviewFormSchema` (role and level required with friendly messages, integer count 1-10, optional job description max 2000, trimmed); `interviewSchema` for `{session, current_question}` (session: id UUID, role, level, interview_type, question_count, job_description nullable, status `in_progress|abandoned`, created_at; question: id UUID, position, text, category `behavioral|technical`); `answerFormSchema` (trimmed, 1-2000); `sessionParamSchema` (UUID).
   - Types via `z.infer`.
   - Test: first. Seam: `safeParse` on each exported schema. Slices, one behavior each: defaults plus a chosen role and level pass; missing role -> error on `role`; missing level -> error on `level`; count 0, 11, 2.5 rejected and 1, 10 accepted; job description of 2001 chars rejected and 2000 accepted; whitespace-only job description is valid; interview response parses a real-shaped payload; response rejects a non-UUID id and an unknown role; answer empty/whitespace rejected, 2000 accepted, 2001 rejected. (AC1, AC10, AC14, EC6, EC7, EC8, EC11)

3. **Pure utils** (`src/modules/interviews/utils/`).
   - `parse-session-param`: takes the raw `session` search param (string, array or undefined) and returns `none`, `invalid`, or `valid` with the id. Arrays and non-UUIDs are `invalid`; absent or empty is `none`.
   - `build-start-payload`: form values -> request body with exactly the five fields; a blank/whitespace job description is omitted; text is trimmed.
   - `get-start-error-result`: takes a thrown value, uses `parseApiError`, and returns field errors to show, or null when the error should be a toast. 409 `CONFLICT` -> message on `question_count`; 422 -> its field errors, restricted to known form fields; anything else (network, 5xx, unknown) -> null.
   - Test: first. Seam: the three exported functions (axios errors built with the existing `tests/helpers/axios.ts`). Slices: absent, empty, valid, malformed and array params; blank JD omitted vs kept and trimmed; no extra keys in the payload; 409 maps to `question_count` with the backend message; 422 maps field names; 422 for an unknown field is dropped; 500 and network error return null. (AC2, AC8, AC9, AC11, EC1-EC4, EC12)

4. **Service, keys, queries** (`services/interviews.services.ts`, `queries/interviews.keys.ts`, `queries/interviews.queries.ts`).
   - `InterviewsService` (class like `AuthService`): `start(payload)` POSTs `/interviews`, `get(id)` GETs `/interviews/{id}`; both parse with `interviewSchema`.
   - Keys: `interviewKeys.all` and `.detail(id)`.
   - `useStartInterviewMutation`: on success, `setQueryData(detail(id), data)` so no second GET (AC3). `useInterviewQuery(id)`: enabled only when an id is given; relies on `getQueryClient()` defaults (no retry on 4xx, so a 404 shows immediately).
   - Test: first for the service only. Seam: `interviewsService.start` and `.get` with `API` mocked. Slices: start posts the exact body to `/interviews` and returns parsed data; get requests the right path; a malformed response throws (zod). Keys and hooks: skip (thin wiring). (AC2, AC6)

5. **Shared form fields** (`src/shared/forms/`).
   - `RadioGroupField`: react-hook-form `Controller` + shadcn `radio-group`, props `options` (value, label, optional description and icon), `variant` (`segmented` | `cards`), `label`, `error`, `disabled`. Proper group semantics and keyboard support come from Radix; visible focus ring; selected state = border + tint + check icon; 44px minimum targets; `segmented` wraps 2x2 on mobile.
   - `SliderField`: `Controller` + shadcn `slider`, props `min`, `max`, `step`, `label`, `error`, `disabled`, optional `formatValue`; shows the current value beside the label, the min and max at the track ends, and an accessible name on the thumb; enlarged hit area.
   - `TextAreaField`: link label to textarea with `id`/`htmlFor`, and add an optional `className` so callers can override the fixed `h-88` height. Existing behavior is unchanged when not used.
   - Test: skip (no component test tooling; verified manually in Step 9).

6. **`InterviewConfigForm`** (`src/modules/interviews/components/`). Presentational: `isPending`, `onSubmit(values)` resolving to optional field errors. `useForm` (mode `onTouched`) + `zodResolver(startInterviewFormSchema)` + `DEFAULT_START_VALUES`. Layout and sections exactly as in *Layout & UX Design > Config view*: `Card` with heading, sections (role + level, style cards, length slider, job description), footer with the Start button. `FieldSet` disabled while pending; button reads "Start AI Interview" / spinner + "Preparing your questions…". Applies returned field errors with `setError`. — Test: after (manual: AC1, AC7, AC10, AC15, AC16, EC9).

7. **Session presentational components** (same folder), following *Layout & UX Design > Session view and States*.
   - `InterviewSummaryBar`: role, level and type badges, question count, and the **End interview** outline button (callback prop).
   - `QuestionCard`: "Question {position} of {question_count}" with a progress bar (value exposed to assistive tech), category badge, and the question as plain text in the display font.
   - `AnswerForm`: `useForm` + `zodResolver(answerFormSchema)`, `TextAreaField` (about 8 rows, via the new `className`/`rows` props) with counter, disabled **Next** and the "coming soon" hint linked by `aria-describedby`; `onSubmit` is not wired and nothing is sent.
   - `InterviewSession`: composes the three above from one `InterviewResponse`.
   - `EndInterviewDialog`: shadcn `dialog` (already in `ui/`), title "End this interview?", short explanation that it will be abandoned, **Cancel** and a destructive **End interview**; focus trap, Esc to close and focus return come from Radix.
   - `InterviewEndedPanel`: the *ended* screen: picks summary, "Abandoned" status badge, placeholder early-feedback card ("AI feedback isn't available yet") and **Start a new interview** (callback). Plain text only.
   - `InterviewSessionSkeleton` (same structure as the loaded view, `aria-busy`), `InterviewSessionError` (`role="alert"`, retry callback), `InterviewNotFound` (single action callback).
   - Label helpers for enum values live in `constants.ts` options, not duplicated in components. — Test: after (manual: AC4, AC5, AC11, AC13, AC15-AC17, EC11).

8. **Container and page.**
   - `src/app/(app)/interviews/_components/InterviewsContainer.tsx` (`"use client"`): receives the classified session param; calls `useStartInterviewMutation` and `useInterviewQuery`; on start success `router.push` to `/interviews?session=<id>`; on error uses `get-start-error-result` (field errors returned to the form, otherwise `useMutationCallbacks` toast via the same pattern as `AuthFormContainer`); "Start a new interview" (from the not-found and ended screens) pushes `/interviews`. Chooses between config form, skeleton, error, not-found, ended and session view; a 404 from the query -> not-found, other errors -> error with `refetch`.
   - The container also holds a local `isEnded` flag (component state, reset when the session id changes): opening the dialog and confirming sets it and renders `InterviewEndedPanel`; nothing is sent. The flag is deliberately not in the URL or the cache, since the backend has no end endpoint (see EC13).
   - `page.tsx`: keep the `Suspense` + `requireUser("/interviews")` structure; await `searchParams`, run `parse-session-param`, render the container. Page stays thin. **Before writing, read the `searchParams`/page docs in `node_modules/next/dist/docs/`** (Next 16: async `searchParams`, behavior inside `Suspense`).
   - Test: after (manual: AC3, AC6, AC11, AC12, EC3, EC10, EC12).

9. **Verify and finish.** Run `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`. Manually run the app against the local backend and walk the checklist below, including light and dark themes. Optionally audit the finished UI with the `web-design-guidelines` skill if installed. Then run `graphify update .`. Do not commit. — Test: n/a.

## Layout & UX Design
**Flow in one line:** screen 1 = setup card; **Start AI Interview** replaces it with screen 2 = the dedicated interview screen (question, answer box, **Next**). Both live at `/interviews`; the URL `?session=` param picks the screen. **Next** is a disabled placeholder until the backend has an answer endpoint.

Sources: `ui-ux-pro-max` (UX search: forms, loading/empty/error, layout shift; shadcn stack: `Field` + React Hook Form `Controller`), the existing theme tokens in `globals.css` (violet primary, aqua secondary, `muted`, `accent`, `card`, `border`, `ring`, radius 0.5rem) and the existing pages (`AuthCard` uses `Card` with title and description; signed-in pages sit in `AppShell` with `.main-container`). No new design system is generated; everything below reuses the current tokens and primitives.

**Config view** (`/interviews`, no session)
- Page heading (h1 "New interview") with one muted line ("Tell us what you're preparing for."), then one `Card`, max width about 42rem, left-aligned in the content area.
- Card sections separated by spacing (gap 6-8) and small section headings, in this order:
  1. *Role*: role select and the level options side by side from `sm`, stacked on mobile.
  2. *Interview style*: three option cards (icon, name, one-line description): Technical, Behavioral, Mixed. Stacked on mobile, three columns from `md`.
  3. *Length*: slider with the live value ("5 questions") next to the label and "1" / "10" at the track ends.
  4. *Job description (optional)*: textarea about 5 rows, helper text ("Paste the posting to get more relevant questions. Optional."), counter "n / 2000" right-aligned.
- Card footer: **Start AI Interview** (primary, `lg`), full-width on mobile and right-aligned from `sm`. It is the only primary action on the view.
- Selected states use `border-primary` + `bg-accent` + a check icon (not color alone). Hover is a border/background tint, never the only affordance.

**Session view** (`?session=<id>`)
- Single readable column, max width about 48rem.
- Summary bar: a muted card row with role, level and type as small badges and "N questions"; **End interview** as an outline button on the right (wraps below the badges on mobile). Quiet by design.
- Progress: "Question {position} of {question_count}" with a segmented or linear progress bar (`role="progressbar"`, value exposed).
- Question card: category badge (technical / behavioral), question text in the display font at a large size (about `text-xl`/`text-2xl`, tight leading, `max-w-prose`). This is the focal point.
- Answer area under the question: visible label "Your answer", textarea about 8 rows, counter, then a footer row with the "Answering isn't available yet" hint on the left and the disabled **Next** on the right. The hint is linked to the button with `aria-describedby`.

**States**
- Skeleton: same structure as the loaded view (summary bar, progress, question card, textarea), `aria-busy`, so nothing jumps when data arrives.
- Start pending: fieldset disabled, button shows a spinner and "Preparing your questions…".
- Error (session load): `role="alert"` card with icon, plain message and a **Try again** button.
- Not found: centered card with icon, "Interview not found" and a single **Start a new interview** button.
- Ended: replaces the interview screen; same column width; picks summary, "Abandoned" badge, a muted placeholder card for early feedback, and one primary **Start a new interview** button. The dialog is a centered `Dialog` with the destructive action visually distinct from Cancel.
- Validation: on blur and on submit, message under the field linked with `aria-describedby`, focus moves to the first invalid field on a failed submit. No error summary (only five fields).

**Responsive, a11y, motion**
- Mobile first; the 16px gutters come from `.main-container`. Check 360px, 768px and a desktop width with the sidebar open.
- Targets at least 44px high (segmented items `h-11`, cards at least 64px, slider thumb with an enlarged hit area).
- Keyboard: arrow keys in radio groups, arrows and Home/End on the slider, visible `ring` focus on every control.
- Motion: 150ms color/border transitions and the spinner only; respect `prefers-reduced-motion`; nothing animates layout.
- Icons come from `lucide-react` (already installed); confirm each icon name exists in the installed version before using it. No emoji icons.
- Dark theme: tokens only, so it follows the existing `.dark` theme; verify contrast of the selected card, badges and the disabled button.

## Affected Files & Patterns
New:
- `src/modules/interviews/{constants.ts, schemas/, types/, services/, queries/, utils/, components/}`
- `src/app/(app)/interviews/_components/InterviewsContainer.tsx`
- `src/shared/forms/RadioGroupField.tsx`, `src/shared/forms/SliderField.tsx`
- `src/components/ui/radio-group.tsx`, `src/components/ui/slider.tsx` (CLI-generated)
- `tests/modules/interviews/{schemas,utils,services}/...test.ts`

Changed:
- `src/app/(app)/interviews/page.tsx` — reads `searchParams`, renders the container.
- `src/shared/forms/TextAreaField.tsx` — label association and optional `className`.

Patterns to follow: `AuthService` (class service + zod parse), `authKeys` (key factory), `auth.queries.ts` (hooks), `AuthForm`/`AuthFormContainer` (dumb form + container returning field errors), `parseApiError` (error normalization), `useMutationCallbacks` (toasts), `getQueryClient()` (no retry on 4xx).

Risks:
- Starting an interview abandons any in-progress one (backend behavior, no resume yet). Documented in the spec; no UI change.
- The 409 body has no `details.field`; mapping it to `question_count` is a frontend assumption (spec EC1). If the backend later adds other 409 causes, the message could land on the wrong field.
- `TextAreaField` change affects existing callers; none exist yet beyond this feature, but check with a search before editing.
- Next 16 `searchParams` inside `Suspense` can behave differently from older versions; verify in Step 8.

## Testing Strategy
- Framework & command: Vitest, node environment, `tests/**/*.test.ts`. Run `npm test` (single file: `npx vitest run tests/modules/interviews/...`). No component tests (confirmed: current setup has no jsdom).
- Confirmed seams (user-approved): zod schemas via `safeParse`; the three pure utils by their exports; `interviewsService.start/get` with `API` mocked.
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 2, 6 | first / after | defaults valid in schema test; form defaults checked manually |
| AC2 | 3, 4 | first | payload builder + service request body |
| AC3 | 4, 8 | first / after | seeding in mutation `onSuccess` and no extra GET checked in the network tab |
| AC4 | 7 | after | manual |
| AC5 | 7 | after | manual: typing works, Next disabled, no network request |
| AC6 | 3, 4, 8 | first / after | param parser + service get; reload checked manually |
| AC7 | 6 | after | manual: fields disabled, label text, single request on double-click |
| AC8 | 3, 6 | first / after | error mapper; message visible under the slider checked manually |
| AC9 | 3, 6 | first / after | error mapper; manual with a forced 422 |
| AC10 | 2, 6 | first / after | schema slices; messages visible checked manually |
| AC11 | 3, 7, 8 | first / after | param parser; not-found state manual |
| AC12 | 7, 8 | after | manual: dialog cancel keeps the typed answer, confirm shows the ended screen, no request |
| AC13 | 7, 8 | after | manual: skeleton, error plus retry, no raw error text |
| AC14 | 2, 3, 4, 9 | first | all unit tests, typecheck, lint, build |
| AC15 | 6, 7, 9 | after | manual at 360px, 768px, desktop with sidebar |
| AC16 | 5, 6, 7, 9 | after | manual keyboard-only pass; selected card visible without color |
| AC17 | 7, 9 | after | manual: progress value, skeleton layout match, 44px targets, dark theme |
| AC18 | 7 | after | manual: dialog labelled, focus trapped, Esc closes, focus returns to the End button |
| EC1 | 3, 8 | first / after | mapper; manual with a combination the bank can't fill |
| EC2 | 3 | first | |
| EC3 | 3, 8 | first / after | |
| EC4 | 3, 8 | first / after | mapper returns null (toast); session error + retry manual |
| EC5 | n/a | n/a | existing auth handling; not touched |
| EC6, EC7, EC8 | 2 | first | |
| EC9 | 6 | after | manual double-click |
| EC10 | 8 | after | manual: no `session` param shows the empty form |
| EC11 | 2, 7 | first / after | schema + disabled Next is manual |
| EC12 | 3, 8 | first / after | |
| EC13 | 8 | after | manual: reload after ending shows the interview screen again |
| EC14 | 7 | after | manual: Cancel/Esc/outside click keep the interview and the typed answer |

- Must verify, not assume: the actual 409 body from cuewise-be for "not enough questions" (error code `CONFLICT`, message text); that `searchParams` works inside `Suspense` as expected in this Next 16 build; that radio-group/slider generated for the installed `radix-ui` compile and look right in dark theme; that the BFF forwards `/api/interviews` (catch-all) with the cookie.
- Open questions: none (every EC has a stated outcome).
- Known baseline failures: none seen; run `npm test` first in Step 9 to record the baseline before changes.

Manual checklist for Step 9: start with defaults + chosen role/level; confirm URL, summary and question; reload; bad `?session=abc` and a random valid UUID; try count/type combos until a 409; clear role; paste 2001 chars; double-click Start; type in the answer box and confirm no requests; toggle dark mode and a narrow viewport.

## Blockers & Resolutions
- No blockers.
- Backend has no answer/next/feedback endpoints -> out of scope; answer form is intentionally inert.
- Backend has no end-interview endpoint or feedback -> End interview is a UI shell (dialog plus ended screen in client state); wiring it to set `abandoned` and return feedback is a follow-up needing a backend change.
- No resume endpoint -> EC10 handled by always showing the empty form.
- Components untestable with current vitest -> logic extracted into pure utils/schemas that are testable; UI verified manually.

## Trade-offs & Rationale
- **Derived phase from the URL** over a store flag -> survives reload/share (AC6, EC12) and keeps server data out of zustand per the project rules.
- **Ended state in component state** (not URL, cache or zustand) -> it is not server data and the backend can't record it yet; a reload returns to the interview screen (EC13). When an end endpoint exists this becomes a mutation plus the session `status` from the cache.
- **Seed the cache from the POST response** instead of redirecting and refetching -> satisfies AC3 and avoids a flash of loading state.
- **One container** that owns hooks and routing, everything else dumb -> matches the `AuthFormContainer` pattern and the "components never fetch" rule.
- **Slider and segmented radios** (user's choice) over the cheaper dropdowns -> two new shadcn primitives and two shared fields, in exchange for a clearer UX. Kept to one `RadioGroupField` with a `variant` prop instead of two components.
- **No component-test tooling** (user-confirmed) -> fewer dev dependencies; AC5/AC7/AC12 stay manual.
- **No new Route Handler** -> the catch-all forwarder already covers `/api/interviews` and `/api/interviews/{id}`.
- **Class service** like `AuthService` rather than loose functions -> matches the surrounding code.

## Project Rules Applied
- `cuewise-fe/CLAUDE.md` Architecture / Layer rules -> service -> query -> component, container owns hooks, components never import services or build keys.
- Components / Forms -> `react-hook-form` + `zodResolver`, shared fields only, `FieldSet` disabled while pending, backend 422/409 mapped via `setError`, other errors toasted through `useMutationCallbacks`.
- Data Fetching -> keys from the factory, `getQueryClient()` defaults, no zustand for server data.
- Security & Auth -> browser only calls `/api/*`; `session` param validated as UUID before any request; question text and job description rendered as plain text (no `dangerouslySetInnerHTML`); only the five config fields sent.
- shadcn rule -> primitives via CLI, generated files untouched.
- Testing -> tests under `tests/` mirroring `src/`, `@/` and `@tests/` aliases.
- Git rules -> no commit, push or staging; leave changes in the working tree.
- `AGENTS.md` -> read the Next 16 docs before touching `searchParams`.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| graphify | one query in `/feature` for existing structure, `api.helper`, forms and the interviews page; reused here |
| lean-ctx | read the auth service/queries/keys/schemas/types, form components, axios and query clients, forwarder, vitest config |
| grill-me (via AskUserQuestion) | confirmed slider, segmented radios, and the test seams |
| ponytail | applied as judgement: no new Route Handler, no store, one radio component with a variant, one container |
| security-review | applied as judgement (untrusted text, UUID validation, minimal payload); the full skill was not run, as this has no new auth surface |
| ui-ux-pro-max | UX searches (forms, loading/empty/error, layout shift) and the shadcn stack guidance; produced *Layout & UX Design*. Used the existing theme instead of generating a new design system |
| find-skills | searched the skills ecosystem; `web-design-guidelines` (vercel-labs) suggested as a post-implementation audit, not installed |

## Deviations During Implementation
- `build-start-payload` dropped: the form schema's output already is the request body (blank job description dropped, unknown keys stripped); covered by schema tests.
- 409 mapped by status, not code: cuewise-be returns `NOT_ENOUGH_QUESTIONS` (not `CONFLICT`); found by a real request, test updated to the verified shape.
- Also added shadcn `badge` and `progress` (CLI) for the summary badges and the progress bar.
- `components/ui/slider.tsx`: added a generic `thumbProps` pass-through; Radix leaves a single thumb unnamed, so this is an accessibility fix, not styling. Re-adding the slider with the CLI would drop it.
- `shared/forms/SelectField.tsx`: passes `field.ref` and `aria-invalid` to the trigger so "focus first invalid field" reaches the role select.
- Not-found and load-error states share one `InterviewMessageCard` (also used for the early-feedback placeholder) instead of two components.
- Layout: role and level stacked rather than side by side; both screens centered in a 48rem column; the setup title sits in the card header.
- Start stays busy until the interview screen replaces the form (`useTransition` around `router.push`).
- **Layout revised after review (sidebar alignment):** removed `interviews/layout.tsx` (it added `.main-container` padding and `min-h-screen` inside the shell, so content floated away from the sidebar); the page is now left-aligned under a page header and fills the content area (the 72rem cap was removed after review: it left empty space beside the summary on wide screens). Both screens use `InterviewColumns`: main content plus a sticky side panel from `xl` (setup: live *Summary* with Start, submitted via the `form` attribute; interview and ended screens: `InterviewDetailsCard` with End interview). The summary bar became that details card. Radio option grids use container queries so they fit the column, not the viewport. Supersedes the centered 42rem/48rem column described in *Layout & UX Design*.
- **Setup form split into section cards (user review, ui-ux-pro-max "Bento grid" guidance, kept to the existing tokens):** `SetupSectionCard` per category (icon, title, description, optional badge) in a container-query grid: *Role & level* + *Length* in one row, *Interview style* and *Job description* full width; single column under a 42rem form area.

## Ready to Implement
- All spec requirements mapped to steps
- Every step has a Test tag; every AC# and EC# is mapped in Testing Strategy
- Affected files identified
- Blockers resolved, edge cases handled
- Trade-offs documented with rationale
- No deviations from spec. Two additions the spec didn't spell out: two new shared fields and a small `TextAreaField` accessibility fix.
