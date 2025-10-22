"""Database session management using SQLModel."""

from collections.abc import Generator

from sqlalchemy import text
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url, echo=False)


def init_db() -> None:
    """Create database tables."""
    SQLModel.metadata.create_all(engine)
    with engine.begin() as connection:
        columns = {
            row[1]
            for row in connection.execute(text("PRAGMA table_info(transactionlog);"))
        }
        if "tx_hash" not in columns:
            connection.execute(text("ALTER TABLE transactionlog ADD COLUMN tx_hash VARCHAR(80)"))


def get_session() -> Generator[Session, None, None]:
    """Yield a SQLModel session."""
    with Session(engine) as session:
        yield session
