"use client";

export type ExecutiveAssessmentReportData = {
  assessmentId: string;
  generatedDate: string;
  companyName: string;
  industryName: string;

  currencySymbol: string;

  reconstructionHours: number;
  ddcMinutesPerEvent: number;
  peopleInvolved: number;
  ddcPeopleInvolved: number;
  systemsUsed: number;
  avoidableWorkPercent: number;
  expectedReductionPercent: number;
  annualProgramCost: number;

  annualCostToday: number;
  annualCostWithDdc: number;
  grossAnnualSavings: number;
  netAnnualValue: number;
  recoveredHours: number;
  paybackMonths: number;
  firstYearRoi: number;
  timeReductionPercent: number;

  directLaborCost: number;
  fragmentationCost: number;
  repeatedWorkCost: number;
  directOperationalLoss: number;

  reportProblem: string;
  beforeDescription: string;
  afterDescription: string;

  recordTitle: string;
  recordType: string;
  recordEvidence: string[];
  recordMetadata: string[];

  pilotScope: string;
  pilotDuration: string;
  pilotIntegrations: string;
  pilotSample: string;

  sensitivityScenarios: Array<{
    improvementPercent: number;
    totalCostWithDdc: number;
    netAnnualValue: number;
    paybackMonths: number;
  }>;
};

type Props = {
  data: ExecutiveAssessmentReportData;
};

function safeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function percent(value: number) {
  return `${safeNumber(value).toFixed(1)}%`;
}

