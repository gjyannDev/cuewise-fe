# Feature: App Sidebar (shared shell for user and admin)

## Problem
Signed-in pages have no navigation. Users and admins need one consistent way to move around and sign out. Both roles must look and behave the same. Only the menu contents differ, and those must be easy to change without touching component code.

## Goal
One reusable sidebar shell wraps every signed-in page (user and admin). What it lists comes from a per-role constants file, and editing that file is the only step needed to add, remove, rename or re-icon a nav item.

## Project Conventions
- Rule files consulted: root `CLAUDE.md` and `AGENTS.md` (no `.claude/rules/` in this repo).
- Constraints those rules impose on this feature:
  - Next.js 16: read `node_modules/next/dist/docs/` before writing layout/route code. `cacheComponents` and `partialPrefetching` are on, so anything reading cookies (the session check) must sit behind a `<Suspense>` boundary.
  - Layers: service → query → component. Components are dumb; the sidebar is presentational, and the container owns the logout mutation.
  - shadcn primitives come from the CLI, never hand-written, and `components/ui/*` is not edited for one-off styling.
  - Theme tokens only (existing `--sidebar-*` tokens cover light and dark); no hardcoded colors.
  - Feature-agnostic building blocks live in `shared/`; role/nav specifics live in a feature module.
  - Auth is a BFF: the browser only ever receives the profile, never the token. Mutation toasts go through `useMutationCallbacks`; errors are normalized, never raw.
  - Tests live under root `tests/` mirroring `src/`. Do not commit or push.
- graphify findings: role routing is centralized in `auth-session.ts` (`getRoleLandingRoute`, `canRoleAccessRoute`, `SIGNIN_ROUTE`); `requireUser()` and `useLogoutMutation` already exist; roles are `admin | user`; `TooltipProvider` is already mounted in the root layout.

## User Flow
1. A signed-in user opens `/`. They see the shell: sidebar on the left, a header with a collapse trigger, and the page content.
2. They click a nav item. The page changes and the clicked item shows as active.
3. They collapse the sidebar to an icon rail to get more room, and expand it again.
4. On a phone, the sidebar is hidden. They open it from the header trigger, tap a link, and the panel closes as the page changes.
5. They click **Sign out**. They land on `/signin` and can no longer open protected pages.
6. An admin opens `/admin` and sees the same shell with admin items.

## Requirements

### Functional
- A single reusable shell (sidebar + header trigger + content area) is used by both roles. The role decides only which items are listed.
- Contents per role are defined as constants (title, href, icon), grouped into a main group and a secondary group:

  | | Main group | Secondary group |
  |---|---|---|
  | **User** | Dashboard `/`, AI Mock Interview `/interviews`, History `/history`, Progress `/progress` | Settings `/settings`, Sign out |
  | **Admin** | Dashboard `/admin`, Users `/admin/users`, Questions `/admin/questions` | Settings `/admin/settings`, Sign out |

- Header of the sidebar shows the Cuewise brand, linking to the role's landing page.
- Footer shows an avatar (initials fallback) with the signed-in user's email and role.
- The current page's item is marked active; nested pages keep their section item active.
- Sign out ends the session, clears client cache and sends the user to `/signin`.
- Items are plain links. Pages that don't exist yet simply 404 until built.
- An `/admin` landing page and the existing `/` page both render inside the shell.

### Non-Functional
- Only `{ email, role }` reaches the browser for the sidebar; no token, no extra client fetch for the profile.
- Role is taken from the server-verified profile, not trusted from the client.
- Shell must work with Cache Components: session check streams behind a loading fallback, and `npm run build` passes.
- No hardcoded colors; light and dark both follow the existing sidebar tokens.

## UX Requirements
- Desktop: collapsible to an icon rail. Collapsed items show a tooltip with their title. Toggle via header trigger and the keyboard shortcut (Ctrl/Cmd+B).
- Mobile: sidebar is an overlay panel opened from the header trigger; it closes after navigating.
- Sign out is visually distinct (destructive tone), shows a pending state, and cannot be double-submitted.
- Long emails truncate on one line and don't break the layout.
- A skeleton of the shell shows while the session is being checked.
- Accessibility: sidebar is a labelled navigation landmark; the active item exposes `aria-current="page"`; all controls are keyboard-operable with visible focus; the trigger has an accessible name.

## Constraints
- Reuse the shadcn `sidebar` primitive and the existing theme tokens.
- No logo asset exists; a text wordmark is used until one is provided.
- Open/closed state is not persisted: always default open on desktop load.
- No nested/collapsible sub-menus now: no current item needs them.
- Browser support: whatever the app already targets; no extra requirement.

