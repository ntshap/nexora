'use client';

import { useState, useCallback } from 'react';

interface UseTransactionRiskOptions {
  onConfirmed?: () => void;
  onCancelled?: () => void;
}

export function useTransactionRisk(options?: UseTransactionRiskOptions) {
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{
    type: 'deposit' | 'withdraw';
    amount: bigint;
    callback: () => void;
  } | null>(null);

  const requestTransaction = useCallback(
    (type: 'deposit' | 'withdraw', amount: bigint, callback: () => void) => {
      setPendingTransaction({ type, amount, callback });
      setShowRiskWarning(true);
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setShowRiskWarning(false);
    if (pendingTransaction) {
      pendingTransaction.callback();
      options?.onConfirmed?.();
    }
    setPendingTransaction(null);
  }, [pendingTransaction, options]);

  const handleCancel = useCallback(() => {
    setShowRiskWarning(false);
    setPendingTransaction(null);
    options?.onCancelled?.();
  }, [options]);

  return {
    showRiskWarning,
    pendingTransaction,
    requestTransaction,
    handleConfirm,
    handleCancel,
  };
}
