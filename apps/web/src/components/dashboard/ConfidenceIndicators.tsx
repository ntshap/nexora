import type { ReactNode } from "react";
import { ShieldCheck, LineChart, Clock } from "lucide-react";

type Indicator = {
  title: string;
  description: string;
  icon: ReactNode;
};

const items: Indicator[] = [
  {
    title: "Audited Vault Framework",
    description: "Built on ERC-4626 standards with transparent smart contracts.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    title: "Realtime On-Chain Feeds",
    description: "Portfolio data streams straight from The Graph every refresh.",
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    title: "24/7 Strategy Monitoring",
    description: "Automated alerts track APY swings and vault health round the clock.",
    icon: <Clock className="h-4 w-4" />,
  },
];

export const ConfidenceIndicators = () => (
  <section className="grid gap-3 rounded-3xl border border-white/5 bg-[#0c0d21]/85 p-4 text-left sm:grid-cols-3 sm:p-5">
    {items.map((item) => (
      <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
        <span className="mt-1 flex size-7 items-center justify-center rounded-full bg-[#201f3f] text-[#9fa6ff]">
          {item.icon}
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-hero-text">{item.title}</p>
          <p className="text-xs text-hero-text-muted">{item.description}</p>
        </div>
      </div>
    ))}
  </section>
);