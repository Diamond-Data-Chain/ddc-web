require("dotenv").config({ path: ".env.staging", override: true });
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  const addresses = {
    TEAM_VAULT: process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS,
    ADVISORS_VAULT: process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS,
    FOUNDATION_VAULT: process.env.NEXT_PUBLIC_FOUNDATION_VAULT_ADDRESS,
  };

  for (const [name, addr] of Object.entries(addresses)) {
    if (!addr || addr.startsWith("TODO")) {
      console.log(`⚠️ ${name}: missing/TODO`);
      continue;
    }

    const code = await provider.getCode(addr);
    console.log(`${code !== "0x" ? "✅ CONTRACT" : "❌ NO CODE"} ${name}: ${addr}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
