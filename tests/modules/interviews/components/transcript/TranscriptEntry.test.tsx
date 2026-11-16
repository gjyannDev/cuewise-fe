// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TranscriptEntry } from "@/modules/interviews/components/transcript/TranscriptEntry";
import { Q1, transcriptItem } from "@tests/helpers/interviews";

afterEach(cleanup);

describe("TranscriptEntry", () => {
  it("shows an unsent answer as text only, marked not sent: its actions are on the review card (AC8, EC6)", () => {
    const answer = transcriptItem("answer", Q1, 1, { text: "I split the work by service." });
    render(<TranscriptEntry item={{ ...answer, key: answer.id, unsent: true }} total={3} />);

    expect(screen.getByText(/I split the work by service\./)).toBeTruthy();
    expect(screen.getByText("Not sent")).toBeTruthy();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
