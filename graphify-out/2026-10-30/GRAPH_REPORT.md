# Graph Report - cuewise-fe  (2026-10-30)

## Corpus Check
- 157 files · ~51,885 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 898 nodes · 2315 edges · 34 communities (33 shown, 1 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 276 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7d6f77de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- Implementation Steps
- components.json
- auth-session.ts
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm.tsx
- field.tsx
- current-user.server.ts
- README.md
- AGENTS.md
- sidebar.tsx
- interviews.types.ts
- useMutationCallbacks
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- Cuewise FE — Project Instructions
- AppSidebar.tsx
- breadcrumb.tsx
- Implementation Steps
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Setup UI (foundation)
- vitest
- Implementation Plan: App Sidebar (shared shell for user and admin)
- avatar.tsx
- sidebar.types.ts
- devDependencies
- auth.types.ts
- scripts
- eslint.config.mjs
- requireUser
- AppShell
- RoleSidebar.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 47 edges
2. `useMutationCallbacks()` - 33 edges
3. `Implementation Steps` - 31 edges
4. `Button()` - 28 edges
5. `Card()` - 26 edges
6. `InterviewConfigForm()` - 24 edges
7. `CardContent()` - 23 edges
8. `cn` - 22 edges
9. `lucide-react` - 22 edges
10. `next` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Project Conventions` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/interviews-setup-ui/spec.md → src/hooks/use-mutation-callback.ts
- `Implementation Steps` --references--> `normalizeError()`  [INFERRED]
  docs/features/auth-session/plan.md → src/lib/config/api.helper.ts

## Import Cycles
- None detected.

## Communities (34 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, class-variance-authority, next-themes, react-dom, shadcn, sonner (+8 more)

### Community 2 - "Implementation Steps"
Cohesion: 0.07
Nodes (50): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+42 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "auth-session.ts"
Cohesion: 0.09
Nodes (41): Project Conventions, Deviations recorded during /implement, Completed Steps, nextConfig, next, POST(), AuthCardProps, COPY (+33 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.08
Nodes (65): UX Requirements, Implementation Steps, Layout & UX Design, Deviations from Plan, lucide-react, react, ActiveInterviewProps, InterviewsContainerProps (+57 more)

### Community 8 - "field.tsx"
Cohesion: 0.06
Nodes (59): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+51 more)

### Community 9 - "current-user.server.ts"
Cohesion: 0.25
Nodes (10): ref_server_only, AuthedShellProps, getSessionUser(), ApiErrorBody, axios, AxiosRequestConfig, backendApi, SessionExpiredError (+2 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.13
Nodes (14): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+6 more)

### Community 13 - "interviews.types.ts"
Cohesion: 0.06
Nodes (48): @hookform/resolvers, InterviewsContent(), InterviewsPage(), InterviewsPageProps, AnswerFormProps, ANSWER_MAX_LENGTH, COMPLETED_FALLBACK_TEXT, DEFAULT_START_VALUES (+40 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.06
Nodes (56): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview (+48 more)

### Community 15 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (27): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Goal, Non-Functional (+19 more)

### Community 16 - "Cuewise FE — Project Instructions"
Cohesion: 0.07
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+22 more)

### Community 17 - "AppSidebar.tsx"
Cohesion: 0.19
Nodes (19): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+11 more)

### Community 18 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 19 - "Implementation Steps"
Cohesion: 0.30
Nodes (9): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), RoleSidebar() (+1 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Links, Open Questions, Skills Consulted During Implementation, Status, Test Cases (+3 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.07
Nodes (20): axios, ref_node_url, vitest, apiClient, API, CREDENTIALS, get, post (+12 more)

### Community 25 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.18
Nodes (10): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 26 - "avatar.tsx"
Cohesion: 0.22
Nodes (6): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 27 - "sidebar.types.ts"
Cohesion: 0.21
Nodes (11): Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig, findActiveNavItem() (+3 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "auth.types.ts"
Cohesion: 0.07
Nodes (44): zod, POST(), POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SessionExpiredNotice() (+36 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 32 - "requireUser"
Cohesion: 0.39
Nodes (6): Architecture & Design, AdminHome(), AdminHomeContent(), Home(), HomeContent(), requireUser()

### Community 33 - "AppShell"
Cohesion: 0.43
Nodes (6): Known Issues, SidebarInset(), SidebarProvider(), SidebarTrigger(), AppShell(), AppShellProps

### Community 34 - "RoleSidebar.tsx"
Cohesion: 0.23
Nodes (7): Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

## Knowledge Gaps
- **290 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 346 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `InterviewConfigForm.tsx` to `requireUser`, `package.json`, `AppShell`, `field.tsx`, `current-user.server.ts`, `sidebar.tsx`, `interviews.types.ts`, `useMutationCallbacks`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`, `breadcrumb.tsx`, `Implementation Steps`, `avatar.tsx`, `auth.types.ts`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `Implementation Steps`, `RoleSidebar.tsx`, `auth-session.ts`, `InterviewConfigForm.tsx`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `Cuewise FE — Project Instructions`, `Implementation Steps`, `Implementation Plan: App Sidebar (shared shell for user and admin)`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `next` connect `auth-session.ts` to `package.json`, `RoleSidebar.tsx`, `InterviewConfigForm.tsx`, `current-user.server.ts`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`, `breadcrumb.tsx`, `vitest`, `sidebar.types.ts`, `auth.types.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Card()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Card()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _290 weakly-connected nodes found - possible documentation gaps or missing edges._