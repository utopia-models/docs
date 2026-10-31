---
title: "ADR-9836 — The Architect's always-on layer is a project-free floor; project text is `<project>/context.md`"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9836-a-project-free-shared-floor.md"
updated: 2026-10-23
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9836-a-project-free-shared-floor.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9836
adr_status: accepted
status: active
decision_date: 2026-10-23
supersedes:
superseded_by:
issue: 9836
subprocess: process
references:
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - _process/floor/
  - _infra/scripts/process-build.py
  - _infra/scripts/always-on-census.py
  - utopia-models/fleet-plugins#113
```

# ADR-9836 — The Architect's always-on layer is a project-free floor; project text is `<project>/context.md`

## Context

PLAN-405 (Feature #9835): every session works one project and carries no other project's text. Measured on
the Architect's box on 2026-10-23 with `_infra/scripts/always-on-census.py` against the newest real session:
CLAUDE.md 8,361 B · `bundle-architect.md` 52,998 B · `MEMORY.md` 11,862 B · SessionStart 15,315 B =
**88,536 B**, with 57 lines naming another project (capability rows, roster roles, the comms digest,
cleaning/DMV/net memory lines, WI's org map, cleaning's sales and site-build rules). The spec's ceiling is
45,000 B.

## Options considered

1. **Do nothing** — 88.5 KB on every turn of every session, most of it irrelevant to the session's one
   project. Rejected: it is the problem PLAN-405 exists to remove.
2. **Trim in place** — shorten the existing `_process/*.md` sources. Rejected: eight of them also build the
   master, cowork, personal and always-on bundles, which this phase must leave byte-identical; every cut to
   the Architect would move four other classes.
3. **Floor files in the fleet-doctrine plugin, injected by a SessionStart hook** (the issue's wording).
   Rejected on placement: hook output is counted against the same budget, does not survive `/compact`
   unless re-injected, and moves doctrine out of the repo that `process-build.py --check`, kb-lint R8 and
   `feedback-deliver.sh` grade. The plugin keeps what only a plugin can do (the SessionStart hooks).
4. **Integrate existing: a floor compiled by the existing generator** — CHOSEN. Four hand-written files in
   `_process/floor/` (lifecycle · voice-asking · credentials-tracker · behavior) become `bundle-architect.md`,
   still delivered by the one `~/.claude/rules/bundle.md` symlink. Each architect rule is stated once in the
   floor with its path; the rule file keeps the full text and evidence.

## Decision

- `process-build.py`: the architect bundle is the floor, in that order. A source with `architect` in its
  audience is reached when a floor file cites its path. An architect-only rule nothing cites (a rule
  `/feedback-loop` just wrote) is appended under *Not yet folded into a floor file* and named on every run
  — delivery never breaks, and the debt is visible. A rule cited by a `<project>/context.md` belongs to that
  project. The other four bundles are built exactly as before (byte-identical, measured with `cmp`).
- Ceiling `ARCHITECT_PREFIX_CEILING = 17_500` (measured 17,413 B). Never raised.
- Project text moves to `<project>/context.md` (≤3 KB) for wi, dmv-research, cleaning, net, govcon and
  talent; kb-lint admits the name. Project memories leave `fleet-memory/agent/MEMORY.md` and are listed in
  their project's context file. P2's loader reads that file when `/plan-start` sets the project.
- The Architect's CLAUDE.md (brain-agent) keeps only box facts; the comms digest leaves its SessionStart.
- fleet-doctrine 0.91.0: capabilities is one count line (`capabilities.sh --summary`), the undispatched
  advisory prints counts (`--list` for the split), the roster drops roles and counts project-bound agents.
- Deleted (folded): `_process/artifact-order.md` → floor lifecycle; `_process/north-star.md` →
  `wi/context.md`; `_process/execute-tylers-own-work.md` → `_rules/tyler-owns-it-so-execute-it.md` body.

## Corrections preserved, and the retired list

Every 🔴 rule of the old architect bundle is in the floor with its `_rules/` path, or in a context file
(flame → `wi/context.md`; site builds and sales-not-lawyer → `cleaning/context.md`). Merged duplicates, each
now stated once: the merge-by-`--admin` rule (was in the-loop, a rule and CLAUDE.md) → `lifecycle.md`;
credentials (credentials.md + CLAUDE.md) → `credentials-tracker.md`; Tyler's-own-work (2.9 KB process file +
rule) → `credentials-tracker.md`; lane and board law (CLAUDE.md) → `credentials-tracker.md`; the hard stop
(three places) → `credentials-tracker.md`; the planning-frame trigger (CLAUDE.md) → `lifecycle.md`.

**Retired from the Architect's always-on text** (each still lives where cited, or in git history):
the CLAUDE.md "Dead — never resurrect" list (git history is the archive) · the "15 PRs stacked 2026-07-31"
and "~3,100 B master headroom" measurements (stale) · the 234-file verification-reports count · the gates
table rows for Vercel `COMMIT_AUTHOR_REQUIRED` and the `bash -n` syntax guard (still in the master bundle;
the floor cites the commit-author rule) · the mode-file tombstone mechanics (`mode-set.sh` documents them)
· `plan-artifact-section-check.py` · the "~8% of proven capacity" and #3530 freshness evidence (still in
`_process/behaviors.md` for the other classes) · the #3728/#3902 false-gate evidence (in
`wi/components/escalation-gates.md`) · the derived-subscription-login line · the rules' long "Fires when"
paragraphs (full text in each rule file) · one-recommendation's default-option clause and config's
naming-convention clause (rule files).

## Consequences

- A new architect rule costs bytes only when folded into a floor sentence; until then it rides as one line.
- The always-on total is graded by `always-on-census.py --search` on the Architect's box; P2 adds the
  project file it now omits.
- Until P2 ships, a session's project memories are reached through `<project>/context.md` by hand.
