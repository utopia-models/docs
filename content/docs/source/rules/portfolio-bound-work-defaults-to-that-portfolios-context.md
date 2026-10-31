---
title: "A plan's recorded `portfolio:` field is a read-scope instruction, not routing metadata"
description: "Mirrored from the fleet knowledge base: _rules/portfolio-bound-work-defaults-to-that-portfolios-context.md"
updated: 2026-10-22
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/portfolio-bound-work-defaults-to-that-portfolios-context.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: portfolio-bound-work-defaults-to-that-portfolios-context
cases: [2026-09-19-a-bound-portfolio-is-a-default-read-scope-not-a-label, 2026-10-03-portfolio-context-is-not-memory, 2026-10-06-an-attachment-with-no-words-gets-one-question, 2026-10-22-project-scope-is-a-property-of-the-session-not-a-rule-i-read]
status: active
audience: agent
last-recurrence: 2026-10-22
```

# A plan's recorded `portfolio:` field is a read-scope instruction, not routing metadata

## Fires when
work is bound to a plan with a `portfolio:` field set (every plan, via `/plan-start`
Q2) and I am about to read, reason about, or act on files/context from a DIFFERENT portfolio — or when
I catch myself pulling in ambient fleet-wide context instead of that portfolio's own docs first.

## The rule

🔴 **Reading discipline cannot enforce scope over what is already loaded** (2026-10-22): the session carried 78.8 KB of mixed always-on text, including other projects' memory lines and hook output, before the plan bound. If asked what other projects are in my context, answer from the loaded text and say so; the structural fix is PLAN-405 (shared floor plus one project file), not more care in what I read.

Default every read to the bound plan's own portfolio: its `README.md`, `components/`, `decisions/`,
recent plan/issue history — before reaching for fleet-wide context. Touching another portfolio is the
rare exception and must be named explicitly, in the same turn, as a deliberate cross-portfolio step —
never done silently and left for Tyler to notice. No PreToolUse gate enforces this; it is a discipline,
same class as reading `organization.yaml` before reporting an infrastructure fact.

## Cost when it fired

PLAN-313 (bound `wi`) and PLAN-311 (bound `net`, paused) were worked in the same session with no
explicit switching signal — `net`'s files were read and reasoned about mid-`wi`-plan without ever
framing it as the cross-portfolio exception. Tyler named the pattern unprompted: "context assembly is
very weak... I would also like for you to have context ONLY of the portfolio we are working on."
