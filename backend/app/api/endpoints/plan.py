"""Plan endpoints."""
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas.plan import PlanRequest, PlanResponse
from app.services.plan_service import generate_plan

router = APIRouter(prefix="/plan", tags=["plan"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/", response_model=PlanResponse)
@limiter.limit("10/minute")
async def create_plan(request: Request, plan_request: PlanRequest) -> PlanResponse:
    """Generate tailored plans."""
    return generate_plan(plan_request)
