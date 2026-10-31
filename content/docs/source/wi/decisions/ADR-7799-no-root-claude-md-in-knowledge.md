---
title: "The knowledge repo has no root `CLAUDE.md` — every agent loads only its own class bundle"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-7799-no-root-claude-md-in-knowledge.md"
updated: 2026-09-13
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-7799-no-root-claude-md-in-knowledge.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-7799
adr_status: accepted
status: active
decision_date: 2026-09-13
supersedes:
superseded_by:
issue: 7799
subprocess: process
references:
  - wi/work/specs/7799-masters-stop-loading-architect-bundle/spec.md
  - wi/work/research/2026-09-13-plan-267-the-remaining-16-workflows-verdicts.md
  - _infra/scripts/kb-lint.py
  - _infra/scripts/task-runner.sh
  - _process/north-star.md
```

# The knowledge repo has no root `CLAUDE.md` — every agent loads only its own class bundle

Produced by the **`process`** subprocess (`wi/subprocesses/dispatch/process.md`): it changes what a
dispatched run loads and what `task-runner.sh`'s brief tells it to read — the execution path itself.
Filed from #7788 (PLAN-267 P7), the ADAPT verdict on the OSS-tools / AGENTS.md slice. Parent Feature
`#7781`.

## Context

`#7316` (PLAN-256 P3, 2026-08-31) made the repo-root `CLAUDE.md` one line,
`@_process/_generated/bundle-architect.md`, and fixed the root at exactly three files in `kb-lint.py` R1.
Claude Code loads the `CLAUDE.md` in the working directory and every directory above it, and
`task-runner.sh` runs `claude -p` inside a `knowledge` per-run worktree. So every master run in this repo
loaded the Architect's bundle on top of its own.

Measured 2026-09-13, before this change:

```
$ readlink -f ~/.claude/rules/bundle.md          # on each box
win    /home/win/dev/utopia-models/knowledge/_process/_generated/bundle-master.md
nova   /home/nova/dev/utopia-models/knowledge/_process/_generated/bundle-master.md
cloud  /home/cloud/dev/utopia-models/knowledge/_process/_generated/bundle-master.md
dust   /home/dust/dev/utopia-models/knowledge/_process/_generated/bundle-master.md
kxdev  /home/kxdev/dev/utopia-models/knowledge/_process/_generated/bundle-architect.md

$ wc -c _process/_generated/bundle-architect.md _process/_generated/bundle-master.md
 64618 bundle-architect.md
 26550 bundle-master.md

$ cd <knowledge per-run worktree on win> && claude -p 'Print verbatim every line … "**Loaded by:**"' --max-turns 1
**Loaded by:** win · nova · cloud · dust — executes a filed issue.
**Loaded by:** the Architect (`agent`) — plans with Tyler, files, dispatches.

$ ssh kxdev@eth 'cd ~/dev/utopia-models/knowledge && claude -p <same> --max-turns 1'
**Loaded by:** the Architect (`agent`) — plans with Tyler, files, dispatches.

$ cd <detached knowledge worktree at 0854e244a on win> && claude -p /context --max-turns 1   # Memory Files
| User    | /home/win/.claude/CLAUDE.md                                                  | 1.1k  |
| User    | /home/win/dev/utopia-models/knowledge/_process/_generated/bundle-master.md   | 10k   |
| Project | <worktree>/CLAUDE.md                                                         | 22    |
| Project | <worktree>/_process/_generated/bundle-architect.md                          | 24.3k |
```

🔴 **Grade this with `claude -p /context`, not a "print the lines" prompt.** The Architect box's harness
refused the verbatim-print prompt 3 times in 4 on 2026-09-13 (reading it as a system-prompt dump) and
once answered `A=NO` to a yes/no variant while the same prompt from `~` answered `A=YES`. `/context`'s
*Memory Files* table is emitted by the harness, not the model, and does not vary.

