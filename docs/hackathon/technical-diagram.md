# NEXORA Technical Architecture & Experience Blueprint

This document is designed for hackathon judges and potential integration partners. It captures how the Web, API, smart-contract, and analytics layers collaborate to deliver a non-custodial yield co-pilot tailored for creative professionals.

---

## 1. High-Level Architecture

```mermaid
flowchart LR
    subgraph Personas
        Creator[Creator Wallet<br/>MetaMask / WC]
        Partner[DAO / Agency Dashboard]
    end

    subgraph Frontend ["Web Experience<br/>apps/web"]
        NextJS[Next.js UI<br/>React Query + Tailwind]
        SDKClient[@nexora/sdk<br/>wagmi hooks]
        BottomNav["Floating App Switcher<br/>Dashboard / Plans / Portfolio"]
    end

    subgraph Backend ["API Layer<br/>backend/app"]
        FastAPI[FastAPI + Pydantic]
        Rules["Plan Engine<br/>(risk scoring)"]
        Prefs["Preference Store<br/>SQLModel"]
        LogsDB[(SQLite → PostgreSQL)]
    end

    subgraph Web3 ["On-chain Execution"]
        Vault{SynthVault<br/>ERC-4626<br/>0xfE9C...7fcc}
        MockUSDC[(MockUSDC<br/>asset token)]
        RPC["Sepolia RPC<br/>Infura"]
    end

    subgraph Analytics ["Observability & Growth Roadmap"]
        ETL[Event ETL<br/>BigQuery/Supabase]
        Metabase[Insights & Alerts]
    end

    Creator -->|Connect Wallet / Sign| NextJS
    Partner -->|Reporting Access| NextJS
    NextJS -->|wagmi config| SDKClient
    SDKClient -->|deposit / withdraw<br/>share balance| Vault
    SDKClient -->|read RPC| RPC
    NextJS -->|Risk inputs| FastAPI
    FastAPI --> Rules
    Rules -->|Plan JSON<br/>3 archetypes| NextJS
    FastAPI -->|Preference CRUD| Prefs
    FastAPI -->|Portfolio API| NextJS
    FastAPI -->|Transaction logs| LogsDB
    FastAPI -->|On-chain reads (viem)| Vault
    Vault -->|Events / receipts| LogsDB
    LogsDB -. roadmap .-> ETL
    ETL -. dashboards .-> Metabase
    Metabase -. alerts .-> Creator
```

**Key characteristics**
- **Non-custodial**: users sign transactions directly; backend never holds keys.
- **Composable**: `@nexora/sdk` exports reusable wagmi hooks for future mobile clients.
- **Observable**: all deposits/withdrawals are mirrored in a log store to power analytics, alerts, and compliance exports.

---

## 2. End-to-End User Journey

1. **Onboarding / Wallet Connection**  
   - The navbar logo routes home, while the floating BottomNav offers a consistent app switcher across Dashboard, Plans, and Portfolio.  
   - Wagmi enforces Sepolia default and exposes hooks (`useShares`, `useDeposit`, `useWithdraw`) via the SDK package.

2. **Risk Profiling & Plan Generation**  
   - `POST /plan` accepts `risk_score`, `horizon_months`, `stablecoin_preference`.  
   - FastAPI validates payloads and feeds the rule engine (currently conservative/balanced/growth heuristics; roadmap enables probabilistic scoring with volatility metrics).  
   - Response is cached client-side for 60 seconds to keep navigation snappy.

3. **Strategy Execution**  
   - Selecting a plan triggers the SDK to call SynthVault (ERC-4626). Approvals, deposits, and withdrawals are handled inside a single `useVaultTransactions` hook, including transaction receipt polling.
   - Vault deployment: `SynthVault` at `0xfE9C01AB3D5BBD0497a9bACD52aaCB5dfdDc7fcc` (Sepolia), seeded with MockUSDC for demo.

