import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";

import {
  CRITERION_LABELS,
  FEEDBACK_CRITERIA,
  FEEDBACK_ERROR_CODES,
  FEEDBACK_START_VALUE,
  SCORE_MAX,
} from "../constants";
import type {
  Criterion,
  Feedback,
  FeedbackErrorResult,
  FeedbackQuestion,
  FeedbackView,
  FeedbackViewInput,
} from "../types/interviews.types";

/**
 * A generate request got no response, and the stored feedback shows nothing was saved: the backend never ran it (or
 * dropped it), so the page offers a new try.
 */
export class FeedbackLostError extends Error {
  constructor() {
    super("Feedback generation was not saved");
    this.name = "FeedbackLostError";
  }
}

export type CriterionScore = { criterion: Criterion; label: string; score: number };

/** How full a score's bar is, out of 5 (a 1 still shows a sliver, so it never reads as "no score"). */
export function scorePercent(score: number): number {
  return (score / SCORE_MAX) * 100;
}

/** The overall as the backend computed it, always with its one decimal ("4.0", not "4"). */
export function formatOverall(overall: number): string {
  return overall.toFixed(1);
}

/** A question's criterion scores in rubric order, with their labels; only the criteria the question has. */
export function questionScores(question: FeedbackQuestion): CriterionScore[] {
  return FEEDBACK_CRITERIA.flatMap((criterion) => {
    const score = question.scores[criterion];
    return score === undefined ? [] : [{ criterion, label: CRITERION_LABELS[criterion], score }];
  });
}

/**
 * What the feedback page does after a failed request. No response at all, or another request already generating, is
 * `poll`: cuewise-be finishes and stores the feedback whatever happened to this request, so the page reads it. Only
 * known codes pick a screen; the backend's own text is never shown.
 */
export function getFeedbackErrorResult(error: unknown): FeedbackErrorResult {
  if (error instanceof FeedbackLostError) {
    return { kind: "failed" };
  }
  if (isNoResponseError(error)) {
    return { kind: "poll" };
  }
  const { status, code } = parseApiError(error);

  if (status === 409) {
    if (code === FEEDBACK_ERROR_CODES.inProgress) return { kind: "poll" };
    if (code === FEEDBACK_ERROR_CODES.notCompleted) return { kind: "notCompleted" };
  }
  if (status === 404) return { kind: "notFound" };
  if (status === 429) return { kind: "rateLimited" };
  if (code === FEEDBACK_ERROR_CODES.failed) return { kind: "failed" };
  if (code === FEEDBACK_ERROR_CODES.unavailable) return { kind: "unavailable" };
  return { kind: "unknown" };
}

/**
 * The one place the feedback page's screen is decided. A failed POST picks its own screen (a 429 only toasts, so the
 * page stays as it was); otherwise the stored row decides, and a read error only matters when nothing is cached.
 */
export function getFeedbackView({
  stored,
  queryError,
  generateError,
  isGenerating,
  startRequested,
  isStalled,
}: FeedbackViewInput): FeedbackView {
  if (isGenerating) {
    return { kind: "generating" };
  }
  // A 429 only toasts. `poll` only gets here when the recovery read failed too: the outcome is unknown.
  if (generateError && generateError.kind !== "rateLimited") {
    return { kind: generateError.kind === "poll" ? "unknown" : generateError.kind };
  }
  if (stored === undefined) {
    if (!queryError) return { kind: "loading" };
    return { kind: queryError.kind === "notFound" ? "notFound" : "unknown" };
  }
  if (stored === null) {
    return { kind: startRequested ? "generating" : "none" };
  }
  return storedView(stored, isStalled);
}

/** A stored row as a screen: still running, given up, too little to assess, or the result. */
function storedView(stored: Feedback, isStalled: boolean): FeedbackView {
  if (stored.status === "generating") {
    return { kind: isStalled ? "stalled" : "generating" };
  }
  if (stored.status === "failed") {
    return { kind: "failed" };
  }
  return stored.enough_evidence === false
    ? { kind: "insufficient", message: stored.summary }
    : { kind: "generated", feedback: stored };
}

/** Generate on arrival only when the closing card asked and the read found nothing stored (never on a reload). */
export function shouldStartOnArrival({
  startFlag,
  stored,
}: {
  startFlag: boolean;
  stored: Feedback | null | undefined;
}): boolean {
  return startFlag && stored === null;
}

/** `?start=` on the feedback page: only a single "1" (what the closing card links to) means "generate on arrival". */
export function parseFeedbackStartParam(raw: string | string[] | undefined): boolean {
  return raw === FEEDBACK_START_VALUE;
}
