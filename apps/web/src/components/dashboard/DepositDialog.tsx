import { FormEvent, useState } from "react";
import type { Address } from "viem";

import { Button } from "@/components/ui/button";
import { useVaultTransactions } from "@/hooks/use-vault-transactions";

type DepositDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: Address;
  vaultLabel?: string;
  assetSymbol?: string;
  onSuccess?: () => Promise<void> | void;
  planName?: string | null;
};

export const DepositDialog = ({
  isOpen,
  onClose,
  vaultAddress,
  vaultLabel = "SynthVault",
  assetSymbol = "mUSDC",
  onSuccess,
  planName,
}: DepositDialogProps) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { executeDeposit, isDepositPending, isConnected } = useVaultTransactions({
    vaultAddress,
    onComplete: onSuccess,
  });

  if (!isOpen) {
    return null;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const status = await executeDeposit(amount, { vaultLabel, assetSymbol });
      setMessage(status);
      setAmount("");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101123] p-6 shadow-hero">
        <header className="mb-4 space-y-1">
          <h2 className="text-2xl font-manrope font-semibold text-hero-text">Deposit into {vaultLabel}</h2>
          {planName && <p className="text-xs uppercase tracking-wide text-hero-text-muted">Strategy: {planName}</p>}
          <p className="text-sm text-hero-text-muted">Enter the amount of {assetSymbol} to deposit.</p>
        </header>
        <form onSubmit={submit} className="grid gap-4">
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={`Amount in ${assetSymbol}`}
            className="rounded-xl border border-white/10 bg-[#161632] px-4 py-3 text-hero-text placeholder:text-hero-text-muted"
          />
          {!isConnected && <p className="text-xs text-hero-text-muted">Connect your wallet to continue.</p>}
          {message && <p className="text-xs text-hero-text-muted">{message}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              variant="hero"
              className="rounded-full px-6 py-3 text-sm font-medium"
              disabled={!isConnected || isDepositPending}
            >
              {isDepositPending ? "Depositing…" : "Confirm Deposit"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full px-6 py-3 text-sm font-medium text-hero-text"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
