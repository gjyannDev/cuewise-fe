import axios, { type AxiosError } from "axios";

import { type ApiErrorBody, apiErrorBodySchema, isSessionErrorCode } from "@/lib/config/api.helper";
import { getQueryClient } from "@/lib/config/query-client";
import { bypassUnloadWarning } from "@/lib/unload-guard";
import { isPublicAuthRoute, SIGNIN_ROUTE } from "@/modules/auth/session/auth-session";

/**
 * Browser axios instance used by services. It only talks to this Next.js app (`/api/*`); the
 * Route Handlers there attach the token from the httpOnly cookie and call cuewise-be.
 * Server code must use `backendApi` from `backend.client.server.ts` instead.
 */

const REQUEST_TIMEOUT_MS = 15_000;

export const API = axios.create({
  baseURL: "/api",
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const body = apiErrorBodySchema.safeParse(error.response?.data);
    const code = body.success ? body.data.error.code : undefined;

    // The session ended (the /api forwarder already cleared the cookie): drop cached user data and
    // send the user to sign in, coming back here afterwards.
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      isSessionErrorCode(code) &&
      !isPublicAuthRoute(window.location.pathname)
    ) {
      getQueryClient().clear();
      const next = `${window.location.pathname}${window.location.search}`;
      // The user must get to sign in even with a half-written answer on screen (it can't be sent anyway).
      bypassUnloadWarning();
      // Deliberate hard navigation: an interceptor has no router, and a full reload discards every
      // bit of the previous user's client state.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`${SIGNIN_ROUTE}?next=${encodeURIComponent(next)}&expired=1`);
    }

    return Promise.reject(error);
  },
);
