import { CircleCheckIcon, FlagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { focusOnMount } from "../utils/focus-on-mount";

const VARIANTS = {
  completed: {
    icon: CircleCheckIcon,
    title: "Interview complete",
    description: "You've answered every question. Thanks for practicing with Cuewise.",
  },
  // Ended on screen (End interview) or abandoned on the backend: no feedback yet, nothing to continue.
  ended: { icon: FlagIcon, title: "Interview ended", description: "Your answers so far are saved." },
} as const;

type InterviewClosingCardProps = {
  variant: keyof typeof VARIANTS;
  /** Move focus here when the card replaces the composer after a user action (not on page load). */
  autoFocus?: boolean;
  onStartNew: () => void;
};

/** Takes the composer's place once the interview is over; the conversation above stays readable. */
export function InterviewClosingCard({ variant, autoFocus = false, onStartNew }: InterviewClosingCardProps) {
  const { icon: Icon, title, description } = VARIANTS[variant];

  return (
    <Card className="mt-3 shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon aria-hidden className="size-5 text-primary-text" />
          <h2
            ref={autoFocus ? focusOnMount : undefined}
            tabIndex={-1}
            className="font-display text-lg font-semibold outline-none"
          >
            {title}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="h-11 w-full sm:w-auto" onClick={onStartNew}>
          Start a new interview
        </Button>
      </CardFooter>
    </Card>
  );
}
