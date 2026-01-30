import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuggestedInvestmentsList, type SuggestedPlan } from "@/components/dashboard/SuggestedInvestmentsList";

describe("SuggestedInvestmentsList", () => {
  const basePlan: SuggestedPlan = {
    name: "Creative Growth",
    risk_level: "medium",
    est_apy: 0.1234,
    allocations: {
      Stablecoins: 0.4,
      "Yield Vault": 0.6,
    },
    rationale: "Balanced exposure for recurring revenue.",
  };

  it("shows skeleton placeholders while loading", () => {
    const { container } = render(
      <SuggestedInvestmentsList plans={[]} isLoading onInvest={vi.fn()} onRetry={vi.fn()} />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders empty state when no plans are available", () => {
    render(<SuggestedInvestmentsList plans={[]} onInvest={vi.fn()} onRetry={vi.fn()} />);

    expect(
      screen.getByText(/no strategies available for this risk mix just yet/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refresh suggestions/i })).toBeInTheDocument();
  });

  it("renders plan details when provided", () => {
    render(<SuggestedInvestmentsList plans={[basePlan]} onInvest={vi.fn()} />);

    expect(screen.getByText(basePlan.name)).toBeInTheDocument();
    expect(screen.getByText(/12\.34% APY/i)).toBeInTheDocument();
    expect(screen.getByText("Stablecoins")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /invest/i })).toBeInTheDocument();
  });

  it("renders error state with retry button", () => {
    render(
      <SuggestedInvestmentsList plans={[]} error="Server is down" onInvest={vi.fn()} onRetry={vi.fn()} />,
    );

    expect(screen.getByText("Server is down")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});