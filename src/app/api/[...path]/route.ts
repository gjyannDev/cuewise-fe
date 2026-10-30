import { apiErrorBodySchema, GENERIC_ERROR_MESSAGE, isSessionErrorCode } from "@/lib/config/api.helper";
import { errorResponse } from "@/lib/config/bff.server";
import { getApiUrl } from "@/lib/config/env.server";
import { clearAccessTokenCookie, getAccessToken } from "@/modules/auth/session/auth-cookie.server";
import { ANSWER_TIMEOUT_MS, START_TIMEOUT_MS } from "@/modules/interviews/constants";

/**
 * Catch-all BFF forwarder: the browser calls /api/<path>, this calls cuewise-be /api/v1/<path>
 * with the token from the httpOnly cookie. Status and body come back unchanged.
 * /api/auth/{login,register,logout} have their own Route Handlers (they set/clear the cookie).
 */

type ForwardContext = { params: Promise<{ path: string[] }> };

const REQUEST_TIMEOUT_MS = 15_000;
const OWNED_BY_NEXT = new Set(["auth/login", "auth/register", "auth/logout"]);

/**
 * POSTs where cuewise-be waits on the LLM (up to 30s, plus a job-description summary on start), so the default 15s
 * would cut off requests that are still succeeding. Same budgets as the browser side (interviews constants).
 */
const SLOW_POSTS: { path: RegExp; timeoutMs: number }[] = [
  { path: /^interviews\/[^/]+\/messages$/, timeoutMs: ANSWER_TIMEOUT_MS },
  { path: /^interviews$/, timeoutMs: START_TIMEOUT_MS },
];

function timeoutFor(method: string, path: string) {
  const slow = method === "POST" ? SLOW_POSTS.find((route) => route.path.test(path)) : undefined;
  return slow?.timeoutMs ?? REQUEST_TIMEOUT_MS;
}

function parseJsonOrNull(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function forward(request: Request, { params }: ForwardContext) {
  const { path } = await params;

  // `.`/`..` segments would let the joined URL climb out of /api/v1.
  if (OWNED_BY_NEXT.has(path.join("/")) || path.some((segment) => segment === "." || segment === "..")) {
    return errorResponse(404, "NOT_FOUND", "Not found");
  }

  const url = new URL(`${getApiUrl()}/${path.map(encodeURIComponent).join("/")}`);
  url.search = new URL(request.url).search;

  // Built from scratch: browser headers (including any Authorization) are never forwarded.
  const headers = new Headers({ Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  const token = await getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutFor(request.method, path.join("/"))),
    });
  } catch {
    return errorResponse(503, "SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE);
  }

  const text = await upstream.text();

  if (upstream.status === 401) {
    const body = apiErrorBodySchema.safeParse(parseJsonOrNull(text));
    if (body.success && isSessionErrorCode(body.data.error.code)) {
      await clearAccessTokenCookie();
    }
  }

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) {
    responseHeaders.set("Content-Type", upstreamType);
  }
  return new Response(text || null, { status: upstream.status, headers: responseHeaders });
}

export { forward as DELETE, forward as GET, forward as PATCH, forward as POST, forward as PUT };
