# DDT Record Envelope v0.2 — Draft

**Project:** Diamond Data Chain (DDC)  
**Status:** DRAFT  
**Schema ID:** `ddt-record-envelope-v0.2-draft`


## Revision provenance

DDT Record Envelope v0.2 is a development revision derived from the frozen DDT Record Envelope v0.1 baseline.

The v0.1 specification remains unchanged as the version used in the Seven ROL → DDC Mapping Pilot v0.1 external review.

This draft incorporates technical findings identified during external review while preserving the core DDT boundary: DDC records and verifies specific properties of registered records; it does not determine whether upstream assertions, evaluations, interpretations or conclusions are factually, legally or substantively correct.

Primary v0.2 review areas include:

- stable signing-key identity and key lifecycle;
- deterministic canonicalization implementation pinning;
- hash-bound typed record relationships;
- cryptographically verifiable DDT-family continuity;
- independent registration-time proof;
- framework and semantic-version pinning;
- cryptographic agility and long-term signature preservation.

The exact post-quantum signature profile remains under technical evaluation and MUST NOT be treated as finalized merely by inclusion in this draft.


## 1. Purpose

DDT is the immutable event-record layer of Diamond Data Chain.

A DDT record preserves that a particular event, assertion, evaluation, response, decision, correction, dispute, remedy, observation or other recordable event was registered.

DDC does not determine whether upstream content is factually, legally or substantively correct.

Core boundary:

> DDC proves that a specific record was registered with a specific payload, provenance and registration time. Recording an upstream assertion does not make that assertion a DDC conclusion.

## 2. DDT role

DDT is an immutable registered event record.

A new relevant event may create a new DDT record.

The DDT model MUST remain generic. Seven ROL is a pilot use case and MUST NOT define the generic DDT schema.

## 3. Subject and DDT family

External subject reference example:

`gp_2014_005`

Human-readable DDT family:

`DDT-gp_2014_005`

Chronological records:

- `DDT-gp_2014_005-001`
- `DDT-gp_2014_005-002`
- `DDT-gp_2014_005-003`

A separate internal globally unique and/or cryptographic record identifier MUST exist for technical identity and collision resistance.

## 4. Chronological history

DDC preserves records chronologically.

Earlier DDT records are never rewritten or deleted when a later event occurs.

The newest registered DDT may be labelled:

`LATEST RECORD`

LATEST RECORD means only the most recently registered DDT known for the subject.

It MUST NOT mean legally valid, factually correct, authoritative, approved or substantively current.

## 5. Search

Users MUST NOT be required to know a DDT ID.

Search should support:

- external subject reference
- DDT ID
- source record ID
- record type
- source system
- searchable metadata or text

Searching `gp_2014_005` should locate the DDT family and display its chronological history.

Searching a specific DDT should highlight that record while still showing the entire family history.

## 6. Date discovery

When the identifier is unknown, discovery may use:

- From date
- To date
- Event date or DDT registration date

Maximum date-discovery range: **31 days**.

Event date and DDT registration date MUST remain separate concepts.

## 7. Time semantics

### eventTime

The time the upstream source claims or records that an event occurred.

### registrationTime

The time DDC can prove that the DDT record was registered.

A historical upstream date MUST NOT be represented as DDC proof that the record existed at that historical time.

## 8. DDT Record Envelope v0.2 — Draft

```typescript
type DDTRecordEnvelopeV02 = {
  identity: {
    ddtId: string;
    ddtFamilyId: string;
    subjectRef: string;
    recordType: string;
    schemaVersion: "ddt-record-envelope-v0.2";
  };

  upstream: {
    sourceSystem: string;
    sourceRecordId?: string;
    eventType: string;

    upstreamActor?: {
      identity?: string;
      role?: string;
      authorityRef?: string;
    };

    eventTime?: string;

    framework?: {
      name?: string;
      reference?: string;
      version?: string;
      versionReference?: string;
    };

    result?: unknown;
    evidenceStateRef?: string;
    assertions?: Record<string, unknown>;
  };

  relationships: {
    previousRecordInFamily?: {
      ddtRef: string;
      recordHash: string;
    };

    relatedDDTRefs?: Array<{
      ddtRef: string;
      recordHash: string;
      relationshipType:
        | "supersedes"
        | "responds_to"
        | "disputes"
        | "corrects"
        | "remedies"
        | "references";
      assertedBy?: string;
      evidenceRef?: string;
    }>;
  };

  ddcRegistration: {
    registeredBy?: string;
    registrationTime?: string;

    canonicalization: {
      scheme: "RFC8785-JCS";
      implementation: string;
      implementationVersion: string;
    };

    payloadHash: string;
    registeredPayloadCommitment: string;
    recordHash: string;

    evidenceManifestHash?: string;

    signingKey?: {
      keyId: string;
      algorithm: string;
      publicKeyRef?: string;
      validFrom?: string;
      validTo?: string;
      registryRef?: string;
    };

    signatureProofs?: Array<{
      algorithm: string;
      keyId: string;
      signature: string;
      profile?: string;
    }>;

    timeProofs?: Array<{
      type: string;
      proofRef?: string;
      proof?: string;
      anchoredAt?: string;
      verifier?: string;
    }>;

    registrationProof?: string;
  };
};
```

### 8.1 v0.2 envelope design intent

The v0.2 envelope extends the v0.1 model without changing the fundamental DDT epistemic boundary.

The additional fields are intended to make independently verifiable properties explicit rather than allowing a single generic validity state to imply more than has actually been proven.

`previousRecordInFamily` cryptographically binds a DDT record to the specific preceding record state known at registration time. Human-readable sequence numbers alone MUST NOT be treated as proof of family continuity.

A related DDT reference binds both the human-readable DDT identifier and the target `recordHash`. Relationship semantics use a controlled vocabulary rather than unrestricted free text.

`canonicalization` records not only the canonicalization scheme but the implementation and implementation version used when the payload commitment was created.

`payloadHash` represents the hash independently recomputed from the canonicalized payload during verification.

`registeredPayloadCommitment` represents the payload commitment preserved at registration. Equality between these values may establish payload-integrity consistency, but MUST NOT by itself establish source authenticity, signer identity, signer authority, registration time or substantive truth.

`signingKey.keyId` provides stable signing-key identity independent of the raw public-key representation. Key rotation, validity, revocation and registry semantics require a separately defined key-lifecycle model.

`signatureProofs` is plural and algorithm-agile by design. The envelope MUST NOT structurally depend on Ed25519 as the only possible signature algorithm. A mandatory post-quantum or hybrid signature profile is not yet defined by this draft.

`timeProofs` permits one or more independently verifiable registration-time proof mechanisms. The presence of `registrationTime` alone MUST NOT be interpreted as independent cryptographic proof of that time.

Framework references SHOULD identify the specific framework or codebook version applicable to the upstream event where that information is available. A general framework reference MUST NOT be treated as equivalent to a pinned semantic version.

## 9. Envelope layers

### Identity

Identifies the DDT record and its subject.

### Upstream

Contains information supplied or asserted by the upstream system.

DDC preservation of this information does not convert it into a DDC factual or legal conclusion.

### Relationships

Contains asserted relationships between records.

A relationship MUST NOT automatically become a DDC factual conclusion.

### DDC Registration

Contains metadata generated by DDC preservation and verification.

This is where DDC's own independently verifiable claims belong.

## 10. Minimum proposed fields

Required identity:

- `ddtId`
- `ddtFamilyId`
- `subjectRef`
- `recordType`
- `schemaVersion`

Required upstream identification:

- `sourceSystem`
- `eventType`

Proposed required production registration fields:

- `registrationTime`
- `payloadHash`
- `recordHash`

Missing upstream information MUST remain missing rather than being fabricated.

### 10.1 Framework identity and semantic-version pinning

Where an upstream event depends on an evaluation framework, codebook, methodology, policy set, taxonomy or other semantic reference, DDT MUST preserve enough information to identify the specific framework state applicable to that event.

The generic v0.2 envelope provides:

```text
upstream.framework.name
upstream.framework.reference
upstream.framework.version
upstream.framework.versionReference
```

`reference` identifies the framework or framework family.

`version` identifies the specific semantic version, release, edition or other upstream version designation applicable to the event.

`versionReference` SHOULD identify an immutable or version-specific reference where the upstream system provides one.

A general framework reference MUST NOT automatically be treated as equivalent to a pinned framework version.

If the meaning of a category, rule, status, code or evaluation criterion can change between framework versions, a DDT record MUST NOT claim semantic-version pinning unless the applicable version has actually been identified.

The purpose of framework pinning is to preserve the interpretation context that existed when the upstream event was produced.

For example, a record containing:

```text
Category 7
Executive failure
```

is not fully reproducible in meaning if a later framework revision can redefine that category while the DDT record preserves only the category label.

A verifier SHOULD therefore be able to determine:

1. which framework was used;
2. which specific framework version or edition was applicable;
3. which immutable or version-specific reference supports that identification, where available;
4. whether the framework version was supplied by the upstream source, independently resolved, asserted by the registrant or remains unresolved.

Framework-version verification is a semantic-preservation property. It is separate from payload integrity.

A cryptographically intact payload can still be semantically ambiguous if the framework version required to interpret it is unavailable.

Likewise, pinning a framework version does NOT prove that:

