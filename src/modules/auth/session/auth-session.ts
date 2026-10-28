import { z } from "zod";

/**
 * Session rules shared by proxy.ts, Route Handlers and client components.
 * Isomorphic on purpose: no Next.js or Node-only APIs.
 */

export const ACCESS_TOKEN_COOKIE = "access_token";
/** Keep in sync with ACCESS_TOKEN_EXPIRE_MINUTES in cuewise-be (default 60). */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;

export const SIGNIN_ROUTE = "/signin";
export const SIGNUP_ROUTE = "/signup";
const PUBLIC_AUTH_ROUTES = [SIGNIN_ROUTE, SIGNUP_ROUTE];

const ADMIN_ROUTE = "/admin";
const ROLE_LANDING_ROUTES: Record<string, string> = { admin: ADMIN_ROUTE, user: "/" };
const DEFAULT_LANDING_ROUTE = "/";

function normalizePath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function isUnder(pathname: string, route: string) {
  const path = normalizePath(pathname);
  return path === route || path.startsWith(`${route}/`);
}

export function getRoleLandingRoute(role: string | null | undefined) {
  return (role && ROLE_LANDING_ROUTES[role]) || DEFAULT_LANDING_ROUTE;
}

export function isPublicAuthRoute(pathname: string) {
  return PUBLIC_AUTH_ROUTES.includes(normalizePath(pathname));
}

/** Optimistic, UI-level rule. The backend still authorizes every API call by the user's DB role. */
export function canRoleAccessRoute(role: string | null | undefined, pathname: string) {
  return isUnder(pathname, ADMIN_ROUTE) ? role === "admin" : true;
}

/** A same-site relative path (with query/hash), or null for anything that could leave the site. */
export function toSafeRelativePath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return null;
  }

  const base = "http://same-site.invalid";
  const url = new URL(next, base);
  return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : null;
}

/**
 * Where to send a user after signing in. Only same-site relative paths are honored (no open redirect),
 * never back to an auth page, and never to a route the role can't open.
 */
export function resolveSafeNext(next: string | null | undefined, role: string | null | undefined) {
  const landing = getRoleLandingRoute(role);
  const path = toSafeRelativePath(next);
  if (!path) {
    return landing;
  }

  const { pathname } = new URL(path, "http://same-site.invalid");
  return isPublicAuthRoute(pathname) || !canRoleAccessRoute(role, pathname) ? landing : path;
}

/** Link to /signin or /signup that carries a safe `next` along (unsafe values are dropped). */
export function authRouteHref(route: typeof SIGNIN_ROUTE | typeof SIGNUP_ROUTE, next?: string | null) {
  const safeNext = toSafeRelativePath(next);
  return safeNext ? `${route}?next=${encodeURIComponent(safeNext)}` : route;
}

const tokenPayloadSchema = z.object({
  sub: z.string(),
  role: z.string(),
  exp: z.number(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

/**
 * Read the JWT payload WITHOUT verifying the signature. Only for optimistic routing decisions
 * (proxy.ts); the backend verifies the token on every request. Returns null for anything malformed.
 */
export function readTokenPayload(token: string): TokenPayload | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    const json = new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
    const parsed = tokenPayloadSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: Pick<TokenPayload, "exp">, nowMs = Date.now()) {
  return payload.exp * 1000 <= nowMs;
}
