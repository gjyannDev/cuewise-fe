# Graph Report - cuewise-fe  (2026-11-04)

## Corpus Check
- 192 files · ~97,233 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1249 nodes · 3090 edges · 66 communities (65 shown, 1 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 518 edges (avg confidence: 0.95)
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
- app/layout.tsx
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm
- field.tsx
- auth-session.ts
- README.md
- AGENTS.md
- Part A: Chat core
- constants.ts
- useMutationCallbacks
- auth.types.ts
- AuthFormContainer.tsx
- interviews.queries.ts
- sidebar.tsx
- buildThreadView
- Feature: App Sidebar (shared shell for user and admin)
- InterviewsContainer.tsx
- Implementation: Interviews Setup UI (foundation)
- auth.routes.test.ts
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- sidebar.types.ts
- eslint.config.mjs
- devDependencies
- api.helper.ts
- scripts
- vitest
- requireUser
- Feature: Interview Follow-up Questions (client support)
- InterviewTitleBar.tsx
- done
- RoleSidebar.tsx
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- ChatThread.tsx
- interviews.types.ts
- Implementation Steps
- InterviewConfigForm.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interview Follow-up Questions (client support)
- [...path]/route.test.ts
- pickThinkingLabel
- Implementation Steps
- utils.ts
- AnswerComposer
- use-interview-chat.ts
- avatar.tsx
- interviews.services.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- Implementation: Interviews Chat Layout
- react
- Cuewise FE — Project Instructions
- .answerStream
- dialog.tsx
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- sse.test.ts
- breadcrumb.tsx
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- use-mutation-callback.ts
- ActiveInterview
- pick-thinking-label.test.ts

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

## Communities (66 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (19): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+11 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "app/layout.tsx"
Cohesion: 0.13
Nodes (19): Data Fetching (TanStack Query), Project Rules Applied, @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport, Providers() (+11 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+12 more)

### Community 7 - "InterviewConfigForm"
Cohesion: 0.22
Nodes (17): AuthCardProps, COPY, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+9 more)

### Community 8 - "field.tsx"
Cohesion: 0.05
Nodes (64): Known Issues, Skills Consulted, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted (+56 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): Project Conventions, ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath() (+17 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Part A: Chat core"
Cohesion: 0.16
Nodes (22): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part A: Chat core, Ready to Implement (+14 more)

### Community 13 - "constants.ts"
Cohesion: 0.09
Nodes (30): @hookform/resolvers, AnswerComposerHandle, AnswerComposerProps, ANSWER_COUNTER_FROM, ANSWER_MAX_LENGTH, FOLLOW_UP_CAPTION, INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES (+22 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.15
Nodes (22): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview (+14 more)

### Community 15 - "auth.types.ts"
Cohesion: 0.07
Nodes (51): Trade-offs & Rationale, nextConfig, next, ref_server_only, zod, POST(), POST(), POST() (+43 more)

### Community 16 - "AuthFormContainer.tsx"
Cohesion: 0.12
Nodes (23): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied (+15 more)

### Community 17 - "interviews.queries.ts"
Cohesion: 0.20
Nodes (8): interviewKeys, AnswerStreamOptions, interviewsService, AnswerRequest, Interview, StartInterviewRequest, AnswerStreamError, resyncCodes

### Community 18 - "sidebar.tsx"
Cohesion: 0.10
Nodes (20): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+12 more)

### Community 19 - "buildThreadView"
Cohesion: 0.29
Nodes (12): Skills Consulted, Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Skills Consulted, isStreaming(), ChatMessage(), ChatThread(), useInterviewChat() (+4 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "InterviewsContainer.tsx"
Cohesion: 0.19
Nodes (11): lucide-react, use-stick-to-bottom, ActiveInterviewProps, InterviewsContainerProps, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps (+3 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "auth.routes.test.ts"
Cohesion: 0.18
Nodes (13): axios, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody(), networkError() (+5 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.29
Nodes (7): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, sessionParamSchema, SessionParam, parseSessionParam()

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "sidebar.types.ts"
Cohesion: 0.19
Nodes (12): Deviations During Implementation, RoleHeaderTitle(), RoleHeaderTitleProps, AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig (+4 more)

### Community 27 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "api.helper.ts"
Cohesion: 0.13
Nodes (20): Part B: Robustness, Known Issues, Part B: Robustness, handleStart(), ApiError, apiErrorBodySchema, conflictDetailsSchema, isNoResponseError() (+12 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "vitest"
Cohesion: 0.16
Nodes (15): ref_node_url, vitest, answerResponse(), NextQuestion, Q1, Q2, Q3, REACTION (+7 more)

### Community 32 - "requireUser"
Cohesion: 0.13
Nodes (18): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+10 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 35 - "done"
Cohesion: 0.07
Nodes (34): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+26 more)

### Community 36 - "RoleSidebar.tsx"
Cohesion: 0.25
Nodes (6): Role, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 37 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (29): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+21 more)

### Community 38 - "ChatThread.tsx"
Cohesion: 0.19
Nodes (12): Deviations from Plan, motion, Shimmer, ChatMessageProps, ChatThreadProps, InterviewChatProps, InterviewerAvatar(), TypingIndicator() (+4 more)

### Community 39 - "interviews.types.ts"
Cohesion: 0.09
Nodes (21): DEFAULT_START_VALUES, answerRequestSchema, answerResponseSchema, answerStreamEventSchemas, interviewSchema, interviewTypeSchema, levelSchema, roleSchema (+13 more)

### Community 40 - "Implementation Steps"
Cohesion: 0.21
Nodes (17): Forms, Implementation Steps, Acceptance Criteria, Functional, Project Conventions, Implementation Steps, FieldGroup(), FieldSet() (+9 more)

### Community 41 - "InterviewConfigForm.tsx"
Cohesion: 0.12
Nodes (17): UX Requirements, Follow-up: interview bar instead of the details panel (after review), Deviations from Plan, class-variance-authority, Badge(), badgeVariants, InterviewColumns(), InterviewColumnsProps (+9 more)

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
Cohesion: 0.18
Nodes (11): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+3 more)

### Community 47 - "Implementation Steps"
Cohesion: 0.29
Nodes (8): Implementation Steps, AuthedShell(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), BUBBLES, InterviewSessionSkeleton(), AppShellSkeleton()

### Community 48 - "utils.ts"
Cohesion: 0.33
Nodes (3): MOTION_ELEMENTS, TextShimmerProps, src_lib_utils_cn

### Community 49 - "AnswerComposer"
Cohesion: 0.11
Nodes (17): Follow-up: chat-assistant styling (after review), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code) (+9 more)

### Community 50 - "use-interview-chat.ts"
Cohesion: 0.13
Nodes (17): INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn(), SendFailure, TurnAction, AnswerResponse (+9 more)

### Community 51 - "avatar.tsx"
Cohesion: 0.20
Nodes (7): Completed Steps, Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 52 - "interviews.services.ts"
Cohesion: 0.20
Nodes (11): isSessionErrorCode(), API, redirectIfSessionEnded(), bypassUnloadWarning(), isUnloadWarningBypassed(), START_TIMEOUT_MS, jsonOrNull(), TERMINAL_EVENTS (+3 more)

### Community 53 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+8 more)

### Community 54 - "Implementation: Interviews Chat Layout"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Current Step, Follow-up: conversation title with a menu (after review), Implementation: Interviews Chat Layout, Links, Open Questions (+6 more)

### Community 55 - "react"
Cohesion: 0.23
Nodes (10): Layout & UX Design, react, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent() (+2 more)

### Community 56 - "Cuewise FE — Project Instructions"
Cohesion: 0.14
Nodes (13): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT) (+5 more)

