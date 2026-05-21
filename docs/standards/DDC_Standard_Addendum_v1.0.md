# DDC Standard Addendum v1.0

This document defines the DDC Event Standard (DDC-EVENT-1.0) and the minimal Truth Engine scoring model used to make recorded data verifiable and auditable across crypto and industry domains.

DDC does not assume truth — it makes truth verifiable.

## 1. What this adds to the Whitepaper

This addendum standardizes:
- **Event structure** (a portable JSON event format)
- **Truth scoring** (a deterministic, explainable score 0–100)
- **Integrity hooks** (hashes + commit references for auditability)

> TODO(WP): confirm final naming, versioning, and governance process for evolving the standard.

## 2. Event format

Schema: `docs/schemas/ddc-event.schema.json`

Minimum required top-level fields:
- `standard`, `projectId`, `eventId`, `eventType`, `timestamp`
- `sourceContext`, `validationContext`, `truthContext`, `integrityContext`

Examples:
- `docs/examples/ddc-event-example.crypto.json`
- `docs/examples/ddc-event-example.industry.json`

## 3. Truth Engine (MVP)

Reference implementation:
- `reference/validators/truth_engine.py`

TruthScore is computed as:
- Source trust (0–35)
- Signature validity (0–15)
- Cross-consistency (0–20)
- Multi-source confirmation (0–20)
- History / reputation (0–10) **(stub in MVP)**

> TODO(WP): define reputation persistence model and enforcement rules for critical event classes.

## 4. Daily commit (MVP)

A daily commit groups multiple events into a verifiable batch by hashing:
- each event (canonical JSON)
- a report hash over event hashes

Reference:
- `reference/validators/daily_commit.py`
- example reports under `docs/examples/`

## 5. What makes this “verifiable”

This standard becomes meaningful only if:
- scoring is deterministic and reproducible
- a commit hash is recorded (on-chain or in a verifiable log)
- policy enforcement exists for high-impact flows (e.g. treasury)

