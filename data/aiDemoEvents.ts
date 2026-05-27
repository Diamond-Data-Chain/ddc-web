export const AI_DEMO_EVENTS = [
  {
    category: "Logistics",
    event: "Warehouse Entry Spike",
    status: "Suspicious",
    risk: "HIGH",
    score: 91,
    details: {
      operator: "John D.",
      normalAverage: "20 boxes/day",
      detected: "450 boxes",
    },
    reasons: [
      "2250% deviation from historical average",
      "No matching shipment record found",
      "Inventory pattern inconsistent",
    ],
  },

  {
    category: "Treasury",
    event: "Treasury Transfer Burst",
    status: "Suspicious",
    risk: "HIGH",
    score: 82,
    details: {
      destination: "New wallet",
      amount: "Large transfer volume",
      frequency: "5 transfers in 3 minutes",
    },
    reasons: [
      "Unusual transfer frequency",
      "Destination wallet previously unused",
      "Exceeds normal treasury behavior",
    ],
  },

  {
    category: "Validators",
    event: "Validator #21 Delayed",
    status: "Warning",
    risk: "MEDIUM",
    score: 58,
    details: {
      validator: "#21",
      delay: "18 minutes",
      uptime: "Below normal threshold",
    },
    reasons: [
      "Inconsistent response timing",
      "Validator uptime anomaly",
      "Partial verification delays",
    ],
  },

  {
    category: "Healthcare",
    event: "Patient Record Modification",
    status: "Suspicious",
    risk: "HIGH",
    score: 88,
    details: {
      record: "Patient #4471",
      modification: "Outside approved schedule",
      access: "Unexpected source",
    },
    reasons: [
      "Modification outside maintenance window",
      "Conflicting medical entry detected",
      "Unauthorized access pattern",
    ],
  },

  {
    category: "Manufacturing",
    event: "Batch Registration Conflict",
    status: "Warning",
    risk: "MEDIUM",
    score: 64,
    details: {
      batch: "MX-8821",
      issue: "Duplicate serial registration",
      validation: "Missing QC confirmation",
    },
    reasons: [
      "Duplicate serial pattern",
      "Missing quality validation",
      "Supply chain inconsistency detected",
    ],
  },

  {
    category: "AI Datasets",
    event: "Dataset Integrity Alert",
    status: "Suspicious",
    risk: "HIGH",
    score: 86,
    details: {
      dataset: "Training Batch #19",
      anomaly: "Repeated source injection",
      verification: "Origin mismatch",
    },
    reasons: [
      "Duplicated training records",
      "Suspicious dataset injection",
      "Source authenticity mismatch",
    ],
  },

  {
    category: "Public Administration",
    event: "Registry Approval Anomaly",
    status: "Warning",
    risk: "MEDIUM",
    score: 61,
    details: {
      registry: "Regional Permit Office",
      timing: "Outside approval cycle",
      verification: "Missing authorization chain",
    },
    reasons: [
      "Unexpected approval timing",
      "Authorization chain incomplete",
      "Administrative verification mismatch",
    ],
  },
];