4. **Portfolio Intelligence**  
   - `GET /portfolio/<address>` merges on-chain share/asset conversions (via `viem`) with local transaction logs, providing balances, APY estimates, and activity history.  
   - React Query data is cached and only refreshed on demand or after completing a transaction.

5. **Observability & Growth**  
   - Logs are persisted for eventual ETL into a warehouse (BigQuery/Supabase).  
   - Planned dashboards (Metabase) will surface TVL trends, retention, plan adoption, and failure alerts; the same pipeline fuels partner/DAO reports.

---

## 3. Module Responsibilities

| Layer | Responsibilities | Tech Highlights |
|-------|------------------|-----------------|
| **Frontend** | Responsive UI, risk input forms, vault interactions, marketing pages (About, Why NEXORA). Floating BottomNav keeps core flows one tap away. | Next.js 14, React Query, Tailwind CSS, Framer Motion, wallet switching via wagmi + WalletConnect. |
| **Backend** | Plan generation, portfolio aggregation, preference persistence, transaction logging. | FastAPI, SQLModel, Pydantic validations, uvicorn deployment. |
| **SDK** | Typesafe hooks, share/deposit helpers, wagmi configuration guardrails. | Published as `@nexora/sdk` (file dependency), ensuring consistency across clients. |
| **Smart Contracts** | ERC-4626 vault, mock asset, safety controls (pause, deposit cap). | Foundry tooling, `forge script` deployment pipeline. |
| **Analytics (Roadmap)** | Event ETL, dashboards, proactive alerts for creatives & partners. | ETL to BigQuery/Supabase, Metabase, optional webhooks/Discord bots. |

---

## 4. Data Contracts & APIs

| Component | Input | Output | Notes |
|-----------|-------|--------|-------|
| `POST /plan` | Persona risk score, horizon, stablecoin preference | Array of plan objects (name, risk level, allocations, expected APY) | Future: integrate volatility feeds, protocol health metrics. |
| `GET /portfolio/<address>` | Wallet address | shares, assetValue, positions[], history[] | Combines on-chain read and log table; ready for mobile clients. |
| `PUT /preferences/<address>` | Risk preference payload | Saved record with timestamp | Enables personalised defaults when user revisits dashboard. |
| `@nexora/sdk` hooks | wagmi config, RPC provider | deposit/withdraw/share promises | Abstracts raw contract calls, keeps UI components lightweight. |

---

## 5. Security, Performance & Ops

**Security**
- Contracts follow Checks-Effects-Interactions and include `pause()` guardrails.
- Backend enforces schema validation, rate limiting (roadmap), and logs every transaction intent.
- App copy emphasises non-custodial nature and encourages hardware wallets.

**Performance**
- React Query cached responses (60s) reduce redundant fetches during navigation.
- Backend endpoints target sub-100 ms responses on Sepolia; heavy reads will be offloaded to a subgraph in Phase 2.
- Static assets (logo, hero gradients, fonts) optimised via Next.js pipeline.

**Operations**
- Foundry, pytest, and Next lint/build run locally; GitHub Actions matrix scheduled (see roadmap).  
- Deployment targets: FastAPI on Railway/Render (free tier), Next.js on Vercel.  
- Environment configuration stored in `.env`/`.env.local` (never committed).

---

## 6. Extensibility Roadmap

1. **Strategy Engine v2** – incorporate protocol risk, volatility scores, and creative income metadata.  
2. **Automated Alerts** – push notifications for yield changes, deposit caps, paused vaults.  
3. **Multi-vault & Cross-chain Support** – extend SDK to curated vault families (stETH, creative-DAO treasuries).  
4. **Mobile Companion** – React Native client reusing the same SDK hooks.  
5. **Partner API** – OAuth-secured endpoints for agencies to manage collective plans.

---

NEXORA’s modular architecture ensures creators remain in control, judges can audit each layer quickly, and partners can slot into clear touchpoints. This blueprint goes beyond a hackathon demo and sets the stage for a production-ready, scalable co-pilot for the creative economy.
