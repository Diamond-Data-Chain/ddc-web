# DDC Decisions Log (v1)

## Presale Architecture
- DDCPresaleVesting is single source of truth for presale logic
- No manual batch manipulation (no setBatch in production)
- Batch progression is deterministic (time + sold-out logic)

## Token
- DDCToken is fixed supply (mint only in constructor)
- No post-deploy mint possible

## TGE
- setTGE can be called once
- Must be in the future
- Claim disabled until TGE

## Vesting
- 50% burn allocation
- 50% vesting allocation
- Claimable only after TGE

## Finalize
- Permissionless
- Only after last batch
- No admin override

## Admin / Security
- No hidden mint
- No upgradeability
- No owner manipulation of core logic

## Scripts Policy
- scripts/ contains ONLY production flow
- All test/mock scripts moved to archive_mock_legacy

- withdrawRaisedFunds controlled by multisig owner (temporary v1 constraint)
