import { FlagIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import type { InterviewSession } from "../types/interviews.types";
import { InterviewColumns } from "./InterviewColumns";
import { InterviewDetailsCard } from "./InterviewDetailsCard";

type InterviewEndedPanelProps = {
  session: InterviewSession;
  onStartNew: () => void;
};

/**
 * Shown after End interview. ponytail: client-only until cuewise-be has an end endpoint, so it claims no status
 * (the session is still in_progress on the backend); then the status and early feedback should come from the API.
 */
export function InterviewEndedPanel({ session, onStartNew }: InterviewEndedPanelProps) {
  return (
    <InterviewColumns asideLabel="Interview details" aside={<InterviewDetailsCard session={session} />}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-3">
            <FlagIcon aria-hidden className="size-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold">Interview ended</h2>
          </CardTitle>
          <CardDescription>Your answers so far are saved.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 rounded-lg border border-dashed bg-muted/50 p-4">
            <SparklesIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-text" />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Early feedback</h3>
              <p className="text-sm text-muted-foreground">
                AI feedback isn&apos;t available yet. Once it is, you&apos;ll see notes on the answers you gave before
                ending.
              </p>
            </div>
          </div>
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
