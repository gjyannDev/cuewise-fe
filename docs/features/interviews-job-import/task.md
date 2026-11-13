# Implementation: Job description import (link and smart paste)

## Status
Code complete and verified (7 of 7 steps). One gate left: a manual browser check against a running cuewise-be (Tests Pending). Uncommitted; the user commits by hand.

## Completed Steps
- [x] 1. Constants, `jobUrlSchema`, `jobTextRequestSchema`, `jobImportResponseSchema`, types, and `job-import.utils.ts` (`shouldCleanPaste`, `buildPastePayload`, `getJobImportErrorResult`). tdd, 31 tests.
- [x] 2. `interviewsService.importJobUrl` / `importJobText`. tdd, 6 tests.
- [x] 3. `useImportJobUrlMutation` / `useImportJobTextMutation` and their keys (no cache)
- [x] 4. Reusable `src/shared/forms/InputWithActionField.tsx`
- [x] 5. Hook `modules/interviews/hooks/use-job-description-import.ts`
- [x] 6. `TextAreaField` (optional `onPaste`, `busy`), `InterviewConfigForm` (link field, note, lock), `InterviewsContainer` (mutations)
- [x] 7. tsc, lint, tests and build all green; `graphify update .` run; manual browser check still to do

## Changes Made
New:
- `src/shared/forms/InputWithActionField.tsx`
- `src/modules/interviews/hooks/use-job-description-import.ts`
- `src/modules/interviews/utils/job-import.utils.ts`
- `tests/modules/interviews/utils/job-import.utils.test.ts`
- `docs/features/interviews-job-import/{spec,plan,task,learnings}.md`

Edited:
- `src/modules/interviews/{constants.ts, schemas/interviews.schema.ts, types/interviews.types.ts, services/interviews.services.ts, queries/interviews.keys.ts, queries/interviews.queries.ts, components/setup/InterviewConfigForm.tsx}`
- `src/shared/forms/TextAreaField.tsx`
- `src/app/(app)/interviews/_components/InterviewsContainer.tsx`
- `tests/modules/interviews/services/interviews.services.test.ts`
- `graphify-out/`

Branch `feat/job-url-resume-rag-related` (unchanged).

Suggested commits (one line each):
- `git add src/modules/interviews/constants.ts src/modules/interviews/schemas/interviews.schema.ts src/modules/interviews/types/interviews.types.ts src/modules/interviews/utils/job-import.utils.ts tests/modules/interviews/utils/job-import.utils.test.ts` then `git commit -m "feat(interviews): add job import schemas, paste rule and error mapping"`
- `git add src/modules/interviews/services/interviews.services.ts src/modules/interviews/queries tests/modules/interviews/services/interviews.services.test.ts` then `git commit -m "feat(interviews): add job-url and job-text services and mutations"`
- `git add src/shared/forms/InputWithActionField.tsx src/shared/forms/TextAreaField.tsx` then `git commit -m "feat(shared): add reusable input-with-action field and paste hook on textarea field"`
- `git add src/modules/interviews/hooks/use-job-description-import.ts src/modules/interviews/components/setup/InterviewConfigForm.tsx "src/app/(app)/interviews/_components/InterviewsContainer.tsx"` then `git commit -m "feat(interviews): import the job description from a link or a whole pasted page in the setup form"`
- `git add docs/features/interviews-job-import` then `git commit -m "docs(interviews-job-import): add spec, plan, task and learnings"`
- `git add graphify-out` then `git commit -m "chore(graphify): update knowledge graph"`

## Test Results
- Baseline: 522 passed.
- After: `npx vitest run` 559 passed (26 files). `npx tsc --noEmit` clean. `npm run lint` clean. `npm run build` compiled successfully.

