"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import CoinAllocationTable from "@/components/tokenomics/CoinAllocationTable";
export default function Tokenomics() {
 return (
 <section id="tokenomics"
 className="py-16 border-t border-slate-800 scroll-mt-24"
 >
 <div className="max-w-7xl mx-auto px-4">
 <motion.h2
 className="text-3xl font-bold"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ duration: 0.5 }}
 >
 Tokenomics
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 The native Layer-1 utility and governance coin used for staking, fees, and
 governance participation. The DDC coin does not represent equity, ownership,
 profit entitlement, or guaranteed economic return.
 </motion.p>

 {/* Figure kartice */}
 <div className="mt-8 grid md:grid-cols-2 gap-6">
 {/* Token distribution pie */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 whileHover={{
 translateY: -6,
 boxShadow:
 "0 18px 45px rgba(15, 23, 42, 0.85), 0 0 40px rgba(251, 191, 36, 0.12)",
 borderColor: "rgba(251, 191, 36, 0.6)",
 }}
 >
 <div className="h-56 rounded-xl bg-slate-800/60 flex items-center justify-center overflow-hidden">
 <Image
 src="/assets/images/token-distribution.png"
 alt="DDC Token Distribution"
 width={1200}
 height={600}
 className="w-full h-full object-contain"
 />
 </div>
 <h3 className="mt-4 font-semibold">Token Distribution</h3>
 <p className="text-sm text-slate-400">
 DDC coins designated for protocol-level burn or burn-locking:
 <br />• are permanently excluded from vesting,
 <br />• are never claimable or transferable,
 <br />• do not participate in validator incentives,
 <br />• are excluded from all distribution mechanics regardless of burn execution timing.
 <br />
 <br />
 
 </p>
 </motion.div>

 {/* Tokenomics flow */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 whileHover={{
 translateY: -6,
 boxShadow:
 "0 18px 45px rgba(15, 23, 42, 0.85), 0 0 40px rgba(56, 189, 248, 0.18)",
 borderColor: "rgba(56, 189, 248, 0.7)",
 }}
 >
 <div className="h-56 rounded-xl bg-slate-800/60 flex items-center justify-center overflow-hidden">
 <Image
 src="/assets/images/tokenomics-flow.png"
 alt="DDC Tokenomics Flow"
 width={1200}
 height={600}
 className="w-full h-full object-contain"
 />
 </div>
 <h3 className="mt-4 font-semibold">Tokenomics Flow</h3>
 <p className="text-sm text-slate-400">
 Deflationary Mechanism
 <br />
 Supply reduction within Diamond Data Chain is governed exclusively by the
 deterministic, protocol-level burn mechanism.
 </p>
 </motion.div>
 </div>

 <div id="coin-allocation-table" className="scroll-mt-24" />
 {/* Coin Allocation Table */}
 <CoinAllocationTable />

 {/* Live on-chain treasury cifre (vault/read) */}
 {/* Net Circulation blok */}
 <motion.div
 className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 >
 <div className="text-sm text-slate-300">
 The effective circulating supply at time t is defined as:
 </div>
 <div className="mt-2 text-lg md:text-xl text-amber-300 font-mono">
 S(t) = S₀ − B(t)
 </div>
 <div className="mt-2 text-xs text-slate-400 whitespace-pre-line leading-relaxed">
• B_max = maximum burn cap (128,000,000 DDC)
• S(t) = effective circulating supply at time t
Subject to the invariant:
0 ≤ B(t) ≤ B_max
Burn execution logic enforces:
• irreversible destruction of DDC coins,
• monotonic increase of B(t),
• permanent reduction of S(t).

No governance vote, administrative role, validator action, or off-chain process can:
• initiate discretionary burns,
• modify burn rates,
• extend burn caps,
• re-enable burn functionality after shutdown.
</div>
</motion.div>
 </div>
 </section>
 );
}
