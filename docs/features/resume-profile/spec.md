# Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)

## Problem
A signed-in candidate can't yet use the backend's résumé features from Cuewise. They can't upload a PDF or DOCX résumé, see or delete the profile the backend builds from it, or start an interview that asks questions based on it. They also aren't told that their résumé text goes to an AI provider.

cuewise-be already has the contract (`../cuewise-be/docs/features/resume-upload/spec.md` and `resume-aware-interview/spec.md`):
- `POST /api/v1/profile/resume` (multipart, one `file` part): returns the stored profile.
- `GET /api/v1/profile`: the stored profile, or 404 `PROFILE_NOT_FOUND`.
- `DELETE /api/v1/profile`: 204, also when none exists.
- `POST /api/v1/interviews` accepts `use_profile` (strict boolean, default false). The session response carries `use_profile`. `use_profile: true` with no stored profile is 409 `PROFILE_REQUIRED`.

The frontend uses none of it. Slice 8a has no client surface, and 8b (job link and paste import) is already in the frontend (`docs/features/interviews-job-import/`), so both are out of this spec.

## Goal
A candidate uploads a résumé, sees what the backend understood, can replace or delete it, and can start an interview that uses it, knowing what is sent to the AI provider. A missing résumé sends them to the upload instead of failing.

Measurable:
- A valid résumé upload ends with the parsed profile (skills, roles, projects) on screen.
- A start with the toggle on sends `use_profile: true`; with it off (the default) it sends `false` and behaves exactly as today.
- Every failure (upload or start) ends with a message the candidate can act on and a usable screen.

## Project Conventions
- Rules consulted: `CLAUDE.md` and `AGENTS.md` (the repo has no `.claude/`); the pattern of `docs/features/interviews-job-import/`.
- Constraints:
  - Data flow service → query → component. The new feature is a module `src/modules/profile/` (services, keys, queries, schemas, types, utils, constants, components by area). Services use `apiClient` only, parse with zod. Components never call services or build query keys.
  - Interviews reach the profile through `profile` queries/hooks, never its service or store.
  - Components stay presentational: a container/page calls the hooks. A new component file must pass the "earn its file" test.
  - Forms use react-hook-form + `zodResolver` and the shared field components. The upload is a file input; if no shared field fits, a shared one is added to `src/shared/forms/`.
  - shadcn primitives (dialog, alert, switch/checkbox, …) are added through the CLI, never hand-written.
  - Auth is a BFF: the browser calls `/api/*` only; the catch-all forwarder passes the multipart body as bytes. No token handling in the client.
  - The profile is personal data: never logged, never in localStorage/sessionStorage/zustand; it lives in the Query cache only.
  - Profile text is untrusted text (it came from a résumé via a model): rendered as plain text, never HTML.
  - Tests in `tests/` mirroring `src/`; no commits, pushes or new branch.

## User Flow
1. The candidate opens **Résumé** in the sidebar (`/resume`).
2. With no profile, they see a short explanation, the AI-provider notice and an upload control (PDF or DOCX, up to 2 MB, up to 5 pages).
3. They choose a file. The browser checks type and size, the upload runs behind a busy state, and on success the parsed profile appears.
4. With a profile, the page shows skills, roles (most recent first) and projects, plus **Replace résumé** and **Delete**. Replace uploads straight away. Delete asks for confirmation.
5. On the interview setup form a **Use my résumé** toggle sits next to the other options, with the same provider notice.
   - No profile: the toggle is off and disabled, with a link to `/resume`.
   - Profile present: the candidate can switch it on.
6. Start sends `use_profile` with the other fields. If the backend answers `PROFILE_REQUIRED`, the form explains it, links to `/resume`, refreshes the profile state and keeps the other values.
7. The active interview's title bar shows a small **Résumé-aware** badge when the session's `use_profile` is true.

## Requirements

### Functional
- **Résumé page** at `/resume`, in the user sidebar's Menu section, with loading, empty (no profile), content and error states.
- **Profile read:** `GET /profile`; a 404 means "no résumé yet" (an empty state, not an error). Other errors show an error state with retry.
- **Upload:** `POST /profile/resume` as multipart with one `file` part.
  - Client pre-check, before any request: extension `.pdf` or `.docx`, size at most 2 MB. The server stays the authority (it checks content, pages and unzipped size); every server refusal is shown too.
  - On success the profile query cache is updated from the response.
  - While it runs: the control and the page actions are disabled, and a busy state is shown (extraction can take up to about 20 s).
  - **Replace** reuses the same control and needs no confirmation (a failed upload leaves the old profile in place).
- **Delete:** `DELETE /profile` after a confirmation dialog saying it can't be undone. Success clears the cached profile and returns the page to the empty state.
- **Profile view:** skills, roles (title, organization, period, summary), projects (name, description, technologies), all as plain text; empty lists are omitted without placeholder text.
- **Upload error display:** an inline alert on the page with the backend's message for 413, 415, 422, 502 and 503 (the messages already end with a next step). The existing profile stays visible. A 429 shows a toast with the retry hint. Raw errors are never shown.
- **Setup form:**
  - A "Use my résumé" toggle bound to a `use_profile` boolean in the start schema, default false, sent as a real boolean.
  - The toggle needs the profile state, which the page container reads and passes down.
  - A 409 `PROFILE_REQUIRED` on start: message + link to `/resume`, profile query refreshed so the toggle becomes disabled, other fields kept.
