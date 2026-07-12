# DDC Decisions Log

## D-001 — Presale purchase asset
Status: Locked

Decision:
Live presale accepts USDT only.

Notes:
BNB purchase path is not part of the live production flow because the USDT pricing model is the canonical accounting unit.

---

## D-002 — Presale start
Status: Locked

Decision:
Presale is started exactly once using startPresaleOnce(uint64).

---

## D-003 — UI policy
Status: Locked

Decision:
No design changes during production readiness. Only bug fixes, wiring, and runtime fixes.

---

## D-004 — Team allocation
Status: Locked

Decision:
Team vesting beneficiary is intentionally not the Treasury Safe.

Verified:
0x06bC0482f31CA4a4a1A1A5A8231B5795E776Ba3A

---

## D-005 — Advisors allocation
Status: Locked

Decision:
Advisors beneficiary is the Treasury Safe.

Verified:
0x08cF1a271b5a05165bBac6D655dD351F7eD61F1f

---

## D-006 — Treasury sweep
Status: Locked

Decision:
USDT accumulated in the Presale contract is swept to Treasury after reaching the configured threshold.

Notes:
Live accounting is USDT-based.

---

## D-007 — Recorder role
Status: Locked

Decision:
Recorder is the DDC record/history layer for presale events.

Recorder does not receive DDC coin allocation.

Notes:
Recorder exists to preserve verifiable event history and supports DDC as the first use case.

---

## D-008 — Treasury assets
Status: Locked

Decision:
Treasury receives the 19.2M DDC Treasury allocation and also receives USDT raised during presale through treasury sweep/withdraw mechanisms.

Monthly Ops, Adamas, and Marketing operational payments are expected to be paid from Treasury USDT funds, not from DDC coin allocation before DDC has market value.

---

## D-009 — Monthly Operations USDT Vault
Status: Locked

Decision:
Monthly Operations receives 168,000 USDT per installment, every 30 days,
starting 30 days after presaleStart, for a maximum of 12 installments.

The release trigger is permissionless. The amount, schedule, payment count,
and recipient cannot be changed.

Recipient:
0x9c6778909831FcBd7BC0935a6d68f15A4ABf7bAF

Source:
Project treasury decision. TODO(WP): not explicitly specified in WP/Addendums.

Affected:
- contracts/treasury/DDCMonthlyOpsVault.sol

---

## D-010 — Adamas Grant USDT Vault
Status: Locked

Decision:
Adamas receives a one-time payment of 1,850,000 USDT after the presale is
finalized.

The release trigger is permissionless. The amount and recipient cannot be
changed.

Recipient:
0x90aDD10eb8742CE37bFd2E66c733f9423D41c3fd

Source:
Project treasury decision. TODO(WP): not explicitly specified in WP/Addendums.

Affected:
- contracts/treasury/DDCAdamasGrantVault.sol

---

## D-011 — TGE activation is separate from Presale

Status: Locked

Decision:
Presale launch does not activate vesting.

During Presale:
- tgeTimestamp remains 0
- buyer claimable remains 0
- Team, Advisors and Foundation vesting remain inactive

TGE is activated once, in the future, when the DDC network is formally launched.

The same protocol-wide TGE timestamp must be set once on:
- DDCPresaleVesting
- DDCTeamVesting
- DDCAdvisorVesting
- DDCFoundationRelease

After it is set, the TGE timestamp is immutable.

Source:
Whitepaper vesting framework and Addendums v1.0.1, v1.0.2 and v1.0.3.

Affected:
- contracts/presale/DDCPresaleVesting.sol
- contracts/vesting/DDCTeamVesting.sol
- contracts/vesting/DDCAdvisorVesting.sol
- contracts/vesting/DDCFoundationRelease.sol
- PRESALE_LAUNCH_RUNBOOK.md

