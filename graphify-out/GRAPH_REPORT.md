# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 107 files · ~30,107 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 638 nodes · 1436 edges · 24 communities (22 shown, 2 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 146 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `596a862c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- auth-session.ts
- components.json
- api.helper.ts
- Implementation Steps
- dependencies
- RoleSidebar.tsx
- field.tsx
- requireUser
- README.md
- AGENTS.md
- sidebar.tsx
- Implementation: Auth Session (cookie-based BFF)
- Implementation Steps
- breadcrumb.tsx
- AuthCard.tsx
- RoleSidebar
- Cuewise FE — Project Instructions
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: App Sidebar (shared shell for user and admin)
- auth.routes.test.ts
- apiClient
- AppSidebar.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 34 edges
2. `Implementation Steps` - 31 edges
3. `next` - 19 edges
4. `cn` - 18 edges
5. `AuthForm()` - 18 edges
6. `useMutationCallbacks()` - 18 edges
7. `Functional` - 18 edges
8. `AuthCard()` - 17 edges
9. `requireUser()` - 17 edges
10. `proxy()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Implementation Steps` --references--> `normalizeError()`  [INFERRED]
  docs/features/auth-session/plan.md → src/lib/config/api.helper.ts

## Import Cycles
- None detected.

## Communities (24 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react (+25 more)

### Community 2 - "auth-session.ts"
Cohesion: 0.13
Nodes (29): Project Conventions, Testing Strategy, GET(), ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute() (+21 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "api.helper.ts"
Cohesion: 0.07
Nodes (47): Deviations recorded during /implement, nextConfig, next, ref_server_only, zod, POST(), POST(), POST() (+39 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.07
Nodes (49): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+41 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "RoleSidebar.tsx"
Cohesion: 0.16
Nodes (10): roleSchema, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR, NavItem, NavSection (+2 more)

### Community 8 - "field.tsx"
Cohesion: 0.10
Nodes (34): Known Issues, react-hook-form, Checkbox(), Field(), FieldDescription(), FieldError(), FieldLabel(), fieldVariants (+26 more)

### Community 9 - "requireUser"
Cohesion: 0.11
Nodes (20): Security & Auth, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement (+12 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.05
Nodes (42): class-variance-authority, cn, lucide-react, radix-ui, react, AuthedShell(), AuthedShellProps, getSessionUser() (+34 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 14 - "Implementation Steps"
Cohesion: 0.23
Nodes (6): Implementation Steps, Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, getInitials()

### Community 15 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 16 - "AuthCard.tsx"
Cohesion: 0.11
Nodes (30): Completed Steps, sonner, AuthCard(), AuthCardProps, COPY, AuthFormContainer(), handleSubmit(), SessionExpiredNotice() (+22 more)

### Community 17 - "RoleSidebar"
Cohesion: 0.43
Nodes (5): Completed Steps, Deviations from Plan, RoleSidebar(), isActivePath(), trimTrailingSlash()

### Community 18 - "Cuewise FE — Project Instructions"
Cohesion: 0.08
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+22 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 23 - "auth.routes.test.ts"
Cohesion: 0.11
Nodes (15): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock (+7 more)

### Community 25 - "AppSidebar.tsx"
Cohesion: 0.17
Nodes (21): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+13 more)

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 262 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `sidebar.tsx` to `package.json`, `api.helper.ts`, `field.tsx`, `requireUser`, `Implementation Steps`, `breadcrumb.tsx`, `AuthCard.tsx`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `next` connect `api.helper.ts` to `package.json`, `auth-session.ts`, `Implementation Steps`, `RoleSidebar.tsx`, `breadcrumb.tsx`, `AuthCard.tsx`, `Cuewise FE — Project Instructions`, `auth.routes.test.ts`, `AppSidebar.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `Implementation Steps` connect `Implementation Steps` to `auth-session.ts`, `api.helper.ts`, `field.tsx`, `requireUser`, `sidebar.tsx`, `AuthCard.tsx`, `Cuewise FE — Project Instructions`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._