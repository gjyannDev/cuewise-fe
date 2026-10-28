import { Suspense } from "react";

import { authSearchParamsSchema } from "@/modules/auth/schemas/auth.schema";

import { AuthCard } from "../_components/AuthCard";

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center py-12">
      {/* Request-time searchParams stream in behind a boundary (Cache Components). */}
      <Suspense fallback={<AuthCard mode="signup" />}>
        <SignUpContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SignUpContent({ searchParams }: SignUpPageProps) {
  const { next } = authSearchParamsSchema.parse(await searchParams);

  return <AuthCard mode="signup" next={next} />;
}
