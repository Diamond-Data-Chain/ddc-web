#!/usr/bin/env bash
set -euo pipefail

while true; do
  echo
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') keeper tick ==="
  set -a
  source .env.local
  set +a
  npx hardhat run scripts/keeperAdvanceIfEnded.js --config hardhat.config.bscTestnet.js --network bscTestnet || true
  sleep 2
done
