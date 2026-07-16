const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});

require("dotenv").config({
  path: path.resolve(".env"),
  override: false,
});

const hre = require("hardhat");

function mustAddress(name, value) {
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return hre.ethers.getAddress(value);
}

async function main() {
  const [signer] = await hre.ethers.getSigners();

  if (!signer) {
    throw new Error(
      "No signer available. Check DEPLOYER_PRIVATE_KEY/BOT_PRIVATE_KEY."
    );
  }

  const expectedChainId = Number(
    process.env.EXPECTED_CHAIN_ID || "0"
  );

  if (![56, 97].includes(expectedChainId)) {
    throw new Error(
      "EXPECTED_CHAIN_ID must explicitly be 56 or 97"
    );
  }

  const network = await hre.ethers.provider.getNetwork();
  const actualChainId = Number(network.chainId);

  if (actualChainId !== expectedChainId) {
    throw new Error(
      `Wrong network. Expected ${expectedChainId}, received ${actualChainId}`
    );
  }

  const presaleAddress = mustAddress(
    "NEXT_PUBLIC_PRESALE_ADDRESS",
    process.env.NEXT_PUBLIC_PRESALE_ADDRESS
  );

  const usdtAddress = mustAddress(
    "NEXT_PUBLIC_USDT_ADDRESS",
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const treasuryAddress = mustAddress(
    "NEXT_PUBLIC_TREASURY_ADDRESS",
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );

  const presaleCode =
    await hre.ethers.provider.getCode(presaleAddress);

  if (presaleCode === "0x") {
    throw new Error(
      `Presale has no contract code: ${presaleAddress}`
    );
  }

  const usdtCode =
    await hre.ethers.provider.getCode(usdtAddress);

  if (usdtCode === "0x") {
    throw new Error(
      `USDT has no contract code: ${usdtAddress}`
    );
  }

  const presale = new hre.ethers.Contract(
    presaleAddress,
    [
      "function treasury() view returns (address)",
      "function TREASURY_SWEEP_THRESHOLD_USDT() view returns (uint256)",
      "function sweepRaisedFundsToTreasury()",
    ],
    signer
  );

  const usdt = new hre.ethers.Contract(
    usdtAddress,
    [
      "function decimals() view returns (uint8)",
      "function balanceOf(address) view returns (uint256)",
    ],
    hre.ethers.provider
  );

  const configuredTreasury =
    hre.ethers.getAddress(await presale.treasury());

  if (configuredTreasury !== treasuryAddress) {
    throw new Error(
      `Treasury mismatch. Contract=${configuredTreasury}, ENV=${treasuryAddress}`
    );
  }

  const decimals = Number(await usdt.decimals());

  if (decimals < 6 || decimals > 18) {
    throw new Error(
      `Unsupported USDT decimals: ${decimals}`
    );
  }

  const threshold =
    await presale.TREASURY_SWEEP_THRESHOLD_USDT();

  const balance =
    await usdt.balanceOf(presaleAddress);

  console.log("====================================");
  console.log("DDC TREASURY SWEEP KEEPER");
  console.log("====================================");
  console.log("Chain ID :", actualChainId);
  console.log("Signer   :", signer.address);
  console.log("Presale  :", presaleAddress);
  console.log("Treasury :", configuredTreasury);
  console.log(
    "Balance  :",
    hre.ethers.formatUnits(balance, decimals),
    "USDT"
  );
  console.log(
    "Threshold:",
    hre.ethers.formatUnits(threshold, decimals),
    "USDT"
  );

  if (balance < threshold) {
    console.log("");
    console.log("NO ACTION — threshold not reached");
    return;
  }

  const signerBalance =
    await hre.ethers.provider.getBalance(signer.address);

  if (signerBalance === 0n) {
    throw new Error("Keeper signer has no BNB for gas");
  }

  const treasuryBefore =
    await usdt.balanceOf(configuredTreasury);

  const tx = await presale.sweepRaisedFundsToTreasury();

  console.log("Sweep tx:", tx.hash);

  await tx.wait();

  const presaleAfter =
    await usdt.balanceOf(presaleAddress);

  const treasuryAfter =
    await usdt.balanceOf(configuredTreasury);

  if (presaleAfter !== 0n) {
    throw new Error(
      `Presale USDT balance not cleared: ${hre.ethers.formatUnits(
        presaleAfter,
        decimals
      )}`
    );
  }

  if (treasuryAfter !== treasuryBefore + balance) {
    throw new Error(
      "Treasury balance increase does not match swept amount"
    );
  }

  console.log("");
  console.log("TREASURY SWEEP: PASS");
  console.log(
    "Transferred:",
    hre.ethers.formatUnits(balance, decimals),
    "USDT"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
