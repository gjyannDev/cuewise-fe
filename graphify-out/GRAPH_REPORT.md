# Graph Report - cuewise-fe  (2026-11-15)

## Corpus Check
- 243 files · ~161,821 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1852 nodes · 4906 edges · 95 communities (94 shown, 1 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 860 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7229eed3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- AppSidebar.tsx
- components.json
- Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- app/layout.tsx
- dependencies
- Button
- TextAreaField
- auth-session.ts
- README.md
- AGENTS.md
- Part A: Chat core
- auth.types.ts
- api.helper.ts
- Implementation Steps
- next
- interviews/constants.ts
- requireUser
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- AnswerComposer.tsx
- Implementation: Interviews Setup UI (foundation)
- ChatThread.tsx
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- interviews.services.ts
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- devDependencies
- Implementation: Interviews Chat Layout
- ResumeProfileView.tsx
- react
- InterviewTitleBar.tsx
- Feature: Interview Follow-up Questions (client support)
- profile/constants.ts
- Feature: Interview History Page (frontend)
- sidebar.types.ts
- history.utils.ts
- Implementation Plan: Job description import (link and smart paste)
- interviews.types.ts
- Implementation: Interview Follow-up Questions (client support)
- InterviewsContainer.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- interviews.queries.ts
- Implementation: Résumé profile and résumé-aware interviews
- pickThinkingLabel
- ActiveInterview.tsx
- current-user.server.ts
- HistoryContainer
- FeedbackResult.tsx
- [...path]/route.test.ts
- avatar.tsx
- Implementation Plan: Voice Answers
- done
- AuthCard.tsx
- Feature: Voice Answers (speak an answer, review the transcript, send)
- FeedbackQuestionAccordion.tsx
- Implementation: Auth Session (cookie-based BFF)
- Implementation: Voice Answers
- [...path]/route.ts
- Feature: Interview Feedback Screen (frontend)
- AuthCard
- AuthForm
- Implementation: Job description import (link and smart paste)
- Cuewise FE — Project Instructions
- format.utils.ts
- use-interview-chat.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- Feature: Job description import (link and smart paste)
- isNoResponseError
- DataTable
- .answerStream
- InterviewMessageCard
- vitest
- RadioGroupField.tsx
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- sidebar.tsx
- sheet.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- chat.utils.test.ts
- InterviewsContainer
- apiClient
- sse.test.ts
- ResumeContainer.tsx
- Implementation Steps
- chat.utils.ts
- RoleSidebar.tsx
- breadcrumb.tsx
- profile.queries.ts
- SelectField.tsx
- Implementation Plan: Résumé profile and résumé-aware interviews
- conversation.tsx
- scripts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 74 edges
2. `Button()` - 59 edges
3. `useMutationCallbacks()` - 59 edges
4. `InterviewsContainer()` - 42 edges
5. `parseApiError()` - 39 edges
6. `requireUser()` - 39 edges
7. `lucide-react` - 38 edges
8. `InterviewConfigForm()` - 33 edges
9. `vitest` - 31 edges
10. `Implementation Steps` - 31 edges

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

## Communities (95 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (18): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuItem() (+10 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.12
Nodes (16): Overview, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d), Functional, Goal (+8 more)

