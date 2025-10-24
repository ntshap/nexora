import { Button } from "@/components/ui/button";

export type SuggestedPlan = {
  name: string;
  risk_level: string;
  est_apy: number;
  allocations: Record<string, number>;
  rationale: string;
};

type SuggestedInvestmentsListProps = {
  plans: SuggestedPlan[];
  isLoading?: boolean;
  error?: string | null;
  onInvest: (plan: SuggestedPlan) => void;
  onRetry?: () => void;
};

const riskLabelStyles: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  medium: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  high: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
};

const formatPercent = (value: number) => `${(value * 100).toFixed(2)}% APY`;

export const SuggestedInvestmentsList = ({
  plans,
  isLoading = false,
  error,
  onInvest,
  onRetry,
}: SuggestedInvestmentsListProps) => (
  <section className="rounded-3xl border border-white/5 bg-[#101123] p-6 sm:p-8 shadow-[0_20px_60px_-40px_rgba(10,12,24,0.8)]">
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-plus-jakarta font-semibold text-hero-text">Suggested Investments</h2>
        <p className="text-sm text-hero-text-muted">Based on your selected risk preference.</p>
      </div>
    </header>
    {isLoading && <p className="text-sm text-hero-text-muted">Generating strategies???</p>}
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
            Try again
          </Button>
        )}
      </div>
    )}
    {!isLoading && !error && plans.length === 0 && (
      <p className="text-sm text-hero-text-muted">No strategies available. Adjust your filters and try again.</p>
    )}
    <div className="mt-4 grid gap-4">
      {plans.map((plan) => {
        const riskClass = riskLabelStyles[plan.risk_level] ?? "bg-white/5 text-hero-text border border-white/10";
        return (
          <article
            key={plan.name}
            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#141431] p-5 transition hover:border-white/10"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-manrope font-semibold text-hero-text">{plan.name}</h3>
                <p className="text-sm text-hero-text-muted">{plan.rationale}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-wide ${riskClass}`}>
                {plan.risk_level} risk
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-2xl font-semibold text-hero-text">{formatPercent(plan.est_apy)}</p>
              <Button variant="hero" className="rounded-full px-5 py-2 text-sm font-medium" onClick={() => onInvest(plan)}>
                Invest
              </Button>
            </div>
            <div className="grid gap-2 text-xs text-hero-text-muted sm:grid-cols-2">
              {Object.entries(plan.allocations).map(([label, weight]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2">
                  <span>{label}</span>
                  <span>{Math.round(weight * 100)}%</span>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  </section>
);
