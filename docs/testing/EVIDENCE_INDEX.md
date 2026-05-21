# Evidence Index

## Main evidence files

### 1. Canonical presale evidence
File:
- `docs/testing/final/presale_evidence.json`

Contains:
- current batch
- total batches
- finalized flag
- finalized totals
- reward pool state

### 2. Canonical recorder evidence
File:
- `docs/testing/final/recorder_storage.json`

Contains:
- per-user purchase count
- per-user purchase records
- source references
- timestamps

### 3. Sold-out final evidence
File:
- `docs/testing/final/soldout_final.json`

Contains:
- finalized sold-out smoke final state
- reward pool state after finalize

### 4. Sold-out recorder evidence
File:
- `docs/testing/final/soldout_recorder.json`

Contains:
- sold-out smoke purchase history
- source references
- timestamps

## How to read the evidence
- `sourceRef` is the transaction reference used for traceability
- `payAmountUSDT` is normalized in 6 decimals
- `ddcAmountDDC` is normalized in 18 decimals

## Evidence conclusions
- purchases were recorded on-chain
- presale finalized on-chain
- unsold moved to reward pool on-chain
- ended UI matched finalized on-chain state
