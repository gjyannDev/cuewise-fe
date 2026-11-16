import { MicIcon, MicOffIcon, RotateCcwIcon, VideoIcon, VideoOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { type DeviceError, DEVICE_ERROR_MESSAGES } from "@/lib/media";
import { cn } from "@/lib/utils";

import { MIC_CHECK_MESSAGES } from "@/modules/interviews/constants";
import type { MicCheck } from "@/modules/interviews/types/interviews.types";
import { CameraTile } from "./CameraTile";

type InterviewLobbyProps = {
  /** "Junior Backend interview". */
  title: string;
  /** Shown in the camera tile when there's no video. */
  initials: string;
  cameraStream: MediaStream | null;
  cameraStarting: boolean;
  cameraError: DeviceError | null;
  onToggleCamera: () => void;
  mic: MicCheck;
  onCheckMic: () => void;
  onJoin: () => void;
};

/**
 * The pre-join screen, like a video call's: the camera preview, the microphone and camera status, and Join. Join is
 * always enabled (EC1, EC2): its click is the gesture that lets the interviewer's voice play. The microphone has no
 * on/off toggle because it only opens while the candidate records; the lobby checks it and offers a retry instead.
 */
export function InterviewLobby({
  title,
  initials,
  cameraStream,
  cameraStarting,
  cameraError,
  onToggleCamera,
  mic,
  onCheckMic,
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

  return (
    <div className="mx-auto grid w-full max-w-4xl items-center gap-6 py-6 md:grid-cols-[3fr_2fr] md:gap-10">
      <div className="relative">
        <CameraTile stream={cameraStream} initials={initials} className="aspect-video w-full" />
        <Toggle
          variant="outline"
          pressed={cameraOn}
          onPressedChange={onToggleCamera}
          disabled={cameraStarting}
          aria-label="Camera"
          className="absolute bottom-3 left-1/2 size-11 -translate-x-1/2 rounded-full bg-background/90 aria-pressed:bg-background"
        >
          {cameraOn ? <VideoIcon aria-hidden /> : <VideoOffIcon aria-hidden />}
        </Toggle>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Ready to join?</h1>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        <div role="status" aria-label="Devices">
          <ul className="flex flex-col gap-3 text-sm">
          <li className="flex items-start gap-2">
            {mic === "checking" ? (
              <Spinner aria-hidden className="mt-0.5 size-4 shrink-0" />
            ) : micProblem ? (
              <MicOffIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
            ) : (
              <MicIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <span className={cn(micProblem && "text-destructive")}>
              {mic === "checking" ? "Checking the microphone…" : (micProblem ?? "Microphone ready")}
            </span>
          </li>
          <li className="flex items-start gap-2">
            {cameraOn ? (
              <VideoIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            ) : (
              <VideoOffIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">{cameraStatus}</span>
          </li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="lg" className="h-11 px-6" onClick={onJoin}>
            Join
          </Button>
          {micProblem && mic !== "unsupported" && (
            <Button type="button" variant="outline" size="lg" className="h-11" onClick={onCheckMic}>
              <RotateCcwIcon aria-hidden data-icon="inline-start" />
              Check microphone again
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          The interviewer speaks each question aloud. Your camera stays on this device and is never recorded.
        </p>
      </div>
    </div>
  );
}
