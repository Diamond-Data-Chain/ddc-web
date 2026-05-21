"use client";

import { motion } from "framer-motion";

const transparencyItems = [
 {
 title: "Presale Architecture & Batch Pricing Model",
 body: "To achieve these objectives, the presale is implemented as a fixed sequence of 40 batches, each characterized by:",
 },
 {
 title: "Public View Functions & Dashboard Integration",
 body: "5. exposing read-only interfaces for public dashboards, auditors, and block explorers.",
 },
 {
 title: "Events & Auditability",
 body: "All allocations described in this section are enforced through on-chain logic and are not subject to discretionary modification.",
 },
];


export default function Transparency() {
 return (
 <section
 id="transparency"
 className="py-16 border-t border-slate-800 scroll-mt-24 bg-slate-950/60"
 >
 <div className="max-w-7xl mx-auto px-4">
 <motion.h2
 className="text-3xl font-bold"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ duration: 0.5 }}
 >
 Presale Architecture & Batch Pricing Model
 
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 DDC is architected to operate as an execution-aware infrastructure layer where data, computation, and governance interact in a transparent and auditable manner.
 </motion.p>

 <div className="mt-8 grid md:grid-cols-3 gap-6">
 {transparencyItems.map((item, idx) => (
 <motion.div
 key={item.title}
 className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.1 * idx, duration: 0.5 }}
 whileHover={{
 translateY: -6,
 borderColor: "rgba(251, 191, 36, 0.6)",
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
