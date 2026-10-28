import { describe, expect, it } from "vitest";

import { roleSchema } from "@/modules/auth/schemas/auth.schema";
import { SIDEBAR_BY_ROLE } from "@/modules/navigation/navigation.constants";

const navOf = (role: keyof typeof SIDEBAR_BY_ROLE) =>
  SIDEBAR_BY_ROLE[role].sections.map((section) =>
    section.items.map(({ title, href }) => [title, href]),
  );
const allItems = (role: keyof typeof SIDEBAR_BY_ROLE) =>
  SIDEBAR_BY_ROLE[role].sections.flatMap((section) => section.items);

describe("SIDEBAR_BY_ROLE", () => {
  it("has a config for every role", () => {
    for (const role of roleSchema.options) {
      expect(SIDEBAR_BY_ROLE[role]).toBeDefined();
    }
  });

  it("lists the user items in order (AC1)", () => {
    expect(navOf("user")).toEqual([
      [
        ["Dashboard", "/"],
        ["AI Mock Interview", "/interviews"],
        ["History", "/history"],
        ["Progress", "/progress"],
      ],
      [["Settings", "/settings"]],
    ]);
  });

  it("lists the admin items in order (AC2)", () => {
    expect(navOf("admin")).toEqual([
      [
        ["Dashboard", "/admin"],
        ["Users", "/admin/users"],
        ["Questions", "/admin/questions"],
      ],
      [["Settings", "/admin/settings"]],
    ]);
  });

  it.each(roleSchema.options)("%s: keys are unique and hrefs are absolute paths", (role) => {
    const items = allItems(role);
    expect(new Set(items.map((item) => item.key)).size).toBe(items.length);
    expect(new Set(SIDEBAR_BY_ROLE[role].sections.map((s) => s.key)).size).toBe(
      SIDEBAR_BY_ROLE[role].sections.length,
    );
    for (const item of items) {
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.href.startsWith("//")).toBe(false);
    }
  });

  it.each(roleSchema.options)("%s: every section has a header label", (role) => {
    expect(SIDEBAR_BY_ROLE[role].sections.map((section) => section.label)).toEqual([
      "Menu",
      "Account",
    ]);
  });

  it("keeps every admin item under /admin, with no user paths (EC6)", () => {
    for (const item of allItems("admin")) {
      expect(item.href === "/admin" || item.href.startsWith("/admin/")).toBe(true);
    }
  });

  it("keeps the landing Dashboard from being active on nested admin pages (EC5)", () => {
    expect(allItems("admin").find((item) => item.href === "/admin")?.exact).toBe(true);
  });

  it("links the brand to each role's landing page", () => {
    expect(SIDEBAR_BY_ROLE.user.brand.href).toBe("/");
    expect(SIDEBAR_BY_ROLE.admin.brand.href).toBe("/admin");
  });
});
