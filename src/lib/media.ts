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
    denied: "Camera access is blocked. You can continue without video.",
    "no-device": "Couldn't start the camera. You can continue without video.",
    failed: "Couldn't start the camera. You can continue without video.",
  },
};
