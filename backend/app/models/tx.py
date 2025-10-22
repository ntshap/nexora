"""Transaction log model."""

from datetime import datetime

from sqlmodel import Field, SQLModel


class TransactionLog(SQLModel, table=True):
    """Persisted transaction log for deposits/withdrawals."""

    id: int | None = Field(default=None, primary_key=True)
    address: str = Field(index=True)
    tx_type: str = Field(index=True, max_length=32)
    amount: float = Field(default=0.0)
    vault: str = Field(default="SynthVault")
    tx_hash: str | None = Field(default=None, index=True, max_length=80)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
