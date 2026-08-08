"use client";

import NumberField from "../NumberField";
import type { InsuranceInputs } from "../../../business-value-calculator/insuranceValueModel";

type Props = {
  inputs: InsuranceInputs;
  update: <K extends keyof InsuranceInputs>(
    key: K,
    value: InsuranceInputs[K]
  ) => void;
};

export default function InsuranceCosts({
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
          Claim record-handling cost
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Staff maintaining/checking/reconciling/retrieving claim records"
            helper="People performing addressable claim record-handling work."
            value={inputs.recordHandlingStaff}
            suffix="people"
            onChange={(value) =>
              update("recordHandlingStaff", value)
            }
          />

          <NumberField
            label="Average hours per person per week"
            helper="Current manual claim, evidence and policy-record workload."
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
            label="Other annual addressable claim-management cost"
            helper="Manual reconciliation, evidence preparation, coordination and claim support. Exclude systems DDC does not replace."
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
          When a claim is disputed or reviewed
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Annual claim disputes / reviews"
            helper="Used only for the secondary review and reconstruction calculation."
            value={inputs.annualClaimDisputesReviews}
            suffix="/year"
            onChange={(value) =>
              update("annualClaimDisputesReviews", value)
            }
          />

          <NumberField
            label="Average people involved per review"
            helper="People normally required to review or reconstruct one claim."
            value={inputs.reviewPeople}
            suffix="people"
            onChange={(value) => update("reviewPeople", value)}
          />

          <NumberField
            label="Average hours per person per review"
            helper="Current time spent per person reviewing or reconstructing one claim."
            value={inputs.reviewHoursPerPerson}
            suffix="hours"
            step={0.5}
            onChange={(value) =>
              update("reviewHoursPerPerson", value)
            }
          />
        </div>
      </section>
    </div>
  );
}
