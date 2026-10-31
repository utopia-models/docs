---
title: "ADR-9840 — The OCC reads Plan issues into the registry's row shape, behind `PLANS_SOURCE`, and the in-flight plans are backfilled as Plan issues"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9840-the-dashboard-reads-plan-issues-behind-a-flag.md"
updated: 2026-10-23
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9840-the-dashboard-reads-plan-issues-behind-a-flag.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9840
adr_status: accepted
status: active
decision_date: 2026-10-23
decision-makers: [cloud]
consulted: []
informed: [agent, tyler-youk]
supersedes:
superseded_by: ADR-9930 (the `PLANS_SOURCE` default only — production reads the board)
issue: 9840
subprocess: process
references:
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - wi/decisions/ADR-9839-the-plan-issue-is-the-only-record.md
  - wi/work/reference/occ/planning.md
  - _infra/scripts/plan-issue-backfill.py
  - utopia-models/utopia#594 (apps/web/lib/plan-registry.ts, lib/occ-registry.ts, app/v1/board/route.ts, packages/occ-ui PlanCells.tsx · planStatus.ts, scripts/plans-parity.ts)
```

# ADR-9840 — The OCC reads Plan issues into the registry's row shape, behind `PLANS_SOURCE`, and the in-flight plans are backfilled as Plan issues

## Context and Problem Statement

ADR-9839 made the Plan issue (label `planning`, opened by `/plan-start`) the only record of a planning session.
The OCC's Planning and Execution sections still read the plan registry (`wi/work/plans/entries/`). Before the
registry can be retired (P7), the dashboard has to render the same plans from the board, and the two views have
to be compared side by side. On 2026-10-23 the registry held 385 entries, and 26 were in flight on the live
`/v1/board` (17 Dispatched · 5 Parked · 4 Planning; the spec counted 42 on 2026-10-22).

## Considered Options

1. **Do nothing.** The dashboard keeps reading the registry. Rejected: the spec's acceptance requires the
   dashboard to read Plan issues, and P7 cannot start without a parity measurement.
2. **A new board-specific component tree and payload.** Rejected: two renderers for one surface, and every
   honesty rule in `planStatus.ts` (declared vs derived, the empties) would have to be written twice.
3. **Cut over without a flag.** Rejected: there would be no side-by-side period and no rollback short of a revert.
4. **Integrate existing (chosen):** a second reader that turns Plan issues into the same `PlanEntry` the registry
   reader produces. `PLANS_SOURCE=board|registry` (default `registry`) picks the reader in `/v1/board`. Every
   component and every derivation stays as it is.

## Decision

- **The mapping** (`planEntryFromIssue`, utopia `apps/web/lib/plan-registry.ts`):
  - **id:** `registry: PLAN-N` in the body, else `#<issue>`.
  - **created:** `created:` in the body, else the issue's `createdAt` in America/Denver (the zone `created_date` uses).
  - **dispatched:** the first comment that opens with `▶`. A `dispatched yyyy-mm-dd HH:MM` inside it wins over
    the comment's own time.
  - **status:** label `parked` → Parked · closed NOT_PLANNED → Archived · closed otherwise → Executed · open with
    Features or a `▶` → Dispatched · otherwise Planning.
  - **Features:** the Plan issue's sub-issues plus the refs on a `Features:` body line.
  - **plan ↗:** `Document:` in the body, else the `Spec:` path that `plan-open.sh` writes.
  - **artifact:** every claude.ai artifact URL in the body.
  - **mode · portfolio:** the board fields, with the body's meta line as the fallback.
  - **Last active:** feeds both `lastSeen` and a new `lastActive`.
- **Live:** a row is tagged `● live` when its Plan issue's `Last active` is at most 10 minutes old.
  `plan-stamp.sh` writes it at most once per 180 s while a session works, so a working session cannot fall
  behind the line. Only board rows carry `lastActive`, so the registry view is unchanged.
- **Dropped, named instead of hidden:** steps 1–2 and their condition sub-line (`brief:`, `agent:`, `asked:`),
  the loop counter (`stepcycle:`), the claude PID (`pid:`) and the declared phase count (`phases:`). No
  Plan-issue writer records them. A board Planning row renders `—` for its step, never a guessed one.
- **Backfill** (`_infra/scripts/plan-issue-backfill.py`): one Plan issue per in-flight plan, using `liveStatus()`
  mirrored from the OCC. It carries the meta line, `registry:`, `created:`, `Document:`, `Artifact:`,
  `Features:` and `## Parked`. Its board fields are Portfolio · Mode · Recipe (the entry's `subprocess:`) ·
  Last active (the entry's `seen:`), plus Lane `agent` and Status Todo, as `plan-open.sh` sets them. The script
  is idempotent on `registry: PLAN-N`. It ran 2026-10-23: #9887–#9914, 26 issues.
- **Features are LISTED, not re-parented**, in the backfill. A sub-issue link would place each chain under
  `stuck-pr-sweep.yml`'s Feature-autoclose (a Parked plan whose Features are all closed would be closed as
  complete) and under sweep-dispatch predicate 3, which changes 26 live chains for no reading benefit. The
  reader still accepts sub-issues, which are the native link for Plan issues filed from now on.

## Consequences

- `scripts/plans-parity.ts` in utopia is the instrument for the 7-day side-by-side period before P7. Run it as
  `GITHUB_TOKEN=$(gh auth token) npx tsx --tsconfig apps/web/tsconfig.json apps/web/scripts/plans-parity.ts`.
- **No writer posts a `▶` on a Plan issue at dispatch yet.** `dispatch.sh` stamps the registry's `updated_date`
  only, and none of the 26 in-flight entries carries one, so both views read "dispatched —" today. A plan
  dispatched from now on shows its dispatch date on the board only once something posts that comment. That
  writer belongs with P7, beside the registry writes it replaces.
- **A session on a backfilled plan stamps `Last active` only after `/plan-continue <issue#>` binds it.** Until
  then the registry's `seen:` keeps moving and the board's does not. This is the `updated` difference the
  parity report lists for three plans.
- Plans that finished before 2026-10-23 have no Plan issue. The board view's Executed and Archived groups start
  empty and fill from here on.
