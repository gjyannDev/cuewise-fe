# Implementation: App Sidebar (shared shell for user and admin)

## Status
Code complete; automated gates green. Manual browser pass pending (needs a running cuewise-be and user + admin accounts).

## Completed Steps
- [x] 1. shadcn primitives: `sidebar`, `sheet`, `skeleton`, `use-mobile` (restored from `stash@{0}`, already added by the user), `avatar` via CLI.
- [x] 2. Types + pure helpers (`isActivePath`, `getInitials`), test-first.
- [x] 3. Navigation constants per role, test-first.
- [x] 4. Presentational components in `src/shared/sidebar/`.
- [x] 5. `RoleSidebar` container (logout, role -> config).
- [x] 6. `(app)` route group, `AuthedShell`, `/` moved, `/admin` placeholder.
- [x] 7. Gates: tsc, lint, tests, build (with `NODE_ENV=production`). `graphify update .` run.

## Changes Made (uncommitted, for the user to review)
- New: `src/shared/sidebar/{AppSidebar,SidebarNavSection,SidebarUserCard,AppShell,AppShellSkeleton}.tsx`, `types/sidebar.types.ts`, `utils/{is-active-path,get-initials}.ts`
- New: `src/modules/navigation/navigation.constants.ts`, `components/RoleSidebar.tsx`
- New: `src/app/(app)/layout.tsx`, `_components/AuthedShell.tsx`, `admin/page.tsx`; moved `src/app/page.tsx` -> `src/app/(app)/page.tsx`
- New (shadcn CLI): `src/components/ui/{avatar,sheet,sidebar,skeleton}.tsx`, `src/hooks/use-mobile.ts` (rewritten, see Deviations)
- Tests: `tests/shared/sidebar/utils/{is-active-path,get-initials}.test.ts`, `tests/modules/navigation/navigation.constants.test.ts`
- Suggested commit: `feat(sidebar): add reusable role-based app sidebar shell`

## Test Results
- `npx vitest run`: 12 files, 142 tests passing (baseline 125 + 17 new).
- `npx tsc --noEmit`: clean. `npm run lint`: clean.
- `NODE_ENV=production npm run build`: success; `/` and `/admin` are Partial Prerender routes.

## Test Cases
| ID | Step | Case | Tag | Source | Status |
|----|------|------|-----|--------|--------|
| T1 | 2 | exact path matches | spec | AC4 | pass |
| T2 | 2 | nested page keeps section active | spec | EC5 | pass |
| T3 | 2 | sibling sharing a prefix does not match | inferred | risk: naive startsWith | pass |
| T4 | 2 | `/` is exact | spec | AC4 | pass |
| T5 | 2 | exact item inactive on nested pages | spec | EC5 | pass |
| T6 | 2 | trailing slash ignored | inferred | risk: URL variants | pass |
| T7 | 2 | initials from separated / single local part | spec | AC5 | pass |
| T8 | 2 | initials fallback for empty/odd email | inferred | risk: odd input | pass |
| T9 | 3 | config exists for every role | spec | AC3 | pass |
| T10 | 3 | user items + hrefs in order | spec | AC1 | pass |
| T11 | 3 | admin items + hrefs in order | spec | AC2 | pass |
| T12 | 3 | unique keys, absolute hrefs (per role) | spec | AC14 | pass |
| T13 | 3 | admin items all under /admin | spec | EC6 | pass |
| T14 | 3 | admin Dashboard is exact | spec | EC5 | pass |
| T15 | 3 | brand links to landing per role | code-derived | config | pass |

## Tests Pending (manual browser pass)
AC4 (`aria-current`), AC5/EC4 (long email truncates, full on hover), AC6/EC9/EC10 (single logout request, lands on /signin, Back is blocked), AC7/EC1 (logout failure toast + retry), AC8/EC7 (trigger, Ctrl/Cmd+B, icon-rail tooltips, avatar-only footer), AC9/EC8 (mobile overlay closes on tap), AC10 (light/dark), AC11/EC3/EC12 (signed-out redirect, skeleton, no hydration warnings), AC12/EC11 (/ as user, /admin as admin), AC13 (keyboard-only), EC2 (unbuilt link 404s), EC6 (admin on `/`: no active item).

## Open Questions
- None blocking. `/interviews` slug still an assumption (spec).

## Baseline Failures
- None in tests (125/125 before changes).
- Environment: the shell exports `NODE_ENV=development`, which makes `next build` fail prerendering `/_global-error` (`useContext` of null). Unrelated to this feature; build passes with `NODE_ENV=production`.

## Known Issues
- shadcn's `SidebarProvider` writes a `sidebar_state` cookie on toggle; it is never read (state not persisted, per spec).

## Deviations from Plan
- Finding: a layout can't know its URL, so `requireUser()` in the layout would redirect with the wrong `next` and race the page's redirect -> plan.md Step 6 updated: `AuthedShell` uses request-cached `getCurrentUser()` and renders the page alone when there's no valid session; the page's `requireUser(path)` redirects. Sidebar still never renders without a verified user. -> Approved by: pending user review.
- Finding: active-state needs per-item exact matching (`/admin` vs `/admin/users`) -> `isActivePath` takes `{ exact }`; nav items have optional `exact`. plan.md Step 2 updated.
- Finding: generated `src/hooks/use-mobile.ts` failed lint (`react-hooks/set-state-in-effect`) -> rewritten with `useSyncExternalStore`, same export/behavior. -> Approved by: pending user review.
- Finding: `RoleSidebar` uses `buildCallbacks(...).onError` only (no success toast), as planned; the brand link comes from the config (`brand.href`) rather than `getRoleLandingRoute`, keeping all sidebar contents in one constants file.
- Spec/plan/shadcn files were in `stash@{0}` (stash left intact); restored with `git show`, not `stash pop`.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | lean-ctx | exploration, shell, tests |
| 1, 4 | shadcn | CLI add, sidebar composition (asChild, tooltip, isActive, collapsible icon) |
| — | find-skills | checked for UI skills; installed `shadcn` + `ui-ux-pro-max` already cover it, nothing new installed |
| 6 | Next 16 docs | route groups; `usePathname` under Cache Components needs Suspense (covered by layout boundary) |
| 7 | graphify | `graphify update .` after changes |

## Links
- Spec: docs/features/app-sidebar/spec.md
- Plan: docs/features/app-sidebar/plan.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite + build green (not just per-step tests)
- [ ] Every spec.md acceptance criterion met and verified (manual pass pending for UI ACs)
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests; baseline failures listed separately
- [x] task.md fully updated
- [ ] Commits documented (user commits)
- [x] No open blockers
- [x] Code follows project rules
- [ ] No unresolved plan deviations (two await user approval)
