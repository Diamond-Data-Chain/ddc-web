const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});

const hre = require("hardhat");

const EXPECTED_MONTHLY_RECIPIENT =
  "0x9c6778909831FcBd7BC0935a6d68f15A4ABf7bAF";

const EXPECTED_ADAMAS_RECIPIENT =
  "0x90aDD10eb8742CE37bFd2E66c733f9423D41c3fd";

const EXPECTED_INTERVAL = 30n * 24n * 60n * 60n;
const EXPECTED_MAX_PAYMENTS = 12n;

function mustAddress(name, value) {
  if (!value) throw new Error(`Missing ${name}`);

  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} mismatch: expected ${expected}, actual ${actual}`
    );
  }

  console.log(`${label}: OK`);
}

async function requireCode(name, address) {
  const code = await hre.ethers.provider.getCode(address);

  if (code === "0x") {
    throw new Error(`${name} has no deployed code: ${address}`);
  }
}

async function main() {
  const usdtAddress = mustAddress(
    "NEXT_PUBLIC_USDT_ADDRESS",
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const presaleAddress = mustAddress(
    "NEXT_PUBLIC_PRESALE_ADDRESS",
    process.env.NEXT_PUBLIC_PRESALE_ADDRESS
  );

  const monthlyAddress = mustAddress(
    "NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS",
    process.env.NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS
  );

  const adamasAddress = mustAddress(
    "NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS",
    process.env.NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS
  );

  await requireCode("USDT", usdtAddress);
  await requireCode("Presale", presaleAddress);
  await requireCode("MonthlyOpsVault", monthlyAddress);
  await requireCode("AdamasGrantVault", adamasAddress);

  const monthly = await hre.ethers.getContractAt(
    "DDCMonthlyOpsVault",
    monthlyAddress
  );

  const adamas = await hre.ethers.getContractAt(
    "DDCAdamasGrantVault",
    adamasAddress
  );

  const usdt = new hre.ethers.Contract(
    usdtAddress,
    [
      "function decimals() view returns (uint8)",
      "function balanceOf(address) view returns (uint256)",
    ],
    hre.ethers.provider
  );

  const decimals = Number(await usdt.decimals());

  if (decimals < 6 || decimals > 18) {
    throw new Error(`Unsupported USDT decimals: ${decimals}`);
  }

  const expectedMonthlyAmount =
    hre.ethers.parseUnits("168000", decimals);
  const expectedMonthlyTotal =
    hre.ethers.parseUnits("2016000", decimals);
  const expectedAdamasAmount =
    hre.ethers.parseUnits("1850000", decimals);

  console.log("====================================");
  console.log("Treasury Vault Verification");
  console.log("====================================");

  assertEqual(
    "Monthly recipient",
    await monthly.RECIPIENT(),
    EXPECTED_MONTHLY_RECIPIENT
  );

  assertEqual(
    "Monthly USDT",
    await monthly.usdt(),
    usdtAddress
  );

  assertEqual(
    "Monthly presale",
    await monthly.presale(),
    presaleAddress
  );

  assertEqual(
    "Monthly payment amount",
    await monthly.PAYMENT_AMOUNT(),
    expectedMonthlyAmount
  );

  assertEqual(
    "Monthly interval",
    await monthly.PAYMENT_INTERVAL(),
    EXPECTED_INTERVAL
  );

  assertEqual(
    "Monthly max payments",
    await monthly.MAX_PAYMENTS(),
    EXPECTED_MAX_PAYMENTS
  );

  assertEqual(
    "Monthly required funding",
    await monthly.requiredFullFunding(),
    expectedMonthlyTotal
  );

  assertEqual(
    "Adamas recipient",
    await adamas.RECIPIENT(),
    EXPECTED_ADAMAS_RECIPIENT
  );

  assertEqual(
    "Adamas USDT",
    await adamas.usdt(),
    usdtAddress
  );

  assertEqual(
    "Adamas presale",
    await adamas.presale(),
    presaleAddress
  );

  assertEqual(
    "Adamas grant amount",
    await adamas.GRANT_AMOUNT(),
    expectedAdamasAmount
  );

  assertEqual(
    "Adamas released",
    await adamas.released(),
    false
  );

  const monthlyBalance = await usdt.balanceOf(monthlyAddress);
  const adamasBalance = await usdt.balanceOf(adamasAddress);

  console.log("------------------------------------");
  console.log(
    "Monthly balance:",
    hre.ethers.formatUnits(monthlyBalance, decimals),
    "USDT"
  );

  console.log(
    "Adamas balance :",
    hre.ethers.formatUnits(adamasBalance, decimals),
    "USDT"
  );

  const monthlyPaymentAmount = await monthly.PAYMENT_AMOUNT();
  const adamasGrantAmount = await adamas.GRANT_AMOUNT();

  console.log(
    "Monthly installment:",
    hre.ethers.formatUnits(monthlyPaymentAmount, decimals),
    "USDT"
  );

  console.log(
    "Monthly currently funded for release:",
    monthlyBalance >= monthlyPaymentAmount ? "YES" : "NO"
  );

  console.log(
    "Adamas currently fully funded:",
    adamasBalance >= adamasGrantAmount ? "YES" : "NO"
  );

  console.log("");
  console.log("VERIFY PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
