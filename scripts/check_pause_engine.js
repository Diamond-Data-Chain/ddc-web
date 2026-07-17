const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const DDC = (v) => hre.ethers.parseUnits(v, 18);
const USDT = (v) => hre.ethers.parseUnits(v, 18);

function assertEq(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} FAIL\nexpected: ${expected}\nactual: ${actual}`);
  }
  console.log(label + ": PASS");
}

async function expectRevert(label, promise, expected) {
  try {
    await promise;
    throw new Error(label + " FAIL (no revert)");
  } catch (e) {
    const msg =
      e?.shortMessage ||
      e?.reason ||
      e?.message ||
      String(e);

    if (!msg.includes(expected)) {
      throw new Error(
        `${label} FAIL\nexpected: ${expected}\nactual: ${msg}`
      );
    }

    console.log(label + ": PASS");
  }
}

function txId(x) {
  return hre.ethers.keccak256(hre.ethers.toUtf8Bytes(x));
}

async function main() {
  const [owner, buyer] = await hre.ethers.getSigners();

  const latest = await hre.ethers.provider.getBlock("latest");

  const prices = Array.from(
    { length: 40 },
    (_, i) => (1 + i * 2) * 10000
  );

  const Token = await hre.ethers.getContractFactory("DDCToken");
  const ddc = await Token.deploy(owner.address);
  await ddc.waitForDeployment();

  const USDTMock = await hre.ethers.getContractFactory("USDT18Mock");
  const usdt = await USDTMock.deploy();
  await usdt.waitForDeployment();

  const Reward = await hre.ethers.getContractFactory("DDCRewardPool");
  const reward = await Reward.deploy(owner.address, await ddc.getAddress());
  await reward.waitForDeployment();

  const Presale = await hre.ethers.getContractFactory("DDCPresaleVesting");

  const presale = await Presale.deploy(
    owner.address,
    await ddc.getAddress(),
    await usdt.getAddress(),
    await reward.getAddress(),
    owner.address,
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
    owner.address,
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
      await presale.getAddress(),
      DDC("102400000")
    )
  ).wait();

  await (await usdt.mint(buyer.address, USDT("50"))).wait();

  await (
    await usdt
      .connect(buyer)
      .approve(await presale.getAddress(), USDT("50"))
  ).wait();

  console.log("===== PAUSE =====");

  await (await presale.pause()).wait();

  await expectRevert(
    "Buy blocked while paused",
    presale.connect(buyer).buyWithUSDT(
      USDT("50"),
      txId("paused-buy")
    ),
    "EnforcedPause"
  );

  const block = await hre.ethers.provider.getBlock("latest");
  const tge = Number(block.timestamp) + 100;

  await (await presale.setTGE(tge)).wait();

  await (await presale.unpause()).wait();

  await (
    await presale
      .connect(buyer)
      .buyWithUSDT(
        USDT("50"),
        txId("buy")
      )
  ).wait();

  await (await presale.pause()).wait();

  await time.increaseTo(tge);

  await (
    await presale
      .connect(buyer)
      .claim()
  ).wait();

  if ((await presale.claimed(buyer.address)) === 0n) {
    throw new Error("Claim failed while paused");
  }

  console.log("Claim while paused: PASS");

  console.log("");
  console.log("====================================");
  console.log("PAUSE ENGINE: PASS");
  console.log("====================================");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
