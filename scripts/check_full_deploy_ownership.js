require("dotenv").config({ path: ".env.staging.full-deploy-test", override: true });
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  const contracts = {
    RewardPool: process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS,
    Presale: process.env.NEXT_PUBLIC_PRESALE_ADDRESS,
    TeamVesting: process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS,
    AdvisorVesting: process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS,
    FoundationRelease: process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS,
  };

  const abi = ["function owner() view returns (address)"];
  for (const [name, addr] of Object.entries(contracts)) {
    const c = new ethers.Contract(addr, abi, provider);
    console.log(`${name}: ${await c.owner()}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
