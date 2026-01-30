"""FastAPI application initialisation."""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.endpoints import (
    health,
    plan,
    portfolio,
    preferences,
    tx,
    legal,
    admin,
)
from app.core.config import get_settings
from app.core.db import init_db
from app.core.logger import logger
from app.middleware.compliance import (
    geo_blocking_middleware,
    audit_logging_middleware,
)

settings = get_settings()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

init_db()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("NEXORA API started", environment=settings.environment)
    try:
        yield
    finally:
        logger.info("NEXORA API shut down")


app = FastAPI(
    title="NEXORA API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - must be first middleware (added last)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    hsts = "max-age=31536000; includeSubDomains"
    response.headers["Strict-Transport-Security"] = hsts
    return response


# Compliance middleware
@app.middleware("http")
async def geo_blocking(request: Request, call_next):
    return await geo_blocking_middleware(request, call_next)


@app.middleware("http")
async def audit_logging(request: Request, call_next):
    return await audit_logging_middleware(request, call_next)

app.include_router(health.router)
app.include_router(plan.router)
app.include_router(portfolio.router)
app.include_router(preferences.router)
app.include_router(tx.router)
app.include_router(legal.router, prefix="/api/v1/legal", tags=["legal"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])


@app.get("/", include_in_schema=False)
@limiter.limit("10/minute")
async def root(request: Request) -> JSONResponse:
    """Provide a friendly landing response at the API root."""
    return JSONResponse({
        "message": "NEXORA API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    })


@app.get("/favicon.ico", include_in_schema=False)
async def favicon() -> Response:
    """Return an empty favicon response to avoid noisy 404s."""
    return Response(status_code=204)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", exc_info=exc, path=request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )
