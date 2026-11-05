import Link from "next/link";

import { Button } from "@/components/ui/button";

import { INTERVIEWS_ROUTE, ROLE_LABELS } from "../constants";
import type { InterviewListItem } from "../types/interviews.types";
import { formatInterviewDate } from "../utils/format-interview-date";

type InterviewHistoryRowActionsProps = {
  interview: InterviewListItem;
};

// Both actions share one width, so the Actions column lines up whichever a row shows.
const ACTION_WIDTH = "w-24";

/**
 * The history row's one action: Continue picks the in-progress interview back up; View is a placeholder that does
 * nothing yet (spec: what it opens is deferred). The accessible name says which interview, since every row has one.
 */
export function InterviewHistoryRowActions({ interview }: InterviewHistoryRowActionsProps) {
  const which = `${ROLE_LABELS[interview.role]} interview started ${formatInterviewDate(interview.created_at)}`;

  if (interview.status === "in_progress") {
    return (
      <Button asChild size="sm" className={ACTION_WIDTH}>
        <Link href={`${INTERVIEWS_ROUTE}?session=${interview.id}`} aria-label={`Continue ${which}`}>
          Continue
        </Link>
      </Button>
    );
  }
  return (
    <Button type="button" size="sm" variant="outline" className={ACTION_WIDTH} aria-label={`View ${which}`}>
      View
    </Button>
  );
}
