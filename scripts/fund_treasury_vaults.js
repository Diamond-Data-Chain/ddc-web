require("dotenv").config({
  path: ".env.staging.full-deploy-test",
  override: true,
});

const hre = require("hardhat");

const EXECUTE = process.env.EXECUTE === "true";
const TARGET = String(process.env.TARGET || "").toLowerCase();
const AMOUNT_USDT = process.env.AMOUNT_USDT;

function mustAddress(name, value) {
  if (!value) throw new Error(`Missing ${name}`);

  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

async function requireCode(name, address) {
  const code = await hre.ethers.provider.getCode(address);

  if (code === "0x") {
    throw new Error(`${name} has no contract code: ${address}`);
  }
}

async function main() {
  const [funder] = await hre.ethers.getSigners();

  if (!funder) throw new Error("No funding signer available");

  if (!["monthly", "adamas"].includes(TARGET)) {
    throw new Error("TARGET must be monthly or adamas");
  }

  if (!AMOUNT_USDT) {
    throw new Error("Missing AMOUNT_USDT");
  }

  const usdtAddress = mustAddress(
    "NEXT_PUBLIC_USDT_ADDRESS",
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const monthlyAddress = mustAddress(
    "NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS",
    process.env.NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS
  );

  const adamasAddress = mustAddress(
    "NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS",
    process.env.NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS
  );

  const targetAddress =
    TARGET === "monthly" ? monthlyAddress : adamasAddress;

  await requireCode("USDT", usdtAddress);
  await requireCode("Target vault", targetAddress);

  const usdt = new hre.ethers.Contract(
    usdtAddress,
    [
      "function decimals() view returns (uint8)",
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address,uint256) returns (bool)",
    ],
    funder
  );

  const decimals = Number(await usdt.decimals());

  if (decimals !== 6) {
    throw new Error(`Expected 6-decimal USDT, received ${decimals}`);
  }

  const amount = hre.ethers.parseUnits(AMOUNT_USDT, decimals);

  if (amount <= 0n) {
    throw new Error("AMOUNT_USDT must be greater than zero");
  }

  const funderBalance = await usdt.balanceOf(funder.address);
  const currentVaultBalance = await usdt.balanceOf(targetAddress);

  console.log("====================================");
  console.log("Incremental Treasury Vault Funding");
  console.log("====================================");
  console.log("Execute:", EXECUTE ? "YES" : "NO (DRY RUN)");
  console.log("Target:", TARGET);
  console.log("Vault:", targetAddress);
  console.log("Amount:", hre.ethers.formatUnits(amount, decimals), "USDT");
  console.log(
    "Vault balance before:",
    hre.ethers.formatUnits(currentVaultBalance, decimals),
    "USDT"
  );
  console.log(
    "Funder balance:",
    hre.ethers.formatUnits(funderBalance, decimals),
    "USDT"
  );

  if (funderBalance < amount) {
    throw new Error("Funder has insufficient USDT");
  }

  if (!EXECUTE) {
    console.log("DRY RUN PASS — no transfer executed");
    return;
  }

  const tx = await usdt.transfer(targetAddress, amount);
  console.log("Funding tx:", tx.hash);

  await tx.wait(2);

  const expectedFinalBalance = currentVaultBalance + amount;
  let finalVaultBalance = 0n;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    finalVaultBalance = await usdt.balanceOf(targetAddress);

    if (finalVaultBalance === expectedFinalBalance) {
      break;
    }

    console.log(
      `Balance verification retry ${attempt}/10:`,
      hre.ethers.formatUnits(finalVaultBalance, decimals),
      "USDT"
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (finalVaultBalance !== expectedFinalBalance) {
    throw new Error(
      `Vault balance verification failed. Expected ${
        hre.ethers.formatUnits(expectedFinalBalance, decimals)
      }, received ${
        hre.ethers.formatUnits(finalVaultBalance, decimals)
      } USDT`
    );
  }

  console.log(
    "Vault balance after:",
    hre.ethers.formatUnits(finalVaultBalance, decimals),
    "USDT"
  );

  console.log("FUNDING PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
