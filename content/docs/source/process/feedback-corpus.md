---
title: "feedback/ — corrections, compacted into behavior"
description: "Mirrored from the fleet knowledge base: _process/feedback-corpus.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/feedback-corpus.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect]
load: on-demand
reader: the `/feedback-loop` skill — read when a correction is being compacted
```

# feedback/ — corrections, compacted into behavior

**The point: a correction Tyler gives once should be LOADED at the moment it is about to be
repeated.** The old corpus was write-only — 43 files in a sink declared closed while a skill kept
writing to it, and 91 more scattered across six masters' memory dirs where no other master could see
them.

## Two tiers, because there are two growth curves

| | grows | loaded? | edited? |
|---|---|---|---|
| `_rules/cases/<YYYY-MM>/` | ~400/year, forever | **never** | never — append-only evidence |
| `_rules/` | saturates (~40) | via the two generated files | yes, when compacted |
| `_generated/bundle-master.md` | generated | **every session on win · nova · cloud · dust** | never by hand |
| `_generated/bundle-architect.md` | generated | **every session on the agent box** | never by hand |

**Two files, because there are two audiences (#5357).** Every rule is a behavior Tyler corrected, but
not of the same agent: `dispatch-is-the-end-of-my-involvement` governs the Architect, who plans and
dispatches; `every-tree-holds-another-agents-work` governs a dispatched master, who executes a filed
issue. Each rule file declares `audience:` — `master`, `agent`, or `all`; absent means `agent`, so an
unclassified rule still reaches the Architect and simply does not tax four master boxes unread.
`_generated/bundle-architect.md` carries **every** active rule with its trigger paragraph and case pointer; `_generated/bundle-master.md`
carries the master-facing rule sentences only, and has a ceiling of 30,000 B (`MASTER_PREFIX_CEILING`
in `_infra/scripts/process-build.py`, read 2026-10-31). The build exits 1 when the master bundle is over
it, so the budget cannot be exceeded quietly.

The polarity is deliberate: `~/.claude/rules/RULES.md` is a TRACKED symlink on the agent box and an
UNTRACKED one on all four master boxes, and brain-pull is `git merge --ff-only` — a tracked file landing
where an untracked one sits fails silently and stops every later brain update on that box. So the file
four boxes must change is the one that keeps the path, and only the agent box's symlink is repointed.

Cases are evidence and are cheap. Rules are behavior, and there is a finite number of ways to be
annoyed. **The read surface attaches to the tier that stops growing** — which is why this corpus can
still be loaded whole at 2,000 entries.

🔴 **`cases/` is intentionally unbounded and must not be "cleaned up".** It is the evidence behind
every rule, and a subtract-by-default audit that deletes it removes the ability to ask *why* a rule
exists. Deleting a case is deleting a fact.

## Compaction debt is the health metric

A case whose `rule:` frontmatter is empty is unabsorbed — captured but not yet turned into behavior.
That count renders at the top of `_generated/bundle-architect.md` every session — where the agent that compacts reads.

**No gate enforces compaction, and none should.** A job that polls for compaction debt is polling
wearing a hat, and corrections-become-machinery is the reflex Tyler killed 2026-07-22. But what the
counter *alone* bought, measured 2026-08-09: **134 of 145 cases unabsorbed.** Capture worked and had
been fed faithfully for six weeks; the step that required someone to notice the number and choose to
act is the one that did not happen.

So compaction became something a session **does** rather than something a counter **reports** — see
the observation log below. Same day, same corpus, three autonomous reviews: **134 → 124 → 23.** The
17,500-byte architect-bundle ceiling (`ARCHITECT_PREFIX_CEILING`, read 2026-10-31) remains the backstop
that eventually forces the issue: the build exits 1 while the bundle is over it.

## Upstream of `cases/` — the observation log (#4856)

The Architect's `task-observer` skill (`~/.claude/skills/task-observer/` in the Architect's brain, activated from its
`CLAUDE.md` so capture fires at session start and survives compaction) appends corrections, friction
and reversals to `~/.claude/skill-observations/log.md` **as they happen** — no skill invoked, nobody
asked. On session start, if the last review is 3+ days old and any observation is OPEN, it runs the
review right then and lets it commit and push. That is the whole mechanism: the review is not offered,
because the offer was the maintenance being deleted.

🔴 **That log is a BUFFER; this directory is the ONE corpus.** Every observation leaves the log as a
case or rule edit here, or as `DECLINED` with a reason — never as a parallel pile of lessons that
outlives its own review. The methodology is adapted from
[rebelytics/one-skill-to-rule-them-all](https://github.com/rebelytics/one-skill-to-rule-them-all)
(Eoghan Henn, CC BY 4.0), whose delivery layer stages proposals and waits for a human to install them.
That is the right call for a tool installed by strangers and the wrong one here, so delivery was
replaced with `git commit && git push`, and its own `skill-observations/` corpus with this one.

🔴 **`rule:` on the case and `cases:` on the rule are two halves of one link, and only one is
measured.** The debt count reads the *case's* `rule:` field, so a rule listing a case that does not
name it back leaves that case counted as unabsorbed forever — five were in exactly that state on
2026-08-09. `_infra/scripts/feedback-deliver.sh` refuses to deliver until both sides agree.

🔴 **A case written without YAML frontmatter is invisible to the generator.** Thirty-four carried their
Date/Source/Class as a prose line instead, which `process-build.py` cannot read, so they counted as
debt no matter what rule they belonged to. The prose line is fine; it just is not frontmatter.

## Commands

    python3 _infra/scripts/process-build.py            # regenerate both generated files
    python3 _infra/scripts/process-build.py --check    # verify current; non-zero on drift
    bash _infra/scripts/feedback-deliver.sh --dedup <slug>…   # NEW/DUPLICATE per slug; exit 1 on any
    bash _infra/scripts/feedback-deliver.sh             # regenerate, verify the links, commit, push
    bash _infra/tests/feedback-sweep.sh                 # the suite guard.yml runs on every PR

## Writing one — a bare `/feedback-loop` sweeps the WHOLE session (#4857)

Use the `/feedback-loop` skill. It reads a live case for shape rather than hardcoding a convention,
checks the slug for a duplicate before writing, and attaches the case to the rule it proves.

**Bare invocation = every correction in the session, not the last one.** It writes each case,
regenerates both files, commits and pushes — **no confirmation step, because the confirmation step is
the maintenance being removed.** Measured on the session that produced PLAN-116: *five things were
worth logging and two were logged.*

🔴 **The known weakness, stated where it is acted on: a sweep under-reports exactly what it is least
aware of.** The corrections a model notices are the ones it already understands, so the ones that
changed nothing in its head are the ones that go unwritten. That is why
**`/feedback-loop <the thing I missed>` is not a legacy path** — it is how Tyler logs what the sweep
could not see, and it takes precedence over the sweep's own judgement.

**One delivery layer, `_infra/scripts/feedback-deliver.sh`,** called by both writers — the sweep and
`task-observer`'s review. It runs the two-sided link check, regenerates both files, commits the
corpus paths only (never `git add -A`; a peer master may hold unrelated work in that clone), pushes,
and prints the commit hash. A second commit-and-push path for one corpus would be the two-sinks
failure this file names three paragraphs up.

**Zero corrections is a normal outcome and it is stated, not implied** —
`feedback-deliver: 0 cases written — nothing to deliver`, no commit. Silence would be
indistinguishable from a sweep that never ran.

🔴 **A sink is closed only when the writer targeting it is repointed in the same commit.** The
previous closure was prose-only: decision record 002 closed a sink on 2026-07-31 while the skill
that wrote to it kept pointing there — and won 17 times, because it was the only authority that
executed.

## The one corpus that is deliberately NOT here

`wi/work/raw/methods/GENERATION-FEEDBACK.md` — RAW's generation-craft log (rejected renders, the mechanism, the fix).
Kept separate on purpose (Tyler, 2026-08-09), because its lessons are **craft applied before one
specific act**, not **behaviour loaded into every session**. Compacting them into `_generated/bundle-master.md` would
tax four masters who never generate anything.

Write it with `/feedback-loop`. Never cross-post between the two.
