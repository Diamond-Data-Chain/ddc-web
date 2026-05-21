"use client";
import Image from "next/image";

import { motion } from "framer-motion";

export default function InvestorSummary() {
 return (
 <section
 id="investor"
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
 Tokenomics and Value Scenarios
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 This appendix is non-normative, illustrative only, and does not describe, imply, or model economic value, price behavior, returns, or investment characteristics of any token or network component.
 </motion.p>

 <div className="mt-8 grid md:grid-cols-2 gap-6">
 {/* Value Proposition Pyramid */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 h-56 flex items-center justify-center"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 whileHover={{
 translateY: -6,
 boxShadow:
 "0 18px 45px rgba(15, 23, 42, 0.85), 0 0 40px rgba(251, 191, 36, 0.18)",
 borderColor: "rgba(251, 191, 36, 0.7)",
 }}
 >
 <Image
 src="/assets/images/value-proposition.png"
 alt="DDC Value Proposition Pyramid"
 width={1200}
 height={600}
 className="w-full h-full object-contain"
 />
 </motion.div>

 {/* Market & Growth Charts */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 h-56 flex items-center justify-center"
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
 <Image
 src="/assets/images/market-growth-1.png"
 alt="DDC Market & Growth Charts"
 width={1200}
 height={600}
 className="w-full h-full object-contain"
 />
 </motion.div>
 </div>

 <motion.div
 className="mt-6 text-sm text-slate-400 max-w-3xl"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 >
 All protocol-enforced behavior is determined solely by on-chain logic and governance processes defined in the main body of the document.
 </motion.div>
 </div>
 </section>
 );
}
