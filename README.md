# DDC Presale v1

DDC Presale v1 is a batch-based USDT-only presale implementation on BSC Testnet / BSC deployment flow.

## Scope
Live v1 scope:
- Wallet connection
- Buy with USDT
- Batch status and totals
- Finalize after batch 40
- Unsold transfer to Reward Pool
- On-chain purchase recording via Recorder

Out of scope for v1:
- Native BNB buy path for production presale
- Claim UI
- Validator payout tracking
- Keeper deployment automation

## Key Design Decisions
- Presale is USDT-only by design.
- No oracle-based pricing is used.
- Batch progression is permissionless through `advanceIfEnded()`.
- Finalization is implemented on-chain.
- Reward Pool integration is implemented on-chain.
- Automation/keeper is not yet deployed as an always-on service.

## Repository Evidence
Testing and evidence are stored under:

- `docs/testing/FINAL_TEST_REPORT.md`
- `docs/testing/TEST_MATRIX.md`
- `docs/testing/EVIDENCE_INDEX.md`
- `docs/testing/KNOWN_LIMITATIONS.md`
- `docs/testing/final/presale_evidence.json`
- `docs/testing/final/recorder_storage.json`
- `docs/testing/final/soldout_final.json`
- `docs/testing/final/soldout_recorder.json`

## Current Status
Presale core flow is validated:
- batch progression
- min/max enforcement
- sold-out progression
- finalization
- reward pool transfer
- recorder storage

See `docs/testing/FINAL_TEST_REPORT.md` for the detailed test outcome.
