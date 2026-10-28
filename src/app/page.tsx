import { Suspense } from "react";

import { requireUser } from "@/modules/auth/session/current-user.server";

export default function Home() {
  return (
    // The session check reads cookies (request-time data), so it streams in behind a boundary.
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await requireUser("/");

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
