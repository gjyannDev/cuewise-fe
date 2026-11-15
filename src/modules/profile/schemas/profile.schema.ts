import { z } from "zod";

import { RESUME_EXTENSIONS, RESUME_FILE_MESSAGES, RESUME_MAX_BYTES } from "../constants";

/** The résumé file before upload: a name and size check only. cuewise-be still checks the content, pages and zip. */
export const resumeFileSchema = z
  .instanceof(File, { error: RESUME_FILE_MESSAGES.missing })
  .refine((file) => file.size > 0, RESUME_FILE_MESSAGES.missing)
  .refine(
    (file) => RESUME_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension)),
    RESUME_FILE_MESSAGES.type,
  )
  .refine((file) => file.size <= RESUME_MAX_BYTES, RESUME_FILE_MESSAGES.size);

/** The résumé page's upload form: one file, sent as soon as it is chosen. */
export const resumeUploadFormSchema = z.object({ file: resumeFileSchema });

const roleSchema = z.object({
  title: z.string(),
  organization: z.string(),
  period: z.string(),
  summary: z.string(),
});

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
});

/**
 * GET /profile and POST /profile/resume: what cuewise-be understood from the résumé (it caps every list and field).
 * There is no name, email or phone by design. Roles are most recent first.
 */
export const profileSchema = z.object({
  skills: z.array(z.string()),
  roles: z.array(roleSchema),
  projects: z.array(projectSchema),
  updated_at: z.iso.datetime({ offset: true }),
});
