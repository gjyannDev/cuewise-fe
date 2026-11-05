# Graph Report - cuewise-fe  (2026-11-05)

## Corpus Check
- 225 files · ~119,065 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1494 nodes · 3795 edges · 83 communities (81 shown, 2 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 642 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37236178`
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
- InterviewConfigForm
- react
- auth-session.ts
- README.md
- AGENTS.md
- getAnswerErrorResult
- get-transcribe-error-result.ts
- api.helper.ts
- auth.types.ts
- [...path]/route.ts
- constants.ts
- Implementation Plan: App Sidebar (shared shell for user and admin)
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- Part A: Chat core
- Implementation: Interviews Setup UI (foundation)
- vitest
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- InterviewConfigForm.tsx
- Feature: Interview Answer Streaming (client support for the backend's SSE turn)
- devDependencies
- use-interview-history-table.ts
- scripts
- interviews.ts
- DataTable
- Feature: Interview Follow-up Questions (client support)
- AuthedShell.tsx
- status
- sidebar.types.ts
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- Button
- HistoryContainer.tsx
- interviews.queries.ts
- bff.server.ts
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interview Follow-up Questions (client support)
- [...path]/route.test.ts
- pickThinkingLabel
- Implementation Steps
- sidebar.tsx
- history-params.ts
- interviews.types.ts
- ChatMessage.tsx
- InterviewTitleBar.tsx
- Implementation Plan: Voice Answers
- Implementation Steps
- done
- Feature: Voice Answers (speak an answer, review the transcript, send)
- apiClient
- auth.queries.ts
- Implementation: Voice Answers
- parse-answer-stream-event.ts
- breadcrumb.tsx
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- sheet.tsx
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- Implementation Plan: Auth Session (cookie-based BFF)
- interview-history-columns.tsx
- buildThreadView
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- signin/page.tsx
- AnswerComposer.tsx
- next
- interviews.services.test.ts
- Implementation Plan: Interview History Page (frontend)
- getQueryClient
- Skeleton
- AnswerComposer
- requireUser
- Implementation Plan: Interviews Chat Layout
- Toaster
- pick-thinking-label.test.ts
- reduce-answer-stream.test.ts
- signup/page.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 64 edges
2. `Button()` - 45 edges
3. `useMutationCallbacks()` - 42 edges
4. `vitest` - 35 edges
5. `Part A: Chat core` - 33 edges
6. `Implementation Steps` - 31 edges
7. `lucide-react` - 30 edges
8. `InterviewsContainer()` - 28 edges
9. `parseApiError()` - 26 edges
10. `requireUser()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Blockers & Resolutions` --references--> `InterviewsContainer()`  [INFERRED]
  docs/features/interview-history/plan-v1.md → src/app/(app)/interviews/_components/InterviewsContainer.tsx
- `Architecture & Design` --references--> `AuthForm()`  [INFERRED]
  docs/features/auth-session/plan.md → src/app/(auth)/_components/AuthForm.tsx
- `Overview` --references--> `AuthForm()`  [INFERRED]
  docs/features/auth-session/plan.md → src/app/(auth)/_components/AuthForm.tsx
- `Ready to Implement` --references--> `Conversation()`  [INFERRED]
  docs/features/interviews-chat-layout/plan.md → src/components/ai-elements/conversation.tsx

## Import Cycles
- None detected.

## Communities (83 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): eslintConfig, name, private, version, eslint, eslint-config-next, @hookform/resolvers, react-dom (+9 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.19
Nodes (20): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.17
Nodes (11): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Testing (+3 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "InterviewConfigForm"
Cohesion: 0.22
Nodes (18): Layout & UX Design, AuthCard(), AuthCardProps, COPY, Card(), CardContent(), CardDescription(), CardFooter() (+10 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (61): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+53 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.13
Nodes (29): Project Conventions, Deviations recorded during /implement, handleSubmit(), ACCESS_TOKEN_COOKIE, authRouteHref(), canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute() (+21 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "getAnswerErrorResult"
Cohesion: 0.18
Nodes (16): Completed Steps, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`), Part B: Robustness, Spec Requirements -> Implementation, Testing Strategy, Completed Steps, Known Issues, Part A: Chat core (committed: c23b36f) (+8 more)

