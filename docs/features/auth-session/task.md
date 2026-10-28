# Implementation: Auth Session (cookie-based BFF)

## Status
Ready for PR (all 13 steps complete; user commits manually)

## Completed Steps
- [x] 1. Tooling: vitest 4.1.12, `npm test`, `vitest.config.ts`, `.env.example` (+ `.gitignore` exception)
- [x] 2. Schemas, types, API error parser (`parseApiError`)
- [x] 3. Session helpers (roles, safe next, token payload reader, `authRouteHref`)
- [x] 4. Server backend client (`backend.client.server.ts`) + cookie helpers (`auth-cookie.server.ts`)
- [x] 5. `/api/auth/{login,register,logout}`
- [x] 6. `/api/[...path]` forwarder
- [x] 7. `src/proxy.ts`
- [x] 8. `getCurrentUser()` / `requireUser()` + `/api/auth/session-expired`; `/` protected
- [x] 9. Browser `API` client, `getQueryClient()`, `api.client.ts` fix
- [x] 10. `authService`, `authKeys`, query hooks
- [x] 11. `Providers` (QueryClientProvider + Toaster), `useMutationCallbacks`
- [x] 12. `AuthForm` + `AuthFormContainer` + `AuthCard` + `SessionExpiredNotice`; `/signin`, `/signup`
- [x] 13. Verification: tests, tsc, lint, build, bundle check, end-to-end against cuewise-be

## Changes Made
Not committed (user commits manually). Suggested commits, in order:

    git add package.json package-lock.json tsconfig.json vitest.config.ts .env.example .gitignore tests/helpers
    git commit -m "build: add vitest and env example"

    git add src/lib src/modules/auth/schemas src/modules/auth/types src/modules/auth/session src/shared/ui tests/lib tests/modules
    git commit -m "feat(auth): add session helpers, server/browser API clients and schemas"

    git add src/app/api src/proxy.ts tests/app tests/proxy.test.ts
    git commit -m "feat(auth): add BFF route handlers, forwarder and route protection"

    git add src/modules/auth/services src/modules/auth/queries src/hooks src/app/providers.tsx src/app/layout.tsx
    git commit -m "feat(auth): add auth service, queries and providers"

    git add "src/app/(auth)" src/app/page.tsx src/components/ui/sonner.tsx
    git commit -m "feat(auth): add sign in and sign up pages"

    git add CLAUDE.md docs/features/auth-session
    git commit -m "docs: add auth session spec, plan and task log"

## Test Results
- `npm test`: 121 passed (8 files). Baseline: no tests existed.
- `npx tsc --noEmit`: clean. `npm run lint`: clean (one deliberate, commented eslint-disable).
- `npm run build`: passes; `/`, `/signin`, `/signup` are Partial Prerender; `ƒ Proxy (Middleware)` detected.
- Client bundle check: no chunk contains the backend URL, `backendApi`, `Bearer `, `next/headers`, `API_URL` or `SessionExpiredError`.
- End-to-end (production build + running cuewise-be, scripted with fetch): 26/26 passed.

## Test Cases
| Area | File | Covers |
|---|---|---|
| Schemas | `tests/modules/auth/schemas/auth.schema.test.ts` | sign in/up rules, confirm mismatch (EC15), 8-128 bounds, extra keys stripped, profile shape, search params |
| API errors | `tests/lib/config/api.helper.test.ts` | 422 -> field errors, 409 -> email, code/message kept, generic fallback |
| Env | `tests/lib/config/env.server.test.ts` | valid URL, missing / no scheme / non-http rejected |
| Session helpers | `tests/modules/auth/session/auth-session.test.ts` | landing routes (EC8), /admin rule (EC7), safe next incl. `//evil.com`, `/\evil.com`, `javascript:` (EC2), token payload, expiry |
| Auth handlers | `tests/app/api/auth/auth.routes.test.ts` | cookie flags, no token in body (AC1), passthrough 401/422/409, 503, malformed body, /me failure, AUTO_LOGIN_FAILED (EC17), logout (AC4, EC20) |
| Forwarder | `tests/app/api/[...path]/route.test.ts` | query/body/bearer, spoofed header (EC11), no cookie (EC10), 401 clears (EC6), 403/500 keep (EC12, EC13), 503, 204, reserved and `..` paths, non-JSON 401 |
| Session expired | `tests/app/api/auth/session-expired/route.test.ts` | clears cookie, keeps safe next (incl. admin path), drops unsafe (EC5) |
| Proxy | `tests/proxy.test.ts` | EC1, EC3, EC4 (expired + garbage), EC7, safe/unsafe next, real matcher (EC21) |

