"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon } from "lucide-react";
import { type FormEvent, type KeyboardEvent, type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { type RecorderError, type RecordingEnd, useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useWarnBeforeUnload } from "@/hooks/use-warn-before-unload";
import { cn } from "@/lib/utils";
import { TextAreaField } from "@/shared/forms/TextAreaField";

import {
  ANSWER_COUNTER_FROM,
  ANSWER_MAX_LENGTH,
  EMPTY_RECORDING_MESSAGE,
  MICROPHONE_BLOCKED_MESSAGE,
  MICROPHONE_UNAVAILABLE_MESSAGE,
  RECORDING_FAILED_MESSAGE,
  RECORDING_LIMIT_MESSAGE,
  RECORDING_MAX_SECONDS,
} from "@/modules/interviews/constants";
import type { SendFailure, TranscribeResult } from "@/modules/interviews/hooks/use-interview-chat";
import { answerFormSchema } from "@/modules/interviews/schemas/interviews.schema";
import type { AnswerFormValues } from "@/modules/interviews/types/interviews.types";
import { appendTranscript } from "@/modules/interviews/utils/voice.utils";
import { AnswerMicButton, type MicState } from "./AnswerMicButton";

export type AnswerComposerHandle = { focus: () => void };

type AnswerComposerProps = {
  /** A reply is on its way or the next question is being revealed: no new send. */
  isBusy: boolean;
  /** Take focus when mounted (after the next question appears), not on page load. */
  autoFocus?: boolean;
  /** Receives the trimmed answer; resolves to a failure when the text should come back into the box. */
  onSubmit: (answer: string) => Promise<SendFailure | void>;
  /** Turns a recording into text for the box; without it (or a browser that can't record) there is no mic. */
  onTranscribe?: (recording: Blob, signal: AbortSignal) => Promise<TranscribeResult>;
  ref?: Ref<AnswerComposerHandle>;
};

const RECORDER_ERROR_MESSAGES: Record<RecorderError, string> = {
  denied: MICROPHONE_BLOCKED_MESSAGE,
  "no-device": MICROPHONE_UNAVAILABLE_MESSAGE,
  failed: RECORDING_FAILED_MESSAGE,
};

/**
 * The chat's answer box. While busy it is read-only (not disabled) so focus stays here; Ctrl/⌘+Enter sends and
 * Enter adds a new line, since answers often run to several paragraphs. With `onTranscribe`, a mic records an answer
 * whose text is added after what was typed, for review: it is never sent by itself. Recording and transcribing lock
 * the box, so the text can't land on top of edits. Key it by the question it answers: a new question drops any
 * recording or transcription in progress.
 */
export function AnswerComposer({ isBusy, autoFocus = false, onSubmit, onTranscribe, ref }: AnswerComposerProps) {
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { answer: "" },
    mode: "onTouched",
  });
  const answerLength = useWatch({ control: form.control, name: "answer" }).length;

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState<string>();
  const upload = useRef<AbortController | null>(null);
  // The composer going away (another question, or the screen) drops a transcription in flight.
  useEffect(() => () => upload.current?.abort(), []);

  async function transcribe(recording: Blob | null, end: RecordingEnd) {
    if (!onTranscribe) {
      return;
    }
    if (!recording) {
      setVoiceMessage(EMPTY_RECORDING_MESSAGE);
      return;
    }
    setVoiceMessage(end === "limit" ? RECORDING_LIMIT_MESSAGE : undefined);
    const controller = new AbortController();
    upload.current = controller;
    setIsTranscribing(true);
    const result = await onTranscribe(recording, controller.signal);
    if (controller.signal.aborted) {
      return;
    }
    upload.current = null;
    setIsTranscribing(false);
    if (result.kind === "text") {
      form.setValue("answer", appendTranscript(form.getValues("answer"), result.text), {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setFocus("answer");
    } else if (result.kind === "message") {
      setVoiceMessage(result.message);
    }
  }

  const recorder = useAudioRecorder({ maxSeconds: RECORDING_MAX_SECONDS, onRecorded: transcribe });
  const micState: MicState = isTranscribing ? "transcribing" : recorder.status;
  const isVoiceBusy = micState !== "idle";
  const voiceStatus = recorder.error ? RECORDER_ERROR_MESSAGES[recorder.error] : voiceMessage;

  // Unsent text (or a recording in progress) would be lost on reload; nothing is stored, the browser just asks first.
  useWarnBeforeUnload(answerLength > 0 || isVoiceBusy);

  useImperativeHandle(ref, () => ({ focus: () => form.setFocus("answer") }), [form]);

  const send = form.handleSubmit(async ({ answer }) => {
    const typed = form.getValues("answer");
    form.reset({ answer: "" });
    setVoiceMessage(undefined);
    const failure = await onSubmit(answer);
    if (failure) {
      form.reset({ answer: typed });
      if (failure.message) {
        form.setError("answer", { message: failure.message }, { shouldFocus: true });
      }
    }
  });

  function submitUnlessBusy(event: FormEvent<HTMLFormElement>) {
    if (isBusy || isVoiceBusy) {
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

  function startRecording() {
    setVoiceMessage(undefined);
    void recorder.start();
  }

  const showMic = onTranscribe !== undefined && recorder.isSupported;

  return (
    // The fade lets the conversation slide softly under the composer instead of being cut by a line.
    <div className="relative shrink-0 pt-2 pb-[env(safe-area-inset-bottom)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-linear-to-t before:from-background before:to-transparent">
      <form
        noValidate
        aria-busy={isBusy || isVoiceBusy}
        onSubmit={submitUnlessBusy}
        onKeyDown={sendOnCtrlEnter}
        className="flex flex-col gap-2 rounded-2xl border bg-card px-4 pt-3 pb-2 shadow-sm transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20"
      >
        <TextAreaField
          name="answer"
          label="Your answer"
          hideLabel
          placeholder={showMic ? "Type or record your answer…" : "Type your answer…"}
          rows={2}
          readOnly={isBusy || isVoiceBusy}
          autoFocus={autoFocus}
          // The box above draws the border and focus ring; the field itself is bare text.
          className="max-h-[40dvh] min-h-12 resize-none rounded-none border-0 bg-transparent px-0 py-1 shadow-none focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent"
          register={form.register}
          error={form.formState.errors.answer?.message}
        />
        <div className="flex items-center justify-between gap-3">
          {/* One polite region for the voice status, so a screen reader hears each change once. */}
          <p aria-live="polite" className="min-w-0 text-xs text-muted-foreground">
            {voiceStatus ? (
              <span className={cn(recorder.error && "text-destructive")}>{voiceStatus}</span>
            ) : micState === "recording" ? (
              <span className="sr-only">Recording. Press Stop when you&rsquo;re done.</span>
            ) : micState === "transcribing" ? (
              <span>Transcribing…</span>
            ) : answerLength >= ANSWER_COUNTER_FROM ? (
              <span className={cn("tabular-nums", answerLength > ANSWER_MAX_LENGTH && "text-destructive")}>
                {answerLength} / {ANSWER_MAX_LENGTH}
              </span>
            ) : (
              <span className="hidden sm:inline">Ctrl/⌘ + Enter to send</span>
            )}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {showMic && (
              <AnswerMicButton
                state={micState}
                elapsed={recorder.elapsed}
                maxSeconds={RECORDING_MAX_SECONDS}
                disabled={isBusy}
                onStart={startRecording}
                onStop={recorder.stop}
                onCancel={recorder.cancel}
              />
            )}
            <Button
              type="submit"
              size="icon"
              aria-label="Send answer"
              className={cn(
                "size-11 shrink-0 rounded-full aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                answerLength === 0 && "opacity-50",
              )}
              aria-disabled={isBusy || isVoiceBusy}
            >
              <ArrowUpIcon aria-hidden className="size-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