export default function ExecutiveAssessmentReport({
  data,
}: Props) {
  const money = (value: number) =>
    `${data.currencySymbol}${Math.round(
      safeNumber(value)
    ).toLocaleString("en-US")}`;

  const whole = (value: number) =>
    Math.round(safeNumber(value)).toLocaleString("en-US");

  const company =
    data.companyName.trim() || "Assessed organization";

  const costItems = [
    {
      label: "Employee reconstruction",
      value: data.directLaborCost,
    },
    {
      label: "Search and coordination",
      value: data.fragmentationCost,
    },
    {
      label: "Repeated and avoidable work",
      value: data.repeatedWorkCost,
    },
    {
      label: "Direct operational loss",
      value: data.directOperationalLoss,
    },
  ];

  const maxCost = Math.max(
    1,
    ...costItems.map((item) => safeNumber(item.value))
  );

  const sectorEvidenceSources: Record<string, string[]> = {
    "Manufacturing": [
      "ERP",
      "MES",
      "Quality system",
      "Machine logs",
      "Sensor data",
      "Maintenance records",
      "Production documents",
      "Supplier records",
    ],
    "Healthcare": [
      "Electronic health record",
      "Laboratory system",
      "Medical devices",
      "Imaging system",
      "Pharmacy records",
      "Access logs",
      "Clinical documents",
      "Compliance records",
    ],
    "Transport & Logistics": [
      "Fleet management",
      "GPS and route data",
      "Fuel records",
      "Delivery evidence",
      "Temperature sensors",
      "Maintenance history",
      "Driver records",
      "Dispatch system",
    ],
    "Banking & Financial Services": [
      "Core banking",
      "Transaction monitoring",
      "AML system",
      "Risk engine",
      "Customer records",
      "Document repository",
      "Approval workflow",
      "Model registry",
    ],
    "Insurance": [
      "Claims system",
      "Policy records",
      "Customer documents",
      "Damage photographs",
      "Expert reports",
      "Assessment engine",
      "Payment records",
      "Fraud monitoring",
    ],
    "Energy & Utilities": [
      "SCADA",
      "Metering system",
      "Sensor data",
      "Asset management",
      "Maintenance records",
      "Operator logs",
      "Outage management",
      "Recovery records",
    ],
    "Government & Public Administration": [
      "Case management",
      "Document registry",
      "Approval workflow",
      "Procurement system",
      "Public records",
      "Institutional email",
      "Audit records",
      "Archive system",
    ],
    "Construction & Infrastructure": [
      "Project management",
      "Design versions",
      "Site records",
      "Inspection reports",
      "Material certificates",
      "Contractor documents",
      "Photographic evidence",
      "Change approvals",
    ],
    "Retail & Supply Chain": [
      "ERP",
      "Warehouse system",
      "Inventory records",
      "Supplier records",
      "Point of sale",
      "Returns system",
      "Quality records",
      "Storage sensors",
    ],
    "Technology, AI & Software": [
      "Source control",
      "CI/CD",
      "Model registry",
      "Observability",
      "Ticketing system",
      "Security tools",
      "Deployment records",
      "Internal communications",
    ],
    "Other Organization": [
      "Operational system",
      "Document repository",
      "Approval workflow",
      "Employee records",
      "Event logs",
      "Supporting documents",
      "Audit records",
      "External evidence",
    ],
  };

  const availableEvidenceSources =
    sectorEvidenceSources[data.industryName] ??
    sectorEvidenceSources["Other Organization"];

  const currentEvidenceSources = Array.from(
    { length: Math.max(1, data.systemsUsed) },
    (_, index) =>
      availableEvidenceSources[index] ??
      `Additional evidence source ${index + 1}`
  );


  return (
    <article
      id="executive-assessment-report"
      className="executive-assessment-report"
    >
      {/* PAGE 1 — COVER */}
      <section className="report-page report-cover">
        <div className="report-brand">
          DIAMOND DATA CHAIN
        </div>

        <div className="report-cover-rule" />

        <h1>DDC Business Value Assessment</h1>

        <p className="report-cover-intro">
          Executive assessment of the operational and financial
          impact of fragmented evidence and the potential value of
          verifiable DDT operational records.
        </p>

        <div className="report-cover-grid">
          <div className="report-cover-field">
            <span>Prepared for</span>
            <strong>{company}</strong>
          </div>

          <div className="report-cover-field">
            <span>Industry</span>
            <strong>{data.industryName}</strong>
          </div>

          <div className="report-cover-field">
            <span>Assessment ID</span>
            <strong className="report-mono report-id">
              {data.assessmentId}
            </strong>
          </div>

          <div className="report-cover-field">
            <span>Assessment date</span>
            <strong>{data.generatedDate}</strong>
          </div>
        </div>

        <div className="report-cover-footer">
          Confidential business assessment
        </div>
      </section>

      {/* PAGE 2 — EXECUTIVE SUMMARY */}
      <section className="report-page">
        <ReportHeader
          title="Executive summary"
          assessmentId={data.assessmentId}
        />

        <p className="report-lead">
          Based on the information entered, {company} may currently
          spend approximately{" "}
          <strong>{money(data.annualCostToday)}</strong> each year on{" "}
          {data.reportProblem}.
        </p>

        <div className="report-kpi-grid">
          <Kpi
            label="Annual cost today"
            value={money(data.annualCostToday)}
            tone="danger"
          />

          <Kpi
            label="Annual cost with DDC"
            value={money(data.annualCostWithDdc)}
            detail={`Includes ${money(
              data.annualProgramCost
            )} annual program cost`}
            tone="navy"
          />

          <Kpi
            label="Net annual value"
            value={money(data.netAnnualValue)}
            tone="success"
          />

          <Kpi
            label="Estimated payback"
            value={
              data.paybackMonths > 0
                ? `${data.paybackMonths.toFixed(1)} months`
                : "—"
            }
            tone="gold"
          />
        </div>

        <div className="report-comparison">
          <div>
            <span>Current process</span>
            <strong>
              {data.reconstructionHours} hours
            </strong>
            <small>
              {data.peopleInvolved} people per event
            </small>
          </div>

          <div className="report-arrow">→</div>

          <div>
            <span>With DDC</span>
            <strong>
              {data.ddcMinutesPerEvent} minutes
            </strong>
            <small>
              {data.ddcPeopleInvolved}{" "}
              {data.ddcPeopleInvolved === 1 ? "person" : "people"} per event
            </small>
          </div>

          <div className="report-arrow">→</div>

          <div>
            <span>Measured difference</span>
            <strong>
              {percent(data.timeReductionPercent)}
            </strong>
            <small>
              {whole(data.recoveredHours)} hours recovered annually
            </small>
          </div>
        </div>

        <div className="report-highlight">
          The estimated first-year ROI is{" "}
          <strong>{whole(data.firstYearRoi)}%</strong>. This is a
          business hypothesis, not a guarantee, and should be
          validated through a limited pilot using the organization’s
          actual process and evidence.
        </div>
      </section>

      {/* PAGE 3 — FINANCIAL IMPACT */}
      <section className="report-page">
        <ReportHeader
          title="Financial impact"
          assessmentId={data.assessmentId}
        />

        <h2>Current annual cost composition</h2>

        <div className="report-bar-chart">
          {costItems.map((item) => {
            const width =
              (safeNumber(item.value) / maxCost) * 100;

            return (
              <div
                className="report-bar-row"
                key={item.label}
              >
                <div className="report-bar-copy">
                  <span>{item.label}</span>
                  <strong>{money(item.value)}</strong>
                </div>

                <div className="report-bar-track">
                  <div
                    className="report-bar-fill"
                    style={{
                      width: `${Math.max(2, width)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="report-financial-summary">
          <div>
            <span>Current annual cost</span>
            <strong>{money(data.annualCostToday)}</strong>
          </div>

          <div>
            <span>Annual cost with DDC</span>
            <strong>{money(data.annualCostWithDdc)}</strong>
          </div>

          <div>
            <span>Gross annual savings</span>
            <strong>{money(data.grossAnnualSavings)}</strong>
          </div>

          <div>
            <span>Net annual value</span>
            <strong>{money(data.netAnnualValue)}</strong>
          </div>
        </div>
      </section>

      {/* PAGE 4 — PROCESS COMPARISON */}
      <section className="report-page">
        <ReportHeader
          title="Operational comparison"
          assessmentId={data.assessmentId}
        />

        <div className="report-two-columns">
          <ProcessColumn
            title="Current process"
            duration={`${data.reconstructionHours} hours`}
            people={data.peopleInvolved}
            steps={[
              "Operational event or incident occurs",
              "Employees are contacted across departments",
              "Relevant systems and documents are searched",
              "Evidence versions are compared manually",
              "Missing information is requested",
              "The event history is reconstructed",
            ]}
            tone="current"
          />

          <ProcessColumn
            title="With DDC"
            duration={`${data.ddcMinutesPerEvent} minutes`}
            people={data.ddcPeopleInvolved}
            steps={[
              "Operational event or incident occurs",
              "The relevant DDT record is opened",
              "Connected evidence is retrieved",
              "Integrity and timestamps are verified",
              "One reviewer confirms the event history",
              "The review is completed",
            ]}
            tone="ddc"
          />
        </div>

        <div className="report-outcome-grid">
          <Kpi
            label="Time reduction"
            value={percent(data.timeReductionPercent)}
            tone="success"
          />

          <Kpi
            label="People reduced per event"
            value={String(
              Math.max(
                0,
                data.peopleInvolved -
                  data.ddcPeopleInvolved
              )
            )}
            tone="success"
          />

          <Kpi
            label="Hours recovered annually"
            value={whole(data.recoveredHours)}
            tone="gold"
          />
        </div>
      </section>

      {/* PAGE 5 — EVIDENCE ARCHITECTURE */}
      <section className="report-page">
        <ReportHeader
          title="Evidence architecture"
          assessmentId={data.assessmentId}
        />

        <p className="report-lead">
          The proposed design connects the evidence relevant to{" "}
          {company} without imposing one universal record structure.
        </p>

        <div className="report-evidence-flow">
          <div className="report-evidence-panel">
            <h3>Current evidence environment</h3>

            <div className="report-chip-grid">
              {currentEvidenceSources.map((source) => (
                <div
                  className="report-chip"
                  key={source}
                >
                  {source}
                </div>
              ))}
            </div>

            <p>
              Relevant information is distributed across{" "}
              {data.systemsUsed} systems and must be located,
              compared and connected manually.
            </p>
          </div>

          <div className="report-flow-arrow">→</div>

          <div className="report-evidence-panel report-evidence-ddt">
            <h3>Proposed DDT operational record</h3>

            <div className="report-record-core">
              <strong>{data.recordType}</strong>
              <span>Verified operational history</span>
            </div>

            <div className="report-chip-grid">
              {data.recordEvidence.slice(0, 6).map((item) => (
                <div
                  className="report-chip"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="report-highlight">
          The final record structure, integrations, permissions and
          verification rules are configured specifically for{" "}
          <strong>{company}</strong>.
        </div>
      </section>

      {/* PAGE 6 — BUSINESS CASE */}
      <section className="report-page">
        <ReportHeader
          title="Business case validation"
          assessmentId={data.assessmentId}
        />

        <h2>Sensitivity analysis</h2>

        <table className="report-table">
          <thead>
            <tr>
              <th>Improvement</th>
              <th>Annual cost with DDC</th>
              <th>Net annual value</th>
              <th>Payback</th>
            </tr>
          </thead>

          <tbody>
            {data.sensitivityScenarios.map((scenario) => (
              <tr
                key={scenario.improvementPercent}
                className={
                  scenario.improvementPercent ===
                  data.expectedReductionPercent
                    ? "report-selected-row"
                    : undefined
                }
              >
                <td>
                  {scenario.improvementPercent}%
                  {scenario.improvementPercent ===
                    data.expectedReductionPercent && (
                    <small> Selected</small>
                  )}
                </td>

                <td>
                  {money(scenario.totalCostWithDdc)}
                </td>

                <td>
                  {money(scenario.netAnnualValue)}
                </td>

                <td>
                  {scenario.paybackMonths > 0
                    ? `${scenario.paybackMonths.toFixed(
                        1
                      )} months`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="report-assumption-grid">
          <div>
            <span>Evidence systems</span>
            <strong>{data.systemsUsed}</strong>
          </div>

          <div>
            <span>Repeated work</span>
            <strong>
              {data.avoidableWorkPercent}%
            </strong>
          </div>

          <div>
            <span>Selected improvement</span>
            <strong>
              {data.expectedReductionPercent}%
            </strong>
          </div>

          <div>
            <span>Annual DDC cost</span>
            <strong>
              {money(data.annualProgramCost)}
            </strong>
          </div>
        </div>
      </section>

      {/* PAGE 7 — PROPOSED RECORD */}
      <section className="report-page">
        <ReportHeader
          title="Proposed DDT operational record"
          assessmentId={data.assessmentId}
        />

        <h2>{data.recordTitle}</h2>

        <p className="report-lead">
          Recommended record structure for {company}, based on the
          selected industry and assessment inputs.
        </p>

        <div className="report-record-overview">
          <div>
            <span>Record ID</span>
            <strong className="report-mono report-id">
              {data.assessmentId}-REC-001
            </strong>
          </div>

          <div>
            <span>Record type</span>
            <strong>{data.recordType}</strong>
          </div>

          <div>
            <span>Verification</span>
            <strong>Verified</strong>
          </div>

          <div>
            <span>Integrity</span>
            <strong>SHA-256 verified</strong>
          </div>
        </div>

        <div className="report-two-columns">
          <div className="report-list-panel">
            <h3>Connected evidence</h3>

            <ul>
              {data.recordEvidence.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>

          <div className="report-list-panel">
            <h3>Protected metadata</h3>

            <ul>
              {data.recordMetadata.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="report-highlight">
          This is a proposed structure for {company}, not a fixed
          global template. The final implementation is configured
          around the organization’s actual evidence, governance,
          privacy and compliance requirements.
        </div>
      </section>

      {/* PAGE 8 — PILOT */}
      <section className="report-page">
        <ReportHeader
          title="Recommended pilot"
          assessmentId={data.assessmentId}
        />

        <p className="report-lead">
          Validate the financial and operational estimates using one
          real process inside {company}.
        </p>

        <div className="report-pilot-grid">
          <div>
            <span>Proposed scope</span>
            <strong>{data.pilotScope}</strong>
          </div>

          <div>
            <span>Estimated duration</span>
            <strong>{data.pilotDuration}</strong>
          </div>

          <div>
            <span>Initial integrations</span>
            <strong>{data.pilotIntegrations}</strong>
          </div>

          <div>
            <span>Validation sample</span>
            <strong>{data.pilotSample}</strong>
          </div>
        </div>

        <h2>Pilot KPIs</h2>

        <div className="report-kpi-list">
          {[
            "Time required to reconstruct one event",
            "Number of employees involved",
            "Evidence retrieval and verification time",
            "Direct operational cost reduction",
            "Annualized net business value",
            "Evidence completeness and integrity",
          ].map((item) => (
            <div key={item}>✓ {item}</div>
          ))}
        </div>

        <div className="report-highlight">
          If the measured pilot results do not justify broader
          deployment, no further implementation should be
          recommended.
        </div>
      </section>

      {/* PAGE 9 — METHODOLOGY */}
      <section className="report-page">
        <ReportHeader
          title="Methodology and assumptions"
          assessmentId={data.assessmentId}
        />

        <div className="report-methodology">
          <h2>Assessment methodology</h2>

          <p>
            Every additional evidence system adds 5% to direct
            reconstruction cost, capped at 50%. Direct operational
            loss is multiplied by the estimated annual number of
            reviewed events.
          </p>

          <p>
            Potential savings use the improvement percentage entered
            by the user. The annual DDC program cost includes the
            estimated implementation, configuration, integration,
            training and operating cost.
          </p>

          <h2>Important limitation</h2>

          <p>
            This assessment is an initial business estimate and does
            not represent guaranteed savings, a legal opinion, a
            compliance audit or a formal investment recommendation.
            Actual results depend on process scope, integration
            requirements, evidence quality and organizational
            adoption.
          </p>

          <h2>Organization-specific configuration</h2>

          <div className="report-before-after">
            <div>
              <span>Current environment</span>
              <p>{data.beforeDescription}</p>
            </div>

            <div>
              <span>Proposed environment</span>
              <p>{data.afterDescription}</p>
            </div>
          </div>
        </div>

        <div className="report-document-footer">
          <strong>{company}</strong>
          <span>{data.assessmentId}</span>
          <span>DDC Business Value Assessment</span>
        </div>
      </section>

      <style jsx global>{`
        .executive-assessment-report {

          display: block;
          width: 210mm;
          margin: 0 auto;
          background: #ffffff;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
        
        }


        @media screen {
          html,
          body {
            min-height: 100%;
            background: #e2e8f0 !important;
          }

          main {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            visibility: visible !important;
          }

          main > * {
            display: block !important;
            visibility: visible !important;
          }

          #executive-assessment-report,
          #executive-assessment-report * {
            visibility: visible !important;
            opacity: 1 !important;
          }

          #executive-assessment-report {
            display: block !important;
          }
        }

        @media screen, print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          main {
            display: block !important;
            width: 210mm !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #172033 !important;
          }


          #executive-assessment-report {
            display: block !important;
            position: static !important;
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #172033 !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }

          #executive-assessment-report * {
            visibility: visible !important;
            opacity: 1 !important;
          }

          .report-page {
            position: relative;
            width: 210mm;
            box-sizing: border-box;
            width: 210mm;
            min-height: 297mm;
            padding: 18mm 17mm 17mm;
            page-break-after: always;
            break-after: page;
            overflow: visible;
            background: white !important;
            color: #172033 !important;
          }

          .report-page:last-of-type {
            page-break-after: auto;
            break-after: auto;
          }

          .report-page > header,
          .report-kpi,
          .report-process,
          .report-highlight,
          .report-list-panel,
          .report-record-overview,
          .report-pilot-grid,
          .report-table,
          .report-evidence-panel {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          #executive-assessment-report p,
          #executive-assessment-report li,
          #executive-assessment-report td,
          #executive-assessment-report th,
          #executive-assessment-report span,
          #executive-assessment-report small {
            opacity: 1 !important;
          }

          .report-cover {
            display: flex;
            flex-direction: column;
          }

          .report-brand {
            color: #9a761c !important;
            font-size: 12pt;
            font-weight: 700;
            letter-spacing: 0.18em;
          }

          .report-cover-rule {
            width: 48mm;
            height: 1.5mm;
            margin-top: 7mm;
            background: #c6a13e !important;
          }

          .report-cover h1 {
            max-width: 150mm;
            margin-top: 30mm;
            color: #172033 !important;
            font-size: 30pt;
            line-height: 1.12;
          }

          .report-cover-intro {
            max-width: 145mm;
            margin-top: 8mm;
            color: #46546a !important;
            font-size: 13pt;
            line-height: 1.55;
          }

          .report-cover-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8mm;
            margin-top: 30mm;
          }

          .report-cover-field {
            border-top: 0.5mm solid #c6a13e;
            padding-top: 4mm;
          }

          .report-cover-field span,
          .report-record-overview span,
          .report-pilot-grid span,
          .report-assumption-grid span,
          .report-financial-summary span {
            display: block;
            margin-bottom: 2mm;
            color: #667085 !important;
            font-size: 8.5pt;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .report-cover-field strong {
            color: #172033 !important;
            font-size: 13pt;
            line-height: 1.35;
          }

          .report-cover-footer {
            margin-top: auto;
            color: #667085 !important;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }

          .report-mono {
            font-family: "Courier New", monospace !important;
          }

          .report-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            border-bottom: 0.5mm solid #c6a13e;
            padding-bottom: 4mm;
            margin-bottom: 9mm;
          }

          .report-header h1 {
            margin: 0;
            color: #172033 !important;
            font-size: 22pt;
            line-height: 1.15;
          }

          .report-header span {
            color: #667085 !important;
            font-size: 8.5pt;
            font-family: "Courier New", monospace;
          }

          .report-page h2 {
            margin: 8mm 0 5mm;
            color: #172033 !important;
            font-size: 16pt;
          }

          .report-page h3 {
            color: #172033 !important;
          }

          .report-lead {
            color: #344054 !important;
            font-size: 12pt;
            line-height: 1.55;
          }

          .report-kpi-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6mm;
            margin-top: 9mm;
          }

          .report-kpi {
            min-height: 34mm;
            border: 0.35mm solid #d7dce5;
            border-left-width: 2.2mm;
            padding: 5mm;
            break-inside: avoid;
          }

          .report-kpi-danger {
            border-left-color: #a33a3a;
          }

          .report-kpi-navy {
            border-left-color: #344b72;
          }

          .report-kpi-success {
            border-left-color: #287a60;
          }

          .report-kpi-gold {
            border-left-color: #b68a20;
          }

          .report-kpi span {
            display: block;
            color: #667085 !important;
            font-size: 9pt;
            font-weight: 700;
            text-transform: uppercase;
          }

          .report-kpi strong {
            display: block;
            margin-top: 3mm;
            color: #172033 !important;
            font-size: 21pt;
          }

          .report-kpi small {
            display: block;
            margin-top: 2mm;
            color: #475467 !important;
            font-size: 8.5pt;
          }

          .report-comparison {
            display: grid;
            grid-template-columns: 1fr 14mm 1fr 14mm 1fr;
            align-items: center;
            gap: 3mm;
            margin-top: 10mm;
          }

          .report-comparison > div:not(.report-arrow) {
            border: 0.35mm solid #d7dce5;
            padding: 5mm;
            text-align: center;
          }

          .report-comparison span {
            display: block;
            color: #667085 !important;
            font-size: 8.5pt;
            font-weight: 700;
            text-transform: uppercase;
          }

          .report-comparison strong {
            display: block;
            margin-top: 3mm;
            color: #172033 !important;
            font-size: 17pt;
          }

          .report-comparison small {
            display: block;
            margin-top: 2mm;
            color: #475467 !important;
            font-size: 8.5pt;
          }

          .report-arrow,
          .report-flow-arrow {
            color: #b68a20 !important;
            font-size: 24pt;
            font-weight: 700;
            text-align: center;
          }

          .report-highlight {
            margin-top: 9mm;
            border: 0.35mm solid #d4b457;
            background: #fbf7e9 !important;
            padding: 5mm;
            color: #344054 !important;
            font-size: 10.5pt;
            line-height: 1.5;
            break-inside: avoid;
          }

          .report-bar-chart {
            margin-top: 7mm;
          }

          .report-bar-row {
            margin-bottom: 6mm;
            break-inside: avoid;
          }

          .report-bar-copy {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2mm;
            color: #344054 !important;
            font-size: 10pt;
          }

          .report-bar-copy strong {
            color: #172033 !important;
          }

          .report-bar-track {
            height: 5mm;
            overflow: hidden;
            background: #e7eaf0 !important;
          }

          .report-bar-fill {
            height: 100%;
            background: #344b72 !important;
          }

          .report-financial-summary,
          .report-assumption-grid,
          .report-record-overview,
          .report-pilot-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5mm;
            margin-top: 9mm;
          }

          .report-financial-summary > div,
          .report-assumption-grid > div,
          .report-record-overview > div,
          .report-pilot-grid > div {
            border: 0.35mm solid #d7dce5;
            padding: 5mm;
            break-inside: avoid;
          }

          .report-financial-summary strong,
          .report-assumption-grid strong,
          .report-record-overview strong,
          .report-pilot-grid strong {
            color: #172033 !important;
            font-size: 13pt;
            line-height: 1.35;
          }

          .report-two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7mm;
            align-items: start;
          }

          .report-process {
            border: 0.35mm solid #d7dce5;
            padding: 5mm;
            break-inside: avoid;
          }

          .report-process-current {
            border-top: 2mm solid #a33a3a;
          }

          .report-process-ddc {
            border-top: 2mm solid #287a60;
          }

          .report-process-head {
            display: flex;
            justify-content: space-between;
            gap: 4mm;
            margin-bottom: 5mm;
          }

          .report-process-head h3 {
            margin: 0;
            font-size: 14pt;
          }

          .report-process-head strong {
            color: #172033 !important;
          }

          .report-process ol {
            margin: 0;
            padding-left: 6mm;
          }

          .report-process li {
            margin-bottom: 3mm;
            color: #344054 !important;
            font-size: 9.5pt;
            line-height: 1.35;
          }

          .report-process-footer {
            margin-top: 5mm;
            border-top: 0.35mm solid #d7dce5;
            padding-top: 4mm;
            color: #344054 !important;
            font-size: 9pt;
          }

          .report-outcome-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5mm;
            margin-top: 8mm;
          }

          .report-evidence-flow {
            display: grid;
            grid-template-columns: 1fr 16mm 1fr;
            align-items: center;
            gap: 4mm;
            margin-top: 10mm;
          }

          .report-evidence-panel {
            min-height: 130mm;
            border: 0.35mm solid #d7dce5;
            padding: 6mm;
          }

          .report-evidence-panel h3 {
            margin-top: 0;
            font-size: 14pt;
          }

          .report-evidence-panel p {
            color: #475467 !important;
            font-size: 9.5pt;
            line-height: 1.45;
          }

          .report-evidence-ddt {
            border-top: 2mm solid #b68a20;
          }

          .report-chip-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
            margin: 6mm 0;
          }

          .report-chip {
            border: 0.35mm solid #d7dce5;
            padding: 3mm;
            color: #344054 !important;
            font-size: 8.5pt;
            text-align: center;
          }

          .report-record-core {
            border: 0.5mm solid #b68a20;
            padding: 6mm;
            text-align: center;
          }

          .report-record-core strong {
            display: block;
            color: #172033 !important;
            font-size: 13pt;
          }

          .report-record-core span {
            display: block;
            margin-top: 2mm;
            color: #667085 !important;
            font-size: 8.5pt;
          }

          .report-table {
            width: 100%;
            margin-top: 7mm;
            border-collapse: collapse;
            font-size: 9.5pt;
          }

          .report-table th {
            background: #344b72 !important;
            color: white !important;
            padding: 4mm;
            text-align: left;
          }

          .report-table td {
            border-bottom: 0.35mm solid #d7dce5;
            padding: 4mm;
            color: #344054 !important;
          }

          .report-selected-row {
            background: #fbf7e9 !important;
            font-weight: 700;
          }

          .report-table small {
            margin-left: 2mm;
            color: #9a761c !important;
            font-size: 7.5pt;
            text-transform: uppercase;
          }

          .report-list-panel {
            border: 0.35mm solid #d7dce5;
            padding: 6mm;
            break-inside: avoid;
          }

          .report-list-panel h3 {
            margin-top: 0;
          }

          .report-list-panel ul {
            margin: 5mm 0 0;
            padding: 0;
            list-style: none;
          }

          .report-list-panel li {
            margin-bottom: 3mm;
            color: #344054 !important;
            font-size: 9.5pt;
          }

          .report-kpi-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4mm;
          }

          .report-kpi-list div {
            border: 0.35mm solid #d7dce5;
            padding: 4mm;
            color: #344054 !important;
            font-size: 9.5pt;
          }

          .report-methodology p {
            color: #344054 !important;
            font-size: 10.5pt;
            line-height: 1.55;
          }

          .report-before-after {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6mm;
            margin-top: 6mm;
          }

          .report-before-after > div {
            border: 0.35mm solid #d7dce5;
            padding: 5mm;
          }

          .report-before-after span {
            color: #667085 !important;
            font-size: 8.5pt;
            font-weight: 700;
            text-transform: uppercase;
          }

          .report-document-footer {
            position: absolute;
            right: 17mm;
            bottom: 14mm;
            left: 17mm;
            display: flex;
            justify-content: space-between;
            border-top: 0.35mm solid #d7dce5;
            padding-top: 3mm;
            color: #667085 !important;
            font-size: 7.5pt;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        /*
         * Final professional readability polish
         */
        #executive-assessment-report {
          color: #172033 !important;
          background: #ffffff !important;
        }

        #executive-assessment-report p,
        #executive-assessment-report li,
        #executive-assessment-report td,
        #executive-assessment-report span,
        #executive-assessment-report small {
          color: #344054 !important;
          opacity: 1 !important;
        }

        #executive-assessment-report h1,
        #executive-assessment-report h2,
        #executive-assessment-report h3,
        #executive-assessment-report strong {
          color: #101828 !important;
          opacity: 1 !important;
        }

        .report-header span,
        .report-cover-field span,
        .report-record-overview span,
        .report-pilot-grid span,
        .report-assumption-grid span,
        .report-financial-summary span,
        .report-before-after span {
          color: #475467 !important;
        }

        .report-lead,
        .report-cover-intro,
        .report-methodology p,
        .report-evidence-panel p {
          color: #263247 !important;
        }

        .report-chip {
          color: #172033 !important;
          background: #f8fafc !important;
          border-color: #cbd5e1 !important;
          font-weight: 600 !important;
          line-height: 1.3 !important;
          overflow-wrap: anywhere;
        }

        .report-id {
          display: block;
          white-space: nowrap;
          overflow-wrap: normal;
          word-break: normal;
          letter-spacing: -0.02em;
          font-size: 11pt !important;
        }

        .report-cover-field .report-id {
          font-size: 10.5pt !important;
        }

        .report-record-overview {
          grid-template-columns: 1.35fr 1fr !important;
        }

        .report-record-overview > div {
          min-width: 0;
        }

        .report-highlight {
          color: #263247 !important;
          background: #fbf7e9 !important;
          border-color: #c9a33c !important;
        }

        .report-table th {
          color: #ffffff !important;
        }

        .report-selected-row td {
          color: #172033 !important;
        }

        .report-page {
          color: #172033 !important;
        }

        @media screen {
          .report-page {
            border: 1px solid #d0d5dd;
          }
        }

        @media print {
          .report-id {
            white-space: nowrap !important;
            font-size: 9.5pt !important;
          }

          .report-chip {
            background: #f8fafc !important;
            color: #172033 !important;
          }

          #executive-assessment-report p,
          #executive-assessment-report li,
          #executive-assessment-report td,
          #executive-assessment-report span,
          #executive-assessment-report small {
            color: #263247 !important;
          }
        }

      `}</style>
    </article>
  );
}

function ReportHeader({
  title,
  assessmentId,
}: {
  title: string;
  assessmentId: string;
}) {
  return (
    <header className="report-header">
      <h1>{title}</h1>
      <span>{assessmentId}</span>
    </header>
  );
}

function Kpi({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail?: string;
  tone: "danger" | "navy" | "success" | "gold";
}) {
  return (
    <div className={`report-kpi report-kpi-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function ProcessColumn({
  title,
  duration,
  people,
  steps,
  tone,
}: {
  title: string;
  duration: string;
  people: number;
  steps: string[];
  tone: "current" | "ddc";
}) {
  return (
    <div
      className={`report-process report-process-${tone}`}
    >
      <div className="report-process-head">
        <h3>{title}</h3>
        <strong>{duration}</strong>
      </div>

      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="report-process-footer">
        People involved: <strong>{people}</strong>
      </div>
    </div>
  );
}
