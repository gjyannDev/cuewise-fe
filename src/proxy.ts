import { type NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  canRoleAccessRoute,
  getRoleLandingRoute,
  isPublicAuthRoute,
  isTokenExpired,
  readTokenPayload,
  resolveSafeNext,
  SIGNIN_ROUTE,
} from "@/modules/auth/session/auth-session";

/**
 * Optimistic route protection. Reads the role and expiry from the token in the httpOnly cookie
 * WITHOUT verifying it and never calls the backend; protected pages still call requireUser(),
 * and cuewise-be verifies the token on every API call.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = token ? readTokenPayload(token) : null;
  const session = payload && !isTokenExpired(payload) ? payload : null;
  const hasDeadCookie = Boolean(token) && !session;

  if (isPublicAuthRoute(pathname)) {
    if (session) {
      return redirectTo(request, resolveSafeNext(request.nextUrl.searchParams.get("next"), session.role));
    }
    return clearCookieIf(NextResponse.next(), hasDeadCookie);
  }

  if (!session) {
    const signin = new URL(SIGNIN_ROUTE, request.nextUrl.origin);
    signin.searchParams.set("next", `${pathname}${search}`);
    if (hasDeadCookie) {
      signin.searchParams.set("expired", "1");
    }
    return clearCookieIf(NextResponse.redirect(signin), hasDeadCookie);
  }

  if (!canRoleAccessRoute(session.role, pathname)) {
    return redirectTo(request, getRoleLandingRoute(session.role));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};

/** `target` is a same-site path that may carry a query string (from resolveSafeNext). */
function redirectTo(request: NextRequest, target: string) {
  return NextResponse.redirect(new URL(target, request.nextUrl.origin));
}

function clearCookieIf(response: NextResponse, shouldClear: boolean) {
  if (shouldClear) {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
  }
  return response;
}
