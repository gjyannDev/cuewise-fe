export { cn } from "cn"

/** Recording containers in order of preference: WebM/Opus (Chrome, Edge, Firefox), MP4 (Safari), then OGG/Opus. */
const RECORDING_FORMATS = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"] as const

/**
 * The first container this browser can record, or null when it can record none of them (no voice input then).
 * Takes `MediaRecorder.isTypeSupported` as an argument so it stays a pure function that tests can drive.
 */
export function pickRecordingFormat(isTypeSupported: (type: string) => boolean): string | null {
  return RECORDING_FORMATS.find((type) => isTypeSupported(type)) ?? null
}
