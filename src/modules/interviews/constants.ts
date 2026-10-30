export const INTERVIEWS_ROUTE = "/interviews";

// Mirrors cuewise-be app/modules/interviews/interviews_constants.py; keep both in step.
export const ROLES = ["frontend", "backend", "fullstack", "mobile", "data"] as const;
export const LEVELS = ["intern", "junior", "mid", "senior"] as const;
export const INTERVIEW_TYPES = ["technical", "behavioral", "mixed"] as const;
export const QUESTION_CATEGORIES = ["technical", "behavioral"] as const;
export const SESSION_STATUSES = ["in_progress", "abandoned", "completed"] as const;
/** Who said a transcript line, and what it is (GET /interviews/{id}/messages). */
export const TRANSCRIPT_ROLES = ["interviewer", "candidate"] as const;
export const TRANSCRIPT_KINDS = ["question", "answer", "reaction"] as const;

export const MIN_QUESTION_COUNT = 1;
export const MAX_QUESTION_COUNT = 10;
export const JOB_DESCRIPTION_MAX_LENGTH = 2000;
export const ANSWER_MAX_LENGTH = 2000;

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
/** Keeps the indicator up long enough not to flash when the reply is fast. */
export const MIN_THINKING_MS = 500;
/** A beat between the reaction and the next question (or the completed card). */
export const REVEAL_DELAY_MS = 600;

export const THREAD_ERROR_MESSAGE = "Couldn't load the conversation.";
export const STALE_THREAD_MESSAGE = "Couldn't load the latest question.";

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
