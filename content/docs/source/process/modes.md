---
title: "The two modes"
description: "Mirrored from the fleet knowledge base: _process/modes.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/modes.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect, master, personal, alwayson]
```

# The two modes

Mode is **Q1 of step zero** — it decides which subprocesses exist. Exactly two literals, one per plan, no
qualifier (ADR-7781, 2026-09-13).

| mode literal | what it means |
|---|---|
| `dispatch` | masters execute; the Architect's involvement ends at dispatch **unless the bound subprocess says `monitor: yes`** |
| `interactive` | Tyler and the Architect work it in-session — running, with him in it |

🔴 **WHETHER A DISPATCH CHAIN IS WATCHED IS READ, NEVER ASKED:** the `monitor: yes|no` frontmatter of the
subprocess chosen at Q3. `yes` → the Architect stays on the chain until it completes; `no` → involvement
ends at dispatch (the normal case). `general`/`none` subprocesses have no frontmatter and are not monitored.

🔴 **`interactive` IS THE WHOLE NAME** — never `needs-tyler`, `blocked-by-tyler`, `manual`,
`human-in-the-loop` — and **it is NOT "blocked"**: it is work running with Tyler in it. Work that cannot
run unattended is *filed* `interactive`, never filed as dispatched work that then reports itself blocked.

🔴 **RETIRED:** `dispatch-monitor` / `dispatch-no-monitor` (2026-09-13; duplicated a fact the subprocess
holds, ADR-7781) · the `interactive` who-does-the-work qualifiers (2026-08-24; they answer *who does the work*, a
**subprocess** question).

**Where the value lives:** `/plan-start` runs `project-session.sh load <mode> <project> <recipe>`, which writes
`mode` into `~/.claude/state/plan-issue/<session-id>`; the Plan issue carries it as its board `Mode` field, and the
`[session] project=… mode=… recipe=… issue=…` line prints it back at every start, resume, clear and compact. The
`~/.claude/state/mode` stance file and `mode-set.sh` were retired with the plan registry (ADR-10109).

**Subprocesses are per-mode:** `wi/subprocesses/<mode>/<id>.md` and `<portfolio>/subprocesses/<mode>/<id>.md`
— the directory IS the mode; each lives in exactly one. Full derivation:
`wi/work/reference/the-process-modes-portfolios-subprocesses.md`.
