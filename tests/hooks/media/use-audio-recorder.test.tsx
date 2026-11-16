// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAudioRecorder } from "@/hooks/media/use-audio-recorder";
import {
  type AudioLevelFake,
  domError,
  fakeMediaRecorder,
  fakeStream,
  fakeTrack,
  installAudioLevelFake,
  installMediaFakes,
  type MediaFakes,
} from "@tests/helpers/media";

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

describe("with Web Audio", () => {
  let audio: AudioLevelFake;
  let recorders: ReturnType<typeof fakeMediaRecorder>;
  beforeEach(() => {
    vi.useFakeTimers();
    audio = installAudioLevelFake();
    recorders = fakeMediaRecorder();
    vi.stubGlobal("MediaRecorder", recorders.FakeMediaRecorder);
  });
  afterEach(() => {
    audio.restore();
    vi.useRealTimers();
  });

  const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
  const contextsClosed = () => audio.contexts.every((context) => context.state === "closed");

  describe("useAudioRecorder level", () => {
    it("reports levels as supported", () => {
      expect(renderRecorder().result.current.levelSupported).toBe(true);
    });

    it("follows the microphone while recording, and drops to 0 when it stops (AC3, AC7)", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.start()));
      audio.setAmplitude(0.5);
      tick(200);
      expect(result.current.level.get()).toBeGreaterThan(0.5);

      act(() => result.current.stop());
      expect(result.current.level.get()).toBe(0);
    });

    it("tells a subscriber when the level changes", async () => {
      const { result } = renderRecorder();
      const listener = vi.fn();
      result.current.level.subscribe(listener);
      await act(async () => void (await result.current.start()));
      audio.setAmplitude(0.5);
      tick(200);
      expect(listener).toHaveBeenCalled();
    });

    it("turns silent after 3 s of quiet while recording, once, and clears when sound returns (AC4, EC5)", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.start()));
      tick(2800);
      expect(result.current.silent).toBe(false);
      tick(400);
      expect(result.current.silent).toBe(true);

      audio.setAmplitude(0.5);
      tick(400);
      expect(result.current.silent).toBe(false);

      audio.setAmplitude(0);
      tick(5000);
      expect(result.current.silent).toBe(false);
    });

    it("starts each recording's silence count afresh", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.start()));
      tick(3200);
      act(() => result.current.cancel());
      expect(result.current.silent).toBe(false);
      await act(async () => void (await result.current.start()));
      tick(3200);
      expect(result.current.silent).toBe(true);
    });
  });

  describe("useAudioRecorder listen (the lobby's mic test)", () => {
    it("opens the microphone for a level only: nothing is recorded (AC5, AC6)", async () => {
      const { result } = renderRecorder();
      let started: boolean | undefined;
      await act(async () => {
        started = await result.current.listen(10);
      });

      expect(started).toBe(true);
      expect(result.current.status).toBe("listening");
      expect(media.getUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(recorders.instances).toHaveLength(0);
    });

    it("ends by itself after the given seconds, lets go of the microphone and says it heard a voice", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.listen(10)));
      audio.setAmplitude(0.5);
      tick(10_000);

      expect(result.current.status).toBe("idle");
      expect(result.current.heard).toBe(true);
      expect(tracksStopped(media.streams[0])).toBe(true);
      expect(result.current.level.get()).toBe(0);
      expect(contextsClosed()).toBe(true);
    });

    it("does not count a single loud spike as a voice", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.listen(10)));
      audio.setAmplitude(0.5);
      tick(70);
      audio.setAmplitude(0);
      tick(10_000);
      expect(result.current.heard).toBe(false);
    });

    it("says it heard nothing when the microphone stays silent", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.listen(10)));
      tick(10_000);
      expect(result.current.heard).toBe(false);
    });

    it("stopListening lets go of the microphone at once, with no result (EC3)", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.listen(10)));
      act(() => result.current.stopListening());

      expect(result.current.status).toBe("idle");
      expect(result.current.heard).toBeNull();
      expect(tracksStopped(media.streams[0])).toBe(true);
    });

    it("a blocked microphone reports denied (EC2)", async () => {
      media.getUserMedia.mockRejectedValueOnce(domError("NotAllowedError"));
      const { result } = renderRecorder();
      let started: boolean | undefined;
      await act(async () => {
        started = await result.current.listen(10);
      });

      expect(started).toBe(false);
      expect(result.current.error).toBe("denied");
      expect(result.current.status).toBe("idle");
      expect(contextsClosed()).toBe(true);
    });

    it("unmounting while listening lets go of the microphone (EC4)", async () => {
      const { result, unmount } = renderRecorder();
      await act(async () => void (await result.current.listen(10)));
      unmount();
      expect(tracksStopped(media.streams[0])).toBe(true);
      expect(contextsClosed()).toBe(true);
    });

    it("a new listen clears the last result", async () => {
      const { result } = renderRecorder();
      await act(async () => void (await result.current.listen(10)));
      tick(10_000);
      expect(result.current.heard).toBe(false);
      await act(async () => void (await result.current.listen(10)));
      expect(result.current.heard).toBeNull();
    });
  });
});

describe("useAudioRecorder without Web Audio (EC1)", () => {
  it("reports levels as unsupported and never opens the microphone to listen", async () => {
    const { result } = renderRecorder();
    expect(result.current.levelSupported).toBe(false);

    let started: boolean | undefined;
    await act(async () => {
      started = await result.current.listen(10);
    });
    expect(started).toBe(false);
    expect(media.getUserMedia).not.toHaveBeenCalled();
  });
});
