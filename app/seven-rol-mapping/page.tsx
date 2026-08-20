"use client";

import { useEffect, useMemo, useState } from "react";
import canonicalize from "canonicalize";

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
        value: "Gauteng Provincial Gazette No. 377 · 25 December 2014",
        status: "DEFINED",
      },
      {
        label: "Evaluation evidence state",
        value:
          "Gazette record as published at evaluation time; a later correction or supplement requires a new evaluation.",
        status: "DEFINED",
        note:
          "The original evaluation remains the record of what the instrument showed at the point of evaluation.",
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
        value: "Rita Felgate",
        status: "DEFINED",
      },
      {
        label: "Evaluator role / authority metadata",
        value:
          "Independent legal practitioner and governance researcher · ruleoflaw.science",
        status: "DEFINED",
        note:
          "Role and identity supplied upstream. This does not by itself establish DDC-verified authority.",
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
        value: "NOT YET VERIFIED",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
        note:
          "Broadly consistent with the SROL analysis, but formal PASS status requires verification against the published codebook.",
      },
      {
        label: "Jurisdiction",
        value: "NOT YET VERIFIED",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
        note:
          "Broadly consistent with the SROL analysis, but formal PASS status requires verification against the published codebook.",
      },
      {
        label: "Clarity",
        value: "NOT YET VERIFIED",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
        note:
          "Broadly consistent with the SROL analysis, but formal PASS status requires verification against the published codebook.",
      },
      {
        label: "Public Participation",
        value: "NOT YET VERIFIED",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
        note:
          "Broadly consistent with the SROL analysis, but formal PASS status requires verification against the published codebook.",
      },
      {
        label: "Publication",
        value: "CONDITIONAL",
        status: "DEFINED",
      },
      {
        label: "Referent",
        value: "NOT YET VERIFIED",
        status: "UPSTREAM_SEMANTICS_REQUIRED",
        note:
          "Broadly consistent with the SROL analysis, but formal PASS status requires verification against the published codebook.",
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
        note:
          "Derived from Gauteng Provincial Gazette No. 377, when the Speaker's certified copy entered the public record. The identified failure is the absence of a located Premier assent record for the published Bill, not publication itself.",
      },
      {
        label: "Failure-date derivation rule",
        value:
          "25 December 2014 is the publication date of the Speaker's certified copy in Gauteng Provincial Gazette No. 377, when the instrument entered the public record.",
        status: "DEFINED",
        note:
          "The identified failure is not publication itself. The published instrument was a Bill passed by the Legislature and labelled an Act, while no Premier assent stamp or assent record has been located.",
      },
      {
        label: "Upstream evaluation signature / provenance proof",
        value: "Undefined",
        status: "UPSTREAM_DATA_REQUIRED",
        note:
          "No upstream evaluation signature or independent provenance proof has been supplied. This is separate from the local DDC prototype registration signature.",
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

type DDTRecordEnvelopeV02 = {
  identity: {
    ddtId: string;
    ddtFamilyId: string;
    subjectRef: string;
    recordType: string;
    schemaVersion: "ddt-record-envelope-v0.2";
    previousRecordInFamily?: {
      ddtRef: string;
      recordHash: string | null;
    } | null;
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
      versionReference?: string | null;
    } | null;

    result?: unknown;
    evidenceStateRef?: string | null;
    assertions?: Record<string, unknown>;
  };

  relationships: {
    relatedDDTRefs?: Array<{
      ddtRef: string;
      recordHash: string | null;
      relationshipType:
        | "supersedes"
        | "responds_to"
        | "disputes"
        | "corrects"
        | "remedies"
        | "references";
      assertedBy?: string | null;
      evidenceRef?: string | null;
    }>;
  };

  ddcRegistration: {
    registeredBy?: string | null;
    registrationTime?: string | null;
    payloadCanonicalization?: string | null;
    payloadCanonicalizationImplementation?: string | null;
    payloadHashAlgorithm?: string | null;
    payloadHash?: string | null;
    registeredPayloadCommitment?: string | null;
    payloadIntegrityStatus?:
      | "VERIFIED"
      | "FAILED"
      | "NOT AVAILABLE"
      | "PENDING";
    recordHash?: string | null;
    evidenceManifestHash?: string | null;

    // Registration / provenance proof layer — DDT Envelope v0.2 §29
    signingKeyRef?: string | null;
    signingKeyId?: string | null;
    signingKeyStatus?: "ACTIVE" | "ROTATED" | "REVOKED" | "UNRESOLVED" | null;
    signingKeyValidFrom?: string | null;
    signingKeyValidUntil?: string | null;
    signingKeyRegistryRef?: string | null;
    signatureAlgorithm?: string | null;
    signature?: string | null;

    signatureProofs?: Array<{
      algorithm: string;
      signingKeyId?: string | null;
      signingKeyRef?: string | null;
      signature: string;
      status: "VERIFIED" | "FAILED" | "NOT AVAILABLE";
      profile?: string | null;
    }>;

    proofMethod?: string | null;
    proofRef?: string | null;
    trustAnchorRef?: string | null;

    registrationSignatureStatus?:
      | "VERIFIED"
      | "FAILED"
      | "NOT AVAILABLE";
    registrationTimeStatus?:
      | "PROVEN"
      | "ASSERTED"
      | "FAILED"
      | "NOT AVAILABLE";

    timeProofs?: Array<{
      type: "RFC3161" | "REKOR" | "OPENTIMESTAMPS" | "OTHER";
      proofRef?: string | null;
      proof?: string | null;
      anchoredAt?: string | null;
      verifier?: string | null;
      status: "PROVEN" | "FAILED" | "NOT AVAILABLE";
    }>;
    registrantIdentityStatus?:
      | "VERIFIED"
      | "ASSERTED"
      | "UNRESOLVED"
      | "NOT AVAILABLE";
    registrantAuthorityStatus?:
      | "VERIFIED"
      | "ASSERTED"
      | "UNRESOLVED"
      | "NOT AVAILABLE";
    independentProvenanceStatus?:
      | "VERIFIED"
      | "UNRESOLVED"
      | "NOT AVAILABLE";

    registrationProof?: string | null;
  };
};

// Frozen historical v0.1 prototype commitment.
const PILOT_PAYLOAD_COMMITMENTS_V01: Record<string, string> = {
  "DDT-gp_2014_005-001":
    "bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9",
};

