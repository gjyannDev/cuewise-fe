"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontalIcon } from "lucide-react";
import { type FormEvent, type KeyboardEvent, type Ref, useImperativeHandle } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TextAreaField } from "@/shared/forms/TextAreaField";

import { ANSWER_MAX_LENGTH } from "../constants";
import type { SendFailure } from "../hooks/use-interview-chat";
import { answerFormSchema } from "../schemas/interviews.schema";
import type { AnswerFormValues } from "../types/interviews.types";

export type AnswerComposerHandle = { focus: () => void };

type AnswerComposerProps = {
  /** A reply is on its way or the next question is being revealed: no new send. */
  isBusy: boolean;
  /** Take focus when mounted (after the next question appears), not on page load. */
  autoFocus?: boolean;
  /** Receives the trimmed answer; resolves to a failure when the text should come back into the box. */
  onSubmit: (answer: string) => Promise<SendFailure | void>;
  ref?: Ref<AnswerComposerHandle>;
};

/**
 * The chat's answer box. While busy it is read-only (not disabled) so focus stays here; Ctrl/⌘+Enter sends and
 * Enter adds a new line, since answers often run to several paragraphs. Key it by the question it answers.
 */
export function AnswerComposer({ isBusy, autoFocus = false, onSubmit, ref }: AnswerComposerProps) {
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { answer: "" },
    mode: "onTouched",
  });
  const answerLength = useWatch({ control: form.control, name: "answer" }).length;

  useImperativeHandle(ref, () => ({ focus: () => form.setFocus("answer") }), [form]);

  const send = form.handleSubmit(async ({ answer }) => {
    const typed = form.getValues("answer");
    form.reset({ answer: "" });
    const failure = await onSubmit(answer);
    if (failure) {
      form.reset({ answer: typed });
      if (failure.message) {
        form.setError("answer", { message: failure.message }, { shouldFocus: true });
      }
    }
  });

  function submitUnlessBusy(event: FormEvent<HTMLFormElement>) {
    if (isBusy) {
      event.preventDefault();
      return;
    }
    void send(event);
  }

  function sendOnCtrlEnter(event: KeyboardEvent<HTMLFormElement>) {
    // isComposing: the Enter that confirms an IME candidate (e.g. Japanese input) is not a send.
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  return (
    <form
      noValidate
      aria-busy={isBusy}
      onSubmit={submitUnlessBusy}
      onKeyDown={sendOnCtrlEnter}
      className="flex flex-col gap-2 border-t bg-background pt-3 pb-[env(safe-area-inset-bottom)]"
    >
      <TextAreaField
        name="answer"
        label="Your answer"
        hideLabel
        placeholder="Type your answer…"
        rows={3}
        readOnly={isBusy}
        autoFocus={autoFocus}
        className="max-h-[40dvh] min-h-20 resize-none"
        register={form.register}
        error={form.formState.errors.answer?.message}
        description={
          <span className={cn("block text-right tabular-nums", answerLength > ANSWER_MAX_LENGTH && "text-destructive")}>
            {answerLength} / {ANSWER_MAX_LENGTH}
          </span>
        }
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Ctrl/⌘ + Enter to send</p>
        <Button
          type="submit"
          size="lg"
          className="h-11 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          aria-disabled={isBusy}
        >
          Send
          <SendHorizontalIcon aria-hidden data-icon="inline-end" />
        </Button>
      </div>
    </form>
  );
}
