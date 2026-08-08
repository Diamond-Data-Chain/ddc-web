import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";
import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type HealthcareDeviceDataAvailability =
  | "ehr-api"
  | "device-platform"
  | "existing-interface"
  | "new-capture"
  | "mixed-unsure";

export type HealthcareInputs = {
  companyName: string;

  annualClinicalCases: number;
  clinicalSites: number;
  relevantEmployees: number;

  ehrSystems: number;
  laboratorySystems: number;
  imagingSystems: number;
  pharmacySystems: number;
  devicePlatforms: number;
  standardApiSystems: number;
  customLegacySystems: number;

  medicalDevices: number;
  deviceDataAvailability: HealthcareDeviceDataAvailability;

  clinicalWorkflows: number;

  traceableEventsPerCase: number;
  additionalClinicalDeviceEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualClinicalReviews: number;
  reviewPeople: number;
  reviewHoursPerPerson: number;
};

export const EMPTY_HEALTHCARE_INPUTS: HealthcareInputs = {
  companyName: "",

  annualClinicalCases: 0,
  clinicalSites: 0,
  relevantEmployees: 0,

  ehrSystems: 0,
  laboratorySystems: 0,
  imagingSystems: 0,
  pharmacySystems: 0,
  devicePlatforms: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  medicalDevices: 0,
  deviceDataAvailability: "ehr-api",

  clinicalWorkflows: 0,

  traceableEventsPerCase: 0,
  additionalClinicalDeviceEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualClinicalReviews: 0,
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

function deriveDeviceScope(
  deviceCount: number,
  availability: HealthcareDeviceDataAvailability
) {
  const devices = safe(deviceCount);

  if (devices === 0) {
    return {
      deviceIntegrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  const assumptions =
    OPERATIONAL_VALUE_CONFIG.healthcare;

  switch (availability) {
    case "ehr-api":
      return {
        deviceIntegrationGroups: groups(
          devices,
          assumptions.deviceIntegrationGroupSize.ehrApi
        ),
        newDataCaptureGroups: 0,
      };

    case "device-platform":
      return {
        deviceIntegrationGroups: groups(
          devices,
          assumptions.deviceIntegrationGroupSize.devicePlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "existing-interface":
      return {
        deviceIntegrationGroups: groups(
          devices,
          assumptions.deviceIntegrationGroupSize.existingInterface
        ),
        newDataCaptureGroups: 0,
      };

    case "new-capture":
      return {
        deviceIntegrationGroups: groups(
          devices,
          assumptions.deviceIntegrationGroupSize.newCapture
        ),
        newDataCaptureGroups: groups(
          devices,
          assumptions.newDataCaptureGroupSize.newCapture
        ),
      };

    case "mixed-unsure":
      return {
        deviceIntegrationGroups: groups(
          devices,
          assumptions.deviceIntegrationGroupSize.mixedUnsure
        ),
        newDataCaptureGroups: groups(
          devices,
          assumptions.newDataCaptureGroupSize.mixedUnsure
        ),
      };
  }
}

export function calculateHealthcareAssessment(
  inputs: HealthcareInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualClinicalCases) *
    safe(inputs.traceableEventsPerCase);

  const additionalRegistrationTransactions =
    safe(inputs.additionalClinicalDeviceEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.ehrSystems) +
    safe(inputs.laboratorySystems) +
    safe(inputs.imagingSystems) +
    safe(inputs.pharmacySystems) +
    safe(inputs.devicePlatforms) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const enterpriseSourceClasses = [
    inputs.ehrSystems,
    inputs.laboratorySystems,
    inputs.imagingSystems,
    inputs.pharmacySystems,
    inputs.devicePlatforms,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const deviceScope = deriveDeviceScope(
    inputs.medicalDevices,
    inputs.deviceDataAvailability
  );

  const deviceSourceClasses =
    safe(inputs.medicalDevices) > 0 ? 1 : 0;

  const dataSourceClasses =
    enterpriseSourceClasses +
    deviceSourceClasses;

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.clinicalSites),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      deviceScope.deviceIntegrationGroups,

    newDataCaptureGroups:
      deviceScope.newDataCaptureGroups,

    workflows: safe(inputs.clinicalWorkflows),

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
    safe(inputs.annualClinicalReviews) *
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
    config.efficiency.staffRecordHandlingReductionPercent /
    100;

  const otherCostReductionRate =
    config.efficiency.otherRecordManagementReductionPercent /
    100;

  const reviewReductionRate =
    config.efficiency.investigationLaborReductionPercent /
    100;

  const estimatedReducedStaffCostUsdt =
    currentRecordHandlingLaborCostUsdt *
    staffReductionRate;

  const estimatedReducedOtherCostUsdt =
    safe(inputs.otherAnnualAddressableCostUsdt) *
    otherCostReductionRate;

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
      clinicalSites: safe(inputs.clinicalSites),
      relevantEmployees: safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      deviceCount: safe(inputs.medicalDevices),
      deviceDataAvailability:
        inputs.deviceDataAvailability,

      deviceIntegrationGroups:
        deviceScope.deviceIntegrationGroups,

      newDataCaptureGroups:
        deviceScope.newDataCaptureGroups,

      workflows: safe(inputs.clinicalWorkflows),
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
        config.efficiency
          .staffRecordHandlingReductionPercent,

      otherRecordManagementReductionPercent:
        config.efficiency
          .otherRecordManagementReductionPercent,

      reviewLaborReductionPercent:
        config.efficiency
          .investigationLaborReductionPercent,

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
      annualCases: safe(inputs.annualClinicalReviews),

      currentLaborHours:
        currentReviewLaborHours,

      targetLaborHours:
        targetReviewLaborHours,

      currentLaborCostUsdt:
        currentReviewLaborCostUsdt,

      targetLaborCostUsdt:
        targetReviewLaborCostUsdt,

      reductionPercent:
        config.efficiency
          .investigationLaborReductionPercent,
    },

    existingSystemsReplaced: 0,
  };
}
