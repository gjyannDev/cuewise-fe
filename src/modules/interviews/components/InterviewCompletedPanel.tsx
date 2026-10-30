import { CircleCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { COMPLETED_FALLBACK_TEXT } from "../constants";
import type { InterviewSession } from "../types/interviews.types";
import { focusOnMount } from "../utils/focus-on-mount";
import { InterviewColumns } from "./InterviewColumns";
import { InterviewDetailsCard } from "./InterviewDetailsCard";

type InterviewCompletedPanelProps = {
  session: InterviewSession;
  /** The interviewer's closing line; gone after a reload, which shows a generic line instead. */
  closingText?: string;
  /** Move focus here after Finish (not on page load). */
  autoFocus?: boolean;
  onStartNew: () => void;
};

/** Shown once every question is answered. No feedback yet: only the closing line and a way to start again. */
export function InterviewCompletedPanel({ session, closingText, autoFocus = false, onStartNew }: InterviewCompletedPanelProps) {
  return (
    <InterviewColumns asideLabel="Interview details" aside={<InterviewDetailsCard session={session} />}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-3">
            <CircleCheckIcon aria-hidden className="size-5 text-primary-text" />
            <h2 ref={autoFocus ? focusOnMount : undefined} tabIndex={-1} className="font-display text-lg font-semibold outline-none">
              Interview complete
            </h2>
            <Badge>Completed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Plain text on purpose: the closing line comes from the backend. */}
          <p className="max-w-prose text-muted-foreground">{closingText ?? COMPLETED_FALLBACK_TEXT}</p>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="h-11 w-full sm:w-auto" onClick={onStartNew}>
            Start a new interview
          </Button>
        </CardFooter>
      </Card>
    </InterviewColumns>
  );
}
