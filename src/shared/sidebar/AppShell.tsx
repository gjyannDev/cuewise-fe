import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type AppShellProps = {
  sidebar: ReactNode;
  /** The current page's title, shown in the header next to the collapse trigger. */
  title?: ReactNode;
  children: ReactNode;
};

/**
 * Signed-in page frame: sidebar slot, header with the collapse trigger and page title, and the page content.
 * The header height and content padding are CSS variables so pages can size against them (sticky offsets, the
 * fixed-height interview chat) without repeating the numbers.
 */
export function AppShell({ sidebar, title, children }: AppShellProps) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset className="[--app-content-py:1rem] [--app-header-height:3.5rem] md:[--app-content-py:1.5rem]">
        <header className="sticky top-0 z-10 flex h-(--app-header-height) shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          {title}
        </header>
        <div className="flex flex-1 flex-col px-4 py-(--app-content-py) md:px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
