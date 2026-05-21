"use client";

import { motion } from "framer-motion";
import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { useEffect, useMemo, useState } from "react";

import { RPC_URL, CHAIN_ID, PRESALE_VESTING_ADDRESS } from "@/app/config/contracts";
import { DDC_PRESALE_ABI } from "@/app/abi/ddcPresaleVesting";

const MONTH_SEC = 30 * 24 * 60 * 60;
const ZERO = "0x0000000000000000000000000000000000000000";

type AllocationKey = "TEAM" | "ADVISORS" | "FOUNDATION";

const ALLOC = {
 TEAM: 32_000_000n * 10n ** 18n,
 ADVISORS: 12_800_000n * 10n ** 18n,
 FOUNDATION: 38_400_000n * 10n ** 18n,
} as const;

function fmt18(v: bigint) {
 const n = Number(formatUnits(v, 18));
 return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—";
}

function clamp01e18(x: number, denom: number) {
 if (denom <= 0) return 0n;
 if (x <= 0) return 0n;
 if (x >= denom) return 1_000_000_000_000_000_000n;
 return BigInt(Math.floor((x * 1e18) / denom));
}

function linearUnlocked(total: bigint, elapsedSec: number, durationSec: number) {
 const p = clamp01e18(elapsedSec, durationSec);
 return (total * p) / 1_000_000_000_000_000_000n;
}

function fmtDate(ts: number | null) {
 return typeof ts === "number" && ts > 0 ? new Date(ts * 1000).toLocaleString() : "—";
}

type ViewModel = {
 title: string;
 subtitle: string;
 allocation: bigint;
 rule: string;
 accessPath: string;
 note?: string;
 unlocked: bigint;
};

