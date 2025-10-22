"""Plan templates and structures."""

from dataclasses import dataclass
from typing import Dict


@dataclass(slots=True)
class PlanTemplate:
    """Defines ratios per strategy."""

    name: str
    risk_level: str
    base_apy: float
    allocations: Dict[str, float]
