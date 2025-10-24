# NEXORA Technical & User Flow

The diagram below illustrates how each module (web, backend, contracts, SDK) collaborates to deliver personalised, non-custodial yield plans for creative professionals.

```mermaid
flowchart LR
    subgraph User
        U[Creative Professional]
    end

    subgraph Frontend
        F[Next.js App<br/>apps/web]
    end

    subgraph Backend
        B[FastAPI Service<br/>backend/app]
        DB[(SQLite -> PostgreSQL)]
        Rules[Risk Plan Engine]
    end

    subgraph Web3
        SDK[@nexora/sdk<br/>wagmi hooks]
        Vault{SynthVault<br/>ERC-4626}
        Token[(Mock USDC<br/>Sepolia)]
    end

    subgraph Observability
        Logs[(Transaction Log<br/>/analytics pipeline)]
        BI[(Analytics & Alerts)]
    end

    U -->|Connect wallet| F
    F -->|wagmi config<br/>WalletConnect| SDK
    SDK -->|RPC calls| Vault
    Vault --> Token
    F -->|Risk inputs| B
    B --> Rules
    Rules -->|Plan JSON| F
    F -->|Plan selection| SDK
    SDK -->|deposit/withdraw| Vault
    Vault -->|on-chain events| Logs
    B -->|Log tx + portfolio| DB
    B -->|Portfolio API| F
    Logs -->|Batch ETL| BI
    BI -->|Insights| F
    BI -->|Alerts| U
    B -->|RPC reads| Vault
    B -->|Webhook roadmap| F
```

## Flow Narrative
- **1. Wallet handshake** - The user authenticates via MetaMask/WalletConnect. The Next.js client bootstraps wagmi + `@nexora/sdk` hooks to enforce Sepolia network and expose `useDeposit`, `useWithdraw`, and `useShares`.
- **2. Risk profiling** - The dashboard posts the user's risk tolerance, horizon, and stablecoin preference to `POST /plan`. The FastAPI rules engine returns three plan archetypes (Conservative/Balanced/Growth) in JSON.
- **3. Strategy execution** - When the user selects a plan, React Query triggers the SDK hooks to approve and deposit into `SynthVault` (ERC-4626). Withdrawals reuse the same flow in reverse.
- **4. Portfolio intelligence** - The backend composes on-chain reads (`viem` RPC) with local transaction logs to serve `GET /portfolio/{address}`. These feeds power the dashboard balance card and positions list.
- **5. Observability roadmap** - Vault events and backend logs roll into an analytics layer (BigQuery/Supabase + Metabase) that will unlock alerts, automated compliance exports, and DAO reporting.

This foundation keeps custody with the user, fragments responsibilities per module, and makes it easy to extend the SDK to future mobile clients or partner integrations.
