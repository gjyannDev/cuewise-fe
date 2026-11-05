export const INTERVIEWS_ROUTE = "/interviews";
export const HISTORY_ROUTE = "/history";

// Mirrors cuewise-be app/modules/interviews/interviews_constants.py; keep both in step.
export const ROLES = ["frontend", "backend", "fullstack", "mobile", "data"] as const;
export const LEVELS = ["intern", "junior", "mid", "senior"] as const;
export const INTERVIEW_TYPES = ["technical", "behavioral", "mixed"] as const;
export const QUESTION_CATEGORIES = ["technical", "behavioral"] as const;
/** A main question counts toward `question_count`; a follow-up digs into the answer to its main question. */
export const QUESTION_KINDS = ["main", "follow_up"] as const;
export const SESSION_STATUSES = ["in_progress", "abandoned", "completed"] as const;
/** Who said a transcript line, and what it is (GET /interviews/{id}/messages). */
export const TRANSCRIPT_ROLES = ["interviewer", "candidate"] as const;
export const TRANSCRIPT_KINDS = ["question", "answer", "reaction"] as const;
/** What a streamed answer turn is doing (cuewise-be `TurnPhase`). */
export const TURN_PHASES = ["received", "deciding", "writing"] as const;

export const MIN_QUESTION_COUNT = 1;
export const MAX_QUESTION_COUNT = 10;
export const JOB_DESCRIPTION_MAX_LENGTH = 2000;
export const ANSWER_MAX_LENGTH = 2000;
/** The composer shows its character counter only from here on, so it doesn't distract while writing. */
export const ANSWER_COUNTER_FROM = 1600;

/** cuewise-be's 409 codes for an answer to a question that is no longer current: the screen resyncs with GET. */
export const RESYNC_ERROR_CODES = ["QUESTION_NOT_CURRENT", "SESSION_NOT_IN_PROGRESS"] as const;

export const RESYNC_MESSAGE = "This question was already answered. Showing where you are now.";

/** Shown while the interviewer replies; one is picked at random per answer. Neutral: never hints at quality. */
export const INTERVIEWER_THINKING_LABELS = [
  "Thinking…",
  "Reading your answer…",
  "Considering your answer…",
  "Taking notes…",
  "Mulling it over…",
  "Preparing the next question…",
] as const;
export const INTERVIEWER_SLOW_LABEL = "Still thinking…";
/** Used instead of a random label when answering the last question (there is no next question to prepare). */
export const INTERVIEWER_WRAP_UP_LABEL = "Wrapping up…";

export const THINKING_SLOW_AFTER_MS = 5000;

/** The caption above a follow-up, where a main question shows "Question N of M". */
export const FOLLOW_UP_CAPTION = "Follow-up";

export const THREAD_ERROR_MESSAGE = "Couldn't load the conversation.";
export const STALE_THREAD_MESSAGE = "Couldn't load the latest question.";

/**
 * The whole streamed answer turn, browser side and in the /api forwarder: cuewise-be may spend up to 30s
 * (llm_total_budget_seconds) on it, and the turn is only saved at its end.
 */
export const ANSWER_TIMEOUT_MS = 45_000;
/** Starting adds a job-description summary (capped at 10s) before the first question's 30s LLM budget. */
export const START_TIMEOUT_MS = 60_000;
/**
 * Transcribing a recorded answer: cuewise-be gives Deepgram up to 20s (transcription_total_budget_seconds). The
 * forwarder waits a bit longer than that, and the browser longer still, so a slow request always ends with the
 * forwarder's clean 503 instead of whichever side happens to give up first.
 */
export const TRANSCRIBE_FORWARD_TIMEOUT_MS = 25_000;
export const TRANSCRIBE_TIMEOUT_MS = 30_000;

/** The composer stops a recording by itself here (cuewise-be rejects a reported duration over 125 s). */
export const RECORDING_MAX_SECONDS = 120;

/**
 * cuewise-be's error codes for POST /interviews/{id}/transcriptions (interviews_route + core/errors.py; keep in step),
 * with what the candidate sees for each. Anything else (no response, 503, unknown) shows the unavailable message.
 */
export const TRANSCRIPTION_UNAVAILABLE_MESSAGE = "Voice answers aren't available right now. You can type your answer.";
export const RECORDING_FAILED_MESSAGE = "Couldn't process that recording. Try again.";
export const TRANSCRIPTION_ERROR_MESSAGES: Record<string, string> = {
  NO_SPEECH: "Didn't catch that. Try again.",
  AUDIO_TOO_LONG: "Recordings are limited to 2 minutes.",
  RATE_LIMITED: "Too many recordings. Wait a moment and try again.",
  AUDIO_TOO_LARGE: RECORDING_FAILED_MESSAGE,
  UNSUPPORTED_AUDIO: RECORDING_FAILED_MESSAGE,
  TRANSCRIPTION_UNAVAILABLE: TRANSCRIPTION_UNAVAILABLE_MESSAGE,
};