- the upstream evaluation applied the framework correctly;
- the framework itself is authoritative;
- the resulting conclusion is factually, legally or substantively correct.

#### Current Seven ROL pilot state

The current Seven ROL pilot identifies:

```text
framework.name:
Seven ROL Compliance Categories

framework.reference:
10.5281/zenodo.21134975
```

The exact framework/codebook version applicable to `DDT-gp_2014_005-001` has not yet been confirmed from the available upstream inputs.

The v0.2 mapping MUST therefore preserve:

```text
framework.version: unresolved
framework.versionReference: unresolved
```

until Seven ROL supplies or confirms the applicable version information.

DDC MUST NOT infer a framework version merely from the existence of a general framework reference.

## 11. Actor distinction

`upstreamActor` and `registeredBy` are different concepts.

The actor who performed an upstream evaluation may be different from the entity that registered the resulting record in DDC.

## 12. Hash distinction

`payloadHash` = verifier-recomputed hash of the canonical upstream payload.

`registeredPayloadCommitment` = payload commitment preserved at registration.

`recordHash` = hash of the schema-defined canonical DDT record-level commitment.

These values MUST NOT be treated as interchangeable.

For DDT Record Envelope v0.2, the canonicalization and hashing rules are defined and versioned in Sections 23, 24 and 27.

Future schema or profile versions MAY adopt different rules, but historical records MUST remain verifiable under the rules applicable when they were registered.

## 13. Evidence state

An upstream evaluation should be capable of referencing the exact evidence state used at evaluation time.

Potential future mechanisms:

- evidence manifest
- manifest hash
- external evidence reference plus hash
- sealed evidence package

DDC may prove which evidence state was referenced.

DDC does not thereby prove that the evidence itself is truthful.

## 14. Negative findings

Findings such as:

- no assent located
- no commencement notice located
- no remedy located

may depend on search scope, methodology, sources searched and evaluation time.

The schema must allow this context to be preserved.

## 15. Seven ROL pilot example

Subject:

`gp_2014_005`

DDT family:

`DDT-gp_2014_005`

Initial record:

`DDT-gp_2014_005-001`

Source:

`Seven ROL`

Framework:

`Seven ROL Compliance Categories`

Framework reference:

`DOI 10.5281/zenodo.21134975`

Provided results:

- Authority — PASS
- Jurisdiction — PASS
- Clarity — PASS
- Public Participation — PASS
- Publication — CONDITIONAL
- Referent — PASS
- Commencement — FAIL
- Overall verdict — FAIL

Provided coordination defect:

`Category 7 - Executive failure`

Asserted failure date:

`25 December 2014`

These remain Seven ROL assertions. They are not DDC legal conclusions.

## 16. Seven ROL information unresolved

Currently waiting for upstream clarification on:

1. Failure-date derivation rule.
2. Law-days-lost calculation semantics.
3. Frozen evidence-state semantics.
4. Evaluation ID.
5. Evaluation timestamp.
6. Evaluator identity.
7. Evaluator role.
8. Evaluator authority metadata.
9. Framework/codebook version.
10. Source record identifier.
11. Search scope and methodology for negative findings.
12. Corrected or competing evaluation semantics.

## 17. DDC design work unresolved

The v0.2 draft has resolved several design questions that were unresolved in the v0.1 baseline, including payload canonicalization, payload commitment semantics, the `recordHash` boundary, typed hash-bound relationships, DDT-family continuity, stable signing-key identity requirements, registration-time proof structure and cryptographic agility.

The following production design work remains unresolved or profile-dependent:

1. Global internal record identifier construction.
2. Production DDT ID generation and collision handling.
3. Production canonicalization implementation/profile selection and interoperability test vectors.
4. Production signing algorithm profile and required signature set.
5. Concrete `keyId` construction and key-registry/key-resolution implementation.
6. Key activation, rotation, expiration, suspension and revocation operations.
7. Registrant identity-binding mechanism.
8. Authority-evidence representation and verification.
9. Production independent registration-time proof profile.
10. Production external trust-anchor/provenance profile.
11. Evidence-manifest structure and lifecycle.
12. Production relationship-vocabulary governance and extension process.
13. Offline verification package and verifier behavior.
14. Search/index architecture.
15. Schema/profile migration and long-term verification procedure.
16. Mandatory hybrid or post-quantum signature profile, if adopted.
17. Framework/version resolution rules where the upstream source does not provide a pinned version.

Items already normatively defined by this v0.2 draft MUST NOT continue to be described as wholly unresolved merely because their production implementation has not yet been selected.

## 18. Current pilot implementation

The local Seven ROL to DDC Workbench currently demonstrates:

- human-readable DDT family IDs
- chronological history
- LATEST RECORD
- subject search
- exact DDT search
- date discovery
- maximum 31-day range
- event-date vs registration-date distinction
- simulated discovery dataset
- DDT Record Detail panel
- upstream vs DDC separation
- relationship context
- explicit DDC boundary

SIMULATED records are UX demonstrations only and are not Seven ROL source data.

## 19. Locked decisions

1. DDT is an immutable registered event record.
2. DDC does not determine upstream truth.
3. Same-subject records form a chronological DDT family.
4. Human-readable DDT IDs use external subject references where practical.
5. A separate technical/global identifier is required.
6. LATEST RECORD means latest registered only.
7. Earlier records remain immutable.
8. Event time and registration time are separate.
9. Upstream actor and DDC registrant are separate.
10. Relationships are assertions unless independently established.
11. Search must work without knowing the DDT ID.
12. Date discovery is limited to 31 days.
13. DDT schema remains generic.
14. Missing upstream data remains missing.
15. Simulated data must be visibly marked.
16. `payloadHash` and `recordHash` are different concepts.
17. Seven ROL conclusions remain upstream assertions.

## 20. Change control

This document is the architecture source of truth for:

`DDT Record Envelope v0.1`

Structural changes discovered during the pilot must first be recorded here and then implemented in the prototype.

The UI MUST NOT silently redefine the schema.

**END - DDT Record Envelope v0.1**
## 21. Integrity, provenance and registration proof

DDT MUST distinguish between content integrity, source provenance and DDC registration proof. These properties are related but MUST NOT be treated as equivalent.

### 21.1 Payload integrity

`payloadHash` proves the integrity of the canonical upstream payload registered by the DDT record. If any part of the canonical payload changes, the resulting `payloadHash` MUST change.

A successful payload-hash verification means that the supplied payload is identical to the payload represented by the registered hash. It does NOT by itself prove factual truth, legal correctness, authorship, or actor authority.

### 21.2 Source provenance and authenticity

Source provenance is separate from payload integrity. Where available, DDT SHOULD preserve sufficient information to verify the origin of the upstream payload, including upstream digital signatures, signer identity, certificate or public-key references, source-system identity, source record identifiers, evaluator or issuing authority, authority references, or other independently verifiable provenance evidence.

A source signature or equivalent provenance proof may establish that a particular source produced or approved a payload. It MUST NOT automatically establish that the contents are factually or legally correct.

### 21.3 DDC registration proof

DDC registration proof establishes that a specific DDT record containing a specific payload commitment was registered by DDC at a provable registration time.

Conceptually:

```text
upstream payload -> payloadHash
payloadHash + DDT envelope metadata -> canonical DDT envelope
canonical DDT envelope -> recordHash
recordHash -> DDC registration proof
```

A valid DDC registration proof means that DDC can independently demonstrate that the corresponding DDT record existed in its registered form at the proven registration time.

### 21.4 `payloadHash`, `registeredPayloadCommitment` and `recordHash`

`payloadHash`, `registeredPayloadCommitment` and `recordHash` MUST remain semantically distinct.

`payloadHash` is recomputed by a verifier from the canonical upstream payload.

`registeredPayloadCommitment` is the payload commitment preserved at registration.

`recordHash` commits to the schema-defined DDT record-level structure, including the registered payload commitment, identity, typed relationships and family-continuity information defined by the applicable schema/profile.

For DDT Record Envelope v0.2, canonicalization, payload hashing and record-level commitment rules are defined in Sections 23, 24 and 27.

Those rules are versioned verification rules. A future schema or profile MAY define different rules, but MUST NOT retroactively alter the rules applicable to historical records.

### 21.5 Verification states

Future DDT verification interfaces SHOULD distinguish at least:

```text
CONTENT INTEGRITY
VERIFIED / FAILED / NOT AVAILABLE

SOURCE PROVENANCE
VERIFIED / FAILED / UNRESOLVED / NOT AVAILABLE

DDC REGISTRATION
VERIFIED / FAILED / LOCAL ONLY / NOT AVAILABLE

UPSTREAM CONCLUSION
PRESERVED - NOT DETERMINED BY DDC
```

None of these states means that DDC has determined the substantive truth of upstream content.

### 21.6 DDC epistemic boundary

Even when content integrity, source provenance and DDC registration are all VERIFIED, DDC proves only that the specific payload, attributable to the verified source according to available provenance evidence, was registered in the DDT record at the provable DDC registration time and has not been altered relative to the registered commitment.

DDC does NOT prove that the factual, legal, scientific, institutional or interpretive conclusion contained in the upstream payload is true.

This distinction is a mandatory architectural boundary of DDT.

## 22. Locked integrity decisions v0.2

