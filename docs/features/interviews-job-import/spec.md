# Feature: Job description import (link and smart paste)

## Problem
The setup form's "Job description" card has one textarea (2000 characters, counter, optional). To tailor an interview to a real job, the candidate copies the posting text by hand. Postings live on web pages, and a whole copied page is usually far over 2000 characters and full of menus, footers and "similar jobs", so the candidate has to trim it by hand.

cuewise-be now offers two helpers (Slice 8b, `../cuewise-be/docs/features/job-url/spec.md`):
- `POST /api/v1/interviews/job-url` `{url}`: fetches a posting safely and returns `{text, truncated}`.
- `POST /api/v1/interviews/job-text` `{content, format: "html" | "text"}`: cleans a whole page the candidate copied from their own browser (the fallback for sites such as JobStreet that refuse server fetches) and returns `{text, truncated}`.

Neither is used by the frontend yet.

## Goal
The candidate can fill the job description in three ways, all ending in the same editable textarea:
1. type or paste a short description, exactly as today;
2. paste a posting link and press Import;
3. paste a whole posting page and get it cleaned automatically.

The textarea stays the single source of truth: whatever it holds when they press Start is what `POST /interviews` receives as `job_description`, unchanged. Imported text is always shown for review before it is used.

Measurable: a supported posting link fills the textarea in one click. A whole-page paste of a posting fills it with the posting only (no site menus), within the 2000-character cap. Every failure ends with a clear message and a usable form.

## Decisions
- **Keep the textarea; add two ways to fill it.** No backend change. `POST /interviews` and its body are unchanged.
- **Overwrite with Undo:** an import (link or cleaned paste) replaces the textarea's content. When the field had text, a toast offers Undo, which restores the previous text. (User decision.)
- **Smart paste rule:** only a paste whose own text is over 2000 characters is intercepted and sent for cleaning. Smaller pastes behave exactly as today. (User decision.)
- **Lock while busy:** while an import runs, the URL input, its button, the textarea and the Start button are disabled, and the control that started it shows a spinner. (User decision.)
- **Reusable field:** the URL input and Import button are built as a generic, feature-agnostic shared form field: a labelled text input with a trailing action button, a pending state, an inline error and a description slot. It knows nothing about jobs. (User decision.)
- **HTML first:** a big paste sends the clipboard's HTML copy when the browser provides one, else the plain text. HTML keeps the structure that lets cuewise-be drop menus and footers.

## Project Conventions
- Rule files consulted: `CLAUDE.md` and `AGENTS.md` (FE root), `../cuewise-be/CLAUDE.md`, the cuewise-be job-url spec, `docs/features/interviews-setup-ui/` and `docs/features/voice-answers/spec.md` (this repo).
- Constraints those rules impose:
  - Data flow service -> query -> component. Services are the only HTTP code, always through `apiClient`, and every response is parsed with zod. Queries own toasts and side effects through `useMutationCallbacks`. Components never import services or `apiClient`, and stay presentational. Stateful logic goes in a feature hook, pure logic in `utils/<area>.utils.ts`.
  - Feature-agnostic UI goes in `src/shared/` (here `src/shared/forms/`), next to `TextField` and `TextAreaField`. shadcn primitives are added with the CLI, never hand-written or edited for one-off styling.
  - Error codes and limits mirror cuewise-be in `modules/interviews/constants.ts`, with "keep in step" comments.
  - The browser calls only `/api/*` on Next.js. The catch-all forwarder already forwards `interviews/job-url` and `interviews/job-text` with the cookie token. Both routes finish within the default 15 s forwarder timeout (cuewise-be caps the fetch at 8 s).
  - Imported text is untrusted. It is put in the textarea as plain text, never rendered as HTML. The URL and pasted content are never logged.
  - Vitest is node-only (no DOM): the paste decision and error mapping are pure, unit-tested functions. Tests mirror `src/` under `tests/`.
  - No new dependency. Nothing is committed. After code changes: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, `graphify update .`.

## User Flow
1. The candidate opens the setup screen. The "Job description" card shows a "Posting link" field with an Import button above the existing textarea.
2. **Link:** they paste a link and press Import (or Enter).
   - The card and Start lock, and the button shows a spinner.
   - On success the textarea is filled and focused, and a note appears when the text was shortened.
   - On failure the reason shows under the link field, and focus moves to the textarea so they can paste instead.
3. **Whole page:** on a site that refuses links, they open the posting, select all, copy, and paste into the textarea.
   - The paste is over 2000 characters, so it is intercepted instead of inserted. The card locks and the textarea shows a busy state.
   - The cleaned posting replaces the content.
