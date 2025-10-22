"""Application configuration using Pydantic settings."""

from functools import lru_cache

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    environment: str = Field(default="development")
    database_url: str = Field(default="sqlite:///./nexora.db", env="DATABASE_URL")
    rpc_url: str = Field(default="https://sepolia.infura.io/v3/<project-id>", env="RPC_URL")
    risk_decay_factor: float = Field(default=0.15)

    class Config:
        env_file = ("../.env", ".env")
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
