"use client";

import { motion } from "framer-motion";

export default function WhatIsDDC() {
  return (
    <section className="border-t border-slate-800 bg-slate-950/60 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What is Diamond Data Chain?
        </motion.h2>

        <motion.p className="mt-6 text-lg leading-8 text-slate-300">
          Diamond Data Chain (DDC) is a decentralized trust infrastructure
          designed to make records, governance, and critical digital activity
          transparent, auditable, and independently verifiable.
        </motion.p>

        <motion.p className="mt-4 leading-7 text-slate-400">
          While many blockchain projects focus primarily on transactions, DDC
          focuses on accountability. Important actions leave evidence,
          allocations remain auditable, governance remains transparent, and
          participants can independently verify the state of the system.
        </motion.p>

        <motion.p className="mt-4 leading-7 text-slate-400">
          By combining transparent governance, public verification, Recorder
          infrastructure, deterministic allocation mechanisms, and future
          AI-assisted monitoring layers, DDC aims to establish a foundation for
          trustworthy digital systems.
        </motion.p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="font-semibold">Transparency</h3>
            <p className="mt-2 text-sm text-slate-400">
              Publicly auditable records and allocation mechanisms.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="font-semibold">Accountability</h3>
            <p className="mt-2 text-sm text-slate-400">
              Governance and critical actions remain visible and verifiable.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="font-semibold">Verification</h3>
            <p className="mt-2 text-sm text-slate-400">
              Trust based on evidence rather than assumptions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
