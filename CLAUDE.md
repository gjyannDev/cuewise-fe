# Cuewise FE — Project Instructions

@AGENTS.md

## About the Project
- This repo is the **web frontend for Cuewise**, an **AI interview coach**. The API lives in `../cuewise-be` (FastAPI, `/api/v1`).
- It is a **learning project**: favor clarity and explaining the *why* (trade-offs, concepts) over clever shortcuts.

Next.js 16 (App Router) + React 19 + TypeScript. Tailwind v4 + shadcn/ui (Radix), TanStack Query, axios, react-hook-form + zod, zustand, sonner. Code lives in `src/`.

**This is Next.js 16, not the version in your training data.** Before writing Next-specific code (routing, `proxy.ts`, Route Handlers, `cookies()`, `params`/`searchParams`, caching), read the relevant guide in `node_modules/next/dist/docs/` and heed deprecations. Notable: `middleware.ts` is now `proxy.ts`; `params`, `searchParams` and `cookies()` are async.

## Git Rules (STRICT)
- **NEVER commit, push, or open PRs** unless the user explicitly asks in that message.
- Don't stage files, amend, rebase, or reset either. Leave all changes in the working tree for the user to review.

## Tooling
- **Always use lean-ctx** for project work:
  - `ctx_compose` to orient first; `ctx_read` (not native Read) for exploration; `ctx_search` instead of Grep; `ctx_glob` instead of Glob; `ctx_tree` instead of ls/find; `ctx_shell` for commands.
  - Edits: `ctx_read(mode="anchored")` → `ctx_patch`. Native `Read` only for the edit gate.
- **Always use graphify**:
  - Before answering codebase questions, if `graphify-out/graph.json` exists run `graphify query "<question>"` (also `graphify path "<A>" "<B>"`, `graphify explain "<concept>"`).
  - Use `graphify-out/wiki/index.md` for broad navigation; read `GRAPH_REPORT.md` only for architecture reviews.
  - **After finishing a task that changes code, run `graphify update .`** to keep the graph current.
- **shadcn/ui**: add missing primitives with the CLI (`npx shadcn@latest add <component>`), never hand-write them. Don't edit `src/components/ui/*` for one-off styling; wrap or pass `className` instead.

## Architecture: Modular, Feature-Driven
Data flow: **service → query (hook) → component**.

```
src/
  app/                         # routes only: pages, layouts, Route Handlers, loading/error files
    (group)/<route>/
      page.tsx                 # thin: read params/searchParams, compose feature components
      _components/             # route-private components (not shared elsewhere)
    api/                       # Route Handlers (BFF to cuewise-be)
    providers.tsx              # client providers (QueryClientProvider, Toaster, ...)
  components/ui/               # shadcn primitives (generated; don't put feature logic here)
  shared/                      # reusable, feature-agnostic building blocks
    forms/                     # TextField, PasswordField, SelectField, CheckboxField, TextAreaField
    ui/                        # composed UI pieces (BreadCrumbs, ...)
  hooks/                       # shared hooks (use-mutation-callback, ...)
  lib/
    api/                       # apiClient wrapper
    config/                    # axios clients, query client, api error helpers
    utils.ts                   # cn() and other generic helpers
  modules/
    <feature>/                 # e.g. auth/
      services/<feature>.services.ts   # HTTP calls only (via apiClient/API). Parse responses with zod. No React.
      queries/<feature>.keys.ts        # query-key factory (`<feature>Keys.all`, `.detail(id)`, ...)
      queries/<feature>.queries.ts     # useQuery/useMutation hooks wrapping the service. No JSX.
      schemas/<feature>.schema.ts      # zod schemas (forms, requests, responses)
      types/<feature>.types.ts         # types, inferred via z.infer where possible
      stores/<feature>.store.ts        # zustand, client-only UI state (never server data)
      components/                      # feature components (dumb + container)
      hooks/ / utils/ / constants.ts   # feature-local helpers, as needed
tests/                         # all tests, mirroring src/ (e.g. tests/modules/auth/...); helpers in tests/helpers/
```

Layer rules:
- **Services** are the only place that talks HTTP. Plain async functions/classes, no hooks, no toasts, no routing.
- **Queries** are the only place components get server data from. They own query keys, cache updates (`setQueryData`, `invalidateQueries`) and pass toasts/side effects via `useMutationCallbacks`.
- **Components** never import services, axios or `apiClient` directly, and never build query keys inline.
- Layers only call downward: component → query → service. Never skip a layer.
- Features don't import each other's internals (services/stores); use the other feature's exported queries/hooks.
- Feature-agnostic code goes in `shared/`, `hooks/` or `lib/`, never duplicated across modules.

## Components
- **Keep components dumb (presentational).** They receive data and callbacks via props and render. No data fetching, no service calls, no business logic.
- When something needs data, split it: a small **container** (or the page) calls the query hooks and passes results down to presentational components.
- Move non-trivial logic out of JSX: derived values into `utils/` (pure functions), stateful logic into a custom hook (`use-<thing>.ts`).
- **Reuse before creating.** Check `src/components/ui/`, `src/shared/` and the feature's `components/` first. If you write the same UI twice, extract it to `shared/`.
- Default to **Server Components**; add `"use client"` only where interactivity, hooks or browser APIs are needed, and push it as far down the tree as possible.
- One component per file, `PascalCase.tsx`, named export. Props typed with a `type <Name>Props`.
- Style with Tailwind classes only; merge classes with `cn()` from `@/lib/utils`. Use theme tokens (`text-muted-foreground`, `bg-card`, ...), not hardcoded colors.
- Always handle **loading, empty and error** states for data-driven UI.

