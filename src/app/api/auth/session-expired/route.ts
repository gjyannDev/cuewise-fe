import { type NextRequest, NextResponse } from "next/server";

import { clearAccessTokenCookie } from "@/modules/auth/session/auth-cookie.server";
import { SIGNIN_ROUTE, toSafeRelativePath } from "@/modules/auth/session/auth-session";

/**
 * Server Components can't delete cookies while rendering, so requireUser() redirects here when the
 * backend rejects the session; this clears the cookie and sends the user to sign in again.
 */
export async function GET(request: NextRequest) {
  await clearAccessTokenCookie();

  const signin = new URL(SIGNIN_ROUTE, request.nextUrl.origin);
  const next = toSafeRelativePath(request.nextUrl.searchParams.get("next"));
  if (next) {
    signin.searchParams.set("next", next);
  }
  signin.searchParams.set("expired", "1");

  return NextResponse.redirect(signin);
}
