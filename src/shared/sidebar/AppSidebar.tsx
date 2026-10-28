"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { SIDEBAR_BRAND_CLASS, SIDEBAR_DANGER_ITEM_CLASS } from "./sidebar.styles";
import { SidebarNavSection } from "./SidebarNavSection";
import { SidebarUserCard } from "./SidebarUserCard";
import type { SidebarConfig, SidebarUser } from "./types/sidebar.types";

type AppSidebarProps = {
  config: SidebarConfig;
  user: SidebarUser;
  onSignOut: () => void;
  isSigningOut: boolean;
};

/** Role-agnostic sidebar: renders whatever `config` lists, plus Sign out and the user card. */
export function AppSidebar({ config, user, onSignOut, isSigningOut }: AppSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);
  const lastIndex = config.sections.length - 1;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={config.brand.name}
              className={SIDEBAR_BRAND_CLASS}
            >
              <Link href={config.brand.href} onClick={closeMobile}>
                <span
                  aria-hidden
                  className="flex aspect-square size-8 items-center justify-center text-lg font-bold text-sidebar-primary"
                >
                  {config.brand.name.charAt(0)}
                </span>
                <span className="font-semibold">{config.brand.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col">
        <SidebarContent>
          {config.sections.map((section, index) => (
            <SidebarNavSection
              key={section.key}
              section={section}
              pathname={pathname}
              onNavigate={closeMobile}
            >
              {index === lastIndex && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Sign out"
                    onClick={onSignOut}
                    disabled={isSigningOut}
                    className={SIDEBAR_DANGER_ITEM_CLASS}
                  >
                    <LogOut />
                    <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarNavSection>
          ))}
        </SidebarContent>
      </nav>

      <SidebarFooter>
        <SidebarUserCard user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
