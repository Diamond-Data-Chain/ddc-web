const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});

const { ethers } = require("ethers");

async function main() {
  const expectedChainId = Number(
    process.env.EXPECTED_CHAIN_ID || "0"
  );

  if (![56, 97].includes(expectedChainId)) {
    throw new Error(
      "EXPECTED_CHAIN_ID must explicitly be 56 or 97"
    );
  }

  const rpcUrl =
    expectedChainId === 56
      ? process.env.BSC_MAINNET_RPC_URL
      : process.env.BSC_TESTNET_RPC_URL ||
        process.env.NEXT_PUBLIC_RPC_URL;

  if (!rpcUrl) {
    throw new Error(
      expectedChainId === 56
        ? "Missing BSC_MAINNET_RPC_URL"
        : "Missing BSC_TESTNET_RPC_URL/NEXT_PUBLIC_RPC_URL"
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== expectedChainId) {
    throw new Error(
      `Wrong RPC chain. Expected ${expectedChainId}, received ${network.chainId}`
    );
  }

  const contracts = {
    RewardPool: process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS,
    Presale: process.env.NEXT_PUBLIC_PRESALE_ADDRESS,
    Recorder: process.env.NEXT_PUBLIC_RECORDER_ADDRESS,
    TeamVesting: process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS,
    AdvisorVesting: process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS,
    FoundationRelease: process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS,
  };

  const expectedOwner = ethers.getAddress(
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );

  const abi = ["function owner() view returns (address)"];

  for (const [name, addr] of Object.entries(contracts)) {
    if (!addr) throw new Error(`Missing ${name} address`);

    const c = new ethers.Contract(addr, abi, provider);
    const owner = ethers.getAddress(await c.owner());

    console.log(`${name}: ${owner}`);

    if (owner !== expectedOwner) {
      throw new Error(
        `${name} ownership mismatch: expected ${expectedOwner}, actual ${owner}`
      );
    }
  }

  console.log("FULL DEPLOY OWNERSHIP: PASS");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
