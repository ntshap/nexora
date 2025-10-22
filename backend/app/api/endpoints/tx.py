"""Transaction endpoints."""
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.db import get_session
from app.schemas.tx import TransactionCreate
from app.services import tx_service

router = APIRouter(prefix="/tx", tags=["transactions"])


@router.post("/deposit")
async def deposit(payload: TransactionCreate, session: Session = Depends(get_session)) -> dict[str, str]:
    tx_service.record_deposit(
        session,
        address=payload.address.lower(),
        amount=float(payload.amount),
        vault=payload.vault,
        tx_hash=payload.tx_hash,
    )
    return {"status": "logged", "type": "deposit", "tx_hash": payload.tx_hash or ""}


@router.post("/withdraw")
async def withdraw(payload: TransactionCreate, session: Session = Depends(get_session)) -> dict[str, str]:
    tx_service.record_withdrawal(
        session,
        address=payload.address.lower(),
        amount=float(payload.amount),
        vault=payload.vault,
        tx_hash=payload.tx_hash,
    )
    return {"status": "logged", "type": "withdraw", "tx_hash": payload.tx_hash or ""}
