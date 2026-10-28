# Implementation Plan: App Sidebar (shared shell for user and admin)

## Overview
Add one reusable shadcn-based sidebar shell, used by both roles, whose menu contents come from per-role constants. Spec: `docs/features/app-sidebar/spec.md`.

## Architecture & Design
- Generic, role-agnostic UI lives in `shared/sidebar/` (presentational: receives sections, user and callbacks via props). Role knowledge (which items, role labels) lives in `modules/navigation/`.
- Data flow: a server component in the new `(app)` route group verifies the session (`requireUser`) behind `<Suspense>` and passes only `{ email, role }` to a client container (`RoleSidebar`). The container picks the config for that role, owns the logout mutation, and renders the presentational sidebar.
- The config holds icon components (functions), so it is imported inside the client container, never passed from server to client as props.
- `AppShell` is a slot-based layout piece: sidebar slot, header with trigger, content area. It has no hooks, so it stays a Server Component; the shadcn provider is the only client boundary it needs.
- Sign out is the same for every role, so it is rendered by the sidebar itself (end of the last section), not listed in the config.
- Pure logic (active-path rule, initials, config) is kept in plain functions and constants so it is unit-testable in the project's node-only Vitest setup.

## Spec Requirements -> Implementation
- AC1, AC2, AC3 (item lists, shared shell, edit-only-constants) -> Steps 3, 4, 6
- AC4, EC5, EC6 (active state) -> Steps 2, 4
- AC5, EC4 (footer card, truncation) -> Steps 2, 4
- AC6, AC7, EC1, EC9, EC10 (sign out) -> Step 5
- AC8, AC9, EC7, EC8 (icon rail, mobile overlay) -> Step 4
- AC10 (theme tokens, light and dark) -> Steps 1, 4
- AC11, AC12, EC2, EC3, EC11, EC12 (session check, route group, skeleton) -> Step 6
- AC13 (accessibility) -> Step 4
- AC14 (tests and gates) -> Steps 2, 3, 7

## Implementation Steps
1. **Add shadcn primitives.** Run the CLI for `sidebar` and `avatar` (it brings `sheet`, `skeleton`, `input` and the mobile hook as needed). Decline overwriting existing `tooltip`/`separator`; review the diff to `globals.css` so no duplicate `--sidebar-*` tokens appear. No hand edits to `components/ui/*`. — Test: skip (generated; verified by typecheck and build)
2. **Types and pure helpers** in `shared/sidebar/`: nav types (leaf item, section, config), `isActivePath` (exact match for landing pages such as `/` and `/admin`, prefix match with a `/` boundary for nested pages) and `getInitials` (from email, safe on odd input). — Test: first. Seams (user-confirmed): `isActivePath(pathname, href, { exact })` and `getInitials(email)`. Landing items opt into exact matching via an `exact` flag on the nav item. Slices: exact match; nested path keeps parent active (EC5); sibling prefix does not match (`/history` vs `/history-old`); `/` matches only `/`; `/admin` not active on `/admin/users` when the item is a landing page (EC5); trailing slash; initials from a normal email; empty or odd email.
3. **Navigation constants** in `modules/navigation/navigation.constants.ts`: user and admin configs (main group, then secondary group with Settings), a role-to-config map, and role display labels. Icons from the already-installed lucide set. — Test: first. Seam (user-confirmed): the exported role-to-config constant. Slices: user lists exactly the AC1 items and hrefs in order; admin lists exactly the AC2 items and hrefs; keys unique within each config; every href starts with `/`; every admin href is under `/admin`; no user-only paths appear in the admin config (EC6); every role in the role schema has a config.
4. **Presentational components** in `shared/sidebar/`: `AppSidebar` (brand header, sections separated by a divider, Sign out, footer), `SidebarNavSection` (item list; marks active via `isActivePath` and `usePathname`; closes the mobile overlay on click), `SidebarUserCard` (avatar with initials fallback, truncated email, role label), `AppShell` (provider, sidebar slot, inset with header trigger), `AppShellSkeleton`. Use `collapsible="icon"` with tooltips on items, theme tokens only, `aria-current="page"` on the active link, a labelled nav landmark, and an accessible name on the trigger. Follow the existing `shared/ui` conventions (named export, `type <Name>Props`, `cn()`). — Test: after (UI behavior; manual browser check, no component test infra)
5. **Container** `modules/navigation/components/RoleSidebar.tsx` (client): picks config by role, passes the brand link from the existing landing-route helper, runs the logout mutation through `useMutationCallbacks` (error toast only, no success toast), then replaces the route with the sign-in route. Disabled and pending while the request is in flight (single request). On failure it stays put and re-enables. — Test: after (depends on real logout handler and redirect behavior)
6. **Route group** `src/app/(app)/`: move `app/page.tsx` into it (URL stays `/`), add a thin `layout.tsx` that wraps a route-private async `_components/AuthedShell.tsx` in Suspense with `AppShellSkeleton`; `AuthedShell` calls the request-cached `getCurrentUser()` and renders `AppShell` with `RoleSidebar`; with no valid session it renders the page alone and lets the page's `requireUser(path)` redirect (a layout doesn't know its URL, so it can't build `next`). *(Deviation from the original plan, see task.md.)* Add a minimal `admin/page.tsx` placeholder. Leave `proxy.ts` and the existing page-level `requireUser` untouched (request-cached, so the repeat is free). — Test: after (Cache Components and redirect behavior must be observed for real)
7. **Verify and finish.** Run typecheck, lint, tests, and `npm run build`; do the manual browser pass listed below; run `graphify update .`. No commit or push. — Test: skip

