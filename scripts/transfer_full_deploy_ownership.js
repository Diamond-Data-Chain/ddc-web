const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});
const hre = require("hardhat");

const EXECUTE = process.env.EXECUTE === "true";

function mustAddress(name, value) {
  if (!value) throw new Error(`Missing ${name}`);

  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const SAFE = mustAddress(
    "NEXT_PUBLIC_TREASURY_ADDRESS",
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );

  const items = {
    RewardPool: process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS,
    Presale: process.env.NEXT_PUBLIC_PRESALE_ADDRESS,
    Recorder: process.env.NEXT_PUBLIC_RECORDER_ADDRESS,
    TeamVesting: process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS,
    AdvisorVesting: process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS,
    FoundationRelease: process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS,
  };

  console.log("Execute:", EXECUTE ? "YES" : "NO (DRY RUN)");
  console.log("Signer:", signer.address);
  console.log("New owner / Treasury Safe:", SAFE);

  for (const [name, addr] of Object.entries(items)) {
    if (!addr) throw new Error(`Missing ${name} address`);

    const c = await hre.ethers.getContractAt("Ownable", addr, signer);
    const current = await c.owner();

    console.log(`${name}: ${addr}`);
    console.log(`  current owner: ${current}`);
    console.log(`  new owner    : ${SAFE}`);

    if (current.toLowerCase() === SAFE.toLowerCase()) {
      console.log("  already transferred");
      continue;
    }

    if (EXECUTE) {
      const tx = await c.transferOwnership(SAFE);
      console.log("  tx:", tx.hash);
      await tx.wait();
      console.log("  verified owner:", await c.owner());
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
