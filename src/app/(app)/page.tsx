import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/modules/auth/session/current-user.server";

import { DashboardContainer } from "./_components/DashboardContainer";

export default function Home() {
  return (
    // The page title lives in the shell header. The session check reads cookies (request-time data), so it streams in
    // behind a boundary shaped like the dashboard.
    <Suspense fallback={<DashboardFallback />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await requireUser("/");

  return <DashboardContainer />;
}

function DashboardFallback() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Loading your dashboard…</span>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-xl lg:col-span-2" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((tile) => (
          <Skeleton key={tile} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
