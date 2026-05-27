"use client";

import Link from "next/link";

export default function FloatingAIMonitor() {
  return (
    <Link
      href="/ddc-ai-demo-monitor"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-900/90 px-5 py-4 shadow-2xl backdrop-blur-xl transition hover:scale-105 hover:border-cyan-300">

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-80" />

        <div className="relative flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <span className="text-cyan-300 text-lg">
              🧠
            </span>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">
              AI Monitor
            </div>

            <div className="text-xs text-slate-400">
              Live anomaly demo
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
