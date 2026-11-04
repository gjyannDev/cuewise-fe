# Graph Report - cuewise-fe  (2026-11-04)

## Corpus Check
- 193 files · ~97,488 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1258 nodes · 3105 edges · 63 communities (62 shown, 1 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 523 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f552b4c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- AppSidebar.tsx
- components.json
- getQueryClient
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm.tsx
- react
- auth-session.ts
- README.md
- AGENTS.md
- Implementation Plan: Interviews Chat Layout
- constants.ts
- useMutationCallbacks
- Implementation Steps
- [...path]/route.ts
- interviews.services.ts
- sidebar.tsx
- ActiveInterview
- Feature: App Sidebar (shared shell for user and admin)
- Part A: Chat core
- Implementation: Interviews Chat Layout
- auth.routes.test.ts
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- isActivePath
- Feature: Interview Answer Streaming (client support for the backend's SSE turn)
- devDependencies
- api.helper.ts
- scripts
- vitest
- requireUser
- Feature: Interview Follow-up Questions (client support)
- current-user.server.ts
- done
- RoleSidebar.tsx
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- shimmer.tsx
- interviews.types.ts
- InterviewsContainer.tsx
- bff.server.ts
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interview Follow-up Questions (client support)
- interviews.services.test.ts
- ChatMessage
- Implementation Steps
- sheet.tsx
- Implementation Plan: Voice Answers
- use-interview-chat.ts
- sidebar.types.ts
- AnswerComposer
- Feature: Voice Answers (speak an answer, review the transcript, send)
- buildThreadView
- Implementation Plan: Interviews Setup UI (foundation)
- Cuewise FE — Project Instructions
- app/layout.tsx
- AppToaster.tsx
- parse-answer-stream-event.ts
- breadcrumb.tsx
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- parseApiError

## God Nodes (most connected - your core abstractions)
1. `react` - 57 edges
2. `useMutationCallbacks()` - 42 edges
3. `Button()` - 32 edges
4. `Part A: Chat core` - 32 edges
5. `Implementation Steps` - 31 edges
6. `vitest` - 29 edges
7. `lucide-react` - 26 edges
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
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (63 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): eslintConfig, name, private, version, eslint, eslint-config-next, react-dom, shadcn (+8 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (19): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+11 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "getQueryClient"
Cohesion: 0.33
Nodes (8): Data Fetching (TanStack Query), @tanstack/react-query, Providers(), ProvidersProps, getQueryClient(), makeQueryClient(), shouldRetry(), AppToaster()

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+12 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.06
Nodes (60): Layout & UX Design, Layout & UX Design, lucide-react, AuthCard(), AuthCardProps, COPY, SessionExpiredNotice(), SignInContent() (+52 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (58): Forms, Known Issues, Skills Consulted, Architecture & Design, class-variance-authority, cn, radix-ui, react (+50 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.10
Nodes (32): Project Conventions, Deviations recorded during /implement, Completed Steps, nextConfig, next, ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, authRouteHref() (+24 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Implementation Plan: Interviews Chat Layout"
Cohesion: 0.25
Nodes (7): Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Testing Strategy

### Community 13 - "constants.ts"
Cohesion: 0.10
Nodes (27): ANSWER_MAX_LENGTH, DEFAULT_START_VALUES, INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES, JOB_DESCRIPTION_MAX_LENGTH, LEVEL_OPTIONS, LEVELS, MAX_QUESTION_COUNT (+19 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.16
Nodes (15): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied (+7 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.06
Nodes (60): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview, Project Rules Applied (+52 more)

### Community 16 - "[...path]/route.ts"
Cohesion: 0.15
Nodes (16): Trade-offs & Rationale, ref_server_only, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS (+8 more)

### Community 17 - "interviews.services.ts"
Cohesion: 0.14
Nodes (18): Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`), readSseStream(), redirectIfSessionEnded(), interviewKeys, AnswerStreamOptions, streamTurn(), interviewsService (+10 more)

### Community 18 - "sidebar.tsx"
Cohesion: 0.14
Nodes (12): SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), sidebarMenuButtonVariants, SidebarProvider(), SidebarRail(), SidebarTrigger() (+4 more)

### Community 19 - "ActiveInterview"
Cohesion: 0.27
Nodes (14): Implementation Steps, Completed Steps, Skills Consulted, Implementation Steps, Part B: Robustness, Project Conventions, Phase 2: Frontend (cuewise-fe), ActiveInterview() (+6 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Part A: Chat core"
Cohesion: 0.17
Nodes (20): Affected Files & Patterns, Architecture & Design, Part A: Chat core, Trade-offs & Rationale, use-stick-to-bottom, Conversation(), ConversationContent(), ConversationContentProps (+12 more)

### Community 22 - "Implementation: Interviews Chat Layout"
Cohesion: 0.06
Nodes (32): UX Requirements, Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Known Issues (+24 more)

### Community 23 - "auth.routes.test.ts"
Cohesion: 0.12
Nodes (17): axios, API, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+9 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.33
Nodes (6): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, SessionParam, parseSessionParam()

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "isActivePath"
Cohesion: 0.22
Nodes (10): Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem(), isActivePath() (+2 more)

### Community 27 - "Feature: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional (+6 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "api.helper.ts"
Cohesion: 0.15
Nodes (15): Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Completed Steps, Test Cases, ApiError, ApiResponseError, conflictDetailsSchema, isNoResponseError() (+7 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "vitest"
Cohesion: 0.12
Nodes (20): ref_node_url, vitest, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, answerResponse(), NextQuestion, Q1, Q2 (+12 more)

### Community 32 - "requireUser"
Cohesion: 0.14
Nodes (16): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+8 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "current-user.server.ts"
Cohesion: 0.24
Nodes (10): AuthedShellProps, getSessionUser(), ApiErrorBody, apiErrorBodySchema, axios, AxiosRequestConfig, backendApi, SessionExpiredError (+2 more)

### Community 35 - "done"
Cohesion: 0.14
Nodes (20): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+12 more)

### Community 36 - "RoleSidebar.tsx"
Cohesion: 0.23
Nodes (7): Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 37 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (29): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+21 more)

### Community 38 - "shimmer.tsx"
Cohesion: 0.29
Nodes (7): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, InterviewerAvatar(), TypingIndicator(), TypingIndicatorProps

### Community 39 - "interviews.types.ts"
Cohesion: 0.13
Nodes (14): RESYNC_ERROR_CODES, interviewTypeSchema, levelSchema, roleSchema, transcriptItemSchema, AnswerErrorResult, InterviewStep, InterviewType (+6 more)

### Community 40 - "InterviewsContainer.tsx"
Cohesion: 0.25
Nodes (12): Implementation Steps, InterviewsContainer(), handleStart(), InterviewsContainerProps, InterviewSessionSkeleton(), useInterviewMessagesQuery(), useInterviewQuery(), useStartInterviewMutation() (+4 more)

### Community 41 - "bff.server.ts"
Cohesion: 0.47
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 45 - "interviews.services.test.ts"
Cohesion: 0.13
Nodes (13): Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), Trade-offs & Rationale, ANSWER_TIMEOUT_MS, START_TIMEOUT_MS, fetchMock, encoder, openStream(), sseFrame() (+5 more)

### Community 46 - "ChatMessage"
Cohesion: 0.13
Nodes (20): Affected Files & Patterns, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Implementation Steps, Overview, Project Rules Applied (+12 more)

### Community 47 - "Implementation Steps"
Cohesion: 0.25
Nodes (10): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), BUBBLES (+2 more)

### Community 48 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

### Community 49 - "Implementation Plan: Voice Answers"
Cohesion: 0.15
Nodes (12): Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+4 more)

### Community 50 - "use-interview-chat.ts"
Cohesion: 0.10
Nodes (22): ActiveInterviewProps, AnswerComposerHandle, AnswerComposerProps, ANSWER_COUNTER_FROM, INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, STALE_THREAD_MESSAGE, THINKING_SLOW_AFTER_MS (+14 more)

### Community 51 - "sidebar.types.ts"
Cohesion: 0.19
Nodes (7): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, NavSection, SidebarUser, getInitials()

### Community 52 - "AnswerComposer"
Cohesion: 0.16
Nodes (10): Completed Steps, Follow-up: chat-assistant styling (after review), Part A: Chat core (committed: c23b36f), Part B: Robustness, Affected Files & Patterns, Skills Consulted, Problem, useWarnBeforeUnload() (+2 more)

### Community 53 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+8 more)

### Community 54 - "buildThreadView"
Cohesion: 0.31
Nodes (8): Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), Deviations from Plan, Reaction, ThreadView, buildThreadView(), keyOf(), ThreadViewOptions, inferStreamingQuestion()

### Community 55 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.22
Nodes (8): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy

### Community 56 - "Cuewise FE — Project Instructions"
Cohesion: 0.10
Nodes (14): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT) (+6 more)

### Community 57 - "app/layout.tsx"
Cohesion: 0.31
Nodes (7): src_app_globals, metadata, RootLayout(), viewport, TooltipProvider(), inter, roboto_slab

### Community 58 - "AppToaster.tsx"
Cohesion: 0.33
Nodes (4): next-themes, sonner, AppToasterProps, tokenStyle

### Community 60 - "parse-answer-stream-event.ts"
Cohesion: 0.16
Nodes (9): SseFrame, answerStreamEventSchemas, AnswerStreamEventName, isKnown(), ParsedStreamEvent, cancel(), collect(), encoder (+1 more)

### Community 61 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 63 - "parseApiError"
Cohesion: 0.21
Nodes (11): Affected Files & Patterns, AuthFormContainer(), handleSubmit(), ActionMode, BuildCallbackEffects, getErrorMessage(), runEffects(), SideEffect (+3 more)

## Knowledge Gaps
- **420 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+415 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 511 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `getQueryClient`, `InterviewConfigForm.tsx`, `interviews.services.ts`, `sidebar.tsx`, `Part A: Chat core`, `Implementation: Interviews Chat Layout`, `interviews/page.tsx`, `requireUser`, `current-user.server.ts`, `shimmer.tsx`, `InterviewsContainer.tsx`, `ChatMessage`, `Implementation Steps`, `sheet.tsx`, `use-interview-chat.ts`, `sidebar.types.ts`, `AnswerComposer`, `AppToaster.tsx`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `getQueryClient`, `auth-session.ts`, `Implementation Plan: Interviews Chat Layout`, `Implementation Steps`, `ActiveInterview`, `Implementation: Interviews Chat Layout`, `requireUser`, `RoleSidebar.tsx`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `InterviewsContainer.tsx`, `ChatMessage`, `Implementation Steps`, `Implementation Plan: Voice Answers`, `use-interview-chat.ts`, `AnswerComposer`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `Implementation Plan: Interviews Setup UI (foundation)`, `Cuewise FE — Project Instructions`, `parseApiError`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `Button()` connect `InterviewConfigForm.tsx` to `InterviewsContainer.tsx`, `Implementation Steps`, `sheet.tsx`, `use-interview-chat.ts`, `ActiveInterview`, `sidebar.tsx`, `Part A: Chat core`, `AnswerComposer`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 31 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _420 weakly-connected nodes found - possible documentation gaps or missing edges._