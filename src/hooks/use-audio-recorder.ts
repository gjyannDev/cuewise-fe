import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { pickRecordingFormat } from "@/lib/utils";

export type RecorderStatus = "idle" | "requesting" | "recording";
/** `denied`: permission refused or blocked; `no-device`: no microphone, or another app holds it. */
export type RecorderError = "denied" | "no-device" | "failed";
/** `stopped` by the user, or stopped by itself at the time limit. */
export type RecordingEnd = "stopped" | "limit";

type AudioRecorderOptions = {
  maxSeconds: number;
  /** A finished recording (never a cancelled one); `null` when it came out empty. */
  onRecorded: (recording: Blob | null, end: RecordingEnd) => void;
};

const noSubscription = () => () => {};

/** Read once in the browser; on the server (and during hydration) there is no recorder, so nothing renders. */
function detectFormat(): string | null {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return null;
  }
  return pickRecordingFormat((type) => MediaRecorder.isTypeSupported(type));
}

function errorKind(error: unknown): RecorderError {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "NotReadableError" || name === "OverconstrainedError") return "no-device";
  return "failed";
}

/**
 * The microphone for one recording at a time: asks for permission, records in the browser's own format (see
 * `pickRecordingFormat`), counts the seconds and stops by itself at `maxSeconds`. A finished recording goes to
 * `onRecorded`; `cancel` (and unmounting) drops it. The microphone is released whenever a recording ends, so the
 * browser's "in use" indicator never stays on.
 */
export function useAudioRecorder({ maxSeconds, onRecorded }: AudioRecorderOptions) {
  const format = useSyncExternalStore(noSubscription, detectFormat, () => null);
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<RecorderError | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Bumped by every start and every end, so a permission prompt answered after a cancel (or unmount) is dropped.
  const attempt = useRef(0);
  const onRecordedRef = useRef(onRecorded);
  useEffect(() => {
    onRecordedRef.current = onRecorded;
  });

  const release = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  const finish = useCallback(
    (end: RecordingEnd | "cancelled") => {
      attempt.current += 1;
      const active = recorder.current;
      recorder.current = null;
      if (!active) {
        // Still waiting on the permission prompt: `start` sees the new attempt and lets go of the microphone.
        setStatus("idle");
        return;
      }
      if (end === "cancelled") {
        active.ondataavailable = null;
        active.onstop = null;
      } else {
        const chunks: Blob[] = [];
        active.ondataavailable = (event) => chunks.push(event.data);
        active.onstop = () => {
          const blob = new Blob(chunks, { type: active.mimeType });
          onRecordedRef.current(blob.size > 0 ? blob : null, end);
        };
      }
      if (active.state !== "inactive") {
        active.stop();
      }
      release();
      setStatus("idle");
    },
    [release],
  );

  const start = useCallback(async () => {
    if (!format || recorder.current || status !== "idle") {
      return;
    }
    setError(null);
    setElapsed(0);
    setStatus("requesting");
    const mine = ++attempt.current;
    try {
      const granted = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (mine !== attempt.current) {
        granted.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = granted;
      const active = new MediaRecorder(granted, { mimeType: format });
      recorder.current = active;
      // Data is collected once, when the recording stops (see `finish`): one blob, in order.
      active.start();
    } catch (cause) {
      if (mine !== attempt.current) {
        return;
      }
      release();
      recorder.current = null;
      setError(errorKind(cause));
      setStatus("idle");
      return;
    }
    const startedAt = Date.now();
    timer.current = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(Math.min(seconds, maxSeconds));
      if (seconds >= maxSeconds) {
        finish("limit");
      }
    }, 250);
    setStatus("recording");
  }, [format, status, maxSeconds, finish, release]);

  const stop = useCallback(() => finish("stopped"), [finish]);
  const cancel = useCallback(() => finish("cancelled"), [finish]);

  // Unmounting (another question, or leaving the screen) drops whatever is being recorded.
  useEffect(() => () => finish("cancelled"), [finish]);

  return {
    /** False when this browser can't record (the mic button isn't shown then). */
    isSupported: format !== null,
    status,
    /** Whole seconds recorded so far. */
    elapsed,
    error,
    start,
    stop,
    cancel,
  };
}
