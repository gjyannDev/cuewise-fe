"use client";

import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationCallbacks } from "@/hooks/use-mutation-callback";
import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";
import { cn } from "@/lib/utils";
import { InterviewConfigForm } from "@/modules/interviews/components/setup/InterviewConfigForm";
import { InterviewMessageCard } from "@/modules/interviews/components/common/InterviewMessageCard";
import { InterviewNotFoundCard } from "@/modules/interviews/components/common/InterviewNotFoundCard";
import {
  INTERVIEWS_ROUTE,
  START_TIMEOUT_MESSAGE,
} from "@/modules/interviews/constants";
import {
  useInterviewMessagesQuery,
  useInterviewQuery,
  useStartInterviewMutation,
} from "@/modules/interviews/queries/interviews.queries";
import type {
  SessionParam,
  StartInterviewFieldErrors,
  StartInterviewRequest,
} from "@/modules/interviews/types/interviews.types";
import { getStartErrorResult } from "@/modules/interviews/utils/interview.utils";

import { ActiveInterview } from "./ActiveInterview";

type InterviewsContainerProps = {
  sessionParam: SessionParam;
};

/**
 * Picks the screen from `?session=` (setup card without it, interview screen with it), owns the
 * interview queries and navigation, and passes data and callbacks to presentational components.
 */
export function InterviewsContainer({
  sessionParam,
}: InterviewsContainerProps) {
  const router = useRouter();
  const sessionId = sessionParam.kind === "valid" ? sessionParam.id : undefined;
  const startInterview = useStartInterviewMutation();
  const interview = useInterviewQuery(sessionId);
  const messages = useInterviewMessagesQuery(sessionId);
  // Keeps the form busy until the interview screen has actually replaced it.
  const [isNavigating, startNavigation] = useTransition();
  // ponytail: client-only until cuewise-be can end a session; a reload shows the interview again (spec EC13).
  const [endedSessionId, setEndedSessionId] = useState<string>();

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Interview" });
  const startCallbacks = buildCallbacks("start", "interview", {
    errorMessage: "Couldn't start the interview",
  });
  // No reply within START_TIMEOUT_MS: a session may exist on the backend, but nothing can find it yet.
  const startTimeoutCallbacks = buildCallbacks("start", "interview", {
    errorMessage: START_TIMEOUT_MESSAGE,
  });

  const goToSetup = () => startNavigation(() => router.push(INTERVIEWS_ROUTE));

  async function handleStart(
    request: StartInterviewRequest,
  ): Promise<StartInterviewFieldErrors | void> {
    try {
      const created = await startInterview.mutateAsync(request);
      startNavigation(() =>
        router.push(`${INTERVIEWS_ROUTE}?session=${created.session.id}`),
      );
    } catch (error) {
      const fieldErrors = getStartErrorResult(error);
      if (fieldErrors) {
        return fieldErrors;
      }
      (isNoResponseError(error)
        ? startTimeoutCallbacks
        : startCallbacks
      ).onError(error);
    }
  }

  const notFound = (
    <InterviewNotFoundCard
      action={
        <Button size="lg" className="h-11" onClick={goToSetup}>
          Start a new interview
        </Button>
      }
    />
  );

  if (sessionParam.kind === "none") {
    return (
      <InterviewConfigForm
        isPending={startInterview.isPending || isNavigating}
        onSubmit={handleStart}
      />
    );
  }
  if (sessionParam.kind === "invalid") {
    return notFound;
  }
  if (interview.isPending || messages.isPending) {
    return <SessionSkeleton />;
  }
  if (
    [interview, messages].some(
      (query) => query.isError && parseApiError(query.error).status === 404,
    )
  ) {
    return notFound;
  }
  // Only when nothing is cached: a failed background refetch keeps the interview on screen.
  if (!interview.data) {
    return (
      <InterviewMessageCard
        role="alert"
        icon={TriangleAlertIcon}
        title="We couldn't load this interview"
        description="Check your connection and try again."
        action={
          <Button
            variant="outline"
            size="lg"
            className="h-11"
            onClick={() => interview.refetch()}
          >
            <RotateCcwIcon aria-hidden data-icon="inline-start" />
            Try again
          </Button>
        }
      />
    );
  }
  return (
    <ActiveInterview
      key={sessionId}
      interview={interview.data}
      transcript={messages.data?.items}
      onRetryThread={() => messages.refetch()}
      isEnded={endedSessionId === sessionId}
      onEnd={() => setEndedSessionId(sessionId)}
      onStartNew={goToSetup}
    />
  );
}

const SKELETON_BUBBLES = [
  { side: "left", width: "w-3/4" },
  { side: "right", width: "w-2/3" },
  { side: "left", width: "w-1/3" },
  { side: "left", width: "w-4/5" },
] as const;

/** Same frame as InterviewChat (centered fixed-height column, bar on top) so nothing jumps when the chat arrives. */
function SessionSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex h-[calc(100dvh-var(--app-header-height)-2*var(--app-content-py))] min-h-0 w-full max-w-3xl flex-col gap-3"
    >
      <span className="sr-only">Loading your interview…</span>
      <div className="flex h-11 shrink-0 items-center justify-between gap-3 pb-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex flex-1 flex-col justify-end gap-3 py-4">
        {SKELETON_BUBBLES.map((bubble, index) => (
          <div
            key={index}
            className={cn(
              "flex items-end gap-2",
              bubble.side === "right" && "justify-end",
            )}
          >
            {bubble.side === "left" && (
              <Skeleton className="size-6 shrink-0 rounded-full" />
            )}
            <Skeleton className={cn("h-12 rounded-2xl", bubble.width)} />
          </div>
        ))}
      </div>
      <Skeleton className="h-24 w-full shrink-0 rounded-2xl" />
    </div>
  );
}