### Community 13 - "get-transcribe-error-result.ts"
Cohesion: 0.18
Nodes (9): Changes Made (cuewise-fe, uncommitted), RESYNC_ERROR_CODES, TRANSCRIPTION_ERROR_MESSAGES, TRANSCRIPTION_UNAVAILABLE_MESSAGE, TranscribeResult, recordingFileName(), TranscribeErrorResult, Transcription (+1 more)

### Community 14 - "api.helper.ts"
Cohesion: 0.14
Nodes (14): ApiError, ApiErrorBody, apiErrorBodySchema, conflictDetailsSchema, isSessionErrorCode(), NormalizedError, normalizeError(), SESSION_ERROR_CODES (+6 more)

### Community 15 - "auth.types.ts"
Cohesion: 0.12
Nodes (21): AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES, authCredentialsSchema, authFormSchemas, authSearchParamsSchema (+13 more)

### Community 16 - "[...path]/route.ts"
Cohesion: 0.12
Nodes (22): Trade-offs & Rationale, ref_server_only, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS (+14 more)

### Community 17 - "constants.ts"
Cohesion: 0.09
Nodes (36): ANSWER_MAX_LENGTH, DEFAULT_START_VALUES, HISTORY_PAGE_SIZES, HISTORY_SORT_COLUMNS, HISTORY_STATUS_ALL, HISTORY_STATUS_OPTIONS, INTERVIEW_TYPES, JOB_DESCRIPTION_MAX_LENGTH (+28 more)

### Community 18 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.22
Nodes (8): Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy

