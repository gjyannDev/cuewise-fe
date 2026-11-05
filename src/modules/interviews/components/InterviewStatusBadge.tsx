import { Badge } from "@/components/ui/badge";

import { SESSION_STATUS_LABELS } from "../constants";
import type { SessionStatus } from "../types/interviews.types";

const STATUS_VARIANTS = {
  in_progress: "default",
  completed: "secondary",
  abandoned: "outline",
} as const satisfies Record<SessionStatus, "default" | "secondary" | "outline">;

type InterviewStatusBadgeProps = {
  status: SessionStatus;
};

export function InterviewStatusBadge({ status }: InterviewStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANTS[status]}>{SESSION_STATUS_LABELS[status]}</Badge>;
}
