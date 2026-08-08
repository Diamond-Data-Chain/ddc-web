"use client";

import NumberField from "../NumberField";
import type {
  OtherDataAvailability,
  OtherInputs,
} from "../../../business-value-calculator/otherValueModel";

type Props = {
  inputs: OtherInputs;
  update: <K extends keyof OtherInputs>(
    key: K,
    value: OtherInputs[K]
  ) => void;
};

const dataOptions: {
  value: OtherDataAvailability;
  label: string;
}[] = [
  { value: "existing-api", label: "Existing API integration" },
  { value: "operational-platform", label: "Existing operational platform" },
  { value: "event-logging", label: "Existing event / logging platform" },
  { value: "custom-integration", label: "Custom integration" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function OtherScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Other Organization Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Custom operational and integration scope
      </h2>

      <p className="mt-4 max-w-4xl leading-7 text-slate-400">
        Define the operational records, systems, assets and workflows whose history should become independently verifiable through DDC.
      </p>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual operational records"
          helper="Primary operational records or events within the assessed scope."
          value={inputs.annualOperationalRecords}
          suffix="/year"
          onChange={(value) =>
            update("annualOperationalRecords", value)
          }
        />

        <NumberField
          label="Operational sites / business units"
          helper="Locations, departments, entities or operational domains within scope."
          value={inputs.operationalSites}
          suffix="sites/units"
          onChange={(value) =>
            update("operationalSites", value)
          }
        />

        <NumberField
          label="Employees in relevant operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) =>
            update("relevantEmployees", value)
          }
        />

        <NumberField
          label="Operational assets / data sources"
          helper="Assets, applications, devices or other sources contributing operational evidence."
          value={inputs.operationalAssets}
          suffix="sources"
          onChange={(value) =>
            update("operationalAssets", value)
          }
        />

        <NumberField
          label="Operational workflows/processes to model"
          helper="Processes, approvals, handoffs, changes and other workflows relevant to the assessed scope."
          value={inputs.operationalWorkflows}
          suffix="workflows"
          onChange={(value) =>
            update("operationalWorkflows", value)
          }
        />

        <NumberField
          label="Traceable events per operational record"
          helper="State changes, approvals, evidence references, actions and other selected DDC records."
          value={inputs.traceableEventsPerRecord}
          suffix="events"
          step={0.1}
          onChange={(value) =>
            update("traceableEventsPerRecord", value)
          }
        />

        <NumberField
          label="Additional annual operational events"
          helper="Events not represented by the primary operational-record volume."
          value={inputs.additionalOperationalEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalOperationalEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          Operational systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Primary operational systems"
            helper="Core systems used by the assessed process."
            value={inputs.primaryOperationalSystems}
            suffix="systems"
            onChange={(value) =>
              update("primaryOperationalSystems", value)
            }
          />

          <NumberField
            label="Document-management systems"
            helper="Document, evidence and content repositories."
            value={inputs.documentManagementSystems}
            suffix="systems"
            onChange={(value) =>
              update("documentManagementSystems", value)
            }
          />

          <NumberField
            label="Workflow systems"
            helper="Approval, case-management and process-workflow platforms."
            value={inputs.workflowSystems}
            suffix="systems"
            onChange={(value) =>
              update("workflowSystems", value)
            }
          />

          <NumberField
            label="Data platforms"
            helper="Databases, data platforms, warehouses or evidence-source platforms."
            value={inputs.dataPlatforms}
            suffix="systems"
            onChange={(value) =>
              update("dataPlatforms", value)
            }
          />

          <NumberField
            label="IoT / device platforms"
            helper="Device, telemetry or sensor platforms where applicable."
            value={inputs.iotPlatforms}
            suffix="systems"
            onChange={(value) =>
              update("iotPlatforms", value)
            }
          />

          <NumberField
            label="Standard API systems"
            helper="Other systems with documented APIs."
            value={inputs.standardApiSystems}
            suffix="systems"
            onChange={(value) =>
              update("standardApiSystems", value)
            }
          />

          <NumberField
            label="Custom / legacy systems"
            helper="Custom or undocumented systems requiring additional integration effort."
            value={inputs.customLegacySystems}
            suffix="systems"
            onChange={(value) =>
              update("customLegacySystems", value)
            }
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-semibold text-slate-100">
          How operational data is currently available
        </label>

        <select
          value={inputs.dataAvailability}
          onChange={(event) =>
            update(
              "dataAvailability",
              event.target.value as OtherDataAvailability
            )
          }
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400/70"
        >
          {dataOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
