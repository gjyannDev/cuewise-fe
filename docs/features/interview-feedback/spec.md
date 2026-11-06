# Feature: Interview Feedback Screen (frontend)

## Problem
cuewise-be can now score a completed interview (`POST` and `GET /api/v1/interviews/{id}/feedback`: a 1 to 5 score per criterion for each main question, verified quotes as evidence, an overall score, strengths, improvements, next steps and a note per question). The web app shows none of it: the "Interview complete" card only offers "Start a new interview", and the History table's **View** button does nothing. A candidate who finishes an interview learns nothing about how they did. There is also a hard blocker: generation is synchronous (up to 60 s), but the `/api` forwarder and the browser both give up after 15 s, so a slow generation would look like a failure even though the backend finishes and stores the result.

## Goal
A candidate who finishes an interview clicks **Get feedback** on the closing card and lands on a feedback page that shows their result. They can reopen the same page later from History. Measured by:
- on a completed interview, one click on the closing card ends on `/interviews/<id>/feedback` with the generated feedback, with no second click;
- the page shows the overall score, summary, strengths, improvements, next steps and, per main question, its criterion scores, note and quoted evidence, in the six states listed under UX Requirements;
- a generation that takes 30 s or more (above the old 15 s limit) still ends with the feedback on screen, and a request that gets no response is recovered from the stored result instead of shown as a failure;
- no request to generate is made unless the user asked for it (the closing card, or a button on the page).

