"""Portfolio endpoints."""
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.db import get_session
from app.schemas.portfolio import PortfolioSchema
from app.services.portfolio_service import build_portfolio

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("/{user_address}", response_model=PortfolioSchema)
async def get_portfolio(user_address: str, session: Session = Depends(get_session)) -> PortfolioSchema:
    return build_portfolio(session, address=user_address.lower())