/** Shown by the composer for problems in the browser, before anything is uploaded. */
export const MICROPHONE_BLOCKED_MESSAGE =
  "Microphone access is blocked. Allow it in your browser settings to answer by voice.";
export const MICROPHONE_UNAVAILABLE_MESSAGE = "Couldn't start the microphone.";
export const EMPTY_RECORDING_MESSAGE = TRANSCRIPTION_ERROR_MESSAGES.NO_SPEECH;
export const RECORDING_LIMIT_MESSAGE = TRANSCRIPTION_ERROR_MESSAGES.AUDIO_TOO_LONG;

/** A send with no response: the backend may still have saved it, so this never claims the answer was lost. */
export const UNCONFIRMED_SEND_MESSAGE =
  "We couldn't confirm your answer was sent. Check the conversation before sending again.";
export const START_TIMEOUT_MESSAGE = "Starting the interview took too long. Please try again.";

export const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full-stack",
  mobile: "Mobile",
  data: "Data",
};

export const LEVEL_LABELS: Record<(typeof LEVELS)[number], string> = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
};

export const INTERVIEW_TYPE_LABELS: Record<(typeof INTERVIEW_TYPES)[number], string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  mixed: "Mixed",
};

export const ROLE_OPTIONS = ROLES.map((value) => ({ value, label: ROLE_LABELS[value] }));
export const LEVEL_OPTIONS = LEVELS.map((value) => ({ value, label: LEVEL_LABELS[value] }));

export const INTERVIEW_TYPE_OPTIONS = [
  { value: "technical", label: "Technical", description: "Concepts, problem solving and system design." },
  { value: "behavioral", label: "Behavioral", description: "Teamwork, ownership and past experience." },
  { value: "mixed", label: "Mixed", description: "A balance of both, like most real interviews." },
] as const satisfies readonly { value: (typeof INTERVIEW_TYPES)[number]; label: string; description: string }[];

/** Role and level start unset so the user makes a deliberate choice. */
export const DEFAULT_START_VALUES = {
  role: undefined,
  level: undefined,
  interview_type: "mixed",
  question_count: 5,
  job_description: "",
} as const;

// --- History (/history): the user's past interviews, from GET /interviews ---

/** Rows-per-page choices for the history (cuewise-be allows up to 100); the first is the default. */
export const HISTORY_PAGE_SIZES = [10, 20, 50] as const;
export const HISTORY_PAGE_SIZE = HISTORY_PAGE_SIZES[0];

/**
 * The columns GET /interviews can sort by (cuewise-be `HistorySortColumn`; keep in step). They are also the response's
 * field names, so they double as the TanStack column ids.
 */
export const HISTORY_SORT_COLUMNS = ["created_at", "role", "level", "interview_type", "status"] as const;
export const SORT_DIRECTIONS = ["asc", "desc"] as const;

/** `/history` with no query string: page 1, 10 rows, newest first, every status. Defaults are never written to it. */
export const HISTORY_DEFAULT_PARAMS = {
  page: 1,
  size: HISTORY_PAGE_SIZE,
  sort: "created_at",
  order: "desc",
} as const satisfies {
  page: number;
  size: number;
  sort: (typeof HISTORY_SORT_COLUMNS)[number];
  order: (typeof SORT_DIRECTIONS)[number];
};

export const SESSION_STATUS_LABELS: Record<(typeof SESSION_STATUSES)[number], string> = {
  in_progress: "In progress",
  completed: "Completed",
  abandoned: "Abandoned",
};

/** The status filter: "all" sends no `status` to the backend. */
export const HISTORY_STATUS_ALL = "all";
export const HISTORY_STATUS_OPTIONS = [
  { value: HISTORY_STATUS_ALL, label: "All" },
  ...SESSION_STATUSES.map((value) => ({ value, label: SESSION_STATUS_LABELS[value] })),
] as const;

export const HISTORY_TABLE_LABEL = "Your interviews";
export const HISTORY_EMPTY_TITLE = "No interviews yet";
export const HISTORY_EMPTY_DESCRIPTION = "Your interviews show up here once you start one.";
export const HISTORY_FILTER_EMPTY_DESCRIPTION = "None of your interviews have this status. Show all to see the rest.";
export const HISTORY_PAST_END_TITLE = "Nothing on this page";
export const HISTORY_PAST_END_DESCRIPTION = "This page is past the end of your interviews.";
export const HISTORY_ERROR_TITLE = "We couldn't load your interviews";
export const HISTORY_ERROR_DESCRIPTION = "Check your connection and try again.";
export const HISTORY_REFRESH_ERROR = "Couldn't load this page. Showing the last one loaded.";
