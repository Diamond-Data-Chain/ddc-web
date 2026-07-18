const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

function same(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

async function requireCode(name, address) {
  const code = await hre.ethers.provider.getCode(address);
  if (code === "0x") {
    throw new Error(`${name}: NO CODE at ${address}`);
  }
  console.log(`${name}: CODE PRESENT | ${address}`);
}

async function verifyOwner(name, contract, treasury) {
  if (!contract.interface.hasFunction("owner()")) {
    console.log(`${name}: owner() NOT APPLICABLE`);
    return;
  }

  const owner = await contract.owner();

  if (!same(owner, treasury)) {
    throw new Error(
      `${name}: WRONG OWNER | expected ${treasury}, received ${owner}`
    );
  }

  console.log(`${name}: OWNER OK | ${owner}`);
}

async function main() {
  const network = await hre.ethers.provider.getNetwork();

  if (Number(network.chainId) !== 56) {
    throw new Error(`Wrong chain: ${network.chainId}`);
  }

  const manifestPath = path.resolve(
    "deployments/presale-mainnet.json"
  );

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing manifest: ${manifestPath}`);
  }

  const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  const expectedStart = 1784552400;

  if (Number(m.chainId) !== 56) {
    throw new Error(`Manifest chainId is ${m.chainId}, expected 56`);
  }

  if (Number(m.presaleStart) !== expectedStart) {
    throw new Error(
      `Wrong presale start: ${m.presaleStart}, expected ${expectedStart}`
    );
  }

  const addresses = {
    DDCToken: m.ddcCoinContract,
    RewardPool: m.rewardPool,
    Presale: m.presale,
    Recorder: m.recorder,
    TeamVesting: m.teamVesting,
    AdvisorVesting: m.advisorVesting,
    FoundationRelease: m.foundationRelease,
    MonthlyOpsVault: m.monthlyOpsVault,
    AdamasGrantVault: m.adamasGrantVault,
    Treasury: m.treasury,
    USDT: m.usdt,
  };

  for (const [name, address] of Object.entries(addresses)) {
    if (!hre.ethers.isAddress(address)) {
      throw new Error(`${name}: invalid address ${address}`);
    }

    await requireCode(name, address);
  }

  const reward = await hre.ethers.getContractAt(
    "DDCRewardPool",
    m.rewardPool
  );

  const presale = await hre.ethers.getContractAt(
    "DDCPresaleVesting",
    m.presale
  );

  const recorder = await hre.ethers.getContractAt(
    "DDCPresaleRecorder",
    m.recorder
  );

  const team = await hre.ethers.getContractAt(
    "DDCTeamVesting",
    m.teamVesting
  );

  const advisor = await hre.ethers.getContractAt(
    "DDCAdvisorVesting",
    m.advisorVesting
  );

  const foundation = await hre.ethers.getContractAt(
    "DDCFoundationRelease",
    m.foundationRelease
  );

  const rewardPresale = await reward.presale();
  if (!same(rewardPresale, m.presale)) {
    throw new Error(
      `RewardPool.presale mismatch: ${rewardPresale}`
    );
  }
  console.log("RewardPool.presale: LINK OK");

  const presaleRecorder = await presale.recorder();
  if (!same(presaleRecorder, m.recorder)) {
    throw new Error(
      `Presale.recorder mismatch: ${presaleRecorder}`
    );
  }
  console.log("Presale.recorder: LINK OK");

  await verifyOwner("RewardPool", reward, m.treasury);
  await verifyOwner("Presale", presale, m.treasury);
  await verifyOwner("Recorder", recorder, m.treasury);
  await verifyOwner("TeamVesting", team, m.treasury);
  await verifyOwner("AdvisorVesting", advisor, m.treasury);
  await verifyOwner("FoundationRelease", foundation, m.treasury);

  const envChecks = {
    NEXT_PUBLIC_CHAIN_ID: "56",
    NEXT_PUBLIC_DDC_TOKEN_ADDRESS: m.ddcCoinContract,
    NEXT_PUBLIC_PRESALE_ADDRESS: m.presale,
    NEXT_PUBLIC_RECORDER_ADDRESS: m.recorder,
    NEXT_PUBLIC_REWARD_POOL_ADDRESS: m.rewardPool,
    NEXT_PUBLIC_TEAM_VAULT_ADDRESS: m.teamVesting,
    NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS: m.advisorVesting,
    NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS: m.foundationRelease,
    NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS: m.monthlyOpsVault,
    NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS: m.adamasGrantVault,
    NEXT_PUBLIC_TREASURY_ADDRESS: m.treasury,
    NEXT_PUBLIC_USDT_ADDRESS: m.usdt,
  };

  for (const [key, expected] of Object.entries(envChecks)) {
    const actual = process.env[key];

    if (!actual) {
      throw new Error(`${key}: MISSING`);
    }

    const matches =
      hre.ethers.isAddress(expected)
        ? same(actual, expected)
        : actual === expected;

    if (!matches) {
      throw new Error(
        `${key}: mismatch | expected ${expected}, received ${actual}`
      );
    }

    console.log(`${key}: OK`);
  }

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(
    deployer.address
  );

  console.log("Presale start:", m.presaleStart);
  console.log("Deployer:", deployer.address);
  console.log(
    "Remaining BNB:",
    hre.ethers.formatEther(balance)
  );
  console.log("MAINNET DEPLOYMENT VERIFICATION: PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
