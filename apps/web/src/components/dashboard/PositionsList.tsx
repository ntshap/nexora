import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Position = {
  vault: string;
  shares: number;
  asset_value: number;
  apy: number;
};

type PositionsListProps = {
  positions: Position[];
  isLoading?: boolean;
  error?: string | null;
  onViewAll: () => void;
  onRetry?: () => void;
};

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
const formatPercent = (value: number) => `${(value * 100).toFixed(2)}% APY`;

export const PositionsList = ({
  positions,
  isLoading = false,
  error,
  onViewAll,
  onRetry,
}: PositionsListProps) => (
  <section className="rounded-3xl border border-white/5 bg-[#101123] p-6 sm:p-8 shadow-[0_20px_60px_-40px_rgba(10,12,24,0.8)]">
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-plus-jakarta font-semibold text-hero-text">Your Positions</h2>
        <p className="text-sm text-hero-text-muted">Track the vaults you currently hold.</p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text hover:bg-white/20"
        onClick={onViewAll}
      >
        View All
      </Button>
    </header>
    {isLoading && (
      <div className="mt-4 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-white/5 bg-[#141431] p-5">
            <Skeleton className="mb-4 h-6 w-40 bg-white/10" />
            <Skeleton className="mb-2 h-4 w-24 bg-white/10" />
            <Skeleton className="h-10 w-full bg-white/5" />
          </div>
        ))}
      </div>
    )}
    {error && !isLoading && (
      <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        <p>{error}</p>
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            className="self-start rounded-full border-red-400/40 text-red-200 hover:bg-red-500/20"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </div>
    )}
    {!isLoading && !error && positions.length === 0 && (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-hero-text-muted">
        <p>You don&apos;t have any active vault positions yet. Explore suggested investments to launch your first strategy.</p>
        <Button variant="hero" className="rounded-full px-5 py-2 text-sm font-medium" onClick={onViewAll}>
          Explore Portfolio
        </Button>
      </div>
    )}
    <div className="mt-4 grid gap-4">
      {!isLoading &&
        positions.map((position) => (
          <article
            key={position.vault}
            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#141431] p-5 transition hover:border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-manrope font-semibold text-hero-text">{position.vault}</h3>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-hero-text">
                {formatPercent(position.apy)}
              </span>
            </div>
            <div className="grid gap-3 text-sm text-hero-text-muted sm:grid-cols-3">
              <div>
                <p className="uppercase tracking-wide">Deposited</p>
                <p className="text-base font-semibold text-hero-text">{formatCurrency(position.asset_value)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Shares</p>
                <p className="text-base font-semibold text-hero-text">{position.shares.toFixed(4)}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide">Performance</p>
                <p className="text-base font-semibold text-[#7d8bff]">{formatPercent(position.apy)}</p>
              </div>
            </div>
          </article>
        ))}
    </div>
  </section>
);