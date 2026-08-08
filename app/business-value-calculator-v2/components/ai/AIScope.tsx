"use client";

import NumberField from "../NumberField";
import type {
  AIDataAvailability,
  AIInputs,
} from "../../../business-value-calculator/aiValueModel";

type Props = {
  inputs: AIInputs;
  update: <K extends keyof AIInputs>(
    key: K,
    value: AIInputs[K]
  ) => void;
};

const dataOptions: {
  value: AIDataAvailability;
  label: string;
}[] = [
  { value: "model-api", label: "Model / API integration" },
  { value: "agent-platform", label: "Agent platform" },
  { value: "mlops-platform", label: "MLOps platform" },
  { value: "event-logging", label: "Existing event / observability logging" },
  { value: "custom-legacy", label: "Custom / legacy integration" },
  { value: "mixed-unsure", label: "Mixed / unsure" },
];

export default function AIScope({
  inputs,
  update,
}: Props) {
  return (
    <section className="rounded-[28px] border border-amber-500/30 bg-slate-900/65 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
        AI & Digital Systems Scope
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Model, agent and governance scope
      </h2>

      <p className="mt-4 max-w-4xl leading-7 text-slate-400">
        Define the automated decisions, models, agents and governance systems whose history should become independently verifiable through DDC.
      </p>

      <div className="mt-8 grid gap-7 md:grid-cols-2">
        <NumberField
          label="Annual automated decisions / outputs"
          helper="Recommendations, model outputs, agent actions or automated decisions within scope."
          value={inputs.annualAutomatedDecisions}
          suffix="/year"
          onChange={(value) =>
            update("annualAutomatedDecisions", value)
          }
        />

        <NumberField
          label="Operational environments"
          helper="Production environments, business units, platforms or deployment domains within scope."
          value={inputs.operationalEnvironments}
          suffix="environments"
          onChange={(value) =>
            update("operationalEnvironments", value)
          }
        />

        <NumberField
          label="Employees in relevant AI / digital operations"
          helper="Scale and context only; not a standalone price multiplier."
          value={inputs.relevantEmployees}
          suffix="people"
          onChange={(value) =>
            update("relevantEmployees", value)
          }
        />

        <NumberField
          label="Models / agents in scope"
          helper="Production models, AI agents or automated decision components contributing governance records."
          value={inputs.modelsAgents}
          suffix="models/agents"
          onChange={(value) =>
            update("modelsAgents", value)
          }
        />

        <NumberField
          label="Governance workflows/processes"
          helper="Model approval, release, escalation, human review, policy enforcement and agent-control workflows."
          value={inputs.governanceWorkflows}
          suffix="workflows"
          onChange={(value) =>
            update("governanceWorkflows", value)
          }
        />

        <NumberField
          label="Traceable events per automated decision"
          helper="Input context references, model/version use, recommendation, approval, override and other selected DDC records."
          value={inputs.traceableEventsPerDecision}
          suffix="events"
          step={0.1}
          onChange={(value) =>
            update("traceableEventsPerDecision", value)
          }
        />

        <NumberField
          label="Additional annual model / policy events"
          helper="Model releases, policy changes, prompt/template versions, configuration changes and events not tied one-to-one to a decision."
          value={inputs.additionalModelPolicyEventsPerYear}
          suffix="/year"
          onChange={(value) =>
            update("additionalModelPolicyEventsPerYear", value)
          }
        />
      </div>

      <div className="mt-9 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
        <h3 className="text-lg font-semibold">
          AI and digital systems to connect
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Model registry systems"
            helper="Model version, release and lifecycle registries."
            value={inputs.modelRegistrySystems}
            suffix="systems"
            onChange={(value) =>
              update("modelRegistrySystems", value)
            }
          />

          <NumberField
            label="MLOps systems"
            helper="Training, deployment, monitoring and lifecycle platforms."
            value={inputs.mlopsSystems}
            suffix="systems"
            onChange={(value) =>
              update("mlopsSystems", value)
            }
          />

          <NumberField
            label="Agent platforms"
            helper="AI-agent orchestration and tool-execution platforms."
            value={inputs.agentPlatforms}
            suffix="systems"
            onChange={(value) =>
              update("agentPlatforms", value)
            }
          />

          <NumberField
            label="Observability systems"
            helper="Logs, traces, event monitoring and operational telemetry."
            value={inputs.observabilitySystems}
            suffix="systems"
            onChange={(value) =>
              update("observabilitySystems", value)
            }
          />

          <NumberField
            label="Approval workflow systems"
            helper="Human review, authorization and escalation workflows."
            value={inputs.approvalWorkflowSystems}
            suffix="systems"
            onChange={(value) =>
              update("approvalWorkflowSystems", value)
            }
          />

          <NumberField
            label="Policy / governance systems"
            helper="Policy, controls, compliance and AI-governance platforms."
            value={inputs.policyGovernanceSystems}
            suffix="systems"
            onChange={(value) =>
              update("policyGovernanceSystems", value)
            }
          />

          <NumberField
            label="Data platforms"
            helper="Data, feature, retrieval or evidence-source platforms used by automated systems."
            value={inputs.dataPlatforms}
            suffix="systems"
            onChange={(value) =>
              update("dataPlatforms", value)
            }
          />

          <NumberField
            label="Standard API systems"
            helper="Other digital systems with documented APIs."
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
          How AI / decision-event data is currently available
        </label>

        <select
          value={inputs.dataAvailability}
          onChange={(event) =>
            update(
              "dataAvailability",
              event.target.value as AIDataAvailability
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