### Community 19 - "useMutationCallbacks"
Cohesion: 0.09
Nodes (32): Completed Steps, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design (+24 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Part A: Chat core"
Cohesion: 0.17
Nodes (29): Architecture & Design, Skills Consulted, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Affected Files & Patterns, Architecture & Design, Part A: Chat core, Trade-offs & Rationale, Project Conventions (+21 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.14
Nodes (16): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith() (+8 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.38
Nodes (5): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, parseSessionParam()

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "InterviewConfigForm.tsx"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, UX Requirements, Deviations from Plan, class-variance-authority, Badge(), badgeVariants, InterviewColumns(), InterviewColumnsProps (+9 more)

### Community 27 - "Feature: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "use-interview-history-table.ts"
Cohesion: 0.25
Nodes (14): Testing Strategy, Changes Made, Deviations from Plan, @tanstack/react-table, HISTORY_DEFAULT_PARAMS, InterviewHistoryTableOptions, useInterviewHistoryTable(), HistoryParams (+6 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "interviews.ts"
Cohesion: 0.22
Nodes (10): interviewListItem(), NextQuestion, Q1, Q2, Q3, REACTION, SESSION_ID, request (+2 more)

### Community 32 - "DataTable"
Cohesion: 0.08
Nodes (33): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Requirements -> Implementation, Skills Consulted (+25 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "AuthedShell.tsx"
Cohesion: 0.22
Nodes (10): AuthedShellProps, getSessionUser(), getCurrentUser, Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS (+2 more)

### Community 35 - "status"
Cohesion: 0.28
Nodes (9): Implementation Steps, Step 14: Gates and the manual end-to-end run, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 2: The SSE parser (`src/lib/api/sse.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`) (+1 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.29
Nodes (8): Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem(), config

### Community 37 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (28): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+20 more)

### Community 38 - "Button"
Cohesion: 0.14
Nodes (14): lucide-react, use-stick-to-bottom, ActiveInterviewProps, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, Button() (+6 more)

### Community 39 - "HistoryContainer.tsx"
Cohesion: 0.13
Nodes (14): HistoryContainerProps, NO_ROWS, Alert(), AlertTitle(), alertVariants, HISTORY_EMPTY_DESCRIPTION, HISTORY_EMPTY_TITLE, HISTORY_ERROR_DESCRIPTION (+6 more)

### Community 40 - "interviews.queries.ts"
Cohesion: 0.18
Nodes (18): Affected Files & Patterns, Implementation Steps, Implementation Steps, InterviewsContainer(), handleStart(), InterviewsContainerProps, InterviewMessageCard(), InterviewSessionSkeleton() (+10 more)

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

### Community 45 - "[...path]/route.test.ts"
Cohesion: 0.15
Nodes (9): ANSWER_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, encoder, openStream(), sseFrame() (+1 more)

### Community 46 - "pickThinkingLabel"
Cohesion: 0.13
Nodes (19): Affected Files & Patterns, Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied (+11 more)

### Community 47 - "Implementation Steps"
Cohesion: 0.23
Nodes (11): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), RoleSidebar(), SidebarUserCard(), SidebarUserCardProps, SidebarUser (+3 more)

### Community 48 - "sidebar.tsx"
Cohesion: 0.13
Nodes (13): Input(), SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), sidebarMenuButtonVariants, SidebarProvider(), SidebarRail() (+5 more)

### Community 49 - "history-params.ts"
Cohesion: 0.12
Nodes (24): Affected Files & Patterns, Implementation Steps, Architecture & Design, Testing Strategy, HistoryContainer(), HistoryContent(), HistoryPage(), HistoryPageProps (+16 more)

### Community 50 - "interviews.types.ts"
Cohesion: 0.07
Nodes (31): zod, INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, SendFailure, TurnAction, interviewKeys (+23 more)

### Community 51 - "ChatMessage.tsx"
Cohesion: 0.15
Nodes (9): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, Avatar(), AvatarFallback(), ChatMessageProps, InterviewerAvatar() (+1 more)

### Community 52 - "InterviewTitleBar.tsx"
Cohesion: 0.07
Nodes (34): Layout & UX Design, Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Implementation: Interviews Chat Layout, Links, Open Questions (+26 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.14
Nodes (13): Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+5 more)

### Community 54 - "Implementation Steps"
Cohesion: 0.36
Nodes (12): Forms, Affected Files & Patterns, Implementation Steps, Functional, Project Conventions, Known Issues, AuthForm(), FieldGroup() (+4 more)

### Community 55 - "done"
Cohesion: 0.21
Nodes (12): Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), Testing Strategy (+4 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+8 more)

### Community 58 - "auth.queries.ts"
Cohesion: 0.39
Nodes (7): Acceptance Criteria, authKeys, useCurrentProfileQuery(), useLogoutMutation(), useSignInMutation(), useSignUpMutation(), useStartSession()

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "parse-answer-stream-event.ts"
Cohesion: 0.15
Nodes (10): Step 6: The service (`modules/interviews/services/interviews.services.ts`), readSseStream(), SseFrame, AnswerStreamEventName, isKnown(), parseAnswerStreamEvent(), ParsedStreamEvent, collect() (+2 more)

### Community 61 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 63 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

### Community 64 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+7 more)

### Community 65 - "Implementation Plan: Auth Session (cookie-based BFF)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+2 more)

### Community 66 - "interview-history-columns.tsx"
Cohesion: 0.14
Nodes (16): column, interviewHistoryColumns, InterviewHistoryRowActions(), InterviewHistoryRowActionsProps, InterviewStatusBadge(), InterviewStatusBadgeProps, STATUS_VARIANTS, FOLLOW_UP_CAPTION (+8 more)

### Community 67 - "buildThreadView"
Cohesion: 0.29
Nodes (9): Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), Deviations from Plan, ThreadItem, ThreadView, buildThreadView(), keyOf(), ThreadViewOptions, formatQuestionPosition() (+1 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "signin/page.tsx"
Cohesion: 0.53
Nodes (4): SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps

### Community 70 - "AnswerComposer.tsx"
Cohesion: 0.10
Nodes (25): AudioRecorderOptions, detectFormat(), errorKind(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd, useAudioRecorder() (+17 more)

### Community 71 - "next"
Cohesion: 0.22
Nodes (10): nextConfig, next, src_app_globals, metadata, RootLayout(), viewport, Providers(), TooltipProvider() (+2 more)

### Community 72 - "interviews.services.test.ts"
Cohesion: 0.17
Nodes (11): Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Completed Steps, Test Cases, ApiResponseError, NoResponseError, streamTurn(), jsonOrNull(), AnswerStreamError (+3 more)

### Community 73 - "Implementation Plan: Interview History Page (frontend)"
Cohesion: 0.20
Nodes (8): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Trade-offs & Rationale

### Community 74 - "getQueryClient"
Cohesion: 0.33
Nodes (7): Data Fetching (TanStack Query), Project Rules Applied, @tanstack/react-query, ProvidersProps, getQueryClient(), makeQueryClient(), shouldRetry()

### Community 75 - "Skeleton"
Cohesion: 0.36
Nodes (5): AppLayout(), SidebarMenuSkeleton(), Skeleton(), BUBBLES, AppShellSkeleton()

### Community 76 - "AnswerComposer"
Cohesion: 0.24
Nodes (5): Affected Files & Patterns, Problem, AnswerComposer(), transcribe(), appendTranscript()

### Community 77 - "requireUser"
Cohesion: 0.25
Nodes (9): Security & Auth, Affected Files & Patterns, Architecture & Design, Trade-offs & Rationale, AdminHome(), AdminHomeContent(), Home(), HomeContent() (+1 more)

### Community 78 - "Implementation Plan: Interviews Chat Layout"
Cohesion: 0.25
Nodes (7): Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Skills Consulted

### Community 79 - "Toaster"
Cohesion: 0.32
Nodes (6): next-themes, sonner, Toaster(), AppToaster(), AppToasterProps, tokenStyle

### Community 80 - "pick-thinking-label.test.ts"
Cohesion: 0.36
Nodes (6): INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, transcriptItem(), earlierMain, followUpOf(), lastMain

### Community 81 - "reduce-answer-stream.test.ts"
Cohesion: 0.29
Nodes (6): reduceTurn(), ANSWER_STREAM_START, reduceAnswerStream(), reaction, reset, run()

### Community 82 - "signup/page.tsx"
Cohesion: 0.67
Nodes (3): SignUpContent(), SignUpPage(), SignUpPageProps

## Knowledge Gaps
- **483 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+478 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 584 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `InterviewConfigForm`, `api.helper.ts`, `[...path]/route.ts`, `Part A: Chat core`, `interviews/page.tsx`, `InterviewConfigForm.tsx`, `use-interview-history-table.ts`, `DataTable`, `AuthedShell.tsx`, `Button`, `HistoryContainer.tsx`, `interviews.queries.ts`, `sidebar.tsx`, `history-params.ts`, `interviews.types.ts`, `ChatMessage.tsx`, `InterviewTitleBar.tsx`, `breadcrumb.tsx`, `sheet.tsx`, `signin/page.tsx`, `AnswerComposer.tsx`, `getQueryClient`, `Skeleton`, `requireUser`, `Toaster`, `signup/page.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `getAnswerErrorResult`, `auth.types.ts`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `Part A: Chat core`, `AuthedShell.tsx`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `interviews.queries.ts`, `pickThinkingLabel`, `Implementation Steps`, `interviews.types.ts`, `Implementation Plan: Voice Answers`, `Implementation Steps`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `apiClient`, `auth.queries.ts`, `Implementation Plan: Auth Session (cookie-based BFF)`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `getQueryClient`, `AnswerComposer`, `requireUser`, `Implementation Plan: Interviews Chat Layout`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `DataTable`, `interview-history-columns.tsx`, `AnswerComposer.tsx`, `HistoryContainer.tsx`, `interviews.queries.ts`, `InterviewConfigForm`, `react`, `AnswerComposer`, `auth.types.ts`, `sidebar.tsx`, `history-params.ts`, `InterviewTitleBar.tsx`, `Part A: Chat core`, `Implementation Steps`, `InterviewConfigForm.tsx`, `use-interview-history-table.ts`, `sheet.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 32 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _483 weakly-connected nodes found - possible documentation gaps or missing edges._