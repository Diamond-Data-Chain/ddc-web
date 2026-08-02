import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type StoredCheck = {
  label?: string;
  status?: "pass" | "warning" | "review";
  result?: string;
};

type StoredRecord = {
  recordId: string;
  sourceId: string;
  category: "Regulation" | "Corporate" | "Software" | "Research";
  sourceName: string;
  sourceDomain: string;
  documentTitle: string;
  requestedUrl: string;
  finalUrl: string;
  publicUrl?: string;
  observedAt: string;
  contentLength: number;
  contentType: string;
  contentHash: string;
  previousContentHash?: string | null;
  previousRecordId?: string | null;
  changeDetected: boolean;
  snapshotFile: string;
  verificationPolicyVersion: string;
  verificationReportHash: string;
  verificationReport?: {
    checks?: StoredCheck[];
  };
  ddcTokenRegistrationStatus:
    | "pending"
    | "submitted"
    | "registered"
    | "failed";
  ddcTokenRecordNumber?: string | null;
  publicTokenId?: string | null;
  onChainRecordNumber?: number | null;
  recorderTransactionHash?: string | null;
  recorderBlockNumber?: number | null;
};

function scoreCheck(check: StoredCheck) {
  if (check.status === "pass") return 25;
  if (check.status === "warning") return 15;
  return 5;
}

function statusFor(record: StoredRecord) {
  if (record.ddcTokenRegistrationStatus === "registered") {
    return "Preserved";
  }

  if (record.changeDetected) {
    return "Changed";
  }

  return "Verified";
}

function mapChecks(record: StoredRecord) {
  const stored = record.verificationReport?.checks ?? [];

  const checks = stored.map((check) => ({
    label: check.label || "Verification check",
    score: scoreCheck(check),
    maximum: 25,
    status:
      check.status === "pass"
        ? "pass"
        : check.status === "warning"
          ? "warning"
          : "review",
    result: check.result || "",
  }));

  return checks;
}

function confidenceFor(record: StoredRecord) {
  const checks = mapChecks(record);

  const achieved = checks.reduce(
    (sum, check) => sum + check.score,
    0
  );

  const maximum = checks.reduce(
    (sum, check) => sum + check.maximum,
    0
  );

  return maximum > 0
    ? Math.round((achieved / maximum) * 100)
    : 0;
}

export async function GET() {
  try {
    const recordsPath = path.join(
      process.cwd(),
      "data",
      "ddc-watch",
      "records.json"
    );

    const scansPath = path.join(
      process.cwd(),
      "data",
      "ddc-watch",
      "scans.json"
    );

    const raw = await fs.readFile(recordsPath, "utf8");
    const records = JSON.parse(raw) as StoredRecord[];

    let lastScan: string | null = null;

    try {
      const scansRaw = await fs.readFile(scansPath, "utf8");
      const scans = JSON.parse(scansRaw) as Array<{
        observedAt?: string;
      }>;

      if (Array.isArray(scans) && scans.length > 0) {
        lastScan =
          scans
            .map((scan) => scan.observedAt)
            .filter((value): value is string => Boolean(value))
            .sort()
            .at(-1) ?? null;
      }
    } catch {}

    const items = records
      .map((record) => ({
        recordId: record.recordId,

        ddcTokenRecordNumber:
          record.publicTokenId ||
          record.ddcTokenRecordNumber ||
          "Pending registration",

        onChainRecordNumber:
          record.onChainRecordNumber ||
          undefined,

        category: record.category,
        status: statusFor(record),

        sourceName: record.sourceName,
        sourceDomain: record.sourceDomain,

        documentTitle: record.documentTitle,
        documentUrl:
          record.publicUrl ||
          record.finalUrl ||
          record.requestedUrl,

        detectedAt: record.observedAt,
        publishedAt: record.observedAt,

        contentHash: record.contentHash,
        previousHash:
          record.previousContentHash || undefined,

        previousRecordId:
          record.previousRecordId || undefined,

        changeDetected: record.changeDetected,

        verificationConfidence:
          confidenceFor(record),

        verificationPolicyVersion:
          record.verificationPolicyVersion,

        verificationReportHash:
          record.verificationReportHash,

        snapshotFile: record.snapshotFile,
        contentType: record.contentType,
        contentLength: record.contentLength,

        registrationStatus:
          record.ddcTokenRegistrationStatus,

        blockchainTx:
          record.recorderTransactionHash || undefined,

        blockNumber:
          record.recorderBlockNumber || undefined,

        summary:
          record.ddcTokenRegistrationStatus === "registered"
            ? record.changeDetected
              ? "A new document version was detected, verified and registered on DDC. The current record remains permanently linked to the previously preserved version."
              : "The official source was retrieved, hashed, verified and permanently registered through the DDC Token Recorder."
            : record.changeDetected
              ? "A new document version was detected. The current content hash differs from the previously preserved version and is awaiting DDC Token Recorder registration."
              : "The official source was retrieved, hashed and verified. This version is preserved locally and is awaiting DDC Token Recorder registration.",

        checks: mapChecks(record),
      }))
      .sort(
        (a, b) =>
          new Date(b.detectedAt).getTime() -
          new Date(a.detectedAt).getTime()
      );

    return NextResponse.json({
      source: "ddc-watch-engine",
      lastScan,
      count: items.length,
      registeredCount: items.filter(
        (item) => item.registrationStatus === "registered"
      ).length,
      changedCount: items.filter(
        (item) => item.changeDetected
      ).length,
      pendingCount: items.filter(
        (item) => item.registrationStatus === "pending"
      ).length,
      items,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to read DDC Watch records.";

    console.error("DDC Watch API error:", error);

    return NextResponse.json(
      {
        source: "ddc-watch-engine",
        count: 0,
        items: [],
        error: message,
      },
      { status: 500 }
    );
  }
}
