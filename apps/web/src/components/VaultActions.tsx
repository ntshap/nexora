import { FormEvent, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { parseUnits, type Address } from "viem";

import { useDeposit, useWithdraw } from "@nexora/sdk";
import { Button } from "@/components/ui/button";

const decimalPrecision = 18;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type VaultActionsProps = {
  vaultAddress: Address;
  onComplete?: () => Promise<void> | void;
};

export const VaultActions = ({ vaultAddress, onComplete }: VaultActionsProps) => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [amount, setAmount] = useState("0");
  const [message, setMessage] = useState<string | null>(null);

  const { deposit, isPending: depositPending } = useDeposit(vaultAddress);
  const { withdraw, isPending: withdrawPending } = useWithdraw(vaultAddress);

  const disabled = !isConnected || depositPending || withdrawPending;

  const logTransaction = async (txType: "deposit" | "withdraw", txHash: string | null, numericAmount: number) => {
    if (!address) return;
    await fetch(`${API_BASE}/tx/${txType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, amount: numericAmount, vault: "SynthVault", tx_hash: txHash }),
    }).catch(() => undefined);
  };

  const handleComplete = async () => {
    if (typeof onComplete === "function") {
      await onComplete();
    }
  };

  const onDeposit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) return;
    try {
      const numericAmount = parseFloat(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setMessage("Enter a valid amount");
        return;
      }
      const value = parseUnits(amount, decimalPrecision);
      const txHash = await deposit(value, address);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      await logTransaction("deposit", txHash, numericAmount);
      await handleComplete();
      setMessage(`Deposited ${amount} mUSDC`);
      setAmount("0");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const onWithdraw = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) return;
    try {
      const numericAmount = parseFloat(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setMessage("Enter a valid amount");
        return;
      }
      const value = parseUnits(amount, decimalPrecision);
      const txHash = await withdraw(value, address, address);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }
      await logTransaction("withdraw", txHash, numericAmount);
      await handleComplete();
      setMessage(`Withdrawn ${amount} mUSDC`);
      setAmount("0");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="grid gap-3">
      <input
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        className="rounded-lg bg-[#161632] border border-white/10 px-4 py-3 text-hero-text"
        placeholder="Amount"
      />
      <div className="flex gap-3">
        <form onSubmit={onDeposit}>
          <Button type="submit" variant="hero" className="rounded-full px-5 py-2 text-sm" disabled={disabled}>
            {depositPending ? "Depositing…" : "Deposit"}
          </Button>
        </form>
        <form onSubmit={onWithdraw}>
          <Button type="submit" variant="hero" className="rounded-full px-5 py-2 text-sm" disabled={disabled}>
            {withdrawPending ? "Withdrawing…" : "Withdraw"}
          </Button>
        </form>
      </div>
      {!isConnected && <p className="text-xs text-hero-text-muted">Connect wallet to interact with the vault.</p>}
      {message && <p className="text-xs text-hero-text-muted">{message}</p>}
    </div>
  );
};
