import { createColumnHelper } from "@tanstack/react-table";

import type { DataTableFeatures } from "@/shared/ui/data-table-features";
import { DataTableColumnHeader } from "@/shared/ui/DataTableColumnHeader";

import { INTERVIEW_TYPE_LABELS, LEVEL_LABELS, ROLE_LABELS } from "../constants";
import type { InterviewListItem } from "../types/interviews.types";
import { formatInterviewDate } from "../utils/format-interview-date";
import { formatProgress } from "../utils/format-question-count";
import { InterviewHistoryRowActions } from "./InterviewHistoryRowActions";
import { InterviewStatusBadge } from "./InterviewStatusBadge";

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
    cell: (info) => <InterviewStatusBadge status={info.getValue()} />,
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
    cell: ({ row }) => <InterviewHistoryRowActions interview={row.original} />,
  }),
]);
