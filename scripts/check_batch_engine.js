const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const DDC = (value) => hre.ethers.parseUnits(value, 18);
const USDT = (value) => hre.ethers.parseUnits(value, 18);

function assertEq(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAIL\nexpected: ${expected}\nactual:   ${actual}`
    );
  }

  console.log(`${label}: PASS`);
}

async function deployFixture() {
  const signers = await hre.ethers.getSigners();
  const [deployer] = signers;

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

  await (
    await reward.setPresaleOnce(presaleAddress)
  ).wait();

  return {
    signers,
    ddc,
    usdt,
    reward,
    presale,
  };
}

function txId(text) {
  return hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes(text)
  );
}

async function buy(presale, usdt, buyer, amount, memo) {
  const raw = USDT(amount);
  const presaleAddress = await presale.getAddress();

  await (await usdt.mint(buyer.address, raw)).wait();

  await (
    await usdt
      .connect(buyer)
      .approve(presaleAddress, raw)
  ).wait();

  await (
    await presale
      .connect(buyer)
      .buyWithUSDT(raw, txId(memo))
  ).wait();
}

async function checkSoldOutTransition() {
  console.log("===== SOLD-OUT TRANSITION =====");

  const { signers, usdt, presale } =
    await deployFixture();

  const buyers = signers.slice(1, 7);

  const amounts = [
    "5000",
    "5000",
    "5000",
    "5000",
    "5000",
    "600",
  ];

  for (let i = 0; i < buyers.length; i += 1) {
    await buy(
      presale,
      usdt,
      buyers[i],
      amounts[i],
      `sold-out-${i + 1}`
    );
  }

  assertEq(
    "Batch advances instantly after sold-out",
    await presale.currentBatchId(),
    2n
  );

  const batch1 = await presale.batchInfo(1);
  const batch2 = await presale.batchInfo(2);

  assertEq(
    "Batch 1 sold exactly hard cap",
    batch1.soldDDC,
    DDC("2560000")
  );

  assertEq(
    "Batch 1 closed",
    batch1.isClosed,
    true
  );

  assertEq(
    "Batch 2 price",
    batch2.priceUSDT,
    30_000n
  );

  assertEq(
    "Batch 2 rollover is zero",
    batch2.rolloverInDDC,
    0n
  );

  assertEq(
    "Batch 2 hard cap",
    batch2.hardCapDDC,
    DDC("2560000")
  );
}

async function checkTimeExpiryRollover() {
  console.log("");
  console.log("===== TIME-EXPIRY ROLLOVER =====");

  const { signers, usdt, presale } =
    await deployFixture();

  const buyer = signers[1];
  const batch1Before = await presale.batchInfo(1);

  await time.increaseTo(
    Number(batch1Before.endTime) + 1
  );

  await buy(
    presale,
    usdt,
    buyer,
    "50",
    "batch-2-after-expiry"
  );

  assertEq(
    "Current batch after Batch 1 expiry",
    await presale.currentBatchId(),
    2n
  );

  const batch1 = await presale.batchInfo(1);
  const batch2 = await presale.batchInfo(2);

  assertEq(
    "Expired Batch 1 closed",
    batch1.isClosed,
    true
  );

  assertEq(
    "Batch 2 price after expiry",
    batch2.priceUSDT,
    30_000n
  );

  assertEq(
    "Unsold Batch 1 rolled into Batch 2",
    batch2.rolloverInDDC,
    DDC("2560000")
  );

  assertEq(
    "Batch 2 hard cap includes rollover",
    batch2.hardCapDDC,
    DDC("5120000")
  );

  const expectedBatch2Purchase =
    (hre.ethers.parseUnits("50", 6) * DDC("1")) /
    30_000n;

  assertEq(
    "Purchase after expiry recorded in Batch 2",
    batch2.soldDDC,
    expectedBatch2Purchase
  );

  assertEq(
    "Buyer spent recorded in Batch 2",
    await presale.spentUsdtPerBatch(
      2,
      buyer.address
    ),
    hre.ethers.parseUnits("50", 6)
  );

  assertEq(
    "Buyer did not spend in Batch 1",
    await presale.spentUsdtPerBatch(
      1,
      buyer.address
    ),
    0n
  );
}

async function main() {
  await checkSoldOutTransition();
  await checkTimeExpiryRollover();

  console.log("");
  console.log("====================================");
  console.log("BATCH ENGINE: PASS");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
