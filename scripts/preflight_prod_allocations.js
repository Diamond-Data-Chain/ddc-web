const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});

const hre = require("hardhat");

function mustAddr(name, value) {
  if (!value || value.startsWith("TODO")) {
    throw new Error(`Missing ${name}`);
  }
  return hre.ethers.getAddress(value);
}

function ddc(value) {
  return hre.ethers.parseUnits(value, 18);
}

async function optionalCall(contract, functionName) {
  try {
    return await contract[functionName]();
  } catch {
    return null;
  }
}

async function main() {
  const provider = hre.ethers.provider;
  const [deployer] = await hre.ethers.getSigners();
  const network = await provider.getNetwork();

  if (network.chainId !== 56n) {
    throw new Error(
      `STOP: wrong chainId ${network.chainId}; expected BSC Mainnet 56`
    );
  }

  const tokenAddress = mustAddr(
    "NEXT_PUBLIC_DDC_TOKEN_ADDRESS",
    process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS
  );

  const targets = [
    {
      name: "Presale",
      address: mustAddr(
        "NEXT_PUBLIC_PRESALE_ADDRESS",
        process.env.NEXT_PUBLIC_PRESALE_ADDRESS
      ),
      amount: ddc("102400000"),
      contract: true,
      artifact: "DDCPresaleVesting",
    },
    {
      name: "RewardPool",
      address: mustAddr(
        "NEXT_PUBLIC_REWARD_POOL_ADDRESS",
        process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS
      ),
      amount: ddc("51200000"),
      contract: true,
      artifact: "DDCRewardPool",
    },
    {
      name: "Foundation",
      address: mustAddr(
        "NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS",
        process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS
      ),
      amount: ddc("38400000"),
      contract: true,
      artifact: "DDCFoundationRelease",
    },
    {
      name: "Team",
      address: mustAddr(
        "NEXT_PUBLIC_TEAM_VAULT_ADDRESS",
        process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS
      ),
      amount: ddc("32000000"),
      contract: true,
      artifact: "DDCTeamVesting",
    },
    {
      name: "Advisors",
      address: mustAddr(
        "NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS",
        process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS
      ),
      amount: ddc("12800000"),
      contract: true,
      artifact: "DDCAdvisorVesting",
    },
    {
      name: "Treasury",
      address: mustAddr(
        "NEXT_PUBLIC_TREASURY_ADDRESS",
        process.env.NEXT_PUBLIC_TREASURY_ADDRESS
      ),
      amount: ddc("19200000"),
      contract: false,
      artifact: null,
    },
  ];

  const token = await hre.ethers.getContractAt(
    "DDCToken",
    tokenAddress,
    deployer
  );

  const expectedSupply = ddc("256000000");
  const totalSupply = await token.totalSupply();
  const deployerBalance = await token.balanceOf(deployer.address);
  const tokenCode = await provider.getCode(tokenAddress);

  if (tokenCode === "0x") {
    throw new Error(`STOP: DDC Coin has no bytecode: ${tokenAddress}`);
  }
  if (totalSupply !== expectedSupply) {
    throw new Error("STOP: DDC totalSupply is not 256,000,000 DDC");
  }
  if (deployerBalance !== expectedSupply) {
    throw new Error(
      "STOP: deployer does not currently hold the complete supply"
    );
  }

  const unique = new Set();
  let allocationTotal = 0n;

  console.log("========== PRODUCTION ALLOCATION PREFLIGHT ==========");
  console.log("Chain ID:       ", network.chainId.toString());
  console.log("Deployer:       ", deployer.address);
  console.log("DDC Coin:       ", tokenAddress);
  console.log(
    "Total supply:   ",
    hre.ethers.formatUnits(totalSupply, 18),
    "DDC"
  );
  console.log(
    "Deployer balance:",
    hre.ethers.formatUnits(deployerBalance, 18),
    "DDC"
  );
  console.log("");

  for (const target of targets) {
    const key = target.address.toLowerCase();

    if (unique.has(key)) {
      throw new Error(`STOP: duplicate target address: ${target.address}`);
    }
    unique.add(key);

    if (target.address === deployer.address) {
      throw new Error(`STOP: ${target.name} equals deployer address`);
    }
    if (target.address === tokenAddress) {
      throw new Error(`STOP: ${target.name} equals DDC Coin address`);
    }

    const code = await provider.getCode(target.address);
    const isContract = code !== "0x";

    if (target.contract && !isContract) {
      throw new Error(
        `STOP: ${target.name} must be a contract but has no bytecode: ${target.address}`
      );
    }

    const balance = await token.balanceOf(target.address);
    if (balance !== 0n) {
      throw new Error(
        `STOP: ${target.name} is not empty; balance=${hre.ethers.formatUnits(balance, 18)} DDC`
      );
    }

    allocationTotal += target.amount;

    console.log(`${target.name}`);
    console.log(`  address:  ${target.address}`);
    console.log(`  kind:     ${isContract ? "CONTRACT" : "EOA / SAFE"}`);
    console.log(
      `  bytecode: ${isContract ? `${(code.length - 2) / 2} bytes` : "none"}`
    );
    console.log(
      `  funding:  ${hre.ethers.formatUnits(target.amount, 18)} DDC`
    );

    if (target.artifact) {
      const contract = await hre.ethers.getContractAt(
        target.artifact,
        target.address,
        provider
      );

      const tokenRef =
        (await optionalCall(contract, "ddcToken")) ??
        (await optionalCall(contract, "token")) ??
        (await optionalCall(contract, "DDC"));

      const owner = await optionalCall(contract, "owner");

      console.log(
        `  token ref: ${tokenRef == null ? "not exposed" : tokenRef}`
      );
      console.log(
        `  owner:     ${owner == null ? "not exposed" : owner}`
      );

      if (
        tokenRef != null &&
        hre.ethers.getAddress(tokenRef) !== tokenAddress
      ) {
        throw new Error(
          `STOP: ${target.name} references wrong DDC token: ${tokenRef}`
        );
      }
    }

    console.log("  result:   PASS");
    console.log("");
  }

  if (allocationTotal !== expectedSupply) {
    throw new Error(
      `STOP: allocation total is ${hre.ethers.formatUnits(allocationTotal, 18)}, expected 256000000`
    );
  }

  const deployerBnb = await provider.getBalance(deployer.address);

  console.log("Allocation total:", hre.ethers.formatUnits(allocationTotal, 18), "DDC");
  console.log("Deployer BNB:    ", hre.ethers.formatEther(deployerBnb), "BNB");
  console.log("");
  console.log("PREFLIGHT PASSED — NO TRANSACTIONS WERE SENT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
