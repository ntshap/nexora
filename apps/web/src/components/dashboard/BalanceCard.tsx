import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type BalanceCardProps = {
  shares: number | null;
  assetValue: number | null;
  isLoading?: boolean;
  error?: string | null;
  onDeposit?: () => void;
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

export const BalanceCard = ({ shares, assetValue, isLoading = false, error, onDeposit, onSend }: BalanceCardProps) => {
  const showSkeleton = isLoading;

  return (
    <section className="rounded-3xl border border-white/5 bg-[#11122a] p-6 sm:p-8 shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
      <header className="mb-6 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-hero-text-muted">Available Balance</p>
        {showSkeleton ? (
          <>
            <Skeleton className="h-10 w-40 bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-manrope font-semibold text-hero-text">{formatCurrency(assetValue)}</h2>
            <p className="text-sm text-hero-text-muted">{formatShares(shares)}</p>
          </>
        )}
      </header>
      {!showSkeleton && error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      {!showSkeleton && !error && assetValue === null && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-hero-text-muted">
          Connect to the supported vault to start accruing balance.
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onDeposit}
          variant="hero"
          className="rounded-full px-6 py-3 text-sm font-medium"
          disabled={!onDeposit || showSkeleton}
        >
          Deposit
        </Button>
        <Button
          onClick={onSend}
          variant="outline"
          className="rounded-full border-white/20 bg-white/90 px-6 py-3 text-sm font-medium text-[#1a1a34] hover:bg-white"
          disabled={!onSend || showSkeleton}
        >
          Send
        </Button>
      </div>
    </section>
  );
};
