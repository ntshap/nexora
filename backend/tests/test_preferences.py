"""Preferences endpoint tests."""
from secrets import token_hex

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def new_address() -> str:
    return f"0x{token_hex(20)}"


def test_preferences_lifecycle() -> None:
    address = new_address()

    response = client.get(f"/preferences/{address}")
    assert response.status_code == 404

    payload = {
        "risk_level": "high",
        "risk_score": 9,
        "horizon_months": 18,
        "stablecoin_preference": "USDC",
    }
    save = client.put(f"/preferences/{address}", json=payload)
    assert save.status_code == 200
    data = save.json()
    assert data["address"] == address.lower()
    assert data["risk_level"] == "high"
    assert data["risk_score"] == 9

    fetched = client.get(f"/preferences/{address}")
    assert fetched.status_code == 200
    fetched_data = fetched.json()
    assert fetched_data["risk_level"] == "high"
    assert fetched_data["risk_score"] == 9
    assert fetched_data["horizon_months"] == 18
