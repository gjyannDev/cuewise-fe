# Graph Report - cuewise-fe  (2026-10-30)

## Corpus Check
- 172 files · ~66,521 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1019 nodes · 2591 edges · 50 communities (49 shown, 1 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 369 edges (avg confidence: 0.95)
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
- react
- auth.types.ts
- README.md
- AGENTS.md
- sidebar.tsx
- constants.ts
- useMutationCallbacks
- Feature: Interviews Setup UI (foundation)
- Cuewise FE — Project Instructions
- AppSidebar.tsx
- breadcrumb.tsx
- Skeleton
- Feature: App Sidebar (shared shell for user and admin)
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Setup UI (foundation)
- vitest
- Part A: Chat core
- requireUser
- avatar.tsx
- sidebar.types.ts
- devDependencies
- api.helper.ts
- scripts
- eslint.config.mjs
- Button
- AuthedShell.tsx
- RoleSidebar.tsx
- interviews.types.ts
- Implementation: Interviews Chat Layout
- auth-cookie.server.ts
- ActiveInterview
- interviews.queries.ts
- interviews.ts
- axios.client.ts
- ActiveInterview.tsx
- Implementation: Interviews Answer Flow
- AuthForm
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- bff.server.ts
- [...path]/route.test.ts
- next

## God Nodes (most connected - your core abstractions)
1. `react` - 53 edges
2. `useMutationCallbacks()` - 35 edges
3. `Part A: Chat core` - 34 edges
4. `Implementation Steps` - 31 edges
5. `Button()` - 30 edges
6. `lucide-react` - 24 edges
7. `vitest` - 24 edges
8. `InterviewConfigForm()` - 24 edges
9. `InterviewsContainer()` - 23 edges
10. `cn` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (50 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "Implementation Steps"
Cohesion: 0.18
Nodes (19): Affected Files & Patterns, Project Conventions, Implementation Steps, Acceptance Criteria, Functional, Project Conventions, AuthFormContainerProps, ERROR_TITLES (+11 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "auth-session.ts"
Cohesion: 0.22
Nodes (18): canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath(), PUBLIC_AUTH_ROUTES, readTokenPayload() (+10 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+3 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+12 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.09
Nodes (47): UX Requirements, UX Requirements, Deviations During Implementation, Layout & UX Design, Deviations from Plan, lucide-react, AuthCard(), AuthCardProps (+39 more)

### Community 8 - "react"
Cohesion: 0.05
Nodes (66): Forms, Known Issues, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted (+58 more)

### Community 9 - "auth.types.ts"
Cohesion: 0.15
Nodes (20): ref_server_only, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, backendApi, authCredentialsSchema, authFormSchemas, authSearchParamsSchema (+12 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.11
Nodes (15): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+7 more)

### Community 13 - "constants.ts"
Cohesion: 0.10
Nodes (28): INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES, INTERVIEWER_SLOW_LABEL, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, JOB_DESCRIPTION_MAX_LENGTH, LEVEL_OPTIONS, LEVELS (+20 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.06
Nodes (52): Completed Steps, Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied, Ready to Implement (+44 more)

### Community 15 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 16 - "Cuewise FE — Project Instructions"
Cohesion: 0.07
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+22 more)

### Community 17 - "AppSidebar.tsx"
Cohesion: 0.19
Nodes (20): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+12 more)

### Community 18 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 19 - "Skeleton"
Cohesion: 0.48
Nodes (4): AppLayout(), SidebarMenuSkeleton(), Skeleton(), AppShellSkeleton()

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.18
Nodes (13): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+5 more)

### Community 24 - "Part A: Chat core"
Cohesion: 0.14
Nodes (27): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Layout & UX Design, Overview, Part A: Chat core (+19 more)

### Community 25 - "requireUser"
Cohesion: 0.15
Nodes (14): Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+6 more)

### Community 26 - "avatar.tsx"
Cohesion: 0.13
Nodes (12): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, Avatar(), AvatarFallback(), InterviewerAvatar(), TypingIndicatorProps (+4 more)

### Community 27 - "sidebar.types.ts"
Cohesion: 0.26
Nodes (8): AppHeaderTitle(), AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem(), isActivePath(), trimTrailingSlash(), config

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "api.helper.ts"
Cohesion: 0.11
Nodes (23): Test Results, zod, forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), ApiError, ApiErrorBody (+15 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 32 - "Button"
Cohesion: 0.16
Nodes (20): use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, Button(), buttonVariants, Dialog() (+12 more)

### Community 33 - "AuthedShell.tsx"
Cohesion: 0.22
Nodes (15): Architecture & Design, Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AuthedShellProps, getSessionUser(), SidebarInset() (+7 more)

### Community 34 - "RoleSidebar.tsx"
Cohesion: 0.23
Nodes (7): Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 35 - "interviews.types.ts"
Cohesion: 0.12
Nodes (17): DEFAULT_START_VALUES, answerRequestSchema, answerResponseSchema, interviewSchema, interviewTypeSchema, startInterviewFormSchema, transcriptItemSchema, transcriptSchema (+9 more)

### Community 36 - "Implementation: Interviews Chat Layout"
Cohesion: 0.11
Nodes (18): A0. AI Elements components, Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interviews Chat Layout, Known Issues (+10 more)

### Community 37 - "auth-cookie.server.ts"
Cohesion: 0.16
Nodes (14): Deviations recorded during /implement, Testing Strategy, Acceptance Criteria, Edge Cases, Acceptance Criteria, Edge Cases, POST(), GET() (+6 more)

### Community 38 - "ActiveInterview"
Cohesion: 0.29
Nodes (15): Architecture & Design, Implementation Notes (deviations found while building), Implementation Steps, Testing Strategy, Completed Steps, Part B: Robustness, Skills Consulted, Project Conventions (+7 more)

### Community 39 - "interviews.queries.ts"
Cohesion: 0.26
Nodes (9): Testing Strategy, interviewKeys, interviewsService, AnswerRequest, AnswerResponse, Interview, StartInterviewRequest, Transcript (+1 more)

### Community 40 - "interviews.ts"
Cohesion: 0.21
Nodes (12): ThreadView, TranscriptItem, buildThreadView(), keyOf(), ThreadViewOptions, answerResponse(), Q1, Q2 (+4 more)

### Community 41 - "axios.client.ts"
Cohesion: 0.15
Nodes (3): axios, apiClient, API

### Community 42 - "ActiveInterview.tsx"
Cohesion: 0.15
Nodes (11): @hookform/resolvers, ActiveInterviewProps, AnswerComposer(), AnswerComposerHandle, AnswerComposerProps, ANSWER_MAX_LENGTH, STALE_THREAD_MESSAGE, THREAD_ERROR_MESSAGE (+3 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "AuthForm"
Cohesion: 0.21
Nodes (12): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement (+4 more)

### Community 45 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.15
Nodes (12): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+4 more)

### Community 46 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 47 - "bff.server.ts"
Cohesion: 0.47
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 48 - "[...path]/route.test.ts"
Cohesion: 0.22
Nodes (4): fetchMock, cookieJar, nextHeadersMock, StoredCookie

### Community 49 - "next"
Cohesion: 0.29
Nodes (6): nextConfig, next, config, base64url(), run(), tokenFor()

## Knowledge Gaps
- **332 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+327 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Button`, `package.json`, `AuthedShell.tsx`, `InterviewConfigForm.tsx`, `auth.types.ts`, `ActiveInterview.tsx`, `sidebar.tsx`, `constants.ts`, `useMutationCallbacks`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`, `breadcrumb.tsx`, `Skeleton`, `Part A: Chat core`, `requireUser`, `avatar.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `AuthedShell.tsx`, `Implementation Steps`, `RoleSidebar.tsx`, `ActiveInterview`, `AuthForm`, `constants.ts`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `Feature: Interviews Setup UI (foundation)`, `Cuewise FE — Project Instructions`, `Part A: Chat core`, `requireUser`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `package.json`, `Implementation Steps`, `RoleSidebar.tsx`, `auth-session.ts`, `auth-cookie.server.ts`, `InterviewConfigForm.tsx`, `auth.types.ts`, `useMutationCallbacks`, `bff.server.ts`, `Cuewise FE — Project Instructions`, `AppSidebar.tsx`, `breadcrumb.tsx`, `[...path]/route.test.ts`, `sidebar.types.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 24 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 33 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 33 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _332 weakly-connected nodes found - possible documentation gaps or missing edges._