"""User model for tracking wallet addresses and preferences."""

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """User model representing wallet addresses."""
    
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    wallet_address: str = Field(index=True, unique=True, max_length=42)
    risk_profile: Optional[str] = Field(default=None, max_length=20)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        schema_extra = {
            "example": {
                "wallet_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "risk_profile": "balanced",
            }
        }
