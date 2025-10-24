"use client";

import { useReadContract, useWriteContract } from "wagmi";
import type { Address } from "viem";

import { synthVaultAbi } from "./abi/synthVault";

export const useDeposit = (vaultAddress: Address) => {
  const { writeContractAsync, isPending } = useWriteContract();

  const deposit = async (amount: bigint, receiver: Address) =>
    writeContractAsync({
      address: vaultAddress,
      abi: synthVaultAbi,
      functionName: "deposit",
      args: [amount, receiver],
    });

  return { deposit, isPending };
};

export const useWithdraw = (vaultAddress: Address) => {
  const { writeContractAsync, isPending } = useWriteContract();

  const withdraw = async (amount: bigint, receiver: Address, owner: Address) =>
    writeContractAsync({
      address: vaultAddress,
      abi: synthVaultAbi,
      functionName: "withdraw",
      args: [amount, receiver, owner],
    });

  return { withdraw, isPending };
};

export const useShares = (vaultAddress: Address, owner: Address) =>
  useReadContract({
    address: vaultAddress,
    abi: synthVaultAbi,
    functionName: "balanceOf",
    args: [owner],
    query: { enabled: Boolean(owner) },
  });
