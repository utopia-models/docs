---
title: "ADR-9930 — Production `/v1/board` reads the Plan issues by default; `PLANS_SOURCE=registry` is the flip back"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9930-the-dashboard-reads-the-board-by-default.md"
updated: 2026-10-25
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9930-the-dashboard-reads-the-board-by-default.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9930
adr_status: accepted
status: active
decision_date: 2026-10-23
decision-makers: [cloud]
consulted: []
informed: [agent, tyler-youk]
supersedes: ADR-9840 (the default of `PLANS_SOURCE` only; its mapping, backfill and dropped cells stand)
superseded_by: ADR-10109 (the `PLANS_SOURCE=registry` flip back; the registry is retired)
issue: 9930
subprocess: process
references:
  - wi/decisions/ADR-9840-the-dashboard-reads-plan-issues-behind-a-flag.md
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - wi/work/reference/occ/planning.md
  - utopia-models/knowledge#9842 (VERIFY, criterion 6 FAIL)
  - utopia-models/utopia apps/web/lib/plan-registry.ts (`plansSource`)
```

# ADR-9930 — Production `/v1/board` reads the Plan issues by default; `PLANS_SOURCE=registry` is the flip back

## Context and Problem Statement

ADR-9840 shipped the board reader behind `PLANS_SOURCE=board|registry`, default `registry`, so the registry
and the Plan issues could run side by side before P7 retires the registry. Nothing ever set the flag in
production: the utopia Vercel project's env list has no `PLANS_SOURCE` (read 2026-10-23 through
`/v9/projects/utopia-models/env`). VERIFY #9842 graded Feature #9835's criterion *"WHEN the dashboard renders
planning sessions, THE SYSTEM SHALL read Plan issues from the board, including a last-active time no older
than 10 minutes for a live session"* against `https://www.utopiamodels.ai/v1/board`. It got
`{"plansSource":"registry","withLastActive":0,"n":385}` and failed the criterion. The reader existed only on a preview.

## Considered Options

1. **Do nothing / adjudicate the criterion wrong.** Rejected. The Feature says the dashboard reads the board.
   The P5 issue's "default `registry`" was a rollout step, not a counter-requirement, and Tyler looks at
   production.
2. **Set `PLANS_SOURCE=board` in the Vercel production env.** Rejected. The env needs a redeploy anyway, and it
   would hide the live source in off-git state. Nothing on the repo would say which reader production runs.
3. **Flip the code default (chosen).** `plansSource()` returns `registry` only for `PLANS_SOURCE=registry`.
   Unset or any other value reads the Plan issues. The flip back stays one env var plus a redeploy. The
   payload's `plansSource` field reports the live choice, so the probe is
   `curl -s https://www.utopiamodels.ai/v1/board | jq .plansSource`.

## Decision

- Default `board`, and only `registry` selects the registry. An unknown value goes to the board, so a typo
  cannot silently restore the old view.
- **Side by side** no longer means two production surfaces. `apps/web/scripts/plans-parity.ts` runs both
  readers against live GitHub. It is the instrument for P7's 7 days of parity, and it does not depend on which
  reader production serves. At flip time it read `registryInFlight 25 · boardInFlight 25 · missingOnBoard [] ·
  onlyOnBoard [] · identical 19 · withDifferences 6`. The differences are the writer heartbeat on 3 plans and
  the `Closed`→`Dispatched` fold on 3, the same ones listed in #9840's parity report.

## Consequences

- Tyler's Planning and Execution sections now show the cells ADR-9840 lists as dropped: steps 1–2 render
  `—`, and the PID, loop counter and `declared N · filed M` chip are gone. Executed and Archived history
  before 2026-10-23 is not shown (no Plan issue exists for it); those groups fill from here on.
- `dispatched` stays `—` until a writer posts the `▶` on a Plan issue at dispatch. ADR-9840 assigns that to P7.
- A plan opened outside `/plan-start` (no `planning` Plan issue) does not appear at all. `plans-parity.ts`
  reports it as `missingOnBoard`, and that is the check to run before P7.
