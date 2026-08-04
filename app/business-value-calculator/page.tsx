"use client";

import { useEffect, useMemo, useState } from "react";
import ExecutiveAssessmentReport, {
  type ExecutiveAssessmentReportData,
} from "@/components/business-value/ExecutiveAssessmentReport";
import ExecutiveCover from "@/components/business-value/ExecutiveCover";

type CurrencyCode = "EUR" | "USD";

type IndustryId =
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

type IndustryProfile = {
  name: string;
  shortDescription: string;
  eventLabel: string;
  eventDescription: string;
  reconstructionLabel: string;
  reconstructionDescription: string;
  peopleLabel: string;
  systemsDescription: string;
  directLossLabel: string;
  directLossDescription: string;
  evidenceExamples: string[];
  beforeDescription: string;
  afterDescription: string;
  reportProblem: string;
  pilotScope: string;
  recordType: string;
  recordTitle: string;
  recordEvidence: string[];
  recordMetadata: string[];
};

type AssessmentInputs = {
  companyName: string;
  employees: number;
  eventsPerMonth: number;
  reconstructionHours: number;
  ddcMinutesPerEvent: number;
  peopleInvolved: number;
  ddcPeopleInvolved: number;
  hourlyCost: number;
  systemsUsed: number;
  avoidableWorkPercent: number;
  directLossPerEvent: number;
  expectedReductionPercent: number;
  annualProgramCost: number;
};

