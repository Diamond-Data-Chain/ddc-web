import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";

import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type TransportDataAvailability =
  | "tms-api"
  | "telematics"
  | "iot-platform"
  | "new-onboard-devices"
  | "mixed-unsure";

export type TransportInputs = {
  companyName: string;

  annualShipmentsTrips: number;
  logisticsSites: number;
  relevantEmployees: number;

  tmsSystems: number;
  wmsSystems: number;
  fleetManagementSystems: number;
  gpsTelematicsSystems: number;
  temperatureMonitoringSystems: number;
  standardApiSystems: number;
  customLegacySystems: number;

  vehiclesTrailersContainers: number;
  dataAvailability: TransportDataAvailability;

  logisticsWorkflows: number;

  traceableEventsPerShipment: number;
  additionalFleetEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualDeliveryDisputes: number;
  disputePeople: number;
  disputeHoursPerPerson: number;
};

export const EMPTY_TRANSPORT_INPUTS: TransportInputs = {
  companyName: "",

  annualShipmentsTrips: 0,
  logisticsSites: 0,
  relevantEmployees: 0,

  tmsSystems: 0,
  wmsSystems: 0,
  fleetManagementSystems: 0,
  gpsTelematicsSystems: 0,
  temperatureMonitoringSystems: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  vehiclesTrailersContainers: 0,
  dataAvailability: "tms-api",

  logisticsWorkflows: 0,

  traceableEventsPerShipment: 0,
  additionalFleetEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualDeliveryDisputes: 0,
  disputePeople: 0,
  disputeHoursPerPerson: 0,
};

