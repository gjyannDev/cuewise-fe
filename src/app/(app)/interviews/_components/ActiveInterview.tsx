"use client";

import { InterviewCompletedPanel } from "@/modules/interviews/components/InterviewCompletedPanel";
import { InterviewSession } from "@/modules/interviews/components/InterviewSession";
import { useAnswerTurn } from "@/modules/interviews/hooks/use-answer-turn";
import type { Interview } from "@/modules/interviews/types/interviews.types";
import { getInterviewStep } from "@/modules/interviews/utils/get-interview-step";

type ActiveInterviewProps = {
  interview: Interview;
  onEnd: () => void;
  onStartNew: () => void;
};

/**
 * A loaded interview: answering, the reaction after each answer, then the completed panel. Render it with
 * `key={sessionId}` so the held reaction never leaks into another interview.
 */
export function ActiveInterview({ interview, onEnd, onStartNew }: ActiveInterviewProps) {
  const { turn, isPending, submit, advance } = useAnswerTurn(interview.session.id);

  // The cache already holds the next question; the answered one stays on screen with its reaction until Next.
  if (turn && !turn.isDismissed) {
    return (
      <InterviewSession
        session={interview.session}
        question={turn.question}
        reaction={{ text: turn.reaction.text, isFinal: turn.isFinal }}
        isPending={isPending}
        onSubmit={(answer) => submit(turn.question, answer)}
        onContinue={advance}
        onEnd={onEnd}
      />
    );
  }

  const step = getInterviewStep(interview);
  if (step.kind === "completed") {
    return (
      <InterviewCompletedPanel
        session={interview.session}
        closingText={turn?.isFinal ? turn.reaction.text : undefined}
        autoFocus={turn !== undefined}
        onStartNew={onStartNew}
      />
    );
  }
  return (
    <InterviewSession
      session={interview.session}
      question={step.question}
      focusQuestion={turn !== undefined}
      isPending={isPending}
      onSubmit={(answer) => submit(step.question, answer)}
      onContinue={advance}
      onEnd={onEnd}
    />
  );
}
