# DDC Production Freeze

## Status
Production readiness freeze is active.

## Scope
This freeze applies to the DDC live presale release on BNB Smart Chain.

## Frozen items

### Smart contracts
- DDCToken supply logic
- DDCPresaleVesting presale logic
- DDCRewardPool accounting logic
- ABI surface used by frontend
- USDT-only live purchase flow
- Permissionless finalize
- Permissionless treasury sweep to configured treasury address

### Frontend
- No design changes
- No layout changes
- No visual redesign
- Only wiring, bugfixes, env fixes, and launch-critical runtime fixes allowed

### Wallets
- Treasury Safe address locked
- Signers locked
- Team beneficiary locked
- Advisors beneficiary locked
- Payroll wallet locked
- Adamas wallet locked
- Marketing wallet locked
- Advisors wallet locked

### Deployment
- One staging source of truth
- One production env source of truth
- No undocumented address changes
- No deploy without post-deploy verification

## Change rule
Any change to frozen items requires:
1. Explicit decision entry in DECISIONS.md
2. Code diff review
3. Build pass
4. Hardhat compile pass
5. Updated REPO_AUDIT.md
