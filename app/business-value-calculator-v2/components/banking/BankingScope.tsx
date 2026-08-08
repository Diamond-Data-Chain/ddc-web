"use client";

import NumberField from "../NumberField";
import type {
  BankingDataAvailability,
  BankingInputs,
} from "../../../business-value-calculator/bankingValueModel";

type Props = {
  inputs: BankingInputs;
  update: <K extends keyof BankingInputs>(
    key: K,
    value: BankingInputs[K]
  ) => void;
};

const dataOptions: {
  value: BankingDataAvailability;
  label: string;
}[] = [
  { value: "core-banking-api", label: "Core banking / API" },
  { value: "transaction-monitoring", label: "Transaction monitoring platform" },
  { value: "risk-fraud-platform", label: "Risk / fraud platform" },
  { value: "custom-legacy", label: "Custom / legacy integration" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function BankingScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        Banking & Financial Services Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Financial operations and governance scope
      </h2>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual financial transactions"
          helper="Transactions, payment events and financial operations within scope."
          value={inputs.annualTransactions}
          suffix="/year"
          onChange={(value) => update("annualTransactions", value)}
        />

        <NumberField
          label="Branches / business units"
          helper="Branches, offices or operational entities within scope."
          value={inputs.bankingEntitiesSites}
          suffix="sites"
          onChange={(value) => update("bankingEntitiesSites", value)}
        />

        <NumberField
          label="Employees in relevant banking operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) => update("relevantEmployees", value)}
        />

        <NumberField
          label="Automated decision / transaction streams"
          helper="Transaction streams, automated decisions or financial event sources."
          value={inputs.automatedDecisionStreams}
          suffix="streams"
          onChange={(value) =>
            update("automatedDecisionStreams", value)
          }
        />

        <NumberField
          label="Governance workflows/processes"
          helper="Approvals, AML, KYC, fraud review, risk and governance workflows."
          value={inputs.governanceWorkflows}
          suffix="workflows"
          onChange={(value) => update("governanceWorkflows", value)}
        />

        <NumberField
          label="Traceable events per transaction"
          helper="Approvals, recommendations, reviews, decisions and governance events."
          value={inputs.traceableEventsPerTransaction}
          suffix="events"
          step={0.1}
          onChange={(value) =>
            update("traceableEventsPerTransaction", value)
          }
        />

        <NumberField
          label="Additional annual review / approval events"
          helper="Events not tied one-to-one to an individual transaction."
          value={inputs.additionalReviewApprovalEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalReviewApprovalEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          Financial systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Core banking systems"
            helper="Core banking platforms."
            value={inputs.coreBankingSystems}
            suffix="systems"
            onChange={(value) => update("coreBankingSystems", value)}
          />

          <NumberField
            label="Transaction monitoring systems"
            helper="Transaction monitoring platforms."
            value={inputs.transactionMonitoringSystems}
            suffix="systems"
            onChange={(value) => update("transactionMonitoringSystems", value)}
          />

          <NumberField
            label="AML / KYC systems"
            helper="AML and KYC platforms."
            value={inputs.amlKycSystems}
            suffix="systems"
            onChange={(value) =>
              update("amlKycSystems", value)
            }
          />

          <NumberField
            label="Fraud systems"
            helper="Fraud detection platforms."
            value={inputs.fraudSystems}
            suffix="systems"
            onChange={(value) =>
              update("fraudSystems", value)
            }
          />

          <NumberField
            label="Risk engines"
            helper="Risk scoring and decision engines."
            value={inputs.riskEngines}
            suffix="systems"
            onChange={(value) =>
              update("riskEngines", value)
            }
          />

          <NumberField
            label="Approval workflow systems"
            helper="Approval, authorization and decision-workflow platforms."
            value={inputs.approvalWorkflowSystems}
            suffix="systems"
            onChange={(value) =>
              update("approvalWorkflowSystems", value)
            }
          />

          <NumberField
            label="Model registry systems"
            helper="Model version, automated-decision and governance registries."
            value={inputs.modelRegistrySystems}
            suffix="systems"
            onChange={(value) =>
              update("modelRegistrySystems", value)
            }
          />

          <NumberField
            label="Standard API systems"
            helper="Other banking systems with documented APIs."
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
          How transaction data is currently available
        </label>

        <select
          value={inputs.dataAvailability}
          onChange={(event) =>
            update(
              "dataAvailability",
              event.target.value as BankingDataAvailability
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
