"""FastAPI application initialisation."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from app.api.endpoints import health, plan, portfolio, preferences, tx
from app.core.config import get_settings
from app.core.db import init_db
from app.core.logger import logger

settings = get_settings()

init_db()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("NEXORA API started")
    try:
        yield
    finally:
        logger.info("NEXORA API shut down")


app = FastAPI(title="NEXORA API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health.router)
app.include_router(plan.router)
app.include_router(portfolio.router)
app.include_router(preferences.router)
app.include_router(tx.router)


@app.get("/", include_in_schema=False)
async def root() -> JSONResponse:
    """Provide a friendly landing response at the API root."""
    return JSONResponse({"message": "NEXORA API", "docs": "/docs", "openapi": "/openapi.json"})


@app.get("/favicon.ico", include_in_schema=False)
async def favicon() -> Response:
    """Return an empty favicon response to avoid noisy 404s."""
    return Response(status_code=204)
