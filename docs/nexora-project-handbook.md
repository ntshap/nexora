# NEXORA Project Handbook

This document is a comprehensive guide to the NEXORA hackathon project. It combines the architectural overview, setup instructions, operational runbooks, API/contract references, and troubleshooting notes into a single source of truth intended for senior contributors onboarding to the codebase.

---

## 1. Mission & Vision

NEXORA is a non-custodial DeFi co-pilot built for creative professionals (artists, musicians, designers) who operate with irregular cash flow but demand full control over their assets. The platform combines:

- **Personalised plan generation** driven by rule-based risk scoring (upgradeable to ML/AI).
- **ERC-4626 vault infrastructure** for transparent yield access.
- **Real-time portfolio intelligence** across on-chain positions & backend logs.

The MVP targets Sepolia testnet and emphasises a polished dashboard experience with secure wallet interactions.

---

## 2. Monorepo Structure

| Path               | Description                                                                                                 |
|--------------------|-------------------------------------------------------------------------------------------------------------|
| `apps/web`         | Next.js 14 app (landing page, `/plans`, `/dashboard`, `/portfolio`).                                         |
| `backend`          | FastAPI service (plan generation, portfolio aggregation, transaction logging).                              |
| `contracts`        | Foundry project with `SynthVault` ERC-4626 implementation and tests.                                        |
| `packages/sdk`     | TypeScript package exposing wagmi hooks (`useDeposit`, `useWithdraw`, `useShares`) and contract ABIs.       |
| `docs`             | Supporting documentation, including this handbook and architecture notes.                                   |
| `spec/spec.yaml`   | Product specification powering Spec Kit workflows.                                                          |

The repository follows a workspace-style layout; each component can be run and tested independently but shares lint/test conventions.

---

## 3. Architecture Overview

### 3.1 High-level Diagram

```
┌────────────────────┐      REST / JSON      ┌──────────────────────┐
│ Next.js Frontend   │ ───────────────────▶ │ FastAPI Backend      │
│ (apps/web)         │ ◀─────────────────── │ (backend/app)        │
└────────────────────┘      (fetch, logs)   └─────────┬────────────┘
        │                                          SQLModel / SQLite
        │ wagmi hooks (viem RPC)                       │
        ▼                                              ▼
┌───────────────┐  RPC / ABI / viem   ┌─────────────────────────┐
│ Wallet Client │ ────────────────▶   │ SynthVault (ERC-4626)   │
└───────────────┘  (Sepolia)         │ + adapters + mocks       │
                                     └─────────────────────────┘
```

### 3.2 Data Flow

1. **Wallet connection**: The user connects via MetaMask/WalletConnect (wagmi). Network guard rails ensure Sepolia.
2. **Risk plan generation**: `/plans` calls `POST /plan` to obtain Conservative/Balanced/Growth strategies.
3. **Dashboard**: `/dashboard` fetches plans & portfolio (combination of on-chain `useReadContract` + backend logs) and exposes deposit actions through wagmi write hooks.
4. **Transaction logging**: Deposits/withdrawals log to FastAPI’s SQLite store via `/tx/deposit` & `/tx/withdraw`.
5. **Portfolio page**: Aggregates contract reads + historical logs, enabling new activity insights.

---

## 4. Environment Setup

### 4.1 Global Prerequisites

- Node.js 18+
- Python 3.11+ (virtualenv/venv)
- Foundry toolchain (forge/anvil/cast) – `curl -L https://foundry.paradigm.xyz | bash`
- A Sepolia RPC endpoint and funded test wallet

### 4.2 Environment Variables

Create a root `.env` (copy `.env.example`). Important values:

```
DATABASE_URL=sqlite:///./nexora.db
RPC_URL=https://rpc.sepolia.org
VAULT_ADDRESS=0x... deployed SynthVault
```

Frontend `.env.local` (under `apps/web`):

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<project-id>
NEXT_PUBLIC_SYNTH_VAULT_ADDRESS=0x... (match backend)
```

### 4.3 Installation Summary

```bash
# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --break-system-packages -r requirements.txt

# Frontend
cd ../apps/web
npm install

# SDK (build artifacts consumed by web)
cd ../../packages/sdk
npm install
npm run build

