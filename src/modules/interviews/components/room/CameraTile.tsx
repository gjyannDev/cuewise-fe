"use client";

import { VideoOffIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type CameraTileProps = {
  /** The local camera stream, or null when the camera is off, blocked or missing. */
  stream: MediaStream | null;
  /** Shown instead of video (EC2). */
  initials: string;
  /** A name chip in the corner, like a call app's ("You" on the room's stage). */
  label?: string;
  className?: string;
};

/**
 * The candidate's own tile: a mirrored, muted preview of the local camera (never recorded or sent anywhere), or their
 * initials in the same soft gradient and accent circle as the interviewer's tile, with a camera-off mark. Its own file
 * because its effect attaches the stream to the `<video>` element.
 */
export function CameraTile({ stream, initials, label, className }: CameraTileProps) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.srcObject = stream;
    return () => {
      element.srcObject = null;
    };
  }, [stream]);

  return (
    <div className={cn("@container relative overflow-hidden rounded-xl bg-linear-to-br from-accent to-muted", className)}>
      {stream ? (
        <video
          ref={video}
          autoPlay
          muted
          playsInline
          aria-label="Your camera preview"
          className="size-full -scale-x-100 object-cover"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 p-2 text-muted-foreground">
          <span
            aria-hidden
            className="flex aspect-square w-1/4 max-w-24 min-w-10 items-center justify-center rounded-full bg-accent text-[clamp(0.875rem,4cqw,2rem)] font-medium text-primary-text shadow-sm"
          >
            {initials}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <VideoOffIcon aria-hidden className="size-3.5" />
            Camera off
          </span>
        </div>
      )}
      {label && (
        <span className="absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
