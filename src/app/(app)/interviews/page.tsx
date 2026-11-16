import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";
import { INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import { parseSessionParam } from "@/modules/interviews/utils/interview.utils";
import { getInitials } from "@/shared/sidebar/utils/get-initials";

import { InterviewsContainer } from "./_components/InterviewsContainer";

type InterviewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function InterviewsPage({ searchParams }: InterviewsPageProps) {
  return (
    // Fills the shell's content area; the page title and description live in the shell header.
    <div className="flex w-full flex-col gap-6">
      {/* The session check reads cookies and searchParams (request-time data), so it streams in behind a boundary. */}
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <InterviewsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function InterviewsContent({ searchParams }: InterviewsPageProps) {
  const user = await requireUser(INTERVIEWS_ROUTE);
  const { session } = await searchParams;

  // Only the initials reach the room (its no-camera tile), not the email they come from.
  return <InterviewsContainer sessionParam={parseSessionParam(session)} initials={getInitials(user.email)} />;
}
