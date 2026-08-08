export type OperationalValueIndustryId =
  | "manufacturing"
  | "healthcare"
  | "transport"
  | "banking"
  | "insurance"
  | "energy"
  | "government"
  | "construction"
  | "retail"
  | "technology"
  | "other";

export type OperationalValueInputs = {
  companyName: string;

  primaryObjectsPerYear: number;
  traceableEventsPerObject: number;
  additionalOperationalEventsPerYear: number;
  systemsUsed: number;

  recordHandlingEmployees: number;
  recordHandlingHoursPerEmployeePerWeek: number;
  hourlyCost: number;
  additionalAnnualRecordManagementCost: number;

  expectedStaffEffortReductionPercent: number;
  oneTimeImplementationCost: number;
  annualDdcProgramCost: number;
  ddcReferencePrice: number;

  reconstructionCasesPerYear: number;
  currentReconstructionHoursPerCase: number;
  ddcReconstructionHoursPerCase: number;
};

export type OperationalValueSectorProfile = {
  name: string;
  shortDescription: string;

  primaryObjectsLabel: string;
  primaryObjectsHelper: string;

  traceableEventsLabel: string;
  traceableEventsHelper: string;

  additionalEventsLabel: string;
  additionalEventsHelper: string;

  systemsLabel: string;
  systemsHelper: string;

  reconstructionCasesLabel: string;
  reconstructionCasesHelper: string;

  currentReconstructionLabel: string;
  currentReconstructionHelper: string;

  ddcReconstructionLabel: string;
  ddcReconstructionHelper: string;
};

export const DDC_REGISTRATION_BASELINE = 0.0001;

export const OPERATIONAL_VALUE_PROFILES: Record<
  OperationalValueIndustryId,
  OperationalValueSectorProfile
