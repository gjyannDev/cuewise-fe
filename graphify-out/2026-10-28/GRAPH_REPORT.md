# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 105 files · ~30,023 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 633 nodes · 1427 edges · 27 communities (25 shown, 2 thin omitted)
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
- auth.types.ts
- react
- useMutationCallbacks
- README.md
- AGENTS.md
- sidebar.tsx
- Implementation: Auth Session (cookie-based BFF)
- avatar.tsx
- breadcrumb.tsx
- AuthCard.tsx
- Implementation Steps
- app/layout.tsx
- AppSidebar.tsx
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: App Sidebar (shared shell for user and admin)
- dialog.tsx
- auth.routes.test.ts
- apiClient
- SidebarNavSection.tsx
- sheet.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 32 edges
2. `Implementation Steps` - 31 edges
3. `next` - 19 edges
4. `cn` - 18 edges
5. `AuthForm()` - 18 edges
6. `useMutationCallbacks()` - 18 edges
7. `Functional` - 18 edges
8. `AuthCard()` - 17 edges
9. `proxy()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Implementation Steps` --references--> `normalizeError()`  [INFERRED]
  docs/features/auth-session/plan.md → src/lib/config/api.helper.ts
- `Test Results` --references--> `SessionExpiredError`  [INFERRED]
  docs/features/auth-session/task.md → src/lib/config/backend.client.server.ts
- `Testing` --references--> `proxy()`  [INFERRED]
  CLAUDE.md → src/proxy.ts

## Import Cycles
- None detected.

## Communities (27 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (34): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react (+26 more)

### Community 2 - "auth-session.ts"
Cohesion: 0.14
Nodes (27): Project Conventions, Testing Strategy, GET(), ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired() (+19 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "api.helper.ts"
Cohesion: 0.07
Nodes (45): Deviations recorded during /implement, nextConfig, axios, next, ref_server_only, zod, POST(), POST() (+37 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.09
Nodes (39): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview, Project Rules Applied (+31 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "auth.types.ts"
Cohesion: 0.10
Nodes (25): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES, authCredentialsSchema, authFormSchemas (+17 more)

### Community 8 - "react"
Cohesion: 0.08
Nodes (42): Forms, Known Issues, cn, radix-ui, react, react-hook-form, Checkbox(), Field() (+34 more)

### Community 9 - "useMutationCallbacks"
Cohesion: 0.06
Nodes (38): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+30 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.16
Nodes (10): SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), SidebarProvider(), SidebarTrigger(), subscribe(), useIsMobile() (+2 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 14 - "avatar.tsx"
Cohesion: 0.24
Nodes (5): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, getInitials()

### Community 15 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 16 - "AuthCard.tsx"
Cohesion: 0.15
Nodes (22): Completed Steps, AuthCard(), AuthCardProps, COPY, AuthFormContainer(), handleSubmit(), SessionExpiredNotice(), SignInContent() (+14 more)

### Community 17 - "Implementation Steps"
Cohesion: 0.23
Nodes (11): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), RoleSidebar() (+3 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.16
Nodes (15): @tanstack/react-query, src_app_globals, metadata, RootLayout(), Providers(), ProvidersProps, TooltipProvider(), getQueryClient() (+7 more)

### Community 19 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (14): lucide-react, SidebarContent(), SidebarFooter(), SidebarHeader(), SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), useSidebar() (+6 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 22 - "dialog.tsx"
Cohesion: 0.19
Nodes (7): class-variance-authority, Button(), buttonVariants, DialogContent(), DialogFooter(), DialogOverlay(), DialogPortal()

### Community 23 - "auth.routes.test.ts"
Cohesion: 0.12
Nodes (14): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock, axiosErrorWith() (+6 more)

### Community 25 - "SidebarNavSection.tsx"
Cohesion: 0.21
Nodes (13): SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarMenu(), SidebarMenuItem(), src_lib_utils_cn, SIDEBAR_BRAND_CLASS, SIDEBAR_DANGER_ITEM_CLASS (+5 more)

### Community 26 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 261 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `api.helper.ts`, `useMutationCallbacks`, `sidebar.tsx`, `avatar.tsx`, `breadcrumb.tsx`, `AuthCard.tsx`, `Implementation Steps`, `app/layout.tsx`, `dialog.tsx`, `SidebarNavSection.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `next` connect `api.helper.ts` to `package.json`, `auth-session.ts`, `auth.types.ts`, `breadcrumb.tsx`, `AuthCard.tsx`, `app/layout.tsx`, `AppSidebar.tsx`, `auth.routes.test.ts`, `SidebarNavSection.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `Implementation Steps` connect `Implementation Steps` to `auth-session.ts`, `api.helper.ts`, `react`, `useMutationCallbacks`, `AuthCard.tsx`, `app/layout.tsx`, `dialog.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.057057057057057055 - nodes in this community are weakly interconnected._