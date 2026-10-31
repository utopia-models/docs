---
title: "When Tyler is talking, absorb. A tool call mid-briefing is not listening."
description: "Mirrored from the fleet knowledge base: _rules/when-tyler-is-talking-stop-executing.md"
updated: 2026-08-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/when-tyler-is-talking-stop-executing.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: when-tyler-is-talking-stop-executing
cases: [2026-07-01-agent-briefing-mode-pacing, 2026-07-01-cloud-brand-gen-cadence, 2026-07-01-cloud-reject-means-stop-not-pace, 2026-07-14-stop-verifying-aggregate-all-masters]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-07-14
```

# When Tyler is talking, absorb. A tool call mid-briefing is not listening.

## Fires when
Tyler is briefing, thinking out loud, or has just said stop or rejected a tool call — and a "let me
just verify" call is forming. Also mid-way through an autonomous generation batch.

## The rule
Stop instantly, with no verifying call first, and no plan-approval request mid-briefing. A rejected
generation is a stop, not a pacing note: the next automated re-poke is not permission to resume. In
autonomous generation, checkpoint after a batch rather than blasting batch after batch.

## Cost when it fired
2026-07-14: *"NO DO NOT VERIFY, AGGREGATE ALL PROBLEMS ALL MASTER AGENTS NEED TO BE ON THIS. STOP WHAT
YOU ARE FUCKING DOING!!!!"* — said while verify-subagents were being spawned mid-conversation, twice in
a row.
