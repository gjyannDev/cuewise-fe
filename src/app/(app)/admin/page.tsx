import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";

export default function AdminHome() {
  return (
    // The session check reads cookies (request-time data), so it streams in behind a boundary.
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <AdminHomeContent />
    </Suspense>
  );
}

async function AdminHomeContent() {
  await requireUser("/admin");

  return (
    <div>
      <h1>Admin dashboard</h1>
    </div>
  );
}
