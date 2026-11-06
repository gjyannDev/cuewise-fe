# Graph Report - cuewise-fe  (2026-11-06)

## Corpus Check
- 213 files · ~135,204 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1618 nodes · 4193 edges · 79 communities (77 shown, 2 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 718 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1a3bb27`
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
- signin/page.tsx
- react
- auth-session.ts
- README.md
- AGENTS.md
- ActiveInterview
- feedback.utils.ts
- api.helper.ts
- AuthForm.tsx
- [...path]/route.ts
- interviews.types.ts
- Implementation Plan: App Sidebar (shared shell for user and admin)
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- Part A: Chat core
- Implementation: Interviews Setup UI (foundation)
- Button
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- requireUser
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- devDependencies
- Implementation: Interviews Chat Layout
- scripts
- Feature: Interview Answer Streaming (client support for the backend's SSE turn)
- status
- Feature: Interview Follow-up Questions (client support)
- FeedbackResult.tsx
- Feature: Interview History Page (frontend)
- sidebar.types.ts
- history.utils.ts
- Feature: Interview Feedback Screen (frontend)
- constants.ts
- Implementation: Interview Follow-up Questions (client support)
- InterviewsContainer.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- interviews.queries.ts
- interviews.services.test.ts
- pickThinkingLabel
- AnswerComposer
- sidebar.tsx
- HistoryContainer.tsx
- interviews.services.ts
- avatar.tsx
- InterviewTitleBar.tsx
- Implementation Plan: Voice Answers
- Implementation Steps
- Implementation Steps
- Feature: Voice Answers (speak an answer, review the transcript, send)
- apiClient
- session-redirect.ts
- Implementation: Voice Answers
- FeedbackQuestionAccordion.tsx
- next
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- params
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- Implementation Plan: Auth Session (cookie-based BFF)
- interview-history-columns.tsx
- voice.utils.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- AnswerComposer.tsx
- DataTable
- done
- Implementation Steps
- ActiveInterview.tsx
- sheet.tsx
- chat.utils.test.ts
- Implementation Plan: Interview Feedback Screen (frontend)
- FeedbackStateMessage.tsx
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 67 edges
2. `Button()` - 52 edges
3. `useMutationCallbacks()` - 47 edges
4. `InterviewsContainer()` - 34 edges
5. `lucide-react` - 32 edges
6. `parseApiError()` - 32 edges
7. `requireUser()` - 31 edges
8. `Implementation Steps` - 31 edges
9. `Part A: Chat core` - 30 edges
10. `next` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Architecture & Design` --references--> `AuthForm()`  [INFERRED]
  docs/features/auth-session/plan.md → src/app/(auth)/_components/AuthForm.tsx
- `Overview` --references--> `AuthForm()`  [INFERRED]
  docs/features/auth-session/plan.md → src/app/(auth)/_components/AuthForm.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (79 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.14
Nodes (13): name, private, version, react-dom, shadcn, tailwindcss, @tailwindcss/turbopack, tw-animate-css (+5 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.19
Nodes (20): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.18
Nodes (10): AI Features (UI side), Common Commands, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth, Testing, Tooling (+2 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "signin/page.tsx"
Cohesion: 0.53
Nodes (4): SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps

### Community 8 - "react"
Cohesion: 0.05
Nodes (73): Skills Consulted, Architecture & Design, class-variance-authority, cn, lucide-react, motion, radix-ui, react (+65 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): Project Conventions, ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath() (+17 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "ActiveInterview"
Cohesion: 0.14
Nodes (26): Completed Steps, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part B: Robustness, Project Rules Applied (+18 more)

### Community 13 - "feedback.utils.ts"
Cohesion: 0.09
Nodes (32): 5. What can go wrong, 6. Try it yourself, CRITERION_LABELS, FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, FEEDBACK_START_VALUE, SCORE_MAX, useInterviewFeedback() (+24 more)

### Community 14 - "api.helper.ts"
Cohesion: 0.19
Nodes (12): Project Conventions, axios, ApiError, ApiErrorBody, conflictDetailsSchema, NormalizedError, parseApiError(), responseOf() (+4 more)

### Community 15 - "AuthForm.tsx"
Cohesion: 0.22
Nodes (9): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES, AuthFormMode, AuthFormValues (+1 more)

### Community 16 - "[...path]/route.ts"
Cohesion: 0.06
Nodes (57): Trade-offs & Rationale, ref_server_only, zod, POST(), POST(), POST(), forward(), ForwardContext (+49 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.10
Nodes (21): FEEDBACK_CRITERIA, HISTORY_SORT_COLUMNS, SESSION_STATUSES, SORT_DIRECTIONS, answerStreamEventSchemas, feedbackQuestionSchema, interviewListItemSchema, interviewTypeSchema (+13 more)

### Community 18 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.22
Nodes (8): Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy

### Community 19 - "useMutationCallbacks"
Cohesion: 0.11
Nodes (21): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied (+13 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Part A: Chat core"
Cohesion: 0.17
Nodes (25): Skills Consulted, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Affected Files & Patterns, Part A: Chat core, Deviations from Plan, Implementation Steps, Skills Consulted, Completed Steps (+17 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "Button"
Cohesion: 0.29
Nodes (13): Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+5 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (16): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interview Feedback Screen (frontend), Known Issues (+8 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "requireUser"
Cohesion: 0.19
Nodes (12): Affected Files & Patterns, Architecture & Design, Trade-offs & Rationale, Acceptance Criteria, Functional, Non-Functional, Requirements, AdminHome() (+4 more)

### Community 27 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.08
Nodes (26): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal, Non-Functional (+18 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "Implementation: Interviews Chat Layout"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links, Open Questions (+6 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "Feature: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Goal, Non-Functional, Out of Scope, Problem, Project Conventions (+3 more)

### Community 32 - "status"
Cohesion: 0.40
Nodes (5): Affected Files & Patterns, Blockers & Resolutions, Open Questions, SessionStatus, status()

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "FeedbackResult.tsx"
Cohesion: 0.14
Nodes (29): Layout & UX Design, AuthCard(), AuthCardProps, COPY, SignUpContent(), SignUpPage(), SignUpPageProps, Card() (+21 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional, Out of Scope (+4 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.23
Nodes (10): Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem(), isActivePath() (+2 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.16
Nodes (26): Implementation Steps, Testing Strategy, Implementation Steps, Testing Strategy, Changes Made, HISTORY_DEFAULT_PARAMS, InterviewHistoryTableOptions, useInterviewHistoryTable() (+18 more)

### Community 38 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 39 - "constants.ts"
Cohesion: 0.09
Nodes (32): FEEDBACK_GENERATING_LABEL, FEEDBACK_LEAVE_HINT, FEEDBACK_POLL_MS, FEEDBACK_SLOW_AFTER_MS, FEEDBACK_SLOW_LABEL, FEEDBACK_START_PARAM, FEEDBACK_STATUSES, HISTORY_PAGE_SIZES (+24 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 41 - "InterviewsContainer.tsx"
Cohesion: 0.11
Nodes (30): Affected Files & Patterns, Architecture & Design, Skills Consulted, Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied (+22 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.13
Nodes (19): Implementation Steps, Baseline Failures, Changes Made (uncommitted, for the user to review), Completed Steps, Deviations from Plan, Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links (+11 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "interviews.queries.ts"
Cohesion: 0.10
Nodes (31): Implementation Steps, Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, reduceTurn(), TurnAction, useInterviewChat() (+23 more)

### Community 45 - "interviews.services.test.ts"
Cohesion: 0.05
Nodes (38): ref_node_url, vitest, readSseStream(), SseFrame, ANSWER_TIMEOUT_MS, FEEDBACK_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, CREDENTIALS (+30 more)

### Community 46 - "pickThinkingLabel"
Cohesion: 0.15
Nodes (14): Affected Files & Patterns, Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied (+6 more)

### Community 47 - "AnswerComposer"
Cohesion: 0.20
Nodes (7): Follow-up: chat-assistant styling (after review), Skills Consulted, AnswerComposer(), AnswerMicButton(), AnswerMicButtonProps, clock(), MicState

### Community 48 - "sidebar.tsx"
Cohesion: 0.13
Nodes (14): Input(), SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), sidebarMenuButtonVariants, SidebarMenuSkeleton(), SidebarProvider() (+6 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.11
Nodes (23): Architecture & Design, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps, Alert() (+15 more)

### Community 50 - "interviews.services.ts"
Cohesion: 0.15
Nodes (13): DEFAULT_START_VALUES, FEEDBACK_ERROR_CODES, answerFormSchema, answerRequestSchema, answerResponseSchema, feedbackSchema, interviewListSchema, interviewSchema (+5 more)

### Community 51 - "avatar.tsx"
Cohesion: 0.22
Nodes (6): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 52 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.15
Nodes (12): Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+4 more)

### Community 54 - "Implementation Steps"
Cohesion: 0.20
Nodes (22): Forms, Affected Files & Patterns, Implementation Steps, Acceptance Criteria, Functional, Project Conventions, Known Issues, AuthForm() (+14 more)

### Community 55 - "Implementation Steps"
Cohesion: 0.12
Nodes (23): Data Fetching (TanStack Query), Completed Steps, Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Implementation Steps, Overview, Project Rules Applied (+15 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 58 - "session-redirect.ts"
Cohesion: 0.33
Nodes (6): Deviations recorded during /implement, Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), isSessionErrorCode(), redirectIfSessionEnded(), bypassUnloadWarning(), isUnloadWarningBypassed()

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.18
Nodes (18): Components, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, Progress() (+10 more)

### Community 61 - "next"
Cohesion: 0.14
Nodes (18): nextConfig, next, src_app_globals, metadata, RootLayout(), viewport, Breadcrumb(), BreadcrumbItem() (+10 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 63 - "params"
Cohesion: 0.50
Nodes (4): About the Project, Project Rules Applied, Skills Consulted During Implementation, params()

### Community 64 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Completed Steps, Deviations from Plan, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation (+7 more)

### Community 65 - "Implementation Plan: Auth Session (cookie-based BFF)"
Cohesion: 0.11
Nodes (16): Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+8 more)

### Community 66 - "interview-history-columns.tsx"
Cohesion: 0.17
Nodes (15): @tanstack/react-table, column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, FOLLOW_UP_CAPTION, INTERVIEW_TYPE_LABELS, LEVEL_LABELS (+7 more)

### Community 67 - "voice.utils.ts"
Cohesion: 0.15
Nodes (13): Phase 2: Frontend (cuewise-fe), Changes Made (cuewise-fe, uncommitted), transcribe(), RESYNC_ERROR_CODES, TRANSCRIPTION_ERROR_MESSAGES, TRANSCRIPTION_UNAVAILABLE_MESSAGE, TranscribeResult, recordingFileName() (+5 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 70 - "AnswerComposer.tsx"
Cohesion: 0.10
Nodes (22): Affected Files & Patterns, AudioRecorderOptions, detectFormat(), errorKind(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd (+14 more)

### Community 71 - "DataTable"
Cohesion: 0.16
Nodes (20): Architecture & Design, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Requirements -> Implementation, Skills Consulted, Trade-offs & Rationale (+12 more)

### Community 72 - "done"
Cohesion: 0.11
Nodes (29): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+21 more)

### Community 73 - "Implementation Steps"
Cohesion: 0.20
Nodes (17): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), InterviewNotFoundCardProps (+9 more)

### Community 76 - "ActiveInterview.tsx"
Cohesion: 0.20
Nodes (8): ActiveInterviewProps, AnswerComposerHandle, feedbackStartRoute(), STALE_THREAD_MESSAGE, THREAD_ERROR_MESSAGE, interviewsService, Interview, StartInterviewRequest

### Community 77 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

### Community 80 - "chat.utils.test.ts"
Cohesion: 0.12
Nodes (16): Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), Step 2: The SSE parser (`src/lib/api/sse.ts`), answerResponse(), Q1, Q2, REACTION, transcriptItem(), answered (+8 more)

### Community 82 - "Implementation Plan: Interview Feedback Screen (frontend)"
Cohesion: 0.11
Nodes (16): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen) (+8 more)

### Community 84 - "FeedbackStateMessage.tsx"
Cohesion: 0.20
Nodes (8): InterviewMessageCardProps, ALERTS, FeedbackMessageKind, FeedbackStateMessageProps, ICONS, linkButton(), FEEDBACK_MESSAGES, HISTORY_ROUTE

### Community 85 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **527 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+522 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 630 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `signin/page.tsx`, `feedback.utils.ts`, `[...path]/route.ts`, `Part A: Chat core`, `Button`, `requireUser`, `FeedbackResult.tsx`, `history.utils.ts`, `constants.ts`, `InterviewsContainer.tsx`, `Implementation: App Sidebar (shared shell for user and admin)`, `interviews.queries.ts`, `sidebar.tsx`, `HistoryContainer.tsx`, `avatar.tsx`, `InterviewTitleBar.tsx`, `Implementation Steps`, `session-redirect.ts`, `FeedbackQuestionAccordion.tsx`, `next`, `Implementation Plan: Auth Session (cookie-based BFF)`, `AnswerComposer.tsx`, `DataTable`, `Implementation Steps`, `ActiveInterview.tsx`, `sheet.tsx`, `FeedbackStateMessage.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `ActiveInterview`, `feedback.utils.ts`, `api.helper.ts`, `AuthForm.tsx`, `[...path]/route.ts`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `requireUser`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `InterviewsContainer.tsx`, `Implementation: App Sidebar (shared shell for user and admin)`, `interviews.queries.ts`, `pickThinkingLabel`, `Implementation Plan: Voice Answers`, `Implementation Steps`, `Implementation Steps`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `apiClient`, `params`, `Implementation Plan: Auth Session (cookie-based BFF)`, `voice.utils.ts`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `AnswerComposer.tsx`, `Implementation Steps`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `react`, `ActiveInterview`, `AuthForm.tsx`, `Part A: Chat core`, `FeedbackResult.tsx`, `history.utils.ts`, `InterviewsContainer.tsx`, `AnswerComposer`, `sidebar.tsx`, `HistoryContainer.tsx`, `InterviewTitleBar.tsx`, `Implementation Steps`, `interview-history-columns.tsx`, `AnswerComposer.tsx`, `DataTable`, `Implementation Steps`, `ActiveInterview.tsx`, `sheet.tsx`, `FeedbackStateMessage.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 34 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _527 weakly-connected nodes found - possible documentation gaps or missing edges._