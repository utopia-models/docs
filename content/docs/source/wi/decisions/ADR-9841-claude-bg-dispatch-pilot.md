---
title: "ADR-9841 — `claude --bg` as the dispatch runtime: adopt with limits"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9841-claude-bg-dispatch-pilot.md"
updated: 2026-10-23
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9841-claude-bg-dispatch-pilot.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9841
adr_status: accepted
status: active
decision_date: 2026-10-23
supersedes:
superseded_by:
issue: 9841
subprocess: process
references:
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - wi/work/specs/plan-405-session-context-wiring/p6-claude-bg-pilot-results.md
  - _infra/scripts/dispatch.sh
  - _infra/scripts/task-runner.sh
  - https://code.claude.com/docs/en/agent-view
  - utopia-models/bg-pilot-9841 (throwaway pilot repo, PRs 5–8)
```

# ADR-9841 — `claude --bg` as the dispatch runtime: adopt with limits

## Context

PLAN-405 chose `claude --bg` (agent view, Claude Code's native background sessions) over
claude-code-action on a runner as the candidate replacement for the home-built dispatch runtime, and asked
for a pilot before anything changes. Today `dispatch.sh` launches each run as a `systemd-run --user`
unit (`task-<issue>.service`) wrapping `task-runner.sh`, which runs `claude -p … --max-turns`, announces ▶
and ✔/✘ on the issue, and checks the closing PR. Liveness is the unit's state (`live_units_for_issue`,
`fleet_units_for_issue`, `dedupe_issue_units`, the reaper's Doing→Todo reset).

## Evidence (full table: `p6-claude-bg-pilot-results.md`)

On `cloud@novaserver`, one login (`nova@utopiamodels.ai`, Max 20x), Claude Code 2.1.302, four sessions
launched 4 s apart, each in its own `-w` worktree, against four one-line issues on **adjacent lines of one
file** in a private throwaway repo:

- **4/4 merged** — PRs 5, 6, 7, 8 of `utopia-models/bg-pilot-9841`, each closing its issue; first merge
  72 s after the first launch (≈25 s of it supervisor start-up), last 115 s. Two sessions hit the squash-merge conflict and rebased correctly, one of
  them twice because main moved during its own resolve.
- **Per-session draw** (from each transcript): 6–11 turns, 1.1–2.2 k output tokens, 39–95 k cache-write,
  0.5–1.0 M cache-read; 7.0 k output and 3.16 M cache-read for all four.
- **Usage feed** five-hour 1 % → 9 %, seven-day 33 % → 34 % (19:20Z → 19:30Z). That delta is
  **not attributable**: the same login carried eight `task-*` dispatched runs and this session in the
  window. Account-level quota cannot be split per session; transcripts can.
- **No stall, no login expiry** — in a 101-second window, which proves nothing about either.
- **Friction found:** `--bg` refuses an untrusted directory from a script (trusted parent does not count;
  cleared only by writing `hasTrustDialogAccepted` into `~/.claude.json`); the isolated-worktree guard
  refuses `export GH_TOKEN=$(…)` and compound `bash` constructs (all four sessions recovered inline);
  completion is observable only by polling `claude agents --json --all`.

## Options considered

1. **Do nothing** — keep `systemd-run` + `claude -p`. Works today; costs ~5,000 lines of runner and
   liveness machinery the fleet maintains alone.
2. **Adopt `--bg` for run launch and liveness** (this decision, with limits).
3. **claude-code-action on a self-hosted runner** — rejected in PLAN-405 (spec "Decisions"); not reopened.

## Decision

**Adopt with limits.** `claude --bg` did the job a dispatched run does — read an issue, branch, push, open a
PR, resolve a real conflict, merge — four at once under one login, with no supervision. It is a credible
replacement for **run launch and liveness**. It is **not** adopted yet as the production runtime:
`dispatch.sh` stays the runtime until a real board issue merges through `--bg`, per the issue.

**What it would replace in `dispatch.sh` / `task-runner.sh`:**
- run launch: the `systemd-run --user --unit=task-<issue>` command lines and `launch_unit_script`,
  `fleet_claim_launch_script`, `launch_fail_report` → `claude --bg -w <issue> -n task-<issue> "<brief>"`;
- liveness: `live_units_for_issue`, `fleet_units_for_issue`, `dedupe_issue_units` and the unit probes the
  reaper reads → `claude agents --json --all` (`state` = `working|blocked|done|failed|stopped`);
- the per-run worktree setup, which `-w` does natively.

**What stays:** board filing (`file-issue.sh`), master picking (`sweep-dispatch.sh`, quota preflight,
duplicate preflight), the ▶ / ✔ / ✘ comments, the closing-PR and docs-only checks, and the brief text.
`--bg` has no notion of an issue, a board or a close-out; those were never the runtime's job.

**Limits that a production cut-over must answer first:**
1. **Research preview, per machine.** Agent view's interface may change; sessions live under one box's
   supervisor, stop on reboot (shown `failed`, resumable), and stop ~1 min after the supervisor dies unless
   one reconnects. `systemd-run` units have the same reboot property; the supervisor-death one is new.
2. **Login expiry turns a session `blocked`** ("an error only you can clear such as an expired login").
   Today the same expiry fails `claude -p` loudly and the runner reports it; under `--bg` something must
   read `blocked` and say so on the issue, or the run goes silent.
3. **Workspace trust** must be pre-seeded per directory by editing `~/.claude.json`, a file every live
   session on the box rewrites. The cut-over needs a safe way to do that, or a fixed trusted dispatch root
   if a future version honours trusted parents.
4. **Briefs must survive the isolation guard**: no `export` of a token, no compound shell wrappers.
5. **`--max-turns` is accepted but not enforced.** Measured: `claude --bg --max-turns 2` with a brief of
   five separate Bash calls ran all five and replied `done`. The runner's turn cap has no `--bg` equivalent
   today; a runaway session is bounded only by something running `claude stop <id>`.
6. **Untested at real length** — hour-long runs, the 1 h App token expiring mid-run, and quota exhaustion
   mid-session were out of this pilot's reach.

## Consequences

- `dispatch.sh` and `task-runner.sh` are unchanged by this decision (byte-identical to origin/main).
- The next step, if taken, is one real board issue dispatched through `--bg` on one box with a thin
  wrapper that posts ▶, polls `claude agents --json`, and posts ✔/✘ — the first merged PR from that is the
  trigger the issue names for retiring the unit-based launch.
- No plugin, hook or skill changed; nothing to deploy to the boxes.

## Corrections preserved

No process text was rewritten, so no 🔴 clause or measurement was retired. The limits above carry forward
two standing corrections: *silence is the only unacceptable state* (limit 2 — a `blocked` session must be
announced) and *a limit is a measurement* (limit 5 — the missing turn cap is recorded, not assumed safe).
