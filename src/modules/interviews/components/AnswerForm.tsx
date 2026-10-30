"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { TextAreaField } from "@/shared/forms/TextAreaField";

import { ANSWER_MAX_LENGTH } from "../constants";
import { answerFormSchema } from "../schemas/interviews.schema";
import type { AnswerFormValues } from "../types/interviews.types";

type AnswerFormProps = {
  isPending: boolean;
  /** Receives the trimmed answer; resolves to a message for the answer field when the backend rejected it. */
  onSubmit: (answer: string) => Promise<string | void>;
};

/** The answer box. Text survives a failed send; the parent keys it by question so the next one starts empty. */
export function AnswerForm({ isPending, onSubmit }: AnswerFormProps) {
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { answer: "" },
    mode: "onTouched",
  });
  const answerLength = useWatch({ control: form.control, name: "answer" }).length;
  const isBusy = isPending || form.formState.isSubmitting;

  const submit = form.handleSubmit(async ({ answer }) => {
    const message = await onSubmit(answer);
    if (message) {
      form.setError("answer", { message }, { shouldFocus: true });
    }
  });

  return (
    <form noValidate aria-busy={isBusy} onSubmit={submit}>
      <FieldSet disabled={isBusy} className="flex flex-col gap-4">
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

        <div className="flex sm:justify-end">
          <Button type="submit" size="lg" className="h-11 w-full sm:w-auto">
            {isBusy && <Loader2Icon aria-hidden className="animate-spin motion-reduce:animate-none" />}
            {isBusy ? "Sending…" : "Next"}
            {!isBusy && <ArrowRightIcon aria-hidden data-icon="inline-end" />}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}
