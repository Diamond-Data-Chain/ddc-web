require("dotenv").config({
  path: ".env.staging.full-deploy-test",
  override: true,
});

const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

const ENV_PATH = ".env.staging.full-deploy-test";
const MANIFEST_PATH = "deployments/treasury-vaults.bscTestnet.json";

function mustAddress(name, value) {
  if (!value) throw new Error(`Missing ${name}`);

  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function upsertEnv(name, value) {
  const envPath = path.resolve(ENV_PATH);
  let text = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  const line = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");

  text = pattern.test(text)
    ? text.replace(pattern, line)
    : `${text.trimEnd()}\n${line}\n`;

  fs.writeFileSync(envPath, text);
}

async function requireCode(name, address) {
  const code = await hre.ethers.provider.getCode(address);
  if (code === "0x") {
    throw new Error(`${name} has no deployed code: ${address}`);
  }
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  if (!deployer) {
    throw new Error("No deployer signer available");
  }

  const usdt = mustAddress(
    "NEXT_PUBLIC_USDT_ADDRESS",
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const presale = mustAddress(
    "NEXT_PUBLIC_PRESALE_ADDRESS",
    process.env.NEXT_PUBLIC_PRESALE_ADDRESS
  );

  await requireCode("USDT", usdt);
  await requireCode("Presale", presale);

  console.log("====================================");
  console.log("Deploy Treasury Payout Vaults");
  console.log("====================================");
  console.log("Deployer:", deployer.address);
  console.log("USDT:", usdt);
  console.log("Presale:", presale);

  const MonthlyFactory = await hre.ethers.getContractFactory(
    "DDCMonthlyOpsVault"
  );

  const monthly = await MonthlyFactory.deploy(usdt, presale);
  await monthly.waitForDeployment();

  const monthlyAddress = await monthly.getAddress();
  console.log("MonthlyOpsVault:", monthlyAddress);

  const AdamasFactory = await hre.ethers.getContractFactory(
    "DDCAdamasGrantVault"
  );

  const adamas = await AdamasFactory.deploy(usdt, presale);
  await adamas.waitForDeployment();

  const adamasAddress = await adamas.getAddress();
  console.log("AdamasGrantVault:", adamasAddress);

  await requireCode("MonthlyOpsVault", monthlyAddress);
  await requireCode("AdamasGrantVault", adamasAddress);

  const manifest = {
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    usdt,
    presale,
    monthlyOpsVault: monthlyAddress,
    adamasGrantVault: adamasAddress,
  };

  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  upsertEnv(
    "NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS",
    monthlyAddress
  );

  upsertEnv(
    "NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS",
    adamasAddress
  );

  console.log("------------------------------------");
  console.log("Manifest:", MANIFEST_PATH);
  console.log("Updated:", ENV_PATH);
  console.log("DEPLOY PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
