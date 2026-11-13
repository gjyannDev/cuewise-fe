# Implementation Plan: Job description import (link and smart paste)

## Overview
Wire cuewise-be's `POST /interviews/job-url` and `POST /interviews/job-text` into the setup form's Job description card, so a link or a whole-page paste fills the existing textarea for review. Add a reusable input-with-action field.

## Architecture & Design
- The textarea (`job_description` in react-hook-form) stays the single source of truth, and `POST /interviews` is unchanged.
- Two zod-parsed service calls feed two TanStack mutations.
- A feature hook, `use-job-description-import`, owns the import state:
  - the link value and its error;
  - the textarea error;
  - the truncation note;
  - the pending flag;
  - the previous text for Undo;
  - the paste handler.

  It writes results into the form with `setValue`.
- All decisions live in pure utils, so they can be unit-tested without a DOM: should this paste be cleaned, what payload to send, and which error goes where.
- The container wires the mutations and the hook into `InterviewConfigForm`, which stays presentational and renders the new shared field plus the note.

## Spec Requirements -> Implementation
- Reusable input-with-action field (AC1) -> Step 4
- Link import, validation, note, errors (AC2, AC3, AC4, AC10) -> Steps 1, 2, 3, 5, 6
- Smart paste (AC5, AC6) -> Steps 1, 3, 5, 6
- Undo (AC7) -> Step 5
- Toast failures (AC8) -> Steps 1, 5
- Locking (AC9) -> Steps 5, 6
- Layers and checks (AC11), start flow unchanged (AC12) -> Steps 2, 7

## Implementation Steps
1. **Constants, schema and pure utils.**
   - Constants in `modules/interviews/constants.ts`, with "keep in step with cuewise-be" comments:
     - the three error codes;
     - `JOB_URL_MAX_LENGTH` (2048);
     - `JOB_PASTE_MAX_CHARS` (1,000,000);
     - the copy (note, toasts, link-field text, generic failure).
   - In `schemas/interviews.schema.ts`:
     - `jobImportResponseSchema` (`text`, `truncated`);
     - `jobUrlSchema`: trimmed, required, http/https, at most 2048, with messages "Enter a link" and "Enter a link starting with http:// or https://".

     Types via `z.infer` in `types/interviews.types.ts`.
   - New `utils/job-import.utils.ts`:
     - `shouldCleanPaste(plainText)`: plain text over 2000 characters.
     - `buildPastePayload({html, text})`: the HTML copy when non-blank, else the text, with the matching `format`, capped at `JOB_PASTE_MAX_CHARS`.
     - `getJobImportErrorResult(error, source)` returns a field message (link field for `JOB_URL_*`, textarea for `JOB_TEXT_UNREADABLE`) or a toast message (429 with the server message; anything else the generic copy).

   Test: first. Seam: these exported functions (user-confirmed). Slices:
   - the paste rule at 2000 and 2001 characters (EC9);
   - the HTML payload (EC7), then the text fallback (EC8);
   - the link schema: empty (EC1), no scheme (EC2), too long (EC2);
   - error mapping: `JOB_URL_UNREACHABLE` (EC5), `JOB_URL_UNREADABLE` (EC6), `JOB_TEXT_UNREADABLE` (EC10), 429 (EC13), network, 5xx and `VALIDATION_ERROR` (EC14).
2. **Services.** `interviewsService.importJobUrl(url)` and `importJobText(content, format)`:
   - `apiClient.post` to `/interviews/job-url` and `/interviews/job-text`;
   - responses parsed with `jobImportResponseSchema`;
   - the default timeout (the backend caps the fetch at 8 s, inside the 15 s forwarder budget).

   Test: first. Seam: the service methods with `apiClient` mocked (user-confirmed, the existing `interviews.services.test.ts` pattern). Slices: the request body and path for each; a malformed response is rejected; errors propagate unchanged.
3. **Queries.** `useImportJobUrlMutation` and `useImportJobTextMutation` in `interviews.queries.ts`, with mutation keys added in `interviews.keys.ts`. No cache writes, because nothing is stored. Test: skip (thin wiring; behavior is covered by Steps 1-2 and the Step 7 manual check).
4. **Reusable `InputWithActionField`** in `src/shared/forms/`, built from shadcn `Input` and `Button` plus the existing `Field` primitives, following `TextField`'s conventions.
   - Props: name, label, description, placeholder, type, `actionLabel`, `pending`, `disabled`, `error`, `value`, `onChange`, `onAction(value)`.
   - Enter triggers the action and prevents the surrounding form from submitting (EC19).
   - Spinner on the button while pending; errors linked with `aria-describedby`.
   - It is controlled by the caller, not registered in react-hook-form: the link value is not part of the start request, which `extra="forbid"` on the backend would reject.

   Test: after (no DOM; manual check in Step 7).
