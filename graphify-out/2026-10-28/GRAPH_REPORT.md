# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 80 files · ~21,017 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 482 nodes · 1062 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 108 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1fce5003`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- api.helper.ts
- components.json
- backend.client.server.ts
- Implementation Steps
- dependencies
- AuthForm.tsx
- field.tsx
- app/layout.tsx
- README.md
- AGENTS.md
- auth.routes.test.ts
- Implementation: Auth Session (cookie-based BFF)
- Cuewise FE — Project Instructions
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- AuthCard.tsx

## God Nodes (most connected - your core abstractions)
1. `Implementation Steps` - 31 edges
2. `react` - 24 edges
3. `AuthForm()` - 18 edges
4. `Functional` - 18 edges
5. `AuthCard()` - 17 edges
6. `next` - 16 edges
7. `proxy()` - 16 edges
8. `compilerOptions` - 16 edges
9. `Cuewise FE — Project Instructions` - 15 edges
10. `cn` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
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

## Communities (17 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (43): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react (+35 more)

### Community 2 - "api.helper.ts"
Cohesion: 0.09
Nodes (15): axios, sonner, MutationCallbackOptions, UseMutationCallbacksOptions, apiClient, ApiError, ApiErrorBody, conflictDetailsSchema (+7 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "backend.client.server.ts"
Cohesion: 0.12
Nodes (31): Deviations recorded during /implement, nextConfig, next, ref_server_only, zod, POST(), POST(), POST() (+23 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.07
Nodes (64): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+56 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "AuthForm.tsx"
Cohesion: 0.14
Nodes (19): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, backendTokenSchema (+11 more)

### Community 8 - "field.tsx"
Cohesion: 0.08
Nodes (40): cn, radix-ui, react, react-hook-form, Checkbox(), Field(), FieldDescription(), FieldError() (+32 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.15
Nodes (16): Data Fetching (TanStack Query), @tanstack/react-query, src_app_globals, metadata, RootLayout(), Providers(), ProvidersProps, TooltipProvider() (+8 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "auth.routes.test.ts"
Cohesion: 0.12
Nodes (14): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock, axiosErrorWith() (+6 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Known Issues, Links, Not verified automatically (manual browser check by the user), Open Questions (+5 more)

### Community 14 - "Cuewise FE — Project Instructions"
Cohesion: 0.12
Nodes (16): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT) (+8 more)

### Community 15 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 16 - "AuthCard.tsx"
Cohesion: 0.10
Nodes (23): class-variance-authority, AuthCard(), AuthCardProps, COPY, SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps (+15 more)

## Knowledge Gaps
- **165 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 203 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `field.tsx` to `package.json`, `api.helper.ts`, `backend.client.server.ts`, `app/layout.tsx`, `Cuewise FE — Project Instructions`, `AuthCard.tsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `next` connect `backend.client.server.ts` to `package.json`, `Implementation Steps`, `app/layout.tsx`, `auth.routes.test.ts`, `AuthCard.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `Implementation Steps` connect `Implementation Steps` to `api.helper.ts`, `backend.client.server.ts`, `field.tsx`, `app/layout.tsx`, `Cuewise FE — Project Instructions`, `AuthCard.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `AuthForm()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`AuthForm()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `Functional` (e.g. with `AuthForm()` and `FieldSet()`) actually correct?**
  _`Functional` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._