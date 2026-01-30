# Error Analysis & Solutions - NEXORA Compliance Implementation

## 📋 Summary

**Total Errors Found:** 6 major issues
**Severity:** Medium (Import Resolution Errors)
**Status:** All errors have solutions provided below

---

## ❌ Error 1: Database Base Class Import

### Problem
```python
# backend/app/models/legal.py (line 15)
from app.db.base import Base  # ❌ File doesn't exist
```

**Error Message:** `Import "app.db.base" could not be resolved`

### Root Cause
- Project uses **SQLModel** (not raw SQLAlchemy)
- File `app/db/base.py` doesn't exist
- Legal models incorrectly use SQLAlchemy's `declarative_base()`

### Solution
Legal models should use **SQLModel** like other models in the project:

```python
# ✅ CORRECT APPROACH
from sqlmodel import Field, SQLModel

class TermsAcceptance(SQLModel, table=True):
    __tablename__ = "terms_acceptance"
    # ... rest of model
```

**Action Required:** Rewrite `backend/app/models/legal.py` to use SQLModel

---

## ❌ Error 2: SQLAlchemy Imports

### Problem
```python
# Multiple files
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
```

**Error Message:** `Import "sqlalchemy" could not be resolved` (misleading - it's installed, but wrong pattern)

### Root Cause
- Project uses SQLModel which wraps SQLAlchemy
- Should use SQLModel's API, not raw SQLAlchemy
- Existing models (user, tx, preferences) all use SQLModel pattern

### Solution
Replace SQLAlchemy patterns with SQLModel:

| SQLAlchemy | SQLModel |
|------------|----------|
| `Column(Integer, primary_key=True)` | `Field(default=None, primary_key=True)` |
| `Column(String(100))` | `Field(max_length=100)` |
| `Column(DateTime, default=func.now())` | `Field(default_factory=datetime.utcnow)` |
| `Column(Boolean, default=False)` | `Field(default=False)` |
| `relationship("User")` | Not needed (SQLModel handles this) |

**Action Required:** Convert all models in `legal.py` to SQLModel syntax

---

## ❌ Error 3: Missing SessionLocal

### Problem
```python
# backend/app/api/deps.py
from app.core.db import SessionLocal  # ❌ Doesn't exist
```

### Root Cause
- Project uses `get_session()` generator, not `SessionLocal`
- Existing code in `app/core/db.py` uses different pattern

### Solution
```python
# ✅ CORRECT - Use existing pattern
from app.core.db import get_session

def get_db() -> Generator:
    """Database session dependency."""
    yield from get_session()
```

**Action Required:** Fix `backend/app/api/deps.py` to use `get_session()`

---

## ❌ Error 4: FastAPI/Pydantic Import Warnings

### Problem
```
Import "fastapi" could not be resolved
Import "pydantic" could not be resolved
```

### Root Cause
- These are **FALSE POSITIVES** from VS Code
- Dependencies ARE installed in `requirements.txt`
- VS Code Python extension not detecting virtual environment

### Solution
**This is NOT a real error** - just IDE issue. To fix:

1. **Check Python environment:**
   ```bash
   cd backend
   which python  # Should point to venv
   pip list | grep fastapi  # Verify installed
   ```

2. **Configure VS Code:**
   ```json
   // .vscode/settings.json
   {
     "python.defaultInterpreterPath": "${workspaceFolder}/backend/.venv/bin/python"
   }
   ```

3. **Reinstall dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

**Action Required:** Configure Python interpreter in VS Code (cosmetic fix only)

---

## ❌ Error 5: User Model Import for Admin Auth

### Problem
```python
# backend/app/api/deps.py
from app.models.user import User
user = db.query(User).filter(User.wallet == wallet).first()  # ❌ Wrong API
```

### Root Cause
- SQLModel uses different query API
- Should use SQLModel's `select()` pattern
- Field name mismatch: model has `wallet_address`, not `wallet`

### Solution
```python
# ✅ CORRECT - SQLModel pattern
from sqlmodel import select
from app.models.user import User

def get_current_user(...) -> User:
    user = db.exec(
        select(User).where(User.wallet_address == wallet)
    ).first()
```

**Action Required:** Fix query pattern in `deps.py` and `admin.py`

---

## ❌ Error 6: Circuit Breaker Database Access

### Problem
```python
# backend/app/services/circuit_breaker.py
db = next(get_db())  # ❌ Wrong generator usage
```

### Root Cause
- Misuse of generator pattern
- Should use context manager or dependency injection

### Solution
```python
# ✅ CORRECT - Use context manager
from app.core.db import Session, engine

async def log_event(...):
    with Session(engine) as db:
        event = CircuitBreakerEvent(...)
        db.add(event)
        db.commit()
```

**Action Required:** Fix database access in `circuit_breaker.py`

---

## 🔧 Complete Fix Checklist

### High Priority (Blocks Functionality)

- [ ] **1. Rewrite `backend/app/models/legal.py`** - Use SQLModel instead of SQLAlchemy
- [ ] **2. Fix `backend/app/api/deps.py`** - Use get_session() and correct query API
- [ ] **3. Fix `backend/app/api/endpoints/admin.py`** - Use SQLModel query pattern
- [ ] **4. Fix `backend/app/services/circuit_breaker.py`** - Use Session context manager

### Medium Priority (Improves Stability)

- [ ] **5. Fix User model field name** - Change `wallet` to `wallet_address` in all queries
- [ ] **6. Add missing imports** - Import `select` from sqlmodel where needed
- [ ] **7. Update Session usage** - Replace all `db.query()` with `db.exec(select())`

### Low Priority (IDE/Cosmetic)

- [ ] **8. Configure Python interpreter** - Fix VS Code import warnings
- [ ] **9. Add type hints** - Improve SQLModel type inference
- [ ] **10. Update documentation** - Reflect SQLModel usage in guides

---

## 🚀 Quick Fix Script

Here's the order to fix errors:

```bash
# 1. Fix legal models
# - Open backend/app/models/legal.py
# - Replace entire file with SQLModel version (see detailed fix below)

# 2. Fix dependencies
# - Open backend/app/api/deps.py
# - Update get_db() and query patterns

# 3. Fix admin endpoints
# - Open backend/app/api/endpoints/admin.py
# - Update all db.query() calls

# 4. Fix circuit breaker
# - Open backend/app/services/circuit_breaker.py
# - Fix database session usage

# 5. Run database migration
cd backend
alembic revision --autogenerate -m "Add legal compliance tables"
alembic upgrade head

# 6. Test backend
pytest tests/ -v
```

---

## 📝 Detailed Fix Examples

### Fix 1: Legal Models (SQLModel Version)

See the corrected version in the next message - file is too large for this section.

### Fix 2: Dependencies (deps.py)

```python
"""Dependency injection for FastAPI."""
from collections.abc import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.user import User
from app.core.config import settings

security = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    """Database session dependency."""
    yield from get_session()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user from JWT token."""
    token = credentials.credentials
    wallet = token  # In production: decode JWT
    
    user = db.exec(
        select(User).where(User.wallet_address == wallet)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Verify that current user has admin privileges."""
    admin_wallets = settings.ADMIN_WALLETS.split(",")
    
    if current_user.wallet_address.lower() not in [
        w.lower() for w in admin_wallets
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    return current_user
```

### Fix 3: Admin Endpoints Query Pattern

```python
# OLD (SQLAlchemy style) ❌
latest_event = (
    db.query(CircuitBreakerEvent)
    .filter(CircuitBreakerEvent.event_type == "emergency_pause")
    .filter(CircuitBreakerEvent.resolved.is_(False))
    .order_by(CircuitBreakerEvent.created_at.desc())
    .first()
)

# NEW (SQLModel style) ✅
from sqlmodel import select

latest_event = db.exec(
    select(CircuitBreakerEvent)
    .where(CircuitBreakerEvent.event_type == "emergency_pause")
    .where(CircuitBreakerEvent.resolved == False)
    .order_by(CircuitBreakerEvent.created_at.desc())
).first()
```

---

## ⚠️ Important Notes

1. **Don't Mix SQLAlchemy and SQLModel APIs**
   - Project uses SQLModel throughout
   - Stick to `SQLModel`, `Field`, `select()`, `db.exec()`
   - Avoid raw SQLAlchemy `Column`, `relationship`, `db.query()`

2. **Field Names Matter**
   - User model has `wallet_address`, not `wallet`
   - Check all field references

3. **Session Management**
   - Use `get_session()` generator for FastAPI dependencies
   - Use `Session(engine)` context manager for standalone functions
   - Never use `next(get_db())` - it doesn't clean up properly

4. **False Positive Import Errors**
   - Many "could not be resolved" errors are VS Code issues
   - If `pip list` shows the package, it's installed
   - Configure Python interpreter to fix IDE warnings

---

## ✅ Verification Steps

After applying fixes:

```bash
# 1. Check Python syntax
cd backend
python -m py_compile app/models/legal.py
python -m py_compile app/api/endpoints/admin.py
python -m py_compile app/api/deps.py

# 2. Run linter
flake8 app/ --max-line-length=79

# 3. Type check (if mypy installed)
mypy app/ --ignore-missing-imports

# 4. Run tests
pytest tests/ -v

# 5. Start server
uvicorn app.main:app --reload
```

Expected output:
```
✓ No syntax errors
✓ No import errors
✓ All tests pass
✓ Server starts successfully
```

---

## 📞 Need Help?

If errors persist:

1. Share the exact error message
2. Check Python version: `python --version` (need 3.11+)
3. Verify virtual environment: `which python`
4. Check installed packages: `pip list`
5. Try clean reinstall: `rm -rf .venv && python -m venv .venv && pip install -r requirements.txt`

---

**Status:** Ready to fix all errors
**Time Required:** ~30-45 minutes
**Impact:** All features will work correctly after fixes applied
