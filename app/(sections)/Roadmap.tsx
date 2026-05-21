"use client";
import Image from "next/image";

import { motion } from "framer-motion";

const phases = [
 {
 title: "Presale and funding phase",
 tag: "Key stages include:",
 tagColor: "from-blue-500 to-blue-300",
 body: "The DDC implementation timeline is organized into discrete phases designed to reduce systemic risk and ensure progressive validation.",
 },
 {
 title: "Public testnet deployment and validation",
 tag: "Key stages include:",
 tagColor: "from-amber-400 to-yellow-300",
 body: "The DDC implementation timeline is organized into discrete phases designed to reduce systemic risk and ensure progressive validation.",
 },
 {
 title: "Post-presale stabilization period",
 tag: "Key stages include:",
 tagColor: "from-orange-400 to-amber-200",
 body: "The DDC implementation timeline is organized into discrete phases designed to reduce systemic risk and ensure progressive validation.",
 },
 {
 title: "Mainnet launch and decentralization transition",
 tag: "Key stages include:",
 tagColor: "from-purple-500 to-pink-400",
 body: "All transitions between stages are conditional on meeting predefined technical, security, and governance-defined readiness criteria. Advancement is not automatic and does not occur solely due to elapsed time.",
 },
 {
 title: "The DDC implementation timeline is organized into discrete phases designed to reduce systemic risk and ensure progressive validation.",
 tag: "Implementation Timeline",
 tagColor: "from-emerald-500 to-green-300",
 body: "All transitions between stages are conditional on meeting predefined technical, security, and governance-defined readiness criteria. Advancement is not automatic and does not occur solely due to elapsed time.",
 },
 {
 title: "All transitions between stages are conditional on meeting predefined technical, security, and governance-defined readiness criteria. Advancement is not automatic and does not occur solely due to elapsed time.",
 tag: "Implementation Timeline",
 tagColor: "from-emerald-400 to-teal-300",
 body: "The figure is illustrative of sequence and dependency relationships and does not represent a binding schedule.",
 },
];


export default function Roadmap() {
 return (
 <section
 id="roadmap"
 className="py-16 border-t border-slate-800 scroll-mt-24"
 >
 <div className="max-w-7xl mx-auto px-4">
 {/* Title and description */}
 <motion.h2
 className="text-3xl font-bold"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ duration: 0.5 }}
 >
 DDC Development Timeline
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 The figure is illustrative of sequence and dependency relationships and does not represent a binding schedule.
 </motion.p>

 {/* GRID */}
 <div className="mt-10 grid md:grid-cols-2 gap-10">
 {/* Roadmap image */}
 <motion.div
 className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex items-center justify-center overflow-hidden h-80"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ duration: 0.5 }}
 whileHover={{
 translateY: -6,
 boxShadow:
 "0 18px 45px rgba(15, 23, 42, 0.85), 0 0 40px rgba(56, 189, 248, 0.18)",
 borderColor: "rgba(56, 189, 248, 0.7)",
 }}
 >
 <Image
 src="/assets/images/roadmap-gantt.png"
 alt="DDC Development Timeline"
 width={1400}
 height={700}
 className="w-full h-full object-contain"
 />
 </motion.div>

 {/* Vertical timeline */}
 <motion.div
 className="relative"
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ duration: 0.5 }}
 >
 {/* Timeline linija */}
 <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/80 via-slate-700 to-blue-500/80" />

 <div className="space-y-8">
 {phases.map((phase, idx) => (
 <motion.div
 key={phase.title}
 className="relative pl-10"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.08 * idx, duration: 0.4 }}
 >
 {/* dot */}
 <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-slate-950 border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />

 {/* PHASE TAG */}
 <div
 className={`inline-block mb-1 px-2 py-0.5 text-[10px] rounded-md bg-gradient-to-r ${phase.tagColor} text-slate-900 font-bold shadow-md`}
 >
 {phase.tag}
 </div>

 {/* Naslov faze */}
 <h3 className="text-sm md:text-base font-semibold text-amber-200">
 {phase.title}
 </h3>

 {/* Opis faze */}
 <p className="mt-1 text-xs md:text-sm text-slate-400 leading-relaxed">
 {phase.body}
 </p>
 </motion.div>
 ))}
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 );
}

