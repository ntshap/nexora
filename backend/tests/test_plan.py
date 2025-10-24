"""Plan endpoint tests."""
from math import isclose

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
    conservative, balanced, growth = data["plans"]
    assert conservative["name"] == "Conservative"
    assert conservative["risk_level"] == "low"
    assert balanced["name"] == "Balanced"
    assert growth["risk_level"] == "high"
    for plan in data["plans"]:
        assert plan["est_apy"] > 0
        assert isclose(sum(plan["allocations"].values()), 1.0, abs_tol=0.05)


def test_plan_validation_error() -> None:
    payload = {"risk_score": 0, "horizon_months": 12, "stablecoin_preference": "USDC"}
    response = client.post("/plan/", json=payload)
    assert response.status_code == 422


def test_plan_requires_fields() -> None:
    response = client.post("/plan/", json={"risk_score": 5})
    assert response.status_code == 422
