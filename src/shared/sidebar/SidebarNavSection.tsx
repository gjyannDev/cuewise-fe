import Link from "next/link";
import type { ReactNode } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { NavSection } from "./types/sidebar.types";
import { isActivePath } from "./utils/is-active-path";

type SidebarNavSectionProps = {
  section: NavSection;
  pathname: string;
  onNavigate: () => void;
  /** Extra menu items rendered after the section's links (e.g. Sign out). */
  children?: ReactNode;
};

export function SidebarNavSection({ section, pathname, onNavigate, children }: SidebarNavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map(({ key, title, href, icon: Icon, exact }) => {
            const isActive = isActivePath(pathname, href, { exact });
            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={title}>
                  <Link href={href} aria-current={isActive ? "page" : undefined} onClick={onNavigate}>
                    <Icon />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {children}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
