"use client";

import NumberField from "../NumberField";
import type { ManufacturingInputs } from "../../../business-value-calculator/manufacturingValueModel";

type Props = {
  inputs: ManufacturingInputs;
  update: <K extends keyof ManufacturingInputs>(
    key: K,
    value: ManufacturingInputs[K]
  ) => void;
};

export default function ManufacturingCosts({
  inputs,
  update,
}: Props) {
  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Current Cost Drivers
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Operational record-handling cost
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Staff maintaining/checking/reconciling/retrieving records"
            helper="People performing the addressable record-handling work."
            value={inputs.recordHandlingStaff}
            suffix="people"
            onChange={(value) => update("recordHandlingStaff", value)}
          />

          <NumberField
            label="Average hours per person per week on those tasks"
            helper="Current manual record-handling workload."
            value={inputs.recordHandlingHoursPerWeek}
            suffix="h/week"
            step={0.5}
            onChange={(value) =>
              update("recordHandlingHoursPerWeek", value)
            }
          />

          <NumberField
            label="Fully loaded hourly labor cost"
            helper="Salary, taxes, benefits and operational overhead."
            value={inputs.fullyLoadedHourlyCostUsdt}
            suffix="USDT/h"
            step={0.5}
            onChange={(value) =>
              update("fullyLoadedHourlyCostUsdt", value)
            }
          />

          <NumberField
            label="Other annual addressable record-management cost"
            helper="Manual services, reconciliation and evidence assembly. Exclude systems DDC does not replace."
            value={inputs.otherAnnualAddressableCostUsdt}
            suffix="USDT/year"
            onChange={(value) =>
              update("otherAnnualAddressableCostUsdt", value)
            }
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
          Secondary Value
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          When something goes wrong
        </h2>

        <p className="mt-4 leading-7 text-slate-400">
          Investigation and reconstruction remain a secondary value category,
          not the primary economic case.
        </p>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Annual incidents/claims/quality investigations"
            helper="Used only for the secondary reconstruction-value calculation."
            value={inputs.annualInvestigations}
            suffix="/year"
            onChange={(value) => update("annualInvestigations", value)}
          />

          <NumberField
            label="Average people involved per investigation"
            helper="People normally required to reconstruct one case."
            value={inputs.investigationPeople}
            suffix="people"
            onChange={(value) => update("investigationPeople", value)}
          />

          <NumberField
            label="Average hours per person per investigation"
            helper="Current time spent per person on one investigation."
            value={inputs.investigationHoursPerPerson}
            suffix="hours"
            step={0.5}
            onChange={(value) =>
              update("investigationHoursPerPerson", value)
            }
          />
        </div>
      </section>
    </div>
  );
}
