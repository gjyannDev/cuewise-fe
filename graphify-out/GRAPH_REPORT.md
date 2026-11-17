# Graph Report - cuewise-fe  (2026-11-17)

## Corpus Check
- 303 files · ~223,615 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 2293 nodes · 6331 edges · 109 communities (108 shown, 1 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 1144 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `17b5d522`
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
- TextAreaField
- auth-session.ts
- README.md
- AGENTS.md
- Part A: Chat core
- AuthCard
- use-interview-voice.ts
- Implementation Steps
- SelectField.tsx
- interviews.types.ts
- Cuewise FE — Project Instructions
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- auth.types.ts
- Implementation: Interviews Setup UI (foundation)
- react
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- error
- GET
- devDependencies
- Feature: Interview Room (a voice interview, styled like a video call)
- Implementation: Dashboard Overview (Tier 1)
- ResumeProfileView.tsx
- Implementation: Interviews Chat Layout
- Feature: Interview Follow-up Questions (client support)
- ResumeContainer.tsx
- status
- sidebar.types.ts
- history.utils.ts
- Implementation: Interview Room (frontend)
- [...path]/route.ts
- Implementation: Interview Follow-up Questions (client support)
- avatar.tsx
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- feedback.utils.ts
- Implementation: Résumé profile and résumé-aware interviews
- apiClient
- transcript.utils.test.ts
- next
- InterviewMessageCard
- DashboardContainer
- [...path]/route.test.ts
- InterviewLobby.tsx
- Implementation Plan: Voice Answers
- done
- interviews/constants.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- Implementation Steps
- interviews/page.tsx
- Implementation: Voice Answers
- Completed Steps
- Feature: Interview Feedback Screen (frontend)
- lib/media.ts
- parseApiError
- Implementation Plan: Interview Follow-up Questions (client support)
- use-audio-recorder.test.tsx
- Implementation: Auth Session (cookie-based BFF)
- InterviewTitleBar.tsx
- profile/constants.ts
- Feature: Job description import (link and smart paste)
- InterviewRoom.test.tsx
- DataTable
- format.utils.ts
- FeedbackResult.tsx
- session-redirect.test.ts
- Implementation Plan: Interview Room (frontend)
- InterviewRoom.tsx
- auth.routes.test.ts
- sidebar.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- interviews.ts
- eslint.config.mjs
- Learn: The interview room, frontend (voice-first, transcript-style)
- Implementation: Interview Room Polish
- resume/page.tsx
- voice.services.ts
- Button
- Feature: Interview Room Polish (make the room feel like a video call)
- breadcrumb.tsx
- ActiveInterview.tsx
- Implementation Plan: Interview History Page (frontend)
- Implementation: Job description import (link and smart paste)
- TranscriptPanel.tsx
- scripts
- Feature: Interviews Setup UI (foundation)
- Implementation Plan: Job description import (link and smart paste)
- profile.queries.ts
- InterviewsContainer
- cn
- requireUser
- Implementation Plan: Interviews Setup UI (foundation)
- Feature: Dashboard Overview (Tier 1)
- Implementation Plan: Résumé profile and résumé-aware interviews
- lucide-react
- LoadingOverlay.tsx
- DataTableColumnHeader.tsx
- FeedbackStateMessage.tsx
- InterviewsContainer.tsx
- vitest

## God Nodes (most connected - your core abstractions)
1. `react` - 95 edges
2. `Button()` - 72 edges
3. `useMutationCallbacks()` - 62 edges
4. `Completed Steps` - 54 edges
5. `vitest` - 51 edges
6. `InterviewsContainer()` - 45 edges
7. `lucide-react` - 42 edges
8. `parseApiError()` - 41 edges
9. `requireUser()` - 41 edges
10. `Implementation Steps` - 37 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Blockers & Resolutions` --references--> `InterviewsContainer()`  [INFERRED]
  docs/features/interview-history/plan-v1.md → src/app/(app)/interviews/_components/InterviewsContainer.tsx
- `UX Requirements` --references--> `Progress()`  [INFERRED]
  docs/features/dashboard-overview/spec.md → src/components/ui/progress.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (109 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, happy-dom, @hookform/resolvers, react-dom, shadcn, tailwindcss (+7 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.18
Nodes (20): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.12
Nodes (16): Overview, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d), Functional, Goal (+8 more)

### Community 5 - "RoomControls.tsx"
Cohesion: 0.14
Nodes (19): Skills Consulted, Kbd(), KbdGroup(), Popover(), PopoverContent(), PopoverTitle(), PopoverTrigger(), Tooltip() (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+14 more)

### Community 7 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation, Status (+6 more)

### Community 8 - "TextAreaField"
Cohesion: 0.13
Nodes (27): Forms, Known Issues, Skills Consulted, Project Conventions, Skills Consulted During Implementation, react-hook-form, Checkbox(), FieldDescription() (+19 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): Project Conventions, ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder() (+17 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Part A: Chat core"
Cohesion: 0.10
Nodes (39): Testing Strategy, Affected Files & Patterns, Deviations from Plan, Completed Steps, Affected Files & Patterns, Skills Consulted, Affected Files & Patterns, Architecture & Design (+31 more)

### Community 13 - "AuthCard"
Cohesion: 0.29
Nodes (9): Layout & UX Design, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage() (+1 more)

### Community 14 - "use-interview-voice.ts"
Cohesion: 0.20
Nodes (14): Changes Made (cuewise-fe, uncommitted), PlaybackEnd, useAudioPlayer(), clipKey(), useInterviewVoice(), TranscribeVariables, useSpeechClip(), useTranscribeAnswerMutation() (+6 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.09
Nodes (34): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview, Project Rules Applied (+26 more)

### Community 16 - "SelectField.tsx"
Cohesion: 0.21
Nodes (18): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton(), SelectTrigger(), SelectValue() (+10 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.07
Nodes (46): FEEDBACK_CRITERIA, HISTORY_SORT_COLUMNS, ROLES, SESSION_STATUSES, SORT_DIRECTIONS, interviewKeys, AnswerStreamOptions, answerRequestSchema (+38 more)

### Community 18 - "Cuewise FE — Project Instructions"
Cohesion: 0.12
Nodes (15): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth (+7 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.10
Nodes (22): Data Fetching (TanStack Query), Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied (+14 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "auth.types.ts"
Cohesion: 0.09
Nodes (28): Deviations During Implementation, AuthedShellProps, AuthFormProps, FORM_FIELDS, SUBMIT_LABELS, authCredentialsSchema, authFormSchemas, authSearchParamsSchema (+20 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "react"
Cohesion: 0.17
Nodes (8): motion, react, MOTION_ELEMENTS, TextShimmerProps, Textarea(), src_lib_utils_cn, CameraTileProps, TextAreaFieldProps

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "error"
Cohesion: 0.08
Nodes (24): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+16 more)

### Community 27 - "GET"
Cohesion: 0.12
Nodes (18): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+10 more)

### Community 28 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, happy-dom, tailwindcss, @tailwindcss/turbopack, @testing-library/react, @types/node (+4 more)

### Community 29 - "Feature: Interview Room (a voice interview, styled like a video call)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, API Contract (shared by both repos; the single source of truth), Blockers, Constraints, Decisions, Edge Cases, Feature: Interview Room (a voice interview, styled like a video call), Goal (+8 more)

### Community 30 - "Implementation: Dashboard Overview (Tier 1)"
Cohesion: 0.11
Nodes (17): 6. Container tests and final checks, Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Deviations from Plan, Implementation: Dashboard Overview (Tier 1) (+9 more)

### Community 31 - "ResumeProfileView.tsx"
Cohesion: 0.39
Nodes (12): Dialog(), DialogClose(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle(), DialogTrigger(), EndInterviewDialog() (+4 more)

### Community 32 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (16): Baseline Failures, Changes Made, Current Step, Follow-up: chat-assistant styling (after review), Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Known Issues (+8 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "ResumeContainer.tsx"
Cohesion: 0.20
Nodes (18): 4. How it works, Approaches Considered, Implementation Steps, ResumeContainer(), handleUpload(), Alert(), AlertDescription(), AlertTitle() (+10 more)

### Community 35 - "status"
Cohesion: 0.11
Nodes (18): Affected Files & Patterns, Blockers & Resolutions, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional (+10 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.27
Nodes (7): AppHeaderTitleProps, NavItem, SidebarConfig, findActiveNavItem(), isActivePath(), trimTrailingSlash(), config

### Community 37 - "history.utils.ts"
Cohesion: 0.23
Nodes (20): Implementation Steps, Testing Strategy, Implementation Steps, Testing Strategy, Changes Made, HISTORY_DEFAULT_PARAMS, HISTORY_ROUTE, InterviewHistoryTableOptions (+12 more)

### Community 38 - "Implementation: Interview Room (frontend)"
Cohesion: 0.10
Nodes (20): Baseline Failures, Changes Made, Check results, Current Step, Debug Log, Deviations from Plan, Done: ready for `/review-feature`, Findings (+12 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.12
Nodes (19): Trade-offs & Rationale, zod, POST(), forward(), ForwardContext, isTextual(), OWNED_BY_NEXT, parseJsonOrNull() (+11 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 41 - "avatar.tsx"
Cohesion: 0.23
Nodes (6): 7. What surprised me, Avatar(), AvatarFallback(), SidebarUserCard(), SidebarUserCardProps, SidebarUser

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "feedback.utils.ts"
Cohesion: 0.07
Nodes (36): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+28 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Deviations from Plan, Done, Implementation: Résumé profile and résumé-aware interviews (+7 more)

### Community 46 - "apiClient"
Cohesion: 0.10
Nodes (12): Step 2: The SSE parser (`src/lib/api/sse.ts`), Phase 2: Frontend (cuewise-fe), apiClient, readSseStream(), SseFrame, AnswerErrorResult, TranscribeErrorResult, cancel() (+4 more)

### Community 47 - "transcript.utils.test.ts"
Cohesion: 0.07
Nodes (36): Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), Implementation Steps, INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn() (+28 more)

### Community 48 - "next"
Cohesion: 0.16
Nodes (22): nextConfig, next, ref_server_only, POST(), POST(), getSessionUser(), ApiErrorBody, apiErrorBodySchema (+14 more)

### Community 49 - "InterviewMessageCard"
Cohesion: 0.09
Nodes (28): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Dashboard Overview (Tier 1), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+20 more)

### Community 50 - "DashboardContainer"
Cohesion: 0.16
Nodes (23): 4. How it works, Approaches Considered, Architecture & Design, Implementation Steps, Project Conventions, Architecture & Design, DashboardContainer(), DashboardFallback() (+15 more)

### Community 51 - "[...path]/route.test.ts"
Cohesion: 0.14
Nodes (10): ANSWER_TIMEOUT_MS, SPEECH_FORWARD_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, encoder, openStream() (+2 more)

### Community 52 - "InterviewLobby.tsx"
Cohesion: 0.07
Nodes (34): 3. When to use it, 8. Check your understanding, Affected Files & Patterns, Approaches Considered, Architecture & Design, Blockers & Resolutions, Deviations During Implementation, Implementation Plan: Interview Room Polish (+26 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.14
Nodes (13): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be) (+5 more)

### Community 54 - "done"
Cohesion: 0.08
Nodes (42): Architecture: Modular, Feature-Driven, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+34 more)

### Community 55 - "interviews/constants.ts"
Cohesion: 0.04
Nodes (67): HistoryContainerProps, NO_ROWS, InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, ANSWER_MAX_LENGTH, DASHBOARD_SAMPLE_SIZE (+59 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "Implementation Steps"
Cohesion: 0.42
Nodes (7): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), AppLayout(), RoleSidebar(), AppShellSkeleton()

### Community 58 - "interviews/page.tsx"
Cohesion: 0.39
Nodes (6): Affected Files & Patterns, InterviewsContent(), InterviewsPage(), InterviewsPageProps, parseSessionParam(), getInitials()

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "Completed Steps"
Cohesion: 0.09
Nodes (56): 4. How it works, 5. What can go wrong, Implementation Steps, Testing Strategy, Phase 2: Frontend (cuewise-fe), Acceptance Criteria Traceability, Completed Steps, Skills Consulted During Implementation (+48 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "lib/media.ts"
Cohesion: 0.09
Nodes (36): Affected Files & Patterns, 1. Why it exists, 2. What it is, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 9. Go deeper / Still open (+28 more)

### Community 63 - "parseApiError"
Cohesion: 0.22
Nodes (15): Deviations recorded during /implement, Completed Steps, Affected Files & Patterns, AuthFormContainer(), handleSubmit(), AuthFormContainerProps, ERROR_TITLES, parseApiError() (+7 more)

### Community 64 - "Implementation Plan: Interview Follow-up Questions (client support)"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 65 - "use-audio-recorder.test.tsx"
Cohesion: 0.22
Nodes (10): AudioLevelFake, domError(), fakeMediaRecorder(), fakeStream(), fakeTrack, installAudioLevelFake(), installMediaFakes(), MediaFakes (+2 more)

### Community 66 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 67 - "InterviewTitleBar.tsx"
Cohesion: 0.15
Nodes (12): Layout & UX Design, Deviations from Plan, Skills Consulted, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator() (+4 more)

### Community 68 - "profile/constants.ts"
Cohesion: 0.16
Nodes (15): PROFILE_ERROR_CODES, RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES, RESUME_PAGE_COPY, RESUME_PROFILE_COPY, RESUME_UPLOAD_TIMEOUT_MS, profileSchema (+7 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+6 more)

### Community 70 - "InterviewRoom.test.tsx"
Cohesion: 0.12
Nodes (15): Affected Files & Patterns, Implementation Steps, Implementation Steps, SILENCE_HINT, useInterviewQuery(), useStartInterviewMutation(), AnswerResponse, InterviewQuestion (+7 more)

### Community 71 - "DataTable"
Cohesion: 0.16
Nodes (20): Architecture & Design, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Requirements -> Implementation, Skills Consulted, Trade-offs & Rationale (+12 more)

### Community 72 - "format.utils.ts"
Cohesion: 0.20
Nodes (14): column, interviewHistoryColumns, RowAction(), FOLLOW_UP_CAPTION, INTERVIEW_TYPE_LABELS, LEVEL_LABELS, MINUTES_PER_QUESTION, ROLE_LABELS (+6 more)

### Community 73 - "FeedbackResult.tsx"
Cohesion: 0.13
Nodes (25): Architecture & Design, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), Progress(), CriterionScore() (+17 more)

### Community 74 - "session-redirect.test.ts"
Cohesion: 0.40
Nodes (3): assign, bypass, clear

### Community 75 - "Implementation Plan: Interview Room (frontend)"
Cohesion: 0.22
Nodes (10): Approaches Considered, Blockers & Resolutions, Implementation Plan: Interview Room (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 76 - "InterviewRoom.tsx"
Cohesion: 0.19
Nodes (13): vaul, Drawer(), DrawerContent(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle(), CameraTile() (+5 more)

### Community 77 - "auth.routes.test.ts"
Cohesion: 0.21
Nodes (12): Affected Files & Patterns, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody(), networkError() (+4 more)

### Community 78 - "sidebar.tsx"
Cohesion: 0.10
Nodes (22): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+14 more)

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.14
Nodes (11): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+3 more)

### Community 80 - "interviews.ts"
Cohesion: 0.12
Nodes (19): FEEDBACK_TIMEOUT_MS, START_TIMEOUT_MS, abandoned, completed, feedbackRefetch, inProgress, Overview, emptyFeedback() (+11 more)

### Community 81 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 82 - "Learn: The interview room, frontend (voice-first, transcript-style)"
Cohesion: 0.25
Nodes (7): 1. Why it exists, 2. What it is (so far), 3. When to use it, 6. Try it yourself, 8. Check your understanding, 9. Go deeper / Still open, Learn: The interview room, frontend (voice-first, transcript-style)

### Community 83 - "Implementation: Interview Room Polish"
Cohesion: 0.13
Nodes (14): Baseline Failures, Browser Audit (2026-11-16, Chrome, desktop 1736 px and a 360 px iframe), Changes Made, Debug Log, Implementation: Interview Room Polish, Known Issues, Links, Open Questions (+6 more)

### Community 84 - "resume/page.tsx"
Cohesion: 0.67
Nodes (3): ResumeContent(), ResumePage(), RESUME_ROUTE

### Community 85 - "voice.services.ts"
Cohesion: 0.17
Nodes (9): axios, API, decodeBlobBody(), SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, SPEECH_ROUTE, redirectIfSessionEnded, downloadBlob (+1 more)

### Community 86 - "Button"
Cohesion: 0.19
Nodes (34): AuthCardProps, COPY, Button(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+26 more)

### Community 87 - "Feature: Interview Room Polish (make the room feel like a video call)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions (from the spec grilling), Edge Cases, Feature: Interview Room Polish (make the room feel like a video call), Functional, Goal (+7 more)

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 89 - "ActiveInterview.tsx"
Cohesion: 0.31
Nodes (12): Skills Consulted During Implementation, Architecture & Design, ActiveInterview(), ActiveInterviewProps, FinishedInterview(), LiveInterview(), retryNotice(), useCamera() (+4 more)

### Community 90 - "Implementation Plan: Interview History Page (frontend)"
Cohesion: 0.20
Nodes (8): Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Trade-offs & Rationale

### Community 91 - "Implementation: Job description import (link and smart paste)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Implementation: Job description import (link and smart paste), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 92 - "TranscriptPanel.tsx"
Cohesion: 0.20
Nodes (13): Rename map (done in Step 1, no behaviour change), Project Conventions, Known Issues, use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps (+5 more)

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 94 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 95 - "Implementation Plan: Job description import (link and smart paste)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+2 more)

### Community 96 - "profile.queries.ts"
Cohesion: 0.27
Nodes (6): RESUME_UPLOAD_UNCONFIRMED_MESSAGE, profileKeys, Profile, ProfileProject, ProfileRole, ResumeUploadErrorResult

### Community 97 - "InterviewsContainer"
Cohesion: 0.10
Nodes (36): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+28 more)

### Community 98 - "cn"
Cohesion: 0.12
Nodes (21): Architecture & Design, class-variance-authority, cn, radix-ui, badgeVariants, Field(), FieldSeparator(), FieldTitle() (+13 more)

### Community 99 - "requireUser"
Cohesion: 0.16
Nodes (14): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+6 more)

### Community 100 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.08
Nodes (26): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+18 more)

### Community 101 - "Feature: Dashboard Overview (Tier 1)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Dashboard Overview (Tier 1), Functional, Goal, Non-Functional (+5 more)

### Community 102 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.20
Nodes (9): Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 103 - "lucide-react"
Cohesion: 0.24
Nodes (6): lucide-react, buttonVariants, InterviewerAvatarProps, InterviewClosingCardProps, VARIANTS, TranscriptEntryProps

### Community 104 - "LoadingOverlay.tsx"
Cohesion: 0.42
Nodes (7): Deviations from Plan, DialogContent(), DialogOverlay(), DialogPortal(), Spinner(), LoadingOverlay(), LoadingOverlayProps

### Community 105 - "DataTableColumnHeader.tsx"
Cohesion: 0.47
Nodes (4): Deviations from Plan, @tanstack/react-table, DataTableFeatures, DataTableColumnHeaderProps

### Community 109 - "FeedbackStateMessage.tsx"
Cohesion: 0.12
Nodes (26): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewMessageCardProps, InterviewNotFoundCard() (+18 more)

### Community 112 - "InterviewsContainer.tsx"
Cohesion: 0.08
Nodes (29): Part B: Robustness, Review, handleStart(), InterviewsContainerProps, ApiError, conflictDetailsSchema, isNoResponseError(), isSessionErrorCode() (+21 more)

### Community 115 - "vitest"
Cohesion: 0.14
Nodes (11): ref_node_url, @testing-library/react, vitest, useEndedSession(), activityWrapper(), Q1, CLIP, deferred() (+3 more)

## Knowledge Gaps
- **760 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+755 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 899 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `RoomControls.tsx`, `TextAreaField`, `AuthCard`, `use-interview-voice.ts`, `SelectField.tsx`, `interviews.types.ts`, `auth.types.ts`, `ResumeProfileView.tsx`, `ResumeContainer.tsx`, `history.utils.ts`, `avatar.tsx`, `feedback.utils.ts`, `transcript.utils.test.ts`, `next`, `InterviewMessageCard`, `DashboardContainer`, `InterviewLobby.tsx`, `interviews/constants.ts`, `Implementation Steps`, `interviews/page.tsx`, `Completed Steps`, `lib/media.ts`, `use-audio-recorder.test.tsx`, `InterviewTitleBar.tsx`, `InterviewRoom.test.tsx`, `DataTable`, `FeedbackResult.tsx`, `InterviewRoom.tsx`, `sidebar.tsx`, `resume/page.tsx`, `Button`, `breadcrumb.tsx`, `ActiveInterview.tsx`, `TranscriptPanel.tsx`, `InterviewsContainer`, `cn`, `requireUser`, `Implementation Plan: Interviews Setup UI (foundation)`, `lucide-react`, `LoadingOverlay.tsx`, `FeedbackStateMessage.tsx`, `InterviewsContainer.tsx`, `vitest`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `TextAreaField`, `auth-session.ts`, `Part A: Chat core`, `use-interview-voice.ts`, `Implementation Steps`, `Cuewise FE — Project Instructions`, `auth.types.ts`, `GET`, `Implementation: Interviews Chat Layout`, `ResumeContainer.tsx`, `feedback.utils.ts`, `apiClient`, `transcript.utils.test.ts`, `Implementation Plan: Voice Answers`, `done`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `Implementation Steps`, `lib/media.ts`, `parseApiError`, `InterviewRoom.test.tsx`, `auth.routes.test.ts`, `ActiveInterview.tsx`, `Implementation: Job description import (link and smart paste)`, `Feature: Interviews Setup UI (foundation)`, `Implementation Plan: Job description import (link and smart paste)`, `InterviewsContainer`, `requireUser`, `Implementation Plan: Interviews Setup UI (foundation)`, `LoadingOverlay.tsx`, `FeedbackStateMessage.tsx`, `InterviewsContainer.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `RoomControls.tsx`, `TextAreaField`, `Part A: Chat core`, `AuthCard`, `Implementation Steps`, `SelectField.tsx`, `auth.types.ts`, `ResumeProfileView.tsx`, `ResumeContainer.tsx`, `history.utils.ts`, `InterviewMessageCard`, `DashboardContainer`, `InterviewLobby.tsx`, `interviews/constants.ts`, `InterviewTitleBar.tsx`, `DataTable`, `format.utils.ts`, `FeedbackResult.tsx`, `sidebar.tsx`, `ActiveInterview.tsx`, `TranscriptPanel.tsx`, `InterviewsContainer`, `lucide-react`, `LoadingOverlay.tsx`, `DataTableColumnHeader.tsx`, `FeedbackStateMessage.tsx`, `InterviewsContainer.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Project Conventions`) actually correct?**
  _`Button()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 45 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 53 inferred relationships involving `Completed Steps` (e.g. with `ActiveInterview()` and `FinishedInterview()`) actually correct?**
  _`Completed Steps` has 53 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _760 weakly-connected nodes found - possible documentation gaps or missing edges._