"""FastAPI application initialisation."""
from fastapi import FastAPI
from fastapi.responses import JSONResponse, Response

from app.api.endpoints import health, plan, portfolio, tx
from app.core.db import init_db
from app.core.logger import logger

init_db()

app = FastAPI(title="NEXORA API", version="0.1.0")
app.include_router(health.router)
app.include_router(plan.router)
app.include_router(portfolio.router)
app.include_router(tx.router)


@app.get("/", include_in_schema=False)
async def root() -> JSONResponse:
    """Provide a friendly landing response at the API root."""
    return JSONResponse({"message": "NEXORA API", "docs": "/docs", "openapi": "/openapi.json"})


@app.get("/favicon.ico", include_in_schema=False)
async def favicon() -> Response:
    """Return an empty favicon response to avoid noisy 404s."""
    return Response(status_code=204)


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("NEXORA API started")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    logger.info("NEXORA API shut down")
