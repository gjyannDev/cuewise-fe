# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 141 files · ~43,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 803 nodes · 2017 edges · 29 communities (28 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ddbffef4`
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
- InterviewConfigForm.tsx
- react
- current-user.server.ts
- README.md
- AGENTS.md
- sidebar.tsx
- Implementation: Auth Session (cookie-based BFF)
- useMutationCallbacks
- auth.types.ts
- Cuewise FE — Project Instructions
- avatar.tsx
- next
- Implementation Plan: Interviews Setup UI (foundation)
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Setup UI (foundation)
- vitest
- AuthForm
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- RoleSidebar.tsx
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
7. `InterviewConfigForm()` - 21 edges
8. `Implementation Steps` - 21 edges
9. `next` - 20 edges
10. `lucide-react` - 19 edges

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

## Communities (29 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, @hookform/resolvers, next-themes, react-dom, shadcn, sonner (+8 more)

### Community 2 - "auth-session.ts"
Cohesion: 0.07
Nodes (44): Project Conventions, Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Setup UI (foundation), Functional (+36 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "api.helper.ts"
Cohesion: 0.05
Nodes (51): Test Results, axios, ref_server_only, POST(), POST(), forward(), ForwardContext, OWNED_BY_NEXT (+43 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.29
Nodes (13): Implementation Steps, Acceptance Criteria, Functional, Project Conventions, FieldGroup(), FieldSet(), Toaster(), useCurrentProfileQuery() (+5 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.05
Nodes (89): Deviations During Implementation, Implementation Steps, Layout & UX Design, Deviations from Plan, lucide-react, zod, InterviewsContainer(), handleStart() (+81 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (52): cn, radix-ui, react, react-hook-form, badgeVariants, Checkbox(), Field(), FieldDescription() (+44 more)

### Community 9 - "current-user.server.ts"
Cohesion: 0.06
Nodes (44): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+36 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.06
Nodes (54): class-variance-authority, Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter() (+46 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+3 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.18
Nodes (19): Data Fetching (TanStack Query), Deviations recorded during /implement, Completed Steps, Affected Files & Patterns, Project Rules Applied, AuthFormContainer(), handleSubmit(), ActionMode (+11 more)

### Community 15 - "auth.types.ts"
Cohesion: 0.19
Nodes (13): AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES, authKeys, AuthCredentials, AuthFormMode (+5 more)

### Community 16 - "Cuewise FE — Project Instructions"
Cohesion: 0.14
Nodes (13): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT) (+5 more)

### Community 17 - "avatar.tsx"
Cohesion: 0.24
Nodes (5): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, getInitials()

### Community 18 - "next"
Cohesion: 0.10
Nodes (25): nextConfig, next, @tanstack/react-query, src_app_globals, metadata, RootLayout(), Providers(), ProvidersProps (+17 more)

### Community 19 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.11
Nodes (17): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock, axiosErrorWith() (+9 more)

### Community 25 - "AuthForm"
Cohesion: 0.18
Nodes (16): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied (+8 more)

### Community 26 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 27 - "RoleSidebar.tsx"
Cohesion: 0.23
Nodes (7): roleSchema, Role, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

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
- **257 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+252 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 309 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `api.helper.ts`, `InterviewConfigForm.tsx`, `current-user.server.ts`, `sidebar.tsx`, `avatar.tsx`, `next`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `package.json`, `auth-session.ts`, `api.helper.ts`, `InterviewConfigForm.tsx`, `current-user.server.ts`, `sidebar.tsx`, `auth.types.ts`, `vitest`, `RoleSidebar.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `Implementation Steps`, `InterviewConfigForm.tsx`, `current-user.server.ts`, `auth.types.ts`, `Cuewise FE — Project Instructions`, `AuthForm`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `RoleSidebar.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _257 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._