1. Hashing proves integrity, not substantive truth.
2. `payloadHash` is the verifier-recomputed hash of the canonical upstream payload.
3. `registeredPayloadCommitment` preserves the payload commitment established at registration.
4. Payload integrity is evaluated by comparing the recomputed `payloadHash` with the preserved `registeredPayloadCommitment`.
5. Source provenance/authenticity is separate from payload integrity.
6. `recordHash` is distinct from both `payloadHash` and `registeredPayloadCommitment`.
7. `recordHash` binds the registered payload commitment to the schema-defined DDT identity and structural context.
8. DDC registration signature, signing-key identity, registrant identity, authority and registration-time proof remain separate proof layers.
9. Successful verification of all available cryptographic proof layers does not convert an upstream assertion into a DDC conclusion.
10. DDT verification interfaces MUST communicate these distinctions explicitly.
11. Canonicalization, hashing and record-commitment rules are versioned verification rules and MUST remain reproducible for historical records.
12. Missing provenance, identity, authority, framework-version or time-proof evidence MUST remain unresolved or unavailable rather than being inferred.
13. DDC MUST never label upstream substantive truth as verified merely because integrity, provenance or registration proofs succeeded.

## 23. Canonicalization and Payload Commitment v0.2

DDT MUST use a deterministic canonical representation before calculating the upstream payload commitment.

The purpose is to ensure that independent verifiers can reproduce the committed payload bytes and distinguish the value recomputed during verification from the commitment preserved at registration.

### 23.1 Payload commitment scope

`payloadHash` MUST commit only to the canonical upstream payload represented by the DDT record.

DDC registration metadata MUST NOT be included in `payloadHash`.

For DDT Record Envelope v0.2, the hash input is the `upstream` object of the envelope after application of the canonicalization rules recorded for that DDT record.

Conceptually:

```text
DDT envelope
    |
    +-- identity
    |
    +-- upstream --------------------+
    |                                |
    +-- relationships                v
    |                         canonicalization
    +-- ddcRegistration              |
                                     v
                                UTF-8 bytes
                                     |
                                     v
                                  SHA-256
                                     |
                                     v
                          recomputed payloadHash
                                     |
                                     v
                     compare with registeredPayloadCommitment
```

### 23.2 Canonicalization standard and implementation pinning

DDT Record Envelope v0.2 uses:

`RFC 8785 JSON Canonicalization Scheme (JCS)`

Canonicalization identifier:

`RFC8785-JCS`

The canonicalized JSON output MUST be encoded as UTF-8 bytes before hashing.

DDT implementations MUST NOT rely on ordinary application-specific JSON formatting, whitespace, indentation or object insertion order as the canonical representation.

For every newly registered v0.2 record, the registration metadata MUST preserve:

```text
canonicalization.scheme
canonicalization.implementation
canonicalization.implementationVersion
```

The scheme identifies the normative canonicalization rules.

The implementation and implementation version identify the concrete canonicalization software used at write time so that historical verification does not depend on silently changing application dependencies.

Recording an implementation and version does NOT make implementation-specific output authoritative when it conflicts with the normative canonicalization scheme. A conforming verifier SHOULD detect and report such divergence rather than silently accepting it.

### 23.3 Payload hash algorithm

DDT Record Envelope v0.2 adopts:

`SHA-256`

The resulting digest MUST be represented as 64 lowercase hexadecimal characters without formatting-dependent whitespace.

The applicable verification metadata MUST make the canonicalization parameters explicit. The hash algorithm MUST also be identifiable by the applicable schema/profile and MUST NOT be left to verifier inference.

### 23.4 `payloadHash` versus `registeredPayloadCommitment`

The two fields have different verification roles even when their hexadecimal values are identical.

`registeredPayloadCommitment` is the payload commitment preserved as part of the registration state.

`payloadHash` is the value independently recomputed from the payload presented to the verifier using the canonicalization and hashing rules applicable to the record.

Verification compares:

```text
recomputed payloadHash == registeredPayloadCommitment
```

Equality establishes that the presented canonical upstream payload is consistent with the payload commitment preserved at registration.

The user interface and verification output MUST label these roles distinctly. Displaying identical values MUST NOT imply that the fields are redundant.

A successful comparison MUST NOT by itself establish:

- source authenticity;
- signer identity;
- signer authority;
- registration time;
- family-chain completeness;
- relationship validity;
- framework correctness;
- substantive truth.

### 23.5 Null and missing values

For schema-defined fields, an explicitly unknown value represented as `null` MUST remain present as `null` in the canonical payload when the applicable schema requires or defines that field for the registered payload structure.

An implementation MUST NOT silently convert between:

```text
"eventTime": null
```

and an omitted `eventTime` property when calculating the commitment.

The distinction between:

- field present with `null`;
- field absent because it is not part of the applicable schema or payload;

MUST be preserved according to the schema version.

This rule allows DDT to preserve that a value was explicitly unresolved at registration time rather than allowing later implementations to reconstruct or infer it.

### 23.6 Semantic changes

Canonicalization normalizes representation. It MUST NOT normalize or reinterpret substantive values.

Examples of changes that MUST produce a different payload commitment include:

- changing `FAIL` to `PASS`;
- changing a date;
- changing an actor identity;
- changing an authority reference;
- adding or removing a substantive assertion;
- changing evidence references;
- changing any other canonical upstream value.

DDT MUST NOT treat semantically similar but textually or structurally different upstream values as identical unless the applicable schema explicitly defines such normalization before canonicalization.

### 23.7 Verification procedure

An independent verifier of the payload commitment MUST be able to:

1. obtain the upstream payload represented by the DDT record;
2. identify the applicable DDT schema version;
3. read the canonicalization scheme recorded for the record;
4. identify the canonicalization implementation and implementation version used at write time;
5. canonicalize the presented payload according to the applicable normative scheme;
6. encode the canonical representation as UTF-8;
7. calculate SHA-256;
8. encode the digest as lowercase hexadecimal;
9. treat that result as the recomputed `payloadHash`;
10. compare it with `registeredPayloadCommitment`;
11. report the integrity result separately from provenance, signature, authority, time and substantive-truth states.

Matching values establish payload integrity relative to the registered commitment.

They do not establish substantive truth.

### 23.8 Versioning and historical reproducibility

Canonicalization rules, hash algorithms and the metadata required to reproduce them are consensus-relevant verification rules for DDT records and MUST be explicitly versioned or otherwise unambiguously identifiable.

A future DDT schema MAY adopt different canonicalization or hashing rules, but old records MUST remain verifiable using the rules associated with the schema/profile under which they were created.

A future implementation upgrade MUST NOT silently redefine the canonical bytes of an existing DDT record.

Historical verification SHOULD be possible without requiring the verifier to guess which canonicalization library or library version was used during registration.

If an historical implementation is discovered to diverge from the normative scheme, the verifier MUST surface that condition explicitly rather than rewriting or silently normalizing the registered historical state.

## 24. Locked canonicalization decisions v0.2

1. `payloadHash` is the verifier-recomputed hash of the canonical `upstream` payload.
2. `registeredPayloadCommitment` is the payload commitment preserved at registration and is distinct in role from the recomputed `payloadHash`.
3. DDT Record Envelope v0.2 uses RFC 8785 JSON Canonicalization Scheme (JCS) under an explicitly identified and pinned canonicalization profile.
4. The canonicalization scheme, implementation identity and implementation version MUST be available to verifiers as required by the applicable v0.2 profile.
5. Canonical JSON is encoded as UTF-8 bytes before hashing.
6. DDT Record Envelope v0.2 uses SHA-256 for the current payload-hash profile.
7. SHA-256 digests are represented as 64 lowercase hexadecimal characters.
8. Canonicalization and hash algorithm identifiers MUST be available to verifiers.
9. Schema-defined explicit `null` values MUST NOT be silently converted into omitted properties during hashing.
10. Canonicalization MUST NOT reinterpret substantive upstream values.
11. Any change to canonical upstream content MUST produce a different recomputed `payloadHash`.
12. Payload integrity is established by comparing the recomputed `payloadHash` with the preserved `registeredPayloadCommitment`.
13. Historical records MUST remain verifiable using the canonicalization, implementation/profile and hashing rules applicable when they were registered.
14. Matching payload commitments prove payload integrity relative to the registered commitment, not substantive truth.
15. DDC MUST NOT invent missing upstream values merely to complete the canonical payload.
16. Historical v0.1 prototype tests remain evidence of the v0.1 implementation actually tested and MUST NOT be relabeled as v0.2 implementation tests.

## 25. Prototype payload-integrity verification test

The DDT Record Envelope v0.1 prototype has executed a controlled payload-integrity verification test for:

`DDT-gp_2014_005-001`

The test verifies the integrity of the canonical `upstream` payload against a separately stored prototype payload commitment.

### Verification procedure

1. The `upstream` payload is canonicalized using RFC 8785 JSON Canonicalization Scheme (JCS).
2. The canonical JSON is encoded as UTF-8 bytes.
3. SHA-256 is calculated over those bytes.
4. The calculated `payloadHash` is compared with the stored prototype payload commitment.
5. Equality produces `VERIFIED`.
6. Inequality produces `FAILED`.

### Baseline result

Original upstream payload:

