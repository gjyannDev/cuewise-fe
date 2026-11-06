import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";
import { FeedbackSkeleton } from "@/modules/interviews/components/feedback/FeedbackSkeleton";
import { InterviewNotFoundCard } from "@/modules/interviews/components/common/InterviewNotFoundCard";
import { feedbackRoute, INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import { parseFeedbackStartParam } from "@/modules/interviews/utils/feedback.utils";
import { parseSessionParam } from "@/modules/interviews/utils/interview.utils";

import { FeedbackContainer } from "./_components/FeedbackContainer";

type FeedbackPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function FeedbackPage({ params, searchParams }: FeedbackPageProps) {
  return (
    // One readable column; the page title and description live in the shell header.
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* The session check reads cookies, params and searchParams (request-time data), so it streams in behind a boundary. */}
      <Suspense fallback={<FeedbackSkeleton />}>
        <FeedbackContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FeedbackContent({ params, searchParams }: FeedbackPageProps) {
  const { id } = await params;
  const session = parseSessionParam(id);
  await requireUser(session.kind === "valid" ? feedbackRoute(session.id) : INTERVIEWS_ROUTE);

  // A malformed id never reaches the backend.
  if (session.kind !== "valid") {
    return <InterviewNotFoundCard />;
  }
  const { start } = await searchParams;
  // Keyed per interview: nothing from another interview's feedback carries over.
  return <FeedbackContainer key={session.id} interviewId={session.id} startFlag={parseFeedbackStartParam(start)} />;
}
