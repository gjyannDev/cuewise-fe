# Graph Report - cuewise-fe  (2026-11-13)

## Corpus Check
- 223 files · ~145,607 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1722 nodes · 4489 edges · 85 communities (82 shown, 3 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 795 edges (avg confidence: 0.95)
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
- AuthCard
- react
- Implementation Steps
- README.md
- AGENTS.md
- Architecture & Design
- feedback.utils.ts
- useMutationCallbacks
- AuthFormContainer.tsx
- next
- constants.ts
- Implementation Plan: App Sidebar (shared shell for user and admin)
- Implementation Plan: Interviews Answer Flow
- Feature: App Sidebar (shared shell for user and admin)
- ChatThread.tsx
- Implementation: Interviews Setup UI (foundation)
- Part A: Chat core
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- requireUser
- Feature: Interview Feedback Screen (frontend)
- devDependencies
- Implementation: Interviews Chat Layout
- scripts
- done
- InterviewsContainer.tsx
- Feature: Interview Follow-up Questions (client support)
- InterviewConfigForm
- Feature: Interview History Page (frontend)
- lucide-react
- history.utils.ts
- stream.utils.test.ts
- interviews.types.ts
- Implementation: Interview Follow-up Questions (client support)
- InterviewsContainer
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- interviews.queries.ts
- isNoResponseError
- Implementation Plan: Interview Follow-up Questions (client support)
- ActiveInterview.tsx
- Skeleton
- HistoryContainer.tsx
- use-interview-feedback.ts
- avatar.tsx
- InterviewTitleBar.tsx
- Implementation Plan: Voice Answers
- AuthForm.tsx
- app/layout.tsx
- Feature: Voice Answers (speak an answer, review the transcript, send)
- apiClient
- api.helper.ts
- Implementation: Voice Answers
- FeedbackQuestionAccordion.tsx
- Implementation Plan: Interview History Page (frontend)
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- params
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- AuthedShell.tsx
- interview-history-columns.tsx
- use-interview-chat.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- Feature: Job description import (link and smart paste)
- AnswerComposer.tsx
- DataTable
- .answerStream
- Implementation Steps
- vitest
- FeedbackStateMessage.tsx
- InterviewNotFoundCard.tsx
- sidebar.tsx
- SessionStatus
- chat.utils.test.ts
- Implementation Steps
- Learn: Showing a slow, stored AI result (the interview feedback screen)
- eslint.config.mjs
- Button
- [...path]/route.test.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 70 edges
2. `Button()` - 55 edges
3. `useMutationCallbacks()` - 54 edges
4. `InterviewsContainer()` - 39 edges
5. `parseApiError()` - 35 edges
6. `lucide-react` - 34 edges
7. `requireUser()` - 31 edges
8. `InterviewConfigForm()` - 31 edges
9. `Implementation Steps` - 31 edges
10. `Part A: Chat core` - 30 edges

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

## Communities (85 total, 3 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.13
Nodes (14): name, private, version, @hookform/resolvers, react-dom, shadcn, tailwindcss, @tailwindcss/turbopack (+6 more)

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

### Community 7 - "AuthCard"
Cohesion: 0.29
Nodes (9): Layout & UX Design, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage() (+1 more)

### Community 8 - "react"
Cohesion: 0.05
Nodes (73): Skills Consulted, Architecture & Design, class-variance-authority, cn, radix-ui, react, react-hook-form, Breadcrumb() (+65 more)

### Community 9 - "Implementation Steps"
Cohesion: 0.15
Nodes (27): Project Conventions, Implementation Steps, ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired() (+19 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Architecture & Design"
Cohesion: 0.12
Nodes (21): Deviations from Plan, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Ready to Implement (+13 more)

### Community 13 - "feedback.utils.ts"
Cohesion: 0.14
Nodes (17): 5. What can go wrong, 6. Try it yourself, CRITERION_LABELS, FEEDBACK_ERROR_CODES, FEEDBACK_START_VALUE, SCORE_MAX, Criterion, FeedbackErrorResult (+9 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.10
Nodes (30): Deviations recorded during /implement, Completed Steps, Project Conventions, Project Rules Applied, Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Implementation Steps (+22 more)

### Community 15 - "AuthFormContainer.tsx"
Cohesion: 0.21
Nodes (14): Acceptance Criteria, Functional, Project Conventions, AuthFormContainerProps, ERROR_TITLES, authKeys, useCurrentProfileQuery(), useLogoutMutation() (+6 more)

### Community 16 - "next"
Cohesion: 0.07
Nodes (48): Trade-offs & Rationale, nextConfig, next, ref_server_only, zod, POST(), POST(), POST() (+40 more)

### Community 17 - "constants.ts"
Cohesion: 0.08
Nodes (38): sonner, InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, DEFAULT_START_VALUES, FEEDBACK_DISCLAIMER, FEEDBACK_GENERATING_LABEL (+30 more)

### Community 18 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.18
Nodes (10): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 19 - "Implementation Plan: Interviews Answer Flow"
Cohesion: 0.13
Nodes (19): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview (+11 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "ChatThread.tsx"
Cohesion: 0.18
Nodes (16): Architecture & Design, Skills Consulted, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Deviations from Plan, Skills Consulted, motion, MOTION_ELEMENTS, Shimmer (+8 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "Part A: Chat core"
Cohesion: 0.23
Nodes (15): Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), Part A: Chat core, isStreaming(), useInterviewChat(), submit(), ThreadItem, ThreadView (+7 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "requireUser"
Cohesion: 0.39
Nodes (6): Architecture & Design, AdminHome(), AdminHomeContent(), Home(), HomeContent(), requireUser()

### Community 27 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.05
Nodes (43): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal (+35 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "Implementation: Interviews Chat Layout"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links, Open Questions (+6 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "done"
Cohesion: 0.09
Nodes (25): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`) (+17 more)

### Community 32 - "InterviewsContainer.tsx"
Cohesion: 0.17
Nodes (13): handleStart(), InterviewsContainerProps, SKELETON_BUBBLES, InterviewsPageProps, INTERVIEWS_ROUTE, START_TIMEOUT_MESSAGE, sessionParamSchema, InterviewStep (+5 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "InterviewConfigForm"
Cohesion: 0.27
Nodes (14): AuthCardProps, COPY, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+6 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 36 - "lucide-react"
Cohesion: 0.14
Nodes (16): Deviations During Implementation, lucide-react, Role, RoleHeaderTitle(), RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS (+8 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.16
Nodes (27): Blockers & Resolutions, Implementation Steps, Testing Strategy, Implementation Steps, Testing Strategy, Changes Made, Deviations from Plan, HISTORY_DEFAULT_PARAMS (+19 more)

### Community 38 - "stream.utils.test.ts"
Cohesion: 0.20
Nodes (8): Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), reduceTurn(), ANSWER_STREAM_START, reduceAnswerStream(), Q2, reaction, reset, run()

### Community 39 - "interviews.types.ts"
Cohesion: 0.07
Nodes (40): FEEDBACK_CRITERIA, FEEDBACK_STATUSES, HISTORY_PAGE_SIZES, HISTORY_SORT_COLUMNS, INTERVIEW_TYPES, JOB_PASTE_FORMATS, LEVELS, QUESTION_CATEGORIES (+32 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 41 - "InterviewsContainer"
Cohesion: 0.18
Nodes (17): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+9 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "interviews.queries.ts"
Cohesion: 0.13
Nodes (18): Testing Strategy, FEEDBACK_POLL_MS, interviewKeys, AnswerStreamOptions, TranscribeVariables, interviewsService, recordingFileName(), TERMINAL_EVENTS (+10 more)

### Community 45 - "isNoResponseError"
Cohesion: 0.24
Nodes (13): Completed Steps, Part B: Robustness, Spec Requirements -> Implementation, Testing Strategy, Completed Steps, Known Issues, Part A: Chat core (committed: c23b36f), Part B: Robustness (+5 more)

### Community 46 - "Implementation Plan: Interview Follow-up Questions (client support)"
Cohesion: 0.18
Nodes (10): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+2 more)

### Community 47 - "ActiveInterview.tsx"
Cohesion: 0.11
Nodes (19): Follow-up: chat-assistant styling (after review), Implementation Steps, Completed Steps, Phase 2: Frontend (cuewise-fe), ActiveInterview(), ActiveInterviewProps, useWarnBeforeUnload(), isUnloadWarningBypassed() (+11 more)

### Community 48 - "Skeleton"
Cohesion: 0.27
Nodes (7): SessionSkeleton(), AppLayout(), SidebarMenuSkeleton(), Skeleton(), ROWS, HISTORY_PAGE_SIZE, AppShellSkeleton()

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.12
Nodes (21): Architecture & Design, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps, Alert() (+13 more)

### Community 50 - "use-interview-feedback.ts"
Cohesion: 0.36
Nodes (8): FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, useInterviewFeedback(), startGeneration(), useFeedbackQuery(), useGenerateFeedbackMutation(), FeedbackView, getFeedbackErrorResult()

### Community 51 - "avatar.tsx"
Cohesion: 0.22
Nodes (6): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 52 - "InterviewTitleBar.tsx"
Cohesion: 0.10
Nodes (25): Trade-offs & Rationale, Layout & UX Design, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+17 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.09
Nodes (23): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be) (+15 more)

### Community 54 - "AuthForm.tsx"
Cohesion: 0.12
Nodes (23): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied (+15 more)

### Community 55 - "app/layout.tsx"
Cohesion: 0.13
Nodes (19): Data Fetching (TanStack Query), next-themes, @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport, Providers() (+11 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 58 - "api.helper.ts"
Cohesion: 0.14
Nodes (15): Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), axios, ApiError, conflictDetailsSchema, isSessionErrorCode(), NormalizedError, normalizeError(), responseOf() (+7 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.20
Nodes (17): Components, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, Progress() (+9 more)

### Community 61 - "Implementation Plan: Interview History Page (frontend)"
Cohesion: 0.25
Nodes (7): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Trade-offs & Rationale

### Community 62 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.18
Nodes (10): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+2 more)

### Community 63 - "params"
Cohesion: 0.50
Nodes (4): About the Project, Project Rules Applied, Skills Consulted During Implementation, params()

### Community 64 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+7 more)

### Community 65 - "AuthedShell.tsx"
Cohesion: 0.20
Nodes (15): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AuthedShellProps, getSessionUser(), SidebarInset(), SidebarProvider() (+7 more)

### Community 66 - "interview-history-columns.tsx"
Cohesion: 0.17
Nodes (15): @tanstack/react-table, column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, FOLLOW_UP_CAPTION, INTERVIEW_TYPE_LABELS, LEVEL_LABELS (+7 more)

### Community 67 - "use-interview-chat.ts"
Cohesion: 0.13
Nodes (16): Affected Files & Patterns, INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, SendFailure, TurnAction, transcribe() (+8 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+7 more)

### Community 70 - "AnswerComposer.tsx"
Cohesion: 0.10
Nodes (19): Changes Made (cuewise-fe, uncommitted), AnswerComposerProps, RECORDER_ERROR_MESSAGES, ANSWER_COUNTER_FROM, ANSWER_MAX_LENGTH, EMPTY_RECORDING_MESSAGE, MICROPHONE_BLOCKED_MESSAGE, MICROPHONE_UNAVAILABLE_MESSAGE (+11 more)

### Community 71 - "DataTable"
Cohesion: 0.16
Nodes (20): Architecture & Design, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Requirements -> Implementation, Skills Consulted, Trade-offs & Rationale (+12 more)

### Community 72 - ".answerStream"
Cohesion: 0.13
Nodes (22): Implementation Steps, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`), Step 14: Gates and the manual end-to-end run, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 2: The SSE parser (`src/lib/api/sse.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`) (+14 more)

### Community 73 - "Implementation Steps"
Cohesion: 0.30
Nodes (12): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), FeedbackGenerating() (+4 more)

### Community 74 - "vitest"
Cohesion: 0.14
Nodes (16): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+8 more)

### Community 75 - "FeedbackStateMessage.tsx"
Cohesion: 0.29
Nodes (7): ALERTS, FeedbackMessageKind, FeedbackStateMessage(), FeedbackStateMessageProps, ICONS, linkButton(), FEEDBACK_MESSAGES

### Community 76 - "InterviewNotFoundCard.tsx"
Cohesion: 0.50
Nodes (3): InterviewNotFoundCardProps, INTERVIEW_NOT_FOUND_DESCRIPTION, INTERVIEW_NOT_FOUND_TITLE

### Community 77 - "sidebar.tsx"
Cohesion: 0.11
Nodes (15): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+7 more)

### Community 80 - "chat.utils.test.ts"
Cohesion: 0.09
Nodes (24): FEEDBACK_TIMEOUT_MS, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, TRANSCRIBE_TIMEOUT_MS, emptyFeedback(), feedback(), FEEDBACK_ID, feedbackQuestion() (+16 more)

### Community 81 - "Implementation Steps"
Cohesion: 0.06
Nodes (47): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+39 more)

### Community 82 - "Learn: Showing a slow, stored AI result (the interview feedback screen)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen)

### Community 85 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 86 - "Button"
Cohesion: 0.16
Nodes (16): Button(), buttonVariants, AnswerMicButton(), AnswerMicButtonProps, clock(), MicState, FeedbackResult(), FeedbackResultProps (+8 more)

### Community 87 - "[...path]/route.test.ts"
Cohesion: 0.11
Nodes (12): SseFrame, ANSWER_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, encoder, openStream() (+4 more)

## Knowledge Gaps
- **563 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+558 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 671 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `AuthCard`, `Architecture & Design`, `next`, `constants.ts`, `ChatThread.tsx`, `requireUser`, `InterviewsContainer.tsx`, `InterviewConfigForm`, `history.utils.ts`, `interviews.queries.ts`, `ActiveInterview.tsx`, `Skeleton`, `HistoryContainer.tsx`, `use-interview-feedback.ts`, `avatar.tsx`, `InterviewTitleBar.tsx`, `Implementation Plan: Voice Answers`, `app/layout.tsx`, `FeedbackQuestionAccordion.tsx`, `AuthedShell.tsx`, `use-interview-chat.ts`, `AnswerComposer.tsx`, `DataTable`, `Implementation Steps`, `FeedbackStateMessage.tsx`, `InterviewNotFoundCard.tsx`, `sidebar.tsx`, `Button`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `Implementation Steps`, `Architecture & Design`, `AuthFormContainer.tsx`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `Implementation Plan: Interviews Answer Flow`, `Part A: Chat core`, `Feature: Interview Feedback Screen (frontend)`, `done`, `InterviewsContainer.tsx`, `lucide-react`, `InterviewsContainer`, `isNoResponseError`, `ActiveInterview.tsx`, `use-interview-feedback.ts`, `Implementation Plan: Voice Answers`, `AuthForm.tsx`, `app/layout.tsx`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `apiClient`, `params`, `AuthedShell.tsx`, `use-interview-chat.ts`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `Feature: Job description import (link and smart paste)`, `Implementation Steps`, `Implementation Steps`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `AuthCard`, `react`, `Implementation Steps`, `Architecture & Design`, `constants.ts`, `ChatThread.tsx`, `InterviewsContainer.tsx`, `InterviewConfigForm`, `history.utils.ts`, `InterviewsContainer`, `ActiveInterview.tsx`, `HistoryContainer.tsx`, `InterviewTitleBar.tsx`, `AuthForm.tsx`, `AuthedShell.tsx`, `interview-history-columns.tsx`, `AnswerComposer.tsx`, `DataTable`, `Implementation Steps`, `FeedbackStateMessage.tsx`, `InterviewNotFoundCard.tsx`, `sidebar.tsx`, `Implementation Steps`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 41 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `parseApiError()` (e.g. with `Completed Steps` and `Implementation Steps`) actually correct?**
  _`parseApiError()` has 12 INFERRED edges - model-reasoned connections that need verification._