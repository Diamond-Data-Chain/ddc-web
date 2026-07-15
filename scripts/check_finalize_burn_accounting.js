const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const DDC = (value) => hre.ethers.parseUnits(value, 18);

function assertEq(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAIL\nexpected: ${expected}\nactual:   ${actual}`
    );
  }

  console.log(`${label}: PASS`);
}

function calculate(totalSold) {
  const nominal = DDC("102400000");
  const burnTarget = DDC("51200000");

  const buyerPrincipal = totalSold / 2n;
  const burnFromSales = totalSold - buyerPrincipal;
  const residual = nominal - buyerPrincipal;

  const burnTopUp =
    burnFromSales >= burnTarget
      ? 0n
      : burnTarget - burnFromSales;

  const burnLocked =
    burnFromSales + burnTopUp > residual
      ? residual
      : burnFromSales + burnTopUp;

  const rewardEligible = residual - burnLocked;

  return {
    buyerPrincipal,
    burnFromSales,
    residual,
    burnLocked,
    rewardEligible,
  };
}

async function checkMath() {
  console.log("===== ACCOUNTING BOUNDARIES =====");

  const zero = calculate(0n);
  assertEq("0% burn locked", zero.burnLocked, DDC("51200000"));
  assertEq("0% reward eligible", zero.rewardEligible, DDC("51200000"));

  const half = calculate(DDC("51200000"));
  assertEq("50% buyer principal", half.buyerPrincipal, DDC("25600000"));
  assertEq("50% burn from sales", half.burnFromSales, DDC("25600000"));
  assertEq("50% burn locked", half.burnLocked, DDC("51200000"));
  assertEq("50% reward eligible", half.rewardEligible, DDC("25600000"));

  const full = calculate(DDC("102400000"));
  assertEq("100% buyer principal", full.buyerPrincipal, DDC("51200000"));
  assertEq("100% burn from sales", full.burnFromSales, DDC("51200000"));
  assertEq("100% burn locked", full.burnLocked, DDC("51200000"));
  assertEq("100% reward eligible", full.rewardEligible, 0n);
}

async function checkZeroSalesOnChain() {
  console.log("");
  console.log("===== ZERO-SALES ON-CHAIN FINALIZE =====");

  const [deployer] = await hre.ethers.getSigners();
  const latest = await hre.ethers.provider.getBlock("latest");

  const prices = Array.from(
    { length: 40 },
    (_, index) => (1 + index * 2) * 10_000
  );

  const Token = await hre.ethers.getContractFactory("DDCToken");
  const ddc = await Token.deploy(deployer.address);
  await ddc.waitForDeployment();

  const USDT = await hre.ethers.getContractFactory("USDT18Mock");
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();

  const Reward = await hre.ethers.getContractFactory("DDCRewardPool");
  const reward = await Reward.deploy(
    deployer.address,
    await ddc.getAddress()
  );
  await reward.waitForDeployment();

  const Presale = await hre.ethers.getContractFactory(
    "DDCPresaleVesting"
  );

  const start = Number(latest.timestamp) + 10;

  const presale = await Presale.deploy(
    deployer.address,
    await ddc.getAddress(),
    await usdt.getAddress(),
    await reward.getAddress(),
    deployer.address,
    start,
    prices,
    false,
    0
  );
  await presale.waitForDeployment();

  const presaleAddress = await presale.getAddress();
  const rewardAddress = await reward.getAddress();

  await (await reward.setPresaleOnce(presaleAddress)).wait();

  await (
    await ddc.transfer(
      presaleAddress,
      DDC("102400000")
    )
  ).wait();

  const endOfPresale =
    start +
    Number(await presale.BATCH_DURATION()) * 40 +
    1;

  await time.increaseTo(endOfPresale);

  await (await presale.finalize()).wait();

  assertEq(
    "Finalized",
    await presale.finalized(),
    true
  );

  assertEq(
    "Current batch after sync",
    await presale.currentBatchId(),
    40n
  );

  assertEq(
    "Reward Pool received residual",
    await ddc.balanceOf(rewardAddress),
    DDC("102400000")
  );

  assertEq(
    "Burn locked",
    await reward.burnLockedBalance(),
    DDC("51200000")
  );

  assertEq(
    "Reward eligible",
    await reward.rewardEligibleBalance(),
    DDC("51200000")
  );

  assertEq(
    "Total accounted",
    await reward.totalAccounted(),
    DDC("102400000")
  );

  assertEq(
    "Unaccounted balance",
    await reward.unaccountedBalance(),
    0n
  );
}

async function main() {
  await checkMath();
  await checkZeroSalesOnChain();

  console.log("");
  console.log("====================================");
  console.log("FINALIZE BURN ACCOUNTING: PASS");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
