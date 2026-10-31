---
title: "DR 2026-07-23 — The WIN Rebuild Architecture (ACCEPTED)"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-182-win-rebuild-architecture.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-182-win-rebuild-architecture.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-182
adr_status: accepted
status: active
decision_date: 2026-07-23
supersedes:
superseded_by: ADR-2026-07-31
issue: PLAN-182
references:
  - world-infrastructure/specs/3511-one-brain-shape/decisions/001-guards-are-advisory-not-required.md
```

🔴 **RESTORED 2026-09-24** (PLAN-313 P4). Deleted from disk in a KB reorg (`cdfea10e8`) while still
live-cited by `adrs: [182]` frontmatter across multiple components. Confirmed still relevant, not
historical prose: C3 (transient `systemd-run` dispatch, no resident processes) is verbatim what
`dispatch.sh`/`task-runner.sh` still do today and is the reasoning that made deleting the ttyd/
`claude-agent@` units correct this same session; C2/C5/C8 describe the files+git memory, symlinked
doctrine, and portfolio-first tree this repo still runs on. **Content below is verbatim from the
original 2026-07-23 record — not edited.** One known drift: C8 names `world-infrastructure/` as the
portfolio root; that directory has since been shortened to `wi/` (a rename, not a reversal of C8's
decision).

# DR 2026-07-23 — The WIN Rebuild Architecture (ACCEPTED)

**Status:** ACCEPTED (Tyler, 2026-07-23 — plan-mode approval, the explicit decision event).
**Immutable.** A change of mind = a NEW superseding record naming the new information — never an in-flight edit.
**C7 Superseded-by:** `world-infrastructure/specs/3511-one-brain-shape/decisions/001-guards-are-advisory-not-required.md`
(2026-07-31, #3514) — C7's `(guard.yml, **required**)` is not achievable on this plan tier: both
`/branches/main/protection` and `/rulesets` return 403. Guards are ADVISORY. **C1-C6 and C8 stand unchanged.**
**Full working plan (options, inventory, migration):** a private working document (`playful-purring-sunrise.md`),
no longer in the tree since the plan documents were deleted with the plan registry (ADR-10109). This record keeps
the decisions; the rejected alternatives are not reproduced here.

## Context

Masters completed ~20% of delegated work. Root causes (10-workflow inventory, 2026-07-23): no grounding
(masters can't orient in a portfolio), thin tasks (titles, not briefs), and a board that lies (manual status).
Deeper: the fleet's custom machinery (~1,000 scripts, 180+ hooks, 21 CI gates, 3 memory systems, 5 comms
generations) rots silently, and its detectors hardcode the same stale assumptions as the docs — the fleet cannot
see its own drift. Tyler's #1 time-sink was repairing the machinery, which falsifies the 1000x thesis.

**Goal:** Tyler + fleet execute at 1000x speed while Tyler is present (phone, 8-10h/day).
**Non-goals (the scope fence):** walk-away autonomy · new revenue features inside the rebuild · multi-human
scaling. Cost is a soft consideration, not a driver.

## The Decisions (per component; alternatives + rejection reasons were recorded in the private plan file)

- **Principle:** no stored copies of state · no resident processes · docs are the config (read at runtime).
  Drift classes are removed, not monitored. *(1-way door in spirit — reversing this recreates the disease.)*
- **C1 Work system:** native GitHub Feature + ordered sub-issues; the full brief in committed `spec.md` +
  `plan.md` beside the work; plan.md checkboxes ARE the work state; merged PR (`Closes #N`) closes the issue and
  moves the board — status is derived, never typed.
- **C2 Memory:** files + git only. All three memory services (Cognee, mem0+Qdrant, SQLite second-brain) are
  deleted. Auto-memory points at a git-synced dir; one append-only decisions file. (Corpus measured 360KB — three
  orders below where vector/graph earns its cost; every credible fleet uses files+git+issue-tracker.)
- **C3 Runtime:** pure on-demand dispatch. No resident agent processes. Dispatch = a transient `systemd-run` unit
  running `task-runner.sh` (▶ comment → `claude -p` under the master's own Max OAuth → trap-EXIT ✔/✘ comment).
  ralph + watchdogs + heartbeats deleted. Routines revisited when out of research preview.
- **C4 Comms:** GitHub-native — issue comments + @mentions on the work item; receive = a mentions query injected
  at run start (durable read-state, at-least-once). NATS stack deleted. (The bus as wired was discarding mail
  inside a >/dev/null health probe.)
- **C5 Doctrine:** prose doctrine lives IN the knowledge repo; each master's `~/.claude/rules/` is a symlink into
  its clone (doc/config drift structurally impossible); rules slim 380K → ~50K behavioral core; the plugin
  shrinks to hooks-only (SHA-pinned code).
- **C6 Surfaces ("one reading, no publishers"):** every Tyler surface (OCC · board · dmvresearch.shop ·
  raw.utopiamodels.ai · RAW phone · Drive) reads its source live at view time or IS the source. Upstash + all
  publisher crons deleted; liveness derived from observable work, never self-reported; two failure-only smoke
  Actions whose only output is a board issue; RAW phone = raw.utopiamodels.ai as PWA + Tailscale/Taildrop.
- **C7 Gates:** minimal — fail-closed only for stable invariants: gitleaks secret-scan + binary-guard
  (`guard.yml`, required) + CI-green where a real build exists. ONE PreToolUse survivor (hook-syntax-guard). One
  daily advisory lint upserting a single drift issue. ~19 of 24 workflows + all content gates deleted.
- **C8 Knowledge repo:** portfolio-first tree (world-infrastructure/ raw/ dmv/ govcon/), each rooted by a
  portfolio CLAUDE.md map; specs beside the work; aggressive prune (git history is the archive).

## Consequences

- The fleet is rebuilt by strangler-fig (M0-M8 in the plan file): guards first, dispatch proven on one master
  before ralph dies anywhere, each OCC section dual-run before its publisher dies, the one 1-way door (Hetzner
  box deletion) gated on a snapshot + 7 quiet days, and a DATED old-system-deletion milestone.
- Success metrics: dispatched-work completion >80% over the first 10 dispatches · Tyler stops filing
  fleet-repair issues · zero silent-death incidents · prefix 380K→~50K · scripts ~1,000→<100 fleet-wide.
- The planning method itself (phases, options-before-decision, decisions-lock-via-event, ceremony-by-
  reversibility, never-big-bang) is now the standing process for org-wide changes.
