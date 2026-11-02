import { beforeEach, describe, expect, it, vi } from "vitest";

import { ANSWER_TIMEOUT_MS } from "@/modules/interviews/constants";
import { errorBody } from "@tests/helpers/axios";
import { cookieJar } from "@tests/helpers/cookie-jar";
import { openStream, sseFrame, streamOf } from "@tests/helpers/sse";

vi.mock("next/headers", async () => (await import("@tests/helpers/cookie-jar")).nextHeadersMock);

const { GET, POST, DELETE } = await import("@/app/api/[...path]/route");

const BACKEND = "http://backend.test/api/v1";
const fetchMock = vi.fn<typeof fetch>();

const ctx = (...path: string[]) => ({ params: Promise.resolve({ path }) });
const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const sentRequest = () => {
  const [url, init] = fetchMock.mock.calls[0];
  return { url: String(url), init: init as RequestInit, headers: new Headers(init?.headers) };
};

beforeEach(() => {
  cookieJar.reset();
  vi.stubEnv("API_URL", BACKEND);
  vi.stubGlobal("fetch", fetchMock);
});

describe("/api/[...path] forwarder", () => {
  it("forwards GET with the query string and the cookie's token as a bearer header", async () => {
    cookieJar.store.set("access_token", { value: "cookie-token" });
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { items: [] }));

    const response = await GET(new Request("http://localhost/api/users?limit=5&offset=10"), ctx("users"));

    const sent = sentRequest();
    expect(sent.url).toBe(`${BACKEND}/users?limit=5&offset=10`);
    expect(sent.init.method).toBe("GET");
    expect(sent.headers.get("authorization")).toBe("Bearer cookie-token");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ items: [] });
  });

  it("forwards a POST JSON body and content type", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(201, { id: "x" }));

    const response = await POST(
      new Request("http://localhost/api/interviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Mock" }),
      }),
      ctx("interviews"),
    );

    const sent = sentRequest();
    expect(sent.init.body).toBe(JSON.stringify({ title: "Mock" }));
    expect(sent.headers.get("content-type")).toBe("application/json");
    expect(response.status).toBe(201);
  });

  it("ignores an Authorization header sent by the browser (EC11)", async () => {
    cookieJar.store.set("access_token", { value: "cookie-token" });
    fetchMock.mockResolvedValueOnce(jsonResponse(200, {}));

    await GET(
      new Request("http://localhost/api/auth/me", { headers: { authorization: "Bearer attacker" } }),
      ctx("auth", "me"),
    );

    expect(sentRequest().headers.get("authorization")).toBe("Bearer cookie-token");
  });

  it("sends no Authorization header without a cookie and passes the backend 401 through (EC10)", async () => {
    const body = errorBody("TOKEN_MISSING", "Authentication required");
    fetchMock.mockResolvedValueOnce(jsonResponse(401, body));

    const response = await GET(new Request("http://localhost/api/auth/me"), ctx("auth", "me"));

    expect(sentRequest().headers.has("authorization")).toBe(false);
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual(body);
  });

  it.each(["TOKEN_EXPIRED", "TOKEN_INVALID", "TOKEN_MISSING"])(
    "clears the cookie on 401 %s and passes the body through (EC6)",
    async (code) => {
      cookieJar.store.set("access_token", { value: "dead-token" });
      fetchMock.mockResolvedValueOnce(jsonResponse(401, errorBody(code, "Session ended")));

      const response = await GET(new Request("http://localhost/api/auth/me"), ctx("auth", "me"));

      expect(response.status).toBe(401);
      expect((await response.json()).error.code).toBe(code);
      expect(cookieJar.store.has("access_token")).toBe(false);
    },
  );

  it.each([
    [403, "FORBIDDEN"],
    [500, "INTERNAL_ERROR"],
  ])("keeps the cookie on %i (EC12, EC13)", async (status, code) => {
    cookieJar.store.set("access_token", { value: "live-token" });
    fetchMock.mockResolvedValueOnce(jsonResponse(status, errorBody(code, "Nope")));

    const response = await GET(new Request("http://localhost/api/users"), ctx("users"));

    expect(response.status).toBe(status);
    expect(cookieJar.store.has("access_token")).toBe(true);
  });

  it("returns 503 in the standard error shape when the backend is unreachable", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));

    const response = await GET(new Request("http://localhost/api/users"), ctx("users"));

    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("SERVICE_UNAVAILABLE");
  });

  it.each([
    ["POST", ["interviews", "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f", "messages"], 45_000],
    ["POST", ["interviews"], 60_000],
    ["GET", ["interviews", "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f", "messages"], 15_000],
    ["GET", ["interviews"], 15_000],
    ["POST", ["users"], 15_000],
  ])("gives %s %j a %i ms budget (only the LLM-backed interview POSTs wait longer)", async (method, path, budget) => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockResolvedValueOnce(jsonResponse(200, {}));
    const handler = method === "POST" ? POST : GET;

    await handler(
      new Request(`http://localhost/api/${path.join("/")}`, { method, body: method === "POST" ? "{}" : undefined }),
      ctx(...path),
    );

    expect(timeout).toHaveBeenCalledWith(budget);
    timeout.mockRestore();
  });

  it("passes a non-JSON 401 through without crashing and keeps the cookie", async () => {
    cookieJar.store.set("access_token", { value: "live-token" });
    fetchMock.mockResolvedValueOnce(new Response("<html>401</html>", { status: 401 }));

    const response = await GET(new Request("http://localhost/api/users"), ctx("users"));

    expect(response.status).toBe(401);
    expect(cookieJar.store.has("access_token")).toBe(true);
  });

  it("passes a 204 with no body through", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const response = await DELETE(new Request("http://localhost/api/things/1", { method: "DELETE" }), ctx("things", "1"));

    expect(response.status).toBe(204);
  });

  it.each([
    [["auth", "login"]],
    [["auth", "register"]],
    [["auth", "logout"]],
    [["..", "health"]],
    [["users", ".", "x"]],
  ])("refuses %j with 404 without calling the backend", async (path) => {
    const response = await POST(new Request("http://localhost/api/x", { method: "POST" }), ctx(...path));

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("/api/[...path] forwarder, streamed answer turn", () => {
  const STREAM_PATH = ["interviews", "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f", "messages", "stream"];
  const streamRequest = (init: RequestInit = {}) =>
    new Request(`http://localhost/api/${STREAM_PATH.join("/")}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
      ...init,
    });
  const sseResponse = (body: ReadableStream<Uint8Array>) =>
    new Response(body, { status: 200, headers: { "content-type": "text/event-stream; charset=utf-8" } });

  it("passes the first event through while the backend is still writing (AC1)", async () => {
    const upstream = openStream(sseFrame("status", { phase: "received" }));
    fetchMock.mockResolvedValueOnce(sseResponse(upstream.body));

    const response = await POST(streamRequest(), ctx(...STREAM_PATH));
    const reader = response.body!.getReader();
    const first = await reader.read();

    expect(new TextDecoder().decode(first.value)).toContain('"phase":"received"');
    upstream.finish();
    expect((await reader.read()).done).toBe(true);
  });

  it("asks for an event stream with the answer budget and marks the response unbuffered (AC2)", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockResolvedValueOnce(sseResponse(streamOf(sseFrame("reset", {}))));

    const response = await POST(streamRequest(), ctx(...STREAM_PATH));

    expect(sentRequest().headers.get("accept")).toBe("text/event-stream");
    expect(timeout).toHaveBeenCalledWith(ANSWER_TIMEOUT_MS);
    expect(response.headers.get("content-type")).toBe("text/event-stream; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("no-cache, no-transform");
    expect(response.headers.get("x-accel-buffering")).toBe("no");
    timeout.mockRestore();
  });

  it("aborts the backend request when the browser leaves (EC17)", async () => {
    const browser = new AbortController();
    fetchMock.mockResolvedValueOnce(sseResponse(streamOf()));

    await POST(streamRequest({ signal: browser.signal }), ctx(...STREAM_PATH));
    const upstreamSignal = sentRequest().init.signal!;
    browser.abort();

    expect(upstreamSignal.aborted).toBe(true);
  });

  it.each([
    [409, "QUESTION_NOT_CURRENT"],
    [422, "VALIDATION_ERROR"],
    [404, "NOT_FOUND"],
  ])("returns a %i before the stream as buffered JSON with the same body (AC3)", async (status, code) => {
    const body = errorBody(code, "Nope");
    fetchMock.mockResolvedValueOnce(jsonResponse(status, body));

    const response = await POST(streamRequest(), ctx(...STREAM_PATH));

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual(body);
  });

  it("clears the cookie on a session-ending 401 before the stream (EC1)", async () => {
    cookieJar.store.set("access_token", { value: "dead-token" });
    fetchMock.mockResolvedValueOnce(jsonResponse(401, errorBody("TOKEN_EXPIRED", "Session ended")));

    const response = await POST(streamRequest(), ctx(...STREAM_PATH));

    expect(response.status).toBe(401);
    expect(cookieJar.store.has("access_token")).toBe(false);
  });

  it("returns the standard 503 when the backend is unreachable (EC4)", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));

    const response = await POST(streamRequest(), ctx(...STREAM_PATH));

    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("SERVICE_UNAVAILABLE");
  });

  it("leaves the JSON answer route buffered with Accept: application/json (AC4)", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(201, { ok: true }));

    const response = await POST(
      new Request("http://localhost/api/interviews/x/messages", { method: "POST", body: "{}" }),
      ctx("interviews", "x", "messages"),
    );

    expect(sentRequest().headers.get("accept")).toBe("application/json");
    expect(response.headers.get("cache-control")).toBeNull();
    expect(await response.json()).toEqual({ ok: true });
  });
});
