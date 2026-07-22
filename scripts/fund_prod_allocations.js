const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});

const hre = require("hardhat");
const EXECUTE = process.env.EXECUTE === "true";
const EXPECTED_CHAIN_ID = 56n;

function mustAddr(name, value) {
  if (!value || value.startsWith("TODO")) {
    throw new Error(`Missing ${name}`);
  }

  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function ddc(amount) {
  return hre.ethers.parseUnits(amount, 18);
}

async function requireCode(provider, name, address) {
  const code = await provider.getCode(address);

  if (code === "0x") {
    throw new Error(`${name} has no contract code: ${address}`);
  }
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const provider = hre.ethers.provider;
  const network = await provider.getNetwork();

  if (network.chainId !== EXPECTED_CHAIN_ID) {
    throw new Error(
      `Wrong network: chainId=${network.chainId}; expected BSC Mainnet chainId=56`
    );
  }

  const tokenAddr = mustAddr(
    "NEXT_PUBLIC_DDC_TOKEN_ADDRESS",
    process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS
  );

  const allocations = [
    [
      "Presale",
      mustAddr(
        "NEXT_PUBLIC_PRESALE_ADDRESS",
        process.env.NEXT_PUBLIC_PRESALE_ADDRESS
      ),
      ddc("102400000"),
      true,
    ],
    [
      "RewardPool",
      mustAddr(
        "NEXT_PUBLIC_REWARD_POOL_ADDRESS",
        process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS
      ),
      ddc("51200000"),
      true,
    ],
    [
      "Foundation",
      mustAddr(
        "NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS",
        process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS
      ),
      ddc("38400000"),
      true,
    ],
    [
      "Team",
      mustAddr(
        "NEXT_PUBLIC_TEAM_VAULT_ADDRESS",
        process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS
      ),
      ddc("32000000"),
      true,
    ],
    [
      "Advisors",
      mustAddr(
        "NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS",
        process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS
      ),
      ddc("12800000"),
      true,
    ],
    [
      "Treasury",
      mustAddr(
        "NEXT_PUBLIC_TREASURY_ADDRESS",
        process.env.NEXT_PUBLIC_TREASURY_ADDRESS
      ),
      ddc("19200000"),
      false,
    ],
  ];

  const token = await hre.ethers.getContractAt(
    "DDCToken",
    tokenAddr,
    deployer
  );

  const expectedSupply = ddc("256000000");
  const totalSupply = await token.totalSupply();

  if (totalSupply !== expectedSupply) {
    throw new Error(
      `Unexpected total supply: ${hre.ethers.formatUnits(totalSupply, 18)} DDC`
    );
  }

  console.log("========== DDC Allocation Plan ==========");
  console.log("Execute:", EXECUTE ? "YES" : "NO (DRY RUN)");
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("DDC Token:", tokenAddr);
  console.log("");

  let allocationTotal = 0n;
  let outstandingTotal = 0n;
  const outstanding = [];

  for (const [name, address, target, mustBeContract] of allocations) {
    if (mustBeContract) {
      await requireCode(provider, name, address);
    }

    allocationTotal += target;

    const current = await token.balanceOf(address);

    if (current > target) {
      throw new Error(
        `${name} exceeds target: ` +
          `${hre.ethers.formatUnits(current, 18)} > ` +
          `${hre.ethers.formatUnits(target, 18)} DDC`
      );
    }

    const remaining = target - current;
    outstandingTotal += remaining;
    outstanding.push({ name, address, target, current, remaining });

    console.log(`${name}:`);
    console.log(`  address:   ${address}`);
    console.log(
      `  current:   ${hre.ethers.formatUnits(current, 18)} DDC`
    );
    console.log(
      `  target:    ${hre.ethers.formatUnits(target, 18)} DDC`
    );
    console.log(
      `  remaining: ${hre.ethers.formatUnits(remaining, 18)} DDC`
    );
  }

  if (allocationTotal !== expectedSupply) {
    throw new Error(
      `Allocation total mismatch: ${allocationTotal} != ${expectedSupply}`
    );
  }

  const deployerBalance = await token.balanceOf(deployer.address);

  console.log("");
  console.log(
    "Total supply:",
    hre.ethers.formatUnits(totalSupply, 18),
    "DDC"
  );
  console.log(
    "Deployer balance:",
    hre.ethers.formatUnits(deployerBalance, 18),
    "DDC"
  );
  console.log(
    "Outstanding:",
    hre.ethers.formatUnits(outstandingTotal, 18),
    "DDC"
  );

  if (deployerBalance < outstandingTotal) {
    throw new Error(
      "Deployer has insufficient DDC for outstanding allocations"
    );
  }

  if (!EXECUTE) {
    console.log("");
    console.log("DRY RUN complete. No transfers executed.");
    return;
  }

  console.log("");
  console.log("========== EXECUTING TRANSFERS ==========");

  for (const item of outstanding) {
    if (item.remaining === 0n) {
      console.log(`${item.name}: already fully funded; skipping`);
      continue;
    }

    console.log(
      `${item.name}: transferring ` +
        `${hre.ethers.formatUnits(item.remaining, 18)} DDC -> ${item.address}`
    );

    const tx = await token.transfer(item.address, item.remaining);
    console.log(`${item.name} tx: ${tx.hash}`);

    const receipt = await tx.wait();

    if (!receipt || receipt.status !== 1) {
      throw new Error(
        `${item.name} transaction failed or was reverted: ${tx.hash}`
      );
    }

    const balanceAfter = await token.balanceOf(item.address);

    if (balanceAfter !== item.target) {
      throw new Error(
        `${item.name} post-transfer mismatch: ` +
          `${hre.ethers.formatUnits(balanceAfter, 18)} != ` +
          `${hre.ethers.formatUnits(item.target, 18)} DDC`
      );
    }

    console.log(
      `${item.name} verified: ` +
        `${hre.ethers.formatUnits(balanceAfter, 18)} DDC`
    );
  }

  console.log("");
  console.log("========== FINAL VERIFICATION ==========");

  for (const [name, address, target] of allocations) {
    const finalBalance = await token.balanceOf(address);

    if (finalBalance !== target) {
      throw new Error(
        `${name} final verification failed: ` +
          `${hre.ethers.formatUnits(finalBalance, 18)} != ` +
          `${hre.ethers.formatUnits(target, 18)} DDC`
      );
    }

    console.log(
      `${name}: ${hre.ethers.formatUnits(finalBalance, 18)} DDC`
    );
  }

  const finalDeployerBalance = await token.balanceOf(deployer.address);

  console.log(
    "Deployer remaining:",
    hre.ethers.formatUnits(finalDeployerBalance, 18),
    "DDC"
  );
  console.log("");
  console.log("ALL ALLOCATIONS FUNDED AND VERIFIED");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
