'use client';

import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { WithdrawDialog } from "@/components/dashboard/WithdrawDialog";
import { Button } from "@/components/ui/button";
import { synthVaultAbi, useShares } from "@nexora/sdk";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SYNTH_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_SYNTH_VAULT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as Address;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;
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

type RiskPreference = {
  address: string;
  risk_level: RiskLevel;
  risk_score: number;
  horizon_months: number;
  stablecoin_preference: string;
};

type PreferencePayload = {
  risk_level: RiskLevel;
  risk_score: number;
  horizon_months: number;
  stablecoin_preference: string;
};

const riskOptions: { label: string; value: RiskLevel; riskScore: number }[] = [
  { label: "Low", value: "low", riskScore: 3 },
  { label: "Medium", value: "medium", riskScore: 5 },
  { label: "High", value: "high", riskScore: 8 },
];

const PLAN_DEFAULTS = {
  horizonMonths: 12,
  stablecoin: "USDC",
};

const riskButtonClasses = (isActive: boolean) =>
  `rounded-full px-5 py-2 text-sm font-medium transition ${
    isActive ? "bg-gradient-hero text-hero-text shadow-hero" : "border border-white/10 text-hero-text-muted hover:text-hero-text"
  }`;

const DashboardContent = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const lowered = address?.toLowerCase() ?? "";
  const hasVaultConfigured = SYNTH_VAULT_ADDRESS !== ZERO_ADDRESS;
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [hasSyncedPreference, setHasSyncedPreference] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"info" | "error">("info");
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SuggestedPlan | null>(null);

  const ownerAddress = (isConnected ? (address as Address) : ZERO_ADDRESS) as Address;
  const defaultReceiver = isConnected ? (address as Address) : undefined;

  const { data: sharesData, isLoading: isSharesLoading, refetch: refetchShares } = useShares(SYNTH_VAULT_ADDRESS, ownerAddress);

  const hasShareData = typeof sharesData !== "undefined";

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
    query: { enabled: isConnected && hasVaultConfigured && hasShareData },
  });

  const hasAssetData = typeof assetsData !== "undefined";

  const preferenceQuery = useQuery<RiskPreference | null>({
    queryKey: ["dashboard-preference", lowered],
    enabled: isConnected && Boolean(lowered),
    retry: false,
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/preferences/${lowered}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error("Failed to load saved preferences");
      }
      return response.json();
    },
  });

  const preferenceMutation = useMutation<RiskPreference, Error, PreferencePayload>({
    mutationFn: async (payload) => {
      const response = await fetch(`${API_BASE}/preferences/${lowered}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const message = (await response.json().catch(() => null))?.detail ?? "Failed to save preference";
        throw new Error(message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard-preference", lowered], data);
      setStatusMessage("Risk preference saved");
      setStatusTone("info");
      setTimeout(() => setStatusMessage(null), 3000);
    },
    onError: (mutationError) => {
      setStatusTone("error");
      setStatusMessage(mutationError.message);
    },
  });

  const planQuery = useQuery<PlanResponse>({
    queryKey: ["dashboard-plan", riskLevel, lowered],
    enabled: isConnected,
    queryFn: async () => {
      if (typeof window === "undefined") {
        return { plans: [] };
      }
      const selected = riskOptions.find((option) => option.value === riskLevel) ?? riskOptions[1];
      const response = await fetch(`${API_BASE}/plan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_score: selected.riskScore,
          horizon_months: PLAN_DEFAULTS.horizonMonths,
          stablecoin_preference: PLAN_DEFAULTS.stablecoin,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate investment strategies");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (!isConnected) {
      setHasSyncedPreference(false);
      setRiskLevel("medium");
      return;
    }
    if (preferenceQuery.data && !hasSyncedPreference) {
      const nextLevel = preferenceQuery.data.risk_level as RiskLevel;
      if (nextLevel && nextLevel !== riskLevel) {
        setRiskLevel(nextLevel);
      }
      setHasSyncedPreference(true);
    }
  }, [hasSyncedPreference, isConnected, preferenceQuery.data, riskLevel]);

  const handleRiskSelection = useCallback(
    (nextLevel: RiskLevel) => {
      if (nextLevel === riskLevel) {
        return;
      }
      if (!isConnected || !lowered) {
        setRiskLevel(nextLevel);
        return;
      }
      setStatusTone("info");
      setStatusMessage("Saving preference...");
      setRiskLevel(nextLevel);
      const selected = riskOptions.find((option) => option.value === nextLevel) ?? riskOptions[1];
      const payload: PreferencePayload = {
        risk_level: nextLevel,
        risk_score: selected.riskScore,
        horizon_months: PLAN_DEFAULTS.horizonMonths,
        stablecoin_preference: PLAN_DEFAULTS.stablecoin,
      };
      preferenceMutation.mutate(payload);
    },
    [isConnected, lowered, preferenceMutation, riskLevel],
  );

  const portfolioQuery = useQuery<PortfolioResponse>({
    queryKey: ["dashboard-portfolio", lowered],
    enabled: isConnected && Boolean(lowered),
    queryFn: async () => {
      if (typeof window === "undefined") {
        return { owner: lowered, total_value: 0, positions: [] };
      }
      const response = await fetch(`${API_BASE}/portfolio/${lowered}`);
      if (!response.ok) {
        throw new Error("Failed to load portfolio");
      }
      return response.json();
    },
  });

  const shares = useMemo(() => {
    if (!hasShareData) return null;
    return Number.parseFloat(formatUnits(sharesData ?? 0n, DECIMALS));
  }, [hasShareData, sharesData]);

  const assetValue = useMemo(() => {
    if (!hasAssetData) return null;
    return Number.parseFloat(formatUnits(assetsData ?? 0n, DECIMALS));
  }, [assetsData, hasAssetData]);

  const canTransact = isConnected && hasVaultConfigured;

  const showVaultUnavailableMessage = useCallback(() => {
    setStatusTone("error");
    setStatusMessage("Vault interactions are unavailable. Connect your wallet and verify the vault address.");
    setTimeout(() => setStatusMessage(null), 5000);
  }, []);

  const balanceError = useMemo(() => {
    if (!hasVaultConfigured) {
      return "Vault address missing. Update NEXT_PUBLIC_SYNTH_VAULT_ADDRESS to view balances.";
    }
    if (isAssetsError) {
      return (assetsError as Error).message;
    }
    return null;
  }, [assetsError, hasVaultConfigured, isAssetsError]);

  const isSavingPreference = preferenceMutation.isPending;

  const planErrorMessage = planQuery.isError
    ? (planQuery.error as Error).message ?? "Unable to generate strategies right now."
    : null;

  const handleDepositOpen = useCallback(
    (plan?: SuggestedPlan) => {
      if (!canTransact) {
        showVaultUnavailableMessage();
        return;
      }
      setSelectedPlan(plan ?? null);
      setDepositOpen(true);
    },
    [canTransact, showVaultUnavailableMessage],
  );

  const onDepositSuccess = async () => {
    await Promise.allSettled([refetchShares(), refetchAssets(), portfolioQuery.refetch()]);
  };

  const handleWithdrawOpen = useCallback(() => {
    if (!canTransact) {
      showVaultUnavailableMessage();
      return;
    }
    setWithdrawOpen(true);
  }, [canTransact, showVaultUnavailableMessage]);

  const onWithdrawSuccess = async () => {
    await Promise.allSettled([refetchShares(), refetchAssets(), portfolioQuery.refetch()]);
  };

  return (
    <Fragment>
      <Head>
        <title>NEXORA Dashboard</title>
      </Head>
      <div className="min-h-screen bg-hero-bg text-hero-text">
        <Navbar />
        {statusMessage && (
          <div
            className={`mx-auto mt-4 max-w-3xl rounded-full px-6 py-3 text-center text-sm ${
              statusTone === "error"
                ? "border border-red-500/40 bg-red-500/10 text-red-200"
                : "border border-white/10 bg-[#161632] text-hero-text-muted"
            }`}
          >
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
                      onDeposit={canTransact ? () => handleDepositOpen() : undefined}
                      onSend={canTransact ? handleWithdrawOpen : undefined}
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
                              onClick={() => handleRiskSelection(option.value)}
                              disabled={isSavingPreference}
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
                        {planQuery.isFetching ? "Refreshing..." : "Refresh Suggestions"}
                      </Button>
                    </div>
                    <SuggestedInvestmentsList
                      plans={planQuery.data?.plans ?? []}
                      isLoading={planQuery.isFetching && !planQuery.data}
                      error={planErrorMessage}
                      onInvest={(plan) => handleDepositOpen(plan)}
                      onRetry={() => planQuery.refetch()}
                    />
                  </div>
                  <PositionsList
                    positions={portfolioQuery.data?.positions ?? []}
                    isLoading={portfolioQuery.isFetching && !portfolioQuery.data}
                    error={portfolioQuery.isError ? (portfolioQuery.error as Error).message : null}
                    onViewAll={() => {
                      router.push("/portfolio").catch(() => undefined);
                    }}
                    onRetry={hasVaultConfigured ? () => portfolioQuery.refetch() : undefined}
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
        <WithdrawDialog
          isOpen={isWithdrawOpen}
          onClose={() => setWithdrawOpen(false)}
          vaultAddress={SYNTH_VAULT_ADDRESS}
          defaultReceiver={defaultReceiver}
          onSuccess={onWithdrawSuccess}
        />
        <BottomNav />
      </div>
    </Fragment>
  );
};

export default dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
});

export const getServerSideProps = async () => ({
  props: {},
});
