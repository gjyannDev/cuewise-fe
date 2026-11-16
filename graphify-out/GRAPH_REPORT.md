# Graph Report - cuewise-fe  (2026-11-16)

## Corpus Check
- 269 files · ~194,280 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 2045 nodes · 5536 edges · 105 communities (104 shown, 1 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 1004 edges (avg confidence: 0.95)
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
- isNoResponseError
- FeedbackResult.tsx
- parseApiError
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
- RoleSidebar.tsx
- history.utils.ts
- Implementation: Interview Room (frontend)
- [...path]/route.ts
- Implementation: Interview Follow-up Questions (client support)
- interviews/page.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- feedback.utils.ts
- Implementation: Résumé profile and résumé-aware interviews
- ActiveInterview.tsx
- Completed Steps
- next
- HistoryContainer.tsx
- InterviewConfigForm.tsx
- interviews.services.test.ts
- SidebarUserCard.tsx
- Implementation Plan: Voice Answers
- error
- interviews/constants.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- Implementation Steps
- Implementation Plan: Interview Feedback Screen (frontend)
- Implementation: Voice Answers
- use-interview-turn.ts
- Feature: Interview Feedback Screen (frontend)
- interviews.queries.ts
- AuthFormContainer.tsx
- InterviewTitleBar.tsx
- use-audio-player.test.tsx
- Implementation: Auth Session (cookie-based BFF)
- Feature: Interviews Setup UI (foundation)
- stream.utils.ts
- Feature: Job description import (link and smart paste)
- apiClient
- status
- done
- FeedbackStateMessage.tsx
- vitest
- Implementation Plan: Interview Room (frontend)
- InterviewRoom.tsx
- api.helper.ts
- sidebar.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- transcript.utils.test.ts
- Implementation: Job description import (link and smart paste)
- Learn: The interview room, frontend (voice-first, transcript-style)
- requireUser
- profile.queries.ts
- useJobDescriptionImport
- DataTablePagination.tsx
- ResumeContainer
- breadcrumb.tsx
- interview-history-columns.tsx
- Implementation Plan: Interview History Page (frontend)
- Implementation Plan: Résumé profile and résumé-aware interviews
- shimmer.tsx
- scripts
- eslint.config.mjs
- Implementation Plan: Job description import (link and smart paste)
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- Learn: Job description import in the setup form
- RadioGroupField.tsx
- Implementation Plan: App Sidebar (shared shell for user and admin)
- getQueryClient
- Implementation Plan: Interviews Setup UI (foundation)
- InterviewsContainer
- Requirements
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)

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
- `7. What surprised me` --references--> `Avatar()`  [INFERRED]
  docs/features/interview-room/learnings.md → src/components/ui/avatar.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (105 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, happy-dom, next-themes, react-dom, shadcn, sonner (+9 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.18
Nodes (21): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+13 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Edge Cases, Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d), Functional, Goal, Non-Functional, Out of Scope, Problem (+3 more)

### Community 5 - "app/layout.tsx"
Cohesion: 0.19
Nodes (11): src_app_globals, metadata, RootLayout(), viewport, Providers(), ProvidersProps, inter, roboto_slab (+3 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+14 more)

### Community 7 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+7 more)

### Community 8 - "field.tsx"
Cohesion: 0.09
Nodes (42): Forms, Known Issues, Implementation Steps, Skills Consulted, Project Conventions, Architecture & Design, Skills Consulted During Implementation, @hookform/resolvers (+34 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.14
Nodes (26): Project Conventions, TooltipProvider(), ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired() (+18 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "isNoResponseError"
Cohesion: 0.11
Nodes (35): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part A: Chat core, Part B: Robustness (+27 more)

### Community 13 - "FeedbackResult.tsx"
Cohesion: 0.10
Nodes (30): Architecture & Design, class-variance-authority, cn, radix-ui, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger() (+22 more)

### Community 14 - "parseApiError"
Cohesion: 0.13
Nodes (26): 5. What can go wrong, Implementation Steps, Testing Strategy, Affected Files & Patterns, Changes Made (cuewise-fe, uncommitted), PlaybackEnd, useAudioPlayer(), parseApiError() (+18 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.26
Nodes (14): Implementation Steps, Acceptance Criteria, Functional, Project Conventions, Toaster(), authKeys, useCurrentProfileQuery(), useLogoutMutation() (+6 more)

### Community 16 - "SelectField.tsx"
Cohesion: 0.18
Nodes (19): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton(), SelectTrigger(), SelectValue() (+11 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.05
Nodes (55): ANSWER_MAX_LENGTH, DEFAULT_START_VALUES, FEEDBACK_STATUSES, HISTORY_PAGE_SIZES, HISTORY_SORT_COLUMNS, INTERVIEW_TYPES, JOB_PASTE_FORMATS, JOB_URL_MAX_LENGTH (+47 more)

### Community 18 - "Cuewise FE — Project Instructions"
Cohesion: 0.18
Nodes (10): AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth, Tooling (+2 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.11
Nodes (22): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied (+14 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "auth.types.ts"
Cohesion: 0.17
Nodes (13): zod, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, backendTokenSchema, currentProfileSchema, email, roleSchema (+5 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "use-audio-recorder.ts"
Cohesion: 0.17
Nodes (15): Affected Files & Patterns, AudioRecorderOptions, detectFormat(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd, useAudioRecorder() (+7 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (16): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interview Feedback Screen (frontend), Known Issues (+8 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "voice.services.ts"
Cohesion: 0.27
Nodes (8): SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, transcriptionResponseSchema, SPEECH_ROUTE, voiceService, Transcription, downloadBlob, post

### Community 27 - "GET"
Cohesion: 0.12
Nodes (17): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal, Non-Functional (+9 more)

### Community 28 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, happy-dom, tailwindcss, @tailwindcss/turbopack, @testing-library/react, @types/node (+4 more)

### Community 29 - "Feature: Interview Room (a voice interview, styled like a video call)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, API Contract (shared by both repos; the single source of truth), Blockers, Constraints, Decisions, Edge Cases, Feature: Interview Room (a voice interview, styled like a video call), Goal (+8 more)

### Community 30 - "Button"
Cohesion: 0.19
Nodes (24): Deviations from Plan, Project Rules Applied, Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription() (+16 more)

### Community 31 - "react"
Cohesion: 0.08
Nodes (24): Trade-offs & Rationale, lucide-react, react, use-stick-to-bottom, InterviewsContainerProps, SessionExpiredNotice(), SignInContent(), SignInPage() (+16 more)

### Community 32 - "Implementation: Interviews Chat Layout"
Cohesion: 0.07
Nodes (27): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Follow-up: chat-assistant styling (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links (+19 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "profile/constants.ts"
Cohesion: 0.13
Nodes (19): PROFILE_ERROR_CODES, RESUME_ACCEPT, RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES, RESUME_PAGE_COPY, RESUME_UPLOAD_FORWARD_TIMEOUT_MS, RESUME_UPLOAD_TIMEOUT_MS (+11 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 36 - "RoleSidebar.tsx"
Cohesion: 0.17
Nodes (15): Deviations During Implementation, Role, RoleHeaderTitle(), RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE (+7 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.21
Nodes (21): Testing Strategy, Implementation Steps, Testing Strategy, Changes Made, Deviations from Plan, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, InterviewHistoryTableOptions (+13 more)

### Community 38 - "Implementation: Interview Room (frontend)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Current Step, Debug Log, Done: ready for `/review-feature`, Implementation: Interview Room (frontend), Links, Open Questions (+7 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.10
Nodes (27): Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Trade-offs & Rationale, ref_server_only, forward(), ForwardContext, isStreaming(), isTextual(), OWNED_BY_NEXT (+19 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 41 - "interviews/page.tsx"
Cohesion: 0.53
Nodes (5): Affected Files & Patterns, InterviewsContent(), InterviewsPage(), InterviewsPageProps, parseSessionParam()

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+7 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "feedback.utils.ts"
Cohesion: 0.07
Nodes (33): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+25 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Done, Implementation: Résumé profile and résumé-aware interviews, Known Issues (+6 more)

### Community 46 - "ActiveInterview.tsx"
Cohesion: 0.14
Nodes (25): Skills Consulted During Implementation, Deviations from Plan, Implementation Steps, Completed Steps, Implementation Steps, Completed Steps, ActiveInterview(), ActiveInterviewProps (+17 more)

### Community 47 - "Completed Steps"
Cohesion: 0.09
Nodes (32): Architecture & Design, Rename map (done in Step 1, no behaviour change), Project Conventions, Completed Steps, Known Issues, Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Architecture & Design, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`) (+24 more)

### Community 48 - "next"
Cohesion: 0.25
Nodes (13): nextConfig, next, POST(), POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError() (+5 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.14
Nodes (18): Architecture & Design, HistoryContainer(), HistoryContainerProps, NO_ROWS, HistoryContent(), HistoryPage(), HistoryPageProps, InterviewHistorySkeleton() (+10 more)

### Community 50 - "InterviewConfigForm.tsx"
Cohesion: 0.11
Nodes (36): Implementation Steps, Layout & UX Design, Deviations from Plan, AuthCard(), AuthCardProps, COPY, SignUpContent(), SignUpPage() (+28 more)

### Community 51 - "interviews.services.test.ts"
Cohesion: 0.11
Nodes (13): SPEECH_FORWARD_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, interviewListItem(), encoder, openStream() (+5 more)

### Community 52 - "SidebarUserCard.tsx"
Cohesion: 0.47
Nodes (3): SidebarUserCardProps, SidebarUser, getInitials()

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.14
Nodes (13): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+5 more)

### Community 54 - "error"
Cohesion: 0.14
Nodes (15): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Answer Streaming (client support for the backend's SSE turn), Functional, Goal, Non-Functional (+7 more)

### Community 55 - "interviews/constants.ts"
Cohesion: 0.07
Nodes (34): FEEDBACK_DISCLAIMER, FEEDBACK_GENERATING_LABEL, FEEDBACK_LEAVE_HINT, FEEDBACK_PAGE_TITLE, FEEDBACK_SLOW_AFTER_MS, FEEDBACK_SLOW_LABEL, FEEDBACK_START_PARAM, INTERVIEW_NOT_FOUND_DESCRIPTION (+26 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Out of Scope (+3 more)

### Community 57 - "Implementation Steps"
Cohesion: 0.26
Nodes (10): Architecture & Design, Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), RoleSidebar(), AppShellSkeleton() (+2 more)

### Community 58 - "Implementation Plan: Interview Feedback Screen (frontend)"
Cohesion: 0.22
Nodes (8): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, recover()

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.12
Nodes (16): 15. Manual end-to-end run (user), Baseline Failures, Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues, Links (+8 more)

### Community 60 - "use-interview-turn.ts"
Cohesion: 0.10
Nodes (45): 4. How it works, Phase 2: Frontend (cuewise-fe), Acceptance Criteria Traceability, Skills Consulted During Implementation, rejectApiError(), EMPTY_RECORDING_MESSAGE, MIC_REQUIRED_MESSAGE, RECORDING_LIMIT_MESSAGE (+37 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "interviews.queries.ts"
Cohesion: 0.14
Nodes (17): ANSWER_TIMEOUT_MS, FEEDBACK_POLL_MS, FEEDBACK_TIMEOUT_MS, START_TIMEOUT_MS, interviewKeys, AnswerStreamOptions, jobImportResponseSchema, interviewsService (+9 more)

### Community 63 - "AuthFormContainer.tsx"
Cohesion: 0.12
Nodes (23): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied (+15 more)

### Community 64 - "InterviewTitleBar.tsx"
Cohesion: 0.15
Nodes (11): Layout & UX Design, Follow-up: conversation title with a menu (after review), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger() (+3 more)

### Community 65 - "use-audio-player.test.tsx"
Cohesion: 0.22
Nodes (10): Testing, @testing-library/react, activityWrapper(), domError(), fakeStream(), fakeTrack, installMediaFakes(), MediaFakes (+2 more)

### Community 66 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 67 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 68 - "stream.utils.ts"
Cohesion: 0.13
Nodes (12): Step 2: The SSE parser (`src/lib/api/sse.ts`), readSseStream(), SseFrame, AnswerStreamEventName, ANSWER_STREAM_START, AnswerStreamState, isKnown(), ParsedStreamEvent (+4 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+6 more)

### Community 70 - "apiClient"
Cohesion: 0.24
Nodes (5): Architecture: Modular, Feature-Driven, Phase 2: Frontend (cuewise-fe), apiClient, AnswerErrorResult, cancel()

### Community 71 - "status"
Cohesion: 0.14
Nodes (26): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+18 more)

### Community 72 - "done"
Cohesion: 0.11
Nodes (31): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+23 more)

### Community 73 - "FeedbackStateMessage.tsx"
Cohesion: 0.16
Nodes (21): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), FeedbackGenerating() (+13 more)

### Community 74 - "vitest"
Cohesion: 0.12
Nodes (21): ref_node_url, vitest, GENERIC_ERROR_MESSAGE, CREDENTIALS, get, post, PROFILE, axiosErrorWith() (+13 more)

### Community 75 - "Implementation Plan: Interview Room (frontend)"
Cohesion: 0.22
Nodes (10): Approaches Considered, Blockers & Resolutions, Implementation Plan: Interview Room (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 76 - "InterviewRoom.tsx"
Cohesion: 0.13
Nodes (16): Avatar(), AvatarFallback(), Drawer(), DrawerContent(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle() (+8 more)

### Community 77 - "api.helper.ts"
Cohesion: 0.10
Nodes (17): Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), axios, ApiError, conflictDetailsSchema, isSessionErrorCode(), NormalizedError, normalizeError(), responseOf() (+9 more)

### Community 78 - "sidebar.tsx"
Cohesion: 0.10
Nodes (17): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+9 more)

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.14
Nodes (11): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+3 more)

### Community 80 - "transcript.utils.test.ts"
Cohesion: 0.07
Nodes (34): Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, InterviewQuestion, SpeechOutcome, reduceAnswerStream(), answerResponse(), emptyFeedback() (+26 more)

### Community 81 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Implementation: Job description import (link and smart paste), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 82 - "Learn: The interview room, frontend (voice-first, transcript-style)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is (so far), 3. When to use it, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: The interview room, frontend (voice-first, transcript-style)

### Community 83 - "requireUser"
Cohesion: 0.24
Nodes (10): About the Project, Project Rules Applied, Project Conventions, Constraints, AdminHome(), AdminHomeContent(), Home(), HomeContent() (+2 more)

### Community 84 - "profile.queries.ts"
Cohesion: 0.30
Nodes (10): 4. How it works, Implementation Steps, Review, handleUpload(), profileKeys, useDeleteProfileMutation(), useMarkProfileMissing(), useProfileQuery() (+2 more)

### Community 85 - "useJobDescriptionImport"
Cohesion: 0.44
Nodes (11): 4. How it works, 5. What can go wrong, useJobDescriptionImport(), apply(), fail(), handlePaste(), importFromLink(), requestFocus() (+3 more)

### Community 86 - "DataTablePagination.tsx"
Cohesion: 0.48
Nodes (4): @tanstack/react-table, DataTableFeatures, DataTableColumnHeaderProps, DataTablePaginationProps

### Community 87 - "ResumeContainer"
Cohesion: 0.26
Nodes (8): ResumeContainer(), ResumeContent(), ResumePage(), SidebarMenuSkeleton(), Skeleton(), ROWS, HISTORY_PAGE_SIZE, RESUME_ROUTE

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 89 - "interview-history-columns.tsx"
Cohesion: 0.23
Nodes (12): column, interviewHistoryColumns, RowAction(), STATUS_VARIANTS, FOLLOW_UP_CAPTION, LEVEL_LABELS, SESSION_STATUS_LABELS, formatClock() (+4 more)

### Community 90 - "Implementation Plan: Interview History Page (frontend)"
Cohesion: 0.20
Nodes (8): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Trade-offs & Rationale

### Community 91 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.14
Nodes (13): Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+5 more)

### Community 92 - "shimmer.tsx"
Cohesion: 0.40
Nodes (3): motion, MOTION_ELEMENTS, TextShimmerProps

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 94 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 95 - "Implementation Plan: Job description import (link and smart paste)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+2 more)

### Community 96 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.17
Nodes (11): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+3 more)

### Community 97 - "Learn: Job description import in the setup form"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Job description import in the setup form

### Community 98 - "RadioGroupField.tsx"
Cohesion: 0.33
Nodes (7): RadioGroup(), RadioGroupItem(), LAYOUT, OPTION, RadioGroupField(), RadioGroupFieldProps, RadioOption

### Community 99 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.18
Nodes (10): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 100 - "getQueryClient"
Cohesion: 0.32
Nodes (7): Data Fetching (TanStack Query), Affected Files & Patterns, Project Rules Applied, @tanstack/react-query, getQueryClient(), makeQueryClient(), shouldRetry()

### Community 101 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.22
Nodes (8): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy, Trade-offs & Rationale

### Community 102 - "InterviewsContainer"
Cohesion: 0.43
Nodes (7): Completed Steps, InterviewsContainer(), handleStart(), useImportJobTextMutation(), useImportJobUrlMutation(), useStartInterviewMutation(), getStartErrorResult()

### Community 103 - "Requirements"
Cohesion: 0.40
Nodes (5): Non-Functional, Phase 0: Spike (before Phase 2 starts), Phase 1: Backend (cuewise-be), Phase 2: Frontend (cuewise-fe), Requirements

### Community 105 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

## Knowledge Gaps
- **669 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+664 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 791 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `field.tsx`, `auth-session.ts`, `isNoResponseError`, `parseApiError`, `Implementation Steps`, `use-audio-recorder.ts`, `GET`, `Button`, `react`, `RoleSidebar.tsx`, `feedback.utils.ts`, `ActiveInterview.tsx`, `Completed Steps`, `InterviewConfigForm.tsx`, `Implementation Plan: Voice Answers`, `Implementation Steps`, `AuthFormContainer.tsx`, `Feature: Interviews Setup UI (foundation)`, `apiClient`, `done`, `FeedbackStateMessage.tsx`, `Implementation: Job description import (link and smart paste)`, `requireUser`, `profile.queries.ts`, `ResumeContainer`, `Implementation Plan: Job description import (link and smart paste)`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `getQueryClient`, `InterviewsContainer`, `Requirements`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `app/layout.tsx`, `field.tsx`, `isNoResponseError`, `FeedbackResult.tsx`, `parseApiError`, `SelectField.tsx`, `use-audio-recorder.ts`, `Button`, `history.utils.ts`, `[...path]/route.ts`, `interviews/page.tsx`, `Implementation: App Sidebar (shared shell for user and admin)`, `feedback.utils.ts`, `ActiveInterview.tsx`, `Completed Steps`, `HistoryContainer.tsx`, `InterviewConfigForm.tsx`, `interviews/constants.ts`, `Implementation Steps`, `use-interview-turn.ts`, `interviews.queries.ts`, `InterviewTitleBar.tsx`, `use-audio-player.test.tsx`, `status`, `FeedbackStateMessage.tsx`, `InterviewRoom.tsx`, `sidebar.tsx`, `requireUser`, `DataTablePagination.tsx`, `ResumeContainer`, `breadcrumb.tsx`, `shimmer.tsx`, `RadioGroupField.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `package.json`, `auth-session.ts`, `parseApiError`, `interviews.types.ts`, `auth.types.ts`, `use-audio-recorder.ts`, `voice.services.ts`, `profile/constants.ts`, `RoleSidebar.tsx`, `history.utils.ts`, `[...path]/route.ts`, `interviews.services.test.ts`, `SidebarUserCard.tsx`, `Implementation Steps`, `use-interview-turn.ts`, `use-audio-player.test.tsx`, `stream.utils.ts`, `api.helper.ts`, `transcript.utils.test.ts`, `interview-history-columns.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 45 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 53 inferred relationships involving `Completed Steps` (e.g. with `ActiveInterview()` and `FinishedInterview()`) actually correct?**
  _`Completed Steps` has 53 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `InterviewsContainer()` (e.g. with `Affected Files & Patterns` and `Architecture & Design`) actually correct?**
  _`InterviewsContainer()` has 23 INFERRED edges - model-reasoned connections that need verification._