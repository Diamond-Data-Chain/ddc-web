"use client";

import { motion } from "framer-motion";
import { Contract, JsonRpcProvider, formatUnits, Block } from "ethers";
import { useEffect, useMemo, useState } from "react";

import { RPC_URL, CHAIN_ID, PRESALE_VESTING_ADDRESS } from "@/app/config/contracts";
import { DDC_PRESALE_ABI } from "@/app/abi/ddcPresaleVesting";

// NOTE: For UI progress we keep the same month convention as mock (30 days).
// TODO(WP): confirm month semantics for production vesting math.
const MONTH_SEC = 30 * 24 * 60 * 60;

const ALLOC = {
 TEAM: 32_000_000n * 10n ** 18n, // 12.5%
 TREASURY: 19_200_000n * 10n ** 18n, // 7.5%
 ADVISORS: 12_800_000n * 10n ** 18n, // 5%
 FOUNDATION: 38_400_000n * 10n ** 18n, // 15%
};

const ZERO = "0x0000000000000000000000000000000000000000";

function fmt18(v: bigint) {
 const n = Number(formatUnits(v, 18));
 return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—";
}

function clamp01e18(x: number, denom: number) {
 if (denom <= 0) return 0n;
 if (x <= 0) return 0n;
 if (x >= denom) return 1_000_000_000_000_000_000n; // 1e18
 return BigInt(Math.floor((x * 1e18) / denom));
}

function linearUnlocked(total: bigint, elapsedSec: number, durationSec: number) {
 const p = clamp01e18(elapsedSec, durationSec);
 return (total * p) / 1_000_000_000_000_000_000n;
}

type Row = {
 name: string;
 amount: bigint;
 rule: string;
 unlocked: bigint;
 remaining: bigint;
 note?: string;
};

