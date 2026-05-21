import type { InterfaceAbi } from "ethers";

import presaleArtifact from "@/app/abi/ddcPresaleVesting.json";
import vestingVaultArtifact from "@/app/abi/DDCVestingVault.json";
import ddcTokenArtifact from "@/app/abi/ddcToken.json";

// Typed ABI exports (frontend source of truth)
export const PRESALE_ABI: InterfaceAbi = ((presaleArtifact as any)?.abi ?? (presaleArtifact as unknown as InterfaceAbi));
export const VESTING_VAULT_ABI: InterfaceAbi = ((vestingVaultArtifact as any)?.abi ?? (vestingVaultArtifact as unknown as InterfaceAbi));
export const DDC_TOKEN_ABI: InterfaceAbi = ((ddcTokenArtifact as any)?.abi ?? (ddcTokenArtifact as unknown as InterfaceAbi));
