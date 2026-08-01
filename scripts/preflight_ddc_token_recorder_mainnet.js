const hre = require("hardhat");

async function main() {
  const { ethers } = hre;

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== 56) {
    throw new Error(
      `WRONG NETWORK: expected BNB mainnet chainId 56, received ${chainId}`
    );
  }

  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error("No deployer signer configured");
  }

  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  const ownerAddress =
    process.env.DDC_TOKEN_RECORDER_OWNER?.trim() ||
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS?.trim() ||
    "";

  const writerAddress =
    process.env.DDC_TOKEN_RECORDER_WRITER?.trim() ||
    deployerAddress;

  if (!ethers.isAddress(ownerAddress)) {
    throw new Error(
      "DDC_TOKEN_RECORDER_OWNER is missing or invalid"
    );
  }

  if (!ethers.isAddress(writerAddress)) {
    throw new Error(
      "DDC_TOKEN_RECORDER_WRITER is missing or invalid"
    );
  }

  const Recorder = await ethers.getContractFactory(
    "DDCTokenRecorder"
  );

  const deployTx =
    await Recorder.getDeployTransaction(
      ownerAddress,
      writerAddress
    );

  const estimatedGas =
    await ethers.provider.estimateGas({
      ...deployTx,
      from: deployerAddress,
    });

  const feeData = await ethers.provider.getFeeData();

  const gasPrice =
    feeData.gasPrice ??
    feeData.maxFeePerGas ??
    0n;

  const estimatedCost =
    estimatedGas * gasPrice;

  console.log("===== DDC TOKEN RECORDER MAINNET PREFLIGHT =====");
  console.log("Chain ID:", chainId);
  console.log("Deployer:", deployerAddress);
  console.log(
    "Deployer BNB balance:",
    ethers.formatEther(balance)
  );
  console.log("Owner:", ownerAddress);
  console.log("Initial writer:", writerAddress);
  console.log("Estimated gas:", estimatedGas.toString());
  console.log(
    "Estimated deployment cost:",
    ethers.formatEther(estimatedCost),
    "BNB"
  );

  if (balance <= estimatedCost) {
    throw new Error(
      "Insufficient BNB balance for deployment"
    );
  }

  console.log();
  console.log("Existing contracts touched: NONE");
  console.log("Presale Recorder touched: NO");
  console.log("Presale contract touched: NO");
  console.log("Treasury contract touched: NO");
  console.log();
  console.log("PREFLIGHT PASS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
