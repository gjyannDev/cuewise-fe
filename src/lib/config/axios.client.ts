import axios, { type AxiosError } from "axios";

import type { ApiErrorBody } from "@/lib/config/api.helper";
import { redirectIfSessionEnded } from "@/lib/config/session-redirect";

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
    redirectIfSessionEnded(error.response?.status, error.response?.data);
    return Promise.reject(error);
  },
);
