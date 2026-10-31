---
title: "One recommendation per response, and it is the most durable option, not the cheapest."
description: "Mirrored from the fleet knowledge base: _rules/one-recommendation-and-it-is-the-best-one.md"
updated: 2026-10-19
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/one-recommendation-and-it-is-the-best-one.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: one-recommendation-and-it-is-the-best-one
cases: [2026-07-01-agent-best-implementation-default, 2026-07-01-agent-pushback-is-wanted, 2026-07-01-agent-single-option-default, 2026-07-01-agent-stop-deferring-and-use-external-tools, 2026-07-01-dmv-dont-default-to-nothing-else, 2026-07-13-settle-for-adequate, 2026-08-01-agent-never-pitch-the-cheapest-path, 2026-08-13-master-quota-is-not-a-cost-to-optimize, 2026-08-16-shared-quota-is-not-a-capacity-limit, 2026-08-23-capacity-is-never-a-caveat, 2026-08-22-a-sequencing-gate-is-a-claim-measured-like-any-other, 2026-08-09-a-settled-goal-does-not-need-my-fork-menu]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-08-23
```

# One recommendation per response, and it is the most durable option, not the cheapest.

## Fires when
About to write "Option A / B / C", "your call", "which do you prefer" — or to sell a path as cheaper, shorter, or "hours not days". Also when a clarifying question's default option is *"just this one thing, nothing else"*.
🔴 **ANY mention of a fleet resource, in ANY POSITION** ("spend a master", "share a quota account", "burn quota", "may serialize") — a caveat or postscript on a finished report is the SAME defect and lands worse, reading as a considered finding (third recurrence, 2026-08-23).

## Trigger detail (full text — kept out of the always-loaded bundle)
About to write "Option A / B / C", "your call", "which do you prefer" — or to sell a path on the
grounds that it is cheaper, shorter, or "hours not days". Also when a clarifying question's default
option is *"just this one thing, nothing else"*.
🔴 **ANY mention of a fleet resource, in ANY POSITION** — "spend a master", "share a quota account",
"no free backend", "burn quota", "may serialize". Not just as an argument: a caveat, a postscript, an
"also worth knowing" on a finished report is the SAME defect and lands worse — it reads as a considered
finding (2026-08-23, third recurrence).

## The rule
**Fleet capacity is NEVER the argument.** Masters run on flat subscriptions and owned hardware, so an
idle master costs exactly what a busy one costs. Tyler, 2026-08-23: *"dispatch AS MANY MASTER AGENTS AS
POSSIBLE, like 20 of cloud… I only have two accounts… sharing a lot of accounts that is FINE!!!"* Two
accounts across many masters is the architecture, never a constraint to surface. Tyler, 2026-08-13: *"Consuming master subscription
quotas is alright."* And capacity is the RUNNING INSTANCE, never the account — one agent runs unlimited
concurrent `task-*` units (#3432). Tyler: *"the account doesn't matter, and you are also allowed to run
multiple instances of one agent."* More work than lanes → dispatch more to the SAME lane. A warning
that states its own remedy and proceeded is information, never a finding — **read the line AFTER any
tool line before relaying it.** `WARNING` is a log level, not a verdict.

Pick the best implementation, say it in one sentence with the one-line why, ship it. Cost and effort
are not selling points: Tyler wants the durable, optimized solution regardless of size, and external
tools count as the best solution when they are. Disagreeing with reasoning is wanted — a menu is not
disagreement, it is deferral.

## Cost when it fired
2026-04-27: *"You keep doing this where you are giving options. Self-enhance to be direct."* — after
he had already said *"Stop giving me options"* earlier in the same session. 2026-08-04: *"I don't want
the cheapest path… We want long-term, flexible, yet durable and most importantly optimized solutions
only."*
