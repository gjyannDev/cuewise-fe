import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type AppShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

/** Signed-in page frame: sidebar slot, header with the collapse trigger, and the page content. */
export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
