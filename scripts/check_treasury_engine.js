const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const DDC = (v) => hre.ethers.parseUnits(v, 18);
const USDT = (v) => hre.ethers.parseUnits(v, 18);

function assertEq(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAIL\nexpected: ${expected}\nactual:   ${actual}`
    );
  }

  console.log(`${label}: PASS`);
}

async function expectRevert(label, promise, expected) {
  try {
    await promise;
    throw new Error(`${label} FAIL: transaction did not revert`);
  } catch (error) {
    const message =
      error?.shortMessage ||
      error?.reason ||
      error?.message ||
      String(error);

    if (!message.includes(expected)) {
      throw new Error(
        `${label} FAIL\nexpected: ${expected}\nactual: ${message}`
      );
    }

    console.log(`${label}: PASS`);
  }
}

function txId(text) {
  return hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes(text)
  );
}

async function deployFixture() {
  const signers = await hre.ethers.getSigners();
  const [treasury] = signers;

  const latest = await hre.ethers.provider.getBlock("latest");

  const prices = Array.from(
    { length: 40 },
    (_, index) => (1 + index * 2) * 10_000
  );

  const Token = await hre.ethers.getContractFactory("DDCToken");
  const ddc = await Token.deploy(treasury.address);
  await ddc.waitForDeployment();

  const USDTMock = await hre.ethers.getContractFactory("USDT18Mock");
  const usdt = await USDTMock.deploy();
  await usdt.waitForDeployment();

  const Reward = await hre.ethers.getContractFactory("DDCRewardPool");
  const reward = await Reward.deploy(
    treasury.address,
    await ddc.getAddress()
  );
  await reward.waitForDeployment();

  const Presale = await hre.ethers.getContractFactory(
    "DDCPresaleVesting"
  );

  const start = Number(latest.timestamp) - 1;

  const presale = await Presale.deploy(
    treasury.address,
    await ddc.getAddress(),
    await usdt.getAddress(),
    await reward.getAddress(),
    treasury.address,
    start,
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
    treasury.address,
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

  await (
    await ddc.transfer(
      presaleAddress,
      DDC("102400000")
    )
  ).wait();

  return {
    signers,
    treasury,
    ddc,
    usdt,
    reward,
    presale,
    presaleAddress,
    start,
  };
}

async function buy(presale, usdt, buyer, amount, memo) {
  const rawAmount = USDT(amount);
  const presaleAddress = await presale.getAddress();

  await (
    await usdt.mint(buyer.address, rawAmount)
  ).wait();

  await (
    await usdt
      .connect(buyer)
      .approve(presaleAddress, rawAmount)
  ).wait();

  await (
    await presale
      .connect(buyer)
      .buyWithUSDT(rawAmount, txId(memo))
  ).wait();
}

async function checkSweep() {
  console.log("===== THRESHOLD SWEEP =====");

  const {
    signers,
    treasury,
    usdt,
    presale,
    presaleAddress,
  } = await deployFixture();

  const buyer1 = signers[1];
  const buyer2 = signers[2];
  const publicCaller = signers[3];

  await buy(presale, usdt, buyer1, "5000", "sweep-buyer-1");
  await buy(presale, usdt, buyer2, "5000", "sweep-buyer-2");

  assertEq(
    "Presale holds exactly 10000 USDT",
    await usdt.balanceOf(presaleAddress),
    USDT("10000")
  );

  const treasuryBefore =
    await usdt.balanceOf(treasury.address);

  await (
    await presale
      .connect(publicCaller)
      .sweepRaisedFundsToTreasury()
  ).wait();

  assertEq(
    "Permissionless sweep empties Presale USDT",
    await usdt.balanceOf(presaleAddress),
    0n
  );

  assertEq(
    "Sweep sends exactly 10000 USDT to Treasury",
    await usdt.balanceOf(treasury.address),
    treasuryBefore + USDT("10000")
  );
}

async function checkFinalizeWithdraw() {
  console.log("");
  console.log("===== FINALIZE WITHDRAW =====");

  const {
    signers,
    treasury,
    usdt,
    presale,
    presaleAddress,
    start,
  } = await deployFixture();

  const buyer = signers[1];
  const outsider = signers[2];

  await buy(presale, usdt, buyer, "100", "final-withdraw");

  await expectRevert(
    "Withdraw before finalize blocked",
    presale.withdrawRaisedFunds(),
    "not finalized"
  );

  const duration =
    Number(await presale.BATCH_DURATION());

  await time.increaseTo(
    start + duration * 40 + 1
  );

  await (
    await presale.connect(outsider).finalize()
  ).wait();

  assertEq(
    "Presale finalized",
    await presale.finalized(),
    true
  );

  await expectRevert(
    "Non-Treasury withdraw blocked",
    presale.connect(outsider).withdrawRaisedFunds(),
    "not treasury"
  );

  const treasuryBefore =
    await usdt.balanceOf(treasury.address);

  await (
    await presale.withdrawRaisedFunds()
  ).wait();

  assertEq(
    "Final withdraw empties Presale USDT",
    await usdt.balanceOf(presaleAddress),
    0n
  );

  assertEq(
    "Treasury receives exactly 100 USDT",
    await usdt.balanceOf(treasury.address),
    treasuryBefore + USDT("100")
  );

  await (
    await presale.withdrawRaisedFunds()
  ).wait();

  assertEq(
    "Second withdraw cannot duplicate funds",
    await usdt.balanceOf(treasury.address),
    treasuryBefore + USDT("100")
  );
}

async function main() {
  await checkSweep();
  await checkFinalizeWithdraw();

  console.log("");
  console.log("====================================");
  console.log("TREASURY ENGINE FULL: PASS");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
