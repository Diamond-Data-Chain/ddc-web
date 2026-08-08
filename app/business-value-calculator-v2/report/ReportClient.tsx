"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type StoredAssessment = {
  savedAt: number;
  data: {
    assessmentType: string;
    branch: string;
    configurationVersion: string;
    generatedAt: string;
    inputs: any;
    results: any;
  };
};

const money = (value: number) =>
  `$${Math.round(Number.isFinite(value) ? value : 0).toLocaleString("en-US")}`;

const number = (value: number) =>
  Math.round(Number.isFinite(value) ? value : 0).toLocaleString("en-US");

export default function ReportClient() {
  const searchParams = useSearchParams();
  const storageKey = searchParams.get("key") || "";

  const [stored, setStored] = useState<StoredAssessment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!storageKey) {
      setError("Assessment reference is missing.");
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);

      if (!raw) {
        setError("Assessment data could not be found.");
        return;
      }

      const parsed = JSON.parse(raw) as StoredAssessment;

      if (!parsed?.data?.results) {
        throw new Error("Invalid assessment");
      }

      setStored(parsed);

      document.title =
        `DDC-${parsed.data.branch}-Operational-Value-Assessment`;
    } catch (e) {
      console.error(e);
      setError("Assessment data is invalid.");
    }
  }, [storageKey]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          <h1 className="text-2xl font-bold">Executive report unavailable</h1>
          <p className="mt-4">{error}</p>
        </div>
      </main>
    );
  }

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        Preparing executive report…
      </main>
    );
  }

  const { data } = stored;
  const { inputs, results } = data;

  const isHealthcare = data.branch === "Healthcare";
  const isTransport = data.branch === "Transport & Logistics";
  const isBanking = data.branch === "Banking & Financial Services";
  const isInsurance = data.branch === "Insurance";
  const isEnergy = data.branch === "Energy & Utilities";
  const isAI = data.branch === "AI & Digital Systems";
  const isOther = data.branch === "Other";

  const siteCount =
    results.scope.productionSites ??
    results.scope.clinicalSites ??
    results.scope.logisticsSites ??
    results.scope.bankingEntitiesSites ??
    results.scope.businessUnitsSites ??
    results.scope.operationalSites ??
    results.scope.operationalEnvironments ??
    0;

  const sourceGroupCount =
    results.scope.machineIntegrationGroups ??
    results.scope.deviceIntegrationGroups ??
    results.scope.vehicleIntegrationGroups ??
    results.scope.integrationGroups ??
    0;

  const reconstructionCost =
    results.currentCost.investigationLaborCostUsdt ??
    results.currentCost.reviewLaborCostUsdt ??
    results.currentCost.disputeLaborCostUsdt ??
    results.currentCost.reviewLaborCostUsdt ??
    0;

  const secondaryReduction =
    results.assumptions.investigationLaborReductionPercent ??
    results.assumptions.reviewLaborReductionPercent ??
    results.assumptions.disputeLaborReductionPercent ??
    results.assumptions.reviewLaborReductionPercent ??
    0;

  return (
    <main className="min-h-screen bg-slate-200 pb-16 text-slate-950 print:bg-white print:pb-0">
      <div className="sticky top-0 z-50 border-b border-slate-300 bg-white px-5 py-4 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-5xl justify-between gap-4">
          <div>
            <div className="font-semibold">
              DDC Operational Value Assessment
            </div>
            <div className="text-sm text-slate-500">
              {data.branch} · Assumptions v{data.configurationVersion}
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Save as PDF
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white shadow-xl print:max-w-none print:shadow-none">
        <section className="report-page min-h-[297mm] p-12">
          <div className="text-xs font-bold tracking-[0.28em] text-amber-700">
            DIAMOND DATA CHAIN
          </div>

          <h1 className="mt-8 text-4xl font-bold">
            DDC Operational Value Assessment
          </h1>

          <p className="mt-3 text-xl text-slate-600">
            Executive Assessment — {data.branch}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-100 p-5">
              <div className="text-xs uppercase text-slate-500">
                Configuration
              </div>
              <div className="mt-1 font-semibold">
                Assumptions v{data.configurationVersion}
              </div>
            </div>

            <div className="rounded-xl bg-slate-100 p-5">
              <div className="text-xs uppercase text-slate-500">
                Generated
              </div>
              <div className="mt-1 font-semibold">
                {new Date(data.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <h2 className="mt-10 text-2xl font-bold">Executive Summary</h2>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <Metric
              label="Current addressable operational cost"
              value={`${money(
                results.currentCost.totalAddressableOperationalCostUsdt
              )} / year`}
            />

            <Metric
              label="One-time DDC implementation cost"
              value={money(
                results.implementation.estimatedImplementationCostUsdt
              )}
            />

            <Metric
              label="Annual DDC operating cost"
              value={`${money(
                results.annualOperations.estimatedAnnualOperatingCostUsdt
              )} / year`}
            />

            <Metric
              label="Recurring annual benefit"
              value={`${money(
                results.value.recurringAnnualBenefitUsdt
              )} / year`}
            />

            <Metric
              label="First-year net value"
              value={money(results.value.firstYearNetValueUsdt)}
            />

            <Metric
              label="Estimated payback"
              value={
                results.value.paybackMonths > 0
                  ? `${results.value.paybackMonths.toFixed(1)} months`
                  : "Not established"
              }
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold">Implementation Scope</h2>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Line
              label={
                isHealthcare
                  ? "Clinical sites"
                  : isTransport
                  ? "Logistics sites / terminals"
                  : isBanking
                  ? "Branches / business units"
                  : isInsurance
                  ? "Business units / operating entities"
                  : isEnergy
                  ? "Operational sites / facilities"
                  : isAI
                  ? "Operational environments"
                  : isOther
                  ? "Operational sites / business units"
                  : "Production sites"
              }
              value={siteCount}
            />
            <Line
              label="Systems / connectors"
              value={
                results.scope.standardConnectors +
                results.scope.customConnectors
              }
            />
            <Line
              label={
                isHealthcare
                  ? "Medical-device integration groups"
                  : isTransport
                  ? "Fleet / asset integration groups"
                  : isBanking
                  ? "Transaction / decision integration groups"
                  : isInsurance
                  ? "Claim / assessment integration groups"
                  : isEnergy
                  ? "Asset / meter integration groups"
                  : isAI
                  ? "Model / agent integration groups"
                  : isOther
                  ? "Operational integration groups"
                  : "Machine / device groups"
              }
              value={sourceGroupCount}
            />
            <Line label="Workflows" value={results.scope.workflows} />
            <Line
              label="DDC records / year"
              value={number(results.scope.annualRegistrationTransactions)}
            />
            <Line
              label="DDC network requirement"
              value={`${number(results.annualOperations.networkDdc)} DDC/year`}
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold">
            Implementation Team & Effort
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            {results.implementation.roleBreakdown
              .filter((role: any) => role.hours > 0)
              .map((role: any) => (
                <div
                  key={role.role}
                  className="grid grid-cols-[1fr_90px_90px_120px] border-b border-slate-200 px-4 py-3 text-sm last:border-b-0"
                >
                  <span>{role.label}</span>
                  <span>{number(role.hours)} h</span>
                  <span>{role.personMonths.toFixed(2)} PM</span>
                  <span className="text-right">
                    {money(role.laborCostUsdt)}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-4 text-right font-semibold">
            Total: {results.implementation.totalPersonMonths.toFixed(1)} person-months
          </div>
        </section>

        <section className="report-page min-h-[297mm] p-12">
          <h2 className="text-2xl font-bold">Operational Cost Basis</h2>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Line
              label="Record-handling labor"
              value={money(results.currentCost.recordHandlingLaborCostUsdt)}
            />
            <Line
              label="Other addressable costs"
              value={money(results.currentCost.otherAddressableCostUsdt)}
            />
            <Line
              label={
                isHealthcare
                  ? "Clinical-review labor"
                  : isTransport
                  ? "Dispute-resolution labor"
                  : isBanking
                  ? "Review / investigation labor"
                  : isInsurance
                  ? "Claim-review labor"
                  : isEnergy
                  ? "Outage / incident review labor"
                  : isAI
                  ? "AI decision review labor"
                  : isOther
                  ? "Operational review labor"
                  : "Investigation labor"
              }
              value={money(reconstructionCost)}
            />
            <Line
              label="Total addressable cost"
              value={money(
                results.currentCost.totalAddressableOperationalCostUsdt
              )}
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold">
            Annual DDC Operating Cost
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Line
              label="Network fees"
              value={money(results.annualOperations.networkCostUsdt)}
            />
            <Line
              label="Infrastructure"
              value={money(results.annualOperations.infrastructureCostUsdt)}
            />
            <Line
              label="Connector maintenance"
              value={money(
                results.annualOperations.connectorMaintenanceCostUsdt
              )}
            />
            <Line
              label={
                isHealthcare
                  ? "Medical-device integration maintenance"
                  : isTransport
                  ? "Fleet / asset integration maintenance"
                  : isBanking
                  ? "Transaction / decision integration maintenance"
                  : isInsurance
                  ? "Claim / assessment integration maintenance"
                  : isEnergy
                  ? "Asset / meter integration maintenance"
                  : isAI
                  ? "Model / agent integration maintenance"
                  : isOther
                  ? "Operational integration maintenance"
                  : "Machine integration maintenance"
              }
              value={money(
                results.annualOperations.machineMaintenanceCostUsdt
              )}
            />
            <Line
              label="Workflow maintenance"
              value={money(
                results.annualOperations.workflowMaintenanceCostUsdt
              )}
            />
            <Line
              label="Support / operations"
              value={money(results.annualOperations.supportCostUsdt)}
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold">Assessment Assumptions</h2>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Line
              label="Staff record-handling reduction"
              value={`${results.assumptions.staffRecordHandlingReductionPercent}%`}
            />
            <Line
              label="Other record-management reduction"
              value={`${results.assumptions.otherRecordManagementReductionPercent}%`}
            />
            <Line
              label={
                isHealthcare
                  ? "Clinical-review labor reduction"
                  : isTransport
                  ? "Dispute-resolution labor reduction"
                  : isBanking
                  ? "Review / investigation labor reduction"
                  : isInsurance
                  ? "Claim-review labor reduction"
                  : isEnergy
                  ? "Outage / incident review labor reduction"
                  : isAI
                  ? "AI review / investigation labor reduction"
                  : isOther
                  ? "Operational review labor reduction"
                  : "Investigation labor reduction"
              }
              value={`${secondaryReduction}%`}
            />
            <Line
              label="Planning fee"
              value={`${results.assumptions.feePerRegistrationDdc} DDC / registration`}
            />
            <Line
              label="DDC assessment reference"
              value={`${results.assumptions.ddcReferencePriceUsdt} USDT / DDC`}
            />
            <Line
              label="Systems requiring replacement"
              value="0"
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold">
            {isBanking
              ? "Secondary Review & Investigation Benefit"
              : isInsurance
              ? "Secondary Claim Review & Dispute Benefit"
              : isEnergy
              ? "Secondary Outage & Incident Reconstruction Benefit"
              : isAI
              ? "Secondary AI Decision Review Benefit"
              : isOther
              ? "Secondary Operational Review Benefit"
              : "Secondary Reconstruction Benefit"}
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Line
              label={
                isHealthcare
                  ? "Current clinical-review labor"
                  : isTransport
                  ? "Current dispute-resolution labor"
                  : isBanking
                  ? "Current review / investigation labor"
                  : isInsurance
                  ? "Current claim-review labor"
                  : isEnergy
                  ? "Current outage / incident review labor"
                  : isAI
                  ? "Current AI decision review labor"
                  : isOther
                  ? "Current operational review labor"
                  : "Current investigation labor"
              }
              value={`${number(results.reconstruction.currentLaborHours)} h/year`}
            />
            <Line
              label={
                isHealthcare
                  ? "Target clinical-review labor"
                  : isTransport
                  ? "Target dispute-resolution labor"
                  : isBanking
                  ? "Target review / investigation labor"
                  : isInsurance
                  ? "Target claim-review labor"
                  : isEnergy
                  ? "Target outage / incident review labor"
                  : isAI
                  ? "Target AI decision review labor"
                  : isOther
                  ? "Target operational review labor"
                  : "Assessment target"
              }
              value={`${number(results.reconstruction.targetLaborHours)} h/year`}
            />
          </div>

          <div className="mt-12 rounded-xl border border-slate-300 bg-slate-50 p-5 text-xs leading-6 text-slate-600">
            Assessment estimate — not a commercial quote. Results are calculated
            from the information you entered and the DDC implementation
            assumptions shown in this assessment. Actual integration effort,
            infrastructure requirements, operating costs and savings depend on
            the organization’s systems, data availability, security requirements
            and deployment scope. The 0.79 USDT/DDC value is used only as an
            assessment reference based on the final presale batch price and is
            not a forecast of future market value.
          </div>
        </section>
      </article>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .report-page {
            page-break-after: always;
            box-shadow: none !important;
          }

          .report-page:last-child {
            page-break-after: auto;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Line({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <>
      <div className="text-slate-500">{label}</div>
      <div className="font-semibold text-slate-900">{value}</div>
    </>
  );
}