- canonicalization: `RFC8785-JCS`
- hash algorithm: `SHA-256`
- payload hash:

`bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9`

Stored prototype commitment:

`bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9`

Result:

`VERIFIED`

### Controlled tamper test

For the controlled test only, one upstream value was changed:

`result.commencement: "FAIL" -> "PASS"`

The recalculated payload hash became:

`5392adfdcf6ab66508833b72aa910f74a623acf5e644f7bac81c98b535577938`

The stored commitment remained unchanged.

Result:

`FAILED`

The original upstream value was then restored to:

`result.commencement: "FAIL"`

The calculated payload hash returned to:

`bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9`

Result:

`VERIFIED`

### What this test proves

The prototype demonstrates that a change to canonical upstream content changes the SHA-256 payload commitment and can therefore be detected by comparison with the previously stored commitment.

### What this test does NOT prove

`VERIFIED` in this test means only that the currently presented canonical upstream payload matches the stored payload commitment.

It does NOT prove:

- that the upstream assertion is factually true;
- that the upstream legal or substantive conclusion is correct;
- that Seven ROL authored or approved the payload;
- that the evaluator identity or authority is verified;
- that the stored prototype commitment has independent provenance;
- that a production DDC registration occurred;
- that an independent external trust anchor exists.

Payload integrity, source provenance/authenticity and DDC registration proof remain separate proof layers.

This distinction is mandatory for DDT verification interfaces.

## 26. Record-hash design boundary — resolved in v0.2

`recordHash` MUST remain distinct from both the recomputed `payloadHash` and the preserved `registeredPayloadCommitment`.

The record-level commitment boundary is no longer pending in DDT Record Envelope v0.2.

Section 27 normatively defines the v0.2 `recordHash` construction, including:

1. the identity fields committed by `recordHash`;
2. the registered payload commitment bound into the record-level commitment;
3. canonicalization and hashing rules;
4. hash-bound typed relationships;
5. the DDT-family predecessor commitment;
6. fields excluded from `recordHash`;
7. proof-layer separation;
8. version-stability requirements.

The v0.2 record-hash design MUST preserve the architectural separation between:

1. upstream content integrity;
2. DDT record identity and structural integrity;
3. DDT-family continuity and typed relationships;
4. source provenance/authenticity;
5. DDC registration signatures, key identity and authority;
6. independent registration-time and provenance proofs.

A `recordHash` MAY be generated only when the applicable schema/profile provides the complete normative commitment rules required to reproduce and verify that hash.

For DDT Record Envelope v0.2, those rules are defined in Section 27.

Historical v0.1 prototype `recordHash` values and tests remain historical evidence of the v0.1 boundary actually implemented. They MUST NOT be interpreted as proof that the expanded v0.2 family-continuity and hash-bound relationship model was already implemented in the v0.1 pilot.

## 27. Record-level commitment and family continuity v0.2

`recordHash` is the cryptographic commitment to the identity and structural context of a DDT record.

It is distinct from both the recomputed `payloadHash` and the preserved `registeredPayloadCommitment`.

`registeredPayloadCommitment` commits to the canonical upstream content as preserved at registration.

`recordHash` binds that registered payload commitment to the DDT record identity, schema version, family-continuity reference and typed record relationships.

### 27.1 Canonical recordHash input

DDT Record Envelope v0.2 defines the record-level commitment input conceptually as:

```json
{
  "identity": {
    "ddtId": "...",
    "ddtFamilyId": "...",
    "subjectRef": "...",
    "recordType": "...",
    "schemaVersion": "ddt-record-envelope-v0.2"
  },
  "payloadCommitment": {
    "canonicalization": {
      "scheme": "RFC8785-JCS",
      "implementation": "...",
      "implementationVersion": "..."
    },
    "hashAlgorithm": "SHA-256",
    "registeredPayloadCommitment": "..."
  },
  "relationships": {
    "previousRecordInFamily": {
      "ddtRef": "...",
      "recordHash": "..."
    },
    "relatedDDTRefs": [
      {
        "ddtRef": "...",
        "recordHash": "...",
        "relationshipType": "responds_to"
      }
    ]
  }
}
```

For the first record in a DDT family, `previousRecordInFamily` MUST be absent or represented according to a schema-defined genesis convention. It MUST NOT contain a fabricated predecessor.

The actual values MUST be taken from the DDT Record Envelope being committed.

### 27.2 Canonicalization and hashing

DDT Record Envelope v0.2 uses:

- canonicalization: `RFC8785-JCS`
- text encoding: `UTF-8`
- record hash algorithm: `SHA-256`
- digest representation: 64 lowercase hexadecimal characters

The canonical `recordHash` input is serialized using RFC 8785 JCS and the resulting UTF-8 bytes are hashed using SHA-256.

The record-level commitment construction is version-specific and MUST be reproducible independently.

### 27.3 Fields committed by recordHash

The v0.2 `recordHash` commits to:

1. `identity.ddtId`
2. `identity.ddtFamilyId`
3. `identity.subjectRef`
4. `identity.recordType`
5. `identity.schemaVersion`
6. payload canonicalization scheme
7. payload canonicalization implementation
8. payload canonicalization implementation version
9. payload hash algorithm identifier
10. `registeredPayloadCommitment`
11. `previousRecordInFamily`, when applicable
12. the canonical `relatedDDTRefs` structure

A change to any committed value MUST produce a different `recordHash`.

The recomputed verification-time `payloadHash` MUST NOT replace `registeredPayloadCommitment` in the historical record-level commitment.

### 27.4 Fields excluded from recordHash

The following DDC registration/proof fields MUST NOT participate in the v0.2 `recordHash` input unless a future schema explicitly defines a different non-circular construction:

- `registeredBy`
- `registrationTime`
- `recordHash`
- `evidenceManifestHash`
- `signingKey`
- `signatureProofs`
- `timeProofs`
- `registrationProof`
- derived verification status labels

These values either describe registration/proof performed after the record commitment is formed, belong to another proof layer, or are derived verification results.

This exclusion prevents circular hashing and preserves separation between record commitment and registration proof.

### 27.5 Proof-layer separation

DDT Record Envelope v0.2 distinguishes separate verification layers.

**Payload integrity**

A verifier recomputes `payloadHash` from the presented canonical upstream payload and compares it with `registeredPayloadCommitment`.

**Record integrity**

`recordHash` binds the preserved payload commitment to DDT identity, schema version, family continuity and typed relationships.

**Family continuity**

`previousRecordInFamily.recordHash` binds a non-genesis record to the specific preceding record state represented when the new record was created.

**Registration / provenance proof**

Signatures, timestamps, registration proofs and external trust anchors may establish additional claims about registration, attribution or time.

Success at one layer MUST NOT be represented as success at another layer.

In particular:

- matching payload commitments do not prove source authenticity;
- matching `recordHash` does not prove source authenticity;
- a valid predecessor link does not prove that the substantive events are true;
- a typed relationship does not prove that the asserted relationship is substantively correct;
- matching hashes do not prove substantive truth;
- registration proof does not convert an upstream assertion into a DDC conclusion.

### 27.6 Hash-bound typed relationships

Relationships affect the historical meaning and lineage of a DDT record and therefore MUST participate in the record-level commitment.

A v0.2 related-record edge MUST identify:

```text
ddtRef
recordHash
relationshipType
```

`ddtRef` identifies the target record for human-readable and resolver purposes.

`recordHash` binds the relationship to the specific committed state of that target record known to the registering record.

A bare DDT identifier without the target `recordHash` MUST NOT be treated as a cryptographically bound relationship in v0.2.

The v0.2 relationship type vocabulary is closed to:

- `supersedes`
- `responds_to`
- `disputes`
- `corrects`
- `remedies`
- `references`

Implementations MUST NOT invent additional relationship types while claiming conformance to this v0.2 vocabulary. A future schema version MAY extend or revise the vocabulary with explicitly defined semantics.

Changing, adding, removing or reclassifying a relationship MUST change the `recordHash`.

A cryptographically intact relationship proves that the relationship assertion was committed as part of the record. It does NOT by itself prove that the asserted semantic relationship is factually, legally or institutionally correct.

### 27.7 DDT-family continuity

Human-readable sequential identifiers such as:

```text
DDT-gp_2014_005-001
DDT-gp_2014_005-002
DDT-gp_2014_005-003
```

are discovery and presentation identifiers. Sequence numbering alone MUST NOT be treated as cryptographic proof of continuity.

Every non-genesis record in a DDT family MUST commit to the immediately preceding record through:

```text
previousRecordInFamily.ddtRef
previousRecordInFamily.recordHash
```

This creates a hash-linked family history in which the committed state of each record depends on the specific predecessor represented at registration.

A verifier walking the family SHOULD verify, for each non-genesis record:

1. that the referenced predecessor exists;
2. that the predecessor belongs to the same `ddtFamilyId`;
3. that the predecessor's recomputed `recordHash` matches `previousRecordInFamily.recordHash`;
4. that the predecessor relationship follows the applicable family-ordering rules;
5. that the walk terminates at the schema-defined genesis record.

A broken predecessor reference, hash mismatch or invalid ordering MUST be surfaced as a family-continuity verification failure or unresolved condition.

Hash linking makes deletion, substitution, insertion or reordering detectable relative to the observed chain of commitments.

