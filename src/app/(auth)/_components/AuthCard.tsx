import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authRouteHref, SIGNIN_ROUTE, SIGNUP_ROUTE } from "@/modules/auth/session/auth-session";
import type { AuthFormMode } from "@/modules/auth/types/auth.types";

import { AuthFormContainer } from "./AuthFormContainer";

type AuthCardProps = {
  mode: AuthFormMode;
  next?: string;
};

const COPY = {
  signin: {
    title: "Sign in",
    description: "Welcome back to Cuewise.",
    switchPrompt: "Don't have an account?",
    switchLabel: "Sign up",
    switchRoute: SIGNUP_ROUTE,
  },
  signup: {
    title: "Create your account",
    description: "Start practicing interviews with Cuewise.",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchRoute: SIGNIN_ROUTE,
  },
} as const;

export function AuthCard({ mode, next }: AuthCardProps) {
  const copy = COPY[mode];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthFormContainer mode={mode} next={next} />
      </CardContent>
      <CardFooter className="justify-center gap-1 text-sm text-muted-foreground">
        {copy.switchPrompt}
        <Button asChild variant="link">
          <Link href={authRouteHref(copy.switchRoute, next)}>{copy.switchLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
