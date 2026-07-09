# DDC Treasury Policy Review

## Status
REVIEW REQUIRED

## Contract reviewed
archive/contracts_legacy/archive_mock_legacy/treasury/TreasuryPolicyVault.sol

## Current decision
Do not restore TreasuryPolicyVault to active production contracts yet.

## Reason
The contract contains explicit TODO(WP) notes and states that WP/Addendums do not fully define this contract.

TreasuryPolicyVault controls:
- wallet registry
- treasury outflows
- allocation limits
- allowed callers
- DAO mode
- commit policy
- purpose enforcement

Because this is a treasury execution contract, it requires separate production audit before activation.

## Current production stance
Treasury destination wallets are locked in WALLET_LOCK.md.

TreasuryPolicyVault is not part of the active live presale critical path until separately reviewed and approved.
