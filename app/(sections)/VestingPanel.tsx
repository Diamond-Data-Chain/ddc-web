"use client";

import { useEffect, useMemo, useState } from "react";
import { Contract, BrowserProvider, formatUnits } from "ethers";

// 1) Ubaci pravi ABI JSON iz artifacts
// npr: import VestingAbi from "@/app/abi/DDCVestingVault.json";
import VestingAbi from "@/app/abi/DDCVestingVault.json";
// <-- prilagodi putanju

type Props = {
 provider: BrowserProvider | null;
 signerAddress: string | null;
 vestingAddress: string; // adresa Vesting ugovora (po chain-u)
 tokenDecimals?: number; // default 18
};

export default function VestingPanel({
 provider,
 signerAddress,
 vestingAddress,
 tokenDecimals = 18,
}: Props) {
 const [loading, setLoading] = useState(false);
 const [alloc, setAlloc] = useState<bigint>(0n);
 const [claimable, setClaimable] = useState<bigint>(0n);
 const [claimed, setClaimed] = useState<bigint>(0n);
 const [err, setErr] = useState<string | null>(null);

 const vestingRead = useMemo(() => {
 if (!provider) return null;
 return new Contract(vestingAddress, VestingAbi.abi, provider);
 }, [provider, vestingAddress]);

 const vestingWrite = useMemo(() => {
 // write requires signer
 // your project may already have a signer; here we obtain it via provider.getSigner()
 if (!provider) return null;
 return (async () => {
 const signer = await provider.getSigner();
 return new Contract(vestingAddress, VestingAbi.abi, signer);
 })();
 }, [provider, vestingAddress]);

 async function refresh() {
 if (!vestingRead || !signerAddress) return;
 setErr(null);
 try {
 setLoading(true);

 // 2) These 3 lines must match the ABI exactly
 const a: bigint = await vestingRead.allocation(signerAddress);
 const c1: bigint = await vestingRead.claimable(signerAddress);
 const c2: bigint = await vestingRead.claimed(signerAddress);

 setAlloc(a);
 setClaimable(c1);
 setClaimed(c2);
 } catch (e: unknown) {
 const err = e as { shortMessage?: string; message?: string };
 setErr(err.shortMessage || err.message || "Vesting read failed");
 } finally {
 setLoading(false);
 }
 }

 async function doClaim() {
 if (!provider || !signerAddress) return;
 setErr(null);
 try {
 setLoading(true);

 const vw = await vestingWrite;
 if (!vw) throw new Error("Missing signer");

 // 3) Ako ABI ima claim() bez parametara:
 const tx = await vw.claim();
 await tx.wait();

 await refresh();
 } catch (e: unknown) {
 const err = e as { shortMessage?: string; message?: string };
 setErr(err.shortMessage || err.message || "Claim failed");
 } finally {
 setLoading(false);
 }
 }

 useEffect(() => {
 refresh();
 // refresh na promenu adrese / providera
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [vestingRead, signerAddress]);

 const fmt = (x: bigint) => formatUnits(x, tokenDecimals);

 return (
 <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
 <div className="flex items-center justify-between">
 <h3 className="text-lg font-semibold">Vesting</h3>
 <button
 onClick={refresh}
 disabled={loading || !signerAddress}
 className="rounded-lg bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700 disabled:opacity-50"
 >
 Refresh
 </button>
 </div>

 {!signerAddress ? (
 <p className="mt-3 text-slate-300">Connect wallet to view vesting.</p>
 ) : (
 <>
 <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
 <Stat label="Allocated" value={fmt(alloc)} />
 <Stat label="Claimable now" value={fmt(claimable)} />
 <Stat label="Claimed" value={fmt(claimed)} />
 </div>

 {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

 <div className="mt-4 flex gap-2">
 <button
 onClick={doClaim}
 disabled={loading || claimable === 0n}
 className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-50"
 >
 Claim
 </button>
 </div>
 </>
 )}
 </div>
 );
}

function Stat({ label, value }: { label: string; value: string }) {
 return (
 <div className="rounded-lg bg-slate-950/40 p-3">
 <div className="text-xs text-slate-400">{label}</div>
 <div className="mt-1 text-base font-semibold">{value}</div>
 </div>
 );
}
