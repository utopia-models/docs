---
title: "A skill or rule lives in its owner's folder, and a side-effect skill never fires unasked."
description: "Mirrored from the fleet knowledge base: _rules/a-skill-belongs-to-the-agent-that-owns-it.md"
updated: 2026-08-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/a-skill-belongs-to-the-agent-that-owns-it.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: a-skill-belongs-to-the-agent-that-owns-it
cases: [2026-07-01-agent-1000xagent-only-global, 2026-07-01-agent-claude-folder-is-yours, 2026-07-01-agent-context-first-skills, 2026-07-01-agent-house-vocabulary, 2026-07-01-agent-skills-three-layer-thesis]
status: active
mechanism: pretooluse: a Write to a skills/ path outside the owning agent directory
audience: agent
last-recurrence: 2026-07-01
```

# A skill or rule lives in its owner's folder, and a side-effect skill never fires unasked.

## Fires when
Creating a skill, command or rule — deciding where it goes, who may invoke it, and what it does before
its first write.

## The rule
`~/.claude/` on a box belongs to that agent; a project agent's skills, commands and rules never live
there. A skill touching more than one file loads context and shows a status table before any write, and
`AskUserQuestion` is never step 1. Side-effect skills set `disable-model-invocation`. Use the house
verbs — audit (read-only), self-enhance (autonomous), update/fix (scoped).

## Cost when it fired
Five separate placement and scoping corrections. Tyler names the possessor deliberately — *"audit your
.claude/"* — because the folder is the agent's.
