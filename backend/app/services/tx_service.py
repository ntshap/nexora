"""Transaction service for deposit/withdraw logging."""

from sqlmodel import Session

from app.services.portfolio_service import log_activity


def record_deposit(session: Session, address: str, amount: float, vault: str, tx_hash: str | None) -> None:
    log_activity(session, address=address, amount=amount, vault=vault, tx_type="deposit", tx_hash=tx_hash)


def record_withdrawal(session: Session, address: str, amount: float, vault: str, tx_hash: str | None) -> None:
    log_activity(session, address=address, amount=amount, vault=vault, tx_type="withdraw", tx_hash=tx_hash)
