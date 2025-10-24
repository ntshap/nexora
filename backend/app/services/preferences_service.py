"""Service helpers for risk preference persistence."""

from datetime import UTC, datetime

from sqlmodel import Session, select

from app.models.preferences import RiskPreference
from app.schemas.preferences import RiskPreferencePayload


def get_preference(session: Session, address: str) -> RiskPreference | None:
    return session.exec(select(RiskPreference).where(RiskPreference.address == address)).first()


def _timestamp() -> datetime:
    return datetime.now(UTC)


def upsert_preference(session: Session, address: str, payload: RiskPreferencePayload) -> RiskPreference:
    record = get_preference(session, address)
    if record is None:
        record = RiskPreference(address=address, updated_at=_timestamp(), **payload.dict())
        session.add(record)
    else:
        for key, value in payload.dict().items():
            setattr(record, key, value)
        record.updated_at = _timestamp()
        session.add(record)
    session.commit()
    session.refresh(record)
    return record
