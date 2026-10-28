"use client";

import { useRouter } from "next/navigation";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";
import { parseApiError } from "@/lib/config/api.helper";
import { useSignInMutation, useSignUpMutation } from "@/modules/auth/queries/auth.queries";
import { authRouteHref, resolveSafeNext, SIGNIN_ROUTE } from "@/modules/auth/session/auth-session";
import type { AuthCredentials, AuthFormMode, AuthSubmitResult } from "@/modules/auth/types/auth.types";

import { AuthForm } from "./AuthForm";

type AuthFormContainerProps = {
  mode: AuthFormMode;
  next?: string;
};

const ERROR_TITLES: Record<AuthFormMode, string> = {
  signin: "Unable to sign in",
  signup: "Unable to create your account",
};

const DUPLICATE_EMAIL_MESSAGE = "An account with this email already exists";

/** Connects AuthForm to the auth mutations: submits, routes on success, maps errors to fields or toasts. */
export function AuthFormContainer({ mode, next }: AuthFormContainerProps) {
  const router = useRouter();
  const signIn = useSignInMutation();
  const signUp = useSignUpMutation();
  const mutation = mode === "signup" ? signUp : signIn;

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Authentication" });
  const callbacks = buildCallbacks(mode === "signup" ? "sign up" : "sign in", "account", {
    errorMessage: ERROR_TITLES[mode],
  });

  async function handleSubmit(credentials: AuthCredentials): Promise<AuthSubmitResult> {
    try {
      const profile = await mutation.mutateAsync(credentials);
      router.replace(resolveSafeNext(next, profile.role));
      // Drop router-cached pages rendered while signed out (e.g. a prefetched redirect to /signin).
      router.refresh();
      return;
    } catch (error) {
      const apiError = parseApiError(error);

      // Field errors (409 duplicate email, 422 validation) go under the fields, not in a toast.
      if (apiError.code === "CONFLICT") {
        return { fieldErrors: { email: DUPLICATE_EMAIL_MESSAGE } };
      }
      if (Object.keys(apiError.fieldErrors).length > 0) {
        return { fieldErrors: apiError.fieldErrors };
      }

      callbacks.onError(error);

      if (apiError.code === "AUTO_LOGIN_FAILED") {
        router.replace(authRouteHref(SIGNIN_ROUTE, next));
        return;
      }
      return { resetPassword: apiError.code === "INVALID_CREDENTIALS" };
    }
  }

  return <AuthForm mode={mode} isPending={mutation.isPending} onSubmit={handleSubmit} />;
}
