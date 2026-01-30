import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PositionsList } from "@/components/dashboard/PositionsList";

describe("PositionsList", () => {
  const positions = [
    {
      vault: "SynthVault-1",
      shares: 1.2345,
      asset_value: 250.5,
      apy: 0.145,
    },
  ];

  it("shows skeleton placeholders while loading", () => {
    const { container } = render(<PositionsList positions={[]} isLoading onViewAll={vi.fn()} />);

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows empty state when user has no positions", () => {
    render(<PositionsList positions={[]} onViewAll={vi.fn()} />);

    expect(screen.getByText(/you don't have any active vault positions yet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /explore portfolio/i })).toBeInTheDocument();
  });

  it("renders positions when data is provided", () => {
    render(<PositionsList positions={positions} onViewAll={vi.fn()} />);

    expect(screen.getByText("SynthVault-1")).toBeInTheDocument();
    expect(screen.getByText("$250.50")).toBeInTheDocument();
    expect(screen.getAllByText(/14\.50% APY/i).length).toBeGreaterThan(0);
  });

  it("renders error state with retry option", () => {
    render(<PositionsList positions={[]} error="Unable to load" onViewAll={vi.fn()} onRetry={vi.fn()} />);

    expect(screen.getByText("Unable to load")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});