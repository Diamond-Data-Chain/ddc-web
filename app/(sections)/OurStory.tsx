"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function OurStory() {
  const [open, setOpen] = useState(false);

  return (
    <section id="our-story" className="border-t border-slate-800 bg-slate-950/70 py-20 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div className="rounded-3xl border border-amber-400/40 bg-black/40 p-8 shadow-[0_0_40px_rgba(251,191,36,0.18)]">
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Our Story</div>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            How Diamond Data Chain Was Created
          </h2>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Diamond Data Chain did not begin as a blockchain project. It began
            as a question: why do so many people lose money in digital projects,
            while almost nobody is held accountable?
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="font-semibold text-amber-200">The Problem</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Projects disappear. Money disappears. Promises disappear.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="font-semibold text-amber-200">The Idea</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Every important action should create a verifiable accountability trail.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="font-semibold text-amber-200">The Vision</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                DDC evolved into accountability infrastructure for trust-based industries.
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-8 rounded-full border border-amber-400/60 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-500/20"
          >
            {open ? "Hide full story ↑" : "Read the full story ↓"}
          </button>

          
{open && (
  <div className="mt-8 space-y-5 rounded-2xl border border-amber-400/30 bg-slate-950/70 p-6 text-sm leading-7 text-slate-300">

    <p><strong>How Diamond Data Chain Was Created</strong></p>

    <p>Diamond Data Chain did not begin as a blockchain project.</p>

    <p>It began as a question.</p>

    <p>Why do so many people lose money in digital projects, while almost nobody is held accountable?</p>

    <p>Every day new crypto projects appear online.</p>

    <p>Most of them promise revolutionary technology, massive growth, and a better future.</p>

    <p>People see marketing campaigns, social media hype, influencer promotions and impressive presentations.</p>

    <p>The natural human reaction is simple:</p>

    <p><em>"Maybe this is my opportunity."</em></p>

    <p>Many people invest not because they fully understand the technology, but because they fear missing out.</p>

    <p>Sometimes those projects succeed.</p>

    <p>Many do not.</p>

    <p>In some cases, the money disappears.</p>

    <p>The project disappears.</p>

    <p>The team disappears.</p>

    <p>The promises disappear.</p>

    <p>The investors are left with losses.</p>

    <p>The most frustrating part is often not the loss itself.</p>

    <p>The most frustrating part is that nobody is held responsible.</p>

    <p>The money moves through wallets, exchanges and multiple transactions until the trail becomes difficult to understand.</p>

    <p>For ordinary people, finding the truth becomes almost impossible.</p>

    <hr className="border-amber-400/20" />

    <p>Diamond Data Chain was born from the idea that this should not be normal.</p>

    <p>What if every important action created a verifiable accountability trail?</p>

    <p>What if treasury movements, presale allocations and critical project transactions could be recorded in a transparent and auditable way?</p>

    <p>What if unusual behavior could be detected before more people were harmed?</p>

    <p>What if accountability became measurable?</p>

    <p>The original motivation behind DDC was to create a system capable of reducing fraud, improving transparency and making responsibility visible.</p>

    <p>As the concept evolved, it became clear that the same problem exists far beyond cryptocurrency.</p>

    <p>Factories need accountability.</p>

    <p>Warehouses need accountability.</p>

    <p>Healthcare systems need accountability.</p>

    <p>Financial institutions need accountability.</p>

    <p>Governments need accountability.</p>

    <p>Every industry that depends on trust faces the same challenge:</p>

    <p><strong>Data exists.</strong></p>

    <p><strong>Responsibility is often difficult to prove.</strong></p>

    <p>That realization transformed DDC from a solution for crypto transparency into a broader accountability infrastructure.</p>

    <p>Today, the vision of Diamond Data Chain is simple:</p>

    <p><strong>Create systems where important events remain traceable, records remain verifiable, and responsibility remains visible.</strong></p>

  </div>
)}

        </motion.div>
      </div>
    </section>
  );
}
