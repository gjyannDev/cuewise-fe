import { Card, CardContent } from "@/components/ui/card";

import type { InterviewQuestion, InterviewSession as InterviewSessionData } from "../types/interviews.types";
import { AnswerForm } from "./AnswerForm";
import { EndInterviewDialog } from "./EndInterviewDialog";
import { InterviewColumns } from "./InterviewColumns";
import { InterviewDetailsCard } from "./InterviewDetailsCard";
import { QuestionCard } from "./QuestionCard";
import { ReactionCard } from "./ReactionCard";

type InterviewSessionProps = {
  session: InterviewSessionData;
  question: InterviewQuestion;
  /** The reaction to the answer just sent; while it is set, it replaces the answer box. */
  reaction?: { text: string; isFinal: boolean };
  /** Focus the question when it appears (after Next question). */
  focusQuestion?: boolean;
  isPending: boolean;
  onSubmit: (answer: string) => Promise<string | void>;
  onContinue: () => void;
  onEnd: () => void;
};

/** The dedicated interview screen: question and answer box (or the reaction), with the interview's details beside them. */
export function InterviewSession({
  session,
  question,
  reaction,
  focusQuestion,
  isPending,
  onSubmit,
  onContinue,
  onEnd,
}: InterviewSessionProps) {
  return (
    <InterviewColumns
      asideLabel="Interview details"
      aside={
        <InterviewDetailsCard
          session={session}
          footer={reaction ? undefined : <EndInterviewDialog onConfirm={onEnd} />}
        />
      }
    >
      {/* Keyed by question so a new question remounts: focus moves to it and the answer box starts empty. */}
      <QuestionCard key={question.id} question={question} total={session.question_count} autoFocus={focusQuestion} />
      {reaction ? (
        <ReactionCard text={reaction.text} isFinal={reaction.isFinal} onContinue={onContinue} />
      ) : (
        <Card>
          <CardContent>
            <AnswerForm key={question.id} isPending={isPending} onSubmit={onSubmit} />
          </CardContent>
        </Card>
      )}
    </InterviewColumns>
  );
}