End-to-end checks (scratch script, real backend): EC1, EC2, EC3, EC4, EC5, EC6, EC7, EC11, EC12, EC14, EC16, 422 field errors, AC1 (cookie flags incl. Secure, no token in body), AC3, AC4, AC5, AC7, AC9, EC20, form fields render per mode.

## Not verified automatically (manual browser check by the user)
- AuthForm interactions: toasts (wrong password, server down, expired notice), password cleared after wrong credentials, double-submit lock (EC18), mode-switch link keeps `next`.
- Browser-side 401 redirect from the `API` client (AC11) and query cache clearing.
- EC8 admin landing end to end (unit-tested; needs an admin account), EC9 stale role (needs a DB role change), EC13 backend down end to end (unit-tested), EC17 for real (unit-tested).

## Open Questions
- None blocking.

## Baseline Failures
- None (no tests before this feature).

## Known Issues
- Fixed after delivery: dev overlay "Route "/": encountered the unstable value Date.now() while prerendering" after sign in/up. With Partial Prefetching the cookie-aware App Shell prerender reached `getCurrentUser()`'s backend call (axios reads `Date.now()`). `getCurrentUser()` now calls `await connection()` first, so the session check always runs at request time (also keeps the per-request backend check). Verified: error reproduced in `.next/dev/logs`, gone after the fix; tests, tsc, lint, build green.
- Debugged after delivery: login returned 502 because the VS Code terminal running `npm run dev` had a stale process env var `API_URL=localhost:8000` (process env beats `.env` in Next.js). Code was correct; the zod check rejected the value but the 502 hid why. Fix: `backendErrorToResponse` now logs a redacted summary (`[bff] ...`, never headers) for 502/503, with tests (`bff.server.test.ts`).
- The local `.env` has `API_URL=localhost:8000`; it must be `http://localhost:8000/api/v1` (see `.env.example`). With the new validation the app now fails with a clear message instead of 503s.
- `/admin` has no page yet, so an admin signing in lands on a 404 (out of scope).
- `TextField`/`PasswordField` don't set `aria-invalid`/`data-invalid` on errors (shadcn form rule); existing shared components, left unchanged.
- One test account was created in the local cuewise-be DB by the end-to-end run (`e2e-1793146141252@example.com`).

## Deviations from Plan
- See plan.md "Deviations recorded at /implement start" and "Deviations recorded during /implement": Vitest 4; `.server.ts` naming; AuthForm + container in `(auth)/_components`; proxy moved to `src/proxy.ts`; zod-validated `API_URL`; Suspense boundaries for Cache Components; extra session helpers; forwarder hardening.

## Skills Consulted During Implementation
| Step | Skill | Why |
|------|-------|-----|
| all | graphify | refreshed and queried the FE graph; `graphify update .` at the end |
| all | lean-ctx | shell, search and reads (FE is outside its root, so reads went through ctx_shell) |
| 1-8 | vitest (installed: antfu/skills@vitest) | config, aliasing, module mocking |
| 12 | shadcn (installed: shadcn-ui/ui@shadcn) | project info (radix-vega, lucide), full Card composition, FieldGroup forms, Button asChild, no new primitives |
| 7, 12, 13 | Next.js bundled docs | proxy location/matcher/testing utils, Route Handlers, Cache Components + auth guide |

## Links
- Spec: docs/features/auth-session/spec.md
- Plan: docs/features/auth-session/plan.md

---

## Validation Checklist (before PR)
- [x] All plan.md steps complete
- [x] Full test suite + build green
- [x] Every acceptance criterion met by code and covered by a passing test or the end-to-end run (manual UI checks listed above)
- [x] Open Questions resolved or explicitly surfaced to the user
- [x] No skipped, deleted, or loosened tests
- [x] task.md fully updated
- [ ] Commits documented (user commits manually)
- [x] No open blockers
- [x] Code follows project CLAUDE.md
- [x] No unresolved plan deviations
