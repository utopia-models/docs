---
title: "ADR-9839 — The Plan issue is the only record of a planning session; one loop hook reads the card"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9839-the-plan-issue-is-the-only-record.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9839-the-plan-issue-is-the-only-record.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9839
adr_status: accepted
status: active
decision_date: 2026-10-23
supersedes:
superseded_by:
issue: 9839
subprocess: process
references:
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - wi/decisions/ADR-9837-plan-start-loads-one-project.md
  - wi/decisions/ADR-9838-docs-follow-code-through-claude-code-action-and-a-close-out-hook.md
  - _process/steps/2-loop.md
  - _process/steps/plan-start-frame.md
  - _infra/scripts/file-issue.sh
  - utopia-models/fleet-plugins (fleet-doctrine 0.94.0 scripts/plan-open.sh, plan-stamp.sh, plan-loop.sh, skills/plan-continue)
  - utopia-models/brain-agent (skills/plan-continue → skills/plan-continue-registry)
```

# ADR-9839 — The Plan issue is the only record of a planning session; one loop hook reads the card

**Status note (2026-10-31):** when this was decided the plan registry still ran beside the Plan issue (see
Decision and Consequences, "until P7"). ADR-10109 (decided 2026-10-25) completed that
retirement, and from then on the Plan issue is the only record.

## Context

A planning session left its record in the plan registry (`wi/work/plans/entries/` + a document, written by hooks
and CLIs on whichever box planned). Measured for PLAN-405 (2026-10-22): 190 plans in 60 days, 54% archived, 48
archived plans had no issue at all, 42 in flight — a second tracker beside the board, and the dashboard could not
see a planning session from the board. P2 (ADR-9837) gave every /plan-start session a state file
`~/.claude/state/plan-issue/<sid>` with project, mode and recipe; this phase fills in the issue.

The step-2 loop was read by three hooks (385 lines): `posttooluse-ask-loop.sh` (research-then-ask after an answer),
`posttooluse-step2-exit.sh` (the exit click, plus a marker for the Stop gate) and `pretooluse-exit-card-guard.sh`
(an exit option never shares a card with content), backed by `stop-no-permission-ask.sh` rule 2, which blocked a
planning turn that ended without a card. Tyler, 2026-09-29: *"The stop hook gate gets annoying honestly, want a
different solution."*

Measured 2026-10-23 on cloud@novaserver: `createProjectV2Field` works with the fleet token (fields `Mode`,
`Recipe`, `Last active` created); `POST /orgs/utopia-models/issue-types` also works (type `Plan` created — the
spec's note that it 404s for lack of `admin:org` no longer holds); GraphQL budget 5,000/h.

## Options considered

1. **Do nothing** — keep the registry as the record. Rejected: it is the second tracker the spec removes, and the
   dashboard (P5) cannot read a planning session from the board.
2. **A Plan issue filed through `file-issue.sh`** — Rejected: `file-issue.sh` (183 KB) validates TASKS (lane,
   spec path, chain shape, collision check) and files nothing without them; a Plan issue has no spec yet when it is
   opened. Its field ids are recorded there; the writer is a separate CLI.
3. **A GitHub Discussion or a Projects draft item** — Rejected: drafts cannot carry comments, sub-issues or a
   `Closes`, and no reader on the fleet reads discussions.
4. **Integrate existing: one issue per session in `utopia-models/knowledge`, the board's own fields, the plugin's
   hooks** — CHOSEN.

## Decision

- **Board fields, ADDED** (Portfolio and Sub-Project untouched): `Mode` single-select (interactive, dispatch),
  `Recipe` text, `Last active` text (ISO-8601). Ids recorded in `_infra/scripts/file-issue.sh`; `plan-open.sh`
  resolves them live by name and refreshes `~/.claude/state/board-fields.json` on each box it runs on.
- **`plan-open.sh open`** (fleet-doctrine 0.94.0), the first action of /plan-start after LOAD: an issue in
  `utopia-models/knowledge` with type `Plan` (best-effort) and label `planning` (what every reader keys on), body =
  brief + `project: · mode: · recipe:` + the spec path; on the board Portfolio · Mode · Recipe · Last active, and
  **Lane `agent` + Status Todo**, because lane `agent` is routed by no sweeper (`sweep-dispatch.sh` predicate 2)
  and is reported `dead-lane` only when another issue is blocked on it — a Plan issue is never dispatched (and
  since #9963 the `planning` label is itself a sweeper HOLD_LABEL: a Plan issue opened with no fields set had a
  blank, routable Lane and was dispatched). It
  publishes `<project>/work/specs/<issue#>-<slug>/{spec,plan}.md` skeletons through `plan-registry-publish.sh` (an
  ephemeral worktree, never a commit in the shared clone) and merges issue, repo, item_node_id, `loop: open`,
  last_stamp_epoch into the state file.
