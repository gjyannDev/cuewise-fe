export const INTERVIEWS_ROUTE = "/interviews";
export const HISTORY_ROUTE = "/history";

// Mirrors cuewise-be app/modules/interviews/interviews_constants.py; keep both in step.
export const ROLES = ["frontend", "backend", "fullstack", "mobile", "data", "designer", "qa", "devops"] as const;
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

// --- Job description import (setup form): cuewise-be POST /interviews/job-url and /job-text (Slice 8b) ---

/** cuewise-be limits (keep in step): `JOB_URL_MAX_LENGTH` and `JOB_PASTE_MAX_CHARS` in interviews_constants.py. */
export const JOB_URL_MAX_LENGTH = 2048;
export const JOB_PASTE_MAX_CHARS = 1_000_000;
/** cuewise-be error codes (keep in step). Their messages are written for the candidate, so they are shown as-is. */
export const JOB_URL_ERROR_CODES = ["JOB_URL_UNREACHABLE", "JOB_URL_UNREADABLE"] as const;
export const JOB_TEXT_ERROR_CODE = "JOB_TEXT_UNREADABLE";
export const JOB_PASTE_FORMATS = ["html", "text"] as const;

export const JOB_IMPORT_FAILED_MESSAGE = "Couldn't import the job description. Try again or paste it.";
export const JOB_IMPORT_TRUNCATED_MESSAGE = "Shortened to fit. Review and edit.";
export const JOB_IMPORT_REPLACED_MESSAGE = "Job description replaced";
export const JOB_LINK_LABEL = "Posting link";
export const JOB_LINK_PLACEHOLDER = "https://…";
export const JOB_LINK_ACTION_LABEL = "Import";
export const JOB_LINK_DESCRIPTION =
  "Paste a link to a job posting. If the site doesn't allow it, open the posting, select all, copy, and paste it into the box below.";
export const JOB_DESCRIPTION_PLACEHOLDER = "Paste the job posting here (you can paste the whole page)";

/** The setup screen's blocking loading overlay: what the candidate is waiting for. */
export const SETUP_LOADING_COPY = {
  start: {
    title: "Starting your interview…",
    description: "Preparing your first question. This can take a few seconds.",
  },
  importLink: {
    title: "Importing the job posting…",
    description: "Reading the posting from the link.",
  },
  importPaste: {
    title: "Cleaning up your paste…",
    description: "Keeping the job posting and dropping the rest of the page.",
  },
} as const;

export const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full-stack",
  mobile: "Mobile",
  data: "Data",
  designer: "UI/UX Designer",
  qa: "QA Engineer",
  devops: "DevOps Engineer",
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

// --- Feedback (/interviews/[id]/feedback): cuewise-be's end-of-interview scores, from GET/POST .../feedback ---

/**
 * Mirrors cuewise-be `Criterion`, `CATEGORY_CRITERIA` and `CRITERION_LABELS` (interviews_constants.py); keep in step.
 * An unknown criterion makes the whole response invalid, so a new rubric criterion needs this list updated first.
 */
export const FEEDBACK_CRITERIA = [
  "structure",
  "specificity",
  "ownership",
  "outcome",
  "correctness",
  "depth",
  "trade_offs",
  "clarity",
] as const;

export const CRITERION_LABELS: Record<(typeof FEEDBACK_CRITERIA)[number], string> = {
  structure: "Structure",
  specificity: "Specific detail",
  ownership: "Your own role",
  outcome: "Outcome",
  correctness: "Correctness",
  depth: "Depth",
  trade_offs: "Trade-offs",
  clarity: "Clarity",
};

export const QUESTION_CATEGORY_LABELS: Record<(typeof QUESTION_CATEGORIES)[number], string> = {
  technical: "Technical",
  behavioral: "Behavioral",
};

/** A feedback row's life (cuewise-be `FeedbackStatus`): `generated` is final, `failed` can be posted again. */
export const FEEDBACK_STATUSES = ["generating", "generated", "failed"] as const;

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;

