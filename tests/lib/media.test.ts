import { describe, expect, it } from "vitest";

import {
  DEVICE_ERROR_MESSAGES,
  deviceErrorKind,
  heardSpeech,
  pickRecordingFormat,
  rmsLevel,
  SILENCE_MS,
  SOUND_MS,
  silenceStart,
  trackSilence,
} from "@/lib/media";

const supports =
  (...types: string[]) =>
  (type: string) =>
    types.includes(type);

describe("pickRecordingFormat", () => {
  it("prefers WebM/Opus (Chrome, Edge, Firefox) (voice AC12)", () => {
    expect(pickRecordingFormat(supports("audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"))).toBe(
      "audio/webm;codecs=opus",
    );
  });

  it("falls back to MP4 (Safari)", () => {
    expect(pickRecordingFormat(supports("audio/mp4"))).toBe("audio/mp4");
  });

  it("falls back to OGG/Opus last", () => {
    expect(pickRecordingFormat(supports("audio/ogg;codecs=opus"))).toBe("audio/ogg;codecs=opus");
  });

  it("returns null when the browser can record none of them (EC1)", () => {
    expect(pickRecordingFormat(supports("audio/wav"))).toBeNull();
    expect(pickRecordingFormat(() => false)).toBeNull();
  });
});

describe("deviceErrorKind", () => {
  it.each(["NotAllowedError", "SecurityError"])("%s means the user or the browser blocked access", (name) => {
    expect(deviceErrorKind(new DOMException("blocked", name))).toBe("denied");
  });

  it.each(["NotFoundError", "NotReadableError", "OverconstrainedError"])(
    "%s means there is no usable device (missing, or another app holds it)",
    (name) => {
      expect(deviceErrorKind(new DOMException("no device", name))).toBe("no-device");
    },
  );

  it("treats anything else as a plain failure", () => {
    expect(deviceErrorKind(new DOMException("aborted", "AbortError"))).toBe("failed");
    expect(deviceErrorKind(new Error("boom"))).toBe("failed");
    expect(deviceErrorKind("not an error")).toBe("failed");
  });
});

describe("rmsLevel", () => {
  it("reads silence (flat samples) as 0", () => {
    expect(rmsLevel(new Float32Array(256))).toBe(0);
  });

  it("reads a full-scale signal as 1, never more", () => {
    expect(rmsLevel(Float32Array.from({ length: 256 }, (_, i) => (i % 2 ? 1 : -1)))).toBe(1);
  });

  it("reads quiet speech as a small but visible level", () => {
    const level = rmsLevel(Float32Array.from({ length: 256 }, (_, i) => (i % 2 ? 0.05 : -0.05)));
    expect(level).toBeGreaterThan(0.1);
    expect(level).toBeLessThan(1);
  });

  it("reads an empty buffer as 0", () => {
    expect(rmsLevel(new Float32Array(0))).toBe(0);
  });
});

describe("heardSpeech", () => {
  it("is false for silence and true for a speaking level", () => {
    expect(heardSpeech(0)).toBe(false);
    expect(heardSpeech(0.3)).toBe(true);
  });
});

describe("trackSilence", () => {
  const quiet = 0;
  const loud = 0.5;

  it("is not silent before 3 s of quiet", () => {
    let state = trackSilence(silenceStart, quiet, 0);
    state = trackSilence(state, quiet, SILENCE_MS - 1);
    expect(state.silent).toBe(false);
  });

  it("turns silent after 3 s of quiet (spec EC5)", () => {
    let state = trackSilence(silenceStart, quiet, 0);
    state = trackSilence(state, quiet, SILENCE_MS);
    expect(state.silent).toBe(true);
  });

  it("clears when sound returns and lasts", () => {
    let state = trackSilence(silenceStart, quiet, 0);
    state = trackSilence(state, quiet, SILENCE_MS);
    state = trackSilence(state, loud, SILENCE_MS + 100);
    state = trackSilence(state, loud, SILENCE_MS + 100 + SOUND_MS);
    expect(state.silent).toBe(false);
  });

  it("ignores a single loud spike (a click or a bump), which is not a voice", () => {
    let state = trackSilence(silenceStart, quiet, 0);
    state = trackSilence(state, loud, 1000);
    state = trackSilence(state, quiet, 1066);
    state = trackSilence(state, quiet, SILENCE_MS);
    expect(state.silent).toBe(true);
  });

  it("does not warn twice in the same recording", () => {
    let state = trackSilence(silenceStart, quiet, 0);
    state = trackSilence(state, quiet, SILENCE_MS);
    state = trackSilence(state, loud, SILENCE_MS + 100);
    state = trackSilence(state, loud, SILENCE_MS + 100 + SOUND_MS);
    state = trackSilence(state, quiet, SILENCE_MS + 500);
    state = trackSilence(state, quiet, 3 * SILENCE_MS);
    expect(state.silent).toBe(false);
  });

  it("restarts the count when sound interrupts the quiet", () => {
    let state = trackSilence(silenceStart, quiet, 0);
    state = trackSilence(state, loud, SILENCE_MS - 500);
    state = trackSilence(state, loud, SILENCE_MS - 500 + SOUND_MS);
    state = trackSilence(state, quiet, SILENCE_MS);
    state = trackSilence(state, quiet, SILENCE_MS + 1000);
    expect(state.silent).toBe(false);
  });
});

describe("DEVICE_ERROR_MESSAGES", () => {
  it("tells the user how to unblock the camera (spec EC15)", () => {
    expect(DEVICE_ERROR_MESSAGES.camera.denied).toMatch(/site settings/);
  });
});
