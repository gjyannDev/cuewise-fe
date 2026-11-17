# Graph Report - cuewise-fe  (2026-11-17)

## Corpus Check
- 300 files · ~221,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 2279 nodes · 6301 edges · 108 communities (107 shown, 1 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 1135 edges (avg confidence: 0.95)
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
- Implementation Plan: Résumé profile and résumé-aware interviews
- RoomControls.tsx
- dependencies
- Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)
- TextAreaField
- auth-session.ts
- README.md
- AGENTS.md
- Part A: Chat core
- FeedbackResult.tsx
- voice.utils.test.ts
- Implementation Steps
- SelectField.tsx
- interviews.types.ts
- requireUser
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- auth.types.ts
- Implementation: Interviews Setup UI (foundation)
- react
- Implementation: Interview Feedback Screen (frontend)
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- InterviewLobby.tsx
- GET
- devDependencies
- Feature: Interview Room (a voice interview, styled like a video call)
- Implementation: Dashboard Overview (Tier 1)
- EndInterviewDialog
- Implementation: Interviews Chat Layout
- Feature: Interview Follow-up Questions (client support)
- ResumeContainer.tsx
- Feature: Interview History Page (frontend)
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
- interviews.queries.ts
- use-interview-answer.ts
- next
- HistoryContainer
- DashboardContainer.test.tsx
- [...path]/route.test.ts
- lib/media.ts
- Implementation Plan: Voice Answers
- done
- interviews/constants.ts
- Feature: Voice Answers (speak an answer, review the transcript, send)
- AuthedShell.tsx
- interviews/page.tsx
- Implementation: Voice Answers
- Completed Steps
- Feature: Interview Feedback Screen (frontend)
- ActiveInterview.tsx
- AuthFormContainer.tsx
- transcript.utils.test.ts
- @testing-library/react
- Implementation: Auth Session (cookie-based BFF)
- InterviewTitleBar.tsx
- Implementation Plan: Interviews Setup UI (foundation)
- Feature: Job description import (link and smart paste)
- FeedbackStateMessage.tsx
- InterviewHistoryStatusFilter.tsx
- signin/page.tsx
- FeedbackQuestionAccordion.tsx
- session-redirect.test.ts
- use-interview-turn.test.tsx
- InterviewRoom.tsx
- auth.routes.test.ts
- sidebar.tsx
- Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)
- interviews.ts
- eslint.config.mjs
- Learn: The interview room, frontend (voice-first, transcript-style)
- Implementation: Interview Room Polish
- Skeleton
- job-import.utils.test.ts
- Button
- Feature: Interview Room Polish (make the room feel like a video call)
- breadcrumb.tsx
- InterviewsContainer
- lucide-react
- scripts
- Implementation Plan: Job description import (link and smart paste)
- Implementation: Interview Answer Streaming (client support for the backend's SSE turn)
- Implementation Steps
- RadioGroupField.tsx
- Implementation Plan: App Sidebar (shared shell for user and admin)
- app/layout.tsx
- Feature: Dashboard Overview (Tier 1)
- AppShell
- backend.client.server.ts
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- Learn: Showing a slow, stored AI result (the interview feedback screen)
- Implementation Steps
- RoleSidebar.tsx
- cookie-jar.ts
- api.helper.ts
- vitest

## God Nodes (most connected - your core abstractions)
1. `react` - 94 edges
2. `Button()` - 72 edges
3. `useMutationCallbacks()` - 62 edges
4. `Completed Steps` - 54 edges
5. `vitest` - 50 edges
6. `InterviewsContainer()` - 44 edges
7. `lucide-react` - 42 edges
8. `parseApiError()` - 41 edges
9. `requireUser()` - 41 edges
10. `Implementation Steps` - 37 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `UX Requirements` --references--> `Progress()`  [INFERRED]
  docs/features/dashboard-overview/spec.md → src/components/ui/progress.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (108 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, happy-dom, @hookform/resolvers, next-themes, react-dom, shadcn (+9 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.18
Nodes (21): Implementation Steps, SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu() (+13 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Implementation Plan: Résumé profile and résumé-aware interviews"
Cohesion: 0.08
Nodes (23): Architecture & Design, Blockers & Resolutions, Implementation Plan: Résumé profile and résumé-aware interviews, Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+15 more)

### Community 5 - "RoomControls.tsx"
Cohesion: 0.14
Nodes (12): KbdGroup(), Popover(), PopoverContent(), PopoverTitle(), PopoverTrigger(), Spinner(), ReviewAnswer, RoomControlsProps (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+14 more)

### Community 7 - "Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Completed Steps, Earlier build (v1, summarized), Implementation: Interview History Table Rework (TanStack pagination, page size, sorting, shared DataTable), Known Issues, Links, Skills Consulted During Implementation, Status (+6 more)

### Community 8 - "TextAreaField"
Cohesion: 0.13
Nodes (28): Forms, Known Issues, Skills Consulted, Skills Consulted, Project Conventions, Skills Consulted During Implementation, react-hook-form, AuthFormProps (+20 more)

### Community 9 - "auth-session.ts"
Cohesion: 0.15
Nodes (25): Project Conventions, ACCESS_TOKEN_COOKIE, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), isUnder(), normalizePath() (+17 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Part A: Chat core"
Cohesion: 0.11
Nodes (34): Deviations from Plan, Completed Steps, Skills Consulted, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Chat Layout, Implementation Steps (+26 more)

### Community 13 - "FeedbackResult.tsx"
Cohesion: 0.12
Nodes (40): Visual design (aligned with the current app), Architecture & Design, Layout & UX Design, Project Rules Applied, Deviations from Plan, AuthCard(), AuthCardProps, COPY (+32 more)

### Community 14 - "voice.utils.test.ts"
Cohesion: 0.17
Nodes (19): PlaybackEnd, useAudioPlayer(), RECORDING_FAILED_MESSAGE, RESYNC_ERROR_CODES, SPEECH_RATE_LIMITED_MESSAGE, SPEECH_UNAVAILABLE_MESSAGE, TRANSCRIPTION_ERROR_MESSAGES, TRANSCRIPTION_UNAVAILABLE_MESSAGE (+11 more)

### Community 15 - "Implementation Steps"
Cohesion: 0.23
Nodes (16): Implementation Steps, Acceptance Criteria, Functional, Project Conventions, FieldGroup(), FieldSet(), normalizeError(), authKeys (+8 more)

### Community 16 - "SelectField.tsx"
Cohesion: 0.22
Nodes (14): SelectContent(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton(), SelectTrigger(), SelectValue(), Tooltip(), TooltipContent() (+6 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.05
Nodes (60): ANSWER_MAX_LENGTH, DEFAULT_START_VALUES, FEEDBACK_CRITERIA, FEEDBACK_STATUSES, HISTORY_SORT_COLUMNS, INTERVIEW_TYPES, JOB_PASTE_FORMATS, LEVELS (+52 more)

### Community 18 - "requireUser"
Cohesion: 0.10
Nodes (21): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Don'ts, Git Rules (STRICT), Security & Auth (+13 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.08
Nodes (38): Project Conventions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design (+30 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "auth.types.ts"
Cohesion: 0.16
Nodes (14): zod, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, currentProfileSchema, email, roleSchema, signInFormSchema (+6 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions (+6 more)

### Community 23 - "react"
Cohesion: 0.15
Nodes (15): class-variance-authority, cn, radix-ui, react, badgeVariants, Checkbox(), FieldSeparator(), fieldVariants (+7 more)

### Community 24 - "Implementation: Interview Feedback Screen (frontend)"
Cohesion: 0.12
Nodes (15): 8. Verify and close: manual run of EC1-EC30 with cuewise-be running, Baseline Failures, Changes Made, Completed Steps, Current Step, Implementation: Interview Feedback Screen (frontend), Known Issues, Links (+7 more)

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "InterviewLobby.tsx"
Cohesion: 0.19
Nodes (14): Toggle(), CameraTile(), InterviewLobby(), InterviewLobbyProps, LobbyMicTest, LOBBY_TIP, MIC_CHECK_MESSAGES, MIC_TEST_HEARD (+6 more)

### Community 27 - "GET"
Cohesion: 0.07
Nodes (30): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+22 more)

### Community 28 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, happy-dom, tailwindcss, @tailwindcss/turbopack, @testing-library/react, @types/node (+4 more)

### Community 29 - "Feature: Interview Room (a voice interview, styled like a video call)"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, API Contract (shared by both repos; the single source of truth), Blockers, Constraints, Decisions, Edge Cases, Feature: Interview Room (a voice interview, styled like a video call), Goal (+8 more)

### Community 30 - "Implementation: Dashboard Overview (Tier 1)"
Cohesion: 0.11
Nodes (17): 6. Container tests and final checks, Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Deviations from Plan, Implementation: Dashboard Overview (Tier 1) (+9 more)

### Community 31 - "EndInterviewDialog"
Cohesion: 0.34
Nodes (13): Deviations from Plan, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+5 more)

### Community 32 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Current Step, Follow-up: chat-assistant styling (after review), Follow-up: conversation title with a menu (after review), Follow-up: interview bar instead of the details panel (after review), Implementation: Interviews Chat Layout, Links (+7 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "ResumeContainer.tsx"
Cohesion: 0.09
Nodes (38): 4. How it works, Implementation Steps, Test Cases, ResumeContainer(), handleUpload(), Alert(), AlertDescription(), AlertTitle() (+30 more)

### Community 35 - "Feature: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 36 - "sidebar.types.ts"
Cohesion: 0.21
Nodes (11): Deviations During Implementation, RoleHeaderTitle(), AppHeaderTitle(), AppHeaderTitleProps, NavItem, NavSection, SidebarConfig, findActiveNavItem() (+3 more)

### Community 37 - "history.utils.ts"
Cohesion: 0.14
Nodes (29): Blockers & Resolutions, Implementation Steps, Testing Strategy, Implementation Steps, Testing Strategy, Changes Made, Deviations from Plan, Open Questions (+21 more)

### Community 38 - "Implementation: Interview Room (frontend)"
Cohesion: 0.10
Nodes (19): Baseline Failures, Changes Made, Check results, Current Step, Debug Log, Done: ready for `/review-feature`, Findings, Fixes applied (2026-11-16, user selected R1, R2, R5) (+11 more)

### Community 39 - "[...path]/route.ts"
Cohesion: 0.13
Nodes (19): Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Trade-offs & Rationale, POST(), forward(), ForwardContext, isStreaming(), isTextual(), OWNED_BY_NEXT (+11 more)

### Community 40 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions (+5 more)

### Community 41 - "avatar.tsx"
Cohesion: 0.19
Nodes (6): 7. What surprised me, Avatar(), AvatarFallback(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "feedback.utils.ts"
Cohesion: 0.16
Nodes (14): 5. What can go wrong, 6. Try it yourself, CRITERION_LABELS, FEEDBACK_ERROR_CODES, FEEDBACK_START_VALUE, Criterion, FeedbackErrorResult, FeedbackViewInput (+6 more)

### Community 45 - "Implementation: Résumé profile and résumé-aware interviews"
Cohesion: 0.13
Nodes (14): Baseline Failures, Changes Made, Completed Steps, Current Step, Debug Log, Done, Implementation: Résumé profile and résumé-aware interviews, Known Issues (+6 more)

### Community 46 - "interviews.queries.ts"
Cohesion: 0.13
Nodes (18): Testing Strategy, Step 6: The service (`modules/interviews/services/interviews.services.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Validation Checklist (before PR), readSseStream(), AnswerStreamOptions, interviewsService, jsonOrNull() (+10 more)

### Community 47 - "use-interview-answer.ts"
Cohesion: 0.11
Nodes (21): Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), Completed Steps, SseFrame, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn() (+13 more)

### Community 48 - "next"
Cohesion: 0.31
Nodes (12): nextConfig, next, POST(), POST(), GENERIC_ERROR_MESSAGE, backendErrorToResponse(), errorResponse(), logBffError() (+4 more)

### Community 49 - "HistoryContainer"
Cohesion: 0.36
Nodes (7): HistoryContainer(), HistoryContent(), HistoryPage(), HistoryPageProps, InterviewHistorySkeleton(), ROWS, HISTORY_PAGE_SIZE

### Community 50 - "DashboardContainer.test.tsx"
Cohesion: 0.10
Nodes (33): Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Dashboard Overview (Tier 1), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+25 more)

### Community 51 - "[...path]/route.test.ts"
Cohesion: 0.13
Nodes (11): ANSWER_TIMEOUT_MS, SPEECH_FORWARD_TIMEOUT_MS, fetchMock, encoder, openStream(), sseFrame(), streamOf(), cancel() (+3 more)

### Community 52 - "lib/media.ts"
Cohesion: 0.06
Nodes (43): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+35 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.13
Nodes (14): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be) (+6 more)

### Community 54 - "done"
Cohesion: 0.08
Nodes (36): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+28 more)

### Community 55 - "interviews/constants.ts"
Cohesion: 0.06
Nodes (50): HistoryContainerProps, NO_ROWS, InterviewConfigFormProps, SectionCardProps, TYPE_ICONS, TYPE_OPTIONS, DASHBOARD_COMPLETED_PARAMS, DASHBOARD_RECENT_PARAMS (+42 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.11
Nodes (17): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Non-Functional (+9 more)

### Community 57 - "AuthedShell.tsx"
Cohesion: 0.33
Nodes (8): Completed Steps, AuthedShell(), AuthedShellProps, getSessionUser(), AppLayout(), getCurrentUser, RoleSidebar(), AppShellSkeleton()

### Community 58 - "interviews/page.tsx"
Cohesion: 0.18
Nodes (11): Blockers & Resolutions, Implementation Plan: Interview Feedback Screen (frontend), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Trade-offs & Rationale, InterviewsContent() (+3 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "Completed Steps"
Cohesion: 0.09
Nodes (53): 4. How it works, Implementation Steps, Phase 2: Frontend (cuewise-fe), Acceptance Criteria Traceability, Completed Steps, Skills Consulted During Implementation, Kbd(), rejectApiError() (+45 more)

### Community 61 - "Feature: Interview Feedback Screen (frontend)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Feedback Screen (frontend), Functional, Goal, Non-Functional (+5 more)

### Community 62 - "ActiveInterview.tsx"
Cohesion: 0.11
Nodes (30): Skills Consulted During Implementation, 4. How it works, Deviations from Plan, Phase 2: Frontend (cuewise-fe), ActiveInterview(), ActiveInterviewProps, FinishedInterview(), LiveInterview() (+22 more)

### Community 63 - "AuthFormContainer.tsx"
Cohesion: 0.14
Nodes (20): Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Deviations recorded during /implement, Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied, Ready to Implement (+12 more)

### Community 64 - "transcript.utils.test.ts"
Cohesion: 0.08
Nodes (29): Affected Files & Patterns, Step 2: The SSE parser (`src/lib/api/sse.ts`), Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Follow-up Questions (client support), Implementation Steps, Overview (+21 more)

### Community 65 - "@testing-library/react"
Cohesion: 0.18
Nodes (12): @testing-library/react, activityWrapper(), AudioLevelFake, domError(), fakeMediaRecorder(), fakeStream(), fakeTrack, installAudioLevelFake() (+4 more)

### Community 66 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.12
Nodes (14): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+6 more)

### Community 67 - "InterviewTitleBar.tsx"
Cohesion: 0.15
Nodes (12): Layout & UX Design, Deviations from Plan, Skills Consulted, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator() (+4 more)

### Community 68 - "Implementation Plan: Interviews Setup UI (foundation)"
Cohesion: 0.20
Nodes (9): Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+1 more)

### Community 69 - "Feature: Job description import (link and smart paste)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Job description import (link and smart paste), Functional, Goal (+6 more)

### Community 70 - "FeedbackStateMessage.tsx"
Cohesion: 0.29
Nodes (6): ALERTS, FeedbackMessageKind, FeedbackStateMessageProps, ICONS, linkButton(), FEEDBACK_MESSAGES

### Community 71 - "InterviewHistoryStatusFilter.tsx"
Cohesion: 0.11
Nodes (28): Affected Files & Patterns, Architecture & Design, Implementation Plan: Interview History Table Rework (TanStack Table v9, shared DataTable), Overview, Project Rules Applied, Ready to Implement, Requirements -> Implementation, Skills Consulted (+20 more)

### Community 72 - "signin/page.tsx"
Cohesion: 0.53
Nodes (4): SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps

### Community 73 - "FeedbackQuestionAccordion.tsx"
Cohesion: 0.26
Nodes (13): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), CriterionScore(), EvidenceQuote(), FeedbackQuestionAccordion(), FeedbackQuestionAccordionProps (+5 more)

### Community 74 - "session-redirect.test.ts"
Cohesion: 0.33
Nodes (4): body(), assign, bypass, clear

### Community 75 - "use-interview-turn.test.tsx"
Cohesion: 0.09
Nodes (24): 5. What can go wrong, Affected Files & Patterns, Approaches Considered, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview Room (frontend), Overview, Project Rules Applied (+16 more)

### Community 76 - "InterviewRoom.tsx"
Cohesion: 0.19
Nodes (12): vaul, Drawer(), DrawerContent(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle(), InterviewRoom() (+4 more)

### Community 77 - "auth.routes.test.ts"
Cohesion: 0.16
Nodes (15): Affected Files & Patterns, CREDENTIALS, get, post, PROFILE, axiosErrorWith(), errorBody(), networkError() (+7 more)

### Community 78 - "sidebar.tsx"
Cohesion: 0.12
Nodes (14): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar() (+6 more)

### Community 79 - "Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)"
Cohesion: 0.20
Nodes (9): 1. Why it exists, 2. What it is, 3. When to use it, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open (+1 more)

### Community 80 - "interviews.ts"
Cohesion: 0.13
Nodes (17): SILENCE_HINT, FeedbackQuestion, emptyFeedback(), feedback(), FEEDBACK_ID, feedbackQuestion(), interviewListItem(), NextQuestion (+9 more)

### Community 81 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 82 - "Learn: The interview room, frontend (voice-first, transcript-style)"
Cohesion: 0.25
Nodes (7): 1. Why it exists, 2. What it is (so far), 3. When to use it, 6. Try it yourself, 8. Check your understanding, 9. Go deeper / Still open, Learn: The interview room, frontend (voice-first, transcript-style)

### Community 83 - "Implementation: Interview Room Polish"
Cohesion: 0.14
Nodes (13): Baseline Failures, Browser Audit (2026-11-16, Chrome, desktop 1736 px and a 360 px iframe), Changes Made, Debug Log, Implementation: Interview Room Polish, Known Issues, Links, Open Questions (+5 more)

### Community 84 - "Skeleton"
Cohesion: 0.36
Nodes (7): DashboardFallback(), Home(), HomeContent(), ResumeContent(), ResumePage(), Skeleton(), RESUME_ROUTE

### Community 85 - "job-import.utils.test.ts"
Cohesion: 0.16
Nodes (13): JOB_DESCRIPTION_MAX_LENGTH, JOB_IMPORT_FAILED_MESSAGE, JOB_IMPORT_REPLACED_MESSAGE, JOB_PASTE_MAX_CHARS, JOB_TEXT_ERROR_CODE, JOB_URL_ERROR_CODES, JOB_URL_MAX_LENGTH, JobImportActions (+5 more)

### Community 86 - "Button"
Cohesion: 0.14
Nodes (30): Project Conventions, Button(), ContinueInterviewCardProps, DASHBOARD_LABEL_CLASS, DASHBOARD_LINK_CLASS, DASHBOARD_NUMBER_CLASS, DASHBOARD_TITLE_CLASS, DashboardMetricsProps (+22 more)

### Community 87 - "Feature: Interview Room Polish (make the room feel like a video call)"
Cohesion: 0.12
Nodes (15): Acceptance Criteria, Blockers, Constraints, Decisions (from the spec grilling), Edge Cases, Feature: Interview Room Polish (make the room feel like a video call), Functional, Goal (+7 more)

### Community 88 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 90 - "InterviewsContainer"
Cohesion: 0.12
Nodes (21): Affected Files & Patterns, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement (+13 more)

### Community 92 - "lucide-react"
Cohesion: 0.10
Nodes (27): Rename map (done in Step 1, no behaviour change), Project Conventions, Known Issues, lucide-react, motion, use-stick-to-bottom, ConversationContent(), ConversationContentProps (+19 more)

### Community 93 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 95 - "Implementation Plan: Job description import (link and smart paste)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Deviations found during implementation (2026-11-13), Implementation Plan: Job description import (link and smart paste), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation (+2 more)

### Community 96 - "Implementation: Interview Answer Streaming (client support for the backend's SSE turn)"
Cohesion: 0.18
Nodes (10): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+2 more)

### Community 97 - "Implementation Steps"
Cohesion: 0.09
Nodes (35): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 5. What can go wrong, 6. Try it yourself, 7. What surprised me, 8. Check your understanding (+27 more)

### Community 98 - "RadioGroupField.tsx"
Cohesion: 0.20
Nodes (12): Architecture & Design, FieldTitle(), RadioGroup(), RadioGroupItem(), Slider(), LAYOUT, OPTION, RadioGroupField() (+4 more)

### Community 99 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.18
Nodes (10): Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+2 more)

### Community 100 - "app/layout.tsx"
Cohesion: 0.12
Nodes (20): Data Fetching (TanStack Query), Test Results, @tanstack/react-query, src_app_globals, metadata, RootLayout(), viewport, Providers() (+12 more)

### Community 101 - "Feature: Dashboard Overview (Tier 1)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Dashboard Overview (Tier 1), Functional, Goal, Non-Functional (+5 more)

### Community 102 - "AppShell"
Cohesion: 0.32
Nodes (9): SidebarInset(), SidebarProvider(), SidebarRail(), SidebarTrigger(), useSidebar(), useRoomSidebar(), AppShell(), AppShellProps (+1 more)

### Community 104 - "backend.client.server.ts"
Cohesion: 0.24
Nodes (8): ref_server_only, apiErrorBodySchema, axios, AxiosRequestConfig, backendApi, apiUrlSchema, getApiUrl(), backendTokenSchema

### Community 105 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 108 - "Learn: Showing a slow, stored AI result (the interview feedback screen)"
Cohesion: 0.22
Nodes (8): 1. Why it exists, 2. What it is, 3. When to use it, 4. How it works, 7. What surprised me, 8. Check your understanding, 9. Go deeper / Still open, Learn: Showing a slow, stored AI result (the interview feedback screen)

### Community 109 - "Implementation Steps"
Cohesion: 0.20
Nodes (17): Implementation Steps, FeedbackContainer(), FeedbackContainerProps, FeedbackContent(), FeedbackPage(), FeedbackPageProps, InterviewNotFoundCard(), FeedbackGenerating() (+9 more)

### Community 110 - "RoleSidebar.tsx"
Cohesion: 0.31
Nodes (7): Role, RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE, USER_SIDEBAR

### Community 111 - "cookie-jar.ts"
Cohesion: 0.40
Nodes (3): cookieJar, nextHeadersMock, StoredCookie

### Community 112 - "api.helper.ts"
Cohesion: 0.08
Nodes (28): Architecture: Modular, Feature-Driven, Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Test Cases, Known Issues, axios, useWarnBeforeUnload(), apiClient, ApiError (+20 more)

### Community 115 - "vitest"
Cohesion: 0.25
Nodes (3): ref_node_url, vitest, redirectIfSessionEnded

## Knowledge Gaps
- **754 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+749 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 892 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `RoomControls.tsx`, `TextAreaField`, `FeedbackResult.tsx`, `voice.utils.test.ts`, `SelectField.tsx`, `requireUser`, `useMutationCallbacks`, `auth.types.ts`, `InterviewLobby.tsx`, `EndInterviewDialog`, `ResumeContainer.tsx`, `history.utils.ts`, `avatar.tsx`, `interviews.queries.ts`, `use-interview-answer.ts`, `HistoryContainer`, `lib/media.ts`, `interviews/constants.ts`, `AuthedShell.tsx`, `interviews/page.tsx`, `Completed Steps`, `ActiveInterview.tsx`, `@testing-library/react`, `InterviewTitleBar.tsx`, `FeedbackStateMessage.tsx`, `InterviewHistoryStatusFilter.tsx`, `signin/page.tsx`, `FeedbackQuestionAccordion.tsx`, `InterviewRoom.tsx`, `sidebar.tsx`, `interviews.ts`, `Skeleton`, `job-import.utils.test.ts`, `Button`, `breadcrumb.tsx`, `InterviewsContainer`, `lucide-react`, `RadioGroupField.tsx`, `app/layout.tsx`, `AppShell`, `Implementation Steps`, `api.helper.ts`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `AppSidebar.tsx`, `TextAreaField`, `auth-session.ts`, `Part A: Chat core`, `voice.utils.test.ts`, `Implementation Steps`, `requireUser`, `GET`, `EndInterviewDialog`, `ResumeContainer.tsx`, `use-interview-answer.ts`, `DashboardContainer.test.tsx`, `Implementation Plan: Voice Answers`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `AuthedShell.tsx`, `ActiveInterview.tsx`, `AuthFormContainer.tsx`, `transcript.utils.test.ts`, `Implementation Plan: Interviews Setup UI (foundation)`, `use-interview-turn.test.tsx`, `auth.routes.test.ts`, `InterviewsContainer`, `Implementation Plan: Job description import (link and smart paste)`, `Implementation Steps`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `app/layout.tsx`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `Implementation Steps`, `RoleSidebar.tsx`, `api.helper.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `RoomControls.tsx`, `TextAreaField`, `Part A: Chat core`, `FeedbackResult.tsx`, `Implementation Steps`, `SelectField.tsx`, `InterviewLobby.tsx`, `EndInterviewDialog`, `ResumeContainer.tsx`, `history.utils.ts`, `HistoryContainer`, `DashboardContainer.test.tsx`, `interviews/constants.ts`, `ActiveInterview.tsx`, `AuthFormContainer.tsx`, `InterviewTitleBar.tsx`, `FeedbackStateMessage.tsx`, `InterviewHistoryStatusFilter.tsx`, `sidebar.tsx`, `InterviewsContainer`, `lucide-react`, `Implementation Steps`, `AppShell`, `Implementation Steps`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Project Conventions`) actually correct?**
  _`Button()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 45 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 45 INFERRED edges - model-reasoned connections that need verification._
- **Are the 53 inferred relationships involving `Completed Steps` (e.g. with `ActiveInterview()` and `FinishedInterview()`) actually correct?**
  _`Completed Steps` has 53 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _754 weakly-connected nodes found - possible documentation gaps or missing edges._