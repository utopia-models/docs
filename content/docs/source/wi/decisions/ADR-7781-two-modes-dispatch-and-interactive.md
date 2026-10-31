---
title: "Two modes — `dispatch` and `interactive` — and whether to monitor is read from the subprocess"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-7781-two-modes-dispatch-and-interactive.md"
updated: 2026-09-13
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-7781-two-modes-dispatch-and-interactive.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-7781
adr_status: accepted
status: active
decision_date: 2026-09-13
supersedes:
superseded_by:
issue: 7781
subprocess: process
references:
  - _process/modes.md
  - wi/work/reference/the-process-modes-portfolios-subprocesses.md
  - wi/subprocesses/dispatch/process.md
  - _infra/scripts/subprocess-index.py
  - wi/work/plans/documents/2026-08/2026-08-24-plan-220-mode-is-the-first-axis-three-modes-then-portfolio-then-the.md
  - wi/work/plans/documents/2026-08/2026-08-31-plan-267-review-the-remaining-16-documented-workflows-adopt-adapt-o.md
  - wi/work/plans/entries/2026-08/plan-267-review-the-remaining-16-documented-workflows-adopt-adapt-or.md
```

# Two modes — `dispatch` and `interactive` — and whether to monitor is read from the subprocess

Produced by the **`process`** subprocess (`wi/subprocesses/dispatch/process.md`): this changes
the planning+execution path itself — the mode vocabulary, `mode-set.sh` and its injector, the
subprocess layout, and every frame that branches on mode.

**Id is the board issue, per ADR-182's identity rule**, and the issue chosen is the **Feature**
(`#7781`), not the phase that wrote this record (`#7782`), because the decision governs all six
Track-A phases of that Feature. This is the precedent ADR-6798 set for the same situation.

## What this record fills — and a correction to the Feature that asked for it

Feature `#7781` and its phases say the three-mode decision was *"referenced everywhere as ADR-6798
but never actually written as a file."* **Measured on this branch, that is half right.** ADR-6798
**was** written and accepted: commit `d0cffe34c` (2026-08-24, PR `#6812`) added
`world-infrastructure/company/decision-records/ADR-6798-mode-is-the-first-axis-of-planning-routing.md`
with `adr_status: accepted`. Commit `cdfea10e8` (2026-08-31, `#7316`, the PLAN-256 KB rebuild) then
**deleted** it along with every other pre-rebuild fleet-wide record — that commit's message reads
*"decisions/ (EMPTY — the pre-rebuild ADRs stay in git history, which is the archive)"* — while
repointing the 24 files that still cite `ADR-6798` by name at nothing.

So the true state before this record: **the decision existed, was accepted, and has no file in the
tree.** `wi/decisions/` held only `.gitkeep`. Anyone following a citation of ADR-6798 finds nothing
unless they know to run `git show cdfea10e8^:world-infrastructure/company/decision-records/ADR-6798-mode-is-the-first-axis-of-planning-routing.md`.

**Supersession, stated in prose because the frontmatter cannot carry it honestly.** This record
replaces ADR-6798's *three-mode vocabulary* (its Decision Outcome item 1) and nothing else. It does
**not** set `supersedes: ADR-6798`, because there is no in-tree record for that link to resolve to —
`decision-record-linter.sh` would report it dangling, and restoring a deleted accepted record just to
edit its `superseded_by:` header would undo #7316's deliberate deletion. The link lives here, in the
body, with the command that reads the old record.

## Context

