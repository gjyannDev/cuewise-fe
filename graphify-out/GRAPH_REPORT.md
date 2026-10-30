# Graph Report - cuewise-fe  (2026-10-30)

## Corpus Check
- 174 files · ~68,846 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1032 nodes · 2653 edges · 40 communities (38 shown, 2 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 388 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c23b36f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- Implementation Steps
- components.json
- Cuewise FE — Project Instructions
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm.tsx
- field.tsx
- auth.types.ts
- README.md
- AGENTS.md
- sidebar.tsx
- constants.ts
- useMutationCallbacks
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- Completed Steps
- use-interview-chat.ts
- breadcrumb.tsx
- interviews/page.tsx
- Feature: App Sidebar (shared shell for user and admin)
- get-answer-error-result.ts
- Implementation: Interviews Setup UI (foundation)
- vitest
- requireUser
- avatar.tsx
- devDependencies
- api.helper.ts
- scripts
- eslint.config.mjs
- interviews.types.ts
- Implementation: Interviews Chat Layout
- auth-cookie.server.ts
- interviews.queries.ts
- axios.client.ts
- AnswerComposer.tsx
- Implementation: Interviews Answer Flow
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- bff.server.ts
- next

## God Nodes (most connected - your core abstractions)
1. `react` - 54 edges
2. `useMutationCallbacks()` - 35 edges
3. `Part A: Chat core` - 34 edges
4. `Implementation Steps` - 31 edges
5. `Button()` - 30 edges
6. `lucide-react` - 24 edges
7. `vitest` - 24 edges
8. `InterviewsContainer()` - 24 edges
9. `InterviewConfigForm()` - 24 edges
10. `cn` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
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

## Communities (40 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "Implementation Steps"
Cohesion: 0.05
Nodes (77): Forms, Affected Files & Patterns, Project Conventions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement (+69 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.14
Nodes (13): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT) (+5 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+3 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+12 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.05
Nodes (84): Affected Files & Patterns, UX Requirements, UX Requirements, Deviations from Plan, Deviations During Implementation, Layout & UX Design, Deviations from Plan, class-variance-authority (+76 more)

### Community 8 - "field.tsx"
Cohesion: 0.05
Nodes (60): Skills Consulted, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+52 more)

### Community 9 - "auth.types.ts"
Cohesion: 0.14
Nodes (20): ref_server_only, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, backendTokenSchema (+12 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "sidebar.tsx"
Cohesion: 0.05
Nodes (50): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+42 more)

### Community 13 - "constants.ts"
Cohesion: 0.15
Nodes (18): INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES, JOB_DESCRIPTION_MAX_LENGTH, LEVEL_OPTIONS, LEVELS, MAX_QUESTION_COUNT, MIN_QUESTION_COUNT, QUESTION_CATEGORIES (+10 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.06
Nodes (70): Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview, Project Rules Applied (+62 more)

### Community 15 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (28): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal, Non-Functional (+20 more)

### Community 16 - "Completed Steps"
Cohesion: 0.21
Nodes (12): Data Fetching (TanStack Query), Completed Steps, @tanstack/react-query, RootLayout(), Providers(), ProvidersProps, getQueryClient(), makeQueryClient() (+4 more)

### Community 17 - "use-interview-chat.ts"
Cohesion: 0.21
Nodes (10): INTERVIEWER_SLOW_LABEL, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, MIN_THINKING_MS, RESYNC_MESSAGE, REVEAL_DELAY_MS, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE (+2 more)

### Community 18 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 19 - "interviews/page.tsx"
Cohesion: 0.29
Nodes (7): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, sessionParamSchema, SessionParam, parseSessionParam()

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "get-answer-error-result.ts"
Cohesion: 0.50
Nodes (3): RESYNC_ERROR_CODES, AnswerErrorResult, resyncCodes

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.09
Nodes (22): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock (+14 more)

### Community 25 - "requireUser"
Cohesion: 0.06
Nodes (46): Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+38 more)

### Community 26 - "avatar.tsx"
Cohesion: 0.13
Nodes (12): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, Avatar(), AvatarFallback(), InterviewerAvatar(), TypingIndicatorProps (+4 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "api.helper.ts"
Cohesion: 0.10
Nodes (24): Test Results, zod, forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS, timeoutFor() (+16 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 35 - "interviews.types.ts"
Cohesion: 0.12
Nodes (16): DEFAULT_START_VALUES, answerRequestSchema, answerResponseSchema, interviewSchema, interviewTypeSchema, levelSchema, roleSchema, startInterviewFormSchema (+8 more)

### Community 36 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interviews Chat Layout, Known Issues, Links, Open Questions (+7 more)

### Community 37 - "auth-cookie.server.ts"
Cohesion: 0.53
Nodes (3): POST(), clearAccessTokenCookie(), ACCESS_TOKEN_MAX_AGE_SECONDS

### Community 39 - "interviews.queries.ts"
Cohesion: 0.18
Nodes (13): ANSWER_TIMEOUT_MS, START_TIMEOUT_MS, interviewKeys, interviewsService, AnswerRequest, AnswerResponse, Interview, StartInterviewRequest (+5 more)

### Community 42 - "AnswerComposer.tsx"
Cohesion: 0.17
Nodes (12): Part B: Robustness, @hookform/resolvers, useWarnBeforeUnload(), bypassUnloadWarning(), isUnloadWarningBypassed(), AnswerComposerHandle, AnswerComposerProps, ANSWER_MAX_LENGTH (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 45 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.15
Nodes (12): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+4 more)

### Community 47 - "bff.server.ts"
Cohesion: 0.47
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 49 - "next"
Cohesion: 0.27
Nodes (7): nextConfig, next, src_app_globals, metadata, viewport, inter, roboto_slab

## Knowledge Gaps
- **330 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+325 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 395 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `InterviewConfigForm.tsx` to `package.json`, `field.tsx`, `AnswerComposer.tsx`, `sidebar.tsx`, `useMutationCallbacks`, `Completed Steps`, `use-interview-chat.ts`, `breadcrumb.tsx`, `interviews/page.tsx`, `requireUser`, `avatar.tsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `Implementation Steps`, `Cuewise FE — Project Instructions`, `InterviewConfigForm.tsx`, `field.tsx`, `sidebar.tsx`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `Completed Steps`, `use-interview-chat.ts`, `requireUser`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `package.json`, `Implementation Steps`, `auth-cookie.server.ts`, `InterviewConfigForm.tsx`, `sidebar.tsx`, `bff.server.ts`, `breadcrumb.tsx`, `vitest`, `requireUser`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 24 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 33 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 33 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _330 weakly-connected nodes found - possible documentation gaps or missing edges._