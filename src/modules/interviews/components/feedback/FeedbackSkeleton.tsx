import { Skeleton } from "@/components/ui/skeleton";

/** The result's three cards as placeholders, so nothing jumps when the feedback arrives. */
export function FeedbackSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-52 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
