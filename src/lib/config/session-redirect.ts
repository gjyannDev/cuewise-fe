import { apiErrorBodySchema, isSessionErrorCode } from "@/lib/config/api.helper";
import { getQueryClient } from "@/lib/config/query-client";
import { bypassUnloadWarning } from "@/lib/unload-guard";
import { isPublicAuthRoute, SIGNIN_ROUTE } from "@/modules/auth/session/auth-session";

/**
 * The session ended (the /api forwarder already cleared the cookie): drop cached user data and send the user to sign
 * in, coming back here afterwards. Shared by the axios interceptor and fetch-based calls (the answer stream), so both
 * react to an expired session the same way. Browser only; a no-op for any other response.
 */
export function redirectIfSessionEnded(status: number | undefined, body: unknown) {
  if (typeof window === "undefined" || status !== 401) {
    return;
  }
  const parsed = apiErrorBodySchema.safeParse(body);
  if (!parsed.success || !isSessionErrorCode(parsed.data.error.code) || isPublicAuthRoute(window.location.pathname)) {
    return;
  }
  getQueryClient().clear();
  const next = `${window.location.pathname}${window.location.search}`;
  // The user must get to sign in even with a half-written answer on screen (it can't be sent anyway).
  bypassUnloadWarning();
  // Deliberate hard navigation: there is no router here, and a full reload discards every bit of the previous
  // user's client state.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`${SIGNIN_ROUTE}?next=${encodeURIComponent(next)}&expired=1`);
}
