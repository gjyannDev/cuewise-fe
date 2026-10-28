import type { ReactNode } from "react";

import { SessionExpiredError } from "@/lib/config/backend.client.server";
import { getCurrentUser } from "@/modules/auth/session/current-user.server";
import type { CurrentUserProfile } from "@/modules/auth/types/auth.types";
import { RoleSidebar } from "@/modules/navigation/components/RoleSidebar";
import { AppShell } from "@/shared/sidebar/AppShell";

type AuthedShellProps = {
  children: ReactNode;
};

/**
 * Wraps signed-in pages in the sidebar shell. A layout doesn't know its URL, so it doesn't redirect:
 * without a valid session it renders the page alone, whose own requireUser(path) redirects with the
 * right `next`. getCurrentUser is request-cached, so both see the same answer from one backend call.
 */
export async function AuthedShell({ children }: AuthedShellProps) {
  const user = await getSessionUser();
  if (!user) {
    return children;
  }

  return (
    <AppShell sidebar={<RoleSidebar user={{ email: user.email, role: user.role }} />}>
      {children}
    </AppShell>
  );
}

async function getSessionUser(): Promise<CurrentUserProfile | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return null;
    }
    throw error;
  }
}
