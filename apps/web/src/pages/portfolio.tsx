'use client';

import dynamic from "next/dynamic";
import Head from "next/head";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract } from "wagmi";
import type { Address } from "viem";
import { formatUnits } from "viem";

import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { VaultActions } from "@/components/VaultActions";
import { synthVaultAbi, useShares } from "@nexora/sdk";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SYNTH_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_SYNTH_VAULT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as Address;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;
const DECIMALS = 18;

type HistoryItem = {
  tx_type: string;
  amount: number;
  vault: string;
  tx_hash?: string | null;
  timestamp: string;
};

type HistoryResponse = {
  history: HistoryItem[];
};

const PortfolioContent = () => {
  const { address, isConnected } = useAccount();
  const account = address as Address | undefined;
  const lowered = address?.toLowerCase() ?? "";
  const hasVaultConfigured = SYNTH_VAULT_ADDRESS !== ZERO_ADDRESS;

  const historyQuery = useQuery<HistoryResponse>({
    queryKey: ["portfolio-history", lowered],
    queryFn: async () => {
      if (typeof window === "undefined") {
        return { history: [] };
      }
      const response = await fetch(`${API_BASE}/portfolio/${lowered}`);
      if (!response.ok) {
        throw new Error("Failed to load portfolio history");
      }
      return response.json();
    },
    enabled: isConnected && Boolean(lowered),
  });

  const { data: sharesData } = useShares(SYNTH_VAULT_ADDRESS, account ?? ZERO_ADDRESS);
  const hasShareData = typeof sharesData !== "undefined";

  const { data: assetsData } = useReadContract({
    address: SYNTH_VAULT_ADDRESS,
    abi: synthVaultAbi,
    functionName: "convertToAssets",
    args: [sharesData ?? 0n],
    query: { enabled: Boolean(account) && hasVaultConfigured && hasShareData },
  });

  const { data: totalAssetsData } = useReadContract({
    address: SYNTH_VAULT_ADDRESS,
    abi: synthVaultAbi,
    functionName: "totalAssets",
    query: { enabled: hasVaultConfigured },
  });

  const shares = hasShareData ? parseFloat(formatUnits(sharesData ?? 0n, DECIMALS)) : 0;
  const assetValue = typeof assetsData !== "undefined" ? parseFloat(formatUnits(assetsData ?? 0n, DECIMALS)) : 0;
  const totalAssets = typeof totalAssetsData !== "undefined" ? parseFloat(formatUnits(totalAssetsData ?? 0n, DECIMALS)) : 0;

  const formattedTotal = useMemo(() => `$${assetValue.toFixed(2)}`, [assetValue]);

  const history = historyQuery.data?.history ?? [];

  return (
    <>
      <Head>
        <title>NEXORA Portfolio</title>
      </Head>
      <div className="min-h-screen bg-hero-bg text-hero-text">
        <Navbar />
        <main className="px-6 sm:px-12 lg:px-[100px] py-12 lg:py-20">
          <section className="max-w-5xl mx-auto bg-[#0f1020] border border-white/5 rounded-[32px] p-8 lg:p-12 shadow-[0_40px_80px_-60px_rgba(14,16,31,0.65)]">
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-plus-jakarta font-extrabold mb-4">Portfolio Overview</h1>
                <p className="text-hero-text-muted">
                  Review your SynthVault shares, current asset value, and on-chain activity.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-hero-text-muted uppercase tracking-wide">Total Value</p>
                <p className="text-4xl font-manrope font-semibold">{formattedTotal}</p>
              </div>
            </header>

            {!isConnected && (
              <div className="rounded-2xl border border-[#3b3c58] bg-[#161632] p-6 text-left">
                <h2 className="text-xl font-plus-jakarta font-bold mb-2">Connect your wallet</h2>
                <p className="text-hero-text-muted">
                  Link your Sepolia wallet to fetch vault balances and history. Use the Connect Wallet button in the navbar.
                </p>
              </div>
            )}

            {isConnected && historyQuery.isLoading && <p>Loading portfolio history…</p>}
            {isConnected && historyQuery.isError && (
              <p className="text-red-300">
                {(historyQuery.error as Error).message ?? "Unable to load portfolio. Please try again later."}
              </p>
            )}

            {isConnected && (
              <div className="grid gap-8 mt-6">
                <section>
                  <h2 className="text-lg font-plus-jakarta font-semibold mb-4">Vault Position</h2>
                  <article className="rounded-2xl border border-white/5 bg-[#11122a] p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-manrope font-semibold">SynthVault</h3>
                      <span className="text-sm text-hero-text-muted">Total Assets: {totalAssets.toFixed(4)} mUSDC</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-hero-text-muted">
                      <div>
                        <p className="uppercase tracking-wide">Shares</p>
                        <p className="text-lg text-hero-text">{shares.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide">Asset Value</p>
                        <p className="text-lg text-hero-text">${assetValue.toFixed(2)}</p>
                      </div>
                    </div>
                    <VaultActions
                      vaultAddress={SYNTH_VAULT_ADDRESS}
                      onComplete={async () => {
                        await historyQuery.refetch();
                      }}
                    />
                  </article>
                </section>
                <section>
                  <h2 className="text-lg font-plus-jakarta font-semibold mb-4">Activity</h2>
                  <div className="rounded-2xl border border-white/5 bg-[#11122a] divide-y divide-white/5">
                    {history.length === 0 && (
                      <p className="p-6 text-sm text-hero-text-muted">No activity logged yet. Generate a plan to begin.</p>
                    )}
                    {history.map((item) => (
                      <div key={`${item.timestamp}-${item.tx_type}-${item.tx_hash ?? ""}`} className="flex items-center justify-between p-6 text-sm">
                        <div>
                          <p className="font-manrope text-hero-text capitalize">{item.tx_type}</p>
                          <p className="text-hero-text-muted">{new Date(item.timestamp).toLocaleString()}</p>
                          {item.tx_hash && <p className="text-hero-text-muted text-xs break-all">Tx: {item.tx_hash}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-hero-text-muted">{item.vault}</p>
                          <p className="text-hero-text font-semibold">{item.amount.toFixed(2)} mUSDC</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(PortfolioContent), {
  ssr: false,
});

export const getServerSideProps = async () => ({
  props: {},
});