5. **Hook `use-job-description-import.ts`** in `modules/interviews/hooks/`. It takes the form's `getValues`/`setValue`/`setFocus` and the two mutations, and returns:
   - the link value and setter;
   - the link error and the textarea error;
   - the note flag;
   - `isImporting`;
   - `importFromLink()`;
   - `handlePaste(event)`;
   - `onJobDescriptionEdited()` (clears the note and the textarea error).

   Behavior:
   - Validate the link with `jobUrlSchema` first.
   - `handlePaste` reads `clipboardData` `text/plain` and `text/html`. When `shouldCleanPaste` says so, it prevents the default and sends `buildPastePayload`.
   - On success: remember the previous text, `setValue` with `shouldDirty` and `shouldValidate`, and set the note from `truncated`.
   - On a link success: focus the textarea.
   - On a link failure with a field message: focus the textarea (EC5, EC6).
   - Toasts and Undo go through sonner's `toast` with an `action`, the same way `useMutationCallbacks` shows messages. Undo restores the remembered text and clears the note (EC11). There is no Undo toast when the previous text was empty (EC12).

   Test: after (no DOM; its decisions come from the Step 1 utils, which are tested first).
6. **UI wiring.**
   - `TextAreaField` gets optional `onPaste`, `aria-busy` and `onChange` pass-through props. They are additive and optional, so existing callers are unchanged.
   - `InterviewConfigForm`:
     - takes a `jobImport` prop group from the container;
     - renders `InputWithActionField` above the textarea with the copy from constants;
     - shows the note as a `role="status"` line under the textarea and the textarea error;
     - disables the link field, the textarea and Start while `isImporting`.
   - `InterviewsContainer` calls the two mutations and passes them to the hook. The hook lives in the form, which owns `useForm`, and receives the mutations from the container through props, so the layer rule (components never import queries directly; containers do) holds.
   - The textarea placeholder copy is updated.

   Test: after.
