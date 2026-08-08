import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";
import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type MachineDataAvailability =
  | "mes-api"
  | "plc-interface"
  | "existing-sensors"
  | "new-capture"
  | "mixed-unsure";

export type ManufacturingInputs = {
  companyName: string;

  annualProductionUnits: number;
  productionSites: number;
  relevantEmployees: number;

  erpSystems: number;
  mesSystems: number;
  qmsSystems: number;
  wmsSystems: number;
  cmmsSystems: number;
  standardApiSystems: number;
  customLegacySystems: number;

  machinesDevices: number;
  machineDataAvailability: MachineDataAvailability;

  operationalWorkflows: number;

  traceableEventsPerUnit: number;
  additionalOperationalEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualInvestigations: number;
  investigationPeople: number;
  investigationHoursPerPerson: number;
};

export const EMPTY_MANUFACTURING_INPUTS: ManufacturingInputs = {
  companyName: "",

  annualProductionUnits: 0,
  productionSites: 0,
  relevantEmployees: 0,

  erpSystems: 0,
  mesSystems: 0,
  qmsSystems: 0,
  wmsSystems: 0,
  cmmsSystems: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  machinesDevices: 0,
  machineDataAvailability: "mes-api",

  operationalWorkflows: 0,

  traceableEventsPerUnit: 0,
  additionalOperationalEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualInvestigations: 0,
  investigationPeople: 0,
  investigationHoursPerPerson: 0,
};

