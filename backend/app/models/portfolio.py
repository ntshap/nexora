"""Portfolio domain objects."""

from dataclasses import dataclass, field
from typing import List


@dataclass(slots=True)
class VaultPosition:
    vault: str
    shares: float
    asset_value: float
    apy: float


@dataclass(slots=True)
class Portfolio:
    owner: str
    total_value: float
    positions: List[VaultPosition] = field(default_factory=list)
    history: List[dict] = field(default_factory=list)