- **Interview view:** the session schema reads `use_profile`; the title bar shows a badge when it is true.
- **Consent copy:** one notice on `/resume` (next to the upload) and one beside the toggle: the résumé text is processed by an AI provider, the file itself is never stored (only the extracted profile), and deleting the profile stops its use in later questions. The wording is final in the plan; it must stay accurate to the backend spec.
- **Timeouts:** résumé upload gets a request budget longer than the default 15 s in the BFF forwarder and in the service call, matching the backend's budget (about 20 s) plus margin.

### Non-Functional
- **Privacy:** profile content is never logged, never stored in browser storage, and never put in a URL. No extra personal data is sent beyond the file and the flag.
- **Security:** profile text rendered as text only; no `dangerouslySetInnerHTML`. Responses are parsed with zod before use. The file is uploaded as chosen, never read or parsed in the browser beyond the name and size check.
- **Performance:** the profile is a single small query shared by `/resume` and the setup form, cached with the shared defaults. No refetch loop.

## UX Requirements
- **Accessibility:** the file input has a label, a visible focus state and keyboard use; the busy state and errors are announced (`role="status"`/`role="alert"`); the delete dialog traps focus (Radix) and returns it; the toggle has a label linked to its description (notice) and a clear disabled reason.
- **Responsive:** the page and the new toggle work from phone width, without horizontal scroll.
- **Messaging:** every failure ends with a next step. The "no résumé" and "résumé deleted" states are plain, not alarming.
- **Copy:** plain, short, no jargon; consent text is visible without hover.

## Constraints
- Next.js 16 (App Router): read `node_modules/next/dist/docs/` before writing routing or Route Handler code. `params`/`searchParams`/`cookies()` are async.
- No new dependency is expected; any addition must be justified.
- The backend is the contract: exact request and response shapes come from its `/openapi.json` before coding (see Blockers).

## Blockers
- **Verify against openapi.json before the plan:** the exact `profile` response shape (the backend schema is skills, roles `{title, organization, period, summary}`, projects `{name, description, technologies}`, `updated_at`), the exact `use_profile` field on the session response, and the exact 409 `PROFILE_REQUIRED` error body and message (assumption — verify).
- **Verify before the plan:** whether the `GET /interviews` list rows carry `use_profile`. This spec only shows the badge in the interview title bar, so it does not block; it only matters if the badge is later added to history.
- **Verify before real users:** Google AI Studio's data terms for résumé text (a backend risk). The consent copy must match the final answer.
- **Verify at plan time:** that a multipart `FormData` upload passes through the catch-all forwarder unchanged (it forwards bytes and `Content-Type`, including the boundary). Axios under `apiClient` must send the `FormData` with the right header.
- **Observation, not in scope:** `job-url` and `job-text` POSTs have no entry in the forwarder's slow-route list, so they get the default 15 s. This is a possible latent issue for slow postings; not changed here unless it affects this slice.

## Edge Cases
- **EC1:** `GET /profile` returns 404 -> the empty state with the upload control; no error alert, no toast.
- **EC2:** `GET /profile` fails with anything else (network, 5xx) -> the page error state with a retry; the setup form's toggle is disabled with "couldn't check your résumé"; the form still works without it.
- **EC3:** Chosen file has the wrong extension or is over 2 MB -> refused in the browser with a field message; no request sent.
- **EC4:** A fake file named `resume.pdf` (really an image or text) -> the browser lets it through (the pre-check is by name and size only); the server decides by content, answers 415 and its message is shown. A real PDF named `resume.txt` is refused in the browser (a known limit; the candidate renames it). (assumption — verify the wording of 415)
- **EC5:** Server refuses with 413 (too large, over 5 pages, unzip bomb) -> inline alert with the backend message; the old profile stays.
- **EC6:** Server refuses with 415 -> inline alert with the backend message; the old profile stays.
- **EC7:** Server refuses with 422 `RESUME_UNREADABLE` (scanned, encrypted, corrupt, too little text, not a résumé) -> inline alert; the old profile stays.
- **EC8:** Server returns 502 `PROFILE_EXTRACTION_FAILED` -> inline alert with "try again" wording; the old profile stays.
- **EC9:** Server returns 503 `PROFILE_UNAVAILABLE` -> inline alert; the old profile stays.
- **EC10:** Server returns 429 -> a toast with the retry hint; the page stays usable.
- **EC11:** Upload exceeds the client request budget -> treated as an unconfirmed result: an error alert and the profile query is refetched, because the backend may have stored it.
- **EC12:** Upload while a profile exists -> the old profile stays visible until the new one replaces it in one step; no flicker to the empty state.
- **EC13:** Delete while a profile exists -> confirm, delete (204), cached profile cleared, empty state shown.
- **EC14:** Delete when the profile is already gone (another tab) -> 204 anyway; the same end state as EC13.
- **EC15:** The setup form with a profile and the toggle on, then start succeeds -> `use_profile: true` is sent; the session shows the badge in the interview title bar.
- **EC16:** The toggle left off -> `use_profile: false` is sent; nothing about the résumé shows anywhere.
- **EC17:** The toggle is on, then the profile is deleted elsewhere, then start -> 409 `PROFILE_REQUIRED`: message and link to `/resume`, profile query refreshed, toggle becomes disabled and off, other form values are kept; no session created.
- **EC18:** The résumé is deleted or replaced during an active interview -> the interview carries on unchanged; the badge stays as the session said it (the backend simply stops or changes the use of the profile). No frontend block.
- **EC19:** The session expires during upload or delete (401 with a session code) -> the existing session-expired redirect applies, as for any call.
- **EC20:** Unauthenticated user opens `/resume` -> the existing route protection (`proxy.ts`, `requireUser()`) sends them to sign in, like `/interviews`.
- **EC21:** The profile has only skills, or only roles -> only the non-empty sections render; no placeholders.
- **EC22:** Profile text contains HTML-like or markdown-like text -> shown literally as text.
- **EC23:** Double click or double drop on the upload control -> a second upload is not sent while one is pending.
- **EC24:** Another user's data -> not reachable: the page has no id in the URL and uses only `/profile`.

