const hre = require("hardhat");

const USDT_ABI = [
  "function mint(address to, uint256 amount) external",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const usdtAddr = process.env.NEXT_PUBLIC_USDT_ADDRESS;
  if (!usdtAddr) throw new Error("Missing NEXT_PUBLIC_USDT_ADDRESS");

  const usdt = new hre.ethers.Contract(usdtAddr, USDT_ABI, deployer);

  const buyer = deployer.address;
  const amount = 1000n * 10n ** 6n;

  const tx = await usdt.mint(buyer, amount);
  console.log("mint tx:", tx.hash);
  await tx.wait();

  const bal = await usdt.balanceOf(buyer);
  console.log("buyer:", buyer);
  console.log("buyer usdt after:", bal.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
