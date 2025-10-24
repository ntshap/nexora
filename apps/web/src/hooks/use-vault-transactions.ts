import { useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { parseUnits, type Address } from "viem";

import { useDeposit, useWithdraw } from "@nexora/sdk";

const DECIMAL_PRECISION = 18;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type UseVaultTransactionsOptions = {
  vaultAddress: Address;
  onComplete?: () => Promise<void> | void;
};

type TransactionType = "deposit" | "withdraw";

const logTransaction = async (type: TransactionType, params: { address: string; amount: number; vault: string; txHash: string | null }) => {
  const endpoint = `${API_BASE}/tx/${type}`;
  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: params.address,
      amount: params.amount,
      vault: params.vault,
      tx_hash: params.txHash,
    }),
  }).catch(() => undefined);
};

export const useVaultTransactions = ({ vaultAddress, onComplete }: UseVaultTransactionsOptions) => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const { deposit, isPending: isDepositPending } = useDeposit(vaultAddress);
  const { withdraw, isPending: isWithdrawPending } = useWithdraw(vaultAddress);

  const ensureAmount = (amount: string) => {
    const numericAmount = Number.parseFloat(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error("Enter a valid amount greater than zero");
    }
    return numericAmount;
  };

  const handleAfterTx = useCallback(
    async (txType: TransactionType, params: { amount: number; txHash: `0x${string}`; vault: string }) => {
      if (address) {
        await logTransaction(txType, {
          address,
          amount: params.amount,
          vault: params.vault,
          txHash: params.txHash,
        });
      }
      if (typeof onComplete === "function") {
        await onComplete();
      }
    },
    [address, onComplete],
  );

  const executeDeposit = useCallback(
    async (amount: string, options: { vaultLabel: string; assetSymbol?: string }) => {
      const { vaultLabel, assetSymbol = "mUSDC" } = options;
      if (!address) {
        throw new Error("Wallet not connected");
      }
      const numericAmount = ensureAmount(amount);
      const value = parseUnits(amount, DECIMAL_PRECISION);
      const txHash = await deposit(value, address);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      await handleAfterTx("deposit", { amount: numericAmount, txHash, vault: vaultLabel });
      return `Deposited ${numericAmount} ${assetSymbol}`;
    },
    [address, deposit, handleAfterTx, publicClient],
  );

  const executeWithdraw = useCallback(
    async (amount: string, options: { vaultLabel: string; assetSymbol?: string; receiver?: Address }) => {
      const { vaultLabel, assetSymbol = "mUSDC", receiver } = options;
      if (!address) {
        throw new Error("Wallet not connected");
      }
      const numericAmount = ensureAmount(amount);
      const value = parseUnits(amount, DECIMAL_PRECISION);
      const txHash = await withdraw(value, receiver ?? address, address);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      await handleAfterTx("withdraw", { amount: numericAmount, txHash, vault: vaultLabel });
      return `Withdrew ${numericAmount} ${assetSymbol}`;
    },
    [address, handleAfterTx, publicClient, withdraw],
  );

  return {
    address,
    isConnected,
    executeDeposit,
    executeWithdraw,
    isDepositPending,
    isWithdrawPending,
  };
};
