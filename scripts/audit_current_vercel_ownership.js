require("dotenv").config({ path: ".env.staging" });
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

const ADDR = {
  DDC: process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS,
  PRESALE: process.env.NEXT_PUBLIC_PRESALE_ADDRESS,
  REWARD_POOL: process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS,
  RECORDER: process.env.NEXT_PUBLIC_RECORDER_ADDRESS,
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS,
  TEAM_VAULT: process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS,
  ADVISORS_VAULT: process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS,
  TREASURY_SAFE: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
};

const probes = [
  "function owner() view returns (address)",
  "function getOwner() view returns (address)",
  "function paused() view returns (bool)",
  "function finalized() view returns (bool)",
  "function currentBatchId() view returns (uint8)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function getRoleAdmin(bytes32 role) view returns (bytes32)",
  "function hasRole(bytes32 role,address account) view returns (bool)",
  "function beneficiary() view returns (address)",
  "function token() view returns (address)",
  "function presale() view returns (address)",
  "function ddcToken() view returns (address)",
  "function rewardPool() view returns (address)",
  "function recorder() view returns (address)",
];

async function tryCall(addr, sig, args = []) {
  try {
    const c = new ethers.Contract(addr, [sig], provider);
    const fn = sig.match(/function\s+([^(]+)/)[1];
    return await c[fn](...args);
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== DDC CURRENT VERCEL OWNERSHIP / ROLE AUDIT ===");

  for (const [name, addr] of Object.entries(ADDR)) {
    if (!addr) continue;

    const code = await provider.getCode(addr);
    console.log(`\n## ${name}`);
    console.log("address:", addr);
    console.log("code:", code !== "0x" ? "YES" : "NO");

    if (code === "0x") continue;

    const owner = await tryCall(addr, "function owner() view returns (address)");
    const getOwner = await tryCall(addr, "function getOwner() view returns (address)");
    const beneficiary = await tryCall(addr, "function beneficiary() view returns (address)");
    const paused = await tryCall(addr, "function paused() view returns (bool)");
    const finalized = await tryCall(addr, "function finalized() view returns (bool)");
    const currentBatchId = await tryCall(addr, "function currentBatchId() view returns (uint8)");
    const token = await tryCall(addr, "function token() view returns (address)");
    const presale = await tryCall(addr, "function presale() view returns (address)");
    const ddcToken = await tryCall(addr, "function ddcToken() view returns (address)");
    const rewardPool = await tryCall(addr, "function rewardPool() view returns (address)");
    const recorder = await tryCall(addr, "function recorder() view returns (address)");

    if (owner) console.log("owner:", owner);
    if (getOwner) console.log("getOwner:", getOwner);
    if (beneficiary) console.log("beneficiary:", beneficiary);
    if (paused !== null) console.log("paused:", paused);
    if (finalized !== null) console.log("finalized:", finalized);
    if (currentBatchId !== null) console.log("currentBatchId:", currentBatchId.toString());
    if (token) console.log("token:", token);
    if (presale) console.log("presale:", presale);
    if (ddcToken) console.log("ddcToken:", ddcToken);
    if (rewardPool) console.log("rewardPool:", rewardPool);
    if (recorder) console.log("recorder:", recorder);

    const defaultAdminRole = await tryCall(addr, "function DEFAULT_ADMIN_ROLE() view returns (bytes32)");
    if (defaultAdminRole) {
      console.log("DEFAULT_ADMIN_ROLE:", defaultAdminRole);
      for (const [label, account] of Object.entries({
        deployer: "0xA94568bF1B50a06efDebc5846A1252410A65CA32",
        treasurySafe: ADDR.TREASURY_SAFE,
      })) {
        const has = await tryCall(
          addr,
          "function hasRole(bytes32 role,address account) view returns (bool)",
          [defaultAdminRole, account]
        );
        if (has !== null) console.log(`has DEFAULT_ADMIN_ROLE ${label}:`, has);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
