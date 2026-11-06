import { useEffect, useEffectEvent, useRef, useState } from "react";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";

import { FEEDBACK_RATE_LIMIT_MESSAGE, FEEDBACK_STALL_MS, feedbackRoute } from "../constants";
import { useFeedbackQuery, useGenerateFeedbackMutation } from "../queries/interviews.queries";
import type { Feedback, FeedbackView } from "../types/interviews.types";
import { getFeedbackErrorResult, getFeedbackView, shouldStartOnArrival } from "../utils/feedback.utils";

/**
 * The feedback page's state: which screen to show and the actions it offers. The closing card's `?start=1` is read
 * once, when the stored feedback has loaded: it starts a generation only if nothing is stored, and is then removed
 * from the URL so a reload or a shared link never generates. The container is keyed per interview.
 */
export function useInterviewFeedback(id: string, startFlag: boolean) {
  const stored = useFeedbackQuery(id);
  const generation = useGenerateFeedbackMutation(id);
  const [stallElapsed, setStallElapsed] = useState(false);
  const arrivalHandled = useRef(false);

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Feedback" });
  const rateLimitCallbacks = buildCallbacks("generate", "feedback", { errorMessage: FEEDBACK_RATE_LIMIT_MESSAGE });

  function startGeneration() {
    // One request at a time: a second click before the screen switches does nothing.
    if (generation.isPending) {
      return;
    }
    generation.mutate(undefined, {
      // Every other failure picks a screen (getFeedbackView); a 429 leaves the page as it was.
      onError: (error) => {
        if (getFeedbackErrorResult(error).kind === "rateLimited") {
          rateLimitCallbacks.onError(error);
        }
      },
    });
  }

  const handleArrival = useEffectEvent((loaded: Feedback | null) => {
    window.history.replaceState(null, "", feedbackRoute(id));
    if (shouldStartOnArrival({ startFlag, stored: loaded })) {
      startGeneration();
    }
  });

  // Once per page: Strict Mode's second effect run and later refetches find the ref set.
  useEffect(() => {
    if (!startFlag || stored.data === undefined || arrivalHandled.current) {
      return;
    }
    arrivalHandled.current = true;
    handleArrival(stored.data);
  }, [startFlag, stored.data]);

  // A row still `generating` after the backend's takeover window: offer a new try (polling continues meanwhile).
  const isStoredGenerating = stored.data?.status === "generating";
  useEffect(() => {
    if (!isStoredGenerating) {
      return;
    }
    const timer = setTimeout(() => setStallElapsed(true), FEEDBACK_STALL_MS);
    return () => clearTimeout(timer);
  }, [isStoredGenerating]);

  const view = getFeedbackView({
    stored: stored.data,
    queryError: stored.error ? getFeedbackErrorResult(stored.error) : undefined,
    generateError: generation.error ? getFeedbackErrorResult(generation.error) : undefined,
    isGenerating: generation.isPending,
    startRequested: startFlag && stored.data === null && generation.isIdle,
    isStalled: stallElapsed && isStoredGenerating,
  });

  // Set during render from the previous screen (no effect): true only right after generating ended in a result, so
  // the result takes focus and is announced then, never when it was already stored on page load.
  const [previousKind, setPreviousKind] = useState<FeedbackView["kind"]>(view.kind);
  const [justGenerated, setJustGenerated] = useState(false);
  if (previousKind !== view.kind) {
    setPreviousKind(view.kind);
    setJustGenerated(view.kind === "generated" && (previousKind === "generating" || previousKind === "stalled"));
  }

  return {
    view,
    justGenerated,
    /** Get feedback, and Try again after a failure or a stall: a new POST. */
    generate: () => {
      setStallElapsed(false);
      startGeneration();
    },
    /** Try again on the generic error: repeat whatever failed (the POST, or the first read). */
    retry: () => {
      if (generation.isError) {
        startGeneration();
      } else {
        void stored.refetch();
      }
    },
  };
}
