# Graph Report - cuewise-fe  (2026-11-13)

## Corpus Check
- 220 files · ~142,511 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1703 nodes · 4416 edges · 91 communities (89 shown, 2 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 762 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `05c6a9ec`
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
- field.tsx
- auth-session.ts
- README.md
- AGENTS.md
- Part A: Chat core
- feedback.utils.ts
- api.helper.ts
- AuthForm.tsx
- [...path]/route.ts
- constants.ts
- Implementation Plan: App Sidebar (shared shell for user and admin)
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- ChatThread.tsx
- Implementation: Interviews Setup UI (foundation)
- Button
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- requireUser
- Feature: Interview Feedback Screen (frontend)
- devDependencies
- Implementation: Interviews Chat Layout
- scripts
- Feature: Interview Answer Streaming (client support for the backend's SSE turn)
- job-import.utils.test.ts
- Feature: Interview Follow-up Questions (client support)
- InterviewConfigForm
- Feature: Interview History Page (frontend)
- lucide-react
- history.utils.ts
- stream.utils.ts
- interviews.schema.ts
- Implementation: Interview Follow-up Questions (client support)
- InterviewMessageCard
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- interviews.types.ts
- interviews.services.test.ts
- buildThreadView
- ActiveInterview.tsx
- AppShell
- HistoryContainer.tsx
- auth.types.ts
- avatar.tsx
- InterviewTitleBar.tsx
- Implementation Plan: Voice Answers
- Implementation Steps
- app/layout.tsx
- Feature: Voice Answers (speak an answer, review the transcript, send)
- apiClient
- session-redirect.ts
- Implementation: Voice Answers
- FeedbackQuestionAccordion.tsx
- next
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- params
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- Implementation Steps
- interview-history-columns.tsx
- use-interview-chat.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- Feature: Job description import (link and smart paste)
- AnswerComposer.tsx
- status
- .answerStream
- react
- vitest
- current-user.server.ts
- utils.ts
- sidebar.tsx
- done
- sse.test.ts
- chat.utils.test.ts
- Implementation: Job description import (link and smart paste)
- Learn: Showing a slow, stored AI result (the interview feedback screen)
- bff.server.ts
- Implementation Plan: Job description import (link and smart paste)
- eslint.config.mjs
- FeedbackResult.tsx
- [...path]/route.test.ts
- Implementation Plan: Interviews Setup UI (foundation)
- DataTableColumnHeader.tsx
- AnswerMicButton.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 69 edges
2. `Button()` - 55 edges
3. `useMutationCallbacks()` - 51 edges
4. `InterviewsContainer()` - 38 edges
5. `parseApiError()` - 35 edges
6. `lucide-react` - 33 edges
7. `requireUser()` - 31 edges
8. `Implementation Steps` - 31 edges
9. `Part A: Chat core` - 30 edges
10. `InterviewConfigForm()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Blockers & Resolutions` --references--> `InterviewsContainer()`  [INFERRED]
  docs/features/interview-history/plan-v1.md → src/app/(app)/interviews/_components/InterviewsContainer.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (91 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, @hookform/resolvers, next-themes, react-dom, shadcn, sonner (+8 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.19
Nodes (20): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.18
Nodes (10): AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Testing, Tooling (+2 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "signin/page.tsx"
Cohesion: 0.53
Nodes (4): SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps

### Community 8 - "field.tsx"
Cohesion: 0.06
Nodes (59): Completed Steps, Architecture & Design, react-hook-form, Checkbox(), Field(), FieldDescription(), FieldError(), FieldLabel() (+51 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.13
Nodes (29): Project Conventions, Deviations recorded during /implement, handleSubmit(), ACCESS_TOKEN_COOKIE, authRouteHref(), canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute() (+21 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Part A: Chat core"
Cohesion: 0.20
Nodes (19): Completed Steps, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part A: Chat core, Project Rules Applied (+11 more)

### Community 13 - "feedback.utils.ts"
Cohesion: 0.12
Nodes (29): Implementation Steps, Testing Strategy, FEEDBACK_ERROR_CODES, useInterviewFeedback(), startGeneration(), useFeedbackQuery(), useGenerateFeedbackMutation(), Criterion (+21 more)

### Community 14 - "api.helper.ts"
Cohesion: 0.10
Nodes (21): ActionMode, BuildCallbackEffects, getErrorMessage(), runEffects(), SideEffect, SideEffects, UseCrudCallbacksParams, ApiError (+13 more)

### Community 15 - "AuthForm.tsx"
Cohesion: 0.17
Nodes (16): Acceptance Criteria, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainer(), AuthFormContainerProps, ERROR_TITLES, authKeys (+8 more)

### Community 16 - "[...path]/route.ts"
Cohesion: 0.12
Nodes (18): Trade-offs & Rationale, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS, STREAM_HEADERS (+10 more)

### Community 17 - "constants.ts"
Cohesion: 0.10
Nodes (26): InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, FEEDBACK_POLL_MS, FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, FEEDBACK_START_PARAM (+18 more)

### Community 18 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+1 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.09
Nodes (38): Project Conventions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design (+30 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "ChatThread.tsx"
Cohesion: 0.18
Nodes (21): Architecture & Design, Skills Consulted, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Affected Files & Patterns, Deviations from Plan, Implementation Steps, Skills Consulted, Completed Steps (+13 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "Button"
Cohesion: 0.32
Nodes (12): Button(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+4 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "requireUser"
Cohesion: 0.25
Nodes (9): Security & Auth, Affected Files & Patterns, Trade-offs & Rationale, Acceptance Criteria, AdminHome(), AdminHomeContent(), Home(), HomeContent() (+1 more)

### Community 27 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.05
Nodes (41): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+33 more)

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
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional (+6 more)

### Community 32 - "job-import.utils.test.ts"
Cohesion: 0.15
Nodes (23): Implementation Steps, JOB_DESCRIPTION_MAX_LENGTH, JOB_IMPORT_FAILED_MESSAGE, JOB_IMPORT_REPLACED_MESSAGE, JOB_PASTE_MAX_CHARS, JOB_TEXT_ERROR_CODE, JOB_URL_ERROR_CODES, JOB_URL_MAX_LENGTH (+15 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "InterviewConfigForm"
Cohesion: 0.21
Nodes (20): Layout & UX Design, AuthCard(), AuthCardProps, COPY, SignUpContent(), SignUpPage(), SignUpPageProps, Card() (+12 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional, Out of Scope (+4 more)

### Community 36 - "lucide-react"
Cohesion: 0.27
Nodes (9): Deviations During Implementation, lucide-react, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem() (+1 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.23
Nodes (18): Testing Strategy, Testing Strategy, Changes Made, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, InterviewHistoryTableOptions, useInterviewHistoryTable(), historyPageParamSchema (+10 more)

### Community 38 - "stream.utils.ts"
Cohesion: 0.12
Nodes (15): Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), reduceTurn(), answerStreamEventSchemas, AnswerStreamEventName, ANSWER_STREAM_START, AnswerStreamState, ParsedStreamEvent, reduceAnswerStream() (+7 more)

### Community 39 - "interviews.schema.ts"
Cohesion: 0.07
Nodes (31): DEFAULT_START_VALUES, FEEDBACK_CRITERIA, HISTORY_PAGE_SIZES, INTERVIEW_TYPES, JOB_PASTE_FORMATS, LEVELS, QUESTION_KINDS, ROLES (+23 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Current Step, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation, Status (+3 more)

### Community 41 - "InterviewMessageCard"
Cohesion: 0.09
Nodes (25): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Trade-offs & Rationale (+17 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "interviews.types.ts"
Cohesion: 0.10
Nodes (30): interviewKeys, AnswerStreamOptions, TranscribeVariables, answerRequestSchema, feedbackSchema, interviewListSchema, interviewSchema, transcriptionResponseSchema (+22 more)

### Community 45 - "interviews.services.test.ts"
Cohesion: 0.16
Nodes (15): Affected Files & Patterns, FEEDBACK_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, useTranscribeAnswerMutation(), getTranscribeErrorResult(), axiosErrorWith(), errorBody(), networkError() (+7 more)

### Community 46 - "buildThreadView"
Cohesion: 0.11
Nodes (23): Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), Completed Steps, Part A: Chat core (committed: c23b36f), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support) (+15 more)

### Community 47 - "ActiveInterview.tsx"
Cohesion: 0.14
Nodes (9): Follow-up: chat-assistant styling (after review), Skills Consulted, ActiveInterviewProps, isUnloadWarningBypassed(), AnswerComposer(), AnswerComposerHandle, feedbackStartRoute(), STALE_THREAD_MESSAGE (+1 more)

### Community 48 - "AppShell"
Cohesion: 0.33
Nodes (7): SidebarInset(), SidebarProvider(), SidebarTrigger(), subscribe(), useIsMobile(), AppShell(), AppShellProps

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.10
Nodes (25): Architecture & Design, class-variance-authority, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps (+17 more)

### Community 50 - "auth.types.ts"
Cohesion: 0.21
Nodes (13): zod, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, backendTokenSchema, currentProfileSchema, email, roleSchema (+5 more)

### Community 51 - "avatar.tsx"
Cohesion: 0.22
Nodes (6): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 52 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.12
Nodes (14): Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Phase 2: Frontend (cuewise-fe) (+6 more)

### Community 54 - "Implementation Steps"
Cohesion: 0.15
Nodes (25): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+17 more)

### Community 55 - "app/layout.tsx"
Cohesion: 0.13
Nodes (20): Data Fetching (TanStack Query), Testing Strategy, Completed Steps, @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport (+12 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 58 - "session-redirect.ts"
Cohesion: 0.16
Nodes (10): Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), axios, isSessionErrorCode(), API, redirectIfSessionEnded(), bypassUnloadWarning(), body(), assign (+2 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.16
Nodes (21): Architecture & Design, cn, radix-ui, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge() (+13 more)

### Community 61 - "next"
Cohesion: 0.17
Nodes (9): nextConfig, next, Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE (+1 more)

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.18
Nodes (10): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+2 more)

### Community 63 - "params"
Cohesion: 0.50
Nodes (4): About the Project, Project Rules Applied, Skills Consulted During Implementation, params()

### Community 64 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation, Status (+6 more)

### Community 65 - "Implementation Steps"
Cohesion: 0.23
Nodes (11): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), RoleSidebar() (+3 more)

### Community 66 - "interview-history-columns.tsx"
Cohesion: 0.20
Nodes (13): column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, feedbackRoute(), FOLLOW_UP_CAPTION, INTERVIEW_TYPE_LABELS, LEVEL_LABELS (+5 more)

### Community 67 - "use-interview-chat.ts"
Cohesion: 0.13
Nodes (16): Changes Made (cuewise-fe, uncommitted), transcribe(), INTERVIEWER_SLOW_LABEL, RECORDING_FAILED_MESSAGE, RESYNC_ERROR_CODES, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, TRANSCRIPTION_ERROR_MESSAGES (+8 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+7 more)

### Community 70 - "AnswerComposer.tsx"
Cohesion: 0.13
Nodes (18): AudioRecorderOptions, detectFormat(), errorKind(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd, useAudioRecorder() (+10 more)

### Community 71 - "status"
Cohesion: 0.13
Nodes (26): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+18 more)

### Community 72 - ".answerStream"
Cohesion: 0.16
Nodes (18): Implementation Steps, Step 14: Gates and the manual end-to-end run, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Completed Steps (+10 more)

### Community 73 - "react"
Cohesion: 0.07
Nodes (38): motion, react, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, MOTION_ELEMENTS (+30 more)

### Community 74 - "vitest"
Cohesion: 0.15
Nodes (10): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, ok(), cookieJar (+2 more)

### Community 75 - "current-user.server.ts"
Cohesion: 0.23
Nodes (11): ref_server_only, AuthedShellProps, getSessionUser(), ApiErrorBody, axios, AxiosRequestConfig, backendApi, SessionExpiredError (+3 more)

### Community 76 - "utils.ts"
Cohesion: 0.14
Nodes (10): Deviations from Plan, Affected Files & Patterns, use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, focusOnMount() (+2 more)

### Community 77 - "sidebar.tsx"
Cohesion: 0.13
Nodes (12): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+4 more)

### Community 78 - "done"
Cohesion: 0.20
Nodes (13): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`) (+5 more)

### Community 79 - "sse.test.ts"
Cohesion: 0.18
Nodes (8): Step 2: The SSE parser (`src/lib/api/sse.ts`), Skills Consulted, readSseStream(), SseFrame, collect(), encoder, EXPECTED, message()

### Community 80 - "chat.utils.test.ts"
Cohesion: 0.18
Nodes (10): INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, Q3, transcriptItem(), answered, earlierMain, followUpOf(), lastMain (+2 more)

### Community 81 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Job description import (link and smart paste), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 82 - "Learn: Showing a slow, stored AI result (the interview feedback screen)"
Cohesion: 0.18
Nodes (10): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+2 more)

### Community 83 - "bff.server.ts"
Cohesion: 0.47
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 84 - "Implementation Plan: Job description import (link and smart paste)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 85 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 86 - "FeedbackResult.tsx"
Cohesion: 0.22
Nodes (10): FeedbackResult(), FeedbackResultProps, HighlightsCard(), HighlightsCardProps, ScoreCardProps, TextList(), TextListProps, FEEDBACK_DISCLAIMER (+2 more)

### Community 87 - "[...path]/route.test.ts"
Cohesion: 0.24
Nodes (6): ANSWER_TIMEOUT_MS, fetchMock, encoder, openStream(), sseFrame(), streamOf()

### Community 88 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.20
Nodes (9): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 89 - "DataTableColumnHeader.tsx"
Cohesion: 0.47
Nodes (4): Deviations from Plan, @tanstack/react-table, DataTableFeatures, DataTableColumnHeaderProps

### Community 90 - "AnswerMicButton.tsx"
Cohesion: 0.50
Nodes (4): AnswerMicButton(), AnswerMicButtonProps, clock(), MicState

## Knowledge Gaps
- **560 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+555 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 667 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `Part A: Chat core`, `feedback.utils.ts`, `api.helper.ts`, `AuthForm.tsx`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `requireUser`, `Feature: Interview Feedback Screen (frontend)`, `job-import.utils.test.ts`, `interviews.services.test.ts`, `buildThreadView`, `Implementation Plan: Voice Answers`, `Implementation Steps`, `app/layout.tsx`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `apiClient`, `next`, `params`, `Implementation Steps`, `use-interview-chat.ts`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `Feature: Job description import (link and smart paste)`, `utils.ts`, `done`, `Implementation Plan: Job description import (link and smart paste)`, `Implementation Plan: Interviews Setup UI (foundation)`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `field.tsx`, `Part A: Chat core`, `AuthForm.tsx`, `constants.ts`, `useMutationCallbacks`, `ChatThread.tsx`, `job-import.utils.test.ts`, `InterviewConfigForm`, `InterviewMessageCard`, `ActiveInterview.tsx`, `AppShell`, `HistoryContainer.tsx`, `InterviewTitleBar.tsx`, `Implementation Steps`, `FeedbackQuestionAccordion.tsx`, `interview-history-columns.tsx`, `AnswerComposer.tsx`, `status`, `react`, `utils.ts`, `sidebar.tsx`, `FeedbackResult.tsx`, `DataTableColumnHeader.tsx`, `AnswerMicButton.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `signin/page.tsx`, `field.tsx`, `feedback.utils.ts`, `constants.ts`, `useMutationCallbacks`, `ChatThread.tsx`, `Button`, `requireUser`, `job-import.utils.test.ts`, `InterviewConfigForm`, `history.utils.ts`, `InterviewMessageCard`, `interviews.types.ts`, `ActiveInterview.tsx`, `AppShell`, `HistoryContainer.tsx`, `avatar.tsx`, `InterviewTitleBar.tsx`, `app/layout.tsx`, `FeedbackQuestionAccordion.tsx`, `Implementation Steps`, `use-interview-chat.ts`, `AnswerComposer.tsx`, `status`, `current-user.server.ts`, `utils.ts`, `sidebar.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 38 INFERRED edges - model-reasoned connections that need verification._
- **Are the 19 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `parseApiError()` (e.g. with `Completed Steps` and `Implementation Steps`) actually correct?**
  _`parseApiError()` has 12 INFERRED edges - model-reasoned connections that need verification._