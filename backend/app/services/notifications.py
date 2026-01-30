"""Multi-channel notification system for alerts."""

import logging
import httpx
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)


class NotificationChannel(ABC):
    """Abstract base class for notification channels."""

    @abstractmethod
    async def send(self, message: str, severity: str, **kwargs):
        """Send notification."""
        pass


class SlackNotification(NotificationChannel):
    """Send notifications to Slack."""

    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url or ""

    async def send(self, message: str, severity: str, **kwargs):
        """Send Slack notification."""
        if not self.webhook_url:
            logger.warning("Slack webhook URL not configured")
            return

        # Color coding
        colors = {
            "info": "#36a64f",
            "warning": "#ff9900",
            "critical": "#ff0000",
        }
        color = colors.get(severity.lower(), "#808080")

        # Emoji mapping
        emojis = {
            "info": ":information_source:",
            "warning": ":warning:",
            "critical": ":rotating_light:",
        }
        emoji = emojis.get(severity.lower(), ":bell:")

        payload = {
            "attachments": [
                {
                    "color": color,
                    "title": f"{emoji} NEXORA Alert - {severity.upper()}",
                    "text": message,
                    "footer": "NEXORA Monitoring System",
                    "ts": int(datetime.utcnow().timestamp()),
                    "fields": [
                        {"title": k, "value": str(v), "short": True}
                        for k, v in kwargs.items()
                    ],
                }
            ]
        }

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(self.webhook_url, json=payload)
                response.raise_for_status()
                logger.info("Slack notification sent successfully")
        except Exception as e:
            logger.error(f"Failed to send Slack notification: {e}")


class DiscordNotification(NotificationChannel):
    """Send notifications to Discord."""

    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url or ""

    async def send(self, message: str, severity: str, **kwargs):
        """Send Discord notification."""
        if not self.webhook_url:
            logger.warning("Discord webhook URL not configured")
            return

        # Color coding (decimal)
        colors = {
            "info": 3581519,  # Green
            "warning": 16744192,  # Orange
            "critical": 16711680,  # Red
        }
        color = colors.get(severity.lower(), 8421504)

        embed = {
            "title": f"🚨 NEXORA Alert - {severity.upper()}",
            "description": message,
            "color": color,
            "timestamp": datetime.utcnow().isoformat(),
            "footer": {"text": "NEXORA Monitoring System"},
            "fields": [
                {"name": k, "value": str(v), "inline": True}
                for k, v in kwargs.items()
            ],
        }

        payload = {"embeds": [embed]}

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(self.webhook_url, json=payload)
                response.raise_for_status()
                logger.info("Discord notification sent successfully")
        except Exception as e:
            logger.error(f"Failed to send Discord notification: {e}")


class NotificationManager:
    """Manage multiple notification channels."""

    def __init__(
        self,
        slack_webhook: Optional[str] = None,
        discord_webhook: Optional[str] = None,
    ):
        self.channels: list[NotificationChannel] = []

        if slack_webhook:
            self.channels.append(SlackNotification(slack_webhook))

        if discord_webhook:
            self.channels.append(DiscordNotification(discord_webhook))

    async def alert(
        self, message: str, severity: str = "info", **kwargs
    ):
        """Send alert to all configured channels."""
        for channel in self.channels:
            try:
                await channel.send(message, severity, **kwargs)
            except Exception as e:
                logger.error(
                    f"Failed to send via {channel.__class__.__name__}: {e}"
                )

    async def critical(self, message: str, **kwargs):
        """Send critical alert."""
        await self.alert(message, "critical", **kwargs)

    async def warning(self, message: str, **kwargs):
        """Send warning alert."""
        await self.alert(message, "warning", **kwargs)

    async def info(self, message: str, **kwargs):
        """Send info alert."""
        await self.alert(message, "info", **kwargs)


# Global notification manager
notification_manager = NotificationManager()


def init_notifications(
    slack_webhook: Optional[str] = None,
    discord_webhook: Optional[str] = None,
):
    """Initialize notification manager with webhooks."""
    global notification_manager
    notification_manager = NotificationManager(
        slack_webhook=slack_webhook,
        discord_webhook=discord_webhook,
    )
    logger.info("Notification manager initialized")