function safe(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function groups(quantity: number, groupSize: number) {
  const value = safe(quantity);

  if (value <= 0) return 0;

  return Math.ceil(value / groupSize);
}

function deriveMachineIntegrationScope(
  machineCount: number,
  availability: MachineDataAvailability
) {
  const machines = safe(machineCount);

  if (machines === 0) {
    return {
      machineIntegrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  const assumptions =
    OPERATIONAL_VALUE_CONFIG.manufacturing;

  switch (availability) {
    case "mes-api":
      return {
        machineIntegrationGroups: groups(
          machines,
          assumptions.machineIntegrationGroupSize.mesApi
        ),
        newDataCaptureGroups: 0,
      };

    case "plc-interface":
      return {
        machineIntegrationGroups: groups(
          machines,
          assumptions.machineIntegrationGroupSize.plcInterface
        ),
        newDataCaptureGroups: 0,
      };

    case "existing-sensors":
      return {
        machineIntegrationGroups: groups(
          machines,
          assumptions.machineIntegrationGroupSize.existingSensors
        ),
        newDataCaptureGroups: 0,
      };

    case "new-capture":
      return {
        machineIntegrationGroups: groups(
          machines,
          assumptions.machineIntegrationGroupSize.newCapture
        ),
        newDataCaptureGroups: groups(
          machines,
          assumptions.newDataCaptureGroupSize.newCapture
        ),
      };

    case "mixed-unsure":
      return {
        machineIntegrationGroups: groups(
          machines,
          assumptions.machineIntegrationGroupSize.mixedUnsure
        ),
        newDataCaptureGroups: groups(
          machines,
          assumptions.newDataCaptureGroupSize.mixedUnsure
        ),
      };
  }
}

export function calculateManufacturingAssessment(
  inputs: ManufacturingInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  /*
   * RECORD VOLUME
   */

  const primaryRegistrationTransactions =
    safe(inputs.annualProductionUnits) *
    safe(inputs.traceableEventsPerUnit);

  const additionalRegistrationTransactions =
    safe(inputs.additionalOperationalEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  /*
   * ENTERPRISE SYSTEM SCOPE
   */

  const standardConnectors =
    safe(inputs.erpSystems) +
    safe(inputs.mesSystems) +
    safe(inputs.qmsSystems) +
    safe(inputs.wmsSystems) +
    safe(inputs.cmmsSystems) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const enterpriseSourceClasses = [
    inputs.erpSystems,
    inputs.mesSystems,
    inputs.qmsSystems,
    inputs.wmsSystems,
    inputs.cmmsSystems,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  /*
   * MACHINE / DEVICE INTEGRATION
   *
   * Machine count NEVER equals sensor count.
   * Existing MES/API/PLC/sensor data is reused wherever available.
   */

  const machineScope = deriveMachineIntegrationScope(
    inputs.machinesDevices,
    inputs.machineDataAvailability
  );

  const machineSourceClasses =
    safe(inputs.machinesDevices) > 0 ? 1 : 0;

  const dataSourceClasses =
    enterpriseSourceClasses +
    machineSourceClasses;

  /*
   * IMPLEMENTATION SCOPE
   *
   * Known hardware purchase cost remains zero in the public v2
   * questionnaire because the frozen Manufacturing input set does
   * not request a hardware-price estimate.
   *
   * New-capture engineering effort IS included where applicable.
   */

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.productionSites),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      machineScope.machineIntegrationGroups,

    newDataCaptureGroups:
      machineScope.newDataCaptureGroups,

    workflows: safe(inputs.operationalWorkflows),

    dataSourceClasses,

    hardwarePurchaseCostUsdt: 0,

    annualRegistrationTransactions,
  };

  const implementation =
    calculateImplementationCost(implementationScope);

  const annualOperations =
    calculateAnnualOperatingCost(implementationScope);

  /*
   * CURRENT ADDRESSABLE COST
   */

  const currentRecordHandlingLaborCostUsdt =
    safe(inputs.recordHandlingStaff) *
    safe(inputs.recordHandlingHoursPerWeek) *
    52 *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const currentInvestigationLaborHours =
    safe(inputs.annualInvestigations) *
    safe(inputs.investigationPeople) *
    safe(inputs.investigationHoursPerPerson);

  const currentInvestigationLaborCostUsdt =
    currentInvestigationLaborHours *
    safe(inputs.fullyLoadedHourlyCostUsdt);

  const currentAddressableOperationalCostUsdt =
    currentRecordHandlingLaborCostUsdt +
    safe(inputs.otherAnnualAddressableCostUsdt) +
    currentInvestigationLaborCostUsdt;

  /*
   * VERSIONED EFFICIENCY ASSUMPTIONS
   */

  const staffReductionRate =
    config.efficiency.staffRecordHandlingReductionPercent /
    100;

  const otherCostReductionRate =
    config.efficiency.otherRecordManagementReductionPercent /
    100;

  const investigationReductionRate =
    config.efficiency.investigationLaborReductionPercent /
    100;

  const estimatedReducedStaffCostUsdt =
    currentRecordHandlingLaborCostUsdt *
    staffReductionRate;

  const estimatedReducedOtherCostUsdt =
    safe(inputs.otherAnnualAddressableCostUsdt) *
    otherCostReductionRate;

  const estimatedReducedInvestigationCostUsdt =
    currentInvestigationLaborCostUsdt *
    investigationReductionRate;

  const estimatedAvoidableCurrentCostUsdt =
    estimatedReducedStaffCostUsdt +
    estimatedReducedOtherCostUsdt +
    estimatedReducedInvestigationCostUsdt;

  /*
   * BUSINESS VALUE
   */

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

  /*
   * SECONDARY RECONSTRUCTION VALUE
   */

  const targetInvestigationLaborHours =
    currentInvestigationLaborHours *
    (1 - investigationReductionRate);

  const targetInvestigationLaborCostUsdt =
    currentInvestigationLaborCostUsdt *
    (1 - investigationReductionRate);

  return {
    configVersion: config.version,

    scope: {
      productionSites:
        safe(inputs.productionSites),

      relevantEmployees:
        safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      machineCount:
        safe(inputs.machinesDevices),

      machineDataAvailability:
        inputs.machineDataAvailability,

      machineIntegrationGroups:
        machineScope.machineIntegrationGroups,

      newDataCaptureGroups:
        machineScope.newDataCaptureGroups,

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
      recordHandlingLaborCostUsdt:
        currentRecordHandlingLaborCostUsdt,

      otherAddressableCostUsdt:
        safe(inputs.otherAnnualAddressableCostUsdt),

      investigationLaborHours:
        currentInvestigationLaborHours,

      investigationLaborCostUsdt:
        currentInvestigationLaborCostUsdt,

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

      investigationLaborReductionPercent:
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
      estimatedReducedInvestigationCostUsdt,

      estimatedAvoidableCurrentCostUsdt,

      recurringAnnualBenefitUsdt,
      firstYearNetValueUsdt,
      paybackMonths,
      threeYearNetValueUsdt,
    },

    reconstruction: {
      annualCases:
        safe(inputs.annualInvestigations),

      currentLaborHours:
        currentInvestigationLaborHours,

      targetLaborHours:
        targetInvestigationLaborHours,

      currentLaborCostUsdt:
        currentInvestigationLaborCostUsdt,

      targetLaborCostUsdt:
        targetInvestigationLaborCostUsdt,

      reductionPercent:
        config.efficiency
          .investigationLaborReductionPercent,
    },

    existingSystemsReplaced: 0,
  };
}
