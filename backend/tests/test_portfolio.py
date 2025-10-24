"""Portfolio endpoint tests."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class _DummyResult:
    def __init__(self, value: int):
        self._value = value

    def call(self) -> int:
        return self._value


class _DummyContract:
    def __init__(self, shares: int, assets: int, total_assets: int, total_supply: int):
        self._shares = shares
        self._assets = assets
        self._total_assets = total_assets
        self._total_supply = total_supply
        self.functions = self

    def balanceOf(self, *_):
        return _DummyResult(self._shares)

    def convertToAssets(self, *_):
        return _DummyResult(self._assets)

    def totalAssets(self):
        return _DummyResult(self._total_assets)

    def totalSupply(self):
        return _DummyResult(self._total_supply)


def test_portfolio_endpoint(monkeypatch) -> None:
    dummy_contract = _DummyContract(
        shares=2 * 10**18,
        assets=3 * 10**18,
        total_assets=5 * 10**18,
        total_supply=2 * 10**18,
    )
    monkeypatch.setattr("app.services.portfolio_service.get_vault_contract", lambda: dummy_contract)

    address = "0x1111111111111111111111111111111111111111"
    response = client.get(f"/portfolio/{address}")
    assert response.status_code == 200
    data = response.json()
    assert data["owner"] == address
    assert data["positions"], "positions should not be empty when contract returns balances"
    position = data["positions"][0]
    assert position["shares"] == 2.0
    assert position["asset_value"] == 3.0

def test_portfolio_returns_empty_when_contract_missing(monkeypatch) -> None:
    monkeypatch.setattr("app.services.portfolio_service.get_vault_contract", lambda: None)
    address = "0x3333333333333333333333333333333333333333"
    response = client.get(f"/portfolio/{address}")
    assert response.status_code == 200
    data = response.json()
    assert data["owner"] == address
    assert data["positions"] == []


def test_portfolio_history_tracks_transactions(monkeypatch) -> None:
    dummy_contract = _DummyContract(0, 0, 0, 1)
    monkeypatch.setattr("app.services.portfolio_service.get_vault_contract", lambda: dummy_contract)
    address = "0x4444444444444444444444444444444444444444"
    payload = {"address": address, "amount": 25, "vault": "SynthVault", "tx_hash": "0xabc"}
    client.post("/tx/deposit", json=payload)
    response = client.get(f"/portfolio/{address}")
    assert response.status_code == 200
    history = response.json()["history"]
    assert history
    latest = history[0]
    assert latest["tx_type"] == "deposit"
    assert latest["amount"] == 25
    assert latest["vault"] == "SynthVault"
