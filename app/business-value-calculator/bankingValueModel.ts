import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";

import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type BankingDataAvailability =
  | "core-banking-api"
  | "transaction-monitoring"
  | "risk-fraud-platform"
  | "custom-legacy"
  | "mixed-unsure";

export type BankingInputs = {
  companyName: string;

  annualTransactions: number;
  bankingEntitiesSites: number;
  relevantEmployees: number;

  coreBankingSystems: number;
  transactionMonitoringSystems: number;
  amlKycSystems: number;
  fraudSystems: number;
  riskEngines: number;
  approvalWorkflowSystems: number;
  modelRegistrySystems: number;
  standardApiSystems: number;
  customLegacySystems: number;

  automatedDecisionStreams: number;
  dataAvailability: BankingDataAvailability;

  governanceWorkflows: number;

  traceableEventsPerTransaction: number;
  additionalReviewApprovalEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualInvestigationsReviews: number;
  reviewPeople: number;
  reviewHoursPerPerson: number;
};

export const EMPTY_BANKING_INPUTS: BankingInputs = {
  companyName: "",

  annualTransactions: 0,
  bankingEntitiesSites: 0,
  relevantEmployees: 0,

  coreBankingSystems: 0,
  transactionMonitoringSystems: 0,
  amlKycSystems: 0,
  fraudSystems: 0,
  riskEngines: 0,
  approvalWorkflowSystems: 0,
  modelRegistrySystems: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  automatedDecisionStreams: 0,
  dataAvailability: "core-banking-api",

  governanceWorkflows: 0,

  traceableEventsPerTransaction: 0,
  additionalReviewApprovalEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualInvestigationsReviews: 0,
  reviewPeople: 0,
  reviewHoursPerPerson: 0,
};

