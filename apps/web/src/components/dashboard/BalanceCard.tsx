import { Button } from "@/components/ui/button";

type BalanceCardProps = {
  shares: number | null;
  assetValue: number | null;
  isLoading?: boolean;
  error?: string | null;
  onDeposit: () => void;
  onSend?: () => void;
};

const formatCurrency = (value: number | null) => {
  if (value === null) {
    return "--";
  }
  return `$${value.toFixed(2)}`;
};

const formatShares = (value: number | null) => {
  if (value === null) {
    return "--";
  }
  return `${value.toFixed(4)} shares`;
};

export const BalanceCard = ({ shares, assetValue, isLoading = false, error, onDeposit, onSend }: BalanceCardProps) => (
  <section className="rounded-3xl border border-white/5 bg-[#11122a] p-6 sm:p-8 shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
    <header className="mb-6 flex flex-col gap-2">
      <p className="text-sm uppercase tracking-wide text-hero-text-muted">Available Balance</p>
      <h2 className="text-3xl font-manrope font-semibold text-hero-text">{formatCurrency(assetValue)}</h2>
      <p className="text-sm text-hero-text-muted">{formatShares(shares)}</p>
    </header>
    {isLoading && <p className="text-sm text-hero-text-muted">Loading balance…</p>}
    {error && !isLoading && <p className="text-sm text-red-300">{error}</p>}
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Button onClick={onDeposit} variant="hero" className="rounded-full px-6 py-3 text-sm font-medium">
        Deposit
      </Button>
      <Button onClick={onSend} variant="outline" className="rounded-full px-6 py-3 text-sm font-medium" disabled={!onSend}>
        Send
      </Button>
    </div>
  </section>
);
