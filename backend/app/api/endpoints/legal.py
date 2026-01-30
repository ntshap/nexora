"""API endpoints for legal compliance and GDPR."""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from datetime import datetime
import logging

from app.api.deps import get_db
from app.models.user import User
from app.models.legal import TermsAcceptance, AuditLog
from app.schemas.legal import (
    TermsAcceptanceCreate,
    TermsAcceptanceResponse,
    GDPRExportResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["legal"])


@router.post("/accept-terms", response_model=TermsAcceptanceResponse)
async def accept_terms(
    acceptance: TermsAcceptanceCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """Record user acceptance of Terms of Service and Privacy Policy."""

    # Check if user exists
    user = (
        db.query(User)
        .filter(User.wallet_address == acceptance.wallet_address)
        .first()
    )

    if not user:
        # Create new user
        user = User(
            wallet_address=acceptance.wallet_address,
            email=acceptance.email,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check if already accepted current version
    existing = (
        db.query(TermsAcceptance)
        .filter(
            TermsAcceptance.user_id == user.id,
            TermsAcceptance.terms_version == acceptance.terms_version,
            TermsAcceptance.privacy_version == acceptance.privacy_version,
        )
        .first()
    )

    if existing:
        return {
            "accepted": True,
            "message": "Terms already accepted",
            "acceptance": existing,
        }

    # Create new acceptance record
    terms_acceptance = TermsAcceptance(
        user_id=user.id,
        wallet_address=acceptance.wallet_address,
        terms_version=acceptance.terms_version,
        privacy_version=acceptance.privacy_version,
        is_age_verified=acceptance.is_age_verified,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    db.add(terms_acceptance)

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        wallet_address=user.wallet_address,
        action_type="accept_terms",
        resource_type="terms",
        status="success",
        additional_data={
            "terms_version": acceptance.terms_version,
            "privacy_version": acceptance.privacy_version,
            "age_verified": acceptance.is_age_verified,
        },
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(audit)

    db.commit()
    db.refresh(terms_acceptance)

    return {
        "accepted": True,
        "message": "Terms accepted successfully",
        "acceptance": terms_acceptance,
    }


@router.get("/check-acceptance/{wallet_address}")
async def check_terms_acceptance(
    wallet_address: str,
    db: Session = Depends(get_db),
):
    """Check if user has accepted current terms."""

    CURRENT_TERMS_VERSION = "1.0.0"
    CURRENT_PRIVACY_VERSION = "1.0.0"

    user = (
        db.query(User).filter(User.wallet_address == wallet_address).first()
    )

    if not user:
        return {
            "accepted": False,
            "needs_acceptance": True,
            "required_versions": {
                "terms": CURRENT_TERMS_VERSION,
                "privacy": CURRENT_PRIVACY_VERSION,
            },
        }

    # Check for acceptance
    acceptance = (
        db.query(TermsAcceptance)
        .filter(
            TermsAcceptance.user_id == user.id,
            TermsAcceptance.terms_version == CURRENT_TERMS_VERSION,
            TermsAcceptance.privacy_version == CURRENT_PRIVACY_VERSION,
        )
        .first()
    )

    if acceptance:
        return {
            "accepted": True,
            "needs_acceptance": False,
            "acceptance_date": acceptance.accepted_at,
            "is_age_verified": acceptance.age_verified,
        }

    return {
        "accepted": False,
        "needs_acceptance": True,
        "required_versions": {
            "terms": CURRENT_TERMS_VERSION,
            "privacy": CURRENT_PRIVACY_VERSION,
        },
    }


@router.get("/gdpr/export/{wallet_address}", response_model=GDPRExportResponse)
async def export_user_data(
    wallet_address: str,
    db: Session = Depends(get_db),
):
    """Export all user data (GDPR Right to Access)."""

    user = (
        db.query(User).filter(User.wallet_address == wallet_address).first()
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Gather all user data
    data = {
        "user": {
            "wallet_address": user.wallet_address,
            "email": user.email,
            "created_at": (
                user.created_at.isoformat() if user.created_at else None
            ),
        },
        "terms_acceptances": [
            {
                "terms_version": ta.terms_version,
                "privacy_version": ta.privacy_version,
                "accepted_at": ta.accepted_at.isoformat(),
                "age_verified": ta.is_age_verified,
            }
            for ta in user.terms_acceptances
        ],
        "transactions": [
            {
                "hash": tx.tx_hash,
                "type": tx.tx_type,
                "amount": str(tx.amount),
                "status": tx.status,
                "created_at": tx.created_at.isoformat(),
            }
            for tx in user.transactions
        ],
        "preferences": (
            {
                "risk_score": user.preferences.risk_score,
                "risk_tolerance": user.preferences.risk_tolerance,
            }
            if hasattr(user, "preferences") and user.preferences
            else None
        ),
    }

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        wallet_address=user.wallet_address,
        action_type="gdpr_export",
        resource_type="user_data",
        status="success",
    )
    db.add(audit)
    db.commit()

    return {
        "data": data,
        "exported_at": datetime.utcnow().isoformat(),
        "format": "json",
    }


@router.delete("/gdpr/delete-account/{wallet_address}")
async def delete_user_account(
    wallet_address: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """Delete user account (GDPR Right to be Forgotten)."""

    user = (
        db.query(User).filter(User.wallet_address == wallet_address).first()
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if user has active positions
    # TODO: Implement check for active vault positions
    # For now, allow deletion

    # Anonymize user data (don't fully delete for audit trail)
    old_data = {
        "wallet": user.wallet_address,
        "email": user.email,
    }

    user.email = None
    user.wallet_address = f"DELETED_{user.id}"

    # Audit log before anonymization
    audit = AuditLog(
        user_id=user.id,
        wallet_address=wallet_address,  # Use original address
        action_type="gdpr_delete_account",
        resource_type="user",
        status="success",
        additional_data=old_data,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(audit)

    db.commit()

    return {
        "deleted": True,
        "message": "Account anonymized successfully",
        "deleted_at": datetime.utcnow().isoformat(),
    }