const INDUSTRIES: Record<IndustryId, IndustryProfile> = {
  manufacturing: {
    name: "Manufacturing",
    shortDescription:
      "Production traceability, quality investigations, material history and process verification.",
    eventLabel: "Quality or production investigations per month",
    eventDescription:
      "Include defects, customer complaints, rework investigations, machine anomalies and production traceability requests.",
    reconstructionLabel: "Average production reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct how one product, batch or production event occurred.",
    peopleLabel: "Employees involved in each investigation",
    systemsDescription:
      "MES, ERP, quality systems, machine logs, spreadsheets, maintenance records, sensor data and production documents.",
    directLossLabel: "Average direct loss per incident",
    directLossDescription:
      "Estimated scrap, rework, delayed shipment, repeated testing, warranty or claim cost.",
    evidenceExamples: [
      "Material batch and supplier",
      "Machine and tooling parameters",
      "Production shift and operator",
      "Quality-control results",
      "Sensor readings",
      "Maintenance and calibration history",
    ],
    beforeDescription:
      "Production evidence is fragmented across machines, employees, ERP, quality systems and documents.",
    afterDescription:
      "A verifiable production record connects materials, process parameters, quality checks and the final product.",
    reportProblem:
      "reconstructing production history and investigating quality incidents",
    pilotScope:
      "one production line, product family, quality incident or traceability process",
    recordType: "Production Traceability Record",
    recordTitle: "Product Batch and Quality Verification",
    recordEvidence: [
      "Material batch and supplier",
      "Machine and tooling parameters",
      "Production shift and operator",
      "Quality-control results",
      "Sensor readings",
      "Maintenance and calibration history",
    ],
    recordMetadata: [
      "Product or batch identifier",
      "Production timestamp",
      "Machine and line identifier",
      "Quality status",
      "Record version",
      "Verification signature",
    ],
  },

  healthcare: {
    name: "Healthcare",
    shortDescription:
      "Clinical-event reconstruction, record access, treatment changes and medical-device evidence.",
    eventLabel: "Clinical, compliance or record reviews per month",
    eventDescription:
      "Include patient complaints, treatment reviews, access investigations, audit requests and device-related incidents.",
    reconstructionLabel: "Average patient-event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one treatment, access, diagnostic or clinical event.",
    peopleLabel: "Staff involved in each review",
    systemsDescription:
      "Electronic health records, laboratory systems, device logs, pharmacy systems, imaging archives and internal documents.",
    directLossLabel: "Average direct cost per reviewed event",
    directLossDescription:
      "Estimated repeated testing, administrative delay, dispute, compliance or operational cost.",
    evidenceExamples: [
      "Patient-record access",
      "Treatment and dosage changes",
      "Medical-device output",
      "Laboratory and imaging results",
      "Clinical approval",
      "Record modification history",
    ],
    beforeDescription:
      "Clinical evidence is distributed across records, devices, laboratories, departments and access logs.",
    afterDescription:
      "A verifiable clinical-event record connects evidence, access, changes, approvals and timestamps.",
    reportProblem:
      "reconstructing clinical events and proving the integrity of medical evidence",
    pilotScope:
      "one clinical workflow, device-generated record, access process or compliance review",
    recordType: "Clinical Event Record",
    recordTitle: "Patient Event and Evidence Verification",
    recordEvidence: [
      "Patient-record access",
      "Treatment and dosage changes",
      "Medical-device output",
      "Laboratory and imaging results",
      "Clinical approval",
      "Record modification history",
    ],
    recordMetadata: [
      "Clinical event identifier",
      "Patient reference",
      "Authorized user",
      "Device or system source",
      "Event timestamp",
      "Verification signature",
    ],
  },

  transport: {
    name: "Transport & Logistics",
    shortDescription:
      "Trip reconstruction, delivery evidence, fuel anomalies, temperature conditions and maintenance history.",
    eventLabel: "Operational incidents or disputes per month",
    eventDescription:
      "Include delivery disputes, delays, fuel anomalies, route investigations, cargo-condition incidents and maintenance reviews.",
    reconstructionLabel: "Average trip or shipment reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one trip, shipment, delivery or vehicle event.",
    peopleLabel: "Employees involved in each investigation",
    systemsDescription:
      "GPS, telematics, fuel systems, maintenance records, dispatch platforms, temperature sensors and delivery documents.",
    directLossLabel: "Average direct loss per incident",
    directLossDescription:
      "Estimated delay, fuel loss, cargo claim, penalty, repeated delivery or vehicle downtime cost.",
    evidenceExamples: [
      "Vehicle and route history",
      "Fuel consumption",
      "Cargo temperature",
      "Delivery and handover evidence",
      "Driver and dispatch events",
      "Maintenance and service history",
    ],
    beforeDescription:
      "Operational evidence is split across telematics, dispatch, drivers, maintenance systems and delivery documents.",
    afterDescription:
      "A verifiable transport record connects the vehicle, route, cargo conditions, delivery events and maintenance history.",
    reportProblem:
      "reconstructing transport events and resolving operational disputes",
    pilotScope:
      "one vehicle group, route, shipment type, fuel process or delivery workflow",
    recordType: "Transport Event Record",
    recordTitle: "Trip, Cargo and Delivery Verification",
    recordEvidence: [
      "Vehicle and route history",
      "Fuel consumption",
      "Cargo temperature",
      "Delivery and handover evidence",
      "Driver and dispatch events",
      "Maintenance and service history",
    ],
    recordMetadata: [
      "Vehicle identifier",
      "Shipment or route reference",
      "Driver reference",
      "Trip timestamp",
      "Delivery status",
      "Verification signature",
    ],
  },

  banking: {
    name: "Banking & Financial Services",
    shortDescription:
      "Transaction reviews, AML evidence, fraud investigations, credit processes and automated recommendations.",
    eventLabel: "Compliance or transaction reviews per month",
    eventDescription:
      "Include AML investigations, disputed transactions, fraud reviews, credit decisions and audit requests.",
    reconstructionLabel: "Average financial-event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one transaction, approval, recommendation or compliance event.",
    peopleLabel: "Employees involved in each review",
    systemsDescription:
      "Core banking, AML tools, CRM, document systems, risk platforms, email and automated decision systems.",
    directLossLabel: "Average direct exposure per event",
    directLossDescription:
      "Estimated fraud loss, dispute cost, regulatory preparation, delayed approval or repeated-analysis cost.",
    evidenceExamples: [
      "Transaction evidence",
      "AML and risk checks",
      "Documents available at the time",
      "Automated recommendation",
      "Human review and approval",
      "Policy and model version",
    ],
    beforeDescription:
      "Evidence is distributed across transaction, risk, document, communication and approval systems.",
    afterDescription:
      "A verifiable financial-event record connects evidence, automated analysis, human review and final action.",
    reportProblem:
      "reconstructing financial events and preparing reliable compliance evidence",
    pilotScope:
      "one transaction-review, AML, credit, fraud or automated-decision process",
    recordType: "Financial Event Record",
    recordTitle: "Transaction and Compliance Verification",
    recordEvidence: [
      "Transaction evidence",
      "AML and risk checks",
      "Documents available at the time",
      "Automated recommendation",
      "Human review and approval",
      "Policy and model version",
    ],
    recordMetadata: [
      "Transaction reference",
      "Customer or account reference",
      "Risk status",
      "Reviewer identity",
      "Decision timestamp",
      "Verification signature",
    ],
  },

  insurance: {
    name: "Insurance",
    shortDescription:
      "Claims evidence, damage history, expert reports, automated assessment and fraud review.",
    eventLabel: "Claims or investigations per month",
    eventDescription:
      "Include disputed claims, fraud reviews, damage reassessments, customer complaints and audit requests.",
    reconstructionLabel: "Average claim reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one claim from submission through assessment and resolution.",
    peopleLabel: "Employees or experts involved per claim",
    systemsDescription:
      "Claims platforms, photographs, expert reports, CRM, policy systems, repair estimates and automated assessments.",
    directLossLabel: "Average avoidable claim cost",
    directLossDescription:
      "Estimated overpayment, repeated assessment, fraud exposure, dispute or administrative cost.",
    evidenceExamples: [
      "Submitted documents and photographs",
      "Policy version",
      "Damage assessment",
      "Expert report",
      "Automated recommendation",
      "Claim modification history",
    ],
    beforeDescription:
      "Claims evidence is fragmented across customers, experts, photographs, policy systems and assessment tools.",
    afterDescription:
      "A verifiable claim record connects every submitted item, assessment, modification and approval.",
    reportProblem:
      "reconstructing claims and verifying the evidence used during assessment",
    pilotScope:
      "one claim category, damage-assessment process or fraud-review workflow",
    recordType: "Insurance Claim Record",
    recordTitle: "Claim Evidence and Assessment Verification",
    recordEvidence: [
      "Submitted documents and photographs",
      "Policy version",
      "Damage assessment",
      "Expert report",
      "Automated recommendation",
      "Claim modification history",
    ],
    recordMetadata: [
      "Claim identifier",
      "Policy reference",
      "Assessment status",
      "Expert or reviewer identity",
      "Claim timestamp",
      "Verification signature",
    ],
  },

  energy: {
    name: "Energy & Utilities",
    shortDescription:
      "Grid events, meter evidence, equipment history, maintenance and outage recovery.",
    eventLabel: "Operational or equipment incidents per month",
    eventDescription:
      "Include outages, meter disputes, equipment failures, maintenance investigations and recovery reviews.",
    reconstructionLabel: "Average event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one grid, meter, equipment or maintenance event.",
    peopleLabel: "Engineers and operators involved",
    systemsDescription:
      "SCADA, sensor platforms, meters, maintenance systems, field reports, control-room logs and asset records.",
    directLossLabel: "Average direct operational loss",
    directLossDescription:
      "Estimated downtime, service interruption, field work, repeated inspection, penalty or equipment loss.",
    evidenceExamples: [
      "Sensor and meter readings",
      "Equipment state",
      "Operator actions",
      "Maintenance history",
      "Outage sequence",
      "Recovery and confirmation events",
    ],
    beforeDescription:
      "Operational evidence is distributed across sensors, field teams, control systems and maintenance records.",
    afterDescription:
      "A verifiable energy-event record preserves the complete sequence from detection through recovery.",
    reportProblem:
      "reconstructing operational events and verifying infrastructure history",
    pilotScope:
      "one substation, meter process, maintenance workflow or outage category",
    recordType: "Energy Infrastructure Record",
    recordTitle: "Grid, Meter and Equipment Event Verification",
    recordEvidence: [
      "Sensor and meter readings",
      "Equipment state",
      "Operator actions",
      "Maintenance history",
      "Outage sequence",
      "Recovery and confirmation events",
    ],
    recordMetadata: [
      "Asset identifier",
      "Grid or meter reference",
      "Operator identity",
      "Event timestamp",
      "Recovery status",
      "Verification signature",
    ],
  },

  government: {
    name: "Government & Public Administration",
    shortDescription:
      "Decision history, approvals, public records, procurement evidence and institutional accountability.",
    eventLabel: "Decision, procurement or compliance reviews per month",
    eventDescription:
      "Include administrative decisions, procurement reviews, complaints, audits and public-record requests.",
    reconstructionLabel: "Average decision reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one decision, approval, procurement or administrative action.",
    peopleLabel: "Officials or departments involved",
    systemsDescription:
      "Document systems, email, case management, procurement platforms, meeting records and approval archives.",
    directLossLabel: "Average administrative or legal cost",
    directLossDescription:
      "Estimated repeated work, legal preparation, dispute, delay or audit-response cost.",
    evidenceExamples: [
      "Evidence available at the time",
      "Decision and rationale",
      "Approval and responsibility",
      "Document version",
      "Procurement record",
      "Institutional timeline",
    ],
    beforeDescription:
      "Evidence, approvals and responsibility are fragmented across departments, documents and communication systems.",
    afterDescription:
      "A verifiable institutional record preserves evidence, decisions, approvals and the complete timeline.",
    reportProblem:
      "reconstructing institutional actions and proving responsibility",
    pilotScope:
      "one administrative, procurement, approval or public-record process",
    recordType: "Institutional Action Record",
    recordTitle: "Decision, Approval and Evidence Verification",
    recordEvidence: [
      "Evidence available at the time",
      "Decision and rationale",
      "Approval and responsibility",
      "Document version",
      "Procurement record",
      "Institutional timeline",
    ],
    recordMetadata: [
      "Case or decision identifier",
      "Institutional unit",
      "Responsible official",
      "Approval timestamp",
      "Record status",
      "Verification signature",
    ],
  },

  construction: {
    name: "Construction & Infrastructure",
    shortDescription:
      "Project versions, material installation, inspections, site evidence and change history.",
    eventLabel: "Project disputes or traceability reviews per month",
    eventDescription:
      "Include design changes, material disputes, inspection reviews, delay analysis and contractor claims.",
    reconstructionLabel: "Average project-event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one change, installation, inspection or site event.",
    peopleLabel: "Project participants involved",
    systemsDescription:
      "BIM, project management, drawings, inspection reports, photographs, procurement and contractor documents.",
    directLossLabel: "Average direct loss per event",
    directLossDescription:
      "Estimated delay, rework, repeated inspection, material replacement, claim or legal cost.",
    evidenceExamples: [
      "Applicable design version",
      "Installed material",
      "Inspection and supervision",
      "Site photographs",
      "Contractor and supplier evidence",
      "Change and approval history",
    ],
    beforeDescription:
      "Project evidence is fragmented across drawings, contractors, photographs, inspections and document versions.",
    afterDescription:
      "A verifiable project record connects the applicable design, installed work, evidence, inspection and changes.",
    reportProblem:
      "reconstructing project events and proving what was built, inspected and approved",
    pilotScope:
      "one construction stage, material group, inspection process or project change workflow",
    recordType: "Construction Project Record",
    recordTitle: "Project, Material and Inspection Verification",
    recordEvidence: [
      "Applicable design version",
      "Installed material",
      "Inspection and supervision",
      "Site photographs",
      "Contractor and supplier evidence",
      "Change and approval history",
    ],
    recordMetadata: [
      "Project identifier",
      "Site or section reference",
      "Contractor identity",
      "Inspection timestamp",
      "Approval status",
      "Verification signature",
    ],
  },

  retail: {
    name: "Retail & Supply Chain",
    shortDescription:
      "Product origin, inventory events, supplier evidence, returns and quality history.",
    eventLabel: "Product, return or inventory investigations per month",
    eventDescription:
      "Include supplier disputes, returns, stock discrepancies, product complaints and traceability requests.",
    reconstructionLabel: "Average product-event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one product, supplier, inventory or return event.",
    peopleLabel: "Employees involved in each investigation",
    systemsDescription:
      "POS, ERP, warehouse systems, supplier documents, inventory platforms, quality records and customer service.",
    directLossLabel: "Average direct loss per event",
    directLossDescription:
      "Estimated write-off, return, stock loss, supplier dispute, repeated handling or customer-compensation cost.",
    evidenceExamples: [
      "Supplier and product batch",
      "Warehouse and inventory history",
      "Sale and return event",
      "Quality evidence",
      "Storage conditions",
      "Customer complaint timeline",
    ],
    beforeDescription:
      "Product evidence is fragmented across suppliers, warehouses, stores, inventory and customer-service systems.",
    afterDescription:
      "A verifiable product record connects origin, movement, sale, quality evidence and return history.",
    reportProblem:
      "reconstructing product and inventory events",
    pilotScope:
      "one product category, supplier, warehouse flow or returns process",
    recordType: "Retail Supply Record",
    recordTitle: "Product, Inventory and Return Verification",
    recordEvidence: [
      "Supplier and product batch",
      "Warehouse and inventory history",
      "Sale and return event",
      "Quality evidence",
      "Storage conditions",
      "Customer complaint timeline",
    ],
    recordMetadata: [
      "Product or SKU identifier",
      "Supplier reference",
      "Warehouse or store",
      "Inventory timestamp",
      "Return status",
      "Verification signature",
    ],
  },

  technology: {
    name: "Technology, AI & Software",
    shortDescription:
      "Software releases, model versions, automated outputs, incidents and approval history.",
    eventLabel: "Release, incident or model reviews per month",
    eventDescription:
      "Include production incidents, model-output reviews, release investigations, security events and customer disputes.",
    reconstructionLabel: "Average technical-event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one release, automated output, incident or system change.",
    peopleLabel: "Engineers and reviewers involved",
    systemsDescription:
      "Source control, CI/CD, model registry, observability, ticketing, security tools and internal communication.",
    directLossLabel: "Average direct loss per event",
    directLossDescription:
      "Estimated downtime, engineering response, rollback, repeated analysis, customer compensation or compliance cost.",
    evidenceExamples: [
      "Software and model version",
      "Input and output evidence",
      "Configuration and policy state",
      "Release and deployment history",
      "Human review",
      "Incident-response timeline",
    ],
    beforeDescription:
      "Technical evidence is fragmented across repositories, deployment tools, monitoring systems and communications.",
    afterDescription:
      "A verifiable technical record connects the exact version, configuration, evidence, output and approval.",
    reportProblem:
      "reconstructing releases, automated outputs and technical incidents",
    pilotScope:
      "one release process, AI workflow, production incident or automated-decision system",
    recordType: "Technology Event Record",
    recordTitle: "Release, Model and Incident Verification",
    recordEvidence: [
      "Software and model version",
      "Input and output evidence",
      "Configuration and policy state",
      "Release and deployment history",
      "Human review",
      "Incident-response timeline",
    ],
    recordMetadata: [
      "Release or model identifier",
      "Environment reference",
      "Responsible team",
      "Deployment timestamp",
      "Incident status",
      "Verification signature",
    ],
  },

  other: {
    name: "Other Organization",
    shortDescription:
      "A configurable assessment for operational processes, evidence and traceability.",
    eventLabel: "Operational reviews or investigations per month",
    eventDescription:
      "Include any event where the organization must reconstruct what happened and prove the supporting evidence.",
    reconstructionLabel: "Average event reconstruction time",
    reconstructionDescription:
      "Time required to reconstruct one operational event or process history.",
    peopleLabel: "Employees involved in each review",
    systemsDescription:
      "All systems, documents, devices and employees containing relevant evidence.",
    directLossLabel: "Average direct loss per event",
    directLossDescription:
      "Estimated operational, legal, quality, delay, repeated-work or dispute cost.",
    evidenceExamples: [
      "Operational event",
      "Evidence source",
      "Process history",
      "Changes and approvals",
      "Responsible systems or people",
      "Verification timeline",
    ],
    beforeDescription:
      "Relevant evidence is fragmented across multiple systems, documents and participants.",
    afterDescription:
      "A verifiable operational record connects the relevant evidence and complete event history.",
    reportProblem:
      "reconstructing operational events across fragmented evidence sources",
    pilotScope:
      "one important operational process selected by the organization",
    recordType: "Operational Event Record",
    recordTitle: "Operational Evidence Verification",
    recordEvidence: [
      "Operational event",
      "Evidence source",
      "Process history",
      "Changes and approvals",
      "Responsible systems or people",
      "Verification timeline",
    ],
    recordMetadata: [
      "Event identifier",
      "Process reference",
      "Responsible entity",
      "Event timestamp",
      "Verification status",
      "Digital signature",
    ],
  },
};

