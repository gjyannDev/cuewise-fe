import type { ThreadItem, ThreadView, TranscriptItem } from "../types/interviews.types";

type ThreadViewOptions = {
  /** The answer being sent, shown before the backend confirms it. */
  pendingAnswer?: { questionId: string; text: string };
  /** The next question, held back during the reveal pause after a reaction. */
  hiddenQuestionId?: string;
  /** A reaction that arrived before the thinking indicator's minimum time was up. */
  hiddenReactionQuestionId?: string;
};

const keyOf = (item: Pick<TranscriptItem, "question_id" | "kind">) => `${item.question_id}:${item.kind}`;

/** What the thread renders, derived from the cached transcript plus the send in progress. */
export function buildThreadView(
  transcript: TranscriptItem[],
  { pendingAnswer, hiddenQuestionId, hiddenReactionQuestionId }: ThreadViewOptions,
): ThreadView {
  const isHidden = (item: TranscriptItem) =>
    (item.kind === "question" && item.question_id === hiddenQuestionId) ||
    (item.kind === "reaction" && item.question_id === hiddenReactionQuestionId);
  const items: ThreadItem[] = transcript.filter((item) => !isHidden(item)).map((item) => ({ ...item, key: keyOf(item) }));

  const isStored = (questionId: string) =>
    transcript.some((item) => item.kind === "answer" && item.question_id === questionId);
  if (pendingAnswer && !isStored(pendingAnswer.questionId)) {
    const question = transcript.find((item) => item.kind === "question" && item.question_id === pendingAnswer.questionId);
    const pending: TranscriptItem = {
      id: `${pendingAnswer.questionId}-answer`,
      question_id: pendingAnswer.questionId,
      position: question?.position ?? 0,
      role: "candidate",
      kind: "answer",
      text: pendingAnswer.text,
      created_at: null,
    };
    items.push({ ...pending, key: keyOf(pending), pending: true });
  }

  const visibleQuestions = items.filter((item) => item.kind === "question");
  const lastQuestion = transcript.findLast((item) => item.kind === "question");
  const openQuestion = lastQuestion && !isStored(lastQuestion.question_id) ? lastQuestion : undefined;
  return { items, position: visibleQuestions.at(-1)?.position ?? 0, openQuestion };
}
