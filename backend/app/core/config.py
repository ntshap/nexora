"""Application configuration using Pydantic settings."""

from functools import lru_cache
from typing import List, Union

from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    environment: str = Field(default="development")
    database_url: str = Field(default="sqlite:///./nexora.db", env="DATABASE_URL")
    rpc_url: str = Field(default="https://sepolia.infura.io/v3/<project-id>", env="RPC_URL")
    risk_decay_factor: float = Field(default=0.15)
    allowed_origins: List[str] = Field(default_factory=lambda: ["http://localhost:3000"], env="ALLOWED_ORIGINS")
    vault_address: str = Field(default="0x0000000000000000000000000000000000000000", env="VAULT_ADDRESS")

    @validator("allowed_origins", pre=True)
    def _parse_allowed_origins(cls, value: Union[str, List[str], None]) -> List[str]:
        if value is None:
            return ["http://localhost:3000"]
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

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