## Tests Pending
- Manual browser check against a running cuewise-be:
  - a working link: fills, note when truncated, focus;
  - a JobStreet link: message under the link, focus to the box;
  - a whole-page paste in Chrome, and Safari if available: is `format` `html` in DevTools;
  - a short paste: unchanged behavior;
  - Undo restores the text;
  - the 11th import in a minute: toast;
  - Start after an import (AC12);
  - Enter in the link field doesn't submit the form (EC19).

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 1 | paste of exactly 2000 characters is not cleaned; 2001 is | spec | EC9, AC5 | pass |
| T2 | 1 | the plain-text length decides, not the HTML | spec | AC5 | pass |
| T3 | 1 | HTML copy sent with format html | spec | EC7 | pass |
| T4 | 1 | blank HTML falls back to text | spec | EC8 | pass |
| T5 | 1 | HTML over the server's limit falls back to text; text capped | inferred | risk: oversize paste | pass |
| T6 | 1 | link: trimmed, http/https accepted | spec | AC3 | pass |
| T7 | 1 | link: empty refused with "Enter a link" | spec | EC1 | pass |
| T8 | 1 | link: no scheme, ftp, javascript, no host refused | spec | EC2 | pass |
| T9 | 1 | link: over 2048 refused | spec | EC2 | pass |
| T10 | 1 | response schema accepts and rejects | spec | EC18, AC11 | pass |
| T11 | 1 | `JOB_URL_UNREACHABLE` / `JOB_URL_UNREADABLE` go under the link with the server message | spec | EC5, EC6, AC4 | pass |
| T12 | 1 | `JOB_TEXT_UNREADABLE` goes under the box | spec | EC10, AC6 | pass |
| T13 | 1 | 429 toasts the server message | spec | EC13, AC8 | pass |
| T14 | 1 | network, 5xx, forwarder 503, validation, odd body, non-HTTP error: generic toast | spec | EC14, AC8 | pass |
| T15 | 2 | importJobUrl posts `{url}` to `/interviews/job-url` and parses the reply | spec | AC2 | pass |
| T16 | 2 | importJobText posts `{content, format}` to `/interviews/job-text` | spec | AC5 | pass |
| T17 | 2 | malformed replies rejected (both) | spec | AC11 | pass |
| T18 | 2 | API errors pass through unchanged (both) | code-derived | the error mapper needs the original | pass |

## Open Questions
- None. The manual check is a pending gate, not an open decision.

## Baseline Failures
- None.

## Known Issues
- Safari's clipboard `text/html` on select-all is unverified. Without it, the paste goes as plain text, which can't have menus stripped (spec EC8, documented).
- No component tests (node-only Vitest, user-confirmed seams): the hook, the field and the wiring rely on the tested pure functions plus the manual check.

## Deviations from Plan
- Follow-up (2026-11-13, user request): a reusable blocking loading overlay, `src/shared/ui/LoadingOverlay.tsx`.
  - Built from the shadcn Dialog: its exported `DialogPortal` plus `DialogOverlay` with a darker `bg-black/60`, and Radix `Content`, because `DialogContent` hard-wires the light `bg-black/10` backdrop and `ui/*` is not edited for one-off styling. shadcn `spinner` was added with the CLI.
  - It can't be dismissed (Escape and outside clicks are ignored) and it never moves focus on close (`onCloseAutoFocus` is prevented), so the import hook still puts the cursor in the job description.
  - Wired in `InterviewConfigForm` for starting (through navigation to the interview screen), link import and paste cleaning, with copy in `SETUP_LOADING_COPY`.
  - Fixed along the way: the Start button said "Preparing your questions…" during an import; it now follows starting only (`isStarting`).
  - Checks: tsc, lint, 559 tests and the build all pass. The visual and focus behavior is part of the pending manual check.
- `getJobImportErrorResult` takes no `source` argument: the three error codes are already distinct per route.
- `buildPastePayload` falls back to the plain text when the HTML copy is over 1,000,000 characters, instead of cutting the HTML (that would break it mid-tag).
- `TextAreaField` got `onPaste` and `busy` but no `onChange` pass-through. The note and paste error are derived from the watched value, which avoids overriding react-hook-form's `onChange`.
- Locking uses the existing `FieldSet disabled={isBusy}`: the import's busy flag joins `isBusy`, with no per-control disabling.
- The container passes two busy flags (`isImportingLink`, `isImportingPaste`) so the spinner sits only on the control that started the import.
- The hook calls sonner's `toast` directly: `useMutationCallbacks` has no action button for Undo. Same as `SessionExpiredNotice`.
- Focus-after-import uses refs plus an effect, instead of a state flag (the lint rule `react-hooks/set-state-in-effect`, and correct for either settle order).

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | lean-ctx / shell reads, graphify | patterns (`voice.utils`, `TextField`, `useMutationCallbacks`, forwarder), graph update |
| 1-2 | tdd (via implement) | red -> green at the user-confirmed seams (utils, services) |

## Links
- Spec: docs/features/interviews-job-import/spec.md
- Plan: docs/features/interviews-job-import/plan.md
- Learnings: docs/features/interviews-job-import/learnings.md
- Backend: ../cuewise-be/docs/features/job-url/

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete (manual check pending as a gate)
- [x] Full test suite and build green (559 passed; tsc, lint, build clean)
- [x] Every AC met by code; AC1, AC7, AC9, AC10 and EC19 are verified by the pending manual check (no DOM in tests)
- [x] Open Questions surfaced
- [x] No skipped, deleted or loosened tests
- [x] task.md updated
- [x] learnings.md written; the pending manual check matches Tests Pending
- [ ] Commits: the user commits by hand
- [x] No open blockers
- [x] Project rules followed
- [x] Plan deviations recorded
