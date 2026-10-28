import { Suspense } from "react";

import { authSearchParamsSchema } from "@/modules/auth/schemas/auth.schema";

import { AuthCard } from "../_components/AuthCard";
import { SessionExpiredNotice } from "../_components/SessionExpiredNotice";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center py-12">
      {/* searchParams are request-time data, so with Cache Components they stream in behind a boundary;
          the fallback is the same card without `next`, prerendered into the static shell. */}
      <Suspense fallback={<AuthCard mode="signin" />}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SignInContent({ searchParams }: SignInPageProps) {
  const { next, expired } = authSearchParamsSchema.parse(await searchParams);

  return (
    <>
      <AuthCard mode="signin" next={next} />
      {expired && <SessionExpiredNotice />}
    </>
  );
}
