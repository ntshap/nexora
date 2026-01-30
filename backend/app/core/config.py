"""Application configuration using Pydantic settings."""

from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    environment: str = Field(default="development")
    database_url: str = Field(
        default="sqlite:///./nexora.db",
        env="DATABASE_URL",
    )
    rpc_url: str = Field(
        default="https://sepolia.infura.io/v3/<project-id>",
        env="RPC_URL",
    )
    backup_rpc_url: str = Field(default="", env="BACKUP_RPC_URL")
    risk_decay_factor: float = Field(default=0.15)
    vault_address: str = Field(
        default="0x0000000000000000000000000000000000000000",
        env="VAULT_ADDRESS",
    )
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        env="REDIS_URL",
    )
    rate_limit_per_minute: int = Field(
        default=60,
        env="RATE_LIMIT_PER_MINUTE",
    )
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    sentry_dsn: str = Field(default="", env="SENTRY_DSN")
    admin_wallets: str = Field(
        default="",
        env="ADMIN_WALLETS",
    )  # Comma-separated admin wallet addresses
    
    # Hardcode allowed origins untuk development
    @property
    def allowed_origins(self) -> List[str]:
        """Get allowed CORS origins."""
        return ["http://localhost:3000", "http://localhost:3001"]

    @validator("vault_address", pre=True)
    def _normalise_vault_address(cls, value: str | None) -> str:
        if not value:
            return "0x0000000000000000000000000000000000000000"
        return value.lower()

    class Config:
        env_file = ("../.env", ".env")
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()


# Singleton settings instance
settings = get_settings()
