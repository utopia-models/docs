---
title: "A fix that was not reproduced first is a guess. Reproduce against the real system."
description: "Mirrored from the fleet knowledge base: _rules/reproduce-the-failure-before-shipping-the-fix.md"
updated: 2026-09-29
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/reproduce-the-failure-before-shipping-the-fix.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: reproduce-the-failure-before-shipping-the-fix
cases: [2026-07-01-win-never-false-hold-on-a-flawed-check, 2026-07-12-parroted-pdf-constraint-as-my-own, 2026-07-31-five-plans-on-one-section-and-it-still-lies, 2026-08-01-agent-architecture-first-not-symptom-thrashing, 2026-08-02-read-line-one-of-a-two-line-secret-and-blamed-the-store, 2026-08-11-two-wrong-diagnoses-of-a-tool-that-works]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-08-23
```

# A fix that was not reproduced first is a guess. Reproduce against the real system.

## Fires when
A fix did not work and a second plausible one is forming · a tool, store or credential looks broken ·
a single check comes back negative and a conclusion is about to be drawn from it.

## The rule
Stop and reproduce the actual failing request against the real system, then binary-search the variable
until the cause is isolated. Never conclude from one flawed check — the tool is far more often being
used wrong than broken. A constraint stated in a source document is that document's, not mine.

## Cost when it fired
2026-06-22: four sequential plausible fixes shipped and deployed for one upload bug before the real
cause — signed `x-amz-meta-*` baked into a presigned PUT — was found by reproducing the exact failing
request. 2026-08-02: line 1 of a two-line secret was read and the credential store declared broken.
Five plans hit the same OCC section and it still showed false data.
