"use client";
import Image from "next/image";

import { motion } from "framer-motion";

const techCards = [
 {
 title: "Layered Structure",
 subtitle: "(Informational only — illustrative; no execution, governance, or authority implications)",
 src: "/assets/images/figures/fig02.png",
 alt: "DDC Layered Architecture",
 },
 {
 title: "AI Advisory Analysis Flow",
 subtitle: "(Informational only — illustrative; no execution, governance, or authority implications)",
 src: "/assets/images/figures/fig03.png",
 alt: "DDC AI Decision Flow",
 },
 {
 title: "AI Data Feedback Cycle",
 subtitle: "(Informational only — illustrative; no execution, governance, or authority implications)",
 src: "/assets/images/figures/fig04.png",
 alt: "DDC Feedback Cycle",
 },
];

const kpis = [
 { k: "Throughput", v: "~100,000 transactions per second" },
 { k: "Finality Time", v: "<3 seconds" },
 { k: "Energy Use /", v: "<0.0003 kWh" },
 { k: "Uptime", v: "99.98%" },
];

export default function Technology() {
 return (
 <section
 id="technology"
 className="py-16 border-t border-slate-800 scroll-mt-24"
 >
 <div className="max-w-7xl mx-auto px-4">
 <motion.h2
 className="text-3xl font-bold"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.5 }}
 >
 Layered Structure
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 DDC is composed of three primary layers, each responsible for specific system functions and interconnected through defined, non-executive signaling interfaces.
 </motion.p>

 {/* Gornje kartice sa SLikama */}
 <div className="mt-8 grid md:grid-cols-3 gap-6">
 {techCards.map((card, idx) => (
 <motion.div
 key={card.title}
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.1 * idx, duration: 0.5 }}
 whileHover={{
 translateY: -6,
 boxShadow:
 "0 18px 45px rgba(15, 23, 42, 0.85), 0 0 40px rgba(251, 191, 36, 0.12)",
 borderColor: "rgba(251, 191, 36, 0.6)",
 }}
 >
 <div className="h-40 rounded-xl bg-slate-800/60 flex items-center justify-center overflow-hidden">
 <Image
 src={card.src}
 alt={card.alt}
 width={800}
 height={400}
 className="w-full h-full object-contain"
 />
 </div>
 <h3 className="mt-4 font-semibold">{card.title}</h3>
 <p className="text-sm text-slate-400">{card.subtitle}</p>
 </motion.div>
 ))}
 </div>

 {/* KPI strip */}
 <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
 {kpis.map((item, idx) => (
 <motion.div
 key={item.k}
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-center"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.1 * idx, duration: 0.4 }}
 whileHover={{
 translateY: -4,
 borderColor: "rgba(56, 189, 248, 0.6)",
 }}
 >
 <div className="text-slate-400 text-xs uppercase tracking-wider">
 {item.k}
 </div>
 <div className="text-xl md:text-2xl font-bold text-amber-300 mt-1">
 {item.v}
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
