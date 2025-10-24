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
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-plus-jakarta font-semibold text-hero-text">Your Positions</h2>
        <p className="text-sm text-hero-text-muted">Track the vaults you currently hold.</p>
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="text-sm font-medium text-hero-text hover:text-white focus:outline-none"
      >
        View All {'>'}
      </button>
    </header>
    {isLoading && <p className="text-sm text-hero-text-muted">Loading positions...</p>}
    {error && !isLoading && (
      <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        <p>{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="self-start rounded-full border border-red-400/40 px-4 py-1 text-xs uppercase tracking-wide text-red-200 hover:bg-red-500/20"
          >
            Retry
          </button>
        )}
      </div>
    )}
    {!isLoading && !error && positions.length === 0 && (
      <p className="text-sm text-hero-text-muted">No positions available.</p>
    )}
    <div className="mt-4 grid gap-4">
      {positions.map((position) => (
        <article
          key={position.vault}
          className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#141431] p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-manrope font-semibold text-hero-text">{position.vault}</h3>
            <span className="text-sm text-hero-text-muted">{formatPercent(position.apy)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-hero-text-muted">
            <div>
              <p className="uppercase tracking-wide">Deposited</p>
              <p className="text-hero-text">{formatCurrency(position.asset_value)}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide">Shares</p>
              <p className="text-hero-text">{position.shares.toFixed(4)}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