/** cuewise-be's feedback error codes; everything else about an error is treated generically. */
export const FEEDBACK_ERROR_CODES = {
  notFound: "FEEDBACK_NOT_FOUND",
  inProgress: "FEEDBACK_IN_PROGRESS",
  notCompleted: "INTERVIEW_NOT_COMPLETED",
  failed: "FEEDBACK_FAILED",
  unavailable: "FEEDBACK_UNAVAILABLE",
} as const;

export const feedbackRoute = (id: string) => `${INTERVIEWS_ROUTE}/${encodeURIComponent(id)}/feedback`;
/** `?start=1`: the closing card's one-shot request to generate on arrival. The page removes it once read. */
export const FEEDBACK_START_PARAM = "start";
export const FEEDBACK_START_VALUE = "1";
/** Where the closing card's Get feedback goes: the page, told to generate on arrival. */
export const feedbackStartRoute = (id: string) => `${feedbackRoute(id)}?${FEEDBACK_START_PARAM}=${FEEDBACK_START_VALUE}`;

/**
 * Generating waits on two LLM calls: cuewise-be gives them 60s (feedback_total_budget_seconds). The forwarder waits a
 * bit longer, and the browser longer still, so a slow request ends with the forwarder's clean 503, which the page then
 * recovers from by reading the stored feedback.
 */
export const FEEDBACK_FORWARD_TIMEOUT_MS = 70_000;
export const FEEDBACK_TIMEOUT_MS = 75_000;
/** How often a `generating` row is read again. */
export const FEEDBACK_POLL_MS = 3000;
/** cuewise-be takes a `generating` row over after its budget plus a 30s margin: past that, offer a new try. */
export const FEEDBACK_STALL_MS = 90_000;
export const FEEDBACK_SLOW_AFTER_MS = 15_000;

export const FEEDBACK_PAGE_TITLE = "Your feedback";
export const FEEDBACK_SECTIONS = {
  overall: "Overall score",
  strengths: "What went well",
  improvements: "What to work on",
  nextSteps: "Next steps",
  answers: "Your answers",
} as const;
export const FEEDBACK_DISCLAIMER = "Scores are an AI estimate to help you practise, not an official grade.";
export const FEEDBACK_GENERATING_LABEL = "Reading your answers…";
export const FEEDBACK_SLOW_LABEL = "Still working on it…";
/**
 * Relies on cuewise-be finishing a generation after the browser leaves (plan Step 0a). If the manual check fails,
 * set this to null and the line disappears.
 */
export const FEEDBACK_LEAVE_HINT: string | null =
  "You can leave this page. Your feedback will keep generating and will be under History > View.";
export const FEEDBACK_READY_ANNOUNCEMENT = "Your feedback is ready.";

/** Copy for every screen that isn't the result itself (spec UX Requirements). */
export const FEEDBACK_MESSAGES = {
  none: {
    title: "Get feedback on this interview",
    description: "See a score for each answer, the words that earned it, and what to practise next. It takes up to a minute.",
  },
  insufficient: {
    title: "Not enough answers to assess",
    description: "Answer at least half of the questions in a few sentences each, then try another practice interview.",
  },
  failed: {
    title: "We couldn't generate your feedback",
    description: "Something went wrong while scoring your answers. Your interview is saved, so you can try again.",
  },
  stalled: {
    title: "This is taking longer than expected",
    description: "Your feedback hasn't finished yet. Try again to restart it.",
  },
  unavailable: { title: "Feedback isn't available right now", description: "Try again later." },
  notCompleted: {
    title: "This interview isn't finished yet",
    description: "Feedback is ready once you've answered every question.",
  },
  unknown: { title: "We couldn't load your feedback", description: "Check your connection and try again." },
} as const;
export const FEEDBACK_RATE_LIMIT_MESSAGE = "Too many requests. Wait a moment and try again.";

export const INTERVIEW_NOT_FOUND_TITLE = "Interview not found";
export const INTERVIEW_NOT_FOUND_DESCRIPTION =
  "This link doesn't match an interview on your account. It may be mistyped or belong to someone else.";
