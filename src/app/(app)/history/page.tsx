import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";
import { InterviewHistorySkeleton } from "@/modules/interviews/components/InterviewHistorySkeleton";
import { HISTORY_ROUTE } from "@/modules/interviews/constants";
import { parseHistoryParams } from "@/modules/interviews/utils/history-params";

import { HistoryContainer } from "./_components/HistoryContainer";

type HistoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function HistoryPage({ searchParams }: HistoryPageProps) {
  return (
    // Fills the shell's content area; the page title and description live in the shell header.
    <div className="flex w-full flex-col gap-6">
      {/* The session check reads cookies and searchParams (request-time data), so it streams in behind a boundary. */}
      <Suspense fallback={<InterviewHistorySkeleton />}>
        <HistoryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function HistoryContent({ searchParams }: HistoryPageProps) {
  await requireUser(HISTORY_ROUTE);
  const { page, size, sort, order, status } = await searchParams;

  return <HistoryContainer params={parseHistoryParams({ page, size, sort, order, status })} />;
}
