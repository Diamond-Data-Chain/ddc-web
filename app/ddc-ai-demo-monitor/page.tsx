"use client";

import { useMemo, useState } from "react";
import { AI_DEMO_EVENTS } from "@/data/aiDemoEvents";

const riskColors: Record<string, string> = {
  LOW: "text-green-400 border-green-500/30 bg-green-500/10",
  MEDIUM: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10",
  HIGH: "text-red-400 border-red-500/30 bg-red-500/10",
};

export default function DDCAIMonitorPage() {
  const categories = useMemo(
    () => [...new Set(AI_DEMO_EVENTS.map((e) => e.category))],
    []
  );

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedEvent, setSelectedEvent] = useState(
    AI_DEMO_EVENTS[0]
  );

  const filtered = AI_DEMO_EVENTS.filter(
    (e) => e.category === selectedCategory
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">
            DDC AI Monitor
          </h1>

          <p className="text-slate-300 max-w-3xl text-lg leading-relaxed">
            Demonstration of AI-assisted anomaly monitoring for trusted
            records, treasury activity, validators, logistics, healthcare,
            manufacturing, AI datasets, and public administration systems.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedEvent(
                  AI_DEMO_EVENTS.find((e) => e.category === cat)!
                );
              }}
              className={`px-4 py-2 rounded-2xl border transition ${
                selectedCategory === cat
                  ? "bg-blue-500/20 border-blue-400 text-blue-300"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800">
              <h2 className="text-2xl font-semibold">
                Event Monitor
              </h2>
            </div>

            <div className="divide-y divide-slate-800">
              {filtered.map((event, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left p-6 hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {event.event}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${riskColors[event.risk]}`}
                    >
                      {event.risk}
                    </span>
                  </div>

                  <div className="text-sm text-slate-400">
                    Status: {event.status}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                AI Analysis
              </h2>

              <div
                className={`px-4 py-2 rounded-full border text-sm font-semibold ${riskColors[selectedEvent.risk]}`}
              >
                Risk Score: {selectedEvent.score}/100
              </div>
            </div>

            <div className="space-y-6">

              <div>
                <div className="text-slate-400 mb-2">
                  Event
                </div>

                <div className="text-2xl font-semibold">
                  {selectedEvent.event}
                </div>
              </div>

              <div>
                <div className="text-slate-400 mb-3">
                  Detected Information
                </div>

                <div className="space-y-2">
                  {Object.entries(selectedEvent.details).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between rounded-xl bg-slate-800/50 px-4 py-3"
                    >
                      <span className="capitalize text-slate-400">
                        {k}
                      </span>

                      <span className="text-slate-100">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-400 mb-3">
                  AI Risk Analysis
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
                  <ul className="space-y-3">
                    {selectedEvent.reasons.map((reason, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-200"
                      >
                        <span className="text-red-400 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