However, a predecessor chain by itself does not prove global completeness against a party capable of presenting an entirely different internally consistent history. Detection of such retroactive alternate histories requires an independent registration-time anchor, transparency mechanism or other external commitment layer as defined separately in the DDT architecture.

### 27.8 Relationship semantics versus cryptographic verification

DDT MUST distinguish between:

- proof that a relationship edge was committed;
- proof that the referenced target record matches the committed target hash;
- interpretation of the relationship type;
- substantive correctness of the relationship assertion.

For example, a verified `responds_to` edge proves that the registering record committed to a `responds_to` relationship with a specific target record state.

It does NOT prove that the response was adequate, authoritative, legally effective or factually correct.

This distinction is mandatory for verification interfaces.

### 27.9 Version stability

The `recordHash` construction defined by DDT Record Envelope v0.2 is version-specific.

A future schema MAY define a different record-level commitment structure, canonicalization algorithm, hash algorithm, continuity model or relationship vocabulary.

Such a future schema MUST NOT retroactively change the verification rules for records created under `ddt-record-envelope-v0.2`.

Old DDT records MUST remain independently verifiable using their original schema and cryptographic rules.

### 27.10 Boundary statement

`recordHash` proves that a particular DDT identity, registered payload commitment, family-continuity reference and relationship structure correspond to the committed record representation.

It does NOT prove that:

- the upstream content is factually true;
- an upstream interpretation or verdict is correct;
- the claimed upstream actor actually authored the source content;
- the actor possessed the claimed authority;
- a relationship assertion is substantively correct merely because its edge verifies;
- the observed family history is globally complete without an independent external anchor;
- a production DDC registration occurred;
- an external trust anchor independently witnessed the record.

Those claims require separate evidence and proof layers.

## 28. Prototype recordHash boundary verification tests

The DDT Record Envelope v0.1 prototype has executed controlled tests to verify that the implemented `recordHash` boundary matches the rules defined in Section 27.

Test record:

`DDT-gp_2014_005-001`

Baseline values:

```text
payloadHash:
bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9

recordHash:
7fe76c48c0f7a4b02ceb1c453311adf954e4206064cd46e75d16eab9fd28fde5
```

### 28.1 Committed-field test

The record identity field `identity.recordType` was temporarily changed from `EXTERNAL_EVALUATION` to `EXTERNAL_EVALUATION_TEST`.

The upstream payload was not changed.

Result:

```text
payloadHash:
bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9

recordHash:
bfdb8adeebb46deaee30d7bd5bcb0c3f860c6bec8ad385a79570310b9103b558
```

The `payloadHash` remained unchanged because the canonical upstream payload was unchanged.

The `recordHash` changed because `identity.recordType` is part of the v0.1 record-level commitment.

Result: `COMMITTED FIELD BOUNDARY CONFIRMED`

The original `identity.recordType` was restored after the test.

### 28.2 Excluded-field test

The DDC registration field `ddcRegistration.registrationTime` was temporarily changed from `null` to `2026-08-15T12:00:00Z`.

No committed identity, payload commitment or relationship field was changed.

Result:

```text
payloadHash:
bdda14b00cea6cbc7f653f9025738d3136335c2e4aa866b0af3abdd38b3542f9

recordHash:
7fe76c48c0f7a4b02ceb1c453311adf954e4206064cd46e75d16eab9fd28fde5
```

The `recordHash` remained identical to the baseline value.

This confirms that `registrationTime` is excluded from the v0.1 recordHash input as specified in Section 27.

Result: `EXCLUDED FIELD BOUNDARY CONFIRMED`

The original `registrationTime: null` state was restored after the test.

### 28.3 What the tests demonstrate

The prototype has demonstrated both sides of the recordHash boundary:

1. changing a committed field changes `recordHash`;
2. changing an explicitly excluded registration field does not change `recordHash`;
3. changes outside the upstream payload do not automatically alter `payloadHash`;
4. the implemented recordHash construction is consistent with the v0.1 boundary defined in Section 27.

### 28.4 What the tests do NOT prove

These tests do not prove source authenticity, evaluator identity, evaluator authority, independent provenance, production DDC registration, trusted timestamping, external witnessing, or substantive truth of upstream content.

Those remain separate proof layers.

### 28.5 Prototype status after boundary tests

The following cryptographic prototype behavior is now functionally demonstrated for `DDT-gp_2014_005-001`:

```text
UPSTREAM PAYLOAD
    |
    +--> RFC8785-JCS --> SHA-256 --> payloadHash
    |                              |
    |                              +--> commitment comparison
    |                                   VERIFIED / FAILED
    |
    +--> payloadHash
          +
          identity
          +
          relationships
                |
                +--> RFC8785-JCS --> SHA-256 --> recordHash
```

Payload integrity, record integrity, family continuity, registration/provenance proof and independent registration-time proof are separate verification layers.

Sections 29 and 30 define the v0.2 registration/provenance and independent registration-time structures respectively.
## 29. Registration, key identity and provenance proof v0.2

DDT Record Envelope v0.2 separates record integrity from registration, signing-key identity, registrant identity, authority, registration-time proof and independent provenance.

A valid `recordHash` demonstrates integrity of the committed DDT record representation. It does not establish who registered the record, whether the signing key is stably identified, whether the registrant possessed relevant authority, when registration occurred, or whether an independent party witnessed the registration.

Those claims belong to separate proof layers.

### 29.1 Registration signature

A registration signature MUST bind to the finalized `recordHash` or to a schema-defined commitment derived from it.

The signature MUST NOT be calculated over the complete `ddcRegistration` object because that object contains signature and proof metadata that may be created after the record commitment is formed.

DDT Record Envelope v0.2 represents registration signatures through `signatureProofs[]`.

Each signature proof MUST identify at least:

- `algorithm`
- `keyId`
- `signature`

A successful cryptographic signature verification proves only that the signature was produced by the private key corresponding to the referenced verification key under the applicable algorithm.

It does NOT by itself prove:

- the real-world identity of the signer;
- the authority of the signer;
- that the signer was authorized by the upstream source;
- that the key was valid for the claimed purpose at the relevant time;
- that the registration time is independently proven;
- that an external trust anchor witnessed the registration;
- that the upstream content is substantively true.

### 29.2 Stable signing-key identity

A raw public key representation MUST NOT be treated as the only persistent identity of a signing key.

DDT Record Envelope v0.2 introduces a stable `keyId` separate from the raw verification-key material.

The `keyId` MUST remain stable for the identity of the key object it represents and MUST be resolvable, directly or through a referenced registry, to the verification material required for historical validation.

The concrete `keyId` construction is profile-defined.

Permitted future profiles MAY use mechanisms such as:

- JWK thumbprints;
- DID-based key identifiers;
- registry-assigned identifiers;
- other deterministic or independently resolvable key identifiers.

The generic envelope does not mandate one of these mechanisms.

### 29.3 Signing-key lifecycle and registry semantics

Historical verification requires more than possession of the current public key.

A production key-lifecycle model SHOULD support at least:

- key creation;
- activation;
- `validFrom`;
- `validTo`;
- rotation;
- suspension, where applicable;
- revocation;
- replacement;
- historical verification after rotation or revocation.

The envelope therefore permits:

```text
signingKey.keyId
signingKey.algorithm
signingKey.publicKeyRef
signingKey.validFrom
signingKey.validTo
signingKey.registryRef
```

The authoritative key-lifecycle evidence MAY be stored in a dedicated key registry, represented through DDT records, or both, depending on the applicable profile.

Key rotation MUST NOT invalidate signatures that were valid under the historical key state applicable when the record was registered.

A verifier SHOULD be able to walk the key history and determine whether the referenced key was valid for the claimed use under the applicable historical state.

### 29.4 Registrant identity

`registeredBy` identifies the actor asserted to have registered the DDT record.

Registrant identity MUST remain distinguishable from cryptographic key possession.

A valid signature MUST NOT automatically convert an asserted `registeredBy` identity into a verified real-world identity.

Binding a `keyId` to a real-world or organizational identity requires separate identity evidence.

Where identity-binding evidence is unavailable, the identity state MUST remain unresolved.

### 29.5 Registrant authority

Identity and authority are separate claims.

Proof that a particular key signed a `recordHash` does not prove that the signer possessed authority to create, approve, submit or register the upstream record.

Authority evidence MAY be referenced separately.

Where authority evidence is unavailable, authority MUST remain unresolved rather than being inferred from identity or signature validity.

A verified identity MUST NOT automatically imply verified authority.

### 29.6 Registration time

`registrationTime` is a registration-time claim.

Independent proof of registration time is represented separately through `timeProofs[]` and the mechanism-specific rules defined in Section 30.

A locally generated timestamp without an independently verifiable time proof MUST NOT be represented as `PROVEN`.

A historical upstream event time MUST remain separate from DDC registration time.

A valid signature MUST NOT be represented as proof of registration time unless the applicable signature or external proof profile explicitly provides independently verifiable time semantics.

### 29.7 Independent provenance

Independent provenance requires evidence beyond self-attestation by the producing or registering system.

DDT Record Envelope v0.2 supports provenance evidence through proof references, external trust anchors, time proofs, registries, transparency mechanisms and other profile-defined evidence.

Absence of an independent trust anchor MUST remain explicit.

Independent provenance MUST remain separate from:

- payload integrity;
- record integrity;
- signing-key possession;
- registrant identity;
- registrant authority;
- registration time;
- substantive truth.

### 29.8 Cryptographic agility

DDT records are intended to remain verifiable across long time horizons.

The generic v0.2 envelope MUST therefore be algorithm-agile.

The schema MUST NOT structurally depend on Ed25519 as the only valid registration-signature algorithm.

`signatureProofs[]` permits multiple signatures over the same finalized record commitment.

A production profile MAY require:

- one classical signature;
- multiple signatures using different algorithms;
- a hybrid classical/post-quantum signature set;
- other future cryptographic combinations.

Verification interfaces MUST report the status of each required signature proof independently.

### 29.9 Long-term and post-quantum signature preservation

The v0.2 architecture recognizes that long-lived evidence may outlast the security lifetime of a particular signature algorithm.

A future production profile SHOULD define how historical records remain trustworthy when an algorithm is deprecated, weakened or cryptographically broken.

Potential strategies include:

- hybrid signatures at registration time;
- periodic re-attestation of previously committed records;
- externally anchored checkpoints;
- preservation of historical key-registry state;
- profile-versioned migration rules.

A hash-based post-quantum signature such as SLH-DSA MAY be evaluated as one candidate component of a hybrid profile.

This draft does NOT mandate SLH-DSA or any other post-quantum algorithm.

The exact mandatory post-quantum profile remains a separate design and interoperability decision.

### 29.10 Verification states

DDT verification interfaces MUST expose proof-layer results independently.

At minimum:

**Payload integrity**

- `VERIFIED`
- `FAILED`
- `NOT AVAILABLE`

**Record integrity**

- `VERIFIED`
- `FAILED`
- `NOT AVAILABLE`

**Family continuity**

- `VERIFIED`
- `FAILED`
- `UNRESOLVED`
- `NOT AVAILABLE`

**Registration signature**

- `VERIFIED`
- `FAILED`
- `NOT AVAILABLE`

**Signing-key identity**

- `VERIFIED`
- `ASSERTED`
- `UNRESOLVED`
- `NOT AVAILABLE`

**Signing-key lifecycle state**

- `VALID`
- `EXPIRED`
- `REVOKED`
- `UNRESOLVED`
- `NOT AVAILABLE`

**Registration time**

- `PROVEN`
- `ASSERTED`
- `FAILED`
- `NOT AVAILABLE`

**Registrant identity**

- `VERIFIED`
- `ASSERTED`
- `UNRESOLVED`
- `NOT AVAILABLE`

**Registrant authority**

- `VERIFIED`
- `ASSERTED`
- `UNRESOLVED`
- `NOT AVAILABLE`

**Independent provenance**

- `VERIFIED`
- `UNRESOLVED`
- `NOT AVAILABLE`

Success in one category MUST NOT automatically change the status of another category.

### 29.11 Mandatory semantic separation

DDT verification interfaces MUST NOT collapse the proof layers above into a single generic `VERIFIED` status.

In particular:

`valid signature ≠ verified key identity`

`verified key identity ≠ verified registrant identity`

`verified registrant identity ≠ verified authority`

`valid signature ≠ proven registration time`

`valid signature ≠ independent provenance`

`valid predecessor chain ≠ globally anchored history`

`independent provenance ≠ substantive truth`

`all cryptographic proofs valid ≠ DDC endorsement of upstream content`

### 29.12 Version stability

The registration, key-lifecycle and provenance proof structure is schema- and profile-versioned.

Future DDT schema versions MAY adopt different signature algorithms, key-identity mechanisms, registries, time-proof mechanisms, post-quantum profiles or trust-anchor models.

Such changes MUST NOT retroactively alter the verification rules applicable to records created under `ddt-record-envelope-v0.2`.

Old records MUST remain independently verifiable according to the proof rules associated with their original schema and profile versions.

### 29.13 v0.2 production-profile requirements

Before production use, a conforming DDT v0.2 profile MUST define or select:

1. the permitted signature algorithm or algorithms;
2. whether one or multiple signatures are mandatory;
3. the verification-key representation;
4. the construction and semantics of `keyId`;
5. the key-registry or key-resolution model;
6. key activation, rotation, expiration and revocation semantics;
7. historical verification behavior for expired or revoked keys;
8. the mechanism for binding keys to registrant identity;
9. the authority-evidence representation;
10. the required registration-time proof mechanism or mechanisms;
11. the independent trust-anchor model, if required;
12. crypto-agility and algorithm-deprecation behavior;
13. any mandatory hybrid or post-quantum signature profile;
14. verification behavior when required proofs are unavailable or invalid.

Until those decisions are explicitly defined and versioned, the prototype MUST NOT represent registration provenance as production-verified.

### 29.14 v0.1 prototype registration-signature test retained as historical evidence

The controlled Ed25519 registration-signature test executed for `DDT-gp_2014_005-001` remains valid evidence of the v0.1 prototype boundary that was actually tested.

The v0.1 prototype demonstrated:

- Ed25519 signing of the finalized `recordHash`;
- successful verification against the original signed input;
- failure when the verification input was modified;
- restoration to successful verification when the original input was restored;
- independence between payload-integrity state and registration-signature state.

That test does NOT establish the additional v0.2 properties defined in this section.

In particular, the historical v0.1 test did not establish:

- stable `keyId`;
- persistent key registry;
- key rotation or revocation behavior;
- verified registrant identity;
- verified registrant authority;
- independent registration-time proof;
- external provenance;
- hybrid or post-quantum signature protection.

The historical test MUST therefore remain documented as a v0.1 prototype test rather than being relabeled as proof that the v0.2 registration model has already been implemented.

## 30. Independent registration-time proof v0.2

DDT Record Envelope v0.2 separates three different time concepts:

1. the upstream event time;
2. the DDC registration-time claim;
3. independently verifiable proof that the record commitment existed no later than a particular external time.

These concepts MUST NOT be collapsed into one timestamp.

### 30.1 Upstream event time

`upstream.eventTime` represents the time associated with the event described by the upstream source.

Examples include:

- evaluation time;
- institutional response time;
- correction time;
- dispute time;
- remedy time;
- re-evaluation time.

DDC preserves this value as upstream content where available.

DDC does not independently prove that the upstream event occurred at the stated time merely by preserving the value.

If the upstream source does not provide an event time, the field MUST remain unresolved.

### 30.2 DDC registration-time claim

`ddcRegistration.registrationTime` represents the registration-time claim associated with creation of the DDT record.

It MUST remain separate from `upstream.eventTime`.

A record describing an event from 2014 may therefore have a DDC registration time years later without altering the historical event-time claim.

DDC MUST NOT backdate `registrationTime` to match an upstream event time.

A locally generated application or server timestamp is a registration-time claim. It MUST NOT be represented as independently proven merely because DDC generated or stored it.

### 30.3 Independent time proof

An independently proven registration time requires evidence outside the unilateral control of the registering DDC component.

DDT Record Envelope v0.2 therefore provides:

```text
ddcRegistration.timeProofs[]
```

A time proof SHOULD bind directly or indirectly to the finalized `recordHash`.

A conforming time-proof entry MUST identify enough information for an independent verifier to determine:

- what commitment was externally anchored;
- which proof mechanism was used;
- where the proof or proof reference can be obtained;
- what externally supported time claim the proof establishes;
- how the proof can be independently verified.

The generic v0.2 structure permits:

```text
type
proofRef
proof
anchoredAt
verifier
```

The exact mechanism-specific profile is defined separately from the generic envelope.

### 30.4 Supported proof families and profile agility

DDT v0.2 is designed to support multiple external time-proof mechanisms.

Candidate proof families include, but are not limited to:

- RFC 3161 Time-Stamp Authority tokens;
- public append-only transparency logs;
- Bitcoin OpenTimestamps or equivalent public blockchain anchoring;
- other independently verifiable timestamp or publication mechanisms defined by a future DDT profile.

The generic envelope MUST NOT hard-code one provider or one time-proof technology as the only valid mechanism.

A production DDT profile MAY require one or more specific time-proof mechanisms.

Where long-term independent detectability of retroactive history rewriting is required, at least one proof SHOULD rely on an anchor outside the unilateral control of the DDC operator.

### 30.5 Time-proof status

Verification interfaces MUST distinguish the presence of a timestamp value from the validity of independent time evidence.

At minimum, registration-time verification SHOULD expose:

- `PROVEN`
- `ASSERTED`
- `NOT AVAILABLE`
- `FAILED`

`PROVEN` means that the applicable external time proof has been successfully verified according to its mechanism-specific profile.

`ASSERTED` means that a registration-time value exists but no independently verified external time proof is available.

`NOT AVAILABLE` means that no usable registration-time claim or proof is available.

`FAILED` means that a supplied time proof was expected to verify but did not.

A `registrationTime` value MUST NOT become `PROVEN` solely because it is present in the envelope.

### 30.6 Binding the time proof to the record

The time-proof architecture MUST prevent ambiguity about what was externally anchored.

The preferred v0.2 target is the finalized `recordHash`, or a clearly defined commitment derived from the finalized `recordHash`.

If a mechanism anchors a batch, Merkle root, transparency-log entry or other aggregate commitment rather than the raw `recordHash`, the DDT proof profile MUST preserve the inclusion path or equivalent evidence required to bind the DDT record to that external anchor.

