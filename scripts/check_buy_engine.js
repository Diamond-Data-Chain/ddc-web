const hre = require("hardhat");

const DDC = (v) => hre.ethers.parseUnits(v, 18);
const USDT = (v) => hre.ethers.parseUnits(v, 18);

function assertEq(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} FAIL\nexpected: ${expected}\nactual:   ${actual}`);
  }
  console.log(`${label}: PASS`);
}

async function expectRevert(label, promise, expectedText) {
  try {
    await promise;
    throw new Error(`${label} FAIL: transaction did not revert`);
  } catch (error) {
    const message =
      error?.shortMessage ||
      error?.reason ||
      error?.message ||
      String(error);

    if (!message.includes(expectedText)) {
      throw new Error(
        `${label} FAIL\nexpected revert containing: ${expectedText}\nactual: ${message}`
      );
    }

    console.log(`${label}: PASS`);
  }
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

  const USDTMock = await hre.ethers.getContractFactory("USDT18Mock");
  const usdt = await USDTMock.deploy();
  await usdt.waitForDeployment();

  const Reward = await hre.ethers.getContractFactory("DDCRewardPool");
  const reward = await Reward.deploy(
    deployer.address,
    await ddc.getAddress()
  );
  await reward.waitForDeployment();

  const Presale = await hre.ethers.getContractFactory("DDCPresaleVesting");
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

  const Recorder = await hre.ethers.getContractFactory(
    "DDCPresaleRecorder"
  );

  const recorder = await Recorder.deploy(
    deployer.address,
    presaleAddress
  );

  await recorder.waitForDeployment();

  await (
    await presale.setRecorderOnce(
      await recorder.getAddress()
    )
  ).wait();

  await (await reward.setPresaleOnce(presaleAddress)).wait();
  await (await usdt.mint(buyer.address, USDT("10000"))).wait();
  await (await usdt.connect(buyer).approve(presaleAddress, USDT("10000"))).wait();

  const txId = (text) =>
    hre.ethers.keccak256(hre.ethers.toUtf8Bytes(text));

  await expectRevert(
    "Below minimum 49.999999 USDT",
    presale.connect(buyer).buyWithUSDT(
      USDT("49.999999"),
      txId("below-min")
    ),
    "below min"
  );

  await (
    await presale.connect(buyer).buyWithUSDT(
      USDT("50"),
      txId("min-buy")
    )
  ).wait();

  assertEq(
    "50 USDT gives 5000 DDC in Batch 1",
    await presale.totalPurchased(buyer.address),
    DDC("5000")
  );

  assertEq(
    "Buyer vesting after 50 USDT",
    await presale.vestingPrincipal(buyer.address),
    DDC("2500")
  );

  assertEq(
    "Internal spent after 50 USDT",
    await presale.spentUsdtPerBatch(1, buyer.address),
    hre.ethers.parseUnits("50", 6)
  );

  await (
    await presale.connect(buyer).buyWithUSDT(
      USDT("4950"),
      txId("reach-max")
    )
  ).wait();

  assertEq(
    "Exact 5000 USDT batch cap accepted",
    await presale.spentUsdtPerBatch(1, buyer.address),
    hre.ethers.parseUnits("5000", 6)
  );

  assertEq(
    "Total DDC after 5000 USDT",
    await presale.totalPurchased(buyer.address),
    DDC("500000")
  );

  await expectRevert(
    "Above 5000 USDT batch cap rejected",
    presale.connect(buyer).buyWithUSDT(
      USDT("50"),
      txId("above-max")
    ),
    "above max"
  );

  await expectRevert(
    "More than 6 payment decimals rejected",
    presale.connect(buyer).buyWithUSDT(
      50n * 10n ** 18n + 1n,
      txId("precision")
    ),
    "usdt precision exceeds 6 decimals"
  );

  assertEq(
    "Claimable before TGE",
    await presale.claimable(buyer.address),
    0n
  );

  console.log("");
  console.log("====================================");
  console.log("BUY ENGINE: PASS");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
