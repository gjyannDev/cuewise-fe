# Feature: Auth Session (cookie-based, Next.js as backend-for-frontend)

## Problem
cuewise-be authenticates with a short-lived JWT sent as a bearer header and deliberately does not set or read cookies. cuewise-fe has no way yet to sign users in or out, keep the token safe in the browser, know who is signed in, or keep signed-out users away from app pages. Browser JavaScript must never hold the token, and the browser must never call FastAPI directly (the API has no CORS).

## Goal
The Next.js server owns the session: it exchanges credentials for the backend token, stores it in an httpOnly cookie, attaches it to every backend call, and protects routes by role. The UI follows the project's **services -> queries (TanStack Query) -> components** pattern. Measured by: a signed-out visitor to any app page lands on `/signin`; after signing in they reach the page they asked for (or their role's landing page); an expired token sends them back to `/signin` with an "expired" notice; no client-side code can read the token.

## Project Conventions
- Rule files consulted: `AGENTS.md` (no `.claude/` directory). It requires following the Next.js 16 docs bundled in `node_modules/next/dist/docs/`.
- Next.js 16 constraints: request interception is `proxy.ts` at the project root (exported `proxy` function + `config.matcher`); `cookies()` is async; cookies can only be set or deleted in Server Functions and Route Handlers.
- **Module pattern (user-defined, mandatory):** `src/modules/<feature>/` with
  - `services/` — a class (e.g. `AuthService`) whose methods call the API through `API` from `@/lib/config/axios.client` and return `response.data`; exported as a singleton (`authService`).
  - `queries/` — TanStack Query hooks (`useXxxMutation`, `useXxxQuery`) that call the service, plus a **query key factory** (`authKeys`: `all`, then derived keys like `login()`, `currentProfile()`).
  - `schemas/` — **zod** schemas for every form and every API request/response shape.
  - `types/` — TypeScript types inferred from the zod schemas.
  - `stores/` — Zustand UI state when needed (none for auth; see Requirements).
  - Components consume queries only; they never call services or axios directly.
- **zod everywhere:** form validation (via `@hookform/resolvers/zod`), request bodies, and API responses are validated/typed with zod.
- Existing UI to reuse: `src/shared/forms/TextField.tsx`, `src/shared/forms/PasswordField.tsx` (react-hook-form `register` + `error` props), `src/components/ui/{button,field,sonner}.tsx` (`FieldSet`, `FieldGroup` exist). sonner and next-themes are installed.
- Graphify (`graphify-out/`) only covers package.json dependencies; no code findings for this domain.
- Backend contract (cuewise-be, verified in its code and tests):
  - `POST /api/v1/auth/login` `{email, password}` -> 200 `{access_token, token_type: "bearer"}`; 401 `INVALID_CREDENTIALS`; 422 `VALIDATION_ERROR`.
  - `POST /api/v1/auth/register` `{email, password}` (password 8-128) -> 201 `{id, email}`; 409 `CONFLICT` with `details.field = "email"`; 422.
  - `GET /api/v1/auth/me` -> 200 `{id (UUID string), email, role ("admin" | "user"), permissions[]}`.
  - Errors: `{error: {code, message, details, request_id}}`; 422 `details` is a list of `{field: "body.<name>", issue, type}`.
  - Session failures: 401 with code `TOKEN_EXPIRED`, `TOKEN_INVALID` or `TOKEN_MISSING`. Token lifetime 60 minutes. The token's payload carries `sub`, `role`, `exp`. No refresh, logout or check-email endpoints. Responses are plain objects (no `{data}` wrapper).

