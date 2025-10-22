"""General helper utilities."""

from decimal import Decimal


def format_currency(amount: float | Decimal) -> str:
    return f"${Decimal(amount):,.2f}"
