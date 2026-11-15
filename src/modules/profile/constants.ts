// --- Résumé page (/resume): cuewise-be GET, DELETE /profile and POST /profile/resume (Slice 8c) ---

export const RESUME_ROUTE = "/resume";

/** cuewise-be limits (keep in step): `RESUME_MAX_BYTES` in profile_constants.py. It also checks pages and content. */
export const RESUME_MAX_BYTES = 2 * 1024 * 1024;
/** Checked by name only, so obvious mistakes fail at once; cuewise-be decides by the file's own bytes. */
export const RESUME_EXTENSIONS = [".pdf", ".docx"] as const;
export const RESUME_ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * cuewise-be gives extraction about 20 s in total (`PROFILE_TOTAL_SECONDS`), so the forwarder waits longer, and the
 * browser longer still, so the forwarder's own 503 arrives first (the transcription budgets work the same way).
 */
export const RESUME_UPLOAD_FORWARD_TIMEOUT_MS = 30_000;
export const RESUME_UPLOAD_TIMEOUT_MS = 35_000;

/** cuewise-be error codes (keep in step: app/core/errors.py). Their messages are written for the candidate. */
export const PROFILE_ERROR_CODES = {
  notFound: "PROFILE_NOT_FOUND",
} as const;

export const RESUME_FILE_MESSAGES = {
  missing: "Choose your résumé file",
  type: "Choose a PDF or .docx file",
  size: "Choose a file of up to 2 MB",
} as const;

/** Shown beside the upload and beside the setup form's toggle: what is sent where, and what is kept. */
export const RESUME_PROVIDER_NOTICE =
  "Your résumé's text is sent to an AI provider to build your profile, and the profile is sent again for each résumé-aware interview. We keep only the profile shown here, never the file. Delete it at any time to stop its use.";

export const RESUME_UPLOAD_UNCONFIRMED_MESSAGE =
  "The upload may still have worked. We've reloaded your profile; upload again if it hasn't changed.";

export const RESUME_UPLOAD_COPY = {
  upload: {
    title: "Upload your résumé",
    description: "We'll pick out your skills, roles and projects so interviews can ask about your own work.",
    fieldLabel: "Résumé file",
    prompt: "Drag and drop your résumé here",
  },
  replace: {
    title: "Replace your résumé",
    description: "Upload a newer or clearer version. Your current profile stays until the new one is ready.",
    fieldLabel: "New résumé file",
    prompt: "Drag and drop your new résumé here",
  },
  limits: "PDF or Word (.docx), up to 2 MB and 5 pages. Scans and password-protected files can't be read.",
  pending: "Reading your résumé… this can take up to 20 seconds.",
  errorTitle: "Your résumé wasn't updated",
  unconfirmedTitle: "We couldn't confirm your upload",
  uploaded: "Your profile is ready",
  replaced: "Your profile was updated",
  uploadFailed: "Couldn't upload your résumé",
} as const;

export const RESUME_PROFILE_COPY = {
  title: "Your profile",
  description: "What we picked out of your résumé. Résumé-aware interviews ask about these.",
  missingHint: "Something missing or wrong? Upload a clearer version of your résumé to replace this profile.",
  deleteTitle: "Delete your profile?",
  deleteDescription:
    "Your profile is deleted for good, and later interviews won't use it. Questions you were already asked stay with their interviews.",
  deleted: "Profile deleted",
  deleteFailed: "Couldn't delete your profile",
} as const;

export const RESUME_PAGE_COPY = {
  loadErrorTitle: "We couldn't load your résumé",
  loadErrorDescription: "Check your connection and try again.",
} as const;