function safe(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function groups(quantity: number, groupSize: number) {
  const value = safe(quantity);
  if (value <= 0) return 0;
  return Math.ceil(value / groupSize);
}

function deriveVehicleScope(
  vehicleCount: number,
  availability: TransportDataAvailability
) {
  const vehicles = safe(vehicleCount);

  if (vehicles === 0) {
    return {
      vehicleIntegrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  const assumptions =
    OPERATIONAL_VALUE_CONFIG.transport;

  switch (availability) {
    case "tms-api":
      return {
        vehicleIntegrationGroups: groups(
          vehicles,
          assumptions.vehicleIntegrationGroupSize.tmsApi
        ),
        newDataCaptureGroups: 0,
      };

    case "telematics":
      return {
        vehicleIntegrationGroups: groups(
          vehicles,
          assumptions.vehicleIntegrationGroupSize.telematics
        ),
        newDataCaptureGroups: 0,
      };

    case "iot-platform":
      return {
        vehicleIntegrationGroups: groups(
          vehicles,
          assumptions.vehicleIntegrationGroupSize.iotPlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "new-onboard-devices":
      return {
        vehicleIntegrationGroups: groups(
          vehicles,
          assumptions.vehicleIntegrationGroupSize.newOnboardDevices
        ),
        newDataCaptureGroups: groups(
          vehicles,
          assumptions.newDataCaptureGroupSize.newOnboardDevices
        ),
      };

    case "mixed-unsure":
      return {
        vehicleIntegrationGroups: groups(
          vehicles,
          assumptions.vehicleIntegrationGroupSize.mixedUnsure
        ),
        newDataCaptureGroups: groups(
          vehicles,
          assumptions.newDataCaptureGroupSize.mixedUnsure
        ),
      };
  }
}

export function calculateTransportAssessment(
  inputs: TransportInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualShipmentsTrips) *
    safe(inputs.traceableEventsPerShipment);

  const additionalRegistrationTransactions =
    safe(inputs.additionalFleetEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.tmsSystems) +
    safe(inputs.wmsSystems) +
    safe(inputs.fleetManagementSystems) +
    safe(inputs.gpsTelematicsSystems) +
    safe(inputs.temperatureMonitoringSystems) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const enterpriseSourceClasses = [
    inputs.tmsSystems,
    inputs.wmsSystems,
    inputs.fleetManagementSystems,
    inputs.gpsTelematicsSystems,
    inputs.temperatureMonitoringSystems,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const vehicleScope = deriveVehicleScope(
    inputs.vehiclesTrailersContainers,
    inputs.dataAvailability
  );

  const vehicleSourceClasses =
    safe(inputs.vehiclesTrailersContainers) > 0 ? 1 : 0;

  const dataSourceClasses =
    enterpriseSourceClasses +
    vehicleSourceClasses;

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.logisticsSites),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      vehicleScope.vehicleIntegrationGroups,

    newDataCaptureGroups:
      vehicleScope.newDataCaptureGroups,

    workflows: safe(inputs.logisticsWorkflows),

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

  const currentDisputeLaborHours =
    safe(inputs.annualDeliveryDisputes) *
    safe(inputs.disputePeople) *
    safe(inputs.disputeHoursPerPerson);

  const currentDisputeLaborCostUsdt =
    currentDisputeLaborHours *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const currentAddressableOperationalCostUsdt =
    currentRecordHandlingLaborCostUsdt +
    safe(inputs.otherAnnualAddressableCostUsdt) +
    currentDisputeLaborCostUsdt;

  const staffReductionRate =
    config.efficiency.staffRecordHandlingReductionPercent / 100;

  const otherReductionRate =
    config.efficiency.otherRecordManagementReductionPercent / 100;

  const disputeReductionRate =
    config.efficiency.investigationLaborReductionPercent / 100;

  const estimatedReducedStaffCostUsdt =
    currentRecordHandlingLaborCostUsdt *
    staffReductionRate;

  const estimatedReducedOtherCostUsdt =
    safe(inputs.otherAnnualAddressableCostUsdt) *
    otherReductionRate;

  const estimatedReducedDisputeCostUsdt =
    currentDisputeLaborCostUsdt *
    disputeReductionRate;

  const estimatedAvoidableCurrentCostUsdt =
    estimatedReducedStaffCostUsdt +
    estimatedReducedOtherCostUsdt +
    estimatedReducedDisputeCostUsdt;

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

  const targetDisputeLaborHours =
    currentDisputeLaborHours *
    (1 - disputeReductionRate);

  const targetDisputeLaborCostUsdt =
    currentDisputeLaborCostUsdt *
    (1 - disputeReductionRate);

  return {
    configVersion: config.version,

    scope: {
      logisticsSites: safe(inputs.logisticsSites),
      relevantEmployees: safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      vehicleCount: safe(inputs.vehiclesTrailersContainers),
      dataAvailability: inputs.dataAvailability,

      vehicleIntegrationGroups:
        vehicleScope.vehicleIntegrationGroups,

      newDataCaptureGroups:
        vehicleScope.newDataCaptureGroups,

      workflows: safe(inputs.logisticsWorkflows),
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

      disputeLaborHours:
        currentDisputeLaborHours,

      disputeLaborCostUsdt:
        currentDisputeLaborCostUsdt,

      totalAddressableOperationalCostUsdt:
        currentAddressableOperationalCostUsdt,
    },

    assumptions: {
      staffRecordHandlingReductionPercent:
        config.efficiency.staffRecordHandlingReductionPercent,

      otherRecordManagementReductionPercent:
        config.efficiency.otherRecordManagementReductionPercent,

      disputeLaborReductionPercent:
        config.efficiency.investigationLaborReductionPercent,

      ddcReferencePriceUsdt:
        config.network.ddcReferencePriceUsdt,

      feePerRegistrationDdc:
        config.network.feePerRegistrationDdc,
    },

    value: {
      estimatedReducedStaffCostUsdt,
      estimatedReducedOtherCostUsdt,
      estimatedReducedDisputeCostUsdt,
      estimatedAvoidableCurrentCostUsdt,

      recurringAnnualBenefitUsdt,
      firstYearNetValueUsdt,
      paybackMonths,
      threeYearNetValueUsdt,
    },

    reconstruction: {
      annualCases: safe(inputs.annualDeliveryDisputes),

      currentLaborHours:
        currentDisputeLaborHours,

      targetLaborHours:
        targetDisputeLaborHours,

      currentLaborCostUsdt:
        currentDisputeLaborCostUsdt,

      targetLaborCostUsdt:
        targetDisputeLaborCostUsdt,

      reductionPercent:
        config.efficiency.investigationLaborReductionPercent,
    },

    existingSystemsReplaced: 0,
  };
}
