# DDC Presale v1 - Final Test Report

## Overview
This document summarizes completed testing of the DDC presale flow on BSC Testnet.

## Tested Scope
- wallet connection
- USDT approve
- buy with USDT
- min/max rules
- MAX logic
- batch progression
- sold-out progression
- time-based progression
- finalize after batch 40
- Reward Pool integration
- Recorder storage

## Important Clarification
Finalization is implemented in the smart contract.

What is not deployed yet:
- always-on keeper / automation service that would trigger `advanceIfEnded()` automatically in production-like operation

This means:
- contract logic is complete
- automation layer is still optional / pending deployment

---

## Test Result Summary

### A. Canonical presale flow
Status: PASS

Verified:
- connect wallet
- approve USDT
- buy with USDT
- MAX behavior fixed
- batch rollover works
- finalization works
- UI shows `Presale ended`
- Reward Pool split logic works
- Recorder stores purchases

Evidence:
- `docs/testing/final/presale_evidence.json`
- `docs/testing/final/recorder_storage.json`

### B. Sold-out smoke
Status: PASS

Verified:
- scaled batch hardcap sold out from a single wallet
- sold-out transition behavior validated during UI run
- finalize after batch 40 works
- ended UI state works
- Reward Pool receives unsold after finalization
- Recorder stores full sold-out smoke history

Evidence:
- `docs/testing/final/soldout_final.json`
- `docs/testing/final/soldout_recorder.json`

### C. Under-min / Over-max / MAX behavior
Status: PASS

Verified:
- under minimum buy rejected
- over maximum buy rejected
- MAX button respects already-spent amount in the same batch

Evidence:
- validated during smoke run and debugging cycle
- reflected in final fixed UI / contract behavior

### D. Reward Pool logic
Status: PASS

Canonical behavior:
- finalize moves unsold into Reward Pool
- burn lock accounting works
- reward-eligible remainder appears when unsold exceeds burn target need

Scaled sold-out behavior:
- when unsold is far below burn target, all unsold remains in `burnLocked`
- `rewardEligible = 0` is expected in that case

### E. Recorder storage
Status: PASS

Verified:
- per-user purchase count
- per-user purchase list
- stored fields:
  - ddcAmount
  - payAsset
  - payAmount
  - payMethod
  - memoHash
  - sourceRef
  - timestamp

---

## Key Fixes Implemented During Testing
1. MAX button wallet-per-batch cap read fix
2. ABI/source mismatch fix for presale reads
3. Read-only batch autoskip tuple fix
4. Finalized UI ended-state fix
5. Reward Pool finalize integration
6. Reward Pool page addendum schedule correction
7. Immediate transition activation fix
8. Post-buy `_syncCurrentBatch()` fix

---

## Final Conclusion
DDC Presale v1 core behavior is validated.

Validated:
- presale buy lifecycle
- batch progression
- finalization
- reward pool transfer
- recorder audit trail
- ended UI state

Not yet deployed:
- always-on keeper / automation service

This repository is suitable for GitHub publication with attached evidence files.
