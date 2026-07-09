require("dotenv").config({ path: ".env.staging.full-deploy-test", override: true });
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  const presale = new ethers.Contract(process.env.NEXT_PUBLIC_PRESALE_ADDRESS, [
    "function currentBatchId() view returns(uint8)",
    "function currentBatch() view returns(uint8)",
    "function presaleStart() view returns(uint64)",
    "function tgeTimestamp() view returns(uint64)",
    "function finalized() view returns(bool)",
    "function paused() view returns(bool)",
    "function rewardPool() view returns(address)"
  ], provider);

  const reward = new ethers.Contract(process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS, [
    "function presale() view returns(address)"
  ], provider);

  console.log("Presale:", process.env.NEXT_PUBLIC_PRESALE_ADDRESS);
  console.log("RewardPool:", process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS);
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
