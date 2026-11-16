"use client";

import { VideoOffIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type CameraTileProps = {
  /** The local camera stream, or null when the camera is off, blocked or missing. */
  stream: MediaStream | null;
  /** Shown instead of video (EC2). */
  initials: string;
  className?: string;
};

/**
 * The candidate's own tile: a mirrored, muted preview of the local camera (never recorded or sent anywhere), or their
 * initials with a camera-off mark. Its own file because its effect attaches the stream to the `<video>` element.
 */
export function CameraTile({ stream, initials, className }: CameraTileProps) {
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
    <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
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
            className="flex size-14 items-center justify-center rounded-full bg-background text-lg font-medium text-foreground"
          >
            {initials}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <VideoOffIcon aria-hidden className="size-3.5" />
            Camera off
          </span>
        </div>
      )}
    </div>
  );
}
