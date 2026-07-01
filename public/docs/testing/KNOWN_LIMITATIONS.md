# Known Limitations

## 1. No always-on keeper deployed
Finalization and batch progression are implemented in-contract via `advanceIfEnded()`.

Current limitation:
- an always-on keeper / automation service is not yet deployed

Impact:
- contract logic is correct
- production automation still needs deployment

## 2. No browser automation suite yet
Current evidence is based on:
- on-chain exported JSON
- controlled manual smoke validation

Impact:
- repository contains strong evidence
- but not a Playwright/Cypress browser automation package yet

## 3. Reward pool validator payout tracking not in current scope
Reward Pool validator payout accounting is deferred until later protocol phase.

Current scope covers:
- unsold transfer
- burn lock accounting
- reward eligible accounting

## 4. Presale is intentionally USDT-only
Native BNB purchase path is not part of production presale scope.

Reason:
- deterministic pricing
- no oracle dependency
- no volatility risk in sale pricing
