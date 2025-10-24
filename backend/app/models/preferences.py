"""Risk preference persistence models."""

from datetime import datetime

from sqlmodel import Field, SQLModel


class RiskPreference(SQLModel, table=True):
    """Stores the latest risk preference per wallet address."""

    id: int | None = Field(default=None, primary_key=True)
    address: str = Field(index=True, unique=True, max_length=64)
    risk_level: str = Field(max_length=16)
    risk_score: int = Field(default=0, ge=0)
    horizon_months: int = Field(default=12, ge=1)
    stablecoin_preference: str = Field(default="USDC", max_length=16)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
