"use client";

import { usePathname } from "next/navigation";

import type { SidebarConfig } from "./types/sidebar.types";
import { findActiveNavItem } from "./utils/find-active-nav-item";

type AppHeaderTitleProps = {
  config: SidebarConfig;
};

/** The current page's title and description in the shell header, taken from the sidebar config. */
export function AppHeaderTitle({ config }: AppHeaderTitleProps) {
  const item = findActiveNavItem(config, usePathname());
  if (!item) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col">
      <h1 className="truncate font-display text-sm leading-tight font-semibold">{item.title}</h1>
      {item.description && (
        <p className="hidden truncate text-xs text-muted-foreground sm:block">{item.description}</p>
      )}
    </div>
  );
}
