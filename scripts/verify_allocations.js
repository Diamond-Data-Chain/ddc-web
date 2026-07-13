const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});
const hre = require("hardhat");

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

const EXPECTED = {
  Presale: hre.ethers.parseUnits("102400000", 18),
  RewardPool: hre.ethers.parseUnits("51200000", 18),
  Foundation: hre.ethers.parseUnits("38400000", 18),
  Team: hre.ethers.parseUnits("32000000", 18),
  Advisors: hre.ethers.parseUnits("12800000", 18),
  Treasury: hre.ethers.parseUnits("19200000", 18),
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const token = await hre.ethers.getContractAt(
    "DDCToken",
    must("NEXT_PUBLIC_DDC_TOKEN_ADDRESS")
  );

  const targets = {
    Presale: must("NEXT_PUBLIC_PRESALE_ADDRESS"),
    RewardPool: must("NEXT_PUBLIC_REWARD_POOL_ADDRESS"),
    Foundation: must("NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS"),
    Team: must("NEXT_PUBLIC_TEAM_VAULT_ADDRESS"),
    Advisors: must("NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS"),
    Treasury: must("NEXT_PUBLIC_TREASURY_ADDRESS"),
  };

  console.log("====================================");
  console.log("DDC Allocation Verification");
  console.log("====================================");

  let allocated = 0n;

  for (const [name, addr] of Object.entries(targets)) {
    const bal = await token.balanceOf(addr);
    allocated += bal;

    const ok = bal === EXPECTED[name];

    console.log(
      `${name.padEnd(12)} ${ok ? "OK " : "FAIL"} ${hre.ethers.formatUnits(bal,18)} DDC`
    );

    if (!ok) {
      console.log(
        `  expected: ${hre.ethers.formatUnits(EXPECTED[name],18)}`
      );
      process.exit(1);
    }
  }

  const deployerBal = await token.balanceOf(deployer.address);
  const totalSupply = await token.totalSupply();

  console.log("------------------------------------");
  console.log("Allocated :", hre.ethers.formatUnits(allocated,18));
  console.log("Deployer  :", hre.ethers.formatUnits(deployerBal,18));
  console.log("Supply    :", hre.ethers.formatUnits(totalSupply,18));

  if (allocated + deployerBal !== totalSupply) {
    throw new Error("Allocation + deployer != total supply");
  }

  console.log("");
  console.log("PASS");
}

main().catch((e)=>{
  console.error(e);
  process.exit(1);
});
