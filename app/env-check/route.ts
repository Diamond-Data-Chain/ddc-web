import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ?? null,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL ?? null,
    NEXT_PUBLIC_PRESALE_ADDRESS: process.env.NEXT_PUBLIC_PRESALE_ADDRESS ?? null,
    NEXT_PUBLIC_USDT_ADDRESS: process.env.NEXT_PUBLIC_USDT_ADDRESS ?? null,
    NEXT_PUBLIC_RECORDER_ADDRESS: process.env.NEXT_PUBLIC_RECORDER_ADDRESS ?? null,
    NEXT_PUBLIC_DDC_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS ?? null,
    NEXT_PUBLIC_WC_PROJECT_ID: process.env.NEXT_PUBLIC_WC_PROJECT_ID ? "set" : null,
  });
}
