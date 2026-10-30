# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 145 files · ~43,615 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 814 nodes · 2059 edges · 30 communities (29 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 202 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f87de933`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- Implementation Steps
- components.json
- auth.types.ts
- Button
- dependencies
- InterviewConfigForm.tsx
- react
- requireUser
- README.md
- AGENTS.md
- sidebar.tsx
- Implementation: Auth Session (cookie-based BFF)
- useMutationCallbacks
- Feature: Interviews Setup UI (foundation)
- Cuewise FE — Project Instructions
- getQueryClient
- breadcrumb.tsx
- Implementation Plan: Interviews Setup UI (foundation)
- Feature: App Sidebar (shared shell for user and admin)
- AuthCard
- Implementation: Interviews Setup UI (foundation)
- vitest
- app/layout.tsx
- AuthFormContainer
- lucide-react
- devDependencies
- scripts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 45 edges
2. `Implementation Steps` - 31 edges
3. `Button()` - 24 edges
4. `useMutationCallbacks()` - 24 edges
5. `cn` - 22 edges
6. `Card()` - 22 edges
7. `next` - 21 edges
8. `InterviewConfigForm()` - 21 edges
9. `Implementation Steps` - 21 edges
10. `lucide-react` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Project Conventions` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/interviews-setup-ui/spec.md → src/hooks/use-mutation-callback.ts
- `Implementation Steps` --references--> `normalizeError()`  [INFERRED]
  docs/features/auth-session/plan.md → src/lib/config/api.helper.ts
- `Test Results` --references--> `SessionExpiredError`  [INFERRED]
  docs/features/auth-session/task.md → src/lib/config/backend.client.server.ts

## Import Cycles
- None detected.

## Communities (30 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "Implementation Steps"
Cohesion: 0.06
Nodes (67): Project Conventions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+59 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "auth.types.ts"
Cohesion: 0.05
Nodes (63): Deviations recorded during /implement, nextConfig, axios, @hookform/resolvers, next, ref_server_only, POST(), POST() (+55 more)

### Community 5 - "Button"
Cohesion: 0.30
Nodes (14): Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+6 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.05
Nodes (83): Implementation Steps, Deviations from Plan, zod, InterviewsContainer(), handleStart(), InterviewsContainerProps, InterviewsContent(), InterviewsPage() (+75 more)

### Community 8 - "react"
Cohesion: 0.07
Nodes (53): Forms, Known Issues, Architecture & Design, class-variance-authority, cn, radix-ui, react, react-hook-form (+45 more)

### Community 9 - "requireUser"
Cohesion: 0.06
Nodes (39): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+31 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.06
Nodes (49): Avatar(), AvatarFallback(), FieldSeparator(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetHeader() (+41 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.18
Nodes (12): Architecture: Modular, Feature-Driven, Data Fetching (TanStack Query), Skills Consulted, Project Rules Applied, ActionMode, BuildCallbackEffects, getErrorMessage(), runEffects() (+4 more)

### Community 15 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 16 - "Cuewise FE — Project Instructions"
Cohesion: 0.15
Nodes (12): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth (+4 more)

### Community 17 - "getQueryClient"
Cohesion: 0.27
Nodes (9): @tanstack/react-query, Providers(), ProvidersProps, getQueryClient(), makeQueryClient(), shouldRetry(), AppToaster(), AppToasterProps (+1 more)

### Community 18 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 19 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.20
Nodes (9): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Layout & UX Design, Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "AuthCard"
Cohesion: 0.33
Nodes (8): AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage(), SignUpPageProps

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.08
Nodes (18): ref_node_url, vitest, apiClient, CREDENTIALS, get, post, PROFILE, fetchMock (+10 more)

### Community 24 - "app/layout.tsx"
Cohesion: 0.36
Nodes (6): src_app_globals, metadata, RootLayout(), TooltipProvider(), inter, roboto_slab

### Community 25 - "AuthFormContainer"
Cohesion: 0.67
Nodes (6): Completed Steps, Affected Files & Patterns, AuthFormContainer(), handleSubmit(), parseApiError(), authRouteHref()

### Community 27 - "lucide-react"
Cohesion: 0.12
Nodes (19): Deviations During Implementation, lucide-react, roleSchema, Role, RoleHeaderTitle(), RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR (+11 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **259 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+254 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 312 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `auth.types.ts`, `Button`, `InterviewConfigForm.tsx`, `requireUser`, `sidebar.tsx`, `getQueryClient`, `breadcrumb.tsx`, `AuthCard`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `next` connect `auth.types.ts` to `package.json`, `Implementation Steps`, `InterviewConfigForm.tsx`, `sidebar.tsx`, `breadcrumb.tsx`, `vitest`, `app/layout.tsx`, `lucide-react`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `Implementation Steps`, `auth.types.ts`, `InterviewConfigForm.tsx`, `requireUser`, `Feature: Interviews Setup UI (foundation)`, `AuthFormContainer`, `lucide-react`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _259 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._