import { describe, expect, it } from "vitest";

import { pickRecordingFormat } from "@/lib/utils";

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