# Contracts
cd ../../contracts
forge install
forge build
```

---

## 5. Backend Runbook

### 5.1 Starting the API

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Endpoints (`app/api/endpoints`):

- `POST /plan`: returns three plan options (rule-based adjustments based on risk & horizon).
- `GET /portfolio/{address}`: aggregated positions + transaction history (currently stubbed positions with on-chain hooks).
- `POST /tx/deposit` & `/tx/withdraw`: log transaction metadata.
- `GET /health`: readiness probe.
- `GET /` + `/favicon.ico`: convenience endpoints to reduce 404 noise.

### 5.2 Plan Generation Logic

Located in `app/services/plan_service.py`. Uses `PlanTemplate` dataclasses and helper functions:

- `_adjusted_apy`: scales base APY by risk score and investment horizon.
- `_rationale`: textual reason per risk bucket.

Plan responses conform to `PlanResponse` Pydantic schema (list of `PlanOption`).

### 5.3 Portfolio Service

`app/services/portfolio_service.py` handles:

- Hard-coded stub for positions (to be replaced with on-chain queries).
- Transaction history from SQLModel via `TransactionLog`.
- `log_activity` helper invoked by transaction endpoints.

### 5.4 Tests

Run tests with `pytest` (configured via `pytest.ini` + `tests/conftest.py` to handle paths with spaces).

```bash
cd backend
source .venv/bin/activate
pytest
```

All six tests (`test_health`, `test_plan`, `test_portfolio`, `test_root`) should pass.

---

## 6. Frontend (Next.js) Runbook

### 6.1 Development

```bash
cd apps/web
npm install
npm run dev
# available at http://localhost:3000 (Next may choose another port if 3000 is in use)
```

Pages:

- `/`: Marketing landing (`HeroSection`, features, FAQ)
- `/plans`: Risk profiling form, hitting backend `POST /plan`
- `/dashboard`: Client-only page showing balance, suggested investments, positions
- `/portfolio`: On-chain snapshot & history (client-only)
- `/404`: Custom not-found page

Client-only pages (`dashboard`, `portfolio`) render entirely in the browser because they rely on wagmi contexts. They are wrapped using `next/dynamic(..., { ssr: false })` to avoid SSR issues.

### 6.2 Build & Lint

```bash
cd apps/web
npm run lint          # ESLint (Next.js config)
npm run build         # Production build
```

> During `next build`, ensure the backend is reachable to avoid long timeouts when pages fetch data. Static generation timeouts are mitigated by rendering client-only pages.

### 6.3 Wagmi Provider Setup

`pages/_app.tsx` is a client component that wraps the tree with:

- `WagmiProvider` (configured in `utils/wagmi.ts`)
- `QueryClientProvider` (TanStack Query)

The shared SDK also uses `'use client'` to guarantee hooks run under context.

### 6.4 Dashboard Components

- `BalanceCard`: Displays wallet shares and asset value, triggers deposit modal.
- `DepositDialog`: Uses `useDeposit` from SDK to interact with vault, logs to backend.
- `SuggestedInvestmentsList`: Shows backend plan output, includes risk filters.
- `PositionsList`: Consumes portfolio data; includes link to `/portfolio`.
- `BottomNav`: Mobile tab navigation (Dashboard / Plans / Portfolio).

### 6.5 Responsive Design Notes

- Tailwind utility classes ensure responsiveness (`flex-col`, `grid`, `sm:`, `lg:` breakpoints).
- Hero section uses background video overlay with CTA links.
- Portfolio & dashboard use responsive cards with gradient themes consistent with dark branding.

---

## 7. SDK Package

### 7.1 Structure

`packages/sdk/src` exports:

- `useDeposit(vaultAddress)`
- `useWithdraw(vaultAddress)`
- `useShares(vaultAddress, owner)`
- ABIs via `./abi/synthVault`

The package is built to `dist/` and consumed by the frontend via `file:` dependency in `apps/web/package.json`.

### 7.2 Build Command

```bash
cd packages/sdk
npm install
npm run build
```

The build outputs TypeScript declarations and compiled JS, prefixed with `'use client'` for React context compatibility.

---

## 8. Smart Contracts

### 8.1 Overview

- `SynthVault.sol`: Core ERC-4626 vault with deposit caps and pausability.
- `AdapterAaveMock.sol`: Mock adapter representing upstream yield sources.
- `MockUSDC.sol`: ERC-20 token for testing deposits.
- Tests located under `contracts/test`.

### 8.2 Commands

```bash
cd contracts
forge build
forge test
```

When running within WSL, ensure the Foundry binary is used (`~/.foundry/bin/forge`) to avoid PATH conflicts with other `forge` binaries.

### 8.3 Deployment Update Steps

1. Deploy via `forge script`.
2. Update backend `.env` (`VAULT_ADDRESS`) and frontend `.env.local` (`NEXT_PUBLIC_SYNTH_VAULT_ADDRESS`).
3. Rebuild SDK if ABI changed (`npm run build`).
4. Restart services and rerun tests/builds.

---

## 9. Testing & CI Checklist

| Area       | Command                                                                    |
|------------|----------------------------------------------------------------------------|
| Backend    | `cd backend && source .venv/bin/activate && pytest`                        |
| Frontend   | `cd apps/web && npm run lint && npm run build`                             |
| Contracts  | `cd contracts && ~/.foundry/bin/forge test`                                |
| SDK        | `cd packages/sdk && npm run build`                                         |

Run the full matrix before releasing or deploying.

---

## 10. Deployment Notes

- **Frontend**: Deploy via Vercel; set env vars (`NEXT_PUBLIC_*`). Ensure API base points to deployed backend.
- **Backend**: Deploy on Railway/Render/Fly.io. Provide `.env` with DB + RPC. Configure process to run `uvicorn app.main:app`.
- **Database**: Currently SQLite (file). For production, migrate to managed Postgres (update `DATABASE_URL` and SQLModel).
- **Contracts**: Deploy via Foundry script to Sepolia. Post-deployment, update env and docs.

Recommended pipeline:

1. Build & test locally (commands above).
2. Deploy backend, apply migrations if needed.
3. Deploy contracts (if new release).
4. Redeploy frontend with new env pointing to backend + vault.

---

## 11. API Reference (Backend)

### `POST /plan/`

Payload:

```json
{
  "risk_score": 5,
  "horizon_months": 12,
  "stablecoin_preference": "USDC"
}
```

Response (`PlanResponse`):

```json
{
  "plans": [
    {
      "name": "Conservative",
      "risk_level": "low",
      "est_apy": 0.145,
      "allocations": {
        "Stable Yield Vault": 0.66,
        "ETH Staking Notes": 0.2,
        "Liquidity Buffer": 0.1
      },
      "rationale": "Prioritises capital preservation..."
    },
    ...
  ]
}
```

### `GET /portfolio/{address}`

Returns aggregated totals and history. Positions are currently stubbed but follow:

```json
{
  "owner": "0xabc...",
  "total_value": 1200.0,
  "positions": [
    {
      "vault": "SynthVault",
      "shares": 23.45,
      "asset_value": 1200,
      "apy": 0.085
    }
  ],
  "history": [
    {
      "tx_type": "deposit",
      "amount": 250,
      "vault": "SynthVault",
      "timestamp": "2025-10-23T03:12:15Z"
    }
  ]
}
```

### `POST /tx/deposit` & `POST /tx/withdraw`

Payload:

```json
{
  "address": "0xabc...",
  "amount": 100,
  "vault": "SynthVault",
  "tx_hash": "0x123..."
}
```

Response: `{ "status": "logged", "type": "deposit" }`

### `GET /health`, `GET /`

Monitoring endpoints returning JSON health check & metadata.

---

## 12. Frontend Component Reference

### Landing Page

- **HeroSection**: Background video overlay, CTA links to `/dashboard`, includes benefit list.
- **CoreFeaturesSection**, **HowItWorksSection**, **WhyNexoraSection**: Grid-based responsive sections with icons.
- **FAQSection** & **FinalCTASection**: Reusable components for last-mile engagement.
- **Navbar**, **Footer**: Shared across routes; `Navbar` includes Connect Wallet button.

### Plans Page (`pages/plans.tsx`)

- Slider form for risk score, numeric input for horizon, select for stablecoin.
- `useMutation` triggers `POST /plan`; results displayed in responsive cards.
- Since wagmi is optional here, page works for guests but suggests connecting wallet.

### Dashboard (`pages/dashboard.tsx`)

- Client-only dynamic page (no SSR).
- State includes risk filter, selected plan, deposit modal visibility.
- Uses wagmi hooks `useAccount`, `useReadContract`, and SDK `useShares`.
- `BalanceCard` shows share/asset values with deposit + send (placeholder) actions.
- `SuggestedInvestmentsList` and `PositionsList` render backend data (React Query).
- `DepositDialog` integrates `useDeposit` and logs via backend.

### Portfolio (`pages/portfolio.tsx`)

- Client-only dynamic page.
- Fetches transaction history via `GET /portfolio/{address}` and displays on-chain balances.
- Reuses `VaultActions` for deposit/withdraw operations.

---

## 13. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `TypeError: Cannot read properties of null (reading 'useContext')` | wagmi hook run without provider (SSR) | Ensure page is client-only (`dynamic(..., { ssr: false })`) and `_app.tsx` is `'use client'`. |
| `WagmiProviderNotFoundError` | Provider not mounted before hook | Confirm `_app.tsx` wraps with `WagmiProvider` & `wagmiConfig` exported from `utils/wagmi`. |
| `next build` timeout on static pages | API fetch hanging or SSR hitting wallet hooks | Run backend concurrently or render pages client-only as implemented. |
| `forge` command showing SNAP usage text | Wrong forge binary (system package) | Use `~/.foundry/bin/forge` or add it to PATH. |
| `pytest` cannot import `app` | Repository path contains spaces | `pytest.ini` + `tests/conftest.py` already fix this; ensure you run tests from backend root. |
| Wallet connect fails on load | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` missing or wrong network | Verify `.env.local` values; ensure Sepolia RPC reachable. |

