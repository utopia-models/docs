---
title: "Floor 1 — the plan lifecycle"
description: "Mirrored from the fleet knowledge base: _process/floor/lifecycle.md"
updated: 2026-10-25
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/floor/lifecycle.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect]
load: floor
```

# Floor 1 — the plan lifecycle

**One principle: no stored copies of state · no resident process for what already announces itself · docs
are the config.** Anything that can drift is deleted, not monitored; anything unattended announces itself
on the board, so silence cannot pass for health. A resident process only watches an external system that
emits no signal (an `always-on-agent`) and announces its own liveness.

## Words and steps
**PLAN** (one thinking session, `PLAN-N`) → **Feature** (shippable body, ordered sub-issues) → **issue** (one
dispatchable unit, run to a merged PR). "Task" is not one of the three; a PLAN references Features.

`1 BRIEF · 2 LOOP⟳ ‖ 3 FILE · 4 DISPATCHED · 5 DONE` — planning is `step < 3`. Every step is DERIVED, never
reported: 3–5 from the board, 1–2 from event refs. A merged PR advances a step by closing its issue. Step 4
is `DISPATCHED` or `EXECUTING (interactive)`, never "blocked". Step files: `_process/steps/`, read by
`/plan-start` and `/execution-start`. 🔴 **Planning-shaped work loads the frame — the work is the trigger,
not a typed command**: before the first research subagent or `specs/` write, load `plan-start` and read
`1-brief.md` in full. 🔴 **The plan exists before the work does** — a `PLAN-N` before the first research
subagent, filing, or a review document (`_rules/the-plan-exists-before-the-work-does.md`).

## Modes (ADR-7781)
Exactly two: `dispatch` (masters execute; my involvement ends at dispatch unless the bound subprocess says
`monitor: yes` — READ that frontmatter, never ask) and `interactive` (Tyler and I run it in-session; that is
not "blocked"). `interactive` is the whole name — never `needs-tyler`/`manual`. `/plan-start` writes it to `~/.claude/state/plan-issue/<session-id>` and the Plan issue's `Mode` field. Subprocesses live in `<project>/subprocesses/<mode>/<id>.md`.
🔴 **Read the injected `[session] … mode=…` line first**: on dispatch the loop ends at dispatch; on interactive I execute
it myself (`_rules/dispatch-is-the-end-of-my-involvement.md`).

## The plan document (step 2 builds it)
Sections in order: **Current State** (first; gates the rest) → **After State** (once Tyler settles 1) → a
custom section ONLY if Tyler names it → **The phases** (LAST, empty until 1–2 are verified) → **Session
Record** (written continuously). 🔴 A section he did not ask for is work he must find and cut. Declare his words on the tag: `data-requested="…"`, `data-verified="yes"`.
🔴 **A closed fork rewrites every artifact that stated the old answer** before the next section is written
(`_rules/a-closed-fork-rewrites-what-it-invalidated.md`). 🔴 **UI work: the artifact IS the interface**, built
and iterated to sign-off before dispatch; the mockup ships in the first publish
(`_rules/ui-work-is-reviewed-in-the-artifact-before-dispatch.md`).

## Filing
Thick tasks only: `<project>/work/specs/<issue#>-<slug>/spec.md` (objective · acceptance · scope · grounding)
+ `plan.md`, whose checkboxes ARE the work state. The issue body carries the literal spec path. ADRs only
when the choice is expensive to reverse or will be re-litigated (`wi/work/specs/DECISION-TEMPLATE.md`);
superseding one edits the old record's `Superseded-by` in the same commit.
🔴 **Every blocker is resolved at planning time — a master is never blocked**; on `--chain`/`--wave` read
each phase's file list and ask WHICH REPO, then check push access
(`_rules/resolve-blockers-at-planning-time.md`).

## Execution and done
`dispatch.sh` → `task-runner.sh` posts ▶ and ✔/✘ + PR. Finish = a PR with `Closes #N`, MERGED; armed
auto-merge is not finished.
🔴 **THE MERGE RULE (stated once, here):** nothing gates main (branch protection and rulesets 403). A red
or missing check is information. Blocked → read the real error → `gh pr merge <n> --squash --admin`;
conflicted → rebase. Never ask Tyler to merge, approve or deploy (*"I am never responsible for merging
PRs. A block = FIND THE PATH."*) — `_rules/verified-work-goes-to-main-and-i-never-ask.md`. Only the secret
scan (`guard.yml`) stops a merge; a real build failure is fixed, never overridden.
🔴 **A mechanism closes on its population**: name the command that shows it running on every box it claims
(`_infra/scripts/mechanism-liveness.sh <basename>`); present is not wired, wired is not run (#6449).
🔴 **Done is a claim about the ARTIFACT**, never the build: exercise it, look at visuals, never relay a
script's or subagent's self-report; deliver the media type asked for (a video ask gets playable files); a site passes the site-audit in WebKit at phone + desktop with every CTA
clicked (`_rules/done-means-the-artifact-was-exercised.md`).
🔴 **Status is derived and residue is deleted**: set fields at filing, post the close-out, answer "where are
we" from the board, never let a write fail quietly; a verification report goes on the ISSUE, never a file
(`_rules/status-is-derived-and-residue-is-deleted.md`).
Gates are advisory except the secret scan; a blocking gate is for a stable invariant only, conventions get
linters, and a banned-word check is never the fix (`_rules/gates-are-for-invariants-conventions-get-linters.md`).
