---
title: "Work Tyler will review needs a row before it runs, not after he asks for one."
description: "Mirrored from the fleet knowledge base: _rules/the-plan-exists-before-the-work-does.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/the-plan-exists-before-the-work-does.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: the-plan-exists-before-the-work-does
cases: [2026-07-01-agent-plan-mode-replaces-supercharge, 2026-07-01-agent-plan-native-task-mirror, 2026-08-01-agent-planned-in-bypass-not-plan-mode, 2026-08-03-a-plan-step-with-no-deliverable-is-me-thinking-out-loud, 2026-08-07-dispatched-work-with-no-registry-entry-is-invisible, 2026-08-09-work-that-runs-before-its-plan-exists-cannot-be-reviewed, 2026-08-09-a-spec-file-is-not-a-plan-the-occ-can-see]
status: active
mechanism: pretooluse: first Agent call of a session with no Plan issue bound (~/.claude/state/plan-issue/<sid> has no issue)
audience: agent
last-recurrence: 2026-08-09
```

# Work Tyler will review needs a row before it runs, not after he asks for one.

## Fires when
🔴 **The FIRST research subagent of a session** — the earliest signal of planning-shaped work and the cheapest place to register, before an artifact exists to be mistaken for the plan. Also: about to file an issue or Feature or dispatch with no Plan issue opened this session · a `Write` to a `specs/` path or any document Tyler will review.
Tells: *"this is analysis, not planning"*, *"I'll register it once I know the shape"*, a session that opened without `/plan-start`, and (3× in August 2026) **a good document at a correct path feeling like the plan already exists.**

## Trigger detail (full text — kept out of the always-loaded bundle)
🔴 **The FIRST research subagent of a session.** That fan-out is the earliest unambiguous signal of
planning-shaped work and it is the cheapest place to register — before any artifact exists to be
mistaken for the plan. Also: about to file an issue, file a Feature, or dispatch — and no Plan issue was
opened this session. Also **`Write` to a `specs/` path**, or to any document Tyler will review.

The tells are *"this is analysis, not planning"*, *"I'll register it once I know the shape"*, any
session that opened without `/plan-start` but is doing planning-shaped work — and the one that
recurred three times in August 2026: **a good document at a correct path feeling like the plan
already exists.**

## The rule
**Run `/plan-start` before the work, not after.** Its three answers open the Plan issue (label
`planning`, its spec folder, the board's Mode · Recipe · Last active) and bind the session. Then publish
the rough-draft artifact and put its URL in the Plan issue's body — that is what fills the OCC's
artifact column (ADR-9839; the plan registry `plan-new.sh` wrote was retired, ADR-10109).

**The trigger is the deliverable, not the label.** "Am I in a planning session?" is the question that
gets answered wrong, because the answer depends on what the session felt like. Ask instead: *will this
produce work Tyler is expected to review?* If yes, it needs a row — whatever the session is called and
whichever prompt opened it.

**Filing issues moves a plan; it cannot create one.** Steps 3-5 are DERIVED from the Plan issue's
Features (`planning-loop.md`). A perfectly-filed chain with no Plan issue leaves the plan exactly nowhere, and
the OCC — the surface Tyler actually watches — shows nothing at all.

**Effort is not registration.** Four researchers, a Feature and a dispatched chain is more work than
one `/plan-start`, and that asymmetry is what hides the omission. Producing a lot of planning-shaped output
is not evidence a plan exists.

🔴 **A SPEC IS NOT A PLAN, and this is the substitution the other clauses do not catch.** They all
assume registration was *deferred*; the 2026-08-09 enclave case **substituted** for it. A spec at
`<portfolio>/specs/<slug>/spec.md` — phases, acceptance criteria, irreversible steps flagged — is
required by `the-loop.md` § Thick tasks and is read by **the master who executes**. The Plan issue is
read by **the OCC Tyler watches**. Two artifacts, two readers, neither substituting for the other, and
the spec being *correct* is exactly what makes its incompleteness invisible. Writing a document has no
natural checkpoint the way `file-issue.sh` does — so the checkpoint must be the `Write`.

**Retroactive registration is a repair. Say so.** Opening the Plan issue after Tyler asks is the correct
recovery, but the artifact he was meant to watch evolve arrives finished. Report it as a repair, never
as the intended state.

## Cost when it fired
2026-08-09 (**third occurrence this month, second that day, rule loaded throughout**): a GOVCON
session ran four research subagents, closed a set of architecture decisions with Tyler on a live call
with the partner, and wrote a seven-phase provisioning spec — then presented it for review with no
registry entry. Tyler: *"I don't see the plan in the OCC… this is a PERSISTENT problem where I need to
manually tell you."* Three recurrences while loaded means the rule TEXT was missing the shape, not
that it was weakly followed — hence the spec-is-not-a-plan clause above.

2026-08-09: filed Feature #4846 (a live P0 revenue outage) with a three-phase chain and dispatched the
head — no entry, no document, no artifact. Tyler found it by asking *"Which plan number are you
working on? so that I can review and verify."* PLAN-120 was created retroactively, in the wrong order,
after the work was running.

2026-08-07: researched four threads, wrote two Google Docs, filed Feature #4684 with a four-phase
chain and dispatched to cloud — no registry entry — on the day Tyler had said he would monitor from
his phone. *"Need everything documented, feel like you are not planning and executing properly, I
don't see anything in the OCC."* That case sat with an empty `rule:` field for two days, so nothing
loaded it, and the same failure repeated on 08-09.

The registry-wide version of the same class, measured 2026-08-09: **17 of 115 entries carry a
binding** and **67 of 115 carry nothing artifact-related** — steps whose omission raises no error.
