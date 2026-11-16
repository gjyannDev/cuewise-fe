import type { z } from "zod";

import type { DeviceError } from "@/lib/media";

import type { FEEDBACK_CRITERIA, HISTORY_SORT_COLUMNS, SESSION_STATUSES, SORT_DIRECTIONS } from "../constants";
import type {
  answerStreamEventSchemas,
  answerRequestSchema,
  answerResponseSchema,
  feedbackQuestionSchema,
  feedbackSchema,
  interviewListItemSchema,
  interviewListSchema,
  interviewSchema,
  interviewTypeSchema,
  jobImportResponseSchema,
  jobTextRequestSchema,
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

/** The job description import routes' reply (link or pasted page). */
export type JobImport = z.infer<typeof jobImportResponseSchema>;
export type JobTextRequest = z.infer<typeof jobTextRequestSchema>;
/** Where a failed import is shown: under the link field, under the job description, or as a toast. */
export type JobImportErrorResult =
  | { kind: "field"; target: "url" | "jobDescription"; message: string }
  | { kind: "toast"; message: string };

export type Interview = z.infer<typeof interviewSchema>;
export type InterviewSession = Interview["session"];
export type InterviewQuestion = NonNullable<Interview["current_question"]>;

/** The POST /interviews/{id}/messages body. */
export type AnswerRequest = z.output<typeof answerRequestSchema>;
export type AnswerResponse = z.infer<typeof answerResponseSchema>;
export type Reaction = AnswerResponse["reaction"];

/** The `?session=` param after validation; plain data so a Server Component can pass it to a client one. */
export type SessionParam = { kind: "none" } | { kind: "invalid" } | { kind: "valid"; id: string };

/** Field errors the setup form should show after a failed start. */
export type StartInterviewFieldErrors = Partial<Record<keyof StartInterviewFormValues, string>>;

/** Whether the candidate has a stored résumé profile, as far as the setup form knows (it gates the toggle). */
export type ResumeStatus = "checking" | "available" | "missing" | "error";

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
 * Nothing was sent, so the room just goes back to the candidate's turn.
 */
export type TranscribeErrorResult = { kind: "resync" } | { kind: "message"; message: string };

/**
 * One interviewer line that can be spoken: a question (main or follow-up) or a reaction, by its stored id. The kind picks
 * the speech route (questions and reactions live in different tables in cuewise-be).
 */
export type InterviewerLine = { kind: "question" | "reaction"; id: string };

/** What to do after a failed speech fetch: refetch the interview, or show `message` (the line stays in the transcript). */
export type SpeechErrorResult = { kind: "resync" } | { kind: "message"; message: string };

/** Where the room is in a turn (the spec's turn table). */
export type RoomPhase =
  | "lobby"
  | "speaking"
  | "your-turn"
  | "recording"
  | "transcribing"
  | "review"
  | "thinking"
  | "closed";

/** The room's turn state. Server data stays in the Query cache; this only holds what the turn needs. */
export type RoomState = {
  phase: RoomPhase;
  /** Lines aren't played automatically (replay still plays). */
  muted: boolean;
  /** False without a usable microphone: Answer is refused with a message. */
  micAvailable: boolean;
  /** The transcribed answer under review; kept through a re-record until it is replaced, sent or discarded. */
  unsent: string | null;
  /** A failed send's field error (422), shown under the unsent answer. */
  fieldError: string | null;
  /** `blocked`: the browser refused automatic playback, so the room shows a quiet "tap replay" hint. */
  hint: "blocked" | null;
  /** The line playing now was asked for (replay): its end doesn't move focus. */
  replaying: boolean;
  /** The interview is complete: the final reaction is playing, then the room closes. */
  closing: boolean;
  /** Where the room goes when the line that is playing ends. */
  returnTo: "your-turn" | "review" | "closed";
};

/** Everything that moves the turn on: the candidate's actions and what the devices and the backend report back. */
export type RoomEvent =
  | { type: "join"; current: InterviewerLine | null }
  | { type: "speechFinished"; end: "ended" | "failed" | "blocked"; message?: string }
  | { type: "answer" }
  | { type: "stop" }
  | { type: "cancel" }
  | { type: "recorded"; recording: Blob | null; end: "stopped" | "limit" }
  | { type: "transcribed"; text: string }
  | { type: "transcribeFailed"; message: string | null }
  | { type: "send" }
  | { type: "sendFailed"; fieldError?: string }
  | { type: "turnSaved"; lines: InterviewerLine[]; completed: boolean }
  | { type: "resynced"; current: InterviewerLine | null }
  | { type: "replay"; line: InterviewerLine }
  | { type: "toggleMute" }
  | { type: "setMicAvailable"; available: boolean }
  | { type: "end" }
  /** The room was left or hidden (Next keeps a hidden page's state): stop everything; coming back starts at the lobby. */
  | { type: "leave" };

/** What should happen, as plain data. The turn hook runs each one; the reducer never touches a device or the network. */
export type RoomEffect =
  | { type: "stopAudio" }
  | { type: "speak"; lines: InterviewerLine[] }
  | { type: "replay"; line: InterviewerLine }
  | { type: "startRecording" }
  | { type: "stopRecording" }
  | { type: "cancelRecording" }
  | { type: "transcribe"; recording: Blob }
  | { type: "send"; text: string }
  | { type: "releaseDevices" }
  | { type: "notice"; message: string }
  | { type: "focus"; target: "send" | "answer" };

/**
 * How a transcription ended: the text, a message to show, or nothing (it was cancelled, or the interview moved on and
 * the screen is refetching).
 */
export type TranscribeResult = { kind: "text"; text: string } | { kind: "message"; message: string } | { kind: "none" };

/** How spoken lines ended. `stopped`: cut short on purpose (Answer, a replay, End), so nothing follows from it. */
export type SpeechOutcome = { end: "ended" | "stopped" | "failed" | "blocked"; message?: string };

/** The lobby's microphone check: still asking, usable, not possible in this browser, or why it failed. */
export type MicCheck = "checking" | "ready" | "unsupported" | DeviceError;

/**
 * The interviewer's voice, as the turn hook sees it. The one real port of the room: `use-interview-voice` implements it
 * today (pre-recorded speech), and a phase-2 live voice can implement it without touching the turn logic.
 */
export type VoicePort = {
  /** Unlocks playback; call inside the Join click. */
  join: () => void;
  /** Plays the lines in order (skipped while muted by the caller); settles when they've all played or one didn't. */
  speakLines: (lines: InterviewerLine[]) => Promise<SpeechOutcome>;
  /** Plays one line, muted or not: the candidate asked for it. */
  replay: (line: InterviewerLine) => Promise<SpeechOutcome>;
  stop: () => void;
  transcribe: (recording: Blob, signal: AbortSignal) => Promise<TranscribeResult>;
};

/**
 * How a send ended, for the room: saved (with the turn, so it knows what the interviewer says next), failed (with a
 * field error to show under the unsent answer, or none: a toast already said why), resynced or recovered (the
 * interview is being refetched), or cancelled (the screen went away).
 */
export type SendResult =
  | { kind: "saved"; response: AnswerResponse }
  | { kind: "failed"; fieldError?: string }
  | { kind: "resync" }
  | { kind: "recovered" }
  | { kind: "cancelled" };

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
 * A transcript line as the transcript panel renders it. `key` is `position:kind`, stable across refetches (ids of a
 * just-sent answer are later replaced by the stored ones) and known for a question still being streamed, so bubbles
 * never remount and the log never re-announces. `pending`: the answer being sent. `streaming`: a reaction or question of
 * the turn in progress, shown before it is saved. `unsent`: the transcribed answer under review (Send / Re-record), with
 * the field error of a failed send, if any.
 */
export type TranscriptLine = TranscriptItem & {
  key: string;
  pending?: boolean;
  streaming?: boolean;
  unsent?: boolean;
  fieldError?: string;
};

/** What the transcript shows, plus what the screen derives from it. */
export type TranscriptView = {
  items: TranscriptLine[];
  /**
   * Main number of the last visible question: the progress shown as "N of M". A follow-up keeps its main question's
   * number, so this never exceeds `question_count` (unlike `position`, which counts follow-ups too).
   */
  mainNumber: number;
  /** The last question without an answer, from the whole transcript (even while hidden): what the candidate answers next. */
  openQuestion?: TranscriptItem;
};
