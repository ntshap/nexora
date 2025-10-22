# NEXORA Architecture

## Overview

NEXORA is organised as a modular monorepo containing:

- **apps/web (Next.js)** – client-facing landing page, plans form, and portfolio dashboard.
- **backend (FastAPI)** – REST API that delivers plan recommendations, portfolio snapshots, and transaction logs.
- **contracts (Foundry/Solidity)** – ERC‑4626 vault suite enabling non-custodial deposits on Sepolia.
- **packages/sdk (TypeScript)** – shared hooks, ABIs, and type definitions used by the web app (and future mobile clients).

The diagram below summarises the high-level data flow.

```
┌────────────┐      REST       ┌─────────────┐      RPC / ABI       ┌──────────────┐
│  Frontend  │ ──────────────▶ │   FastAPI   │ ───────────────────▶ │  Smart       │
│  (Next.js) │ ◀────────────── │    Back-    │ ◀─────────────────── │  Contracts   │
│            │   WebSockets    │     end     │    Event Feeds       │ (Sepolia)    │
└────────────┘                 └─────────────┘                      └─────┬────────┘
      │                                ▲                                   │
      │ Wagmi / Viem                   │ SQLModel                          │
      ▼                                │                                   ▼
┌───────────────┐                      │                             ┌──────────────┐
│ Wallet (EVM)  │◀─────────────────────┘                             │ Off-chain DB │
└───────────────┘                                                    └──────────────┘
```

### Frontend

- Built with Next.js 14, TypeScript, and Tailwind.
- Uses `wagmi` + `viem` for wallet management and contract calls.
- Fetches plan data via `@tanstack/react-query` from FastAPI endpoints.
- Imports reusable hooks from `packages/sdk`.

### Backend

- FastAPI exposes `/plan`, `/portfolio/{address}`, `/tx/deposit`, `/tx/withdraw`, and `/health`.
- Rule-based plan engine converts risk inputs into allocations.
- Portfolio service aggregates on-chain data (mocked via SDK for MVP) and transaction logs (SQLite stub).
- Environment variables (`DATABASE_URL`, `RPC_URL`, etc.) loaded via Pydantic settings.

### Smart Contracts

- `SynthVault.sol`: ERC‑4626 vault with deposit cap and pausability.
- `AdapterAaveMock.sol`: mock adapter to emulate yield aggregation.
- `MockUSDC.sol`: Sepolia-staged ERC‑20 used during testing.
- Foundry scripts deploy the stack; tests cover deposit/withdraw flows and access control.

### SDK Package

- Provides typed hooks (`useDeposit`, `useWithdraw`, `useShares`) that wrap wagmi write/read operations.
- Exports ABIs and shared types to prevent duplication across clients.

## Data Flow

1. **User connects wallet** via `connect()` (wagmi). Frontend ensures the Sepolia chain is active.
2. **Risk profiling** form POSTs to `/plan` to retrieve allocation recommendations.
3. **Deposit/withdraw actions** call SDK hooks which execute transactions against `SynthVault`.
4. **Backend portfolio endpoint** composes cached transaction history with live readings (via viem client) to serve JSON consumed by dashboard.
5. **Analytics** can later connect The Graph for enriched history; placeholders are in place for this integration.

## Deployment Targets

- Web: Vercel (Next.js build output).
- Backend: Railway/Render (FastAPI + uvicorn).
- Contracts: Sepolia testnet via Foundry `forge script`.

Each module deploys independently but aligns on the same environment variables to ensure coherence. Continuous integration should lint (ESLint, Ruff/flake8, Forge) and run unit tests before deployment.
