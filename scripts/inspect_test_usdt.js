require("dotenv").config({
  path: ".env.staging.full-deploy-test",
  override: true,
});

const hre = require("hardhat");

async function safeCall(label, fn) {
  try {
    const value = await fn();
    console.log(`${label}:`, value?.toString?.() ?? value);
    return value;
  } catch (error) {
    console.log(`${label}: NOT SUPPORTED / REVERT`);
    return null;
  }
}

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const address = hre.ethers.getAddress(
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const code = await hre.ethers.provider.getCode(address);

  console.log("Signer:", signer.address);
  console.log("USDT:", address);
  console.log("Code:", code === "0x" ? "NO" : "YES");

  if (code === "0x") {
    throw new Error("USDT address has no contract code");
  }

  const token = new hre.ethers.Contract(
    address,
    [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function owner() view returns (address)",
      "function mint(address,uint256)",
      "function faucet(address,uint256)",
    ],
    signer
  );

  await safeCall("name", () => token.name());
  await safeCall("symbol", () => token.symbol());
  const decimals = await safeCall("decimals", () => token.decimals());
  await safeCall("totalSupply", () => token.totalSupply());

  const balance = await safeCall(
    "signer balance raw",
    () => token.balanceOf(signer.address)
  );

  if (decimals !== null && balance !== null) {
    console.log(
      "signer balance formatted:",
      hre.ethers.formatUnits(balance, Number(decimals))
    );
  }

  await safeCall("owner()", () => token.owner());

  const testAmount = hre.ethers.parseUnits("1", 6);

  await safeCall(
    "mint static test",
    () => token.mint.staticCall(signer.address, testAmount)
  );

  await safeCall(
    "faucet static test",
    () => token.faucet.staticCall(signer.address, testAmount)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
