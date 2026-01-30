# Legal Compliance & Security Features

This document explains the critical compliance and security features implemented in NEXORA.

## Overview

NEXORA implements comprehensive legal compliance and security features including:

1. **Terms of Service Acceptance** - Required before using the platform
2. **Age Verification** - Ensures users are 18+
3. **Transaction Risk Warnings** - Displayed before every transaction
4. **Geo-blocking** - Blocks access from restricted countries
5. **GDPR Compliance** - Data export and account deletion
6. **Audit Logging** - Comprehensive activity tracking
7. **Circuit Breaker** - Automatic system protection

## Frontend Implementation

### 1. Compliance Gate

The `ComplianceGate` component wraps your entire app and ensures users have accepted terms before using the platform.

**Already implemented in:** `apps/web/src/pages/_app.tsx`

```tsx
import { ComplianceGate } from '@/components/legal';

function App() {
  return (
    <ComplianceGate>
      <YourApp />
    </ComplianceGate>
  );
}
```

### 2. Transaction Risk Warning

**Before every deposit or withdrawal**, show a risk warning:

```tsx
import { WithRiskWarning } from '@/components/transaction';
import { parseUnits } from 'viem';

function DepositButton() {
  const handleDeposit = async () => {
    // Your deposit logic here
    console.log('Executing deposit...');
  };

  return (
    <WithRiskWarning>
      {(requestTransaction) => (
        <Button
          onClick={() => 
            requestTransaction(
              'deposit',
              parseUnits('100', 6), // Amount in USDC
              handleDeposit
            )
          }
        >
          Deposit
        </Button>
      )}
    </WithRiskWarning>
  );
}
```

### 3. Manual Usage (without HOC)

```tsx
import { TransactionRiskWarning } from '@/components/legal';
import { useTransactionRisk } from '@/hooks/useTransactionRisk';

function YourComponent() {
  const { 
    showRiskWarning, 
    pendingTransaction,
    requestTransaction,
    handleConfirm,
    handleCancel 
  } = useTransactionRisk();

  const onDepositClick = () => {
    requestTransaction('deposit', parseUnits('100', 6), () => {
      // This callback runs AFTER user accepts risk
      executeDeposit();
    });
  };

  return (
    <>
      <button onClick={onDepositClick}>Deposit</button>
      
      {pendingTransaction && (
        <TransactionRiskWarning
          open={showRiskWarning}
          type={pendingTransaction.type}
          amount={pendingTransaction.amount}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
```

## Backend Implementation

### 1. API Endpoints

All legal endpoints are in `backend/app/api/endpoints/legal.py`:

- `POST /api/legal/accept-terms` - Record terms acceptance
- `GET /api/legal/check-acceptance/{wallet}` - Check if user accepted
- `GET /api/legal/gdpr/export/{wallet}` - Export user data (GDPR)
- `DELETE /api/legal/gdpr/delete-account/{wallet}` - Delete account (GDPR)

### 2. Middleware

**Geo-blocking** is automatically applied via middleware in `backend/app/middleware/compliance.py`.

Blocked countries:
- US, CN, KP, IR, SY, CU, VE, BY, MM, ZW

### 3. Circuit Breaker

Automatic system protection triggers when:
- Error rate > 5%
- TVL drops > 10% in 1 hour  
- Gas price > 500 Gwei

**Initialize in your FastAPI app:**

```python
from app.services.circuit_breaker import setup_circuit_breaker, monitor_circuit_breaker
import asyncio

@app.on_event("startup")
async def startup_event():
    await setup_circuit_breaker()
    asyncio.create_task(monitor_circuit_breaker())
```

### 4. Notifications

Send alerts via Slack/Discord:

```python
from app.services.notifications import notification_manager

# Initialize with webhooks
from app.services.notifications import init_notifications
init_notifications(
    slack_webhook=settings.slack_webhook_url,
    discord_webhook=settings.discord_webhook_url
)

# Send alerts
await notification_manager.critical(
    "Vault TVL dropped 15%!",
    current_tvl="$1.2M",
    previous_tvl="$1.4M"
)
```

### 5. Audit Logging

All sensitive actions are automatically logged:

```python
from app.models.legal import AuditLog

# Manually log important actions
audit = AuditLog(
    user_id=user.id,
    wallet_address=user.wallet_address,
    action="emergency_pause",
    resource_type="vault",
    resource_id=vault_address,
    old_value={"paused": False},
    new_value={"paused": True},
)
db.add(audit)
db.commit()
```

## Database Migrations

Run migrations to create new tables:

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Add legal compliance tables"

# Apply migration
alembic upgrade head
```

## Environment Variables

Add to your `.env` file:

```env
# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Geo-blocking
BLOCKED_COUNTRIES=US,CN,KP,IR,SY,CU,VE,BY,MM,ZW

# Terms versions
CURRENT_TERMS_VERSION=1.0.0
CURRENT_PRIVACY_VERSION=1.0.0
```

## Testing

### Frontend Tests

```bash
cd apps/web
npm test src/components/legal
```

### Backend Tests

```bash
cd backend
pytest tests/test_legal.py -v
```

## Production Checklist

Before launching:

- [ ] Update Terms of Service with lawyer review
- [ ] Update Privacy Policy for GDPR compliance
- [ ] Configure Slack/Discord webhooks for alerts
- [ ] Test geo-blocking from different countries
- [ ] Test circuit breaker triggers
- [ ] Verify audit logs are working
- [ ] Test GDPR data export/deletion
- [ ] Ensure age verification works
- [ ] Test transaction risk warnings on all flows

## Security Notes

1. **Never disable** the ComplianceGate in production
2. **Always show** TransactionRiskWarning before deposits/withdrawals
3. **Monitor** audit logs regularly for suspicious activity
4. **Test** circuit breaker monthly to ensure it works
5. **Review** geo-blocking logs for access attempts

## Support

For questions or issues, contact the development team.
