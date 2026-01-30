'use client';

import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
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
import { AlertTriangle } from 'lucide-react';

interface TermsAcceptanceProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function TermsAcceptance({
  open,
  onAccept,
  onDecline,
}: TermsAcceptanceProps) {
  const { address } = useAccount();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acknowledgedRisks, setAcknowledgedRisks] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allAccepted =
    acceptedTerms &&
    acceptedPrivacy &&
    acknowledgedRisks &&
    isAgeVerified &&
    hasScrolledToBottom;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      if (isAtBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleAccept = async () => {
    if (!address) return;

    try {
      // Call backend API to record acceptance
      const response = await fetch('http://localhost:8000/api/v1/legal/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          terms_version: '1.0.0',
          privacy_version: '1.0.0',
          is_age_verified: isAgeVerified,
        }),
      });

      if (response.ok) {
        onAccept();
      } else {
        console.error('Failed to accept terms:', await response.text());
      }
    } catch (error) {
      console.error('Failed to accept terms:', error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col border-purple-500/20 bg-gradient-to-b from-[#0b0b1f] to-[#050510] shadow-[0_0_80px_-15px_rgba(139,92,246,0.5)]">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            Terms of Service & Risk Disclosure
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Please read carefully before using NEXORA
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden my-4">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-[50vh] overflow-y-auto pr-4 space-y-6 text-sm scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-purple-950/20"
          >
            {/* Critical Risk Warning */}
            <Alert variant="destructive" className="border-2 border-red-500/40 bg-red-950/30">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <AlertTitle className="text-lg font-bold text-red-300">
                ⚠️ HIGH RISK INVESTMENT WARNING
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-2 text-red-200">
                <p className="font-semibold">
                  You may lose all of your invested capital.
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    <strong>Smart Contract Risk:</strong> Code may contain bugs
                    or vulnerabilities
                  </li>
                  <li>
                    <strong>No Insurance:</strong> Not protected by FDIC, SIPC,
                    or any investor protection
                  </li>
                  <li>
                    <strong>Market Volatility:</strong> Cryptocurrency values
                    can drop significantly
                  </li>
                  <li>
                    <strong>Regulatory Uncertainty:</strong> Legal status may
                    change
                  </li>
                  <li>
                    <strong>No Guarantees:</strong> Past performance does not
                    indicate future results
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Terms of Service */}
            <div className="space-y-4 text-gray-300">
              <h3 className="text-lg font-semibold text-purple-300">
                1. Acceptance of Terms
              </h3>
              <p>
                By connecting your wallet and using NEXORA, you agree to be
                bound by these Terms of Service. If you do not agree, do not
                use this service.
              </p>

              <h3 className="text-lg font-semibold text-purple-300">2. Eligibility</h3>
              <p>You represent and warrant that:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>You are at least 18 years of age</li>
                <li>
                  You are not a resident of a restricted jurisdiction (US,
                  China, etc.)
                </li>
                <li>
                  You have the legal capacity to enter into this agreement
                </li>
                <li>
                  Your use of NEXORA complies with all applicable laws
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-300">
                3. Description of Service
              </h3>
              <p>
                NEXORA is a decentralized finance (DeFi) protocol that
                provides:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Automated yield optimization strategies</li>
                <li>Risk-adjusted portfolio management</li>
                <li>On-chain transaction execution</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-300">4. User Responsibilities</h3>
              <p>You are solely responsible for:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Maintaining the security of your private keys</li>
                <li>All transactions initiated from your wallet</li>
                <li>Understanding the risks before investing</li>
                <li>Compliance with tax obligations</li>
                <li>Verifying all transaction details before confirming</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-300">
                5. Prohibited Activities
              </h3>
              <p>You may not:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Use the service for illegal purposes</li>
                <li>Manipulate markets or engage in wash trading</li>
                <li>Attempt to exploit vulnerabilities</li>
                <li>Use bots or automated trading (without permission)</li>
                <li>Impersonate others or create multiple accounts</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-300">6. Fees</h3>
              <p>Current fee structure:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Deposit fee: 0%</li>
                <li>Withdrawal fee: 0.5%</li>
                <li>Performance fee: 10% of profits</li>
                <li>Fees may change with 30 days notice</li>
              </ul>

              <h3 className="text-lg font-semibold text-purple-300">
                7. Limitation of Liability
              </h3>
              <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded">
                <p className="font-semibold text-yellow-300">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc ml-6 space-y-1 mt-2 text-yellow-200">
                  <li>NEXORA is provided &quot;AS IS&quot; without warranties</li>
                  <li>We are not liable for any losses or damages</li>
                  <li>
                    Maximum liability is limited to fees paid in last 12 months
                  </li>
                  <li>We are not responsible for third-party services</li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-purple-300">8. Privacy</h3>
              <p>
                We collect minimal data necessary to provide the service. Your
                wallet address and transaction history are public on the
                blockchain. See our Privacy Policy for details.
              </p>

              <h3 className="text-lg font-semibold text-purple-300">9. Governing Law</h3>
              <p>
                These terms are governed by the laws of [Jurisdiction].
                Disputes will be resolved through binding arbitration.
              </p>

              <h3 className="text-lg font-semibold text-purple-300">
                10. Changes to Terms
              </h3>
              <p>
                We may modify these terms with 30 days notice. Continued use
                after changes constitutes acceptance.
              </p>
            </div>

            <div className="h-px bg-purple-500/20 my-6" />

            <div className="text-center text-sm text-gray-500">
              <p>Last Updated: January 1, 2025</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-purple-500/20">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="age"
                checked={isAgeVerified}
                onCheckedChange={(checked) =>
                  setIsAgeVerified(checked as boolean)
                }
                className="border-purple-500/50 data-[state=checked]:bg-purple-600"
              />
              <label htmlFor="age" className="text-sm leading-tight text-gray-300 cursor-pointer">
                I am at least <strong className="text-purple-300">18 years old</strong>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
                disabled={!hasScrolledToBottom}
                className="border-purple-500/50 data-[state=checked]:bg-purple-600 disabled:opacity-30"
              />
              <label htmlFor="terms" className="text-sm leading-tight text-gray-300 cursor-pointer">
                I have read and agree to the{' '}
                <strong className="text-purple-300">Terms of Service</strong>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) =>
                  setAcceptedPrivacy(checked as boolean)
                }
                disabled={!hasScrolledToBottom}
                className="border-purple-500/50 data-[state=checked]:bg-purple-600 disabled:opacity-30"
              />
              <label htmlFor="privacy" className="text-sm leading-tight text-gray-300 cursor-pointer">
                I have read and agree to the <strong className="text-purple-300">Privacy Policy</strong>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="risks"
                checked={acknowledgedRisks}
                onCheckedChange={(checked) =>
                  setAcknowledgedRisks(checked as boolean)
                }
                disabled={!hasScrolledToBottom}
                className="border-purple-500/50 data-[state=checked]:bg-purple-600 disabled:opacity-30"
              />
              <label htmlFor="risks" className="text-sm leading-tight text-gray-300 cursor-pointer">
                I understand and acknowledge the{' '}
                <strong className="text-red-400">
                  risks of DeFi investing
                </strong>{' '}
                and accept that I may lose my entire investment
              </label>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-xs text-purple-400/70 text-center animate-pulse">
              ↓ Please scroll to the bottom to enable the checkboxes
            </p>
          )}

          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={onDecline}
              className="flex-1 border-purple-500/30 bg-transparent hover:bg-purple-950/30 text-gray-300"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!allAccepted}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.8)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Accept & Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
