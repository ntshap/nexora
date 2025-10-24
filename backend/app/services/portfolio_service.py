"""Portfolio service building dashboard responses."""

from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal
from typing import List

from sqlmodel import Session, select
from web3 import Web3

from app.core.vault_client import ZERO_ADDRESS, get_vault_contract
from app.models.portfolio import Portfolio, VaultPosition
from app.models.tx import TransactionLog
from app.schemas.portfolio import ActivityItem, PortfolioSchema, VaultPositionSchema

DECIMAL_FACTOR = Decimal(10) ** 18


def _to_token_amount(raw_value: int) -> float:
    if raw_value <= 0:
        return 0.0
    return float(Decimal(raw_value) / DECIMAL_FACTOR)


def _positions_from_chain(address: str) -> List[VaultPosition]:
    contract = get_vault_contract()
    if contract is None or not address or address == ZERO_ADDRESS:
        return []

    if not Web3.is_address(address):
        return []

    try:
        checksum = Web3.to_checksum_address(address)
    except ValueError:
        return []

    try:
        raw_shares = contract.functions.balanceOf(checksum).call()
        if int(raw_shares) == 0:
            return []
        raw_assets = contract.functions.convertToAssets(int(raw_shares)).call()
        raw_total_assets = contract.functions.totalAssets().call()
        raw_total_supply = contract.functions.totalSupply().call()
    except Exception:
        return []

    shares = _to_token_amount(int(raw_shares))
    asset_value = _to_token_amount(int(raw_assets))
    apy = 0.0
    if raw_total_supply:
        try:
            ratio = Decimal(raw_total_assets) / Decimal(raw_total_supply)
            apy = float(max(ratio - Decimal(1), Decimal(0)))
        except Exception:
            apy = 0.0

    return [
        VaultPosition(
            vault="SynthVault",
            shares=shares,
            asset_value=asset_value,
            apy=apy,
        )
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
    positions = _positions_from_chain(address)
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
        timestamp=datetime.now(UTC),
    )
    session.add(record)
    session.commit()
