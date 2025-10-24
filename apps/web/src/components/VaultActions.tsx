import { FormEvent, useState } from "react";
import type { Address } from "viem";

import { Button } from "@/components/ui/button";
import { useVaultTransactions } from "@/hooks/use-vault-transactions";

type VaultActionsProps = {
  vaultAddress: Address;
  onComplete?: () => Promise<void> | void;
};

export const VaultActions = ({ vaultAddress, onComplete }: VaultActionsProps) => {
  const [amount, setAmount] = useState("0");
  const [message, setMessage] = useState<string | null>(null);

  const { isConnected, isDepositPending, isWithdrawPending, executeDeposit, executeWithdraw } = useVaultTransactions({
    vaultAddress,
    onComplete,
  });

  const disabled = !isConnected || isDepositPending || isWithdrawPending;

  const onDeposit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const status = await executeDeposit(amount, { vaultLabel: "SynthVault", assetSymbol: "mUSDC" });
      setMessage(status);
      setAmount("0");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const onWithdraw = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const status = await executeWithdraw(amount, { vaultLabel: "SynthVault", assetSymbol: "mUSDC" });
      setMessage(status);
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
      {message && <p className="text-xs text-hero-text-muted">{message}</p>}
    </div>
  );
};