## Project Conventions
- Rule files consulted: `cuewise-fe/CLAUDE.md` (+ `AGENTS.md`); there is no `.claude/` directory. Orientation: graphify query, plus reads of `src/modules/interviews/`, `src/app/(app)/interviews/`, `src/app/api/[...path]/route.ts`, `src/lib/config/{axios.client,api.helper,bff.server}.ts`, `src/lib/api/api.client.ts`, `next.config.ts`, the sidebar config, and the specs of `interview-history`, `interviews-answer-flow` and `interviews-chat-layout`. The backend contract comes from `cuewise-be/docs/features/interview-feedback/spec.md` and its feedback modules.
- Constraints those rules impose on this feature:
  - Data flow **service -> query (hook) -> component**. HTTP only in `interviews.services.ts`, through `apiClient`, responses parsed with zod; hooks in `interviews.queries.ts`; keys from `interviews.keys.ts` (a new feedback key under the interview's key); components never import services or build keys. Features don't import each other's internals.
  - Feature code lives in `src/modules/interviews/` (schemas, types, constants, utils, queries, components). The route file `src/app/(app)/interviews/[id]/feedback/page.tsx` stays thin; the container that calls the hooks sits in that route's `_components/`, like `InterviewsContainer`.
  - Components are dumb (data and callbacks by props), one per file, `PascalCase.tsx`, named export, props typed `type <Name>Props`. Non-component files `kebab-case`. Tailwind with theme tokens and `cn()`; no hardcoded colours.
  - Loading, empty and error states for the data-driven UI. Errors normalised with `api.helper.ts` (`parseApiError`, `isNoResponseError`); never raw error text or stack traces. Mutation toasts through `useMutationCallbacks`.
  - shadcn primitives added with the CLI, never hand-written, and `src/components/ui/*` is not edited. The per-question section needs an **accordion**, which is not installed: add it with `npx shadcn@latest add accordion` (Radix is already a dependency, so no new package).
  - Next 16 specifics: `params` is async; `cacheComponents` is on, so request-time data (cookies, params) sits behind `Suspense` and the page calls `requireUser()`, like `/interviews` and `/history`. The route-protection proxy already covers signed-in routes (check `src/proxy.ts` matches the new path). Read the relevant guide in `node_modules/next/dist/docs/` before writing route code.
  - Validate all external data with zod: the feedback response and the `[id]` route param (a non-UUID shows "not found" and makes no request).
  - Security: AI output (summary, notes, quotes, reasons) is untrusted text, rendered as plain text, never `dangerouslySetInnerHTML`. No answers, quotes or feedback text in logs or the console. The browser only calls `/api/*` on Next.js.
  - Tests in root `tests/`, mirroring `src/` (Vitest): schema, pure utils, the service, the forwarder's timeout table (`tests/app/api/[...path]/route.test.ts`). Test helpers in `tests/helpers/`.
  - Run typecheck, lint, tests and `npm run build` (new route), then `graphify update .`. Do not commit, push or stage.
- Decided with the user (this conversation):
  - **Early-ended interviews get no feedback.** "End interview" is client-only today (the backend session stays `in_progress`, or becomes `abandoned` when another interview starts), and the backend never scores those. The ended card is unchanged.
  - **Route:** `/interviews/[id]/feedback`.
  - **First question open, the rest collapsed** (accordion).
  - **Explicit trigger:** generation starts only on a user action. The closing card's **Get feedback** navigates to the page and generation starts on arrival, because the user just asked for it. Opening the page any other way (History, a link, a refresh) with no stored feedback shows a **Get feedback** button.
  - **History:** **View** on a completed row opens the feedback page. **View** on an abandoned row stays a button that does nothing, as today.
  - **Leaving while generating** is allowed with no warning dialog; the generating state tells the user the feedback keeps generating and will be under History > View.
  - **Plain numbers plus a short disclaimer:** "x.x / 5" and "n / 5", a neutral bar, no verdict words and no red/green. One line: "Scores are an AI estimate to help you practise, not an official grade." (The backend's eval log shows its scores are not calibrated yet.)

## User Flow
1. The candidate answers the last question. The chat shows the "Interview complete" card with **Get feedback** (primary) and **Start a new interview** (secondary).
2. They click **Get feedback**. The URL becomes `/interviews/<id>/feedback` and the page shows the generating state: a skeleton, a calm message, and the line that they can leave and find the feedback under History.
3. A few seconds later (up to about a minute) the result replaces it. Focus moves to the page heading and a screen reader announces that the feedback is ready.
4. They read the overall score and summary, the strengths, improvements and next steps, then open questions in the accordion (the first one is already open) to see each criterion's score, the note, and the quote from their answer with its reason.
5. They choose **Start a new interview** or **Back to history**.
6. Later, from History, they click **View** on the completed row and land on the same page; the stored result shows at once, with no new generation.
7. If the interview has no feedback yet when they open the page directly, they see a short explanation and a **Get feedback** button.

## Requirements

### Functional

**Entry points**
- The closing card's `completed` variant gains **Get feedback**, a link to `/interviews/<id>/feedback` that also tells the page to generate on arrival. **Start a new interview** stays as the secondary action. The `ended` variant is unchanged.
- The History row action for a **completed** interview becomes a link to `/interviews/<id>/feedback` (its accessible name says which interview and that it opens the feedback, e.g. "View feedback for Backend interview started <date>"). In progress keeps **Continue**; abandoned keeps the do-nothing **View**.
- Reloading the page after arriving from the card never starts a second generation: it shows the stored result (or, if the first request is still running, the generating state).

**Feedback page** (`/interviews/[id]/feedback`, signed-in users only)
- On load it reads the stored feedback (`GET`). It generates (`POST`) only when the user asked: arrival from the card, or a click on **Get feedback**.
- The stored feedback has one of these shapes, all of which the page must show correctly:
  - **Generated with scores:** overall `x.x / 5` (one decimal), a one-line scale hint ("out of 5"), the disclaimer line, the summary, strengths, improvements and next steps (each a plain list), the per-question section, then **Start a new interview** and **Back to history**.
  - **Generated, not enough evidence** (`enough_evidence` false): no scores, the backend's message, and **Start a new interview**.
  - **Generating:** see states below.
  - **Failed:** see states below.
  - **None yet:** see states below.
- **Per-question section:** one accordion item per main question, in interview order, the first open and the others collapsed. A header shows "Question N", the category (Technical or Behavioral) and the question text. An open item shows each criterion of that question's category with its label and `n / 5`, the question's note (omitted when absent), and the evidence items: the quote exactly as stored, set apart as a quote, with the criterion it supports and the reason. The criteria shown are exactly those the response gives for that question; labels come from a frontend map that mirrors cuewise-be's (Structure, Specific detail, Your own role, Outcome; Correctness, Depth, Trade-offs, Clarity).
- Scores are shown as the number with a neutral bar on a 1 to 5 scale. No colour carries meaning on its own; the number is always present.
- The page never shows token usage, model, prompt versions or whether the text came from the model or the template (the backend does not send them; the page does not guess).

**Requests and recovery**
- `POST .../feedback` waits up to the backend's 60 s generation budget. Its timeouts are set per request: the `/api` forwarder about **70 s** and the browser about **75 s** (the forwarder shorter, so a slow request ends with the forwarder's clean 503 and not a browser abort; both starting values, kept in one constants file next to the other timeouts, with a comment tying them to the backend budget). Every other route keeps its current timeout.
- **No response** to the POST (browser timeout, network drop, or the forwarder's 503 `SERVICE_UNAVAILABLE`): the backend may still have finished, so the page reads the stored feedback (`GET`):
  - `generated` -> show it;
  - `generating` -> keep the generating state and check again every few seconds;
  - none stored (feedback-not-found) -> show the failed state with **Try again**.
- **A refresh, or opening the page while another request is generating** (stored status `generating`, or POST returns 409 `FEEDBACK_IN_PROGRESS`): show the generating state and check the stored feedback again every few seconds until it is `generated` or `failed`. If it is still `generating` after about 90 s (the backend's budget plus its takeover margin), show "taking longer than expected" with **Try again**, which sends a new POST (the backend takes a stale row over).
- A stored result is cached for the session, so returning to the page does not refetch needlessly; a freshly generated result is written into the cache so History > View shows it with no extra request.
- Only one POST can be in flight per page: **Get feedback** and **Try again** are disabled while a request runs.

**Validation**
- The response is parsed with zod against the backend contract (`id`, `interview_id`, `status`, `enough_evidence`, `overall`, `summary`, `strengths`, `improvements`, `next_steps`, `questions[]` with `main_number`, `category`, `question`, `scores`, `note`, `evidence[]`, `rubric_version`, `created_at`). Criterion ids and categories are strict enums that mirror the backend, so an unknown value makes the whole response invalid and shows the generic error state (never a half-rendered page).

### Non-Functional
- **Performance:** the first paint is the skeleton; no layout jump when the result arrives (the skeleton matches the result's blocks). No polling outside the generating state, and polling stops on unmount.
- **Accessibility:** semantic headings (one `h1`-level page heading, then sections); the accordion is keyboard-operable with visible focus; the generating-to-result change is announced (`aria-live`); failure cards use `role="alert"`; every control has an accessible name; the score bar has a text equivalent ("4 out of 5").
- **Security/privacy:** see Project Conventions. The page and its tests contain no real user data.

## UX Requirements
- **Six states** and their content (all use the existing message-card look where a card fits):
  - **Generating:** skeleton of the result's layout; message "Reading your answers…" (neutral, never hints at quality); the line "You can leave this page. Your feedback will keep generating and will be under History > View." If it takes more than about 15 s, the message changes to "Still working on it…".
  - **Generated:** as described above.
  - **Not enough answers:** info card, the backend message, **Start a new interview**.
  - **Failed (502 `FEEDBACK_FAILED`, stored `failed`, or recovery found nothing):** alert "We couldn't generate your feedback" with **Try again**.
  - **Unavailable (503 `FEEDBACK_UNAVAILABLE`, feedback turned off):** "Feedback isn't available right now. Try again later." with **Try again** and a link back to History.
  - **None yet (opened without having asked):** short explanation and **Get feedback**.
- **Rate limited (429):** a toast "Too many requests. Wait a moment and try again." The page stays in its previous state and the button works again; no automatic retry.
- **Interview not completed (409 `INTERVIEW_NOT_COMPLETED`):** card "This interview isn't finished yet" with a link **Continue interview** to `/interviews?session=<id>`.
- **Not found (404 on the interview, a malformed id, or not the caller's):** the same "Interview not found" card the interview screen uses, with **Start a new interview**.
- **Layout:** one column on mobile (360 px) with a 16 px gutter; from tablet up, strengths and improvements sit side by side. The questions section is the full width. Touch targets are at least 44 px (`h-11`), like the rest of the interview screens.
- **Wording** follows the existing tone (second person, plain). All text slots (summary, notes, quotes, reasons, list items) are rendered as plain strings.
- Dark mode works through the existing tokens.

## Constraints
- cuewise-be is the authority: the page shows what the backend stored and does not recompute, round or reinterpret scores.
- No new dependency (accordion via the shadcn CLI, Radix already installed). No streaming, no background job, no extra backend endpoint.
- English only. Evergreen browsers (as the rest of the app).
- The `/api` catch-all forwarder only passes `Content-Type` back, so a 429's `Retry-After` header does not reach the browser; the generic toast above is enough.
- The deployment platform's function-duration limit (if any) must allow about 70 s for the forwarder; this is checked before release, not in this spec.

## Blockers
None that stop the spec. To verify during planning or implementation:
- **(assumption — verify)** cuewise-be keeps generating and stores the result when the client disconnects (its own spec lists this as unverified, EC15). The "you can leave" line depends on it; test it by hand (start generation, close the tab, then GET) before shipping that line.
- **(assumption — verify)** the backend's 404 for "not your interview / unknown id" and its 404 `FEEDBACK_NOT_FOUND` have different `error.code` values, so the page can tell "not found" from "no feedback yet".
- **(assumption — verify)** the `user` role holds the `interviews:feedback` permission (backend spec says yes). A 403 shows the failed/generic error state.
- **(assumption — verify)** the hosting platform's maximum duration for a route handler is at least about 75 s (see Constraints).
- Backend quality, not blocking this UI: the eval log's open items (score spread across repeats, senior-versus-junior calibration, rubric review). The disclaimer line exists because of them.

## Edge Cases
Format: condition -> expected outcome.

- **EC1:** Opens `/interviews/<id>/feedback` with a malformed id -> "Interview not found" card, no request.
- **EC2:** The interview doesn't exist or isn't the caller's (404) -> "Interview not found" card; nothing about the interview is revealed.
- **EC3:** The interview is still in progress (typically a typed URL: the page shows "None yet", and the POST on **Get feedback** returns 409 `INTERVIEW_NOT_COMPLETED`) -> "This interview isn't finished yet" with a link to continue it; no generating state.
- **EC4:** Opens the page for a completed interview with no feedback, from History or a link -> "None yet" state with **Get feedback**; nothing generated until the click.
- **EC5:** Arrives from the closing card with no stored feedback -> the generating state starts at once, one POST is sent.
- **EC6:** Reloads while the first request is still generating -> generating state, no second POST; the page checks the stored feedback until it is generated.
- **EC7:** Reloads after the feedback was generated -> stored result shown, no POST.
- **EC8:** Double-clicks **Get feedback** or **Try again** -> one request only (button disabled while pending).
- **EC9:** Generation takes 20 to 60 s -> neither the forwarder nor the browser aborts; the result shows; "Still working on it…" appears after about 15 s.
- **EC10:** The POST gets no response, but the backend finished -> the page reads the stored result and shows it; no error is shown.
- **EC11:** The POST gets no response and nothing was stored -> failed state with **Try again**.
- **EC12:** POST returns 409 `FEEDBACK_IN_PROGRESS` (retry while a request still runs) -> generating state with checks, not an error.
- **EC13:** The row stays `generating` for more than about 90 s -> "taking longer than expected" with **Try again**; the retry sends a new POST.
- **EC14:** 502 `FEEDBACK_FAILED` -> failed state with **Try again** (a POST again); no partial scores shown.
- **EC15:** 503 `FEEDBACK_UNAVAILABLE` -> unavailable state; a stored feedback, if any, is still shown (the backend answers 200 for it).
- **EC16:** 429 -> toast; the previous state stays and the button is usable again.
- **EC17:** 401 (session ended) -> the existing expired-session redirect, not a feedback-specific error.
- **EC18:** 403 (no permission) -> generic error state, no raw text.
- **EC19:** `enough_evidence` false -> "Not enough answers" card with the backend's message, no scores or overall.
- **EC20:** A response that fails zod validation (including an unknown criterion or category) -> generic error state with **Try again**; no partial render; no response text in the console.
- **EC21:** A question has no `note` -> its item shows scores and evidence without a note, no empty heading.
- **EC22:** A criterion has no evidence item -> its score shows without a quote; no placeholder text.
- **EC23:** A mixed interview (technical and behavioral questions) -> each question shows its own category's criteria and labels.
- **EC24:** The maximum interview (10 main questions) -> the accordion keeps the page short; only the first item is open; all are keyboard reachable.
- **EC25:** A quote, note or summary contains HTML or markdown characters -> shown as literal text.
- **EC26:** Leaves the page while generating, then opens History > View -> the stored result (or the generating state, if still running) shows. (assumption — verify)
- **EC27:** The user navigates to the feedback of another interview -> the page resets (no stale content from the previous id).
- **EC28:** Opens History > View on an abandoned row -> nothing happens (unchanged). On an in-progress row **Continue** is unchanged.
- **EC29:** "End interview" was clicked on screen -> the ended card shows without **Get feedback**; that interview has no feedback route (the backend session isn't completed, so it can't be scored).
- **EC30:** Narrow viewport (360 px) -> one column, no horizontal page scroll, quotes wrap.

## Acceptance Criteria
Specific, testable criteria with an observable outcome:

- [ ] **AC1:** On a completed interview the closing card shows **Get feedback** (primary) and **Start a new interview**; the ended card shows no **Get feedback** (EC29).
- [ ] **AC2:** Clicking **Get feedback** goes to `/interviews/<id>/feedback`; with no stored feedback it starts exactly one generation without a second click, and with stored feedback it shows the result and sends no POST (EC5, EC7).
- [ ] **AC3:** Opening the page with no stored feedback by any other route shows the "None yet" state and sends no POST until **Get feedback** is clicked; a reload after arriving from the card never starts a second generation (EC4, EC6).
- [ ] **AC4:** A generated result shows the overall as `x.x / 5`, the disclaimer line, the summary, and the strengths, improvements and next steps as lists; every text slot is rendered as plain text (EC25).
- [ ] **AC5:** The questions section has one accordion item per main question in order, the first open and the rest closed; an open item shows exactly that question's criteria with `n / 5`, its note when present, and each evidence quote with its criterion and reason; mixed interviews show each question's own criteria and labels (EC21, EC22, EC23, EC24).
- [ ] **AC6:** The feedback request's timeouts are about 70 s (forwarder) and 75 s (browser) for `POST interviews/<id>/feedback` only; all other routes keep their current timeouts; a forwarder test covers the new entry and one unchanged route.
- [ ] **AC7:** A POST that gets no response is followed by a read of the stored feedback; a generated result is shown, a generating row keeps the generating state with periodic checks, and nothing stored shows the failed state (EC10, EC11, EC12).
- [ ] **AC8:** The generating state shows the skeleton, the reassurance line about leaving, and "Still working on it…" after about 15 s; a row still generating after about 90 s shows "taking longer than expected" with **Try again** (EC9, EC13).
- [ ] **AC9:** 502 and a stored `failed` row show the failed state with **Try again**; 503 shows the unavailable state; 409 not completed shows the continue link; 404 or a malformed id shows "Interview not found" with no request for the malformed id; 429 shows a toast and leaves the page usable; 401 uses the existing session redirect (EC1, EC2, EC3, EC14, EC15, EC16, EC17, EC18).
- [ ] **AC10:** `enough_evidence` false shows the backend message, no scores, and **Start a new interview** (EC19).
- [ ] **AC11:** A response that fails the zod contract shows the generic error state with **Try again**, no partial page, and nothing logged (EC20).
- [ ] **AC12:** History **View** on a completed row links to the feedback page with an accessible name that includes the role, start time and "feedback"; in-progress **Continue** and the abandoned do-nothing **View** are unchanged (EC28).
- [ ] **AC13:** **Get feedback** and **Try again** are disabled while a request is in flight, so a double click sends one request; opening another interview's feedback shows none of the previous content (EC8, EC27).
- [ ] **AC14:** The page works at 360 px width with no horizontal scroll, the accordion and buttons are keyboard-operable with visible focus, the generated result is announced to screen readers, and failure cards use `role="alert"` (EC30).
- [ ] **AC15:** Unit tests cover the response schema (valid, `enough_evidence` false, `generating`/`failed` rows, unknown criterion), the pure helpers (state selection from the stored status and error, criterion label map, score-to-bar value), the service paths, and the forwarder timeout table; `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build` pass; `graphify update .` is run; nothing is committed.

## Out of Scope
- Feedback for early-ended interviews: needs a backend end/complete endpoint (decided: none for now).
- Any change in cuewise-be (new endpoints, scoring changes, calibration, rubric review) and showing token usage, model or prompt versions.
- A "view the whole interview" / transcript page, and showing the overall score in the History table or on the dashboard (the History spec deferred scores).
- Trends and progress across interviews (the sidebar's Progress item), comparing interviews, sharing, exporting or printing feedback.
- Regenerating a successful feedback, or per-question regeneration (the backend forbids it).
- Streaming the feedback text (the backend returns it whole).
- Qualitative labels, grade bands or colour-coded scores (deferred until the backend scores are calibrated).
- Automatic generation without a user action, and leave-page warnings.
- Languages other than English.
