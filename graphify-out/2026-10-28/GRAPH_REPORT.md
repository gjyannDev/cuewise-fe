# Graph Report - cuewise-fe  (2026-10-28)

## Corpus Check
- 80 files · ~21,095 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 487 nodes · 1071 edges · 20 communities (19 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 108 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1fce5003`
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
- AuthForm.tsx
- field.tsx
- app/layout.tsx
- README.md
- AGENTS.md
- auth.routes.test.ts
- Implementation: Auth Session (cookie-based BFF)
- Cuewise FE — Project Instructions
- breadcrumb.tsx
- react
- devDependencies
- scripts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `Implementation Steps` - 31 edges
2. `react` - 23 edges
3. `AuthForm()` - 18 edges
4. `Functional` - 18 edges
5. `AuthCard()` - 17 edges
6. `next` - 16 edges
7. `proxy()` - 16 edges
8. `compilerOptions` - 16 edges
9. `Cuewise FE — Project Instructions` - 15 edges
10. `cn` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Implementation Steps` --references--> `normalizeError()`  [INFERRED]
  docs/features/auth-session/plan.md → src/lib/config/api.helper.ts
- `Testing` --references--> `proxy()`  [INFERRED]
  CLAUDE.md → src/proxy.ts
- `Architecture & Design` --references--> `AuthForm()`  [INFERRED]
  docs/features/auth-session/plan.md → src/app/(auth)/_components/AuthForm.tsx
- `Overview` --references--> `AuthForm()`  [INFERRED]
  docs/features/auth-session/plan.md → src/app/(auth)/_components/AuthForm.tsx

## Import Cycles
- None detected.

## Communities (20 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, lucide-react, next-themes, react-dom, shadcn, sonner (+8 more)

### Community 2 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): GET(), canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath(), PUBLIC_AUTH_ROUTES (+17 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "api.helper.ts"
Cohesion: 0.06
Nodes (49): Security & Auth, Deviations recorded during /implement, Test Results, nextConfig, next, ref_server_only, zod, POST() (+41 more)

### Community 5 - "Implementation Steps"
Cohesion: 0.08
Nodes (43): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+35 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "AuthForm.tsx"
Cohesion: 0.15
Nodes (18): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, currentProfileSchema (+10 more)

### Community 8 - "field.tsx"
Cohesion: 0.08
Nodes (37): cn, radix-ui, react-hook-form, Checkbox(), Field(), FieldDescription(), FieldError(), FieldLabel() (+29 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.15
Nodes (17): Testing Strategy, @tanstack/react-query, src_app_globals, metadata, RootLayout(), Providers(), ProvidersProps, Toaster() (+9 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "auth.routes.test.ts"
Cohesion: 0.11
Nodes (15): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock (+7 more)

### Community 13 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+3 more)

### Community 14 - "Cuewise FE — Project Instructions"
Cohesion: 0.09
Nodes (22): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+14 more)

### Community 15 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 16 - "react"
Cohesion: 0.09
Nodes (29): Completed Steps, class-variance-authority, react, AuthCard(), AuthCardProps, COPY, AuthFormContainer(), handleSubmit() (+21 more)

### Community 17 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 19 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **169 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+164 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 207 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `api.helper.ts`, `field.tsx`, `app/layout.tsx`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `next` connect `api.helper.ts` to `package.json`, `auth-session.ts`, `Implementation Steps`, `app/layout.tsx`, `auth.routes.test.ts`, `breadcrumb.tsx`, `react`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `Implementation Steps` connect `Implementation Steps` to `react`, `app/layout.tsx`, `auth-session.ts`, `api.helper.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `AuthForm()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`AuthForm()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `Functional` (e.g. with `AuthForm()` and `FieldSet()`) actually correct?**
  _`Functional` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _169 weakly-connected nodes found - possible documentation gaps or missing edges._