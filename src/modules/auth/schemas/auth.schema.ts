import { z } from "zod";

// Mirrors cuewise-be: emails are validated there too; passwords are 8-128 on register, any length up to 128 on login.
const email = z.email("Enter a valid email address");
const PASSWORD_MAX = 128;

export const signInFormSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password").max(PASSWORD_MAX, "Password is too long"),
});

export const signUpFormSchema = z
  .object({
    email,
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(PASSWORD_MAX, "Use at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

/**
 * AuthForm edits the same values in both modes so one useForm works for sign in and sign up;
 * sign in carries confirmPassword but never validates it.
 */
export const authFormSchemas = {
  signin: signInFormSchema.extend({ confirmPassword: z.string() }),
  signup: signUpFormSchema,
} as const;

/** `?next=` and `?expired=1` on /signin and /signup. Anything malformed is dropped, never thrown. */
export const authSearchParamsSchema = z.object({
  next: z.string().optional().catch(undefined),
  expired: z
    .literal("1")
    .optional()
    .catch(undefined)
    .transform((value) => value === "1"),
});

/** Body accepted by the Next.js /api/auth/login and /api/auth/register handlers. Unknown keys are stripped. */
export const authCredentialsSchema = z.object({
  email: z.string().trim().min(1).max(320),
  password: z.string().min(1).max(PASSWORD_MAX),
});

export const roleSchema = z.enum(["admin", "user"]);

/** GET /auth/me. Never contains the token. */
export const currentProfileSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  role: roleSchema,
  permissions: z.array(z.string()),
});

/** POST /auth/login on cuewise-be. Only ever parsed on the server. */
export const backendTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal("bearer"),
});
