# DDC Production Readiness Repo Audit

## Scope
Active files audited from:
- contracts/
- app/
- components/
- scripts/

Legacy snapshots moved to:
- repo_archive/legacy_snapshots/

Active file count:
111

## Current verified runtime deployment

Source:
https://www.diamonddatachain.org/env-check

Network:
BSC Testnet, chainId 97

DDC_TOKEN=0x9464b89e386e225E5DBE84D4e23d665d26dd9836
PRESALE=0x1E6E9b851838Cc91F0429b7ee2CEc26Fb7c3AfF0
REWARD_POOL=0x39161F935A52687D7Ef9C725Ea8dc4F9a6a16501
RECORDER=0x295BBb1e9b6c7C339C5B96bf0532F467f35dC166
USDT=0x225064Ea7c9077763059AE8C22553790F6f4661c

## Current verified ownership

PRESALE_OWNER=0xA94568bF1B50a06efDebc5846A1252410A65CA32
REWARD_POOL_OWNER=0xA94568bF1B50a06efDebc5846A1252410A65CA32
RECORDER_OWNER=0xA94568bF1B50a06efDebc5846A1252410A65CA32

## Treasury / beneficiary lock

TREASURY_SAFE=0x08cF1a271b5a05165bBac6D655dD351F7eD61F1f
TEAM_VAULT=0xF2d447b99cD0d4F87808250432Ca0A2f0F0b5C69
TEAM_BENEFICIARY=0x06bC0482f31CA4a4a1A1A5A8231B5795E776Ba3A
ADVISORS_VAULT=0x632B07925Dc9656d2cF17d30C2cFc728bc5B37a4
ADVISORS_BENEFICIARY=0x08cF1a271b5a05165bBac6D655dD351F7eD61F1f

PAYROLL=0x9c6778909831fcbd7bc0935a6d68f15a4abf7baf
ADAMAS=0x90add10eb8742ce37bfd2e66c733f9423d41c3fd
MARKETING=0xd837ec2a90e51b5795794635c5d0c82d986a5f58
ADVISORS_WALLET=0x4165de7dfeadb6bebab4c076623cbcd0cfe48aae

## Locked architecture rules

- Live presale payment asset: USDT only.
- BNB buy is disabled for live flow.
- Treasury sweep threshold: 10,000 USDT.
- sweepRaisedFundsToTreasury() is permissionless and always sends funds to treasury.
- finalize() is permissionless.
- RewardPool setPresaleOnce() is one-time only.
- Team beneficiary is intentionally not Treasury Safe.
- Advisors beneficiary is Treasury Safe.
- Design must not be changed during production readiness.

## Audit status

### Contracts
PENDING

### Frontend
PENDING

### Scripts
PENDING

### ABI
PENDING

### Env / deployment
PENDING


---

## Contract audit: contracts/presale/DDCPresaleVesting.sol

STATUS: VERIFIED

Checked:
- pause(): onlyOwner
- unpause(): onlyOwner
- setTGE(uint64): onlyOwner, one-time TGE activation
- buy flow: public, nonReentrant, whenNotPaused
- claim(): public, nonReentrant
- finalize(): permissionless, nonReentrant
- sweepRaisedFundsToTreasury(): permissionless, nonReentrant
- withdrawRaisedFunds(): treasury-only, nonReentrant, after finalized

Architecture confirmation:
- Live payment asset is USDT-only.
- BNB buy is not part of live flow.
- Treasury sweep at 10,000 USDT is intentional.
- sweepRaisedFundsToTreasury() is permissionless by design and always sends funds to treasury.
- finalize() is permissionless by design.
- pause/unpause affects buy flow, not claim/finalize.