### Community 57 - ".answerStream"
Cohesion: 0.27
Nodes (11): Architecture & Design, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Completed Steps, Test Cases, ApiResponseError (+3 more)

### Community 58 - "dialog.tsx"
Cohesion: 0.32
Nodes (11): Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogPortal() (+3 more)

### Community 59 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 60 - "sse.test.ts"
Cohesion: 0.21
Nodes (6): Step 2: The SSE parser (`src/lib/api/sse.ts`), readSseStream(), SseFrame, collect(), encoder, EXPECTED

### Community 61 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.18
Nodes (10): Baseline Failures, Changes Made, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+2 more)

### Community 63 - "use-mutation-callback.ts"
Cohesion: 0.25
Nodes (7): ActionMode, BuildCallbackEffects, getErrorMessage(), runEffects(), SideEffect, SideEffects, UseCrudCallbacksParams

### Community 64 - "ActiveInterview"
Cohesion: 0.43
Nodes (7): Implementation Steps, Completed Steps, Phase 2: Frontend (cuewise-fe), ActiveInterview(), InterviewChat(), AnswerErrorResult, cancel()

### Community 65 - "pick-thinking-label.test.ts"
Cohesion: 0.38
Nodes (5): INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, earlierMain, followUpOf(), lastMain

## Knowledge Gaps
- **420 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+415 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 507 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `app/layout.tsx`, `InterviewConfigForm`, `field.tsx`, `constants.ts`, `auth.types.ts`, `interviews.queries.ts`, `sidebar.tsx`, `InterviewsContainer.tsx`, `interviews/page.tsx`, `requireUser`, `InterviewTitleBar.tsx`, `ChatThread.tsx`, `InterviewConfigForm.tsx`, `Implementation Steps`, `utils.ts`, `use-interview-chat.ts`, `avatar.tsx`, `interviews.services.ts`, `dialog.tsx`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `app/layout.tsx`, `auth-session.ts`, `Part A: Chat core`, `AuthFormContainer.tsx`, `buildThreadView`, `InterviewsContainer.tsx`, `api.helper.ts`, `requireUser`, `done`, `RoleSidebar.tsx`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `Implementation Steps`, `Implementation Steps`, `AnswerComposer`, `use-interview-chat.ts`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `Cuewise FE — Project Instructions`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `use-mutation-callback.ts`, `ActiveInterview`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `package.json`, `pick-thinking-label.test.ts`, `RoleSidebar.tsx`, `interviews.types.ts`, `auth-session.ts`, `[...path]/route.test.ts`, `auth.types.ts`, `avatar.tsx`, `interviews.services.ts`, `auth.routes.test.ts`, `interviews/page.tsx`, `sidebar.types.ts`, `sse.test.ts`, `api.helper.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 31 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _420 weakly-connected nodes found - possible documentation gaps or missing edges._