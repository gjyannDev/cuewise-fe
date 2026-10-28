import { describe, expect, it } from "vitest";

import {
  authRouteHref,
  canRoleAccessRoute,
  getRoleLandingRoute,
  isPublicAuthRoute,
  isTokenExpired,
  readTokenPayload,
  resolveSafeNext,
} from "@/modules/auth/session/auth-session";

const base64url = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
const tokenWith = (payload: object) => `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(payload)}.signature`;

describe("getRoleLandingRoute", () => {
  it.each([
    ["admin", "/admin"],
    ["user", "/"],
    [null, "/"],
    ["unknown-role", "/"],
  ])("sends %s to %s", (role, route) => {
    expect(getRoleLandingRoute(role)).toBe(route);
  });
});

describe("canRoleAccessRoute", () => {
  it.each([
    ["admin", "/admin", true],
    ["admin", "/admin/users", true],
    ["user", "/admin", false],
    ["user", "/admin/users", false],
    ["user", "/administrator", true],
    ["user", "/", true],
    ["user", "/interviews/1", true],
    [null, "/admin", false],
  ])("role %s on %s -> %s", (role, path, allowed) => {
    expect(canRoleAccessRoute(role, path)).toBe(allowed);
  });
});

describe("isPublicAuthRoute", () => {
  it.each([
    ["/signin", true],
    ["/signup", true],
    ["/signin/", true],
    ["/signing", false],
    ["/", false],
  ])("%s -> %s", (path, expected) => {
    expect(isPublicAuthRoute(path)).toBe(expected);
  });
});

describe("resolveSafeNext", () => {
  it("keeps a same-site relative path with its query", () => {
    expect(resolveSafeNext("/interviews/1?tab=notes", "user")).toBe("/interviews/1?tab=notes");
  });

  it.each([
    ["protocol-relative", "//evil.com"],
    ["absolute URL", "https://evil.com/x"],
    ["no leading slash", "evil.com"],
    ["backslash trick", "/\\evil.com"],
    ["empty", ""],
    ["missing", undefined],
    ["javascript scheme", "javascript:alert(1)"],
  ])("falls back to the role landing route for %s", (_, next) => {
    expect(resolveSafeNext(next, "admin")).toBe("/admin");
    expect(resolveSafeNext(next, "user")).toBe("/");
  });

  it("does not send a user back to an auth page", () => {
    expect(resolveSafeNext("/signin", "user")).toBe("/");
  });

  it("does not send a user to a route their role can't access", () => {
    expect(resolveSafeNext("/admin/users", "user")).toBe("/");
    expect(resolveSafeNext("/admin/users", "admin")).toBe("/admin/users");
  });
});

describe("authRouteHref", () => {
  it("carries a safe next, encoded", () => {
    expect(authRouteHref("/signin", "/interviews/1?tab=notes")).toBe("/signin?next=%2Finterviews%2F1%3Ftab%3Dnotes");
  });

  it.each([undefined, null, "", "//evil.com", "https://evil.com"])("drops a missing or unsafe next (%s)", (next) => {
    expect(authRouteHref("/signup", next)).toBe("/signup");
  });
});

describe("readTokenPayload", () => {
  it("reads sub, role and exp without verifying the signature", () => {
    const token = tokenWith({ sub: "019a2b3c-4d5e-7f60-8a1b-2c3d4e5f6a7b", role: "admin", exp: 2_000_000_000 });

    expect(readTokenPayload(token)).toEqual({
      sub: "019a2b3c-4d5e-7f60-8a1b-2c3d4e5f6a7b",
      role: "admin",
      exp: 2_000_000_000,
    });
  });

  it.each([
    ["not a JWT", "garbage"],
    ["bad base64 payload", "a.%%%.c"],
    ["payload missing exp", tokenWith({ sub: "x", role: "user" })],
    ["empty string", ""],
  ])("returns null for %s", (_, token) => {
    expect(readTokenPayload(token)).toBeNull();
  });
});

describe("isTokenExpired", () => {
  const nowSeconds = 1_800_000_000;

  it("is expired at or after exp", () => {
    expect(isTokenExpired({ exp: nowSeconds }, nowSeconds * 1000)).toBe(true);
    expect(isTokenExpired({ exp: nowSeconds - 1 }, nowSeconds * 1000)).toBe(true);
  });

  it("is valid before exp", () => {
    expect(isTokenExpired({ exp: nowSeconds + 60 }, nowSeconds * 1000)).toBe(false);
  });
});
