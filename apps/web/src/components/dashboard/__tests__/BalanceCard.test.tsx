import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BalanceCard } from "@/components/dashboard/BalanceCard";

describe("BalanceCard", () => {
  it("disables actions and shows skeleton while loading", () => {
    render(<BalanceCard shares={null} assetValue={null} isLoading onDeposit={vi.fn()} onSend={vi.fn()} />);

    const depositButton = screen.getByRole("button", { name: /deposit/i });
    expect(depositButton).toBeDisabled();
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders balance and shares when data is provided", () => {
    render(<BalanceCard shares={1.2345} assetValue={123.45} onDeposit={vi.fn()} onSend={vi.fn()} />);

    expect(screen.getByText("$123.45")).toBeInTheDocument();
    expect(screen.getByText(/1\.2345 shares/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /deposit/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /send/i })).toBeEnabled();
  });

  it("shows error message when provided", () => {
    render(<BalanceCard shares={null} assetValue={null} error="Unable to load" />);

    expect(screen.getByText("Unable to load")).toBeInTheDocument();
  });
});