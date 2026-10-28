import { Card, CardContent } from "@/components/ui/card";

import type { Interview } from "../types/interviews.types";
import { AnswerForm } from "./AnswerForm";
import { EndInterviewDialog } from "./EndInterviewDialog";
import { InterviewColumns } from "./InterviewColumns";
import { InterviewDetailsCard } from "./InterviewDetailsCard";
import { QuestionCard } from "./QuestionCard";

type InterviewSessionProps = {
  interview: Interview;
  onEnd: () => void;
};

/** The dedicated interview screen: question and answer box, with the interview's details beside them. */
export function InterviewSession({ interview, onEnd }: InterviewSessionProps) {
  const { session, current_question: question } = interview;

  return (
    <InterviewColumns
      asideLabel="Interview details"
      aside={<InterviewDetailsCard session={session} footer={<EndInterviewDialog onConfirm={onEnd} />} />}
    >
      <QuestionCard question={question} total={session.question_count} />
      <Card>
        <CardContent>
          {/* Keyed by question so a later "next question" starts with an empty box. */}
          <AnswerForm key={question.id} />
        </CardContent>
      </Card>
    </InterviewColumns>
  );
}
