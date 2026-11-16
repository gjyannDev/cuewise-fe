import { MicIcon, MicOffIcon, RotateCcwIcon, VideoIcon, VideoOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { type DeviceError, DEVICE_ERROR_MESSAGES, type LevelSource } from "@/lib/media";
import { cn } from "@/lib/utils";

import {
  CONTROL_LABELS,
  LOBBY_TIP,
  MIC_CHECK_MESSAGES,
  MIC_TEST_HEARD,
  MIC_TEST_LABEL,
  MIC_TEST_LISTENING,
  MIC_TEST_NOT_HEARD,
} from "@/modules/interviews/constants";
import type { MicCheck } from "@/modules/interviews/types/interviews.types";
import { CameraTile } from "./CameraTile";
import { LevelMeter } from "./LevelMeter";

/** The lobby's mic test: omit it where the browser can't read a level (EC1). */
export type LobbyMicTest = {
  listening: boolean;
  /** The last test's result; null before one ends. */
  heard: boolean | null;
  level: LevelSource;
  onTest: () => void;
};

type InterviewLobbyProps = {
  /** "Junior Backend · 3 questions · about 10 min". */
  summary: string;
  /** Shown in the camera tile when there's no video. */
  initials: string;
  cameraStream: MediaStream | null;
  cameraStarting: boolean;
  cameraError: DeviceError | null;
  onToggleCamera: () => void;
  mic: MicCheck;
  onCheckMic: () => void;
  micTest?: LobbyMicTest;
  onJoin: () => void;
};

/**
 * The pre-join screen, like a video call's: the camera preview with the device status under it, a mic test, and on the
 * right what the interview is and Join. Join is always enabled (EC1, EC2): its click is the gesture that lets the
 * interviewer's voice play. The microphone has no on/off toggle because it only opens while the candidate records (or
 * tests it); the lobby checks it and offers a retry instead.
 */
export function InterviewLobby({
  summary,
  initials,
  cameraStream,
  cameraStarting,
  cameraError,
  onToggleCamera,
  mic,
  onCheckMic,
  micTest,
  onJoin,
}: InterviewLobbyProps) {
  const cameraOn = cameraStream !== null;
  const micProblem = mic === "checking" || mic === "ready" ? null : MIC_CHECK_MESSAGES[mic];
  const cameraStatus = cameraError
    ? DEVICE_ERROR_MESSAGES.camera[cameraError]
    : cameraStarting
      ? "Starting camera…"
      : cameraOn
        ? "Camera on"
        : "Camera off";
  // A mic test needs a working microphone: with a problem, its message and retry show instead (EC2).
  const test = micProblem || mic === "checking" ? undefined : micTest;
  const micStatus =
    mic === "checking"
      ? "Checking the microphone…"
      : (micProblem ??
        (test?.listening
          ? MIC_TEST_LISTENING
          : test?.heard === true
            ? MIC_TEST_HEARD
            : test?.heard === false
              ? MIC_TEST_NOT_HEARD
              : "Microphone ready"));

  return (
    <div className="grid w-full items-center gap-8 py-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-16">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <CameraTile
            stream={cameraStream}
            initials={initials}
            className="aspect-4/3 max-h-[60dvh] w-full rounded-2xl shadow-sm ring-1 ring-border sm:aspect-video"
          />
          <Toggle
            variant="outline"
            pressed={cameraOn}
            onPressedChange={onToggleCamera}
            disabled={cameraStarting}
            aria-label={CONTROL_LABELS.camera}
            className="absolute bottom-4 left-1/2 size-12 -translate-x-1/2 rounded-full bg-background/90 shadow-sm aria-pressed:bg-background"
          >
            {cameraOn ? <VideoIcon aria-hidden /> : <VideoOffIcon aria-hidden />}
          </Toggle>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div role="status" aria-label="Devices">
            <ul className="flex flex-wrap justify-center gap-2 text-sm">
              <li
                className={cn(
                  "flex items-start gap-2 rounded-xl border px-3 py-2",
                  micProblem || test?.heard === false
                    ? "border-destructive/40 text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {mic === "checking" ? (
                  <Spinner aria-hidden className="mt-0.5 size-4 shrink-0" />
                ) : micProblem ? (
                  <MicOffIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <MicIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                )}
                <span>{micStatus}</span>
                {test?.listening && <LevelMeter source={test.level} className="text-primary" />}
              </li>
              <li
                className={cn(
                  "flex items-start gap-2 rounded-xl border px-3 py-2",
                  cameraError === "denied" ? "border-destructive/40 text-destructive" : "text-muted-foreground",
                )}
              >
                {cameraOn ? (
                  <VideoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <VideoOffIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                )}
                <span>{cameraStatus}</span>
              </li>
            </ul>
          </div>

          {test && (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              disabled={test.listening}
              onClick={test.onTest}
            >
              <MicIcon aria-hidden data-icon="inline-start" />
              {MIC_TEST_LABEL}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl">Ready to join?</h1>
          <p className="text-lg text-muted-foreground">{summary}</p>
          <p className="text-sm text-muted-foreground">{LOBBY_TIP}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" size="lg" className="h-12 rounded-full px-8 text-base" onClick={onJoin}>
            Join now
          </Button>
          {micProblem && mic !== "unsupported" && (
            <Button type="button" variant="outline" size="lg" className="h-12 rounded-full px-6" onClick={onCheckMic}>
              <RotateCcwIcon aria-hidden data-icon="inline-start" />
              Check microphone again
            </Button>
          )}
        </div>

        <p className="max-w-sm text-sm text-muted-foreground">
          The interviewer speaks each question aloud. Your camera stays on this device and is never recorded.
        </p>
      </div>
    </div>
  );
}
