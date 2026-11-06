import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { focusOnMount } from "@/lib/utils";
import {
  FEEDBACK_DISCLAIMER,
  FEEDBACK_PAGE_TITLE,
  FEEDBACK_SECTIONS,
  HISTORY_ROUTE,
  INTERVIEWS_ROUTE,
  SCORE_MAX,
} from "@/modules/interviews/constants";
import type { Feedback } from "@/modules/interviews/types/interviews.types";
import { formatOverall } from "@/modules/interviews/utils/feedback.utils";

import { FeedbackQuestionAccordion } from "./FeedbackQuestionAccordion";

type FeedbackResultProps = {
  feedback: Feedback;
  /** The result just replaced the generating screen: its heading takes focus. */
  autoFocus?: boolean;
};

/** The generated feedback: score and summary, highlights, each answer's scores and quotes, then what to do next. */
export function FeedbackResult({ feedback, autoFocus = false }: FeedbackResultProps) {
  return (
    <div className="flex flex-col gap-6">
      <ScoreCard overall={feedback.overall} summary={feedback.summary} autoFocus={autoFocus} />
      <HighlightsCard
        strengths={feedback.strengths}
        improvements={feedback.improvements}
        nextSteps={feedback.next_steps}
      />
      {feedback.questions.length > 0 && <FeedbackQuestionAccordion questions={feedback.questions} />}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild size="lg" className="h-11 w-full sm:w-auto">
          <Link href={INTERVIEWS_ROUTE}>Start a new interview</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 w-full sm:w-auto">
          <Link href={HISTORY_ROUTE}>Back to history</Link>
        </Button>
      </div>
    </div>
  );
}

type ScoreCardProps = {
  overall: number | null;
  summary: string | null;
  autoFocus: boolean;
};

/** The overall score as a plain number, the summary, and what the number is (and isn't). */
function ScoreCard({ overall, summary, autoFocus }: ScoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2
            ref={autoFocus ? focusOnMount : undefined}
            tabIndex={-1}
            className="font-display text-lg font-semibold outline-none"
          >
            {FEEDBACK_PAGE_TITLE}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        {overall !== null && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{FEEDBACK_SECTIONS.overall}</p>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-semibold tabular-nums">{formatOverall(overall)}</span>
              <span className="text-lg text-muted-foreground">
                <span aria-hidden>/ {SCORE_MAX}</span>
                <span className="sr-only">out of {SCORE_MAX}</span>
              </span>
            </p>
          </div>
        )}
        {summary && <p className="max-w-prose text-base leading-relaxed">{summary}</p>}
        <p className="text-xs text-muted-foreground">{FEEDBACK_DISCLAIMER}</p>
      </CardContent>
    </Card>
  );
}

type HighlightsCardProps = {
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
};

/** Strengths and improvements side by side from tablet up, next steps under them: one card, no nested boxes. */
function HighlightsCard({ strengths, improvements, nextSteps }: HighlightsCardProps) {
  return (
    <Card>
      <CardContent className="gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <TextList title={FEEDBACK_SECTIONS.strengths} items={strengths} />
          <TextList title={FEEDBACK_SECTIONS.improvements} items={improvements} />
        </div>
        {nextSteps.length > 0 && (
          <>
            <Separator />
            <TextList title={FEEDBACK_SECTIONS.nextSteps} items={nextSteps} ordered />
          </>
        )}
      </CardContent>
    </Card>
  );
}

type TextListProps = {
  title: string;
  items: string[];
  /** Next steps read as an order to follow; strengths and improvements don't. */
  ordered?: boolean;
};

/** One titled list of the feedback's text (plain strings: AI output is rendered as text, never as markup). */
function TextList({ title, items, ordered = false }: TextListProps) {
  const List = ordered ? "ol" : "ul";

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <List className={ordered ? "flex list-decimal flex-col gap-1.5 pl-5" : "flex list-disc flex-col gap-1.5 pl-5"}>
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {item}
          </li>
        ))}
      </List>
    </section>
  );
}
