# Graph Report - cuewise-fe  (2026-10-31)

## Corpus Check
- 178 files · ~75,604 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1102 nodes · 2754 edges · 52 communities (50 shown, 2 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 423 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4d485e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- AppSidebar.tsx
- components.json
- Cuewise FE — Project Instructions
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm.tsx
- field.tsx
- Implementation Steps
- README.md
- AGENTS.md
- ActiveInterview.tsx
- constants.ts
- useMutationCallbacks
- current-user.server.ts
- auth.types.ts
- interviews.queries.ts
- react
- .answer
- Feature: App Sidebar (shared shell for user and admin)
- ChatThread.tsx
- Implementation: Interviews Setup UI (foundation)
- vitest
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- sidebar.types.ts
- eslint.config.mjs
- devDependencies
- [...path]/route.ts
- scripts
- interviews.ts
- requireUser
- Feature: Interview Follow-up Questions (client support)
- Button
- interviews.schema.test.ts
- next
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- buildThreadView
- interviews.types.ts
- bff.server.ts
- apiClient
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interview Follow-up Questions (client support)
- [...path]/route.test.ts
- Implementation Plan: Interview Follow-up Questions (client support)
- Implementation Steps
- shimmer.tsx
- Implementation Plan: Interviews Chat Layout
- Part A: Chat core
- SidebarUserCard.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 56 edges
2. `useMutationCallbacks()` - 36 edges
3. `Button()` - 32 edges
4. `Part A: Chat core` - 32 edges
5. `Implementation Steps` - 31 edges
6. `lucide-react` - 26 edges
7. `vitest` - 25 edges
8. `InterviewsContainer()` - 24 edges
9. `InterviewConfigForm()` - 24 edges
10. `cn` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Ready to Implement` --references--> `Conversation()`  [INFERRED]
  docs/features/interviews-chat-layout/plan.md → src/components/ai-elements/conversation.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (52 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.18
Nodes (20): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.07
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+22 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+12 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.09
Nodes (38): UX Requirements, Follow-up: interview bar instead of the details panel (after review), Layout & UX Design, Deviations from Plan, lucide-react, AuthCard(), AuthCardProps, COPY (+30 more)

### Community 8 - "field.tsx"
Cohesion: 0.07
Nodes (50): Known Issues, Skills Consulted, Architecture & Design, Trade-offs & Rationale, react-hook-form, Checkbox(), Field(), FieldDescription() (+42 more)

### Community 9 - "Implementation Steps"
Cohesion: 0.05
Nodes (68): Forms, Project Conventions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps (+60 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "ActiveInterview.tsx"
Cohesion: 0.19
Nodes (14): Architecture & Design, Part B: Robustness, Trade-offs & Rationale, Project Conventions, Follow-up: chat-assistant styling (after review), ActiveInterview(), ActiveInterviewProps, ConversationContent() (+6 more)

### Community 13 - "constants.ts"
Cohesion: 0.09
Nodes (33): AnswerComposerHandle, AnswerComposerProps, ANSWER_COUNTER_FROM, ANSWER_MAX_LENGTH, INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES, INTERVIEWER_SLOW_LABEL, JOB_DESCRIPTION_MAX_LENGTH (+25 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.06
Nodes (58): Completed Steps, Affected Files & Patterns, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview (+50 more)

### Community 15 - "current-user.server.ts"
Cohesion: 0.23
Nodes (11): ref_server_only, AuthedShellProps, getSessionUser(), ApiErrorBody, axios, AxiosRequestConfig, backendApi, SessionExpiredError (+3 more)

### Community 16 - "auth.types.ts"
Cohesion: 0.16
Nodes (17): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, currentProfileSchema (+9 more)

### Community 17 - "interviews.queries.ts"
Cohesion: 0.18
Nodes (13): ANSWER_TIMEOUT_MS, START_TIMEOUT_MS, interviewKeys, interviewsService, AnswerOutcome, AnswerRequest, AnswerResponse, Interview (+5 more)

### Community 18 - "react"
Cohesion: 0.05
Nodes (42): class-variance-authority, cn, radix-ui, react, AppLayout(), Badge(), badgeVariants, Breadcrumb() (+34 more)

### Community 19 - ".answer"
Cohesion: 0.18
Nodes (14): Architecture & Design, Testing Strategy, Completed Steps, Spec Requirements -> Implementation, Testing Strategy, Completed Steps, Part A: Chat core (committed: c23b36f), Part B: Robustness (+6 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "ChatThread.tsx"
Cohesion: 0.18
Nodes (13): Affected Files & Patterns, use-stick-to-bottom, Conversation(), ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, ChatThread() (+5 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.23
Nodes (11): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith() (+3 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.29
Nodes (7): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, sessionParamSchema, SessionParam, parseSessionParam()

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "sidebar.types.ts"
Cohesion: 0.23
Nodes (10): Deviations During Implementation, RoleHeaderTitle(), RoleHeaderTitleProps, AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig (+2 more)

### Community 27 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "[...path]/route.ts"
Cohesion: 0.15
Nodes (15): Deviations recorded during /implement, zod, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS (+7 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "interviews.ts"
Cohesion: 0.16
Nodes (16): FOLLOW_UP_CAPTION, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, answerResponse(), NextQuestion, Q1, Q2, Q3 (+8 more)

### Community 32 - "requireUser"
Cohesion: 0.14
Nodes (16): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+8 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "Button"
Cohesion: 0.06
Nodes (39): Layout & UX Design, Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Implementation: Interviews Chat Layout, Links, Open Questions (+31 more)

### Community 35 - "interviews.schema.test.ts"
Cohesion: 0.22
Nodes (6): DEFAULT_START_VALUES, answerRequestSchema, answerResponseSchema, interviewSchema, startInterviewFormSchema, transcriptSchema

### Community 36 - "next"
Cohesion: 0.19
Nodes (8): nextConfig, next, Role, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 37 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (28): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+20 more)

### Community 38 - "buildThreadView"
Cohesion: 0.24
Nodes (14): Deviations from Plan, Implementation Steps, Skills Consulted, Completed Steps, Avatar(), AvatarFallback(), ChatMessage(), ChatMessageProps (+6 more)

### Community 39 - "interviews.types.ts"
Cohesion: 0.12
Nodes (16): RESYNC_ERROR_CODES, interviewTypeSchema, levelSchema, roleSchema, transcriptItemSchema, AnswerErrorResult, AnswerFormValues, InterviewStep (+8 more)

### Community 40 - "bff.server.ts"
Cohesion: 0.38
Nodes (10): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), backendTokenSchema (+2 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 45 - "[...path]/route.test.ts"
Cohesion: 0.22
Nodes (4): fetchMock, cookieJar, nextHeadersMock, StoredCookie

### Community 46 - "Implementation Plan: Interview Follow-up Questions (client support)"
Cohesion: 0.20
Nodes (9): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 47 - "Implementation Steps"
Cohesion: 0.42
Nodes (7): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), RoleSidebar(), isActivePath(), trimTrailingSlash()

### Community 48 - "shimmer.tsx"
Cohesion: 0.31
Nodes (6): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, TypingIndicator(), TypingIndicatorProps

### Community 49 - "Implementation Plan: Interviews Chat Layout"
Cohesion: 0.29
Nodes (6): Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Project Rules Applied, Ready to Implement

### Community 50 - "Part A: Chat core"
Cohesion: 0.47
Nodes (5): Part A: Chat core, ThreadItem, ThreadView, TranscriptItem, ThreadViewOptions

### Community 51 - "SidebarUserCard.tsx"
Cohesion: 0.47
Nodes (3): SidebarUserCardProps, SidebarUser, getInitials()

## Knowledge Gaps
- **360 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+355 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 439 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `requireUser`, `package.json`, `Button`, `AppSidebar.tsx`, `Cuewise FE — Project Instructions`, `buildThreadView`, `InterviewConfigForm.tsx`, `field.tsx`, `ActiveInterview.tsx`, `constants.ts`, `useMutationCallbacks`, `current-user.server.ts`, `shimmer.tsx`, `ChatThread.tsx`, `interviews/page.tsx`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `requireUser`, `Cuewise FE — Project Instructions`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `next`, `Implementation Steps`, `ActiveInterview.tsx`, `constants.ts`, `Implementation Steps`, `Implementation Plan: Interviews Chat Layout`, `.answer`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `package.json`, `interviews.schema.test.ts`, `next`, `interviews.types.ts`, `Implementation Steps`, `[...path]/route.test.ts`, `useMutationCallbacks`, `Implementation Steps`, `auth.types.ts`, `interviews.queries.ts`, `SidebarUserCard.tsx`, `interviews/page.tsx`, `sidebar.types.ts`, `[...path]/route.ts`, `interviews.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _360 weakly-connected nodes found - possible documentation gaps or missing edges._