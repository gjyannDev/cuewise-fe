import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { type DeviceError, deviceErrorKind } from "@/lib/media";

export type CameraStatus = "off" | "requesting" | "on";

/**
 * The camera for a local preview only: asks for permission, hands back the stream for a `<video>` element, and stops
 * every track when it is turned off, released or unmounted (so the browser's "in use" light goes off). Video only, and
 * always a separate request from the microphone: one missing device fails a combined request, and a missing camera
 * must never cost the microphone. The stream is never recorded or sent anywhere.
 */
export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("off");
  const [error, setError] = useState<DeviceError | null>(null);
  const current = useRef<MediaStream | null>(null);
  // Bumped by every start and stop, so a permission prompt answered after a stop (or unmount) is dropped.
  const attempt = useRef(0);

  const stopTracks = useCallback(() => {
    current.current?.getTracks().forEach((track) => track.stop());
    current.current = null;
  }, []);

  const stop = useCallback(() => {
    attempt.current += 1;
    stopTracks();
    setStream(null);
    setStatus("off");
  }, [stopTracks]);

  const start = useCallback(async () => {
    if (current.current) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("no-device");
      return;
    }
    const mine = ++attempt.current;
    setError(null);
    setStatus("requesting");
    try {
      const granted = await navigator.mediaDevices.getUserMedia({ video: true });
      if (mine !== attempt.current) {
        granted.getTracks().forEach((track) => track.stop());
        return;
      }
      current.current = granted;
      setStream(granted);
      setStatus("on");
    } catch (cause) {
      if (mine !== attempt.current) return;
      setError(deviceErrorKind(cause));
      setStatus("off");
    }
  }, []);

  const toggle = useCallback(() => {
    if (current.current) stop();
    else void start();
  }, [start, stop]);

  // Unmounting (End, completion, leaving the page) always lets go of the camera. Next.js may only hide the page and keep
  // its state, so the stream is forgotten too: a stopped stream left in state would show a black preview on return.
  useLayoutEffect(
    () => () => {
      attempt.current += 1;
      stopTracks();
      setStream(null);
      setStatus("off");
    },
    [stopTracks],
  );

  return { stream, status, error, start, stop, toggle, release: stop };
}
