"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

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
            <SidebarMenuButton asChild size="lg" tooltip={config.brand.name}>
              <Link href={config.brand.href} onClick={closeMobile}>
                <span
                  aria-hidden
                  className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary font-semibold text-sidebar-primary-foreground"
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
            <Fragment key={section.key}>
              {index > 0 && <SidebarSeparator />}
              <SidebarNavSection section={section} pathname={pathname} onNavigate={closeMobile}>
                {index === lastIndex && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Sign out"
                      onClick={onSignOut}
                      disabled={isSigningOut}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut />
                      <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarNavSection>
            </Fragment>
          ))}
        </SidebarContent>
      </nav>

      <SidebarFooter>
        <SidebarUserCard user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
