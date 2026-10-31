---
title: "ADR-0000 — {short title: the problem solved and the solution chosen}"
description: "Mirrored from the fleet knowledge base: wi/decisions/TEMPLATE.md"
updated: 2026-10-23
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/TEMPLATE.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
# MADR 4.0.0 front matter (https://adr.github.io/madr/), in the fleet's key names — ADR-9838.
#   MADR `status` → `adr_status`  (the fleet's `status:` is the record's lifecycle, kept as `active`)
#   MADR `date`   → `decision_date`
# SUPERSEDING: the new record names the old one in `supersedes:`, and the SAME commit edits the OLD
# record's header — `adr_status: superseded` and `superseded_by: ADR-<new>` — and nothing below its
# header. `_infra/scripts/decision-record-linter.sh` reports a one-way chain (CI, advisory).
artifact_type: adr
adr_id: ADR-0000                  # ADR-<issue#> of the issue that made the call
adr_status: proposed              # proposed | accepted | rejected | deprecated | superseded
status: active
decision_date: 2026-01-01         # YYYY-MM-DD the decision was last updated
decision-makers: []               # who made the call (agent ids / tyler-youk)
consulted: []                     # whose input was sought (two-way)
informed: []                      # who is told after (one-way)
supersedes:                       # ADR-<n> this replaces, or empty
superseded_by:                    # set ONLY by the record that supersedes this one
issue: 0
subprocess:                       # the subprocess that produced it (e.g. process), or empty
references: []
```

# ADR-0000 — {short title: the problem solved and the solution chosen}

## Context and Problem Statement

{Two or three sentences, or a question. Link the issue and the measurements that forced the choice.}

## Decision Drivers

* {driver, e.g. a force or a measured constraint}

## Considered Options

* {option 1}
* {option 2}
* do nothing
* integrate an existing tool

## Decision Outcome

Chosen option: "{option}", because {justification — which drivers it meets, which measurement decided it}.

### Consequences

* Good, because {…}
* Bad, because {…}

### Confirmation

{The command that shows the decision holds in the running system.}

## Pros and Cons of the Options

### {option 1}

* Good, because {…}
* Bad, because {…}

## More Information

{Re-open conditions: the new information that would justify a superseding record.}
