# Learn: Job description import in the setup form

Spec: `spec.md` · Plan: `plan.md` · Progress: `task.md` · Backend: `../cuewise-be/docs/features/job-url/`. Built 2026-11-13, uncommitted.

## 1. Why it exists
A job-aware interview needs the posting text, and candidates had to copy and trim it by hand into a 2000-character box. cuewise-be now offers two helpers:
- `POST /interviews/job-url` reads a posting from its link, safely.
- `POST /interviews/job-text` cleans a whole page the candidate copied, for sites like JobStreet that refuse server fetches.

This slice puts both in front of the candidate without changing how an interview starts.

## 2. What it is
- **Link:** a "Posting link" field with an Import button above the job description box. A link fills the box with the posting.
- **Smart paste:** pasting a whole page (more than 2000 characters) into the box sends it for cleaning instead of inserting it raw. Smaller pastes work as before.
- **Review and Undo:** whatever ends up in the box is reviewed and edited by the candidate, then sent by Start exactly as before. Replacing text they had offers Undo.
- **A reusable field:** `InputWithActionField`, a text input with its own button, for any "enter a value, press a button" control.

## 3. When to use it
- `InputWithActionField` (`src/shared/forms/InputWithActionField.tsx:37`) fits any value that triggers a request rather than being submitted with the form: a promo code, a résumé link, an invite code. It's controlled by the caller on purpose, so the value never sneaks into a react-hook-form submission.
- The paste pattern (decide in a pure function, `preventDefault`, send the clipboard's `text/html` copy) works for any "paste a page, get it cleaned" box.

## 4. How it works
**Layers:** service → query → component, as the repo requires.

**Import from a link, step by step:**
1. `InterviewsContainer` (`src/app/(app)/interviews/_components/InterviewsContainer.tsx:105`) passes the two mutations' `mutateAsync` and `isPending` into the form as `jobImport`.
2. `InterviewConfigForm` runs `useJobDescriptionImport` (`InterviewConfigForm.tsx:92`). The hook lives there because the form owns `useForm`, and it gets `setValue` / `setFocus` wrapped in `useCallback`.
3. Import (or Enter, `InputWithActionField.tsx:76`) calls `importFromLink` (`use-job-description-import.ts:108`). The link is checked with `jobUrlSchema` first (`interviews.schema.ts:61`): trimmed, required, http or https with a host, at most 2048 characters. A bad link never leaves the browser.
4. `interviewsService.importJobUrl` (`interviews.services.ts:61`) posts `{url}` through `apiClient` and parses the reply with `jobImportResponseSchema` (`interviews.schema.ts:82`). The catch-all `/api` forwarder adds the cookie token. No new Route Handler was needed.
5. `apply` (`use-job-description-import.ts:74`) replaces the box with `setValue(…, {shouldDirty, shouldValidate})`. When the box had other text, it shows the Undo toast.
6. `requestFocus` (`:61`) puts the cursor in the box once it's enabled again.

**Smart paste:** `handlePaste` (`:126`) reads the clipboard's plain text.
- `shouldCleanPaste` (`job-import.utils.ts:17`) says yes only above 2000 characters.
- `buildPastePayload` (`:26`) picks the HTML copy, or the plain text when the HTML is blank or over the server's 1,000,000-character limit.

**Errors:** `getJobImportErrorResult` (`job-import.utils.ts:40`) sends each one where it belongs:
- `JOB_URL_*` → under the link field, and focus moves to the box;
- `JOB_TEXT_UNREADABLE` → under the box;
- 429 → toast with the server's message;
- anything else → one generic toast.

**Derived, not stored:** the "Shortened to fit" note and the paste error are computed from the watched field value. Each shows only while the box still holds the text the import left (`showTruncatedNote`, `jobDescriptionError`). Editing the box clears them with no `onChange` plumbing.

**Decisions and why:**
- **Keep the textarea as the source of truth:** the backend start contract is unchanged, and the candidate always reviews untrusted text before it's used.
- **Replace plus Undo, not a confirm dialog** (your choice): no extra click on the happy path, and nothing is lost.
- **Intercept only pastes that can't fit on their own** (your choice): typing plus a modest paste never triggers a surprise replacement.
- **Lock the card and Start while importing** (your choice): starting mid-import would send a half-filled description.
- **The link stays out of react-hook-form:** the start body is exactly `POST /interviews`, which forbids extra keys.
- **Server messages shown as-is** for the three import codes: cuewise-be wrote them for candidates and kept them generic about the cause. The voice-answer mapper does the opposite (fixed frontend copy), because its backend messages were not written for users.

## 5. What can go wrong
| Failure | Handling | Proof |
|---|---|---|
| A typo'd or non-http link | refused in the browser, no request | `tests/modules/interviews/utils/job-import.utils.test.ts` › `jobUrlSchema` |
| Blocked site (JobStreet 403), JS-only page, not a posting | server message under the link, focus to the box for a paste | › `getJobImportErrorResult` "shows %s under the link field" |
| A paste that holds no posting | message under the box, content unchanged | › "shows JOB_TEXT_UNREADABLE under the job description" |
| 11th import in a minute | toast with the server's message | › "toasts the server's message when rate limited" |
| Backend down, 5xx, odd body | one generic toast, never a raw error | › "toasts a generic message for %s" |
| A huge HTML clipboard copy | falls back to the plain text, never cut mid-tag | › `buildPastePayload` "over the server's limit" |
| A reply that breaks the contract | zod rejects it | `interviews.services.test.ts` › "rejects a reply that breaks the contract" |
| Focus lost because the box was still disabled | refs plus effect; whichever settles last focuses | manual check (pending, §9) |
| An import replaced the wrong text | Undo restores the exact previous text | manual check (pending, §9) |

## 6. Try it yourself
1. Predict, then run `npx vitest run tests/modules/interviews/utils/job-import.utils.test.ts`. Change `shouldCleanPaste` to `>=`. Which test fails, and which edge case does it protect? (EC9: exactly 2000 characters pastes as usual.)
2. With both servers running, paste `https://www.python.org/jobs/` and press Import. Then type a word in the box. Watch the "Shortened" note, if any, disappear without any `onChange` code.
3. On a JobStreet posting, press Ctrl+A, Ctrl+C, then paste into the box. In DevTools › Network, look at the `job-text` request. Is `format` `html`? (Chromium: expected yes.)

## 7. What surprised me
- **The lint rule `react-hooks/set-state-in-effect`** rejected the first "focus once enabled" version (a `useState` flag cleared inside an effect). The ref version is also more correct: the mutation's promise and its `isPending` flag can settle in either order, and only "whichever comes last focuses" covers both.
- **No onChange plumbing for "clear the note on edit".** Deriving it (`imported.text === jobDescription`) removed a prop from `TextAreaField` and a class of bugs where the note and the text disagree.
- **No route or timeout work.** The catch-all forwarder already forwards any `/api/interviews/*` path. The backend's 8 s fetch cap sits inside the 15 s default. The 10 MB `proxyClientMaxBodySize` doesn't apply, because `src/proxy.ts` excludes `/api` and the forwarder reads raw bytes.
- **Measurements** (2026-11-13, this machine):
  - `npx vitest run` 559 passed (522 before plus 37 new);
  - `npx tsc --noEmit` clean;
  - `npm run lint` clean;
  - `npm run build` compiled successfully.

## 8. Check your understanding
1. Why is the link input not registered in react-hook-form?
2. Why does the paste rule look at the plain-text length, not the HTML length?
3. Why can't the hook just call `focus()` right after `await importJobUrl(...)`?
4. Why show the server's message for `JOB_URL_UNREACHABLE` here, when the voice feature never shows server text?

<details><summary>Answers</summary>

1. Everything registered goes into `POST /interviews`. cuewise-be forbids extra keys, so a `job_url` field would make every start fail with 422. The link is a request trigger, not part of the interview.
2. The HTML copy of even a short selection carries markup and styles, so it's always far longer than what the candidate sees. The plain text is what would land in the box, so it's the honest measure of "doesn't fit".
3. The box is disabled while importing (the whole fieldset locks), and a disabled element ignores `focus()`. The mutation may not have flipped `isPending` back yet, so focus has to wait for the render where the box is enabled.
4. The job-import messages were written for candidates, and deliberately say nothing about the cause (an anti-probing rule on the server). The voice messages were not written for users, so that feature maps codes to its own copy.
</details>

## 9. Go deeper / Still open
- **Pending: manual browser check** against a running cuewise-be, covering:
  - a working link;
  - a blocked link (JobStreet);
  - a whole-page paste in Chrome (and Safari, whose `text/html` clipboard copy is unverified);
  - a short paste;
  - Undo;
  - the 11th import (429);
  - focus after a success and after a link error;
  - Start after an import.
- No component tests: Vitest here is node-only, so the hook and the field are covered by the tested pure functions plus the manual check.
- A browser extension or bookmarklet ("Send to Cuewise") could reuse `POST /interviews/job-text` later.
