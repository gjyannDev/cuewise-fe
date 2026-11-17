// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useEndedSession } from "@/modules/interviews/hooks/use-ended-session";
import { activityWrapper } from "@tests/helpers/activity";

const SESSION_A = "11111111-1111-4111-8111-111111111111";
const SESSION_B = "22222222-2222-4222-8222-222222222222";

describe("useEndedSession", () => {
  it("is not ended when the interview opens", () => {
    const { result } = renderHook(() => useEndedSession(SESSION_A));
    expect(result.current.isEnded).toBe(false);
  });

  it("is ended once the candidate ends it on this screen", () => {
    const { result } = renderHook(() => useEndedSession(SESSION_A));
    act(() => result.current.end());
    expect(result.current.isEnded).toBe(true);
  });

  it("does not carry the end over to another interview", () => {
    const { result, rerender } = renderHook(({ id }) => useEndedSession(id), { initialProps: { id: SESSION_A } });
    act(() => result.current.end());
    rerender({ id: SESSION_B });
    expect(result.current.isEnded).toBe(false);
  });

  it("can be resumed after leaving the screen and coming back (the page is hidden, not unmounted)", () => {
    const activity = activityWrapper();
    const { result, rerender } = renderHook(() => useEndedSession(SESSION_A), { wrapper: activity.wrapper });
    act(() => result.current.end());

    activity.setMode("hidden");
    rerender();
    activity.setMode("visible");
    rerender();

    expect(result.current.isEnded).toBe(false);
  });
});