// v0.2 prototype commitment generated from the updated upstream payload.
const PILOT_PAYLOAD_COMMITMENTS_V02: Record<string, string> = {
  "DDT-gp_2014_005-001":
    "44692173f2665c8aeee432a2bf1801072f382f7aeda22b32be6487b76d7ba59e",
};

// Frozen v0.2 record-level commitment for the first DDT family record.
const PILOT_RECORD_HASHES_V02: Record<string, string> = {
  "DDT-gp_2014_005-001":
    "62ee41042882f82ac8326f2a07bfe6f4abf6468ddce1c4be41755e49aee44dab",
};

const DDT_LIFECYCLE_DEMO: DdtLifecycleRecord[] = [
  {
    ddtId: "DDT-gp_2014_005-001",
    subjectRef: "gp_2014_005",
    recordType: "EXTERNAL_EVALUATION",
    action: "Seven ROL evaluation registered",
    actor: "Rita Felgate",
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
  ["Authority", "NOT YET VERIFIED"],
  ["Jurisdiction", "NOT YET VERIFIED"],
  ["Clarity", "NOT YET VERIFIED"],
  ["Public Participation", "NOT YET VERIFIED"],
  ["Publication", "CONDITIONAL"],
  ["Referent", "NOT YET VERIFIED"],
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
  const [searchInput, setSearchInput] = useState("");
  const [selectedDdtId, setSelectedDdtId] = useState<string | null>(null);
  const [showSelectedDdtEnvelope, setShowSelectedDdtEnvelope] = useState(false);

  const [lifecycleRecords, setLifecycleRecords] =
    useState<DdtLifecycleRecord[]>(DDT_LIFECYCLE_DEMO);

  const [registrationSourceRef, setRegistrationSourceRef] = useState("");
  const [registrationPreview, setRegistrationPreview] =
    useState<DdtLifecycleRecord | null>(null);
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState("");

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [dateType, setDateType] = useState<"event" | "registration">("event");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [advancedSearchError, setAdvancedSearchError] = useState("");
  const [advancedSearchSubmitted, setAdvancedSearchSubmitted] = useState(false);

  const fetchRegistrationSource = () => {
    const ref = registrationSourceRef.trim();

    setRegistrationError("");
    setRegistrationSuccess("");
    setRegistrationPreview(null);

    if (!ref) {
      setRegistrationError("Enter a Seven ROL document or record reference.");
      return;
    }

    if (/^ddt-/i.test(ref)) {
      setRegistrationError(
        "This is a DDC DDT identifier, not a Seven ROL source reference. Use the upstream Seven ROL document, subject or event reference for registration."
      );
      return;
    }

    const normalized = ref.toLowerCase();

    const sourceRecord =
      lifecycleRecords.find(
        (record) => record.subjectRef.toLowerCase() === normalized
      ) ??
      lifecycleRecords.find(
        (record) =>
          record.ddtId.toLowerCase() === ref.toLowerCase()
      ) ??
      null;

    if (!sourceRecord) {
      setRegistrationError(
        "No matching source is available in the local prototype. A real Seven ROL connector is required to fetch this reference."
      );
      return;
    }

    const primarySource =
      lifecycleRecords.find(
        (record) =>
          record.subjectRef === sourceRecord.subjectRef &&
          record.recordType === "EXTERNAL_EVALUATION"
      ) ?? sourceRecord;

    setRegistrationPreview(primarySource);
  };

  const registerPreviewedDdt = () => {
    if (!registrationPreview) return;

    const alreadyRegistered = lifecycleRecords.some(
      (record) => record.ddtId === registrationPreview.ddtId
    );

    if (alreadyRegistered) {
      setRegistrationSuccess("");
      setRegistrationError(
        `This Seven ROL event is already registered as ${registrationPreview.ddtId}. A new DDT record must only be created when Seven ROL provides a genuinely new event or changed upstream payload for subject ${registrationPreview.subjectRef}.`
      );
      return;
    }

    setRegistrationError(
      "Prototype registration is available only after a genuinely new Seven ROL event has been fetched. The local prototype must not invent a new event."
    );
  };

  const registrationSubjectRecords = useMemo(() => {
    if (!registrationPreview) return [];

    return lifecycleRecords.filter(
      (record) =>
        record.subjectRef === registrationPreview.subjectRef
    );
  }, [registrationPreview, lifecycleRecords]);

  const registrationNextDdtId = useMemo(() => {
    if (!registrationPreview) return null;

    const maxSequence = registrationSubjectRecords.reduce(
      (max, record) => {
        const match = record.ddtId.match(/-(\d+)$/);
        if (!match) return max;

        const value = Number(match[1]);
        return Number.isFinite(value)
          ? Math.max(max, value)
          : max;
      },
      0
    );

    return `DDT-${registrationPreview.subjectRef}-${String(
      maxSequence + 1
    ).padStart(3, "0")}`;
  }, [registrationPreview, registrationSubjectRecords]);

  const registrationEventAlreadyExists = useMemo(() => {
    if (!registrationPreview) return false;

    return lifecycleRecords.some(
      (record) => record.ddtId === registrationPreview.ddtId
    );
  }, [registrationPreview, lifecycleRecords]);

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

  const openDdtPreview = (ddtId: string) => {
    setSelectedDdtId(ddtId);
    setShowSelectedDdtEnvelope(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById("ddt-record-detail")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      });
    });
  };

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const runDdtSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  useEffect(() => {
    if (!normalizedSearch) return;

    const exactDdtMatch = lifecycleRecords.find(
      (record) => record.ddtId.toLowerCase() === normalizedSearch
    );

    if (exactDdtMatch) {
      setSelectedDdtId(exactDdtMatch.ddtId);
      setShowSelectedDdtEnvelope(false);
    }
  }, [normalizedSearch]);


  const directSearchMatches = useMemo(() => {
    if (!normalizedSearch) return [];

    return lifecycleRecords.filter((record) =>
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

    return lifecycleRecords.filter((record) =>
      matchedSubjectRefs.includes(record.subjectRef)
    );
  }, [normalizedSearch, matchedSubjectRefs]);

  const directSearchMatchIds = useMemo(() => {
    const query = normalizedSearch.toLowerCase();

    const exactDdtMatch = lifecycleRecords.find(
      (record) => record.ddtId.toLowerCase() === query
    );

    return new Set(exactDdtMatch ? [exactDdtMatch.ddtId] : []);
  }, [normalizedSearch]);

  const latestRegisteredRecord = useMemo(() => {
    if (lifecycleSearchResults.length === 0) return null;

    const subject = lifecycleSearchResults[0].subjectRef;

    const subjectRecords = lifecycleRecords.filter(
      (record) => record.subjectRef === subject
    );

    return subjectRecords.length > 0
      ? subjectRecords[subjectRecords.length - 1]
      : null;
  }, [lifecycleSearchResults]);

  const selectedDdtRecord = useMemo(() => {
    if (!selectedDdtId) return null;

    return (
      lifecycleRecords.find(
        (record) => record.ddtId === selectedDdtId
      ) ?? null
    );
  }, [selectedDdtId]);

  const selectedDdtEnvelopeBase = useMemo<DDTRecordEnvelopeV02 | null>(() => {
    if (!selectedDdtRecord) return null;

    const isPrimarySevenRolEvaluation =
      selectedDdtRecord.ddtId === "DDT-gp_2014_005-001";

    return {
      identity: {
        ddtId: selectedDdtRecord.ddtId,
        ddtFamilyId: `DDT-${selectedDdtRecord.subjectRef}`,
        subjectRef: selectedDdtRecord.subjectRef,
        recordType: selectedDdtRecord.recordType,
        schemaVersion: "ddt-record-envelope-v0.2",
        previousRecordInFamily: (() => {
          const familyRecords = lifecycleRecords.filter(
            (record) => record.subjectRef === selectedDdtRecord.subjectRef
          );
          const currentIndex = familyRecords.findIndex(
            (record) => record.ddtId === selectedDdtRecord.ddtId
          );

          if (currentIndex <= 0) return null;

          const previousRecord = familyRecords[currentIndex - 1];

          return {
            ddtRef: previousRecord.ddtId,
            recordHash:
              PILOT_RECORD_HASHES_V02[previousRecord.ddtId] ?? null,
          };
        })(),
      },

      upstream: {
        sourceSystem: selectedDdtRecord.isSimulated
          ? "SIMULATED"
          : "Seven ROL",
        sourceRecordId: null,
        eventType: selectedDdtRecord.recordType,

        upstreamActor: {
          identity:
            selectedDdtRecord.isSimulated ||
            selectedDdtRecord.actor.includes("required")
              ? null
              : selectedDdtRecord.actor,
          role: isPrimarySevenRolEvaluation
            ? "Independent legal practitioner and governance researcher"
            : null,
          authorityRef: null,
        },

        eventTime: null,

        framework:
          selectedDdtRecord.isSimulated ||
          selectedDdtRecord.recordType === "INSTITUTIONAL_RESPONSE"
            ? null
            : {
                name: "Seven ROL Compliance Categories",
                version: null,
                reference: "10.5281/zenodo.21134975",
                versionReference: null,
              },

        result:
          selectedDdtRecord.isSimulated
            ? null
            : isPrimarySevenRolEvaluation
              ? {
                  authority: "UNCONFIRMED",
                  jurisdiction: "UNCONFIRMED",
                  clarity: "UNCONFIRMED",
                  publicParticipation: "UNCONFIRMED",
                  publication: "CONDITIONAL",
                  referent: "UNCONFIRMED",
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
          selectedDdtRecord.isSimulated
            ? {
                simulationNotice:
                  "Lifecycle demonstration only. Not an actual Seven ROL event or source record.",
              }
            : isPrimarySevenRolEvaluation
              ? {
                  coordinationDefect: "Category 7",
                  coordinationDefectType: "Executive failure",
                  failureDate: "2014-12-25",
                  failureDateBasis:
                    "Gauteng Provincial Gazette No. 377 · 25 December 2014",
                  failureSemantics:
                    "The instrument entered the public record as a Bill passed by the Legislature but was labelled an Act; no Premier assent stamp or assent record has been located.",
                  lawDaysLostRule:
                    "Count from 25 December 2014 until a valid Premier assent record under section 121 and consequent gazette publication appear in the documentary record. Backdating does not reduce the count.",
                  remedyStatus:
                    "OPEN — no valid assent record and consequent gazette publication located.",
                }
              : {},
      },

      relationships: {
        relatedDDTRefs:
          selectedDdtRecord.relatedToRefs?.map((ddtRef) => {
            let relationshipType:
              | "supersedes"
              | "responds_to"
              | "disputes"
              | "corrects"
              | "remedies"
              | "references" = "references";

            if (
              selectedDdtRecord.ddtId === "DDT-gp_2014_005-002" &&
              ddtRef === "DDT-gp_2014_005-001"
            ) {
              relationshipType = "responds_to";
            }

            return {
              ddtRef,
              recordHash: PILOT_RECORD_HASHES_V02[ddtRef] ?? null,
              relationshipType,
              assertedBy: null,
              evidenceRef: null,
            };
          }) ?? [],
      },

      ddcRegistration: {
        registeredBy: null,
        registrationTime:
          selectedDdtRecord.registeredAt === "LOCAL PROTOTYPE" ||
          selectedDdtRecord.isSimulated
            ? null
            : selectedDdtRecord.registeredAt,
        payloadCanonicalization: "RFC8785-JCS",
        payloadCanonicalizationImplementation: "canonicalize@4.0.0",
        payloadHashAlgorithm: "SHA-256",
        payloadHash: null,
        recordHash: null,
        evidenceManifestHash: null,
        signatureAlgorithm: null,
        signature: null,
        registrationProof: null,
      },
    };
  }, [selectedDdtRecord]);

  const [selectedPayloadHash, setSelectedPayloadHash] =
    useState<string | null>(null);

  const [selectedPayloadHashError, setSelectedPayloadHashError] =
    useState<string | null>(null);

  const [selectedRecordHash, setSelectedRecordHash] =
    useState<string | null>(null);

  const [selectedRecordHashError, setSelectedRecordHashError] =
    useState<string | null>(null);

  const expectedRecordHash = useMemo(() => {
    if (!selectedDdtRecord) return null;

    return PILOT_RECORD_HASHES_V02[selectedDdtRecord.ddtId] ?? null;
  }, [selectedDdtRecord]);

  const recordIntegrityStatus = useMemo<
    "VERIFIED" | "FAILED" | "NOT AVAILABLE" | "PENDING"
  >(() => {
    if (!selectedDdtRecord) return "NOT AVAILABLE";
    if (!expectedRecordHash) return "NOT AVAILABLE";
    if (!selectedRecordHash) return "PENDING";

    return selectedRecordHash === expectedRecordHash
      ? "VERIFIED"
      : "FAILED";
  }, [selectedDdtRecord, expectedRecordHash, selectedRecordHash]);
  const expectedPayloadCommitment = useMemo(() => {
    if (!selectedDdtRecord) return null;

    return PILOT_PAYLOAD_COMMITMENTS_V02[selectedDdtRecord.ddtId] ?? null;
  }, [selectedDdtRecord]);

  const payloadIntegrityStatus = useMemo<
    "VERIFIED" | "FAILED" | "NOT AVAILABLE" | "PENDING"
  >(() => {
    if (!selectedDdtRecord) return "NOT AVAILABLE";

    if (!expectedPayloadCommitment) return "NOT AVAILABLE";

    if (!selectedPayloadHash) return "PENDING";

    return selectedPayloadHash === expectedPayloadCommitment
      ? "VERIFIED"
      : "FAILED";
  }, [
    selectedDdtRecord,
    expectedPayloadCommitment,
    selectedPayloadHash,
  ]);


  useEffect(() => {
    let cancelled = false;

    async function calculatePayloadHash() {
      if (!selectedDdtEnvelopeBase) {
        setSelectedPayloadHash(null);
        setSelectedPayloadHashError(null);
        return;
      }

      try {
        setSelectedPayloadHash(null);
        setSelectedPayloadHashError(null);

        const canonicalPayload = canonicalize(
          selectedDdtEnvelopeBase.upstream
        );

        if (typeof canonicalPayload !== "string") {
          throw new Error("Canonicalization produced no payload.");
        }

        const bytes = new TextEncoder().encode(canonicalPayload);

        const digest = await window.crypto.subtle.digest(
          "SHA-256",
          bytes
        );

        const hex = Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

        if (!cancelled) {
          setSelectedPayloadHash(hex);
        }
      } catch (error) {
        if (!cancelled) {
          setSelectedPayloadHashError(
            error instanceof Error
              ? error.message
              : "Payload hash calculation failed."
          );
        }
      }
    }

    calculatePayloadHash();

    return () => {
      cancelled = true;
    };
  }, [selectedDdtEnvelopeBase]);

  useEffect(() => {
    let cancelled = false;

    async function calculateRecordHash() {
      if (!selectedDdtEnvelopeBase || !selectedPayloadHash) {
        setSelectedRecordHash(null);
        setSelectedRecordHashError(null);
        return;
      }

      try {
        setSelectedRecordHash(null);
        setSelectedRecordHashError(null);

        const registeredPayloadCommitment =
          expectedPayloadCommitment ?? selectedPayloadHash;

        const recordCommitment = {
          identity: selectedDdtEnvelopeBase.identity,

          payloadCommitment: {
            canonicalization: "RFC8785-JCS",
            hashAlgorithm: "SHA-256",
            payloadHash: registeredPayloadCommitment,
          },

          relationships: selectedDdtEnvelopeBase.relationships,
        };

        const canonicalRecord = canonicalize(recordCommitment);

        if (typeof canonicalRecord !== "string") {
          throw new Error("Record canonicalization produced no payload.");
        }

        const bytes = new TextEncoder().encode(canonicalRecord);

        const digest = await window.crypto.subtle.digest(
          "SHA-256",
          bytes
        );

        const hex = Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

        if (!cancelled) {
          setSelectedRecordHash(hex);
        }
      } catch (error) {
        if (!cancelled) {
          setSelectedRecordHashError(
            error instanceof Error
              ? error.message
              : "Record hash calculation failed."
          );
        }
      }
    }

    calculateRecordHash();

    return () => {
      cancelled = true;
    };
  }, [
    selectedDdtEnvelopeBase,
    selectedPayloadHash,
    expectedPayloadCommitment,
  ]);

  const [registrationSignature, setRegistrationSignature] =
    useState<string | null>(null);

  const [registrationSigningKeyRef, setRegistrationSigningKeyRef] =
    useState<string | null>(null);

  const [registrationSigningKeyId, setRegistrationSigningKeyId] =
    useState<string | null>(null);

  const [registrationSignatureStatus, setRegistrationSignatureStatus] =
    useState<"VERIFIED" | "FAILED" | "NOT AVAILABLE">("NOT AVAILABLE");

  const [registrationSignatureError, setRegistrationSignatureError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function createAndVerifyRegistrationSignature() {
      if (!selectedRecordHash) {
        setRegistrationSignature(null);
        setRegistrationSigningKeyRef(null);
        setRegistrationSigningKeyId(null);
        setRegistrationSignatureStatus("NOT AVAILABLE");
        setRegistrationSignatureError(null);
        return;
      }

      try {
        setRegistrationSignature(null);
        setRegistrationSigningKeyRef(null);
        setRegistrationSigningKeyId(null);
        setRegistrationSignatureStatus("NOT AVAILABLE");
        setRegistrationSignatureError(null);

        const keyPair = (await window.crypto.subtle.generateKey(
          {
            name: "Ed25519",
          },
          true,
          ["sign", "verify"]
        )) as CryptoKeyPair;

        const recordHashBytes = new TextEncoder().encode(selectedRecordHash);

        const signatureBuffer = await window.crypto.subtle.sign(
          {
            name: "Ed25519",
          },
          keyPair.privateKey,
          recordHashBytes
        );

        const verified = await window.crypto.subtle.verify(
          {
            name: "Ed25519",
          },
          keyPair.publicKey,
          signatureBuffer,
          recordHashBytes
        );

        const publicKeyRaw = await window.crypto.subtle.exportKey(
          "raw",
          keyPair.publicKey
        );

        const publicKeyHex = Array.from(new Uint8Array(publicKeyRaw))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

        const publicKeyIdDigest = await window.crypto.subtle.digest(
          "SHA-256",
          publicKeyRaw
        );

        const publicKeyIdHex = Array.from(
          new Uint8Array(publicKeyIdDigest)
        )
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

        const signingKeyId =
          `urn:ddc:key:ed25519-sha256:${publicKeyIdHex}`;

        const signatureHex = Array.from(new Uint8Array(signatureBuffer))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

        if (!cancelled) {
          setRegistrationSignature(signatureHex);
          setRegistrationSigningKeyRef(
            `LOCAL-PROTOTYPE-ED25519:${publicKeyHex}`
          );
          setRegistrationSigningKeyId(signingKeyId);
          setRegistrationSignatureStatus(
            verified ? "VERIFIED" : "FAILED"
          );
        }
      } catch (error) {
        if (!cancelled) {
          setRegistrationSignature(null);
          setRegistrationSigningKeyRef(null);
          setRegistrationSignatureStatus("NOT AVAILABLE");
          setRegistrationSignatureError(
            error instanceof Error
              ? error.message
              : "Registration signature verification failed."
          );
        }
      }
    }

    createAndVerifyRegistrationSignature();

    return () => {
      cancelled = true;
    };
  }, [selectedRecordHash]);

  const selectedDdtEnvelope =
    useMemo<DDTRecordEnvelopeV02 | null>(() => {
      if (!selectedDdtEnvelopeBase) return null;

      return {
        ...selectedDdtEnvelopeBase,
        ddcRegistration: {
          ...selectedDdtEnvelopeBase.ddcRegistration,
          payloadCanonicalization: "RFC8785-JCS",
          payloadCanonicalizationImplementation: "canonicalize@4.0.0",
          payloadHashAlgorithm: "SHA-256",
          payloadHash: selectedPayloadHash,
          registeredPayloadCommitment: expectedPayloadCommitment,
          payloadIntegrityStatus,
          recordHash: selectedRecordHash,

          // Registration / provenance proof layer — §29
          signingKeyRef: registrationSigningKeyRef,

          // Prototype signing-key role identifier.
          // No production key registry or lifecycle proof exists yet.
          signingKeyId: registrationSigningKeyId,
          signingKeyStatus: registrationSigningKeyRef
            ? "UNRESOLVED"
            : null,
          signingKeyValidFrom: null,
          signingKeyValidUntil: null,
          signingKeyRegistryRef: null,

          signatureAlgorithm: registrationSignature
            ? "Ed25519"
            : null,
          signature: registrationSignature,

          signatureProofs: registrationSignature
            ? [
                {
                  algorithm: "Ed25519",
                  signingKeyId: registrationSigningKeyId,
                  signingKeyRef: registrationSigningKeyRef,
                  signature: registrationSignature,
                  status: registrationSignatureStatus,
                  profile: "DDT-V0.2-PROTOTYPE-CLASSICAL",
                },
              ]
            : [],

          registrationSignatureStatus,

          registrationTimeStatus: "NOT AVAILABLE",
          timeProofs: [],
          registrantIdentityStatus: "UNRESOLVED",
          registrantAuthorityStatus: "UNRESOLVED",
          independentProvenanceStatus: "NOT AVAILABLE",

          proofMethod: "LOCAL_PROTOTYPE_ED25519",
          proofRef: null,
          trustAnchorRef: null,
          registrationProof: null,
        },
      };
    }, [
      selectedDdtEnvelopeBase,
      selectedPayloadHash,
      selectedRecordHash,
      expectedPayloadCommitment,
      payloadIntegrityStatus,
      registrationSigningKeyRef,
      registrationSigningKeyId,
      registrationSignature,
      registrationSignatureStatus,
    ]);

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

        <section className="mb-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              DDT recorder · local prototype
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-100">
              Register new Seven ROL record
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Enter the upstream Seven ROL document or record reference.
              The prototype first fetches the available source data for review.
              Registration then creates the next DDT record in the subject
              history. Missing upstream fields are never invented.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Seven ROL document / record reference
              </label>

              <input
                value={registrationSourceRef}
                onChange={(event) => {
                  setRegistrationSourceRef(event.target.value);
                  setRegistrationError("");
                  setRegistrationSuccess("");
                }}
                placeholder="Example: gp_2014_005"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={fetchRegistrationSource}
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Fetch from Seven ROL
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Prototype fetch only. No live Seven ROL API or formal integration is connected.
          </p>

          {registrationError && (
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">
              {registrationError}
            </div>
          )}

          {registrationPreview && (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Source preview
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-100">
                    {registrationPreview.subjectRef}
                  </h3>
                </div>

                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                  LOCAL PROTOTYPE FETCH
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span className="text-slate-500">Source system: </span>
                  <span className="text-slate-200">Seven ROL</span>
                </div>

                <div>
                  <span className="text-slate-500">Subject: </span>
                  <span className="text-slate-200">
                    {registrationPreview.subjectRef}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">Record type: </span>
                  <span className="text-slate-200">
                    {registrationPreview.recordType}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">Upstream actor: </span>
                  <span className="text-slate-200">
                    {registrationPreview.actor}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">Action: </span>
                  <span className="text-slate-200">
                    {registrationPreview.action}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">Result: </span>
                  <span className="text-slate-200">
                    {registrationPreview.verdict ?? "Upstream data required"}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-200">
                Production integration must obtain the complete upstream
                payload, evaluation ID, evaluator metadata, event time,
                framework version, evidence references and provenance fields
                directly from Seven ROL where available.
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Subject status
                </div>

                <div className="mt-3 text-sm text-slate-300">
                  Subject:{" "}
                  <span className="font-mono text-slate-100">
                    {registrationPreview.subjectRef}
                  </span>
                </div>

                <div className="mt-2 text-sm text-slate-300">
                  Existing DDT records:{" "}
                  <span className="font-semibold text-slate-100">
                    {registrationSubjectRecords.length}
                  </span>
                </div>

                {registrationSubjectRecords.length > 0 && (
                  <div className="mt-2 text-sm text-slate-300">
                    Latest existing DDT:{" "}
                    <span className="font-mono text-slate-100">
                      {
                        registrationSubjectRecords[
                          registrationSubjectRecords.length - 1
                        ].ddtId
                      }
                    </span>
                  </div>
                )}

                <div className="mt-2 text-sm text-slate-300">
                  Next DDT ID if Seven ROL provides a new event:{" "}
                  <span className="font-mono text-sky-300">
                    {registrationNextDdtId}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-800 pt-4">
                  <span className="text-slate-500">
                    Registration decision:{" "}
                  </span>
                  {registrationEventAlreadyExists ? (
                    <span className="font-semibold text-amber-300">
                      ALREADY REGISTERED AS {registrationPreview.ddtId}
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-300">
                      NEW EVENT — ELIGIBLE FOR {registrationNextDdtId}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Finding an existing subject does not create a new DDT.
                  A new sequence number is assigned only when the upstream
                  source represents a genuinely new recordable event.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={registerPreviewedDdt}
                  disabled={registrationEventAlreadyExists}
                  className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                    registrationEventAlreadyExists
                      ? "cursor-not-allowed border-slate-700 bg-slate-800/60 text-slate-500"
                      : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"
                  }`}
                >
                  {registrationEventAlreadyExists
                    ? "Already registered"
                    : "Register DDT record"}
                </button>

                <span className="max-w-xl text-xs leading-5 text-slate-500">
                  A new DDT ID is generated only for a genuinely new
                  upstream event belonging to this subject. Existing DDT
                  IDs never become new subject references.
                </span>
              </div>
            </div>
          )}

          {registrationSuccess && (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm font-semibold text-emerald-300">
              {registrationSuccess}
            </div>
          )}
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
                DDT is the record model for a registered event. Each new
                relevant event can create a new DDT record. This prototype models
                chronological preservation without deciding whether the upstream
                content, conclusion or legal interpretation is correct.
              </p>
            </div>

            <div className="w-full xl:max-w-2xl">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Search by subject reference, DDT ID, record type or text
              </label>

              <div className="rounded-2xl border border-sky-500/40 bg-slate-950/90 p-2 shadow-lg shadow-sky-950/20 transition focus-within:border-sky-400">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        runDdtSearch();
                      }
                    }}
                    placeholder="e.g. gp_2014_005 or DDT-gp_2014_005-001"
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500"
                  />

                  <button
                    type="button"
                    onClick={runDdtSearch}
                    className="rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-400"
                  >
                    Search
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Enter a subject, DDT ID, record type or text, then press Search or Enter.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                DDT
              </div>
              <div className="mt-2 text-lg font-bold">
                Registered event record
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
                Chronological and attribution-aware
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-400">
                This prototype models preservation of the available record, actor
                and time assertions. Asserted attribution remains separate from
                independently verified identity, authority and registration time.
                The latest record is the most recently registered DDT for the subject,
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
                        <div
                          key={record.ddtId}
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

                          <div className="mt-4 border-t border-slate-800 pt-4">
                            <button
                              type="button"
                              onClick={() => openDdtPreview(record.ddtId)}
                              className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200"
                            >
                              Preview record →
                            </button>
                          </div>

                          {index < lifecycleSearchResults.length - 1 && (
                            <div className="absolute -bottom-5 left-6 h-5 border-l border-slate-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {!selectedDdtRecord && (
          <section
            id="ddt-record-detail"
            className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              DDT record detail
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-100">
              Select a DDT record
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Use the Preview record button in the chronological history above
              to inspect a DDT record, its upstream content, integrity status,
              payload hash, record hash, relationships and machine-readable
              envelope.
            </p>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
              <div className="text-sm font-semibold text-slate-400">
                No DDT record selected
              </div>

              <div className="mt-2 text-xs text-slate-600">
                Record details will appear here.
              </div>
            </div>
          </section>
        )}

        {selectedDdtRecord && (
          <section
            id="ddt-record-detail"
            className="mb-8 rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  DDT record detail
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-100">
                  {selectedDdtRecord.ddtId}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Detailed view of one DDT event record in the local prototype.
                </p>

                {selectedDdtRecord.isSimulated && (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
                    <strong>SIMULATED LIFECYCLE RECORD.</strong>{" "}
                    This is not an actual Seven ROL event, evaluation, re-evaluation,
                    source record or historical registration. It exists only to
                    demonstrate DDT chronological lifecycle behavior.
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-semibold text-sky-300">
                    DDT Record Envelope v0.2
                  </span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-semibold text-amber-300">
                    DRAFT
                  </span>
                </div>

                <p className="mt-3 font-mono text-xs text-slate-500">
                  Specification: docs/ddt/DDT_RECORD_ENVELOPE_V0.2_DRAFT.md
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
                    {selectedDdtRecord.isSimulated ? (
                      <span className="text-slate-500">
                        Not applicable · simulated lifecycle record
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        Upstream data required
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">Framework version: </span>
                    {selectedDdtRecord.isSimulated ? (
                      <span className="text-slate-500">
                        Not asserted · simulated lifecycle record
                      </span>
                    ) : selectedDdtRecord.recordType === "INSTITUTIONAL_RESPONSE" ? (
                      <span className="text-slate-500">
                        Not applicable · institutional response record
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        Upstream data required
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">Evidence state: </span>

                    {selectedDdtRecord.recordType === "EXTERNAL_EVALUATION" &&
                    selectedDdtRecord.ddtId === "DDT-gp_2014_005-001" ? (
                      <>
                        <span className="text-slate-200">
                          Gazette record at evaluation time · upstream defined
                        </span>
                        <div className="mt-1 text-xs text-amber-300">
                          Not yet cryptographically sealed or bound to an evidence manifest.
                        </div>
                      </>
                    ) : selectedDdtRecord.recordType === "INSTITUTIONAL_RESPONSE" ? (
                      <>
                        <span className="text-amber-300">
                          Institutional response evidence · case evidence not provided
                        </span>
                        <div className="mt-1 text-xs text-slate-500">
                          The response is represented in the prototype, but the underlying
                          response document or message has not been supplied as independently
                          verifiable case evidence.
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-300">
                          Record-specific evidence state · unresolved
                        </span>
                        <div className="mt-1 text-xs text-slate-500">
                          This record type must reference its own evidence state rather than
                          inheriting the evidence state of another DDT record.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Verification summary
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-100">
                  What does DDC actually verify here?
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 font-bold ${
                        payloadIntegrityStatus === "VERIFIED"
                          ? "text-emerald-300"
                          : payloadIntegrityStatus === "FAILED"
                            ? "text-rose-300"
                            : "text-slate-500"
                      }`}
                    >
                      {payloadIntegrityStatus === "VERIFIED"
                        ? "✓"
                        : payloadIntegrityStatus === "FAILED"
                          ? "✕"
                          : "?"}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Record content integrity
                      </div>
                      <div className="mt-1 text-slate-400">
                        {payloadIntegrityStatus === "VERIFIED"
                          ? "The currently presented upstream content matches the frozen prototype payload commitment."
                          : payloadIntegrityStatus === "FAILED"
                            ? "The currently presented upstream content does not match the frozen prototype payload commitment."
                            : "A frozen prototype payload commitment is not available for this record."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 font-bold ${
                        registrationSignatureStatus === "VERIFIED"
                          ? "text-emerald-300"
                          : registrationSignatureStatus === "FAILED"
                            ? "text-rose-300"
                            : "text-slate-500"
                      }`}
                    >
                      {registrationSignatureStatus === "VERIFIED"
                        ? "✓"
                        : registrationSignatureStatus === "FAILED"
                          ? "✕"
                          : "?"}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Registration signature
                      </div>
                      <div className="mt-1 text-slate-400">
                        {registrationSignatureStatus === "VERIFIED"
                          ? "The local prototype signature is cryptographically valid for this record commitment."
                          : registrationSignatureStatus === "FAILED"
                            ? "The registration signature does not verify against this record commitment."
                            : "No registration signature verification is available."}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-bold text-amber-300">?</span>
                    <div>
                      <div className="font-semibold text-slate-200">
                        Identity, authority and registration time
                      </div>
                      <div className="mt-1 text-slate-400">
                        Not independently verified in this prototype. A valid
                        signature does not prove who the signer is, whether the
                        signer had authority, or when the registration occurred.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-xs leading-5 text-sky-200">
                  {selectedDdtRecord.isSimulated ? (
                    <>
                      <span className="font-bold">SIMULATED RECORD.</span>{" "}
                      No actual Seven ROL result is asserted by this lifecycle example.
                      Local hashing and signature verification apply only to the
                      simulated prototype record representation.
                    </>
                  ) : selectedDdtRecord.recordType === "INSTITUTIONAL_RESPONSE" ? (
                    <>
                      <span className="font-bold">
                        Upstream result: not applicable.
                      </span>{" "}
                      This record preserves an institutional response as a separate
                      event and does not assert a Seven ROL evaluation result.
                    </>
                  ) : selectedDdtRecord.recordType === "INTERPRETATION" ? (
                    <>
                      <span className="font-bold">
                        Upstream result: not applicable.
                      </span>{" "}
                      This record preserves an interpretation linked to prior records
                      and does not assert a new Seven ROL evaluation result.
                    </>
                  ) : (
                    <>
                      Seven ROL result:{" "}
                      <span className="font-bold">
                        {selectedDdtRecord.verdict ?? "UNDEFINED"}
                      </span>
                      . This is an upstream result, not a DDC judgment. DDC verifies
                      the record and the proof layers available to it; it does not
                      determine whether the upstream conclusion is true.
                    </>
                  )}
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
                      {selectedDdtRecord.isSimulated
                        ? "SIMULATED LOCAL PROTOTYPE · no historical registration asserted"
                        : selectedDdtRecord.registeredAt}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Payload canonicalization:{" "}
                    </span>
                    <span className="text-slate-200">
                      RFC8785-JCS
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Payload hash algorithm:{" "}
                    </span>
                    <span className="text-slate-200">
                      SHA-256
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Payload hash: </span>
                    {selectedPayloadHash ? (
                      <span className="break-all font-mono text-emerald-300">
                        {selectedPayloadHash}
                      </span>
                    ) : selectedPayloadHashError ? (
                      <span className="text-rose-300">
                        {selectedPayloadHashError}
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        Calculating...
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Content integrity:{" "}
                    </span>
                    <span
                      className={`font-semibold ${
                        payloadIntegrityStatus === "VERIFIED"
                          ? "text-emerald-300"
                          : payloadIntegrityStatus === "FAILED"
                            ? "text-rose-300"
                            : payloadIntegrityStatus === "PENDING"
                              ? "text-amber-300"
                              : "text-slate-400"
                      }`}
                    >
                      {payloadIntegrityStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Registered payload commitment:{" "}
                    </span>
                    {expectedPayloadCommitment ? (
                      <span className="break-all font-mono text-slate-300">
                        {expectedPayloadCommitment}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Not available for this prototype record
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Record hash canonicalization:{" "}
                    </span>
                    <span className="text-slate-200">
                      RFC8785-JCS
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Record hash algorithm:{" "}
                    </span>
                    <span className="text-slate-200">
                      SHA-256
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Record integrity: </span>
                    <span
                      className={`font-semibold ${
                        recordIntegrityStatus === "VERIFIED"
                          ? "text-emerald-300"
                          : recordIntegrityStatus === "FAILED"
                            ? "text-rose-300"
                            : recordIntegrityStatus === "PENDING"
                              ? "text-amber-300"
                              : "text-slate-400"
                      }`}
                    >
                      {recordIntegrityStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Record hash: </span>

                    {selectedRecordHash ? (
                      <span className="break-all font-mono text-emerald-300">
                        {selectedRecordHash}
                      </span>
                    ) : selectedRecordHashError ? (
                      <span className="text-rose-300">
                        {selectedRecordHashError}
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        Calculating...
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">Schema version: </span>
                    <span className="text-slate-200">
                      ddt-record-envelope-v0.2
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-800 pt-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-violet-300">
                      Registration / provenance proof
                    </p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500">
                          Registration signature:{" "}
                        </span>
                        <span
                          className={`font-semibold ${
                            registrationSignatureStatus === "VERIFIED"
                              ? "text-emerald-300"
                              : registrationSignatureStatus === "FAILED"
                                ? "text-rose-300"
                                : "text-slate-400"
                          }`}
                        >
                          {registrationSignatureStatus}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Signature algorithm:{" "}
                        </span>
                        <span className="text-slate-200">
                          {registrationSignature ? "Ed25519" : "Not available"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Signing key ID:{" "}
                        </span>
                        <span className="break-all font-mono text-violet-300">
                          {registrationSigningKeyId ?? "Not available"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Verification key material:{" "}
                        </span>
                        {registrationSigningKeyRef ? (
                          <span className="break-all font-mono text-slate-300">
                            {registrationSigningKeyRef}
                          </span>
                        ) : (
                          <span className="text-slate-500">Not available</span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Key lifecycle / registry:{" "}
                        </span>
                        <span className="text-amber-300">
                          UNRESOLVED · persistent registry / lifecycle proof not available
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Signature:{" "}
                        </span>
                        {registrationSignature ? (
                          <span className="break-all font-mono text-slate-300">
                            {registrationSignature}
                          </span>
                        ) : registrationSignatureError ? (
                          <span className="text-rose-300">
                            {registrationSignatureError}
                          </span>
                        ) : (
                          <span className="text-slate-500">Not available</span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Independent registration-time proof:{" "}
                        </span>
                        <span className="text-slate-400">
                          NOT AVAILABLE
                        </span>
                        <div className="mt-1 text-xs text-slate-500">
                          No RFC 3161, Rekor, OpenTimestamps or other external
                          record-level time proof is attached to this prototype record.
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Registrant identity:{" "}
                        </span>
                        <span className="text-amber-300">
                          UNRESOLVED
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Registrant authority:{" "}
                        </span>
                        <span className="text-amber-300">
                          UNRESOLVED
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Independent provenance:{" "}
                        </span>
                        <span className="text-slate-400">
                          NOT AVAILABLE
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Proof method:{" "}
                        </span>
                        <span className="text-violet-300">
                          LOCAL_PROTOTYPE_ED25519
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      A verified registration signature proves only possession
                      of the corresponding signing key. It does not prove
                      registrant identity, authority, registration time,
                      independent provenance or substantive truth of the
                      upstream content.
                    </p>
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
                    <span className={selectedDdtRecord.isSimulated ? "text-amber-300" : "text-slate-200"}>
                      {selectedDdtRecord.isSimulated
                        ? "SIMULATED · no actual upstream source event"
                        : "Seven ROL"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Source record ID: </span>
                    <span className="text-amber-300">
                      {selectedDdtRecord.isSimulated
                        ? "Not applicable · simulated record"
                        : "Upstream data required"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Previous record in family: </span>
                    {selectedDdtEnvelope?.identity.previousRecordInFamily ? (
                      <div className="mt-1 text-xs">
                        <div className="text-slate-300">
                          {selectedDdtEnvelope.identity.previousRecordInFamily.ddtRef}
                        </div>
                        <div className="break-all font-mono text-slate-500">
                          {selectedDdtEnvelope.identity.previousRecordInFamily.recordHash ??
                            "Record hash not available"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">None · first family record</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">Related DDT records: </span>
                    {selectedDdtEnvelope?.relationships.relatedDDTRefs &&
                    selectedDdtEnvelope.relationships.relatedDDTRefs.length > 0 ? (
                      <div className="mt-1 space-y-2 text-xs">
                        {selectedDdtEnvelope.relationships.relatedDDTRefs.map(
                          (relationship) => (
                            <div key={`${relationship.relationshipType}-${relationship.ddtRef}`}>
                              <div className="text-sky-300">
                                {relationship.relationshipType} → {relationship.ddtRef}
                              </div>
                              <div className="break-all font-mono text-slate-500">
                                {relationship.recordHash ??
                                  "Target record hash not available"}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">Relationship assertions: </span>
                    <span className="text-sky-300">
                      {selectedDdtEnvelope?.relationships.relatedDDTRefs &&
                      selectedDdtEnvelope.relationships.relatedDDTRefs.length > 0
                        ? selectedDdtEnvelope.relationships.relatedDDTRefs
                            .map(
                              (relationship) =>
                                `${relationship.relationshipType} → ${relationship.ddtRef}`
                            )
                            .join(", ")
                        : "None"}
                    </span>

                    {selectedDdtEnvelope?.relationships.relatedDDTRefs &&
                      selectedDdtEnvelope.relationships.relatedDDTRefs.length > 0 && (
                        <div className="mt-2 text-xs leading-5 text-slate-500">
                          Relationship types are recorded assertions, not DDC-established facts.
                          Assertion provenance and supporting evidence remain unresolved unless
                          explicitly supplied for the relationship.
                        </div>
                      )}
                  </div>

                  <div>
                    <span className="text-slate-500">Authority reference: </span>
                    <span className="text-amber-300">
                      UNRESOLVED · no authority evidence reference available
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
                      DDT Record Envelope v0.2
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
                DDC can preserve the integrity of a specific record and
                separately expose available registration and provenance proofs.
                This prototype verifies payload integrity, record integrity and
                local signing-key possession. It does not yet independently
                prove registration time, registrant identity, registrant
                authority or external provenance. DDC does not determine
                whether the upstream conclusion, interpretation or legal
                position inside the record is true.
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

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-100">
              <span className="font-semibold">Source title note.</span>{" "}
              The instrument title is preserved exactly as published in Gauteng
              Provincial Gazette No. 377. Seven ROL identifies that the Gazette
              labels the instrument as an <span className="font-semibold">Act</span>;
              however, because no documentary evidence of Premier assent under
              section 121 of the Constitution has been identified, the legal
              existence of the instrument as an Act remains unresolved. DDC
              preserves both the published Gazette title and the upstream
              institutional assessment without determining the legal validity of
              either.
            </div>
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
              <div className="mt-1 text-xs leading-5 text-slate-400">
                Gazette publication date of the Speaker&apos;s certified copy:
                Gauteng Provincial Gazette No. 377. The identified failure is
                the missing located Premier assent record, not publication itself.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Remedy
              </div>
              <div className="mt-2 font-semibold">
                No remedy located
              </div>
              <div className="mt-1 text-xs leading-5 text-slate-500">
                Law days lost run from 25 December 2014 until a valid Premier
                assent record under section 121 and consequent gazette publication
                appear. Backdating does not reduce the count. No remedy is currently located.
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
                Upstream clarification status
              </p>

              <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
                <li>
                  <strong>1.</strong> Failure-date derivation — clarified by Seven ROL.
                </li>
                <li>
                  <strong>2.</strong> Law-days-lost rule — clarified by Seven ROL;
                  the count remains open because no remedy has been located.
                </li>
                <li>
                  <strong>3.</strong> Evidence-state semantics — clarified:
                  the gazette record at evaluation time is the upstream evidence
                  state; a later correction or supplement requires a new evaluation.
                </li>
                <li>
                  <strong>4.</strong> Evaluator identity and role are supplied upstream.
                  Evaluation ID, evaluation timestamp and a formal framework version
                  identifier remain unresolved.
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
                    text: "The evidence state relied upon by an evaluation must be explicitly identified and versioned. DDC can seal that identified historical evidence state at registration, but must not imply retroactive proof that cryptographic sealing existed at the original evaluation time.",
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
                    text: "Law-days-lost semantics are defined upstream; the numerical count remains open until a valid remedy is located.",
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
              ["Seven ROL category results", "PARTIAL · CODEBOOK VERIFICATION REQUIRED"],
              ["Overall Seven ROL verdict", "SOURCE PROVIDED"],
              ["Exact evidence state", "UPSTREAM DEFINED · NOT CRYPTOGRAPHICALLY SEALED"],
              ["Evaluator provenance", "UPSTREAM SUPPLIED · NOT DDC VERIFIED"],
              ["Evaluation timestamp", "NOT AVAILABLE"],
              ["Failure-date derivation", "UPSTREAM DEFINED"],
              ["Institutional response evidence", "PARTIAL"],
              ["Remedy evidence", "OPEN"],
              ["Law days lost", "RULE DEFINED · COUNT OPEN"],
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
