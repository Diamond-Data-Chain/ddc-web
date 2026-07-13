const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});
const hre = require("hardhat");

const EXECUTE = process.env.EXECUTE === "true";

function mustAddr(name, value) {
  if (!value || value.startsWith("TODO")) throw new Error(`Missing ${name}`);
  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function ddc(amount) {
  return hre.ethers.parseUnits(amount, 18);
}

async function requireCode(provider, name, addr) {
  const code = await provider.getCode(addr);
  if (code === "0x") throw new Error(`${name} has no contract code: ${addr}`);
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const provider = hre.ethers.provider;

  const tokenAddr = mustAddr("NEXT_PUBLIC_DDC_TOKEN_ADDRESS", process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS);

  const allocations = [
    ["Presale", mustAddr("NEXT_PUBLIC_PRESALE_ADDRESS", process.env.NEXT_PUBLIC_PRESALE_ADDRESS), ddc("102400000"), true],
    ["RewardPool", mustAddr("NEXT_PUBLIC_REWARD_POOL_ADDRESS", process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS), ddc("51200000"), true],
    ["Foundation", mustAddr("NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS", process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS), ddc("38400000"), true],
    ["Team", mustAddr("NEXT_PUBLIC_TEAM_VAULT_ADDRESS", process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS), ddc("32000000"), true],
    ["Advisors", mustAddr("NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS", process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS), ddc("12800000"), true],
    ["Treasury", mustAddr("NEXT_PUBLIC_TREASURY_ADDRESS", process.env.NEXT_PUBLIC_TREASURY_ADDRESS), ddc("19200000"), false],
  ];

  const token = await hre.ethers.getContractAt("DDCToken", tokenAddr, deployer);

  console.log("========== DDC Allocation Plan ==========");
  console.log("Execute:", EXECUTE ? "YES" : "NO (DRY RUN)");
  console.log("Deployer:", deployer.address);
  console.log("DDC Token:", tokenAddr);
  console.log("");

  let total = 0n;

  for (const [name, addr, amount, mustBeContract] of allocations) {
    if (mustBeContract) await requireCode(provider, name, addr);
    total += amount;
    console.log(`${name}: ${hre.ethers.formatUnits(amount, 18)} DDC -> ${addr}`);
  }

  const expected = ddc("256000000");
  if (total !== expected) {
    throw new Error(`Allocation total mismatch: ${total} != ${expected}`);
  }

  const deployerBal = await token.balanceOf(deployer.address);
  console.log("");
  console.log("Total:", hre.ethers.formatUnits(total, 18), "DDC");
  console.log("Deployer balance:", hre.ethers.formatUnits(deployerBal, 18), "DDC");

  if (deployerBal < total) {
    throw new Error("Deployer has insufficient DDC for full allocation funding");
  }

  if (!EXECUTE) {
    console.log("");
    console.log("DRY RUN complete. No transfers executed.");
    console.log("Run with EXECUTE=true to transfer funds.");
    return;
  }

  console.log("");
  console.log("========== EXECUTING TRANSFERS ==========");

  for (const [name, addr, amount] of allocations) {
    console.log(`Funding ${name}...`);
    const tx = await token.transfer(addr, amount);
    console.log(`${name} tx:`, tx.hash);
    await tx.wait();

    const bal = await token.balanceOf(addr);
    console.log(`${name} balance:`, hre.ethers.formatUnits(bal, 18), "DDC");
  }

  console.log("");
  console.log("ALL ALLOCATIONS FUNDED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
