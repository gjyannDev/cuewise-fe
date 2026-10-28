import type { NavItem, SidebarConfig } from "../types/sidebar.types";
import { isActivePath } from "./is-active-path";

/** The nav item for the current page (most specific match wins), using the sidebar's own active rule. */
export function findActiveNavItem(config: SidebarConfig, pathname: string): NavItem | undefined {
  return config.sections
    .flatMap((section) => section.items)
    .filter((item) => isActivePath(pathname, item.href, { exact: item.exact }))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
