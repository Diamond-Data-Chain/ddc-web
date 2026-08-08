import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";

import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type OtherDataAvailability =
  | "existing-api"
  | "operational-platform"
  | "event-logging"
  | "custom-integration"
  | "mixed-unsure";

export type OtherInputs = {
  companyName: string;

  annualOperationalRecords: number;
  operationalSites: number;
  relevantEmployees: number;

  primaryOperationalSystems: number;
  documentManagementSystems: number;
  workflowSystems: number;
  dataPlatforms: number;
  iotPlatforms: number;
  standardApiSystems: number;
  customLegacySystems: number;

  operationalAssets: number;
  dataAvailability: OtherDataAvailability;

  operationalWorkflows: number;

  traceableEventsPerRecord: number;
  additionalOperationalEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualOperationalReviews: number;
  reviewPeople: number;
  reviewHoursPerPerson: number;
};

export const EMPTY_OTHER_INPUTS: OtherInputs = {
  companyName: "",

  annualOperationalRecords: 0,
  operationalSites: 0,
  relevantEmployees: 0,

  primaryOperationalSystems: 0,
  documentManagementSystems: 0,
  workflowSystems: 0,
  dataPlatforms: 0,
  iotPlatforms: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  operationalAssets: 0,
  dataAvailability: "existing-api",

  operationalWorkflows: 0,

  traceableEventsPerRecord: 0,
  additionalOperationalEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualOperationalReviews: 0,
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

function deriveOtherScope(
  assetCount: number,
  availability: OtherDataAvailability
) {
  const assets = safe(assetCount);

  if (assets === 0) {
    return {
      integrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  switch (availability) {
    case "existing-api":
      return {
        integrationGroups: groups(assets, 100),
        newDataCaptureGroups: 0,
      };

    case "operational-platform":
      return {
        integrationGroups: groups(assets, 75),
        newDataCaptureGroups: 0,
      };

    case "event-logging":
      return {
        integrationGroups: groups(assets, 50),
        newDataCaptureGroups: 0,
      };

    case "custom-integration":
      return {
        integrationGroups: groups(assets, 25),
        newDataCaptureGroups: 0,
      };

    case "mixed-unsure":
      return {
        integrationGroups: groups(assets, 50),
        newDataCaptureGroups: 0,
      };
  }
}

export function calculateOtherAssessment(
  inputs: OtherInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualOperationalRecords) *
    safe(inputs.traceableEventsPerRecord);

  const additionalRegistrationTransactions =
    safe(inputs.additionalOperationalEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.primaryOperationalSystems) +
    safe(inputs.documentManagementSystems) +
    safe(inputs.workflowSystems) +
    safe(inputs.dataPlatforms) +
    safe(inputs.iotPlatforms) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const sourceClasses = [
    inputs.primaryOperationalSystems,
    inputs.documentManagementSystems,
    inputs.workflowSystems,
    inputs.dataPlatforms,
    inputs.iotPlatforms,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const operationalScope = deriveOtherScope(
    inputs.operationalAssets,
    inputs.dataAvailability
  );

  const dataSourceClasses =
    sourceClasses +
    (safe(inputs.operationalAssets) > 0 ? 1 : 0);

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.operationalSites),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      operationalScope.integrationGroups,

    newDataCaptureGroups:
      operationalScope.newDataCaptureGroups,

    workflows:
      safe(inputs.operationalWorkflows),

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
    safe(inputs.annualOperationalReviews) *
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
      operationalSites:
        safe(inputs.operationalSites),

      relevantEmployees:
        safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      operationalAssets:
        safe(inputs.operationalAssets),

      integrationGroups:
        operationalScope.integrationGroups,

      workflows:
        safe(inputs.operationalWorkflows),

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
        safe(inputs.annualOperationalReviews),

      currentLaborHours:
        reviewLaborHours,

      targetLaborHours:
        reviewLaborHours *
        (1 - reviewReductionRate),

      currentLaborCostUsdt:
        reviewLaborCostUsdt,

      targetLaborCostUsdt:
        reviewLaborCostUsdt *
        (1 - reviewReductionRate),

      reductionPercent:
        config.efficiency.investigationLaborReductionPercent,
    },

    existingSystemsReplaced: 0,
  };
}
