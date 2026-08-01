const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "ddc-watch");
const SNAPSHOT_DIR = path.join(DATA_DIR, "snapshots");
const SOURCES_FILE = path.join(DATA_DIR, "sources.json");
const RECORDS_FILE = path.join(DATA_DIR, "records.json");
const SCANS_FILE = path.join(DATA_DIR, "scans.json");

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;

  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function sha256(data) {
  return `0x${crypto.createHash("sha256").update(data).digest("hex")}`;
}

function safeName(value) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function createWatchRecordId(sourceId, observedAt, sequence) {
  const date = observedAt.slice(0, 10).replaceAll("-", "");

  return `DDC-WATCH-${safeName(sourceId)}-${date}-${String(sequence).padStart(
    6,
    "0"
  )}`;
}

function buildChecks(source, response, contentHash) {
  const finalUrl = new URL(response.url);
  const expectedDomain = source.sourceDomain.toLowerCase();
  const actualDomain = finalUrl.hostname.toLowerCase();

  const domainMatches =
    actualDomain === expectedDomain ||
    actualDomain.endsWith(`.${expectedDomain}`);

  return [
    {
      label: "Official source domain",
      status: domainMatches ? "pass" : "review",
      result: domainMatches
        ? `Verified: ${actualDomain}`
        : `Expected ${expectedDomain}, received ${actualDomain}`
    },
    {
      label: "HTTPS transport",
      status: finalUrl.protocol === "https:" ? "pass" : "review",
      result: finalUrl.protocol
    },
    {
      label: "Source response",
      status: response.ok ? "pass" : "review",
      result: `HTTP ${response.status}`
    },
    {
      label: "Content hash",
      status: "pass",
      result: contentHash
    }
  ];
}

async function scanSource(source, records, sequence) {
  const observedAt = new Date().toISOString();

  const headers = {
    "User-Agent":
      "DiamondDataChain-DDCWatch/1.0 contact@diamonddatachain.org",
    Accept:
      source.fetchMode === "github-release-json"
        ? "application/vnd.github+json"
        : "application/pdf,text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
  };

  if (source.fetchMode === "github-release-json") {
    headers["X-GitHub-Api-Version"] = "2022-11-28";
  }

  const response = await fetch(source.documentUrl, {
    redirect: "follow",
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  let content;
  let normalizedContentType =
    response.headers.get("content-type") ||
    "application/octet-stream";

  if (source.fetchMode === "github-release-json") {
    const release = await response.json();

    const canonicalRelease = {
      id: release.id,
      tagName: release.tag_name,
      targetCommitish: release.target_commitish,
      name: release.name,
      draft: release.draft,
      prerelease: release.prerelease,
      createdAt: release.created_at,
      publishedAt: release.published_at,
      body: release.body,
      htmlUrl: release.html_url,
      assets: Array.isArray(release.assets)
        ? release.assets.map((asset) => ({
            id: asset.id,
            name: asset.name,
            size: asset.size,
            digest: asset.digest || null,
            downloadUrl: asset.browser_download_url
          }))
        : []
    };

    content = Buffer.from(
      JSON.stringify(canonicalRelease, null, 2) + "\n",
      "utf8"
    );

    normalizedContentType = "application/json";
  } else {
    content = Buffer.from(await response.arrayBuffer());
  }

  const contentHash = sha256(content);

  const previous = [...records]
    .reverse()
    .find((record) => record.sourceId === source.sourceId);

  const changed = Boolean(
    previous && previous.contentHash !== contentHash
  );

  const unchanged = Boolean(
    previous && previous.contentHash === contentHash
  );

  const checks = buildChecks(source, response, contentHash);
  const verificationReport = {
    policyVersion: "DDC-WATCH-VERIFY-1.0",
    sourceId: source.sourceId,
    observedAt,
    finalUrl: response.url,
    contentHash,
    previousContentHash: previous?.contentHash || null,
    changed,
    checks
  };

  const verificationReportHash = sha256(
    Buffer.from(JSON.stringify(verificationReport))
  );

  if (unchanged) {
    return {
      type: "unchanged",
      sourceId: source.sourceId,
      observedAt,
      contentHash,
      previousRecordId: previous.recordId
    };
  }

  const recordId = createWatchRecordId(
    source.sourceId,
    observedAt,
    sequence
  );

  const extension =
    source.fetchMode === "github-release-json"
      ? "json"
      : normalizedContentType.includes("pdf")
        ? "pdf"
        : normalizedContentType.includes("html")
          ? "html"
          : "bin";

  const snapshotFile = `${recordId}.${extension}`;
  const snapshotPath = path.join(SNAPSHOT_DIR, snapshotFile);

  fs.writeFileSync(snapshotPath, content);

  const record = {
    recordId,
    sourceId: source.sourceId,
    category: source.category,
    sourceName: source.sourceName,
    sourceDomain: source.sourceDomain,
    documentTitle: source.documentTitle,
    requestedUrl: source.documentUrl,
    finalUrl: response.url,
    publicUrl:
      source.fetchMode === "github-release-json"
        ? JSON.parse(content.toString("utf8")).htmlUrl
        : response.url,

    observedAt,
    contentLength: content.length,
    contentType: normalizedContentType,

    contentHash,
    previousContentHash: previous?.contentHash || null,
    previousRecordId: previous?.recordId || null,
    changeDetected: changed,

    snapshotFile,
    verificationPolicyVersion: "DDC-WATCH-VERIFY-1.0",
    verificationReport,
    verificationReportHash,

    ddcTokenRegistrationStatus: "pending",
    ddcTokenRecordNumber: null,
    recorderTransactionHash: null,
    recorderBlockNumber: null
  };

  return {
    type: changed ? "changed" : "new",
    record
  };
}

async function main() {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const sources = readJson(SOURCES_FILE, []);
  const records = readJson(RECORDS_FILE, []);
  const scans = readJson(SCANS_FILE, []);

  let sequence = records.length + 1;

  for (const source of sources) {
    try {
      const result = await scanSource(
        source,
        records,
        sequence
      );

      if (result.record) {
        records.push(result.record);
        sequence += 1;

        console.log(
          `${result.type.toUpperCase()} ${source.sourceId}`
        );
        console.log(`  Record: ${result.record.recordId}`);
        console.log(`  Hash:   ${result.record.contentHash}`);
        console.log(
          `  Previous: ${
            result.record.previousContentHash || "none"
          }`
        );
      } else {
        console.log(`UNCHANGED ${source.sourceId}`);
        console.log(`  Hash: ${result.contentHash}`);
      }

      scans.push({
        scanId: `SCAN-${Date.now()}-${source.sourceId}`,
        sourceId: source.sourceId,
        observedAt: result.record?.observedAt || result.observedAt,
        result: result.type,
        contentHash:
          result.record?.contentHash || result.contentHash,
        recordId:
          result.record?.recordId ||
          result.previousRecordId ||
          null,
        error: null
      });
    } catch (error) {
      const observedAt = new Date().toISOString();

      console.error(
        `FAILED ${source.sourceId}: ${error.message}`
      );

      scans.push({
        scanId: `SCAN-${Date.now()}-${source.sourceId}`,
        sourceId: source.sourceId,
        observedAt,
        result: "failed",
        contentHash: null,
        recordId: null,
        error: error.message
      });
    }
  }

  writeJson(RECORDS_FILE, records);
  writeJson(SCANS_FILE, scans);

  console.log();
  console.log(`Total preserved versions: ${records.length}`);
  console.log(`Total scan attempts: ${scans.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
