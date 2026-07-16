const path = require("path");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env.production"),
  override: true,
});

const fs = require("fs");
const hre = require("hardhat");

function upsertEnv(file, values) {
  let text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");

    text = pattern.test(text)
      ? text.replace(pattern, line)
      : `${text.trimEnd()}\n${line}\n`;
  }

  fs.writeFileSync(file, text);
}

function mustAddr(name, value) {
  if (!value) throw new Error(`Missing ${name}`);

  try {
    return hre.ethers.getAddress(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function mustFutureTimestamp(value) {
  if (!value) {
    throw new Error("Missing PRESALE_START_UTC");
  }

  const milliseconds = Date.parse(value);

  if (!Number.isFinite(milliseconds)) {
    throw new Error(
      "Invalid PRESALE_START_UTC. Required format: YYYY-MM-DDTHH:mm:ssZ"
    );
  }

  return Math.floor(milliseconds / 1000);
}

async function requireCode(name, address) {
  const code = await hre.ethers.provider.getCode(address);

  if (code === "0x") {
    throw new Error(`${name} has no contract code: ${address}`);
  }
}

async function main() {
  const signers = await hre.ethers.getSigners();

  if (!signers.length) {
    throw new Error(
      "No deployer signer. Check DEPLOYER_PRIVATE_KEY."
    );
  }

  const deployer = signers[0];
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  const expectedChainId = Number(
    process.env.EXPECTED_CHAIN_ID || "0"
  );

  if (![56, 97].includes(expectedChainId)) {
    throw new Error(
      "EXPECTED_CHAIN_ID must explicitly be 56 or 97"
    );
  }

  if (chainId !== expectedChainId) {
    throw new Error(
      `Wrong network. Expected ${expectedChainId}, received ${chainId}`
    );
  }

  if (
    chainId === 56 &&
    process.env.CONFIRM_BSC_MAINNET !== "YES"
  ) {
    throw new Error(
      'Mainnet blocked. Set CONFIRM_BSC_MAINNET="YES".'
    );
  }

  const treasury = mustAddr(
    "NEXT_PUBLIC_TREASURY_ADDRESS",
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  );

  const usdt = mustAddr(
    "NEXT_PUBLIC_USDT_ADDRESS",
    process.env.NEXT_PUBLIC_USDT_ADDRESS
  );

  const teamBeneficiary = mustAddr(
    "NEXT_PUBLIC_TEAM_BENEFICIARY_ADDRESS",
    process.env.NEXT_PUBLIC_TEAM_BENEFICIARY_ADDRESS
  );

  const advisorsBeneficiary = mustAddr(
    "NEXT_PUBLIC_ADVISORS_BENEFICIARY_ADDRESS",
    process.env.NEXT_PUBLIC_ADVISORS_BENEFICIARY_ADDRESS
  );

  await requireCode("USDT", usdt);

  const latest = await hre.ethers.provider.getBlock("latest");
  const presaleStart = mustFutureTimestamp(
    process.env.PRESALE_START_UTC
  );

  if (presaleStart <= Number(latest.timestamp)) {
    throw new Error(
      "PRESALE_START_UTC must be in the future"
    );
  }

  const tgeTimestamp = 0;

  // WP canonical curve:
  // price(N) = 0.01 + (N - 1) * 0.02 USDT/DDC.
  // Internal price precision is USD6.
  const prices = Array.from(
    { length: 40 },
    (_, index) => (1 + index * 2) * 10_000
  );

  if (
    prices.length !== 40 ||
    prices[0] !== 10_000 ||
    prices[1] !== 30_000 ||
    prices[39] !== 790_000
  ) {
    throw new Error("Canonical batch price generation failed");
  }

  console.log("====================================");
  console.log("DDC Presale Deployment");
  console.log("====================================");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", chainId);
  console.log("Deployer:", deployer.address);
  console.log("Treasury Safe:", treasury);
  console.log("USDT:", usdt);
  console.log("Presale start UTC:", process.env.PRESALE_START_UTC);
  console.log("Presale start timestamp:", presaleStart);
  console.log("TGE timestamp:", tgeTimestamp);

  const Token = await hre.ethers.getContractFactory("DDCToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("DDC Coin contract:", tokenAddr);

  const Reward = await hre.ethers.getContractFactory("DDCRewardPool");
  const reward = await Reward.deploy(
    deployer.address,
    tokenAddr
  );
  await reward.waitForDeployment();
  const rewardAddr = await reward.getAddress();
  console.log("RewardPool:", rewardAddr);

  const Presale = await hre.ethers.getContractFactory(
    "DDCPresaleVesting"
  );

  const presale = await Presale.deploy(
    deployer.address,
    tokenAddr,
    usdt,
    rewardAddr,
    treasury,
    presaleStart,
    prices,
    false,
    tgeTimestamp
  );

  await presale.waitForDeployment();
  const presaleAddr = await presale.getAddress();
  console.log("Presale:", presaleAddr);

  const Recorder = await hre.ethers.getContractFactory(
    "DDCPresaleRecorder"
  );

  const recorder = await Recorder.deploy(
    deployer.address,
    presaleAddr
  );

  await recorder.waitForDeployment();

  const recorderAddr = await recorder.getAddress();

  console.log("DDC Token / Recorder:", recorderAddr);

  const setRecorderTx =
    await presale.setRecorderOnce(recorderAddr);

  console.log("Presale setRecorderOnce tx:", setRecorderTx.hash);

  await setRecorderTx.wait();

  if (
    (await presale.recorder()).toLowerCase() !==
    recorderAddr.toLowerCase()
  ) {
    throw new Error("Presale Recorder linking failed");
  }

  const Team = await hre.ethers.getContractFactory(
    "DDCTeamVesting"
  );

  const team = await Team.deploy(
    tokenAddr,
    teamBeneficiary,
    hre.ethers.parseUnits("32000000", 18),
    tgeTimestamp
  );

  await team.waitForDeployment();
  const teamAddr = await team.getAddress();
  console.log("TeamVesting:", teamAddr);

  const Advisors = await hre.ethers.getContractFactory(
    "DDCAdvisorVesting"
  );

  const advisors = await Advisors.deploy(
    tokenAddr,
    advisorsBeneficiary,
    hre.ethers.parseUnits("12800000", 18),
    tgeTimestamp
  );

  await advisors.waitForDeployment();
  const advisorsAddr = await advisors.getAddress();
  console.log("AdvisorVesting:", advisorsAddr);

  const Foundation = await hre.ethers.getContractFactory(
    "DDCFoundationRelease"
  );

  const foundation = await Foundation.deploy(
    tokenAddr,
    hre.ethers.parseUnits("38400000", 18),
    tgeTimestamp
  );

  await foundation.waitForDeployment();
  const foundationAddr = await foundation.getAddress();
  console.log("FoundationRelease:", foundationAddr);

  const Monthly = await hre.ethers.getContractFactory(
    "DDCMonthlyOpsVault"
  );

  const monthly = await Monthly.deploy(usdt, presaleAddr);
  await monthly.waitForDeployment();
  const monthlyAddr = await monthly.getAddress();
  console.log("MonthlyOpsVault:", monthlyAddr);

  const Adamas = await hre.ethers.getContractFactory(
    "DDCAdamasGrantVault"
  );

  const adamas = await Adamas.deploy(usdt, presaleAddr);
  await adamas.waitForDeployment();
  const adamasAddr = await adamas.getAddress();
  console.log("AdamasGrantVault:", adamasAddr);

  const linkTx = await reward.setPresaleOnce(presaleAddr);
  console.log("RewardPool link tx:", linkTx.hash);
  await linkTx.wait();

  const linkedPresale = await reward.presale();

  if (
    linkedPresale.toLowerCase() !==
    presaleAddr.toLowerCase()
  ) {
    throw new Error("RewardPool linking failed");
  }

  const manifest = {
    createdAt: new Date().toISOString(),
    network: hre.network.name,
    chainId,
    deployer: deployer.address,
    presaleStartUtc: process.env.PRESALE_START_UTC,
    presaleStart,
    tgeTimestamp: 0,
    treasury,
    usdt,
    ddcCoinContract: tokenAddr,
    rewardPool: rewardAddr,
    presale: presaleAddr,
    recorder: recorderAddr,
    recorderProjectId:
      hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes("DDC_PROJECT_V1")
      ),
    teamVesting: teamAddr,
    advisorVesting: advisorsAddr,
    foundationRelease: foundationAddr,
    monthlyOpsVault: monthlyAddr,
    adamasGrantVault: adamasAddr,
  };

  fs.mkdirSync("deployments", { recursive: true });

  const output =
    chainId === 56
      ? "deployments/presale-mainnet.json"
      : "deployments/presale-testnet.json";

  fs.writeFileSync(
    output,
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  const envFile = path.resolve(
    process.env.ENV_FILE || ".env.production"
  );

  upsertEnv(envFile, {
    NEXT_PUBLIC_CHAIN_ID: String(chainId),
    NEXT_PUBLIC_DDC_TOKEN_ADDRESS: tokenAddr,
    NEXT_PUBLIC_PRESALE_ADDRESS: presaleAddr,
    NEXT_PUBLIC_RECORDER_ADDRESS: recorderAddr,
    NEXT_PUBLIC_REWARD_POOL_ADDRESS: rewardAddr,
    NEXT_PUBLIC_TEAM_VAULT_ADDRESS: teamAddr,
    NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS: advisorsAddr,
    NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS: foundationAddr,
    NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS: monthlyAddr,
    NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS: adamasAddr,
  });

  console.log("Updated ENV:", envFile);
  console.log("------------------------------------");
  console.log("Manifest:", output);
  console.log("DEPLOYMENT PASS");
  console.log("TGE REMAINS 0");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
