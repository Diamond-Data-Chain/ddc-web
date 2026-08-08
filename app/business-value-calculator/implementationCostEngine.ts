import { OPERATIONAL_VALUE_CONFIG } from "./operationalValueConfig";

export type ImplementationScope = {
  sites: number;

  standardConnectors: number;
  customConnectors: number;

  machineIntegrationGroups: number;
  newDataCaptureGroups: number;

  workflows: number;
  dataSourceClasses: number;

  hardwarePurchaseCostUsdt: number;

  annualRegistrationTransactions: number;
};

type TechnicalRole =
  | "architect"
  | "backend"
  | "ddc"
  | "industrial";

type AllRole =
  | TechnicalRole
  | "qa"
  | "pm";

const TECHNICAL_ROLES: TechnicalRole[] = [
  "architect",
  "backend",
  "ddc",
  "industrial",
];

const ALL_ROLES: AllRole[] = [
  "architect",
  "backend",
  "ddc",
  "industrial",
  "qa",
  "pm",
];

function safe(value: number) {
  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

function selectInfrastructureTier(scope: ImplementationScope) {
  const config = OPERATIONAL_VALUE_CONFIG.infrastructureComplexity;
  const weights = config.weights;
  const thresholds = config.thresholds;

  const complexityScore =
    safe(scope.sites) * weights.site +
    safe(scope.standardConnectors) * weights.standardConnector +
    safe(scope.customConnectors) * weights.customConnector +
    safe(scope.machineIntegrationGroups) * weights.machineIntegrationGroup +
    safe(scope.newDataCaptureGroups) * weights.newDataCaptureGroup +
    safe(scope.workflows) * weights.workflow;

  if (complexityScore >= thresholds.enterprise) return "enterprise";
  if (complexityScore >= thresholds.large) return "large";
  if (complexityScore >= thresholds.medium) return "medium";

  return "small";
}

export function calculateImplementationCost(
  scope: ImplementationScope
) {
  const config = OPERATIONAL_VALUE_CONFIG;
  const coefficients = config.implementation.workUnits;

  const technicalHours: Record<TechnicalRole, number> = {
    architect: 0,
    backend: 0,
    ddc: 0,
    industrial: 0,
  };

  const hasImplementationScope =
    safe(scope.sites) > 0 ||
    safe(scope.standardConnectors) > 0 ||
    safe(scope.customConnectors) > 0 ||
    safe(scope.machineIntegrationGroups) > 0 ||
    safe(scope.newDataCaptureGroups) > 0 ||
    safe(scope.workflows) > 0 ||
    safe(scope.dataSourceClasses) > 0 ||
    safe(scope.annualRegistrationTransactions) > 0;

  const quantities = {
    baseDeployment: hasImplementationScope ? 1 : 0,
    siteDeployment: hasImplementationScope
      ? Math.max(0, safe(scope.sites) - 1)
      : 0,
    standardConnector: safe(scope.standardConnectors),
    customConnector: safe(scope.customConnectors),
    machineIntegrationGroup: safe(scope.machineIntegrationGroups),
    newDataCaptureGroup: safe(scope.newDataCaptureGroups),
    workflowConfiguration: safe(scope.workflows),
    dataMappingSchema: safe(scope.dataSourceClasses),
    securityComplianceReview: hasImplementationScope ? 1 : 0,
  };

  for (const [workUnit, quantity] of Object.entries(quantities)) {
    const unit =
      coefficients[
        workUnit as keyof typeof coefficients
      ];

    for (const role of TECHNICAL_ROLES) {
      technicalHours[role] += unit[role] * quantity;
    }
  }

  const technicalTotalHours =
    TECHNICAL_ROLES.reduce(
      (sum, role) => sum + technicalHours[role],
      0
    );

  const qaHours =
    technicalTotalHours *
    (config.implementation.qaPercentOfTechnicalHours / 100);

  const prePmHours = technicalTotalHours + qaHours;

  const pmHours =
    prePmHours *
    (config.implementation.pmPercentOfPrePmHours / 100);

  const roleHours: Record<AllRole, number> = {
    ...technicalHours,
    qa: qaHours,
    pm: pmHours,
  };

  const roleBreakdown = ALL_ROLES.map((role) => {
    const hours = roleHours[role];

    const personMonths =
      hours /
      config.labor.productiveHoursPerPersonMonth;

    const monthlyCost =
      config.labor.roles[role].monthlyCostUsdt;

    const laborCostUsdt =
      personMonths * monthlyCost;

    return {
      role,
      label: config.labor.roles[role].label,
      hours,
      personMonths,
      monthlyCostUsdt: monthlyCost,
      laborCostUsdt,
    };
  });

  const totalLaborCostUsdt =
    roleBreakdown.reduce(
      (sum, role) => sum + role.laborCostUsdt,
      0
    );

  const nonLaborBaseSetupUsdt =
    hasImplementationScope
      ? config.implementation.nonLaborBaseSetupUsdt
      : 0;

  const implementationSubtotalUsdt =
    totalLaborCostUsdt +
    nonLaborBaseSetupUsdt +
    safe(scope.hardwarePurchaseCostUsdt);

  const contingencyUsdt =
    implementationSubtotalUsdt *
    (config.implementation.contingencyPercent / 100);

  const estimatedImplementationCostUsdt =
    implementationSubtotalUsdt +
    contingencyUsdt;

  return {
    configVersion: config.version,
    quantities,
    roleBreakdown,
    technicalTotalHours,
    qaHours,
    pmHours,
    totalLaborCostUsdt,
    nonLaborBaseSetupUsdt,
    hardwarePurchaseCostUsdt:
      safe(scope.hardwarePurchaseCostUsdt),
    implementationSubtotalUsdt,
    contingencyPercent:
      config.implementation.contingencyPercent,
    contingencyUsdt,
    estimatedImplementationCostUsdt,
  };
}

export function calculateAnnualOperatingCost(
  scope: ImplementationScope
) {
  const config = OPERATIONAL_VALUE_CONFIG;

  const hasOperatingScope =
    safe(scope.sites) > 0 ||
    safe(scope.standardConnectors) > 0 ||
    safe(scope.customConnectors) > 0 ||
    safe(scope.machineIntegrationGroups) > 0 ||
    safe(scope.newDataCaptureGroups) > 0 ||
    safe(scope.workflows) > 0 ||
    safe(scope.annualRegistrationTransactions) > 0;

  if (!hasOperatingScope) {
    return {
      configVersion: config.version,

      networkDdc: 0,
      networkCostUsdt: 0,

      infrastructureTier: "none" as const,
      infrastructureCostUsdt: 0,

      connectorMaintenanceHours: 0,
      connectorMaintenanceCostUsdt: 0,

      machineMaintenanceHours: 0,
      machineMaintenanceCostUsdt: 0,

      workflowMaintenanceHours: 0,
      workflowMaintenanceCostUsdt: 0,

      supportHours: 0,
      supportCostUsdt: 0,

      hardwareMaintenanceUsdt: 0,

      estimatedAnnualOperatingCostUsdt: 0,
    };
  }

  const annualRegistrations =
    safe(scope.annualRegistrationTransactions);

  const networkDdc =
    annualRegistrations *
    config.network.feePerRegistrationDdc;

  const networkCostUsdt =
    networkDdc *
    config.network.ddcReferencePriceUsdt;

  const maintenance =
    config.annualOperations.maintenanceHours;

  const connectorMaintenanceHours =
    safe(scope.standardConnectors) *
      maintenance.standardConnector +
    safe(scope.customConnectors) *
      maintenance.customConnector;

  const machineMaintenanceHours =
    safe(scope.machineIntegrationGroups) *
      maintenance.machineIntegrationGroup +
    safe(scope.newDataCaptureGroups) *
      maintenance.newDataCaptureGroup;

  const workflowMaintenanceHours =
    safe(scope.workflows) *
    maintenance.workflow;

  const backendHourly =
    config.labor.roles.backend.monthlyCostUsdt /
    config.labor.productiveHoursPerPersonMonth;

  const industrialHourly =
    config.labor.roles.industrial.monthlyCostUsdt /
    config.labor.productiveHoursPerPersonMonth;

  const ddcHourly =
    config.labor.roles.ddc.monthlyCostUsdt /
    config.labor.productiveHoursPerPersonMonth;

  const connectorMaintenanceCostUsdt =
    connectorMaintenanceHours * backendHourly;

  const machineMaintenanceCostUsdt =
    machineMaintenanceHours * industrialHourly;

  const workflowMaintenanceCostUsdt =
    workflowMaintenanceHours * ddcHourly;

  const infrastructureTier =
    selectInfrastructureTier(scope);

  const infrastructureCostUsdt =
    config.annualOperations.infrastructureTiers[
      infrastructureTier
    ];

  const supportHours =
    config.annualOperations.supportHours[
      infrastructureTier
    ];

  const pmHourly =
    config.labor.roles.pm.monthlyCostUsdt /
    config.labor.productiveHoursPerPersonMonth;

  const supportCostUsdt =
    supportHours * pmHourly;

  const hardwareMaintenanceUsdt =
    safe(scope.hardwarePurchaseCostUsdt) *
    (config.annualOperations.hardwareMaintenancePercent /
      100);

  const estimatedAnnualOperatingCostUsdt =
    networkCostUsdt +
    connectorMaintenanceCostUsdt +
    machineMaintenanceCostUsdt +
    workflowMaintenanceCostUsdt +
    infrastructureCostUsdt +
    supportCostUsdt +
    hardwareMaintenanceUsdt;

  return {
    configVersion: config.version,

    networkDdc,
    networkCostUsdt,

    infrastructureTier,
    infrastructureCostUsdt,

    connectorMaintenanceHours,
    connectorMaintenanceCostUsdt,

    machineMaintenanceHours,
    machineMaintenanceCostUsdt,

    workflowMaintenanceHours,
    workflowMaintenanceCostUsdt,

    supportHours,
    supportCostUsdt,

    hardwareMaintenanceUsdt,

    estimatedAnnualOperatingCostUsdt,
  };
}
