import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID || null,
      ddcToken: process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS || null,
      presale: process.env.NEXT_PUBLIC_PRESALE_ADDRESS || null,
      usdt: process.env.NEXT_PUBLIC_USDT_ADDRESS || null,
      rewardPool: process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS || null,
      teamVault: process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS || null,
      advisorsVault:
        process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS || null,
      foundationVault:
        process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS || null,
      treasury: process.env.NEXT_PUBLIC_TREASURY_ADDRESS || null,
      treasuryVault:
        process.env.NEXT_PUBLIC_TREASURY_VAULT_ADDRESS || null,
      monthlyOpsVault:
        process.env.NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS || null,
      adamasGrantVault:
        process.env.NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS || null,
      marketingWallet:
        process.env.NEXT_PUBLIC_MARKETING_WALLET_ADDRESS || null,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