4. **Short paste or typing:** works exactly as today.
5. When an import replaced existing text, a toast offers Undo.
6. They review and edit the text, then press Start as before.

## Requirements

### Functional
- **Reusable field** (`src/shared/forms/`):
  - A labelled text input with a trailing action button.
  - Props for the label, placeholder, input type, the action's label, a pending flag (spinner on the button, input and button disabled), disabled, an inline error, a description, and an action callback that receives the current value.
  - Enter in the input triggers the action.
  - It works with react-hook-form the same way the other shared fields do.
- **Link import:**
  - The link is validated on the client first: required when Import is pressed, `http` or `https`, at most 2048 characters. An invalid link shows an inline message and no request is sent.
  - A valid link calls `POST /api/interviews/job-url`. A success replaces the textarea's content with `text` and marks the form field as changed.
  - Success with `truncated: true` shows a note under the textarea: "Shortened to fit. Review and edit." The note clears when the textarea is edited, or when another import doesn't truncate.
  - `JOB_URL_UNREACHABLE` and `JOB_URL_UNREADABLE` show the server's message under the link field and move focus to the textarea.
- **Smart paste:**
  - When a paste into the textarea carries more than 2000 characters of plain text, the default paste is cancelled.
  - Its HTML copy (else the plain text) goes to `POST /api/interviews/job-text` with the matching `format`.
  - Success replaces the textarea's content, with the same truncation note.
  - `JOB_TEXT_UNREADABLE` shows the server's message under the textarea and leaves the content unchanged.
  - A paste of 2000 characters or fewer is not touched.
- **Undo:** when an import replaces non-empty text, a toast "Job description replaced" offers Undo for the toast's lifetime. Undo restores the exact previous text and clears the truncation note.
- **Other failures:**
  - 429 shows a toast with the server's message.
  - Network failures, 5xx and `VALIDATION_ERROR` show a toast with a generic message ("Couldn't import the job description. Try again or paste it.").
  - In every case the field content is unchanged and the form is unlocked.
- **Locking:** while either import is pending, the link field, the textarea and the Start button are disabled. Nothing else on the form changes.
- **Summary panel:** unchanged ("Job description: Added" when the field has text).

### Non-Functional
- No backend change and no new dependency.
- Imported text is plain text in a textarea. Nothing is rendered as HTML, and the HTML clipboard copy is only sent to the server.
- Accessibility:
  - The link field has a visible label, and the button has an accessible name.
  - Errors are linked with `aria-describedby`.
  - The busy state is exposed (`aria-busy`), and the truncation note and errors are announced (`role="status"` / `alert` as the shared fields already do).
  - Everything is keyboard-usable.

## UX Requirements
- **Copy:**
  - Link field label "Posting link", placeholder "https://…", button "Import".
  - Description: "Paste a link to a job posting. If the site doesn't allow it, open the posting, select all, copy, and paste it into the box below."
- **Textarea:** the label stays "Job posting". The placeholder becomes "Paste the job posting here (you can paste the whole page)".
- **Pending:** the spinner sits on the Import button for a link and as a busy indicator on the textarea for a paste. "Start AI Interview" is disabled until the import ends.
- **Errors:** the server's messages are already end-user wording ("We couldn't open that link. Please paste the job description instead."), so they are shown as-is.

## Constraints
- cuewise-be contract (keep in step): `{text: string, truncated: boolean}`; error codes `JOB_URL_UNREACHABLE`, `JOB_URL_UNREADABLE` and `JOB_TEXT_UNREADABLE` (all 422); `RATE_LIMITED` (429); `VALIDATION_ERROR` (422); paste content at most 1,000,000 characters; URL at most 2048; 10 imports per user per minute across both routes.
- No headless browser and no fetching from the browser to third-party sites. The browser only talks to `/api`.

## Blockers
- To verify at plan time, not assume: that the catch-all forwarder passes a request body of up to about 1 MB unchanged to cuewise-be. The voice-answers spec records that `proxyClientMaxBodySize` only applies to paths `src/proxy.ts` matches, which exclude `/api`, but a 1 MB JSON body through `request.text()` should still be checked against the Next 16 docs.
- To verify manually after the build: what real browsers put in the clipboard's HTML copy on a select-all of a JobStreet or LinkedIn page (`text/html` is present in Chromium and Firefox on desktop; Safari behavior is an assumption to verify).

