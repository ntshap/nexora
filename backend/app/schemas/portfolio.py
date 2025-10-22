"""Portfolio schemas."""

from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class VaultPositionSchema(BaseModel):
    vault: str
    shares: float = Field(ge=0)
    asset_value: float = Field(ge=0)
    apy: float = Field(ge=0)


class ActivityItem(BaseModel):
    tx_type: str
    amount: float
    vault: str
    tx_hash: str | None = None
    timestamp: datetime


class PortfolioSchema(BaseModel):
    owner: str
    total_value: float
    positions: List[VaultPositionSchema]
    history: List[ActivityItem]
