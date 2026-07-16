const hre = require("hardhat");

const DDC = (value) =>
  hre.ethers.parseUnits(value, 18);

const USDT = (value) =>
  hre.ethers.parseUnits(value, 18);

function assertEq(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAIL\nexpected: ${expected}\nactual: ${actual}`
    );
  }

  console.log(`${label}: PASS`);
}

async function main() {
  const [deployer, buyer, outsider] =
    await hre.ethers.getSigners();

  const latest =
    await hre.ethers.provider.getBlock("latest");

  const prices = Array.from(
    { length: 40 },
    (_, index) => (1 + index * 2) * 10_000
  );

  const Token =
    await hre.ethers.getContractFactory("DDCToken");

  const ddc =
    await Token.deploy(deployer.address);

  await ddc.waitForDeployment();

  const USDTMock =
    await hre.ethers.getContractFactory("USDT18Mock");

  const usdt = await USDTMock.deploy();

  await usdt.waitForDeployment();

  const Reward =
    await hre.ethers.getContractFactory("DDCRewardPool");

  const reward = await Reward.deploy(
    deployer.address,
    await ddc.getAddress()
  );

  await reward.waitForDeployment();

  const Presale =
    await hre.ethers.getContractFactory(
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

  const presaleAddress =
    await presale.getAddress();

  const Recorder =
    await hre.ethers.getContractFactory(
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

  await (
    await ddc.transfer(
      presaleAddress,
      DDC("102400000")
    )
  ).wait();

  await (
    await usdt.mint(
      buyer.address,
      USDT("50")
    )
  ).wait();

  await (
    await usdt
      .connect(buyer)
      .approve(
        presaleAddress,
        USDT("50")
      )
  ).wait();

  const txId =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes("recorder-e2e")
    );

  await (
    await presale
      .connect(buyer)
      .buyWithUSDT(
        USDT("50"),
        txId
      )
  ).wait();

  const projectId =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes("DDC_PROJECT_V1")
    );

  assertEq(
    "Recorder writer",
    await recorder.writer(),
    presaleAddress
  );

  assertEq(
    "Global record count",
    await recorder.getGlobalPurchaseCount(
      projectId
    ),
    1n
  );

  assertEq(
    "User record count",
    await recorder.getUserPurchaseCount(
      projectId,
      buyer.address
    ),
    1n
  );

  const totals =
    await recorder.getUserPresaleTotals(
      projectId,
      buyer.address
    );

  assertEq(
    "Recorded DDC amount",
    totals.ddc,
    DDC("5000")
  );

  assertEq(
    "Recorded USDT raw amount",
    totals.usdt,
    USDT("50")
  );

  assertEq(
    "Recorded BNB amount",
    totals.bnb,
    0n
  );

  const rows =
    await recorder.listGlobalPurchases(
      projectId,
      0,
      10
    );

  assertEq(
    "Pagination row count",
    BigInt(rows.length),
    1n
  );

  assertEq(
    "Recorded buyer payment asset",
    rows[0].payAsset,
    await usdt.getAddress()
  );

  assertEq(
    "Duplicate protection stored",
    await recorder.recordedSourceRef(
      projectId,
      rows[0].sourceRef
    ),
    true
  );

  try {
    await recorder
      .connect(outsider)
      .recordPurchase(
        projectId,
        outsider.address,
        DDC("1"),
        await usdt.getAddress(),
        USDT("1"),
        0,
        hre.ethers.ZeroHash,
        hre.ethers.keccak256(
          hre.ethers.toUtf8Bytes("fake")
        ),
        Number(latest.timestamp)
      );

    throw new Error(
      "Unauthorized Recorder write did not revert"
    );
  } catch (error) {
    const message =
      error?.shortMessage ||
      error?.reason ||
      error?.message ||
      String(error);

    if (
      !message.includes("not writer") &&
      !message.includes("reverted")
    ) {
      throw error;
    }
  }

  console.log("Unauthorized writer blocked: PASS");

  console.log("");
  console.log("====================================");
  console.log("DDC TOKEN / RECORDER E2E: PASS");
  console.log("====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
