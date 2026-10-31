---
title: "The loop — how work happens"
description: "Mirrored from the fleet knowledge base: _process/the-loop.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/the-loop.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect, master, personal, alwayson]
```

# The loop — how work happens

**The one principle: no stored copies of state · no resident process for what already announces itself ·
docs are the config.** Anything that can drift is deleted, not monitored; anything unattended announces
itself where Tyler looks (the board), so silence cannot be mistaken for health.

A **PLAN** → a **Feature** issue with ordered **sub-issues** + a committed brief → the Architect
**dispatches** (starting the run IS the assignment) → a master **executes to merged+live** → **git moves
the board** → Tyler glances at truth.

## The three words

| layer | word | what it is | id |
|---|---|---|---|
| above the board | **PLAN** | one thinking session: the document, the artifact, the forks closed | `PLAN-89` |
| on the board | **Feature** | a body of shippable work with ordered children | `#4371` |
| on the board | **issue** | one dispatchable unit, run to a merged PR | `#4374` |

🔴 **"Task" is not one of the three** (#4642) — it named both the body of work and the leaf; it survives
only as GitHub's own issue TYPE. **A PLAN is not a Feature:** it references Features.

## The five steps

`1 BRIEF · 2 LOOP⟳ ‖ 3 FILE · 4 DISPATCHED · 5 DONE` — planning is `step < 3`.

| # | step | what it means |
|---|---|---|
| 1 | **BRIEF** | Tyler's rough note, restated. No research yet. |
| 2 | **LOOP** ⟳ | research ⇄ questions, repeating, until the plan is complete |
| 3 | **FILE** | ≥1 issue exists for this plan |
| 4 | **DISPATCHED** | a master is executing |
| 5 | **DONE** | every referenced issue CLOSED |

**Every step is DERIVED, never reported** (#4509, #4561): 3–5 from the board on every render, 1–2 from
event refs on the plan's entry. Nothing anyone writes advances a step — **a merged PR does**, by closing its
issue. Step 4 carries a MODE, neither value "blocked" (#4941): `DISPATCHED` (unattended) or
`EXECUTING (interactive)`. Stuck? Say what blocks you on the issue and stop cleanly.

Work that becomes a board issue lives on the board, never also in the harness's native task list (that is
for in-session work that never becomes an issue). Two trackers cannot both be true.

## Thick tasks (never work a thin one)
- The brief lives beside the work: `<portfolio>/work/specs/<issue#>-<slug>/spec.md` (objective ·
  acceptance · scope · grounding) + `plan.md` (phases → checkbox items).
- **plan.md checkboxes ARE the work state.** Tick `[ ]→[~]→[x]` and commit as you go; a context reset, peer
  takeover, or Tyler looking in all read the same file.
- A dispatched issue with dead prerequisites or no spec: STOP CLEANLY and say why on the issue — never
  churn a stale brief.
- **The issue body MUST contain the literal spec path** — the runner reads a spec only *"if it names one"*.

## Specs (what a master does with one)
Read the spec before building and **ground every reference in it THIS session** — a spec can cite dead
machinery in good faith.

Non-trivial architecture choices get a decision record in `<portfolio>/work/specs/<issue#>-<slug>/decisions/`
(`wi/work/specs/DECISION-TEMPLATE.md`), only when the choice is expensive to reverse or a future reader
will otherwise re-litigate it; otherwise the reasoning goes in the PR body or `plan.md`. Superseding one
edits the old record's `Superseded-by` header in the SAME commit — a silently-invalidated decision is the
fleet's most repeated failure.

## Runs (how you execute when dispatched)
- Started by `dispatch.sh` → `task-runner.sh`: your run already announced ▶ and will announce ✔/✘ + your PR
  link at exit. Nothing is resident between runs — liveness is your close-out comment.
- Ground first: repo root `CLAUDE.md` → the issue + its spec → the real files.
- Verify against reality before claiming done: build/run/curl/render whatever the acceptance names.
- 🔴 **A MECHANISM does not close on "the code is written".** A hook, guard, injector or unit is a claim
  about a POPULATION OF BOXES; the acceptance must NAME THE COMMAND that shows it running **on every box it
  claims to reach**, and the close-out must carry its output. `bash _infra/scripts/mechanism-liveness.sh
  <basename>` answers it for anything hook- or unit-delivered — **you run it; nothing runs it for you.**
  (#6449: four closed "wired · propagated · installed" issues had never executed on any box they named.)
  **Present is not wired, and wired is not run**: a hook wired this minute fires on the NEXT session. Where
  the mechanism leaves an artifact, grade the artifact.
- Finish = a PR whose body says `Closes #N`, **MERGED** — the merge closes the issue and moves the board.
  **Arming auto-merge is not finishing**: an open PR at exit means the work is not done, and the close-out
  must say so.
- 🔴 **A verification report goes on the ISSUE as a comment — never in a committed file.** When the run
  needs a diff to carry `Closes`, tick the matching box in the Feature's `plan.md` with a one-line verdict
  and a link to that comment. `wi/work/verification-reports/` is retired (234 files, 213 cited by nothing,
  #8566).
- 🔴 **A merge is NEVER a Tyler gate and never blocked by a check.** Branch protection + rulesets 403 on
  this plan tier. If a merge does not go through: read the REAL error, then `gh pr merge <n> --squash
  --admin`; if the branch conflicts, rebase. Escalating a merge ("needs eyes", "approve this", "should I
  force it?") is the banned move (Tyler, 2026-07-21: *"I am never responsible for merging PRs. A block =
  FIND THE PATH."*). A merge is git-reversible; an open PR is what costs.

## Comms (on the work item, nowhere else)
- Message another master by **@mentioning its GitHub account in a comment on the issue**; its next run
  receives unread mentions at start (durable read-state, at-least-once).
- Spec co-writing = comments + commits to the issue's `spec.md`. Presence is derived from observable work
  (last commit/comment), never self-reported.

## Gates (the complete list — ALL ADVISORY)
**No check is enforceable** (branch protection and rulesets 403 in every repo). Anything red, missing, or
never starting is INFORMATION, never a stop. **Fix-forward:** identify the REAL failure; a genuine problem
(broken build, real security issue) → fix and proceed; infrastructure down or transient → documented
fallback and proceed. Never wait for a human to unblock you.

| gate | real? | what to do |
|---|---|---|
| **`guard.yml`** (gitleaks secret-scan) | 🔴 **the ONE hard stop** — secrets in tracked files | Run it, read it. Cannot run? Scan locally with the version pinned in `guard.yml`. Clean → merge. Findings → fix, rescan, merge. |
| **A real build failing** (typecheck/test/deploy) | **YES** | Fix the code, never override. A lint on a title, filename or doc convention is **not** a build failure and never blocks a merge. |
| **Vercel `COMMIT_AUTHOR_REQUIRED`** | no | Read the error (`gh run view <run-id>`), recommit with an allowed author email or drop the requirement. Still blocked → `gh pr merge <n> --squash --admin`. |
| **`bash -n` syntax-guard** | no — syntax only | A PreToolUse hook denies edits leaving `hooks/*.sh`, `_infra/scripts/*.sh` or `.claude/scripts/*.sh` unparseable. **Read backwards from the reported line** — an unbalanced quote is reported at the next paren. |

### Forbidden gates
A gate that blocks on content keywords or a generated map is forbidden (it false-blocked docs and
auto-reverted its own cleanup, #1204).

**A resident process is forbidden for anything the board, a dispatch run, or a git event already
announces** — heartbeat polls and scheduled "health checks" included; the board IS the queue, and silence
is the failure mode (#3562). Permitted ONLY to observe an **external system that emits no signal we can
subscribe to**, where sub-poll-interval latency is the point; it must announce its own liveness where Tyler
looks and name in its own doc the external event it exists to catch. Sanctioned form: an `always-on-agent`
(ATS polling qualifies, nothing else does).

## The hard stop (the only one)
**Never write a secret into a tracked file.** Everything else proceeds autonomously,
fix-forward: code in git can be reverted, and what git cannot undo (a deploy, a migration, a sent message) is
fixed forward.
