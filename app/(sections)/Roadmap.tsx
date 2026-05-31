"use client";

import DynamicRoadmap from "@/components/roadmap/DynamicRoadmap";

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-slate-50"
    >
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Roadmap
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-slate-300">
          DDC development roadmap aligned with presale execution, public testnet,
          security validation, mainnet readiness, DAO governance, and long-term
          ecosystem growth.
        </p>
      </div>

      <DynamicRoadmap />
    </section>
  );
}