## Acceptance Criteria
- [ ] **AC1:** `/resume` exists, is in the user sidebar, requires sign-in, and shows loading, empty, content and error states. (EC1, EC2, EC20)
- [ ] **AC2:** A 404 from `GET /profile` shows the empty state, not an error alert or toast. (EC1)
- [ ] **AC3:** Choosing a `.pdf` or `.docx` of at most 2 MB uploads it as multipart with a single `file` part and, on success, shows the returned profile. Other names or sizes are refused in the browser with no request. (EC3, EC4)
- [ ] **AC4:** Every refusal (413, 415, 422, 502, 503) appears as an inline alert with the backend's message, the old profile stays visible, and 429 appears as a toast. (EC5–EC10)
- [ ] **AC5:** While an upload runs, the page shows a busy state, the actions are disabled and a second upload can't start. (EC12, EC23)
- [ ] **AC6:** Replacing a profile needs no confirmation and keeps the old profile shown until the new one arrives. (EC12)
- [ ] **AC7:** Delete opens a confirmation dialog; confirming removes the profile and shows the empty state; a 204 for an already-missing profile gives the same result. (EC13, EC14)
- [ ] **AC8:** The profile view renders skills, roles and projects as plain text, omits empty sections, and never as HTML. (EC21, EC22)
- [ ] **AC9:** The AI-provider notice is visible on `/resume` next to the upload and beside the setup form's toggle, and states that the extracted profile (not the file) is stored and that deleting it stops its use. (consent)
- [ ] **AC10:** The setup form has a "Use my résumé" toggle: off and disabled with a link to `/resume` when there is no profile or the profile check failed; enabled when a profile exists. (EC2, EC17)
- [ ] **AC11:** Start sends `use_profile` as a real boolean, `false` by default, and the request body is otherwise unchanged. (EC15, EC16)
- [ ] **AC12:** A 409 `PROFILE_REQUIRED` shows the explanation and link, refreshes the profile state (toggle becomes disabled and off), and keeps the other form values. (EC17)
- [ ] **AC13:** The interview title bar shows a "Résumé-aware" badge when `session.use_profile` is true and nothing otherwise. (EC15, EC16)
- [ ] **AC14:** The résumé upload has a request budget longer than the default 15 s in both the forwarder and the service call; an upload that times out ends in an error and a profile refetch. (EC11)
- [ ] **AC15:** No profile content is logged, put in a URL or stored in browser storage; responses are validated with zod before use.
- [ ] **AC16:** Typecheck, lint and the test suite pass, with new tests mirroring `src/` for the schemas, the pure utils (file pre-check, error mapping) and the changed forwarder timeouts; `graphify update .` is run after the code changes.

## Out of Scope
- **Editing the profile field by field:** the backend has no edit; delete and re-upload instead.
- **Slice 8a (knowledge-base RAG) and 8b (job import):** the first has no client surface, the second is done.
- **A `use_profile` badge or column in the history table:** only the interview title bar for now; the list row's shape isn't confirmed.
- **Client-side parsing, preview or OCR of the résumé:** the browser only checks name and size.
- **Per-interview "which profile fields to use":** it's all-or-nothing, like the backend.
- **A Settings page and its sidebar link:** `/settings` still doesn't exist; the résumé gets its own page.
- **Backend changes and the pending 8d real-model eval:** tracked in `cuewise-be`.
- **A daily upload cap or abuse monitoring:** the backend's per-minute limit is the only guard.
