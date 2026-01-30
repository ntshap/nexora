"""Transaction endpoints."""
from fastapi import APIRouter, Depends, Request, HTTPException, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlmodel import Session

from app.core.db import get_session
from app.core.logger import logger
from app.schemas.tx import TransactionCreate
from app.services import tx_service

router = APIRouter(prefix="/tx", tags=["transactions"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/deposit")
@limiter.limit("20/minute")
async def deposit(
    request: Request,
    payload: TransactionCreate,
    session: Session = Depends(get_session)
) -> dict[str, str]:
    try:
        tx_service.record_deposit(
            session,
            address=payload.address.lower(),
            amount=float(payload.amount),
            vault=payload.vault,
            tx_hash=payload.tx_hash,
        )
        logger.info(
            "Deposit recorded",
            address=payload.address,
            amount=payload.amount,
            tx_hash=payload.tx_hash
        )
        return {
            "status": "logged",
            "type": "deposit",
            "tx_hash": payload.tx_hash or ""
        }
    except Exception as e:
        logger.error("Failed to record deposit", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record transaction"
        )


@router.post("/withdraw")
@limiter.limit("20/minute")
async def withdraw(
    request: Request,
    payload: TransactionCreate,
    session: Session = Depends(get_session)
) -> dict[str, str]:
    try:
        tx_service.record_withdrawal(
            session,
            address=payload.address.lower(),
            amount=float(payload.amount),
            vault=payload.vault,
            tx_hash=payload.tx_hash,
        )
        logger.info(
            "Withdrawal recorded",
            address=payload.address,
            amount=payload.amount,
            tx_hash=payload.tx_hash
        )
        return {
            "status": "logged",
            "type": "withdraw",
            "tx_hash": payload.tx_hash or ""
        }
    except Exception as e:
        logger.error("Failed to record withdrawal", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record transaction"
        )
