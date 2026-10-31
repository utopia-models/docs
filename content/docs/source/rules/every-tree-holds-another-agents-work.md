---
title: "Every working tree holds another agent's uncommitted work. Branch first, never `reset --hard`."
description: "Mirrored from the fleet knowledge base: _rules/every-tree-holds-another-agents-work.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/every-tree-holds-another-agents-work.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: every-tree-holds-another-agents-work
cases: [2026-07-01-agent-always-add-all, 2026-07-01-agent-never-reset-hard-dirty-tree, 2026-07-01-agent-sync-with-ff-only-never-reset-hard, 2026-07-01-dmv-verify-branch-in-commit-command, 2026-08-01-agent-feature-branch-at-start, 2026-08-01-agent-no-second-shell-assumption, 2026-08-01-agent-spec-creates-branch, 2026-08-01-dmv-check-shared-clone-dirty-before-writing, 2026-08-01-dmv-check-sibling-branches-before-fixing, 2026-08-09-a-silent-failure-path-is-worse-than-a-missing-one, 2026-08-09-i-am-not-a-master-agent-and-tyler-is-not-waiting, 2026-08-10-tyler-runs-four-shells-not-one, 2026-08-28-an-edit-from-a-stale-base-silently-reverts-the-fix, 2026-10-04-stash-and-rebase-in-the-shared-knowledge-clone, 2026-10-16-check-the-asset-against-tylers-source-and-cd-into-the-worktree-in-the-same-chain]
status: active
mechanism: pretooluse: git reset --hard | git stash in a clone with >1 known writer
audience: all
last-recurrence: 2026-10-16
```

# Every working tree holds another agent's uncommitted work. Branch first, never `reset --hard`.

## Fires when
About to `git reset --hard`, `git stash`, sync a branch, stage by filename, or write into a shared clone — and any time work starts on `main`/`dev` instead of a feature branch. Also when explaining an unfamiliar diff as "left over from a previous session".
🔴 **The same applies to a LINE.** Editing a shared file from the version in my head reverted a peer's fix (`18f8c91` restored a jq filter `dd090a6` had removed); a `sed` on a stale pattern and on the current line look identical, and fixtures for THIS change are blind to what it also did. Re-read the exact region immediately before rewriting, `git diff` the hunk asking *what else did I change*, read the file's recent commit MESSAGES. A live mechanism armed from pre-fix text keeps the bug.

## Trigger detail (full text — kept out of the always-loaded bundle)
About to `git reset --hard`, `git stash`, sync a branch, stage by filename, or write into a shared
clone — and any time work is starting on `main`/`dev` instead of a feature branch. Also any time I am
about to explain an unfamiliar diff to myself as "left over from a previous session".

🔴 **AND THE SAME RULE APPLIES TO A LINE, NOT ONLY TO A TREE** (2026-08-28). Editing a shared file
from the version in my head silently reverted a peer's fix: `18f8c91` rewrote a jq expression to add a
glyph and carried back a `select(.author.login != "kxagent")` filter that `dd090a6` had deliberately
removed, because my memory of the line predated theirs. **A `sed` that matches a stale pattern and one
that matches the current line look identical in their output**, and fixtures written to prove THIS
change are structurally blind to what the change also did. Re-read the exact region immediately before
rewriting it, `git diff` the hunk to ask *what else did I change*, and read the recent commit MESSAGES
on that file first — `dd090a6`'s said exactly what the filter breaks. **And a live mechanism armed
from pre-fix text keeps the pre-fix bug**: the running copy does not update itself.

## The rule
🔴 **Tyler runs 2–4 concurrent Architect sessions as his normal working style** (his words, three times
in five days: *"I have 4 shells open and I am planning and executing with all"*). Assume N live
sessions in every shared clone. A file I did not write is **another live shell's work**, not residue —
the opposite default, from a narrow 2026-05-22 correction, was wrong for three months and pointed at a
`/second-shell` skill that has never existed.

Create and check out the feature branch myself at the start of work, and again when I spec something
new. Sync with `merge --ff-only`; `reset --hard` silently discards a concurrent master's WIP and
untracked files. **Never `git stash` in a shared clone** — the stash stack is global, so one shell pops
another's work into its tree. `git add -A` so Tyler's parallel edits ride along. Before writing into a
clone with no per-run worktree, read `git status` and `git branch -vv` — a sibling dispatch may already
be mid-fix. A checkout in one Bash call may not still be HEAD in the next, so verify the branch in the
same command that commits.

**Session identity is `$CLAUDE_PID`**, exported into every child process. When something must be
attributed to *this* shell, key it on that — never on recency, proximity, or "the newest thing".

## Cost when it fired
The author of the `never-reset-hard-dirty-tree` rule broke it on 2026-07-07: `git reset --hard
origin/main` on the knowledge clone wiped an untracked `FEEDBACK/` directory that had never pushed.
Nine cases across agent, dmv and cloud.
