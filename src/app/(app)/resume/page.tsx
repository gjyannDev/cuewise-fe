import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/modules/auth/session/current-user.server";
import { RESUME_ROUTE } from "@/modules/profile/constants";

import { ResumeContainer } from "./_components/ResumeContainer";

export default function ResumePage() {
  return (
    // Fills the shell's content area; the page title and description live in the shell header.
    <div className="flex w-full flex-col gap-6">
      {/* The session check reads cookies (request-time data), so it streams in behind a boundary. */}
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <ResumeContent />
      </Suspense>
    </div>
  );
}

async function ResumeContent() {
  await requireUser(RESUME_ROUTE);

  return <ResumeContainer />;
}