---

## 14. Spec Kit Integration

To collaborate using Spec Kit slash commands:

1. Install CLI: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`.
2. Run `/speckit.constitution` to load constitutional context.
3. `/speckit.specify` to review or update feature specs.
4. `/speckit.plan` + `/speckit.tasks` help break down work.
5. Update `spec/spec.yaml` with new routes/features to keep AI-assisted workflows accurate.

---

## 15. Roadmap Considerations

- **Replace stubbed portfolio positions** with real on-chain reads (viem/ethers).
- **Persist risk profile**: Save last selected risk level per address to DB and preload on dashboard.
- **Integrate analytics**: Add success/failure logging for deposit/withdraw flows.
- **Expand tests**: Add Vitest/React Testing Library suites for dashboard/portfolio (currently only dashboard test exists but excluded from Next page routes).
- **Upgrade to FastAPI lifespan events** to eliminate deprecation warnings.
- **Deploy pipeline**: Automate build/test/deploy per module using GitHub Actions (matrix for backend/frontend/contracts).

---

## 16. Quick Command Reference

```bash
# Backend
cd backend
source .venv/bin/activate
pytest
uvicorn app.main:app --reload

# Frontend
cd apps/web
npm run dev
npm run lint
npm run build

# SDK
cd packages/sdk
npm run build

