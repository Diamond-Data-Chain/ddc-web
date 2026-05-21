declare module "../lib/contractHelpers" {
  import { ethers } from "ethers";

  export function getProvider(): ethers.BrowserProvider;
  export function getSigner(): Promise<ethers.JsonRpcSigner>;
  export function getPresaleContract(): Promise<ethers.Contract>;
  export function getDDCTokenContract(): Promise<ethers.Contract>;
  export function getUSDTContract(): Promise<ethers.Contract>;
}
