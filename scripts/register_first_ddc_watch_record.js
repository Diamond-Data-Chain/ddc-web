const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

function bytes32FromText(value) {
  return hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes(String(value))
  );
}

function requireBytes32(value, label) {
  if (!hre.ethers.isHexString(value, 32)) {
    throw new Error(`${label} is not bytes32: ${value}`);
  }

  return value;
}

async function main() {
  const { ethers } = hre;

  const network = await ethers.provider.getNetwork();

  if (Number(network.chainId) !== 56) {
    throw new Error(
      `Wrong network: expected 56, received ${network.chainId}`
    );
  }

  const recorderAddress =
    process.env.NEXT_PUBLIC_DDC_TOKEN_RECORDER_ADDRESS?.trim();

  if (!ethers.isAddress(recorderAddress)) {
    throw new Error(
      "NEXT_PUBLIC_DDC_TOKEN_RECORDER_ADDRESS is missing or invalid"
    );
  }

  const recordsPath = path.join(
    process.cwd(),
    "data",
    "ddc-watch",
    "records.json"
  );

  const records = JSON.parse(
    fs.readFileSync(recordsPath, "utf8")
  );

  const record = records.find(
    (item) =>
      item.ddcTokenRegistrationStatus === "pending"
  );

  if (!record) {
    throw new Error("No pending DDC Watch record found");
  }

  const [writer] = await ethers.getSigners();
  const writerAddress = await writer.getAddress();

  const Recorder = await ethers.getContractFactory(
    "DDCTokenRecorder"
  );

  const recorder = Recorder.attach(
    recorderAddress
  ).connect(writer);

  const allowed = await recorder.writers(
    writerAddress
  );

  if (!allowed) {
    throw new Error(
      `Configured signer is not an allowed writer: ${writerAddress}`
    );
  }

  const projectId = bytes32FromText(
    "DDC_WATCH_V1"
  );

  const category = bytes32FromText(
    String(record.category || "PUBLIC_VERIFICATION")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
  );

  const sourceId = bytes32FromText(
    record.sourceId
  );

  const contentHash = requireBytes32(
    record.contentHash,
    "contentHash"
  );

  const previousContentHash =
    record.previousContentHash
      ? requireBytes32(
          record.previousContentHash,
          "previousContentHash"
        )
      : ethers.ZeroHash;

  const verificationReportHash =
    requireBytes32(
      record.verificationReportHash,
      "verificationReportHash"
    );

  const metadataHash = bytes32FromText(
    JSON.stringify({
      recordId: record.recordId,
      sourceId: record.sourceId,
      sourceName: record.sourceName,
      sourceDomain: record.sourceDomain,
      documentTitle: record.documentTitle,
      finalUrl: record.publicUrl || record.finalUrl,
      snapshotFile: record.snapshotFile,
      policyVersion:
        record.verificationPolicyVersion,
    })
  );

  let previousRecordNumber = 0n;

  if (record.previousRecordId) {
    const previousLocalRecord = records.find(
      (item) =>
        item.recordId === record.previousRecordId
    );

    if (
      !previousLocalRecord ||
      !previousLocalRecord.ddcTokenRecordNumber
    ) {
      throw new Error(
        "Previous version is not registered yet"
      );
    }

    previousRecordNumber = BigInt(
      String(
        previousLocalRecord.ddcTokenRecordNumber
      ).replace(/\D/g, "")
    );
  }

  const observedAt = Math.floor(
    new Date(record.observedAt).getTime() / 1000
  );

  if (!Number.isFinite(observedAt) || observedAt <= 0) {
    throw new Error("Invalid observedAt timestamp");
  }

  console.log("===== REGISTER FIRST DDC WATCH RECORD =====");
  console.log("Recorder:", recorderAddress);
  console.log("Writer:", writerAddress);
  console.log("Local record:", record.recordId);
  console.log("Source:", record.sourceId);
  console.log("Content hash:", contentHash);
  console.log(
    "Previous record number:",
    previousRecordNumber.toString()
  );

  const existingRecordNumber =
    await recorder.recordNumberByContentHash(
      projectId,
      contentHash
    );

  if (existingRecordNumber > 0n) {
    throw new Error(
      `Content already registered as DDT-${existingRecordNumber
        .toString()
        .padStart(8, "0")}`
    );
  }

  const expectedRecordNumber =
    await recorder.nextRecordNumber();

  const tx = await recorder.registerRecord(
    projectId,
    category,
    sourceId,
    contentHash,
    previousContentHash,
    verificationReportHash,
    metadataHash,
    previousRecordNumber,
    observedAt
  );

  console.log("Transaction:", tx.hash);

  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Recorder transaction failed");
  }

  const onChainRecord =
    await recorder.getRecord(
      expectedRecordNumber
    );

  if (
    onChainRecord.contentHash.toLowerCase() !==
    contentHash.toLowerCase()
  ) {
    throw new Error(
      "On-chain content hash verification failed"
    );
  }

  const ddtNumber =
    `DDT-${expectedRecordNumber
      .toString()
      .padStart(8, "0")}`;

  record.ddcTokenRegistrationStatus =
    "registered";

  record.ddcTokenRecordNumber =
    ddtNumber;

  record.recorderTransactionHash =
    tx.hash;

  record.recorderBlockNumber =
    receipt.blockNumber;

  record.recorderAddress =
    recorderAddress;

  record.registeredAt =
    new Date(
      Number(onChainRecord.recordedAt) * 1000
    ).toISOString();

  fs.writeFileSync(
    recordsPath,
    JSON.stringify(records, null, 2) + "\n"
  );

  console.log();
  console.log("Registration status: PASS");
  console.log("DDC Token:", ddtNumber);
  console.log("Block:", receipt.blockNumber);
  console.log(
    "On-chain content hash:",
    onChainRecord.contentHash
  );
  console.log(
    "Local records.json updated: YES"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
