// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InterviewClosingCard } from "@/modules/interviews/components/room/InterviewClosingCard";

afterEach(cleanup);

describe("InterviewClosingCard", () => {
  it("offers feedback first for a completed interview, then a new one", () => {
    const onStartNew = vi.fn();
    render(<InterviewClosingCard variant="completed" feedbackHref="/feedback/1" onStartNew={onStartNew} />);

    expect(screen.getByRole("heading", { name: "Interview complete" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Get feedback" }).getAttribute("href")).toBe("/feedback/1");
    fireEvent.click(screen.getByRole("button", { name: "Start a new interview" }));
    expect(onStartNew).toHaveBeenCalled();
  });

  it("has no feedback for an interview ended early", () => {
    render(<InterviewClosingCard variant="ended" feedbackHref="/feedback/1" onStartNew={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Interview ended" })).toBeTruthy();
    expect(screen.getByText("Your answers so far are saved.")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Get feedback" })).toBeNull();
  });

  it("takes focus when it replaces the control bar after the candidate's action", () => {
    render(<InterviewClosingCard variant="ended" autoFocus onStartNew={vi.fn()} />);
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Interview ended" }));
  });
});
