"""Risk preference endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.db import get_session
from app.schemas.preferences import RiskPreferencePayload, RiskPreferenceResponse
from app.services.preferences_service import get_preference, upsert_preference

router = APIRouter(prefix="/preferences", tags=["preferences"])


@router.get("/{address}", response_model=RiskPreferenceResponse)
async def read_preference(address: str, session: Session = Depends(get_session)) -> RiskPreferenceResponse:
    record = get_preference(session, address.lower())
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Preference not found")
    return RiskPreferenceResponse.from_orm(record)


@router.put("/{address}", response_model=RiskPreferenceResponse)
async def update_preference(
    address: str, payload: RiskPreferencePayload, session: Session = Depends(get_session)
) -> RiskPreferenceResponse:
    record = upsert_preference(session, address.lower(), payload)
    return RiskPreferenceResponse.from_orm(record)
