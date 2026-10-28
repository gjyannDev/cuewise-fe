import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type AppShellProps = {
  sidebar: ReactNode;
  /** The current page's title, shown in the header next to the collapse trigger. */
  title?: ReactNode;
  children: ReactNode;
};

/** Signed-in page frame: sidebar slot, header with the collapse trigger and page title, and the page content. */
export function AppShell({ sidebar, title, children }: AppShellProps) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          {title && (
            <>
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-6" />
              {title}
            </>
          )}
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
