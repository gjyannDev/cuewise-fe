export const INTERVIEWS_ROUTE = "/interviews";

// Mirrors cuewise-be app/modules/interviews/interviews_constants.py; keep both in step.
export const ROLES = ["frontend", "backend", "fullstack", "mobile", "data"] as const;
export const LEVELS = ["intern", "junior", "mid", "senior"] as const;
export const INTERVIEW_TYPES = ["technical", "behavioral", "mixed"] as const;
export const QUESTION_CATEGORIES = ["technical", "behavioral"] as const;
export const SESSION_STATUSES = ["in_progress", "abandoned"] as const;

export const MIN_QUESTION_COUNT = 1;
export const MAX_QUESTION_COUNT = 10;
export const JOB_DESCRIPTION_MAX_LENGTH = 2000;
export const ANSWER_MAX_LENGTH = 2000;

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
