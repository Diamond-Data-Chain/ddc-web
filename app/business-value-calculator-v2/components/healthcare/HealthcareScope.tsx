"use client";

import NumberField from "../NumberField";
import type {
  HealthcareDeviceDataAvailability,
  HealthcareInputs,
} from "../../../business-value-calculator/healthcareValueModel";

type Props = {
  inputs: HealthcareInputs;
  update: <K extends keyof HealthcareInputs>(
    key: K,
    value: HealthcareInputs[K]
  ) => void;
};

const deviceOptions: {
  value: HealthcareDeviceDataAvailability;
  label: string;
}[] = [
  { value: "ehr-api", label: "EHR / API integration" },
  { value: "device-platform", label: "Existing medical-device platform" },
  { value: "existing-interface", label: "Existing device/interface integration" },
  { value: "new-capture", label: "New data capture required" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function HealthcareScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Healthcare Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Clinical and integration scope
      </h2>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual clinical cases or treatment episodes"
          helper="Patients, procedures, treatment episodes or other clinical processes within scope."
          value={inputs.annualClinicalCases}
          suffix="/year"
          onChange={(value) => update("annualClinicalCases", value)}
        />

        <NumberField
          label="Clinical sites"
          helper="Hospitals, clinics, departments or other deployment locations."
          value={inputs.clinicalSites}
          suffix="sites"
          onChange={(value) => update("clinicalSites", value)}
        />

        <NumberField
          label="Employees in relevant clinical operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) => update("relevantEmployees", value)}
        />

        <NumberField
          label="Medical devices providing relevant data"
          helper="Devices or device groups contributing treatment or operational evidence."
          value={inputs.medicalDevices}
          suffix="devices"
          onChange={(value) => update("medicalDevices", value)}
        />

        <NumberField
          label="Clinical workflows/processes to model"
          helper="Treatment, diagnostics, device use, record access, approvals and other relevant workflows."
          value={inputs.clinicalWorkflows}
          suffix="workflows"
          onChange={(value) => update("clinicalWorkflows", value)}
        />

        <NumberField
          label="Traceable events per clinical case"
          helper="Treatment changes, device use, tests, access events, approvals and other selected DDC records."
          value={inputs.traceableEventsPerCase}
          suffix="events"
          step={0.1}
          onChange={(value) => update("traceableEventsPerCase", value)}
        />

        <NumberField
          label="Additional annual clinical/device events"
          helper="Operational events not tied one-to-one to a clinical case."
          value={inputs.additionalClinicalDeviceEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalClinicalDeviceEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          Clinical systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="EHR systems"
            helper="Electronic health record systems."
            value={inputs.ehrSystems}
            suffix="systems"
            onChange={(value) => update("ehrSystems", value)}
          />

          <NumberField
            label="Laboratory systems"
            helper="Laboratory information and result systems."
            value={inputs.laboratorySystems}
            suffix="systems"
            onChange={(value) => update("laboratorySystems", value)}
          />

          <NumberField
            label="Imaging systems"
            helper="Imaging and diagnostic systems."
            value={inputs.imagingSystems}
            suffix="systems"
            onChange={(value) => update("imagingSystems", value)}
          />

          <NumberField
            label="Pharmacy systems"
            helper="Medication and pharmacy systems."
            value={inputs.pharmacySystems}
            suffix="systems"
            onChange={(value) => update("pharmacySystems", value)}
          />

          <NumberField
            label="Medical-device platforms"
            helper="Platforms aggregating device data."
            value={inputs.devicePlatforms}
            suffix="systems"
            onChange={(value) => update("devicePlatforms", value)}
          />

          <NumberField
            label="Standard API systems"
            helper="Other clinical or operational systems with documented APIs."
            value={inputs.standardApiSystems}
            suffix="systems"
            onChange={(value) => update("standardApiSystems", value)}
          />

          <NumberField
            label="Custom / legacy systems"
            helper="Custom or undocumented systems requiring additional integration effort."
            value={inputs.customLegacySystems}
            suffix="systems"
            onChange={(value) => update("customLegacySystems", value)}
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-semibold text-slate-100">
          How medical-device data is currently available
        </label>

        <select
          value={inputs.deviceDataAvailability}
          onChange={(event) =>
            update(
              "deviceDataAvailability",
              event.target.value as HealthcareDeviceDataAvailability
            )
          }
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-400/70"
        >
          {deviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
