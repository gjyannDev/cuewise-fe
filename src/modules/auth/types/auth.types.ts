import type { z } from "zod";

import type {
  authCredentialsSchema,
  currentProfileSchema,
  roleSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../schemas/auth.schema";

export type SignInFormValues = z.infer<typeof signInFormSchema>;
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
/** What AuthForm edits in both modes (sign in ignores confirmPassword). */
export type AuthFormValues = SignUpFormValues;
export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
export type Role = z.infer<typeof roleSchema>;
export type CurrentUserProfile = z.infer<typeof currentProfileSchema>;
export type AuthFormMode = "signin" | "signup";

/** What AuthForm's onSubmit resolves to when submitting failed in a way the form should show. */
export type AuthSubmitResult = {
  fieldErrors?: Partial<Record<keyof AuthFormValues, string>>;
  /** Clear the password field (e.g. after wrong credentials). */
  resetPassword?: boolean;
} | void;
