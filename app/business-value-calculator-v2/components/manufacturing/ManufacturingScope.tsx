"use client";

import NumberField from "../NumberField";
import type {
  MachineDataAvailability,
  ManufacturingInputs,
} from "../../../business-value-calculator/manufacturingValueModel";

type Props = {
  inputs: ManufacturingInputs;
  update: <K extends keyof ManufacturingInputs>(
    key: K,
    value: ManufacturingInputs[K]
  ) => void;
};

const machineOptions: {
  value: MachineDataAvailability;
  label: string;
}[] = [
  {
    value: "mes-api",
    label: "MES / ERP / API",
  },
  {
    value: "plc-interface",
    label: "PLC / industrial interface",
  },
  {
    value: "existing-sensors",
    label: "Existing sensors",
  },
  {
    value: "new-capture",
    label: "New capture hardware required",
  },
  {
    value: "mixed-unsure",
    label: "Mixed / unsure",
  },
];

export default function ManufacturingScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Manufacturing Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Production and integration scope
      </h2>

      <p className="mt-4 max-w-4xl leading-7 text-slate-400">
        Enter the operational scale and the systems, machines and workflows
        that would contribute records to DDC.
      </p>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual production units"
          helper="Used for product-lifecycle record volume."
          value={inputs.annualProductionUnits}
          suffix="/year"
          onChange={(value) => update("annualProductionUnits", value)}
        />

        <NumberField
          label="Production sites"
          helper="Adds site deployment/configuration workload."
          value={inputs.productionSites}
          suffix="sites"
          onChange={(value) => update("productionSites", value)}
        />

        <NumberField
          label="Employees in relevant operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) => update("relevantEmployees", value)}
        />

        <NumberField
          label="Machines/devices that should provide data"
          helper="Defines machine and data-source scope. Machine count does not automatically equal new-sensor count."
          value={inputs.machinesDevices}
          suffix="devices"
          onChange={(value) => update("machinesDevices", value)}
        />

        <NumberField
          label="Operational workflows/processes to model"
          helper="Production, inspection, packaging, maintenance and other operational workflows."
          value={inputs.operationalWorkflows}
          suffix="workflows"
          onChange={(value) => update("operationalWorkflows", value)}
        />

        <NumberField
          label="Traceable events per produced unit"
          helper="Component installation, process completion, QC/test, packaging and other selected registration events."
          value={inputs.traceableEventsPerUnit}
          suffix="events"
          step={0.1}
          onChange={(value) => update("traceableEventsPerUnit", value)}
        />

        <NumberField
          label="Additional annual machine/quality/maintenance events"
          helper="Events not tied one-to-one to production units."
          value={inputs.additionalOperationalEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalOperationalEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold text-white">
          Enterprise systems to connect
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Enter the systems within the assessed scope. Standard and custom
          connectors generate different implementation workloads.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="ERP systems"
            helper="Enterprise resource planning systems."
            value={inputs.erpSystems}
            suffix="systems"
            onChange={(value) => update("erpSystems", value)}
          />

          <NumberField
            label="MES systems"
            helper="Manufacturing execution systems."
            value={inputs.mesSystems}
            suffix="systems"
            onChange={(value) => update("mesSystems", value)}
          />

          <NumberField
            label="QMS systems"
            helper="Quality-management systems."
            value={inputs.qmsSystems}
            suffix="systems"
            onChange={(value) => update("qmsSystems", value)}
          />

          <NumberField
            label="WMS systems"
            helper="Warehouse-management systems."
            value={inputs.wmsSystems}
            suffix="systems"
            onChange={(value) => update("wmsSystems", value)}
          />

          <NumberField
            label="CMMS systems"
            helper="Maintenance-management systems."
            value={inputs.cmmsSystems}
            suffix="systems"
            onChange={(value) => update("cmmsSystems", value)}
          />

          <NumberField
            label="Standard API systems"
            helper="Other systems with documented standard APIs."
            value={inputs.standardApiSystems}
            suffix="systems"
            onChange={(value) => update("standardApiSystems", value)}
          />

          <NumberField
            label="Custom / legacy systems"
            helper="Custom, legacy or undocumented systems requiring additional integration work."
            value={inputs.customLegacySystems}
            suffix="systems"
            onChange={(value) => update("customLegacySystems", value)}
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-semibold text-slate-100">
          How machine/device data is currently available
        </label>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          Existing machine data is reused whenever available. DDC does not
          assume one new sensor per machine.
        </p>

        <select
          value={inputs.machineDataAvailability}
          onChange={(event) =>
            update(
              "machineDataAvailability",
              event.target.value as MachineDataAvailability
            )
          }
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-amber-400/70"
        >
          {machineOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
