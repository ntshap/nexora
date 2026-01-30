#!/bin/bash

# NEXORA Testnet Deployment Script
# This script deploys NEXORA to Sepolia testnet

set -e  # Exit on error

echo "======================================"
echo "  NEXORA Testnet Deployment Script"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and fill in the values"
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$SEPOLIA_RPC_URL" ]; then
    echo "❌ Error: SEPOLIA_RPC_URL not set in .env"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Step 1: Deploy Smart Contracts
echo "📝 Step 1: Deploying Smart Contracts to Sepolia..."
echo "---------------------------------------------"
cd contracts

forge script script/Deploy.s.sol \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvv

if [ $? -eq 0 ]; then
    echo "✅ Smart contracts deployed successfully!"
    
    # Read deployment addresses
    if [ -f "deployment.json" ]; then
        echo ""
        echo "📋 Deployment Information:"
        cat deployment.json
        echo ""
    fi
else
    echo "❌ Smart contract deployment failed"
    exit 1
fi

cd ..

# Step 2: Update Backend Environment
echo ""
echo "📝 Step 2: Updating Backend Configuration..."
echo "---------------------------------------------"

if [ -f "contracts/deployment.json" ]; then
    VAULT_ADDRESS=$(cat contracts/deployment.json | grep -o '"vault": "[^"]*' | grep -o '[^"]*$')
    echo "VAULT_ADDRESS=$VAULT_ADDRESS" >> backend/.env
    echo "✅ Backend .env updated with vault address"
fi

# Step 3: Build and Test Backend
echo ""
echo "📝 Step 3: Testing Backend..."
echo "---------------------------------------------"
cd backend
source .venv/bin/activate
pytest
if [ $? -eq 0 ]; then
    echo "✅ Backend tests passed!"
else
    echo "❌ Backend tests failed"
    exit 1
fi
cd ..

# Step 4: Build Frontend
echo ""
echo "📝 Step 4: Building Frontend..."
echo "---------------------------------------------"
cd apps/web

# Update .env.local with deployment info
if [ -f "../../contracts/deployment.json" ]; then
    VAULT_ADDRESS=$(cat ../../contracts/deployment.json | grep -o '"vault": "[^"]*' | grep -o '[^"]*$')
    echo "NEXT_PUBLIC_VAULT_ADDRESS=$VAULT_ADDRESS" > .env.local
    echo "NEXT_PUBLIC_CHAIN_ID=11155111" >> .env.local
    echo "NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL:-http://localhost:8000}" >> .env.local
fi

npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ../..

# Summary
echo ""
echo "======================================"
echo "  🎉 Deployment Complete!"
echo "======================================"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Railway/Render"
echo "2. Deploy frontend to Vercel"
echo "3. Test the application on testnet"
echo "4. Monitor for any issues"
echo ""
echo "📝 Deployment Info:"
if [ -f "contracts/deployment.json" ]; then
    cat contracts/deployment.json
fi
echo ""
echo "🔗 Useful Links:"
echo "Sepolia Explorer: https://sepolia.etherscan.io/"
echo "Sepolia Faucet: https://sepoliafaucet.com/"
echo ""
