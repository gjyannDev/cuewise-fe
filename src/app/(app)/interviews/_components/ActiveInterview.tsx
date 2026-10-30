"use client";

import { MessageSquareWarningIcon, RotateCcwIcon } from "lucide-react";
import { type ReactNode, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useWarnBeforeUnload } from "@/hooks/use-warn-before-unload";
import { type AnswerComposerHandle, AnswerComposer } from "@/modules/interviews/components/AnswerComposer";
import { InterviewChat } from "@/modules/interviews/components/InterviewChat";
import { InterviewClosingCard } from "@/modules/interviews/components/InterviewClosingCard";
import { InterviewMessageCard } from "@/modules/interviews/components/InterviewMessageCard";
import { STALE_THREAD_MESSAGE, THREAD_ERROR_MESSAGE } from "@/modules/interviews/constants";
import { useInterviewChat } from "@/modules/interviews/hooks/use-interview-chat";
import type { Interview, TranscriptItem } from "@/modules/interviews/types/interviews.types";
import { getInterviewStep } from "@/modules/interviews/utils/get-interview-step";

type ActiveInterviewProps = {
  interview: Interview;
  /** The conversation; undefined when it failed to load and nothing is cached. */
  transcript: TranscriptItem[] | undefined;
  onRetryThread: () => void;
  /** Ended on this screen (client-only: cuewise-be has no end endpoint yet). */
  isEnded: boolean;
  onEnd: () => void;
  onStartNew: () => void;
};

/**
 * A loaded interview as a chat. The status comes from the interview; what is asked and answered comes from the
 * conversation, so the composer always answers the question the thread shows. Render with `key={sessionId}`.
 */
export function ActiveInterview({
  interview,
  transcript,
  onRetryThread,
  isEnded,
  onEnd,
  onStartNew,
}: ActiveInterviewProps) {
  const { session } = interview;
  const chat = useInterviewChat(session.id, transcript ?? [], session.question_count);
  // Leaving mid-send drops the reply (the composer warns about unsent text itself).
  useWarnBeforeUnload(chat.isSending);
  const composer = useRef<AnswerComposerHandle>(null);
  const step = getInterviewStep(interview);
  const openQuestion = chat.view.openQuestion;

  const retryNotice = (title: string) => (
    <div className="mt-3 shrink-0">
      <InterviewMessageCard
        role="alert"
        icon={MessageSquareWarningIcon}
        title={title}
        description="Check your connection and try again."
        action={
          <Button variant="outline" size="lg" className="h-11" onClick={onRetryThread}>
            <RotateCcwIcon aria-hidden data-icon="inline-start" />
            Try again
          </Button>
        }
      />
    </div>
  );

  let footer: ReactNode;
  if (!transcript) {
    footer = retryNotice(THREAD_ERROR_MESSAGE);
  } else if (isEnded || step.kind === "ended") {
    // Wins over a reply that lands after End interview.
    footer = <InterviewClosingCard variant="ended" autoFocus={isEnded} onStartNew={onStartNew} />;
  } else if (step.kind === "completed" && !chat.isRevealing) {
    footer = <InterviewClosingCard variant="completed" autoFocus={chat.hasSent} onStartNew={onStartNew} />;
  } else if (!openQuestion && !chat.isBusy) {
    // In progress, but the cached conversation has nothing left to answer: stale, so offer a refetch.
    footer = retryNotice(STALE_THREAD_MESSAGE);
  } else {
    footer = (
      <AnswerComposer
        // A new question gets a fresh, empty box; it takes focus only after the user's own send.
        key={openQuestion?.question_id ?? "closing"}
        ref={composer}
        isBusy={chat.isBusy || !openQuestion}
        autoFocus={chat.hasSent}
        onSubmit={(answer) => (openQuestion ? chat.submit(openQuestion, answer) : Promise.resolve())}
      />
    );
  }

  const canEnd = !isEnded && step.kind === "question";
  return (
    <InterviewChat
      session={session}
      items={chat.view.items}
      position={chat.view.position}
      thinkingLabel={chat.thinkingLabel}
      footer={footer}
      onEnd={canEnd ? onEnd : undefined}
      onJump={() => composer.current?.focus()}
    />
  );
}
