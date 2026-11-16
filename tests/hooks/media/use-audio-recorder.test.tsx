// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAudioRecorder } from "@/hooks/media/use-audio-recorder";
import { domError, fakeStream, fakeTrack, installMediaFakes, type MediaFakes } from "@tests/helpers/media";

let media: MediaFakes;
beforeEach(() => {
  media = installMediaFakes();
  vi.stubGlobal("MediaRecorder", class { static isTypeSupported = () => true; });
});
afterEach(() => {
  media.restore();
  vi.unstubAllGlobals();
});

const renderRecorder = () => renderHook(() => useAudioRecorder({ maxSeconds: 120, onRecorded: vi.fn() }));
const tracksStopped = (stream: MediaStream) => stream.getTracks().every((track) => track.readyState === "ended");

describe("useAudioRecorder check", () => {
  it("asks for the microphone only, lets go of it at once and reports it usable (the lobby's check)", async () => {
    const { result } = renderRecorder();

    let usable: boolean | undefined;
    await act(async () => {
      usable = await result.current.check();
    });

    expect(usable).toBe(true);
    expect(media.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(tracksStopped(media.streams[0])).toBe(true);
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("a blocked microphone reports denied, and Join can still go ahead (EC1)", async () => {
    media.getUserMedia.mockRejectedValueOnce(domError("NotAllowedError"));
    const { result } = renderRecorder();

    let usable: boolean | undefined;
    await act(async () => {
      usable = await result.current.check();
    });

    expect(usable).toBe(false);
    expect(result.current.error).toBe("denied");
    expect(result.current.status).toBe("idle");
  });

  it("a missing microphone reports no-device (EC1)", async () => {
    media.getUserMedia.mockRejectedValueOnce(domError("NotFoundError"));
    const { result } = renderRecorder();

    await act(async () => void (await result.current.check()));

    expect(result.current.error).toBe("no-device");
  });

  it("a browser that can't record reports unusable without asking for the microphone", async () => {
    vi.stubGlobal("MediaRecorder", class { static isTypeSupported = () => false; });
    const { result } = renderRecorder();

    let usable: boolean | undefined;
    await act(async () => {
      usable = await result.current.check();
    });

    expect(usable).toBe(false);
    expect(media.getUserMedia).not.toHaveBeenCalled();
  });

  it("check is the same function across status changes, so an effect can call it without looping", async () => {
    let grant!: (stream: MediaStream) => void;
    media.getUserMedia.mockImplementationOnce(() => new Promise((resolve) => (grant = resolve)));
    const { result } = renderRecorder();
    const first = result.current.check;

    let pending!: Promise<boolean>;
    act(() => {
      pending = result.current.check();
    });
    expect(result.current.status).toBe("requesting");
    expect(result.current.check).toBe(first);

    await act(async () => {
      grant(fakeStream(fakeTrack("audio")));
      await pending;
    });
    expect(result.current.status).toBe("idle");
    expect(result.current.check).toBe(first);
  });

  it("a check answered after unmount still lets go of the microphone", async () => {
    let grant!: (stream: MediaStream) => void;
    media.getUserMedia.mockImplementationOnce(() => new Promise((resolve) => (grant = resolve)));
    const { result, unmount } = renderRecorder();

    let pending!: Promise<boolean>;
    act(() => {
      pending = result.current.check();
    });
    unmount();
    const late = fakeStream(fakeTrack("audio"));
    grant(late);

    expect(await pending).toBe(false);
    expect(tracksStopped(late)).toBe(true);
  });
});
