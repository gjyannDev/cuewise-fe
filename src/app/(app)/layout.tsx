import { type ReactNode, Suspense } from "react";

import { AppShellSkeleton } from "@/shared/sidebar/AppShellSkeleton";

import { AuthedShell } from "./_components/AuthedShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    // The session check reads cookies (request-time data), so the shell streams in behind a boundary.
    <Suspense fallback={<AppShellSkeleton />}>
      <AuthedShell>{children}</AuthedShell>
    </Suspense>
  );
}
