# DDC Launch Checklist

## 1. Repo / Build
- [x] Legacy snapshots archived
- [x] Contracts tracked in Git
- [x] Scripts tracked in Git
- [x] Hardhat config tracked in Git
- [x] npm run build PASS
- [x] npx hardhat compile PASS

## 2. Contracts
- [x] DDCToken audited
- [x] DDCPresaleVesting audited
- [x] DDCRewardPool audited
- [x] ABI standardized

## 3. Current Staging Runtime
- [x] Vercel /env-check verified
- [x] DDC contract code exists
- [x] Presale contract code exists
- [x] RewardPool contract code exists
- [x] Recorder contract code exists
- [x] USDT contract code exists

## 4. Treasury / Wallets
- [x] Treasury Safe locked
- [x] Signers locked
- [x] Payroll wallet locked
- [x] Adamas wallet locked
- [x] Marketing wallet locked
- [x] Advisors wallet locked
- [x] Team beneficiary confirmed intentional

## 5. E2E Presale
- [ ] WalletConnect connect
- [ ] MetaMask connect
- [ ] Correct chain check
- [ ] USDT allowance
- [ ] USDT buy
- [ ] Batch status updates
- [ ] User purchased updates
- [ ] Recorder updates
- [ ] Treasury sweep behavior checked

## 6. Production Readiness
- [ ] Final staging E2E recorded
- [ ] Deployment pipeline unified
- [ ] Mainnet env prepared
- [ ] Mainnet Safe ownership plan confirmed
