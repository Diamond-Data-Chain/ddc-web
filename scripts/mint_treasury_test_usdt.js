require("dotenv").config({
  path: ".env.staging.full-deploy-test",
  override: true,
});

const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();

  if (!signer) {
    throw new Error("No signer available");
  }

  const usdtAddress = hre.ethers.getAddress(
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const usdt = new hre.ethers.Contract(
    usdtAddress,
    [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function mint(address,uint256)",
    ],
    signer
  );

  const decimals = Number(await usdt.decimals());

  if (decimals !== 6) {
    throw new Error(`Expected 6 decimals, received ${decimals}`);
  }

  const required = hre.ethers.parseUnits("3866000", decimals);
  const current = await usdt.balanceOf(signer.address);
  const missing = current >= required ? 0n : required - current;

  console.log("Signer:", signer.address);
  console.log("USDT:", usdtAddress);
  console.log(
    "Current:",
    hre.ethers.formatUnits(current, decimals),
    "USDT"
  );
  console.log(
    "Missing:",
    hre.ethers.formatUnits(missing, decimals),
    "USDT"
  );

  if (missing === 0n) {
    console.log("MINT NOT REQUIRED");
    return;
  }

  await usdt.mint.staticCall(signer.address, missing);
  console.log("Mint static call: PASS");

  const tx = await usdt.mint(signer.address, missing);
  console.log("Mint tx:", tx.hash);
  await tx.wait();

  const finalBalance = await usdt.balanceOf(signer.address);

  console.log(
    "Final:",
    hre.ethers.formatUnits(finalBalance, decimals),
    "USDT"
  );

  if (finalBalance < required) {
    throw new Error("Mint verification failed");
  }

  console.log("MINT PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
