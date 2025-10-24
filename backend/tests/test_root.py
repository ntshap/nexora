"""Root endpoint tests."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "NEXORA API"
    assert response.json()["docs"] == "/docs"


def test_favicon_endpoint() -> None:
    response = client.get("/favicon.ico")
    assert response.status_code == 204
    assert response.text == ""

