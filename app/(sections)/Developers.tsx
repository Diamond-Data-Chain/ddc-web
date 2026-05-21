"use client";

import { motion } from "framer-motion";

const items = [
 {
 title: "Run a Node",
 body: "Hardware profile, setup scripts and best practices for running a DDC validator or data node with PoE/DPoI scoring.",
 },
 {
 title: "Build on DDC",
 body: "SDKs, smart-contract templates and GraphQL/REST endpoints for building AI-driven dApps and data marketplaces.",
 },
 {
 title: "Developer Resources",
 body: "Technical documentation, verified contract addresses, ABI references, and integration resources for builders.",
 },
];

export default function Developers() {
 return (
 <section
 id="developers"
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
 Developers
 </motion.h2>

 <motion.p
 className="mt-2 text-slate-300 max-w-3xl"
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-120px" }}
 transition={{ delay: 0.15, duration: 0.5 }}
 >
 DDC exposes a full-stack environment for AI-native applications:
 on-chain compute coordination, verifiable data feeds and governance
 hooks out-of-the-box.
 </motion.p>

 <div className="mt-8 grid md:grid-cols-3 gap-6">
 {items.map((item, idx) => (
 <motion.div
 key={item.title}
 className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-80px" }}
 transition={{ delay: 0.1 * idx, duration: 0.5 }}
 whileHover={{
 translateY: -6,
 borderColor: "rgba(96, 165, 250, 0.7)",
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
