import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  type DeviceError,
  deviceErrorKind,
  type LevelSource,
  pickRecordingFormat,
  rmsLevel,
  SOUND_MS,
  silenceStart,
  trackSilence,
} from "@/lib/media";

/** `listening`: the microphone is open for a level only (a mic test); nothing is recorded. */
export type RecorderStatus = "idle" | "requesting" | "recording" | "listening";
/** Why the microphone couldn't start (see `deviceErrorKind`). */
export type RecorderError = DeviceError;
/** `stopped` by the user, or stopped by itself at the time limit. */
export type RecordingEnd = "stopped" | "limit";

type AudioRecorderOptions = {
  maxSeconds: number;
  /** A finished recording (never a cancelled one); `null` when it came out empty. */
  onRecorded: (recording: Blob | null, end: RecordingEnd) => void;
};

/** About 15 level readings a second: smooth enough for a meter, cheap enough to re-render. */
const LEVEL_INTERVAL_MS = 66;

const noSubscription = () => () => {};

/** Read once in the browser; on the server (and during hydration) there is no recorder, so nothing renders. */
function detectFormat(): string | null {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return null;
  }
  return pickRecordingFormat((type) => MediaRecorder.isTypeSupported(type));
}

function detectLevelSupport(): boolean {
  return typeof window !== "undefined" && typeof AudioContext !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

/**
 * Created before the permission prompt, inside the click that asked for it: iOS Safari only lets an audio context
 * run when it starts from a user gesture.
 */
function openContext(): AudioContext | null {
  if (!detectLevelSupport()) return null;
  const context = new AudioContext();
  void context.resume().catch(() => undefined);
  return context;
}

function closeContext(context: AudioContext | null) {
  if (context && context.state !== "closed") void context.close().catch(() => undefined);
}

function createLevelStore() {
  let value = 0;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    set: (next: number) => {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
  };
}

/**
 * The microphone for one recording at a time: asks for permission, records in the browser's own format (see
 * `pickRecordingFormat`), counts the seconds and stops by itself at `maxSeconds`. A finished recording goes to
 * `onRecorded`; `cancel` (and unmounting) drops it. The microphone is released whenever a recording ends, so the
 * browser's "in use" indicator never stays on. Where the browser has Web Audio it also reads the input level, flags
 * 3 s of silence while recording, and can open the microphone for a level only (`listen`, a mic test).
 */
export function useAudioRecorder({ maxSeconds, onRecorded }: AudioRecorderOptions) {
  const format = useSyncExternalStore(noSubscription, detectFormat, () => null);
  const levelSupported = useSyncExternalStore(noSubscription, detectLevelSupport, () => false);
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<RecorderError | null>(null);
  const [silent, setSilent] = useState(false);
  const [heard, setHeard] = useState<boolean | null>(null);
  const [level] = useState(createLevelStore);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const listenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meter = useRef<{ context: AudioContext; timer: ReturnType<typeof setInterval> } | null>(null);
  const silence = useRef(silenceStart);
  // Bumped by every start and every end, so a permission prompt answered after a cancel (or unmount) is dropped.
  const attempt = useRef(0);
  const onRecordedRef = useRef(onRecorded);
  useEffect(() => {
    onRecordedRef.current = onRecorded;
  });
  // Read by `check` and `listen`, so they stay the same functions across status changes (callers run them from effects).
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  });

  const startMeter = useCallback(
    (context: AudioContext, granted: MediaStream, onLevel: (value: number) => void) => {
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      context.createMediaStreamSource(granted).connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      const interval = setInterval(() => {
        analyser.getFloatTimeDomainData(samples);
        const value = rmsLevel(samples);
        level.set(value);
        onLevel(value);
      }, LEVEL_INTERVAL_MS);
      meter.current = { context, timer: interval };
    },
    [level],
  );

  const release = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if (listenTimer.current !== null) {
      clearTimeout(listenTimer.current);
      listenTimer.current = null;
    }
    if (meter.current) {
      clearInterval(meter.current.timer);
      closeContext(meter.current.context);
      meter.current = null;
    }
    level.set(0);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, [level]);

  const finish = useCallback(
    (end: RecordingEnd | "cancelled") => {
      attempt.current += 1;
      const active = recorder.current;
      recorder.current = null;
      setSilent(false);
      if (!active) {
        // Waiting on the permission prompt (`start` sees the new attempt and lets go of it), or a mic test.
        release();
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
    setSilent(false);
    setStatus("requesting");
    const mine = ++attempt.current;
    const context = openContext();
    try {
      const granted = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (mine !== attempt.current) {
        granted.getTracks().forEach((track) => track.stop());
        closeContext(context);
        return;
      }
      stream.current = granted;
      const active = new MediaRecorder(granted, { mimeType: format });
      recorder.current = active;
      // Data is collected once, when the recording stops (see `finish`): one blob, in order.
      active.start();
      if (context) {
        silence.current = { ...silenceStart };
        startMeter(context, granted, (value) => {
          const next = trackSilence(silence.current, value, Date.now());
          if (next.silent !== silence.current.silent) setSilent(next.silent);
          silence.current = next;
        });
      }
    } catch (cause) {
      closeContext(context);
      if (mine !== attempt.current) {
        return;
      }
      release();
      recorder.current = null;
      setError(deviceErrorKind(cause));
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
  }, [format, status, maxSeconds, finish, release, startMeter]);

  const stop = useCallback(() => finish("stopped"), [finish]);
  const cancel = useCallback(() => finish("cancelled"), [finish]);

  /**
   * Asks for the microphone without recording and lets go of it at once (a pre-join check): true when this browser
   * can record and the microphone is usable, otherwise false with `error` set. Audio only, never with the camera.
   */
  const check = useCallback(async (): Promise<boolean> => {
    if (!format) return false;
    if (statusRef.current !== "idle") return statusRef.current === "recording" || statusRef.current === "listening";
    setError(null);
    setStatus("requesting");
    statusRef.current = "requesting";
    const mine = ++attempt.current;
    try {
      const granted = await navigator.mediaDevices.getUserMedia({ audio: true });
      granted.getTracks().forEach((track) => track.stop());
      if (mine !== attempt.current) return false;
      setStatus("idle");
      return true;
    } catch (cause) {
      if (mine !== attempt.current) return false;
      setError(deviceErrorKind(cause));
      setStatus("idle");
      return false;
    }
  }, [format]);

  /**
   * A mic test: opens the microphone for `seconds`, only to read its level (no `MediaRecorder`, nothing kept or sent),
   * then lets go of it and sets `heard`. False when the browser can't read levels or the microphone can't start.
   */
  const listen = useCallback(
    async (seconds: number): Promise<boolean> => {
      if (!detectLevelSupport() || statusRef.current !== "idle") return false;
      setError(null);
      setHeard(null);
      setStatus("requesting");
      statusRef.current = "requesting";
      const mine = ++attempt.current;
      const context = openContext();
      try {
        const granted = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (mine !== attempt.current || !context) {
          granted.getTracks().forEach((track) => track.stop());
          closeContext(context);
          return false;
        }
        stream.current = granted;
        // A voice is sound that lasts (SOUND_MS), not one loud reading: the shared silence rule decides.
        let sound = { ...silenceStart };
        let heardVoice = false;
        startMeter(context, granted, (value) => {
          const now = Date.now();
          sound = trackSilence(sound, value, now);
          if (sound.loudSince !== null && now - sound.loudSince >= SOUND_MS) heardVoice = true;
        });
        listenTimer.current = setTimeout(() => {
          attempt.current += 1;
          release();
          setHeard(heardVoice);
          setStatus("idle");
        }, seconds * 1000);
        setStatus("listening");
        return true;
      } catch (cause) {
        closeContext(context);
        if (mine !== attempt.current) return false;
        setError(deviceErrorKind(cause));
        setStatus("idle");
        return false;
      }
    },
    [release, startMeter],
  );

  /** Ends a mic test early (Join, leaving): the microphone is let go of and no result is given. */
  const stopListening = useCallback(() => {
    if (recorder.current) return;
    finish("cancelled");
  }, [finish]);

  // Unmounting (another question, or leaving the screen) drops whatever is being recorded or tested.
  useEffect(() => () => finish("cancelled"), [finish]);

  return {
    /** False when this browser can't record (the mic button isn't shown then). */
    isSupported: format !== null,
    /** False when this browser can't read a level (no meter, no mic test, no silence hint then). */
    levelSupported,
    status,
    /** Whole seconds recorded so far. */
    elapsed,
    error,
    /** The live input level while the microphone is open (0 otherwise). */
    level: level as LevelSource,
    /** True after 3 s of quiet while recording, until sound returns; at most once per recording. */
    silent,
    /** The last mic test's result: null before one ends (or after it was stopped early). */
    heard,
    start,
    stop,
    cancel,
    check,
    listen,
    stopListening,
  };
}
