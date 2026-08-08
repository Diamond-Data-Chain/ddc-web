"use client";

import NumberField from "../NumberField";
import type {
  InsuranceDataAvailability,
  InsuranceInputs,
} from "../../../business-value-calculator/insuranceValueModel";

type Props = {
  inputs: InsuranceInputs;
  update: <K extends keyof InsuranceInputs>(
    key: K,
    value: InsuranceInputs[K]
  ) => void;
};

const dataOptions: {
  value: InsuranceDataAvailability;
  label: string;
}[] = [
  { value: "policy-claims-api", label: "Policy / claims API" },
  { value: "claims-platform", label: "Claims management platform" },
  { value: "fraud-assessment-platform", label: "Fraud / assessment platform" },
  { value: "custom-legacy", label: "Custom / legacy integration" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function InsuranceScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Insurance Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Claims, policy and integration scope
      </h2>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual claims"
          helper="Claims within the assessed operational scope."
          value={inputs.annualClaims}
          suffix="/year"
          onChange={(value) => update("annualClaims", value)}
        />

        <NumberField
          label="Business units / operating entities"
          helper="Branches, claims centers or operational entities within scope."
          value={inputs.businessUnitsSites}
          suffix="units"
          onChange={(value) => update("businessUnitsSites", value)}
        />

        <NumberField
          label="Employees in relevant insurance operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) => update("relevantEmployees", value)}
        />

        <NumberField
          label="Automated claim-assessment streams"
          helper="Automated assessments, fraud checks or claim-decision event streams."
          value={inputs.automatedClaimAssessmentStreams}
          suffix="streams"
          onChange={(value) =>
            update("automatedClaimAssessmentStreams", value)
          }
        />

        <NumberField
          label="Claim workflows/processes"
          helper="Submission, evidence review, assessment, approval, payment and dispute workflows."
          value={inputs.claimWorkflows}
          suffix="workflows"
          onChange={(value) => update("claimWorkflows", value)}
        />

        <NumberField
          label="Traceable events per claim"
          helper="Submission, evidence, assessment, approval, payment and other selected DDC records."
          value={inputs.traceableEventsPerClaim}
          suffix="events"
          step={0.1}
          onChange={(value) =>
            update("traceableEventsPerClaim", value)
          }
        />

        <NumberField
          label="Additional annual policy / claim events"
          helper="Events not tied one-to-one to an individual claim."
          value={inputs.additionalPolicyClaimEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalPolicyClaimEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          Insurance systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Policy administration systems"
            helper="Policy lifecycle and administration platforms."
            value={inputs.policyAdminSystems}
            suffix="systems"
            onChange={(value) =>
              update("policyAdminSystems", value)
            }
          />

          <NumberField
            label="Claims management systems"
            helper="Claims intake, processing and settlement platforms."
            value={inputs.claimsManagementSystems}
            suffix="systems"
            onChange={(value) =>
              update("claimsManagementSystems", value)
            }
          />

          <NumberField
            label="Document-management systems"
            helper="Evidence, forms, correspondence and document repositories."
            value={inputs.documentManagementSystems}
            suffix="systems"
            onChange={(value) =>
              update("documentManagementSystems", value)
            }
          />

          <NumberField
            label="Fraud systems"
            helper="Fraud detection and investigation platforms."
            value={inputs.fraudSystems}
            suffix="systems"
            onChange={(value) => update("fraudSystems", value)}
          />

          <NumberField
            label="Assessment systems"
            helper="Damage, claim and expert-assessment platforms."
            value={inputs.assessmentSystems}
            suffix="systems"
            onChange={(value) =>
              update("assessmentSystems", value)
            }
          />

          <NumberField
            label="Payment systems"
            helper="Claim payment and settlement systems."
            value={inputs.paymentSystems}
            suffix="systems"
            onChange={(value) =>
              update("paymentSystems", value)
            }
          />

          <NumberField
            label="Workflow systems"
            helper="Approval and claim-processing workflow platforms."
            value={inputs.workflowSystems}
            suffix="systems"
            onChange={(value) =>
              update("workflowSystems", value)
            }
          />

          <NumberField
            label="Standard API systems"
            helper="Other insurance systems with documented APIs."
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
          How claim data is currently available
        </label>

        <select
          value={inputs.dataAvailability}
          onChange={(event) =>
            update(
              "dataAvailability",
              event.target.value as InsuranceDataAvailability
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
