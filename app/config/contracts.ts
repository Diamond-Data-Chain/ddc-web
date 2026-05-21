import { BrowserProvider, JsonRpcProvider, type Eip1193Provider, type JsonRpcSigner } from "ethers";

// NOTE: Next.js inlines ONLY direct process.env.NEXT_PUBLIC_* usages in client bundles.
// Do NOT use process.env[key] helpers here.

export const DEFAULT_RPC_URL = "https://bsc-dataseed.bnbchain.org";
export const DEFAULT_CHAIN_ID = 56;
export const DEFAULT_CHAIN_NAME = "BNB Smart Chain";

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? DEFAULT_RPC_URL;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? DEFAULT_CHAIN_ID);
export const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME ?? DEFAULT_CHAIN_NAME;
export const BLOCK_EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL ?? "";

export const PRESALE_VESTING_ADDRESS = (process.env.NEXT_PUBLIC_PRESALE_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const DDC_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const USDT_MOCK_ADDRESS = (process.env.NEXT_PUBLIC_USDT_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const GOVERNANCE_ADDRESS = (process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const REWARD_POOL_ADDRESS = (process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const ADDRESSES = {
  presale: PRESALE_VESTING_ADDRESS,
  ddc: DDC_TOKEN_ADDRESS,
  usdt: USDT_MOCK_ADDRESS,
  governance: GOVERNANCE_ADDRESS,
  rewardPool: REWARD_POOL_ADDRESS,
} as const;

export const getReadonlyProvider = () => new JsonRpcProvider(RPC_URL);

export const getBrowserProvider = (): BrowserProvider | null => {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
  if (!eth?.request) return null;
  return new BrowserProvider(eth);
};

export const getSigner = async (): Promise<JsonRpcSigner | null> => {
  const bp = getBrowserProvider();
  if (!bp) return null;
  return bp.getSigner();
};
