# Implementation: Interviews Setup UI (foundation)

## Status
Ready for PR (manual UI walkthrough pending: see Tests Pending)

## Completed Steps
- [x] 1. shadcn primitives: radio-group, slider (+ badge, progress)
- [x] 2. Module foundation: constants, schemas, types (tests first)
- [x] 3. Pure utils: parse-session-param, get-start-error-result (tests first)
- [x] 4. Service, keys, queries (service tests first)
- [x] 5. Shared fields: RadioGroupField, SliderField, TextAreaField a11y fix
- [x] 6. InterviewConfigForm (setup card)
- [x] 7. Interview screen components (summary bar, question card, answer form, end dialog, ended panel, skeleton, message card)
- [x] 8. InterviewsContainer + page.tsx
- [x] 9. Typecheck, lint, tests, build, API check through the BFF, graphify update

## Changes Made
Not committed (user commits manually). Suggested message:

    feat(interviews): add interview setup card and interview screen

    - interviews module: constants, zod schemas, service, query hooks, utils
    - setup card (role, level, style, length, job description) starting POST /interviews via the BFF
    - interview screen: summary bar, progress, question, answer box, disabled Next
    - End interview dialog and ended screen (client-only until the backend can end a session)
    - shared RadioGroupField and SliderField; TextAreaField and SelectField a11y fixes

## Test Results
- `npm test`: 16 files, 180 tests passing (baseline was 144; 36 new).
- `npx tsc --noEmit`: clean. `npm run lint` (eslint src tests): clean.
- `npm run build`: green with `NODE_ENV=production`. With the shell's `NODE_ENV=development` it fails prerendering `/_global-error`; environment issue, not this change.
- Real requests through the BFF against local cuewise-be: register 201, start 201, get 200, unknown id 404, 409 `NOT_ENOUGH_QUESTIONS`, 422 for an extra key, `/interviews?session=<id>` 200.

## Tests Pending
- Manual UI walkthrough (no component-test tooling, by decision): AC1, AC4, AC5, AC7, AC12, AC13, AC15-AC18, EC9, EC11, EC13, EC14. Checklist in plan.md > Testing Strategy.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 2 | defaults + role/level valid; defaults are mixed/5/unset | spec | AC1 | pass |
| T2 | 2 | missing role and level error on those fields; unknown role rejected | spec | AC10, EC8 | pass |
| T3 | 2 | count 0, 11, 2.5 rejected; 1, 10 accepted | spec | EC7 | pass |
| T4 | 2 | job description 2001 rejected, 2000 accepted | spec | EC6 | pass |
| T5 | 2 | output is exactly the request body; blank JD dropped; text trimmed; extra keys stripped | spec | AC2 | pass |
| T6 | 2 | interview response parses; bad id and role rejected | spec | AC14 | pass |
| T7 | 2 | answer empty/whitespace rejected; 2000 ok; 2001 rejected | spec | EC11 | pass |
| T8 | 3 | session param: none, valid, invalid, repeated | spec | AC11, EC3, EC12 | pass |
| T9 | 3 | session param accepts the UUID v7 ids the backend issues | code-derived | real response | pass |
| T10 | 3 | 409 NOT_ENOUGH_QUESTIONS -> question_count | spec | AC8, EC1 | pass |
| T11 | 3 | 422 maps known fields; unknown-field 422 -> toast | spec | AC9, EC2 | pass |
| T12 | 3 | 500, network and non-axios errors -> toast | spec | EC4 | pass |
| T13 | 4 | service start/get paths and parsing; contract mismatch throws | spec | AC2, AC6 | pass |

## Open Questions
- None blocking. Possible UX follow-up: the 409 body includes `available`; the message could say "Only 7 questions available for this setup" instead of the backend's generic text.

## Baseline Failures
- None (144/144 before changes).

## Known Issues
- `NODE_ENV=development` is exported in the shell; `next build` needs it unset or `production`.
- Ending an interview is client-only (spec EC13): a reload shows the interview screen again until cuewise-be has an end endpoint.

## Deviations from Plan
See plan.md > Deviations During Implementation (recorded there; no approval needed beyond the user's request to implement):
- build-start-payload folded into the schema; 409 keyed on status; badge/progress added; slider thumbProps and SelectField ref fixes; shared InterviewMessageCard; stacked role/level and centered column; useTransition for the start navigation.
- Layout revised after user review: removed `interviews/layout.tsx`, left-aligned page with header, two columns from `xl` (`InterviewColumns`), summary bar replaced by `InterviewDetailsCard`, container-query option grids.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | lean-ctx | file reads and searches |
| all | ponytail (lite) | dropped the payload util, one message card for three states, no new deps |
| 0 | find-skills | searched for form/Next.js skills; installed `shadcn`, `vitest`, `tdd` were enough, nothing installed |
| 1 | shadcn (CLI) | added radio-group, slider, badge, progress |
| 2-4 | tdd | red -> green per test file at the confirmed seams |
| 9 | graphify | `graphify update .` after code changes |

## Links
- Spec: docs/features/interviews-setup-ui/spec.md
- Plan: docs/features/interviews-setup-ui/plan.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite + build green (build with NODE_ENV=production)
- [ ] Every spec.md acceptance criterion met by actual code and covered by a passing spec test (or verification noted): logic ACs tested; UI ACs await the manual walkthrough
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately (the 409 test was corrected to the verified backend shape, not loosened)
- [x] task.md fully updated
- [ ] Commits documented (user commits)
- [x] No open blockers
- [x] Code follows project rules
- [x] No unresolved plan deviations
