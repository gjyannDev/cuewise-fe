import type { Reaction, ThreadItem, ThreadView, TranscriptItem } from "../types/interviews.types";
import { inferStreamingQuestion } from "./reduce-answer-stream";

type ThreadViewOptions = {
  /** The answer being sent, shown before the backend confirms it. */
  pendingAnswer?: { questionId: string; text: string };
  /** What the turn in progress has streamed so far: never saved, replaced by the saved lines once `done` lands. */
  streaming?: { answered: TranscriptItem; reaction?: NonNullable<Reaction>; questionText: string };
};

/**
 * Position and kind: unique in an interview (the answer and reaction share their question's position), stable across
 * refetches, and known for the question being streamed before it has an id. So a streamed line keeps its key, and its
 * bubble, when the saved line replaces it.
 */
const keyOf = (item: Pick<TranscriptItem, "position" | "kind">) => `${item.position}:${item.kind}`;

/** What the thread renders, derived from the cached transcript plus the send in progress. */
export function buildThreadView(transcript: TranscriptItem[], { pendingAnswer, streaming }: ThreadViewOptions): ThreadView {
  const items: ThreadItem[] = transcript.map((item) => ({ ...item, key: keyOf(item) }));

  const isStored = (questionId: string) =>
    transcript.some((item) => item.kind === "answer" && item.question_id === questionId);
  if (pendingAnswer && !isStored(pendingAnswer.questionId)) {
    const question = transcript.find((item) => item.kind === "question" && item.question_id === pendingAnswer.questionId);
    const pending: TranscriptItem = {
      id: `${pendingAnswer.questionId}-answer`,
      question_id: pendingAnswer.questionId,
      position: question?.position ?? 0,
      question_kind: question?.question_kind ?? "main",
      main_number: question?.main_number ?? 0,
      role: "candidate",
      kind: "answer",
      text: pendingAnswer.text,
      created_at: null,
    };
    items.push({ ...pending, key: keyOf(pending), pending: true });
  }

  // Once the saved turn is in the transcript (`done`), it replaces the streamed lines under the same keys.
  if (streaming && !isStored(streaming.answered.question_id)) {
    const { answered, reaction, questionText } = streaming;
    if (reaction) {
      const line: TranscriptItem = {
        ...answered,
        id: reaction.id,
        role: "interviewer",
        kind: "reaction",
        text: reaction.text,
        created_at: null,
      };
      items.push({ ...line, key: keyOf(line), streaming: true });
    }
    if (questionText) {
      const placement = inferStreamingQuestion(answered, reaction !== undefined);
      const id = `${answered.question_id}-next`;
      const line: TranscriptItem = {
        ...placement,
        id,
        question_id: id,
        role: "interviewer",
        kind: "question",
        text: questionText,
        created_at: null,
      };
      items.push({ ...line, key: keyOf(line), streaming: true });
    }
  }

  const lastQuestion = transcript.findLast((item) => item.kind === "question");
  const openQuestion = lastQuestion && !isStored(lastQuestion.question_id) ? lastQuestion : undefined;
  return { items, mainNumber: lastQuestion?.main_number ?? 0, openQuestion };
}
