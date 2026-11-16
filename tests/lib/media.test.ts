import { describe, expect, it } from "vitest";

import { deviceErrorKind, pickRecordingFormat } from "@/lib/media";

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
