"use client";

import NumberField from "../NumberField";
import type { TransportInputs } from "../../../business-value-calculator/transportValueModel";

type Props = {
  inputs: TransportInputs;
  update: <K extends keyof TransportInputs>(
    key: K,
    value: TransportInputs[K]
  ) => void;
};

export default function TransportCosts({
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
          Logistics record-handling cost
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Staff maintaining/checking/reconciling/retrieving shipment records"
            helper="People performing addressable logistics record-handling work."
            value={inputs.recordHandlingStaff}
            suffix="people"
            onChange={(value) =>
              update("recordHandlingStaff", value)
            }
          />

          <NumberField
            label="Average hours per person per week"
            helper="Current manual shipment, delivery and fleet-record workload."
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
            label="Other annual addressable logistics record-management cost"
            helper="Manual coordination, reconciliation, evidence preparation and dispute support. Exclude systems DDC does not replace."
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
          When a delivery or shipment is disputed
        </h2>

        <div className="mt-8 grid gap-7">
          <NumberField
            label="Annual delivery disputes or transport investigations"
            helper="Used only for the secondary reconstruction-value calculation."
            value={inputs.annualDeliveryDisputes}
            suffix="/year"
            onChange={(value) =>
              update("annualDeliveryDisputes", value)
            }
          />

          <NumberField
            label="Average people involved per dispute"
            helper="People normally required to reconstruct one shipment or delivery."
            value={inputs.disputePeople}
            suffix="people"
            onChange={(value) =>
              update("disputePeople", value)
            }
          />

          <NumberField
            label="Average hours per person per dispute"
            helper="Current time spent per person reconstructing one transport case."
            value={inputs.disputeHoursPerPerson}
            suffix="hours"
            step={0.5}
            onChange={(value) =>
              update("disputeHoursPerPerson", value)
            }
          />
        </div>
      </section>
    </div>
  );
}
