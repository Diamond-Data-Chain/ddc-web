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

  const presale = new ethers.Contract(process.env.NEXT_PUBLIC_PRESALE_ADDRESS, [
    "function currentBatchId() view returns(uint8)",
    "function currentBatch() view returns(uint8)",
    "function presaleStart() view returns(uint64)",
    "function tgeTimestamp() view returns(uint64)",
    "function finalized() view returns(bool)",
    "function paused() view returns(bool)",
    "function rewardPool() view returns(address)",
    "function recorder() view returns(address)",
    "function RECORDER_PROJECT_ID() view returns(bytes32)"
  ], provider);

  const recorder = new ethers.Contract(
    process.env.NEXT_PUBLIC_RECORDER_ADDRESS,
    [
      "function owner() view returns(address)",
      "function writer() view returns(address)",
      "function getGlobalPurchaseCount(bytes32) view returns(uint256)",
    ],
    provider
  );

  const reward = new ethers.Contract(process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS, [
    "function presale() view returns(address)"
  ], provider);

  console.log("Presale:", process.env.NEXT_PUBLIC_PRESALE_ADDRESS);
  console.log("RewardPool:", process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS);
  console.log("Recorder:", process.env.NEXT_PUBLIC_RECORDER_ADDRESS);

  const expectedTreasury = ethers.getAddress(
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );

  const presaleAddress = ethers.getAddress(
    process.env.NEXT_PUBLIC_PRESALE_ADDRESS
  );

  const recorderOwner = ethers.getAddress(
    await recorder.owner()
  );

  const recorderWriter = ethers.getAddress(
    await recorder.writer()
  );

  if (recorderOwner !== expectedTreasury) {
    throw new Error(
      `Recorder owner mismatch: ${recorderOwner}`
    );
  }

  if (recorderWriter !== presaleAddress) {
    throw new Error(
      `Recorder writer mismatch: ${recorderWriter}`
    );
  }

  const configuredRecorder = ethers.getAddress(
    process.env.NEXT_PUBLIC_RECORDER_ADDRESS
  );

  const presaleRecorder = ethers.getAddress(
    await presale.recorder()
  );

  if (presaleRecorder !== configuredRecorder) {
    throw new Error(
      `Presale Recorder mismatch: ${presaleRecorder}`
    );
  }

  const expectedProjectId = ethers.keccak256(
    ethers.toUtf8Bytes("DDC_PROJECT_V1")
  );

  const actualProjectId =
    await presale.RECORDER_PROJECT_ID();

  if (actualProjectId !== expectedProjectId) {
    throw new Error(
      `Recorder project ID mismatch: ${actualProjectId}`
    );
  }

  console.log("Recorder owner/writer/link/projectId: PASS");
  console.log("reward.presale:", await reward.presale());
  console.log("presale.rewardPool:", await presale.rewardPool());
  console.log("presaleStart:", String(await presale.presaleStart()));
  console.log("currentBatchId:", String(await presale.currentBatchId()));
  console.log("currentBatch:", String(await presale.currentBatch()));
  console.log("tgeTimestamp:", String(await presale.tgeTimestamp()));
  console.log("paused:", await presale.paused());
  console.log("finalized:", await presale.finalized());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
