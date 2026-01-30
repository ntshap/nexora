"""Portfolio endpoints."""
from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlmodel import Session

from app.core.db import get_session
from app.schemas.portfolio import PortfolioSchema
from app.services.portfolio_service import build_portfolio

router = APIRouter(prefix="/portfolio", tags=["portfolio"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/{user_address}", response_model=PortfolioSchema)
@limiter.limit("30/minute")
async def get_portfolio(
    request: Request,
    user_address: str,
    session: Session = Depends(get_session)
) -> PortfolioSchema:
    return build_portfolio(session, address=user_address.lower())
