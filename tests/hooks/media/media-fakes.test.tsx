// @vitest-environment happy-dom
import { renderHook } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { domError, installMediaFakes, type MediaFakes } from "@tests/helpers/media";

describe("DOM test runtime (happy-dom + Testing Library)", () => {
  let media: MediaFakes;
  beforeEach(() => {
    media = installMediaFakes();
  });
  afterEach(() => media.restore());

  it("renders a hook", () => {
    const { result } = renderHook(() => useState("ready"));

    expect(result.current[0]).toBe("ready");
  });

  it("fakes getUserMedia with stoppable tracks of the requested kinds", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    expect(stream.getTracks().map((track) => track.kind)).toEqual(["audio", "video"]);
    stream.getTracks().forEach((track) => track.stop());
    expect(stream.getTracks().every((track) => track.readyState === "ended")).toBe(true);
  });

  it("fakes audio playback, including a blocked play", async () => {
    const audio = new Audio();
    await expect(audio.play()).resolves.toBeUndefined();

    media.play.mockRejectedValueOnce(domError("NotAllowedError"));
    await expect(audio.play()).rejects.toMatchObject({ name: "NotAllowedError" });
  });

  it("counts object URLs created and revoked", () => {
    const url = URL.createObjectURL(new Blob(["x"]));
    URL.revokeObjectURL(url);

    expect(media.created).toEqual([url]);
    expect(media.revoked).toEqual([url]);
  });
});
