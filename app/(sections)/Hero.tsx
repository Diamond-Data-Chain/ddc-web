"use client";

import { motion } from "framer-motion";
import DDCAnimatedLogo from "./DDCAnimatedLogo";

export default function Hero() {
 return (
 <section id="home" className="relative overflow-hidden">
 {/* Pozadinski glow */}
 <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/40 to-amber-400/30 blur-3xl pointer-events-none" />
 <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 blur-3xl pointer-events-none" />

 <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
 {/* Levi deo – naslov, tekst, dugmad */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.7, ease: "easeOut" }}
 >
 <motion.div
 className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 mb-4"
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2, duration: 0.5 }}
 >
 <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
 <span>AI-assisted, advisory-only Layer-1 Blockchain for the Intelligent Data Economy</span>
 </motion.div>

 <h1 className="text-4xl md:text-5xl font-bold leading-tight">
 AI-assisted, advisory-only Layer-1 Blockchain for the Intelligent Data Economy
 </h1>
 <p className="mt-5 text-slate-300 max-w-xl">
 
 All AI outputs generated in this layer are advisory only. They do not trigger, approve, delay, prioritize, or execute any on-chain action. AI-assisted governance and simulation layers referenced in this document are introduced in protocol versions v2.0 and later and are not active at the v1.0 network launch.
 
 </p>

 <motion.div
 className="mt-8 flex flex-wrap gap-3"
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4, duration: 0.5 }}
 >
 <a
 href="#technology"
 className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
 >
 Validation Flow
 </a>
 <a
 href="#coin-allocation-table"
 className="px-5 py-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 transition font-semibold"
 >
 Coin Allocation Table
 </a>
 </motion.div>

 <motion.div
 className="mt-6 text-xs text-slate-400 flex flex-wrap gap-4"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6, duration: 0.5 }}
 >
 <span>Deterministic Execution</span>
 <span>No Discretionary Control</span>
 <span>advisory only</span>
 </motion.div>
 </motion.div>

 {/* Desni deo – kartica sa dijamantom */}
 <motion.div
 className="aspect-[1.1] rounded-3xl bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-slate-800 p-6 flex items-center justify-center"
 initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
 animate={{ opacity: 1, scale: 1, rotateX: 0 }}
 transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
 whileHover={{ scale: 1.02, translateY: -4 }}
 >
 <DDCAnimatedLogo src="/assets/images/diamond-from-whitepaper.png" />
 <div className="sr-only">Diamond Data Chain (DDC)</div>
 </motion.div>
 </div>
 </section>
 );
}
