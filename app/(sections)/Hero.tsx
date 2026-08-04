"use client";

import { motion } from "framer-motion";
import DDCAnimatedLogo from "./DDCAnimatedLogo";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/40 to-amber-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>Diamond Data Chain</span>
          </motion.div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            The blockchain built to preserve governance, accountability and
            verifiable evidence.
          </h1>

          <div className="mt-5 max-w-xl space-y-3 text-slate-300">
            <p className="text-lg text-slate-200">
              Organizations need more than AI capabilities.
            </p>

            <p className="leading-relaxed">
              They need verifiable evidence of who approved a decision, what
              information was available at the time, which governance rules
              applied, and whether that decision can still be verified years
              later.
            </p>
          </div>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <a
              href="#presale"
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
            >
              Invest in DDC
            </a>

            <a
              href="/whitepaper.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-amber-400/40 bg-amber-500/20 px-5 py-3 font-semibold text-amber-300 transition hover:bg-amber-500/30"
            >
              Read Whitepaper
            </a>

            <a
              href="/ddc-watch"
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/50 bg-cyan-500/15 px-5 py-3 font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.12)] transition hover:border-cyan-300/70 hover:bg-cyan-500/25"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              DDC Watch
              <span className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                Live
              </span>
            </a>
          </motion.div>

          <motion.div
            className="mt-8 max-w-3xl rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-blue-500/10 p-6 shadow-[0_0_40px_rgba(251,191,36,0.12)]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Executive Business Assessment
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-white">
              How much is fragmented evidence costing your organization?
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Measure the financial impact of reconstructing products,
              incidents, approvals and operational history across disconnected
              evidence sources.
            </p>

            <a
              href="/business-value-calculator"
              className="mt-6 inline-flex items-center rounded-2xl bg-amber-400 px-6 py-3 text-base font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Start Business Assessment →
            </a>
          </motion.div>

          <motion.div
            className="mt-6 max-w-xl space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-sm text-slate-300">
              AI-assisted, advisory-only Layer-1 Blockchain for the Intelligent
              Data Economy.
            </p>

            <p className="text-xs leading-relaxed text-slate-500">
              All AI outputs generated within the DDC ecosystem are advisory
              only and require human review and authorization. Diamond Data
              Chain preserves the governance, accountability and verifiable
              evidence surrounding every recorded decision.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex aspect-[1.1] items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-900/40 to-slate-900/60 p-6"
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
