---
title: "ADR-9838 — Docs follow code through claude-code-action on PRs and a close-out Stop hook, from one map"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9838-docs-follow-code-through-claude-code-action-and-a-close-out-hook.md"
updated: 2026-10-23
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9838-docs-follow-code-through-claude-code-action-and-a-close-out-hook.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9838
adr_status: accepted
status: active
decision_date: 2026-10-23
decision-makers: [cloud]
consulted: [agent]
informed: [win, nova, dust]
supersedes:
superseded_by:
issue: 9838
subprocess: process
references:
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - wi/docs-map.yaml
  - _infra/scripts/docs-map.py
  - .github/workflows/docs-sync.yml
  - wi/components/docs-sync.md
  - wi/decisions/TEMPLATE.md
  - utopia-models/fleet-plugins#114
```

# ADR-9838 — Docs follow code through claude-code-action on PRs and a close-out Stop hook, from one map

## Context and Problem Statement

PLAN-405 (Tyler, 2026-10-22: *"I really would like to replace our custom workflows with tools and
plugins"*) asks P3 to keep docs in step with code and process through tools that exist, rather than
hand updates and custom linters. Docs drift today: on 2026-10-23 `docs-cog.sh --check` is red on
`main` (`phone-comms.md` states a timer schedule the unit no longer has) and nothing put that in
front of the author of the change. What decides, for a given change, which doc it owes, and who
writes that doc?

## Decision Drivers

* A third-party tool over custom machinery (the north star; `wi/context.md`).
* No stored copies: the KB already says which doc covers which code — every component doc's `owns:`.
* Cost: flat subscriptions only. Claude Code runs started by the Action count as subscription usage,
  not API credits. **Measured 2026-10-23, org billing usage API: the free plan's 2,000 hosted Linux
  minutes were used in full in 2026-09 (knowledge 1,908) and in 2026-10 (knowledge 1,907).**
* Masters merge their own PRs within a minute, so a PR-only mechanism misses most changes made in
  sessions; the session needs its own check at plan close.

## Considered Options

* **A — claude-code-action on PRs + a Stop hook at plan close, both reading one map** (chosen)
* B — hosted-runner claude-code-action only, as in the action's "Documentation Sync" example
* C — the close-out hook only (the issue's named fallback if hosted Actions cannot carry it)
* D — do nothing: keep `docs-cog` value assertions and kb-lint R10 staleness
* E — integrate an existing doc-drift linter (no tool reads `owns:`-style mappings; each needs its
  own config of the same facts)

## Decision Outcome

Chosen option: **A**, because it puts the doc question in front of both kinds of change (PR and
session) with one reader (`docs-map.py unmet`) and one map, and the model is spent only where a
free check already found a left-behind doc.

* **The map** is `wi/docs-map.yaml`: one shape for all six projects (`context` + `maps`), with the bulk
  derived from component docs' `owns:` (`derive.component_owns`) instead of copied. A path covered by
  several docs is met when any of them changes.
* **PR side**: `.github/workflows/docs-sync.yml`, `anthropics/claude-code-action` pinned by commit SHA
  to v1.0.260, auth `CLAUDE_CODE_OAUTH_TOKEN`. It runs on the **self-hosted** novaserver runners —
  B is ruled out by the measurement above: a hosted job would queue until the month resets. The
  action's self-hosted defect (anthropics/claude-code-action#521, `claude` not found after install)
  and its writes to `$HOME` are handled by giving the action step a fresh `HOME` under `RUNNER_TEMP`.
  No `check_suite` / `workflow_run` triggers (a 2026-07 budget-storm amplifier).
* **Session side**: fleet-doctrine `stop-docs-sync.sh`, a Stop hook that blocks a plan close once and
  names the doc; it reads "closed" from the PLAN-405 state file (`loop: closed`, P4) or the step-2
  exit marker.
* **Lint**: `lychee --offline --include-fragments` runs as an advisory step (`continue-on-error`) in the
  `probes` job, the job that already runs the `docs-cog` value assertions, which stay.
* **ADRs**: `wi/decisions/TEMPLATE.md` is MADR 4.0.0 in the fleet's key names — MADR `status` is
  `adr_status`, `date` is `decision_date`; `decision-makers`/`consulted`/`informed` are added. Superseding
  edits the OLD record's header (`adr_status: superseded`, `superseded_by:`), and
  `decision-record-linter.sh` reports the one-way chain. The linter was reading YAML comments and prose
  as targets and resolving ids in `find` order; both fixed, so its findings are real.

### Consequences

* Good, because a doc left behind by a PR gets a commit or a written reason, and a session gets one
  prompt at close, both from the same map.
* Good, because no new list is maintained: adding a component doc with `owns:` extends the map.
* Bad, because PR-side runs draw on one master login's quota (the token is `nova@utopiamodels.ai`'s;
  the repo secret it replaced, set 2026-07-14, was revoked).
* Bad, because a PR merged while the action runs loses the doc commit (the comment remains).

### Confirmation

```bash
python3 _infra/scripts/docs-map.py check
bash _infra/tests/adr-supersede-chain.sh
gh run list --repo utopia-models/knowledge --workflow docs-sync.yml --limit 5
bash _infra/scripts/mechanism-liveness.sh stop-docs-sync.sh
```

## Pros and Cons of the Options

### B — hosted claude-code-action only

* Good, because it is the documented example, unchanged.
* Bad, because the org's hosted minutes are spent (measured above), and it never sees session work.

### C — close-out hook only

* Good, because it costs no Actions time and no model usage.
* Bad, because a PR from a dispatched master never passes a plan close, so PR-side drift is unchecked.

### D — do nothing

* Bad, because value assertions catch a stated number going false, not prose falling behind, and R10
  staleness is advisory output nobody is prompted by.

## More Information

Re-open if: hosted minutes become available (then the runner choice, not the design, changes); the
PR-side run rate measurably threatens master quota; or P4's Plan issue becomes the better place to
record "no doc impact" than the session state file.
