import "server-only";

import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { type ApiErrorBody, apiErrorBodySchema, isSessionErrorCode } from "@/lib/config/api.helper";
import { getApiUrl } from "@/lib/config/env.server";
import { getAccessToken } from "@/modules/auth/session/auth-cookie.server";

/**
 * Server-only axios instance for cuewise-be (FastAPI). Used by Route Handlers and server code.
 * Attaches `Authorization: Bearer <token>` from the httpOnly cookie, and turns the backend's
 * session failures (401 TOKEN_EXPIRED | TOKEN_INVALID | TOKEN_MISSING) into SessionExpiredError.
 */

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Don't attach the cookie's token (public endpoints, or an explicit Authorization header). */
    _skipAuth?: boolean;
  }
}

const REQUEST_TIMEOUT_MS = 15_000;

export class SessionExpiredError extends Error {
  constructor(
    readonly code: string,
    readonly original: AxiosError<ApiErrorBody>,
  ) {
    super("Your session has expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

export const backendApi = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

backendApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Server-only env var (no NEXT_PUBLIC_): the browser never calls FastAPI directly.
  config.baseURL = getApiUrl();

  if (config._skipAuth) {
    return config;
  }

  const accessToken = await getAccessToken();
  if (accessToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    config.headers = headers;
  }

  return config;
});

backendApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const body = apiErrorBodySchema.safeParse(error.response?.data);
    const code = body.success ? body.data.error.code : undefined;

    if (error.response?.status === 401 && isSessionErrorCode(code) && !error.config?._skipAuth) {
      return Promise.reject(new SessionExpiredError(code as string, error));
    }

    return Promise.reject(error);
  },
);
