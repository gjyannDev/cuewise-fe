"use client";

import { useRouter } from "next/navigation";

import { useMutationCallbacks } from "@/hooks/use-mutation-callback";
import { useLogoutMutation } from "@/modules/auth/queries/auth.queries";
import { SIGNIN_ROUTE } from "@/modules/auth/session/auth-session";
import type { Role } from "@/modules/auth/types/auth.types";
import { AppSidebar } from "@/shared/sidebar/AppSidebar";

import { ROLE_LABELS, SIDEBAR_BY_ROLE } from "../navigation.constants";

type RoleSidebarProps = {
  /** Server-verified profile fields; the config is chosen here because icons can't cross from server to client. */
  user: { email: string; role: Role };
};

export function RoleSidebar({ user }: RoleSidebarProps) {
  const router = useRouter();
  const logout = useLogoutMutation();
  const { buildCallbacks } = useMutationCallbacks({ entityName: "Session" });
  // Only the error toast: on success the redirect to sign in is the feedback.
  const { onError } = buildCallbacks("sign out", "Session", { errorMessage: "Sign out failed" });

  const handleSignOut = () => {
    if (logout.isPending) return;
    logout.mutate(undefined, {
      onSuccess: () => router.replace(SIGNIN_ROUTE),
      onError,
    });
  };

  return (
    <AppSidebar
      config={SIDEBAR_BY_ROLE[user.role]}
      user={{ email: user.email, roleLabel: ROLE_LABELS[user.role] }}
      onSignOut={handleSignOut}
      isSigningOut={logout.isPending}
    />
  );
}
