"""Plan endpoint tests."""
from fastapi.testclient import TestClient

from app.core.db import init_db
from app.main import app

client = TestClient(app)


def setup_module(_: object) -> None:
    init_db()


def test_plan_success() -> None:
    payload = {"risk_score": 6, "horizon_months": 12, "stablecoin_preference": "USDC"}
    response = client.post("/plan/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["plans"]) == 3
    assert data["plans"][0]["name"] == "Conservative"


def test_plan_validation_error() -> None:
    payload = {"risk_score": 0, "horizon_months": 12, "stablecoin_preference": "USDC"}
    response = client.post("/plan/", json=payload)
    assert response.status_code == 422
