"""Portfolio service building dashboard responses."""

from datetime import datetime
from typing import List

from sqlmodel import Session, select

from app.models.portfolio import Portfolio, VaultPosition
from app.models.tx import TransactionLog
from app.schemas.portfolio import ActivityItem, PortfolioSchema, VaultPositionSchema


def _positions_stub(address: str) -> List[VaultPosition]:
    # Placeholder: real implementation would query on-chain data via viem.
    base_value = 1200 if address else 0
    return [
        VaultPosition(vault="SynthVault", shares=23.45, asset_value=base_value, apy=0.085),
    ]


def _history(session: Session, address: str) -> List[ActivityItem]:
    records = session.exec(
        select(TransactionLog).where(TransactionLog.address == address).order_by(TransactionLog.timestamp.desc())
    ).all()
    return [
        ActivityItem(
            tx_type=record.tx_type,
            amount=record.amount,
            vault=record.vault,
            tx_hash=record.tx_hash,
            timestamp=record.timestamp,
        )
        for record in records
    ]


def build_portfolio(session: Session, address: str) -> PortfolioSchema:
    positions = _positions_stub(address)
    history = _history(session, address)
    total_value = sum(position.asset_value for position in positions)
    Portfolio(owner=address, total_value=total_value, positions=positions)
    return PortfolioSchema(
        owner=address,
        total_value=total_value,
        positions=[
            VaultPositionSchema(
                vault=pos.vault,
                shares=pos.shares,
                asset_value=pos.asset_value,
                apy=pos.apy,
            )
            for pos in positions
        ],
        history=history,
    )


def log_activity(session: Session, address: str, amount: float, vault: str, tx_type: str, tx_hash: str | None) -> None:
    record = TransactionLog(
        address=address,
        amount=float(amount),
        vault=vault,
        tx_type=tx_type,
        tx_hash=tx_hash,
        timestamp=datetime.utcnow(),
    )
    session.add(record)
    session.commit()
