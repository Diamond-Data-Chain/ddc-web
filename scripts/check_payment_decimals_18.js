const hre = require("hardhat");

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAIL\nexpected: ${expected}\nactual:   ${actual}`
    );
  }

  console.log(`${label}: PASS`);
}

async function main() {
  const [deployer, buyer] = await hre.ethers.getSigners();
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

  const presale = await Presale.deploy(
    deployer.address,
    await ddc.getAddress(),
    await usdt.getAddress(),
    await reward.getAddress(),
    deployer.address,
    Number(latest.timestamp) - 1,
    prices,
    false,
    0
  );
  await presale.waitForDeployment();

  const presaleAddress = await presale.getAddress();

  const linkTx = await reward.setPresaleOnce(presaleAddress);
  await linkTx.wait();

  const Monthly = await hre.ethers.getContractFactory(
    "DDCMonthlyOpsVault"
  );
  const monthly = await Monthly.deploy(
    await usdt.getAddress(),
    presaleAddress
  );
  await monthly.waitForDeployment();

  const Adamas = await hre.ethers.getContractFactory(
    "DDCAdamasGrantVault"
  );
  const adamas = await Adamas.deploy(
    await usdt.getAddress(),
    presaleAddress
  );
  await adamas.waitForDeployment();

  const payment = hre.ethers.parseUnits("50", 18);

  const mintTx = await usdt.mint(buyer.address, payment);
  await mintTx.wait();

  const approveTx = await usdt
    .connect(buyer)
    .approve(presaleAddress, payment);
  await approveTx.wait();

  const txId = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("DDC-18-DECIMAL-E2E")
  );

  const buyTx = await presale
    .connect(buyer)
    .buyWithUSDT(payment, txId);
  await buyTx.wait();

  const expectedPurchased =
    hre.ethers.parseUnits("5000", 18);

  const expectedHalf =
    hre.ethers.parseUnits("2500", 18);

  assertEqual(
    "USDT decimals",
    await presale.usdtDecimals(),
    18n
  );

  assertEqual(
    "Presale received exactly 50 USDT",
    await usdt.balanceOf(presaleAddress),
    payment
  );

  assertEqual(
    "Buyer USDT balance after purchase",
    await usdt.balanceOf(buyer.address),
    0n
  );

  assertEqual(
    "Batch 1 purchased DDC",
    await presale.totalPurchased(buyer.address),
    expectedPurchased
  );

  assertEqual(
    "Buyer vesting 50%",
    await presale.vestingPrincipal(buyer.address),
    expectedHalf
  );

  assertEqual(
    "Buyer locked amount",
    await presale.locked(buyer.address),
    expectedHalf
  );

  assertEqual(
    "Claimable before TGE",
    await presale.claimable(buyer.address),
    0n
  );

  assertEqual(
    "Internal USD6 spent",
    await presale.spentUsdtPerBatch(1, buyer.address),
    hre.ethers.parseUnits("50", 6)
  );

  assertEqual(
    "Monthly payment amount",
    await monthly.PAYMENT_AMOUNT(),
    hre.ethers.parseUnits("168000", 18)
  );

  assertEqual(
    "Monthly full budget",
    await monthly.requiredFullFunding(),
    hre.ethers.parseUnits("2016000", 18)
  );

  assertEqual(
    "Adamas grant amount",
    await adamas.GRANT_AMOUNT(),
    hre.ethers.parseUnits("1850000", 18)
  );

  console.log("");
  console.log("====================================");
  console.log("18-DECIMAL PAYMENT E2E: PASS");
  console.log("====================================");
  console.log("50 USDT -> 5000 DDC in Batch 1");
  console.log("Buyer vesting -> 2500 DDC");
  console.log("Burn-locked -> 2500 DDC");
  console.log("Claimable before TGE -> 0 DDC");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
