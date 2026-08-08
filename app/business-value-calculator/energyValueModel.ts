import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";

import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type EnergyDataAvailability =
  | "scada-api"
  | "iot-platform"
  | "meter-platform"
  | "existing-interface"
  | "new-capture"
  | "mixed-unsure";

export type EnergyInputs = {
  companyName: string;

  annualOperationalEvents: number;
  operationalSites: number;
  relevantEmployees: number;

  scadaSystems: number;
  assetManagementSystems: number;
  meterDataSystems: number;
  outageManagementSystems: number;
  gisSystems: number;
  maintenanceSystems: number;
  iotSensorPlatforms: number;
  standardApiSystems: number;
  customLegacySystems: number;

  monitoredAssetsDevices: number;
  dataAvailability: EnergyDataAvailability;

  operationalWorkflows: number;

  traceableEventsPerOperationalEvent: number;
  additionalAssetMeterEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualOutagesIncidentsReviews: number;
  reviewPeople: number;
  reviewHoursPerPerson: number;
};

export const EMPTY_ENERGY_INPUTS: EnergyInputs = {
  companyName: "",

  annualOperationalEvents: 0,
  operationalSites: 0,
  relevantEmployees: 0,

  scadaSystems: 0,
  assetManagementSystems: 0,
  meterDataSystems: 0,
  outageManagementSystems: 0,
  gisSystems: 0,
  maintenanceSystems: 0,
  iotSensorPlatforms: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  monitoredAssetsDevices: 0,
  dataAvailability: "scada-api",

  operationalWorkflows: 0,

  traceableEventsPerOperationalEvent: 0,
  additionalAssetMeterEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualOutagesIncidentsReviews: 0,
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

function deriveAssetScope(
  assetCount: number,
  availability: EnergyDataAvailability
) {
  const assets = safe(assetCount);

  if (assets === 0) {
    return {
      integrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  const assumptions =
    OPERATIONAL_VALUE_CONFIG.energy;

  switch (availability) {
    case "scada-api":
      return {
        integrationGroups: groups(
          assets,
          assumptions.assetIntegrationGroupSize.scadaApi
        ),
        newDataCaptureGroups: 0,
      };

    case "iot-platform":
      return {
        integrationGroups: groups(
          assets,
          assumptions.assetIntegrationGroupSize.iotPlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "meter-platform":
      return {
        integrationGroups: groups(
          assets,
          assumptions.assetIntegrationGroupSize.meterPlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "existing-interface":
      return {
        integrationGroups: groups(
          assets,
          assumptions.assetIntegrationGroupSize.existingInterface
        ),
        newDataCaptureGroups: 0,
      };

    case "new-capture":
      return {
        integrationGroups: groups(
          assets,
          assumptions.assetIntegrationGroupSize.newCapture
        ),
        newDataCaptureGroups: groups(
          assets,
          assumptions.newDataCaptureGroupSize.newCapture
        ),
      };

    case "mixed-unsure":
      return {
        integrationGroups: groups(
          assets,
          assumptions.assetIntegrationGroupSize.mixedUnsure
        ),
        newDataCaptureGroups: groups(
          assets,
          assumptions.newDataCaptureGroupSize.mixedUnsure
        ),
      };
  }
}

export function calculateEnergyAssessment(
  inputs: EnergyInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualOperationalEvents) *
    safe(inputs.traceableEventsPerOperationalEvent);

  const additionalRegistrationTransactions =
    safe(inputs.additionalAssetMeterEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.scadaSystems) +
    safe(inputs.assetManagementSystems) +
    safe(inputs.meterDataSystems) +
    safe(inputs.outageManagementSystems) +
    safe(inputs.gisSystems) +
    safe(inputs.maintenanceSystems) +
    safe(inputs.iotSensorPlatforms) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const sourceClasses = [
    inputs.scadaSystems,
    inputs.assetManagementSystems,
    inputs.meterDataSystems,
    inputs.outageManagementSystems,
    inputs.gisSystems,
    inputs.maintenanceSystems,
    inputs.iotSensorPlatforms,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const assetScope = deriveAssetScope(
    inputs.monitoredAssetsDevices,
    inputs.dataAvailability
  );

  const dataSourceClasses =
    sourceClasses +
    (safe(inputs.monitoredAssetsDevices) > 0 ? 1 : 0);

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.operationalSites),
    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      assetScope.integrationGroups,

    newDataCaptureGroups:
      assetScope.newDataCaptureGroups,

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
    safe(inputs.annualOutagesIncidentsReviews) *
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
      operationalSites: safe(inputs.operationalSites),
      relevantEmployees: safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      monitoredAssetsDevices:
        safe(inputs.monitoredAssetsDevices),

      integrationGroups:
        assetScope.integrationGroups,

      newDataCaptureGroups:
        assetScope.newDataCaptureGroups,

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
        safe(inputs.annualOutagesIncidentsReviews),

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
