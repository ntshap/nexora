# NEXORA Roadmap

This roadmap extends the MVP delivered for the hackathon into staged releases. Each phase lists key outcomes, technical scope, owner disciplines, and readiness signals.

## Phase 0 - Hackathon MVP (Week 0)
- **Deliverables**: Wallet connect, risk plan API, SynthVault deposit/withdraw, dashboard with mocked portfolio mix.
- **Status**: Complete - forms the baseline demo.

## Phase 1 - Foundation Hardening (Weeks 1-4)
- **Replace stubbed portfolio positions** with live on-chain reads (`viem` multicall, vault share accounting).
- **Persist user preferences** using SQLModel migrations; surface last-selected risk band on login.
- **Add CI pipelines** (GitHub Actions) covering `forge test`, `pytest`, `npm run lint && npm run build`.
- **Ship security baseline**: contract pause guardian, backend rate limiting, unit tests for failure paths.
- **Acceptance signals**: Dashboard values match Sepolia explorer, green CI badge, incident runbook drafted.

## Phase 2 - Intelligent Insights (Months 2-3)
- **On-chain indexing**: Launch The Graph (or Subsquid) subgraph for deposit/withdraw history; sync to analytics DB.
- **Strategy engine v2**: Integrate risk factors (volatility, protocol health) to augment rule-based scoring.
- **Notifications MVP**: Email/web push alerts for yield changes, cap breaches, paused vaults.
- **UX enhancements**: Portfolio segmentation by strategy, AI copy hints for creatives, dark/light theming.
- **Acceptance signals**: Users receive actionable alerts; judges can trace every vault event in analytics studio.

## Phase 3 - Ecosystem Expansion (Months 4-6)
- **New vault families**: Launch ETH / stETH and creator-crowdfund vaults with audited adapters.
- **Partner integrations**: Embed with music & design DAO treasuries; expose public API keys for third parties.
- **Mobile companion**: React Native client reusing `@nexora/sdk`.
- **Compliance tooling**: Exportable tax & royalty statements, localized disclaimers (ID, EN).
- **Acceptance signals**: 3+ partner pilots live; monthly active creatives > 5k.

## Phase 4 - Automation & Scale (Months 7-12)
- **Autonomous treasury ops**: Governance-controlled parameter updates via Safe module; continuous deployment gates.
- **Risk ops automation**: On-call runbooks + anomaly detection (chainlink proof-of-reserves, bridges, protocol risk).
- **Revenue features**: Fee tiering, revenue share dashboard for ecosystem contributors.
- **Global rollout**: Mainnet deployment, fiat on/off ramps with regulated partners, multi-language support.
- **Acceptance signals**: Mainnet TVL >= $5M equivalent, regulatory compliance review passed, NPS >= 45.

## Cross-Cutting Initiatives
- **Community & education**: Publish creator-focused DeFi primers, host monthly demo sessions, reward feedback.
- **Data governance**: Implement event versioning, define retention policies, audit logs for every admin action.
- **People & process**: Expand core team (frontend, backend, solidity, growth), adopt OKRs aligned with roadmap.

This sequencing keeps the momentum from the hackathon while making room for risk reduction, analytics depth, and ecosystem growth. Each phase is scoped to be shippable within the stated window yet flexible enough to accommodate partner demand.
