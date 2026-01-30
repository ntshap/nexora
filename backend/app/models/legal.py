"""Legal and compliance models using SQLModel."""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Column, JSON


class TermsAcceptance(SQLModel, table=True):
    """Track user acceptance of Terms of Service."""
    
    __tablename__ = "terms_acceptances"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(
        default=None,
        foreign_key="users.id",
    )
    wallet_address: str = Field(index=True, max_length=42)
    
    # Terms details
    terms_version: str = Field(default="1.0.0", max_length=20)
    privacy_version: str = Field(default="1.0.0", max_length=20)
    
    # Age verification
    age_verified: bool = Field(default=False)
    birthdate: Optional[datetime] = Field(default=None)
    
    # Acceptance checkboxes
    terms_accepted: bool = Field(default=False)
    privacy_accepted: bool = Field(default=False)
    risk_accepted: bool = Field(default=False)
    
    # Metadata
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)
    accepted_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Tracking
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AuditLog(SQLModel, table=True):
    """Comprehensive audit trail for all sensitive actions."""
    
    __tablename__ = "audit_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # User info
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    wallet_address: Optional[str] = Field(
        default=None,
        index=True,
        max_length=42,
    )
    
    # Action details
    action_type: str = Field(
        index=True,
        max_length=50,
    )  # deposit, withdraw, accept_terms, etc
    resource_type: str = Field(
        max_length=50,
    )  # user, transaction, legal, etc
    resource_id: Optional[str] = Field(default=None, max_length=255)
    
    # Request info
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)
    endpoint: Optional[str] = Field(default=None, max_length=255)
    method: Optional[str] = Field(default=None, max_length=10)
    
    # Additional data
    additional_data: Optional[dict] = Field(
        default=None,
        sa_column=Column(JSON),
    )
    
    # Result
    status: str = Field(
        max_length=20,
    )  # success, failure, error
    error_message: Optional[str] = Field(default=None)
    
    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
    )


class GeoRestriction(SQLModel, table=True):
    """Log blocked access attempts from restricted countries."""
    
    __tablename__ = "geo_restrictions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Location info
    ip_address: str = Field(index=True, max_length=45)
    country_code: str = Field(index=True, max_length=2)
    country_name: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    
    # Request info
    endpoint: str = Field(max_length=255)
    user_agent: Optional[str] = Field(default=None, max_length=500)
    
    # Wallet if available
    wallet_address: Optional[str] = Field(default=None, max_length=42)
    
    # Timestamp
    blocked_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
    )


class CircuitBreakerEvent(SQLModel, table=True):
    """Track circuit breaker triggers and system pauses."""
    
    __tablename__ = "circuit_breaker_events"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Event details
    event_type: str = Field(
        index=True,
        max_length=50,
    )  # high_error_rate, tvl_drop, gas_spike, etc
    rule_name: str = Field(max_length=100)
    
    # Metrics
    metric_value: float = Field(default=0.0)
    threshold: float = Field(default=0.0)
    
    # Action taken
    action_taken: str = Field(
        max_length=255,
    )  # pause_system, alert_team, etc
    auto_triggered: bool = Field(
        default=False,
    )  # Was it automatic or manual?
    
    # Resolution
    resolved: bool = Field(default=False, index=True)
    resolved_at: Optional[datetime] = Field(default=None)
    resolved_by: Optional[str] = Field(
        default=None,
        max_length=42,
    )  # Admin wallet
    
    # Metadata
    additional_data: Optional[dict] = Field(
        default=None,
        sa_column=Column(JSON),
    )
    
    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
    )
