import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";
import { INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import { parseSessionParam } from "@/modules/interviews/utils/parse-session-param";

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
  await requireUser(INTERVIEWS_ROUTE);
  const { session } = await searchParams;

  return <InterviewsContainer sessionParam={parseSessionParam(session)} />;
}
