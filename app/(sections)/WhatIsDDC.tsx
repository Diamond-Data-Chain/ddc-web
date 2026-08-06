"use client";

import { motion } from "framer-motion";

const doesNotItems = [
  "Determine whether evidence is true",
  "Validate AI correctness",
  "Replace GRC platforms",
  "Replace ISO 42001",
  "Replace monitoring systems",
];

const doesItems = [
  "Preserve governance history",
  "Preserve accountability",
  "Preserve approval history",
  "Preserve evidence provenance",
  "Preserve decision history",
];

export default function WhatIsDDC() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950/70 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[10%] h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[5%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            What is Diamond Data Chain?
          </div>

          <h2 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
            Governance infrastructure for preserving decision history.
          </h2>

          <p className="mt-7 text-lg leading-8 text-slate-300">
            Diamond Data Chain (DDC) is decentralized infrastructure for
            preserving governance history.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            It does not replace enterprise GRC platforms, AI governance
            frameworks, monitoring systems or regulatory standards.
          </p>

          <p className="mt-4 leading-8 text-slate-400">
            Instead, it preserves who introduced information, who approved
            decisions, which governance rules applied, which evidence was relied
            upon and how decisions evolved over time.
          </p>

          <p className="mt-4 font-medium leading-8 text-slate-200">
            Its purpose is accountability—not determining whether information is
            objectively true.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mx-auto mt-20 max-w-4xl text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300">
            Clear Boundaries
          </div>

          <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            What DDC does — and does not do
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
            DDC preserves governance and accountability history. It does not
            determine objective truth or replace operational governance systems.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="group relative overflow-hidden rounded-[28px] border border-amber-500/35 bg-slate-900/70 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300/70 hover:shadow-[0_22px_90px_rgba(245,158,11,0.18)] md:p-9"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.12),transparent_42%)]" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                    Boundary
                  </div>

                  <h4 className="mt-2 text-2xl font-semibold text-white">
                    DDC DOES NOT
                  </h4>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 text-2xl text-red-300 shadow-[0_0_24px_rgba(248,113,113,0.14)]">
                  ×
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {doesNotItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-red-400/15 bg-slate-950/65 px-4 py-4 transition group-hover:border-red-300/25"
                  >
                    <span className="mt-0.5 text-red-300">×</span>
                    <span className="text-sm leading-6 text-slate-300 md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="group relative overflow-hidden rounded-[28px] border border-amber-500/35 bg-slate-900/70 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300/70 hover:shadow-[0_22px_90px_rgba(245,158,11,0.18)] md:p-9"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_42%)]" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                    Core Function
                  </div>

                  <h4 className="mt-2 text-2xl font-semibold text-white">
                    DDC DOES
                  </h4>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-400/10 text-2xl text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                  ✓
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {doesItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-cyan-400/15 bg-slate-950/65 px-4 py-4 transition group-hover:border-cyan-300/30"
                  >
                    <span className="mt-0.5 text-cyan-300">✓</span>
                    <span className="text-sm leading-6 text-slate-200 md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