## Affected Files & Patterns
- New: `src/components/ui/sidebar.tsx` plus its CLI dependencies, `src/hooks/use-mobile.ts`; `src/shared/sidebar/*`; `src/modules/navigation/navigation.constants.ts`, `src/modules/navigation/components/RoleSidebar.tsx`; `src/app/(app)/layout.tsx`, `_components/AuthedShell.tsx`, `admin/page.tsx`.
- Moved: `src/app/page.tsx` -> `src/app/(app)/page.tsx`.
- Possibly touched by the CLI: `src/app/globals.css` (review only), `components.json` (should not change).
- Reuse: `requireUser`, `useLogoutMutation`, `useMutationCallbacks`, `SIGNIN_ROUTE`, `getRoleLandingRoute`, `roleSchema`/`Role` type, `cn()`, existing `--sidebar-*` tokens, `(auth)/_components` as the route-private component pattern.
- Tests (mirror `src/`): `tests/shared/sidebar/utils/is-active-path.test.ts`, `tests/shared/sidebar/utils/get-initials.test.ts`, `tests/modules/navigation/navigation.constants.test.ts`. File names follow the util file names chosen in Step 2.
- Risks:
  - The shadcn provider writes a `sidebar_state` cookie on toggle; we never read it, so nothing persists (matches the spec). Harmless but present.
  - Moving the home page into a group must not change its URL or break `proxy.ts` matching.
  - Next 16 / Cache Components: cookie access outside Suspense fails the build; read the Next docs for layouts before Step 6.
  - Placeholder links (`/interviews`, `/history`, ...) 404 by design until their features exist.

## Testing Strategy
- Framework and commands: Vitest in a node environment, `npm test` (or `npm test -- tests/shared/sidebar`); `npx tsc --noEmit`; `npm run lint`; `npm run build`. Tests are `tests/**/*.test.ts` only. No jsdom or testing-library is installed, and none will be added (user-confirmed).
- Coverage map:

