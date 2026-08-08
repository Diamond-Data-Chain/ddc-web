export const OPERATIONAL_VALUE_CONFIG = {
  version: "2.0",

  network: {
    ddcReferencePriceUsdt: 0.79,
    feePerRegistrationDdc: 0.0001,
  },

  labor: {
    productiveHoursPerPersonMonth: 160,

    roles: {
      architect: {
        label: "Solution / Integration Architect",
        monthlyCostUsdt: 9500,
      },
      backend: {
        label: "Backend / Integration Engineer",
        monthlyCostUsdt: 8000,
      },
      ddc: {
        label: "DDC / Blockchain Engineer",
        monthlyCostUsdt: 9000,
      },
      industrial: {
        label: "Data / Industrial Integration Engineer",
        monthlyCostUsdt: 8500,
      },
      qa: {
        label: "QA / Test Engineer",
        monthlyCostUsdt: 5500,
      },
      pm: {
        label: "Implementation Lead / PM",
        monthlyCostUsdt: 8500,
      },
    },
  },

  implementation: {
    contingencyPercent: 15,

    nonLaborBaseSetupUsdt: 5000,

    qaPercentOfTechnicalHours: 20,
    pmPercentOfPrePmHours: 12,

    workUnits: {
      baseDeployment: {
        architect: 24,
        backend: 16,
        ddc: 40,
        industrial: 0,
      },

      siteDeployment: {
        architect: 5,
        backend: 4,
        ddc: 4,
        industrial: 8,
      },

      standardConnector: {
        architect: 6,
        backend: 24,
        ddc: 8,
        industrial: 8,
      },

      customConnector: {
        architect: 10,
        backend: 40,
        ddc: 12,
        industrial: 16,
      },

      machineIntegrationGroup: {
        architect: 4,
        backend: 8,
        ddc: 4,
        industrial: 20,
      },

      newDataCaptureGroup: {
        architect: 4,
        backend: 6,
        ddc: 2,
        industrial: 24,
      },

      workflowConfiguration: {
        architect: 4,
        backend: 8,
        ddc: 8,
        industrial: 2,
      },

      dataMappingSchema: {
        architect: 3,
        backend: 8,
        ddc: 4,
        industrial: 4,
      },

      securityComplianceReview: {
        architect: 12,
        backend: 4,
        ddc: 8,
        industrial: 2,
      },
    },
  },

  manufacturing: {
    machineIntegrationGroupSize: {
      mesApi: 100,
      plcInterface: 25,
      existingSensors: 25,
      newCapture: 20,
      mixedUnsure: 25,
    },

    newDataCaptureGroupSize: {
      newCapture: 20,
      mixedUnsure: 50,
    },
  },

  healthcare: {
    deviceIntegrationGroupSize: {
      ehrApi: 100,
      devicePlatform: 50,
      existingInterface: 25,
      newCapture: 20,
      mixedUnsure: 25,
    },

    newDataCaptureGroupSize: {
      newCapture: 20,
      mixedUnsure: 50,
    },
  },

  transport: {
    vehicleIntegrationGroupSize: {
      tmsApi: 100,
      telematics: 50,
      iotPlatform: 50,
      newOnboardDevices: 25,
      mixedUnsure: 50,
    },

    newDataCaptureGroupSize: {
      newOnboardDevices: 25,
      mixedUnsure: 75,
    },
  },

  banking: {
    transactionIntegrationGroupSize: {
      coreBankingApi: 1000000,
      transactionMonitoring: 500000,
      riskFraudPlatform: 500000,
      customLegacy: 250000,
      mixedUnsure: 500000,
    },
  },

  insurance: {
    claimIntegrationGroupSize: {
      policyClaimsApi: 100000,
      claimsPlatform: 50000,
      fraudAssessmentPlatform: 50000,
      customLegacy: 25000,
      mixedUnsure: 50000,
    },
  },

  energy: {
    assetIntegrationGroupSize: {
      scadaApi: 250,
      iotPlatform: 100,
      meterPlatform: 500,
      existingInterface: 100,
      newCapture: 50,
      mixedUnsure: 100,
    },

    newDataCaptureGroupSize: {
      newCapture: 50,
      mixedUnsure: 200,
    },
  },

  infrastructureComplexity: {
    weights: {
      site: 2,
      standardConnector: 2,
      customConnector: 4,
      machineIntegrationGroup: 2,
      newDataCaptureGroup: 3,
      workflow: 1,
    },

    thresholds: {
      medium: 8,
      large: 20,
      enterprise: 40,
    },
  },

  annualOperations: {
    maintenanceHours: {
      standardConnector: 16,
      customConnector: 32,
      machineIntegrationGroup: 18,
      newDataCaptureGroup: 24,
      workflow: 8,
    },

    infrastructureTiers: {
      small: 2400,
      medium: 6000,
      large: 12000,
      enterprise: 24000,
    },

    supportHours: {
      small: 40,
      medium: 80,
      large: 160,
      enterprise: 280,
    },

    hardwareMaintenancePercent: 12,
  },

  efficiency: {
    staffRecordHandlingReductionPercent: 35,
    otherRecordManagementReductionPercent: 25,
    investigationLaborReductionPercent: 50,
  },
} as const;

export type OperationalValueConfig =
  typeof OPERATIONAL_VALUE_CONFIG;
