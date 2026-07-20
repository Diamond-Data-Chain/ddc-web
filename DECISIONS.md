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

## DDC Token / Presale Recorder

- DDC Coin remains the fixed-supply ERC-20 deployed from `contracts/DDCToken.sol`.
- DDC Token records are append-only Recorder entries and have no supply or mint limit.
- Presale writes purchases directly on-chain to `DDCPresaleRecorder`.
- Recorder writer is the Presale contract.
- Recorder ownership transfers to Treasury Safe 3/5.
- Project key is fixed to `DDC_PROJECT_V1`.
- Duplicate records are blocked by `(projectId, sourceRef)`.
- Affected files: Presale contract, Recorder contract, deploy, ownership, manifest and state verification scripts.
- Evidence: verified BNB Testnet Recorder ABI and working `/my-record` and `/public-ddc-token` flows.

## Mainnet ownership handoff

- Odluka: nakon kompletnog setup-a, svi deployovani ugovori koji implementiraju `Ownable` prenose ownership na Treasury multisig.
- Osnov: v1 pravilo „Ownable + multisig 3/5; ownership se prebacuje na multisig odmah nakon setup-a“.
- Treasury: `NEXT_PUBLIC_TREASURY_ADDRESS`.
- Pogođeni fajlovi: `scripts/deploy_prod.js`, `deployments/presale-mainnet.json`.
- Deploy se prekida ako potvrđeni `owner()` nije Treasury multisig.

## BSC Mainnet presale deployment — 2026-07-17

- Mreža: BSC Mainnet, chain ID 56.
- Presale početak: 2026-07-20T13:00:00Z / 1784552400.
- Treasury multisig: 0x08cF1a271b5a05165bBac6D655dD351F7eD61F1f.
- USDT: 0x55d398326f99059fF775485246999027B3197955.
- DDCToken: 0x94fB2B99248ba05fbC75Dd1C0C254A4C2fac86Ff.
- DDCRewardPool: 0xf44450e678256B2c8A243eD7AbAe5Eed2F7Bf1d9.
- DDCPresaleVesting: 0x03F81eA22C45d073924087aFe7DC7F8c0d522a01.
- DDCPresaleRecorder: 0x62a5D70E623feC9262497881a3B9C69EE1F97cDb.
- DDCTeamVesting: 0xA48F9e607168B1A9C258C9d697797e03518a3844.
- DDCAdvisorVesting: 0x264cA44c22dB44d7ee0060A6c5105f629B9f975a.
- DDCFoundationRelease: 0x1836806D3D92a98415eb6ECCb7bfc403272B72E0.
- DDCMonthlyOpsVault: 0xe4a83a9535F45f78eD9AeFfa1A3D583F188E29C5.
- DDCAdamasGrantVault: 0x5367A3A7eEC33D65fa7F8202C60B7e9E48960cA2.
- Recorder i RewardPool linkovi potvrđeni on-chain.
- Svi ugovori koji implementiraju Ownable preneti su na Treasury multisig.
- Mainnet manifest: deployments/presale-mainnet.json.
- ABI freeze v1: DDCPresaleVesting, DDCVestingVault, IDDCPresaleVesting; Recorder i RewardPool uključeni u aktivni live flow.
- Pogođeni fajlovi: .env.production, deployments/presale-mainnet.json, scripts/deploy_prod.js, scripts/verify_mainnet_deployment.js.

## Mainnet redeploy guard

- Odluka: `scripts/deploy_prod.js` blokira novi BSC Mainnet deploy kada postoji `deployments/presale-mainnet.json`.
- Razlog: sprečavanje slučajnog deploy-a drugog skupa produkcionih adresa.
- Emergency override postoji samo kroz eksplicitni `ALLOW_MAINNET_REDEPLOY=YES`.
- Pogođeni fajlovi: `scripts/deploy_prod.js`, `deployments/presale-mainnet.json`.

## 2026-07-19 — Presale batch duration frontend fix

- Odlučeno: `BATCH_DURATION_HOURS` vraćen sa test vrednosti `0.0166667` na `102.4`.
- Source: WP/Addendum — svaki presale batch traje 102.4h.
- Razlog: test vrednost je izazivala pogrešan virtualni batch prikaz na produkciji.
- Utiče na: `app/config/presaleConfig.ts`, `app/(sections)/PresaleDashboard.tsx`.

## 2026-07-20 — WalletProvider ostaje neizmenjen pre mainnet starta

Odluka:
- Ne uvoditi auto-sync/refactor u `app/WalletProvider.tsx` neposredno pre početka presale-a.
- Zvanični javni presale URL je `https://www.diamonddatachain.org/#presale`.
- `app.diamonddatachain.org` se ne promoviše kao javni ulaz dok se ponašanje wallet sesije između domena naknadno ne ujednači.

Razlog:
- Glavni domen pravilno prikazuje BNB Smart Chain, Chain ID 56.
- `Add DDC Network` pravilno prebacuje wallet na Chain ID 56.
- Izmena centralnog wallet providera neposredno pre starta nosi veći rizik od postojećeg UX odstupanja između dva origin-a.

Uticaj:
- `app/WalletProvider.tsx`: bez izmena.
- Marketing, navigacija i presale linkovi: koristiti samo `www.diamonddatachain.org/#presale`.
