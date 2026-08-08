"use client";

import type {
  BankingInputs,
  calculateBankingAssessment,
} from "../../../business-value-calculator/bankingValueModel";

type BankingResultsData = ReturnType<
  typeof calculateBankingAssessment
>;

type Props = {
  inputs: BankingInputs;
  results: BankingResultsData;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function Card({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-amber-500/30 bg-slate-950/65 p-6 transition hover:-translate-y-1 hover:border-amber-300/65">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
        {String(index).padStart(2, "0")}
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-6 text-slate-300">
        {title}
      </h3>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function BankingResults({
  inputs,
  results,
}: Props) {
  const recurringBenefit =
    results.value.recurringAnnualBenefitUsdt;

  const exportJson = () => {
    const snapshot = {
      assessmentType: "DDC Operational Value Assessment",
      branch: "Banking & Financial Services",
      configurationVersion: results.configVersion,
      generatedAt: new Date().toISOString(),

      inputs,
      results,
    };

    const blob = new Blob(
      [JSON.stringify(snapshot, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      `DDC-Manufacturing-Assessment-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const openExecutiveReport = () => {
    const storageKey =
      `ddc-operational-report:${Date.now()}`;

    const snapshot = {
      assessmentType: "DDC Operational Value Assessment",
      branch: "Banking & Financial Services",
      configurationVersion: results.configVersion,
      generatedAt: new Date().toISOString(),
      inputs,
      results,
    };

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          savedAt: Date.now(),
          data: snapshot,
        })
      );

      window.open(
        `/business-value-calculator/report?key=${encodeURIComponent(
          storageKey
        )}`,
        "_blank"
      );
    } catch (error) {
      console.error(
        "Unable to prepare executive report:",
        error
      );

      window.alert(
        "The executive report could not be prepared."
      );
    }
  };


  return (
    <section className="rounded-[30px] border border-amber-400/40 bg-slate-900/75 p-6 shadow-[0_0_50px_rgba(251,191,36,0.08)] md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
            Operational Economics
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Banking & Financial Services assessment results
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-300">
            Assumptions v{results.configVersion}
          </div>

          <button
            type="button"
            onClick={openExecutiveReport}
            className="rounded-xl border border-amber-300 bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/30"
          >
            Download Executive PDF
          </button>

          <button
            type="button"
            onClick={exportJson}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
          >
            Export JSON
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          index={1}
          title="Estimated current addressable operational cost"
        >
          <div className="text-3xl font-semibold text-white">
            {money.format(
              results.currentCost.totalAddressableOperationalCostUsdt
            )}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            per year
          </div>
        </Card>

        <Card index={2} title="Estimated DDC implementation scope">
          <div className="space-y-2 text-sm text-slate-200">
            <div>{results.scope.bankingEntitiesSites} branches / business units</div>
            <div>
              {results.scope.standardConnectors +
                results.scope.customConnectors}{" "}
              systems/connectors
            </div>
            <div>
              {results.scope.integrationGroups} transaction integration groups
            </div>
            <div>{results.scope.workflows} workflows</div>
            <div>
              {number.format(
                results.scope.annualRegistrationTransactions
              )}{" "}
              records/year
            </div>
          </div>
        </Card>

        <Card index={3} title="Estimated implementation team & effort">
          <div className="text-3xl font-semibold text-white">
            {results.implementation.totalPersonMonths.toFixed(1)} PM
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-300">
            {results.implementation.roleBreakdown
              .filter((role) => role.hours > 0)
              .map((role) => (
                <div
                  key={role.role}
                  className="flex justify-between gap-3"
                >
                  <span>{role.label}</span>
                  <span className="whitespace-nowrap text-slate-100">
                    {role.personMonths.toFixed(2)} PM
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card index={4} title="Estimated one-time DDC implementation cost">
          <div className="text-3xl font-semibold text-amber-200">
            {money.format(
              results.implementation.estimatedImplementationCostUsdt
            )}
          </div>
        </Card>

        <Card index={5} title="Estimated annual DDC operating cost">
          <div className="text-3xl font-semibold text-white">
            {money.format(
              results.annualOperations.estimatedAnnualOperatingCostUsdt
            )}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            per year
          </div>
        </Card>

        <Card index={6} title="Estimated DDC network requirement">
          <div className="text-3xl font-semibold text-white">
            {number.format(results.annualOperations.networkDdc)} DDC
          </div>

          <div className="mt-2 text-sm text-slate-300">
            {money.format(results.annualOperations.networkCostUsdt)} / year
            at 0.79 USDT/DDC assessment reference
          </div>
        </Card>

        <Card index={7} title="Estimated recurring annual benefit">
          <div
            className={
              recurringBenefit >= 0
                ? "text-3xl font-semibold text-emerald-300"
                : "text-3xl font-semibold text-red-300"
            }
          >
            {money.format(recurringBenefit)}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            per year
          </div>
        </Card>

        <Card index={8} title="Estimated first-year net value">
          <div className="text-3xl font-semibold text-white">
            {money.format(results.value.firstYearNetValueUsdt)}
          </div>
        </Card>

        <Card index={9} title="Estimated payback period">
          <div className="text-3xl font-semibold text-white">
            {results.value.paybackMonths > 0
              ? `${results.value.paybackMonths.toFixed(1)} months`
              : "Not established"}
          </div>
        </Card>

        <Card index={10} title="Secondary review & investigation benefit">
          <div className="space-y-2 text-sm text-slate-300">
            <div>
              Current review labor:{" "}
              <strong className="text-white">
                {number.format(
                  results.reconstruction.currentLaborHours
                )}{" "}
                h/year
              </strong>
            </div>

            <div>
              Target review labor:{" "}
              <strong className="text-white">
                {number.format(
                  results.reconstruction.targetLaborHours
                )}{" "}
                h/year
              </strong>
            </div>

            <div>
              Assumption:{" "}
              <strong className="text-white">
                {results.reconstruction.reductionPercent}% reduction
              </strong>
            </div>
          </div>
        </Card>

        <Card index={11} title="Systems requiring replacement">
          <div className="text-3xl font-semibold text-emerald-300">
            {results.existingSystemsReplaced}
          </div>

          <div className="mt-2 text-sm leading-6 text-slate-400">
            Existing core banking, AML, KYC, fraud, risk, transaction-monitoring and other financial systems remain in place. DDC adds an independent verifiable operational record layer.
          </div>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">
        <div className="text-sm font-semibold text-cyan-200">
          Assessment assumptions
        </div>

        <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
          <div>
            Staff record-handling reduction:{" "}
            {results.assumptions.staffRecordHandlingReductionPercent}%
          </div>
          <div>
            Other record-management reduction:{" "}
            {results.assumptions.otherRecordManagementReductionPercent}%
          </div>
          <div>
            Review labor reduction:{" "}
            {results.assumptions.reviewLaborReductionPercent}%
          </div>
          <div>
            Planning fee:{" "}
            {results.assumptions.feePerRegistrationDdc} DDC/registration
          </div>
          <div>
            DDC assessment reference:{" "}
            {results.assumptions.ddcReferencePriceUsdt} USDT/DDC
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-5 text-sm leading-7 text-slate-300">
        Assessment estimate — not a commercial quote. Results are calculated
        from the information you entered and the DDC implementation assumptions
        shown in this assessment. Actual integration effort, infrastructure
        requirements, operating costs and savings depend on the organization’s
        systems, data availability, security requirements and deployment scope.
        The 0.79 USDT/DDC value is used only as an assessment reference based on
        the final presale batch price and is not a forecast of future market
        value.
      </div>
    </section>
  );
}
