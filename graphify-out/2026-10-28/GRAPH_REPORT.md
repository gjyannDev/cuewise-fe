# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 140 files · ~42,776 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 800 nodes · 1993 edges · 27 communities (26 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 195 edges (avg confidence: 0.95)
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
- Implementation: App Sidebar (shared shell for user and admin)
- README.md
- AGENTS.md
- sidebar.tsx
- Implementation: Auth Session (cookie-based BFF)
- useMutationCallbacks
- next
- dialog.tsx
- Feature: App Sidebar (shared shell for user and admin)
- Feature: Interviews Setup UI (foundation)
- Implementation: Interviews Setup UI (foundation)
- vitest
- AuthForm
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- auth.types.ts
- devDependencies
- scripts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 44 edges
2. `Implementation Steps` - 31 edges
3. `Button()` - 24 edges
4. `useMutationCallbacks()` - 24 edges
5. `cn` - 22 edges
6. `Implementation Steps` - 21 edges
7. `next` - 20 edges
8. `Card()` - 20 edges
9. `InterviewConfigForm()` - 20 edges
10. `AuthForm()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Project Conventions` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/interviews-setup-ui/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (27 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "auth-session.ts"
Cohesion: 0.14
Nodes (26): Project Conventions, ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath() (+18 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "api.helper.ts"
Cohesion: 0.05
Nodes (62): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+54 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.24
Nodes (16): Implementation Steps, Acceptance Criteria, Functional, Project Conventions, FieldGroup(), FieldSet(), Toaster(), authKeys (+8 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.05
Nodes (84): Deviations During Implementation, Implementation Steps, Layout & UX Design, InterviewsContainer(), handleStart(), InterviewsContainerProps, InterviewsContent(), InterviewsPage() (+76 more)

### Community 8 - "react"
Cohesion: 0.05
Nodes (62): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+54 more)

### Community 9 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.05
Nodes (53): Avatar(), AvatarFallback(), Input(), Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay() (+45 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.21
Nodes (16): Completed Steps, Affected Files & Patterns, AuthFormContainer(), handleSubmit(), AuthFormContainerProps, ERROR_TITLES, ActionMode, BuildCallbackEffects (+8 more)

### Community 18 - "next"
Cohesion: 0.06
Nodes (41): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+33 more)

### Community 19 - "dialog.tsx"
Cohesion: 0.34
Nodes (12): Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogPortal() (+4 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.12
Nodes (16): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Setup UI (foundation), Functional, Goal (+8 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "vitest"
Cohesion: 0.07
Nodes (20): axios, ref_node_url, vitest, apiClient, API, CREDENTIALS, get, post (+12 more)

### Community 25 - "AuthForm"
Cohesion: 0.16
Nodes (17): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Overview (+9 more)

### Community 26 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 27 - "auth.types.ts"
Cohesion: 0.08
Nodes (31): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps (+23 more)

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

- **Why does `react` connect `react` to `package.json`, `api.helper.ts`, `InterviewConfigForm.tsx`, `sidebar.tsx`, `next`, `dialog.tsx`, `auth.types.ts`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `package.json`, `auth-session.ts`, `api.helper.ts`, `InterviewConfigForm.tsx`, `sidebar.tsx`, `useMutationCallbacks`, `vitest`, `auth.types.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `api.helper.ts`, `Implementation Steps`, `InterviewConfigForm.tsx`, `next`, `Feature: Interviews Setup UI (foundation)`, `AuthForm`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `auth.types.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _257 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._