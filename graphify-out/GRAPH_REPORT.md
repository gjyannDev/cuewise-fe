# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 104 files · ~29,853 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 627 nodes · 1414 edges · 23 communities (21 shown, 2 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 146 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49f38db5`
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
- app/layout.tsx
- README.md
- AGENTS.md
- sidebar.tsx
- Implementation: Auth Session (cookie-based BFF)
- Cuewise FE — Project Instructions
- breadcrumb.tsx
- AuthCard.tsx
- devDependencies
- scripts
- eslint.config.mjs
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: App Sidebar (shared shell for user and admin)
- apiClient

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
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
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Implementation Steps` --references--> `normalizeError()`  [INFERRED]
  docs/features/auth-session/plan.md → src/lib/config/api.helper.ts
- `Testing` --references--> `proxy()`  [INFERRED]
  CLAUDE.md → src/proxy.ts

## Import Cycles
- None detected.

## Communities (23 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "auth-session.ts"
Cohesion: 0.15
Nodes (26): Project Conventions, Testing Strategy, GET(), ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired() (+18 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "api.helper.ts"
Cohesion: 0.05
Nodes (52): nextConfig, axios, next, ref_node_url, ref_server_only, vitest, zod, POST() (+44 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.06
Nodes (56): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+48 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "auth.types.ts"
Cohesion: 0.10
Nodes (25): Test Results, @hookform/resolvers, AuthedShellProps, getSessionUser(), AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, SessionExpiredError (+17 more)

### Community 8 - "react"
Cohesion: 0.07
Nodes (43): Forms, Known Issues, cn, radix-ui, react, react-hook-form, Checkbox(), Field() (+35 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.15
Nodes (16): Data Fetching (TanStack Query), @tanstack/react-query, src_app_globals, metadata, RootLayout(), Providers(), ProvidersProps, TooltipProvider() (+8 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.05
Nodes (58): Implementation Steps, Completed Steps, Deviations from Plan, lucide-react, AuthedShell(), AppLayout(), Avatar(), AvatarFallback() (+50 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+3 more)

### Community 14 - "Cuewise FE — Project Instructions"
Cohesion: 0.07
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT) (+22 more)

### Community 15 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 16 - "AuthCard.tsx"
Cohesion: 0.10
Nodes (24): class-variance-authority, AuthCard(), AuthCardProps, COPY, SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps (+16 more)

### Community 17 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 19 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 263 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `auth.types.ts`, `app/layout.tsx`, `sidebar.tsx`, `Cuewise FE — Project Instructions`, `breadcrumb.tsx`, `AuthCard.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `next` connect `api.helper.ts` to `package.json`, `auth-session.ts`, `Implementation Steps`, `auth.types.ts`, `app/layout.tsx`, `sidebar.tsx`, `breadcrumb.tsx`, `AuthCard.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Implementation Steps` connect `Implementation Steps` to `auth-session.ts`, `api.helper.ts`, `auth.types.ts`, `react`, `app/layout.tsx`, `Cuewise FE — Project Instructions`, `AuthCard.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._