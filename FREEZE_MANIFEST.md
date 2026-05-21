# DDC v1 Freeze Manifest

## Contracts (ABI Freeze)
- DDCPresaleVesting.sol
- DDCRewardPool.sol
- DDCToken.sol

## Network
- BSC Testnet (chainId 97)

## Deployment (Testnet)
- DDC Token: 0x56C1b460D75dee31EcEb6fA867682d8d679778AC
- Reward Pool: 0x417edE69b16D824a17f91b4f565756f37978Ad76
- Presale: 0x81C322E17Fd6e852924AF1b7E9633e9a8c942FdC

## Frontend Config
- Uses NEXT_PUBLIC_* env variables
- No hardcoded addresses

## Scripts (Production Only)
- deploy_prod.js
- fund_prod_presale.js
- fund_buyer_usdt_prod.js
- buy_usdt_prod.js
- check_prod_state.js
- check_buyer_prod.js

## Removed / Archived
- All Mock contracts
- All batch manipulation scripts
- All fast-smoke scripts
- All debug scripts

## Known Behavior
- Claim disabled until TGE
- Presale fully functional pre-TGE
- Vesting locked until TGE

## Status
READY FOR:
- Public GitHub
- External review
- Testnet validation

