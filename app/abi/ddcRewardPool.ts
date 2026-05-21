// Minimal ABI fragments needed by UI (ethers v6 compatible).
// No JSON import (fixes Next "Module not found").
export const DDC_REWARD_POOL_ABI = [
  // burn-locked (different possible names, UI tries multiple)
  "function burnLocked() view returns (uint256)",
  "function burnLockedAmount() view returns (uint256)",
  "function burnLockedDDC() view returns (uint256)",
  "function burnLockedTotal() view returns (uint256)",

  // validator rewards eligible
  "function validatorRewardsEligible() view returns (uint256)",
  "function validatorEligible() view returns (uint256)",
  "function rewardEligible() view returns (uint256)",
  "function rewardEligibleDDC() view returns (uint256)",

  // presale burn accounted
  "function presaleBurnAccounted() view returns (uint256)",
  "function presaleBurnedAccounted() view returns (uint256)",
  "function presaleBurnCounted() view returns (uint256)",
  "function presaleBurned() view returns (uint256)",
] as const;
