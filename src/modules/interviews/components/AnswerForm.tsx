"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextAreaField } from "@/shared/forms/TextAreaField";

import { ANSWER_MAX_LENGTH } from "../constants";
import { answerFormSchema } from "../schemas/interviews.schema";
import type { AnswerFormValues } from "../types/interviews.types";

const NEXT_HINT_ID = "answer-next-hint";

/**
 * The answer box. Typing and validation work, but nothing is sent: cuewise-be has no answer endpoint
 * yet, so Next stays disabled. Wiring it means a mutation in the container and enabling the button.
 */
export function AnswerForm() {
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { answer: "" },
    mode: "onTouched",
  });
  const answerLength = useWatch({ control: form.control, name: "answer" }).length;

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
      <TextAreaField
        name="answer"
        label="Your answer"
        placeholder="Type your answer…"
        rows={8}
        className="min-h-48"
        register={form.register}
        error={form.formState.errors.answer?.message}
        description={
          <span className={cn("block text-right tabular-nums", answerLength > ANSWER_MAX_LENGTH && "text-destructive")}>
            {answerLength} / {ANSWER_MAX_LENGTH}
          </span>
        }
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id={NEXT_HINT_ID} className="text-sm text-muted-foreground">
          Submitting answers is coming soon.
        </p>
        <Button type="submit" size="lg" className="h-11 w-full sm:w-auto" disabled aria-describedby={NEXT_HINT_ID}>
          Next
          <ArrowRightIcon aria-hidden data-icon="inline-end" />
        </Button>
      </div>
    </form>
  );
}
