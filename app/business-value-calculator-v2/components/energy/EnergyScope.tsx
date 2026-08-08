"use client";

import NumberField from "../NumberField";
import type {
  EnergyDataAvailability,
  EnergyInputs,
} from "../../../business-value-calculator/energyValueModel";

type Props = {
  inputs: EnergyInputs;
  update: <K extends keyof EnergyInputs>(
    key: K,
    value: EnergyInputs[K]
  ) => void;
};

const dataOptions: {
  value: EnergyDataAvailability;
  label: string;
}[] = [
  { value: "scada-api", label: "SCADA / API integration" },
  { value: "iot-platform", label: "Existing IoT / sensor platform" },
  { value: "meter-platform", label: "Meter-data platform" },
  { value: "existing-interface", label: "Existing industrial interface" },
  { value: "new-capture", label: "New data capture required" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function EnergyScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Energy & Utilities Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Asset, grid and integration scope
      </h2>

      <p className="mt-4 max-w-4xl leading-7 text-slate-400">
        Define the operational assets, systems and events whose history should
        become independently verifiable through DDC.
      </p>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual operational events"
          helper="Grid, meter, asset, maintenance, inspection, outage or recovery events within scope."
          value={inputs.annualOperationalEvents}
          suffix="/year"
          onChange={(value) =>
            update("annualOperationalEvents", value)
          }
        />

        <NumberField
          label="Operational sites / facilities"
          helper="Plants, substations, control centers, service areas or other operational locations."
          value={inputs.operationalSites}
          suffix="sites"
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
          label="Assets, meters or devices providing data"
          helper="Grid assets, meters, sensors, equipment or monitored devices contributing operational evidence."
          value={inputs.monitoredAssetsDevices}
          suffix="assets"
          onChange={(value) =>
            update("monitoredAssetsDevices", value)
          }
        />

        <NumberField
          label="Operational workflows/processes to model"
          helper="Maintenance, inspections, outages, switching, recovery, meter review and other operational workflows."
          value={inputs.operationalWorkflows}
          suffix="workflows"
          onChange={(value) =>
            update("operationalWorkflows", value)
          }
        />

        <NumberField
          label="Traceable events per operational event"
          helper="Approvals, state changes, measurements, inspections, maintenance actions and other selected DDC records."
          value={inputs.traceableEventsPerOperationalEvent}
          suffix="events"
          step={0.1}
          onChange={(value) =>
            update("traceableEventsPerOperationalEvent", value)
          }
        />

        <NumberField
          label="Additional annual asset / meter events"
          helper="Events not represented by the primary operational-event volume."
          value={inputs.additionalAssetMeterEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalAssetMeterEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          Energy and utility systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="SCADA systems"
            helper="Supervisory control and data-acquisition systems."
            value={inputs.scadaSystems}
            suffix="systems"
            onChange={(value) =>
              update("scadaSystems", value)
            }
          />

          <NumberField
            label="Asset-management systems"
            helper="Asset history, inspection and lifecycle-management platforms."
            value={inputs.assetManagementSystems}
            suffix="systems"
            onChange={(value) =>
              update("assetManagementSystems", value)
            }
          />

          <NumberField
            label="Meter-data systems"
            helper="Meter-data management and consumption-record platforms."
            value={inputs.meterDataSystems}
            suffix="systems"
            onChange={(value) =>
              update("meterDataSystems", value)
            }
          />

          <NumberField
            label="Outage-management systems"
            helper="Outage detection, restoration and incident-management platforms."
            value={inputs.outageManagementSystems}
            suffix="systems"
            onChange={(value) =>
              update("outageManagementSystems", value)
            }
          />

          <NumberField
            label="GIS systems"
            helper="Network, asset-location and infrastructure mapping systems."
            value={inputs.gisSystems}
            suffix="systems"
            onChange={(value) =>
              update("gisSystems", value)
            }
          />

          <NumberField
            label="Maintenance systems"
            helper="Maintenance planning, work-order and service-history systems."
            value={inputs.maintenanceSystems}
            suffix="systems"
            onChange={(value) =>
              update("maintenanceSystems", value)
            }
          />

          <NumberField
            label="IoT / sensor platforms"
            helper="Sensor, telemetry and operational-device platforms."
            value={inputs.iotSensorPlatforms}
            suffix="systems"
            onChange={(value) =>
              update("iotSensorPlatforms", value)
            }
          />

          <NumberField
            label="Standard API systems"
            helper="Other energy or utility systems with documented APIs."
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
          How asset / meter data is currently available
        </label>

        <select
          value={inputs.dataAvailability}
          onChange={(event) =>
            update(
              "dataAvailability",
              event.target.value as EnergyDataAvailability
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
