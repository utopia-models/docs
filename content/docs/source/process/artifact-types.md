---
title: "Artifact types — the five things this knowledge base holds"
description: "Mirrored from the fleet knowledge base: _process/artifact-types.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/artifact-types.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect, master, personal, alwayson]
```

# Artifact types — the five things this knowledge base holds

Every file in the KB is exactly one of these. A thing that is none of them has no home here — that is the
signal, not an inconvenience.

| type | what it is | where it lives | who writes it |
|---|---|---|---|
| **component doc** | one file per thing that RUNS or HOLDS STATE; an INDEX — ADRs in `decisions/` via `adrs:`, code in the repo named by `owns:` | `wi/components/<id>.md`, **FLAT** | anyone who researches it |
| **decision** | an ADR — ONLY when the choice is expensive to reverse or a future reader will re-litigate it | `wi/decisions/` (org) · `<portfolio>/decisions/` · `<...>/work/specs/<issue#>-<slug>/decisions/` (one piece of work) | whoever makes the call |
| **note** | evidence with a date: research, a case, a postmortem, a verification report, a plan document | `wi/work/…` · `_rules/cases/` | anyone |
| **prompt** | an instruction an agent executes: step file, subprocess, rule | `_process/` · `wi/subprocesses/` · `_rules/` | the Architect |
| **template** | a shape someone fills in | `wi/work/specs/DECISION-TEMPLATE.md`, `wi/work/engineering/templates/` | the Architect |

## Rules for all five
- **`ls` is the index.** Flat directories with a generated index beat nested ones with a hand-written one;
  every hand-maintained index here has decayed.
- **State the PROBE, never the answer, for anything off-git** — "run this to see the routes" cannot rot.
- **A doc that STATES a value is a claim about code** — bind it with a `cog` assertion (`docs-cog.sh`) or
  do not state it.
- **Delete, don't archive** — git is the archive; `archive/` is banned.
- **Spent one-shot output is deleted once nothing cites it** (verification report, adjudication, close-out
  file); it never lives at the repo root.

## Binaries — the git↔Drive boundary
- **git**: the file a document cannot be read without (deck PDF, a reference image a spec describes, a
  pinned font, an evidence capture) — **single files under ~10 MB that change with the document**,
  committed beside it.
- **Drive**: every *body of media* (multi-GB video, render batches, shoot dumps), referenced by **manifest
  key** never path (`_infra/drive-manifest.yaml`). 🔴 **Never mirror a Drive folder into git.**
- Judgement call? Commit it — a misplaced file is one `git rm` away; an unfindable one is unreadable.
