# Graph Report - cuewise-fe  (2026-11-16)

## Corpus Check
- 285 files · ~211,167 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 2181 nodes · 5880 edges · 115 communities (114 shown, 1 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 1066 edges (avg confidence: 0.95)
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
- Part A: Chat core
- FeedbackResult.tsx
- use-interview-voice.ts
- Implementation Steps
- SelectField.tsx
- interviews.types.ts
- Cuewise FE — Project Instructions
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- auth.types.ts
- Implementation: Interviews Setup UI (foundation)
- use-audio-recorder.ts
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- .transcribe
- GET
- devDependencies
- Feature: Interview Room (a voice interview, styled like a video call)
- InterviewLobby.tsx
- Button
- Implementation: Interviews Chat Layout
- Feature: Interview Follow-up Questions (client support)
- ResumeUploadCard.tsx
- Feature: Interview History Page (frontend)
- sidebar.types.ts
- history.utils.ts
- Implementation: Interview Room (frontend)
- [...path]/route.ts
- Implementation: Interview Follow-up Questions (client support)
- avatar.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- interviews.queries.ts
- Implementation: Résumé profile and résumé-aware interviews
- ActiveInterview.tsx
- transcript.utils.ts
- bff.server.ts
- HistoryContainer.tsx
- Skeleton
- interviews.services.test.ts
- Implementation Plan: Interview Room Polish
- Implementation Plan: Voice Answers
- error
- interviews/constants.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- Implementation Steps
- Implementation Plan: Interview Feedback Screen (frontend)
- Implementation: Voice Answers
- use-interview-turn.ts
- Feature: Interview Feedback Screen (frontend)
- InterviewsContainer
- AuthForm
- pickThinkingLabel
- vitest
- Implementation: Auth Session (cookie-based BFF)
- InterviewTitleBar.tsx
- status
- Feature: Job description import (link and smart paste)
- apiClient
- DataTable
- stream.utils.ts
- FeedbackQuestionAccordion.tsx
- voice.services.ts
- Implementation Plan: Interview Room (frontend)
- Completed Steps
- api.helper.ts
- sidebar.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- transcript.utils.test.ts
- Implementation: Job description import (link and smart paste)
- Learn: The interview room, frontend (voice-first, transcript-style)
- Implementation: Interview Room Polish
- ResumeContainer.tsx
- use-job-description-import.ts
- interview-history-columns.tsx
- Feature: Interview Room Polish (make the room feel like a video call)
- breadcrumb.tsx
- react
- Implementation Steps
- Implementation Plan: Résumé profile and résumé-aware interviews
- lucide-react
- scripts
- profile.services.test.ts
- Implementation Plan: Job description import (link and smart paste)
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- Implementation Steps
- RadioGroupField.tsx
- requireUser
- getQueryClient
- LevelSource
- lib/media.ts
- interviews.schema.test.ts
- next
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- format.utils.ts
- app/layout.tsx
- Learn: Showing a slow, stored AI result (the interview feedback screen)
- FeedbackStateMessage.tsx
- RoleSidebar.tsx
- auth.routes.test.ts
- interviewsService
- signin/page.tsx
- session-redirect.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 93 edges
2. `useMutationCallbacks()` - 62 edges
3. `Button()` - 61 edges
4. `Completed Steps` - 54 edges
5. `vitest` - 48 edges
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
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (115 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.09
Nodes (20): eslintConfig, name, private, version, eslint, eslint-config-next, happy-dom, next-themes (+12 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (18): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuItem() (+10 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Edge Cases, Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d), Functional, Goal, Non-Functional, Out of Scope, Problem (+3 more)

### Community 5 - "RoomControls.tsx"
Cohesion: 0.14
Nodes (20): Kbd(), KbdGroup(), Popover(), PopoverContent(), PopoverTitle(), PopoverTrigger(), SidebarMenuButton(), Spinner() (+12 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+14 more)

### Community 7 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.14
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation (+7 more)

### Community 8 - "field.tsx"
Cohesion: 0.13
Nodes (28): Skills Consulted, Skills Consulted, Project Conventions, Skills Consulted During Implementation, Skills Consulted During Implementation, react-hook-form, Checkbox(), Field() (+20 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.14
Nodes (26): Project Conventions, Deviations recorded during /implement, ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired() (+18 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Part A: Chat core"
Cohesion: 0.14
Nodes (21): Components, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part A: Chat core, Project Rules Applied (+13 more)

### Community 13 - "FeedbackResult.tsx"
Cohesion: 0.14
Nodes (26): Layout & UX Design, AuthCard(), AuthCardProps, COPY, SignUpContent(), SignUpPage(), SignUpPageProps, Card() (+18 more)

### Community 14 - "use-interview-voice.ts"
Cohesion: 0.13
Nodes (23): 5. What can go wrong, Testing Strategy, Deviations from Plan, Skills Consulted During Implementation, PlaybackEnd, useAudioPlayer(), RESYNC_ERROR_CODES, SPEECH_RATE_LIMITED_MESSAGE (+15 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.22
Nodes (18): Forms, Implementation Steps, Acceptance Criteria, Functional, Project Conventions, FieldGroup(), FieldSet(), Toaster() (+10 more)

### Community 16 - "SelectField.tsx"
Cohesion: 0.21
Nodes (18): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton(), SelectTrigger(), SelectValue() (+10 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.08
Nodes (37): ANSWER_MAX_LENGTH, FEEDBACK_CRITERIA, HISTORY_SORT_COLUMNS, JOB_PASTE_FORMATS, JOB_URL_MAX_LENGTH, LEVELS, QUESTION_CATEGORIES, QUESTION_KINDS (+29 more)

### Community 18 - "Cuewise FE — Project Instructions"
Cohesion: 0.18
Nodes (10): AI Features (UI side), Common Commands, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth, Testing, Tooling (+2 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.09
Nodes (39): Completed Steps, Project Conventions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps (+31 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "auth.types.ts"
Cohesion: 0.11
Nodes (21): @hookform/resolvers, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, AuthFormContainerProps, ERROR_TITLES, authCredentialsSchema, authFormSchemas (+13 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "use-audio-recorder.ts"
Cohesion: 0.22
Nodes (14): 4. How it works, AudioRecorderOptions, closeContext(), createLevelStore(), detectFormat(), detectLevelSupport(), noSubscription(), openContext() (+6 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - ".transcribe"
Cohesion: 0.22
Nodes (9): Affected Files & Patterns, Architecture & Design, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Changes Made (cuewise-fe, uncommitted), recordingFileName(), TranscribeErrorResult, TranscribeResult, Transcription (+1 more)

### Community 27 - "GET"
Cohesion: 0.07
Nodes (30): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+22 more)

### Community 28 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, happy-dom, tailwindcss, @tailwindcss/turbopack, @testing-library/react, @types/node (+4 more)

### Community 29 - "Feature: Interview Room (a voice interview, styled like a video call)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, API Contract (shared by both repos; the single source of truth), Blockers, Constraints, Decisions, Edge Cases, Feature: Interview Room (a voice interview, styled like a video call), Goal (+8 more)

### Community 30 - "InterviewLobby.tsx"
Cohesion: 0.23
Nodes (10): InterviewLobbyProps, LobbyMicTest, LOBBY_TIP, MIC_CHECK_MESSAGES, MIC_TEST_HEARD, MIC_TEST_LABEL, MIC_TEST_LISTENING, MIC_TEST_NOT_HEARD (+2 more)

### Community 31 - "Button"
Cohesion: 0.29
Nodes (19): Deviations from Plan, Button(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+11 more)

### Community 32 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Current Step, Follow-up: chat-assistant styling (after review), Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links (+7 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "ResumeUploadCard.tsx"
Cohesion: 0.12
Nodes (22): zod, ResumeUploadCardProps, PROFILE_ERROR_CODES, RESUME_ACCEPT, RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES, RESUME_PAGE_COPY (+14 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional, Out of Scope (+4 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.23
Nodes (10): Deviations During Implementation, RoleHeaderTitle(), RoleHeaderTitleProps, AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig (+2 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.26
Nodes (15): Testing Strategy, Deviations from Plan, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, useInterviewHistoryTable(), historyPageParamSchema, applyPaginationChange(), applySortingChange() (+7 more)

### Community 38 - "Implementation: Interview Room (frontend)"
Cohesion: 0.10
Nodes (19): Baseline Failures, Changes Made, Check results, Current Step, Debug Log, Done: ready for `/review-feature`, Findings, Fixes applied (2026-11-16, user selected R1, R2, R5) (+11 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.13
Nodes (18): Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Trade-offs & Rationale, forward(), ForwardContext, isStreaming(), isTextual(), OWNED_BY_NEXT, parseJsonOrNull() (+10 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Current Step, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation, Status (+3 more)

### Community 41 - "avatar.tsx"
Cohesion: 0.19
Nodes (6): 7. What surprised me, Avatar(), AvatarFallback(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "interviews.queries.ts"
Cohesion: 0.11
Nodes (25): 5. What can go wrong, 6. Try it yourself, CRITERION_LABELS, FEEDBACK_ERROR_CODES, FEEDBACK_POLL_MS, FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, FEEDBACK_START_VALUE (+17 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Deviations from Plan, Done, Implementation: Résumé profile and résumé-aware interviews (+7 more)

### Community 46 - "ActiveInterview.tsx"
Cohesion: 0.35
Nodes (11): Skills Consulted During Implementation, Completed Steps, ActiveInterview(), ActiveInterviewProps, FinishedInterview(), LiveInterview(), retryNotice(), InterviewClosingCard() (+3 more)

### Community 47 - "transcript.utils.ts"
Cohesion: 0.16
Nodes (18): Architecture & Design, Rename map (done in Step 1, no behaviour change), INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn(), TurnAction (+10 more)

### Community 48 - "bff.server.ts"
Cohesion: 0.47
Nodes (9): POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody(), validationErrorResponse(), setAccessTokenCookie() (+1 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.12
Nodes (21): Architecture & Design, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps, InterviewHistorySkeleton() (+13 more)

### Community 50 - "Skeleton"
Cohesion: 0.31
Nodes (7): AppLayout(), ResumeContent(), ResumePage(), SidebarMenuSkeleton(), Skeleton(), RESUME_ROUTE, AppShellSkeleton()

### Community 51 - "interviews.services.test.ts"
Cohesion: 0.08
Nodes (18): Step 2: The SSE parser (`src/lib/api/sse.ts`), readSseStream(), SseFrame, ANSWER_TIMEOUT_MS, FEEDBACK_TIMEOUT_MS, SPEECH_FORWARD_TIMEOUT_MS, fetchMock, interviewListItem() (+10 more)

### Community 52 - "Implementation Plan: Interview Room Polish"
Cohesion: 0.11
Nodes (16): Affected Files & Patterns, Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Room Polish, Overview, Project Rules Applied, Ready to Implement (+8 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.14
Nodes (13): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+5 more)

### Community 54 - "error"
Cohesion: 0.14
Nodes (15): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional (+7 more)

### Community 55 - "interviews/constants.ts"
Cohesion: 0.09
Nodes (31): InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, FEEDBACK_GENERATING_LABEL, FEEDBACK_LEAVE_HINT, FEEDBACK_SLOW_AFTER_MS, FEEDBACK_SLOW_LABEL (+23 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "Implementation Steps"
Cohesion: 0.42
Nodes (7): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), RoleSidebar(), isActivePath(), trimTrailingSlash()

### Community 58 - "Implementation Plan: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): About the Project, 8. Check your understanding, Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+7 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.12
Nodes (16): 15. Manual end-to-end run (user), Baseline Failures, Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues, Links (+8 more)

### Community 60 - "use-interview-turn.ts"
Cohesion: 0.10
Nodes (45): 4. How it works, Implementation Steps, Phase 2: Frontend (cuewise-fe), EMPTY_RECORDING_MESSAGE, MIC_REQUIRED_MESSAGE, RECORDING_FAILED_MESSAGE, RECORDING_LIMIT_MESSAGE, ROOM_STATUS_LABELS (+37 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "InterviewsContainer"
Cohesion: 0.15
Nodes (22): Affected Files & Patterns, Affected Files & Patterns, Skills Consulted, Completed Steps, InterviewsContainer(), InterviewsContainerProps, InterviewsContent(), InterviewsPage() (+14 more)

### Community 63 - "AuthForm"
Cohesion: 0.17
Nodes (15): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement (+7 more)

### Community 64 - "pickThinkingLabel"
Cohesion: 0.12
Nodes (21): Affected Files & Patterns, Deviations from Plan, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Implementation Steps, Overview (+13 more)

### Community 65 - "vitest"
Cohesion: 0.17
Nodes (13): ref_node_url, @testing-library/react, vitest, activityWrapper(), AudioLevelFake, domError(), fakeMediaRecorder(), fakeStream() (+5 more)

### Community 66 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 67 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 68 - "status"
Cohesion: 0.14
Nodes (18): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+10 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+6 more)

### Community 70 - "apiClient"
Cohesion: 0.22
Nodes (5): Architecture: Modular, Feature-Driven, Phase 2: Frontend (cuewise-fe), apiClient, AnswerErrorResult, cancel()

### Community 71 - "DataTable"
Cohesion: 0.33
Nodes (10): Table(), TableBody(), TableCaption(), TableCell(), TableHead(), TableHeader(), TableRow(), ARIA_SORT (+2 more)

### Community 72 - "stream.utils.ts"
Cohesion: 0.08
Nodes (40): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+32 more)

### Community 73 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.22
Nodes (16): Architecture & Design, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants, CriterionScore() (+8 more)

### Community 74 - "voice.services.ts"
Cohesion: 0.29
Nodes (7): SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, transcriptionResponseSchema, SPEECH_ROUTE, voiceService, downloadBlob, post

### Community 75 - "Implementation Plan: Interview Room (frontend)"
Cohesion: 0.22
Nodes (10): Approaches Considered, Blockers & Resolutions, Implementation Plan: Interview Room (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 76 - "Completed Steps"
Cohesion: 0.14
Nodes (23): Project Conventions, Acceptance Criteria Traceability, Completed Steps, Known Issues, SessionSkeleton(), Drawer(), DrawerContent(), DrawerHeader() (+15 more)

### Community 77 - "api.helper.ts"
Cohesion: 0.10
Nodes (27): Affected Files & Patterns, axios, ApiError, apiErrorBodySchema, conflictDetailsSchema, GENERIC_ERROR_MESSAGE, NormalizedError, normalizeError() (+19 more)

### Community 78 - "sidebar.tsx"
Cohesion: 0.09
Nodes (26): FieldSeparator(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal() (+18 more)

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 9. Go deeper / Still open, Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)

### Community 80 - "transcript.utils.test.ts"
Cohesion: 0.07
Nodes (33): Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), FOLLOW_UP_CAPTION, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, SILENCE_HINT, FeedbackQuestion, SendResult, answerResponse() (+25 more)

### Community 81 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Implementation: Job description import (link and smart paste), Known Issues, Links, Open Questions, Status, Test Cases (+3 more)

### Community 82 - "Learn: The interview room, frontend (voice-first, transcript-style)"
Cohesion: 0.25
Nodes (7): 1. Why it exists, 2. What it is (so far), 3. When to use it, 6. Try it yourself, 8. Check your understanding, 9. Go deeper / Still open, Learn: The interview room, frontend (voice-first, transcript-style)

### Community 83 - "Implementation: Interview Room Polish"
Cohesion: 0.14
Nodes (13): Baseline Failures, Browser Audit (2026-11-16, Chrome, desktop 1736 px and a 360 px iframe), Changes Made, Debug Log, Implementation: Interview Room Polish, Known Issues, Links, Open Questions (+5 more)

### Community 84 - "ResumeContainer.tsx"
Cohesion: 0.21
Nodes (17): 4. How it works, Approaches Considered, Implementation Steps, Review, ResumeContainer(), handleUpload(), Alert(), AlertDescription() (+9 more)

### Community 85 - "use-job-description-import.ts"
Cohesion: 0.15
Nodes (12): JOB_DESCRIPTION_MAX_LENGTH, JOB_IMPORT_FAILED_MESSAGE, JOB_IMPORT_REPLACED_MESSAGE, JOB_PASTE_MAX_CHARS, JOB_TEXT_ERROR_CODE, JOB_URL_ERROR_CODES, JobImportActions, UseJobDescriptionImportOptions (+4 more)

### Community 86 - "interview-history-columns.tsx"
Cohesion: 0.19
Nodes (15): Testing Strategy, @tanstack/react-table, column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, INTERVIEW_TYPE_LABELS, LEVEL_LABELS (+7 more)

### Community 87 - "Feature: Interview Room Polish (make the room feel like a video call)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions (from the spec grilling), Edge Cases, Feature: Interview Room Polish (make the room feel like a video call), Functional, Goal (+7 more)

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 89 - "react"
Cohesion: 0.25
Nodes (7): class-variance-authority, cn, radix-ui, react, buttonVariants, Toggle(), toggleVariants

### Community 90 - "Implementation Steps"
Cohesion: 0.17
Nodes (11): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Implementation Steps, Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Trade-offs & Rationale (+3 more)

### Community 91 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 92 - "lucide-react"
Cohesion: 0.10
Nodes (21): Deviations from Plan, Affected Files & Patterns, lucide-react, motion, use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps (+13 more)

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 94 - "profile.services.test.ts"
Cohesion: 0.15
Nodes (12): 8. Check your understanding, Overview, Blockers, Project Conventions, Test Cases, RESUME_UPLOAD_TIMEOUT_MS, profileService, Profile (+4 more)

### Community 95 - "Implementation Plan: Job description import (link and smart paste)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+2 more)

### Community 96 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 97 - "Implementation Steps"
Cohesion: 0.19
Nodes (20): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+12 more)

### Community 98 - "RadioGroupField.tsx"
Cohesion: 0.12
Nodes (20): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+12 more)

### Community 99 - "requireUser"
Cohesion: 0.14
Nodes (16): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+8 more)

### Community 100 - "getQueryClient"
Cohesion: 0.22
Nodes (11): Data Fetching (TanStack Query), Project Rules Applied, @tanstack/react-query, Providers(), ProvidersProps, getQueryClient(), makeQueryClient(), shouldRetry() (+3 more)

### Community 101 - "LevelSource"
Cohesion: 0.17
Nodes (15): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+7 more)

### Community 102 - "lib/media.ts"
Cohesion: 0.21
Nodes (11): CameraStatus, useCamera(), DEVICE_ERROR_MESSAGES, DeviceError, deviceErrorKind(), RECORDING_FORMATS, SILENCE_LEVEL, SILENCE_MS (+3 more)

### Community 103 - "interviews.schema.test.ts"
Cohesion: 0.17
Nodes (9): DEFAULT_START_VALUES, ROLE_OPTIONS, ROLES, answerResponseSchema, historyOrderParamSchema, historySizeParamSchema, historySortParamSchema, sessionParamSchema (+1 more)

### Community 104 - "next"
Cohesion: 0.17
Nodes (14): nextConfig, next, ref_server_only, POST(), AuthedShellProps, getSessionUser(), ApiErrorBody, axios (+6 more)

### Community 105 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 106 - "format.utils.ts"
Cohesion: 0.36
Nodes (9): Implementation Steps, Completed Steps, heardSpeech(), rmsLevel(), MINUTES_PER_QUESTION, estimateMinutes(), formatLobbySummary(), formatQuestionCount() (+1 more)

### Community 107 - "app/layout.tsx"
Cohesion: 0.31
Nodes (7): src_app_globals, metadata, RootLayout(), viewport, TooltipProvider(), inter, roboto_slab

### Community 108 - "Learn: Showing a slow, stored AI result (the interview feedback screen)"
Cohesion: 0.25
Nodes (7): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen)

### Community 109 - "FeedbackStateMessage.tsx"
Cohesion: 0.13
Nodes (24): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), InterviewNotFoundCardProps (+16 more)

### Community 110 - "RoleSidebar.tsx"
Cohesion: 0.36
Nodes (6): Role, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 111 - "auth.routes.test.ts"
Cohesion: 0.18
Nodes (8): CREDENTIALS, get, post, PROFILE, ok(), cookieJar, nextHeadersMock, StoredCookie

### Community 112 - "interviewsService"
Cohesion: 0.32
Nodes (4): interviewsService, Interview, JobImport, StartInterviewRequest

### Community 113 - "signin/page.tsx"
Cohesion: 0.53
Nodes (4): SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps

### Community 115 - "session-redirect.ts"
Cohesion: 0.16
Nodes (12): Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), Part B: Robustness, useWarnBeforeUnload(), isSessionErrorCode(), API, decodeBlobBody(), rejectApiError(), redirectIfSessionEnded() (+4 more)

## Knowledge Gaps
- **715 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+710 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 850 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `RoomControls.tsx`, `field.tsx`, `FeedbackResult.tsx`, `use-interview-voice.ts`, `SelectField.tsx`, `use-audio-recorder.ts`, `InterviewLobby.tsx`, `Button`, `avatar.tsx`, `interviews.queries.ts`, `ActiveInterview.tsx`, `transcript.utils.ts`, `HistoryContainer.tsx`, `Skeleton`, `Implementation Plan: Interview Room Polish`, `interviews/constants.ts`, `use-interview-turn.ts`, `InterviewsContainer`, `vitest`, `InterviewTitleBar.tsx`, `DataTable`, `FeedbackQuestionAccordion.tsx`, `Completed Steps`, `sidebar.tsx`, `transcript.utils.test.ts`, `ResumeContainer.tsx`, `use-job-description-import.ts`, `interview-history-columns.tsx`, `breadcrumb.tsx`, `lucide-react`, `RadioGroupField.tsx`, `requireUser`, `getQueryClient`, `lib/media.ts`, `next`, `FeedbackStateMessage.tsx`, `signin/page.tsx`, `session-redirect.ts`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `field.tsx`, `auth-session.ts`, `Part A: Chat core`, `use-interview-voice.ts`, `Implementation Steps`, `auth.types.ts`, `.transcribe`, `GET`, `Button`, `interviews.queries.ts`, `transcript.utils.ts`, `Implementation Plan: Voice Answers`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `Implementation Steps`, `Implementation Plan: Interview Feedback Screen (frontend)`, `InterviewsContainer`, `AuthForm`, `pickThinkingLabel`, `apiClient`, `api.helper.ts`, `ResumeContainer.tsx`, `Implementation Plan: Job description import (link and smart paste)`, `Implementation Steps`, `requireUser`, `getQueryClient`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `FeedbackStateMessage.tsx`, `RoleSidebar.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `RoomControls.tsx`, `field.tsx`, `Part A: Chat core`, `FeedbackResult.tsx`, `Implementation Steps`, `SelectField.tsx`, `auth.types.ts`, `InterviewLobby.tsx`, `ActiveInterview.tsx`, `HistoryContainer.tsx`, `interviews/constants.ts`, `InterviewsContainer`, `AuthForm`, `InterviewTitleBar.tsx`, `status`, `Completed Steps`, `sidebar.tsx`, `ResumeContainer.tsx`, `interview-history-columns.tsx`, `react`, `Implementation Steps`, `lucide-react`, `Implementation Steps`, `FeedbackStateMessage.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 45 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 53 inferred relationships involving `Completed Steps` (e.g. with `ActiveInterview()` and `FinishedInterview()`) actually correct?**
  _`Completed Steps` has 53 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _715 weakly-connected nodes found - possible documentation gaps or missing edges._