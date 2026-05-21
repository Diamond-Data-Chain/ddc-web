"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/app/WalletProvider";

const VAULT_ABI = [
 "function getTotalInflowTracked() view returns (uint256)",
 "function getSpent(uint8 role) view returns (uint256)",
 "function remainingAllocation(uint8 role) view returns (uint256)",
 "function getAllocationRule(uint8 role) view returns (uint256 maxBps,uint256 maxAbsolute,bool enabled)",
];

const ROLE_NAMES = ["TREASURY", "DEV", "MARKETING", "LIQUIDITY", "OPERATIONS", "PAYROLL", "FOUNDER", "CEX", "OTHER"];

export default function TreasuryAllocationMini() {
 const { rpcProvider } = useWallet();

 const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
 const vaultAddr = process.env.NEXT_PUBLIC_TREASURY_VAULT_ADDRESS || "";

 const provider = useMemo(() => {
 if (rpcProvider) return rpcProvider;
 if (!rpcUrl) return null;
 try {
 return new ethers.JsonRpcProvider(rpcUrl);
 } catch {
 return null;
 }
 }, [rpcProvider, rpcUrl]);

 const [err, setErr] = useState<string | null>(null);
 const [totalInflow, setTotalInflow] = useState<bigint>(0n);
 const [rows, setRows] = useState<
 { role: number; name: string; enabled: boolean; spent: bigint; remaining: bigint | null; maxBps: bigint; maxAbs: bigint }[]
 >([]);

 const vault = useMemo(() => {
 if (!provider) return null;
 if (!vaultAddr) return null;
 try {
 return new ethers.Contract(ethers.getAddress(vaultAddr), VAULT_ABI, provider);
 } catch {
 return null;
 }
 }, [provider, vaultAddr]);

 async function load() {
 setErr(null);
 setRows([]);
 setTotalInflow(0n);

 if (!provider) {
 setErr("RPC is not configured (NEXT_PUBLIC_RPC_URL).");
 return;
 }
 if (!vaultAddr) {
 setErr("Treasury vault is not configured (NEXT_PUBLIC_TREASURY_VAULT_ADDRESS).");
 return;
 }
 if (!vault) {
 setErr("Neispravna vault adresa.");
 return;
 }

 const code = await provider.getCode(await vault.getAddress());
 if (code === "0x") {
 setErr("Treasury vault does not exist on this network (getCode=0x).");
 return;
 }

 const inflow = await vault.getTotalInflowTracked();
 setTotalInflow(BigInt(inflow.toString()));

 const out: any[] = [];
 for (let r = 1; r <= 8; r++) {
 let rule = [0n, 0n, false];
 let spent = 0n;
 let remaining: bigint | null = null;

 try {
 const rr = await vault.getAllocationRule(r);
 rule = [BigInt(rr[0].toString()), BigInt(rr[1].toString()), Boolean(rr[2])];
 } catch {}

 try {
 const sp = await vault.getSpent(r);
 spent = BigInt(sp.toString());
 } catch {}

 try {
 const rem = await vault.remainingAllocation(r);
 remaining = BigInt(rem.toString());
 } catch {
 remaining = null;
 }

 out.push({
 role: r,
 name: ROLE_NAMES[r] || `ROLE_${r}`,
 enabled: rule[2],
 maxBps: rule[0],
 maxAbs: rule[1],
 spent,
 remaining,
 });
 }

 setRows(out);
 }

 useEffect(() => {
 load().catch((e) => setErr(e?.message ?? String(e)));
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [vaultAddr, provider]);

 return (
 <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <div className="text-sm font-semibold">Coin Allocation (Treasury Policy)</div>
 <div className="mt-1 text-xs text-slate-400">
 Direktno sa chain-a: inflow, spent i remaining po role (policy hard-cap).
 </div>
 </div>

 <div className="flex items-center gap-2">
 <Link
 href="/treasury"
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Treasury DDC Token
 </Link>

 <button
 onClick={() => load().catch((e) => setErr(e?.message ?? String(e)))}
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Refresh
 </button>
 </div>
 </div>

 {err && (
 <div className="mt-4 rounded-xl border border-amber-900/60 bg-amber-950/30 p-3 text-sm text-amber-200">
 {err}
 </div>
 )}

 <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
 <div className="text-xs uppercase tracking-wider text-slate-400">Total inflow tracked (USDT)</div>
 <div className="mt-2 font-mono text-lg">{ethers.formatUnits(totalInflow, 6)}</div>
 </div>

 <div className="mt-4 overflow-x-auto">
 <table className="w-full text-left text-sm">
 <thead className="text-xs text-slate-400">
 <tr>
 <th className="py-2 pr-3">Role</th>
 <th className="py-2 pr-3">Enabled</th>
 <th className="py-2 pr-3">Spent (USDT)</th>
 <th className="py-2 pr-3">Remaining (USDT)</th>
 <th className="py-2 pr-3">maxBps</th>
 <th className="py-2 pr-3">maxAbs</th>
 </tr>
 </thead>
 <tbody className="text-slate-200">
 {rows.map((r) => (
 <tr key={r.role} className="border-t border-slate-800">
 <td className="py-2 pr-3 font-semibold">{r.name}</td>
 <td className="py-2 pr-3">{String(r.enabled)}</td>
 <td className="py-2 pr-3 font-mono">{ethers.formatUnits(r.spent, 6)}</td>
 <td className="py-2 pr-3 font-mono">
 {r.remaining == null ? "n/a" : ethers.formatUnits(r.remaining, 6)}
 </td>
 <td className="py-2 pr-3 font-mono">{r.maxBps.toString()}</td>
 <td className="py-2 pr-3 font-mono">{r.maxAbs.toString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}
