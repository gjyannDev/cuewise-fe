# Graph Report - cuewise-fe  (2026-10-30)

## Corpus Check
- 157 files · ~50,902 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 898 nodes · 2303 edges · 38 communities (36 shown, 2 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 261 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c534497d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- Implementation Steps
- components.json
- auth-session.ts
- Button
- dependencies
- InterviewConfigForm.tsx
- field.tsx
- current-user.server.ts
- README.md
- AGENTS.md
- sidebar.tsx
- constants.ts
- useMutationCallbacks
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- Cuewise FE — Project Instructions
- AppSidebar.tsx
- breadcrumb.tsx
- api.helper.ts
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interviews Setup UI (foundation)
- vitest
- interviews.queries.ts
- interviews.types.ts
- avatar.tsx
- lucide-react
- devDependencies
- bff.server.ts
- scripts
- eslint.config.mjs
- [...path]/route.test.ts
- [...path]/route.ts
- RoleSidebar.tsx
- interviews/page.tsx
- Interview
- apiClient

## God Nodes (most connected - your core abstractions)
1. `react` - 47 edges
2. `useMutationCallbacks()` - 32 edges
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

## Communities (38 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, class-variance-authority, next-themes, react-dom, shadcn, sonner (+8 more)

### Community 2 - "Implementation Steps"
Cohesion: 0.05
Nodes (63): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+55 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "auth-session.ts"
Cohesion: 0.06
Nodes (60): Project Conventions, Deviations recorded during /implement, Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links (+52 more)

### Community 5 - "Button"
Cohesion: 0.30
Nodes (14): Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+6 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, next, next-themes (+10 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.10
Nodes (45): Affected Files & Patterns, Layout & UX Design, UX Requirements, Deviations from Plan, react, Badge(), badgeVariants, Card() (+37 more)

### Community 8 - "field.tsx"
Cohesion: 0.06
Nodes (59): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Layout & UX Design, Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+51 more)

### Community 9 - "current-user.server.ts"
Cohesion: 0.05
Nodes (52): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+44 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.11
Nodes (15): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+7 more)

### Community 13 - "constants.ts"
Cohesion: 0.10
Nodes (27): AnswerFormProps, ANSWER_MAX_LENGTH, COMPLETED_FALLBACK_TEXT, DEFAULT_START_VALUES, INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES, JOB_DESCRIPTION_MAX_LENGTH, LEVEL_OPTIONS (+19 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.12
Nodes (25): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Answer Flow, Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+17 more)

### Community 15 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (28): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+20 more)

### Community 16 - "Cuewise FE — Project Instructions"
Cohesion: 0.07
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+22 more)

### Community 17 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (19): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+11 more)

### Community 18 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 19 - "api.helper.ts"
Cohesion: 0.15
Nodes (11): axios, ApiError, apiErrorBodySchema, conflictDetailsSchema, GENERIC_ERROR_MESSAGE, NormalizedError, normalizeError(), SESSION_ERROR_CODES (+3 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Implementation: Interviews Answer Flow"
Cohesion: 0.12
Nodes (15): 1. Contract, Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues (+7 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.18
Nodes (13): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+5 more)

### Community 24 - "interviews.queries.ts"
Cohesion: 0.23
Nodes (11): ActiveInterview(), ActiveInterviewProps, RESYNC_ERROR_CODES, AnswerTurn, useAnswerTurn(), submit(), interviewKeys, useAnswerInterviewMutation() (+3 more)

### Community 25 - "interviews.types.ts"
Cohesion: 0.19
Nodes (17): Implementation Steps, InterviewsContainer(), handleStart(), InterviewsContainerProps, parseApiError(), InterviewSessionSkeleton(), useInterviewQuery(), useStartInterviewMutation() (+9 more)

### Community 26 - "avatar.tsx"
Cohesion: 0.24
Nodes (5): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, getInitials()

### Community 27 - "lucide-react"
Cohesion: 0.18
Nodes (13): Deviations During Implementation, lucide-react, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig (+5 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "bff.server.ts"
Cohesion: 0.47
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 32 - "[...path]/route.test.ts"
Cohesion: 0.22
Nodes (4): fetchMock, cookieJar, nextHeadersMock, StoredCookie

### Community 33 - "[...path]/route.ts"
Cohesion: 0.31
Nodes (7): forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), isSessionErrorCode(), apiUrlSchema, getApiUrl()

### Community 34 - "RoleSidebar.tsx"
Cohesion: 0.31
Nodes (7): Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 35 - "interviews/page.tsx"
Cohesion: 0.33
Nodes (6): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, sessionParamSchema, parseSessionParam()

### Community 36 - "Interview"
Cohesion: 0.28
Nodes (5): interviewsService, Interview, InterviewStep, question, session

## Knowledge Gaps
- **292 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 348 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `InterviewConfigForm.tsx` to `package.json`, `interviews/page.tsx`, `auth-session.ts`, `Button`, `field.tsx`, `current-user.server.ts`, `sidebar.tsx`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`, `breadcrumb.tsx`, `interviews.queries.ts`, `interviews.types.ts`, `avatar.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `Implementation Steps`, `RoleSidebar.tsx`, `auth-session.ts`, `InterviewConfigForm.tsx`, `current-user.server.ts`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `Cuewise FE — Project Instructions`, `interviews.queries.ts`, `interviews.types.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `next` connect `auth-session.ts` to `[...path]/route.test.ts`, `package.json`, `RoleSidebar.tsx`, `current-user.server.ts`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`, `breadcrumb.tsx`, `interviews.types.ts`, `lucide-react`, `bff.server.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Card()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Card()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _292 weakly-connected nodes found - possible documentation gaps or missing edges._