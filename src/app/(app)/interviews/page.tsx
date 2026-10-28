import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";

export default function InterviewsPage() {
  return (
    // The session check reads cookies (request-time data), so it streams in behind a boundary.
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <InterviewsContent />
    </Suspense>
  );
}

async function InterviewsContent() {
  await requireUser("/interviews");

  return <div>AI Mock Interview</div>;
}
