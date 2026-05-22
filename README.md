# Diamond Data Chain — Web Application

Official web application and public interface for the Diamond Data Chain (DDC) protocol.

## Overview

This repository contains the DDC public website, presale interface, allocation views, treasury views and wallet integration stack.

The application is built with:

- Next.js 14
- React
- ethers.js v6
- WalletConnect v2
- BNB Chain integration

## Live v1 Scope

Current production scope includes:

- Wallet connection
- WalletConnect v2 support
- BNB Chain support
- Presale dashboard
- USDT purchase flow
- Batch status tracking
- Coin allocation views
- Treasury transparency views
- Reward pool tracking
- Read-only vesting and allocation interfaces

## Repository Structure

- app/ — Next.js App Router pages
- components/ — UI and protocol components
- public/ — static assets and documents
- abi/ — exported ABI files
- docs/ — supporting documentation

## Required Environment Variables

NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_PRESALE_ADDRESS=
NEXT_PUBLIC_USDT_ADDRESS=
NEXT_PUBLIC_WC_PROJECT_ID=

## Optional Environment Variables

NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_VESTING_VAULT_ADDRESS=
NEXT_PUBLIC_REWARD_POOL_ADDRESS=

## Development

Install dependencies:

npm install

Run development server:

npm run dev

Production build:

npm run build

## Production Status

Current deployment targets:

- BNB Chain Testnet (staging)
- BNB Chain Mainnet (post-freeze production)

## Related Repositories

- ddc-contracts
- ddc-whitepaper

## Disclaimer

DDC protocol interfaces are informational and infrastructure-oriented. Nothing in this repository constitutes investment advice, financial solicitation, or guarantees of future value or performance.

