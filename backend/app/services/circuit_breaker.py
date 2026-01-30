"""Circuit breaker for automatic system protection."""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Callable, Awaitable

from sqlmodel import Session
from app.core.db import engine
from app.models.legal import CircuitBreakerEvent

logger = logging.getLogger(__name__)


class CircuitBreakerRule:
    """Rule for circuit breaker trigger."""

    def __init__(
        self,
        name: str,
        condition: Callable[[], Awaitable[bool]],
        action: Callable[[], Awaitable[None]],
        severity: str = "warning",
        cooldown: int = 300,  # 5 minutes
    ):
        self.name = name
        self.condition = condition
        self.action = action
        self.severity = severity
        self.cooldown = cooldown
        self.last_triggered = None


class CircuitBreaker:
    """Monitor system health and auto-pause on anomalies."""

    def __init__(self):
        self.rules: list[CircuitBreakerRule] = []
        self.is_paused = False
        self.metrics: Dict[str, Any] = {}

    def add_rule(self, rule: CircuitBreakerRule):
        """Add a monitoring rule."""
        self.rules.append(rule)

    async def check_all_rules(self):
        """Check all rules and trigger actions if needed."""
        for rule in self.rules:
            try:
                # Skip if in cooldown
                if rule.last_triggered:
                    elapsed = (
                        datetime.utcnow() - rule.last_triggered
                    ).total_seconds()
                    if elapsed < rule.cooldown:
                        continue

                # Check condition
                if await rule.condition():
                    logger.warning(f"Circuit breaker triggered: {rule.name}")

                    # Execute action
                    await rule.action()

                    # Record event
                    await self.log_event(
                        event_type=rule.name,
                        severity=rule.severity,
                        metrics=self.metrics.copy(),
                        action_taken=rule.action.__name__,
                        auto_triggered=True,
                    )

                    rule.last_triggered = datetime.utcnow()

            except Exception as e:
                logger.error(f"Error checking rule {rule.name}: {e}")

    async def log_event(
        self,
        event_type: str,
        severity: str,
        metrics: Dict[str, Any],
        action_taken: str,
        auto_triggered: bool = False,
    ):
        """Log circuit breaker event to database."""
        try:
            with Session(engine) as db:
                event = CircuitBreakerEvent(
                    event_type=event_type,
                    rule_name=event_type,
                    metric_value=metrics.get("value", 0.0),
                    threshold=metrics.get("threshold", 0.0),
                    action_taken=action_taken,
                    auto_triggered=auto_triggered,
                )
                db.add(event)
                db.commit()
        except Exception as e:
            logger.error(f"Failed to log circuit breaker event: {e}")

    async def get_error_rate(self) -> float:
        """Calculate error rate from metrics."""
        return self.metrics.get("error_rate", 0.0)

    async def get_gas_price(self) -> int:
        """Get current gas price."""
        return self.metrics.get("gas_price", 0)

    async def get_tvl_change_1h(self) -> float:
        """Get TVL change over last hour."""
        return self.metrics.get("tvl_change_1h", 0.0)

    def get_current_metrics(self) -> Dict[str, Any]:
        """Get current system metrics for admin dashboard."""
        return {
            "error_rate": self.metrics.get("error_rate", 0.0),
            "gas_price": self.metrics.get("gas_price", 0),
            "tvl_change_1h": self.metrics.get("tvl_change_1h", 0.0),
            "total_tvl": self.metrics.get("total_tvl", 0),
        }

    async def pause_system(self):
        """Pause all contract interactions."""
        logger.critical("SYSTEM PAUSED - Circuit breaker triggered")
        self.is_paused = True
        # TODO: Implement actual contract pause via admin multisig
        # This would require calling the pause() function on contracts

    async def alert_team(self, message: str, severity: str = "warning"):
        """Send alert to team via Slack/Discord."""
        # TODO: Implement notification system
        logger.critical(f"ALERT [{severity}]: {message}")


# Global circuit breaker instance
circuit_breaker = CircuitBreaker()


async def setup_circuit_breaker():
    """Initialize circuit breaker rules."""

    # Rule 1: High error rate
    circuit_breaker.add_rule(
        CircuitBreakerRule(
            name="high_error_rate",
            condition=lambda: circuit_breaker.get_error_rate()
            > 0.05,  # 5%
            action=circuit_breaker.pause_system,
            severity="critical",
            cooldown=600,  # 10 minutes
        )
    )

    # Rule 2: TVL drop
    circuit_breaker.add_rule(
        CircuitBreakerRule(
            name="tvl_drop",
            condition=lambda: circuit_breaker.get_tvl_change_1h()
            < -0.10,  # -10%
            action=circuit_breaker.pause_system,
            severity="critical",
            cooldown=600,
        )
    )

    # Rule 3: Gas price spike
    circuit_breaker.add_rule(
        CircuitBreakerRule(
            name="gas_spike",
            condition=lambda: circuit_breaker.get_gas_price() > 500,  # Gwei
            action=lambda: circuit_breaker.alert_team(
                "Gas price over 500 Gwei", "warning"
            ),
            severity="warning",
            cooldown=300,
        )
    )

    logger.info("Circuit breaker initialized with rules")


async def monitor_circuit_breaker():
    """Background task to monitor circuit breaker."""
    while True:
        try:
            await circuit_breaker.check_all_rules()
        except Exception as e:
            logger.error(f"Circuit breaker monitoring error: {e}")

        # Check every 10 seconds
        await asyncio.sleep(10)
