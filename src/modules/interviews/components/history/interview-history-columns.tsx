import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/shared/ui/data-table-features";
import { DataTableColumnHeader } from "@/shared/ui/DataTableColumnHeader";

import {
  feedbackRoute,
  INTERVIEW_TYPE_LABELS,
  INTERVIEWS_ROUTE,
  LEVEL_LABELS,
  ROLE_LABELS,
  SESSION_STATUS_LABELS,
} from "@/modules/interviews/constants";
import type { InterviewListItem, SessionStatus } from "@/modules/interviews/types/interviews.types";
import { formatInterviewDate, formatProgress } from "@/modules/interviews/utils/format.utils";

const STATUS_VARIANTS = {
  in_progress: "default",
  completed: "secondary",
  abandoned: "outline",
} as const satisfies Record<SessionStatus, "default" | "secondary" | "outline">;

// Both actions share one width, so the Actions column lines up whichever a row shows.
const ACTION_WIDTH = "w-24";

const column = createColumnHelper<DataTableFeatures, InterviewListItem>();

/**
 * The history table's columns, at module scope (TanStack Table rebuilds its models when they change). The sortable
 * ones are accessors whose ids are cuewise-be's `sort_by` values; the backend sorts, so they need no sort function.
 * Progress and Actions are display columns and can't sort.
 */
export const interviewHistoryColumns = column.columns([
  column.accessor("role", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: (info) => ROLE_LABELS[info.getValue()],
  }),
  column.accessor("level", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
    cell: (info) => LEVEL_LABELS[info.getValue()],
  }),
  column.accessor("interview_type", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: (info) => INTERVIEW_TYPE_LABELS[info.getValue()],
  }),
  column.accessor("status", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: (info) => (
      <Badge variant={STATUS_VARIANTS[info.getValue()]}>{SESSION_STATUS_LABELS[info.getValue()]}</Badge>
    ),
  }),
  column.display({
    id: "progress",
    header: "Progress",
    cell: ({ row }) => formatProgress(row.original.answered_count, row.original.question_count),
  }),
  column.accessor("created_at", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Started" />,
    cell: (info) => formatInterviewDate(info.getValue()),
  }),
  column.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowAction interview={row.original} />,
  }),
]);

/**
 * The row's one action: Continue picks the in-progress interview back up; View opens a completed interview's
 * feedback; on an abandoned row View is still a placeholder (cuewise-be never scores those). The accessible name says
 * which interview, since every row has one.
 */
function RowAction({ interview }: { interview: InterviewListItem }) {
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
  if (interview.status === "completed") {
    return (
      <Button asChild size="sm" variant="outline" className={ACTION_WIDTH}>
        <Link href={feedbackRoute(interview.id)} aria-label={`View feedback for ${which}`}>
          View
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
