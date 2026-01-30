'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingDown, Shield, Zap } from 'lucide-react';
import { formatUnits } from 'viem';

interface TransactionRiskWarningProps {
  open: boolean;
  type: 'deposit' | 'withdraw';
  amount: bigint;
  onConfirm: () => void;
  onCancel: () => void;
}

interface RiskLevel {
  level: 'low' | 'medium' | 'high';
  color: string;
}

export function TransactionRiskWarning({
  open,
  type,
  amount,
  onConfirm,
  onCancel,
}: TransactionRiskWarningProps) {
  const [understood, setUnderstood] = useState(false);

  const amountUSD = formatUnits(amount, 6); // USDC has 6 decimals

  // Calculate risk levels
  const smartContractRisk: RiskLevel =
    Number(amountUSD) > 10000
      ? { level: 'high', color: 'text-red-600' }
      : Number(amountUSD) > 1000
        ? { level: 'medium', color: 'text-yellow-600' }
        : { level: 'low', color: 'text-green-600' };

  const marketRisk: RiskLevel = { level: 'high', color: 'text-red-600' };
  const liquidityRisk: RiskLevel =
    type === 'withdraw'
      ? { level: 'medium', color: 'text-yellow-600' }
      : { level: 'low', color: 'text-green-600' };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Transaction Risk Disclosure
          </DialogTitle>
          <DialogDescription>
            Please review these risks before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">
              You Could Lose ${amountUSD}
            </AlertTitle>
            <AlertDescription>
              This is a high-risk DeFi transaction. Smart contracts may fail,
              markets may crash, and you could lose 100% of your{' '}
              {type === 'deposit' ? 'deposit' : 'investment'}.
            </AlertDescription>
          </Alert>

          {/* Risk Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Risk Assessment:</h4>

            <RiskItem
              icon={Shield}
              title="Smart Contract Risk"
              level={smartContractRisk.level}
              color={smartContractRisk.color}
              description="Contracts may contain bugs or be exploited by hackers"
            />

            <RiskItem
              icon={TrendingDown}
              title="Market Volatility Risk"
              level={marketRisk.level}
              color={marketRisk.color}
              description="Cryptocurrency prices are highly volatile and unpredictable"
            />

            <RiskItem
              icon={Zap}
              title="Liquidity Risk"
              level={liquidityRisk.level}
              color={liquidityRisk.color}
              description={
                type === 'withdraw'
                  ? 'Withdrawal may be delayed during high volatility'
                  : 'Funds will be locked in smart contract'
              }
            />
          </div>

          {/* Key Points */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
              Important Reminders:
            </h4>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>No FDIC Insurance:</strong> Not protected like bank
                  deposits
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Irreversible:</strong> Blockchain transactions cannot
                  be undone
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Gas Fees:</strong> You will pay network fees
                  regardless of outcome
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Your Responsibility:</strong> Only invest what you
                  can afford to lose
                </span>
              </li>
            </ul>
          </div>

          {/* Confirmation */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="understand"
              checked={understood}
              onCheckedChange={(checked: boolean) =>
                setUnderstood(checked)
              }
            />
            <label
              htmlFor="understand"
              className="text-sm leading-tight cursor-pointer"
            >
              I understand the risks outlined above and accept that I may lose{' '}
              <strong className="text-red-600">${amountUSD} USDC</strong> or
              more. I am proceeding at my own risk.
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel Transaction
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!understood}
            className="flex-1"
          >
            I Understand, Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Risk Item Component
function RiskItem({
  icon: Icon,
  title,
  level,
  color,
  description,
}: {
  icon: React.ElementType;
  title: string;
  level: string;
  color: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-sm">{title}</h5>
          <span className={`text-xs font-bold uppercase ${color}`}>
            {level}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
