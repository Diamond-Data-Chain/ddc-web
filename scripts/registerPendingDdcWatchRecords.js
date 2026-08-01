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

function formatDdtNumber(recordNumber) {
  return `DDT-${recordNumber.toString().padStart(8, "0")}`;
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

  const pending = records.filter(
    (item) =>
      item.ddcTokenRegistrationStatus === "pending"
  );

  if (pending.length === 0) {
    console.log("No pending DDC Watch records.");
    return;
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

  const projectId = bytes32FromText("DDC_WATCH_V1");

  console.log("===== REGISTER PENDING DDC WATCH RECORDS =====");
  console.log("Recorder:", recorderAddress);
  console.log("Writer:", writerAddress);
  console.log("Pending records:", pending.length);

  for (const record of pending) {
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
          `Previous version not registered for ${record.recordId}`
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
      throw new Error(
        `Invalid observedAt for ${record.recordId}`
      );
    }

    const existingRecordNumber =
      await recorder.recordNumberByContentHash(
        projectId,
        contentHash
      );

    if (existingRecordNumber > 0n) {
      const ddtNumber =
        formatDdtNumber(existingRecordNumber);

      console.log(
        `ALREADY REGISTERED ${record.recordId} -> ${ddtNumber}`
      );

      record.ddcTokenRegistrationStatus =
        "registered";

      record.ddcTokenRecordNumber =
        ddtNumber;

      record.recorderAddress =
        recorderAddress;

      continue;
    }

    const expectedRecordNumber =
      await recorder.nextRecordNumber();

    console.log();
    console.log("Registering:", record.recordId);
    console.log(
      "Expected DDT:",
      formatDdtNumber(expectedRecordNumber)
    );

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
      throw new Error(
        `Registration failed for ${record.recordId}`
      );
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
        `Content hash verification failed for ${record.recordId}`
      );
    }

    const ddtNumber =
      formatDdtNumber(expectedRecordNumber);

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

    console.log(
      `REGISTERED ${record.recordId} -> ${ddtNumber}`
    );
  }

  fs.writeFileSync(
    recordsPath,
    JSON.stringify(records, null, 2) + "\n"
  );

  console.log();
  console.log("Pending registration worker: PASS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
