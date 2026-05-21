# DDC Presale Test Runs

## 01. Canonical USDT presale
Status: TODO

Tests:
- [ ] Connect wallet
- [ ] Approve USDT
- [ ] Buy happy path
- [ ] Buy under min -> FAIL
- [ ] Buy over max -> FAIL
- [ ] MAX after partial buy
- [ ] Time rollover
- [ ] Batch 40 finalize
- [ ] RewardPool reconciliation
- [ ] UI ended state
- [ ] Buy after finalize -> FAIL
- [ ] Recorder evidence

## 02. Sold-out smoke
Status: TODO

Tests:
- [ ] Sold-out in same batch
- [ ] Instant advance to next batch
- [ ] Price jump immediately
- [ ] Recorder evidence

Notes:
- Presale is USDT-only by design.
- Native BNB buy is not part of canonical presale scope.

## SOLD-OUT SMOKE (5000 DDC / batch) — PAUSED
Reason: insufficient tBNB for gas before full completion
Last confirmed progress: batch 23
Status: resume later on same test objective, do not mark PASS yet


## SOLD-OUT SMOKE (5000 DDC / batch)
Status: PASS

Verified:
- sold-out instant batch advance
- finalize after batch 40
- unsold moved to RewardPool
- because total presale fund was only 200,000 DDC, all unsold remained below 51.2M burn target
- therefore rewardEligible = 0 is expected in this run

