"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { authFormSchemas } from "@/modules/auth/schemas/auth.schema";
import type {
  AuthCredentials,
  AuthFormMode,
  AuthFormValues,
  AuthSubmitResult,
} from "@/modules/auth/types/auth.types";
import { PasswordField } from "@/shared/forms/PasswordField";
import { TextField } from "@/shared/forms/TextField";

type AuthFormProps = {
  mode: AuthFormMode;
  isPending: boolean;
  /** Resolves with field errors to show, or nothing on success / when the error was already toasted. */
  onSubmit: (credentials: AuthCredentials) => Promise<AuthSubmitResult>;
};

const FORM_FIELDS = ["email", "password", "confirmPassword"] as const;

const SUBMIT_LABELS: Record<AuthFormMode, { idle: string; pending: string }> = {
  signin: { idle: "Sign in", pending: "Signing in..." },
  signup: { idle: "Create account", pending: "Creating account..." },
};

/** Presentational sign in / sign up form: owns form state only; the container does the requests. */
export function AuthForm({ mode, isPending, onSubmit }: AuthFormProps) {
  const form = useForm<AuthFormValues>({
    resolver:
      mode === "signup" ? zodResolver(authFormSchemas.signup) : zodResolver(authFormSchemas.signin),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const isBusy = isPending || isSubmitting;

  const submit = form.handleSubmit(async ({ email, password }) => {
    const result = await onSubmit({ email, password });
    if (!result) {
      return;
    }

    if (result.resetPassword) {
      form.resetField("password");
      form.setFocus("password");
    }
    for (const field of FORM_FIELDS) {
      const message = result.fieldErrors?.[field];
      if (message) {
        form.setError(field, { message });
      }
    }
  });

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={submit}>
      <FieldSet disabled={isBusy}>
        <FieldGroup>
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            register={form.register}
            error={errors.email?.message}
          />
          <PasswordField
            name="password"
            label="Password"
            placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            register={form.register}
            error={errors.password?.message}
          />
          {mode === "signup" && (
            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              register={form.register}
              error={errors.confirmPassword?.message}
            />
          )}
        </FieldGroup>
      </FieldSet>

      <Button type="submit" size="lg" className="w-full" disabled={isBusy}>
        {isBusy ? SUBMIT_LABELS[mode].pending : SUBMIT_LABELS[mode].idle}
      </Button>
    </form>
  );
}
