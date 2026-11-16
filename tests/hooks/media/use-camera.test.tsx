// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useCamera } from "@/hooks/media/use-camera";
import { activityWrapper } from "@tests/helpers/activity";
import { domError, fakeStream, fakeTrack, installMediaFakes, type MediaFakes } from "@tests/helpers/media";

let media: MediaFakes;
beforeEach(() => {
  media = installMediaFakes();
});
afterEach(() => media.restore());

const tracksStopped = (stream: MediaStream) => stream.getTracks().every((track) => track.readyState === "ended");

describe("useCamera", () => {
  it("asks for video only, never the microphone in the same request", async () => {
    const { result } = renderHook(() => useCamera());

    await act(async () => result.current.start());

    expect(media.getUserMedia).toHaveBeenCalledTimes(1);
    expect(media.getUserMedia).toHaveBeenCalledWith({ video: true });
    expect(result.current.status).toBe("on");
    expect(result.current.stream).toBe(media.streams[0]);
  });

  it("a machine with no camera ends as no-device, leaving the microphone alone (EC2)", async () => {
    media.getUserMedia.mockRejectedValueOnce(domError("NotFoundError"));
    const { result } = renderHook(() => useCamera());

    await act(async () => result.current.start());

    expect(result.current.error).toBe("no-device");
    expect(result.current.status).toBe("off");
    expect(result.current.stream).toBeNull();
  });

  it("a refused permission ends as denied (EC2)", async () => {
    media.getUserMedia.mockRejectedValueOnce(domError("NotAllowedError"));
    const { result } = renderHook(() => useCamera());

    await act(async () => result.current.start());

    expect(result.current.error).toBe("denied");
  });

  it("turning it off stops every track (the browser's camera light goes off)", async () => {
    const { result } = renderHook(() => useCamera());
    await act(async () => result.current.start());

    act(() => result.current.toggle());

    expect(tracksStopped(media.streams[0])).toBe(true);
    expect(result.current.status).toBe("off");
    expect(result.current.stream).toBeNull();
  });

  it("release stops every track (End, completion) (AC10)", async () => {
    const { result } = renderHook(() => useCamera());
    await act(async () => result.current.start());

    act(() => result.current.release());

    expect(tracksStopped(media.streams[0])).toBe(true);
  });

  it("unmounting stops every track (AC15, EC23)", async () => {
    const { result, unmount } = renderHook(() => useCamera());
    await act(async () => result.current.start());

    unmount();

    expect(tracksStopped(media.streams[0])).toBe(true);
  });

  it("hidden by a navigation (Next keeps the page in <Activity>), it stops the tracks and forgets the stream", async () => {
    const activity = activityWrapper();
    const { result, rerender } = renderHook(() => useCamera(), { wrapper: activity.wrapper });
    await act(async () => result.current.start());

    act(() => {
      activity.setMode("hidden");
      rerender();
    });
    act(() => {
      activity.setMode("visible");
      rerender();
    });

    expect(tracksStopped(media.streams[0])).toBe(true);
    // A stopped stream left in state would show a black preview on return.
    expect(result.current.stream).toBeNull();
    expect(result.current.status).toBe("off");
  });

  it("a permission granted after the camera was turned off is let go at once", async () => {
    let grant!: (stream: MediaStream) => void;
    media.getUserMedia.mockImplementationOnce(() => new Promise((resolve) => (grant = resolve)));
    const { result } = renderHook(() => useCamera());

    act(() => void result.current.start());
    act(() => result.current.stop());
    const late = fakeStream(fakeTrack("video"));
    await act(async () => grant(late));

    expect(tracksStopped(late)).toBe(true);
    expect(result.current.stream).toBeNull();
    expect(result.current.status).toBe("off");
  });
});
