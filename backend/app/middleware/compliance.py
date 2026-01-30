"""Middleware for legal compliance and security."""

import httpx
from fastapi import Request
from fastapi.responses import JSONResponse
from typing import Callable
import logging

from app.models.legal import GeoRestriction, AuditLog
from app.core.db import get_session

logger = logging.getLogger(__name__)

# Restricted countries (OFAC sanctions + high-risk jurisdictions)
BLOCKED_COUNTRIES = [
    "US",  # United States (securities law concerns)
    "CN",  # China
    "KP",  # North Korea
    "IR",  # Iran
    "SY",  # Syria
    "CU",  # Cuba
    "VE",  # Venezuela
    "BY",  # Belarus
    "MM",  # Myanmar
    "ZW",  # Zimbabwe
]


async def geo_blocking_middleware(request: Request, call_next: Callable):
    """Block requests from restricted countries."""

    # Get IP address
    ip = request.client.host if request.client else "unknown"

    # Skip for localhost/testing
    if ip in ["127.0.0.1", "::1", "localhost"]:
        return await call_next(request)

    # Skip for health checks
    if request.url.path in ["/health", "/api/health"]:
        return await call_next(request)

    try:
        # Get country from IP using ipapi.co (free tier: 1000/day)
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"https://ipapi.co/{ip}/country/")

            if response.status_code == 200:
                country_code = response.text.strip()

                # Check if country is blocked
                if country_code in BLOCKED_COUNTRIES:
                    # Log the attempt
                    try:
                        db = next(get_session())
                        restriction = GeoRestriction(
                            ip_address=ip,
                            country_code=country_code,
                            path=str(request.url.path),
                            user_agent=request.headers.get("user-agent"),
                        )
                        db.add(restriction)
                        db.commit()
                    except Exception as e:
                        logger.error(f"Failed to log geo restriction: {e}")

                    # Return 451 Unavailable For Legal Reasons
                    return JSONResponse(
                        status_code=451,
                        content={
                            "error": "Service unavailable in your region",
                            "country": country_code,
                            "message": (
                                "NEXORA is not available in your country "
                                "due to regulatory restrictions. "
                                "We apologize for the inconvenience."
                            ),
                        },
                    )

    except httpx.TimeoutException:
        # Timeout - fail open (allow request)
        logger.warning(f"Geolocation timeout for IP {ip}")
    except Exception as e:
        # Other errors - fail open but log
        logger.error(f"Geolocation check failed for IP {ip}: {e}")

    return await call_next(request)


async def audit_logging_middleware(request: Request, call_next: Callable):
    """Log all requests for audit trail."""

    # Process request
    response = await call_next(request)

    # Log sensitive endpoints only
    sensitive_paths = [
        "/api/v1/admin/",
        "/api/v1/legal/",
        "/api/vault/deposit",
        "/api/vault/withdraw",
        "/api/user/delete",
        "/api/gdpr/",
    ]

    should_log = any(
        request.url.path.startswith(path) for path in sensitive_paths
    )

    if should_log:
        try:
            db = next(get_session())

            # Extract wallet address from auth header if present
            wallet_address = None
            auth_header = request.headers.get("authorization")
            if auth_header:
                # Extract from JWT or signature
                # This is simplified - implement based on your auth scheme
                pass

            # Determine action type from method and path
            action_type = f"{request.method}_{request.url.path.split('/')[-1]}"
            
            audit_log = AuditLog(
                wallet_address=wallet_address,
                action_type=action_type,  # FIXED: action -> action_type
                resource_type="api",
                endpoint=str(request.url.path),
                method=request.method,
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent"),
                status="success" if response.status_code < 400 else "failed",
            )
            db.add(audit_log)
            db.commit()

        except Exception as e:
            logger.error(f"Failed to log audit trail: {e}")

    return response


def get_client_ip(request: Request) -> str:
    """Extract real client IP from request headers."""
    # Check X-Forwarded-For (set by proxies/load balancers)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Get first IP in chain
        return forwarded.split(",")[0].strip()

    # Check X-Real-IP (set by nginx)
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    # Fallback to direct client IP
    return request.client.host if request.client else "unknown"
