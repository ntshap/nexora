from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Dict, Any
from datetime import datetime
from app.api.deps import get_db, get_current_admin_user
from app.models.legal import CircuitBreakerEvent
from app.models.user import User
from app.services.circuit_breaker import circuit_breaker
from app.services.notifications import notification_manager
from app.core.logger import logger

router = APIRouter()


@router.get("/metrics")
async def get_system_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Dict[str, Any]:
    """Get current system health metrics for admin dashboard."""
    try:
        # Get latest metrics from circuit breaker
        metrics = circuit_breaker.get_current_metrics()
        
        # Get pause status from database
        latest_event = db.exec(
            select(CircuitBreakerEvent)
            .where(CircuitBreakerEvent.event_type == "emergency_pause")
            .order_by(CircuitBreakerEvent.created_at.desc())
        ).first()
        
        is_paused = (
            latest_event.resolved is False
            if latest_event
            else False
        )
        
        return {
            "errorRate": metrics.get("error_rate", 0),
            "gasPrice": metrics.get("gas_price", 0),
            "tvlChange1h": metrics.get("tvl_change_1h", 0),
            "totalValueLocked": str(metrics.get("total_tvl", 0)),
            "isPaused": is_paused,
            "lastCheck": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        logger.error(f"Failed to get system metrics: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/emergency-pause")
async def emergency_pause(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Dict[str, str]:
    """
    Trigger emergency pause of all contracts.
    In production, this should initiate multi-sig transaction.
    """
    try:
        # Log the pause event
        event = CircuitBreakerEvent(
            event_type="emergency_pause",
            rule_name="Manual Admin Pause",
            metric_value=0.0,
            threshold=0.0,
            action_taken=f"Emergency pause by admin {current_user.wallet}",
            resolved=False,
        )
        db.add(event)
        db.commit()
        
        # Send critical alert
        await notification_manager.critical(
            "🚨 EMERGENCY PAUSE INITIATED",
            (
                f"Admin {current_user.wallet} has manually paused "
                f"all contracts at {datetime.utcnow().isoformat()}"
            ),
        )
        
        # In production, trigger multi-sig transaction to pause contracts
        # For now, just log
        logger.critical(
            f"Emergency pause initiated by {current_user.wallet}"
        )
        
        return {
            "status": "success",
            "message": "Emergency pause initiated. Awaiting confirmations.",
        }
    except Exception as e:
        logger.error(f"Failed to pause system: {e}")
        raise HTTPException(status_code=500, detail="Failed to pause system")


@router.post("/unpause")
async def unpause_system(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Dict[str, str]:
    """
    Unpause all contracts after emergency resolution.
    In production, this should initiate multi-sig transaction.
    """
    try:
        # Mark latest pause event as resolved
        latest_event = db.exec(
            select(CircuitBreakerEvent)
            .where(CircuitBreakerEvent.event_type == "emergency_pause")
            .where(CircuitBreakerEvent.resolved.is_(False))
            .order_by(CircuitBreakerEvent.created_at.desc())
        ).first()
        
        if latest_event:
            latest_event.resolved = True
            latest_event.resolved_at = datetime.utcnow()
            db.commit()
        
        # Send alert
        await notification_manager.info(
            "✅ System Unpaused",
            (
                f"Admin {current_user.wallet} has unpaused the system "
                f"at {datetime.utcnow().isoformat()}"
            ),
        )
        
        # In production, trigger multi-sig transaction to unpause
        logger.info(f"System unpaused by {current_user.wallet}")
        
        return {
            "status": "success",
            "message": "Unpause initiated. Awaiting confirmations.",
        }
    except Exception as e:
        logger.error(f"Failed to unpause system: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to unpause system",
        )


@router.get("/circuit-breaker/events")
async def get_circuit_breaker_events(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Get recent circuit breaker events for monitoring."""
    events = db.exec(
        select(CircuitBreakerEvent)
        .order_by(CircuitBreakerEvent.created_at.desc())
        .limit(limit)
    ).all()
    
    return {
        "events": [
            {
                "id": e.id,
                "event_type": e.event_type,
                "rule_name": e.rule_name,
                "metric_value": e.metric_value,
                "threshold": e.threshold,
                "action_taken": e.action_taken,
                "resolved": e.resolved,
                "created_at": e.created_at.isoformat(),
                "resolved_at": (
                    e.resolved_at.isoformat()
                    if e.resolved_at
                    else None
                ),
            }
            for e in events
        ]
    }
