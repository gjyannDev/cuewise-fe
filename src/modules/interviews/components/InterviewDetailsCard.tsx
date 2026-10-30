import type { ReactNode } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { INTERVIEW_TYPE_LABELS, LEVEL_LABELS, ROLE_LABELS } from "../constants";
import type { InterviewSession } from "../types/interviews.types";
import { formatQuestionCount } from "../utils/format-question-count";
import { InterviewDetailList } from "./InterviewDetailList";

type InterviewDetailsCardProps = {
  session: InterviewSession;
  /** e.g. "Question 2 of 5": what the chat currently shows. */
  progress?: string;
  /** Rendered under the details, e.g. the End interview button. */
  footer?: ReactNode;
};

export function InterviewDetailsCard({ session, progress, footer }: InterviewDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base font-semibold">Interview details</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InterviewDetailList
          items={[
            ...(progress ? [{ label: "Progress", value: progress }] : []),
            { label: "Role", value: ROLE_LABELS[session.role] },
            { label: "Level", value: LEVEL_LABELS[session.level] },
            { label: "Style", value: INTERVIEW_TYPE_LABELS[session.interview_type] },
            { label: "Length", value: formatQuestionCount(session.question_count) },
          ]}
        />
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
