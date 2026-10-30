import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BUBBLES = [
  { side: "left", width: "w-3/4" },
  { side: "right", width: "w-2/3" },
  { side: "left", width: "w-1/3" },
  { side: "left", width: "w-4/5" },
] as const;

/** Same frame as InterviewChat (centered fixed-height column, bar on top) so nothing jumps when the chat arrives. */
export function InterviewSessionSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex h-[calc(100dvh_-_var(--app-header-height)_-_2*var(--app-content-py))] min-h-0 w-full max-w-3xl flex-col gap-3"
    >
      <span className="sr-only">Loading your interview…</span>
      <div className="flex h-11 shrink-0 items-center justify-between gap-3 pb-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex flex-1 flex-col justify-end gap-3 py-4">
        {BUBBLES.map((bubble, index) => (
          <div key={index} className={cn("flex items-end gap-2", bubble.side === "right" && "justify-end")}>
            {bubble.side === "left" && <Skeleton className="size-6 shrink-0 rounded-full" />}
            <Skeleton className={cn("h-12 rounded-2xl", bubble.width)} />
          </div>
        ))}
      </div>
      <Skeleton className="h-24 w-full shrink-0 rounded-2xl" />
    </div>
  );
}
