require("dotenv").config({ path: ".env.staging" });
const { ethers } = require("ethers");

const RPC = process.env.NEXT_PUBLIC_RPC_URL;
const provider = new ethers.JsonRpcProvider(RPC);

const A = {
  ddc: process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS,
  presale: process.env.NEXT_PUBLIC_PRESALE_ADDRESS,
  reward: process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS,
  recorder: process.env.NEXT_PUBLIC_RECORDER_ADDRESS,
  usdt: process.env.NEXT_PUBLIC_USDT_ADDRESS,
  treasury: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
};

const OWNABLE = ["function owner() view returns(address)"];
const PRESALE = [
  "function owner() view returns(address)",
  "function currentBatchId() view returns(uint8)",
  "function finalized() view returns(bool)",
  "function paused() view returns(bool)",
];
const REWARD = ["function owner() view returns(address)"];

async function code(name, addr) {
  const c = await provider.getCode(addr);
  console.log(`${c && c !== "0x" ? "✅" : "❌"} ${name}: ${addr}`);
}

async function main() {
  console.log("=== CODE CHECK ===");
  for (const [k, v] of Object.entries(A)) await code(k, v);

  console.log("\n=== OWNER CHECK ===");
  const presale = new ethers.Contract(A.presale, PRESALE, provider);
  const reward = new ethers.Contract(A.reward, REWARD, provider);

  console.log("presale.owner:", await presale.owner());
  console.log("reward.owner :", await reward.owner());
  console.log("expected Safe:", A.treasury);

  console.log("\n=== PRESALE STATE ===");
  for (const fn of ["currentBatchId", "finalized", "paused"]) {
    try {
      console.log(fn + ":", await presale[fn]());
    } catch (e) {
      console.log(fn + ": ERR", e.shortMessage || e.message);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
