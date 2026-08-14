"use client";

import { useMemo, useState } from "react";

type MappingStatus =
  | "DEFINED"
  | "UPSTREAM_SEMANTICS_REQUIRED"
  | "UPSTREAM_DATA_REQUIRED"
  | "DDC_DESIGN_REQUIRED"
  | "CASE_EVIDENCE_NOT_PROVIDED";

type RecordId =
  | "subject"
  | "evidence"
  | "evaluation"
  | "response"
  | "interpretation"
  | "dispute"
  | "remedy"
  | "reliance"
  | "relationships";

type Field = {
  label: string;
  value: string;
  status: MappingStatus;
  note?: string;
};

type MappingRecord = {
  id: RecordId;
  code: string;
  title: string;
  description: string;
  fields: Field[];
};

const STATUS_LABELS: Record<MappingStatus, string> = {
  DEFINED: "Defined",
  UPSTREAM_SEMANTICS_REQUIRED: "Upstream semantics required",
  UPSTREAM_DATA_REQUIRED: "Upstream data required",
  DDC_DESIGN_REQUIRED: "DDC design required",
  CASE_EVIDENCE_NOT_PROVIDED: "Case evidence not provided",
};

const STATUS_CLASSES: Record<MappingStatus, string> = {
  DEFINED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  UPSTREAM_SEMANTICS_REQUIRED:
    "border-amber-500/30 bg-amber-500/10 text-amber-300",
  UPSTREAM_DATA_REQUIRED:
    "border-orange-500/30 bg-orange-500/10 text-orange-300",
  DDC_DESIGN_REQUIRED:
    "border-sky-500/30 bg-sky-500/10 text-sky-300",
  CASE_EVIDENCE_NOT_PROVIDED:
    "border-slate-600 bg-slate-800/70 text-slate-400",
};

