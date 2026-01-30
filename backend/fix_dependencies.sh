#!/bin/bash

# Fix Web3 Dependency Issue
# Run this script from the backend directory

echo "Fixing web3 dependency compatibility issue..."

# Activate virtual environment
source .venv/bin/activate

# Uninstall conflicting packages
pip uninstall -y web3 eth-typing eth-abi eth-utils

# Reinstall with compatible versions
pip install web3==6.15.1 eth-typing==3.5.2

# Install remaining dependencies
pip install -r requirements.txt

echo "Done! Now you can run: pytest"
