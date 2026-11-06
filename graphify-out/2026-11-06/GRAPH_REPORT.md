# Graph Report - cuewise-fe  (2026-11-06)

## Corpus Check
- 221 files · ~135,302 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1636 nodes · 4263 edges · 86 communities (85 shown, 1 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 736 edges (avg confidence: 0.95)
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
- requireUser
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- AuthCard
- react
- Implementation Steps
- README.md
- AGENTS.md
- InterviewsContainer
- feedback.utils.ts
- api.helper.ts
- AuthFormContainer.tsx
- next
- interviews.types.ts
- Implementation Plan: App Sidebar (shared shell for user and admin)
- Implementation Plan: Interviews Answer Flow
- Feature: App Sidebar (shared shell for user and admin)
- Affected Files & Patterns
- Implementation: Interviews Setup UI (foundation)
- feedback.utils.test.ts
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- InterviewConfigForm.tsx
- Feature: Interview Feedback Screen (frontend)
- devDependencies
- Implementation: Interviews Chat Layout
- scripts
- done
- status
- Feature: Interview Follow-up Questions (client support)
- InterviewConfigForm
- Feature: Interview History Page (frontend)
- lucide-react
- history.utils.ts
- ChatThread.tsx
- constants.ts
- InterviewMessageCard
- InterviewsContainer.tsx
- AuthedShell.tsx
- Implementation: Interviews Answer Flow
- stream.utils.ts
- interviews.services.test.ts
- Implementation Plan: Interview Follow-up Questions (client support)
- AnswerComposer
- sidebar.tsx
- HistoryContainer
- interviews.queries.ts
- ChatMessage.tsx
- Button
- Implementation Plan: Voice Answers
- auth.types.ts
- useMutationCallbacks
- Feature: Voice Answers (speak an answer, review the transcript, send)
- apiClient
- api.helper.test.ts
- Implementation: Voice Answers
- FeedbackQuestionAccordion.tsx
- breadcrumb.tsx
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- cookie-jar.ts
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- Implementation Plan: Auth Session (cookie-based BFF)
- interview-history-columns.tsx
- use-interview-chat.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- chat.utils.ts
- utils.ts
- DataTable
- .answerStream
- Implementation Steps
- app/layout.tsx
- Skeleton
- AnswerComposer.tsx
- sheet.tsx
- buildThreadView
- interviews.ts
- chat.utils.test.ts
- Implementation Steps
- Learn: Showing a slow, stored AI result (the interview feedback screen)
- FeedbackResult.tsx
- FeedbackStateMessage.tsx
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 70 edges
2. `Button()` - 52 edges
3. `useMutationCallbacks()` - 47 edges
4. `InterviewsContainer()` - 34 edges
5. `lucide-react` - 33 edges
6. `Part A: Chat core` - 33 edges
7. `parseApiError()` - 32 edges
8. `requireUser()` - 31 edges
9. `Implementation Steps` - 31 edges
10. `next` - 27 edges

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

## Communities (86 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, @hookform/resolvers, next-themes, react-dom, shadcn, sonner (+8 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.14
Nodes (23): Implementation Steps, SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu() (+15 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "requireUser"
Cohesion: 0.11
Nodes (21): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth (+13 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "AuthCard"
Cohesion: 0.29
Nodes (9): Layout & UX Design, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage() (+1 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (59): Architecture & Design, class-variance-authority, cn, radix-ui, react, react-hook-form, Alert(), AlertTitle() (+51 more)

### Community 9 - "Implementation Steps"
Cohesion: 0.12
Nodes (33): Project Conventions, Deviations recorded during /implement, Implementation Steps, AuthCardProps, COPY, TooltipProvider(), ACCESS_TOKEN_COOKIE, authRouteHref() (+25 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "InterviewsContainer"
Cohesion: 0.19
Nodes (23): Skills Consulted, Skills Consulted, Completed Steps, Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Implementation Steps, Part A: Chat core, Part B: Robustness, Skills Consulted (+15 more)

### Community 13 - "feedback.utils.ts"
Cohesion: 0.12
Nodes (23): 5. What can go wrong, 6. Try it yourself, CRITERION_LABELS, FEEDBACK_ERROR_CODES, FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, FEEDBACK_START_VALUE, feedbackRoute() (+15 more)

### Community 14 - "api.helper.ts"
Cohesion: 0.15
Nodes (14): axios, ApiError, conflictDetailsSchema, isSessionErrorCode(), NormalizedError, normalizeError(), responseOf(), SESSION_ERROR_CODES (+6 more)

### Community 15 - "AuthFormContainer.tsx"
Cohesion: 0.28
Nodes (10): Acceptance Criteria, AuthFormContainer(), AuthFormContainerProps, ERROR_TITLES, authKeys, useCurrentProfileQuery(), useLogoutMutation(), useSignInMutation() (+2 more)

### Community 16 - "next"
Cohesion: 0.07
Nodes (47): Skills Consulted During Implementation, Trade-offs & Rationale, nextConfig, next, ref_server_only, POST(), POST(), POST() (+39 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.10
Nodes (33): zod, FEEDBACK_CRITERIA, HISTORY_SORT_COLUMNS, SESSION_STATUSES, SORT_DIRECTIONS, answerFormSchema, answerRequestSchema, answerResponseSchema (+25 more)

### Community 18 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 19 - "Implementation Plan: Interviews Answer Flow"
Cohesion: 0.18
Nodes (12): Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied, Ready to Implement (+4 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Affected Files & Patterns"
Cohesion: 0.32
Nodes (12): Architecture & Design, Skills Consulted, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Affected Files & Patterns, Implementation Steps, Skills Consulted, Completed Steps, isStreaming() (+4 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "feedback.utils.test.ts"
Cohesion: 0.19
Nodes (14): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+6 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (16): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interview Feedback Screen (frontend), Known Issues (+8 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "InterviewConfigForm.tsx"
Cohesion: 0.11
Nodes (18): Acceptance Criteria, UX Requirements, Follow-up: interview bar instead of the details panel (after review), Deviations from Plan, InterviewColumns(), InterviewColumnsProps, InterviewConfigFormProps, TYPE_ICONS (+10 more)

### Community 27 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.05
Nodes (41): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+33 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "Implementation: Interviews Chat Layout"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Implementation: Interviews Chat Layout, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "done"
Cohesion: 0.10
Nodes (26): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`) (+18 more)

### Community 32 - "status"
Cohesion: 0.16
Nodes (16): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+8 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "InterviewConfigForm"
Cohesion: 0.29
Nodes (14): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), InterviewClosingCard(), InterviewClosingCardProps (+6 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional, Out of Scope (+4 more)

### Community 36 - "lucide-react"
Cohesion: 0.14
Nodes (18): Deviations During Implementation, lucide-react, Role, RoleHeaderTitle(), RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS (+10 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.25
Nodes (16): Testing Strategy, Testing Strategy, Deviations from Plan, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, useInterviewHistoryTable(), historyPageParamSchema, applyPaginationChange() (+8 more)

### Community 38 - "ChatThread.tsx"
Cohesion: 0.18
Nodes (15): Architecture & Design, Trade-offs & Rationale, Project Conventions, use-stick-to-bottom, Conversation(), ConversationContent(), ConversationContentProps, ConversationEmptyStateProps (+7 more)

### Community 39 - "constants.ts"
Cohesion: 0.08
Nodes (32): HistoryContainerProps, NO_ROWS, InterviewNotFoundCardProps, FEEDBACK_DISCLAIMER, FEEDBACK_PAGE_TITLE, FEEDBACK_POLL_MS, FEEDBACK_READY_ANNOUNCEMENT, FEEDBACK_START_PARAM (+24 more)

### Community 40 - "InterviewMessageCard"
Cohesion: 0.21
Nodes (11): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Ready to Implement, Spec Requirements -> Implementation, Trade-offs & Rationale (+3 more)

### Community 41 - "InterviewsContainer.tsx"
Cohesion: 0.17
Nodes (15): Affected Files & Patterns, InterviewsContainerProps, InterviewsContent(), InterviewsPage(), InterviewsPageProps, START_TIMEOUT_MESSAGE, useInterviewQuery(), sessionParamSchema (+7 more)

### Community 42 - "AuthedShell.tsx"
Cohesion: 0.12
Nodes (19): Baseline Failures, Changes Made (uncommitted, for the user to review), Completed Steps, Deviations from Plan, Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions (+11 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.07
Nodes (25): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+17 more)

### Community 44 - "stream.utils.ts"
Cohesion: 0.16
Nodes (13): Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), SseFrame, reduceTurn(), AnswerStreamEvent, AnswerStreamEventName, ANSWER_STREAM_START, inferStreamingQuestion(), ParsedStreamEvent (+5 more)

### Community 45 - "interviews.services.test.ts"
Cohesion: 0.11
Nodes (14): ANSWER_TIMEOUT_MS, FEEDBACK_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, fetchMock, encoder, openStream(), sseFrame(), streamOf() (+6 more)

### Community 46 - "Implementation Plan: Interview Follow-up Questions (client support)"
Cohesion: 0.20
Nodes (9): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 47 - "AnswerComposer"
Cohesion: 0.22
Nodes (6): Follow-up: chat-assistant styling (after review), Phase 2: Frontend (cuewise-fe), AnswerComposer(), transcribe(), appendTranscript(), cancel()

### Community 48 - "sidebar.tsx"
Cohesion: 0.12
Nodes (18): Input(), SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), SidebarMenuButton(), sidebarMenuButtonVariants, SidebarProvider() (+10 more)

### Community 49 - "HistoryContainer"
Cohesion: 0.43
Nodes (7): Architecture & Design, HistoryContainer(), HistoryContent(), HistoryPage(), HistoryPageProps, InterviewHistorySkeleton(), useInterviewHistoryQuery()

### Community 50 - "interviews.queries.ts"
Cohesion: 0.16
Nodes (13): Testing Strategy, interviewKeys, AnswerStreamOptions, TranscribeVariables, interviewsService, recordingFileName(), TERMINAL_EVENTS, Feedback (+5 more)

### Community 51 - "ChatMessage.tsx"
Cohesion: 0.14
Nodes (11): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, Avatar(), AvatarFallback(), ChatMessageProps, InterviewerAvatar() (+3 more)

### Community 52 - "Button"
Cohesion: 0.11
Nodes (24): Layout & UX Design, Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter() (+16 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.13
Nodes (14): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be) (+6 more)

### Community 54 - "auth.types.ts"
Cohesion: 0.16
Nodes (21): Forms, Affected Files & Patterns, Functional, Project Conventions, Known Issues, Implementation Steps, AuthForm(), AuthFormProps (+13 more)

### Community 55 - "useMutationCallbacks"
Cohesion: 0.10
Nodes (21): Data Fetching (TanStack Query), Spec Requirements -> Implementation, Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted (+13 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "apiClient"
Cohesion: 0.28
Nodes (3): Architecture: Modular, Feature-Driven, Skills Consulted, apiClient

### Community 58 - "api.helper.test.ts"
Cohesion: 0.25
Nodes (4): body(), assign, bypass, clear

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.22
Nodes (16): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, Progress(), CriterionScore() (+8 more)

### Community 61 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.18
Nodes (10): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+2 more)

### Community 63 - "cookie-jar.ts"
Cohesion: 0.40
Nodes (3): cookieJar, nextHeadersMock, StoredCookie

### Community 64 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.14
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation (+7 more)

### Community 65 - "Implementation Plan: Auth Session (cookie-based BFF)"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+1 more)

### Community 66 - "interview-history-columns.tsx"
Cohesion: 0.13
Nodes (21): @tanstack/react-table, column, interviewHistoryColumns, InterviewHistoryRowActions(), InterviewHistoryRowActionsProps, InterviewStatusBadge(), InterviewStatusBadgeProps, STATUS_VARIANTS (+13 more)

### Community 67 - "use-interview-chat.ts"
Cohesion: 0.13
Nodes (17): Changes Made (cuewise-fe, uncommitted), INTERVIEWER_SLOW_LABEL, RESYNC_ERROR_CODES, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, TRANSCRIPTION_ERROR_MESSAGES, TRANSCRIPTION_UNAVAILABLE_MESSAGE, UNCONFIRMED_SEND_MESSAGE (+9 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "chat.utils.ts"
Cohesion: 0.18
Nodes (13): Affected Files & Patterns, Implementation Steps, AnswerErrorResult, AnswerRequest, AnswerResponse, InterviewQuestion, InterviewSession, Reaction (+5 more)

### Community 70 - "utils.ts"
Cohesion: 0.21
Nodes (10): AudioRecorderOptions, detectFormat(), errorKind(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd, useAudioRecorder() (+2 more)

### Community 71 - "DataTable"
Cohesion: 0.33
Nodes (10): Table(), TableBody(), TableCaption(), TableCell(), TableHead(), TableHeader(), TableRow(), ARIA_SORT (+2 more)

### Community 72 - ".answerStream"
Cohesion: 0.12
Nodes (22): Implementation Steps, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`), Step 14: Gates and the manual end-to-end run, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 2: The SSE parser (`src/lib/api/sse.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`) (+14 more)

### Community 73 - "Implementation Steps"
Cohesion: 0.22
Nodes (16): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), FeedbackGenerating() (+8 more)

### Community 74 - "app/layout.tsx"
Cohesion: 0.13
Nodes (19): Testing Strategy, Completed Steps, Project Rules Applied, @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport (+11 more)

### Community 75 - "Skeleton"
Cohesion: 0.24
Nodes (8): AppLayout(), SidebarMenuSkeleton(), Skeleton(), BUBBLES, InterviewSessionSkeleton(), ROWS, HISTORY_PAGE_SIZE, AppShellSkeleton()

### Community 76 - "AnswerComposer.tsx"
Cohesion: 0.10
Nodes (20): ActiveInterviewProps, AnswerComposerHandle, AnswerComposerProps, RECORDER_ERROR_MESSAGES, AnswerMicButton(), AnswerMicButtonProps, clock(), MicState (+12 more)

### Community 77 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

### Community 78 - "buildThreadView"
Cohesion: 0.16
Nodes (13): Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Testing Strategy, Deviations from Plan (+5 more)

### Community 79 - "interviews.ts"
Cohesion: 0.20
Nodes (11): FeedbackQuestion, emptyFeedback(), feedback(), FEEDBACK_ID, feedbackQuestion(), NextQuestion, Q1, Q2 (+3 more)

### Community 80 - "chat.utils.test.ts"
Cohesion: 0.20
Nodes (9): INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, transcriptItem(), answered, earlierMain, followUpOf(), lastMain, question1 (+1 more)

### Community 81 - "Implementation Steps"
Cohesion: 0.20
Nodes (9): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Trade-offs & Rationale (+1 more)

### Community 82 - "Learn: Showing a slow, stored AI result (the interview feedback screen)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen)

### Community 83 - "FeedbackResult.tsx"
Cohesion: 0.25
Nodes (8): FeedbackResultProps, HighlightsCard(), HighlightsCardProps, ScoreCardProps, TextList(), TextListProps, FEEDBACK_SECTIONS, formatOverall()

### Community 84 - "FeedbackStateMessage.tsx"
Cohesion: 0.25
Nodes (7): ALERTS, FeedbackMessageKind, FeedbackStateMessageProps, ICONS, linkButton(), FEEDBACK_MESSAGES, FeedbackView

### Community 85 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **532 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+527 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 635 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `requireUser`, `AuthCard`, `feedback.utils.ts`, `api.helper.ts`, `next`, `InterviewConfigForm.tsx`, `InterviewConfigForm`, `ChatThread.tsx`, `constants.ts`, `InterviewsContainer.tsx`, `AuthedShell.tsx`, `sidebar.tsx`, `HistoryContainer`, `interviews.queries.ts`, `ChatMessage.tsx`, `Button`, `FeedbackQuestionAccordion.tsx`, `breadcrumb.tsx`, `interview-history-columns.tsx`, `use-interview-chat.ts`, `utils.ts`, `DataTable`, `Implementation Steps`, `app/layout.tsx`, `Skeleton`, `AnswerComposer.tsx`, `sheet.tsx`, `FeedbackStateMessage.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `AppSidebar.tsx`, `requireUser`, `Implementation Steps`, `InterviewsContainer`, `feedback.utils.ts`, `AuthFormContainer.tsx`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `Implementation Plan: Interviews Answer Flow`, `Feature: Interview Feedback Screen (frontend)`, `done`, `lucide-react`, `ChatThread.tsx`, `InterviewsContainer.tsx`, `AuthedShell.tsx`, `AnswerComposer`, `Implementation Plan: Voice Answers`, `auth.types.ts`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `apiClient`, `use-interview-chat.ts`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `chat.utils.ts`, `Implementation Steps`, `app/layout.tsx`, `buildThreadView`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `AuthCard`, `react`, `Implementation Steps`, `InterviewsContainer`, `InterviewConfigForm.tsx`, `status`, `InterviewConfigForm`, `ChatThread.tsx`, `constants.ts`, `InterviewsContainer.tsx`, `AnswerComposer`, `sidebar.tsx`, `HistoryContainer`, `auth.types.ts`, `interview-history-columns.tsx`, `Implementation Steps`, `AnswerComposer.tsx`, `sheet.tsx`, `Implementation Steps`, `FeedbackResult.tsx`, `FeedbackStateMessage.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 34 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _532 weakly-connected nodes found - possible documentation gaps or missing edges._