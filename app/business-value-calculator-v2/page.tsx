"use client";

import { useState } from "react";
import ManufacturingAssessment from "./components/manufacturing/ManufacturingAssessment";
import HealthcareAssessment from "./components/healthcare/HealthcareAssessment";
import TransportAssessment from "./components/transport/TransportAssessment";
import BankingAssessment from "./components/banking/BankingAssessment";
import InsuranceAssessment from "./components/insurance/InsuranceAssessment";
import EnergyAssessment from "./components/energy/EnergyAssessment";
import AIAssessment from "./components/ai/AIAssessment";
import OtherAssessment from "./components/other/OtherAssessment";

type BranchId =
  | "manufacturing"
  | "healthcare"
  | "transport"
  | "banking"
  | "insurance"
  | "energy"
  | "technology"
  | "other";

const BRANCHES: {
  id: BranchId;
  name: string;
  description: string;
}[] = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    description:
      "Production, machine, component, quality, maintenance and product-lifecycle records.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description:
      "Clinical events, treatment history, medical devices, record changes and operational evidence.",
  },
  {
    id: "transport",
    name: "Transport & Logistics",
    description:
      "Shipment, location, temperature, delivery, maintenance and dispute records.",
  },
  {
    id: "banking",
    name: "Banking & Financial Services",
    description:
      "Transactions, reviews, AML/fraud processes, approvals and operational evidence.",
  },
  {
    id: "insurance",
    name: "Insurance",
    description:
      "Policies, claims, evidence, assessments, approvals and claim-history records.",
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    description:
      "Assets, meters/sensors, maintenance, outages, inspections and operational events.",
  },
  {
    id: "technology",
    name: "AI & Digital Systems",
    description:
      "Model versions, recommendations, tools, approvals, policies and decision-governance events.",
  },
  {
    id: "other",
    name: "Other",
    description:
      "Custom operational record and integration assessment.",
  },
];

export default function OperationalValueAssessmentV2() {
  const [branchId, setBranchId] =
    useState<BranchId>("manufacturing");

  return (
    <main className="min-h-screen bg-slate-950 pb-28 text-white">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-30%] h-[520px] w-[520px] rounded-full bg-amber-500/[0.10] blur-3xl" />
          <div className="absolute right-[-10%] top-[-20%] h-[520px] w-[520px] rounded-full bg-cyan-500/[0.08] blur-3xl" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
            DDC Operational Value Assessment
          </p>

          <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
            What could DDC be worth to your organization?
          </h1>

          <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300 md:text-xl">
            Estimate the cost of managing your current operational records,
            the DDC infrastructure required for your workload, and the
            potential financial value of a connected, verifiable operational
            history.
          </p>

          <a
            href="#assessment"
            className="mt-9 inline-flex rounded-2xl border border-amber-300/60 bg-amber-400/15 px-6 py-3.5 font-semibold text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.10)] transition hover:border-amber-200 hover:bg-amber-400/25"
          >
            Start Operational Value Assessment →
          </a>
        </div>
      </section>

      <section
        id="assessment"
        className="mx-auto max-w-7xl px-6 py-14"
      >
        <div className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
            Step 1
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            What best describes your organization?
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BRANCHES.map((branch) => {
              const selected = branch.id === branchId;

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setBranchId(branch.id)}
                  className={
                    selected
                      ? "rounded-2xl border border-amber-300/70 bg-amber-400/[0.10] p-5 text-left shadow-[0_0_25px_rgba(251,191,36,0.08)]"
                      : "rounded-2xl border border-slate-800 bg-slate-950/55 p-5 text-left transition hover:-translate-y-0.5 hover:border-amber-500/45"
                  }
                >
                  <span
                    className={
                      selected
                        ? "font-semibold text-amber-200"
                        : "font-semibold text-white"
                    }
                  >
                    {branch.name}
                  </span>

                  <span className="mt-3 block text-sm leading-6 text-slate-400">
                    {branch.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {branchId === "manufacturing" ? (
          <ManufacturingAssessment />
        ) : branchId === "healthcare" ? (
          <HealthcareAssessment />
        ) : branchId === "transport" ? (
          <TransportAssessment />
        ) : branchId === "banking" ? (
          <BankingAssessment />
        ) : branchId === "insurance" ? (
          <InsuranceAssessment />
        ) : branchId === "energy" ? (
          <EnergyAssessment />
        ) : branchId === "technology" ? (
          <AIAssessment />
        ) : branchId === "other" ? (
          <OtherAssessment />
        ) : (
          <div className="mt-10 rounded-[28px] border border-slate-800 bg-slate-900/65 p-8 text-slate-300">
            This branch will use the same versioned DDC cost engine with
            industry-specific operational scope inputs.
          </div>
        )}
      </section>
    </main>
  );
}
