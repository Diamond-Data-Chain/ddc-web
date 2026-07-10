require("dotenv").config({
  path: ".env.staging.full-deploy-test",
  override: true,
});

const hre = require("hardhat");

async function main() {
  const [caller] = await hre.ethers.getSigners();

  const vaultAddress = hre.ethers.getAddress(
    process.env.NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS
  );

  const vault = await hre.ethers.getContractAt(
    "DDCAdamasGrantVault",
    vaultAddress,
    caller
  );

  const presaleAddress = await vault.presale();

  const presale = new hre.ethers.Contract(
    presaleAddress,
    ["function finalized() view returns (bool)"],
    hre.ethers.provider
  );

  const finalized = await presale.finalized();
  const released = await vault.released();

  console.log("====================================");
  console.log("Adamas Release Lock Audit");
  console.log("====================================");
  console.log("Vault:", vaultAddress);
  console.log("Caller:", caller.address);
  console.log("Presale:", presaleAddress);
  console.log("Presale finalized:", finalized);
  console.log("Grant released:", released);

  if (finalized) {
    throw new Error(
      "Presale is already finalized; this script cannot prove the pre-finalize lock"
    );
  }

  if (released) {
    throw new Error("Grant is unexpectedly already released");
  }

  try {
    await vault.release.staticCall();
    throw new Error(
      "SECURITY FAILURE: Adamas release() succeeded before presale finalization"
    );
  } catch (error) {
    const data =
      error?.data ||
      error?.info?.error?.data ||
      error?.error?.data ||
      null;

    let decoded = null;

    if (data) {
      try {
        decoded = vault.interface.parseError(data);
      } catch {
        decoded = null;
      }
    }

    const errorName = decoded?.name || error?.revert?.name || "unknown";

    console.log("release() before finalize: REVERTED");
    console.log("Revert error:", errorName);

    if (errorName !== "PresaleNotFinalized") {
      throw new Error(
        `Expected PresaleNotFinalized, received ${errorName}`
      );
    }
  }

  console.log("");
  console.log("ADAMAS FINALIZATION LOCK PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