7. **Verify.**
   - `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, then `graphify update .`.
   - Manual browser check against a running cuewise-be:
     - a link that works;
     - a blocked link (JobStreet);
     - a whole-page paste in Chrome (and Safari if available);
     - a short paste;
     - Undo;
     - 11 imports in a minute (429);
     - Start after an import (AC12).

   Test: after.

## Affected Files & Patterns
- New:
  - `src/shared/forms/InputWithActionField.tsx`
  - `src/modules/interviews/hooks/use-job-description-import.ts`
  - `src/modules/interviews/utils/job-import.utils.ts`
  - `tests/modules/interviews/utils/job-import.utils.test.ts`
- Edited:
  - `modules/interviews/constants.ts`
  - `schemas/interviews.schema.ts`
  - `types/interviews.types.ts`
  - `services/interviews.services.ts`
  - `queries/interviews.{keys,queries}.ts`
  - `components/setup/InterviewConfigForm.tsx`
  - `src/shared/forms/TextAreaField.tsx`
  - `src/app/(app)/interviews/_components/InterviewsContainer.tsx`
  - `tests/modules/interviews/services/interviews.services.test.ts`
- Patterns to follow:
  - `getTranscribeErrorResult` in `voice.utils.ts`: a pure error mapper returning a result union.
  - `useTranscribeAnswerMutation`: a mutation with no cache.
  - `TextField`: shared field conventions.
  - `useMutationCallbacks` / `parseApiError`: never show raw errors.
  - `tests/helpers/axios.ts` (`axiosErrorWith`, `networkError`, `errorBody`) for error fixtures.
- Risks:
  - **Hook placement:** react-hook-form state lives in `InterviewConfigForm`, so the hook runs there and receives the mutations from the container. If that strains the "dumb component" rule, the alternative is lifting `useForm` into the container. It's a deviation to flag, not to do silently.
  - **Locked textarea:** a disabled textarea can't receive focus. Focus moves only after the import finishes, when it's enabled again.

## Testing Strategy
- Framework and command: Vitest (node environment, no DOM). `npm test` runs it, or `npx vitest run tests/modules/interviews` for this slice.

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 4, 7 | after | manual: label, Enter, spinner, error wiring |
| AC2 | 2, 5, 7 | first + after | service path and body; manual fill |
| AC3 | 1 | first | `jobUrlSchema` (EC1, EC2); EC19 manual |
| AC4 | 1, 5 | first + after | error mapper (EC5, EC6); focus manual |
| AC5 | 1 | first | paste rule and payload (EC7, EC8, EC9) |
| AC6 | 1 | first | mapper (EC10) |
| AC7 | 5, 7 | after | Undo manual (EC11, EC12) |
| AC8 | 1 | first | mapper (EC13, EC14) |
| AC9 | 6, 7 | after | locking manual (EC15) |
| AC10 | 5, 7 | after | note clears on edit (EC16); plain-text render (EC17) by construction (textarea value) |
| AC11 | 1, 2, 7 | first | layer rules by review; tsc, lint, test, build |
| AC12 | 7 | after | existing setup tests plus manual Start; EC18 via `jobImportResponseSchema` and the backend cap |

- Must verify, not assume:
  - whether real browsers fill `text/html` on select-all-and-copy (Chrome and Firefox desktop expected; Safari unknown);
  - JobStreet still returning 403 (the paste path);
  - the Undo toast's action button working with sonner as configured in `providers.tsx`.
- Open questions: none.
- Known baseline failures: none seen in this area. A baseline `npm test` runs before Step 1.

## Blockers & Resolutions
- Forwarder body size -> resolved:
  - `src/proxy.ts`'s matcher excludes `/api`, so `proxyClientMaxBodySize` (10 MB, proxy only, per Next 16 docs) doesn't apply.
  - The forwarder reads `request.arrayBuffer()`, and Route Handlers have no body limit of their own, so 1 MB passes.
- Timeouts -> the default 15 s browser and forwarder budget covers the backend's 8 s fetch cap, so no `SLOW_POSTS` entry.
- No DOM in tests -> logic is pushed into pure utils (user-confirmed seams); the UI gets a manual check.

## Trade-offs & Rationale
- Controlled link input outside react-hook-form -> the start body stays exactly the backend contract (`extra="forbid"`).
- Overwrite with Undo, not a confirm dialog (user decision) -> no extra click; nothing is lost.
- Paste rule on the pasted text alone (user decision) -> typing plus a modest paste never triggers a replacement.
- Reusable field controlled by props, without business logic (user decision) -> reusable for any "value plus action" input.
- No new dependency and no DOM test setup (user decision) -> logic tested as pure functions; the UI checked by hand.

## Project Rules Applied
- `cuewise-fe/CLAUDE.md`:
  - service -> query -> component;
  - `apiClient` only, with zod parsing;
  - presentational components, containers wire data;
  - one exported component per file, by area;
  - shared, feature-agnostic UI in `src/shared/forms/`;
  - pure logic in `utils/`, one hook per file;
  - constants mirror the backend;
  - no new dependency without a reason;
  - verification commands and `graphify update .`;
  - no commits.
- `cuewise-be` Slice 8b spec: the response shape, error codes, limits and the shared rate limit.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| lean-ctx / shell reads | setup form, container, forwarder, `apiClient`, `TextField`/`TextAreaField`, `useMutationCallbacks`, voice error-mapper pattern, test helpers, vitest config |
| graphify | setup-form neighborhood (`InterviewConfigForm`, `startInterviewFormSchema`, constants) |
| grill-me | test seams (utils + services), confirmed |
| Next 16 docs | `proxyClientMaxBodySize` scope (proxy only), resolving the body-size blocker |

## Ready to Implement
- All spec requirements mapped to steps
- Every step has a Test tag; every AC and EC mapped
- Affected files identified
- Blockers resolved; edge cases handled
- Trade-offs documented
- No deviations from spec

## Deviations found during implementation (2026-11-13)
- **Error mapper:** no `source` argument; the error codes are distinct per route.
- **Paste payload:** an HTML copy over 1,000,000 characters falls back to plain text instead of being cut.
- **`TextAreaField`:** gets `onPaste` and `busy`, not `onChange`. The note and paste error are derived from the watched value.
- **Locking:** reuses the form's `FieldSet disabled={isBusy}`.
- **Two busy flags:** the container passes one per route, so only the control that started the import shows a spinner.
- **Undo toast:** the hook calls sonner's `toast` directly, because `useMutationCallbacks` has no action button.
- **Focus after import:** refs plus an effect, not a state flag. This follows the lint rule `react-hooks/set-state-in-effect` and works whichever of the promise and the busy flag settles first.
