# Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)

Follows `plan.md` (the earlier build is in `plan-v1.md`; its task log is summarized under "Earlier build" below).

## Status
Ready for review (B1-B4 and 1-8 done). Automated checks green in both repos; signed-in click-through pending for the user (see Tests Pending). Nothing committed or newly staged: the user commits manually. Branch unchanged (`feat/voice-answer-stt` in both repos).

## Completed Steps
- [x] B1. Backend constants and route (`HistorySortColumn`, `SortDirection`; `sort_by` / `sort_dir` query params)
- [x] B2. Backend controller and repository (ordering, `id desc` tie-breaker)
- [x] B3. Backend tests (`test_list_interviews.py`)
- [x] B4. Backend docs and graph
- [x] 1. Constants, schemas, types
- [x] 2. URL <-> request utils
- [x] 3. Table-state converters
- [x] 4. Service and query (no code change needed: the service forwards params; test added)
- [x] 5. Shared DataTable
- [x] 6. Wire the history
- [x] 7. Tests
- [x] 8. Docs and close

## Changes Made
- cuewise-be (unstaged, on top of the user's already-staged list-endpoint work):
  - `interviews_constants.py`: `HistorySortColumn` (`created_at`, `role`, `level`, `interview_type`, `status`), `SortDirection`.
  - `interviews_route.py`: `sort_by` (default `created_at`) and `sort_dir` (default `desc`) on `GET /interviews`; 422 for other values; docstring.
  - `interviews_controller.py`: passes the sort through; docstring.
  - `interviews_repository.py`: `_HISTORY_SORT_COLUMNS` (`created_at` -> UUIDv7 `id`, keeps the existing index) and `_history_order` (column + direction, then `id desc`).
  - `tests/modules/interviews/test_list_interviews.py`: 21 new cases (fixture `sortable`).
  - `docs/features/interview-history/spec.md`: sort params, order rule, EC15, EC16, AC15, Out of Scope.
- cuewise-fe:
  - New shared: `src/shared/ui/data-table-features.ts` (`dataTableFeatures` = pagination + sorting), `DataTable.tsx` (renders a table instance, `aria-sort`), `DataTablePagination.tsx` (total, rows per page, "Page X of Y", first/previous/next/last from the table API), `DataTableColumnHeader.tsx` (sort button with direction icon).
  - New: `src/modules/interviews/hooks/use-interview-history-table.ts` (`useTable` with `manualPagination`, `manualSorting`, `rowCount`, controlled state from the URL), `utils/history-table-state.ts` (`toPaginationState`, `toSortingState`, `applyPaginationChange`, `applySortingChange`).
  - Changed: `constants.ts` (`HISTORY_PAGE_SIZES`, `HISTORY_SORT_COLUMNS`, `SORT_DIRECTIONS`, `HISTORY_DEFAULT_PARAMS`), `schemas/interviews.schema.ts` (`historySizeParamSchema`, `historySortParamSchema`, `historyOrderParamSchema`), `types/interviews.types.ts` (`HistoryParams` with size/sort/order; `InterviewListParams` with `sort_by` / `sort_dir`), `utils/history-params.ts` (object input, five params; `historyPageCount` removed), `components/interview-history-columns.tsx` (shared features, sortable headers), `app/(app)/history/page.tsx`, `_components/HistoryContainer.tsx`.
  - Deleted: `components/InterviewHistoryTable.tsx`, `components/InterviewHistoryPagination.tsx`.
  - Tests: rewrote `utils/history-params.test.ts`; new `utils/history-table-state.test.ts`; extended `schemas/interviews.schema.test.ts` and `services/interviews.services.test.ts`. `tests/helpers/interviews.ts` needed no change.
  - `spec.md`: page size, URL params, sorting, pager, AC15, Out of Scope.
- Suggested commit messages (user runs them):

  cuewise-be:

    feat(interviews): sort the history list by column

    GET /interviews takes sort_by (created_at, role, level, interview_type, status) and sort_dir (asc, desc).
    The default stays newest first; other columns sort by the stored value with ties newest first, so pages never
    overlap. Unknown values are a 422.

  cuewise-fe:

    feat(interviews): page size and sorting in the history table, through a shared DataTable

    The history table now uses TanStack Table's pagination and sorting features (server-side, rowCount from the
    API) rendered by shared DataTable, DataTablePagination and DataTableColumnHeader components. Rows per page
    (10 / 20 / 50) and the sort live in the URL with the page and filter; the hand-written pager is gone.

