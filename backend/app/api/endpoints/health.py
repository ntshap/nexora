"""Health endpoint."""
from fastapi import APIRouter, status
from sqlalchemy import text
from sqlmodel import Session

from app.core.config import get_settings
from app.core.db import engine
from app.core.vault_client import _get_provider

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str | dict]:
    """Basic health check."""
    return {"status": "ok"}


@router.get("/health/detailed", status_code=status.HTTP_200_OK)
async def detailed_health() -> dict[str, str | dict]:
    """Detailed health check with dependencies."""
    settings = get_settings()
    checks = {
        "api": "ok",
        "database": "unknown",
        "rpc": "unknown",
    }
    
    # Check database
    try:
        with Session(engine) as session:
            session.exec(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {str(e)[:50]}"
    
    # Check RPC connection
    try:
        provider = _get_provider()
        if provider and provider.is_connected():
            checks["rpc"] = "ok"
        else:
            checks["rpc"] = "disconnected"
    except Exception as e:
        checks["rpc"] = f"error: {str(e)[:50]}"
    
    # Determine overall status
    all_ok = all(v == "ok" for v in checks.values())
    
    return {
        "status": "healthy" if all_ok else "degraded",
        "environment": settings.environment,
        "checks": checks,
    }