const records: MappingRecord[] = [
  {
    id: "subject",
    code: "A",
    title: "Subject / Instrument",
    description:
      "Identifies the instrument being evaluated without DDC asserting its legal validity.",
    fields: [
      {
        label: "Subject ID",
        value: "gp_2014_005",
        status: "DEFINED",
      },
      {
        label: "Display name",
        value: "Gauteng Public Library and Information Services Act",
        status: "DEFINED",
      },
      {
        label: "Jurisdiction",
        value: "Gauteng Province, South Africa",
        status: "DEFINED",
      },
      {
        label: "Instrument type claim",
        value: "Provincial Act",
        status: "DEFINED",
        note:
          "Stored as an upstream classification/claim, not as a DDC legal conclusion.",
      },
      {
        label: "Canonical source references",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Document hashes",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "DDC schema version",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
  {
    id: "evidence",
    code: "B",
    title: "Sealed Evidence Manifest",
    description:
      "Freezes the exact evidence state against which the upstream evaluation was made.",
    fields: [
      {
        label: "Evidence set ID",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Gazette reference",
        value: "Gauteng Gazette · 25 December 2014",
        status: "DEFINED",
      },
      {
        label: "Gazette content hash",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Assent search scope",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Commencement search scope",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Search methodology",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
        note:
          "Important because 'not located' is a negative finding and depends on what was searched.",
      },
      {
        label: "Manifest hash",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Sealed at / sealed by",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Evidence-set signature",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
  {
    id: "evaluation",
    code: "C",
    title: "Seven ROL Evaluation",
    description:
      "Preserves the upstream evaluation, framework context, result and provenance without turning the verdict into a DDC legal conclusion.",
    fields: [
      {
        label: "Framework",
        value: "Seven ROL Compliance Categories",
        status: "DEFINED",
      },
      {
        label: "Framework reference",
        value: "DOI 10.5281/zenodo.21134975",
        status: "DEFINED",
      },
      {
        label: "Framework / codebook version",
        value: "Undefined",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
      },
      {
        label: "Evaluation ID",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Evaluator identity",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Evaluator role / authority metadata",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Evaluation timestamp",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Evidence manifest binding",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Authority",
        value: "PASS",
        status: "DEFINED",
      },
      {
        label: "Jurisdiction",
        value: "PASS",
        status: "DEFINED",
      },
      {
        label: "Clarity",
        value: "PASS",
        status: "DEFINED",
      },
      {
        label: "Public Participation",
        value: "PASS",
        status: "DEFINED",
      },
      {
        label: "Publication",
        value: "CONDITIONAL",
        status: "DEFINED",
      },
      {
        label: "Referent",
        value: "PASS",
        status: "DEFINED",
      },
      {
        label: "Commencement",
        value: "FAIL",
        status: "DEFINED",
      },
      {
        label: "Overall verdict",
        value: "FAIL",
        status: "DEFINED",
        note: "Seven ROL verdict — not a DDC legal verdict.",
      },
      {
        label: "Coordination defect",
        value: "Category 7 · Executive failure",
        status: "DEFINED",
      },
      {
        label: "Asserted failure date",
        value: "25 December 2014",
        status: "DEFINED",
      },
      {
        label: "Failure-date derivation rule",
        value: "Undefined",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
      },
      {
        label: "Evaluation signature / provenance proof",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
  {
    id: "response",
    code: "D",
    title: "Institutional Response",
    description:
      "Preserves what the institution actually communicated, independently from anyone's interpretation of that communication.",
    fields: [
      {
        label: "Institution",
        value: "Law Society Library",
        status: "DEFINED",
      },
      {
        label: "Request",
        value: "Locate commencement notice",
        status: "DEFINED",
      },
      {
        label: "Response document",
        value: "December 2014 Gazette",
        status: "DEFINED",
      },
      {
        label: "Recorded statement",
        value: '"has a date too"',
        status: "DEFINED",
      },
      {
        label: "Communication timestamp",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Original message / document hash",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Sender / recipient identity",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Relationship to Seven ROL evaluation",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
        note:
          "Do not assume the institution had seen or rejected the Seven ROL evaluation.",
      },
    ],
  },
  {
    id: "interpretation",
    code: "E",
    title: "Interpretation / Finding",
    description:
      "Separates the evaluator's interpretation from the original institutional communication.",
    fields: [
      {
        label: "Source communication",
        value: "Record D",
        status: "DEFINED",
      },
      {
        label: "Interpretation",
        value:
          "Institutional response treated publication of the Bill as equivalent to assent / commencement.",
        status: "DEFINED",
      },
      {
        label: "Interpretation author",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Reasoning references",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
      {
        label: "Created at",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
      },
    ],
  },
  {
    id: "dispute",
    code: "F",
    title: "Dispute / Disposition / Re-evaluation",
    description:
      "Allows later acceptance, challenge, correction or re-evaluation without changing the original Seven ROL record.",
    fields: [
      {
        label: "Current event",
        value: "No formal disposition supplied",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Actor identity / authority",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Disposition model",
        value: "accepted | disputed | rejected | superseded | corrected",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Evidence references",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
  {
    id: "remedy",
    code: "G",
    title: "Remedy Event",
    description:
      "Records a future remedy as a new event. Historical failure records are never overwritten.",
    fields: [
      {
        label: "Current remedy status",
        value: "No remedy located",
        status: "UPSTREAM_DATA_REQUIRED",
        note:
          "Upstream finding supplied in the Seven ROL example. This does not prove that no remedy exists; the strength of the finding depends on the search scope and methodology.",
      },
      {
        label: "Remedy type",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Remedy instrument",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Actual remedy date",
        value: "Undefined",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
      },
      {
        label: "Instrument claimed effective date",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Remedy evidence",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "DDC remedy registration proof",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
  {
    id: "reliance",
    code: "H",
    title: "Downstream Reliance",
    description:
      "Captures later instruments or actions that are claimed to rely on the upstream instrument or evaluation.",
    fields: [
      {
        label: "Downstream instruments / actions",
        value:
          "Subordinate legislation from February 2018 onward — exact artefacts not yet mapped",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Reliance basis",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Actor / authority",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "Evidence references",
        value: "Undefined",
        status: "CASE_EVIDENCE_NOT_PROVIDED",
      },
      {
        label: "DDC reliance-event schema",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
  {
    id: "relationships",
    code: "R",
    title: "Relationship Assertions",
    description:
      "A link between two valid records is itself an assertion that needs provenance. DDC must not treat references as objective facts by default.",
    fields: [
      {
        label: "Source record",
        value: "Record X",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Target record",
        value: "Record Y",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Relationship type",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Asserted by",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Authority reference",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Relationship evidence",
        value: "Undefined",
        status: "DDC_DESIGN_REQUIRED",
      },
      {
        label: "Relationship status",
        value: "unilateral | acknowledged | disputed | independently verified",
        status: "DDC_DESIGN_REQUIRED",
      },
    ],
  },
];


type DdtLifecycleRecord = {
  ddtId: string;
  subjectRef: string;
  recordType: string;
  action: string;
  actor: string;
  registeredAt: string;
  relatedToRefs?: string[];
  verdict?: string;
  isSimulated?: boolean;
  summary: string;
};

type DDTRecordEnvelopeV01 = {
  identity: {
    ddtId: string;
    ddtFamilyId: string;
    subjectRef: string;
    recordType: string;
    schemaVersion: "ddt-record-envelope-v0.1";
  };

  upstream: {
    sourceSystem: string;
    sourceRecordId?: string | null;
    eventType: string;

    upstreamActor?: {
      identity?: string | null;
      role?: string | null;
      authorityRef?: string | null;
    };

    eventTime?: string | null;

    framework?: {
      name?: string | null;
      version?: string | null;
      reference?: string | null;
    };

    result?: unknown;
    evidenceStateRef?: string | null;
    assertions?: Record<string, unknown>;
  };

  relationships: {
    relatedDDTRefs?: Array<{
      ddtRef: string;
      relationshipType: string;
      assertedBy?: string | null;
      evidenceRef?: string | null;
    }>;
  };

  ddcRegistration: {
    registeredBy?: string | null;
    registrationTime?: string | null;
    payloadHash?: string | null;
    recordHash?: string | null;
    evidenceManifestHash?: string | null;
    signatureAlgorithm?: string | null;
    signature?: string | null;
    registrationProof?: string | null;
  };
};

const DDT_LIFECYCLE_DEMO: DdtLifecycleRecord[] = [
  {
    ddtId: "DDT-gp_2014_005-001",
    subjectRef: "gp_2014_005",
    recordType: "EXTERNAL_EVALUATION",
    action: "Seven ROL evaluation registered",
    actor: "Evaluator identity — upstream data required",
    registeredAt: "LOCAL PROTOTYPE",
    verdict: "FAIL",
    summary:
      "Seven ROL Category evaluation recorded with overall verdict FAIL and Category 7 commencement failure.",
  },
  {
    ddtId: "DDT-gp_2014_005-002",
    subjectRef: "gp_2014_005",
    recordType: "INSTITUTIONAL_RESPONSE",
    action: "Institutional response recorded",
    actor: "Law Society Library / recorder identity unresolved",
    registeredAt: "LOCAL PROTOTYPE",
    relatedToRefs: ["DDT-gp_2014_005-001"],
    summary:
      "Response to commencement-notice request preserved separately from evaluator interpretation.",
  },
  {
    ddtId: "DDT-gp_2014_005-003",
    subjectRef: "gp_2014_005",
    recordType: "INTERPRETATION",
    action: "Evaluator interpretation recorded",
    actor: "Evaluator identity — upstream data required",
    registeredAt: "LOCAL PROTOTYPE",
    relatedToRefs: ["DDT-gp_2014_005-001", "DDT-gp_2014_005-002"],
    summary:
      "Interpretation links the institutional response to the asserted Category 7 coordination defect without rewriting earlier records.",
  },
  {
    ddtId: "DDT-gp_2014_005-004",
    subjectRef: "gp_2014_005",
    recordType: "EXTERNAL_EVALUATION",
    action: "Seven ROL re-evaluation recorded",
    actor: "SIMULATED ACTOR",
    registeredAt: "SIMULATED · 20 Jan 2027",
    relatedToRefs: ["DDT-gp_2014_005-001"],
    isSimulated: true,
    verdict: "UNDEFINED",
    summary:
      "Simulated later Seven ROL evaluation used only to demonstrate chronological DDT record history.",
  },
  {
    ddtId: "DDT-gp_2014_005-005",
    subjectRef: "gp_2014_005",
    recordType: "EXTERNAL_EVALUATION",
    action: "Later Seven ROL evaluation recorded",
    actor: "SIMULATED ACTOR",
    registeredAt: "SIMULATED · 04 Sep 2027",
    relatedToRefs: ["DDT-gp_2014_005-001", "DDT-gp_2014_005-004"],
    isSimulated: true,
    verdict: "UNDEFINED",
    summary:
      "Simulated later Seven ROL evaluation used only to demonstrate how DDT preserves chronological history without determining legal or substantive validity.",
  },

];
type DiscoveryRecord = {
  id: string;
  subjectRef: string;
  title: string;
  source: string;
  recordType: string;
  eventDate: string;
  registrationDate: string;
  jurisdiction: string;
  result?: string;
  simulated: boolean;
};

const DISCOVERY_DEMO: DiscoveryRecord[] = [
  {
    id: "DISC-001",
    subjectRef: "gp_2014_005",
    title: "Gauteng Public Library and Information Services Act",
    source: "Seven ROL",
    recordType: "EXTERNAL_EVALUATION",
    eventDate: "2021-01-07",
    registrationDate: "2021-01-08",
    jurisdiction: "Gauteng Province, South Africa",
    result: "FAIL",
    simulated: true,
  },
  {
    id: "DISC-002",
    subjectRef: "gp_2020_014",
    title: "Gauteng Public Administration Instrument",
    source: "Seven ROL",
    recordType: "EXTERNAL_EVALUATION",
    eventDate: "2021-01-18",
    registrationDate: "2021-01-19",
    jurisdiction: "Gauteng Province, South Africa",
    result: "CONDITIONAL",
    simulated: true,
  },
  {
    id: "DISC-003",
    subjectRef: "wc_2019_021",
    title: "Western Cape Regulatory Instrument",
    source: "Seven ROL",
    recordType: "EXTERNAL_EVALUATION",
    eventDate: "2021-01-27",
    registrationDate: "2021-01-28",
    jurisdiction: "Western Cape, South Africa",
    result: "PASS",
    simulated: true,
  },
  {
    id: "DISC-004",
    subjectRef: "gp_2021_003",
    title: "Gauteng Municipal Coordination Instrument",
    source: "Seven ROL",
    recordType: "EXTERNAL_EVALUATION",
    eventDate: "2021-02-09",
    registrationDate: "2021-02-10",
    jurisdiction: "Gauteng Province, South Africa",
    result: "FAIL",
    simulated: true,
  },
];

const categoryResults = [
  ["Authority", "PASS"],
  ["Jurisdiction", "PASS"],
  ["Clarity", "PASS"],
  ["Public Participation", "PASS"],
  ["Publication", "CONDITIONAL"],
  ["Referent", "PASS"],
  ["Commencement", "FAIL"],
];

function StatusBadge({ status }: { status: MappingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function ResultBadge({ result }: { result: string }) {
  const cls =
    result === "PASS"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : result === "FAIL"
        ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
        : "border-amber-500/30 bg-amber-500/10 text-amber-300";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${cls}`}
    >
      {result}
    </span>
  );
}

export default function SevenRolMappingPage() {
  const [selectedRecord, setSelectedRecord] =
    useState<RecordId>("evaluation");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDdtId, setSelectedDdtId] = useState<string | null>(null);
  const [showSelectedDdtEnvelope, setShowSelectedDdtEnvelope] = useState(false);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [dateType, setDateType] = useState<"event" | "registration">("event");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [advancedSearchError, setAdvancedSearchError] = useState("");
  const [advancedSearchSubmitted, setAdvancedSearchSubmitted] = useState(false);

  const runAdvancedSearch = () => {
    setAdvancedSearchError("");
    setAdvancedSearchSubmitted(false);

    if (!dateFrom || !dateTo) {
      setAdvancedSearchError("Select both From and To dates.");
      return;
    }

    const from = new Date(`${dateFrom}T00:00:00`);
    const to = new Date(`${dateTo}T00:00:00`);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      setAdvancedSearchError("Enter a valid date range.");
      return;
    }

    if (to < from) {
      setAdvancedSearchError("To date cannot be earlier than From date.");
      return;
    }

    const diffDays = Math.floor(
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (diffDays > 31) {
      setAdvancedSearchError(
        "Maximum discovery search range is 31 days."
      );
      return;
    }

    setAdvancedSearchSubmitted(true);
  };

  const advancedDiscoveryResults = useMemo(() => {
    if (!advancedSearchSubmitted || !dateFrom || !dateTo) return [];

    const from = new Date(`${dateFrom}T00:00:00`);
    const to = new Date(`${dateTo}T23:59:59`);

    return DISCOVERY_DEMO.filter((record) => {
      const rawDate =
        dateType === "event" ? record.eventDate : record.registrationDate;

      const recordDate = new Date(`${rawDate}T12:00:00`);

      return recordDate >= from && recordDate <= to;
    });
  }, [advancedSearchSubmitted, dateFrom, dateTo, dateType]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const directSearchMatches = useMemo(() => {
    if (!normalizedSearch) return [];

    return DDT_LIFECYCLE_DEMO.filter((record) =>
      [
        record.ddtId,
        record.subjectRef,
        record.recordType,
        record.action,
        record.actor,
        record.summary,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const matchedSubjectRefs = useMemo(() => {
    return Array.from(
      new Set(directSearchMatches.map((record) => record.subjectRef))
    );
  }, [directSearchMatches]);

  const lifecycleSearchResults = useMemo(() => {
    if (!normalizedSearch || matchedSubjectRefs.length === 0) return [];

    return DDT_LIFECYCLE_DEMO.filter((record) =>
      matchedSubjectRefs.includes(record.subjectRef)
    );
  }, [normalizedSearch, matchedSubjectRefs]);

  const directSearchMatchIds = useMemo(() => {
    const query = normalizedSearch.toLowerCase();

    const exactDdtMatch = DDT_LIFECYCLE_DEMO.find(
      (record) => record.ddtId.toLowerCase() === query
    );

    return new Set(exactDdtMatch ? [exactDdtMatch.ddtId] : []);
  }, [normalizedSearch]);

  const latestRegisteredRecord = useMemo(() => {
    if (lifecycleSearchResults.length === 0) return null;

    const subject = lifecycleSearchResults[0].subjectRef;

    const subjectRecords = DDT_LIFECYCLE_DEMO.filter(
      (record) => record.subjectRef === subject
    );

    return subjectRecords.length > 0
      ? subjectRecords[subjectRecords.length - 1]
      : null;
  }, [lifecycleSearchResults]);

  const selectedDdtRecord = useMemo(() => {
    if (!selectedDdtId) return null;

    return (
      DDT_LIFECYCLE_DEMO.find(
        (record) => record.ddtId === selectedDdtId
      ) ?? null
    );
  }, [selectedDdtId]);

  const selectedDdtEnvelope = useMemo<DDTRecordEnvelopeV01 | null>(() => {
    if (!selectedDdtRecord) return null;

    const isPrimarySevenRolEvaluation =
      selectedDdtRecord.ddtId === "DDT-gp_2014_005-001";

    return {
      identity: {
        ddtId: selectedDdtRecord.ddtId,
        ddtFamilyId: `DDT-${selectedDdtRecord.subjectRef}`,
        subjectRef: selectedDdtRecord.subjectRef,
        recordType: selectedDdtRecord.recordType,
        schemaVersion: "ddt-record-envelope-v0.1",
      },

      upstream: {
        sourceSystem: "Seven ROL",
        sourceRecordId: null,
        eventType: selectedDdtRecord.recordType,

        upstreamActor: {
          identity:
            selectedDdtRecord.actor.includes("required") ||
            selectedDdtRecord.actor.includes("SIMULATED")
              ? null
              : selectedDdtRecord.actor,
          role: null,
          authorityRef: null,
        },

        eventTime: null,

        framework: {
          name: "Seven ROL Compliance Categories",
          version: null,
          reference: "10.5281/zenodo.21134975",
        },

        result:
          isPrimarySevenRolEvaluation
            ? {
                authority: "PASS",
                jurisdiction: "PASS",
                clarity: "PASS",
                publicParticipation: "PASS",
                publication: "CONDITIONAL",
                referent: "PASS",
                commencement: "FAIL",
                overallVerdict: "FAIL",
              }
            : selectedDdtRecord.verdict
              ? {
                  overallVerdict: selectedDdtRecord.verdict,
                }
              : null,

        evidenceStateRef: null,

        assertions:
          isPrimarySevenRolEvaluation
            ? {
                coordinationDefect: "Category 7",
                coordinationDefectType: "Executive failure",
                failureDate: "2014-12-25",
              }
            : {},
      },

      relationships: {
        relatedDDTRefs:
          selectedDdtRecord.relatedToRefs?.map((ddtRef) => ({
            ddtRef,
            relationshipType: "RELATED_TO",
            assertedBy: null,
            evidenceRef: null,
          })) ?? [],
      },

      ddcRegistration: {
        registeredBy: null,
        registrationTime:
          selectedDdtRecord.registeredAt === "LOCAL PROTOTYPE"
            ? null
            : selectedDdtRecord.registeredAt,
        payloadHash: null,
        recordHash: null,
        evidenceManifestHash: null,
        signatureAlgorithm: null,
        signature: null,
        registrationProof: null,
      },
    };
  }, [selectedDdtRecord]);

  const currentRecord = useMemo(
    () => records.find((record) => record.id === selectedRecord)!,
    [selectedRecord]
  );

  const counts = useMemo(() => {
    const values: Record<MappingStatus, number> = {
      DEFINED: 0,
      UPSTREAM_SEMANTICS_REQUIRED: 0,
      UPSTREAM_DATA_REQUIRED: 0,
      DDC_DESIGN_REQUIRED: 0,
      CASE_EVIDENCE_NOT_PROVIDED: 0,
    };

    records.forEach((record) => {
      record.fields.forEach((field) => {
        values[field.status] = (values[field.status] ?? 0) + 1;
      });
    });

    return values;
  }, []);



  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 border-b border-slate-800 pb-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-violet-300">
              Local prototype
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
              Not production
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
              Not a formal Seven ROL integration
            </span>
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-sky-400">
            Diamond Data Chain
          </p>

          <h1 className="max-w-5xl text-3xl font-bold tracking-tight sm:text-4xl">
            Seven ROL → DDC Mapping Workbench
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-400">
            A working model for mapping a real upstream Seven ROL
            evaluation into a DDC preservation and independent
            verification structure. Unknown fields remain visibly
            unresolved rather than being filled with assumptions.
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {(
            [
              "DEFINED",
              "UPSTREAM_SEMANTICS_REQUIRED",
              "UPSTREAM_DATA_REQUIRED",
              "DDC_DESIGN_REQUIRED",
              "CASE_EVIDENCE_NOT_PROVIDED",
            ] as MappingStatus[]
          ).map((status) => (
            <div
              key={status}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <StatusBadge status={status} />
              <div className="mt-4 text-3xl font-bold">
                {counts[status]}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                mapped fields
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8 rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                DDT lifecycle & search
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Search a DDT record or subject
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                DDT is the immutable record of a registered event. Each new
                relevant event can create a new DDT record. DDC preserves the
                records chronologically without deciding whether the upstream
                content, conclusion or legal interpretation is correct.
              </p>
            </div>

            <div className="w-full xl:max-w-xl">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search by subject reference, DDT ID, record type or text
              </label>

              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Try gp_2014_005 or DDT-gp_2014_005-001"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                DDT
              </div>
              <div className="mt-2 text-lg font-bold">
                Immutable event record
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-400">
                A new evaluation, response, correction, dispute, remedy or other
                recordable event creates a new DDT.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Record history
              </div>
              <div className="mt-2 text-lg font-bold">
                Chronological and independently attributable
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-400">
                DDC preserves what was recorded, by whom and when. The latest
                record is the most recently registered DDT for the subject,
                not a DDC judgment about legal or substantive validity.
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAdvancedSearch((value) => !value)}
              className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {showAdvancedSearch ? "Hide advanced search" : "Advanced search"}
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Date-based discovery
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-100">
                  Search records by date
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Use this when the document or DDT identifier is unknown.
                  Date-based searches are limited to a maximum range of 31 days.
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-300">
                  Date applies to
                </p>

                <div className="mt-3 flex flex-wrap gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input
                      type="radio"
                      name="ddt-date-type"
                      value="event"
                      checked={dateType === "event"}
                      onChange={() => {
                        setDateType("event");
                        setAdvancedSearchSubmitted(false);
                        setAdvancedSearchError("");
                      }}
                    />
                    Event date
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input
                      type="radio"
                      name="ddt-date-type"
                      value="registration"
                      checked={dateType === "registration"}
                      onChange={() => {
                        setDateType("registration");
                        setAdvancedSearchSubmitted(false);
                        setAdvancedSearchError("");
                      }}
                    />
                    DDT registration date
                  </label>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">
                    From
                  </span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => {
                      setDateFrom(event.target.value);
                      setAdvancedSearchSubmitted(false);
                      setAdvancedSearchError("");
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">
                    To
                  </span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => {
                      setDateTo(event.target.value);
                      setAdvancedSearchSubmitted(false);
                      setAdvancedSearchError("");
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                  />
                </label>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Maximum range: 31 days
              </div>

              {advancedSearchError && (
                <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {advancedSearchError}
                </div>
              )}

              <button
                type="button"
                onClick={runAdvancedSearch}
                className="mt-5 w-full rounded-xl bg-sky-500 px-5 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400 md:w-auto md:min-w-[180px]"
              >
                Search
              </button>

              {advancedSearchSubmitted && (
                <div className="mt-5">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="text-sm font-semibold text-slate-200">
                      Discovery results
                    </div>

                    <div className="mt-2 text-sm leading-6 text-slate-400">
                      Search type:{" "}
                      <span className="text-slate-200">
                        {dateType === "event"
                          ? "Event date"
                          : "DDT registration date"}
                      </span>
                      <br />
                      Range:{" "}
                      <span className="text-slate-200">
                        {dateFrom} → {dateTo}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-violet-300">
                      SIMULATED DISCOVERY DATASET
                    </div>
                  </div>

                  {advancedDiscoveryResults.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                      <div className="text-sm font-semibold text-amber-200">
                        No records found
                      </div>
                      <div className="mt-2 text-sm text-slate-400">
                        No simulated records match this 31-day range.
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {advancedDiscoveryResults.map((record) => (
                        <button
                          key={record.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(record.subjectRef);
                            setShowAdvancedSearch(false);
                          }}
                          className="block w-full rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-sky-500/50 hover:bg-slate-900"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="font-bold text-slate-100">
                                {record.title}
                              </div>
                              <div className="mt-1 text-sm text-sky-300">
                                {record.subjectRef}
                              </div>
                            </div>

                            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold text-violet-300">
                              SIMULATED
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                            <div>
                              Source:{" "}
                              <span className="text-slate-200">
                                {record.source}
                              </span>
                            </div>

                            <div>
                              Type:{" "}
                              <span className="text-slate-200">
                                {record.recordType}
                              </span>
                            </div>

                            <div>
                              Event date:{" "}
                              <span className="text-slate-200">
                                {record.eventDate}
                              </span>
                            </div>

                            <div>
                              Registration date:{" "}
                              <span className="text-slate-200">
                                {record.registrationDate}
                              </span>
                            </div>

                            <div>
                              Jurisdiction:{" "}
                              <span className="text-slate-200">
                                {record.jurisdiction}
                              </span>
                            </div>

                            {record.result && (
                              <div>
                                Result:{" "}
                                <span className="text-slate-200">
                                  {record.result}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 text-xs font-semibold text-sky-300">
                            Open subject history →
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {searchQuery.trim() && (
            <div className="mt-6">
              {lifecycleSearchResults.length === 0 ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-200">
                  No matching local prototype record.
                </div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Latest registered record
                    </p>

                    {latestRegisteredRecord && (
                      <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xl font-bold text-slate-100">
                            {latestRegisteredRecord.ddtId}
                          </span>

                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                            LATEST RECORD
                          </span>

                          {latestRegisteredRecord.isSimulated && (
                            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-300">
                              SIMULATED
                            </span>
                          )}
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div>
                            <span className="text-slate-500">Subject: </span>
                            <span className="text-slate-200">
                              {latestRegisteredRecord.subjectRef}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500">DDT family: </span>
                            <span className="text-slate-200">
                              DDT-{latestRegisteredRecord.subjectRef}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500">Record type: </span>
                            <span className="text-slate-200">
                              {latestRegisteredRecord.recordType}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500">Action: </span>
                            <span className="text-slate-200">
                              {latestRegisteredRecord.action}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500">Recorded by: </span>
                            <span className="text-slate-200">
                              {latestRegisteredRecord.actor}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500">Registered: </span>
                            <span className="text-slate-200">
                              {latestRegisteredRecord.registeredAt}
                            </span>
                          </div>

                          {latestRegisteredRecord.verdict && (
                            <div>
                              <span className="text-slate-500">Result: </span>
                              <span className="text-slate-200">
                                {latestRegisteredRecord.verdict}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="mt-4 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">
                          Latest means most recently registered for this subject.
                          It does not mean DDC considers the record legally,
                          factually or substantively correct.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                          Chronological record history
                        </p>
                        <h3 className="mt-2 text-xl font-bold">
                          DDT-{lifecycleSearchResults[0]?.subjectRef}
                        </h3>

                        <div className="mt-1 text-sm text-slate-400">
                          {lifecycleSearchResults.length} chronological DDT records found
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      {lifecycleSearchResults.map((record, index) => (
                        <button
                          key={record.ddtId}
                          type="button"
                          onClick={() => setSelectedDdtId(record.ddtId)}
                          className="relative block w-full rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-sky-500/50 hover:bg-slate-900"
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-100">
                                  {record.ddtId}
                                </span>

                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                    latestRegisteredRecord?.ddtId === record.ddtId
                                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                      : "border-sky-500/30 bg-sky-500/10 text-sky-300"
                                  }`}
                                >
                                  {latestRegisteredRecord?.ddtId === record.ddtId
                                    ? "LATEST RECORD"
                                    : "RECORDED"}
                                </span>

                                {directSearchMatchIds.has(record.ddtId) && (
                                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                                    SEARCH MATCH
                                  </span>
                                )}
                              </div>

                              <div className="mt-2 text-sm font-medium text-sky-300">
                                {record.action}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                {record.recordType}
                              </div>
                            </div>

                            <div className="text-xs text-slate-500">
                              {record.registeredAt}
                            </div>
                          </div>

                          <div className="mt-3 text-sm leading-6 text-slate-400">
                            {record.summary}
                          </div>

                          <div className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-500">
                            Actor: {record.actor}
                          </div>

                          {record.relatedToRefs &&
                            record.relatedToRefs.length > 0 && (
                              <div className="mt-1 text-xs text-slate-500">
                                Related to: {record.relatedToRefs.join(", ")}
                              </div>
                            )}



                          {index < lifecycleSearchResults.length - 1 && (
                            <div className="absolute -bottom-5 left-6 h-5 border-l border-slate-700" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {selectedDdtRecord && (
          <section className="mb-8 rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  DDT record detail
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-100">
                  {selectedDdtRecord.ddtId}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Detailed view of one immutable DDT event record.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-semibold text-sky-300">
                    DDT Record Envelope v0.1
                  </span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-semibold text-amber-300">
                    DRAFT
                  </span>
                </div>

                <p className="mt-3 font-mono text-xs text-slate-500">
                  Specification: docs/ddt/DDT_RECORD_ENVELOPE_V0.1.md
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDdtId(null);
                  setShowSelectedDdtEnvelope(false);
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  Upstream content
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">Subject: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.subjectRef}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Record type: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.recordType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Action: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.action}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Upstream actor / evaluator: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.actor}
                    </span>
                  </div>

                  {selectedDdtRecord.verdict && (
                    <div>
                      <span className="text-slate-500">Result: </span>
                      <span className="text-slate-200">
                        {selectedDdtRecord.verdict}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-500">Event time: </span>
                    <span className="text-amber-300">
                      Upstream data required
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Framework version: </span>
                    <span className="text-amber-300">
                      Upstream data required
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Evidence state: </span>
                    <span className="text-amber-300">
                      Upstream data required
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                  DDC registration
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">DDT ID: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.ddtId}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">DDT family: </span>
                    <span className="text-slate-200">
                      DDT-{selectedDdtRecord.subjectRef}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Registered: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.registeredAt}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Record hash: </span>
                    <span className="text-sky-300">
                      DDC design required
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Schema version: </span>
                    <span className="text-sky-300">
                      DDC design required
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Registration proof: </span>
                    <span className="text-sky-300">
                      DDC design required
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                  Context & relationships
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">Source system: </span>
                    <span className="text-slate-200">
                      Seven ROL
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Source record ID: </span>
                    <span className="text-amber-300">
                      Upstream data required
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Related DDT records: </span>
                    <span className="text-slate-200">
                      {selectedDdtRecord.relatedToRefs &&
                      selectedDdtRecord.relatedToRefs.length > 0
                        ? selectedDdtRecord.relatedToRefs.join(", ")
                        : "None"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Relationship meaning: </span>
                    <span className="text-sky-300">
                      DDC design required
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Authority reference: </span>
                    <span className="text-sky-300">
                      DDC design required
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedDdtEnvelope && (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Machine-readable record
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-100">
                      DDT Record Envelope v0.1
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowSelectedDdtEnvelope((value) => !value)
                    }
                    className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                  >
                    {showSelectedDdtEnvelope
                      ? "Hide machine-readable record"
                      : "View machine-readable record"}
                  </button>
                </div>

                {showSelectedDdtEnvelope && (
                  <pre className="mt-5 overflow-x-auto rounded-xl border border-slate-800 bg-black/40 p-4 text-xs leading-6 text-slate-300">
                    {JSON.stringify(selectedDdtEnvelope, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                DDC boundary
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                DDC can preserve that this exact record was registered at a
                provable time with a specific payload and provenance. DDC does
                not determine whether the upstream conclusion, interpretation
                or legal position inside the record is true.
              </p>
            </div>
          </section>
        )}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Source evaluation
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Gauteng Public Library and Information Services Act
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              gp_2014_005 · Gauteng Province, South Africa · Seven
              ROL Compliance Category evaluation
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {categoryResults.map(([category, result]) => (
              <div
                key={category}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"
              >
                <span className="text-sm text-slate-300">
                  {category}
                </span>
                <ResultBadge result={result} />
              </div>
            ))}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
              <span className="text-sm font-semibold">
                Overall verdict
              </span>
              <ResultBadge result="FAIL" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Coordination defect
              </div>
              <div className="mt-2 font-semibold">
                Category 7 · Executive failure
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Asserted failure date
              </div>
              <div className="mt-2 font-semibold">
                25 December 2014
              </div>
              <div className="mt-1 text-xs text-amber-300">
                Derivation rule still required from upstream
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Remedy
              </div>
              <div className="mt-2 font-semibold">
                No remedy located
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Law-days-lost calculation remains unresolved
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Evidence graph
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Proposed DDC record chain
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
              Select a node to inspect what is currently defined,
              what Seven ROL still needs to clarify, and what belongs
              to DDC design.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {records.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  selectedRecord === record.id
                    ? "border-sky-500 bg-sky-500/10 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="mr-2 text-xs font-bold text-sky-400">
                  {record.code}
                </span>
                <span className="text-sm font-semibold">
                  {record.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-6 border-b border-slate-800 pb-5">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                Record {currentRecord.code}
              </div>
              <h2 className="mt-2 text-2xl font-bold">
                {currentRecord.title}
              </h2>
              <p className="mt-2 leading-6 text-slate-400">
                {currentRecord.description}
              </p>
            </div>

            <div className="space-y-3">
              {currentRecord.fields.map((field) => (
                <div
                  key={`${currentRecord.id}-${field.label}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {field.label}
                      </div>
                      <div
                        className={`mt-1 text-sm ${
                          field.value === "Undefined"
                            ? "italic text-slate-500"
                            : "text-slate-200"
                        }`}
                      >
                        {field.value}
                      </div>
                    </div>

                    <StatusBadge status={field.status} />
                  </div>

                  {field.note && (
                    <div className="mt-3 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-500">
                      {field.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                DDC boundary
              </p>
              <h3 className="mt-2 text-xl font-bold">
                What DDC is claiming
              </h3>

              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
                <p>
                  DDC does <strong className="text-slate-200">not</strong>{" "}
                  determine whether the Seven ROL legal conclusion is
                  correct.
                </p>
                <p>
                  It should preserve who evaluated what, against which
                  evidence and framework version, what result was
                  produced, and how the history evolved afterward.
                </p>
                <p>
                  A historical date asserted by the evaluator must
                  remain separate from the time at which DDC can
                  cryptographically prove that assertion was
                  registered.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Current upstream questions
              </p>

              <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
                <li>
                  <strong>1.</strong> How exactly is the 25 Dec 2014
                  failure date derived?
                </li>
                <li>
                  <strong>2.</strong> What is the precise law-days-lost
                  calculation rule?
                </li>
                <li>
                  <strong>3.</strong> Does a Seven ROL evaluation have
                  a frozen evidence state?
                </li>
                <li>
                  <strong>4.</strong> What evaluation ID, timestamp,
                  evaluator identity, framework version and authority
                  metadata exist?
                </li>
              </ol>
            </div>

            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">
                Architecture review flags
              </p>

              <div className="mt-4 space-y-3">
                {[
                  {
                    level: "HIGH",
                    text: "Evidence state must be sealed before or at evaluation time.",
                  },
                  {
                    level: "HIGH",
                    text: "Evaluator identity alone does not prove authority at evaluation time.",
                  },
                  {
                    level: "HIGH",
                    text: "Relationships between records are assertions, not facts by default.",
                  },
                  {
                    level: "HIGH",
                    text: "Historical failure date must remain separate from DDC proof-of-existence time.",
                  },
                  {
                    level: "MEDIUM",
                    text: "Negative findings depend on documented search scope and methodology.",
                  },
                  {
                    level: "OPEN",
                    text: "Law-days-lost calculation semantics are not yet defined.",
                  },
                  {
                    level: "OPEN",
                    text: "Competing, corrected and superseding evaluations need explicit lifecycle rules.",
                  },
                ].map((flag) => (
                  <div
                    key={flag.text}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex gap-3">
                      <span
                        className={`shrink-0 text-xs font-bold ${
                          flag.level === "HIGH"
                            ? "text-rose-300"
                            : flag.level === "MEDIUM"
                              ? "text-amber-300"
                              : "text-sky-300"
                        }`}
                      >
                        {flag.level}
                      </span>

                      <p className="text-sm leading-5 text-slate-300">
                        {flag.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Independent verification
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              What could a third party verify today?
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Instrument identity", "PARTIAL"],
              ["Seven ROL category results", "SOURCE PROVIDED"],
              ["Overall Seven ROL verdict", "SOURCE PROVIDED"],
              ["Exact evidence state", "NOT YET"],
              ["Evaluator provenance", "NOT YET"],
              ["Evaluation timestamp", "NOT YET"],
              ["Failure-date derivation", "NOT YET"],
              ["Institutional response evidence", "PARTIAL"],
              ["Remedy evidence", "OPEN"],
              ["Law days lost", "NOT CALCULATED"],
              ["DDC registration proof", "LOCAL ONLY"],
              ["Offline independent verification", "NOT YET"],
            ].map(([label, status]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
              >
                <span className="text-sm text-slate-300">{label}</span>
                <span className="text-xs font-bold text-slate-500">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-800 py-6 text-xs leading-5 text-slate-500">
          Local architecture workbench only. This page does not represent
          a production integration, legal conclusion, partnership, or
          finalized DDC schema.
        </footer>
      </div>
    </main>
  );
}
