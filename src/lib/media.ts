/**
 * The media kit's pure helpers: which recording format to use, how to read a device error, and the copy for device
 * problems. Feature-agnostic on purpose (ESLint forbids importing `@/modules/*` here), so any feature that records or
 * shows a camera reuses it.
 */

/** Recording containers in order of preference: WebM/Opus (Chrome, Edge, Firefox), MP4 (Safari), then OGG/Opus. */
const RECORDING_FORMATS = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"] as const;

/**
 * The first container this browser can record, or null when it can record none of them (no voice input then).
 * Takes `MediaRecorder.isTypeSupported` as an argument so it stays a pure function that tests can drive.
 */
export function pickRecordingFormat(isTypeSupported: (type: string) => boolean): string | null {
  return RECORDING_FORMATS.find((type) => isTypeSupported(type)) ?? null;
}

/** `denied`: permission refused or blocked; `no-device`: no such device, or another app holds it; `failed`: anything else. */
export type DeviceError = "denied" | "no-device" | "failed";

/**
 * What a failed `getUserMedia` means for the user. Ask for the microphone and the camera in **separate** calls: one
 * missing device fails a combined call (NotFoundError), and a missing camera must never cost the microphone.
 */
export function deviceErrorKind(error: unknown): DeviceError {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "NotReadableError" || name === "OverconstrainedError") return "no-device";
  return "failed";
}

/** What to tell the user about a device problem, by device and kind. Features add their own context around it. */
export const DEVICE_ERROR_MESSAGES: Record<"microphone" | "camera", Record<DeviceError, string>> = {
  microphone: {
    denied: "Microphone access is blocked. Allow it in your browser settings to answer by voice.",
    "no-device": "Couldn't start the microphone.",
    failed: "Couldn't start the microphone.",
  },
  camera: {
    denied: "Camera is blocked. Allow it in your browser's site settings, then reload the page.",
    "no-device": "Couldn't start the camera. You can continue without video.",
    failed: "Couldn't start the camera. You can continue without video.",
  },
};

/**
 * How loud a buffer of audio samples (-1 to 1, from an `AnalyserNode`) is, from 0 to 1. The RMS is scaled up because
 * speech sits far below full scale: a normal voice reads about 0.2 to 0.6, a quiet room below `SILENCE_LEVEL`.
 */
export function rmsLevel(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) sum += samples[i] * samples[i];
  return Math.min(1, Math.sqrt(sum / samples.length) * 4);
}

/** Below this level the microphone hears nothing worth calling a voice. */
export const SILENCE_LEVEL = 0.04;

export const heardSpeech = (level: number) => level >= SILENCE_LEVEL;

/** How long a recording may stay quiet before the user is told nothing is heard. */
export const SILENCE_MS = 3000;

/**
 * How long a level must stay above `SILENCE_LEVEL` to count as sound. A real microphone spikes on clicks and bumps for
 * a single reading (measured: a quiet room read a median of 0.02 with spikes to 0.3), and a spike is not a voice.
 */
export const SOUND_MS = 250;

/** `silent` is true from 3 s of quiet until sound returns, at most once per recording (`warned`). */
export type SilenceState = { quietSince: number | null; loudSince: number | null; silent: boolean; warned: boolean };

export const silenceStart: SilenceState = { quietSince: null, loudSince: null, silent: false, warned: false };

/** The next silence state for a level read at `now` (ms). Pure, so a recorder and its tests share one rule. */
export function trackSilence(state: SilenceState, level: number, now: number): SilenceState {
  if (heardSpeech(level)) {
    const loudSince = state.loudSince ?? now;
    if (now - loudSince < SOUND_MS) return loudSince === state.loudSince ? state : { ...state, loudSince };
    return { ...state, loudSince, quietSince: null, silent: false };
  }
  const quietSince = state.quietSince ?? now;
  if (!state.warned && now - quietSince >= SILENCE_MS) return { quietSince, loudSince: null, silent: true, warned: true };
  return quietSince === state.quietSince && state.loudSince === null ? state : { ...state, quietSince, loudSince: null };
}

/**
 * A microphone's live input level, 0 to 1, for a meter. A source (read with `useSyncExternalStore`) instead of state,
 * so only the meter re-renders about 15 times a second, not the screen that owns the recorder.
 */
export type LevelSource = { get: () => number; subscribe: (listener: () => void) => () => void };
