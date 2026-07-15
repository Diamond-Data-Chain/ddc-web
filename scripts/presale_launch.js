const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const envFile = path.resolve(
  process.env.ENV_FILE || ".env.production"
);

require("dotenv").config({
  path: envFile,
  override: true,
});

function fail(message) {
  console.error(`\nLAUNCH ABORTED: ${message}`);
  process.exit(1);
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    fail(`Missing ${name}`);
  }

  return value;
}

function run(label, command, args, extraEnv = {}) {
  console.log("");
  console.log("====================================");
  console.log(label);
  console.log("====================================");

  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ENV_FILE: envFile,
      EXPECTED_CHAIN_ID: String(expectedChainId),
      ...extraEnv,
    },
  });

  if (result.error) {
    fail(`${label}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status}`);
  }

  console.log(`${label}: PASS`);
}

if (process.env.CONFIRM_PRESALE_LAUNCH !== "YES") {
  fail('Set CONFIRM_PRESALE_LAUNCH="YES"');
}

if (!fs.existsSync(envFile)) {
  fail(`ENV file does not exist: ${envFile}`);
}

const expectedChainId = Number(
  requireEnv("EXPECTED_CHAIN_ID")
);

if (![56, 97].includes(expectedChainId)) {
  fail("EXPECTED_CHAIN_ID must be 56 or 97");
}

if (
  expectedChainId === 56 &&
  process.env.CONFIRM_BSC_MAINNET !== "YES"
) {
  fail('Mainnet requires CONFIRM_BSC_MAINNET="YES"');
}

const network =
  expectedChainId === 56
    ? "bscMainnet"
    : "bscTestnet";

if (expectedChainId === 56) {
  requireEnv("BSC_MAINNET_RPC_URL");
} else if (
  !process.env.BSC_TESTNET_RPC_URL &&
  !process.env.NEXT_PUBLIC_RPC_URL
) {
  fail("Missing BSC_TESTNET_RPC_URL/NEXT_PUBLIC_RPC_URL");
}

if (
  !process.env.DEPLOYER_PRIVATE_KEY &&
  !process.env.BOT_PRIVATE_KEY
) {
  require("dotenv").config({
    path: path.resolve(".env"),
    override: false,
  });
}

if (
  !process.env.DEPLOYER_PRIVATE_KEY &&
  !process.env.BOT_PRIVATE_KEY
) {
  fail("Missing DEPLOYER_PRIVATE_KEY/BOT_PRIVATE_KEY");
}

requireEnv("NEXT_PUBLIC_TREASURY_ADDRESS");
requireEnv("NEXT_PUBLIC_USDT_ADDRESS");
requireEnv("NEXT_PUBLIC_TEAM_BENEFICIARY_ADDRESS");
requireEnv("NEXT_PUBLIC_ADVISORS_BENEFICIARY_ADDRESS");

const presaleStartUtc = requireEnv("PRESALE_START_UTC");
const presaleStartMs = Date.parse(presaleStartUtc);

if (!Number.isFinite(presaleStartMs)) {
  fail(
    "PRESALE_START_UTC must use format YYYY-MM-DDTHH:mm:ssZ"
  );
}

if (presaleStartMs <= Date.now()) {
  fail("PRESALE_START_UTC must be in the future");
}

const manifest =
  expectedChainId === 56
    ? "deployments/presale-mainnet.json"
    : "deployments/presale-testnet.json";

if (
  fs.existsSync(manifest) &&
  process.env.ALLOW_NEW_DEPLOY !== "YES"
) {
  fail(
    `${manifest} already exists. Refusing duplicate deployment. ` +
    'Set ALLOW_NEW_DEPLOY="YES" only for an intentional replacement.'
  );
}

console.log("====================================");
console.log("DDC PRESALE LAUNCH PIPELINE");
console.log("====================================");
console.log("Environment file:", envFile);
console.log("Network:", network);
console.log("Chain ID:", expectedChainId);
console.log("Presale start UTC:", presaleStartUtc);
console.log("TGE:", "0 — NOT ACTIVATED");
console.log("Monthly Ops initial USDT funding:", "NOT REQUIRED");
console.log("Adamas initial USDT funding:", "NOT REQUIRED");

run(
  "1/9 Solidity compile",
  "npx",
  ["hardhat", "compile"]
);

run(
  "2/9 Production frontend build",
  "npm",
  ["run", "build"]
);

run(
  "3/9 Contract deployment",
  "npx",
  [
    "hardhat",
    "run",
    "scripts/deploy_prod.js",
    "--network",
    network,
  ]
);

run(
  "4/9 DDC Coin allocation funding",
  "npx",
  [
    "hardhat",
    "run",
    "scripts/fund_prod_allocations.js",
    "--network",
    network,
  ],
  {
    EXECUTE: "true",
  }
);

run(
  "5/9 Ownership transfer to Treasury Safe",
  "npx",
  [
    "hardhat",
    "run",
    "scripts/transfer_full_deploy_ownership.js",
    "--network",
    network,
  ],
  {
    EXECUTE: "true",
  }
);

run(
  "6/9 Allocation verification",
  "npx",
  [
    "hardhat",
    "run",
    "scripts/verify_allocations.js",
    "--network",
    network,
  ]
);

run(
  "7/9 Treasury vault configuration verification",
  "npx",
  [
    "hardhat",
    "run",
    "scripts/verify_treasury_vaults.js",
    "--network",
    network,
  ]
);

run(
  "8/9 Full deployment ownership verification",
  "node",
  ["scripts/check_full_deploy_ownership.js"]
);

run(
  "9/9 Full deployment state verification",
  "node",
  ["scripts/check_full_deploy_state.js"]
);

const finalManifest = JSON.parse(
  fs.readFileSync(manifest, "utf8")
);

if (Number(finalManifest.tgeTimestamp) !== 0) {
  fail("Final manifest TGE timestamp is not zero");
}

if (
  Number(finalManifest.presaleStart) !==
  Math.floor(presaleStartMs / 1000)
) {
  fail("Final manifest presale start mismatch");
}

console.log("");
console.log("====================================");
console.log("DDC PRESALE PREPARED: PASS");
console.log("====================================");
console.log("Network:", network);
console.log("Chain ID:", expectedChainId);
console.log("DDC Coin:", finalManifest.ddcCoinContract);
console.log("Presale:", finalManifest.presale);
console.log("RewardPool:", finalManifest.rewardPool);
console.log("Treasury Safe:", finalManifest.treasury);
console.log("Presale starts:", finalManifest.presaleStartUtc);
console.log("TGE remains:", finalManifest.tgeTimestamp);
console.log("");
console.log(
  "No additional start transaction is required."
);
console.log(
  "Presale begins automatically when blockchain time reaches presaleStart."
);
