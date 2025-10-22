export type RiskProfile = "conservative" | "balanced" | "aggressive";

export interface Plan {
  id: string;
  name: string;
  risk: RiskProfile;
}