## Blockers
- None blocking. Assumption to confirm: **AI Mock Interview** lives at `/interviews` (chosen slug; change in the constants if the page ends up elsewhere).

## Edge Cases
Format: condition -> expected outcome.

- **EC1:** Logout request fails (network or server error) -> error toast with the normalized message, user stays signed in on the same page, Sign out is re-enabled for retry.
- **EC2:** Nav item points to a page that doesn't exist yet -> normal navigation to the app's 404 page; sidebar stays rendered where the route is inside the shell group.
- **EC3:** No session or an expired/dead session when a shell page loads -> existing redirect behavior (`/signin` or session-expired with `next`); the sidebar is never shown to an unauthenticated visitor.
- **EC4:** User's email is very long -> truncated to one line, full value available on hover; sidebar width unchanged.
- **EC5:** Deep path such as `/admin/users/123` -> **Users** item is active and **Dashboard** (`/admin`) is not.
- **EC6:** Admin opens a user route like `/` -> admin sidebar is shown (config is chosen by role only); no item is active because `/` is not in the admin list.
- **EC7:** Sidebar collapsed to icon rail -> labels hidden, each icon shows a tooltip on hover/focus, footer shows the avatar only, Sign out remains reachable.
- **EC8:** Mobile viewport, user taps a nav link -> navigation happens and the overlay panel closes.
- **EC9:** Sign out clicked twice quickly -> only one logout request is sent.
- **EC10:** Sign out succeeds -> client cache is cleared, user lands on `/signin`; pressing Back and opening a protected page redirects to `/signin` again.
- **EC11:** Non-admin tries `/admin/*` -> existing proxy redirect to the user's landing page; the sidebar does not change this behavior.
- **EC12:** Slow session check -> shell skeleton shows, then the real shell replaces it with no console errors or hydration warnings.

## Acceptance Criteria
- [ ] **AC1:** For a `user` session on `/`, the sidebar lists exactly: Dashboard, AI Mock Interview, History, Progress (main group); Settings and Sign out (secondary group), with the paths from the table above.
- [ ] **AC2:** For an `admin` session on `/admin`, the sidebar lists exactly: Dashboard, Users, Questions (main group); Settings and Sign out (secondary group), with the paths from the table above.
- [ ] **AC3:** Both roles render through the same shell component; changing a title, href, icon or order in the constants file changes the sidebar with no component edits.
- [ ] **AC4:** The item whose href matches the current path (exact for a landing page, prefix for nested pages) is highlighted and has `aria-current="page"`; no other item does (EC5, EC6).
- [ ] **AC5:** The footer shows the signed-in user's email and role, with an initials avatar fallback; long emails truncate (EC4).
- [ ] **AC6:** Clicking Sign out calls logout once, clears the client cache, and lands the user on `/signin` (EC9, EC10).
- [ ] **AC7:** When logout fails, an error toast shows, the user stays on the page, and Sign out works again on retry (EC1).
- [ ] **AC8:** On desktop, the header trigger and Ctrl/Cmd+B toggle the sidebar between expanded and icon-rail states; collapsed items show tooltips (EC7).
- [ ] **AC9:** Below the mobile breakpoint, the sidebar is hidden until the trigger is used, opens as an overlay, and closes after a link is tapped (EC8).
- [ ] **AC10:** Sidebar colors come only from theme tokens and render correctly in light and dark themes.
- [ ] **AC11:** A signed-out or expired visitor to a shell page is redirected as today and never sees the sidebar; a skeleton shows while the session is checked (EC3, EC12).
- [ ] **AC12:** `/` (user) and `/admin` (admin) render inside the shell; the non-admin redirect from `/admin` is unchanged (EC11).
- [ ] **AC13:** The sidebar is a labelled `nav` landmark, all items and controls are reachable and operable by keyboard with visible focus.
- [ ] **AC14:** Unit tests cover the active-path rule and the nav config integrity (unique keys, every href starts with `/`, all admin hrefs are under `/admin`, no user-only paths in the admin config); `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build` all pass.

## Out of Scope
- Nested/collapsible sub-menus: no listed item needs them; add when one does.
- Building the pages behind the nav items (interviews, history, progress, settings, users, questions): they 404 until separate features add them.
- Persisting sidebar open/closed state across loads: adds a cookie read to the shell for little value.
- Permission-based item hiding (using `permissions[]`): items are chosen by role only for now.
- Notifications item, search, theme switcher and real logo asset: not requested.
- Changing auth, `proxy.ts` or the role/landing-route rules.
