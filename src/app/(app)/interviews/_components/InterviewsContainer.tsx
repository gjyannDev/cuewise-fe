"use client";

import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationCallbacks } from "@/hooks/use-mutation-callback";
import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";
import { InterviewConfigForm } from "@/modules/interviews/components/setup/InterviewConfigForm";
import { InterviewMessageCard } from "@/modules/interviews/components/common/InterviewMessageCard";
import { InterviewNotFoundCard } from "@/modules/interviews/components/common/InterviewNotFoundCard";
import {
  INTERVIEWS_ROUTE,
  START_TIMEOUT_MESSAGE,
} from "@/modules/interviews/constants";
import {
  useImportJobTextMutation,
  useImportJobUrlMutation,
  useInterviewMessagesQuery,
  useInterviewQuery,
  useStartInterviewMutation,
} from "@/modules/interviews/queries/interviews.queries";
import type {
  ResumeStatus,
  SessionParam,
  StartInterviewFieldErrors,
  StartInterviewRequest,
} from "@/modules/interviews/types/interviews.types";
import { getStartErrorResult } from "@/modules/interviews/utils/interview.utils";
import { useMarkProfileMissing, useProfileQuery } from "@/modules/profile/queries/profile.queries";

import { ActiveInterview } from "./ActiveInterview";

type InterviewsContainerProps = {
  sessionParam: SessionParam;
  /** The signed-in user's initials, for the room's camera-off tile. */
  initials: string;
};

/**
 * Picks the screen from `?session=` (setup card without it, interview screen with it), owns the
 * interview queries and navigation, and passes data and callbacks to presentational components.
 */
export function InterviewsContainer({
  sessionParam,
  initials,
}: InterviewsContainerProps) {
  const router = useRouter();
  const sessionId = sessionParam.kind === "valid" ? sessionParam.id : undefined;
  const startInterview = useStartInterviewMutation();
  // Fill the setup form's job description from a link or a whole pasted page; the form shows the result.
  const importJobUrl = useImportJobUrlMutation();
  const importJobText = useImportJobTextMutation();
  const interview = useInterviewQuery(sessionId);
  const messages = useInterviewMessagesQuery(sessionId);
  // Gates the setup form's "Use my résumé" toggle; the same cached query as /resume.
  const profile = useProfileQuery();
  const markProfileMissing = useMarkProfileMissing();
  const resumeStatus: ResumeStatus = profile.isPending
    ? "checking"
    : profile.data === undefined
      ? "error"
      : profile.data === null
        ? "missing"
        : "available";
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
        // PROFILE_REQUIRED: cuewise-be just said there is no résumé (deleted since the form last checked), so the
        // profile cache says so too and the toggle turns off, even if a refetch would have failed.
        if (fieldErrors.use_profile) {
          markProfileMissing();
        }
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
        resumeStatus={resumeStatus}
        jobImport={{
          importJobUrl: importJobUrl.mutateAsync,
          importJobText: importJobText.mutateAsync,
          isImportingLink: importJobUrl.isPending,
          isImportingPaste: importJobText.isPending,
        }}
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
      initials={initials}
    />
  );
}

/** Same frame as the interview room (fixed-height, title bar, stage with its control bar, transcript column), so nothing jumps when it arrives. */
function SessionSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex h-[calc(100dvh-var(--app-header-height)-2*var(--app-content-py))] min-h-0 w-full max-w-6xl flex-col gap-3"
    >
      <span className="sr-only">Loading your interview…</span>
      <div className="flex h-11 shrink-0 items-center justify-between gap-3 pb-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="flex min-h-0 flex-col gap-3">
          <Skeleton className="min-h-0 flex-1 rounded-xl" />
          <div className="flex shrink-0 justify-center gap-2 pt-3">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="size-11 rounded-full" />
            ))}
          </div>
        </div>
        <Skeleton className="hidden rounded-xl md:block" />
      </div>
    </div>
  );
}
