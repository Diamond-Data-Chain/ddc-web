import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";

import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type AIDataAvailability =
  | "model-api"
  | "agent-platform"
  | "mlops-platform"
  | "event-logging"
  | "custom-legacy"
  | "mixed-unsure";

export type AIInputs = {
  companyName: string;

  annualAutomatedDecisions: number;
  operationalEnvironments: number;
  relevantEmployees: number;

  modelRegistrySystems: number;
  mlopsSystems: number;
  agentPlatforms: number;
  observabilitySystems: number;
  approvalWorkflowSystems: number;
  policyGovernanceSystems: number;
  dataPlatforms: number;
  standardApiSystems: number;
  customLegacySystems: number;

  modelsAgents: number;
  dataAvailability: AIDataAvailability;

  governanceWorkflows: number;

  traceableEventsPerDecision: number;
  additionalModelPolicyEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualReviewsInvestigations: number;
  reviewPeople: number;
  reviewHoursPerPerson: number;
};

export const EMPTY_AI_INPUTS: AIInputs = {
  companyName: "",

  annualAutomatedDecisions: 0,
  operationalEnvironments: 0,
  relevantEmployees: 0,

  modelRegistrySystems: 0,
  mlopsSystems: 0,
  agentPlatforms: 0,
  observabilitySystems: 0,
  approvalWorkflowSystems: 0,
  policyGovernanceSystems: 0,
  dataPlatforms: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  modelsAgents: 0,
  dataAvailability: "model-api",

  governanceWorkflows: 0,

  traceableEventsPerDecision: 0,
  additionalModelPolicyEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualReviewsInvestigations: 0,
  reviewPeople: 0,
  reviewHoursPerPerson: 0,
};

function safe(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function groups(quantity: number, groupSize: number) {
  const value = safe(quantity);
  return value > 0 ? Math.ceil(value / groupSize) : 0;
}

function deriveAIScope(
  modelCount: number,
  availability: AIDataAvailability
) {
  const models = safe(modelCount);

  if (models === 0) {
    return {
      integrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  switch (availability) {
    case "model-api":
      return {
        integrationGroups: groups(models, 25),
        newDataCaptureGroups: 0,
      };

    case "agent-platform":
      return {
        integrationGroups: groups(models, 20),
        newDataCaptureGroups: 0,
      };

    case "mlops-platform":
      return {
        integrationGroups: groups(models, 25),
        newDataCaptureGroups: 0,
      };

    case "event-logging":
      return {
        integrationGroups: groups(models, 15),
        newDataCaptureGroups: 0,
      };

    case "custom-legacy":
      return {
        integrationGroups: groups(models, 10),
        newDataCaptureGroups: 0,
      };

    case "mixed-unsure":
      return {
        integrationGroups: groups(models, 15),
        newDataCaptureGroups: 0,
      };
  }
}

export function calculateAIAssessment(
  inputs: AIInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualAutomatedDecisions) *
    safe(inputs.traceableEventsPerDecision);

  const additionalRegistrationTransactions =
    safe(inputs.additionalModelPolicyEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.modelRegistrySystems) +
    safe(inputs.mlopsSystems) +
    safe(inputs.agentPlatforms) +
    safe(inputs.observabilitySystems) +
    safe(inputs.approvalWorkflowSystems) +
    safe(inputs.policyGovernanceSystems) +
    safe(inputs.dataPlatforms) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const sourceClasses = [
    inputs.modelRegistrySystems,
    inputs.mlopsSystems,
    inputs.agentPlatforms,
    inputs.observabilitySystems,
    inputs.approvalWorkflowSystems,
    inputs.policyGovernanceSystems,
    inputs.dataPlatforms,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const aiScope = deriveAIScope(
    inputs.modelsAgents,
    inputs.dataAvailability
  );

  const dataSourceClasses =
    sourceClasses +
    (safe(inputs.modelsAgents) > 0 ? 1 : 0);

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.operationalEnvironments),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      aiScope.integrationGroups,

    newDataCaptureGroups:
      aiScope.newDataCaptureGroups,

    workflows:
      safe(inputs.governanceWorkflows),

    dataSourceClasses,

    hardwarePurchaseCostUsdt: 0,

    annualRegistrationTransactions,
  };

  const implementation =
    calculateImplementationCost(implementationScope);

  const annualOperations =
    calculateAnnualOperatingCost(implementationScope);

  const recordHandlingLaborCostUsdt =
    safe(inputs.recordHandlingStaff) *
    safe(inputs.recordHandlingHoursPerWeek) *
    52 *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const reviewLaborHours =
    safe(inputs.annualReviewsInvestigations) *
    safe(inputs.reviewPeople) *
    safe(inputs.reviewHoursPerPerson);

  const reviewLaborCostUsdt =
    reviewLaborHours *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const totalAddressableOperationalCostUsdt =
    recordHandlingLaborCostUsdt +
    safe(inputs.otherAnnualAddressableCostUsdt) +
    reviewLaborCostUsdt;

  const staffReductionRate =
    config.efficiency.staffRecordHandlingReductionPercent / 100;

  const otherReductionRate =
    config.efficiency.otherRecordManagementReductionPercent / 100;

  const reviewReductionRate =
    config.efficiency.investigationLaborReductionPercent / 100;

  const estimatedReducedStaffCostUsdt =
    recordHandlingLaborCostUsdt * staffReductionRate;

  const estimatedReducedOtherCostUsdt =
    safe(inputs.otherAnnualAddressableCostUsdt) *
    otherReductionRate;

  const estimatedReducedReviewCostUsdt =
    reviewLaborCostUsdt * reviewReductionRate;

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

  return {
    configVersion: config.version,

    scope: {
      operationalEnvironments:
        safe(inputs.operationalEnvironments),

      relevantEmployees:
        safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      modelsAgents:
        safe(inputs.modelsAgents),

      integrationGroups:
        aiScope.integrationGroups,

      workflows:
        safe(inputs.governanceWorkflows),

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
      recordHandlingLaborCostUsdt,

      otherAddressableCostUsdt:
        safe(inputs.otherAnnualAddressableCostUsdt),

      reviewLaborHours,
      reviewLaborCostUsdt,

      totalAddressableOperationalCostUsdt,
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
        safe(inputs.annualReviewsInvestigations),

      currentLaborHours:
        reviewLaborHours,

      targetLaborHours:
        reviewLaborHours * (1 - reviewReductionRate),

      currentLaborCostUsdt:
        reviewLaborCostUsdt,

      targetLaborCostUsdt:
        reviewLaborCostUsdt * (1 - reviewReductionRate),

      reductionPercent:
        config.efficiency.investigationLaborReductionPercent,
    },

    existingSystemsReplaced: 0,
  };
}
