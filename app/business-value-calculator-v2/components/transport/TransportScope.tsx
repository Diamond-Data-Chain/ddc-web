"use client";

import NumberField from "../NumberField";
import type {
  TransportDataAvailability,
  TransportInputs,
} from "../../../business-value-calculator/transportValueModel";

type Props = {
  inputs: TransportInputs;
  update: <K extends keyof TransportInputs>(
    key: K,
    value: TransportInputs[K]
  ) => void;
};

const dataOptions: {
  value: TransportDataAvailability;
  label: string;
}[] = [
  { value: "tms-api", label: "TMS / API integration" },
  { value: "telematics", label: "Existing telematics platform" },
  { value: "iot-platform", label: "Existing IoT platform" },
  { value: "new-onboard-devices", label: "New onboard devices required" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function TransportScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Transport & Logistics Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Shipment, fleet and integration scope
      </h2>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual shipments or trips"
          helper="Shipments, deliveries, routes or transport jobs within scope."
          value={inputs.annualShipmentsTrips}
          suffix="/year"
          onChange={(value) => update("annualShipmentsTrips", value)}
        />

        <NumberField
          label="Logistics sites / terminals"
          helper="Warehouses, hubs, depots, terminals or distribution centers within scope."
          value={inputs.logisticsSites}
          suffix="sites"
          onChange={(value) => update("logisticsSites", value)}
        />

        <NumberField
          label="Employees in relevant logistics operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) => update("relevantEmployees", value)}
        />

        <NumberField
          label="Vehicles, trailers or containers providing data"
          helper="Fleet assets contributing route, condition, delivery or maintenance evidence."
          value={inputs.vehiclesTrailersContainers}
          suffix="assets"
          onChange={(value) =>
            update("vehiclesTrailersContainers", value)
          }
        />

        <NumberField
          label="Logistics workflows/processes to model"
          helper="Pickup, handoff, transport, delivery, temperature, fuel, maintenance and related workflows."
          value={inputs.logisticsWorkflows}
          suffix="workflows"
          onChange={(value) => update("logisticsWorkflows", value)}
        />

        <NumberField
          label="Traceable events per shipment/trip"
          helper="Pickup, route checkpoint, handoff, condition, delivery confirmation and other selected DDC records."
          value={inputs.traceableEventsPerShipment}
          suffix="events"
          step={0.1}
          onChange={(value) =>
            update("traceableEventsPerShipment", value)
          }
        />

        <NumberField
          label="Additional annual fleet/maintenance/condition events"
          helper="Events not tied one-to-one to a shipment or trip."
          value={inputs.additionalFleetEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalFleetEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          Logistics systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="TMS systems"
            helper="Transport-management systems."
            value={inputs.tmsSystems}
            suffix="systems"
            onChange={(value) => update("tmsSystems", value)}
          />

          <NumberField
            label="WMS systems"
            helper="Warehouse-management systems."
            value={inputs.wmsSystems}
            suffix="systems"
            onChange={(value) => update("wmsSystems", value)}
          />

          <NumberField
            label="Fleet-management systems"
            helper="Fleet scheduling, service and operational systems."
            value={inputs.fleetManagementSystems}
            suffix="systems"
            onChange={(value) =>
              update("fleetManagementSystems", value)
            }
          />

          <NumberField
            label="GPS / telematics systems"
            helper="Vehicle tracking and telematics platforms."
            value={inputs.gpsTelematicsSystems}
            suffix="systems"
            onChange={(value) =>
              update("gpsTelematicsSystems", value)
            }
          />

          <NumberField
            label="Temperature / condition monitoring systems"
            helper="Cold-chain, sensor and cargo-condition platforms."
            value={inputs.temperatureMonitoringSystems}
            suffix="systems"
            onChange={(value) =>
              update("temperatureMonitoringSystems", value)
            }
          />

          <NumberField
            label="Standard API systems"
            helper="Other logistics or operational systems with documented APIs."
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
          How fleet/asset data is currently available
        </label>

        <select
          value={inputs.dataAvailability}
          onChange={(event) =>
            update(
              "dataAvailability",
              event.target.value as TransportDataAvailability
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