function safe(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function groups(quantity: number, groupSize: number) {
  const value = safe(quantity);
  if (value <= 0) return 0;
  return Math.ceil(value / groupSize);
}

function deriveDecisionScope(
  eventCount: number,
  availability: BankingDataAvailability
) {
  const events = safe(eventCount);

  if (events === 0) {
    return {
      integrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  const assumptions = OPERATIONAL_VALUE_CONFIG.banking;

  switch (availability) {
    case "core-banking-api":
      return {
        integrationGroups: groups(
          events,
          assumptions.transactionIntegrationGroupSize.coreBankingApi
        ),
        newDataCaptureGroups: 0,
      };

    case "transaction-monitoring":
      return {
        integrationGroups: groups(
          events,
          assumptions.transactionIntegrationGroupSize.transactionMonitoring
        ),
        newDataCaptureGroups: 0,
      };

    case "risk-fraud-platform":
      return {
        integrationGroups: groups(
          events,
          assumptions.transactionIntegrationGroupSize.riskFraudPlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "custom-legacy":
      return {
        integrationGroups: groups(
          events,
          assumptions.transactionIntegrationGroupSize.customLegacy
        ),
        newDataCaptureGroups: 0,
      };

    case "mixed-unsure":
      return {
        integrationGroups: groups(
          events,
          assumptions.transactionIntegrationGroupSize.mixedUnsure
        ),
        newDataCaptureGroups: 0,
      };
  }
}

export function calculateBankingAssessment(
  inputs: BankingInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualTransactions) *
    safe(inputs.traceableEventsPerTransaction);

  const additionalRegistrationTransactions =
    safe(inputs.additionalReviewApprovalEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.coreBankingSystems) +
    safe(inputs.transactionMonitoringSystems) +
    safe(inputs.amlKycSystems) +
    safe(inputs.fraudSystems) +
    safe(inputs.riskEngines) +
    safe(inputs.approvalWorkflowSystems) +
    safe(inputs.modelRegistrySystems) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const enterpriseSourceClasses = [
    inputs.coreBankingSystems,
    inputs.transactionMonitoringSystems,
    inputs.amlKycSystems,
    inputs.fraudSystems,
    inputs.riskEngines,
    inputs.approvalWorkflowSystems,
    inputs.modelRegistrySystems,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const decisionScope = deriveDecisionScope(
    inputs.automatedDecisionStreams,
    inputs.dataAvailability
  );

  const decisionSourceClasses =
    safe(inputs.automatedDecisionStreams) > 0 ? 1 : 0;

  const dataSourceClasses =
    enterpriseSourceClasses +
    decisionSourceClasses;

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.bankingEntitiesSites),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      decisionScope.integrationGroups,

    newDataCaptureGroups:
      decisionScope.newDataCaptureGroups,

    workflows: safe(inputs.governanceWorkflows),

    dataSourceClasses,

    hardwarePurchaseCostUsdt: 0,

    annualRegistrationTransactions,
  };

  const implementation =
    calculateImplementationCost(implementationScope);

  const annualOperations =
    calculateAnnualOperatingCost(implementationScope);

  const currentRecordHandlingLaborCostUsdt =
    safe(inputs.recordHandlingStaff) *
    safe(inputs.recordHandlingHoursPerWeek) *
    52 *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const currentReviewLaborHours =
    safe(inputs.annualInvestigationsReviews) *
    safe(inputs.reviewPeople) *
    safe(inputs.reviewHoursPerPerson);

  const currentReviewLaborCostUsdt =
    currentReviewLaborHours *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const currentAddressableOperationalCostUsdt =
    currentRecordHandlingLaborCostUsdt +
    safe(inputs.otherAnnualAddressableCostUsdt) +
    currentReviewLaborCostUsdt;

  const staffReductionRate =
    config.efficiency.staffRecordHandlingReductionPercent / 100;

  const otherReductionRate =
    config.efficiency.otherRecordManagementReductionPercent / 100;

  const reviewReductionRate =
    config.efficiency.investigationLaborReductionPercent / 100;

  const estimatedReducedStaffCostUsdt =
    currentRecordHandlingLaborCostUsdt *
    staffReductionRate;

  const estimatedReducedOtherCostUsdt =
    safe(inputs.otherAnnualAddressableCostUsdt) *
    otherReductionRate;

  const estimatedReducedReviewCostUsdt =
    currentReviewLaborCostUsdt *
    reviewReductionRate;

  const estimatedAvoidableCurrentCostUsdt =
    estimatedReducedStaffCostUsdt +
    estimatedReducedOtherCostUsdt +
    estimatedReducedReviewCostUsdt;

  const recurringAnnualBenefitUsdt =
    estimatedAvoidableCurrentCostUsdt -
    annualOperations.estimatedAnnualOperatingCostUsdt;

  const firstYearNetValueUsdt =
    recurringAnnualBenefitUsdt -
    implementation.estimatedImplementationCostUsdt;

  const paybackMonths =
    recurringAnnualBenefitUsdt > 0
      ? implementation.estimatedImplementationCostUsdt /
        (recurringAnnualBenefitUsdt / 12)
      : 0;

  const threeYearNetValueUsdt =
    recurringAnnualBenefitUsdt * 3 -
    implementation.estimatedImplementationCostUsdt;

  const totalPersonMonths =
    implementation.roleBreakdown.reduce(
      (sum, role) => sum + role.personMonths,
      0
    );

  const targetReviewLaborHours =
    currentReviewLaborHours *
    (1 - reviewReductionRate);

  const targetReviewLaborCostUsdt =
    currentReviewLaborCostUsdt *
    (1 - reviewReductionRate);

  return {
    configVersion: config.version,

    scope: {
      bankingEntitiesSites: safe(inputs.bankingEntitiesSites),
      relevantEmployees: safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      automatedDecisionStreams:
        safe(inputs.automatedDecisionStreams),

      integrationGroups:
        decisionScope.integrationGroups,

      workflows: safe(inputs.governanceWorkflows),

      dataSourceClasses,

      annualRegistrationTransactions,
    },

    records: {
      primaryRegistrationTransactions,
      additionalRegistrationTransactions,
      annualRegistrationTransactions,
    },

    implementation: {
      ...implementation,
      totalPersonMonths,
    },

    annualOperations,

    currentCost: {
      recordHandlingLaborCostUsdt:
        currentRecordHandlingLaborCostUsdt,

      otherAddressableCostUsdt:
        safe(inputs.otherAnnualAddressableCostUsdt),

      reviewLaborHours:
        currentReviewLaborHours,

      reviewLaborCostUsdt:
        currentReviewLaborCostUsdt,

      totalAddressableOperationalCostUsdt:
        currentAddressableOperationalCostUsdt,
    },

    assumptions: {
      staffRecordHandlingReductionPercent:
        config.efficiency.staffRecordHandlingReductionPercent,

      otherRecordManagementReductionPercent:
        config.efficiency.otherRecordManagementReductionPercent,

      reviewLaborReductionPercent:
        config.efficiency.investigationLaborReductionPercent,

      ddcReferencePriceUsdt:
        config.network.ddcReferencePriceUsdt,

      feePerRegistrationDdc:
        config.network.feePerRegistrationDdc,
    },

    value: {
      estimatedReducedStaffCostUsdt,
      estimatedReducedOtherCostUsdt,
      estimatedReducedReviewCostUsdt,
      estimatedAvoidableCurrentCostUsdt,

      recurringAnnualBenefitUsdt,
      firstYearNetValueUsdt,
      paybackMonths,
      threeYearNetValueUsdt,
    },

    reconstruction: {
      annualCases:
        safe(inputs.annualInvestigationsReviews),

      currentLaborHours:
        currentReviewLaborHours,

      targetLaborHours:
        targetReviewLaborHours,

      currentLaborCostUsdt:
        currentReviewLaborCostUsdt,

      targetLaborCostUsdt:
        targetReviewLaborCostUsdt,

      reductionPercent:
        config.efficiency.investigationLaborReductionPercent,
    },

    existingSystemsReplaced: 0,
  };
}
