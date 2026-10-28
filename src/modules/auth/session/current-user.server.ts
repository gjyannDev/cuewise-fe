import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { backendApi, SessionExpiredError } from "@/lib/config/backend.client.server";

import { currentProfileSchema } from "../schemas/auth.schema";
import type { CurrentUserProfile } from "../types/auth.types";
import { getAccessToken } from "./auth-cookie.server";
import { SIGNIN_ROUTE } from "./auth-session";

/**
 * The signed-in user for this request, or null without a cookie. Asks cuewise-be (the authority),
 * at most once per request thanks to React `cache`. Throws SessionExpiredError for a dead token.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUserProfile | null> => {
  // Always verify at request time. With Partial Prefetching, Next otherwise runs this during the
  // cookie-aware App Shell prerender, where the backend call (axios reads Date.now()) is not allowed,
  // and a prefetched result would also skip the per-request check the backend relies on.
  await connection();

  if (!(await getAccessToken())) {
    return null;
  }
  const { data } = await backendApi.get("/auth/me");
  return currentProfileSchema.parse(data);
});

/**
 * Use at the top of every protected Server Component page. `currentPath` is where to return after
 * signing in (pages don't know their own URL on the server).
 */
export async function requireUser(currentPath: string): Promise<CurrentUserProfile> {
  let user: CurrentUserProfile | null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      redirect(`/api/auth/session-expired?next=${encodeURIComponent(currentPath)}`);
    }
    throw error;
  }

  if (!user) {
    redirect(`${SIGNIN_ROUTE}?next=${encodeURIComponent(currentPath)}`);
  }
  return user;
}