export default function SingleAllocationVesting({ allocation }: { allocation: AllocationKey }) {
 const presaleAddr = (PRESALE_VESTING_ADDRESS as string) || ZERO;

 const provider = useMemo(() => {
 try {
 if (!RPC_URL || typeof RPC_URL !== "string" || RPC_URL.trim().length < 4) return null;
 return new JsonRpcProvider(RPC_URL, CHAIN_ID);
 } catch {
 return null;
 }
 }, []);

 const [nowTs, setNowTs] = useState<number>(() => Math.floor(Date.now() / 1000));
 const [tgeTs, setTgeTs] = useState<number | null>(null);

 useEffect(() => {
 setNowTs(Math.floor(Date.now() / 1000));
 const t = setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
 return () => clearInterval(t);
 }, []);

 useEffect(() => {
 if (!provider) return;
 if (!presaleAddr || presaleAddr === ZERO) return;

 let alive = true;
 const run = async () => {
 try {
 const presale = new Contract(presaleAddr, (DDC_PRESALE_ABI as any).abi ?? DDC_PRESALE_ABI, provider);
 const vp = await presale.vestingParams?.();
 const tge = Number(vp?.tgeTimestamp ?? vp?.[0] ?? 0);
 if (!alive) return;
 setTgeTs(tge > 0 ? tge : null);
 } catch {
 if (!alive) return;
 setTgeTs(null);
 }
 };

 void run();
 const t = setInterval(() => void run(), 15000);
 return () => {
 alive = false;
 clearInterval(t);
 };
 }, [provider, presaleAddr]);

 if (!provider) {
 return (
 <div className="rounded-3xl border border-amber-400/40 bg-black/40 p-6 md:p-7 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur">
 <h2 className="text-xl md:text-2xl font-semibold text-amber-200">Allocation Vesting</h2>
 <p className="mt-2 text-sm text-amber-100/70">
 RPC is not configured (NEXT_PUBLIC_RPC_URL). This section is read-only and needs RPC to read on-chain TGE.
 </p>
 </div>
 );
 }

 if (!presaleAddr || presaleAddr === ZERO) {
 return (
 <div className="rounded-3xl border border-amber-400/40 bg-black/40 p-6 md:p-7 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur">
 <h2 className="text-xl md:text-2xl font-semibold text-amber-200">Allocation Vesting</h2>
 <p className="mt-2 text-sm text-amber-100/70">
 Presale address is not configured (NEXT_PUBLIC_PRESALE_ADDRESS). Cannot read TGE.
 </p>
 </div>
 );
 }

 const tge = tgeTs ?? 0;
 const now = nowTs;
 const dt = tge > 0 ? now - tge : 0;

 let vm: ViewModel;

 if (allocation === "TEAM") {
 const total = ALLOC.TEAM;
 const unlocked = tge > 0 && dt > 0 ? linearUnlocked(total, dt, 24 * MONTH_SEC) : 0n;
 vm = {
 title: "Team DDC Token",
 subtitle: "Read-only release progress for the Team allocation.",
 allocation: total,
 rule: "24-month linear vesting, 0% at TGE.",
 accessPath: "Team vesting schedule only. No immediate TGE unlock.",
 note: "This page shows deterministic release progress only.",
 unlocked,
 };
 } else if (allocation === "ADVISORS") {
 const total = ALLOC.ADVISORS;
 const cliff = 3 * MONTH_SEC;
 const lin = 18 * MONTH_SEC;
 const unlocked = tge > 0 && dt > cliff ? linearUnlocked(total, dt - cliff, lin) : 0n;
 vm = {
 title: "Advisors DDC Token",
 subtitle: "Read-only release progress for the Advisors allocation.",
 allocation: total,
 rule: "0% at TGE, 3-month cliff, then 18-month linear vesting (21 months total).",
 accessPath: "Escrowed in a dedicated advisor vesting contract; claims can only be initiated by the beneficiary address.",
 note: "No tokens are claimable before the cliff period elapses.",
 unlocked,
 };
 } else {
 const total = ALLOC.FOUNDATION;
 const cliff = 6 * MONTH_SEC;
 const lin = 30 * MONTH_SEC;
 const unlocked = tge > 0 && dt > cliff ? linearUnlocked(total, dt - cliff, lin) : 0n;
 vm = {
 title: "Foundation DDC Token",
 subtitle: "Read-only release progress for the Foundation allocation.",
 allocation: total,
 rule: "0% at TGE, 6-month cliff, then 30-month linear release (36 months total).",
 accessPath: "Released only through governance-approved proposal execution / DAO-controlled on-chain release path.",
 note: "No Foundation tokens are transferable or claimable before the cliff period elapses.",
 unlocked,
 };
 }

 const unlocked = vm.unlocked > vm.allocation ? vm.allocation : vm.unlocked;
 const remaining = vm.allocation > unlocked ? vm.allocation - unlocked : 0n;
 const progress = vm.allocation > 0n ? Math.max(0, Math.min(100, Number((unlocked * 10_000n) / vm.allocation) / 100)) : 0;

 return (
 <motion.section
 className="py-10 border-t border-amber-400/20 bg-black/30"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 >
 <div className="max-w-7xl mx-auto px-4">
 <div className="rounded-3xl border border-amber-400/40 bg-black/40 p-6 md:p-7 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur">
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
 <div>
 <h2 className="text-xl md:text-2xl font-semibold text-amber-200">{vm.title}</h2>
 <p className="mt-1 text-sm text-amber-100/70 max-w-2xl">{vm.subtitle}</p>
 </div>
 <div className="text-[11px] text-amber-100/60 md:text-right">
 <div>
 TGE: <span className="font-mono text-amber-200">{fmtDate(tgeTs)}</span>
 </div>
 <div>
 Now: <span className="font-mono text-amber-200">{fmtDate(nowTs)}</span>
 </div>
 </div>
 </div>

 <div className="mt-6 rounded-2xl border border-amber-500/30 bg-black/35 px-5 py-4">
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
 <div className="text-amber-200 font-semibold">{vm.title}</div>
 <div className="text-[12px] text-amber-100/60">
 Allocation: <span className="font-semibold text-amber-200">{fmt18(vm.allocation)} DDC</span>
 </div>
 </div>

 <div className="mt-1 text-[12px] text-amber-100/65">
 Rule: <span className="text-amber-100/80">{vm.rule}</span>
 </div>

 <div className="mt-1 text-[12px] text-amber-100/65">
 Release path: <span className="text-amber-100/80">{vm.accessPath}</span>
 </div>

 <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[12px]">
 <div className="text-amber-100/70">
 Unlocked so far: <span className="text-emerald-300 font-semibold">{fmt18(unlocked)} DDC</span>
 </div>
 <div className="text-amber-100/70">
 Remaining locked: <span className="text-amber-200 font-semibold">{fmt18(remaining)} DDC</span>
 </div>
 <div className="text-amber-100/55">
 Progress: <span className="text-amber-200 font-semibold">{progress.toFixed(2)}%</span>
 </div>
 </div>

 <div className="mt-2 h-2 w-full rounded-full bg-amber-100/10 overflow-hidden">
 <div className="h-full bg-amber-400/70" style={{ width: `${progress}%` }} />
 </div>

 {vm.note ? <div className="mt-2 text-[11px] text-amber-100/50">{vm.note}</div> : null}
 </div>
 </div>
 </div>
 </motion.section>
 );
}
