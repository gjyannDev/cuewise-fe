import axios, { type AxiosError } from "axios";

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

/**
 * A request made with `responseType: "blob"` (a spoken interviewer line) gets its error body as a Blob too, which would
 * hide cuewise-be's error code from `parseApiError` and the session-expired redirect. A JSON Blob is parsed back into
 * the object every other request sees; anything else is left as it came.
 */
async function decodeBlobBody(data: unknown): Promise<unknown> {
  if (!(data instanceof Blob) || !/[/+]json\b/i.test(data.type)) {
    return data;
  }
  try {
    return JSON.parse(await data.text());
  } catch {
    return data;
  }
}

/** The response interceptor's error side: normalize the body, react to an ended session, then reject as usual. */
export async function rejectApiError(error: AxiosError) {
  if (error.response) {
    error.response.data = await decodeBlobBody(error.response.data);
  }
  redirectIfSessionEnded(error.response?.status, error.response?.data);
  return Promise.reject(error);
}

API.interceptors.response.use((response) => response, rejectApiError);