## Forms
- Always **react-hook-form + `zodResolver`** with a schema from `modules/<feature>/schemas/`. Never hand-roll form state with `useState`.
- **Always use the shared field components** in `src/shared/forms/` (`TextField`, `PasswordField`, `SelectField`, `CheckboxField`, `TextAreaField`) — pass `register` + `error`. Add a new shared field there if one is missing instead of inlining inputs.
- Wrap fields in `FieldSet`/`FieldGroup` (`components/ui/field.tsx`); disable the fieldset and the submit button while the mutation is pending.
- Submit through a mutation hook. Map backend field errors (422 / 409) to `setError`; show everything else as a toast.
- Reuse one form component for create/edit (or sign in/sign up) via a `mode` prop rather than duplicating forms.

## Data Fetching (TanStack Query)
- Every query key comes from the feature's key factory. Invalidate/update by key after mutations; don't refetch manually.
- Use the shared `getQueryClient()` defaults (no retry on 4xx, sensible `staleTime`); override per query only with a reason.
- Server data lives in the Query cache. **Zustand is for client-only UI state** (modals, filters, wizard steps), never a copy of server data.
- Toasts for mutations go through `useMutationCallbacks` (`src/hooks/use-mutation-callback.ts`), with messages from the parsed backend error.
- Errors: normalize with the helpers in `src/lib/config/api.helper.ts`; never show raw error objects or stack traces.

## Security & Auth
- **Auth is a BFF**: the JWT lives only in an **httpOnly cookie** set by Next.js Route Handlers. The browser calls `/api/*` on Next.js only and never calls FastAPI directly.
- Never store tokens in `localStorage`, `sessionStorage`, zustand, the Query cache, or anything JS can read. Never log tokens or PII.
- Server-only code (backend client, cookie helpers, current-user lookup) uses `import "server-only"` and a `.server.ts` suffix; never import it from a `"use client"` file.
- Env: server secrets/URLs without the `NEXT_PUBLIC_` prefix (e.g. `API_URL`). Only truly public values get `NEXT_PUBLIC_`. Never hardcode URLs or secrets; never commit `.env*` (keep `.env.example` updated).
- Validate all external data with zod: form input, API responses, `searchParams`. Sanitize redirect targets (`next`) to same-origin relative paths.
- Route protection lives in `src/proxy.ts` (it must sit at the same level as `app/`; a root-level `proxy.ts` is silently ignored), but the backend is the authority; also check the user on the server (`requireUser()`) for protected pages.
- Never use `dangerouslySetInnerHTML` with user or AI-generated content.

## TypeScript & Code Style
- `strict` TS. No `any` (use `unknown` + narrowing); no non-null `!` unless justified. Prefer `type` over `interface` unless extending.
- Infer types from zod schemas (`z.infer`) instead of duplicating them.
- Imports via the `@/` alias, not deep relative paths (`../../..`).
- File naming: components `PascalCase.tsx`; hooks `use-kebab-case.ts`; others `kebab-case` or `<feature>.<kind>.ts` (`auth.services.ts`, `auth.queries.ts`, `auth.schema.ts`).
- **DRY** and **separation of concerns**: one responsibility per file/function. Match surrounding style, naming and comment density. No speculative abstractions (YAGNI).
- Accessibility: semantic HTML, labels linked to inputs (`htmlFor`/`id`), keyboard-usable controls, `aria-*` where Radix doesn't cover it, visible focus states.
- Performance: avoid unnecessary client components and effects; derive state instead of syncing it with `useEffect`; use `next/image` and `next/font` (`src/lib/font.ts`).

## AI Features (UI side)
- Treat AI output as **untrusted text**: render it as text/markdown with a safe renderer, never raw HTML.
- Show clear pending/streaming states and allow retry; never block the whole page on a slow model call.
- Don't send more personal data (resumes, answers) than the feature needs.

## Testing
- Vitest (`npm test`). Cover schemas, pure utils/helpers, `proxy()` and Route Handlers (mock backend, `fetch`, `cookies()`).
- **All tests live in the root `tests/` folder and mirror `src/` exactly**: same folders, same file name plus `.test.ts`. Never put tests or test helpers inside `src/`.
  - `src/modules/auth/schemas/auth.schema.ts` → `tests/modules/auth/schemas/auth.schema.test.ts`
  - `src/app/api/auth/session-expired/route.ts` → `tests/app/api/auth/session-expired/route.test.ts`
  - `src/proxy.ts` → `tests/proxy.test.ts`
- Shared test helpers (fakes, builders, mocks) go in `tests/helpers/`, not in a mirrored folder.
- Import the code under test with `@/` and helpers with `@tests/` (both aliases are set in `tsconfig.json` and `vitest.config.ts`); no deep relative imports.
- Run tests after changes and report real results.

## Common Commands
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Tests: `npm test`
- Add shadcn component: `npx shadcn@latest add <component>`

## Workflow / Definition of Done
1. Orient with graphify + `ctx_compose` before changing anything; check for reusable components/hooks/utils first.
2. Implement within service → query → component (schema/types/utils included).
3. Run typecheck, lint and tests (and `npm run build` for routing/config changes).
4. Run `graphify update .`.
5. Summarize what changed and what's left. **Do not commit or push.**

## Don'ts
- Don't commit, push, stage, or open PRs unless explicitly asked.
- Don't call services/axios from components, or put queries/mutations inside presentational components.
- Don't duplicate form fields, UI primitives or helpers that already exist in `shared/`, `components/ui/`, `hooks/` or `lib/`.
- Don't add dependencies without saying why (prefer already-installed: zod, axios, TanStack Query, zustand, react-hook-form, radix, sonner).
- Don't hardcode API URLs, secrets or copy that belongs in config/constants.
- Don't swallow errors silently or show raw error text to users.
- Don't over-engineer: ship the minimum that works, then iterate.
