# Graph Report - cuewise-fe  (2026-11-16)

## Corpus Check
- 283 files · ~208,365 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 2169 nodes · 5844 edges · 116 communities (114 shown, 2 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 1033 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4da84a5b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- AppSidebar.tsx
- components.json
- Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- RoomControls.tsx
- dependencies
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- field.tsx
- auth-session.ts
- README.md
- AGENTS.md
- conversation.tsx
- Button
- voice.utils.test.ts
- Implementation Steps
- SelectField.tsx
- interviews.types.ts
- Cuewise FE — Project Instructions
- getInterviewStep
- Feature: App Sidebar (shared shell for user and admin)
- auth.types.ts
- Implementation: Interviews Setup UI (foundation)
- lib/media.ts
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- Completed Steps
- GET
- devDependencies
- Feature: Interview Room (a voice interview, styled like a video call)
- InterviewLobby.tsx
- lucide-react
- Implementation: Interviews Chat Layout
- Feature: Interview Follow-up Questions (client support)
- profile/constants.ts
- status
- sidebar.types.ts
- history.utils.ts
- Implementation: Interview Room (frontend)
- [...path]/route.ts
- Implementation: Interview Follow-up Questions (client support)
- interviews/page.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- interviews.queries.ts
- Implementation: Résumé profile and résumé-aware interviews
- ActiveInterview.tsx
- transcript.utils.ts
- bff.server.ts
- HistoryContainer.tsx
- ResumeContainer.tsx
- interviews.services.test.ts
- Implementation Plan: Interview Room Polish
- Implementation Plan: Voice Answers
- Feature: Interview Answer Streaming (client support for the backend's SSE turn)
- interviews/constants.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- AuthedShell.tsx
- Implementation Plan: Interview Feedback Screen (frontend)
- Implementation: Voice Answers
- use-interview-turn.ts
- Feature: Interview Feedback Screen (frontend)
- InterviewsContainer.tsx
- AuthForm
- pickThinkingLabel
- vitest
- Implementation: Auth Session (cookie-based BFF)
- Feature: Interviews Setup UI (foundation)
- stream.utils.ts
- Feature: Job description import (link and smart paste)
- apiClient
- DataTable
- .answerStream
- Implementation Steps
- axios.ts
- Implementation Steps
- InterviewRoom.tsx
- api.helper.ts
- sidebar.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- transcript.utils.test.ts
- Implementation: Job description import (link and smart paste)
- Learn: The interview room, frontend (voice-first, transcript-style)
- Implementation: Interview Room Polish
- profile.queries.ts
- job-import.utils.test.ts
- DataTableColumnHeader.tsx
- Feature: Interview Room Polish (make the room feel like a video call)
- breadcrumb.tsx
- react
- Implementation Plan: Interview History Page (frontend)
- Implementation Plan: Résumé profile and résumé-aware interviews
- TranscriptPanel.tsx
- scripts
- eslint.config.mjs
- useMutationCallbacks
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- Learn: Job description import in the setup form
- RadioGroupField.tsx
- requireUser
- getQueryClient
- parseApiError
- InterviewsContainer
- interviews.ts
- current-user.server.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- done
- stream.utils.test.ts
- Learn: Showing a slow, stored AI result (the interview feedback screen)
- feedback/page.tsx
- RoleSidebar.tsx
- auth.routes.test.ts
- next
- FeedbackStateMessage.tsx
- api.helper.test.ts
- useWarnBeforeUnload

## God Nodes (most connected - your core abstractions)
1. `react` - 93 edges
2. `useMutationCallbacks()` - 62 edges
3. `Button()` - 61 edges
4. `Completed Steps` - 54 edges
5. `vitest` - 47 edges
6. `InterviewsContainer()` - 44 edges
7. `lucide-react` - 41 edges
8. `parseApiError()` - 41 edges
9. `requireUser()` - 39 edges
10. `Implementation Steps` - 37 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Blockers & Resolutions` --references--> `InterviewsContainer()`  [INFERRED]
  docs/features/interview-history/plan-v1.md → src/app/(app)/interviews/_components/InterviewsContainer.tsx
- `Edge Cases` --references--> `GET()`  [INFERRED]
  docs/features/interviews-setup-ui/spec.md → src/app/api/auth/session-expired/route.ts
- `7. What surprised me` --references--> `Avatar()`  [INFERRED]
  docs/features/interview-room/learnings.md → src/components/ui/avatar.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx

## Import Cycles
- None detected.

## Communities (116 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, happy-dom, @hookform/resolvers, react-dom, shadcn, tailwindcss (+8 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.21
Nodes (17): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuItem() (+9 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.13
Nodes (15): Overview, Acceptance Criteria, Blockers, Edge Cases, Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d), Functional, Goal, Non-Functional (+7 more)

### Community 5 - "RoomControls.tsx"
Cohesion: 0.11
Nodes (25): Architecture & Design, src_app_globals, metadata, RootLayout(), viewport, KbdGroup(), Popover(), PopoverContent() (+17 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+14 more)

### Community 7 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation, Status (+6 more)

### Community 8 - "field.tsx"
Cohesion: 0.15
Nodes (25): 7. What surprised me, Architecture & Design, Skills Consulted During Implementation, react-hook-form, Checkbox(), Field(), FieldDescription(), FieldError() (+17 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): Project Conventions, ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder() (+17 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "conversation.tsx"
Cohesion: 0.12
Nodes (17): Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Testing Strategy, Trade-offs & Rationale (+9 more)

### Community 13 - "Button"
Cohesion: 0.05
Nodes (84): Affected Files & Patterns, Architecture & Design, Affected Files & Patterns, Layout & UX Design, Deviations from Plan, Layout & UX Design, AuthCard(), AuthCardProps (+76 more)

### Community 14 - "voice.utils.test.ts"
Cohesion: 0.16
Nodes (21): 5. What can go wrong, Testing Strategy, Deviations from Plan, Skills Consulted During Implementation, PlaybackEnd, useAudioPlayer(), SPEECH_RATE_LIMITED_MESSAGE, SPEECH_UNAVAILABLE_MESSAGE (+13 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.21
Nodes (19): Forms, Affected Files & Patterns, Implementation Steps, Acceptance Criteria, Functional, Project Conventions, FieldGroup(), FieldSet() (+11 more)

### Community 16 - "SelectField.tsx"
Cohesion: 0.27
Nodes (15): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton(), SelectTrigger(), SelectValue() (+7 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.07
Nodes (41): ANSWER_MAX_LENGTH, FEEDBACK_STATUSES, HISTORY_PAGE_SIZES, HISTORY_SORT_COLUMNS, INTERVIEW_TYPES, JOB_PASTE_FORMATS, LEVELS, QUESTION_CATEGORIES (+33 more)

### Community 18 - "Cuewise FE — Project Instructions"
Cohesion: 0.17
Nodes (11): AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth, Testing (+3 more)

### Community 19 - "getInterviewStep"
Cohesion: 0.16
Nodes (13): Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied, Ready to Implement (+5 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "auth.types.ts"
Cohesion: 0.14
Nodes (20): AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES, authCredentialsSchema, authFormSchemas, authSearchParamsSchema (+12 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "lib/media.ts"
Cohesion: 0.13
Nodes (27): Implementation Steps, Completed Steps, AudioRecorderOptions, closeContext(), createLevelStore(), detectFormat(), detectLevelSupport(), noSubscription() (+19 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "Completed Steps"
Cohesion: 0.12
Nodes (17): Non-Functional, Phase 0: Spike (before Phase 1 is built against the real vendor), Phase 1: Backend (cuewise-be), Requirements, Completed Steps, Architecture & Design, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Changes Made (cuewise-fe, uncommitted) (+9 more)

### Community 27 - "GET"
Cohesion: 0.12
Nodes (18): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+10 more)

### Community 28 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, happy-dom, tailwindcss, @tailwindcss/turbopack, @testing-library/react, @types/node (+4 more)

### Community 29 - "Feature: Interview Room (a voice interview, styled like a video call)"
Cohesion: 0.15
Nodes (12): Acceptance Criteria, API Contract (shared by both repos; the single source of truth), Blockers, Constraints, Decisions, Edge Cases, Feature: Interview Room (a voice interview, styled like a video call), Goal (+4 more)

### Community 30 - "InterviewLobby.tsx"
Cohesion: 0.22
Nodes (12): Spinner(), InterviewLobby(), InterviewLobbyProps, LobbyMicTest, LOBBY_TIP, MIC_CHECK_MESSAGES, MIC_TEST_HEARD, MIC_TEST_LABEL (+4 more)

### Community 31 - "lucide-react"
Cohesion: 0.28
Nodes (4): lucide-react, PasswordInput(), CameraTileProps, PasswordFieldProps

### Community 32 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (16): Baseline Failures, Changes Made, Current Step, Follow-up: chat-assistant styling (after review), Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Known Issues (+8 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "profile/constants.ts"
Cohesion: 0.10
Nodes (26): zod, PROFILE_ERROR_CODES, RESUME_ACCEPT, RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES, RESUME_PAGE_COPY, RESUME_PROFILE_COPY (+18 more)

### Community 35 - "status"
Cohesion: 0.11
Nodes (18): Affected Files & Patterns, Blockers & Resolutions, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional (+10 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.21
Nodes (11): Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig, findActiveNavItem() (+3 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.20
Nodes (23): Implementation Steps, Testing Strategy, Implementation Steps, Testing Strategy, Changes Made, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, InterviewHistoryTableOptions (+15 more)

### Community 38 - "Implementation: Interview Room (frontend)"
Cohesion: 0.10
Nodes (19): Baseline Failures, Changes Made, Check results, Current Step, Debug Log, Done: ready for `/review-feature`, Findings, Fixes applied (2026-11-16, user selected R1, R2, R5) (+11 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.17
Nodes (15): Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Trade-offs & Rationale, forward(), ForwardContext, isStreaming(), isTextual(), OWNED_BY_NEXT, parseJsonOrNull() (+7 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 41 - "interviews/page.tsx"
Cohesion: 0.18
Nodes (12): Completed Steps, Affected Files & Patterns, Skills Consulted, InterviewsContent(), InterviewsPage(), InterviewsPageProps, useInterviewQuery(), parseSessionParam() (+4 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "interviews.queries.ts"
Cohesion: 0.09
Nodes (30): 5. What can go wrong, 6. Try it yourself, Trade-offs & Rationale, CRITERION_LABELS, FEEDBACK_CRITERIA, FEEDBACK_ERROR_CODES, FEEDBACK_POLL_MS, FEEDBACK_RATE_LIMIT_MESSAGE (+22 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Deviations from Plan, Done, Implementation: Résumé profile and résumé-aware interviews (+7 more)

### Community 46 - "ActiveInterview.tsx"
Cohesion: 0.20
Nodes (13): sonner, ActiveInterviewProps, FinishedInterview(), LiveInterview(), retryNotice(), CameraStatus, useCamera(), DeviceError (+5 more)

### Community 47 - "transcript.utils.ts"
Cohesion: 0.12
Nodes (15): INTERVIEWER_SLOW_LABEL, RESYNC_ERROR_CODES, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn(), TurnAction, AnswerRequest (+7 more)

### Community 48 - "bff.server.ts"
Cohesion: 0.44
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.13
Nodes (20): Architecture & Design, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps, InterviewHistorySkeleton() (+12 more)

### Community 50 - "ResumeContainer.tsx"
Cohesion: 0.22
Nodes (13): ResumeContainer(), ResumeContent(), ResumePage(), Alert(), AlertDescription(), AlertTitle(), alertVariants, SidebarMenuSkeleton() (+5 more)

### Community 51 - "interviews.services.test.ts"
Cohesion: 0.13
Nodes (12): ANSWER_TIMEOUT_MS, FEEDBACK_TIMEOUT_MS, SPEECH_FORWARD_TIMEOUT_MS, START_TIMEOUT_MS, fetchMock, encoder, openStream(), sseFrame() (+4 more)

### Community 52 - "Implementation Plan: Interview Room Polish"
Cohesion: 0.11
Nodes (16): Affected Files & Patterns, Approaches Considered, Blockers & Resolutions, Implementation Plan: Interview Room Polish, Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+8 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.14
Nodes (13): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+5 more)

### Community 54 - "Feature: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional (+6 more)

### Community 55 - "interviews/constants.ts"
Cohesion: 0.07
Nodes (47): column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS (+39 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "AuthedShell.tsx"
Cohesion: 0.22
Nodes (15): Architecture & Design, Implementation Steps, Deviations from Plan, AuthedShell(), AuthedShellProps, getSessionUser(), AppLayout(), SidebarInset() (+7 more)

### Community 58 - "Implementation Plan: Interview Feedback Screen (frontend)"
Cohesion: 0.18
Nodes (10): About the Project, Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Skills Consulted During Implementation (+2 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.12
Nodes (16): 15. Manual end-to-end run (user), Baseline Failures, Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues, Links (+8 more)

### Community 60 - "use-interview-turn.ts"
Cohesion: 0.12
Nodes (34): 4. How it works, Acceptance Criteria Traceability, RECORDING_FAILED_MESSAGE, EffectContext, finishSpeech(), handleSent(), isTypingTarget(), questionLine() (+26 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "InterviewsContainer.tsx"
Cohesion: 0.14
Nodes (14): InterviewsContainerProps, START_ERROR_CODES, START_TIMEOUT_MESSAGE, useImportJobUrlMutation(), sessionParamSchema, Interview, InterviewStep, ResumeStatus (+6 more)

### Community 63 - "AuthForm"
Cohesion: 0.19
Nodes (12): Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement (+4 more)

### Community 64 - "pickThinkingLabel"
Cohesion: 0.12
Nodes (20): Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Completed Steps, Deviations from Plan, Part A: Chat core (committed: c23b36f), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support) (+12 more)

### Community 65 - "vitest"
Cohesion: 0.17
Nodes (13): ref_node_url, @testing-library/react, vitest, activityWrapper(), AudioLevelFake, domError(), fakeMediaRecorder(), fakeStream() (+5 more)

### Community 66 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Known Issues, Links, Not verified automatically (manual browser check by the user), Open Questions (+4 more)

### Community 67 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Blockers, Constraints, Edge Cases, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope (+5 more)

### Community 68 - "stream.utils.ts"
Cohesion: 0.14
Nodes (11): Step 2: The SSE parser (`src/lib/api/sse.ts`), readSseStream(), SseFrame, answerStreamEventSchemas, AnswerStreamEventName, AnswerStreamState, ParsedStreamEvent, StreamData (+3 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+6 more)

### Community 70 - "apiClient"
Cohesion: 0.24
Nodes (5): Architecture: Modular, Feature-Driven, Phase 2: Frontend (cuewise-fe), apiClient, AnswerErrorResult, cancel()

### Community 71 - "DataTable"
Cohesion: 0.16
Nodes (20): Architecture & Design, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Requirements -> Implementation, Skills Consulted, Trade-offs & Rationale (+12 more)

### Community 72 - ".answerStream"
Cohesion: 0.21
Nodes (14): Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`), Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 6: The service (`modules/interviews/services/interviews.services.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Completed Steps, Test Cases, ApiResponseError (+6 more)

### Community 73 - "Implementation Steps"
Cohesion: 0.22
Nodes (11): Implementation Steps, Deviations from Plan, FeedbackContainerProps, FeedbackGenerating(), FeedbackResult(), FeedbackSkeleton(), FEEDBACK_GENERATING_LABEL, FEEDBACK_LEAVE_HINT (+3 more)

### Community 74 - "axios.ts"
Cohesion: 0.19
Nodes (13): SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, transcriptionResponseSchema, SPEECH_ROUTE, voiceService, axiosErrorWith(), errorBody(), networkError() (+5 more)

### Community 75 - "Implementation Steps"
Cohesion: 0.14
Nodes (23): Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Room (frontend), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+15 more)

### Community 76 - "InterviewRoom.tsx"
Cohesion: 0.20
Nodes (12): Drawer(), DrawerContent(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle(), CameraTile(), InterviewRoom() (+4 more)

### Community 77 - "api.helper.ts"
Cohesion: 0.11
Nodes (18): Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), axios, ApiError, apiErrorBodySchema, conflictDetailsSchema, GENERIC_ERROR_MESSAGE, isSessionErrorCode(), NormalizedError (+10 more)

### Community 78 - "sidebar.tsx"
Cohesion: 0.11
Nodes (18): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+10 more)

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.18
Nodes (9): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+1 more)

### Community 80 - "transcript.utils.test.ts"
Cohesion: 0.08
Nodes (25): INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, SILENCE_HINT, Q1, Q2, Q3, REACTION, SESSION_ID (+17 more)

### Community 81 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Implementation: Job description import (link and smart paste), Known Issues, Links, Open Questions, Status, Test Cases (+3 more)

### Community 82 - "Learn: The interview room, frontend (voice-first, transcript-style)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is (so far), 3. When to use it, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: The interview room, frontend (voice-first, transcript-style)

### Community 83 - "Implementation: Interview Room Polish"
Cohesion: 0.12
Nodes (16): 4. Pure copy helpers and constants, Baseline Failures, Changes Made, Current Step, Debug Log, Deviations from Plan, Implementation: Interview Room Polish, Known Issues (+8 more)

### Community 84 - "profile.queries.ts"
Cohesion: 0.21
Nodes (13): 4. How it works, Approaches Considered, Implementation Steps, Review, Test Cases, handleUpload(), profileKeys, useDeleteProfileMutation() (+5 more)

### Community 85 - "job-import.utils.test.ts"
Cohesion: 0.13
Nodes (29): 4. How it works, 5. What can go wrong, Implementation Steps, Completed Steps, JOB_DESCRIPTION_MAX_LENGTH, JOB_IMPORT_FAILED_MESSAGE, JOB_IMPORT_REPLACED_MESSAGE, JOB_PASTE_MAX_CHARS (+21 more)

### Community 86 - "DataTableColumnHeader.tsx"
Cohesion: 0.47
Nodes (4): Deviations from Plan, @tanstack/react-table, DataTableFeatures, DataTableColumnHeaderProps

### Community 87 - "Feature: Interview Room Polish (make the room feel like a video call)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions (from the spec grilling), Edge Cases, Feature: Interview Room Polish (make the room feel like a video call), Functional, Goal (+7 more)

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 89 - "react"
Cohesion: 0.24
Nodes (7): class-variance-authority, cn, radix-ui, react, FieldSeparator(), Separator(), SidebarSeparator()

### Community 90 - "Implementation Plan: Interview History Page (frontend)"
Cohesion: 0.25
Nodes (7): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Trade-offs & Rationale

### Community 91 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 92 - "TranscriptPanel.tsx"
Cohesion: 0.13
Nodes (19): Rename map (done in Step 1, no behaviour change), Project Conventions, Known Issues, motion, ConversationContent(), MOTION_ELEMENTS, Shimmer, TextShimmerProps (+11 more)

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 94 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 95 - "useMutationCallbacks"
Cohesion: 0.10
Nodes (23): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement (+15 more)

### Community 96 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 97 - "Learn: Job description import in the setup form"
Cohesion: 0.25
Nodes (7): 1. Why it exists, 2. What it is, 3. When to use it, 6. Try it yourself, 8. Check your understanding, 9. Go deeper / Still open, Learn: Job description import in the setup form

### Community 98 - "RadioGroupField.tsx"
Cohesion: 0.22
Nodes (11): FieldTitle(), RadioGroup(), RadioGroupItem(), Slider(), LAYOUT, OPTION, RadioGroupField(), RadioGroupFieldProps (+3 more)

### Community 99 - "requireUser"
Cohesion: 0.14
Nodes (15): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+7 more)

### Community 100 - "getQueryClient"
Cohesion: 0.20
Nodes (11): Data Fetching (TanStack Query), next-themes, @tanstack/react-query, Providers(), ProvidersProps, getQueryClient(), makeQueryClient(), shouldRetry() (+3 more)

### Community 101 - "parseApiError"
Cohesion: 0.14
Nodes (21): Completed Steps, Affected Files & Patterns, Implementation Steps, Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Implementation Steps, Overview (+13 more)

### Community 102 - "InterviewsContainer"
Cohesion: 0.22
Nodes (20): Skills Consulted, Project Conventions, Affected Files & Patterns, Completed Steps, Architecture & Design, Implementation Steps, Part A: Chat core, Part B: Robustness (+12 more)

### Community 103 - "interviews.ts"
Cohesion: 0.20
Nodes (11): ROLES, historyOrderParamSchema, historySizeParamSchema, historySortParamSchema, emptyFeedback(), feedback(), FEEDBACK_ID, feedbackQuestion() (+3 more)

### Community 104 - "current-user.server.ts"
Cohesion: 0.20
Nodes (10): Test Results, ref_server_only, ApiErrorBody, axios, AxiosRequestConfig, backendApi, SessionExpiredError, apiUrlSchema (+2 more)

### Community 105 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 106 - "done"
Cohesion: 0.20
Nodes (13): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+5 more)

### Community 107 - "stream.utils.test.ts"
Cohesion: 0.18
Nodes (11): Implementation Steps, Step 14: Gates and the manual end-to-end run, Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), ANSWER_STREAM_START, inferStreamingQuestion(), reduceAnswerStream() (+3 more)

### Community 108 - "Learn: Showing a slow, stored AI result (the interview feedback screen)"
Cohesion: 0.15
Nodes (10): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen) (+2 more)

### Community 109 - "feedback/page.tsx"
Cohesion: 0.26
Nodes (11): FeedbackContainer(), FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), InterviewNotFoundCardProps, feedbackRoute(), INTERVIEW_NOT_FOUND_DESCRIPTION (+3 more)

### Community 110 - "RoleSidebar.tsx"
Cohesion: 0.23
Nodes (7): Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 111 - "auth.routes.test.ts"
Cohesion: 0.18
Nodes (8): CREDENTIALS, get, post, PROFILE, ok(), cookieJar, nextHeadersMock, StoredCookie

### Community 112 - "next"
Cohesion: 0.39
Nodes (4): nextConfig, next, POST(), clearAccessTokenCookie()

### Community 113 - "FeedbackStateMessage.tsx"
Cohesion: 0.29
Nodes (7): ALERTS, FeedbackMessageKind, FeedbackStateMessage(), FeedbackStateMessageProps, ICONS, linkButton(), FEEDBACK_MESSAGES

### Community 114 - "api.helper.test.ts"
Cohesion: 0.25
Nodes (4): body(), assign, bypass, clear

## Knowledge Gaps
- **713 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+708 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 847 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `RoomControls.tsx`, `field.tsx`, `conversation.tsx`, `Button`, `voice.utils.test.ts`, `SelectField.tsx`, `lib/media.ts`, `InterviewLobby.tsx`, `lucide-react`, `history.utils.ts`, `interviews/page.tsx`, `interviews.queries.ts`, `ActiveInterview.tsx`, `transcript.utils.ts`, `HistoryContainer.tsx`, `ResumeContainer.tsx`, `Implementation Plan: Interview Room Polish`, `interviews/constants.ts`, `AuthedShell.tsx`, `use-interview-turn.ts`, `InterviewsContainer.tsx`, `vitest`, `DataTable`, `Implementation Steps`, `InterviewRoom.tsx`, `sidebar.tsx`, `transcript.utils.test.ts`, `job-import.utils.test.ts`, `breadcrumb.tsx`, `TranscriptPanel.tsx`, `RadioGroupField.tsx`, `requireUser`, `getQueryClient`, `current-user.server.ts`, `feedback/page.tsx`, `FeedbackStateMessage.tsx`, `useWarnBeforeUnload`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `auth-session.ts`, `conversation.tsx`, `Button`, `voice.utils.test.ts`, `Implementation Steps`, `getInterviewStep`, `auth.types.ts`, `GET`, `Implementation: Interviews Chat Layout`, `interviews.queries.ts`, `transcript.utils.ts`, `ResumeContainer.tsx`, `Implementation Plan: Voice Answers`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `AuthedShell.tsx`, `Implementation Plan: Interview Feedback Screen (frontend)`, `InterviewsContainer.tsx`, `AuthForm`, `Feature: Interviews Setup UI (foundation)`, `apiClient`, `Implementation Steps`, `Implementation Steps`, `profile.queries.ts`, `job-import.utils.test.ts`, `requireUser`, `getQueryClient`, `parseApiError`, `InterviewsContainer`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `done`, `Learn: Showing a slow, stored AI result (the interview feedback screen)`, `RoleSidebar.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `RoomControls.tsx`, `field.tsx`, `conversation.tsx`, `Implementation Steps`, `SelectField.tsx`, `auth.types.ts`, `InterviewLobby.tsx`, `history.utils.ts`, `ActiveInterview.tsx`, `HistoryContainer.tsx`, `ResumeContainer.tsx`, `interviews/constants.ts`, `AuthedShell.tsx`, `InterviewsContainer.tsx`, `AuthForm`, `DataTable`, `Implementation Steps`, `sidebar.tsx`, `job-import.utils.test.ts`, `DataTableColumnHeader.tsx`, `react`, `TranscriptPanel.tsx`, `InterviewsContainer`, `feedback/page.tsx`, `FeedbackStateMessage.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 45 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 53 inferred relationships involving `Completed Steps` (e.g. with `ActiveInterview()` and `FinishedInterview()`) actually correct?**
  _`Completed Steps` has 53 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _713 weakly-connected nodes found - possible documentation gaps or missing edges._