- **`plan-stamp.sh`**: async on UserPromptSubmit, PostToolUse and Stop (a Stop-only stamp goes dark on an
  interrupt). One `[ -f ]` for every session without a Plan issue. The slot is CLAIMED (`last_stamp_epoch`
  written under flock) BEFORE the GraphQL write, so concurrent fires cannot stampede. 180 s → about 25 writes an
  hour for 4 sessions × 150 turns.
- **`plan-loop.sh`** replaces the three hooks: PreToolUse denies the mixed exit card; Post/PostFailure, while the
  loop is open (the state file without `loop: closed`, or the old ask-loop flag under a recorded `interactive`),
  injects research-then-ask on a non-exit answer, and on an exit writes `loop: closed` and says file (or produce)
  now. `stop-docs-sync.sh` (ADR-9838) already reads `loop: closed`.
- **Stop rule 2 is deleted.** Rule 1 (the permission-ask) and its guards stay.
- **`/plan-continue [issue#]`** is a plugin skill: `plan-open.sh resume` reads Mode · Recipe · Portfolio off the
  board item, runs the same LOAD as /plan-start, and prints `plan.md` and the last comment — no registry read.
  Parked = label `parked` with the condition in the body; archived = closed as not planned. The registry loader
  is renamed `/plan-continue-registry` in brain-agent (a same-named user skill shadows the plugin skill, measured in
  ADR-9837) and kept for plans that predate their Plan issue, until P7.
- **Side by side:** the registry is still written by every hook that wrote it; nothing in it is deleted here.

## Corrections preserved, and the ones retired

Preserved in `plan-loop.sh` (and graded in fleet-doctrine `test/hook-integrity.sh` G4/S4/S5, `test/ask-loop.sh`):
- 🔴 read `tool_response.answers` and NOTHING else — `questions` echoes the exit (the live 2.1.241 false-positive control);
- 🔴 the exit predicate is `file` AND `step 3` (or "produce now"), never an equality — the typed sentence and the click share it; "looks good" / "nice" / "yes" are not it;
- 🔴 the click never advances the step — it writes no registry reference;
- 🔴 the Post side never denies and never blocks; every failure path is silent, exit 0;
- 🔴 a card that returns `{}`, or fails other than by the model's own `InputValidationError`, CLOSES the loop and writes the `.no-ask` tombstone (#9522); a "no questions" tombstone silences the hook;
- 🔴 the old flag counts only under a RECORDED `interactive` (the injector's predicate, #8499);
- 🔴 an exit lives only on a single-question card whose other options stay in the loop; the deny never rewrites the card; `onFailure: block` kept;
- 🔴 research lands before the next card (case 2026-10-20-answer-then-wait-for-research-before-asking) — the injected text is unchanged.

Changed: the state-file path opens the loop in EITHER mode (case 2026-10-17-research-and-questions-are-step-2-in-both-modes —
the old flag was interactive-only); a "produce now" press now says so once instead of emitting nothing.

Retired with Stop rule 2 (knowledge#5344) — each was a correction to that rule, so none has a subject left:
the step derived from the registry on every fire (never a sidecar); the `entry:` id binding and its degraded-path
notice (#5749, #5775); the three terminal statuses Archived · Parked · Executed (#7119 — still enforced in the
injector and the artifact advisory); the recorded mode outranking the document's `**Mode:**` header (#8499); the
30-minute bound on the exit marker and the `step2-exit/<sid>` marker itself (#6932); the ⟳/fork-number loop marker
in the block reason (#6588 — still in the injector). Kept from that file: the research-in-flight stand-down
(it applies to rule 1 too), the 8-block fail-safe guards, dedupe and staleness.

## Consequences

- A planning session is on the board the moment its three answers land, with a `Last active` no older than 180 s
  while it works — P5's dashboard reads that instead of the registry's `seen:`.
- Nothing forces a card at the end of a planning turn any more; the order to ask comes from `plan-loop.sh` after
  each answer and from the per-turn injector. If turns start ending on reports mid-loop, fix the injection, not a gate.
- Two records exist side by side until P7 (registry retirement, after 7 days of dashboard parity).
