# DDC Presale Launch Runbook

Version: 1.0
Status: Production Draft

---

# Purpose

This document defines the operational procedure for launching the public DDC Presale on BNB Smart Chain.

This is NOT a development document.

This document is used only during the live launch procedure.

---

# Source of Truth

Before launch verify:

- Whitepaper
- Whitepaper Addendums
- DECISIONS.md
- PRODUCTION_FREEZE.md
- LAUNCH_CHECKLIST.md
- WALLET_LOCK.md
- REPO_AUDIT.md

---

# Phase 1 — Repository Verification

Verify:

- latest GitHub main branch
- working tree clean
- npm run build = PASS
- hardhat compile = PASS

Record commit hash used for launch.

---

# Phase 2 — Environment Verification

Verify production environment:

- RPC URL
- Chain ID
- DDC Token
- Presale
- RewardPool
- Recorder
- Treasury
- USDT
- WalletConnect Project ID

No address may be changed after this point.

---

# Phase 3 — Contract Verification

Verify on-chain:

- DDCToken
- DDCPresaleVesting
- DDCRewardPool
- Recorder

Verify ownership.

Verify RewardPool linkage.

Verify Presale linkage.

---

# Phase 4 — Funding Verification

Verify:

- Presale funded
- RewardPool funded
- Token balances correct

---

# Phase 5 — Ownership Verification

Verify owner.

Verify Treasury configuration.

Verify Team beneficiary.

Verify Advisors beneficiary.

---

# Phase 6 — Presale Activation

Execute:

startPresaleOnce(uint64)

Verify:

- Batch #1 active
- countdown started
- price correct

---

# Phase 7 — Live Validation

Perform one small live purchase.

Verify:

- transaction mined
- Recorder updated
- purchased amount updated
- vesting updated
- batch statistics updated

---

# Phase 8 — Monitoring

Monitor:

- purchases
- RewardPool
- Recorder
- Treasury sweep
- batch rollover

---

# Incident Procedure

If a launch-critical issue is discovered:

1. Pause (if applicable).
2. Record incident.
3. Determine root cause.
4. Fix.
5. Re-verify.
6. Resume only after verification.

---

# Launch Complete

Record:

Date:

Time:

Git Commit:

Contract Addresses:

Operator:

Notes:

