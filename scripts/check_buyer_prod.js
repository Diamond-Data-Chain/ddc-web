require("dotenv").config({ path: ".env.staging", override: true });
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const buyerAddress = process.env.BUYER || signer.address;
  const presaleAddr = process.env.NEXT_PUBLIC_PRESALE_ADDRESS;

  const presale = await hre.ethers.getContractAt("DDCPresaleVesting", presaleAddr);

  const totalPurchased = await presale.totalPurchased(buyerAddress);
  const principal = await presale.vestingPrincipal(buyerAddress);
  const claimable = await presale.claimable(buyerAddress);
  const claimed = await presale.claimed(buyerAddress);
  const locked = await presale.locked(buyerAddress);

  console.log("buyer:", buyerAddress);
  console.log("totalPurchased:", totalPurchased.toString());
  console.log("vestingPrincipal:", principal.toString());
  console.log("claimable:", claimable.toString());
  console.log("claimed:", claimed.toString());
  console.log("locked:", locked.toString());
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
