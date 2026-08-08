"use client";

import NumberField from "../NumberField";
import type { AIInputs } from "../../../business-value-calculator/aiValueModel";

type Props = {
  inputs: AIInputs;
  update: <K extends keyof AIInputs>(
    key: K,
    value: AIInputs[K]
  ) => void;
};

export default function AICosts({
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
          AI governance record-handling cost
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Staff maintaining/checking/reconciling/retrieving governance records"
            helper="People performing addressable AI or digital governance record-handling work."
            value={inputs.recordHandlingStaff}
            suffix="people"
            onChange={(value) =>
              update("recordHandlingStaff", value)
            }
          />

          <NumberField
            label="Average hours per person per week"
            helper="Current manual model, decision, approval, evidence and governance-record workload."
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
            helper="Manual evidence assembly, reconciliation, audit preparation and governance coordination. Exclude systems DDC does not replace."
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
          When an automated decision requires review
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Annual AI / automated-decision reviews or investigations"
            helper="Used only for the secondary review and reconstruction calculation."
            value={inputs.annualReviewsInvestigations}
            suffix="/year"
            onChange={(value) =>
              update("annualReviewsInvestigations", value)
            }
          />

          <NumberField
            label="Average people involved per review"
            helper="People normally required to reconstruct one model output, decision or agent action."
            value={inputs.reviewPeople}
            suffix="people"
            onChange={(value) =>
              update("reviewPeople", value)
            }
          />

          <NumberField
            label="Average hours per person per review"
            helper="Current time spent per person reviewing or reconstructing one automated decision."
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