## Edge Cases
- **EC1:** Import pressed with an empty link field -> inline "Enter a link", no request.
- **EC2:** Link without http/https (`jobs.example.com/1`, `ftp://…`), or over 2048 characters -> inline validation message, no request.
- **EC3:** Link import succeeds, `truncated: false` -> textarea replaced, no note.
- **EC4:** Link import succeeds, `truncated: true` -> textarea replaced, note "Shortened to fit. Review and edit." shown.
- **EC5:** `JOB_URL_UNREACHABLE` (blocked site, 403, private address, timeout) -> the server's message under the link field; focus moves to the textarea; content unchanged.
- **EC6:** `JOB_URL_UNREADABLE` (not a posting, JS-only page) -> same as EC5.
- **EC7:** Paste of more than 2000 characters with an HTML copy -> default paste cancelled; HTML sent with `format: "html"`; textarea replaced with the cleaned text.
- **EC8:** Paste of more than 2000 characters with no HTML copy -> plain text sent with `format: "text"`.
- **EC9:** Paste of 2000 characters or fewer (plain-text length) -> default paste, no request, even if the field then goes over 2000 (the counter turns red as today).
- **EC10:** `JOB_TEXT_UNREADABLE` on a big paste -> the server's message under the textarea; content unchanged.
- **EC11:** An import replaces non-empty text -> toast with Undo; Undo restores the exact previous text and clears the note.
- **EC12:** An import fills an empty field -> no Undo toast.
- **EC13:** 429 on either route -> toast with the server's message; content unchanged; form unlocked.
- **EC14:** Network failure, 5xx or `VALIDATION_ERROR` -> generic toast; content unchanged; form unlocked.
- **EC15:** While an import is pending -> link field, textarea and Start are disabled; a second import can't start.
- **EC16:** The candidate edits the textarea after a truncated import -> the note disappears.
- **EC17:** Imported text contains HTML-like or instruction-like text -> shown as literal text in the textarea, never rendered.
- **EC18:** The cleaned text is accepted by the start form as-is (at most 2000 characters, passes `startInterviewFormSchema`).
- **EC19:** Enter pressed in the link field -> same as pressing Import; the setup form is not submitted.

## Acceptance Criteria
- [ ] **AC1:** The reusable input-with-action field lives in `src/shared/forms/`, has no job-specific code, and supports a label, description, error, pending and disabled states, Enter-to-act, and an action callback with the current value.
- [ ] **AC2:** A valid link fills the textarea from `POST /api/interviews/job-url`; `truncated: true` shows the note. (EC3, EC4, EC18)
- [ ] **AC3:** Invalid links are refused on the client with an inline message and no request. (EC1, EC2, EC19)
- [ ] **AC4:** `JOB_URL_UNREACHABLE` / `JOB_URL_UNREADABLE` show the server message under the link field, focus the textarea and leave the content unchanged. (EC5, EC6)
- [ ] **AC5:** A paste of more than 2000 plain-text characters is intercepted and sent with its HTML copy (or the plain text) and the right `format`; a smaller paste is not intercepted. (EC7, EC8, EC9)
- [ ] **AC6:** `JOB_TEXT_UNREADABLE` shows the server message under the textarea and leaves the content unchanged. (EC10)
- [ ] **AC7:** Replacing non-empty text offers Undo, which restores the exact previous text; filling an empty field doesn't. (EC11, EC12)
- [ ] **AC8:** 429, network, 5xx and validation failures toast and leave the form unchanged and unlocked. (EC13, EC14)
- [ ] **AC9:** While an import is pending, the link field, textarea and Start are disabled. (EC15)
- [ ] **AC10:** The truncation note clears on edit. Imported text is rendered as plain text only. (EC16, EC17)
- [ ] **AC11:** Layer rules hold: services use `apiClient` with zod-parsed responses, queries wrap them, components import neither. The paste decision and error mapping are pure functions with unit tests. `tsc`, lint, tests and build pass.
- [ ] **AC12:** `POST /interviews` and the start flow are unchanged; existing setup tests still pass.

## Out of Scope
- Backend changes: the routes and their rules are cuewise-be Slice 8b.
- A browser extension or bookmarklet ("Send to Cuewise"): a later client project.
- Fetching postings from the browser directly: CORS blocks it, and the BFF pattern says the browser only talks to `/api`.
- Showing which site or reason caused a failure beyond the server's message (it is deliberately generic).
- Remembering imported links or text between sessions: nothing is stored.
- A separate preview dialog before filling the textarea: the textarea itself is the review step, and Undo covers mistakes.
