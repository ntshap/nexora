"""Schemas for investment plan interactions."""

from typing import Dict, List

from pydantic import BaseModel, Field, conint, confloat


class PlanRequest(BaseModel):
    """Payload received from clients when requesting plans."""

    risk_score: conint(ge=1, le=10) = Field(..., description="User risk tolerance score (1-10).")
    horizon_months: conint(ge=1, le=120) = Field(..., description="Investment horizon in months.")
    stablecoin_preference: str = Field(default="USDC", description="Preferred stablecoin (USDC/DAI).")


class PlanOption(BaseModel):
    """Single plan representation."""

    name: str
    risk_level: str
    est_apy: confloat(ge=0)
    allocations: Dict[str, float]
    rationale: str


class PlanResponse(BaseModel):
    """Response model for plan generation."""

    plans: List[PlanOption]
