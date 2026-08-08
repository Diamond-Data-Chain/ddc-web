import {
  calculateAnnualOperatingCost,
  calculateImplementationCost,
  type ImplementationScope,
} from "./implementationCostEngine";

import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type InsuranceDataAvailability =
  | "policy-claims-api"
  | "claims-platform"
  | "fraud-assessment-platform"
  | "custom-legacy"
  | "mixed-unsure";

export type InsuranceInputs = {
  companyName: string;

  annualClaims: number;
  businessUnitsSites: number;
  relevantEmployees: number;

  policyAdminSystems: number;
  claimsManagementSystems: number;
  documentManagementSystems: number;
  fraudSystems: number;
  assessmentSystems: number;
  paymentSystems: number;
  workflowSystems: number;
  standardApiSystems: number;
  customLegacySystems: number;

  automatedClaimAssessmentStreams: number;
  dataAvailability: InsuranceDataAvailability;

  claimWorkflows: number;

  traceableEventsPerClaim: number;
  additionalPolicyClaimEventsPerYear: number;

  recordHandlingStaff: number;
  recordHandlingHoursPerWeek: number;
  fullyLoadedHourlyCostUsdt: number;
  otherAnnualAddressableCostUsdt: number;

  annualClaimDisputesReviews: number;
  reviewPeople: number;
  reviewHoursPerPerson: number;
};

export const EMPTY_INSURANCE_INPUTS: InsuranceInputs = {
  companyName: "",

  annualClaims: 0,
  businessUnitsSites: 0,
  relevantEmployees: 0,

  policyAdminSystems: 0,
  claimsManagementSystems: 0,
  documentManagementSystems: 0,
  fraudSystems: 0,
  assessmentSystems: 0,
  paymentSystems: 0,
  workflowSystems: 0,
  standardApiSystems: 0,
  customLegacySystems: 0,

  automatedClaimAssessmentStreams: 0,
  dataAvailability: "policy-claims-api",

  claimWorkflows: 0,

  traceableEventsPerClaim: 0,
  additionalPolicyClaimEventsPerYear: 0,

  recordHandlingStaff: 0,
  recordHandlingHoursPerWeek: 0,
  fullyLoadedHourlyCostUsdt: 0,
  otherAnnualAddressableCostUsdt: 0,

  annualClaimDisputesReviews: 0,
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

function deriveClaimScope(
  eventCount: number,
  availability: InsuranceDataAvailability
) {
  const events = safe(eventCount);

  if (events === 0) {
    return {
      integrationGroups: 0,
      newDataCaptureGroups: 0,
    };
  }

  const assumptions = OPERATIONAL_VALUE_CONFIG.insurance;

  switch (availability) {
    case "policy-claims-api":
      return {
        integrationGroups: groups(
          events,
          assumptions.claimIntegrationGroupSize.policyClaimsApi
        ),
        newDataCaptureGroups: 0,
      };

    case "claims-platform":
      return {
        integrationGroups: groups(
          events,
          assumptions.claimIntegrationGroupSize.claimsPlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "fraud-assessment-platform":
      return {
        integrationGroups: groups(
          events,
          assumptions.claimIntegrationGroupSize.fraudAssessmentPlatform
        ),
        newDataCaptureGroups: 0,
      };

    case "custom-legacy":
      return {
        integrationGroups: groups(
          events,
          assumptions.claimIntegrationGroupSize.customLegacy
        ),
        newDataCaptureGroups: 0,
      };

    case "mixed-unsure":
      return {
        integrationGroups: groups(
          events,
          assumptions.claimIntegrationGroupSize.mixedUnsure
        ),
        newDataCaptureGroups: 0,
      };
  }
}

export function calculateInsuranceAssessment(
  inputs: InsuranceInputs
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const primaryRegistrationTransactions =
    safe(inputs.annualClaims) *
    safe(inputs.traceableEventsPerClaim);

  const additionalRegistrationTransactions =
    safe(inputs.additionalPolicyClaimEventsPerYear);

  const annualRegistrationTransactions =
    primaryRegistrationTransactions +
    additionalRegistrationTransactions;

  const standardConnectors =
    safe(inputs.policyAdminSystems) +
    safe(inputs.claimsManagementSystems) +
    safe(inputs.documentManagementSystems) +
    safe(inputs.fraudSystems) +
    safe(inputs.assessmentSystems) +
    safe(inputs.paymentSystems) +
    safe(inputs.workflowSystems) +
    safe(inputs.standardApiSystems);

  const customConnectors =
    safe(inputs.customLegacySystems);

  const enterpriseSourceClasses = [
    inputs.policyAdminSystems,
    inputs.claimsManagementSystems,
    inputs.documentManagementSystems,
    inputs.fraudSystems,
    inputs.assessmentSystems,
    inputs.paymentSystems,
    inputs.workflowSystems,
    inputs.standardApiSystems,
    inputs.customLegacySystems,
  ].filter((value) => safe(value) > 0).length;

  const claimScope = deriveClaimScope(
    inputs.automatedClaimAssessmentStreams,
    inputs.dataAvailability
  );

  const claimSourceClasses =
    safe(inputs.automatedClaimAssessmentStreams) > 0 ? 1 : 0;

  const dataSourceClasses =
    enterpriseSourceClasses +
    claimSourceClasses;

  const implementationScope: ImplementationScope = {
    sites: safe(inputs.businessUnitsSites),

    standardConnectors,
    customConnectors,

    machineIntegrationGroups:
      claimScope.integrationGroups,

    newDataCaptureGroups:
      claimScope.newDataCaptureGroups,

    workflows: safe(inputs.claimWorkflows),

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
    safe(inputs.annualClaimDisputesReviews) *
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
      businessUnitsSites:
        safe(inputs.businessUnitsSites),

      relevantEmployees:
        safe(inputs.relevantEmployees),

      standardConnectors,
      customConnectors,

      automatedClaimAssessmentStreams:
        safe(inputs.automatedClaimAssessmentStreams),

      integrationGroups:
        claimScope.integrationGroups,

      workflows:
        safe(inputs.claimWorkflows),

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
        safe(inputs.annualClaimDisputesReviews),

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
