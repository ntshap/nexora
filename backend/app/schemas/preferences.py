"""Schemas for risk preference persistence."""

from datetime import datetime

from pydantic import BaseModel, Field


class RiskPreferencePayload(BaseModel):
    risk_level: str = Field(regex="^(low|medium|high)$")
    risk_score: int = Field(ge=0)
    horizon_months: int = Field(ge=1)
    stablecoin_preference: str = Field(default="USDC", max_length=16)


class RiskPreferenceResponse(RiskPreferencePayload):
    address: str
    updated_at: datetime

    class Config:
        orm_mode = True
