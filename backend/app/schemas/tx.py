"""Transaction schemas."""

from datetime import datetime

from pydantic import BaseModel, Field, condecimal


class TransactionCreate(BaseModel):
    address: str
    amount: condecimal(ge=0)
    vault: str = Field(default="SynthVault")
    tx_hash: str | None = Field(default=None)


class TransactionRecord(TransactionCreate):
    tx_type: str
    timestamp: datetime
