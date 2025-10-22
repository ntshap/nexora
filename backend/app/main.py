"""FastAPI application initialisation."""
from fastapi import FastAPI

from app.api.endpoints import health, plan, portfolio, tx
from app.core.db import init_db
from app.core.logger import logger

init_db()

app = FastAPI(title="NEXORA API", version="0.1.0")
app.include_router(health.router)
app.include_router(plan.router)
app.include_router(portfolio.router)
app.include_router(tx.router)


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("NEXORA API started")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    logger.info("NEXORA API shut down")
