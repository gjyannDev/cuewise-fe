# Graph Report - cuewise-fe  (2026-11-04)

## Corpus Check
- 219 files · ~113,190 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1454 nodes · 3634 edges · 80 communities (79 shown, 1 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 595 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37236178`
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
- InterviewConfigForm
- SelectField.tsx
- Implementation Steps
- README.md
- AGENTS.md
- getAnswerErrorResult
- constants.ts
- Implementation Plan: Interviews Answer Flow
- auth.types.ts
- api.helper.ts
- interviews.types.ts
- Implementation Plan: App Sidebar (shared shell for user and admin)
- useMutationCallbacks
- Feature: App Sidebar (shared shell for user and admin)
- Part A: Chat core
- Implementation: Interviews Setup UI (foundation)
- vitest
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- InterviewConfigForm.tsx
- done
- devDependencies
- FieldError
- scripts
- interviews.ts
- Feature: Interview History Page (frontend)
- Feature: Interview Follow-up Questions (client support)
- current-user.server.ts
- Implementation Steps
- RoleSidebar.tsx
- Feature: Interviews Setup UI (foundation)
- Button
- react-hook-form
- InterviewsContainer.tsx
- next
- Implementation: App Sidebar (shared shell for user and admin)
- Implementation: Interviews Answer Flow
- Implementation: Interview Follow-up Questions (client support)
- [...path]/route.test.ts
- buildThreadView
- Implementation Steps
- sidebar.tsx
- HistoryContainer.tsx
- use-interview-chat.ts
- ChatMessage.tsx
- InterviewTitleBar.tsx
- Implementation Plan: Voice Answers
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- dialog.tsx
- Feature: Voice Answers (speak an answer, review the transcript, send)
- Phase 2: Frontend (cuewise-fe)
- AuthFormContainer.tsx
- Implementation: Voice Answers
- sse.test.ts
- breadcrumb.tsx
- .answerStream
- sheet.tsx
- Implementation: Interview History Page (frontend)
- AuthForm.tsx
- InterviewHistoryTable.tsx
- Implementation: Interviews Chat Layout
- Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)
- signin/page.tsx
- utils.ts
- react
- interviews.services.ts
- format-question-count.ts
- TextAreaField
- eslint.config.mjs
- AnswerComposer
- requireUser
- shimmer.tsx
- Requirements

## God Nodes (most connected - your core abstractions)
1. `react` - 62 edges
2. `useMutationCallbacks()` - 42 edges
3. `Button()` - 41 edges
4. `vitest` - 34 edges
5. `Part A: Chat core` - 33 edges
6. `Implementation Steps` - 31 edges
7. `lucide-react` - 29 edges
8. `InterviewsContainer()` - 28 edges
9. `requireUser()` - 27 edges
10. `parseApiError()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Blockers & Resolutions` --references--> `InterviewsContainer()`  [INFERRED]
  docs/features/interview-history/plan.md → src/app/(app)/interviews/_components/InterviewsContainer.tsx
- `Edge Cases` --references--> `GET()`  [INFERRED]
  docs/features/interviews-answer-flow/spec.md → src/app/api/auth/session-expired/route.ts
- `Functional` --references--> `GET()`  [INFERRED]
  docs/features/interviews-answer-flow/spec.md → src/app/api/auth/session-expired/route.ts
- `Ready to Implement` --references--> `Conversation()`  [INFERRED]
  docs/features/interviews-chat-layout/plan.md → src/components/ai-elements/conversation.tsx

## Import Cycles
- None detected.

## Communities (80 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, @hookform/resolvers, next-themes, react-dom, shadcn, sonner (+9 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.20
Nodes (18): SidebarContent(), SidebarFooter(), SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+10 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.08
Nodes (29): About the Project, AI Features (UI side), Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts, Git Rules (STRICT) (+21 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+13 more)

### Community 7 - "InterviewConfigForm"
Cohesion: 0.18
Nodes (21): Layout & UX Design, AuthCard(), AuthCardProps, COPY, SignUpContent(), SignUpPage(), SignUpPageProps, Card() (+13 more)

### Community 8 - "SelectField.tsx"
Cohesion: 0.18
Nodes (19): FieldDescription(), Select(), SelectContent(), SelectGroup(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton(), SelectTrigger() (+11 more)

### Community 9 - "Implementation Steps"
Cohesion: 0.11
Nodes (37): Project Conventions, Deviations recorded during /implement, Implementation Steps, Testing Strategy, Acceptance Criteria, Acceptance Criteria, Edge Cases, GET() (+29 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "getAnswerErrorResult"
Cohesion: 0.16
Nodes (17): Implementation Plan: Interviews Chat Layout, Implementation Steps, Overview, Part B: Robustness, Project Rules Applied, Ready to Implement, Skills Consulted, Testing Strategy (+9 more)

### Community 13 - "constants.ts"
Cohesion: 0.09
Nodes (28): AnswerComposerHandle, AnswerComposerProps, RECORDER_ERROR_MESSAGES, MicState, InterviewStatusBadgeProps, STATUS_VARIANTS, ANSWER_COUNTER_FROM, ANSWER_MAX_LENGTH (+20 more)

### Community 14 - "Implementation Plan: Interviews Answer Flow"
Cohesion: 0.13
Nodes (15): Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Layout & UX Design, Overview, Project Rules Applied, Ready to Implement (+7 more)

### Community 15 - "auth.types.ts"
Cohesion: 0.18
Nodes (12): zod, authCredentialsSchema, authFormSchemas, authSearchParamsSchema, currentProfileSchema, email, roleSchema, signInFormSchema (+4 more)

### Community 16 - "api.helper.ts"
Cohesion: 0.10
Nodes (24): Trade-offs & Rationale, POST(), forward(), ForwardContext, OWNED_BY_NEXT, parseJsonOrNull(), SLOW_POSTS, STREAM_HEADERS (+16 more)

### Community 17 - "interviews.types.ts"
Cohesion: 0.07
Nodes (36): DEFAULT_START_VALUES, JOB_DESCRIPTION_MAX_LENGTH, LEVELS, MAX_QUESTION_COUNT, MIN_QUESTION_COUNT, QUESTION_CATEGORIES, QUESTION_KINDS, ROLES (+28 more)

### Community 18 - "Implementation Plan: App Sidebar (shared shell for user and admin)"
Cohesion: 0.18
Nodes (10): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Overview, Project Rules Applied, Ready to Implement, Skills Consulted (+2 more)

### Community 19 - "useMutationCallbacks"
Cohesion: 0.18
Nodes (18): Completed Steps, Affected Files & Patterns, Implementation Steps, Project Conventions, Affected Files & Patterns, AuthFormContainer(), ActionMode, BuildCallbackEffects (+10 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "Part A: Chat core"
Cohesion: 0.22
Nodes (23): Architecture & Design, Step 12: Components (`ChatThread.tsx`, `ChatMessage.tsx`, `InterviewChat.tsx`, `ActiveInterview.tsx`), Affected Files & Patterns, Architecture & Design, Part A: Chat core, Project Conventions, Follow-up: chat-assistant styling (after review), Implementation Steps (+15 more)

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Completed Steps, Implementation: Interviews Setup UI (foundation), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 23 - "vitest"
Cohesion: 0.16
Nodes (15): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, axiosErrorWith() (+7 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.29
Nodes (7): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, sessionParamSchema, SessionParam, parseSessionParam()

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "InterviewConfigForm.tsx"
Cohesion: 0.13
Nodes (15): Acceptance Criteria, UX Requirements, Follow-up: interview bar instead of the details panel (after review), Deviations from Plan, Badge(), badgeVariants, InterviewColumns(), InterviewColumnsProps (+7 more)

### Community 27 - "done"
Cohesion: 0.09
Nodes (26): Affected Files & Patterns, Blockers & Resolutions, Implementation Plan: Interview Answer Streaming (client support for the backend's SSE turn), Overview, Project Rules Applied, Ready to Implement, Spec Requirements -> Implementation, Step 10: The mutation (`modules/interviews/queries/interviews.queries.ts`, `types/interviews.types.ts`) (+18 more)

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "FieldError"
Cohesion: 0.22
Nodes (12): FieldError(), FieldTitle(), RadioGroup(), RadioGroupItem(), Slider(), LAYOUT, OPTION, RadioGroupField() (+4 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 31 - "interviews.ts"
Cohesion: 0.11
Nodes (22): Step 13: Removals and constants (`constants.ts`, `tests/helpers/interviews.ts`), INTERVIEWER_THINKING_LABELS, INTERVIEWER_WRAP_UP_LABEL, Reaction, ThreadView, TranscriptItem, keyOf(), ThreadViewOptions (+14 more)

### Community 32 - "Feature: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Blockers, Constraints, Edge Cases, Feature: Interview History Page (frontend), Functional, Goal, Non-Functional, Out of Scope (+5 more)

### Community 33 - "Feature: Interview Follow-up Questions (client support)"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interview Follow-up Questions (client support), Functional, Goal, Non-Functional (+6 more)

### Community 34 - "current-user.server.ts"
Cohesion: 0.26
Nodes (10): ref_server_only, AuthedShellProps, getSessionUser(), ApiErrorBody, axios, AxiosRequestConfig, backendApi, SessionExpiredError (+2 more)

### Community 35 - "Implementation Steps"
Cohesion: 0.15
Nodes (13): Implementation Steps, Step 14: Gates and the manual end-to-end run, Step 2: The SSE parser (`src/lib/api/sse.ts`), Step 3: Shared fetch error types (`src/lib/config/api.helper.ts`), Step 4: The shared session redirect (`src/lib/config/session-redirect.ts`, `src/lib/config/axios.client.ts`), Step 5: The forwarder's streaming branch (`src/app/api/[...path]/route.ts`), Step 7: The outcome mapping (`modules/interviews/utils/get-answer-error-result.ts`), Step 8: The live-turn reducer (`modules/interviews/utils/reduce-answer-stream.ts`) (+5 more)

### Community 36 - "RoleSidebar.tsx"
Cohesion: 0.16
Nodes (16): Deviations During Implementation, Role, RoleHeaderTitle(), RoleHeaderTitleProps, RoleSidebarProps, ADMIN_SIDEBAR, ROLE_LABELS, SIDEBAR_BY_ROLE (+8 more)

### Community 37 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 38 - "Button"
Cohesion: 0.15
Nodes (16): lucide-react, use-stick-to-bottom, ActiveInterviewProps, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, Button() (+8 more)

### Community 39 - "react-hook-form"
Cohesion: 0.29
Nodes (9): react-hook-form, Checkbox(), FieldLabel(), Label(), CheckboxField(), CheckboxFieldProps, CheckboxFieldProps, CheckBoxFieldWithDescription() (+1 more)

### Community 40 - "InterviewsContainer.tsx"
Cohesion: 0.24
Nodes (14): Affected Files & Patterns, Implementation Steps, InterviewsContainer(), handleStart(), InterviewsContainerProps, InterviewMessageCard(), InterviewSessionSkeleton(), useInterviewMessagesQuery() (+6 more)

### Community 41 - "next"
Cohesion: 0.29
Nodes (12): nextConfig, next, POST(), POST(), backendErrorToResponse(), errorResponse(), logBffError(), parseJsonBody() (+4 more)

### Community 42 - "Implementation: App Sidebar (shared shell for user and admin)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made (uncommitted, for the user to review), Implementation: App Sidebar (shared shell for user and admin), Known Issues, Links, Open Questions, Skills Consulted During Implementation, Status (+4 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 44 - "Implementation: Interview Follow-up Questions (client support)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Implementation: Interview Follow-up Questions (client support), Links, Open Questions, Skills Consulted During Implementation (+4 more)

### Community 45 - "[...path]/route.test.ts"
Cohesion: 0.15
Nodes (9): ANSWER_TIMEOUT_MS, fetchMock, cookieJar, nextHeadersMock, StoredCookie, encoder, openStream(), sseFrame() (+1 more)

### Community 46 - "buildThreadView"
Cohesion: 0.11
Nodes (23): Completed Steps, Skills Consulted, Step 11: The chat hook (`modules/interviews/hooks/use-interview-chat.ts`), Step 9: The thread view (`utils/build-thread-view.ts`, `types/interviews.types.ts`), Blockers & Resolutions, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions (+15 more)

### Community 47 - "Implementation Steps"
Cohesion: 0.42
Nodes (7): Implementation Steps, Completed Steps, Deviations from Plan, AuthedShell(), RoleSidebar(), isActivePath(), trimTrailingSlash()

### Community 48 - "sidebar.tsx"
Cohesion: 0.13
Nodes (14): Input(), SidebarContext, SidebarContextProps, SidebarInput(), SidebarInset(), sidebarMenuButtonVariants, SidebarProvider(), SidebarRail() (+6 more)

### Community 49 - "HistoryContainer.tsx"
Cohesion: 0.06
Nodes (45): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interview History Page (frontend), Overview, Project Rules Applied, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation (+37 more)

### Community 50 - "use-interview-chat.ts"
Cohesion: 0.11
Nodes (21): Changes Made (cuewise-fe, uncommitted), INTERVIEWER_SLOW_LABEL, RESYNC_MESSAGE, THINKING_SLOW_AFTER_MS, UNCONFIRMED_SEND_MESSAGE, reduceTurn(), SendFailure, TranscribeResult (+13 more)

### Community 51 - "ChatMessage.tsx"
Cohesion: 0.19
Nodes (8): Avatar(), AvatarFallback(), ChatMessageProps, InterviewerAvatar(), SidebarUserCard(), SidebarUserCardProps, SidebarUser, getInitials()

### Community 52 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 53 - "Implementation Plan: Voice Answers"
Cohesion: 0.15
Nodes (12): Architecture & Design, Blockers & Resolutions, Implementation Plan: Voice Answers, Implementation Steps, Overview, Phase 0: Spike (no product code), Phase 1: Backend (cuewise-be), Project Rules Applied (+4 more)

### Community 54 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal, Non-Functional, Out of Scope (+3 more)

### Community 55 - "dialog.tsx"
Cohesion: 0.32
Nodes (11): Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogPortal() (+3 more)

### Community 56 - "Feature: Voice Answers (speak an answer, review the transcript, send)"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Blockers, Constraints, Decisions, Edge Cases, Feature: Voice Answers (speak an answer, review the transcript, send), Goal, Out of Scope (+3 more)

### Community 57 - "Phase 2: Frontend (cuewise-fe)"
Cohesion: 0.18
Nodes (6): Architecture: Modular, Feature-Driven, Phase 2: Frontend (cuewise-fe), apiClient, API, AnswerErrorResult, cancel()

### Community 58 - "AuthFormContainer.tsx"
Cohesion: 0.18
Nodes (16): Acceptance Criteria, Functional, Project Conventions, AuthFormContainerProps, ERROR_TITLES, authKeys, useCurrentProfileQuery(), useLogoutMutation() (+8 more)

### Community 59 - "Implementation: Voice Answers"
Cohesion: 0.11
Nodes (17): 15. Manual end-to-end run (user), Baseline Failures, Changes Made (cuewise-be, uncommitted, branch `feat/voice-answer-stt`), Completed Steps, Current Step, Deviations from Plan, Implementation: Voice Answers, Known Issues (+9 more)

### Community 60 - "sse.test.ts"
Cohesion: 0.21
Nodes (6): Step 6: The service (`modules/interviews/services/interviews.services.ts`), readSseStream(), SseFrame, collect(), encoder, EXPECTED

### Community 61 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 62 - ".answerStream"
Cohesion: 0.12
Nodes (19): Step 1: The event contract (`constants.ts`, `schemas/interviews.schema.ts`, `types/interviews.types.ts`, `utils/parse-answer-stream-event.ts`), Baseline Failures, Changes Made, Completed Steps, Implementation: Interview Answer Streaming (client support for the backend's SSE turn), Known Issues, Links, Open Questions (+11 more)

### Community 63 - "sheet.tsx"
Cohesion: 0.26
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle(), Sidebar()

### Community 64 - "Implementation: Interview History Page (frontend)"
Cohesion: 0.14
Nodes (13): Baseline Failures, Completed Steps, Deviations from Plan, Implementation: Interview History Page (frontend), Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

### Community 65 - "AuthForm.tsx"
Cohesion: 0.12
Nodes (24): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Overview, Project Rules Applied (+16 more)

### Community 66 - "InterviewHistoryTable.tsx"
Cohesion: 0.15
Nodes (19): Table(), TableBody(), TableCaption(), TableCell(), TableHead(), TableHeader(), TableRow(), column (+11 more)

### Community 67 - "Implementation: Interviews Chat Layout"
Cohesion: 0.12
Nodes (15): Baseline Failures, Changes Made, Completed Steps, Current Step, Deviations from Plan, Follow-up: conversation title with a menu (after review), Implementation: Interviews Chat Layout, Links (+7 more)

### Community 68 - "Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)"
Cohesion: 0.17
Nodes (11): Blockers, Constraints, Edge Cases, Error handling (what the user sees), Feature: Auth Session (cookie-based, Next.js as backend-for-frontend), Goal, Non-Functional, Out of Scope (+3 more)

### Community 69 - "signin/page.tsx"
Cohesion: 0.53
Nodes (4): SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps

### Community 70 - "utils.ts"
Cohesion: 0.21
Nodes (10): AudioRecorderOptions, detectFormat(), errorKind(), noSubscription(), RecorderError, RecorderStatus, RecordingEnd, useAudioRecorder() (+2 more)

### Community 71 - "react"
Cohesion: 0.15
Nodes (11): class-variance-authority, cn, radix-ui, react, Field(), FieldSeparator(), fieldVariants, Separator() (+3 more)

### Community 72 - "interviews.services.ts"
Cohesion: 0.11
Nodes (22): Implementation Steps, redirectIfSessionEnded(), START_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS, interviewKeys, AnswerStreamOptions, TranscribeVariables, interviewsService (+14 more)

### Community 73 - "format-question-count.ts"
Cohesion: 0.52
Nodes (5): FOLLOW_UP_CAPTION, formatInterviewCount(), formatProgress(), formatQuestionCaption(), formatQuestionPosition()

### Community 74 - "TextAreaField"
Cohesion: 0.20
Nodes (10): Architecture & Design, Blockers & Resolutions, Implementation Plan: Interviews Setup UI (foundation), Overview, Ready to Implement, Skills Consulted, Spec Requirements -> Implementation, Testing Strategy (+2 more)

### Community 75 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 76 - "AnswerComposer"
Cohesion: 0.22
Nodes (6): Affected Files & Patterns, Skills Consulted, Problem, AnswerComposer(), transcribe(), appendTranscript()

### Community 77 - "requireUser"
Cohesion: 0.39
Nodes (6): Trade-offs & Rationale, AdminHome(), AdminHomeContent(), Home(), HomeContent(), requireUser()

### Community 78 - "shimmer.tsx"
Cohesion: 0.32
Nodes (5): motion, MOTION_ELEMENTS, Shimmer, TextShimmerProps, TypingIndicatorProps

### Community 79 - "Requirements"
Cohesion: 0.40
Nodes (5): Non-Functional, Phase 0: Spike (before Phase 2 starts), Phase 1: Backend (cuewise-be), Phase 2: Frontend (cuewise-fe), Requirements

## Knowledge Gaps
- **478 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+473 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 576 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `AppSidebar.tsx`, `Cuewise FE — Project Instructions`, `InterviewConfigForm`, `SelectField.tsx`, `getAnswerErrorResult`, `constants.ts`, `Part A: Chat core`, `interviews/page.tsx`, `InterviewConfigForm.tsx`, `FieldError`, `current-user.server.ts`, `Button`, `react-hook-form`, `InterviewsContainer.tsx`, `sidebar.tsx`, `HistoryContainer.tsx`, `use-interview-chat.ts`, `ChatMessage.tsx`, `InterviewTitleBar.tsx`, `dialog.tsx`, `breadcrumb.tsx`, `sheet.tsx`, `AuthForm.tsx`, `InterviewHistoryTable.tsx`, `signin/page.tsx`, `utils.ts`, `interviews.services.ts`, `requireUser`, `shimmer.tsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `Cuewise FE — Project Instructions`, `Implementation Steps`, `getAnswerErrorResult`, `Implementation Plan: Interviews Answer Flow`, `Implementation Plan: App Sidebar (shared shell for user and admin)`, `Part A: Chat core`, `done`, `RoleSidebar.tsx`, `Feature: Interviews Setup UI (foundation)`, `InterviewsContainer.tsx`, `buildThreadView`, `Implementation Steps`, `use-interview-chat.ts`, `Implementation Plan: Voice Answers`, `Feature: Voice Answers (speak an answer, review the transcript, send)`, `Phase 2: Frontend (cuewise-fe)`, `AuthFormContainer.tsx`, `AuthForm.tsx`, `Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)`, `AnswerComposer`, `Requirements`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `AuthForm.tsx`, `InterviewHistoryTable.tsx`, `InterviewConfigForm`, `interviews.services.ts`, `Implementation Steps`, `InterviewsContainer.tsx`, `AnswerComposer`, `constants.ts`, `sidebar.tsx`, `HistoryContainer.tsx`, `InterviewTitleBar.tsx`, `Part A: Chat core`, `dialog.tsx`, `InterviewConfigForm.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 31 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Button()` (e.g. with `Implementation Steps` and `Implementation Steps`) actually correct?**
  _`Button()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 32 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _478 weakly-connected nodes found - possible documentation gaps or missing edges._