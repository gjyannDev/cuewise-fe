import { SearchXIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { INTERVIEW_NOT_FOUND_DESCRIPTION, INTERVIEW_NOT_FOUND_TITLE, INTERVIEWS_ROUTE } from "@/modules/interviews/constants";
import { InterviewMessageCard } from "./InterviewMessageCard";

type InterviewNotFoundCardProps = {
  /** Defaults to a link to the setup form. */
  action?: ReactNode;
};

/** An interview id that is malformed, unknown or someone else's: says so without revealing which. */
export function InterviewNotFoundCard({ action }: InterviewNotFoundCardProps) {
  return (
    <InterviewMessageCard
      icon={SearchXIcon}
      title={INTERVIEW_NOT_FOUND_TITLE}
      description={INTERVIEW_NOT_FOUND_DESCRIPTION}
      action={
        action ?? (
          <Button asChild size="lg" className="h-11">
            <Link href={INTERVIEWS_ROUTE}>Start a new interview</Link>
          </Button>
        )
      }
    />
  );
}
