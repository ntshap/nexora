"""Plan endpoints."""
from fastapi import APIRouter

from app.schemas.plan import PlanRequest, PlanResponse
from app.services.plan_service import generate_plan

router = APIRouter(prefix="/plan", tags=["plan"])


@router.post("/", response_model=PlanResponse)
async def create_plan(request: PlanRequest) -> PlanResponse:
    """Generate tailored plans."""
    return generate_plan(request)
