"""Dependency injection stubs."""
from collections.abc import Generator


def get_db() -> Generator[None, None, None]:
    """Database dependency placeholder."""
    yield


def get_config() -> dict[str, str]:
    """Configuration dependency placeholder."""
    return {}