## User Flow
1. Signed-out visitor opens any app page -> `proxy.ts` sends them to `/signin?next=<that page>`.
2. On `/signin`, `AuthForm` (mode `signin`) collects email + password. The sign-in mutation calls the Next.js login handler, which calls the backend, stores the token in the httpOnly cookie and returns the user's profile. The form then navigates to the safe `next`, or the role's landing route (admin -> `/admin`, user -> `/`).
3. On `/signup`, `AuthForm` (mode `signup`) collects email, password and confirm password; the account is created and the user is signed in the same way.
4. Pages and client components load data; client components go through `/api/*` (Next.js forwards to FastAPI with the cookie's token). The current profile comes from `useCurrentProfileQuery` (cached in React Query).
5. A user visiting a route their role can't access (e.g. `/admin` as `user`) is sent to their landing route.
6. When the token expires, the next request fails; the cookie is cleared and the user lands on `/signin?next=<page>&expired=1`, where a toast says the session expired.
7. Sign out (mutation; button comes with the app shell later) clears the cookie and the profile cache, then goes to `/signin`.

## Requirements

### Functional
- **Cookie:** one httpOnly cookie holds the backend access token: `httpOnly`, `secure` in production, `sameSite=lax`, `path=/`, max age = backend token lifetime (60 minutes). Name and lifetime defined once and shared.
- **Next.js auth Route Handlers** (the only code that sets or clears the cookie):
  - `POST /api/auth/login` — validates the body with zod, calls backend login, sets the cookie, fetches `/auth/me`, and returns the profile. Never returns the token.
  - `POST /api/auth/register` — validates, calls backend register, then logs in as above and returns the profile.
  - `POST /api/auth/logout` — clears the cookie; always succeeds.
  - On failure they return the backend's status and error body unchanged (so the client sees the same `{error: ...}` shape).
- **`/api/*` forwarder** (Route Handler for every other path): forwards method, path, query and JSON body to the backend under `/api/v1`, attaching only the cookie's token as a bearer header; returns the backend status and body unchanged; clears the cookie on 401 `TOKEN_*`.
- **HTTP clients:**
  - `@/lib/config/axios.client` exports `API`: the **browser** axios instance (`baseURL: "/api"`) used by services. On a 401 `TOKEN_*` response it redirects to `/signin?next=<current page>&expired=1` and clears the React Query cache.
  - A separate **server-only** backend client (the current server-side `axios.client.ts` code, moved) used by the Route Handlers and server code: attaches the token from the cookie, base URL from a server-only env var.
  - `src/lib/api/api.client.ts` returns backend responses as-is (no `{data}` unwrapping).
- **Auth module (`src/modules/auth/`):**
  - `schemas/auth.schema.ts`: zod schemas for sign-in form (email, password), sign-up form (email, password 8-128, confirmPassword must match), login/register request bodies, current profile (`id` UUID, `email`, `role` enum `admin|user`, `permissions` string array), and the backend error body.
  - `types/auth.types.ts`: types inferred from those schemas.
  - `services/auth.services.ts`: `AuthService` with `login`, `register`, `logout`, `me`; responses parsed with the zod schemas.
  - `queries/auth.keys.ts`: `authKeys` factory (`all`, `login`, `register`, `logout`, `currentProfile`).
  - `queries/auth.queries.ts`: `useSignInMutation`, `useSignUpMutation` (both put the returned profile into the `currentProfile` cache), `useLogoutMutation` (removes auth queries), `useCurrentProfileQuery`.
  - No Zustand auth store: the React Query cache is the only client-side copy of the profile; the token never leaves the cookie.
- **Session/role helpers (`src/modules/auth/session/`):** shared by `proxy.ts`, Route Handlers and components:
  - cookie name and max age;
  - role landing routes: `admin` -> `/admin`, `user` -> `/`;
  - route access rules: routes under `/admin` require `admin`; every other non-public route needs any signed-in user;
  - public auth routes: `/signin`, `/signup`;
  - safe `next` resolution (same-site relative paths only);
  - token payload reader for `proxy.ts` (reads `role` and `exp` without verifying the signature; optimistic only).
- **`proxy.ts`** (optimistic, no backend calls), following the reference structure (`proxy` function, `redirectTo` helper, matcher excluding `api`, `_next/static`, `_next/image`, favicon and image files):
  - no cookie, or a cookie whose token is expired/unreadable -> protected route redirects to `/signin?next=<path>` (expired token also clears the cookie and adds `expired=1`);
  - valid-looking session on `/signin` or `/signup` -> redirect to safe `next` or the role's landing route;
  - signed-in user on a route their role can't access -> redirect to the role's landing route.
- **Authoritative checks:** protected server-rendered pages confirm the session with the backend (`/auth/me`), at most once per request; the backend enforces permissions on every call regardless of what `proxy.ts` decided.
- **`AuthForm.tsx`** (`src/app/(auth)/signin/_components/AuthForm.tsx`, shared by `/signin` and `/signup`):
  - prop `mode: "signin" | "signup"`; react-hook-form + `zodResolver`; `TextField` / `PasswordField`; `FieldSet` disabled while submitting; submit button shows a pending label.
  - sign in: email, password. Sign up: email, password, confirm password.
  - success: navigate (replace) to safe `next` or the role landing route from the returned profile.
  - errors: field errors under the field (zod, backend 422, 409 duplicate email -> email field); everything else as a sonner toast (see Error handling); a link to switch between sign in and sign up (keeping `next`).
- **`useMutationCallbacks` hook (`src/hooks/use-mutation-callback.ts`):** builds success/error callbacks that show sonner toasts with the backend error message (or a given fallback), following the reference usage (`buildCallbacks(action, entity, { errorMessage })`).
- **App providers:** the root layout provides a React Query `QueryClientProvider` and the sonner `Toaster`.
- **Pages:** `/signin` and `/signup` render `AuthForm` in their mode; `/signin` shows a "session expired" toast when `expired=1`.
- **Config:** backend base URL from a server-only env var (no `NEXT_PUBLIC_`); documented in an example env file.

### Error handling (what the user sees)
| Situation | Where it shows | Message |
|---|---|---|
| zod validation (bad email, short password, passwords differ) | under the field | the schema's message |
| Backend 422 on a field | under that field | backend `issue` text |
| Sign up 409 duplicate email | under email | "An account with this email already exists" |
| Sign in 401 `INVALID_CREDENTIALS` | toast | "Invalid email or password" |
| Network failure, timeout, 5xx | toast | "Something went wrong, please try again" |
| Arrived with `expired=1` | toast on `/signin` | "Your session expired, please sign in again" |

### Non-Functional
- Security:
  - The token is never readable by client JavaScript, never in URLs, logs, response bodies to the browser, or the React Query cache.
  - `next` accepts only same-site relative paths (single leading `/`); anything else falls back to the role landing route (no open redirect).
  - The forwarder ignores any browser-sent `Authorization` header; only the cookie's token is used.
  - Server-only modules (cookie access, backend client) cannot be imported into client components.
  - `proxy.ts` decisions are optimistic; never the only protection.
- Default-deny: a new page is protected without extra code.
- No backend round-trip in `proxy.ts`.

## Constraints
- Next.js 16.4 App Router, React 19, TypeScript, axios, @tanstack/react-query 5, zod 4, react-hook-form, sonner (installed). Follow `node_modules/next/dist/docs/`.
- Backend behavior is fixed: no refresh token, no server-side logout, no check-email, 60-minute tokens.
- Browser never calls FastAPI; no CORS on the backend.
- No new dependencies expected (JWT payload is read with built-in base64 decoding; no verification library needed for an optimistic check).

## Blockers
- None.

## Edge Cases
Format: condition -> expected outcome.

- **EC1:** Signed-out visitor (no cookie) requests a protected page -> redirected to `/signin?next=<requested path with query>`.
- **EC2:** `next` is absolute, protocol-relative (`//evil.com`), or doesn't start with `/` -> ignored; the role landing route is used.
- **EC3:** Signed-in visitor (valid-looking cookie) requests `/signin` or `/signup` -> redirected to safe `next` or the role landing route.
- **EC4:** Cookie holds a token whose `exp` has passed, or that can't be decoded -> `proxy.ts` treats the visitor as signed out; on a protected route: cookie cleared, redirect to `/signin?next=<path>&expired=1`.
- **EC5:** Token looks valid to `proxy.ts` but the backend rejects it (401 `TOKEN_INVALID`, e.g. forged, or user deactivated) during a server render -> cookie cleared, redirect to `/signin?next=<page>&expired=1`.
- **EC6:** Client request through `/api/*` gets 401 `TOKEN_*` -> forwarder clears the cookie and returns the 401 body; the browser client redirects to `/signin?next=<current page>&expired=1` and clears the query cache.
- **EC7:** User with role `user` requests a route under `/admin` -> redirected to `/`.
- **EC8:** Admin signs in with no `next` -> lands on `/admin`; user -> `/`.
- **EC9:** Stale role claim (role changed in DB after sign-in) -> `proxy.ts` may route by the old role, but the backend still allows/denies by the DB role; the next sign-in fixes routing. No data is exposed.
- **EC10:** `/api/*` request with no cookie -> forwarded without a bearer header; backend 401 `TOKEN_MISSING` handled as EC6.
- **EC11:** Browser sends its own `Authorization` header to `/api/*` -> ignored.
- **EC12:** Backend 403 `FORBIDDEN` -> passed through; cookie kept; the caller shows the error (toast via `useMutationCallbacks` for mutations).
- **EC13:** Backend unreachable, timeout, or 5xx -> not treated as signed out; cookie kept; toast "Something went wrong, please try again".
- **EC14:** Sign in with wrong email or password -> toast "Invalid email or password"; no cookie; form stays filled except the password.
- **EC15:** Sign up passwords don't match -> error under confirm password; no request sent.
- **EC16:** Sign up with an existing email (409) -> error under email; no cookie.
- **EC17:** Sign up succeeds but the automatic login fails -> toast asking the user to sign in; redirect to `/signin` (keeping `next`); account exists, no cookie.
- **EC18:** Double submit (Enter pressed twice) -> one request; the form is disabled while pending.
- **EC19:** Cookie reaches max age and the browser drops it -> next navigation behaves as EC1.
- **EC20:** Sign out while already signed out -> succeeds silently; profile cache cleared; redirect to `/signin`.
- **EC21:** Static files, images, `_next` assets, favicon and `/api/*` -> never redirected by `proxy.ts`.

## Acceptance Criteria
- [ ] **AC1:** `POST /api/auth/login` with valid credentials sets one httpOnly, `sameSite=lax` (`secure` in production), 60-minute cookie and returns the profile without the token.
- [ ] **AC2:** Login/register handler failures return the backend status and `{error}` body unchanged, with no cookie set (EC13, EC14, EC16).
- [ ] **AC3:** `POST /api/auth/register` creates the account and signs the user in like AC1; auto-login failure follows EC17.
- [ ] **AC4:** `POST /api/auth/logout` clears the cookie and succeeds even when signed out (EC20).
- [ ] **AC5:** The `/api/*` forwarder passes method, path, query, JSON body, status and body through, attaches only the cookie's token, clears the cookie on 401 `TOKEN_*`, and keeps it on 403/5xx (EC6, EC10-EC13).
- [ ] **AC6:** `proxy.ts` implements EC1-EC4, EC7, EC21 without calling the backend.
- [ ] **AC7:** Protected server-rendered pages verify the session with `/auth/me` at most once per request and handle rejection as EC5.
- [ ] **AC8:** The auth module follows the pattern: zod schemas, inferred types, `AuthService` (login, register, logout, me) using `API` from `@/lib/config/axios.client`, `authKeys` factory, and query hooks; components import only from `queries/`, `schemas/` and `types/`.
- [ ] **AC9:** `useSignInMutation` / `useSignUpMutation` place the returned profile in the `currentProfile` query cache; `useLogoutMutation` removes it; `useCurrentProfileQuery` reads `/api/auth/me`.
- [ ] **AC10:** `AuthForm` works in `signin` and `signup` modes with the fields, validation, disabled state, navigation (EC8, EC2) and error display in the Error handling table (EC14-EC18).
- [ ] **AC11:** The browser `API` client redirects to `/signin?next=...&expired=1` and clears the query cache on 401 `TOKEN_*` (EC6); `/signin` shows the expired toast.
- [ ] **AC12:** `useMutationCallbacks` shows sonner toasts using the backend error message or the given fallback.
- [ ] **AC13:** Root layout provides `QueryClientProvider` and `Toaster`.
- [ ] **AC14:** The token never appears in client bundles, browser-bound responses, URLs, logs or the query cache; server-only modules fail the build if imported into client components.
- [ ] **AC15:** Backend base URL comes from a server-only env var documented in an example env file; `api.client.ts` no longer expects a `{data}` wrapper.
- [ ] **AC16:** Lint and type-check pass.

## Out of Scope
- Check-email step: would need a new backend endpoint and would reveal which emails are registered.
- Zustand auth store: React Query holds the profile; the token stays in the cookie.
- Home page content, `/admin` pages, app shell and sign-out button: the user builds these later. Until `/admin` exists, an admin signing in lands on a 404.
- "Remember me": the backend token always lasts 60 minutes.
- Refresh tokens, server-side logout/revocation, password reset, email verification: not supported by cuewise-be yet.
