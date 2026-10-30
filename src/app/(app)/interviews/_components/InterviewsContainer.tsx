"use client";

import { RotateCcwIcon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useMutationCallbacks } from "@/hooks/use-mutation-callback";
import { parseApiError } from "@/lib/config/api.helper";
import { InterviewConfigForm } from "@/modules/interviews/components/InterviewConfigForm";
import { InterviewEndedPanel } from "@/modules/interviews/components/InterviewEndedPanel";
import { InterviewMessageCard } from "@/modules/interviews/components/InterviewMessageCard";
import { InterviewSessionSkeleton } from "@/modules/interviews/components/InterviewSessionSkeleton";
import { INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import { useInterviewQuery, useStartInterviewMutation } from "@/modules/interviews/queries/interviews.queries";
import type {
  SessionParam,
  StartInterviewFieldErrors,
  StartInterviewRequest,
} from "@/modules/interviews/types/interviews.types";
import { getStartErrorResult } from "@/modules/interviews/utils/get-start-error-result";

import { ActiveInterview } from "./ActiveInterview";

type InterviewsContainerProps = {
  sessionParam: SessionParam;
};

/**
 * Picks the screen from `?session=` (setup card without it, interview screen with it), owns the
 * interview queries and navigation, and passes data and callbacks to presentational components.
 */
export function InterviewsContainer({ sessionParam }: InterviewsContainerProps) {
  const router = useRouter();
  const sessionId = sessionParam.kind === "valid" ? sessionParam.id : undefined;
  const startInterview = useStartInterviewMutation();
  const interview = useInterviewQuery(sessionId);
  // Keeps the form busy until the interview screen has actually replaced it.
  const [isNavigating, startNavigation] = useTransition();
  // ponytail: client-only until cuewise-be can end a session; a reload shows the interview again (spec EC13).
  const [endedSessionId, setEndedSessionId] = useState<string>();

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Interview" });
  const startCallbacks = buildCallbacks("start", "interview", { errorMessage: "Couldn't start the interview" });

  const goToSetup = () => startNavigation(() => router.push(INTERVIEWS_ROUTE));

  async function handleStart(request: StartInterviewRequest): Promise<StartInterviewFieldErrors | void> {
    try {
      const created = await startInterview.mutateAsync(request);
      startNavigation(() => router.push(`${INTERVIEWS_ROUTE}?session=${created.session.id}`));
    } catch (error) {
      const fieldErrors = getStartErrorResult(error);
      if (fieldErrors) {
        return fieldErrors;
      }
      startCallbacks.onError(error);
    }
  }

  const notFound = (
    <InterviewMessageCard
      icon={SearchXIcon}
      title="Interview not found"
      description="This link doesn't match an interview on your account. It may be mistyped or belong to someone else."
      action={
        <Button size="lg" className="h-11" onClick={goToSetup}>
          Start a new interview
        </Button>
      }
    />
  );

  if (sessionParam.kind === "none") {
    return <InterviewConfigForm isPending={startInterview.isPending || isNavigating} onSubmit={handleStart} />;
  }
  if (sessionParam.kind === "invalid") {
    return notFound;
  }
  if (interview.isPending) {
    return <InterviewSessionSkeleton />;
  }
  if (interview.isError) {
    if (parseApiError(interview.error).status === 404) {
      return notFound;
    }
    return (
      <InterviewMessageCard
        role="alert"
        icon={TriangleAlertIcon}
        title="We couldn't load this interview"
        description="Check your connection and try again."
        action={
          <Button variant="outline" size="lg" className="h-11" onClick={() => interview.refetch()}>
            <RotateCcwIcon aria-hidden data-icon="inline-start" />
            Try again
          </Button>
        }
      />
    );
  }
  if (endedSessionId === sessionId) {
    return <InterviewEndedPanel session={interview.data.session} onStartNew={goToSetup} />;
  }
  return (
    <ActiveInterview
      key={sessionId}
      interview={interview.data}
      onEnd={() => setEndedSessionId(sessionId)}
      onStartNew={goToSetup}
    />
  );
}
