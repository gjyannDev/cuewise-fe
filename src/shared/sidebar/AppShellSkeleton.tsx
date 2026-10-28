import { Skeleton } from "@/components/ui/skeleton";

const NAV_PLACEHOLDERS = 5;

/** Shown while the session is checked, so the real sidebar never renders for a signed-out visitor. */
export function AppShellSkeleton() {
  return (
    <div className="flex min-h-svh w-full" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div className="hidden w-64 shrink-0 flex-col gap-2 border-r bg-sidebar p-2 md:flex">
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: NAV_PLACEHOLDERS }, (_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
        <Skeleton className="mt-auto h-12 w-full" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Skeleton className="size-7" />
        </div>
        <div className="flex flex-col gap-4 p-4 md:p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
