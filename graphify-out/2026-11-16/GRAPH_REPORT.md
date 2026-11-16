# Graph Report - cuewise-fe  (2026-11-16)

## Corpus Check
- 269 files · ~193,200 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 2044 nodes · 5520 edges · 107 communities (105 shown, 2 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 989 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `daf2034e`
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
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- field.tsx
- auth-session.ts
- README.md
- AGENTS.md
- InterviewsContainer
- FeedbackQuestionAccordion.tsx
- Implementation Steps
- Implementation Steps
- room.utils.test.ts
- interviews.types.ts
- Cuewise FE — Project Instructions
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- auth.types.ts
- Implementation: Interviews Setup UI (foundation)
- ActiveInterview.tsx
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- voice.services.ts
- GET
- devDependencies
- Feature: Interview Room (a voice interview, styled like a video call)
- Button
- react
- Implementation: Interviews Chat Layout
- Feature: Interview Follow-up Questions (client support)
- profile/constants.ts
- Feature: Interview History Page (frontend)
- sidebar.types.ts
- history.utils.ts
- Implementation: Interview Room (frontend)
- current-user.server.ts
- Implementation: Interview Follow-up Questions (client support)
- InterviewMessageCard
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- feedback.utils.ts
- Implementation: Résumé profile and résumé-aware interviews
- appendAnswerTurn
- Completed Steps
- next
- HistoryContainer.tsx
- InterviewConfigForm
- [...path]/route.test.ts
- InterviewerAvatar.tsx
- Implementation Plan: Voice Answers
- done
- interviews/constants.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- [...path]/route.ts
- Implementation Plan: Interview Feedback Screen (frontend)
- Implementation: Voice Answers
- use-interview-turn.ts
- Feature: Interview Feedback Screen (frontend)
- InterviewsContainer.tsx
- AuthForm
- InterviewTitleBar.tsx
- use-audio-player.test.tsx
- Implementation: Auth Session (cookie-based BFF)
- transcript.utils.ts
- sse.test.ts
- Feature: Job description import (link and smart paste)
- apiClient
- status
- error
- FeedbackStateMessage.tsx
- vitest
- buildTranscriptView
- InterviewRoom.tsx
- api.helper.ts
- sidebar.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- transcript.utils.test.ts
- Implementation: Job description import (link and smart paste)
- Learn: The interview room, frontend (voice-first, transcript-style)
- TranscriptPanel
- ResumeContainer.tsx
- AppShell
- interview-history-columns.tsx
- Skeleton
- breadcrumb.tsx
- format.utils.ts
- Implementation Steps
- Implementation Plan: Résumé profile and résumé-aware interviews
- TranscriptPanel.tsx
- scripts
- eslint.config.mjs
- axios
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- use-job-description-import.ts
- Profile
- requireUser
- profile.queries.ts
- Implementation Plan: Interviews Setup UI (foundation)
- session-redirect.test.ts
- FeedbackResult.tsx
- RoleSidebar.tsx
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- vitest.config.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 85 edges
2. `Button()` - 63 edges
3. `useMutationCallbacks()` - 62 edges
4. `Completed Steps` - 54 edges
5. `InterviewsContainer()` - 44 edges
6. `lucide-react` - 41 edges
7. `parseApiError()` - 41 edges
8. `vitest` - 40 edges
9. `requireUser()` - 39 edges
10. `Implementation Steps` - 37 edges

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

## Communities (107 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, happy-dom, react-dom, shadcn, tailwindcss, @tailwindcss/turbopack (+7 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.17
Nodes (23): Implementation Steps, SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu() (+15 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.13
Nodes (15): Overview, Acceptance Criteria, Blockers, Edge Cases, Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d), Functional, Goal, Non-Functional (+7 more)

### Community 5 - "app/layout.tsx"
Cohesion: 0.13
Nodes (17): Data Fetching (TanStack Query), next-themes, src_app_globals, metadata, RootLayout(), viewport, Providers(), ProvidersProps (+9 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+14 more)

### Community 7 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+7 more)

### Community 8 - "field.tsx"
Cohesion: 0.05
Nodes (77): Forms, Known Issues, Skills Consulted, Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Implementation Steps (+69 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.14
Nodes (27): Project Conventions, Deviations recorded during /implement, ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder() (+19 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "InterviewsContainer"
Cohesion: 0.07
Nodes (59): Affected Files & Patterns, Architecture & Design, Skills Consulted, Deviations from Plan, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building) (+51 more)

### Community 13 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.18
Nodes (17): Components, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), Progress(), CriterionScore() (+9 more)

### Community 14 - "Implementation Steps"
Cohesion: 0.14
Nodes (22): 5. What can go wrong, Implementation Steps, Affected Files & Patterns, PlaybackEnd, useAudioPlayer(), RESYNC_ERROR_CODES, RESYNC_MESSAGE, SPEECH_RATE_LIMITED_MESSAGE (+14 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.32
Nodes (12): Implementation Steps, Acceptance Criteria, Functional, Project Conventions, FieldSet(), Toaster(), useCurrentProfileQuery(), useLogoutMutation() (+4 more)

### Community 16 - "room.utils.test.ts"
Cohesion: 0.22
Nodes (15): 4. How it works, Phase 2: Frontend (cuewise-fe), RoomEvent, RoomState, roomStatusLabel(), CLIP, lobby(), Q1 (+7 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.07
Nodes (45): ANSWER_MAX_LENGTH, FEEDBACK_STATUSES, HISTORY_PAGE_SIZES, HISTORY_SORT_COLUMNS, INTERVIEW_TYPES, JOB_PASTE_FORMATS, JOB_URL_MAX_LENGTH, LEVELS (+37 more)

### Community 18 - "Cuewise FE — Project Instructions"
Cohesion: 0.18
Nodes (10): AI Features (UI side), Common Commands, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth, Testing, Tooling (+2 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.18
Nodes (20): Completed Steps, Project Conventions, Affected Files & Patterns, Affected Files & Patterns, Implementation Steps, AuthFormContainer(), handleSubmit(), AuthFormContainerProps (+12 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "auth.types.ts"
Cohesion: 0.14
Nodes (20): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authKeys, authCredentialsSchema, authFormSchemas, authSearchParamsSchema (+12 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "ActiveInterview.tsx"
Cohesion: 0.10
Nodes (27): Deviations from Plan, Affected Files & Patterns, ActiveInterviewProps, FinishedInterview(), LiveInterview(), retryNotice(), AudioRecorderOptions, detectFormat() (+19 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "voice.services.ts"
Cohesion: 0.31
Nodes (7): SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, transcriptionResponseSchema, SPEECH_ROUTE, voiceService, downloadBlob, post

### Community 27 - "GET"
Cohesion: 0.07
Nodes (30): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+22 more)

### Community 28 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, happy-dom, tailwindcss, @tailwindcss/turbopack, @testing-library/react, @types/node (+4 more)

### Community 29 - "Feature: Interview Room (a voice interview, styled like a video call)"
Cohesion: 0.15
Nodes (12): Acceptance Criteria, API Contract (shared by both repos; the single source of truth), Blockers, Constraints, Decisions, Edge Cases, Feature: Interview Room (a voice interview, styled like a video call), Goal (+4 more)

### Community 30 - "Button"
Cohesion: 0.29
Nodes (19): Deviations from Plan, Button(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+11 more)

### Community 31 - "react"
Cohesion: 0.14
Nodes (18): class-variance-authority, cn, lucide-react, radix-ui, react, badgeVariants, buttonVariants, Kbd() (+10 more)

### Community 32 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Current Step, Follow-up: chat-assistant styling (after review), Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links (+7 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "profile/constants.ts"
Cohesion: 0.13
Nodes (19): PROFILE_ERROR_CODES, RESUME_ACCEPT, RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES, RESUME_PAGE_COPY, RESUME_PROVIDER_NOTICE, RESUME_UPLOAD_FORWARD_TIMEOUT_MS (+11 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.21
Nodes (11): Deviations from Plan, Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem() (+3 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.24
Nodes (18): Testing Strategy, Testing Strategy, Changes Made, Deviations from Plan, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, useInterviewHistoryTable(), historyPageParamSchema (+10 more)

### Community 38 - "Implementation: Interview Room (frontend)"
Cohesion: 0.11
Nodes (17): Baseline Failures, Changes Made, Current Step, Debug Log, Implementation: Interview Room (frontend), Links, Open Questions, Review (+9 more)

### Community 39 - "current-user.server.ts"
Cohesion: 0.17
Nodes (14): Test Results, ref_server_only, zod, AuthedShellProps, getSessionUser(), ApiErrorBody, axios, AxiosRequestConfig (+6 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 41 - "InterviewMessageCard"
Cohesion: 0.25
Nodes (8): Affected Files & Patterns, Skills Consulted, InterviewsContent(), InterviewsPage(), InterviewsPageProps, InterviewMessageCard(), useInterviewQuery(), parseSessionParam()

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "feedback.utils.ts"
Cohesion: 0.12
Nodes (27): 5. What can go wrong, 6. Try it yourself, Testing Strategy, FEEDBACK_CRITERIA, FEEDBACK_ERROR_CODES, FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, FEEDBACK_START_VALUE (+19 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Done, Implementation: Résumé profile and résumé-aware interviews, Known Issues (+6 more)

### Community 46 - "appendAnswerTurn"
Cohesion: 0.14
Nodes (15): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+7 more)

### Community 47 - "Completed Steps"
Cohesion: 0.14
Nodes (15): Non-Functional, Phase 0: Spike (before Phase 1 is built against the real vendor), Phase 1: Backend (cuewise-be), Requirements, Completed Steps, Architecture & Design, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Changes Made (cuewise-fe, uncommitted) (+7 more)

### Community 48 - "next"
Cohesion: 0.34
Nodes (11): nextConfig, next, POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody() (+3 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.13
Nodes (19): Architecture & Design, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps, InterviewHistorySkeleton() (+11 more)

### Community 50 - "InterviewConfigForm"
Cohesion: 0.16
Nodes (24): Layout & UX Design, AuthCard(), AuthCardProps, COPY, SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps (+16 more)

### Community 51 - "[...path]/route.test.ts"
Cohesion: 0.14
Nodes (10): ANSWER_TIMEOUT_MS, SPEECH_FORWARD_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, encoder, openStream() (+2 more)

### Community 52 - "InterviewerAvatar.tsx"
Cohesion: 0.16
Nodes (8): Completed Steps, 7. What surprised me, Avatar(), AvatarFallback(), InterviewerAvatarProps, SidebarUserCardProps, SidebarUser, getInitials()

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.15
Nodes (12): Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied, Ready to Implement (+4 more)

### Community 54 - "done"
Cohesion: 0.09
Nodes (27): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+19 more)

### Community 55 - "interviews/constants.ts"
Cohesion: 0.08
Nodes (37): InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, DEFAULT_START_VALUES, EMPTY_RECORDING_MESSAGE, FEEDBACK_START_PARAM, INTERVIEW_TYPE_LABELS (+29 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "[...path]/route.ts"
Cohesion: 0.13
Nodes (18): Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Trade-offs & Rationale, POST(), forward(), ForwardContext, isStreaming(), isTextual(), OWNED_BY_NEXT (+10 more)

### Community 58 - "Implementation Plan: Interview Feedback Screen (frontend)"
Cohesion: 0.10
Nodes (16): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen) (+8 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.12
Nodes (16): 15. Manual end-to-end run (user), Baseline Failures, Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues, Links (+8 more)

### Community 60 - "use-interview-turn.ts"
Cohesion: 0.17
Nodes (24): EffectContext, finishSpeech(), handleSent(), isTypingTarget(), questionLine(), RoomAnswer, RoomRecorder, runRoomEffect() (+16 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "InterviewsContainer.tsx"
Cohesion: 0.12
Nodes (18): InterviewsContainerProps, FEEDBACK_POLL_MS, START_ERROR_CODES, START_TIMEOUT_MESSAGE, interviewKeys, AnswerStreamOptions, useImportJobTextMutation(), useImportJobUrlMutation() (+10 more)

### Community 63 - "AuthForm"
Cohesion: 0.14
Nodes (17): About the Project, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied (+9 more)

### Community 64 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 65 - "use-audio-player.test.tsx"
Cohesion: 0.24
Nodes (9): @testing-library/react, activityWrapper(), domError(), fakeStream(), fakeTrack, installMediaFakes(), MediaFakes, played (+1 more)

### Community 66 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+3 more)

### Community 67 - "transcript.utils.ts"
Cohesion: 0.12
Nodes (20): Implementation Steps, reduceTurn(), TurnAction, answerStreamEventSchemas, AnswerRequest, AnswerResponse, AnswerStreamEventName, InterviewQuestion (+12 more)

### Community 68 - "sse.test.ts"
Cohesion: 0.21
Nodes (6): Step 2: The SSE parser (`src/lib/api/sse.ts`), readSseStream(), SseFrame, collect(), encoder, EXPECTED

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+6 more)

### Community 70 - "apiClient"
Cohesion: 0.24
Nodes (5): Architecture: Modular, Feature-Driven, Phase 2: Frontend (cuewise-fe), apiClient, AnswerErrorResult, cancel()

### Community 71 - "status"
Cohesion: 0.14
Nodes (25): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+17 more)

### Community 72 - "error"
Cohesion: 0.18
Nodes (17): Implementation Steps, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`), Step 14: Gates and the manual end-to-end run, Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`) (+9 more)

### Community 73 - "FeedbackStateMessage.tsx"
Cohesion: 0.11
Nodes (27): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), InterviewNotFoundCardProps (+19 more)

### Community 74 - "vitest"
Cohesion: 0.16
Nodes (18): vitest, GENERIC_ERROR_MESSAGE, RECORDING_FAILED_MESSAGE, CREDENTIALS, get, post, PROFILE, axiosErrorWith() (+10 more)

### Community 75 - "buildTranscriptView"
Cohesion: 0.16
Nodes (14): Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Room (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+6 more)

### Community 76 - "InterviewRoom.tsx"
Cohesion: 0.21
Nodes (12): Drawer(), DrawerContent(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle(), DrawerTrigger(), subscribe() (+4 more)

### Community 77 - "api.helper.ts"
Cohesion: 0.15
Nodes (14): Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), ApiError, apiErrorBodySchema, conflictDetailsSchema, isSessionErrorCode(), NormalizedError, normalizeError(), responseOf() (+6 more)

### Community 78 - "sidebar.tsx"
Cohesion: 0.13
Nodes (13): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+5 more)

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 9. Go deeper / Still open, Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)

### Community 80 - "transcript.utils.test.ts"
Cohesion: 0.07
Nodes (32): Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), FEEDBACK_TIMEOUT_MS, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, answerResponse(), emptyFeedback(), feedback(), FEEDBACK_ID (+24 more)

### Community 81 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.09
Nodes (32): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+24 more)

### Community 82 - "Learn: The interview room, frontend (voice-first, transcript-style)"
Cohesion: 0.25
Nodes (7): 1. Why it exists, 2. What it is (so far), 3. When to use it, 6. Try it yourself, 8. Check your understanding, 9. Go deeper / Still open, Learn: The interview room, frontend (voice-first, transcript-style)

### Community 83 - "TranscriptPanel"
Cohesion: 0.31
Nodes (10): Rename map (done in Step 1, no behaviour change), Project Conventions, Known Issues, Deviations from Plan, InterviewerAvatar(), TranscriptEntry(), TranscriptPanel(), TranscriptLine (+2 more)

### Community 84 - "ResumeContainer.tsx"
Cohesion: 0.20
Nodes (19): 4. How it works, Implementation Steps, Project Rules Applied, Deviations from Plan, ResumeContainer(), handleUpload(), Alert(), AlertDescription() (+11 more)

### Community 85 - "AppShell"
Cohesion: 0.53
Nodes (5): SidebarInset(), SidebarProvider(), SidebarTrigger(), AppShell(), AppShellProps

### Community 86 - "interview-history-columns.tsx"
Cohesion: 0.29
Nodes (10): @tanstack/react-table, column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, InterviewHistoryTableOptions, InterviewListItem, formatInterviewDate() (+2 more)

### Community 87 - "Skeleton"
Cohesion: 0.22
Nodes (10): AuthedShell(), AppLayout(), ResumeContent(), ResumePage(), SidebarMenuSkeleton(), Skeleton(), ROWS, HISTORY_PAGE_SIZE (+2 more)

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 89 - "format.utils.ts"
Cohesion: 0.36
Nodes (7): FOLLOW_UP_CAPTION, formatClock(), formatInterviewCount(), formatInterviewTitle(), formatProgress(), formatQuestionCaption(), formatQuestionPosition()

### Community 90 - "Implementation Steps"
Cohesion: 0.18
Nodes (10): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Trade-offs & Rationale (+2 more)

### Community 91 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.20
Nodes (9): Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 92 - "TranscriptPanel.tsx"
Cohesion: 0.16
Nodes (10): motion, use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, MOTION_ELEMENTS, Shimmer (+2 more)

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 94 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 95 - "axios"
Cohesion: 0.31
Nodes (4): axios, API, decodeBlobBody(), redirectIfSessionEnded

### Community 96 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 97 - "use-job-description-import.ts"
Cohesion: 0.25
Nodes (7): sonner, JOB_IMPORT_REPLACED_MESSAGE, JobImportActions, UseJobDescriptionImportOptions, jobUrlSchema, JobImport, JobTextRequest

### Community 98 - "Profile"
Cohesion: 0.32
Nodes (4): 8. Check your understanding, Test Cases, profileService, Profile

### Community 99 - "requireUser"
Cohesion: 0.14
Nodes (16): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+8 more)

### Community 100 - "profile.queries.ts"
Cohesion: 0.40
Nodes (4): Review, @tanstack/react-query, profileKeys, useMarkProfileMissing()

### Community 101 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.20
Nodes (9): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 102 - "session-redirect.test.ts"
Cohesion: 0.33
Nodes (4): body(), assign, bypass, clear

### Community 103 - "FeedbackResult.tsx"
Cohesion: 0.17
Nodes (13): FieldSeparator(), Separator(), SidebarSeparator(), FeedbackResult(), FeedbackResultProps, HighlightsCard(), HighlightsCardProps, ScoreCardProps (+5 more)

### Community 104 - "RoleSidebar.tsx"
Cohesion: 0.21
Nodes (8): roleSchema, Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 105 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

## Knowledge Gaps
- **669 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+664 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 791 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `AppSidebar.tsx`, `app/layout.tsx`, `field.tsx`, `auth-session.ts`, `InterviewsContainer`, `Implementation Steps`, `Implementation Steps`, `ActiveInterview.tsx`, `GET`, `Button`, `feedback.utils.ts`, `Implementation Plan: Voice Answers`, `done`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `Implementation Plan: Interview Feedback Screen (frontend)`, `InterviewsContainer.tsx`, `AuthForm`, `transcript.utils.ts`, `apiClient`, `FeedbackStateMessage.tsx`, `Implementation: Job description import (link and smart paste)`, `ResumeContainer.tsx`, `requireUser`, `profile.queries.ts`, `Implementation Plan: Interviews Setup UI (foundation)`, `RoleSidebar.tsx`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `app/layout.tsx`, `field.tsx`, `FeedbackQuestionAccordion.tsx`, `Implementation Steps`, `ActiveInterview.tsx`, `Button`, `current-user.server.ts`, `InterviewMessageCard`, `feedback.utils.ts`, `HistoryContainer.tsx`, `InterviewConfigForm`, `InterviewerAvatar.tsx`, `interviews/constants.ts`, `use-interview-turn.ts`, `InterviewsContainer.tsx`, `InterviewTitleBar.tsx`, `use-audio-player.test.tsx`, `transcript.utils.ts`, `status`, `FeedbackStateMessage.tsx`, `InterviewRoom.tsx`, `api.helper.ts`, `sidebar.tsx`, `ResumeContainer.tsx`, `AppShell`, `interview-history-columns.tsx`, `Skeleton`, `breadcrumb.tsx`, `TranscriptPanel.tsx`, `use-job-description-import.ts`, `requireUser`, `FeedbackResult.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `package.json`, `auth-session.ts`, `room.utils.test.ts`, `interviews.types.ts`, `auth.types.ts`, `ActiveInterview.tsx`, `voice.services.ts`, `profile/constants.ts`, `sidebar.types.ts`, `history.utils.ts`, `current-user.server.ts`, `feedback.utils.ts`, `[...path]/route.test.ts`, `InterviewerAvatar.tsx`, `use-audio-player.test.tsx`, `transcript.utils.ts`, `sse.test.ts`, `error`, `transcript.utils.test.ts`, `format.utils.ts`, `axios`, `session-redirect.test.ts`, `RoleSidebar.tsx`, `vitest.config.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 45 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 53 inferred relationships involving `Completed Steps` (e.g. with `ActiveInterview()` and `FinishedInterview()`) actually correct?**
  _`Completed Steps` has 53 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 23 INFERRED edges - model-reasoned connections that need verification._