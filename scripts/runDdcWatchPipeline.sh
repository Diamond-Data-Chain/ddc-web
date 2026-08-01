#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$HOME/DDC_Web_Concil/DDChain-Web_FIXED_v2/DDChain-Web"

cd "$PROJECT_DIR"

set -a
source .env.production
set +a

export BSC_MAINNET_RPC_URL="https://bsc-dataseed.bnbchain.org"

echo
echo "===== DDC WATCH PIPELINE $(date --iso-8601=seconds) ====="

echo
echo "===== SOURCE SCAN ====="
/usr/bin/node scripts/runDdcWatch.js

echo
echo "===== DDC TOKEN REGISTRATION ====="
./node_modules/.bin/hardhat run \
  scripts/registerPendingDdcWatchRecords.js \
  --network bscMainnet

echo
echo "===== PIPELINE COMPLETE ====="
