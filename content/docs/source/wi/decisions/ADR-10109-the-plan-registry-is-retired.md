---
title: "ADR-10109 — The plan registry is retired; the Plan issue on the board is the only record of a plan"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-10109-the-plan-registry-is-retired.md"
updated: 2026-10-25
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-10109-the-plan-registry-is-retired.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-10109
adr_status: accepted
status: active
decision_date: 2026-10-25
decision-makers: [tyler-youk, win]
consulted: []
informed: [agent, nova, cloud, dust]
supersedes: ADR-9930 (the `PLANS_SOURCE=registry` flip back only; the board default it set is now the only reader)
superseded_by:
issue: 10109
subprocess: process
references:
  - wi/decisions/ADR-9839-the-plan-issue-is-the-only-record.md
  - wi/decisions/ADR-9840-the-dashboard-reads-plan-issues-behind-a-flag.md
  - wi/decisions/ADR-9930-the-dashboard-reads-the-board-by-default.md
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - utopia-models/knowledge#9967 (Feature), #10109 (this task), #10114 (parity prep), #10121 (dispatch path)
  - utopia-models/utopia#602 · utopia-models/fleet-plugins#123, #124 (0.100.0, 0.100.1)
  - utopia-models/brain-agent#91, #92 · brain-win#33, #34 · brain-nova#61 · brain-cloud#41
```

# ADR-10109 — The plan registry is retired; the Plan issue on the board is the only record of a plan

## Context and Problem Statement

ADR-9839 made the Plan issue the only record of a planning session, and ADR-9840/9930 moved the dashboard
onto it while the registry (`wi/work/plans/entries`, `wi/work/plans/documents`, `plan-registry-cli.py` and
its publish path, the step/bind hooks, and `~/.claude/state/mode`) kept running beside it behind
`PLANS_SOURCE`. Feature #9967 held its deletion until the two had stayed at parity for seven days. On
2026-10-24 Tyler cut that hold: *"Retire it now."* Two trackers cannot both be true, and the registry was
the one that kept conflicting on publish (#8603, the ⚠ on #9967 itself).

## Considered Options

1. **Keep waiting out the seven-day window.** Rejected: Tyler's call, and the window measured nothing the
   parity report run on the day does not.
2. **Freeze the registry read-only, keep the files.** Rejected: a frozen second record still reads as a
   record (every doc and agent that cites it keeps resolving to stale state) — *delete, don't archive*.
3. **Delete every reader and writer, all at once, after a clean parity run (chosen).**

## Decision Outcome

Chosen option 3. Before any deletion `apps/web/scripts/plans-parity.ts` was re-run; its non-timestamp
differences were fixed on the Plan issues and the registry (knowledge#10114) and the clean re-run is posted
on #10109. Then, one PR per repo:

- **knowledge** — `wi/work/plans/` (entries, documents, artifacts, audits, config), `plan-registry-cli.py`,
  `plan-registry-publish.sh`, `plan-bind-reap.sh`, `plan-doc-drift.sh`, `plan-flip-health.sh`,
  `plan-issue-backfill.py`, `plan-artifact-section-check.py`, `artifact-cog.py` and their tests and CI steps;
  the registry stamping in `dispatch.sh` / `file-issue.sh`; the component and reference docs that described it.
- **utopia** — the registry reader and `PLANS_SOURCE`; `/v1/board` reads Plan issues only.
- **fleet-plugins** — the step-emit / bind / reap hooks, `mode-set.sh` and `~/.claude/state/mode`
  readers and writers; version bumped and pinned on every box.
- **brain-agent** — `/plan-continue-registry`, `/plan-park-registry` and the `plan-new/close/park/unpark`
  writers; the leftover `plan-bind`/`plan-bind-reap` copies in brain-win, brain-nova, brain-cloud and brain-agent,
  with their `settings.json` wiring.

What replaced `~/.claude/state/mode`: `project-session.sh load` writes `mode` into
`~/.claude/state/plan-issue/<sid>` (ADR-9839's state file); the ask-loop is its `loop` key, and
`userpromptsubmit-plan-issue.sh` carries the `[standing]` and `[ask-loop]` lines the retired
`userpromptsubmit-mode-inject.sh` used to. The injected `[plan]`/`[this turn]`/`[subprocess]` lines and the
monitored-dispatch `mode_frame()` sentence are gone; `_process/steps/4-dispatch.md` carries the instruction.

Plan documents that Plan issues link to (`Document:` lines) were repointed to SHA permalinks of the last
commit that held them, so `plan ↗` keeps opening the document after the deletion.

### Consequences

- Good: one record. `/plan-start` → Plan issue → Features is the whole path; nothing publishes plan state
  to git, so the shared clones stop going dirty with telemetry.
- Bad: the registry-only cells (step-1/2 conditions, `stepcycle`, `pid`, declared phase count) are gone
  from the dashboard for good — ADR-9840 already named them dropped on the board view.
- Rollback: `git revert` the deletion commit in each repo and advance the plugin pin back.

## Corrections preserved or retired

Retired with the machinery they guarded: the registry's one-writer rule (`plan-registry-cli.py` is the only
writer of entry bytes), the publish-conflict alarm (#8603), the flip-health check (#4873), the id-prefix
check (#4645), the drift and filename checks (#4479, #5893), the artifact-URL matcher (#7900, #8369) and the
artifact-section check (#7388) — each graded a registry file that no longer exists. Preserved: the
`*archive*`-directory check (lint step 11), every board-side rule in `planStatus.ts`, and the Plan-issue
mapping in ADR-9840.
