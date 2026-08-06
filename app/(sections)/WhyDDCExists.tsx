"use client";

import { motion } from "framer-motion";

export default function WhyDDCExists() {
  return (
    <section className="border-t border-slate-800 bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
            Why DDC Exists
          </div>

          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Governance history should survive technology change.
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-300">
            Organizations replace software, cloud providers, governance
            platforms, identity systems and even entire business structures.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Diamond Data Chain preserves an independently verifiable governance
            history that survives those operational changes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
