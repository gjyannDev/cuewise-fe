import { getRedirectUrl, unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "@/proxy";

const base64url = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
const tokenFor = (role: string, expInSeconds = 3600) =>
  `${base64url({ alg: "HS256" })}.${base64url({
    sub: "019a2b3c-4d5e-7f60-8a1b-2c3d4e5f6a7b",
    role,
    exp: Math.floor(Date.now() / 1000) + expInSeconds,
  })}.sig`;

function run(path: string, token?: string) {
  const headers = token ? { cookie: `access_token=${token}` } : undefined;
  const response = proxy(new NextRequest(new URL(path, "http://localhost"), { headers }));
  const redirect = getRedirectUrl(response);
  return {
    response,
    redirect: redirect ? new URL(redirect) : null,
    clearsCookie: /access_token=;.*(Max-Age=0|Expires=Thu, 01 Jan 1970)/i.test(
      response.headers.get("set-cookie") ?? "",
    ),
  };
}

describe("proxy: signed out", () => {
  it("redirects a protected page to /signin with the full path and query as next (EC1)", () => {
    const { redirect } = run("/interviews/1?tab=notes");

    expect(redirect?.pathname).toBe("/signin");
    expect(redirect?.searchParams.get("next")).toBe("/interviews/1?tab=notes");
    expect(redirect?.searchParams.has("expired")).toBe(false);
  });

  it.each(["/signin", "/signup"])("lets %s through", (path) => {
    expect(run(path).redirect).toBeNull();
  });
});

describe("proxy: dead session cookie (EC4)", () => {
  it.each([
    ["expired token", tokenFor("user", -60)],
    ["undecodable token", "garbage"],
  ])("%s on a protected page clears the cookie and redirects with expired=1", (_, token) => {
    const { redirect, clearsCookie } = run("/interviews", token);

    expect(redirect?.pathname).toBe("/signin");
    expect(redirect?.searchParams.get("next")).toBe("/interviews");
    expect(redirect?.searchParams.get("expired")).toBe("1");
    expect(clearsCookie).toBe(true);
  });

  it("lets /signin through with an expired cookie, clearing it", () => {
    const { redirect, clearsCookie } = run("/signin", tokenFor("user", -60));

    expect(redirect).toBeNull();
    expect(clearsCookie).toBe(true);
  });
});

describe("proxy: signed in", () => {
  it.each([
    ["user", "/"],
    ["admin", "/admin"],
  ])("sends a %s away from /signin to %s (EC3)", (role, landing) => {
    expect(run("/signin", tokenFor(role)).redirect?.pathname).toBe(landing);
    expect(run("/signup", tokenFor(role)).redirect?.pathname).toBe(landing);
  });

  it("honors a safe next on /signin and ignores an unsafe one (EC3, EC2)", () => {
    const safe = run("/signin?next=%2Finterviews%2F2", tokenFor("user")).redirect;
    const unsafe = run("/signin?next=%2F%2Fevil.com", tokenFor("user")).redirect;

    expect(`${safe?.pathname}${safe?.search}`).toBe("/interviews/2");
    expect(unsafe?.origin).toBe("http://localhost");
    expect(`${unsafe?.pathname}${unsafe?.search}`).toBe("/");
  });

  it("sends a user away from /admin to their landing route (EC7)", () => {
    expect(run("/admin/users", tokenFor("user")).redirect?.pathname).toBe("/");
  });

  it.each([
    ["admin", "/admin/users"],
    ["user", "/"],
    ["user", "/interviews/3"],
  ])("lets a %s through to %s", (role, path) => {
    expect(run(path, tokenFor(role)).redirect).toBeNull();
  });
});

describe("proxy matcher (EC21)", () => {
  it.each(["/", "/signin", "/admin", "/interviews/1"])("runs on page %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it.each([
    "/api/auth/login",
    "/api/users",
    "/_next/static/chunk.js",
    "/_next/image?url=x",
    "/favicon.ico",
    "/logo.png",
    "/hero.webp",
  ])("never runs on %s", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
  });
});
