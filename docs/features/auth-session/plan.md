# Implementation Plan: Auth Session (cookie-based BFF)

## Overview
Make the Next.js server own the cuewise-be JWT in an httpOnly cookie, expose auth to the UI through the services -> queries -> components pattern, protect routes by role in `proxy.ts`, and ship one `AuthForm` for sign in and sign up.

## Architecture & Design
Two HTTP clients. The **browser** client (`API` in `@/lib/config/axios.client`, base `/api`) is what services use. It only reaches Next.js Route Handlers. The **server-only** backend client (moved from today's `axios.client.ts`) is used by those handlers and by server code; it reads the cookie and calls FastAPI.

Next.js owns `/api/auth/login`, `/api/auth/register`, `/api/auth/logout` and `/api/auth/session-expired`; a catch-all `/api/[...path]` forwards everything else to `/api/v1`. Specific routes win over the catch-all, so service paths mirror backend paths (`/auth/me` -> forwarded).

Pure, isomorphic session helpers (`src/modules/auth/session/`) hold the cookie name, role routing, safe-`next` logic and the token payload reader. `proxy.ts`, Route Handlers and `AuthForm` all use them. A server-side current-user lookup (React `cache`, one `/auth/me` per request) is the authoritative check. When it finds a dead session it redirects to `/api/auth/session-expired`, because a Server Component render can't delete cookies.

## Spec Requirements -> Implementation
- Test runner, env example, `server-only` (AC16 support, AC15 env) -> Step 1
- zod schemas + inferred types; API error parsing (AC8, AC12 support) -> Step 2
- Session helpers: cookie, roles, safe next, token payload (EC2, EC4, EC7, EC8 logic) -> Step 3
- Server-only backend client + cookie helpers (AC14) -> Step 4
- `/api/auth/login|register|logout` (AC1-AC4, EC13, EC14, EC16, EC17, EC20) -> Step 5
- `/api/[...path]` forwarder (AC5, EC6, EC10-EC13) -> Step 6
- `proxy.ts` (AC6, EC1-EC4, EC7, EC19, EC21) -> Step 7
- Current-user lookup + session-expired handler (AC7, EC5) -> Step 8
- Browser client, `api.client.ts` fix (AC11, AC15, EC6) -> Step 9
- Service, key factory, query hooks (AC8, AC9) -> Step 10
- Providers, `useMutationCallbacks` (AC12, AC13) -> Step 11
- `AuthForm`, `/signin`, `/signup`, expired toast (AC10, AC11, EC14-EC18, EC8, EC2) -> Step 12
- Lint, typecheck, build, manual end-to-end (AC14, AC16, EC9) -> Step 13

## Implementation Steps
1. **Tooling.** Add `vitest` as a dev dependency and an `npm test` script. Add `vitest.config.ts`: node environment, `@/` alias to `src/`, `server-only` aliased to Next's empty module, `next/headers` mocked per test. Add `.env.example` with `API_URL=http://localhost:8000/api/v1`. — Test: skip.
2. **Schemas and types** (`src/modules/auth/schemas/auth.schema.ts`, `types/auth.types.ts`).
   - Schemas: sign-in form, sign-up form (password 8-128; `confirmPassword` must match, error on that field), login/register request, current profile (`id` UUID, email, role enum `admin|user`, permissions array), backend error body. Types use `z.infer`.
   - In `src/lib/config/api.helper.ts`, add a function that turns an axios error into `{status, code, message, fieldErrors}`. It maps 422 `details` (`body.email` -> `email`) and 409 to field errors, and keeps `normalizeError`.
   - Test: first. Seam: `safeParse` on each schema, and the error-parsing helper. Slices: valid sign-in; bad email; sign-up mismatch errors on `confirmPassword`; password 7 and 129 rejected; profile rejects a non-UUID id or unknown role; 422 details become field errors; 409 maps to email; non-axios error falls back to a generic message.
3. **Session helpers** (`src/modules/auth/session/auth-session.ts`, isomorphic, no Next imports).
   - Constants: `ACCESS_TOKEN_COOKIE`, `ACCESS_TOKEN_MAX_AGE_SECONDS` (3600), `PUBLIC_AUTH_ROUTES` (`/signin`, `/signup`).
   - Functions: `getRoleLandingRoute` (admin `/admin`, otherwise `/`), `canRoleAccessRoute` (`/admin` and below need admin), `isPublicAuthRoute`, `resolveSafeNext(next, role)`, `readTokenPayload(token)` (base64url-decodes the payload; returns `{sub, role, exp}` or null; never verifies), `isTokenExpired(payload, now)`.
   - Test: first. Seam: those exported functions. Slices: landing per role; `/admin`, `/admin/x` and `/administrator` rules; `next` values `/a?b=1` kept, `//evil.com`, `https://x`, `evil`, `/\evil` and empty rejected; garbage token -> null; expired vs valid `exp`.
4. **Server backend client and cookie helpers.**
   - Move today's `axios.client.ts` contents to `src/lib/config/backend.client.ts` with `import "server-only"`. It keeps the cookie-reading interceptor and `SessionExpiredError`, and uses the cookie constant from Step 3.
   - Add `src/modules/auth/session/auth-cookie.server.ts` (`server-only`) with set and clear helpers that apply the cookie flags.
   - Test: skip (covered through Steps 5, 6 and 8).
5. **Auth Route Handlers** (`src/app/api/auth/{login,register,logout}/route.ts`).
   - login: zod-validate the body, backend login, set the cookie, call `/auth/me` with the new token, return the profile (200).
   - register: validate, backend register, then the login flow, returning 201 with the profile. If the auto-login fails, return 502 with an error code the form can recognise (EC17).
   - logout: clear the cookie and return 204.
   - On backend errors, pass the status and `{error}` body through unchanged and set no cookie. On network failure or timeout, return 503 with an `{error}` body. Invalid JSON in the request returns 422 in the backend error shape.
   - Test: first. Seam: exported `POST` handlers called with a `Request`; backend client and cookie helpers mocked. Slices: login success sets the cookie with the right flags and the body has no token; 401 passthrough with no cookie; 422 passthrough; backend down -> 503; register success; 409 passthrough; register OK but login fails -> EC17 response; logout when signed out -> 204.
6. **Forwarder** (`src/app/api/[...path]/route.ts`: GET, POST, PUT, PATCH, DELETE).
   - Uses `fetch` to `API_URL` with the joined path segments and the query string. Forwards the JSON body and `Content-Type`.
   - Sets `Authorization` only from the cookie and drops any browser-sent one. Returns the backend status, body and `content-type`.
   - Clears the cookie on 401 with a `TOKEN_*` code. Returns 404 for `auth/login`, `auth/register` and `auth/logout`, which the dedicated routes already own; this is a guard. Returns 503 on network failure.
   - Test: first. Seam: exported handlers with `fetch` and cookies mocked. Slices: GET with query passes through and gets the bearer from the cookie; POST body forwarded; browser `Authorization` ignored; no cookie -> no header; 401 TOKEN_EXPIRED clears the cookie and passes the body; 403 and 500 keep the cookie; reserved auth paths -> 404 with no fetch.
7. **`proxy.ts`** (project root, reference structure: `proxy`, `redirectTo`, `config.matcher` excluding `api`, `_next/static`, `_next/image`, favicon and image files).
   - Reads the cookie, then `readTokenPayload` and `isTokenExpired`.
   - Signed out or garbage token on a protected route -> `/signin?next=`.
   - Expired token on a protected route -> clear the cookie and redirect with `expired=1`.
   - Valid session on a public auth route -> safe `next` or the landing route.
   - Role not allowed -> landing route.
   - Test: first. Seam: `proxy(new NextRequest(url, {headers: cookie}))`. Slices: EC1 with path and query preserved in `next`; EC4 expired; garbage token; EC3 with and without a safe `next`; EC7 user on `/admin`; admin on `/admin` passes; signed-in user on `/` passes.
8. **Current-user lookup and session-expired handler.**
   - `src/modules/auth/session/current-user.server.ts`: `getCurrentUser()` is wrapped in React `cache` and calls `/auth/me` through the backend client. It returns the zod-parsed profile or null when there is no cookie. `requireUser()` redirects on `SessionExpiredError` to `/api/auth/session-expired?next=<path>`.
   - `src/app/api/auth/session-expired/route.ts`: clears the cookie and redirects to `/signin?next=<safe>&expired=1`.
   - Use `requireUser()` in `src/app/page.tsx` as the first protected page, with no UI change.
   - Test: first for the handler; after for the lookup. Seam: the session-expired `GET` handler. Slices: clears the cookie; keeps a safe `next`; drops an unsafe `next`. The lookup is checked in Step 13: one `/auth/me` per render, and the EC5 redirect.
9. **Browser client.**
   - Rewrite `src/lib/config/axios.client.ts` as the browser `API` (`baseURL: "/api"`, timeout, JSON). On 401 with a `TOKEN_*` code it clears the query cache and sets `window.location` to `/signin?next=<current path>&expired=1`.
   - Add `src/lib/config/query-client.ts`: `getQueryClient()` returns a new client on the server and a singleton in the browser. Defaults: no retry on 4xx, `staleTime` 60 s.
   - Fix `src/lib/api/api.client.ts` to return `res.data` (no `{data}` unwrap).
   - Test: after (manual in Step 13).
10. **Auth module wiring.**
    - `services/auth.services.ts`: `AuthService` with `login`, `register`, `logout` and `me`, calling `API` and zod-parsing responses into profiles.
    - `queries/auth.keys.ts`: `authKeys` with `all`, `login`, `register`, `logout` and `currentProfile`.
    - `queries/auth.queries.ts`: `useSignInMutation` and `useSignUpMutation` call `setQueryData(currentProfile)`. `useLogoutMutation` calls `removeQueries(authKeys.all)` and then routes to `/signin`. `useCurrentProfileQuery` uses `staleTime` but stops retrying after a 401.
    - Test: skip (thin wiring; behavior checked in Step 13).
11. **Providers and mutation callbacks.**
    - `src/app/providers.tsx` (client component): `QueryClientProvider` from `getQueryClient()`, plus `Toaster`. Wrapped inside the existing `TooltipProvider` in `layout.tsx`.
    - `src/hooks/use-mutation-callback.ts`: `useMutationCallbacks({entityName})` returns `buildCallbacks(action, entity, {errorMessage, successMessage?})`. Its `onSuccess` and `onError` show sonner toasts, using the parsed backend message (Step 2 helper) or the fallback.
    - Test: skip.
12. **AuthForm and pages (simple first version; the user will polish the UI later).**
    - UI rules (user decision):
      - Keep it simple and functional; no custom design work.
      - Style only with Tailwind classes.
      - Build only from shadcn components already in the repo: `Card` (`card.tsx`), `Button`, `FieldSet`/`FieldGroup` (`field.tsx`), and the sonner `Toaster`. Reuse the shared form fields `src/shared/forms/TextField.tsx` and `PasswordField.tsx`.
      - Don't create new UI primitives or add shadcn components unless one is missing; if one is, add it with the shadcn CLI rather than hand-writing it.
      - Layout: a centered `Card` with a title, the form and a mode-switch link, inside the existing `(auth)/layout.tsx`.
    - `AuthForm` (`src/app/(auth)/signin/_components/AuthForm.tsx`) takes `mode`, using the reference structure. It uses react-hook-form with `zodResolver` on the Step 2 schema for the mode, `TextField`, `PasswordField`, and `FieldSet` disabled while pending. It also has a pending button label and a link to the other mode that keeps `next`.
    - On success it calls `router.replace(resolveSafeNext(next, profile.role))`.
    - On error, field errors go through `setError`; anything else is a toast via `buildCallbacks`. Invalid credentials -> "Invalid email or password", with the password cleared. Server or network failure -> the generic message. The EC17 code -> a toast and a redirect to `/signin` keeping `next`.
    - Pages: `/signin` renders mode `signin` and shows the expired toast once when `expired=1`. `/signup` renders mode `signup`. Both read `next` from `searchParams`, which is async.
    - Test: after (manual browser check in Step 13).
13. **Wrap-up and verification.**
    - Run `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run build`.
    - Build check: no client chunk contains `backend.client` or `next/headers` code.
    - Manual end-to-end against the running cuewise-be (started with a throwaway `JWT_SECRET_KEY`):
      - signup -> lands on `/`, and the cookie is httpOnly;
      - sign out (via `useLogoutMutation` in devtools or a temporary button that is removed afterwards);
      - signin with `?next=`, plus the unsafe `next` cases;
      - admin -> `/admin` (404 expected);
      - user -> `/admin` redirects to `/`;
      - a wrong password shows the toast;
      - a duplicate email shows a field error;
      - edit the cookie value to garbage -> sent to signin;
      - delete the user in the DB with a live cookie -> expired flow (EC5);
      - DevTools shows no token in JS, responses or the React Query cache;
      - the Network tab shows the browser never calls :8000.
    - Do not commit.
    - Test: skip.

## Affected Files & Patterns
- New:
  - Config and tooling: `vitest.config.ts`, `.env.example`, `proxy.ts`.
  - Route Handlers: `src/app/api/auth/{login,register,logout,session-expired}/route.ts`, `src/app/api/[...path]/route.ts`.
  - Auth module: `src/modules/auth/{schemas,types,services,queries,session}/*`.
  - Shared: `src/lib/config/{backend.client,query-client}.ts`, `src/app/providers.tsx`, `src/hooks/use-mutation-callback.ts`.
  - Pages: `src/app/(auth)/signup/page.tsx`.
  - Tests in the root `tests/` folder, mirroring `src/` (helpers in `tests/helpers/`); moved there after delivery per the updated CLAUDE.md.
- Changed: `src/lib/config/axios.client.ts` (now browser-only), `src/lib/api/api.client.ts`, `src/lib/config/api.helper.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/(auth)/signin/page.tsx`, `AuthForm.tsx`, `package.json`.
- Patterns: the user's references for the service class, key factory, query hooks, `AuthForm` and `proxy.ts`; the existing `TextField` and `PasswordField` (`register` + `error`); Next 16 docs for `proxy.ts`, Route Handlers (`params` is a Promise; `RouteContext`), async `cookies()` and `server-only`.
- Risks:
  - `axios.client.ts` changes role: anything importing it on the server must switch to `backend.client` (only `api.client.ts` imports it today).
  - `next/headers` must be mocked in Vitest.
  - The `/admin` landing route 404s until those pages exist.
  - The role claim can be stale (EC9; accepted, since the backend enforces).

## Deviations recorded at /implement start (project CLAUDE.md, added after planning)
- Server-only modules use a `.server.ts` suffix: `src/lib/config/backend.client.server.ts`, `src/modules/auth/session/auth-cookie.server.ts`, `src/modules/auth/session/current-user.server.ts`.
- Components stay presentational: `AuthForm` owns only react-hook-form state and receives `mode`, `isPending` and an `onSubmit` that resolves to backend field errors (or nothing). A client container `AuthFormContainer` calls the mutation hooks, routes and shows toasts. Named exports.
- `AuthForm` is shared by `/signin` and `/signup`, so both components live in `src/app/(auth)/_components/` (private to the auth route group). The empty `src/app/(auth)/signin/_components/AuthForm.tsx` is replaced by it.
- `next` and `expired` search params are parsed with a zod schema (CLAUDE.md: validate `searchParams`).

## Deviations recorded during /implement
- Vitest 4.1.12, not 5.x: Vitest 5 needs `@types/node` >= 22 and the project pins ^20.
- `proxy.ts` lives in `src/proxy.ts`, not the project root: Next only detects it at the same level as `app/` (here `src/app`). At the root it was silently ignored (caught by the end-to-end run).
- `API_URL` is validated with zod on use (`src/lib/config/env.server.ts`) so a malformed value fails with a clear error instead of every backend call returning 503 (the local `.env` had `localhost:8000`).
- Cache Components is on (`cacheComponents: true`), so pages read `searchParams` / cookies inside `<Suspense>` (signin, signup, `/`); the static shells prerender and the request-time part streams in.
- `authRouteHref()` and `toSafeRelativePath()` added to the session helpers (role-agnostic safe `next`, needed by `session-expired` and the mode-switch link).
- `isSessionErrorCode` moved to `api.helper.ts` so the browser client can use it.
- Forwarder also rejects `.`/`..` path segments and survives non-JSON 401 bodies (code-derived cases).

## Testing Strategy
- Framework & command: Vitest (new dev dependency), run with `npm test`. Also `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Confirmed seams (user chose this option): zod schemas and the error-parsing helper, session helper functions, `proxy()`, and the exported Route Handler functions (`POST`/`GET`/...) with the backend, `fetch` and `cookies()` mocked. UI and the full flow are checked manually.

| Spec ID | Step | Test mode | Notes |
|---|---|---|---|
| AC1 | 5 | first | cookie flags, no token in body |
| AC2, EC13, EC14, EC16 | 5 | first | passthrough, 503 |
| AC3, EC17 | 5 | first | register + auto-login |
| AC4, EC20 | 5 | first | logout idempotent |
| AC5, EC6, EC10, EC11, EC12 | 6 | first | forwarder |
| AC6, EC1, EC3, EC4, EC7, EC21 | 7 | first | proxy |
| EC2, EC8 | 3 | first | resolveSafeNext, landing |
| AC7, EC5 | 8 | first + after | handler tested; lookup manual |
| AC8, AC9 | 10 | skip | wiring, manual |
| AC10, EC14-EC18 | 12 | after | manual browser |
| AC11 | 9, 12 | after | manual expired flow |
| AC12, AC13 | 11 | skip | manual |
| AC14 | 4, 13 | skip | build check + DevTools |
| AC15 | 1, 9 | skip | env + api.client |
| AC16 | 13 | skip | lint/tsc/build |
| EC9 | 13 | after | stale role: backend still denies |
| EC15 | 2 | first | confirmPassword mismatch |
| EC19 | 7 | first | covered by the no-cookie slice |

- Must verify, not assume: `import "server-only"` resolves with no package installed (Next aliases it) and fails the build when imported by a client component; route precedence of `/api/auth/login` over `/api/[...path]`; `proxy.ts` can read and delete the httpOnly cookie; sonner `Toaster` works without a next-themes `ThemeProvider` (defaults to `system`); the backend's 422 `details` field names match the form fields.
- Open questions: none.
- Known baseline failures: none (no tests exist yet).

## Blockers & Resolutions
- No blockers.
- No test runner -> Vitest (user-chosen).
- Server Components can't delete cookies -> EC5 goes through the `/api/auth/session-expired` handler.
- Reference code assumed refresh, check-email and a token store -> replaced as decided in the spec.

## Trade-offs & Rationale
- Route Handlers instead of Server Functions for login, register and logout: they fit the service -> mutation pattern and return clean HTTP statuses.
- `fetch` in the forwarder, axios elsewhere: a passthrough needs the raw status and body, and `fetch` does that with no interceptor surprises.
- Decoding the token in `proxy.ts` (no verification): no extra cookies, and expiry is known exactly. It's safe because the backend verifies every call.
- React Query as the only client copy of the profile: no store to keep in sync.
- Separate `session-expired` handler: the only legal place to clear a cookie after a failed render.

## Project Rules Applied
- `AGENTS.md`: Next 16 docs read for `proxy.ts`, Route Handlers, `cookies()`, `server-only`.
- User pattern: services -> queries (with a key factory) -> components; zod everywhere; `src/modules/auth/*` layout.
- User UI rule: simple first pass, Tailwind + existing shadcn components and shared form fields only (Step 12).
- Backend contract and the CLAUDE.md security stance (default-deny, no token exposure).

## Skills Consulted
| Skill | Contribution |
|-------|-------------|
| lean-ctx (shell) | inventoried the FE: empty AuthForm, proxy.ts and module folders; sonner installed; no test runner |
| Next.js bundled docs | proxy runtime and matcher, Route Handler params and RouteContext, cookies() limits, server-only alias |
| grill-me | test approach and seams (answered) |
| ponytail | no auth store, no hint cookies, no JWT library, one test dependency |
| security-review | inline: open redirect, header spoofing, token exposure, server-only boundary |
| graphify | queried; graph only covers package.json, no findings |

## Ready to Implement
- All spec requirements mapped to steps
- Every step has a Test tag; every AC and EC mapped
- Affected files identified
- Blockers resolved, edge cases handled
- Trade-offs documented
- No deviations from spec
