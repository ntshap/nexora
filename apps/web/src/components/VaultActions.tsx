import { FormEvent, useState } from "react";
import type { Address } from "viem";

import { Button } from "@/components/ui/button";
import { useVaultTransactions } from "@/hooks/use-vault-transactions";

type VaultActionsProps = {
  vaultAddress: Address;
  onComplete?: () => Promise<void> | void;
};

type MessageType = "success" | "error" | "pending" | null;

export const VaultActions = ({ vaultAddress, onComplete }: VaultActionsProps) => {
  const [amount, setAmount] = useState("0");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);

  const { isConnected, isDepositPending, isWithdrawPending, executeDeposit, executeWithdraw } = useVaultTransactions({
    vaultAddress,
    onComplete,
  });

  const disabled = !isConnected || isDepositPending || isWithdrawPending;

  const onDeposit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Processing transaction...");
    setMessageType("pending");
    try {
      const status = await executeDeposit(amount, { vaultLabel: "SynthVault", assetSymbol: "mUSDC" });
      setMessage(status);
      setMessageType("success");
      setAmount("0");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Transaction failed";
      setMessage(errorMsg);
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  const onWithdraw = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Processing transaction...");
    setMessageType("pending");
    try {
      const status = await executeWithdraw(amount, { vaultLabel: "SynthVault", assetSymbol: "mUSDC" });
      setMessage(status);
      setMessageType("success");
      setAmount("0");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Transaction failed";
      setMessage(errorMsg);
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-hero-text-muted";
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
            {isDepositPending ? "Depositing…" : "Deposit"}
          </Button>
        </form>
        <form onSubmit={onWithdraw}>
          <Button type="submit" variant="hero" className="rounded-full px-5 py-2 text-sm" disabled={disabled}>
            {isWithdrawPending ? "Withdrawing…" : "Withdraw"}
          </Button>
        </form>
      </div>
      {!isConnected && <p className="text-xs text-hero-text-muted">Connect wallet to interact with the vault.</p>}
      {message && <p className={`text-xs ${getMessageColor()}`}>{message}</p>}
    </div>
  );
};

