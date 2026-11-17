import type { Feedback, InterviewListItem } from "../types/interviews.types";

/** Local Monday 00:00 of the week `now` falls in. */
function startOfWeek(now: Date): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  // getDay() is 0 on Sunday: shift so Monday is 0 and Sunday is 6.
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

/**
 * The dashboard's "This week": interviews among the newest `items` started this local week (Monday to Sunday).
 * GET /interviews has no date filter, so the count only sees one page: `capped` says the real number may be higher
 * (every row is from this week and more interviews exist).
 */
export function countThisWeek(items: InterviewListItem[], total: number, now: Date) {
  const from = startOfWeek(now);
  const to = new Date(from);
  to.setDate(to.getDate() + 7);
  const count = items.filter((item) => {
    const started = new Date(item.created_at);
    return started >= from && started < to;
  }).length;
  return { count, capped: count > 0 && count === items.length && total > items.length };
}

/** Completed interviews as a whole percent of every interview started; null when there are none (shown as "—"). */
export const completionRate = (completed: number, total: number) =>
  total === 0 ? null : Math.round((completed / total) * 100);

export type FeedbackSnapshot =
  | { kind: "score"; overall: number; takeaway: string | null }
  | { kind: "summary"; summary: string | null }
  | { kind: "pending"; reason: "none" | "generating" | "failed" };

/**
 * What the dashboard shows of the latest completed interview's feedback: the score and one line to work on, the
 * summary when there was too little to score, or why there is nothing to show yet.
 */
export function getFeedbackSnapshot(feedback: Feedback | null): FeedbackSnapshot {
  if (!feedback) {
    return { kind: "pending", reason: "none" };
  }
  if (feedback.status !== "generated") {
    return { kind: "pending", reason: feedback.status };
  }
  if (!feedback.enough_evidence || feedback.overall === null) {
    return { kind: "summary", summary: feedback.summary };
  }
  return {
    kind: "score",
    overall: feedback.overall,
    takeaway: feedback.improvements[0] ?? feedback.next_steps[0] ?? null,
  };
}
