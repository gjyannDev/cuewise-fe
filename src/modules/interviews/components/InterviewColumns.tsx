import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InterviewColumnsProps = {
  children: ReactNode;
  aside: ReactNode;
  asideLabel: string;
  /** Extra classes for the side panel, e.g. to show it only from `xl`. */
  asideClassName?: string;
};

/** Main content plus a sticky side panel from `xl` (the sidebar takes ~16rem); stacked, main first, below that. */
export function InterviewColumns({ children, aside, asideLabel, asideClassName }: InterviewColumnsProps) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
      {/* Offset by the sticky app header so the panel never slides under it. */}
      <aside
        aria-label={asideLabel}
        className={cn("flex flex-col gap-6 xl:sticky xl:top-[calc(var(--app-header-height)_+_1.5rem)]", asideClassName)}
      >
        {aside}
      </aside>
    </div>
  );
}