> = {
  manufacturing: {
    name: "Manufacturing",
    shortDescription:
      "Production events, component traceability, machine history, quality checks, maintenance and warranty evidence.",
    primaryObjectsLabel: "Products or production units per year",
    primaryObjectsHelper:
      "Finished units, batches or other primary production objects you want to trace.",
    traceableEventsLabel: "Traceable production events per unit",
    traceableEventsHelper:
      "Component installation, machine operation, process completion, quality inspection, test result, packaging or other events that should become DDC records.",
    additionalEventsLabel:
      "Additional machine, maintenance and quality events per year",
    additionalEventsHelper:
      "Events not tied one-to-one to a finished unit, such as maintenance, calibration, machine alarms, quality holds and process changes.",
    systemsLabel: "Operational systems containing production history",
    systemsHelper:
      "ERP, MES, PLC/SCADA, quality, maintenance, spreadsheets or other systems that currently hold relevant production evidence.",
    reconstructionCasesLabel: "Warranty or quality cases per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one quality or warranty case",
    currentReconstructionHelper:
      "Current time required to trace components, machine conditions, inspections and related production history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected time to retrieve and verify the connected DDC operational history. Pilot assumption.",
  },

  healthcare: {
    name: "Healthcare",
    shortDescription:
      "Clinical events, medical-device history, treatment changes, record access and operational evidence.",
    primaryObjectsLabel: "Clinical cases or treatment episodes per year",
    primaryObjectsHelper:
      "Primary care episodes, procedures, treatments or other clinical processes to be represented.",
    traceableEventsLabel: "Traceable clinical events per case",
    traceableEventsHelper:
      "Treatment changes, device use, test results, approvals, record access or other events that should become DDC records.",
    additionalEventsLabel:
      "Additional medical-device and operational events per year",
    additionalEventsHelper:
      "Maintenance, calibration, device alerts, software updates and other operational events.",
    systemsLabel: "Systems containing relevant clinical and operational history",
    systemsHelper:
      "EHR, laboratory, imaging, device systems, pharmacy, documents and other relevant sources.",
    reconstructionCasesLabel: "Clinical reviews or disputes per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one clinical event",
    currentReconstructionHelper:
      "Current time required to assemble the complete case history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  transport: {
    name: "Transport & Logistics",
    shortDescription:
      "Shipment events, route history, delivery evidence, temperature conditions, fuel and maintenance records.",
    primaryObjectsLabel: "Shipments, trips or deliveries per year",
    primaryObjectsHelper:
      "Primary logistics objects to be represented.",
    traceableEventsLabel: "Traceable events per shipment or trip",
    traceableEventsHelper:
      "Pickup, route checkpoint, temperature condition, delivery confirmation, fuel event, handoff or other events.",
    additionalEventsLabel: "Additional vehicle and maintenance events per year",
    additionalEventsHelper:
      "Maintenance, service, inspections, breakdowns and other fleet events.",
    systemsLabel: "Systems containing relevant logistics history",
    systemsHelper:
      "TMS, GPS, telematics, warehouse, temperature, fuel, maintenance and document systems.",
    reconstructionCasesLabel:
      "Delivery disputes or incident reviews per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one shipment or trip",
    currentReconstructionHelper:
      "Current time required to assemble route, condition, delivery and maintenance history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  banking: {
    name: "Banking & Financial Services",
    shortDescription:
      "Transaction events, AML and fraud reviews, credit processes, approvals and automated recommendations.",
    primaryObjectsLabel:
      "Financial processes or reviewed transactions per year",
    primaryObjectsHelper:
      "Transactions, AML reviews, credit decisions, disputes or other processes to be represented.",
    traceableEventsLabel: "Traceable events per process",
    traceableEventsHelper:
      "Risk checks, documents, model outputs, human review, approval, policy reference and final action.",
    additionalEventsLabel:
      "Additional policy, model and control events per year",
    additionalEventsHelper:
      "Policy changes, model versions, control changes and other governance events.",
    systemsLabel: "Systems containing relevant financial history",
    systemsHelper:
      "Core banking, AML, risk, CRM, document, communication and decision systems.",
    reconstructionCasesLabel: "Investigations or formal reviews per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one financial event",
    currentReconstructionHelper:
      "Current time required to assemble the transaction, risk, evidence and approval history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  insurance: {
    name: "Insurance",
    shortDescription:
      "Claims history, damage evidence, expert reports, policy events, automated assessment and fraud review.",
    primaryObjectsLabel: "Claims or policy events per year",
    primaryObjectsHelper:
      "Claims, underwriting events, policy changes or other primary insurance processes.",
    traceableEventsLabel: "Traceable events per claim or policy process",
    traceableEventsHelper:
      "Evidence submission, assessment, expert report, model output, human review, approval and settlement event.",
    additionalEventsLabel:
      "Additional fraud, policy and model events per year",
    additionalEventsHelper:
      "Fraud-control changes, policy versions, model versions and related operational events.",
    systemsLabel: "Systems containing relevant insurance history",
    systemsHelper:
      "Claims, policy, CRM, documents, images, fraud, communications and assessment systems.",
    reconstructionCasesLabel:
      "Claims requiring detailed reconstruction per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel: "Average time to reconstruct one claim",
    currentReconstructionHelper:
      "Current time required to assemble the full claim and decision history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  energy: {
    name: "Energy & Utilities",
    shortDescription:
      "Asset events, meter and sensor evidence, maintenance history, grid events and outage recovery.",
    primaryObjectsLabel: "Assets, meters or operational objects covered",
    primaryObjectsHelper:
      "Grid assets, meters, substations, equipment or other objects to be represented.",
    traceableEventsLabel: "Traceable events per asset per year",
    traceableEventsHelper:
      "Inspection, maintenance, reading, control action, alarm, outage or other events selected for preservation.",
    additionalEventsLabel: "Additional grid and maintenance events per year",
    additionalEventsHelper:
      "Events not captured by the per-asset estimate.",
    systemsLabel: "Systems containing relevant operational history",
    systemsHelper:
      "SCADA, asset management, meter, maintenance, outage, GIS and document systems.",
    reconstructionCasesLabel:
      "Outages or technical investigations per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one operational event",
    currentReconstructionHelper:
      "Current time required to assemble asset, sensor, maintenance and control history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  government: {
    name: "Government & Public Administration",
    shortDescription:
      "Procurement events, approvals, public records, institutional actions and decision history.",
    primaryObjectsLabel: "Institutional processes or cases per year",
    primaryObjectsHelper:
      "Procurements, permits, grants, public decisions, inspections or other processes to be represented.",
    traceableEventsLabel: "Traceable events per process",
    traceableEventsHelper:
      "Submission, review, evidence, approval, policy reference, publication and change events.",
    additionalEventsLabel:
      "Additional policy and institutional events per year",
    additionalEventsHelper:
      "Policy updates, delegated-authority changes and other institutional events.",
    systemsLabel: "Systems containing relevant institutional history",
    systemsHelper:
      "Case management, procurement, documents, identity, communications and archive systems.",
    reconstructionCasesLabel:
      "Formal reviews, disputes or audit cases per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one institutional case",
    currentReconstructionHelper:
      "Current time required to assemble the full procedural history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  construction: {
    name: "Construction & Infrastructure",
    shortDescription:
      "Project versions, installed materials, inspections, site events, approvals and change history.",
    primaryObjectsLabel: "Projects or construction packages per year",
    primaryObjectsHelper:
      "Projects, work packages or other primary objects to be represented.",
    traceableEventsLabel: "Traceable events per project or package",
    traceableEventsHelper:
      "Material installation, inspection, approval, site change, version release, handover or other events.",
    additionalEventsLabel:
      "Additional equipment, safety and maintenance events per year",
    additionalEventsHelper:
      "Operational events not captured by the primary project estimate.",
    systemsLabel: "Systems containing relevant project history",
    systemsHelper:
      "BIM/CDE, ERP, project controls, quality, documents, site systems and spreadsheets.",
    reconstructionCasesLabel:
      "Claims, defects or project investigations per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one project issue",
    currentReconstructionHelper:
      "Current time required to assemble versions, approvals, materials and site history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  retail: {
    name: "Retail & Supply Chain",
    shortDescription:
      "Product origin, inventory events, supplier history, returns, quality events and fulfillment evidence.",
    primaryObjectsLabel: "Products, orders or inventory units per year",
    primaryObjectsHelper:
      "Primary retail or supply-chain objects to be represented.",
    traceableEventsLabel: "Traceable events per product or order",
    traceableEventsHelper:
      "Supplier event, receipt, inventory movement, fulfillment, return, quality check or other event.",
    additionalEventsLabel:
      "Additional supplier and quality events per year",
    additionalEventsHelper:
      "Supplier changes, quality holds, recalls and other events.",
    systemsLabel: "Systems containing relevant supply-chain history",
    systemsHelper:
      "ERP, WMS, POS, supplier, quality, returns, logistics and document systems.",
    reconstructionCasesLabel:
      "Returns, recalls or disputes requiring reconstruction per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one product or order history",
    currentReconstructionHelper:
      "Current time required to trace origin, movement, quality and fulfillment evidence.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  technology: {
    name: "Technology, AI & Software",
    shortDescription:
      "Software releases, model versions, agent actions, automated outputs, approvals and governance history.",
    primaryObjectsLabel:
      "Software releases, agent runs or governed AI processes per year",
    primaryObjectsHelper:
      "Primary software or AI events to be represented.",
    traceableEventsLabel: "Traceable events per process",
    traceableEventsHelper:
      "Model output, tool invocation, human review, approval, policy evaluation, deployment or execution event.",
    additionalEventsLabel:
      "Additional model, policy and authority changes per year",
    additionalEventsHelper:
      "Model versions, policy versions, permission changes and delegated-authority changes.",
    systemsLabel: "Systems containing relevant software and AI history",
    systemsHelper:
      "Source control, CI/CD, model registry, IAM, observability, ticketing, GRC and communication systems.",
    reconstructionCasesLabel:
      "Incidents or governance reviews per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel:
      "Average time to reconstruct one software or AI event",
    currentReconstructionHelper:
      "Current time required to assemble the model, policy, tool, human and execution history.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },

  other: {
    name: "Other Organization",
    shortDescription:
      "A configurable operational-record assessment based on your real processes, evidence sources and costs.",
    primaryObjectsLabel: "Primary operational objects per year",
    primaryObjectsHelper:
      "Products, cases, transactions, assets, projects or other objects you want to represent.",
    traceableEventsLabel: "Traceable events per operational object",
    traceableEventsHelper:
      "Events that should become DDC records.",
    additionalEventsLabel: "Additional operational events per year",
    additionalEventsHelper:
      "Relevant events not captured by the primary-object estimate.",
    systemsLabel: "Systems containing relevant operational history",
    systemsHelper:
      "Number of systems that currently hold the evidence.",
    reconstructionCasesLabel:
      "Cases requiring detailed reconstruction per year",
    reconstructionCasesHelper:
      "Used only for the secondary reconstruction-value panel.",
    currentReconstructionLabel: "Average time to reconstruct one case",
    currentReconstructionHelper:
      "Current reconstruction time.",
    ddcReconstructionLabel: "Estimated reconstruction time with DDC",
    ddcReconstructionHelper:
      "Expected retrieval and verification time. Pilot assumption.",
  },
};

export const EMPTY_OPERATIONAL_VALUE_INPUTS: OperationalValueInputs = {
  companyName: "",

  primaryObjectsPerYear: 0,
  traceableEventsPerObject: 0,
  additionalOperationalEventsPerYear: 0,
  systemsUsed: 0,

  recordHandlingEmployees: 0,
  recordHandlingHoursPerEmployeePerWeek: 0,
  hourlyCost: 0,
  additionalAnnualRecordManagementCost: 0,

  expectedStaffEffortReductionPercent: 0,
  oneTimeImplementationCost: 0,
  annualDdcProgramCost: 0,
  ddcReferencePrice: 0,

  reconstructionCasesPerYear: 0,
  currentReconstructionHoursPerCase: 0,
  ddcReconstructionHoursPerCase: 0,
};

export function calculateOperationalValue(inputs: OperationalValueInputs) {
  const primaryOperationalRecordsPerYear =
    inputs.primaryObjectsPerYear * inputs.traceableEventsPerObject;

  const additionalOperationalRecordsPerYear =
    inputs.additionalOperationalEventsPerYear;

  const estimatedDdcRecordsPerYear =
    primaryOperationalRecordsPerYear +
    additionalOperationalRecordsPerYear;

  const currentManualRecordHandlingCost =
    inputs.recordHandlingEmployees *
    inputs.recordHandlingHoursPerEmployeePerWeek *
    52 *
    inputs.hourlyCost;

  const currentAnnualOperationalRecordCost =
    currentManualRecordHandlingCost +
    inputs.additionalAnnualRecordManagementCost;

  const ddcNetworkConsumption =
    estimatedDdcRecordsPerYear * DDC_REGISTRATION_BASELINE;

  const ddcNetworkCostFiat =
    ddcNetworkConsumption * inputs.ddcReferencePrice;

  const staffReductionRate =
    Math.max(
      0,
      Math.min(100, inputs.expectedStaffEffortReductionPercent)
    ) / 100;

  const ddcEnabledStaffCost =
    currentManualRecordHandlingCost * (1 - staffReductionRate);

  const estimatedAnnualCostWithDdc =
    ddcEnabledStaffCost +
    inputs.annualDdcProgramCost +
    ddcNetworkCostFiat;

  const potentialAnnualSavings =
    currentAnnualOperationalRecordCost - estimatedAnnualCostWithDdc;

  const potentialCostReduction =
    currentAnnualOperationalRecordCost > 0
      ? potentialAnnualSavings / currentAnnualOperationalRecordCost
      : 0;

  const monthlyGrossOperationalSavings =
    potentialAnnualSavings > 0
      ? potentialAnnualSavings / 12
      : 0;

  const estimatedPaybackMonths =
    monthlyGrossOperationalSavings > 0
      ? inputs.oneTimeImplementationCost / monthlyGrossOperationalSavings
      : 0;

  const firstYearNetValue =
    potentialAnnualSavings - inputs.oneTimeImplementationCost;

  const annualReconstructionHoursToday =
    inputs.reconstructionCasesPerYear *
    inputs.currentReconstructionHoursPerCase;

  const annualReconstructionHoursWithDdc =
    inputs.reconstructionCasesPerYear *
    inputs.ddcReconstructionHoursPerCase;

  const reconstructionTimeReduction =
    inputs.currentReconstructionHoursPerCase > 0
      ? Math.max(
          0,
          1 -
            inputs.ddcReconstructionHoursPerCase /
              inputs.currentReconstructionHoursPerCase
        )
      : 0;

  return {
    primaryOperationalRecordsPerYear,
    additionalOperationalRecordsPerYear,
    estimatedDdcRecordsPerYear,

    currentManualRecordHandlingCost,
    currentAnnualOperationalRecordCost,

    ddcNetworkConsumption,
    ddcNetworkCostFiat,
    ddcEnabledStaffCost,
    estimatedAnnualCostWithDdc,

    potentialAnnualSavings,
    potentialCostReduction,
    estimatedPaybackMonths,
    firstYearNetValue,

    annualReconstructionHoursToday,
    annualReconstructionHoursWithDdc,
    reconstructionTimeReduction,
  };
}
