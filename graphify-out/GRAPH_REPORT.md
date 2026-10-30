# Graph Report - cuewise-fe  (2026-10-30)

## Corpus Check
- 174 files · ~70,824 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1049 nodes · 2652 edges · 42 communities (39 shown, 3 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 395 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `815c10d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- proxy
- components.json
- Cuewise FE — Project Instructions
- Implementation: Auth Session (cookie-based BFF)
- dependencies
- InterviewConfigForm
- react
- Implementation Steps
- README.md
- AGENTS.md
- Button
- constants.ts
- useMutationCallbacks
- auth-session.ts
- AuthCard
- ActiveInterview.tsx
- sidebar.tsx
- Feature: Interviews Setup UI (foundation)
- Feature: App Sidebar (shared shell for user and admin)
- lucide-react
- Implementation: Interviews Setup UI (foundation)
- vitest
- interviews/page.tsx
- Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)
- InterviewConfigForm.tsx
- eslint.config.mjs
- devDependencies
- auth.types.ts
- scripts
- pick-thinking-label.ts
- requireUser
- InterviewTitleBar.tsx
- interviews.services.ts
- Feature: Interviews Answer Flow (submit answer, reaction, completion)
- Implementation: Interviews Chat Layout
- interviews.types.ts
- breadcrumb.tsx
- axios.client.ts
- AnswerComposer.tsx
- Implementation: Interviews Answer Flow

## God Nodes (most connected - your core abstractions)
1. `react` - 56 edges
2. `useMutationCallbacks()` - 36 edges
3. `Button()` - 32 edges
4. `Part A: Chat core` - 32 edges
5. `Implementation Steps` - 31 edges
6. `lucide-react` - 26 edges
7. `vitest` - 24 edges
8. `InterviewsContainer()` - 24 edges
9. `InterviewConfigForm()` - 24 edges
10. `cn` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Deviations from Plan` --references--> `ActiveInterview()`  [INFERRED]
  docs/features/interviews-answer-flow/task.md → src/app/(app)/interviews/_components/ActiveInterview.tsx
- `Known Issues` --references--> `SidebarProvider()`  [INFERRED]
  docs/features/app-sidebar/task.md → src/components/ui/sidebar.tsx
- `Architecture: Modular, Feature-Driven` --references--> `useMutationCallbacks()`  [INFERRED]
  CLAUDE.md → src/hooks/use-mutation-callback.ts
- `Skills Consulted` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/app-sidebar/plan.md → src/hooks/use-mutation-callback.ts
- `Edge Cases` --references--> `useMutationCallbacks()`  [INFERRED]
  docs/features/auth-session/spec.md → src/hooks/use-mutation-callback.ts

## Import Cycles
- None detected.

## Communities (42 total, 3 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, next-themes, react-dom, shadcn, sonner, tailwindcss (+7 more)

### Community 2 - "proxy"
Cohesion: 0.23
Nodes (16): Project Conventions, canRoleAccessRoute(), getRoleLandingRoute(), isPublicAuthRoute(), isTokenExpired(), readTokenPayload(), resolveSafeNext(), clearCookieIf() (+8 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Cuewise FE — Project Instructions"
Cohesion: 0.07
Nodes (30): About the Project, AI Features (UI side), Architecture: Modular, Feature-Driven, Common Commands, Components, Cuewise FE — Project Instructions, Data Fetching (TanStack Query), Don'ts (+22 more)

### Community 5 - "Implementation: Auth Session (cookie-based BFF)"
Cohesion: 0.15
Nodes (12): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Auth Session (cookie-based BFF), Links, Not verified automatically (manual browser check by the user), Open Questions, Skills Consulted During Implementation (+4 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, class-variance-authority, cn, @hookform/resolvers, lucide-react, motion, next (+12 more)

### Community 7 - "InterviewConfigForm"
Cohesion: 0.23
Nodes (16): AuthCardProps, COPY, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+8 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (51): Architecture & Design, class-variance-authority, cn, radix-ui, react, react-hook-form, Badge(), badgeVariants (+43 more)

### Community 9 - "Implementation Steps"
Cohesion: 0.06
Nodes (62): Forms, Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Deviations recorded at /implement start (project CLAUDE.md, added after planning), Implementation Plan: Auth Session (cookie-based BFF), Implementation Steps, Overview (+54 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Button"
Cohesion: 0.29
Nodes (13): Button(), buttonVariants, Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+5 more)

### Community 13 - "constants.ts"
Cohesion: 0.17
Nodes (17): ANSWER_MAX_LENGTH, INTERVIEW_TYPE_OPTIONS, INTERVIEW_TYPES, JOB_DESCRIPTION_MAX_LENGTH, LEVEL_OPTIONS, LEVELS, MAX_QUESTION_COUNT, MIN_QUESTION_COUNT (+9 more)

### Community 14 - "useMutationCallbacks"
Cohesion: 0.05
Nodes (89): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Notes (deviations found while building), Implementation Plan: Interviews Answer Flow, Implementation Steps, Layout & UX Design, Overview (+81 more)

### Community 15 - "auth-session.ts"
Cohesion: 0.17
Nodes (14): Deviations recorded during /implement, handleSubmit(), ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS, authRouteHref(), isUnder(), normalizePath(), PUBLIC_AUTH_ROUTES (+6 more)

### Community 16 - "AuthCard"
Cohesion: 0.27
Nodes (10): Layout & UX Design, AuthCard(), SessionExpiredNotice(), SignInContent(), SignInPage(), SignInPageProps, SignUpContent(), SignUpPage() (+2 more)

### Community 17 - "ActiveInterview.tsx"
Cohesion: 0.20
Nodes (8): ActiveInterviewProps, AnswerComposerHandle, STALE_THREAD_MESSAGE, THREAD_ERROR_MESSAGE, Interview, InterviewStep, question, session

### Community 18 - "sidebar.tsx"
Cohesion: 0.06
Nodes (52): Deviations During Implementation, Input(), Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetOverlay(), SheetPortal() (+44 more)

### Community 19 - "Feature: Interviews Setup UI (foundation)"
Cohesion: 0.15
Nodes (12): Blockers, Constraints, Feature: Interviews Setup UI (foundation), Functional, Goal, Non-Functional, Out of Scope, Problem (+4 more)

### Community 20 - "Feature: App Sidebar (shared shell for user and admin)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: App Sidebar (shared shell for user and admin), Functional, Goal, Non-Functional (+5 more)

### Community 21 - "lucide-react"
Cohesion: 0.19
Nodes (8): lucide-react, use-stick-to-bottom, ConversationContentProps, ConversationEmptyStateProps, ConversationProps, ConversationScrollButtonProps, src_lib_utils_cn, JumpToLatestButtonProps

### Community 22 - "Implementation: Interviews Setup UI (foundation)"
Cohesion: 0.11
Nodes (17): UX Requirements, Baseline Failures, Changes Made, Completed Steps, Deviations from Plan, Implementation: Interviews Setup UI (foundation), Known Issues, Links (+9 more)

### Community 23 - "vitest"
Cohesion: 0.09
Nodes (22): axios, ref_node_url, vitest, CREDENTIALS, get, post, PROFILE, fetchMock (+14 more)

### Community 24 - "interviews/page.tsx"
Cohesion: 0.29
Nodes (7): InterviewsContent(), InterviewsPage(), InterviewsPageProps, INTERVIEWS_ROUTE, sessionParamSchema, SessionParam, parseSessionParam()

### Community 25 - "Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator)"
Cohesion: 0.14
Nodes (13): Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Chat Layout (conversation thread, composer, thinking indicator), Functional, Goal, Non-Functional (+5 more)

### Community 26 - "InterviewConfigForm.tsx"
Cohesion: 0.22
Nodes (8): InterviewConfigFormProps, TYPE_ICONS, TYPE_OPTIONS, InterviewDetailList(), InterviewDetailListProps, INTERVIEW_TYPE_LABELS, LEVEL_LABELS, ROLE_LABELS

### Community 27 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 28 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+2 more)

### Community 29 - "auth.types.ts"
Cohesion: 0.06
Nodes (59): nextConfig, next, ref_server_only, zod, POST(), POST(), POST(), forward() (+51 more)

### Community 30 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 32 - "requireUser"
Cohesion: 0.06
Nodes (39): Affected Files & Patterns, Architecture & Design, Blockers & Resolutions, Implementation Plan: App Sidebar (shared shell for user and admin), Implementation Steps, Overview, Project Rules Applied, Ready to Implement (+31 more)

### Community 34 - "InterviewTitleBar.tsx"
Cohesion: 0.16
Nodes (10): Layout & UX Design, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger(), InterviewTitleBar() (+2 more)

### Community 35 - "interviews.services.ts"
Cohesion: 0.17
Nodes (12): ANSWER_TIMEOUT_MS, DEFAULT_START_VALUES, START_TIMEOUT_MS, answerFormSchema, answerRequestSchema, answerResponseSchema, interviewSchema, startInterviewFormSchema (+4 more)

### Community 37 - "Feature: Interviews Answer Flow (submit answer, reaction, completion)"
Cohesion: 0.13
Nodes (16): Testing Strategy, Acceptance Criteria, Blockers, Constraints, Edge Cases, Feature: Interviews Answer Flow (submit answer, reaction, completion), Functional, Goal (+8 more)

### Community 38 - "Implementation: Interviews Chat Layout"
Cohesion: 0.07
Nodes (32): Baseline Failures, Changes Made, Current Step, Deviations from Plan, Follow-up: chat-assistant styling (after review), Follow-up: conversation title with a menu (after review), Implementation: Interviews Chat Layout, Links (+24 more)

### Community 39 - "interviews.types.ts"
Cohesion: 0.12
Nodes (16): RESYNC_ERROR_CODES, interviewTypeSchema, levelSchema, roleSchema, transcriptItemSchema, AnswerErrorResult, AnswerFormValues, InterviewType (+8 more)

### Community 40 - "breadcrumb.tsx"
Cohesion: 0.35
Nodes (9): Breadcrumb(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Breadcrumbs(), BreadcrumbsProps (+1 more)

### Community 42 - "AnswerComposer.tsx"
Cohesion: 0.17
Nodes (11): @hookform/resolvers, AnswerComposerProps, ANSWER_COUNTER_FROM, INTERVIEWER_SLOW_LABEL, MIN_THINKING_MS, RESYNC_MESSAGE, REVEAL_DELAY_MS, THINKING_SLOW_AFTER_MS (+3 more)

### Community 43 - "Implementation: Interviews Answer Flow"
Cohesion: 0.14
Nodes (13): Baseline Failures, Changes Made, Deviations from Plan, Implementation: Interviews Answer Flow, Known Issues, Links, Open Questions, Skills Consulted During Implementation (+5 more)

## Knowledge Gaps
- **328 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+323 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 403 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `requireUser`, `package.json`, `InterviewTitleBar.tsx`, `Cuewise FE — Project Instructions`, `Implementation: Interviews Chat Layout`, `InterviewConfigForm`, `breadcrumb.tsx`, `AnswerComposer.tsx`, `Button`, `useMutationCallbacks`, `AuthCard`, `ActiveInterview.tsx`, `sidebar.tsx`, `lucide-react`, `Implementation: Interviews Setup UI (foundation)`, `interviews/page.tsx`, `InterviewConfigForm.tsx`, `auth.types.ts`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Why does `useMutationCallbacks()` connect `useMutationCallbacks` to `requireUser`, `proxy`, `Cuewise FE — Project Instructions`, `Implementation Steps`, `AnswerComposer.tsx`, `Feature: Interviews Setup UI (foundation)`, `auth.types.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `InterviewTitleBar.tsx`, `InterviewConfigForm`, `Implementation Steps`, `AnswerComposer.tsx`, `useMutationCallbacks`, `AuthCard`, `ActiveInterview.tsx`, `sidebar.tsx`, `lucide-react`, `InterviewConfigForm.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `useMutationCallbacks()` (e.g. with `Architecture: Modular, Feature-Driven` and `Data Fetching (TanStack Query)`) actually correct?**
  _`useMutationCallbacks()` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `Part A: Chat core` (e.g. with `ActiveInterview()` and `InterviewsContainer()`) actually correct?**
  _`Part A: Chat core` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `Implementation Steps` (e.g. with `GET()` and `AuthForm()`) actually correct?**
  _`Implementation Steps` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _328 weakly-connected nodes found - possible documentation gaps or missing edges._