The three modes decided 2026-08-24 (`_process/modes.md`, Tyler verbatim: *"The only 3 modes should be
dispatch \* monitor, dispatch \* no monitor, and interactive."*):

| mode literal | what it meant |
|---|---|
| `dispatch-monitor` | masters execute; the Architect stays on it until the chain completes |
| `dispatch-no-monitor` | masters execute; the Architect's involvement ends at dispatch (the normal case) |
| `interactive` | Tyler and the Architect work it in-session |

ADR-6798 also decided — and **this record keeps, unchanged** — that one subprocess lives in exactly
one mode, that `<portfolio>/subprocesses/<mode>/<id>.md` is the routing with the directory as the
declaration, and that every plan carries a mode, a portfolio and a subprocess (`general` legitimate).

Those two rulings together created a redundancy nobody had named. **One subprocess, one mode** means
every dispatch-mode subprocess already fixes whether its chain is watched: all 9 declare it through
`modes:`, and none appears under both dispatch directories.

| watched (`modes: dispatch-monitor`) | not watched (`modes: dispatch-no-monitor`) |
|---|---|
| `money-path` · `occ-surface` · `process` | `admin-panel` · `aeo` · `ui-customer` · `rip` · `apply` · `doc-update` |

So at step zero, once Q3 has chosen a dispatch-mode subprocess, the Q1 answer's monitor half is
already determined by that choice. Asking it at Q1 either **repeats** a fact the subprocess holds, or
**contradicts** it — a plan recorded `dispatch-no-monitor` with subprocess `money-path` is expressible
today and nothing refuses it. Two places holding one fact is the drift class doctrine bans, and it is
the same reason ADR-6798 rejected a central mode→subprocess map.

Tyler proposed the collapse mid-session in PLAN-267 (2026-09-13): merge `dispatch-monitor` and
`dispatch-no-monitor` into one `dispatch` mode and derive monitor-or-not from the chosen subprocess's
own frontmatter rather than asking it as a separate question.

## Considered Options

* **Do nothing — keep three modes.** Rejected: it leaves the contradiction above expressible and the
  Q1 answer duplicating Q3's, with no check that they agree.
* **Two modes, and ask "monitor?" as its own step-zero question.** Rejected: it moves the duplicate
  rather than removing it — the new question and the subprocess's directory still hold the same fact
  and can still disagree.
* **Two modes, with monitor as a recorded qualifier (`dispatch monitor` in the state file).**
  Rejected: that is the two-word qualifier slot ADR-6798 retired (`interactive me` / `flame` /
  `other`), and `mode-set.sh` still refuses a qualifier from that vocabulary by name.
* **Two modes, and a per-portfolio default for monitoring.** Rejected: monitoring follows the
  *subject*, not the portfolio — `dmv-research` holds both `money-path` (watched) and `ui-customer`
  (not), and `wi` holds both `process` and `doc-update`.
* **Integrate the existing fact — two modes, and read monitor from the subprocess (`monitor: yes|no`
  frontmatter).** The fact is already subprocess-scoped and already recorded; this makes that record
  the only one.

## Decision Outcome

Chosen: **two modes, `dispatch` and `interactive`; whether a dispatch chain is monitored is derived
from the chosen subprocess's `monitor:` frontmatter, never asked.**

1. **Mode literals are exactly `dispatch` · `interactive`.** `dispatch-monitor` and
   `dispatch-no-monitor` retire as modes. 🔴 **`interactive` IS STILL THE WHOLE NAME** — ADR-6798's
   ban on `needs-tyler` / `blocked-by-tyler` / `manual` / `human-in-the-loop` stands.
2. **Dispatch-mode subprocesses carry `monitor: yes` or `monitor: no`** beside `modes: dispatch`, and
   move to one `<portfolio>/subprocesses/dispatch/` directory. The mapping is the existing directory,
   1:1 — `dispatch-monitor` → `yes`, `dispatch-no-monitor` → `no`. Interactive subprocesses carry no
   `monitor:` field; it has no meaning in a session Tyler is already in.
3. **Monitor-or-not is read, never asked.** Step zero keeps its three questions (mode · portfolio ·
   subprocess) and Q1 shrinks to two answers. The injector and the execution frames read the BOUND
   subprocess's `monitor:` to choose the standing order — stay on the chain, or report and move on.
4. **A dispatch plan whose subprocess is `general` or `none` is not monitored.** There is no
   frontmatter to read, and not-monitored is what the three-mode vocabulary already named *the normal
   case*. A subject that needs watching belongs to a subprocess that says so.
5. **Everything else ADR-6798 decided stands**: mode → portfolio → subprocess ordering, the directory
   as the routing, one subprocess in exactly one mode, every plan carrying all three answers.

### Consequences

* Good, because the contradiction *mode says unwatched, subprocess says watched* is no longer
  expressible — there is one field, on one file.
* Good, because Q1 gets shorter and the question removed is one Tyler could only answer by knowing
  which subprocess he was about to pick.
* Good, because `mode-set.sh`'s refusal of bare `dispatch` (*"'dispatch' is not a mode on its own"*)
  — the most common first answer — inverts into the accepted form.
* Bad, because **monitoring can no longer be chosen per plan.** A `doc-update` chain Tyler wants
  watched once has no switch; the choices are flipping `monitor:` on the subprocess for every plan
  that uses it, or a new subprocess. That is ADR-6798's *one subprocess, one mode* constraint applied
  one level down, accepted for the same reason.
* Bad, because `general` dispatch plans are never monitored by default — a novel, risky subject with
  no catalogue entry gets the unwatched standing order unless a subprocess is written for it.
* Bad, because the vocabulary is written in many places at once: `mode-set.sh` and its injector,
  the 9 dispatch subprocess files and `subprocess-index.py`, `_process/modes.md` and
  `_process/steps/`, the generated bundles, the OCC's `plan-registry.ts` in `utopia-models/utopia`
  (which already carries a stray bare `"dispatch"` literal), and 4 skill files. Until every phase of
  `#7781` lands, some surfaces speak two modes and some three. The phases are `#7783`–`#7787`; this
  record is written ahead of them deliberately, which is what an ADR is for.
* Bad, because the 24 files citing `ADR-6798` still point at a record with no file. Repointing the
  mode citations to this record rides the doctrine phase (`#7785`); this record does not claim they
  resolve.

### What this does NOT change

* **ADR-6798's routing decisions** — ordered axes, directory-as-routing, one subprocess per mode,
  every plan carries all three. Only its mode vocabulary is replaced.
* **ADR-202** (subprocess injection rides the existing per-turn carrier, gated on `step < 3`). The
  carrier is unchanged; the execution-time frames gain one frontmatter read.
* **The `interactive` directory and its 12 subprocesses** — untouched.

### Grounding

Read on this branch (`win/7782-adr-two-modes`, off `origin/main` `69414d445`), 2026-09-13:

```
$ ls -A wi/decisions
.gitkeep

$ git log --format='%h %ad %s' --date=short -1 d0cffe34c
d0cffe34c 2026-08-24 PLAN-220 P5 — ADR-6798 and planning-loop.md record the mode-first routing (#6806) (#6812)

$ git log --format='%h %ad %s' --date=short -1 cdfea10e8
cdfea10e8 2026-08-31 P3+P4: rebuild the KB tree and repoint every pointer — ONE COMMIT (#7316)

$ git show --name-status --format= cdfea10e8 | grep ADR-6798
D	world-infrastructure/company/decision-records/ADR-6798-mode-is-the-first-axis-of-planning-routing.md

$ grep -rl "ADR-6798" . --exclude-dir=.git | wc -l
24

$ ls */subprocesses/*/*.md | awk -F/ '{print $3}' | sort | uniq -c
      3 dispatch-monitor
      6 dispatch-no-monitor
     12 interactive

$ bash ~/.claude/plugins/marketplaces/fleet-doctrine/plugins/fleet-doctrine/scripts/mode-set.sh dispatch
mode-set: 'dispatch' is not a mode on its own — it is dispatch-monitor or dispatch-no-monitor

$ bash _infra/scripts/decision-record-linter.sh
No decision record integrity issues found.
```

Also read in full this session: the PLAN-220 plan document (the three-mode forks and their
2026-08-24 corrections), ADR-6798 at `cdfea10e8^`, ADR-182 at `cdfea10e8^` (frontmatter shape and
the `ADR-<issue#>` identity rule), and the bodies of Feature `#7781` and phases `#7783`–`#7787`.
