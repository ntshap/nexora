"""Helpers for interacting with the SynthVault contract."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

from web3 import Web3
from web3.contract import Contract
from web3.providers.rpc import HTTPProvider

from app.core.config import get_settings
from app.core.logger import logger

ABI_FILE = Path(__file__).resolve().parent.parent / "contracts" / "synth_vault_abi.json"
ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


@lru_cache()
def _load_abi() -> list[dict[str, Any]]:
    with ABI_FILE.open("r", encoding="utf-8") as handle:
        return json.load(handle)


@lru_cache()
def _get_provider() -> Optional[Web3]:
    settings = get_settings()
    if not settings.rpc_url:
        logger.warning("RPC URL not configured; vault queries disabled")
        return None
    try:
        provider = Web3(HTTPProvider(settings.rpc_url, request_kwargs={"timeout": 6}))
        if provider.is_connected():
            return provider
        logger.warning("Unable to connect to RPC at %s", settings.rpc_url)
    except Exception as error:  # pragma: no cover - defensive logging
        logger.error("Failed to initialise Web3 provider: %s", error)
    return None


@lru_cache()
def get_vault_contract() -> Optional[Contract]:
    """Return the SynthVault contract or None if misconfigured."""
    settings = get_settings()
    if settings.vault_address == ZERO_ADDRESS:
        logger.info("Vault address not configured; skipping on-chain portfolio fetch")
        return None

    provider = _get_provider()
    if provider is None:
        return None

    try:
        checksum_address = Web3.to_checksum_address(settings.vault_address)
    except ValueError:
        logger.error("Invalid vault address configured: %s", settings.vault_address)
        return None

    try:
        return provider.eth.contract(address=checksum_address, abi=_load_abi())
    except Exception as error:  # pragma: no cover - defensive logging
        logger.error("Failed to create contract instance: %s", error)
        return None
