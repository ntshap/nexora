"""Pydantic schemas for legal and compliance endpoints."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any


class TermsAcceptanceCreate(BaseModel):
    """Schema for accepting terms of service."""

    wallet_address: str = Field(..., min_length=42, max_length=42)
    email: Optional[EmailStr] = None
    terms_version: str = Field(default="1.0.0")
    privacy_version: str = Field(default="1.0.0")
    is_age_verified: bool = Field(default=False)


class TermsAcceptanceResponse(BaseModel):
    """Response after accepting terms."""

    accepted: bool
    message: str
    acceptance: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class GDPRExportResponse(BaseModel):
    """Response for GDPR data export."""

    data: Dict[str, Any]
    exported_at: str
    format: str = "json"


class AuditLogCreate(BaseModel):
    """Schema for creating audit log entry."""

    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    old_value: Optional[Dict[str, Any]] = None
    new_value: Optional[Dict[str, Any]] = None


class CircuitBreakerEventCreate(BaseModel):
    """Schema for circuit breaker event."""

    event_type: str
    severity: str
    metrics: Optional[Dict[str, Any]] = None
    action_taken: Optional[str] = None
    auto_triggered: bool = False