const INDUSTRY_ORDER: IndustryId[] = [
  "manufacturing",
  "healthcare",
  "transport",
  "banking",
  "insurance",
  "energy",
  "government",
  "construction",
  "retail",
  "technology",
  "other",
];

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const DEFAULTS_BY_INDUSTRY: Record<
  IndustryId,
  Omit<AssessmentInputs, "companyName">
> = {
  manufacturing: {
    employees: 500,
    eventsPerMonth: 8,
    reconstructionHours: 8,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 6,
    ddcPeopleInvolved: 1,
    hourlyCost: 45,
    systemsUsed: 7,
    avoidableWorkPercent: 30,
    directLossPerEvent: 5000,
    expectedReductionPercent: 70,
    annualProgramCost: 60000,
  },

  healthcare: {
    employees: 800,
    eventsPerMonth: 12,
    reconstructionHours: 5,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 5,
    ddcPeopleInvolved: 1,
    hourlyCost: 55,
    systemsUsed: 6,
    avoidableWorkPercent: 25,
    directLossPerEvent: 2000,
    expectedReductionPercent: 60,
    annualProgramCost: 80000,
  },

  transport: {
    employees: 300,
    eventsPerMonth: 20,
    reconstructionHours: 4,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 4,
    ddcPeopleInvolved: 1,
    hourlyCost: 38,
    systemsUsed: 6,
    avoidableWorkPercent: 25,
    directLossPerEvent: 1800,
    expectedReductionPercent: 65,
    annualProgramCost: 50000,
  },

  banking: {
    employees: 1000,
    eventsPerMonth: 30,
    reconstructionHours: 7,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 6,
    ddcPeopleInvolved: 1,
    hourlyCost: 70,
    systemsUsed: 8,
    avoidableWorkPercent: 35,
    directLossPerEvent: 7500,
    expectedReductionPercent: 60,
    annualProgramCost: 120000,
  },

  insurance: {
    employees: 600,
    eventsPerMonth: 35,
    reconstructionHours: 5,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 4,
    ddcPeopleInvolved: 1,
    hourlyCost: 52,
    systemsUsed: 7,
    avoidableWorkPercent: 30,
    directLossPerEvent: 3000,
    expectedReductionPercent: 65,
    annualProgramCost: 90000,
  },

  energy: {
    employees: 700,
    eventsPerMonth: 10,
    reconstructionHours: 10,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 7,
    ddcPeopleInvolved: 1,
    hourlyCost: 60,
    systemsUsed: 8,
    avoidableWorkPercent: 30,
    directLossPerEvent: 12000,
    expectedReductionPercent: 55,
    annualProgramCost: 130000,
  },

  government: {
    employees: 500,
    eventsPerMonth: 15,
    reconstructionHours: 8,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 8,
    ddcPeopleInvolved: 1,
    hourlyCost: 42,
    systemsUsed: 6,
    avoidableWorkPercent: 35,
    directLossPerEvent: 1000,
    expectedReductionPercent: 60,
    annualProgramCost: 70000,
  },

  construction: {
    employees: 250,
    eventsPerMonth: 8,
    reconstructionHours: 12,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 7,
    ddcPeopleInvolved: 1,
    hourlyCost: 48,
    systemsUsed: 7,
    avoidableWorkPercent: 35,
    directLossPerEvent: 10000,
    expectedReductionPercent: 60,
    annualProgramCost: 75000,
  },

  retail: {
    employees: 1000,
    eventsPerMonth: 40,
    reconstructionHours: 3,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 3,
    ddcPeopleInvolved: 1,
    hourlyCost: 32,
    systemsUsed: 6,
    avoidableWorkPercent: 25,
    directLossPerEvent: 800,
    expectedReductionPercent: 65,
    annualProgramCost: 65000,
  },

  technology: {
    employees: 300,
    eventsPerMonth: 15,
    reconstructionHours: 10,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 6,
    ddcPeopleInvolved: 1,
    hourlyCost: 75,
    systemsUsed: 8,
    avoidableWorkPercent: 30,
    directLossPerEvent: 8000,
    expectedReductionPercent: 65,
    annualProgramCost: 85000,
  },

  other: {
    employees: 300,
    eventsPerMonth: 10,
    reconstructionHours: 6,
    ddcMinutesPerEvent: 10,
    peopleInvolved: 5,
    ddcPeopleInvolved: 1,
    hourlyCost: 45,
    systemsUsed: 5,
    avoidableWorkPercent: 30,
    directLossPerEvent: 2500,
    expectedReductionPercent: 60,
    annualProgramCost: 60000,
  },
};

const ASSESSMENT_STORAGE_KEY = "ddc-business-value-assessment-v1";


