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
