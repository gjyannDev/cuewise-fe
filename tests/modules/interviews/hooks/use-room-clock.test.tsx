// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRoomClock } from "@/modules/interviews/hooks/use-room-clock";
import { activityWrapper } from "@tests/helpers/activity";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe("useRoomClock", () => {
  it("reads 0 before the interview starts", () => {
    const { result } = renderHook(() => useRoomClock(false));
    expect(result.current).toBe(0);
  });

  it("counts whole seconds while running (AC12)", () => {
    const { result } = renderHook(() => useRoomClock(true));
    tick(65_400);
    expect(result.current).toBe(65);
  });

  it("stops counting when the interview closes (EC19)", () => {
    const { result, rerender } = renderHook(({ running }) => useRoomClock(running), { initialProps: { running: true } });
    tick(5_000);
    rerender({ running: false });
    const stoppedAt = result.current;
    tick(10_000);
    expect(result.current).toBe(stoppedAt);
  });

  it("restarts at 0 on the next start (EC14)", () => {
    const { result, rerender } = renderHook(({ running }) => useRoomClock(running), { initialProps: { running: true } });
    tick(5_000);
    rerender({ running: false });
    rerender({ running: true });
    expect(result.current).toBe(0);
    tick(2_000);
    expect(result.current).toBe(2);
  });

  it("starts again from 0 after the page was hidden and shown (EC14)", () => {
    const activity = activityWrapper();
    const { result, rerender } = renderHook(() => useRoomClock(true), { wrapper: activity.wrapper });
    tick(5_000);
    activity.setMode("hidden");
    rerender();
    activity.setMode("visible");
    rerender();
    expect(result.current).toBe(0);
  });
});
