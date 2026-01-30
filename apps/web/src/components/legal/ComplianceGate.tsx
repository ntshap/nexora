'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useCompliance } from '@/hooks/useCompliance';
import { AgeVerification } from './AgeVerification';
import { TermsAcceptance } from './TermsAcceptance';

interface ComplianceGateProps {
  children: React.ReactNode;
}

export function ComplianceGate({ children }: ComplianceGateProps) {
  const { isConnected } = useAccount();
  const {
    hasAcceptedTerms,
    isAgeVerified,
    isLoading,
    needsCompliance,
    markAsCompliant,
  } = useCompliance();

  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showTermsAcceptance, setShowTermsAcceptance] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setShowAgeVerification(false);
      setShowTermsAcceptance(false);
      return;
    }

    if (isLoading) return;

    if (needsCompliance) {
      // Start with age verification
      if (!isAgeVerified && !ageVerified) {
        setShowAgeVerification(true);
      } else if (!hasAcceptedTerms) {
        setShowTermsAcceptance(true);
      }
    }
  }, [
    isConnected,
    isLoading,
    needsCompliance,
    hasAcceptedTerms,
    isAgeVerified,
    ageVerified,
  ]);

  const handleAgeVerified = () => {
    setAgeVerified(true);
    setShowAgeVerification(false);
    setShowTermsAcceptance(true);
  };

  const handleAgeDecline = () => {
    setShowAgeVerification(false);
    // Optionally disconnect wallet
  };

  const handleTermsAccept = () => {
    setShowTermsAcceptance(false);
    markAsCompliant();
  };

  const handleTermsDecline = () => {
    setShowTermsAcceptance(false);
    setAgeVerified(false);
    // Optionally disconnect wallet
  };

  // Show loading state
  if (isConnected && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Show children only if compliant or not connected
  const canShow = !isConnected || (!isLoading && !needsCompliance);

  return (
    <>
      {canShow && children}

      <AgeVerification
        open={showAgeVerification}
        onVerified={handleAgeVerified}
        onDecline={handleAgeDecline}
      />

      <TermsAcceptance
        open={showTermsAcceptance}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    </>
  );
}