| Spec ID | Step | Test mode | Notes |
|---------|------|-----------|-------|
| AC1 | 3 | first | exact item list and hrefs for user |
| AC2 | 3 | first | exact item list and hrefs for admin |
| AC3 | 3, 4 | first / after | config-only edits; manual: change a title and see it update |
| AC4 | 2, 4 | first / after | rule unit-tested; `aria-current` checked in browser |
| AC5 | 2, 4 | first / after | initials unit-tested; truncation checked in browser |
| AC6 | 5 | after | single request, cache cleared, lands on `/signin` |
| AC7 | 5 | after | simulate failure; toast, stays, retry works |
| AC8 | 4 | after | trigger, Ctrl/Cmd+B, tooltips on the rail |
| AC9 | 4 | after | narrow viewport; overlay opens and closes |
| AC10 | 1, 4 | after | toggle light and dark; no hardcoded colors (review diff) |
| AC11 | 6 | after | signed-out visit redirects; skeleton visible on throttled load |
| AC12 | 6 | after | `/` as user, `/admin` as admin; non-admin redirect unchanged (existing `tests/proxy.test.ts`) |
| AC13 | 4 | after | keyboard-only pass, focus visible, landmark and names |
| AC14 | 2, 3, 7 | first / skip | unit tests plus all four gates |
| EC1 | 5 | after | force logout failure (offline or stubbed 500) |
| EC2 | 6 | after | visit an unbuilt link; app 404 shown |
| EC3 | 6 | after | no cookie and expired cookie |
| EC4 | 2, 4 | after | very long email |
| EC5 | 2 | first | nested path slice |
| EC6 | 2, 3 | first | admin on `/`: no item active; no user-only paths in admin config |
| EC7 | 4 | after | collapsed rail: tooltips, avatar-only footer, Sign out reachable |
| EC8 | 4 | after | mobile link tap closes overlay |
| EC9 | 5 | after | double click sends one request (network tab) |
| EC10 | 5 | after | after sign out, Back then a protected URL redirects |
| EC11 | 6 | after | covered by existing proxy tests; re-confirm manually |
| EC12 | 6 | after | no console or hydration warnings |

- Must verify, not assume: Cache Components accepting the Suspense-wrapped cookie read in a layout; logout redirect and cache clearing against the real `/api/auth/logout`; shadcn sidebar's mobile overlay closing on link click; the CLI's effect on `globals.css`.
- Manual browser pass (run the dev server, use the browser tools): user and admin accounts, desktop and narrow width, light and dark, keyboard only.
- Open questions: none. All ECs have outcomes in the spec.
- Known baseline failures: not checked during planning; `/implement` runs `npm test` before changing anything.

## Blockers & Resolutions
- `/interviews` slug is an assumption -> single constant to change; no code depends on it.
- No logo asset -> text wordmark in the brand header.
- Component tests impossible without new deps -> user chose manual verification; logic extracted into pure functions so it is still unit-tested.
- Spec EC2 sidebar behavior on 404 -> an unmatched route renders the app's 404 outside the `(app)` group; accept this, the spec only requires the shell where the route is inside the group.

## Trade-offs & Rationale
- Suspense around the whole shell (not just the sidebar) -> AC11 requires an unauthenticated visitor never sees the sidebar; the cost is that page content also waits on the session check, which it does anyway via its own `requireUser`.
- Server layout passes `{ email, role }` as props rather than a client profile query -> no flash or loading state in the footer, and the role is server-verified. The profile query exists but is not needed here.
- Sign out not in the config -> identical for every role, and it is an action, not a link; keeps the config pure data.
- Sections as an array of groups -> lets "main" and "secondary" be edited like any other list without layout code knowing their names.
- Nested/collapsible menus omitted -> nothing in the spec uses them (YAGNI); the item type can gain `children` later.
- No new dependencies -> everything needed is already installed (Radix via `radix-ui`, lucide, shadcn CLI).

## Project Rules Applied
- Root `CLAUDE.md` -> layers (service -> query -> component), dumb presentational components, shared vs module placement, theme tokens only, shadcn via CLI, tests mirrored under `tests/`, no commit or push, run `graphify update .` after changes, read Next 16 docs before routing code.
- Root `AGENTS.md` -> Next.js APIs differ from training data; check `node_modules/next/dist/docs/` first.

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| lean-ctx | repo tree, auth/session helpers, Vitest config, existing `useMutationCallbacks` and providers |
| graphify | role routing helpers and existing auth/session modules (reused from the spec phase) |
| grill-me (via AskUserQuestion) | confirmed the three test seams and the no-new-deps UI verification approach |

## Ready to Implement
- All spec requirements mapped to steps
- Every step has a Test tag; every AC#/EC# mapped in Testing Strategy
- Affected files identified
- Blockers resolved, edge cases handled
- Trade-offs documented with rationale
- No deviations from spec
