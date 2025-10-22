"""Portfolio endpoint tests."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_portfolio_endpoint() -> None:
    response = client.get("/portfolio/0xabc123")
    assert response.status_code == 200
    data = response.json()
    assert data["owner"] == "0xabc123"
    assert "positions" in data
