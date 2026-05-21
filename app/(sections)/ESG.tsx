"use client";
import Image from "next/image";

import { motion } from "framer-motion";

export default function ESG() {
 return (
 <section
 id="esg"
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
 ESG Impact
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 Energy efficiency and carbon methodology aligned with IEA 2024
 benchmarks. Green Proof Certificate (GPC) reporting for validators,
 dApps and enterprise partners on DDC mainnet.
 </motion.p>

 <div className="mt-8 grid md:grid-cols-2 gap-6">
 {/* Carbon indicator grafika */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 whileHover={{
 translateY: -6,
 boxShadow:
 "0 18px 45px rgba(15, 23, 42, 0.85), 0 0 40px rgba(52, 211, 153, 0.18)",
 borderColor: "rgba(52, 211, 153, 0.7)",
 }}
 >
 <div className="h-56 rounded-xl bg-slate-800/60 flex items-center justify-center overflow-hidden mb-4">
 <Image
 src="/assets/images/esg-carbon-indicator.png"
 alt="DDC ESG Carbon Indicator"
 width={1200}
 height={600}
 className="w-full h-full object-contain"
 />
 </div>
 <h3 className="font-semibold">Carbon Reduction Indicator</h3>
 <p className="text-sm text-slate-400 mt-1">
 DDC validator profiles are benchmarked against traditional PoW
 networks, publishing an on-chain Green Proof Certificate (GPC)
 per epoch.
 </p>
 </motion.div>

 {/* Formula and explanation */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 <div className="text-sm text-slate-300">
 Carbon reduction indicator:
 </div>
 <div className="mt-2 text-lg md:text-xl text-emerald-400 font-mono">
 1 DDC ≈ 0.002 kg CO₂ saved*
 </div>
 <div className="text-xs text-slate-500 mt-2">
 *Methodology in Appendix A.4:
 </div>
 <div className="mt-1 text-sm text-amber-200 font-mono">
 ΔCO₂ = (E₁ − E₂) × I / n
 </div>
 <div className="mt-3 text-xs text-slate-400">
 E₁ – baseline energy consumption · E₂ – DDC validator profile · I
 – carbon intensity factor · n – number of validated transactions.
 DDC publishes periodic ESG reports to the DAO.
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 );
}
