import type { z } from "zod";

import type { profileSchema, resumeUploadFormSchema } from "../schemas/profile.schema";

export type Profile = z.infer<typeof profileSchema>;
export type ProfileRole = Profile["roles"][number];
export type ProfileProject = Profile["projects"][number];

export type ResumeUploadFormValues = z.input<typeof resumeUploadFormSchema>;

/** Where a failed upload is shown: an alert on the page, a toast, or (no reply) a profile reload. */
export type ResumeUploadErrorResult =
  | { kind: "alert"; message: string }
  | { kind: "toast"; message: string }
  | { kind: "unconfirmed"; message: string };

/** What stays on the résumé page after a failed upload (a toast leaves nothing behind). */
export type ResumeUploadNotice = Exclude<ResumeUploadErrorResult, { kind: "toast" }>;
