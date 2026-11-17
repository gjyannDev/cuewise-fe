// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardContainer } from "@/app/(app)/_components/DashboardContainer";
import { useDashboardOverview } from "@/modules/interviews/hooks/use-dashboard-overview";
import { useFeedbackQuery, useGenerateFeedbackMutation } from "@/modules/interviews/queries/interviews.queries";
import type { Feedback } from "@/modules/interviews/types/interviews.types";
import { useProfileQuery } from "@/modules/profile/queries/profile.queries";
import { emptyFeedback, feedback, interviewListItem } from "@tests/helpers/interviews";
import { profile } from "@tests/helpers/profile";

vi.mock("@/modules/interviews/hooks/use-dashboard-overview", () => ({ useDashboardOverview: vi.fn() }));
vi.mock("@/modules/interviews/queries/interviews.queries", () => ({
  useFeedbackQuery: vi.fn(),
  useGenerateFeedbackMutation: vi.fn(),
}));
vi.mock("@/modules/profile/queries/profile.queries", () => ({ useProfileQuery: vi.fn() }));

const IN_PROGRESS_ID = "11111111-1111-4111-8111-111111111111";
const COMPLETED_ID = "22222222-2222-4222-8222-222222222222";
const ABANDONED_ID = "33333333-3333-4333-8333-333333333333";

const inProgress = interviewListItem({ id: IN_PROGRESS_ID, answered_count: 2, question_count: 5 });
const completed = interviewListItem({ id: COMPLETED_ID, status: "completed", answered_count: 5 });
const abandoned = interviewListItem({ id: ABANDONED_ID, status: "abandoned", role: "frontend" });

type Overview = ReturnType<typeof useDashboardOverview>;

function overview(overrides: Partial<Overview> = {}): Overview {
  return {
    recentStatus: "success",
    metricsStatus: "success",
    completedStatus: "success",
    retryRecent: vi.fn(),
    retryCompleted: vi.fn(),
    retryMetrics: vi.fn(),
    isNewUser: false,
    inProgress: undefined,
    recent: [completed, abandoned],
    total: 4,
    completedCount: 3,
    rate: 75,
    thisWeek: { count: 2, capped: false },
    latestCompleted: completed,
    ...overrides,
  };
}

const feedbackRefetch = vi.fn();

/** What the dashboard reads: the overview, the newest feedback and the profile (`undefined`: loading or failed). */
function arrange({
  view = overview(),
  stored = feedback() as Feedback | null,
  feedbackPending = false,
  feedbackFailed = false,
  storedProfile = profile() as ReturnType<typeof profile> | null | undefined,
}: {
  view?: Overview;
  stored?: Feedback | null;
  feedbackPending?: boolean;
  /** The feedback read failed: no data, not pending. */
  feedbackFailed?: boolean;
  storedProfile?: ReturnType<typeof profile> | null | undefined;
} = {}) {
  vi.mocked(useDashboardOverview).mockReturnValue(view);
  vi.mocked(useFeedbackQuery).mockReturnValue({
    data: feedbackPending || feedbackFailed ? undefined : stored,
    isPending: feedbackPending,
    refetch: feedbackRefetch,
  } as unknown as ReturnType<typeof useFeedbackQuery>);
  vi.mocked(useProfileQuery).mockReturnValue({ data: storedProfile } as unknown as ReturnType<typeof useProfileQuery>);
  render(<DashboardContainer />);
  return view;
}

const href = (name: string | RegExp) => screen.getByRole("link", { name }).getAttribute("href");

