# NEXORA Monorepo

NEXORA is a non-custodial DeFi co-pilot for creative professionals. The monorepo bundles the Next.js marketing + app surface, a FastAPI backend, Solidity ERC-4626 vaults, and a shared TypeScript SDK.

## Repository Layout

- `apps/web` - Next.js 14 app (landing page, plans form, portfolio dashboard).
- `backend` - FastAPI service exposing `/plan`, `/portfolio`, `/tx/*`, and `/health` endpoints.
- `contracts` - Foundry project containing `SynthVault` (ERC-4626), adapter mock, and tests.
- `packages/sdk` - Reusable wagmi hooks, ABIs, and shared types.
- `docs/` - Architecture, problem statement, supporting notes.
- `spec/spec.yaml` - Functional specification consumed by Spec Kit.

## Prerequisites

- Node.js 18+
- Python 3.11+
- Foundry (`curl -L https://foundry.paradigm.xyz | bash`)
- pnpm/npx optional for Spec Kit (`uv` recommended)

## Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

Environment variables (`apps/web/.env.local`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<walletconnect>
NEXT_PUBLIC_SYNTH_VAULT_ADDRESS=0x...
```

Scripts of interest:

- `npm run lint` - linting
- `npm run build` - production build (ensure the backend/API is reachable)
- `npm run build:local` - wraps `NEXT_DISABLE_SSG_TIMEOUT=1 npm run build` for local pipelines

> Tip: keep the FastAPI server running while building so SSR/SSG fetches resolve quickly.

## Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --break-system-packages -r requirements.txt
python3 -m pytest
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Environment variables (`DATABASE_URL`, `RPC_URL`, etc.) live in the root `.env` (copy from `.env.example`).

## Smart Contracts (Foundry)

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-git
forge install foundry-rs/forge-std --no-git
forge build
forge test
```

Deployment (Sepolia example):

```
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

Record the deployed vault address in both the backend `.env` and `apps/web/.env.local`.

## SDK Package

TypeScript hooks that wrap wagmi operations. Build with `npm run build` from `packages/sdk`. The Next.js project consumes the package via a `file:` dependency and tsconfig path alias.

## Spec Kit Workflow

1. `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`
2. `specify init .`
3. Use slash commands in your AI assistant: `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`.
4. Keep `spec/spec.yaml` as the source of truth when evolving features.

## Testing Checklist

- SDK: `cd packages/sdk && npm run build`
- Web: `npm run lint` and `npm run build:local`
- Backend: `python3 -m pytest`
- Contracts: `forge test`

## Deployment Targets

- Frontend: Vercel
- Backend: Railway/Render (FastAPI + SQLite/pg)
- Contracts: Sepolia via Foundry script

Track progress using the roadmap in `Product Requirements Document (PRD).txt` and the acceptance criteria embedded inside `spec/spec.yaml`.