### Community 5 - "app/layout.tsx"
Cohesion: 0.14
Nodes (16): @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport, Providers(), ProvidersProps, Toaster() (+8 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "Button"
Cohesion: 0.12
Nodes (28): Affected Files & Patterns, Architecture & Design, Requirements -> Implementation, Skills Consulted, Project Conventions, @tanstack/react-table, Button(), Select() (+20 more)

### Community 8 - "TextAreaField"
Cohesion: 0.20
Nodes (18): Skills Consulted During Implementation, react-hook-form, Field(), FieldDescription(), FieldError(), FieldLabel(), Input(), Textarea() (+10 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): Project Conventions, ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath() (+17 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Part A: Chat core"
Cohesion: 0.18
Nodes (20): Completed Steps, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part A: Chat core, Ready to Implement (+12 more)

### Community 13 - "auth.types.ts"
Cohesion: 0.21
Nodes (13): zod, backendApi, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, backendTokenSchema, currentProfileSchema, email (+5 more)

### Community 14 - "api.helper.ts"
Cohesion: 0.13
Nodes (15): ApiError, ApiErrorBody, conflictDetailsSchema, NormalizedError, normalizeError(), responseOf(), SESSION_ERROR_CODES, toFieldErrors() (+7 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.20
Nodes (21): Forms, Affected Files & Patterns, Implementation Steps, Acceptance Criteria, Functional, Project Conventions, Known Issues, FieldGroup() (+13 more)

### Community 16 - "next"
Cohesion: 0.30
Nodes (12): nextConfig, next, POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody() (+4 more)

### Community 17 - "interviews/constants.ts"
Cohesion: 0.08
Nodes (39): HistoryContainerProps, NO_ROWS, InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, DEFAULT_START_VALUES, FEEDBACK_GENERATING_LABEL (+31 more)

### Community 18 - "requireUser"
Cohesion: 0.14
Nodes (15): Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+7 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.10
Nodes (32): About the Project, Affected Files & Patterns, Completed Steps, Project Rules Applied, Project Conventions, Skills Consulted During Implementation, Project Rules Applied, Affected Files & Patterns (+24 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "AnswerComposer.tsx"
Cohesion: 0.07
Nodes (31): lucide-react, motion, MOTION_ELEMENTS, TextShimmerProps, PasswordInput(), AudioRecorderOptions, detectFormat(), errorKind() (+23 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "ChatThread.tsx"
Cohesion: 0.19
Nodes (20): Architecture & Design, Skills Consulted, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Affected Files & Patterns, Deviations from Plan, Implementation Steps, Skills Consulted, Completed Steps (+12 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "interviews.services.ts"
Cohesion: 0.16
Nodes (15): axios, isSessionErrorCode(), API, redirectIfSessionEnded(), bypassUnloadWarning(), FEEDBACK_TIMEOUT_MS, START_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS (+7 more)

### Community 27 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.07
Nodes (30): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+22 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "Implementation: Interviews Chat Layout"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Current Step, Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links, Open Questions (+6 more)

### Community 30 - "ResumeProfileView.tsx"
Cohesion: 0.25
Nodes (19): Deviations from Plan, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+11 more)

### Community 31 - "react"
Cohesion: 0.16
Nodes (13): class-variance-authority, cn, radix-ui, react, buttonVariants, Checkbox(), FieldSeparator(), fieldVariants (+5 more)

### Community 32 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "profile/constants.ts"
Cohesion: 0.13
Nodes (19): PROFILE_ERROR_CODES, RESUME_ACCEPT, RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES, RESUME_PAGE_COPY, RESUME_PROFILE_COPY, RESUME_PROVIDER_NOTICE (+11 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.19
Nodes (12): Deviations During Implementation, RoleHeaderTitle(), RoleHeaderTitleProps, AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig (+4 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.08
Nodes (44): Blockers & Resolutions, Implementation Steps, Testing Strategy, Implementation Steps, Testing Strategy, Baseline Failures, Changes Made, Completed Steps (+36 more)

### Community 38 - "Implementation Plan: Job description import (link and smart paste)"
Cohesion: 0.17
Nodes (11): Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+3 more)

### Community 39 - "interviews.types.ts"
Cohesion: 0.06
Nodes (50): FEEDBACK_CRITERIA, FEEDBACK_STATUSES, HISTORY_SORT_COLUMNS, INTERVIEW_TYPES, JOB_PASTE_FORMATS, LEVELS, QUESTION_CATEGORIES, QUESTION_KINDS (+42 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Current Step, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation, Status (+3 more)

### Community 41 - "InterviewsContainer.tsx"
Cohesion: 0.08
Nodes (27): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+19 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "interviews.queries.ts"
Cohesion: 0.06
Nodes (44): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+36 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Deviations from Plan, Done, Implementation: Résumé profile and résumé-aware interviews (+7 more)

### Community 46 - "pickThinkingLabel"
Cohesion: 0.14
Nodes (15): Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement (+7 more)

### Community 47 - "ActiveInterview.tsx"
Cohesion: 0.16
Nodes (10): Follow-up: chat-assistant styling (after review), Skills Consulted, ActiveInterviewProps, useWarnBeforeUnload(), isUnloadWarningBypassed(), AnswerComposer(), feedbackStartRoute(), STALE_THREAD_MESSAGE (+2 more)

### Community 48 - "current-user.server.ts"
Cohesion: 0.22
Nodes (11): ref_server_only, AuthedShellProps, getSessionUser(), apiErrorBodySchema, axios, AxiosRequestConfig, SessionExpiredError, apiUrlSchema (+3 more)

### Community 49 - "HistoryContainer"
Cohesion: 0.23
Nodes (11): Architecture & Design, HistoryContainer(), HistoryContent(), HistoryPage(), HistoryPageProps, SessionSkeleton(), Skeleton(), InterviewHistorySkeleton() (+3 more)

### Community 50 - "FeedbackResult.tsx"
Cohesion: 0.16
Nodes (23): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), InterviewClosingCard(), InterviewClosingCardProps (+15 more)

### Community 51 - "[...path]/route.test.ts"
Cohesion: 0.15
Nodes (9): ANSWER_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, encoder, openStream(), sseFrame() (+1 more)

### Community 52 - "avatar.tsx"
Cohesion: 0.22
Nodes (6): Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.14
Nodes (13): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be) (+5 more)

### Community 54 - "done"
Cohesion: 0.09
Nodes (25): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`) (+17 more)

### Community 55 - "AuthCard.tsx"
Cohesion: 0.16
Nodes (12): @hookform/resolvers, AuthCardProps, COPY, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES (+4 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.21
Nodes (17): Architecture & Design, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, Progress() (+9 more)

### Community 58 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "[...path]/route.ts"
Cohesion: 0.15
Nodes (15): Trade-offs & Rationale, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS, STREAM_HEADERS (+7 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "AuthCard"
Cohesion: 0.29
Nodes (9): Layout & UX Design, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage() (+1 more)

### Community 63 - "AuthForm"
Cohesion: 0.19
Nodes (12): Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement (+4 more)

### Community 64 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Implementation: Job description import (link and smart paste), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 65 - "Cuewise FE — Project Instructions"
Cohesion: 0.15
Nodes (12): AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts, Git Rules (STRICT), Security & Auth (+4 more)

### Community 66 - "format.utils.ts"
Cohesion: 0.39
Nodes (6): interviewHistoryColumns, RowAction(), FOLLOW_UP_CAPTION, formatInterviewCount(), formatInterviewDate(), formatProgress()

### Community 67 - "use-interview-chat.ts"
Cohesion: 0.17
Nodes (16): Affected Files & Patterns, Changes Made (cuewise-fe, uncommitted), transcribe(), INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn() (+8 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+7 more)

### Community 70 - "isNoResponseError"
Cohesion: 0.18
Nodes (17): Affected Files & Patterns, Deviations from Plan, Testing Strategy, Part B: Robustness, Testing Strategy, Completed Steps, Known Issues, Part A: Chat core (committed: c23b36f) (+9 more)

### Community 71 - "DataTable"
Cohesion: 0.20
Nodes (15): Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Trade-offs & Rationale, Table(), TableBody(), TableCaption() (+7 more)

### Community 72 - ".answerStream"
Cohesion: 0.12
Nodes (22): Implementation Steps, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`), Step 14: Gates and the manual end-to-end run, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`) (+14 more)

### Community 73 - "InterviewMessageCard"
Cohesion: 0.12
Nodes (27): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewMessageCard(), InterviewNotFoundCard() (+19 more)

### Community 74 - "vitest"
Cohesion: 0.12
Nodes (20): ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody() (+12 more)

### Community 75 - "RadioGroupField.tsx"
Cohesion: 0.21
Nodes (12): Architecture & Design, FieldTitle(), RadioGroup(), RadioGroupItem(), Slider(), LAYOUT, OPTION, RadioGroupField() (+4 more)

### Community 76 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.18
Nodes (10): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+2 more)

### Community 77 - "sidebar.tsx"
Cohesion: 0.14
Nodes (12): SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), SidebarMenuSkeleton(), SidebarProvider(), SidebarRail(), SidebarTrigger() (+4 more)

### Community 78 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 9. Go deeper / Still open, Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)

### Community 80 - "chat.utils.test.ts"
Cohesion: 0.09
Nodes (22): Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, AnswerStreamEventName, ANSWER_STREAM_START, AnswerStreamState, ParsedStreamEvent, reduceAnswerStream() (+14 more)

### Community 81 - "InterviewsContainer"
Cohesion: 0.06
Nodes (53): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied (+45 more)

### Community 82 - "apiClient"
Cohesion: 0.22
Nodes (5): Architecture: Modular, Feature-Driven, Phase 2: Frontend (cuewise-fe), apiClient, AnswerErrorResult, cancel()

### Community 83 - "sse.test.ts"
Cohesion: 0.21
Nodes (6): Step 2: The SSE parser (`src/lib/api/sse.ts`), readSseStream(), SseFrame, collect(), encoder, EXPECTED

### Community 84 - "ResumeContainer.tsx"
Cohesion: 0.23
Nodes (13): ResumeContainer(), ResumeContent(), ResumePage(), Alert(), AlertDescription(), AlertTitle(), alertVariants, ResumeUploadCard() (+5 more)

### Community 85 - "Implementation Steps"
Cohesion: 0.42
Nodes (7): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), RoleSidebar(), AppShellSkeleton()

### Community 86 - "chat.utils.ts"
Cohesion: 0.25
Nodes (10): Implementation Steps, Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), AnswerResponse, Reaction, ThreadView, buildThreadView(), keyOf(), resyncCodes (+2 more)

### Community 87 - "RoleSidebar.tsx"
Cohesion: 0.25
Nodes (6): Role, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 89 - "profile.queries.ts"
Cohesion: 0.18
Nodes (13): 4. How it works, 8. Check your understanding, Implementation Steps, Review, Test Cases, handleUpload(), profileKeys, useMarkProfileMissing() (+5 more)

### Community 90 - "SelectField.tsx"
Cohesion: 0.38
Nodes (8): SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent(), TooltipTrigger(), Option, SelectField(), SelectFieldProps

### Community 91 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.18
Nodes (10): Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 92 - "conversation.tsx"
Cohesion: 0.29
Nodes (5): use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 94 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **607 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+602 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 718 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `Part A: Chat core`, `Implementation Steps`, `requireUser`, `Feature: Interviews Answer Flow (submit answer, reaction, completion)`, `ResumeProfileView.tsx`, `Implementation Plan: Job description import (link and smart paste)`, `InterviewsContainer.tsx`, `interviews.queries.ts`, `Implementation Plan: Voice Answers`, `done`, `AuthCard.tsx`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `AuthForm`, `Implementation: Job description import (link and smart paste)`, `Cuewise FE — Project Instructions`, `use-interview-chat.ts`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `Feature: Job description import (link and smart paste)`, `isNoResponseError`, `InterviewMessageCard`, `InterviewsContainer`, `apiClient`, `ResumeContainer.tsx`, `Implementation Steps`, `chat.utils.ts`, `RoleSidebar.tsx`, `profile.queries.ts`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `app/layout.tsx`, `Button`, `TextAreaField`, `interviews/constants.ts`, `requireUser`, `AnswerComposer.tsx`, `ChatThread.tsx`, `ResumeProfileView.tsx`, `InterviewTitleBar.tsx`, `history.utils.ts`, `InterviewsContainer.tsx`, `interviews.queries.ts`, `ActiveInterview.tsx`, `current-user.server.ts`, `HistoryContainer`, `FeedbackResult.tsx`, `avatar.tsx`, `FeedbackQuestionAccordion.tsx`, `AuthCard`, `use-interview-chat.ts`, `DataTable`, `InterviewMessageCard`, `RadioGroupField.tsx`, `sidebar.tsx`, `sheet.tsx`, `InterviewsContainer`, `ResumeContainer.tsx`, `Implementation Steps`, `breadcrumb.tsx`, `SelectField.tsx`, `conversation.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `TextAreaField`, `Part A: Chat core`, `Implementation Steps`, `interviews/constants.ts`, `AnswerComposer.tsx`, `ChatThread.tsx`, `ResumeProfileView.tsx`, `react`, `InterviewTitleBar.tsx`, `history.utils.ts`, `InterviewsContainer.tsx`, `ActiveInterview.tsx`, `HistoryContainer`, `FeedbackResult.tsx`, `AuthCard.tsx`, `AuthCard`, `AuthForm`, `format.utils.ts`, `InterviewMessageCard`, `sidebar.tsx`, `sheet.tsx`, `InterviewsContainer`, `ResumeContainer.tsx`, `conversation.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 44 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 44 INFERRED edges - model-reasoned connections that need verification._
- **Are the 21 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `parseApiError()` (e.g. with `Completed Steps` and `Implementation Steps`) actually correct?**
  _`parseApiError()` has 12 INFERRED edges - model-reasoned connections that need verification._