A verifier MUST NOT infer time proof from an external timestamp that cannot be cryptographically connected to the DDT record commitment.

### 30.7 Family continuity and external anchoring

`previousRecordInFamily` provides hash-linked continuity inside a DDT family.

That internal predecessor chain detects modification relative to the presented sequence of record commitments, but it does not by itself prevent an operator from constructing an alternative internally consistent history.

External time anchoring strengthens this boundary.

When selected record commitments or family checkpoints are externally anchored, a later alternative history that conflicts with an already anchored commitment becomes independently detectable.

DDT v0.2 therefore treats family continuity and external time anchoring as complementary proof layers:

```text
previousRecordInFamily
        +
recordHash
        +
external time proof
```

No one layer should be represented as providing all properties of the others.

### 30.8 Historical assertions

Historical dates contained in upstream content remain upstream assertions.

For example, the Seven ROL pilot contains the asserted failure date:

`2014-12-25`

That date MUST NOT be interpreted as:

- the DDT registration time;
- DDC proof that the asserted failure occurred on that date;
- proof that DDC existed or witnessed the event on that date;
- proof that the DDT record existed on that date.

DDC can preserve the historical assertion without converting it into a DDC-proven historical fact.

### 30.9 Current Seven ROL pilot state

For `DDT-gp_2014_005-001`, the reviewed v0.1 pilot data did not provide a confirmed upstream evaluation timestamp.

The v0.1 prototype therefore preserved:

```text
upstream.eventTime: null
```

The reviewed v0.1 prototype also did not embed an independent registration-time proof in the DDT envelope.

Its registration-time state therefore remained:

```text
registrationTimeStatus: NOT AVAILABLE
```

That behavior was correct for v0.1 because unavailable evidence was not invented.

DDT Record Envelope v0.2 strengthens the architecture by making external time-proof support a structural part of the envelope rather than leaving the concept only as a future implementation question.

### 30.10 Release-artifact precedent

The Seven ROL → DDC Mapping Pilot v0.1 release was independently frozen outside the DDT envelope using a SHA-256 archive commitment and an OpenTimestamps proof request.

That release process is not itself a DDT registration-time proof for `DDT-gp_2014_005-001`.

It does, however, demonstrate the architectural distinction between:

- creating a cryptographic commitment;
- preserving that commitment;
- obtaining an independently verifiable external time anchor for the commitment.

DDT v0.2 applies the same general principle inside the record-proof architecture.

### 30.11 Production profile requirements

Before a production DDT v0.2 profile represents registration time as `PROVEN`, it MUST define:

1. the commitment that is submitted to the external time-proof mechanism;
2. the permitted time-proof mechanism or mechanisms;
3. the proof serialization or reference format;
4. the verification algorithm;
5. how aggregate or Merkle-based proofs bind back to `recordHash`;
6. acceptable clock or timestamp semantics for the selected mechanism;
7. behavior when a proof is pending, unavailable, malformed or invalid;
8. long-term archival requirements for independently verifying the proof;
9. whether one external anchor is sufficient or multiple anchors are required by the profile;
10. how time-proof verification status is exposed independently from signature, identity, authority, provenance and substantive-truth states.

### 30.12 v0.2 decision

For DDT Record Envelope v0.2:

1. upstream event time and DDC registration time remain separate;
2. a local registration timestamp is an assertion unless independently proven;
3. independent registration-time proof is a structural envelope capability through `timeProofs[]`;
4. external proof SHOULD bind to `recordHash` or to a cryptographically verifiable aggregate commitment containing it;
5. the generic envelope remains mechanism-agile;
6. a production profile must define at least one independently verifiable time-proof mechanism before claiming `PROVEN`;
7. external anchoring complements, but does not replace, `previousRecordInFamily`;
8. unavailable time evidence remains explicit rather than being inferred;
9. independent time proof does not establish signer identity, signer authority, source authenticity or substantive truth.

## 31. End-to-end Seven ROL → DDT registration flow

This section defines the proposed end-to-end mapping flow demonstrated by the Seven ROL → DDC pilot.

It is a prototype workflow intended to show how an upstream Seven ROL record could become a DDT event record while preserving subject identity, chronological history, unresolved source data and DDC verification boundaries.

It is not a statement that a live Seven ROL API, production registration service or formal Seven ROL integration currently exists.

### 31.1 Registration input

The registration flow begins with an upstream Seven ROL document or record reference.

The upstream reference is an input used to locate or identify source material. It is NOT itself a DDT ID.

For the current pilot example:

Seven ROL subject reference: `gp_2014_005`

DDT family: `DDT-gp_2014_005`

The subject reference remains stable across the chronological DDT history.

### 31.2 Source fetch and preview

Before registration, the system SHOULD obtain the available upstream source data and present it for review.

The prototype currently demonstrates this as a local fetch preview because no live Seven ROL API or formal integration is connected.

Where available, a production integration may obtain fields such as:

- source record or evaluation ID;
- subject reference;
- event type;
- evaluator or upstream actor;
- event time;
- framework and version;
- evaluation result;
- evidence references;
- provenance or authority metadata.

Fields not supplied by Seven ROL MUST remain unresolved and MUST NOT be invented by DDC.

### 31.3 Subject and history check

After the source is identified, DDC checks whether the subject already has a DDT family and chronological record history.

If the subject has no existing DDT records, the first record may receive:

`DDT-<subjectRef>-001`

If the subject already has records, the system MUST inspect the existing family before assigning another DDT ID.

For the current pilot:

Subject: `gp_2014_005`

Existing family: `DDT-gp_2014_005`

Existing records: `DDT-gp_2014_005-001` through `DDT-gp_2014_005-005`

A new event belonging to the same subject would therefore receive the next family sequence identifier, currently:

`DDT-gp_2014_005-006`

### 31.4 Existing record versus new event

Finding an existing subject does not automatically justify creation of a new DDT record.

The system MUST distinguish between:

- an already registered upstream event;
- a genuinely new upstream event concerning the same subject;
- a correction;
- an institutional response;
- an interpretation;
- a dispute or disposition;
- a remedy;
- a re-evaluation;
- another separately recordable event.

Re-submitting the same source reference MUST NOT create an endlessly nested identifier or silently duplicate an existing event.

In particular, an existing DDT ID MUST NOT become a new subject reference.

The sequence MUST remain:

`DDT-gp_2014_005-001`  
`DDT-gp_2014_005-002`  
`DDT-gp_2014_005-003`  
...  
`DDT-gp_2014_005-006`

and MUST NOT evolve into structures such as:

`gp_2014_005-006-007`

Whether two upstream submissions represent the same event or genuinely different events ultimately depends on source identifiers and semantics that Seven ROL must provide or confirm.

### 31.5 Pre-registration review

Before creating a DDT record, the available upstream data SHOULD be shown as a source preview.

The preview allows the registering workflow to expose:

- what source was found;
- which subject it belongs to;
- what record type or event type is proposed;
- what actor information is available;
- what result is available;
- which fields remain unresolved;
- whether an existing DDT history already exists;
- what the next DDT ID would be if the source represents a genuinely new event.

A DDT ID is assigned only when registration of a new record is accepted.

### 31.6 DDT record creation

For a genuinely new event, the registration flow creates the next DDT record within the existing subject family.

The proposed flow is:

`Seven ROL reference`  
→ `fetch available upstream data`  
→ `identify subject`  
→ `check existing DDT family/history`  
→ `determine existing event or new event`  
→ `preview source and unresolved fields`  
→ `register new DDT event`  
→ `assign next DDT ID`  
→ `calculate payloadHash`  
→ `calculate recordHash`  
→ `apply available registration proof`  
→ `append to chronological history`

Earlier DDT records remain immutable.

A correction, response, dispute, interpretation or re-evaluation creates a new record rather than rewriting an earlier record.

### 31.7 Post-registration result

After registration, the new DDT record SHOULD be discoverable through the subject history and DDT search interface.

The record detail view SHOULD expose separately:

- upstream content;
- DDT identity and family;
- relationships to earlier records;
- payload integrity;
- record integrity;
- registration-signature state;
- registration-time proof state;
- registrant identity state;
- registrant authority state;
- independent provenance state.

The most recently registered record may be identified as the latest record for the subject.

`Latest` means chronologically most recently registered. It does NOT mean that DDC considers that record legally, factually or substantively superior to earlier records.

### 31.8 Relationship and history preservation

New records MAY reference earlier DDT records where a relationship is asserted.

Examples include:

- response to an earlier evaluation;
- interpretation based on an evaluation and institutional response;
- re-evaluation of an earlier evaluation;
- correction of an earlier record;
- dispute concerning an earlier record;
- remedy associated with an earlier finding.

Such relationships remain explicit assertions within the record structure and MUST NOT silently rewrite the meaning or content of referenced records.

### 31.9 Current prototype boundary

The current workbench demonstrates the proposed registration flow using local prototype data.

It currently demonstrates:

- stable subject and DDT-family separation;
- chronological DDT IDs;
- existing-subject detection;
- source preview;
- prevention of treating an existing DDT ID as a new subject;
- record preview and search;
- immutable-history concept;
- payload hashing;
- record hashing;
- local Ed25519 registration-signature verification;
- explicit unresolved proof states.

