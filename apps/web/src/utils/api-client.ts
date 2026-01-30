import { apiFetch, ApiError } from "@/utils/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type RiskPreferenceResponse = {
  address: string;
  risk_level: string;
  risk_score: number;
  horizon_months: number;
  stablecoin_preference: string;
};

export const fetchRiskPreference = async (address: string) => {
  try {
    return await apiFetch<RiskPreferenceResponse>(`${API_BASE}/preferences/${address}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export type PreferencePayload = {
  risk_level: string;
  risk_score: number;
  horizon_months: number;
  stablecoin_preference: string;
};

export const updateRiskPreference = (address: string, payload: PreferencePayload) =>
  apiFetch<RiskPreferenceResponse>(`${API_BASE}/preferences/${address}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export type PlanResponse = {
  plans: Array<{
    name: string;
    risk_level: string;
    est_apy: number;
    allocations: Record<string, number>;
    rationale: string;
  }>;
};

export const generatePlan = (riskScore: number, horizon: number, stablecoin: string) =>
  apiFetch<PlanResponse>(`${API_BASE}/plan/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ risk_score: riskScore, horizon_months: horizon, stablecoin_preference: stablecoin }),
  });

export type PortfolioResponse = {
  owner: string;
  total_value: number;
  positions: Array<{
    vault: string;
    shares: number;
    asset_value: number;
    apy: number;
  }>;
};

export const fetchPortfolio = (address: string) => apiFetch<PortfolioResponse>(`${API_BASE}/portfolio/${address}`);

export { ApiError };
