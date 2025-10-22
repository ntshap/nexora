"""Plan service implementing rule-based strategy selection."""

from collections.abc import Sequence
from typing import Dict, List

from app.models.plan import PlanTemplate
from app.schemas.plan import PlanOption, PlanRequest, PlanResponse

PLAN_LIBRARY: Sequence[PlanTemplate] = (
    PlanTemplate(
        name="Conservative",
        risk_level="low",
        base_apy=0.045,
        allocations={"Stable Yield Vault": 0.7, "ETH Staking Notes": 0.2, "Liquidity Buffer": 0.1},
    ),
    PlanTemplate(
        name="Balanced",
        risk_level="medium",
        base_apy=0.085,
        allocations={"Stable Yield Vault": 0.5, "ETH Staking Notes": 0.35, "Momentum Strategies": 0.15},
    ),
    PlanTemplate(
        name="Growth",
        risk_level="high",
        base_apy=0.13,
        allocations={"Momentum Strategies": 0.5, "ETH Staking Notes": 0.3, "Creative Economy Index": 0.2},
    ),
)


def _adjusted_apy(base_apy: float, risk_score: int, horizon_months: int) -> float:
    """Convert base APY with horizon/risk scaling."""
    horizon_bonus = min(horizon_months / 120, 0.25)
    risk_multiplier = 1 + (risk_score - 5) * 0.015
    return round((base_apy * risk_multiplier) + horizon_bonus, 4)


def _rationale(plan: PlanTemplate, risk_score: int) -> str:
    if plan.risk_level == "low":
        return "Prioritises capital preservation with stablecoin-heavy positions."
    if plan.risk_level == "medium":
        return "Balances stable yield with ETH staking exposure suited to moderate risk scores."
    if plan.risk_level == "high":
        return "Targets higher upside via momentum strategies and creative economy index pools."
    return "Diversified allocation."


def generate_plan(request: PlanRequest) -> PlanResponse:
    """Create the three-strategy response for the frontend."""
    plans: List[PlanOption] = []
    for template in PLAN_LIBRARY:
        est_apy = _adjusted_apy(template.base_apy, request.risk_score, request.horizon_months)
        allocations: Dict[str, float] = template.allocations.copy()
        stablecoin_key = next(iter(allocations))
        allocations[stablecoin_key] = round(allocations[stablecoin_key] * 0.95, 2)
        plans.append(
            PlanOption(
                name=template.name,
                risk_level=template.risk_level,
                est_apy=est_apy,
                allocations=allocations,
                rationale=_rationale(template, request.risk_score),
            )
        )
    return PlanResponse(plans=plans)