function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function Field({
  label,
  description,
  value,
  suffix,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  onChange,
}: {
  label: string;
  description?: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {


  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-200">{label}</span>

      {description && (
        <span className="mt-1 block text-sm leading-relaxed text-slate-100">
          {description}
        </span>
      )}

      <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950/70 focus-within:border-blue-400">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const parsed = Number(event.target.value);

            onChange(
              Number.isFinite(parsed)
                ? clamp(parsed, min, max)
                : minimumValue(min)
            );
          }}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
        />

        {suffix && (
          <span className="flex items-center border-l border-slate-700 px-3 text-sm text-slate-200">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function minimumValue(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function Metric({
  label,
  value,
  description,
  highlighted = false,
}: {
  label: string;
  value: string;
  description?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        highlighted
          ? "assessment-metric rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5"
          : "assessment-metric rounded-2xl border border-slate-800 bg-slate-950/90 p-5"
      }
    >
      <p className="text-sm uppercase tracking-[0.15em] text-slate-100">
        {label}
      </p>

      <p
        className={
          highlighted
            ? "mt-2 text-3xl font-semibold text-emerald-200"
            : "mt-2 text-3xl font-semibold text-white"
        }
      >
        {value}
      </p>

      {description && (
        <p className="mt-2 text-sm leading-relaxed text-slate-100">
          {description}
        </p>
      )}
    </div>
  );
}

export default function BusinessValueAssessmentPage() {
  const [industryId, setIndustryId] =
    useState<IndustryId>("manufacturing");

  const [currency, setCurrency] = useState<CurrencyCode>("EUR");

  const [inputs, setInputs] = useState<AssessmentInputs>({
    companyName: "",
    ...DEFAULTS_BY_INDUSTRY.manufacturing,
  });

  const [assessmentLoaded, setAssessmentLoaded] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
const profile = INDUSTRIES[industryId];

  const money = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency]
  );

  const update = <K extends keyof AssessmentInputs>(
    key: K,
    value: AssessmentInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        ASSESSMENT_STORAGE_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved) as {
          industryId?: IndustryId;
          currency?: CurrencyCode;
          inputs?: AssessmentInputs;
        };

        if (
          parsed.industryId &&
          INDUSTRIES[parsed.industryId]
        ) {
          setIndustryId(parsed.industryId);
        }

        if (
          parsed.currency === "EUR" ||
          parsed.currency === "USD"
        ) {
          setCurrency(parsed.currency);
        }

        if (parsed.inputs) {
          const restoredIndustry =
            parsed.industryId &&
            INDUSTRIES[parsed.industryId]
              ? parsed.industryId
              : "manufacturing";

          const defaults =
            DEFAULTS_BY_INDUSTRY[restoredIndustry];

          setInputs({
            companyName:
              typeof parsed.inputs.companyName === "string"
                ? parsed.inputs.companyName
                : "",

            employees:
              Number.isFinite(parsed.inputs.employees)
                ? parsed.inputs.employees
                : defaults.employees,

            eventsPerMonth:
              Number.isFinite(parsed.inputs.eventsPerMonth)
                ? parsed.inputs.eventsPerMonth
                : defaults.eventsPerMonth,

            reconstructionHours:
              Number.isFinite(parsed.inputs.reconstructionHours)
                ? parsed.inputs.reconstructionHours
                : defaults.reconstructionHours,

            ddcMinutesPerEvent:
              Number.isFinite(parsed.inputs.ddcMinutesPerEvent)
                ? parsed.inputs.ddcMinutesPerEvent
                : defaults.ddcMinutesPerEvent,

            peopleInvolved:
              Number.isFinite(parsed.inputs.peopleInvolved)
                ? parsed.inputs.peopleInvolved
                : defaults.peopleInvolved,

            ddcPeopleInvolved:
              Number.isFinite(parsed.inputs.ddcPeopleInvolved)
                ? parsed.inputs.ddcPeopleInvolved
                : defaults.ddcPeopleInvolved,

            hourlyCost:
              Number.isFinite(parsed.inputs.hourlyCost)
                ? parsed.inputs.hourlyCost
                : defaults.hourlyCost,

            systemsUsed:
              Number.isFinite(parsed.inputs.systemsUsed)
                ? parsed.inputs.systemsUsed
                : defaults.systemsUsed,

            avoidableWorkPercent:
              Number.isFinite(parsed.inputs.avoidableWorkPercent)
                ? parsed.inputs.avoidableWorkPercent
                : defaults.avoidableWorkPercent,

            directLossPerEvent:
              Number.isFinite(parsed.inputs.directLossPerEvent)
                ? parsed.inputs.directLossPerEvent
                : defaults.directLossPerEvent,

            expectedReductionPercent:
              Number.isFinite(parsed.inputs.expectedReductionPercent)
                ? parsed.inputs.expectedReductionPercent
                : defaults.expectedReductionPercent,

            annualProgramCost:
              Number.isFinite(parsed.inputs.annualProgramCost)
                ? parsed.inputs.annualProgramCost
                : defaults.annualProgramCost,
          });
        }
      }
    } catch (error) {
      console.warn(
        "Unable to restore saved DDC assessment:",
        error
      );
    } finally {
      setAssessmentLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!assessmentLoaded) return;

    try {
      window.localStorage.setItem(
        ASSESSMENT_STORAGE_KEY,
        JSON.stringify({
          industryId,
          currency,
          inputs,
        })
      );
    } catch (error) {
      console.warn(
        "Unable to save DDC assessment:",
        error
      );
    }
  }, [
    assessmentLoaded,
    industryId,
    currency,
    inputs,
  ]);

  const selectIndustry = (nextIndustryId: IndustryId) => {
    setIndustryId(nextIndustryId);

    setInputs((current) => ({
      companyName: current.companyName,
      ...DEFAULTS_BY_INDUSTRY[nextIndustryId],
    }));
  };

  const resetAssessment = () => {
    const defaults = DEFAULTS_BY_INDUSTRY[industryId];

    setInputs({
      companyName: "",
      ...defaults,
    });

    setAssessmentId(createAssessmentId());

    try {
      window.localStorage.removeItem(
        ASSESSMENT_STORAGE_KEY
      );
    } catch (error) {
      console.warn(
        "Unable to clear saved DDC assessment:",
        error
      );
    }

    setResetMessage(
      `${INDUSTRIES[industryId].name} assessment reset`
    );

    window.setTimeout(() => {
      setResetMessage("");
    }, 2500);
  };

  const results = useMemo(() => {
    const annualEvents = inputs.eventsPerMonth * 12;

    const directLaborHours =
      annualEvents *
      inputs.reconstructionHours *
      inputs.peopleInvolved;

    const directLaborCost =
      directLaborHours * inputs.hourlyCost;

    const fragmentationRate = Math.min(
      0.5,
      Math.max(0, (inputs.systemsUsed - 1) * 0.05)
    );

    const fragmentationCost =
      directLaborCost * fragmentationRate;

    const repeatedWorkCost =
      (directLaborCost + fragmentationCost) *
      (inputs.avoidableWorkPercent / 100);

    const directOperationalLoss =
      annualEvents * inputs.directLossPerEvent;

    const annualCostToday =
      directLaborCost +
      fragmentationCost +
      repeatedWorkCost +
      directOperationalLoss;

    const reductionRate =
      inputs.expectedReductionPercent / 100;

    const ddcHoursPerEvent =
      inputs.ddcMinutesPerEvent / 60;

    const ddcAnnualLaborHours =
      annualEvents *
      ddcHoursPerEvent *
      inputs.ddcPeopleInvolved;

    const ddcLaborCost =
      ddcAnnualLaborHours * inputs.hourlyCost;

    /*
     * DDC time and staffing costs are calculated directly from
     * the values entered by the organization.
     *
     * The improvement percentage applies only to the remaining
     * fragmentation, repeated work and direct operational losses.
     */
    const residualRate = 1 - reductionRate;

    const ddcFragmentationCost =
      fragmentationCost * residualRate;

    const ddcRepeatedWorkCost =
      repeatedWorkCost * residualRate;

    const ddcOperationalLoss =
      directOperationalLoss * residualRate;

    const annualOperatingCostWithDdc =
      ddcLaborCost +
      ddcFragmentationCost +
      ddcRepeatedWorkCost +
      ddcOperationalLoss;

    const annualCostWithDdc =
      annualOperatingCostWithDdc +
      inputs.annualProgramCost;

    const potentialGrossSavings =
      annualCostToday - annualOperatingCostWithDdc;

    const netAnnualValue =
      annualCostToday - annualCostWithDdc;

    const recoveredHours =
      Math.max(
        0,
        directLaborHours - ddcAnnualLaborHours
      );

    const paybackMonths =
      potentialGrossSavings > 0
        ? (inputs.annualProgramCost / potentialGrossSavings) * 12
        : 0;

    const firstYearRoi =
      inputs.annualProgramCost > 0
        ? (netAnnualValue / inputs.annualProgramCost) * 100
        : 0;

    const timeReductionPercent =
      inputs.reconstructionHours > 0
        ? Math.max(
            0,
            (
              1 -
              ddcHoursPerEvent /
                inputs.reconstructionHours
            ) * 100
          )
        : 0;

    return {
      annualEvents,
      directLaborHours,
      directLaborCost,
      fragmentationRate,
      fragmentationCost,
      repeatedWorkCost,
      directOperationalLoss,
      annualCostToday,

      ddcHoursPerEvent,
      ddcAnnualLaborHours,
      ddcLaborCost,
      ddcFragmentationCost,
      ddcRepeatedWorkCost,
      ddcOperationalLoss,
      annualOperatingCostWithDdc,
      annualCostWithDdc,

      potentialGrossSavings,
      netAnnualValue,
      recoveredHours,
      paybackMonths,
      firstYearRoi,
      timeReductionPercent,
    };
  }, [inputs]);

  const internalBenchmark = useMemo(() => {
    const sectorDefault =
      DEFAULTS_BY_INDUSTRY[industryId];

    const benchmarkAnnualEvents =
      sectorDefault.eventsPerMonth * 12;

    const benchmarkDirectLaborHours =
      benchmarkAnnualEvents *
      sectorDefault.reconstructionHours *
      sectorDefault.peopleInvolved;

    const benchmarkDirectLaborCost =
      benchmarkDirectLaborHours *
      sectorDefault.hourlyCost;

    const benchmarkFragmentationRate = Math.min(
      0.5,
      Math.max(
        0,
        (sectorDefault.systemsUsed - 1) * 0.05
      )
    );

    const benchmarkFragmentationCost =
      benchmarkDirectLaborCost *
      benchmarkFragmentationRate;

    const benchmarkRepeatedWorkCost =
      (
        benchmarkDirectLaborCost +
        benchmarkFragmentationCost
      ) *
      (sectorDefault.avoidableWorkPercent / 100);

    const benchmarkDirectOperationalLoss =
      benchmarkAnnualEvents *
      sectorDefault.directLossPerEvent;

    const benchmarkAnnualCost =
      benchmarkDirectLaborCost +
      benchmarkFragmentationCost +
      benchmarkRepeatedWorkCost +
      benchmarkDirectOperationalLoss;

    const differencePercent =
      benchmarkAnnualCost > 0
        ? (
            (results.annualCostToday -
              benchmarkAnnualCost) /
            benchmarkAnnualCost
          ) * 100
        : 0;

    return {
      annualCost: benchmarkAnnualCost,
      differencePercent,
    };
  }, [
    industryId,
    results.annualCostToday,
  ]);

  const businessValueScore = useMemo(() => {
    const savingsRate =
      results.annualCostToday > 0
        ? Math.max(
            0,
            results.netAnnualValue / results.annualCostToday
          )
        : 0;

    let score = 0;

    score += Math.min(35, savingsRate * 50);
    score += Math.min(
      25,
      results.timeReductionPercent * 0.25
    );
    score +=
      results.paybackMonths > 0
        ? Math.max(0, 20 - results.paybackMonths * 2)
        : 0;
    score += Math.min(
      20,
      results.recoveredHours / 250
    );

    const normalized = Math.max(
      0,
      Math.min(100, Math.round(score))
    );

    const level =
      normalized >= 80
        ? "Very high"
        : normalized >= 65
        ? "High"
        : normalized >= 45
        ? "Moderate"
        : "Limited";

    const recommendation =
      normalized >= 65
        ? "Strong candidate for a measured pilot"
        : normalized >= 45
        ? "Pilot recommended after refining assumptions"
        : "Review process scope and assumptions before pilot";

    return {
      score: normalized,
      level,
      recommendation,
    };
  }, [
    results.annualCostToday,
    results.netAnnualValue,
    results.timeReductionPercent,
    results.paybackMonths,
    results.recoveredHours,
  ]);

  const costComposition = useMemo(() => {
    const total = Math.max(1, results.annualCostToday);

    return [
      {
        label: "Employee reconstruction",
        value: results.directLaborCost,
      },
      {
        label: "Search and coordination",
        value: results.fragmentationCost,
      },
      {
        label: "Repeated work",
        value: results.repeatedWorkCost,
      },
      {
        label: "Direct operational loss",
        value: results.directOperationalLoss,
      },
    ].map((item) => ({
      ...item,
      percentage: (item.value / total) * 100,
    }));
  }, [
    results.annualCostToday,
    results.directLaborCost,
    results.fragmentationCost,
    results.repeatedWorkCost,
    results.directOperationalLoss,
  ]);

  const sensitivityScenarios = useMemo(() => {
    return [40, 50, 60, 70, 80].map((improvementPercent) => {
      const reductionRate = improvementPercent / 100;
      const residualRate = 1 - reductionRate;

      const operatingCostWithDdc =
        results.ddcLaborCost +
        results.fragmentationCost * residualRate +
        results.repeatedWorkCost * residualRate +
        results.directOperationalLoss * residualRate;

      const totalCostWithDdc =
        operatingCostWithDdc + inputs.annualProgramCost;

      const netAnnualValue =
        results.annualCostToday - totalCostWithDdc;

      const grossSavings =
        results.annualCostToday - operatingCostWithDdc;

      const paybackMonths =
        grossSavings > 0
          ? (inputs.annualProgramCost / grossSavings) * 12
          : 0;

      return {
        improvementPercent,
        totalCostWithDdc,
        netAnnualValue,
        paybackMonths,
      };
    });
  }, [
    results.ddcLaborCost,
    results.fragmentationCost,
    results.repeatedWorkCost,
    results.directOperationalLoss,
    results.annualCostToday,
    inputs.annualProgramCost,
  ]);


  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [assessmentId, setAssessmentId] = useState("");

  const createAssessmentId = () => {
    const now = new Date();

    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");

    const randomPart = Math.floor(
      100000 + Math.random() * 900000
    );

    return `DDT-BVA-${datePart}-${randomPart}`;
  };

  useEffect(() => {
    setAssessmentId(createAssessmentId());
  }, []);

  const reportCurrencySymbol =
    currency === "USD" ? "$" : "€";

  const pilotRecommendation = useMemo(() => {
    const baseDuration =
      results.annualCostToday >= 1000000
        ? "6–8 weeks"
        : results.annualCostToday >= 250000
        ? "4–6 weeks"
        : "3–4 weeks";

    const integrationCount =
      inputs.systemsUsed >= 8
        ? "3–4 evidence-source integrations"
        : inputs.systemsUsed >= 5
        ? "2–3 evidence-source integrations"
        : "1–2 evidence-source integrations";

    const eventSample =
      results.annualEvents >= 300
        ? "30–50 representative events"
        : results.annualEvents >= 100
        ? "20–30 representative events"
        : "10–20 representative events";

    return {
      duration: baseDuration,
      integrations: integrationCount,
      sample: eventSample,
      scope: profile.pilotScope,
    };
  }, [
    results.annualCostToday,
    results.annualEvents,
    inputs.systemsUsed,
    profile.pilotScope,
  ]);

  const executiveReportData =
    useMemo<ExecutiveAssessmentReportData>(() => {
      const grossAnnualSavings =
        results.netAnnualValue +
        inputs.annualProgramCost;

      return {
        assessmentId,
        generatedDate,
        companyName: inputs.companyName,
        industryName: profile.name,

        currencySymbol: reportCurrencySymbol,

        reconstructionHours:
          inputs.reconstructionHours,
        ddcMinutesPerEvent:
          inputs.ddcMinutesPerEvent,
        peopleInvolved:
          inputs.peopleInvolved,
        ddcPeopleInvolved:
          inputs.ddcPeopleInvolved,
        systemsUsed:
          inputs.systemsUsed,
        avoidableWorkPercent:
          inputs.avoidableWorkPercent,
        expectedReductionPercent:
          inputs.expectedReductionPercent,
        annualProgramCost:
          inputs.annualProgramCost,

        annualCostToday:
          results.annualCostToday,
        annualCostWithDdc:
          results.annualCostWithDdc,
        grossAnnualSavings,
        netAnnualValue:
          results.netAnnualValue,
        recoveredHours:
          results.recoveredHours,
        paybackMonths:
          results.paybackMonths,
        firstYearRoi:
          results.firstYearRoi,
        timeReductionPercent:
          results.timeReductionPercent,

        directLaborCost:
          results.directLaborCost,
        fragmentationCost:
          results.fragmentationCost,
        repeatedWorkCost:
          results.repeatedWorkCost,
        directOperationalLoss:
          results.directOperationalLoss,

        reportProblem:
          profile.reportProblem,

        beforeDescription:
          `Operational evidence for ${profile.name.toLowerCase()} is currently distributed across ${inputs.systemsUsed} systems and requires manual reconstruction by ${inputs.peopleInvolved} employees.`,

        afterDescription:
          `A tailored ${profile.recordType} connects the relevant evidence, verification status and operational history in one structured DDT record.`,

        recordTitle:
          profile.recordTitle,
        recordType:
          profile.recordType,
        recordEvidence:
          profile.recordEvidence,
        recordMetadata:
          profile.recordMetadata,

        pilotScope:
          pilotRecommendation.scope,
        pilotDuration:
          pilotRecommendation.duration,
        pilotIntegrations:
          pilotRecommendation.integrations,
        pilotSample:
          pilotRecommendation.sample,

        sensitivityScenarios,
      };
    }, [
      assessmentId,
      generatedDate,
      inputs,
      pilotRecommendation,
      profile,
      reportCurrencySymbol,
      results,
      sensitivityScenarios,
    ]);



  const printExecutiveReport = () => {
    const storageKey =
      `ddt-business-report:${assessmentId}`;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          savedAt: Date.now(),
          data: executiveReportData,
        })
      );
    } catch (error) {
      console.error(
        "Unable to prepare executive report:",
        error
      );

      window.alert(
        "The executive report could not be prepared. Please try again."
      );

      return;
    }

    const reportUrl =
      `/business-value-calculator/report?key=${encodeURIComponent(
        storageKey
      )}`;

    window.open(
      reportUrl,
      "_blank"
    );
  };
