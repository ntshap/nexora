'use client';

import { TransactionRiskWarning } from '../legal/TransactionRiskWarning';
import { useTransactionRisk } from '@/hooks/useTransactionRisk';

interface WithRiskWarningProps {
  children: (requestTransaction: (
    type: 'deposit' | 'withdraw',
    amount: bigint,
    callback: () => void
  ) => void) => React.ReactNode;
}

/**
 * HOC to wrap transaction functions with risk warning
 * 
 * Example usage:
 * ```tsx
 * <WithRiskWarning>
 *   {(requestTransaction) => (
 *     <Button 
 *       onClick={() => requestTransaction('deposit', parseUnits('100', 6), handleDeposit)}
 *     >
 *       Deposit
 *     </Button>
 *   )}
 * </WithRiskWarning>
 * ```
 */
export function WithRiskWarning({ children }: WithRiskWarningProps) {
  const {
    showRiskWarning,
    pendingTransaction,
    requestTransaction,
    handleConfirm,
    handleCancel,
  } = useTransactionRisk();

  return (
    <>
      {children(requestTransaction)}

      {pendingTransaction && (
        <TransactionRiskWarning
          open={showRiskWarning}
          type={pendingTransaction.type}
          amount={pendingTransaction.amount}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
