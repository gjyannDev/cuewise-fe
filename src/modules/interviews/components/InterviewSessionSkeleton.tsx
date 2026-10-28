import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { InterviewColumns } from "./InterviewColumns";

/** Same shape as InterviewSession so nothing jumps when the interview arrives. */
export function InterviewSessionSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your interview…</span>
      <InterviewColumns
        asideLabel="Interview details"
        aside={
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
              <Skeleton className="mt-3 h-11 w-full" />
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader className="gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-1.5 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-2/3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-11 w-full sm:ml-auto sm:w-24" />
          </CardContent>
        </Card>
      </InterviewColumns>
    </div>
  );
}
