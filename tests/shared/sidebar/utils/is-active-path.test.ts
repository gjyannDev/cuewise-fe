import { describe, expect, it } from "vitest";

import { isActivePath } from "@/shared/sidebar/utils/is-active-path";

describe("isActivePath", () => {
  it("matches the exact path", () => {
    expect(isActivePath("/history", "/history")).toBe(true);
  });

  it("keeps a section active on its nested pages (EC5)", () => {
    expect(isActivePath("/admin/users/123", "/admin/users")).toBe(true);
  });

  it("does not match a sibling that only shares a prefix", () => {
    expect(isActivePath("/history-old", "/history")).toBe(false);
  });

  it("treats / as exact so it is not active everywhere", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/history", "/")).toBe(false);
  });

  it("keeps an exact item inactive on nested pages (EC5)", () => {
    expect(isActivePath("/admin", "/admin", { exact: true })).toBe(true);
    expect(isActivePath("/admin/users", "/admin", { exact: true })).toBe(false);
  });

  it("ignores a trailing slash", () => {
    expect(isActivePath("/history/", "/history")).toBe(true);
    expect(isActivePath("/admin/", "/admin", { exact: true })).toBe(true);
  });
});
