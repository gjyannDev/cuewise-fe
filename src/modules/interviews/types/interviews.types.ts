import type { z } from "zod";

import type { FEEDBACK_CRITERIA, HISTORY_SORT_COLUMNS, SESSION_STATUSES, SORT_DIRECTIONS } from "../constants";
import type {
  answerFormSchema,
  answerStreamEventSchemas,
  answerRequestSchema,
  answerResponseSchema,
  feedbackQuestionSchema,
  feedbackSchema,
  interviewListItemSchema,
  interviewListSchema,
  interviewSchema,
  interviewTypeSchema,
  levelSchema,
  roleSchema,
  startInterviewFormSchema,
  transcriptItemSchema,
  transcriptionResponseSchema,
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

/**
 * What to do after a failed answer: refetch the interview, show the error under the answer, toast it, or (no
 * response at all) treat the outcome as unknown because the backend may have saved it.
 */
export type AnswerErrorResult =
  | { kind: "resync" }
  | { kind: "field"; message: string }
  | { kind: "toast" }
  | { kind: "unknown" };

export type Transcription = z.infer<typeof transcriptionResponseSchema>;

/**
 * What to do after a failed transcription: refetch the interview (it moved on or is gone), or show `message`.
 * The typed text is never touched either way.
 */
export type TranscribeErrorResult = { kind: "resync" } | { kind: "message"; message: string };

/**
 * How a send ended: the backend's reply, `recovered` when a lost reply turned out to have been saved, or `cancelled`
 * when the screen went away mid-turn (nothing is written then).
 */
export type AnswerOutcome =
  | { kind: "answered"; response: AnswerResponse }
  | { kind: "recovered" }
  | { kind: "cancelled" };

/** Which screen a loaded interview needs: the current question, the completed card, or the ended card (abandoned). */
export type InterviewStep =
  | { kind: "question"; question: InterviewQuestion }
  | { kind: "completed" }
  | { kind: "ended" };

type StreamSchemas = typeof answerStreamEventSchemas;
export type AnswerStreamEventName = keyof StreamSchemas;
/** One parsed event of a streamed answer turn. */
export type AnswerStreamEvent = {
  [Name in AnswerStreamEventName]: { event: Name; data: z.infer<StreamSchemas[Name]> };
}[AnswerStreamEventName];

export type TranscriptItem = z.infer<typeof transcriptItemSchema>;
export type Transcript = z.infer<typeof transcriptSchema>;

export type SessionStatus = (typeof SESSION_STATUSES)[number];
export type InterviewListItem = z.infer<typeof interviewListItemSchema>;
export type InterviewList = z.infer<typeof interviewListSchema>;
export type HistorySortColumn = (typeof HISTORY_SORT_COLUMNS)[number];
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export type Criterion = (typeof FEEDBACK_CRITERIA)[number];
export type Feedback = z.infer<typeof feedbackSchema>;
export type FeedbackQuestion = z.infer<typeof feedbackQuestionSchema>;
export type FeedbackEvidence = FeedbackQuestion["evidence"][number];

/**
 * A failed feedback request, sorted by what the page does next. `poll`: no response or already generating, so read the
 * stored row (it may have finished). `rateLimited` only toasts. The rest pick a screen.
 */
export type FeedbackErrorResult = {
  kind: "poll" | "notCompleted" | "notFound" | "failed" | "unavailable" | "rateLimited" | "unknown";
};

/** Which screen the feedback page shows. */
export type FeedbackView =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "generating" }
  | { kind: "stalled" }
  | { kind: "generated"; feedback: Feedback }
  | { kind: "insufficient"; message: string | null }
  | { kind: "failed" }
  | { kind: "unavailable" }
  | { kind: "notCompleted" }
  | { kind: "notFound" }
  | { kind: "unknown" };

/** What `getFeedbackView` decides from. `stored`: undefined while loading, null when none is stored yet. */
export type FeedbackViewInput = {
  stored: Feedback | null | undefined;
  /** The read failed (only used while nothing is cached). */
  queryError?: FeedbackErrorResult;
  /** The last POST failed (cleared when a new one starts). */
  generateError?: FeedbackErrorResult;
  isGenerating: boolean;
  /** The closing card asked to generate and the request is about to start. */
  startRequested: boolean;
  /** A stored `generating` row has been polled for longer than the backend's takeover window. */
  isStalled: boolean;
};

/**
 * `/history`'s URL state after validation, defaults filled in: a 1-based page, rows per page, the sort column and
 * direction, and an optional status filter (none means all).
 */
export type HistoryParams = {
  page: number;
  size: number;
  sort: HistorySortColumn;
  order: SortDirection;
  status?: SessionStatus;
};

/** The GET /interviews query string for one history page. */
export type InterviewListParams = {
  limit: number;
  offset: number;
  status?: SessionStatus;
  sort_by?: HistorySortColumn;
  sort_dir?: SortDirection;
};

/**
 * A transcript line as the thread renders it. `key` is `position:kind`, stable across refetches (ids of a just-sent
 * answer are later replaced by the stored ones) and known for a question still being streamed, so bubbles never
 * remount and the log never re-announces. `pending`: the answer being sent. `streaming`: a reaction or question of
 * the turn in progress, shown before it is saved.
 */
export type ThreadItem = TranscriptItem & { key: string; pending?: boolean; streaming?: boolean };

/** What the thread shows, plus what the screen derives from it. */
export type ThreadView = {
  items: ThreadItem[];
  /**
   * Main number of the last visible question: the progress shown as "N of M". A follow-up keeps its main question's
   * number, so this never exceeds `question_count` (unlike `position`, which counts follow-ups too).
   */
  mainNumber: number;
  /** The last question without an answer, from the whole thread (even while hidden): what the composer answers. */
  openQuestion?: TranscriptItem;
};
