'use client';

import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract } from "wagmi";
import type { Address } from "viem";
import { formatUnits } from "viem";

import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { DepositDialog } from "@/components/dashboard/DepositDialog";
import type { SuggestedPlan } from "@/components/dashboard/SuggestedInvestmentsList";
import { SuggestedInvestmentsList } from "@/components/dashboard/SuggestedInvestmentsList";
import { PositionsList } from "@/components/dashboard/PositionsList";
import { Button } from "@/components/ui/button";
import { synthVaultAbi, useShares } from "@nexora/sdk";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SYNTH_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_SYNTH_VAULT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as Address;
const DECIMALS = 18;

type RiskLevel = "low" | "medium" | "high";

type PlanResponse = {
  plans: SuggestedPlan[];
};

type PortfolioPosition = {
  vault: string;
  shares: number;
  asset_value: number;
  apy: number;
};

type PortfolioResponse = {
  owner: string;
  total_value: number;
  positions: PortfolioPosition[];
};

const riskOptions: { label: string; value: RiskLevel; riskScore: number }[] = [
  { label: "Low", value: "low", riskScore: 3 },
  { label: "Medium", value: "medium", riskScore: 5 },
  { label: "High", value: "high", riskScore: 8 },
];

const riskButtonClasses = (isActive: boolean) =>
  `rounded-full px-5 py-2 text-sm font-medium transition ${
    isActive ? "bg-gradient-hero text-hero-text shadow-hero" : "border border-white/10 text-hero-text-muted hover:text-hero-text"
  }`;

const DashboardContent = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const lowered = address?.toLowerCase() ?? "";
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SuggestedPlan | null>(null);

  const { data: sharesData, isLoading: isSharesLoading, refetch: refetchShares } = useShares(
    SYNTH_VAULT_ADDRESS,
    (address as Address) ?? ("0x0000000000000000000000000000000000000000" as Address),
  );

  const {
    data: assetsData,
    isLoading: isAssetsLoading,
    isError: isAssetsError,
    refetch: refetchAssets,
    error: assetsError,
  } = useReadContract({
    address: SYNTH_VAULT_ADDRESS,
    abi: synthVaultAbi,
    functionName: "convertToAssets",
    args: [sharesData ?? 0n],
    query: { enabled: isConnected },
  });

  const planQuery = useQuery<PlanResponse>({
    queryKey: ["dashboard-plan", riskLevel, lowered],
    enabled: isConnected,
    queryFn: async () => {
      const selected = riskOptions.find((option) => option.value === riskLevel) ?? riskOptions[1];
      const response = await fetch(`${API_BASE}/plan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_score: selected.riskScore,
          horizon_months: 12,
          stablecoin_preference: "USDC",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate investment strategies");
      }
      return response.json();
    },
  });

  const portfolioQuery = useQuery<PortfolioResponse>({
    queryKey: ["dashboard-portfolio", lowered],
    enabled: isConnected && Boolean(lowered),
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/portfolio/${lowered}`);
      if (!response.ok) {
        throw new Error("Failed to load portfolio");
      }
      return response.json();
    },
  });

  const shares = useMemo(() => {
    if (!sharesData) return null;
    return Number.parseFloat(formatUnits(sharesData, DECIMALS));
  }, [sharesData]);

  const assetValue = useMemo(() => {
    if (!assetsData) return null;
    return Number.parseFloat(formatUnits(assetsData, DECIMALS));
  }, [assetsData]);

  const balanceError = isAssetsError ? (assetsError as Error).message : null;

  const onDepositClick = (plan?: SuggestedPlan) => {
    setSelectedPlan(plan ?? null);
    setDepositOpen(true);
  };

  const onDepositSuccess = async () => {
    await Promise.allSettled([refetchShares(), refetchAssets(), portfolioQuery.refetch()]);
  };

  const onSendClick = () => {
    setStatusMessage("Send functionality is coming soon. Stay tuned!");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <Fragment>
      <Head>
        <title>NEXORA Dashboard</title>
      </Head>
      <div className="min-h-screen bg-hero-bg text-hero-text">
        <Navbar />
        {statusMessage && (
          <div className="mx-auto mt-4 max-w-3xl rounded-full border border-white/10 bg-[#161632] px-6 py-3 text-center text-sm text-hero-text-muted">
            {statusMessage}
          </div>
        )}
        <main className="px-6 py-12 sm:px-12 lg:px-[100px] lg:py-16">
          <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            {!isConnected ? (
              <div className="rounded-3xl border border-white/5 bg-[#0f1020] p-10 text-center shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
                <h1 className="mb-3 text-3xl font-plus-jakarta font-bold">Launch the NEXORA dashboard</h1>
                <p className="mb-6 text-hero-text-muted">Connect your wallet to review balances and personalised strategies.</p>
                <ConnectWalletButton />
              </div>
            ) : (
              <>
                <header className="flex flex-col gap-3">
                  <h1 className="text-3xl font-plus-jakarta font-extrabold sm:text-4xl">Welcome back</h1>
                  <p className="text-hero-text-muted">Monitor your vault balance and explore fresh strategies in one glance.</p>
                </header>
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                  <div className="grid gap-6">
                    <BalanceCard
                      shares={shares}
                      assetValue={assetValue}
                      isLoading={isSharesLoading || isAssetsLoading}
                      error={balanceError}
                      onDeposit={onDepositClick}
                      onSend={onSendClick}
                    />
                    <div className="rounded-3xl border border-white/5 bg-[#101123] p-6 sm:p-8 shadow-[0_20px_60px_-40px_rgba(10,12,24,0.8)]">
                      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-plus-jakarta font-semibold text-hero-text">Risk Preference</h2>
                          <p className="text-sm text-hero-text-muted">Tune recommendations based on your comfort level.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {riskOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={riskButtonClasses(option.value === riskLevel)}
                              onClick={() => setRiskLevel(option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </header>
                      <Button
                        variant="outline"
                        className="rounded-full border-white/10 bg-transparent px-6 py-3 text-sm text-hero-text hover:bg-white/5"
                        onClick={() => planQuery.refetch()}
                        disabled={planQuery.isFetching}
                      >
                        {planQuery.isFetching ? "Refreshing…" : "Refresh Suggestions"}
                      </Button>
                    </div>
                    <SuggestedInvestmentsList
                      plans={planQuery.data?.plans ?? []}
                      isLoading={planQuery.isFetching && !planQuery.data}
                      error={planQuery.isError ? (planQuery.error as Error).message : null}
                      onInvest={(plan) => onDepositClick(plan)}
                    />
                  </div>
                  <PositionsList
                    positions={portfolioQuery.data?.positions ?? []}
                    isLoading={portfolioQuery.isFetching && !portfolioQuery.data}
                    error={portfolioQuery.isError ? (portfolioQuery.error as Error).message : null}
                    onViewAll={() => {
                      router.push("/portfolio").catch(() => undefined);
                    }}
                  />
                </div>
              </>
            )}
          </section>
        </main>
        <Footer />
        <DepositDialog
          isOpen={isDepositOpen}
          onClose={() => {
            setDepositOpen(false);
            setSelectedPlan(null);
          }}
          vaultAddress={SYNTH_VAULT_ADDRESS}
          onSuccess={onDepositSuccess}
          planName={selectedPlan?.name ?? null}
        />
        <BottomNav />
      </div>
    </Fragment>
  );
};

export default dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
});
