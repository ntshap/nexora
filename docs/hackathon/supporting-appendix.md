# NEXORA Supporting Appendix

This appendix compiles evidence and reference data to back the claims made in the pitch deck and technical documentation.

## A. Contract Deployment Snapshot
- **Vault**: `SynthVault` (ERC-4626, pausible, deposit cap guard).
- **Network**: Sepolia Testnet.
- **Deployed address**: `0xfE9C01AB3D5BBD0497a9bACD52aaCB5dfdDc7fcc` *(2025-10-24)*.
- **Mock asset**: `MockUSDC` (18 decimals) - faucet balance seeded for demo accounts.
- **Key safety switches**: `pause()`, `unpause()`, `setDepositCap()`, role-based access via Ownable.
- **Next steps**: External audit before mainnet, integration tests against Aave/Compound adapters.

## B. API Contract
| Endpoint | Method | Purpose | Sample Payload |
|----------|--------|---------|----------------|
| `/plan` | POST | Generate 3 risk-based plans | `{ "risk_score": 5, "horizon_months": 12, "stablecoin_preference": "USDC" }` |
| `/portfolio/{address}` | GET | Aggregate on-chain balances + tx logs | - |
| `/preferences/{address}` | GET/PUT | Persist user risk preferences | `{ "risk_level": "medium", ... }` |
| `/tx/deposit` | POST | Log deposit intents (webhook-ready) | `{ "hash": "0x...", "plan": "balanced" }` |
| `/health` | GET | Operational heartbeat | - |

All endpoints return structured JSON with validation powered by Pydantic models (`backend/app/schemas`).

## C. Testing Evidence
- **Smart contracts**: `forge test` (covers deposit/withdraw, access control, cap enforcement).
- **Backend**: `pytest` suite for plan engine, portfolio service, and API responses (mocks viem client).
- **Frontend**: `npm run lint`, `npm run build`, plus unit tests in progress (React Testing Library scaffolding).
- **SDK**: `npm run build` ensures type-safe hooks and tree-shakable bundles.

CI integration todo: combine these commands in a GitHub Actions matrix (see Roadmap Phase 1).

## D. Security & Compliance Notes
- Non-custodial by design - keys never leave user wallet; backend only mirrors data.
- Input validation + rate limiting (depend on `fastapi-limiter`) mitigate spam on plan API.
- Contracts follow Checks-Effects-Interactions pattern; no re-entrancy surfaces.
- Roadmap includes third-party audit, bug bounty program, and chain monitoring alerts.
- UI copy emphasises risk disclaimer and encourages hardware wallet usage.

## E. Adoption Readiness
- **Personas validated**: Indie musician, freelance designer, digital artist (see PRD section 4).
- **Pilot pipeline**: 3 creative collectives shortlisted (Jakarta illustration guild, Bandung music label, Bali NFT studio).
- **Growth stack**: Landing page lead capture (Next.js form -> backend preferences store), email sequences via Resend, community Discord ready.
- **Success metrics**: Wallet connections, plan refresh rate, deposit conversion %, net promoter score.

## F. Demo Artifacts
- **Frontend**: Hosted preview (Vercel) - `https://nexora.vercel.app` *(configure env first)*.
- **Backend**: Railway deployment - `https://api.nexora.app/health`.
- **Repository**: https://github.com/nexora-labs/nexora.
- **Brand assets**: `docs/logo.png`, typography tokens in `apps/web/tailwind.config.ts`.

Keep this appendix updated alongside future releases to maintain transparency with judges, auditors, and ecosystem partners.
