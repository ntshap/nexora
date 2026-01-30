# NEXORA - DeFi Co-Pilot for Creative Professionals

NEXORA is a production-ready, non-custodial DeFi platform built for creative professionals. This monorepo contains a Next.js frontend, FastAPI backend, Solidity ERC-4626 vaults with security enhancements, and a shared TypeScript SDK.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://github.com/ntshap/nexora/workflows/CI/badge.svg)](https://github.com/ntshap/nexora/actions)

## 🚀 Quick Start

### Development with Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/ntshap/nexora.git
cd nexora

# Copy environment files
cp backend/.env.example backend/.env
cp apps/web/.env.example apps/web/.env.local

# Start all services
docker-compose up -d

# Frontend will be at http://localhost:3000
# Backend API at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Manual Setup

**Prerequisites:**
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ (SQLite for dev)
- Redis 7+ (optional, for rate limiting)
- Foundry for smart contracts

---

## 📁 Repository Structure

```
nexora/
├── apps/
│   └── web/              # Next.js 14 frontend
├── backend/              # FastAPI service
├── contracts/            # Foundry/Solidity contracts
├── packages/
│   └── sdk/             # TypeScript SDK with wagmi hooks
├── docs/                # Architecture & specifications
└── .github/workflows/   # CI/CD pipelines
```

---

## 🎨 Frontend Setup (Next.js)

```bash
cd apps/web
npm install
npm run dev              # Development server on :3000
```

**Environment Variables** (`apps/web/.env.local`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_VAULT_ADDRESS=0x...
```

**Production Build:**

```bash
npm run build           # Standard build
npm run build:local     # With SSG timeout disabled
```

**Key Features:**
- ✅ Error boundary for graceful error handling
- ✅ Transaction status with color-coded feedback
- ✅ Wallet connection edge case handling
- ✅ Security headers configured
- ✅ React Query with retry logic

---

## 🔧 Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Environment Variables** (`backend/.env`):

```env
DATABASE_URL=postgresql://user:pass@localhost/nexora
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
BACKUP_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
VAULT_ADDRESS=0x...
REDIS_URL=redis://localhost:6379/0
ALLOWED_ORIGINS=http://localhost:3000,https://nexora.app
RATE_LIMIT_PER_MINUTE=60
ENVIRONMENT=development
```

**Production Features:**
- ✅ Rate limiting (60 req/min default)
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ Structured logging with context
- ✅ Health checks with dependency monitoring
- ✅ RPC failover with backup provider
- ✅ Global error handling

---

## 🔐 Smart Contracts (Foundry)

```bash
cd contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test -vvv

# Coverage report
forge coverage

# Gas report
forge test --gas-report
```

**Deploy to Testnet:**

```bash
# Set environment variables
export PRIVATE_KEY=0x...
export RPC_URL=https://sepolia.infura.io/v3/...

# Deploy
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

**Security Enhancements:**
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Custom errors for gas optimization
- ✅ SafeERC20 for token transfers
- ✅ Withdrawal fees configurable (max 5%)
- ✅ Performance fees (max 20%)
- ✅ Emergency pause mechanism
- ✅ Deposit cap enforcement
- ✅ Fuzz testing implemented

---

## 📦 SDK Package

TypeScript hooks for vault interactions using wagmi.

```bash
cd packages/sdk
npm install
npm run build
```

Used by the frontend via `file:` dependency.

---

## 🧪 Testing

### Run All Tests

```bash
# Frontend
cd apps/web && npm test

# Backend
cd backend && pytest --cov=app

# Contracts
cd contracts && forge test
```

### E2E Testing (Coming Soon)

```bash
npx playwright test
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
vercel --prod
```

Or use GitHub Actions workflow on push to `main`.

### Backend (Railway/Render)

```bash
# Railway
railway up

# Or Docker deployment
docker build -t nexora-backend ./backend
docker run -p 8000:8000 nexora-backend
```

### Contracts (Mainnet)

**⚠️ CRITICAL: Before mainnet deployment:**
1. Complete professional security audit
2. Set up multisig wallet for ownership
3. Configure guardian role
4. Test emergency procedures
5. Set appropriate deposit caps

```bash
forge script script/Deploy.s.sol \
  --rpc-url $MAINNET_RPC \
  --private-key $DEPLOYER_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_KEY
```

---

## 📊 Monitoring & Observability

- **Errors:** Sentry (configure `SENTRY_DSN`)
- **Analytics:** PostHog (configure `POSTHOG_KEY`)
- **Uptime:** UptimeRobot or similar
- **Logs:** Structured logging with contextual data

---

## 🔒 Security

### Audits
- [ ] Smart contract audit pending
- [ ] Penetration testing pending
- [ ] Bug bounty program (Immunefi) - Coming soon

### Reporting Vulnerabilities

Email: security@nexora.app (setup pending)

**Please do NOT open public issues for security vulnerabilities.**

---

## 📈 Performance

- Lighthouse Score: Target > 90
- API Response Time: < 200ms (p95)
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Wagmi for excellent React hooks
- FastAPI for production-ready Python framework
- Foundry for Solidity development

---

## 📞 Support

- Discord: [Coming Soon]
- Twitter: [@NexoraApp](https://twitter.com/NexoraApp) (setup pending)
- Email: support@nexora.app (setup pending)

---

## 🗺️ Roadmap

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for detailed production readiness tasks.

**Phase 1 - MVP (Current)**
- ✅ Core vault functionality
- ✅ Basic UI/UX
- ✅ Risk assessment
- ⏳ Security enhancements
- ⏳ Production infrastructure

**Phase 2 - Testnet Launch (Q1 2026)**
- Professional audit
- Beta testing program
- Community building

**Phase 3 - Mainnet (Q2 2026)**
- Mainnet deployment
- Marketing campaign
- Partnership integrations

---

Built with ❤️ by the NEXORA team
