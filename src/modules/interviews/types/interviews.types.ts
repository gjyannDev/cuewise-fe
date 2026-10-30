import type { z } from "zod";

import type {
  answerFormSchema,
  answerRequestSchema,
  answerResponseSchema,
  interviewSchema,
  interviewTypeSchema,
  levelSchema,
  roleSchema,
  startInterviewFormSchema,
  transcriptItemSchema,
  transcriptSchema,
} from "../schemas/interviews.schema";

export type Role = z.infer<typeof roleSchema>;
export type Level = z.infer<typeof levelSchema>;
export type InterviewType = z.infer<typeof interviewTypeSchema>;

/** What the setup form edits (role and level may still be unset). */
export type StartInterviewFormValues = z.input<typeof startInterviewFormSchema>;
/** The POST /interviews body, produced by the setup form's schema. */
export type StartInterviewRequest = z.output<typeof startInterviewFormSchema>;

export type Interview = z.infer<typeof interviewSchema>;
export type InterviewSession = Interview["session"];
export type InterviewQuestion = NonNullable<Interview["current_question"]>;

export type AnswerFormValues = z.input<typeof answerFormSchema>;
/** The POST /interviews/{id}/messages body. */
export type AnswerRequest = z.output<typeof answerRequestSchema>;
export type AnswerResponse = z.infer<typeof answerResponseSchema>;
export type Reaction = AnswerResponse["reaction"];

/** The `?session=` param after validation; plain data so a Server Component can pass it to a client one. */
export type SessionParam = { kind: "none" } | { kind: "invalid" } | { kind: "valid"; id: string };

/** Field errors the setup form should show after a failed start. */
export type StartInterviewFieldErrors = Partial<Record<keyof StartInterviewFormValues, string>>;

/** What to do after a failed answer: refetch the interview, show the error under the answer, or toast it. */
export type AnswerErrorResult = { kind: "resync" } | { kind: "field"; message: string } | { kind: "toast" };

/** Which screen a loaded interview needs: the current question, the completed card, or the ended card (abandoned). */
export type InterviewStep =
  | { kind: "question"; question: InterviewQuestion }
  | { kind: "completed" }
  | { kind: "ended" };

export type TranscriptItem = z.infer<typeof transcriptItemSchema>;
export type Transcript = z.infer<typeof transcriptSchema>;

/**
 * A transcript line as the thread renders it. `key` is `question_id:kind`, stable across refetches (the client id
 * of a just-sent answer is later replaced by the stored one) so bubbles never remount and the log never re-announces.
 */
export type ThreadItem = TranscriptItem & { key: string; pending?: boolean };

/** What the thread shows, plus what the screen derives from it. */
export type ThreadView = {
  items: ThreadItem[];
  /** Position of the last visible question: the progress shown in "Question N of M". */
  position: number;
  /** The last question without an answer, from the whole thread (even while hidden): what the composer answers. */
  openQuestion?: TranscriptItem;
};
