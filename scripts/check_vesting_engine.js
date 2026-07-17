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

async function expectRevert(label, promise, expectedText) {
  try {
    await promise;
    throw new Error(`${label} FAIL: did not revert`);
  } catch (error) {
    const message =
      error?.shortMessage ||
      error?.reason ||
      error?.message ||
      String(error);

    if (!message.includes(expectedText)) {
      throw new Error(
        `${label} FAIL\nexpected: ${expectedText}\nactual: ${message}`
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

  await (await reward.setPresaleOnce(presaleAddress)).wait();

  await (
    await ddc.transfer(
      presaleAddress,
      DDC("102400000")
    )
  ).wait();

  await (await usdt.mint(buyer.address, USDT("50"))).wait();

  await (
    await usdt.connect(buyer).approve(
      presaleAddress,
      USDT("50")
    )
  ).wait();

  await (
    await presale.connect(buyer).buyWithUSDT(
      USDT("50"),
      hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes("vesting-check")
      )
    )
  ).wait();

  const principal = DDC("2500");

  assertEq(
    "Vesting principal",
    await presale.vestingPrincipal(buyer.address),
    principal
  );

  assertEq(
    "Claimable before TGE set",
    await presale.claimable(buyer.address),
    0n
  );

  assertEq(
    "Locked before TGE",
    await presale.locked(buyer.address),
    principal
  );

  await expectRevert(
    "Claim before TGE blocked",
    presale.connect(buyer).claim(),
    "nothing claimable"
  );

  const block = await hre.ethers.provider.getBlock("latest");
  const tge = Number(block.timestamp) + 100;

  await (await presale.setTGE(tge)).wait();

  await expectRevert(
    "TGE can only be set once",
    presale.setTGE(tge + 100),
    "TGE already set"
  );

  await time.increaseTo(tge);

  assertEq(
    "Claimable at TGE = 10%",
    await presale.claimable(buyer.address),
    DDC("250")
  );

  await (await presale.connect(deployer).pause()).wait();

  const claimedBeforePausedClaim =
    await presale.claimed(buyer.address);

  await (
    await presale.connect(buyer).claim()
  ).wait();

  const claimedAfterPausedClaim =
    await presale.claimed(buyer.address);

  if (claimedAfterPausedClaim <= claimedBeforePausedClaim) {
    throw new Error("Claim did not increase while paused");
  }

  console.log("Claim works while paused: PASS");

  assertEq(
    "Buyer received claimed amount",
    await ddc.balanceOf(buyer.address),
    claimedAfterPausedClaim
  );

  const lockedAfterTgeClaim =
    await presale.locked(buyer.address);

  const claimedAfterTgeClaim =
    await presale.claimed(buyer.address);

  const claimableAfterTgeClaim =
    await presale.claimable(buyer.address);

  assertEq(
    "Vesting conservation after TGE claim",
    lockedAfterTgeClaim +
      claimedAfterTgeClaim +
      claimableAfterTgeClaim,
    principal
  );

  if (lockedAfterTgeClaim > DDC("2250")) {
    throw new Error("Locked amount exceeds 90% after TGE");
  }

  console.log("Locked at TGE is at most 90%: PASS");

  await time.increaseTo(tge + 180 * 24 * 60 * 60);

  assertEq(
    "Unlocked total at 180d = 55%",
    (await presale.claimable(buyer.address)) +
      (await presale.claimed(buyer.address)),
    DDC("1375")
  );

  await time.increaseTo(tge + 360 * 24 * 60 * 60);

  assertEq(
    "Unlocked total at 360d = 85%",
    (await presale.claimable(buyer.address)) +
      (await presale.claimed(buyer.address)),
    DDC("2125")
  );

  await time.increaseTo(tge + 540 * 24 * 60 * 60);

  assertEq(
    "Unlocked total at 540d = 100%",
    (await presale.claimable(buyer.address)) +
      (await presale.claimed(buyer.address)),
    principal
  );

  await (await presale.connect(buyer).claim()).wait();

  assertEq(
    "Final claimed equals principal",
    await presale.claimed(buyer.address),
    principal
  );

  assertEq(
    "Final locked is zero",
    await presale.locked(buyer.address),
    0n
  );

  assertEq(
    "Final claimable is zero",
    await presale.claimable(buyer.address),
    0n
  );

  await expectRevert(
    "Double claim blocked",
    presale.connect(buyer).claim(),
    "nothing claimable"
  );

  console.log("");
  console.log("====================================");
  console.log("VESTING ENGINE: PASS");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
