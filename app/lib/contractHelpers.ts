"use client";
import type { InterfaceAbi } from "ethers";

import { BrowserProvider, Contract } from "ethers";
import { PRESALE_VESTING_ADDRESS } from "../config/contracts";
import presaleArtifact from "@/app/abi/ddcPresaleVesting.json";
// iz JSON artefakta uzimamo samo .abi niz
const presaleAbi = ((presaleArtifact as any)?.abi ?? (presaleArtifact as any));

/**
 * Helper that returns the presale contract with a signer.
 * spreman za transakcije (buy / claim).
 */
export async function getPresaleContract() {
  if (typeof window === "undefined") {
    throw new Error("getPresaleContract can only be called in the browser");
  }

  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error("MetaMask not detected.");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new Contract(PRESALE_VESTING_ADDRESS, presaleAbi, signer);
}
