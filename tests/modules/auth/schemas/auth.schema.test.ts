import { describe, expect, it } from "vitest";

import {
  authCredentialsSchema,
  authFormSchemas,
  authSearchParamsSchema,
  currentProfileSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/modules/auth/schemas/auth.schema";

const issuesFor = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((issue) => issue.path.join(".")) ?? [];

describe("signInFormSchema", () => {
  it("accepts an email and any non-empty password", () => {
    expect(signInFormSchema.safeParse({ email: "ana@example.com", password: "x" }).success).toBe(true);
  });

  it("rejects a malformed email and an empty password", () => {
    const result = signInFormSchema.safeParse({ email: "nope", password: "" });

    expect(issuesFor(result).sort()).toEqual(["email", "password"]);
  });
});

describe("signUpFormSchema", () => {
  const valid = { email: "ana@example.com", password: "password123", confirmPassword: "password123" };

  it("accepts matching passwords of 8-128 characters", () => {
    expect(signUpFormSchema.safeParse(valid).success).toBe(true);
  });

  it("puts a mismatch error on confirmPassword", () => {
    const result = signUpFormSchema.safeParse({ ...valid, confirmPassword: "different1" });

    expect(issuesFor(result)).toEqual(["confirmPassword"]);
  });

  it.each([
    ["7 characters", "a".repeat(7)],
    ["129 characters", "a".repeat(129)],
  ])("rejects a password of %s (backend allows 8-128)", (_, password) => {
    const result = signUpFormSchema.safeParse({ ...valid, password, confirmPassword: password });

    expect(issuesFor(result)).toContain("password");
  });
});

describe("authCredentialsSchema", () => {
  it("strips unknown keys so a client can't send extra fields like role", () => {
    const parsed = authCredentialsSchema.parse({ email: "a@example.com", password: "pw", role: "admin" });

    expect(parsed).toEqual({ email: "a@example.com", password: "pw" });
  });
});

describe("currentProfileSchema", () => {
  const profile = {
    id: "019a2b3c-4d5e-7f60-8a1b-2c3d4e5f6a7b",
    email: "ana@example.com",
    role: "admin",
    permissions: ["users:read", "users:read_self"],
  };

  it("accepts the backend /auth/me shape", () => {
    expect(currentProfileSchema.parse(profile)).toEqual(profile);
  });

  it.each([
    ["a non-UUID id", { id: "1" }],
    ["an unknown role", { role: "superuser" }],
  ])("rejects %s", (_, override) => {
    expect(currentProfileSchema.safeParse({ ...profile, ...override }).success).toBe(false);
  });
});

describe("authFormSchemas", () => {
  it("sign in ignores a mismatched confirmPassword", () => {
    const values = { email: "ana@example.com", password: "x", confirmPassword: "" };

    expect(authFormSchemas.signin.safeParse(values).success).toBe(true);
    expect(authFormSchemas.signup.safeParse(values).success).toBe(false);
  });
});

describe("authSearchParamsSchema", () => {
  it("reads next and expired=1", () => {
    expect(authSearchParamsSchema.parse({ next: "/interviews", expired: "1" })).toEqual({
      next: "/interviews",
      expired: true,
    });
  });

  it.each([
    ["no params", {}],
    ["repeated params", { next: ["/a", "/b"], expired: ["1", "1"] }],
    ["unexpected expired value", { expired: "yes" }],
  ])("drops malformed values instead of throwing (%s)", (_, params) => {
    expect(authSearchParamsSchema.parse(params)).toEqual({ next: undefined, expired: false });
  });
});
