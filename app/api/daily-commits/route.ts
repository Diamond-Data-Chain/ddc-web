import { NextResponse } from "next/server";
import { ethers } from "ethers";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const ABI = [
  "event CommitSubmitted(bytes32 indexed projectId, bytes32 indexed reportHash, bytes32 indexed engineCodeHash, bytes32 engineVersionHash, address validator, bytes32 messageHash, uint64 ts)",
];

const DEFAULT_REGISTRY = "0xA6016d4DF086D52E3f13893B136743B4AbfB26c0";
const DEFAULT_FROM_BLOCK = 112428000;

export async function GET() {
  try {
    const rpcUrl =
      process.env.BSC_MAINNET_RPC_URL ||
      process.env.NEXT_PUBLIC_RPC_URL ||
      "https://bsc-dataseed.bnbchain.org";

    const registryAddress =
      process.env.NEXT_PUBLIC_COMMIT_REGISTRY_ADDRESS ||
      DEFAULT_REGISTRY;

    const projectKey =
      process.env.NEXT_PUBLIC_PROJECT_KEY ||
      "DDC_PROJECT_V1";

    const fromBlock = Number(
      process.env.COMMIT_REGISTRY_FROM_BLOCK || DEFAULT_FROM_BLOCK
    );

    if (!ethers.isAddress(registryAddress)) {
      throw new Error("Invalid commit registry address");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const network = await provider.getNetwork();
    if (Number(network.chainId) !== 56) {
      throw new Error(
        `Wrong RPC network: expected BNB mainnet chainId 56, received ${network.chainId}`
      );
    }

    const latestBlock = await provider.getBlockNumber();
    const contract = new ethers.Contract(registryAddress, ABI, provider);

    const projectId = ethers.keccak256(
      ethers.toUtf8Bytes(projectKey)
    );

    const filter = contract.filters.CommitSubmitted(projectId);

    const events: any[] = [];
    const chunkSize = 4000;

    for (
      let start = fromBlock;
      start <= latestBlock;
      start += chunkSize
    ) {
      const end = Math.min(start + chunkSize - 1, latestBlock);
      const chunk = await contract.queryFilter(filter, start, end);
      events.push(...chunk);
    }

    const items = events
      .map((event: any) => {
        const args = event.args;

        return {
          projectId: args.projectId,
          reportHash: args.reportHash,
          engineCodeHash: args.engineCodeHash,
          engineVersionHash: args.engineVersionHash,
          validator: args.validator,
          messageHash: args.messageHash,
          timestamp: Number(args.ts),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        };
      })
      .sort((a, b) => {
        if (b.timestamp !== a.timestamp) {
          return b.timestamp - a.timestamp;
        }
        return b.blockNumber - a.blockNumber;
      });

    return NextResponse.json({
      chainId: 56,
      registryAddress,
      projectId,
      fromBlock,
      latestBlock,
      count: items.length,
      items,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: String(e?.shortMessage || e?.message || e),
      },
      { status: 500 }
    );
  }
}
