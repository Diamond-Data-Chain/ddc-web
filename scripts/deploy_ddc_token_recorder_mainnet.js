const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const { ethers } = hre;

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== 56) {
    throw new Error(
      `WRONG NETWORK: expected chainId 56, received ${chainId}`
    );
  }

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const ownerAddress =
    process.env.DDC_TOKEN_RECORDER_OWNER?.trim() ||
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS?.trim() ||
    "";

  const writerAddress =
    process.env.DDC_TOKEN_RECORDER_WRITER?.trim() ||
    deployerAddress;

  if (!ethers.isAddress(ownerAddress)) {
    throw new Error("Invalid owner address");
  }

  if (!ethers.isAddress(writerAddress)) {
    throw new Error("Invalid writer address");
  }

  console.log("===== DEPLOY DDCTokenRecorder =====");
  console.log("Network chainId:", chainId);
  console.log("Deployer:", deployerAddress);
  console.log("Owner:", ownerAddress);
  console.log("Initial writer:", writerAddress);

  const Recorder = await ethers.getContractFactory(
    "DDCTokenRecorder"
  );

  const recorder = await Recorder.deploy(
    ownerAddress,
    writerAddress
  );

  const deploymentTx = recorder.deploymentTransaction();

  if (!deploymentTx) {
    throw new Error("Missing deployment transaction");
  }

  console.log("Deployment tx:", deploymentTx.hash);

  await recorder.waitForDeployment();

  const recorderAddress = await recorder.getAddress();
  const receipt = await deploymentTx.wait();

  const code = await ethers.provider.getCode(
    recorderAddress
  );

  if (code === "0x") {
    throw new Error(
      "Deployment failed: no contract code at address"
    );
  }

  const deployedOwner = await recorder.owner();
  const writerAllowed =
    await recorder.writers(writerAddress);

  if (
    deployedOwner.toLowerCase() !==
    ownerAddress.toLowerCase()
  ) {
    throw new Error("Owner verification failed");
  }

  if (!writerAllowed) {
    throw new Error("Writer verification failed");
  }

  const output = {
    contract: "DDCTokenRecorder",
    chainId,
    address: recorderAddress,
    deploymentTransaction: deploymentTx.hash,
    blockNumber: receipt.blockNumber,
    deployer: deployerAddress,
    owner: ownerAddress,
    initialWriter: writerAddress,
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(
    process.cwd(),
    `deployments/ddc-token-recorder-mainnet-${Date.now()}.json`
  );

  fs.mkdirSync(
    path.dirname(outputPath),
    { recursive: true }
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(output, null, 2) + "\n"
  );

  console.log();
  console.log("DDCTokenRecorder:", recorderAddress);
  console.log("Block:", receipt.blockNumber);
  console.log("Owner verification: PASS");
  console.log("Writer verification: PASS");
  console.log("Deployment record:", outputPath);
  console.log();
  console.log(
    `NEXT_PUBLIC_DDC_TOKEN_RECORDER_ADDRESS=${recorderAddress}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
