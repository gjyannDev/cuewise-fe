import { LayoutDashboard } from "lucide-react";
import { describe, expect, it } from "vitest";

import type { SidebarConfig } from "@/shared/sidebar/types/sidebar.types";
import { findActiveNavItem } from "@/shared/sidebar/utils/find-active-nav-item";

const item = (key: string, href: string, exact?: boolean) => ({ key, title: key, href, icon: LayoutDashboard, exact });

const config: SidebarConfig = {
  brand: { name: "Cuewise", href: "/" },
  sections: [
    { key: "main", label: "Menu", items: [item("home", "/"), item("interviews", "/interviews"), item("admin", "/admin", true)] },
    { key: "account", label: "Account", items: [item("settings", "/settings")] },
  ],
};

describe("findActiveNavItem", () => {
  it("finds the item for the current page across sections", () => {
    expect(findActiveNavItem(config, "/settings")?.key).toBe("settings");
  });

  it("keeps a section's item for nested pages", () => {
    expect(findActiveNavItem(config, "/interviews/abc")?.key).toBe("interviews");
  });

  it("matches / only on the home page", () => {
    expect(findActiveNavItem(config, "/")?.key).toBe("home");
    expect(findActiveNavItem(config, "/interviews")?.key).toBe("interviews");
  });

  it("respects exact items", () => {
    expect(findActiveNavItem(config, "/admin/users")).toBeUndefined();
  });

  it("returns undefined for a page that isn't in the nav", () => {
    expect(findActiveNavItem(config, "/unknown")).toBeUndefined();
  });
});
