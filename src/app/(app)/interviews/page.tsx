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
    // Fills the shell's content area, left-aligned with its header and sidebar; the form's card grid keeps rows short.
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">AI Mock Interview</h1>
        <p className="text-muted-foreground">Practice with questions matched to your role and level.</p>
      </header>
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
