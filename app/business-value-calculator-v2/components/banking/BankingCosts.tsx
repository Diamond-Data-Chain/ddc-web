"use client";

import NumberField from "../NumberField";
import type { BankingInputs } from "../../../business-value-calculator/bankingValueModel";

type Props = {
  inputs: BankingInputs;
  update: <K extends keyof BankingInputs>(
    key: K,
    value: BankingInputs[K]
  ) => void;
};

export default function BankingCosts({
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
          Financial record-handling cost
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Staff maintaining/checking/reconciling/retrieving financial records"
            helper="People performing addressable financial record-handling and governance work."
            value={inputs.recordHandlingStaff}
            suffix="people"
            onChange={(value) =>
              update("recordHandlingStaff", value)
            }
          />

          <NumberField
            label="Average hours per person per week"
            helper="Current manual transaction and governance workload."
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
            label="Other annual addressable governance cost"
            helper="Manual reconciliation, compliance preparation and evidence assembly. Exclude systems DDC does not replace."
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
          When a transaction requires investigation
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Annual AML / fraud / compliance reviews"
            helper="Used only for the secondary reconstruction-value calculation."
            value={inputs.annualInvestigationsReviews}
            suffix="/year"
            onChange={(value) =>
              update("annualInvestigationsReviews", value)
            }
          />

          <NumberField
            label="Average people involved per review"
            helper="People normally required to review or reconstruct one financial case."
            value={inputs.reviewPeople}
            suffix="people"
            onChange={(value) =>
              update("reviewPeople", value)
            }
          />

          <NumberField
            label="Average hours per person per review"
            helper="Current time spent per person reviewing or reconstructing one financial case."
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