export default function VestingPools() {
 const presaleAddr = (PRESALE_VESTING_ADDRESS as string) || ZERO;

 // ✅ Fail-safe provider: never throw during render
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

 // chain time ticker (read-only)
 useEffect(() => {
 setNowTs(Math.floor(Date.now() / 1000));
 const t = setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
 return () => clearInterval(t);
 }, []);

 // read TGE from presale.vestingParams()
 useEffect(() => {
 if (!provider) return;
 if (!presaleAddr || presaleAddr === ZERO) return;

 let alive = true;
 const run = async () => {
 try {
 interface VestingParams {
 tgeTimestamp: bigint;
 // Add other fields if needed
 [key: string]: unknown;
 }
 const presale: Contract = new Contract(presaleAddr, (DDC_PRESALE_ABI as any).abi ?? DDC_PRESALE_ABI, provider);
 const vp = (await presale.vestingParams?.()) as VestingParams | undefined;
 const tge = Number(vp?.tgeTimestamp ?? (vp && (vp as unknown as Array<unknown>)[0]) ?? 0);
 if (!alive) return;
 setTgeTs(tge > 0 ? tge : null);
 } catch {
 if (!alive) return;
 setTgeTs(null);
 }
 };
 run();
 const t = setInterval(run, 15000);
 return () => {
 alive = false;
 clearInterval(t);
 };
 }, [provider, presaleAddr]);

 const fmtDate = (ts: number | null) =>
 typeof ts === "number" && ts > 0 ? new Date(ts * 1000).toLocaleString() : "—";

 // --- Fallback UI if not configured ---
 if (!provider) {
 return (
 <motion.section
 id="vesting-pools"
 className="py-10 border-t border-amber-400/20 bg-black/30"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 >
 <div className="max-w-7xl mx-auto px-4">
 <div className="rounded-3xl border border-amber-400/40 bg-black/40 p-6 md:p-7 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur">
 <h2 className="text-xl md:text-2xl font-semibold text-amber-200">Allocation Vesting Pools</h2>
 <p className="mt-2 text-sm text-amber-100/70">
 RPC is not configured (NEXT_PUBLIC_RPC_URL). This section is read-only and requires RPC to read on-chain TGE.
 </p>
 </div>
 </div>
 </motion.section>
 );
 }

 if (!presaleAddr || presaleAddr === ZERO) {
 return (
 <motion.section
 id="vesting-pools"
 className="py-10 border-t border-amber-400/20 bg-black/30"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 >
 <div className="max-w-7xl mx-auto px-4">
 <div className="rounded-3xl border border-amber-400/40 bg-black/40 p-6 md:p-7 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur">
 <h2 className="text-xl md:text-2xl font-semibold text-amber-200">Allocation Vesting Pools</h2>
 <p className="mt-2 text-sm text-amber-100/70">
 Presale address is not configured (NEXT_PUBLIC_PRESALE_ADDRESS). Cannot read TGE.
 </p>
 </div>
 </div>
 </motion.section>
 );
 }

 const tge = tgeTs ?? 0;
 const now = nowTs;

 const rows: Row[] = (() => {
 if (!tge) {
 return [
 {
 name: "Team (12.5%)",
 amount: ALLOC.TEAM,
 rule: "24-month linear vesting, 0% at TGE",
 unlocked: 0n,
 remaining: ALLOC.TEAM,
 note: "Frozen until TGE is triggered."
 },
 {
 name: "Treasury (7.5%)",
 amount: ALLOC.TREASURY,
 rule: "18-month linear unlock (from TGE)",
 unlocked: 0n,
 remaining: ALLOC.TREASURY,
 note: "Frozen until TGE is triggered."
 },
 {
 name: "Advisors (5%)",
 amount: ALLOC.ADVISORS,
 rule: "0% at TGE, 3-month cliff, then 18-month linear (21m total)",
 unlocked: 0n,
 remaining: ALLOC.ADVISORS,
 note: "Frozen until TGE is triggered."
 },
 {
 name: "Foundation (15%)",
 amount: ALLOC.FOUNDATION,
 rule: "0% at TGE, 6-month cliff, then 30-month linear (36m total)",
 unlocked: 0n,
 remaining: ALLOC.FOUNDATION,
 note: "Frozen until TGE is triggered."
 },
 ];
 }

 const dt = now - tge;

 const teamDur = 24 * MONTH_SEC;
 const teamUnlocked = dt <= 0 ? 0n : linearUnlocked(ALLOC.TEAM, dt, teamDur);

 const treDur = 18 * MONTH_SEC;
 const treUnlocked = dt <= 0 ? 0n : linearUnlocked(ALLOC.TREASURY, dt, treDur);

 const advCliff = 3 * MONTH_SEC;
 const advLin = 18 * MONTH_SEC;
 const advUnlocked = dt <= advCliff ? 0n : linearUnlocked(ALLOC.ADVISORS, dt - advCliff, advLin);

 const fCliff = 6 * MONTH_SEC;
 const fLin = 30 * MONTH_SEC;
 const fUnlocked = dt <= fCliff ? 0n : linearUnlocked(ALLOC.FOUNDATION, dt - fCliff, fLin);

 const mk = (name: string, amount: bigint, rule: string, unlocked: bigint, note?: string): Row => {
 const u = unlocked > amount ? amount : unlocked;
 const rem = amount > u ? amount - u : 0n;
 return { name, amount, rule, unlocked: u, remaining: rem, note };
 };

 return [
 mk("Team (12.5%)", ALLOC.TEAM, "24-month linear vesting, 0% at TGE", teamUnlocked),
 mk(
 "Treasury (7.5%)",
 ALLOC.TREASURY,
 "18-month linear unlock (from TGE)",
 treUnlocked,
 "Note: Treasury is multisig/timelock-secured; this panel shows release progress only."
 ),
 mk("Advisors (5%)", ALLOC.ADVISORS, "0% at TGE, 3-month cliff, then 18-month linear (21m total)", advUnlocked),
 mk(
 "Foundation (15%)",
 ALLOC.FOUNDATION,
 "0% at TGE, 6-month cliff, then 30-month linear (36m total)",
 fUnlocked,
 "Claim/release is governance-controlled (DAO execution). This UI shows deterministic releasable progress only."
 ),
 ];
 })();

 return (
 <motion.section
 id="vesting-pools"
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
 <h2 className="text-xl md:text-2xl font-semibold text-amber-200">Allocation Vesting Pools</h2>
 <p className="mt-1 text-sm text-amber-100/70 max-w-2xl">
 Read-only schedule/progress for Team, Treasury, Advisors and Foundation allocations (TGE-anchored).
 </p>
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

 <div className="mt-6 grid gap-3">
 {rows.map((r) => (
 <div key={r.name} className="rounded-2xl border border-amber-500/30 bg-black/35 px-5 py-4">
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
 <div className="text-amber-200 font-semibold">{r.name}</div>
 <div className="text-[12px] text-amber-100/60">
 Allocation: <span className="font-semibold text-amber-200">{fmt18(r.amount)} DDC</span>
 </div>
 </div>

 <div className="mt-1 text-[12px] text-amber-100/65">
 Rule: <span className="text-amber-100/80">{r.rule}</span>
 </div>

 <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[12px]">
 <div className="text-amber-100/70">
 Unlocked so far: <span className="text-emerald-300 font-semibold">{fmt18(r.unlocked)} DDC</span>
 </div>
 <div className="text-amber-100/70">
 Remaining locked: <span className="text-amber-200 font-semibold">{fmt18(r.remaining)} DDC</span>
 </div>
 <div className="text-amber-100/55">
 Progress:{" "}
 <span className="text-amber-200 font-semibold">
 {r.amount > 0n ? (Number((r.unlocked * 10_000n) / r.amount) / 100).toFixed(2) : "0.00"}%
 </span>
 </div>
 </div>

 <div className="mt-2 h-2 w-full rounded-full bg-amber-100/10 overflow-hidden">
 <div
 className="h-full bg-amber-400/70"
 style={{
 width: `${r.amount > 0n ? Math.max(0, Math.min(100, Number((r.unlocked * 10_000n) / r.amount) / 100)) : 0}%`,
 }}
 />
 </div>

 {r.note ? <div className="mt-2 text-[11px] text-amber-100/50">{r.note}</div> : null}
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.section>
 );
}
