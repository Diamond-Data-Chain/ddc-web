"use client";

import { motion } from "framer-motion";

const daoItems = [
 {
 title: "Protocol upgrades",
 body: "Protocol upgrades, parameter adjustments, and economic policies are proposed, reviewed, and approved through decentralized governance processes.",
 },
 {
 title: "transparent voting mechanisms",
 body: "AI-generated analyses and simulations may inform governance discussions, but final authority always remains with human participants operating through transparent voting mechanisms.",
 },
 {
 title: "public auditability",
 body: "Any modification to SCC rule scope, oracle sets, validation thresholds, or failure modes is subject to on-chain governance, enforced timelocks, and public auditability.",
 },
];


export default function DAO() {
 return (
 <section
 id="dao"
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
 Governance Philosophy
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 DDC governance is community-led and fully on-chain.
 </motion.p>

 <div className="mt-8 grid md:grid-cols-3 gap-6">
 {daoItems.map((item, idx) => (
 <motion.div
 key={item.title}
 className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.1 * idx, duration: 0.5 }}
 whileHover={{
 translateY: -6,
 borderColor: "rgba(251, 191, 36, 0.7)",
 }}
 >
 <h3 className="font-semibold">{item.title}</h3>
 <p className="mt-2 text-sm text-slate-400">{item.body}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
