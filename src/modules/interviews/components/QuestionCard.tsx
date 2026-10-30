import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { INTERVIEW_TYPE_LABELS } from "../constants";
import type { InterviewQuestion } from "../types/interviews.types";
import { focusOnMount } from "../utils/focus-on-mount";

type QuestionCardProps = {
  question: InterviewQuestion;
  total: number;
  /** Move focus to the question when it appears after Next question (not on page load). Key the card by question. */
  autoFocus?: boolean;
};

export function QuestionCard({ question, total, autoFocus = false }: QuestionCardProps) {
  const progressLabel = `Question ${question.position} of ${total}`;

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{progressLabel}</p>
          <Badge variant="secondary">{INTERVIEW_TYPE_LABELS[question.category]}</Badge>
        </div>
        <Progress
          aria-label="Interview progress"
          value={(question.position / total) * 100}
          getValueLabel={() => progressLabel}
        />
      </CardHeader>
      <CardContent>
        {/* Plain text on purpose: question text is never rendered as HTML. */}
        <h2
          ref={autoFocus ? focusOnMount : undefined}
          tabIndex={-1}
          className="max-w-prose font-display text-xl leading-snug font-semibold text-balance outline-none sm:text-2xl"
        >
          {question.text}
        </h2>
      </CardContent>
    </Card>
  );
}
