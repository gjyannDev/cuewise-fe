import { beforeEach, describe, expect, it, vi } from "vitest";

import { axiosErrorWith, errorBody, networkError, ok } from "@tests/helpers/axios";
import { cookieJar } from "@tests/helpers/cookie-jar";

vi.mock("next/headers", async () => (await import("@tests/helpers/cookie-jar")).nextHeadersMock);
vi.mock(import("@/lib/config/backend.client.server"), async (importOriginal) => ({
  ...(await importOriginal()),
  backendApi: { post: vi.fn(), get: vi.fn() } as never,
}));

const { backendApi } = await import("@/lib/config/backend.client.server");
const { POST: login } = await import("@/app/api/auth/login/route");
const { POST: register } = await import("@/app/api/auth/register/route");
const { POST: logout } = await import("@/app/api/auth/logout/route");

const post = vi.mocked(backendApi.post);
const get = vi.mocked(backendApi.get);

const TOKEN = "header.payload.signature";
const PROFILE = {
  id: "019a2b3c-4d5e-7f60-8a1b-2c3d4e5f6a7b",
  email: "ana@example.com",
  role: "user",
  permissions: ["users:read_self"],
};
const CREDENTIALS = { email: "ana@example.com", password: "password123" };

const jsonRequest = (body: unknown) =>
  new Request("http://localhost/api/auth/x", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

beforeEach(() => {
  cookieJar.reset();
});

describe("POST /api/auth/login", () => {
  it("sets the httpOnly token cookie and returns the profile, never the token", async () => {
    post.mockResolvedValueOnce(ok({ access_token: TOKEN, token_type: "bearer" }));
    get.mockResolvedValueOnce(ok(PROFILE));

    const response = await login(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(JSON.parse(text)).toEqual(PROFILE);
    expect(text).not.toContain(TOKEN);
    expect(cookieJar.store.get("access_token")).toEqual({
      value: TOKEN,
      options: { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 3600 },
    });
  });

  it("sends only email and password to the backend and fetches /auth/me with the new token", async () => {
    post.mockResolvedValueOnce(ok({ access_token: TOKEN, token_type: "bearer" }));
    get.mockResolvedValueOnce(ok(PROFILE));

    await login(jsonRequest({ ...CREDENTIALS, role: "admin" }));

    expect(post).toHaveBeenCalledWith("/auth/login", CREDENTIALS, { _skipAuth: true });
    expect(get).toHaveBeenCalledWith("/auth/me", {
      headers: { Authorization: `Bearer ${TOKEN}` },
      _skipAuth: true,
    });
  });

  it.each([
    [401, errorBody("INVALID_CREDENTIALS", "Invalid email or password")],
    [422, errorBody("VALIDATION_ERROR", "Request validation failed", [])],
  ])("passes a backend %i through unchanged and sets no cookie", async (status, data) => {
    post.mockRejectedValueOnce(axiosErrorWith(status, data));

    const response = await login(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual(data);
    expect(cookieJar.store.size).toBe(0);
  });

  it("returns 503 in the standard error shape when the backend is unreachable", async () => {
    post.mockRejectedValueOnce(networkError());

    const response = await login(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("SERVICE_UNAVAILABLE");
    expect(cookieJar.store.size).toBe(0);
  });

  it("rejects a malformed body with 422 in the backend's error shape, without calling the backend", async () => {
    const response = await login(jsonRequest("{not json"));

    expect(response.status).toBe(422);
    expect((await response.json()).error.code).toBe("VALIDATION_ERROR");
    expect(post).not.toHaveBeenCalled();
  });

  it("sets no cookie when the token is issued but /auth/me fails", async () => {
    post.mockResolvedValueOnce(ok({ access_token: TOKEN, token_type: "bearer" }));
    get.mockRejectedValueOnce(networkError());

    const response = await login(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(503);
    expect(cookieJar.store.size).toBe(0);
  });
});

describe("POST /api/auth/register", () => {
  it("creates the account, signs in and returns 201 with the profile", async () => {
    post
      .mockResolvedValueOnce(ok({ id: PROFILE.id, email: PROFILE.email }, 201))
      .mockResolvedValueOnce(ok({ access_token: TOKEN, token_type: "bearer" }));
    get.mockResolvedValueOnce(ok(PROFILE));

    const response = await register(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(PROFILE);
    expect(post).toHaveBeenNthCalledWith(1, "/auth/register", CREDENTIALS, { _skipAuth: true });
    expect(cookieJar.store.get("access_token")?.value).toBe(TOKEN);
  });

  it("passes a 409 duplicate email through and sets no cookie", async () => {
    const data = errorBody("CONFLICT", "Email already registered", { field: "email" });
    post.mockRejectedValueOnce(axiosErrorWith(409, data));

    const response = await register(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual(data);
    expect(cookieJar.store.size).toBe(0);
  });

  it("reports AUTO_LOGIN_FAILED when the account is created but signing in fails (EC17)", async () => {
    post
      .mockResolvedValueOnce(ok({ id: PROFILE.id, email: PROFILE.email }, 201))
      .mockRejectedValueOnce(networkError());

    const response = await register(jsonRequest(CREDENTIALS));

    expect(response.status).toBe(502);
    expect((await response.json()).error.code).toBe("AUTO_LOGIN_FAILED");
    expect(cookieJar.store.size).toBe(0);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie and returns 204", async () => {
    cookieJar.store.set("access_token", { value: TOKEN });

    const response = await logout();

    expect(response.status).toBe(204);
    expect(cookieJar.store.has("access_token")).toBe(false);
  });

  it("succeeds when already signed out (EC20)", async () => {
    const response = await logout();

    expect(response.status).toBe(204);
  });
});
