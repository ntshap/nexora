import Head from "next/head";
import type { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/dashboard/BottomNav";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type PlanResult = {
  name: string;
  risk_level: string;
  est_apy: number;
  allocations: Record<string, number>;
  rationale: string;
};

const PlansPage = () => {
  const { isConnected } = useAccount();
  const [riskScore, setRiskScore] = useState(5);
  const [horizon, setHorizon] = useState(12);
  const [stablecoin, setStablecoin] = useState("USDC");

  const mutation = useMutation<{ plans: PlanResult[] }, Error, void>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/plan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_score: riskScore,
          horizon_months: horizon,
          stablecoin_preference: stablecoin,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate plans");
      }
      return response.json();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <Head>
        <title>NEXORA Plans</title>
      </Head>
      <div className="min-h-screen bg-hero-bg text-hero-text">
        <Navbar />
        <main className="px-6 sm:px-12 lg:px-[100px] py-12 lg:py-20">
          <section className="max-w-5xl mx-auto bg-[#0f1020] border border-white/5 rounded-[32px] p-8 lg:p-12 shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-plus-jakarta font-extrabold mb-4">Craft Your Yield Plan</h1>
              <p className="text-hero-text-muted">
                Share your risk tolerance and investment horizon to let NEXORA recommend the right mix of vault strategies.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <label className="grid gap-2 text-left">
                <span className="text-sm uppercase tracking-wide text-hero-text-muted">Risk Score (1-10)</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={riskScore}
                  onChange={(event) => setRiskScore(Number(event.target.value))}
                />
                <span className="text-lg font-manrope">{riskScore}</span>
              </label>
              <label className="grid gap-2 text-left">
                <span className="text-sm uppercase tracking-wide text-hero-text-muted">Investment Horizon (months)</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={horizon}
                  onChange={(event) => setHorizon(Number(event.target.value))}
                  className="rounded-lg bg-[#161632] border border-white/10 px-4 py-3 text-hero-text"
                />
              </label>
              <label className="grid gap-2 text-left">
                <span className="text-sm uppercase tracking-wide text-hero-text-muted">Stablecoin Preference</span>
                <select
                  value={stablecoin}
                  onChange={(event) => setStablecoin(event.target.value)}
                  className="rounded-lg bg-[#161632] border border-white/10 px-4 py-3 text-hero-text"
                >
                  <option value="USDC">USDC</option>
                  <option value="DAI">DAI</option>
                </select>
              </label>
              <Button type="submit" variant="hero" className="rounded-full px-8 py-3 text-base font-manrope" disabled={mutation.isPending}>
                {mutation.isPending ? "Generating plan..." : "Generate Plan"}
              </Button>
              {!isConnected && (
                <p className="text-sm text-hero-text-muted">
                  Tip: connect your wallet from the navbar to deploy a plan and interact with the vaults.
                </p>
              )}
            </form>
          </section>

          {mutation.data && (
            <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {mutation.data.plans.map((plan) => (
                <article key={plan.name} className="rounded-[28px] border border-white/5 bg-[#101123] p-6 shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
                  <h3 className="text-xl font-plus-jakarta font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm uppercase tracking-wide text-hero-text-muted mb-4">{plan.risk_level} risk</p>
                  <p className="text-3xl font-manrope font-semibold mb-6">{(plan.est_apy * 100).toFixed(2)}% APY</p>
                  <div className="space-y-2 mb-6">
                    {Object.entries(plan.allocations).map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm text-hero-text-muted">
                        <span>{label}</span>
                        <span>{Math.round(value * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-hero-text-muted">{plan.rationale}</p>
                </article>
              ))}
            </section>
          )}
        </main>
        <FAQSection />
        <FinalCTASection />
        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default PlansPage;

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

