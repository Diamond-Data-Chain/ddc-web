# Test Matrix

| Area | Test | Status | Notes |
|---|---|---:|---|
| Wallet | Connect wallet | PASS | Verified in UI |
| Payment | Approve USDT | PASS | Verified in UI |
| Payment | Buy with USDT | PASS | Verified in UI + recorder |
| Limits | Under min buy rejected | PASS | Manual smoke validation |
| Limits | Over max buy rejected | PASS | Manual smoke validation |
| Limits | MAX respects batch spent | PASS | Fixed and verified |
| Batch | Sold-out progression | PASS | Verified in scaled smoke |
| Batch | Time-ended progression | PASS | Verified after sync fix |
| Batch | No `Batch not started yet` gap after valid transition | PASS | Verified after sync fix |
| Finalize | Batch 40 finalize | PASS | `advanceIfEnded()` |
| Reward Pool | Unsold transfer on finalize | PASS | Verified |
| Reward Pool | Burn lock accounting | PASS | Verified |
| Reward Pool | Reward eligible remainder on larger canonical run | PASS | Verified in canonical run |
| Recorder | Purchase storage | PASS | Verified |
| UI | Presale ended state | PASS | Verified |
| Automation | Always-on keeper deployed | NOT DONE | Contract finalize exists; service not deployed |
