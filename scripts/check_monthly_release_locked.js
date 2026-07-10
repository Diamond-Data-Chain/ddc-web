require("dotenv").config({
  path: ".env.staging.full-deploy-test",
  override: true,
});

const hre = require("hardhat");

async function main() {
  const [caller] = await hre.ethers.getSigners();

  const vaultAddress = hre.ethers.getAddress(
    process.env.NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS
  );

  const vault = await hre.ethers.getContractAt(
    "DDCMonthlyOpsVault",
    vaultAddress,
    caller
  );

  const presaleStart = await vault.presale().then(async (address) => {
    const presale = new hre.ethers.Contract(
      address,
      ["function presaleStart() view returns (uint64)"],
      hre.ethers.provider
    );

    return presale.presaleStart();
  });

  const interval = await vault.PAYMENT_INTERVAL();
  const nextPayment = await vault.nextPaymentTimestamp();
  const paymentsReleased = await vault.paymentsReleased();
  const duePayments = await vault.duePayments();

  const latest = await hre.ethers.provider.getBlock("latest");
  const now = BigInt(latest.timestamp);

  console.log("====================================");
  console.log("Monthly Release Lock Audit");
  console.log("====================================");
  console.log("Vault:", vaultAddress);
  console.log("Caller:", caller.address);
  console.log("Presale start:", presaleStart.toString());
  console.log("Interval:", interval.toString(), "seconds");
  console.log("Next payment:", nextPayment.toString());
  console.log("Current time:", now.toString());
  console.log("Payments released:", paymentsReleased.toString());
  console.log("Due payments:", duePayments.toString());

  if (now >= nextPayment) {
    throw new Error(
      "Monthly installment is already time-due; this script cannot prove the pre-due lock"
    );
  }

  try {
    await vault.release.staticCall();
    throw new Error("SECURITY FAILURE: release() succeeded before due time");
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

    console.log("release() before due date: REVERTED");
    console.log("Revert error:", errorName);

    if (errorName !== "PaymentNotDue") {
      throw new Error(
        `Expected PaymentNotDue, received ${errorName}`
      );
    }
  }

  console.log("");
  console.log("MONTHLY TIME LOCK PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
