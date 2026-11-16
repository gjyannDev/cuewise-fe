// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useAudioPlayer } from "@/hooks/media/use-audio-player";
import { activityWrapper } from "@tests/helpers/activity";
import { domError, installMediaFakes, type MediaFakes } from "@tests/helpers/media";

let media: MediaFakes;
// Every element the hook played on, so a test can fire the latest one's `ended` / `error` events.
let played: HTMLMediaElement[] = [];
const lastElement = () => played.at(-1);

beforeEach(() => {
  media = installMediaFakes();
  media.play.mockImplementation(function (this: HTMLMediaElement) {
    played.push(this);
    return Promise.resolve();
  });
});
afterEach(() => {
  media.restore();
  played = [];
});

const clip = (text = "mp3") => new Blob([text], { type: "audio/mpeg" });

describe("useAudioPlayer", () => {
  it("resolves 'ended' when the clip plays through", async () => {
    const { result } = renderHook(() => useAudioPlayer());

    let playing!: Promise<string>;
    act(() => {
      playing = result.current.play(result.current.urlFor("q-1", clip()));
    });
    expect(result.current.isPlaying).toBe(true);
    act(() => lastElement()?.dispatchEvent(new Event("ended")));

    await expect(playing).resolves.toBe("ended");
    expect(result.current.isPlaying).toBe(false);
  });

  it("plays one clip at a time: a new play stops the previous one (EC7)", async () => {
    const { result } = renderHook(() => useAudioPlayer());

    let first!: Promise<string>;
    let second!: Promise<string>;
    act(() => {
      first = result.current.play(result.current.urlFor("q-1", clip("a")));
    });
    act(() => {
      second = result.current.play(result.current.urlFor("r-1", clip("b")));
    });

    await expect(first).resolves.toBe("stopped");
    expect(result.current.isPlaying).toBe(true);
    act(() => lastElement()?.dispatchEvent(new Event("ended")));
    await expect(second).resolves.toBe("ended");
  });

  it("reports 'blocked' when the browser refuses autoplay (EC24)", async () => {
    media.play.mockRejectedValueOnce(domError("NotAllowedError"));
    const { result } = renderHook(() => useAudioPlayer());

    await expect(result.current.play(result.current.urlFor("q-1", clip()))).resolves.toBe("blocked");
  });

  it("reports 'failed' for any other playback error", async () => {
    media.play.mockRejectedValueOnce(domError("NotSupportedError"));
    const { result } = renderHook(() => useAudioPlayer());

    await expect(result.current.play(result.current.urlFor("q-1", clip()))).resolves.toBe("failed");
  });

  it("stop cuts the clip short", async () => {
    const { result } = renderHook(() => useAudioPlayer());

    let playing!: Promise<string>;
    act(() => {
      playing = result.current.play(result.current.urlFor("q-1", clip()));
    });
    act(() => result.current.stop());

    await expect(playing).resolves.toBe("stopped");
    expect(media.pause).toHaveBeenCalled();
  });

  it("makes one object URL per clip and reuses it for replays (EC8)", () => {
    const { result } = renderHook(() => useAudioPlayer());

    const first = result.current.urlFor("q-1", clip());
    const again = result.current.urlFor("q-1", clip());

    expect(again).toBe(first);
    expect(media.created).toEqual([first]);
    expect(result.current.has("q-1")).toBe(true);
    expect(result.current.has("q-2")).toBe(false);
  });

  it("revokes every object URL and stops playback on unmount (AC15, EC23)", async () => {
    const { result, unmount } = renderHook(() => useAudioPlayer());
    const urls = [result.current.urlFor("q-1", clip()), result.current.urlFor("r-1", clip())];
    let playing!: Promise<string>;
    act(() => {
      playing = result.current.play(urls[0]);
    });

    unmount();

    await expect(playing).resolves.toBe("stopped");
    expect(media.revoked.sort()).toEqual([...urls].sort());
  });

  it("hidden by a navigation mid-clip (Next keeps the page in <Activity>), it stops and stops reporting playing", async () => {
    const activity = activityWrapper();
    const { result, rerender } = renderHook(() => useAudioPlayer(), { wrapper: activity.wrapper });
    let playing!: Promise<string>;
    act(() => {
      playing = result.current.play(result.current.urlFor("q-1", clip()));
    });

    act(() => {
      activity.setMode("hidden");
      rerender();
    });
    act(() => {
      activity.setMode("visible");
      rerender();
    });

    await expect(playing).resolves.toBe("stopped");
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.has("q-1")).toBe(false);
  });

  it("unlock calls play inside the gesture without waiting for it", () => {
    media.play.mockImplementationOnce(() => new Promise(() => undefined)); // never settles, like an empty element
    const { result } = renderHook(() => useAudioPlayer());

    expect(() => result.current.unlock()).not.toThrow();
    expect(media.play).toHaveBeenCalledTimes(1);
  });
});
