// @vitest-environment happy-dom
import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { LevelSource } from "@/lib/media";
import { LevelMeter } from "@/modules/interviews/components/room/LevelMeter";

function fakeSource(initial = 0) {
  let value = initial;
  const listeners = new Set<() => void>();
  const source: LevelSource = {
    get: () => value,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
  const set = (next: number) =>
    act(() => {
      value = next;
      listeners.forEach((listener) => listener());
    });
  return { source, set };
}

const activeBars = (container: HTMLElement) => container.querySelectorAll('[data-active="true"]').length;

describe("LevelMeter", () => {
  it("is hidden from screen readers (the text beside it says what is happening)", () => {
    const { container } = render(<LevelMeter source={fakeSource().source} />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("lights no bar for silence", () => {
    const { container } = render(<LevelMeter source={fakeSource(0).source} />);
    expect(activeBars(container)).toBe(0);
  });

  it("follows the level as it changes (AC3, AC5)", () => {
    const { source, set } = fakeSource(0);
    const { container } = render(<LevelMeter source={source} />);
    set(0.2);
    expect(activeBars(container)).toBe(2);
    set(1);
    expect(activeBars(container)).toBe(5);
    set(0);
    expect(activeBars(container)).toBe(0);
  });
});
