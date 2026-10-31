---
title: "ADR-9837 — `/plan-start` is a plugin skill that loads ONE project; a start hook keeps it across `/clear`, resume and compaction"
description: "Mirrored from the fleet knowledge base: wi/decisions/ADR-9837-plan-start-loads-one-project.md"
updated: 2026-10-23
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/decisions/ADR-9837-plan-start-loads-one-project.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
artifact_type: adr
adr_id: ADR-9837
adr_status: accepted
status: active
decision_date: 2026-10-23
supersedes:
superseded_by:
issue: 9837
subprocess: process
references:
  - wi/work/specs/plan-405-session-context-wiring/spec.md
  - wi/decisions/ADR-9836-a-project-free-shared-floor.md
  - _process/steps/plan-start-frame.md
  - _infra/scripts/project-census.py
  - utopia-models/fleet-plugins (fleet-doctrine skills/plan-start, scripts/project-session.sh)
```

# ADR-9837 — `/plan-start` is a plugin skill that loads ONE project; a start hook keeps it across `/clear`, resume and compaction

## Context

P1 (ADR-9836) made the always-on text project-free. Something must now put ONE project's text into a planning
session and keep it there. Before this, `/plan-start` was a brain-agent skill (agent box only) that read
`_process/steps/{1-brief,2-loop,3-file}.md` in full — 86,350 B of frame, with the portfolio context arriving only
as a one-shot `Read` of `<portfolio>/README.md` (dmv-research's alone is 45 KB; net's 125 KB) that did not survive
compaction. `sessionstart-standing.sh` re-injected only the `[standing:…]` line, keyed on a plan binding.

Re-measured on Claude Code 2.1.302 (cloud@novaserver, 2026-10-23), throwaway plugin via `--plugin-dir`:

- `disable-model-invocation: true` on a PLUGIN skill: the Skill tool refuses it (`Skill xprobe cannot be used
  with Skill tool due to disable-model-invocation`) and a typed `/xprobe` runs it. The old loader's note
  (2026-08-14: the flag "does not stop the Skill tool") is no longer true.
- `${CLAUDE_SESSION_ID}`, `${CLAUDE_PLUGIN_ROOT}` and `$ARGUMENTS` are substituted in a plugin skill body.
- A same-named project/user skill SHADOWS a plugin skill on the bare `/name` (typed `/xprobe` returned the local
  copy). So the brain-agent `skills/plan-start` must go, or `/plan-start` never reaches the plugin.
- SessionStart fires with `source` = `startup`, `resume`, `compact` and `clear` under `claude -p`, and `/clear`
  in a resumed `-p` session mints a new session id in the same process.

## Options considered

1. **Do nothing** — keep the 86 KB frame and the README read. Rejected: the project text is not scoped (the
   README read is optional and lost at compaction) and the frame is 3.5× the spec's budget for it.
2. **Keep the brain-agent skill, slim it** — Rejected: a brain skill reaches one box (`skills-layer`), and the
   start hook and state file it depends on ship in the plugin anyway; two delivery paths for one mechanism.
3. **`!` shell injection inside SKILL.md** — Rejected: it runs before the three answers exist, and (per the
   2026-10-22 experiments) needs `--add-dir` to read files outside the working directory.
4. **Integrate existing: the plugin's SessionStart + a plugin skill + a script, modelled on
   `sessionstart-standing.sh`'s pid adoption** — CHOSEN.

## Decision

- **fleet-doctrine 0.93.0 ships `skills/plan-start/SKILL.md`** (`disable-model-invocation: true`). It asks
  mode → project → recipe (`AskUserQuestion`, the same fixed card), or takes them as three arguments, then runs
  `scripts/project-session.sh load <mode> <project> <recipe> --session ${CLAUDE_SESSION_ID}`.
- **`project-session.sh load`** writes `~/.claude/state/plan-issue/<session_id>` (project, mode, recipe,
  claude_pid, cwd, opened_at — merged, so P4's keys survive), runs `mode-set.sh` so the per-turn injector keeps
  working side by side, and prints: the start line · the STANDING block · `<project>/context.md` · the recipe ·
  the project's capability rows (`capabilities.sh --inject --project`) · the comms digest for `cleaning` only ·
  `_process/steps/plan-start-frame.md`.
- **`project-session.sh start`** is one SessionStart hook, matcher `startup|resume|clear|compact`. It prints
  `[session] project=… mode=… recipe=… issue=…` and re-injects `<project>/context.md`, or `[session] NO PROJECT`
  and nothing else. On `clear` it MOVES the newest state file whose `claude_pid` is this process and which is
  newer than the process. Every fire is a line in `~/.claude/state/plan-issue.log`.
- **Capability rows belong to a project by id** (`dmv-*`/`dmvresearch`/`clkk` · `cleaning-*`/`utopiacleans` ·
  `net-*`/`resume`; `wi` gets the unclaimed rows). The map's `project:` field is the Infisical project, not ours.
- **The project canary is the context file's own H1**, so `project-census.py` needs no marker written into the
  six context files.
- `sessionstart-standing.sh`, the plan binding and the old step files stay (side by side, per the spec). The
  brain-agent `skills/plan-start` is deleted (it would shadow the plugin skill).

## The frame, and which corrections it carries

`_process/steps/plan-start-frame.md` (17,398 B) replaces reading `1-brief.md` + `2-loop.md` (66,720 B) at
`/plan-start`. Kept, with their evidence: architect-only; bypassPermissions; one-argument `mode-set.sh` and the
retired forms; `interactive` is the whole name; monitor is the recipe's field; the interactive PASS/FLOOR/TEST
(one hard lock per pass, a wrong pass is a pass, approving remarks end nothing, his word ends the loop not the
step); `--portfolio` mandatory (171/190 measurement, PLAN-191 wrong-portfolio); plan-new is synchronous, read the
entry back; header lines, no pipes; artifact at the TOP (13/65 → 68/130 measurements) and `artifact:none`; the
template not prose, one mode variant, SVG width, one script; component-doc current state and "no subagent
establishes current state"; lane `agent` dispatchable but not swept; ask before researching; no acceptance at
step 1; converting into existing machinery; recalling vs reading; research lands then the card (PLAN-397); both
exit options and the click read by the hook (ADR-6932, PLAN-225); neither exit advances the step; the
three-things report; the artifact iterates in place; `### P1 ·` headings and zero ≠ zero phases; write at the
source, registry copy authoritative (240-document measurement); never hand-write the entry, never
`backlog task create`, unbound plan has no identity; five steps, COMMIT absent, every step derived; Executed vs
step 5; a week names a subject; Cycle/Week UI-only; park at birth (PLAN-142); repair rule.

**Moved out of the injected frame, not retired** — each still in its step file, read on demand: the Q1/Q2/Q3
wording and card rules (now the SKILL.md body, which asks them); the `plan-new.sh --portfolio` exact-match table
and the `net`/`talent`/`cleaning`/`raw` slug notes (`1-brief.md`; `project-session.sh` normalises the spellings);
the README-is-not-re-attached note (superseded: the start hook re-injects `context.md`); the per-portfolio
loader-skill deletion history; the WIN subprocess appendix and catalogue snapshot (the `recipes` command reads
the directory live); the OCC-column harvest internals (`plan-registry.ts` line refs); the resume half of
`2-loop.md` — SETTLED, TRAPS, VERIFICATION and the four-source research (`/plan-continue`'s frame, unchanged).

**Retired:** none.

## Consequences

- A planning session carries one project's context (≤3 KB) plus one recipe and a 17 KB frame instead of 86 KB.
- `/plan-start` is identical on every box that runs fleet-doctrine ≥ 0.93.0; the Architect's box needs the
  brain-agent deletion pulled, or its old skill keeps winning the bare name.
- P4 fills `issue`, `repo`, `item_node_id`, `loop`, `last_stamp_epoch` in the same file; the start line already
  prints `issue=`.
