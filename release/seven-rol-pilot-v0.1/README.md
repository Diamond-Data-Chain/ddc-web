# Diamond Data Chain (DDC) — Seven ROL Mapping Pilot v0.1

## Status

PROTOTYPE — NOT PRODUCTION

Snapshot date: 2026-08-16

## Purpose

This release is a frozen snapshot of the Seven ROL → Diamond Data Chain (DDC) mapping pilot prepared for external concept and technical review.

The pilot demonstrates a proposed method for mapping upstream Seven ROL records into DDT records while preserving chronological history, record integrity, relationships, registration proof boundaries and unresolved upstream information.

The purpose of this snapshot is to establish the exact state of the pilot before external reviewers receive access.

## Pilot scope

The pilot demonstrates:

- stable subject and DDT-family separation;
- chronological immutable DDT event records;
- search and record discovery;
- DDT Record Envelope v0.1;
- upstream/DDC semantic separation;
- RFC8785-JCS payload canonicalization;
- SHA-256 payload commitments;
- separate recordHash construction;
- local Ed25519 registration-signature verification;
- separation of integrity, identity, authority, registration-time and provenance proof states;
- proposed Seven ROL → DDT registration workflow;
- explicit preservation of unavailable or unresolved upstream information.

## Important boundary

DDC does not determine whether an upstream Seven ROL conclusion, interpretation, legal position or factual assertion is true.

Cryptographic verification of a DDT record demonstrates only the specific integrity or proof property represented by that verification state.

Missing Seven ROL information is intentionally left unresolved rather than inferred or invented.

## Review purpose

The pilot is intended for two complementary forms of external review:

1. upstream mapping review — whether the proposed DDT model correctly represents Seven ROL subjects, events, identifiers, relationships and available source data;
2. technical architecture review — whether the DDT record, hashing, chronological-history and registration/provenance proof model is technically coherent.

Reviewer feedback may result in a subsequent version of the pilot.

This v0.1 snapshot MUST remain unchanged so that the exact version originally presented for external review can be independently identified later.

## Snapshot contents

- `DDT_RECORD_ENVELOPE_V0.1.md` — DDT Record Envelope v0.1 specification and pilot decisions.
- `SevenRolMappingPage.tsx` — Seven ROL → DDC local mapping workbench implementation.
- `package.json` — project dependency and script metadata.
- `package-lock.json` — locked dependency state.
- `README.md` — this snapshot description.

## Integrity record

SHA-256 checksums for the snapshot files are generated separately in `SHA256SUMS.txt`.

A final archive hash and external timestamp proof may also be created for this frozen release.

## Version

Seven ROL → DDC Mapping Pilot v0.1

Diamond Data Chain (DDC)