It does NOT demonstrate a live Seven ROL source connection, production duplicate-event detection, persistent production registration keys, independently proven registration time, verified registrant identity or authority, or external provenance.

### 31.10 Seven ROL confirmation required

The final production registration flow cannot be fixed from the currently available pilot data alone.

Seven ROL must confirm or provide, where applicable:

1. the canonical source/document/evaluation identifier;
2. how a subject is identified;
3. how a unique upstream event is identified;
4. which event types can occur for the same subject;
5. whether corrections or re-evaluations receive new upstream identifiers;
6. which actor, timestamp, framework and evidence fields are available;
7. whether a frozen evidence state exists;
8. what source interface or API can expose these fields;
9. which relationships between Seven ROL events are authoritative upstream data and which would be DDC-side assertions.

Until those semantics are confirmed, the workbench remains a proposed mapping model rather than a finalized Seven ROL integration.

### 31.11 Pilot decision

For this pilot, the end-to-end registration concept is considered demonstrated when a reviewer can understand the following lifecycle:

`Seven ROL source → subject → source preview → existing-history check → new event decision → DDT registration → immutable chronological history → independent verification states`

The purpose of this demonstration is to allow Seven ROL to review the proposed mapping, confirm whether it matches their operational model, identify incorrect assumptions and provide the missing integration parameters.

Production behavior beyond that boundary is intentionally deferred until the mapping concept and upstream semantics are confirmed.

## 32. Pilot completion and Seven ROL review handoff

This section closes the current Seven ROL → DDC mapping pilot.

The purpose of the pilot is not to finalize a production Seven ROL integration. Its purpose is to demonstrate a concrete mapping model that Seven ROL can review, accept, reject or correct before additional implementation work is undertaken.

No further DDT mapping sections are required for this pilot before Seven ROL review.

### 32.1 What the pilot demonstrates

The current workbench demonstrates a proposed lifecycle in which:

`Seven ROL source`
→ `stable subject reference`
→ `DDT family`
→ `individual immutable event records`
→ `chronological history`
→ `record relationships`
→ `integrity commitments`
→ `registration/provenance proof states`
→ `independent verification interface`

The pilot demonstrates that multiple events concerning the same subject can be preserved without overwriting earlier records.

It also demonstrates that DDC can preserve an upstream evaluation and its subsequent history without converting the Seven ROL conclusion into a DDC legal or substantive judgment.

### 32.2 Demonstrated DDT identity model

For the pilot subject:

`gp_2014_005`

the proposed DDT family is:

`DDT-gp_2014_005`

and individual events use chronological identifiers such as:

`DDT-gp_2014_005-001`  
`DDT-gp_2014_005-002`  
`DDT-gp_2014_005-003`

The subject reference remains stable.

An existing DDT ID MUST NOT become a new subject reference.

A genuinely new event concerning the same subject receives the next sequence identifier rather than modifying or nesting the previous identifier.

### 32.3 Demonstrated history model

The workbench demonstrates separate records for different recordable events, including the pilot concepts of:

- external evaluation;
- institutional response;
- interpretation;
- later re-evaluation.

Earlier records remain visible and are not rewritten when later events occur.

Relationships between records are represented separately from the records themselves.

The latest record represents the most recently registered DDT event for the subject. It does not represent a DDC determination that the latest record is legally, factually or substantively superior.

### 32.4 Demonstrated integrity model

The pilot demonstrates separate integrity commitments for:

- the upstream payload;
- the DDT record representation.

For the primary pilot record `DDT-gp_2014_005-001`, the prototype demonstrates:

- RFC8785-JCS canonicalization;
- SHA-256 payload hashing;
- comparison with a registered payload commitment;
- `payloadIntegrityStatus: VERIFIED`;
- a separate `recordHash`;
- controlled record-integrity boundary tests.

The integrity model demonstrates whether committed bytes or record structures remain consistent with their commitments.

It does not establish the substantive truth of the upstream content.

### 32.5 Demonstrated registration-proof model

The pilot demonstrates a separate registration-signature layer using local prototype Ed25519 signing.

For the tested primary record, the prototype demonstrates:

- signature input bound to the finalized `recordHash`;
- successful Ed25519 verification;
- controlled signature-failure behavior when verification input is modified;
- restoration to successful verification when the original input is restored.

The proof layers remain independent.

A valid registration signature does not automatically prove:

- registrant real-world identity;
- registrant authority;
- independently proven registration time;
- independent external provenance;
- substantive truth of the upstream record.

### 32.6 Demonstrated time boundary

The pilot distinguishes:

`upstream.eventTime`

from:

`ddcRegistration.registrationTime`

and from:

`registrationTimeStatus`

Historical dates contained in Seven ROL content remain upstream assertions.

A DDC registration timestamp MUST NOT be backdated to an upstream historical event date.

The current prototype does not claim an independently proven registration time.

### 32.7 Demonstrated recorder behavior

The local recorder demonstrates the proposed pre-registration workflow:

`enter Seven ROL reference`
→ `fetch available source`
→ `preview source`
→ `identify subject`
→ `inspect existing DDT history`
→ `determine whether the fetched event is already registered`
→ `show the next DDT ID that would apply to a genuinely new event`

The recorder rejects a DDC DDT identifier when it is entered as though it were a Seven ROL upstream source reference.

For the current pilot source `gp_2014_005`, the recorder identifies the existing event as already registered and shows that a genuinely new event for the same subject would currently receive:

`DDT-gp_2014_005-006`

The prototype does not invent a new Seven ROL event merely to demonstrate registration.

### 32.8 Information intentionally unresolved

The pilot intentionally leaves unavailable or unconfirmed information unresolved.

Current examples include:

- canonical Seven ROL evaluation/source record ID;
- evaluator identity;
- evaluator role and authority metadata;
- evaluation timestamp;
- framework/codebook version;
- frozen evidence-state semantics;
- evidence manifest binding;
- evaluation provenance proof;
- exact failure-date derivation;
- law-days-lost calculation semantics;
- production duplicate-event semantics;
- production registrant identity binding;
- production authority evidence;
- independently proven DDC registration time;
- production key lifecycle;
- external trust-anchor model.

These gaps are visible by design.

DDC MUST NOT fill missing Seven ROL information with assumptions merely to make the demonstration appear complete.

### 32.9 What Seven ROL needs to review

Seven ROL should review whether the proposed mapping correctly represents its operational and evidentiary model.

In particular, Seven ROL should confirm, reject or correct:

1. whether `gp_2014_005` is appropriately treated as the stable subject reference;
2. what the canonical evaluation or source-event identifier is;
3. whether one subject can have multiple evaluations or other recordable events;
4. which events should create separate DDT records;
5. how corrections, re-evaluations, responses, disputes and remedies are represented upstream;
6. which relationships between events are authoritative Seven ROL data;
7. which evaluator identity and authority fields exist;
8. which event timestamps exist and what they mean;
9. how framework versions are identified;
10. whether evaluations bind to a frozen evidence state;
11. what evidence references or manifests are available;
12. how the asserted failure date is derived;
13. whether a law-days-lost calculation exists and how it is defined;
14. what API, export or other source interface could provide the required fields.

The answers may require changes to the current mapping.

Such changes are expected and are the reason this pilot is being reviewed before production integration work.

### 32.10 What DDC needs to decide later

The following are DDC production-design questions and are intentionally not finalized by this mapping pilot:

- persistent registration-key management;
- permitted production signature algorithms;
- verification-key representation;
- key rotation and revocation;
- registrant identity binding;
- registrant authority proof representation;
- registration-time proof mechanism;
- external trust-anchor model;
- production evidence-manifest commitment;
- production storage and retrieval architecture;
- production duplicate-event enforcement;
- final schema evolution and migration rules.

These decisions should be made only after the upstream mapping and integration requirements are sufficiently understood.

### 32.11 Review outcomes

The pilot is intended to support three straightforward review outcomes.

**ACCEPT CONCEPT**

The proposed mapping direction reflects Seven ROL sufficiently well to continue into a refined integration design.

**ACCEPT WITH CHANGES**

The overall DDT approach is usable, but Seven ROL identifies incorrect assumptions, missing fields, incorrect event boundaries or required changes to the mapping.

**REJECT / REDESIGN**

The proposed DDT mapping does not represent Seven ROL's operational model adequately and should be redesigned before further implementation.

A request for changes is not a failure of the pilot. Identifying incorrect assumptions before production implementation is one of the pilot's primary purposes.

### 32.12 Pilot completion boundary

With Sections 1–32 and the corresponding local workbench behavior, the current Seven ROL → DDC mapping pilot is considered complete for external concept review.

The pilot currently provides enough implementation detail to demonstrate:

- the proposed DDT role;
- subject/family/event separation;
- chronological immutable history;
- search and discovery concepts;
- a machine-readable DDT envelope;
- upstream/DDC semantic boundaries;
- payload and record integrity;
- registration/provenance proof separation;
- registration-time separation;
- proposed end-to-end registration behavior;
- explicit unresolved dependencies on Seven ROL and future DDC production design.

Further schema expansion or production implementation SHOULD be deferred until Seven ROL has reviewed the mapping concept and supplied or clarified the upstream semantics required to continue.

The next step is therefore review, not another mapping section.
