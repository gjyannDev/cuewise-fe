"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CRITERION_LABELS,
  FEEDBACK_SECTIONS,
  QUESTION_CATEGORY_LABELS,
  SCORE_MAX,
} from "@/modules/interviews/constants";
import type { FeedbackEvidence, FeedbackQuestion } from "@/modules/interviews/types/interviews.types";
import { questionScores, scorePercent } from "@/modules/interviews/utils/feedback.utils";

type FeedbackQuestionAccordionProps = {
  questions: FeedbackQuestion[];
};

const itemValue = (question: FeedbackQuestion) => `question-${question.main_number}`;

/**
 * Per main question: its criterion scores, the note, and the quotes that earned them. The first question starts open
 * so one full example shows at once; several can be open to compare.
 */
export function FeedbackQuestionAccordion({ questions }: FeedbackQuestionAccordionProps) {
  const firstOpen = questions[0] ? [itemValue(questions[0])] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="font-display text-base font-semibold">{FEEDBACK_SECTIONS.answers}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={firstOpen}>
          {questions.map((question) => (
            <AccordionItem key={question.main_number} value={itemValue(question)}>
              <AccordionTrigger className="min-h-11">
                <span className="flex min-w-0 flex-col gap-1.5 pr-3">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">Question {question.main_number}</span>
                    <Badge variant="secondary">{QUESTION_CATEGORY_LABELS[question.category]}</Badge>
                  </span>
                  <span className="font-normal wrap-break-word text-muted-foreground">{question.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {questionScores(question).map((row) => (
                    <li key={row.criterion}>
                      <CriterionScore label={row.label} score={row.score} />
                    </li>
                  ))}
                </ul>
                {question.note && <p className="max-w-prose leading-relaxed">{question.note}</p>}
                {question.evidence.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {question.evidence.map((item) => (
                      <EvidenceQuote key={item.criterion} evidence={item} />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

/** One criterion's score: the number is always printed; the neutral bar only repeats it (no colour means anything). */
function CriterionScore({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span>{label}</span>
        <span className="font-medium tabular-nums">
          <span aria-hidden>
            {score} / {SCORE_MAX}
          </span>
          <span className="sr-only">
            {score} out of {SCORE_MAX}
          </span>
        </span>
      </div>
      <Progress aria-hidden value={scorePercent(score)} />
    </div>
  );
}

/**
 * A quote from the candidate's answer (verified by cuewise-be: these exact words are in their answers to this
 * question), set apart by a rule, not a box, with the criterion it supports and why.
 */
function EvidenceQuote({ evidence }: { evidence: FeedbackEvidence }) {
  return (
    <figure className="flex flex-col gap-1.5 border-l-2 border-border pl-3">
      <blockquote className="leading-relaxed wrap-break-word">&ldquo;{evidence.quote}&rdquo;</blockquote>
      <figcaption className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{CRITERION_LABELS[evidence.criterion]}</Badge>
        <span>{evidence.reason}</span>
      </figcaption>
    </figure>
  );
}
