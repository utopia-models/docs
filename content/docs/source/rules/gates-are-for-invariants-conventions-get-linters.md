---
title: "A fail-closed gate is for a stable invariant only. Every other check is advisory, or it degrades the fleet."
description: "Mirrored from the fleet knowledge base: _rules/gates-are-for-invariants-conventions-get-linters.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/gates-are-for-invariants-conventions-get-linters.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: gates-are-for-invariants-conventions-get-linters
cases: [2026-07-01-agent-bypass-permissions, 2026-07-01-agent-gates-for-invariants-not-conventions, 2026-07-22-too-many-gates-degrade-agents, 2026-07-23-pr-ceremony-pileup-and-corrections-dont-stick, 2026-08-28-brute-force-fixes-leave-legacy-writing-behind]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-08-28
```

# A fail-closed gate is for a stable invariant only. Every other check is advisory, or it degrades the fleet.

## Fires when
About to add a gate, required review, branch protection, or blocking CI check — or to enforce a convention mechanically because a correction did not stick.

🔴 **An ADVISORY as the whole fix** tells the ARCHITECT; only **doctrine** changes what a run does. Ask *"where would a master READ this?"* (a correct advisory merged 2026-08-16; ten more violations landed in four hours).
🔴 **A banned-word check is the brute-force shape — never ship one** (Tyler: *"LEGACY WRITING ALWAYS REMAINS!!! BECAUSE YOU JUST DO BRUTE FORCE FIXES!!!"*): it runs after the wrong text exists and knows only today's words. A recurring wrong term is a NAMING GAP — `pick_master()` returns a reason from a **closed enum** (`quota-exhausted` · `rate-limited` · `entitlement-dark` · `login-expired`) so "busy" cannot be written.
🔴 **A doc's stated value is a claim about code** — bind it with `cog_machinery.py`'s `value()` or do not state it.

## Trigger detail (full text — kept out of the always-loaded bundle)
About to add a gate, a required review, branch protection, or a blocking CI check — or to enforce a
convention mechanically because a correction did not stick.
🔴 **Also when shipping an ADVISORY as the whole fix.** An advisory tells the ARCHITECT what
happened; only **doctrine** changes what a run does. Ask *"where would a master READ this?"* and put
it there too — a correct advisory merged 2026-08-16 and **ten more violations landed in four hours.**

🔴 **AND A BANNED-WORD CHECK IS THE BRUTE-FORCE SHAPE — NEVER SHIP ONE** (Tyler, 2026-08-28,
verbatim: *"LEGACY WRITING ALWAYS REMAINS!!! BECAUSE YOU JUST DO BRUTE FORCE FIXES!!!"*). It runs after
the wrong text already exists and knows only the words I thought of today; "occupied" and "at
capacity" sail through. **When a wrong term keeps returning, the recurrence is evidence of a NAMING
GAP, not of insufficient enforcement** — ask what concept has no name. The fix that held: `pick_master()`
returns a reason from a **closed enum** (`quota-exhausted` · `rate-limited` · `entitlement-dark` ·
`login-expired`), so "busy" cannot be written without inventing a new arm and finding nothing to put in
it. (`login-expired` was added by #9811 for a real fourth condition — a box whose own credential file
cannot sign in — and that is the bar: a new arm names a condition, never a workload.) It fails at
authoring time, in review, instead of after the fact in CI.

🔴 **AND A DOC'S STATED VALUE IS A CLAIM ABOUT CODE — bind it or do not state it.** `sweeper.md` taught
caps of 6/24/8 for two weeks after #6962 deleted them, lint-clean, because `verified:` is a DATE and
not a dependency. Presence checks (`exists`, `calls`, `units`) cannot catch a number that outlived its
constant; `cog_machinery.py`'s `value()` can, and distinguishes STALE (constant deleted) from DRIFTED
(constant changed).

## The rule
Gate the one thing that must never be true (a secret in a tracked file). Everything else is an advisory
linter plus fix-forward. Gates do not make corrections stick; they make masters stop. Client and
template repos get no branch protection at all — the clients are non-technical, and private plus a free
read-collaborator is the whole model.

## Cost when it fired
The `no-direct-main` hook forced branch→PR→gate→merge and produced 85 abandoned PRs — Tyler: *"I DO NOT
WANT TO REVIEW PRS!!!! There needs to be a better system for this. Keep it simple. Stop overcomplicating
everything."* Too many strict WIN gates was separately diagnosed as the systemic cause of masters
degrading.
