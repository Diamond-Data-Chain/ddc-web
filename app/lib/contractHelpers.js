import { ethers } from "ethers";
import {
  DDC_TOKEN_ADDRESS,
  USDT_MOCK_ADDRESS,
  PRESALE_VESTING_ADDRESS,
} from "../config/contracts";
import ddcPresaleVestingArtifact from "../abi/ddcPresaleVesting.json";
import ddcTokenArtifact from "../abi/ddcToken.json";

const presaleAbi = ddcPresaleVestingArtifact.abi ?? ddcPresaleVestingArtifact;
const tokenAbi = ddcTokenArtifact.abi ?? ddcTokenArtifact;

// Provider preko MetaMask-a
export function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error("MetaMask not available");
}

// Potpisnik (trenutni wallet)
export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

// Presale/Vesting ugovor
export async function getPresaleContract() {
  const signer = await getSigner();
  return new ethers.Contract(PRESALE_VESTING_ADDRESS, presaleAbi, signer);
}

// DDC token ugovor
export async function getDDCTokenContract() {
  const signer = await getSigner();
  return new ethers.Contract(DDC_TOKEN_ADDRESS, tokenAbi, signer);
}

// USDT (mock)
export async function getUSDTContract() {
  const signer = await getSigner();
  return new ethers.Contract(USDT_MOCK_ADDRESS, tokenAbi, signer);
}