return (
    <main className="min-h-screen bg-slate-950 pb-28 text-white sm:pb-24">
      <section className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
            DDT Business Value Assessment
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
            How much is fragmented operational evidence costing your
            organization?
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-slate-100">
            Estimate the financial impact of reconstructing products,
            incidents, treatments, shipments, claims, infrastructure events or
            institutional actions across disconnected evidence sources.
          </p>

          <div className="mt-8 max-w-5xl rounded-2xl border border-blue-400/25 bg-blue-500/10 p-5 text-sm leading-relaxed text-blue-100">
            DDC is not limited to one predefined record type. The record
            structure, evidence sources, verification rules, access permissions
            and business-value model are adapted to each organization’s real
            processes, risks and requirements.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
            Step 1
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            What best describes your organization?
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_ORDER.map((id) => {
              const item = INDUSTRIES[id];
              const selected = industryId === id;

  return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectIndustry(id)}
                  className={
                    selected
                      ? "rounded-2xl border border-blue-400 bg-blue-500/15 p-4 text-left"
                      : "rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-left transition hover:border-slate-600"
                  }
                >
                  <span
                    className={
                      selected
                        ? "font-semibold text-blue-200"
                        : "font-semibold text-white"
                    }
                  >
                    {item.name}
                  </span>

                  <span className="mt-2 block text-sm leading-relaxed text-slate-100">
                    {item.shortDescription}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-relaxed text-emerald-100/95">
            The questions below are adapted to the selected sector. A real DDC
            implementation is further tailored to the organization’s specific
            processes, evidence sources, operational risks and compliance
            requirements.
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
                Step 2
              </p>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold">
                  {profile.name} assessment
                </h2>

                <div className="print:hidden flex flex-col items-start gap-2 sm:items-end">
                  <button
                    type="button"
                    onClick={resetAssessment}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-amber-400 hover:text-amber-200"
                  >
                    Reset assessment
                  </button>

                  {resetMessage && (
                    <span
                      role="status"
                      className="text-sm font-medium text-emerald-200"
                    >
                      {resetMessage}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="block text-sm font-medium text-slate-200">
                    Report currency
                  </span>

                  <select
                    value={currency}
                    onChange={(event) =>
                      setCurrency(event.target.value as CurrencyCode)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
                  >
                    <option value="EUR">EUR — Euro (€)</option>
                    <option value="USD">USD — US Dollar ($)</option>
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-slate-200">
                    Company or assessment name
                  </span>

                  <input
                    type="text"
                    value={inputs.companyName}
                    onChange={(event) =>
                      update("companyName", event.target.value)
                    }
                    placeholder="Example: Production Division"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
                  />
                </label>

                <Field
                  label="Number of employees"
                  value={inputs.employees}
                  min={1}
                  suffix="employees"
                  description="Company context. The financial calculation uses the employees directly involved in each event."
                  onChange={(value) => update("employees", value)}
                />

                <Field
                  label={profile.eventLabel}
                  value={inputs.eventsPerMonth}
                  min={0}
                  suffix="per month"
                  description={profile.eventDescription}
                  onChange={(value) => update("eventsPerMonth", value)}
                />

                <Field
                  label={profile.reconstructionLabel}
                  value={inputs.reconstructionHours}
                  min={0}
                  step={0.5}
                  suffix="hours"
                  description={profile.reconstructionDescription}
                  onChange={(value) =>
                    update("reconstructionHours", value)
                  }
                />

                <Field
                  label="Estimated reconstruction time with DDC"
                  value={inputs.ddcMinutesPerEvent}
                  min={0}
                  step={1}
                  suffix="minutes"
                  description="Estimated time required to retrieve and verify one complete operational record after DDC is integrated. This value should be validated during a pilot."
                  onChange={(value) =>
                    update("ddcMinutesPerEvent", value)
                  }
                />

                <Field
                  label={profile.peopleLabel}
                  value={inputs.peopleInvolved}
                  min={1}
                  suffix="people"
                  onChange={(value) => update("peopleInvolved", value)}
                />

                <Field
                  label="Employees required with DDC"
                  value={inputs.ddcPeopleInvolved}
                  min={1}
                  suffix="people"
                  description="Estimated number of employees required to retrieve, verify and review one complete DDC record."
                  onChange={(value) =>
                    update("ddcPeopleInvolved", value)
                  }
                />

                <Field
                  label="Average fully loaded hourly cost"
                  value={inputs.hourlyCost}
                  min={0}
                  suffix={currency}
                  description="Salary, taxes, benefits and operational overhead per employee hour."
                  onChange={(value) => update("hourlyCost", value)}
                />

                <Field
                  label="Systems containing relevant evidence"
                  value={inputs.systemsUsed}
                  min={1}
                  max={20}
                  suffix="systems"
                  description={profile.systemsDescription}
                  onChange={(value) => update("systemsUsed", value)}
                />

                <Field
                  label="Additional repeated or avoidable work"
                  value={inputs.avoidableWorkPercent}
                  min={0}
                  max={100}
                  suffix="%"
                  description="Repeated searches, duplicated analysis, document preparation, coordination and manual verification."
                  onChange={(value) =>
                    update("avoidableWorkPercent", value)
                  }
                />

                <Field
                  label={profile.directLossLabel}
                  value={inputs.directLossPerEvent}
                  min={0}
                  step={100}
                  suffix={currency}
                  description={profile.directLossDescription}
                  onChange={(value) =>
                    update("directLossPerEvent", value)
                  }
                />

                <Field
                  label="Expected process improvement"
                  value={inputs.expectedReductionPercent}
                  min={0}
                  max={100}
                  suffix="%"
                  description="A working hypothesis that should be validated through a real pilot."
                  onChange={(value) =>
                    update("expectedReductionPercent", value)
                  }
                />

                <Field
                  label="Estimated annual DDC program cost"
                  value={inputs.annualProgramCost}
                  min={0}
                  step={1000}
                  suffix={currency}
                  description="Estimated integration, configuration, training and operating cost."
                  onChange={(value) =>
                    update("annualProgramCost", value)
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h3 className="text-xl font-semibold">
                Relevant evidence for {profile.name.toLowerCase()}
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {profile.evidenceExamples.map((example) => (
                  <div
                    key={example}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-100"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            id="ddc-assessment-report"
            className="space-y-6 lg:sticky lg:top-6 lg:self-start"
          >
            <ExecutiveCover
              assessmentId={assessmentId}
              company={inputs.companyName}
              industry={profile.name}
              generatedDate={generatedDate}
            />

            <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-blue-950/95 to-slate-900 p-6 shadow-2xl print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                Estimated business impact
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                {inputs.companyName || "Your organization"}
              </h2>

              <p className="mt-2 text-sm text-slate-200">
                {profile.name} assessment
              </p>

              {assessmentId && (
                <div className="mt-4 rounded-2xl border border-amber-400/50 bg-amber-500/10 p-4 shadow-[0_0_24px_rgba(251,191,36,0.16)]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                        DDT Business Value Assessment
                      </p>

                      <p className="mt-2 text-sm text-slate-100">
                        Assessment ID
                      </p>

                      <p className="mt-1 break-all font-mono text-xl font-semibold text-amber-100">
                        {assessmentId}
                      </p>

                      <p className="mt-2 text-sm text-slate-200">
                        Generated {generatedDate}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(assessmentId)
                      }
                      className="print:hidden rounded-xl border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/10"
                    >
                      Copy ID
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/30">
                <div className="grid grid-cols-3 bg-slate-950/95 text-center">
                  <div className="p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-200">
                      Current process
                    </p>
                  </div>

                  <div className="border-x border-slate-700 p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
                      With DDC
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
                      Difference
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 text-center">
                  <div className="p-5">
                    <p className="text-sm text-slate-200">
                      Time per event
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {inputs.reconstructionHours} h
                    </p>
                  </div>

                  <div className="border-x border-slate-700 p-5">
                    <p className="text-sm text-slate-200">
                      Time per event
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-blue-200">
                      {inputs.ddcMinutesPerEvent} min
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-slate-200">
                      Time reduction
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-200">
                      {results.timeReductionPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-t border-slate-700 text-center">
                  <div className="p-5">
                    <p className="text-sm text-slate-200">
                      People per event
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {inputs.peopleInvolved}
                    </p>
                  </div>

                  <div className="border-x border-slate-700 p-5">
                    <p className="text-sm text-slate-200">
                      People per event
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-blue-200">
                      {inputs.ddcPeopleInvolved}
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-slate-200">
                      Hours recovered annually
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-200">
                      {integerFormatter.format(results.recoveredHours)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-t border-slate-700 text-center">
                  <div className="p-5">
                    <p className="text-sm text-slate-200">
                      Annual cost today
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {money.format(results.annualCostToday)}
                    </p>
                  </div>

                  <div className="border-x border-slate-700 p-5">
                    <p className="text-sm text-slate-200">
                      Annual cost with DDC
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-blue-200">
                      {money.format(results.annualCostWithDdc)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-100">
                      Includes{" "}
                      {money.format(inputs.annualProgramCost)} annual
                      DDC program cost
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-slate-200">
                      Net annual savings
                    </p>
                    <p
                      className={
                        results.netAnnualValue >= 0
                          ? "mt-2 text-3xl font-semibold text-emerald-200"
                          : "mt-2 text-3xl font-semibold text-red-200"
                      }
                    >
                      {money.format(results.netAnnualValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Metric
                  label="Estimated annual cost today"
                  value={money.format(results.annualCostToday)}
                  description={`Estimated cost of ${profile.reportProblem}.`}
                />

                <Metric
                  label="Potential annual savings"
                  value={money.format(results.potentialGrossSavings)}
                  description={`Based on the entered ${inputs.expectedReductionPercent}% improvement hypothesis.`}
                  highlighted
                />

                <Metric
                  label="Employee hours recovered"
                  value={`${integerFormatter.format(
                    results.recoveredHours
                  )} h`}
                  description="Estimated productive hours returned to the organization."
                />

                <Metric
                  label="Estimated payback period"
                  value={
                    results.paybackMonths > 0
                      ? `${results.paybackMonths.toFixed(1)} months`
                      : "—"
                  }
                  description="Estimated time required for gross savings to cover the annual program cost."
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/50 p-5 print:bg-white">
                <h3 className="font-semibold">
                  Before and after estimate
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-200">
                      Estimated annual cost today
                    </span>
                    <strong>{money.format(results.annualCostToday)}</strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-200">
                      Estimated cost after improvement
                    </span>
                    <strong>
                      {money.format(results.annualCostWithDdc)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-200">
                      Estimated annual DDC program cost
                    </span>
                    <strong>{money.format(inputs.annualProgramCost)}</strong>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-slate-700 pt-3">
                    <span>Potential net annual value</span>
                    <strong
                      className={
                        results.netAnnualValue >= 0
                          ? "text-emerald-200"
                          : "text-red-200"
                      }
                    >
                      {money.format(results.netAnnualValue)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-200">
                      Estimated first-year ROI
                    </span>
                    <strong>
                      {results.firstYearRoi.toFixed(0)}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="assessment-chart rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-950/20 to-slate-900 p-6 shadow-[0_0_28px_rgba(251,191,36,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                Financial comparison
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Current annual cost vs. annual cost with DDC
              </h3>

              <div className="mt-7 space-y-7">
                <div>
                  <div className="mb-2 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        Current process
                      </p>
                      <p className="mt-1 text-sm text-slate-100">
                        Estimated annual operational cost today
                      </p>
                    </div>

                    <p className="text-2xl font-semibold text-red-200">
                      {money.format(results.annualCostToday)}
                    </p>
                  </div>

                  <div className="h-7 overflow-hidden rounded-full border border-red-400/20 bg-slate-950/70 print:border-slate-300 print:bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 print:bg-slate-700"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        With DDC
                      </p>
                      <p className="mt-1 text-sm text-slate-100">
                        Includes the annual DDC program cost
                      </p>
                    </div>

                    <p className="text-2xl font-semibold text-blue-200">
                      {money.format(results.annualCostWithDdc)}
                    </p>
                  </div>

                  <div className="h-7 overflow-hidden rounded-full border border-blue-400/20 bg-slate-950/70 print:border-slate-300 print:bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 print:bg-slate-500"
                      style={{
                        width: `${
                          results.annualCostToday > 0
                            ? Math.max(
                                2,
                                Math.min(
                                  100,
                                  (results.annualCostWithDdc /
                                    results.annualCostToday) *
                                    100
                                )
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-black/20 p-4 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Net annual savings
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-200">
                    {money.format(results.netAnnualValue)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/20 p-4 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Cost reduction
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-200">
                    {results.annualCostToday > 0
                      ? Math.max(
                          0,
                          ((results.annualCostToday -
                            results.annualCostWithDdc) /
                            results.annualCostToday) *
                            100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/20 p-4 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Payback period
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-amber-200">
                    {results.paybackMonths > 0
                      ? `${results.paybackMonths.toFixed(1)} months`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="assessment-chart rounded-3xl border border-amber-400/35 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-7 shadow-[0_0_32px_rgba(251,191,36,0.12)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">
                Annual cost composition
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white print:text-black">
                Where the current annual cost comes from
              </h3>

              <div className="mt-7 space-y-5">
                {costComposition.map((item) => (
                  <div
                    key={item.label}
                    className="assessment-chart-row"
                  >
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <p className="text-base font-medium text-slate-100 print:text-black">
                        {item.label}
                      </p>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-white print:text-black">
                          {money.format(item.value)}
                        </p>

                        <p className="text-sm font-medium text-amber-200 print:text-black">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="h-5 overflow-hidden rounded-full border border-amber-400/20 bg-slate-800 print:border-slate-400 print:bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 print:bg-slate-700"
                        style={{
                          width: `${Math.max(
                            1.5,
                            item.percentage
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-5 print:border-slate-300 print:bg-white">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-100 print:text-black">
                  Total estimated annual cost
                </p>

                <p className="mt-2 text-4xl font-semibold text-amber-200 print:text-black">
                  {money.format(results.annualCostToday)}
                </p>
              </div>
            </div>

            <div className="assessment-chart rounded-3xl border border-amber-400/35 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 p-7 shadow-[0_0_32px_rgba(251,191,36,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">
                Operational efficiency
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white print:text-black">
                Current process compared with DDC
              </h3>

              <div className="mt-8 grid gap-7 md:grid-cols-2">
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-5 print:border-slate-300 print:bg-white">
                  <p className="text-sm font-semibold uppercase tracking-wide text-red-200 print:text-black">
                    Time per event
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between gap-4">
                      <span className="font-medium text-slate-100 print:text-black">
                        Current process
                      </span>
                      <strong>{inputs.reconstructionHours} h</strong>
                    </div>

                    <div className="h-6 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200">
                      <div className="h-full w-full rounded-full bg-red-500 print:bg-slate-700" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between gap-4">
                      <span className="font-medium text-slate-100 print:text-black">
                        With DDC
                      </span>
                      <strong className="text-emerald-200 print:text-black">
                        {inputs.ddcMinutesPerEvent} min
                      </strong>
                    </div>

                    <div className="h-6 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-400 print:bg-slate-500"
                        style={{
                          width: `${Math.max(
                            2,
                            Math.min(
                              100,
                              inputs.reconstructionHours > 0
                                ? (inputs.ddcMinutesPerEvent /
                                    60 /
                                    inputs.reconstructionHours) *
                                  100
                                : 0
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-6 text-center text-3xl font-semibold text-emerald-200 print:text-black">
                    {results.timeReductionPercent.toFixed(1)}% faster
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-400/25 bg-blue-500/10 p-5 print:border-slate-300 print:bg-white">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-200 print:text-black">
                    People per event
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between gap-4">
                      <span className="font-medium text-slate-100 print:text-black">
                        Current process
                      </span>
                      <strong>{inputs.peopleInvolved}</strong>
                    </div>

                    <div className="h-6 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200">
                      <div className="h-full w-full rounded-full bg-blue-500 print:bg-slate-700" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between gap-4">
                      <span className="font-medium text-slate-100 print:text-black">
                        With DDC
                      </span>
                      <strong className="text-emerald-200 print:text-black">
                        {inputs.ddcPeopleInvolved}
                      </strong>
                    </div>

                    <div className="h-6 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-400 print:bg-slate-500"
                        style={{
                          width: `${Math.max(
                            2,
                            Math.min(
                              100,
                              inputs.peopleInvolved > 0
                                ? (inputs.ddcPeopleInvolved /
                                    inputs.peopleInvolved) *
                                  100
                                : 0
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-6 text-center text-3xl font-semibold text-emerald-200 print:text-black">
                    {Math.max(
                      0,
                      inputs.peopleInvolved -
                        inputs.ddcPeopleInvolved
                    )} fewer people
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5 text-center print:border-slate-300 print:bg-white">
                  <p className="font-medium uppercase tracking-wide text-slate-100 print:text-black">
                    Hours recovered annually
                  </p>
                  <p className="mt-2 text-4xl font-semibold text-emerald-200 print:text-black">
                    {integerFormatter.format(results.recoveredHours)}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5 text-center print:border-slate-300 print:bg-white">
                  <p className="font-medium uppercase tracking-wide text-slate-100 print:text-black">
                    Net annual savings
                  </p>
                  <p className="mt-2 text-4xl font-semibold text-emerald-200 print:text-black">
                    {money.format(results.netAnnualValue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 print:border-slate-300 print:bg-white print:text-black">
              <h3 className="text-xl font-semibold">Cost breakdown</h3>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-200">
                    Direct employee reconstruction time
                  </span>
                  <strong>{money.format(results.directLaborCost)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-200">
                    Cross-system search and coordination
                  </span>
                  <strong>
                    {money.format(results.fragmentationCost)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-200">
                    Repeated and avoidable work
                  </span>
                  <strong>{money.format(results.repeatedWorkCost)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-200">
                    Direct operational loss
                  </span>
                  <strong>
                    {money.format(results.directOperationalLoss)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4 border-t border-slate-700 pt-4">
                  <span>Total estimated annual cost</span>
                  <strong className="text-lg">
                    {money.format(results.annualCostToday)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pdf-timeline assessment-visual rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-950/20 to-slate-900 p-6 shadow-[0_0_28px_rgba(251,191,36,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                Operational timeline
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                How the same event is reconstructed today and with DDC
              </h3>

              <div className="mt-7 grid gap-6 lg:grid-cols-2">
                <div className="assessment-column rounded-2xl border border-red-400/25 bg-red-500/10 p-5 print:border-slate-300 print:bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-200">
                      Current process
                    </p>

                    <p className="text-xl font-semibold text-white">
                      {inputs.reconstructionHours} hours
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      "Operational event or incident occurs",
                      "Employees are contacted across departments",
                      "Relevant systems and documents are searched",
                      "Evidence versions are compared manually",
                      "Missing information is requested",
                      "A review meeting is organized",
                      "The event history is reconstructed",
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-start gap-3 rounded-xl border border-red-400/15 bg-black/15 px-4 py-3 print:border-slate-300 print:bg-white"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm font-semibold text-red-200">
                          {index + 1}
                        </span>

                        <span className="pt-1 text-sm text-slate-100">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-center print:border-slate-300 print:bg-white">
                    <p className="text-sm uppercase tracking-wide text-slate-100">
                      People involved
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-red-200">
                      {inputs.peopleInvolved}
                    </p>
                  </div>
                </div>

                <div className="assessment-column rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5 print:border-slate-300 print:bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
                      With DDC
                    </p>

                    <p className="text-xl font-semibold text-white">
                      {inputs.ddcMinutesPerEvent} minutes
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      "Operational event or incident occurs",
                      "The relevant DDT record is opened",
                      "Connected evidence is retrieved",
                      "Integrity and timestamps are verified",
                      "One reviewer confirms the event history",
                      "The review is completed",
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-black/15 px-4 py-3 print:border-slate-300 print:bg-white"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-200">
                          {index + 1}
                        </span>

                        <span className="pt-1 text-sm text-slate-100">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center print:border-slate-300 print:bg-white">
                    <p className="text-sm uppercase tracking-wide text-slate-100">
                      People involved
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-emerald-200">
                      {inputs.ddcPeopleInvolved}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-black/20 p-4 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Time reduction
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-emerald-200">
                    {results.timeReductionPercent.toFixed(1)}%
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/20 p-4 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Employees reduced
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-emerald-200">
                    {Math.max(
                      0,
                      inputs.peopleInvolved -
                        inputs.ddcPeopleInvolved
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/20 p-4 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Hours recovered annually
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-emerald-200">
                    {integerFormatter.format(results.recoveredHours)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pdf-value-drivers assessment-visual rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/10 to-slate-900 p-6 shadow-[0_0_28px_rgba(34,211,238,.12)] print:border-slate-300 print:bg-white print:text-black">

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                Business value drivers
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Where the estimated business value comes from
              </h3>

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                {[
                  [
                    "Faster investigations",
                    "Reduce the time required to reconstruct one operational event."
                  ],
                  [
                    "Less employee effort",
                    "Fewer employees participate in every investigation."
                  ],
                  [
                    "Evidence availability",
                    "Operational evidence is connected instead of manually collected."
                  ],
                  [
                    "Lower operational losses",
                    "Reduce repeated work, production delays and avoidable costs."
                  ],
                  [
                    "Compliance readiness",
                    "Prepare verified evidence for audits and regulatory reviews."
                  ],
                  [
                    "Management visibility",
                    "Provide executives with one verifiable operational history."
                  ]
                ].map(([title,text])=>(
                  <div
                    key={title}
                    className="rounded-2xl border border-cyan-400/20 bg-black/20 p-5 print:border-slate-300 print:bg-white"
                  >
                    <p className="text-lg font-semibold text-cyan-200">
                      {title}
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-100">
                      {text}
                    </p>
                  </div>
                ))}

              </div>

            </div>


            <div className="pdf-evidence assessment-visual rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-900 to-amber-950/20 p-6 shadow-[0_0_28px_rgba(251,191,36,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                Evidence architecture
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                From fragmented evidence to one verifiable operational record
              </h3>

              <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-5 print:border-slate-300 print:bg-white">
                  <p className="text-center text-sm font-semibold uppercase tracking-wide text-red-200">
                    Fragmented evidence
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      "ERP",
                      "MES",
                      "Email",
                      "Spreadsheets",
                      "Machine logs",
                      "Sensors",
                      "PDF documents",
                      "Employee knowledge",
                    ].map((source) => (
                      <div
                        key={source}
                        className="rounded-xl border border-red-400/15 bg-black/15 px-3 py-4 text-center text-sm text-slate-100 print:border-slate-300 print:bg-white"
                      >
                        {source}
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-center text-sm leading-relaxed text-slate-200">
                    Evidence must be located, compared and manually connected
                    before the event can be understood.
                  </p>
                </div>

                <div className="hidden text-4xl text-amber-200 lg:block">
                  →
                </div>

                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 print:border-slate-300 print:bg-white">
                  <p className="text-center text-sm font-semibold uppercase tracking-wide text-emerald-200">
                    DDT operational record
                  </p>

                  <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/10 text-center shadow-[0_0_30px_rgba(251,191,36,0.18)] print:border-slate-400 print:bg-white print:shadow-none">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
                        DDT Record
                      </p>

                      <p className="mt-2 text-sm text-slate-200">
                        Verified operational history
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      "Source evidence",
                      "Event timeline",
                      "Integrity checks",
                      "Responsible systems",
                      "Relevant people",
                      "Verification status",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-emerald-400/15 bg-black/15 px-3 py-3 text-center text-sm text-slate-100 print:border-slate-300 print:bg-white"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-center text-sm leading-relaxed text-slate-200">
                    One record connects the relevant evidence without exposing
                    confidential operational data publicly.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5 print:border-slate-300 print:bg-white">
                <p className="text-sm leading-relaxed text-blue-100">
                  The exact DDT record model is configured for the selected
                  organization. A manufacturer may connect materials, machine
                  parameters and quality results, while a transport company may
                  connect vehicle, route, fuel, delivery and maintenance data.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 print:border-slate-300 print:bg-white print:text-black">
              <h3 className="text-xl font-semibold">Executive summary</h3>

              <p className="mt-4 text-sm leading-relaxed text-slate-100">
                Based on the information provided,{" "}
                {inputs.companyName || "the assessed organization"} may be
                spending approximately{" "}
                <strong>{money.format(results.annualCostToday)}</strong>{" "}
                annually on {profile.reportProblem}.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-100">
                The estimate includes employee reconstruction time,
                cross-system evidence searches, repeated work and direct
                operational losses. Based on the entered assumptions, the
                estimated total annual cost with DDC would be{" "}
                <strong>
                  {money.format(results.annualCostWithDdc)}
                </strong>
                . The implementation could potentially recover{" "}
                <strong>
                  {integerFormatter.format(results.recoveredHours)} employee
                  hours
                </strong>{" "}
                and create approximately{" "}
                <strong>
                  {money.format(results.potentialGrossSavings)}
                </strong>{" "}
                in annual gross value.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-100">
                These results are an initial business estimate, not a guarantee.
                The recommended next step is to validate the assumptions through
                a limited pilot covering {profile.pilotScope}.
              </p>
            </div>

            <div className="pdf-benchmark assessment-visual rounded-3xl border border-sky-400/30 bg-gradient-to-br from-sky-950/20 to-slate-900 p-6 shadow-[0_0_28px_rgba(56,189,248,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">
                DDC model benchmark
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Your assessment compared with the default {profile.name.toLowerCase()} model
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-black/20 p-5 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Your estimated annual cost
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {money.format(results.annualCostToday)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/20 p-5 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Default sector model
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-sky-300">
                    {money.format(internalBenchmark.annualCost)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-black/20 p-5 text-center print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Difference
                  </p>
                  {Math.abs(internalBenchmark.differencePercent) < 0.05 ? (
                    <div className="mt-2">
                      <p className="text-xl font-semibold text-sky-300">
                        Matches default model
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-100">
                        Your current inputs match the default {profile.name.toLowerCase()} assumptions.
                      </p>
                    </div>
                  ) : (
                    <p
                      className={
                        internalBenchmark.differencePercent > 0
                          ? "mt-2 text-3xl font-semibold text-amber-200"
                          : "mt-2 text-3xl font-semibold text-emerald-200"
                      }
                    >
                      {internalBenchmark.differencePercent > 0 ? "+" : ""}
                      {internalBenchmark.differencePercent.toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
                <p className="text-sm leading-relaxed text-sky-100/95">
                  This is an internal DDC model comparison based on the default
                  assumptions for the selected sector. It is not an external
                  industry statistic and should not be presented as an industry
                  average.
                </p>
              </div>
            </div>

            <div className="assessment-visual rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-950/20 to-slate-900 p-6 shadow-[0_0_28px_rgba(251,191,36,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                Business value score
              </p>

              <div className="mt-5 grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-8 border-amber-400/30 bg-black/20 text-center shadow-[0_0_30px_rgba(251,191,36,0.16)] print:border-slate-400 print:bg-white print:shadow-none">
                  <div>
                    <p className="text-5xl font-bold text-amber-200">
                      {businessValueScore.score}
                    </p>
                    <p className="mt-1 text-sm uppercase tracking-wide text-slate-200">
                      out of 100
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-semibold text-white">
                    {businessValueScore.level} business-value potential
                  </p>

                  <p className="mt-3 text-lg font-medium text-emerald-200">
                    {businessValueScore.recommendation}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-slate-200">
                    The score combines estimated net savings, time reduction,
                    employee hours recovered and payback period. It is an
                    assessment indicator, not a guarantee, and should be
                    validated through a real pilot.
                  </p>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 print:bg-slate-700"
                      style={{
                        width: `${businessValueScore.score}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pdf-sensitivity assessment-visual rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-950/20 to-slate-900 p-6 shadow-[0_0_28px_rgba(167,139,250,0.10)] print:border-slate-300 print:bg-white print:text-black print:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-200">
                Sensitivity analysis
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                How the business case changes under different improvement scenarios
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                The selected assessment uses a {inputs.expectedReductionPercent}% improvement
                hypothesis. The scenarios below show how the estimated annual value changes
                if the measured pilot result is lower or higher.
              </p>

              <div className="mt-7 overflow-hidden rounded-2xl border border-slate-700">
                <div className="hidden grid-cols-4 bg-slate-950/70 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-100 sm:grid">
                  <span>Improvement</span>
                  <span className="text-right">Annual cost with DDC</span>
                  <span className="text-right">Net annual value</span>
                  <span className="text-right">Payback</span>
                </div>

                {sensitivityScenarios.map((scenario) => {
                  const selected =
                    scenario.improvementPercent ===
                    inputs.expectedReductionPercent;

                  return (
                    <div
                      key={scenario.improvementPercent}
                      className={
                        selected
                          ? "grid gap-3 border-t border-violet-400/30 bg-violet-500/10 px-4 py-4 sm:grid-cols-4 sm:items-center"
                          : "grid gap-3 border-t border-slate-800 px-4 py-4 sm:grid-cols-4 sm:items-center"
                      }
                    >
                      <div>
                        <p className="text-sm text-slate-100 sm:hidden">
                          Improvement
                        </p>
                        <p
                          className={
                            selected
                              ? "text-lg font-semibold text-violet-200"
                              : "text-lg font-semibold text-white"
                          }
                        >
                          {scenario.improvementPercent}%
                          {selected && (
                            <span className="ml-2 text-sm font-medium uppercase tracking-wide">
                              Selected
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-slate-100 sm:hidden">
                          Annual cost with DDC
                        </p>
                        <p className="font-semibold">
                          {money.format(scenario.totalCostWithDdc)}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-slate-100 sm:hidden">
                          Net annual value
                        </p>
                        <p
                          className={
                            scenario.netAnnualValue >= 0
                              ? "font-semibold text-emerald-200"
                              : "font-semibold text-red-200"
                          }
                        >
                          {money.format(scenario.netAnnualValue)}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-slate-100 sm:hidden">
                          Payback
                        </p>
                        <p className="font-semibold text-amber-200">
                          {scenario.paybackMonths > 0
                            ? `${scenario.paybackMonths.toFixed(1)} months`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                <p className="text-sm leading-relaxed text-violet-100/95">
                  The pilot should replace these assumptions with measured values from
                  the organization’s real process. Broader deployment should be considered
                  only if the measured result supports the business case.
                </p>
              </div>
            </div>


            <div className="pdf-ddt-record assessment-visual assessment-ddt-record rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-950/20 to-slate-900 p-6 shadow-[0_0_28px_rgba(251,191,36,.12)] print:border-slate-300 print:bg-white print:text-black">

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                Example DDT Operational Record
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                {profile.recordTitle}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-200">
                The exact structure is configured for each organization. This
                example illustrates the type of verifiable operational record
                generated after implementation.
              </p>

              <div className="mt-8 rounded-3xl border border-amber-400/25 bg-black/30 p-6">

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-100">
                      Record ID
                    </p>

                    <p className="mt-2 font-mono text-xl font-semibold text-amber-200">
                      {assessmentId
                        ? `${assessmentId}-REC-001`
                        : "DDT-REC-001"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-100">
                      Verification
                    </p>

                    <p className="mt-2 text-xl font-semibold text-emerald-200">
                      Verified
                    </p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-100">
                      Record Type
                    </p>

                    <p className="mt-2 text-lg text-white">
                      {profile.recordType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-100">
                      Integrity
                    </p>

                    <p className="mt-2 text-lg text-white">
                      SHA-256 Verified
                    </p>
                  </div>

                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
                    <p className="font-semibold text-white">
                      Connected evidence
                    </p>

                    <ul className="mt-4 space-y-2 text-sm text-slate-100">
                      {profile.recordEvidence.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
                    <p className="font-semibold text-white">
                      Protected metadata
                    </p>

                    <ul className="mt-4 space-y-2 text-sm text-slate-100">
                      {profile.recordMetadata.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">

                  <p className="text-sm leading-7 text-blue-100/95">
                    This is not a fixed template. Every DDT record is configured
                    around the organization's operational process, evidence
                    sources, governance rules and compliance requirements.
                  </p>

                </div>

              </div>

            </div>

            <div className="pdf-pilot rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 print:border-slate-300 print:bg-white print:text-black">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
                Recommended pilot
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Validate this estimate using one real operational process.
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/20 bg-black/20 p-4 print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Proposed scope
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {pilotRecommendation.scope}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-black/20 p-4 print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Estimated duration
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {pilotRecommendation.duration}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-black/20 p-4 print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Initial integrations
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {pilotRecommendation.integrations}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-black/20 p-4 print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-100">
                    Validation sample
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {pilotRecommendation.sample}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold">
                  Pilot KPIs
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    "Time required to reconstruct one event",
                    "Number of employees involved",
                    "Evidence retrieval and verification time",
                    "Direct operational cost reduction",
                    "Annualized net business value",
                    "Evidence completeness and integrity",
                  ].map((kpi) => (
                    <div
                      key={kpi}
                      className="flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-black/15 px-4 py-3 text-sm print:border-slate-300 print:bg-white"
                    >
                      <span className="mt-0.5 text-emerald-200">✓</span>
                      <span>{kpi}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 print:border-slate-300 print:bg-white">
                <p className="text-sm leading-relaxed text-slate-100">
                  If the measured pilot results do not justify broader
                  deployment, no further implementation should be recommended.
                  The objective is to prove measurable business value using the
                  organization’s own operational data.
                </p>
              </div>
            </div>

            <div className="pdf-adapted rounded-3xl border border-amber-400/25 bg-amber-500/10 p-6 print:border-slate-300 print:bg-white print:text-black">
              <h3 className="text-xl font-semibold">
                Adapted to your organization
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-amber-100/95">
                Every organization preserves different evidence. DDC does not
                impose one universal record structure. The data model,
                verification rules, integrations, access controls and business
                metrics are configured around the company’s actual process.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-black/20 p-4 print:border print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-amber-200/70">
                    Before
                  </p>
                  <p className="mt-2 text-sm">{profile.beforeDescription}</p>
                </div>

                <div className="rounded-xl bg-black/20 p-4 print:border print:border-slate-300 print:bg-white">
                  <p className="text-sm uppercase tracking-wide text-emerald-200/70">
                    After
                  </p>
                  <p className="mt-2 text-sm">{profile.afterDescription}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-400/30 bg-blue-500/10 p-6 print:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                Executive report
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Save this assessment for internal review.
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                The report includes the business estimate, cost breakdown,
                executive summary, assumptions and recommended pilot scope.
              </p>

              <button
                type="button"
                onClick={printExecutiveReport}
                className="mt-6 rounded-xl bg-blue-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-300"
              >
                Download executive assessment
              </button>

              <p className="mt-3 text-sm text-slate-100">
                Select “Save as PDF” in the print window.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 print:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
                Recommended next step
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Validate the estimate using one real process.
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                A pilot should compare the current process with a tailored
                verifiable-record workflow and measure time, employee effort,
                evidence quality and direct financial impact.
              </p>

              <a
                href="/contact"
                className="mt-6 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Request a business assessment
              </a>
            </div>

            <div className="text-sm leading-relaxed text-slate-600">
              Assumptions: every additional evidence system adds 5% to direct
              reconstruction cost, capped at 50%. Direct operational loss is
              multiplied by the estimated annual number of reviewed events.
              Potential savings use the improvement percentage entered by the
              user. Actual results depend on process scope, integrations, data
              quality and organizational adoption.
            </div>
          </div>
        </div>
      </section>

      <div className="print:hidden fixed inset-x-0 bottom-0 z-50 border-t border-amber-400/30 bg-slate-950/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              {money.format(results.netAnnualValue)} potential net annual value
            </p>

            <p className="text-sm text-slate-200">
              Assessment ID: {assessmentId || "Generating..."}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={printExecutiveReport}
              className="rounded-xl border border-amber-400/50 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
            >
              Download executive assessment
            </button>

            <a
              href="/contact"
              className="rounded-xl bg-emerald-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Request a business assessment
            </a>
          </div>
        </div>
      </div>


    </main>
  );
}
