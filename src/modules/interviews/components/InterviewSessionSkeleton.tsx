import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { InterviewColumns } from "./InterviewColumns";

const BUBBLES = [
  { side: "left", width: "w-3/4" },
  { side: "right", width: "w-2/3" },
  { side: "left", width: "w-1/3" },
  { side: "left", width: "w-4/5" },
] as const;

/** Same frame as InterviewChat (fixed-height column, details from `xl`) so nothing jumps when the chat arrives. */
export function InterviewSessionSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your interview…</span>
      <InterviewColumns
        asideLabel="Interview details"
        asideClassName="hidden xl:flex"
        aside={
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
              <Skeleton className="mt-3 h-11 w-full" />
            </CardContent>
          </Card>
        }
      >
        <div className="flex h-[calc(100dvh_-_var(--app-header-height)_-_2*var(--app-content-py))] min-h-0 flex-col gap-3">
          <Skeleton className="h-6 w-48 xl:hidden" />
          <div className="flex flex-1 flex-col justify-end gap-3 py-4">
            {BUBBLES.map((bubble, index) => (
              <div key={index} className={cn("flex items-end gap-2", bubble.side === "right" && "justify-end")}>
                {bubble.side === "left" && <Skeleton className="size-6 shrink-0 rounded-full" />}
                <Skeleton className={cn("h-12 rounded-2xl", bubble.width)} />
              </div>
            ))}
          </div>
          <Skeleton className="h-28 w-full shrink-0" />
        </div>
      </InterviewColumns>
    </div>
  );
}
