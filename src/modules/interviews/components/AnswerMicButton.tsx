import { LoaderCircleIcon, MicIcon, SquareIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MicState = "idle" | "requesting" | "recording" | "transcribing";

type AnswerMicButtonProps = {
  state: MicState;
  /** Seconds recorded so far, and the limit the recording stops at. */
  elapsed: number;
  maxSeconds: number;
  /** An answer is on its way: no new recording. */
  disabled: boolean;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
};

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const ROUND = "size-11 shrink-0 rounded-full aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

/**
 * The composer's voice control: a mic to start, then a timer with Stop and Cancel while recording, then a spinner
 * while the recording becomes text. The state is always in words too (labels, the timer), never colour alone.
 */
export function AnswerMicButton({ state, elapsed, maxSeconds, disabled, onStart, onStop, onCancel }: AnswerMicButtonProps) {
  if (state === "recording") {
    return (
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" className={ROUND} aria-label="Cancel recording" onClick={onCancel}>
          <XIcon aria-hidden className="size-5" />
        </Button>
        <span className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground tabular-nums">
          <span aria-hidden className="size-2 rounded-full bg-destructive motion-safe:animate-pulse" />
          <span>
            Recording {clock(elapsed)} / {clock(maxSeconds)}
          </span>
        </span>
        <Button type="button" variant="destructive" size="icon" className={ROUND} aria-label="Stop recording" onClick={onStop}>
          <SquareIcon aria-hidden className="size-4 fill-current" />
        </Button>
      </div>
    );
  }

  const waiting = state === "requesting" || state === "transcribing";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(ROUND, waiting && "cursor-progress")}
      aria-label={state === "transcribing" ? "Transcribing your answer" : state === "requesting" ? "Starting microphone" : "Record answer"}
      aria-disabled={disabled || waiting}
      onClick={disabled || waiting ? undefined : onStart}
    >
      {waiting ? (
        <LoaderCircleIcon aria-hidden className="size-5 motion-safe:animate-spin" />
      ) : (
        <MicIcon aria-hidden className="size-5" />
      )}
    </Button>
  );
}
