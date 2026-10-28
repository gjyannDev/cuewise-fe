import type { ReactNode } from "react";

type InterviewColumnsProps = {
  children: ReactNode;
  aside: ReactNode;
  asideLabel: string;
};

/** Main content plus a sticky side panel from `xl` (the sidebar takes ~16rem); stacked, main first, below that. */
export function InterviewColumns({ children, aside, asideLabel }: InterviewColumnsProps) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
      <aside aria-label={asideLabel} className="flex flex-col gap-6 xl:sticky xl:top-6">
        {aside}
      </aside>
    </div>
  );
}