beforeEach(() => {
  feedbackRefetch.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("DashboardContainer", () => {
  describe("hero", () => {
    it("resumes the interview in progress with its progress (AC1, EC4)", () => {
      arrange({ view: overview({ inProgress, recent: [inProgress, completed] }) });

      expect(href("Resume interview")).toBe(`/interviews?session=${IN_PROGRESS_ID}`);
      expect(screen.getByText("2 of 5 answered")).toBeTruthy();
      expect(screen.getByRole("progressbar", { name: "Questions answered" })).toBeTruthy();
    });

    it("offers a new interview when none is in progress (AC2, EC3)", () => {
      arrange();

      expect(href("Start a mock interview")).toBe("/interviews");
      expect(screen.queryByRole("link", { name: "Resume interview" })).toBeNull();
    });
  });

  describe("metrics", () => {
    it("shows the totals, the completion rate and this week (AC3)", () => {
      arrange();
      const metrics = within(screen.getByRole("region", { name: "Your practice" }));

      expect(metrics.getByText("4")).toBeTruthy();
      expect(metrics.getByText("3")).toBeTruthy();
      expect(metrics.getByText("75%")).toBeTruthy();
      expect(metrics.getByText("2")).toBeTruthy();
    });

    it("shows a dash for no rate and a plus for a capped week (AC3, EC2, EC5)", () => {
      arrange({ view: overview({ rate: null, thisWeek: { count: 50, capped: true } }) });
      const metrics = within(screen.getByRole("region", { name: "Your practice" }));

      expect(metrics.getByText("—")).toBeTruthy();
      expect(metrics.getByText("50+")).toBeTruthy();
    });
  });

  describe("recent interviews", () => {
    it("gives each row the action for its status, and links to the full history (AC4, EC14)", () => {
      arrange({ view: overview({ inProgress, recent: [inProgress, completed, abandoned] }) });
      const card = screen.getByRole("heading", { name: "Recent interviews" }).closest("[data-slot=card]");
      const list = within(card as HTMLElement);

      expect(list.getAllByRole("listitem")).toHaveLength(3);
      expect(list.getByRole("link", { name: /^Resume / }).getAttribute("href")).toBe(
        `/interviews?session=${IN_PROGRESS_ID}`,
      );
      expect(list.getByRole("link", { name: /^View feedback for / }).getAttribute("href")).toBe(
        `/interviews/${COMPLETED_ID}/feedback`,
      );
      // The abandoned row (the frontend one) has no action.
      expect(list.queryAllByRole("link", { name: /Frontend/ })).toHaveLength(0);
      expect(href("See all")).toBe("/history");
    });
  });

  describe("résumé nudge", () => {
    it("asks for a résumé when there is none (AC5)", () => {
      arrange({ storedProfile: null });

      expect(href("Upload résumé")).toBe("/resume");
    });

    it.each([
      ["a résumé is uploaded", profile()],
      ["the profile is loading or failed (EC12, EC13)", undefined],
    ])("stays hidden when %s", (_, storedProfile) => {
      arrange({ storedProfile });

      expect(screen.queryByRole("link", { name: "Upload résumé" })).toBeNull();
    });
  });

  describe("latest feedback", () => {
    it("shows the score and what to focus on next (AC6)", () => {
      arrange();

      expect(screen.getByText("3.6")).toBeTruthy();
      expect(screen.getByText("Name the trade-offs")).toBeTruthy();
      expect(href("View feedback")).toBe(`/interviews/${COMPLETED_ID}/feedback`);
    });

    it("asks the feedback page to generate when none was requested (AC7, EC8)", () => {
      arrange({ stored: null });

      expect(href("Get feedback")).toBe(`/interviews/${COMPLETED_ID}/feedback?start=1`);
    });

    it("opens the feedback page as is while it is generating (AC7, EC8)", () => {
      arrange({ stored: emptyFeedback("generating") });

      expect(href("View progress")).toBe(`/interviews/${COMPLETED_ID}/feedback`);
    });

    it("shows the summary without a score when there was too little to assess (AC7, EC9)", () => {
      arrange({ stored: feedback({ enough_evidence: false, overall: null, summary: "Too short to assess." }) });

      expect(screen.getByText("Too short to assess.")).toBeTruthy();
      expect(screen.queryByText("Overall score")).toBeNull();
    });

    it("is hidden when no interview is completed (EC7)", () => {
      arrange({ view: overview({ completedCount: 0, latestCompleted: undefined, rate: 0 }) });

      expect(screen.queryByRole("heading", { name: "Latest feedback" })).toBeNull();
    });

    it("reads the feedback of the newest completed interview only, and never generates it (AC11)", () => {
      arrange();

      expect(vi.mocked(useFeedbackQuery)).toHaveBeenCalledWith(COMPLETED_ID);
      expect(new Set(vi.mocked(useFeedbackQuery).mock.calls.map(([id]) => id))).toEqual(new Set([COMPLETED_ID]));
      expect(vi.mocked(useGenerateFeedbackMutation)).not.toHaveBeenCalled();
    });
  });

  it("shows only the start card and the nudge to a new user (AC8, EC1)", () => {
    arrange({
      view: overview({ isNewUser: true, total: 0, completedCount: 0, recent: [], latestCompleted: undefined }),
      storedProfile: null,
    });

    expect(href("Start a mock interview")).toBe("/interviews");
    expect(href("Upload résumé")).toBe("/resume");
    expect(screen.queryByRole("region", { name: "Your practice" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Recent interviews" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Latest feedback" })).toBeNull();
  });

  describe("loading and errors (AC9)", () => {
    it("shows each section's skeleton while it loads", () => {
      arrange({ view: overview({ recentStatus: "pending", metricsStatus: "pending" }), feedbackPending: true });

      expect(screen.getByText("Loading your numbers…")).toBeTruthy();
      expect(screen.getByText("Loading your feedback…")).toBeTruthy();
      expect(screen.getAllByText("Loading your interviews…")).toHaveLength(2);
    });

    it("keeps the other sections when the feedback fails, and retries only the feedback (EC11)", () => {
      const view = arrange({ feedbackFailed: true });

      expect(screen.getAllByRole("alert")).toHaveLength(1);
      expect(screen.getByRole("region", { name: "Your practice" })).toBeTruthy();
      expect(screen.getByRole("heading", { name: "Recent interviews" })).toBeTruthy();

      fireEvent.click(screen.getByRole("button", { name: "Try again" }));
      expect(feedbackRefetch).toHaveBeenCalledTimes(1);
      expect(view.retryRecent).not.toHaveBeenCalled();
      expect(view.retryMetrics).not.toHaveBeenCalled();
    });

    it("retries only the metrics when the metrics fail", () => {
      const view = arrange({ view: overview({ metricsStatus: "error" }) });

      expect(screen.getAllByRole("alert")).toHaveLength(1);
      fireEvent.click(screen.getByRole("button", { name: "Try again" }));
      expect(view.retryMetrics).toHaveBeenCalledTimes(1);
      expect(feedbackRefetch).not.toHaveBeenCalled();
    });
  });
});