# Contracts
cd contracts
~/.foundry/bin/forge test

# Full build sequence
packages/sdk/npm run build
backend/pytest
contracts/forge test
apps/web/npm run lint
apps/web/npm run build
```

---

## 17. Credits & Maintainers

- **Frontend lead**: handles Next.js features, wagmi integrations, responsive design.
- **Backend lead**: manages plan service, portfolio aggregation, DB schemas.
- **Solidity lead**: maintains `SynthVault` + mocks, ensures tests pass before deployments.
- **SDK maintainer**: coordinates shared hooks and ABIs between frontend & contracts.

For questions or onboarding sessions, leverage the architecture diagram (`docs/architecture.md`) and this handbook.

---

## 18. Appendix

### 18.1 Glossary

- **ERC-4626**: Tokenised vault standard used for SynthVault.
- **wagmi**: React hooks for Ethereum; handles connectors and contract interactions.
- **viem**: Type-safe Ethereum RPC client used underneath wagmi.
- **Sepolia**: Ethereum test network targeted by this MVP.
- **SQLModel**: ORM combining SQLAlchemy & Pydantic powering backend persistence.

### 18.2 Helpful Links

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [wagmi Docs](https://wagmi.sh)
- [Foundry Book](https://book.getfoundry.sh/)
- [ERC-4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)

---

This handbook should be updated whenever new modules or major features are introduced. Treat it as the canonical README++ for the project. Contributions are welcome—submit updates alongside feature PRs. Enjoy building NEXORA! 🎶🛠️

