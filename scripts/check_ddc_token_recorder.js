const hre = require("hardhat");
const assert = require("assert");

async function expectRevert(
  promise,
  expectedText
) {
  try {
    await promise;
  } catch (error) {
    const message =
      error?.shortMessage ||
      error?.message ||
      String(error);

    assert(
      message.includes(expectedText),
      `Expected revert containing "${expectedText}", got: ${message}`
    );

    return;
  }

  throw new Error(
    `Expected revert containing "${expectedText}"`
  );
}

async function main() {
  const [
    owner,
    writer,
    outsider
  ] = await hre.ethers.getSigners();

  const Recorder =
    await hre.ethers.getContractFactory(
      "DDCTokenRecorder"
    );

  const recorder = await Recorder.deploy(
    owner.address,
    writer.address
  );

  await recorder.waitForDeployment();

  console.log(
    "DDCTokenRecorder:",
    await recorder.getAddress()
  );

  const projectId =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "DDC_WATCH_V1"
      )
    );

  const category =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "PUBLIC_VERIFICATION"
      )
    );

  const sourceId =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "EU_AI_ACT"
      )
    );

  const contentHash1 =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "EU AI Act version 1"
      )
    );

  const reportHash1 =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "Verification report 1"
      )
    );

  const metadataHash1 =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "Metadata 1"
      )
    );

  const observedAt1 =
    Math.floor(Date.now() / 1000) - 60;

  const tx1 =
    await recorder
      .connect(writer)
      .registerRecord(
        projectId,
        category,
        sourceId,
        contentHash1,
        hre.ethers.ZeroHash,
        reportHash1,
        metadataHash1,
        0,
        observedAt1
      );

  const receipt1 = await tx1.wait();

  console.log(
    "Record 1 tx:",
    receipt1.hash
  );

  const record1 =
    await recorder.getRecord(1);

  assert.equal(
    record1.recordNumber.toString(),
    "1"
  );

  assert.equal(
    record1.projectId,
    projectId
  );

  assert.equal(
    record1.contentHash,
    contentHash1
  );

  assert.equal(
    record1.previousRecordNumber.toString(),
    "0"
  );

  const contentHash2 =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "EU AI Act version 2"
      )
    );

  const reportHash2 =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "Verification report 2"
      )
    );

  const metadataHash2 =
    hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(
        "Metadata 2"
      )
    );

  const observedAt2 =
    observedAt1 + 60;

  const tx2 =
    await recorder
      .connect(writer)
      .registerRecord(
        projectId,
        category,
        sourceId,
        contentHash2,
        contentHash1,
        reportHash2,
        metadataHash2,
        1,
        observedAt2
      );

  await tx2.wait();

  const record2 =
    await recorder.getRecord(2);

  assert.equal(
    record2.previousRecordNumber.toString(),
    "1"
  );

  assert.equal(
    record2.previousContentHash,
    contentHash1
  );

  assert.equal(
    (
      await recorder.projectRecordCount(
        projectId
      )
    ).toString(),
    "2"
  );

  assert.equal(
    (
      await recorder.sourceRecordCount(
        sourceId
      )
    ).toString(),
    "2"
  );

  const projectRecords =
    await recorder.projectRecords(
      projectId,
      0,
      10
    );

  assert.deepEqual(
    projectRecords.map(String),
    ["1", "2"]
  );

  await expectRevert(
    recorder
      .connect(writer)
      .registerRecord(
        projectId,
        category,
        sourceId,
        contentHash2,
        contentHash1,
        reportHash2,
        metadataHash2,
        1,
        observedAt2
      ),
    "content already registered"
  );

  await expectRevert(
    recorder
      .connect(outsider)
      .registerRecord(
        projectId,
        category,
        sourceId,
        hre.ethers.keccak256(
          hre.ethers.toUtf8Bytes(
            "unauthorized content"
          )
        ),
        hre.ethers.ZeroHash,
        reportHash1,
        metadataHash1,
        0,
        observedAt1
      ),
    "not writer"
  );

  await expectRevert(
    recorder
      .connect(writer)
      .registerRecord(
        projectId,
        category,
        sourceId,
        hre.ethers.keccak256(
          hre.ethers.toUtf8Bytes(
            "bad version"
          )
        ),
        hre.ethers.keccak256(
          hre.ethers.toUtf8Bytes(
            "wrong previous hash"
          )
        ),
        reportHash2,
        metadataHash2,
        1,
        observedAt2
      ),
    "previous hash mismatch"
  );

  await (
    await recorder
      .connect(owner)
      .setWriter(
        outsider.address,
        true
      )
  ).wait();

  assert.equal(
    await recorder.writers(
      outsider.address
    ),
    true
  );

  console.log(
    "DDCTokenRecorder checks: PASS"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
