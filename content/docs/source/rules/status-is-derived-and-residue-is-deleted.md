---
title: "A status nobody derives is a label that stopped moving. Set the fields, post the close-out, delete the residue."
description: "Mirrored from the fleet knowledge base: _rules/status-is-derived-and-residue-is-deleted.md"
updated: 2026-08-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/status-is-derived-and-residue-is-deleted.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: status-is-derived-and-residue-is-deleted
cases: [2026-07-01-agent-blank-todo-when-empty, 2026-07-01-agent-field-at-filing, 2026-07-01-agent-remove-done-todos, 2026-07-01-dmv-close-out-comment-even-on-autoclose, 2026-08-01-step-8-of-9-is-not-a-status, prs-and-branches-accumulate-because-nothing-sweeps-them, 2026-08-10-there-is-no-deterministic-process-only-prompting, 2026-08-16-a-verification-report-goes-on-the-issue-not-the-repo-root, 2026-08-24-plan-invisible-in-occ-because-the-commit-never-left-the-box]
status: active
mechanism: stop-hook: a PR merged this turn whose branch still exists
audience: agent
last-recurrence: 2026-08-24
```

# A status nobody derives is a label that stopped moving. Set the fields, post the close-out, delete the residue.

## Fires when
Filing a board issue · finishing work · a TODO item completes · a branch or PR is left behind ·
about to write a step marker as if it were a status · **about to answer "where are we" from a doc, a
registry or a marker rather than from the board** · **about to let a write fail quietly and return
success** (a push, a stamp, a registry commit) · 🔴 **about to write a VERIFICATION REPORT to a
FILE** — it goes on the ISSUE that asked for it, or in the owning `<portfolio>/specs/<issue#>-<slug>/`.
**Never the repo root, never a new top-level `verifications/`.**

## The rule
Lane, Priority and Portfolio are set in the same pass that files the issue, never in a later sweep.
Post the close-out comment even when `Closes #N` auto-closed the issue — the board cannot otherwise
tell the work landed. Completed TODOs are removed, not ticked, and an empty TODO.md is blank. Sweep my
own PRs and branches; nothing else does.

**Derivation is only half of it — the derived thing has to be WHERE HE IS.** A step that is correct in a
registry, accurate in doctrine, and absent from the last line of the message is a step he cannot act on;
he substitutes manual prompting, and correctly reports that no process exists. State the step in the
turn, mark it `(claimed)` when nothing derives it, and never let a failed write report success — a
report can be lost in transit, which is the whole reason the step is derived in the first place.

🔴 **VERIFY THE SINK, NOT THE WRITE.** Reading back from where you just wrote confirms nothing —
for a plan entry the sink is `origin/main` (`git cat-file -e origin/main:<path>`), because the OCC
reads GitHub and holds no writable store. **A diverged branch is a P0 for that surface**: once
`origin/main...HEAD` shows commits on the left, every later plan write is already lost.

## Cost when it fired
*"STEP 8/9 · DISPATCHED"* sat on screen while nothing moved. 287 branches accumulated org-wide; 15 PRs
stacked up 2026-07-31 because "auto-merge armed" was treated as done. **`plan-registry.log`: 132 silent
`push failed (commit is local)` lines on 2026-08-10 — 141 by 2026-08-24**, nine of them *after* this rule
was written, with PLAN-219 sitting 29-ahead/80-behind, twelve successful local commits, nothing on the
remote. Tyler: *"What plan are you working on? I don't see an artifact for this."* **A correct rule in
loaded text did not change it; the log diagnosing it has no reader.**
