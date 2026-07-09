require("dotenv").config({ path: ".env.staging", override: true });
const hre = require("hardhat");

function mustAddr(name, value) {
  if (!value) throw new Error(`Missing ${name} in .env`);
  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name} in .env: ${value}`);
  }
}

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No deployer signer available. Check DEPLOYER_PRIVATE_KEY.");
  }

  const deployer = signers[0];
  console.log("Deploying with:", deployer.address);

  const TREASURY = mustAddr(
    "TREASURY/NEXT_PUBLIC_TREASURY_ADDRESS",
    process.env.TREASURY || process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );

  const USDT = mustAddr(
    "USDT/NEXT_PUBLIC_USDT_ADDRESS",
    process.env.USDT || process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const TEAM_BENEFICIARY = mustAddr(
    "TEAM_BENEFICIARY/NEXT_PUBLIC_TEAM_BENEFICIARY_ADDRESS",
    process.env.TEAM_BENEFICIARY || process.env.NEXT_PUBLIC_TEAM_BENEFICIARY_ADDRESS
  );

  const ADVISORS_BENEFICIARY = mustAddr(
    "ADVISORS_BENEFICIARY/NEXT_PUBLIC_ADVISORS_BENEFICIARY_ADDRESS",
    process.env.ADVISORS_BENEFICIARY || process.env.NEXT_PUBLIC_ADVISORS_BENEFICIARY_ADDRESS
  );

  const latest = await hre.ethers.provider.getBlock("latest");
  const PRESALE_START = Number(latest.timestamp) - 60;
  const TGE_TIMESTAMP = 0;

  const prices = [
    10000,10500,11000,11500,12000,12500,13000,13500,14000,14500,
    15000,15500,16000,16500,17000,17500,18000,18500,19000,19500,
    20000,20500,21000,21500,22000,22500,23000,23500,24000,24500,
    25000,25500,26000,26500,27000,27500,28000,28500,29000,29500
  ];

  const Token = await hre.ethers.getContractFactory("DDCToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("DDC:", tokenAddr);

  const Reward = await hre.ethers.getContractFactory("DDCRewardPool");
  const reward = await Reward.deploy(
    deployer.address,
    tokenAddr
  );
  await reward.waitForDeployment();
  const rewardAddr = await reward.getAddress();
  console.log("RewardPool:", rewardAddr);

  const Presale = await hre.ethers.getContractFactory("DDCPresaleVesting");
  const presale = await Presale.deploy(
    deployer.address,
    tokenAddr,
    USDT,
    rewardAddr,
    TREASURY,
    PRESALE_START,
    prices,
    false,
    0
  );
  await presale.waitForDeployment();
  const presaleAddr = await presale.getAddress();
  console.log("Presale:", presaleAddr);

  const TeamVesting = await hre.ethers.getContractFactory("DDCTeamVesting");
  const teamVesting = await TeamVesting.deploy(
    tokenAddr,
    TEAM_BENEFICIARY,
    hre.ethers.parseUnits("32000000", 18),
    TGE_TIMESTAMP
  );
  await teamVesting.waitForDeployment();
  const teamVestingAddr = await teamVesting.getAddress();
  console.log("TeamVesting:", teamVestingAddr);

  const AdvisorVesting = await hre.ethers.getContractFactory("DDCAdvisorVesting");
  const advisorVesting = await AdvisorVesting.deploy(
    tokenAddr,
    ADVISORS_BENEFICIARY,
    hre.ethers.parseUnits("12800000", 18),
    TGE_TIMESTAMP
  );
  await advisorVesting.waitForDeployment();
  const advisorVestingAddr = await advisorVesting.getAddress();
  console.log("AdvisorVesting:", advisorVestingAddr);

  const FoundationRelease = await hre.ethers.getContractFactory("DDCFoundationRelease");
  const foundationRelease = await FoundationRelease.deploy(
    tokenAddr,
    hre.ethers.parseUnits("38400000", 18),
    TGE_TIMESTAMP
  );
  await foundationRelease.waitForDeployment();
  const foundationReleaseAddr = await foundationRelease.getAddress();
  console.log("FoundationRelease:", foundationReleaseAddr);

  const setPresaleTx = await reward.setPresaleOnce(presaleAddr);
  console.log("RewardPool setPresaleOnce tx:", setPresaleTx.hash);
  await setPresaleTx.wait();

  console.log("DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
