'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface ComplianceStatus {
  hasAcceptedTerms: boolean;
  isAgeVerified: boolean;
  isLoading: boolean;
  needsCompliance: boolean;
}

const STORAGE_KEY = 'nexora_compliance_';

export function useCompliance() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<ComplianceStatus>({
    hasAcceptedTerms: false,
    isAgeVerified: false,
    isLoading: true,
    needsCompliance: true,
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setStatus({
        hasAcceptedTerms: false,
        isAgeVerified: false,
        isLoading: false,
        needsCompliance: true,
      });
      return;
    }

    // Check localStorage first for instant feedback
    const storageKey = `${STORAGE_KEY}${address}`;
    const cached = localStorage.getItem(storageKey);
    
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        // If cached data says compliant, use it immediately
        if (cachedData.accepted) {
          setStatus({
            hasAcceptedTerms: true,
            isAgeVerified: cachedData.is_age_verified || true,
            isLoading: false,
            needsCompliance: false,
          });
          return; // Skip backend check if localStorage says we're good
        }
      } catch (e) {
        console.error('Failed to parse cached compliance:', e);
      }
    }

    // If no valid cache, check backend
    const checkStatus = async () => {
      if (!address) return;

      try {
        setStatus((prev) => ({ ...prev, isLoading: true }));

        const response = await fetch(
          `http://localhost:8000/api/v1/legal/check-acceptance/${address}`
        );
        const data = await response.json();

        const newStatus = {
          hasAcceptedTerms: data.accepted || false,
          isAgeVerified: data.is_age_verified || false,
          isLoading: false,
          needsCompliance: !data.accepted,
        };

        setStatus(newStatus);

        // Cache the result in localStorage
        if (data.accepted) {
          const storageKey = `${STORAGE_KEY}${address}`;
          localStorage.setItem(storageKey, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to check compliance status:', error);
        setStatus({
          hasAcceptedTerms: false,
          isAgeVerified: false,
          isLoading: false,
          needsCompliance: true,
        });
      }
    };

    checkStatus();
  }, [address, isConnected]);

  const checkComplianceStatus = async () => {
    if (!address) return;

    try {
      setStatus((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch(
        `http://localhost:8000/api/v1/legal/check-acceptance/${address}`
      );
      const data = await response.json();

      const newStatus = {
        hasAcceptedTerms: data.accepted || false,
        isAgeVerified: data.is_age_verified || false,
        isLoading: false,
        needsCompliance: !data.accepted, // Needs compliance if NOT accepted
      };

      setStatus(newStatus);

      // Cache the result in localStorage
      if (data.accepted) {
        const storageKey = `${STORAGE_KEY}${address}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to check compliance status:', error);
      setStatus({
        hasAcceptedTerms: false,
        isAgeVerified: false,
        isLoading: false,
        needsCompliance: true,
      });
    }
  };

  const markAsCompliant = () => {
    if (!address) return;

    const complianceData = {
      accepted: true,
      is_age_verified: true,
      acceptance_date: new Date().toISOString(),
    };

    // Save to localStorage immediately
    const storageKey = `${STORAGE_KEY}${address}`;
    localStorage.setItem(storageKey, JSON.stringify(complianceData));

    // Update state
    setStatus({
      hasAcceptedTerms: true,
      isAgeVerified: true,
      isLoading: false,
      needsCompliance: false,
    });
  };

  return {
    ...status,
    checkCompliance: checkComplianceStatus,
    markAsCompliant,
  };
}
