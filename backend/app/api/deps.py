"""Dependency injection for FastAPI."""
from collections.abc import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.user import User
from app.core.config import settings

security = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    """Database session dependency."""
    yield from get_session()


def get_config() -> dict[str, str]:
    """Configuration dependency placeholder."""
    return {}


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Get current authenticated user from JWT token.
    In production, validate JWT and extract user info.
    """
    token = credentials.credentials
    
    # TODO: Implement proper JWT validation
    # For now, extract wallet from token (mock implementation)
    wallet = token  # In production: decode JWT
    
    user = db.exec(
        select(User).where(User.wallet_address == wallet)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verify that current user has admin privileges.
    In production, check against admin whitelist or role.
    """
    # TODO: Implement proper admin role check
    # For now, check against environment variable admin list
    admin_wallets_str = settings.admin_wallets
    admin_wallets = (
        admin_wallets_str.split(",") if admin_wallets_str else []
    )
    
    if current_user.wallet_address.lower() not in [
        w.lower().strip() for w in admin_wallets
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    return current_user