Two facts follow. **The import added nothing for the Architect** — its box already loads
`bundle-architect.md` through `~/.claude/rules/bundle.md`, and its read-back prints the line once. **On
every master it added 64,618 B** of `audience: architect` doctrine to a 26,550 B bundle, ~91 KB against
the 30,000 B master ceiling — the widening `_process/north-star.md` forbids (*"Do not widen this
audience"*). `process-build.py` measures only `~/.claude/rules/*.md`, so its ceiling check could not see
it.

Beside it, `task-runner.sh` resolved `$CLONE/<portfolio>/CLAUDE.md` into the brief (#6443). That file
exists for 0 of 6 portfolios (`ls {wi,raw,dmv-research,5am,govcon,sf}/CLAUDE.md`), so the block never
fired, and both briefs opened with *"Read the repo root CLAUDE.md"* — a pointer at the import.

## Considered Options

* **Do nothing.** Rejected: ~91 KB on every master run, against a ceiling the build enforces on a
  different path.
* **AGENTS.md at the root.** Rejected: *"Claude Code reads `CLAUDE.md`, not `AGENTS.md`"*
  (code.claude.com/docs/en/memory); one harness means no second reader. 0 of 22 org repos carry one.
* **Keep a root `CLAUDE.md` with repo-wide content instead of the import.** Rejected: every agent class
  that opens this repo (master, architect, cowork, personal, always-on) already has a compiled bundle
  carrying the shared doctrine (artifact types, core behaviors, the loop). A root file would be a second
  copy of text the build already delivers — the drift class `process-build.py` exists to remove.
* **Integrate the existing mechanism — delete the root file.** `~/.claude/rules/bundle.md` is already
  the one per-class loader, and it is the only one each box needs.

## Decision Outcome

Chosen: **delete `knowledge/CLAUDE.md`.** The root holds exactly `README.md` and `GOALS.md`
(`kb-lint.py` R1). The principle kept from AGENTS.md: *a repo-root instruction file carries what ANY
agent in that repo needs, never one class's bundle* — and in this repo the bundles already carry all of
that, so the file has nothing left to hold.

1. `task-runner.sh`'s portfolio-`CLAUDE.md` block is deleted, and both briefs' first line says the
   doctrine is already in context rather than sending the run to a root file.
2. `kb-lint.py` R1 and its negative control assert two root files.
3. **A future root `CLAUDE.md` in this repo is a defect** unless it carries something no class bundle
   does; R1 fails on it, which is the point at which that argument gets made.

### Consequences

* Good, because a master run in `knowledge` loads 26,550 B of bundle instead of ~91 KB, and nothing
  addressed only to the Architect.
* Good, because the Architect's sessions are unchanged — their bundle never depended on the import.
* Bad, because an agent that opens `knowledge` WITHOUT a `~/.claude/rules/bundle.md` (a box never
  provisioned by `process-build.py`'s class symlink) now loads no doctrine from the repo at all; before,
  it at least got the Architect's. Every registered agent box has the symlink (#7362), so this is a
  provisioning defect to fix on that box, never a reason to restore the import.
* Bad, because dated notes and diagrams that describe the old root file (e.g.
  `wi/work/reference/win/diagrams/dispatched-run-anatomy.gv`) now describe a past state. They are
  evidence with a date on it, not claims about the live tree, and are left as written.

### Corrections retired with the code they guarded

* `task-runner.sh`'s *"🔴 TWO DEFECTS FIXED 2026-08-28"* (SF missing from the portfolio alternation; the
  grep not case-insensitive, so issue #7149's 26 lowercase `sf` resolved to nothing). Both guarded the
  portfolio-`CLAUDE.md` lookup deleted here. Its measurement — *an empty `PORTFOLIO_PATH` is
  indistinguishable from a run that needed none* — is the reason the block is deleted rather than
  re-pointed at `<portfolio>/README.md`: a brief line that silently vanishes on a miss is the same
  defect with a different file name. The text stays in git history (`git show 0854e244a:_infra/scripts/task-runner.sh`).
* Preserved, re-worded: README's *"🔴 THE ROOT HOLDS EXACTLY THESE 3"* → 2; `win-docs-index.py`'s
  *"🔴 RETARGETED #7316"* now says the root holds no `CLAUDE.md`.

### What this does NOT change

* The content of any bundle, and `process-build.py`'s ceiling.
* `_process/the-loop.md`'s *"Ground first: repo root `CLAUDE.md`"* — it is generic across every repo a
  master works (`utopia`, brain repos), where such a file still exists.