## Test Results
- Backend: `uv run pytest tests/modules/interviews/test_list_interviews.py`: 44 passed (23 before + 21 new; red first for the right reason: the params were ignored). Full `uv run pytest`: 1029 passed, 1 skipped, 1 failed (baseline, see below). `ruff check` on the touched files: clean (run with `uv run --with ruff`, as ruff isn't in the project env).
- Frontend: `npm test`: 33 files, 448 tests passed. `npx tsc --noEmit`: clean. `npm run lint`: clean. `NODE_ENV=production npm run build`: OK, `/history` partially prerendered.
- Headless TanStack check (scratch script, not committed) with the hook's exact options: rows kept in API order; `rowCount` 35 / size 10 -> 4 pages, previous disabled on page 1; Progress can't sort; clicking Role -> `role asc`, clicking Started -> `created_at asc`; `setPageSize(50)`, `nextPage()`, `lastPage()` report the expected pagination; equal controlled state isn't re-published.
- Running dev servers: backend OpenAPI lists `sort_by` / `sort_dir` with their defaults; `/api/interviews?...&sort_by=role&sort_dir=asc` is forwarded (backend's 401 when signed out).

## Tests Pending
- Manual, signed in (needs an account with more than 10 interviews; not created here to keep the dev database untouched):
  - rows-per-page select: 20 / 50 writes `?size=`, goes to page 1;
  - each sortable header toggles asc/desc, writes `?sort=` / `?order=`, goes to page 1, rows reorder across pages;
  - keyboard: Tab to a header button, Enter/Space sorts; screen reader reads `aria-sort`;
  - Back restores page, size, sort and filter;
  - pager hidden with 10 or fewer interviews; past-end link (`?page=9`) shows the message and Previous steps to the last real page;
  - no Suspense flash on any change; earlier v1 checks (Continue/View, states, phone width, freshness).

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T15 | B3 | no params -> newest first | spec | R11 slice B-a | pass |
| T16 | B3 | created_at asc -> oldest first | spec | R11 slice B-b | pass |
| T17 | B3 | role/level/interview_type/status asc and desc, ties newest first | spec | R11 slices B-c, B-d | pass |
| T18 | B3 | sorted pages neither overlap nor skip (all five columns) | spec | R11, R12 slice B-e | pass |
| T19 | B3 | sort + status filter, total kept | spec | R11 slice B-f | pass |
| T20 | B3 | unknown sort_by / sort_dir -> 422; only the caller's rows | spec | R12 slice B-g | pass |
| T21 | B3 | sorted page costs 2 queries whatever its size | spec | R12 slice B-h | pass |
| T22 | 1 | size schema 10/20/50 only | spec | R2 slice 1 | pass |
| T23 | 1 | sort / order schemas | spec | R3, R4 slice 2 | pass |
| T24 | 2 | parse: all valid kept; each invalid falls back alone | spec | R7, E1 slice 3 | pass |
| T25 | 2 | href: defaults omitted, non-defaults written, round-trip | spec | R4, R7, E6 slice 4 | pass |
| T26 | 2 | list params: offset by size, sort only when non-default | spec | R2, R4 slice 5 | pass |
| T27 | 3 | pagination / sorting state from params | spec | R1, R4 slice 6 | pass |
| T28 | 3 | page change keeps size/sort/filter; size change -> page 1; unoffered size ignored | spec | R2, E3 slice 7 | pass |
| T29 | 3 | previous from past the end -> last real page; never below 1 | code-derived | history EC5, E2 | pass |
| T30 | 3 | sort change -> page 1; empty/unknown -> default | spec | R4, E4 slice 8 | pass |
| T31 | 4 | service forwards sort_by / sort_dir | spec | R4 slice 9 | pass |

## Open Questions
- `level` and `status` sort alphabetically by stored value (intern, junior, mid, senior; abandoned, completed, in_progress), not by seniority or lifecycle. Kept as planned; a `CASE` order in the repository would change it without an API change.

## Baseline Failures
- cuewise-be `tests/core/test_config.py::test_llm_settings_default_to_off_with_documented_limits`: expects `llm_max_tokens` 800, gets 4000 from the local environment. Unrelated to this change.
- `npm run build` fails on `/_global-error` when the shell has `NODE_ENV=development` (Next warns about a non-standard NODE_ENV); passes with `NODE_ENV=production`. Environment, not code.

## Known Issues
- Running `ruff format` with an ad-hoc ruff (no project config) would reformat many unrelated files, so it was not run; only the two touched import blocks were sorted by `ruff check --fix --select I001`.
- During B3 a `git stash push`/`pop` on the backend's interview files briefly unstaged the user's staged versions of those files. The index was restored from the stash's own index commit (`git restore --staged --source=<stash index>`), so the staged content is exactly what it was; this change's edits sit unstaged on top (`MM` in `git status`).

## Deviations from Plan
- `applyPaginationChange` takes the table's current `pageCount` so Previous from a page past the end lands on the last real page (the v1 pager did this; the plan didn't spell it out).
- The shared table types are pinned to one exported feature set (`dataTableFeatures` in `src/shared/ui/data-table-features.ts`) instead of a generic feature constraint: simpler typing, and the history columns use the same set.
- `parseHistoryParams` takes an object of raw values instead of positional arguments (five params).
- Step 4: no service or key change was needed; only the test was added.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | graphify | backend list module map; `graphify update .` in both repos |
| all | lean-ctx | reads, searches, test and build runs (frontend); native tools for the backend repo, which is outside lean-ctx's root |
| 5, 6 | TanStack Table bundled skills (`node_modules/@tanstack/*/skills`) | server-side pagination/sorting rules, controlled state, Query integration |
| B3, 1-3 | tdd (seams user-confirmed in /create-plan) | red -> green |

## Earlier build (v1, summarized)
The first build (route, service, query, freshness, states, Continue/View, status filter, v1 pager) passed 406 tests, typecheck, lint and build, with a manual signed-in pass still pending. EC8 was narrowed (a failed new page shows the error card; a failed background refetch keeps rows with an alert), which still needs the user's OK.

## Links
- Spec: docs/features/interview-history/spec.md
- Plan: docs/features/interview-history/plan.md (v1: plan-v1.md)
- Backend: ../cuewise-be/docs/features/interview-history/

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite + build green (not just per-step tests), baseline failures listed
- [ ] Every acceptance criterion met by code and covered by a passing test or verification: UI behavior (R1-R3, R5, R6, R8, E2, E5-E8, AC15 UI part) awaits the signed-in manual pass
- [x] Open Questions surfaced to the user
- [x] No skipped, deleted, or loosened tests (the `historyPageCount` tests went with the removed function)
- [x] task.md fully updated
- [x] Commits documented (suggested messages above; nothing committed)
- [x] No open blockers
- [x] Code follows project rules (both CLAUDE.md files)
- [ ] No unresolved plan deviations: EC8 narrowing (v1) still needs the user's OK
