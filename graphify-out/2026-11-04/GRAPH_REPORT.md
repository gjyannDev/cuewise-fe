# Graph Report - cuewise-fe  (2026-11-04)

## Corpus Check
- 219 files · ~112,081 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1456 nodes · 3624 edges · 76 communities (75 shown, 1 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 583 edges (avg confidence: 0.95)
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
- app/layout.tsx
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm.tsx
- field.tsx
- proxy
- README.md
- AGENTS.md
- ActiveInterview
- constants.ts
- useMutationCallbacks
- auth.types.ts
- [...path]/route.ts
- interviews.types.ts
- AppShell
- InterviewsContainer
- Feature: App Sidebar (shared shell for user and admin)
- Part A: Chat core
- Implementation: Interviews Setup UI (foundation)
- vitest
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- InterviewColumns
- Feature: Interview Answer Streaming (client support for the backend's SSE turn)
- devDependencies
- api.helper.ts
- scripts
- interviews.ts
- requireUser
- Feature: Interview Follow-up Questions (client support)
- current-user.server.ts
- done
- RoleSidebar.tsx
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- utils.ts
- get-answer-error-result.ts
- react
- next
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interview Follow-up Questions (client support)
- [...path]/route.test.ts
- pickThinkingLabel
- Implementation Steps
- sidebar.tsx
- HistoryContainer.tsx
- use-interview-chat.ts
- avatar.tsx
- InterviewTitleBar.tsx
- AnswerComposer
- buildThreadView
- Button
- Cuewise FE — Project Instructions
- .answerStream
- Implementation Steps
- Implementation: Voice Answers
- parse-answer-stream-event.ts
- breadcrumb.tsx
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- auth-session.ts
- Implementation: Interview History Page (frontend)
- AuthForm
- interview-history-columns.tsx
- Implementation: Interviews Chat Layout
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- AuthCard
- use-audio-recorder.ts
- InterviewStatusBadge.tsx
- interviews.services.test.ts
- format-question-count.ts
- cookie-jar.ts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 62 edges
2. `useMutationCallbacks()` - 42 edges
3. `Button()` - 41 edges
4. `vitest` - 34 edges
5. `Part A: Chat core` - 33 edges
6. `Implementation Steps` - 31 edges
7. `lucide-react` - 29 edges
8. `InterviewsContainer()` - 27 edges
9. `parseApiError()` - 26 edges
10. `requireUser()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Ready to Implement` --references--> `Conversation()`  [INFERRED]
  docs/features/interviews-chat-layout/plan.md → src/components/ai-elements/conversation.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts
- `Project Rules Applied` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/interviews-chat-layout/plan.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (76 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (18): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+10 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "app/layout.tsx"
Cohesion: 0.13
Nodes (18): Data Fetching (TanStack Query), Project Rules Applied, @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport, Providers() (+10 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Known Issues, Links, Not verified automatically (manual browser check by the user), Open Questions (+5 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "InterviewConfigForm.tsx"
Cohesion: 0.18
Nodes (22): Affected Files & Patterns, Implementation Steps, AuthCardProps, COPY, Card(), CardContent(), CardDescription(), CardFooter() (+14 more)

### Community 8 - "field.tsx"
Cohesion: 0.05
Nodes (65): Forms, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+57 more)

### Community 9 - "proxy"
Cohesion: 0.23
Nodes (16): Project Conventions, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), readTokenPayload(), resolveSafeNext(), clearCookieIf() (+8 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "ActiveInterview"
Cohesion: 0.13
Nodes (19): Project Conventions, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+11 more)

### Community 13 - "constants.ts"
Cohesion: 0.07
Nodes (39): AnswerComposerHandle, AnswerComposerProps, RECORDER_ERROR_MESSAGES, MicState, ANSWER_COUNTER_FROM, ANSWER_MAX_LENGTH, EMPTY_RECORDING_MESSAGE, INTERVIEW_TYPE_OPTIONS (+31 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.11
Nodes (22): Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview, Project Rules Applied (+14 more)

### Community 15 - "auth.types.ts"
Cohesion: 0.15
Nodes (19): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, backendTokenSchema (+11 more)

### Community 16 - "[...path]/route.ts"
Cohesion: 0.13
Nodes (17): Trade-offs & Rationale, zod, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS (+9 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.09
Nodes (32): DEFAULT_START_VALUES, interviewKeys, AnswerStreamOptions, TranscribeVariables, answerFormSchema, answerRequestSchema, answerResponseSchema, interviewListSchema (+24 more)

### Community 18 - "AppShell"
Cohesion: 0.25
Nodes (9): Architecture & Design, Known Issues, SidebarInset(), SidebarProvider(), SidebarTrigger(), subscribe(), useIsMobile(), AppShell() (+1 more)

### Community 19 - "InterviewsContainer"
Cohesion: 0.22
Nodes (18): Skills Consulted, Completed Steps, Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Test Cases, Implementation Steps, Part B: Robustness, Testing Strategy, Known Issues (+10 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Part A: Chat core"
Cohesion: 0.16
Nodes (26): Affected Files & Patterns, Part A: Chat core, Deviations from Plan, Follow-up: chat-assistant styling (after review), Implementation Steps, Skills Consulted, Completed Steps, motion (+18 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "vitest"
Cohesion: 0.15
Nodes (15): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+7 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.20
Nodes (10): Affected Files & Patterns, Skills Consulted, InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, useInterviewQuery(), sessionParamSchema (+2 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "InterviewColumns"
Cohesion: 0.22
Nodes (7): Follow-up: interview bar instead of the details panel (after review), Deviations During Implementation, InterviewColumns(), InterviewColumnsProps, InterviewDetailList(), InterviewDetailListProps, InterviewSessionSkeleton()

### Community 27 - "Feature: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional (+6 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "api.helper.ts"
Cohesion: 0.12
Nodes (16): axios, ApiError, ApiErrorBody, apiErrorBodySchema, conflictDetailsSchema, isSessionErrorCode(), NormalizedError, normalizeError() (+8 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "interviews.ts"
Cohesion: 0.13
Nodes (18): INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, answerResponse(), NextQuestion, Q1, Q2, Q3, REACTION (+10 more)

### Community 32 - "requireUser"
Cohesion: 0.07
Nodes (29): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+21 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "current-user.server.ts"
Cohesion: 0.31
Nodes (9): ref_server_only, AuthedShellProps, getSessionUser(), axios, AxiosRequestConfig, backendApi, SessionExpiredError, getAccessToken() (+1 more)

### Community 35 - "done"
Cohesion: 0.13
Nodes (21): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+13 more)

### Community 36 - "RoleSidebar.tsx"
Cohesion: 0.14
Nodes (15): Role, RoleHeaderTitle(), RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR (+7 more)

### Community 37 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (28): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal, Non-Functional (+20 more)

### Community 38 - "utils.ts"
Cohesion: 0.13
Nodes (12): ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, MOTION_ELEMENTS, TextShimmerProps, src_lib_utils_cn, RECORDING_FORMATS (+4 more)

### Community 39 - "get-answer-error-result.ts"
Cohesion: 0.20
Nodes (7): Phase 2: Frontend (cuewise-fe), RESYNC_ERROR_CODES, streamTurn(), AnswerErrorResult, AnswerStreamError, resyncCodes, cancel()

### Community 40 - "react"
Cohesion: 0.20
Nodes (9): lucide-react, react, ActiveInterviewProps, InterviewsContainerProps, InterviewMessageCard(), InterviewMessageCardProps, StartInterviewFieldErrors, StartInterviewFormValues (+1 more)

### Community 41 - "next"
Cohesion: 0.34
Nodes (11): nextConfig, next, POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody() (+3 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Links, Open Questions, Skills Consulted During Implementation, Status, Test Cases (+3 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 45 - "[...path]/route.test.ts"
Cohesion: 0.15
Nodes (9): ANSWER_TIMEOUT_MS, fetchMock, encoder, openStream(), sseFrame(), streamOf(), collect(), encoder (+1 more)

### Community 46 - "pickThinkingLabel"
Cohesion: 0.17
Nodes (12): Affected Files & Patterns, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement (+4 more)

### Community 47 - "Implementation Steps"
Cohesion: 0.23
Nodes (11): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), RoleSidebar() (+3 more)

### Community 48 - "sidebar.tsx"
Cohesion: 0.13
Nodes (14): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+6 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.06
Nodes (50): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+42 more)

### Community 50 - "use-interview-chat.ts"
Cohesion: 0.12
Nodes (19): Changes Made (cuewise-fe, uncommitted), INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, TRANSCRIPTION_ERROR_MESSAGES, TRANSCRIPTION_UNAVAILABLE_MESSAGE, UNCONFIRMED_SEND_MESSAGE, SendFailure (+11 more)

### Community 51 - "avatar.tsx"
Cohesion: 0.22
Nodes (6): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 52 - "InterviewTitleBar.tsx"
Cohesion: 0.14
Nodes (12): Layout & UX Design, Follow-up: conversation title with a menu (after review), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger() (+4 more)

### Community 53 - "AnswerComposer"
Cohesion: 0.05
Nodes (34): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be) (+26 more)

### Community 54 - "buildThreadView"
Cohesion: 0.20
Nodes (13): Skills Consulted, Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), reduceTurn(), useInterviewChat(), submit(), ThreadView, buildThreadView() (+5 more)

### Community 55 - "Button"
Cohesion: 0.19
Nodes (17): use-stick-to-bottom, Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter() (+9 more)

### Community 56 - "Cuewise FE — Project Instructions"
Cohesion: 0.15
Nodes (12): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth (+4 more)

### Community 57 - ".answerStream"
Cohesion: 0.16
Nodes (9): Architecture: Modular, Feature-Driven, Step 6: The service (`modules/interviews/services/interviews.services.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Completed Steps, apiClient, readSseStream(), ApiResponseError, NoResponseError (+1 more)

### Community 58 - "Implementation Steps"
Cohesion: 0.28
Nodes (13): Implementation Steps, Acceptance Criteria, Functional, Project Conventions, Toaster(), authKeys, useCurrentProfileQuery(), useLogoutMutation() (+5 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "parse-answer-stream-event.ts"
Cohesion: 0.32
Nodes (6): SseFrame, answerStreamEventSchemas, AnswerStreamEventName, isKnown(), parseAnswerStreamEvent(), ParsedStreamEvent

### Community 61 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 63 - "auth-session.ts"
Cohesion: 0.14
Nodes (18): Deviations recorded during /implement, Completed Steps, AuthFormContainer(), handleSubmit(), AuthFormContainerProps, ERROR_TITLES, ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS (+10 more)

### Community 64 - "Implementation: Interview History Page (frontend)"
Cohesion: 0.12
Nodes (16): 1. Dependencies, Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interview History Page (frontend), Known Issues (+8 more)

### Community 65 - "AuthForm"
Cohesion: 0.19
Nodes (13): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement (+5 more)

### Community 66 - "interview-history-columns.tsx"
Cohesion: 0.25
Nodes (9): @tanstack/react-table, column, interviewHistoryColumns, interviewHistoryFeatures, InterviewHistoryRowActions(), InterviewHistoryRowActionsProps, InterviewStatusBadge(), ROLE_LABELS (+1 more)

### Community 67 - "Implementation: Interviews Chat Layout"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Implementation: Interviews Chat Layout, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "AuthCard"
Cohesion: 0.29
Nodes (9): Layout & UX Design, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage() (+1 more)

### Community 70 - "use-audio-recorder.ts"
Cohesion: 0.29
Nodes (9): AudioRecorderOptions, detectFormat(), errorKind(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd, useAudioRecorder() (+1 more)

### Community 71 - "InterviewStatusBadge.tsx"
Cohesion: 0.28
Nodes (7): class-variance-authority, Badge(), badgeVariants, InterviewStatusBadgeProps, STATUS_VARIANTS, SESSION_STATUS_LABELS, SessionStatus

### Community 72 - "interviews.services.test.ts"
Cohesion: 0.29
Nodes (5): TRANSCRIBE_TIMEOUT_MS, interviewListItem(), get, interview, post

### Community 73 - "format-question-count.ts"
Cohesion: 0.53
Nodes (4): FOLLOW_UP_CAPTION, formatInterviewCount(), formatProgress(), formatQuestionCount()

### Community 74 - "cookie-jar.ts"
Cohesion: 0.40
Nodes (3): cookieJar, nextHeadersMock, StoredCookie

### Community 75 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **483 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+478 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 581 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `app/layout.tsx`, `InterviewConfigForm.tsx`, `field.tsx`, `constants.ts`, `interviews.types.ts`, `AppShell`, `Part A: Chat core`, `interviews/page.tsx`, `InterviewColumns`, `api.helper.ts`, `requireUser`, `current-user.server.ts`, `utils.ts`, `Implementation Steps`, `sidebar.tsx`, `HistoryContainer.tsx`, `use-interview-chat.ts`, `avatar.tsx`, `InterviewTitleBar.tsx`, `Button`, `breadcrumb.tsx`, `AuthCard`, `use-audio-recorder.ts`, `InterviewStatusBadge.tsx`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `app/layout.tsx`, `InterviewConfigForm.tsx`, `proxy`, `ActiveInterview`, `InterviewsContainer`, `requireUser`, `RoleSidebar.tsx`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `get-answer-error-result.ts`, `react`, `pickThinkingLabel`, `Implementation Steps`, `use-interview-chat.ts`, `AnswerComposer`, `buildThreadView`, `.answerStream`, `Implementation Steps`, `auth-session.ts`, `AuthForm`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `package.json`, `interview-history-columns.tsx`, `RoleSidebar.tsx`, `interviews.services.test.ts`, `proxy`, `cookie-jar.ts`, `format-question-count.ts`, `[...path]/route.test.ts`, `auth.types.ts`, `[...path]/route.ts`, `interviews.types.ts`, `HistoryContainer.tsx`, `avatar.tsx`, `Implementation Steps`, `AnswerComposer`, `interviews/page.tsx`, `api.helper.ts`, `interviews.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 31 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 32 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _483 weakly-connected nodes found - possible documentation gaps or missing edges._